# AuraBuy Production Deployment Guide

## 1. MongoDB Atlas

1. Create production cluster (M10+ recommended for production workloads)
2. Create dedicated database user with least-privilege (readWrite on `aurabuy_db` only)
3. Restrict Network Access to your server IP(s)
4. Enable backup and monitoring
5. Connection string:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/aurabuy_db?retryWrites=true&w=majority
```

## 2. Environment Configuration

Copy `.env.example` to `.env` on the server:

```env
PORT=8081
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<generate-64-char-random-string>
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=<generate-different-64-char-random-string>
JWT_REFRESH_EXPIRATION=7d
CORS_ORIGINS=https://your-frontend-domain.com
NODE_ENV=production
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 3. Docker Deployment

```bash
# Build and run
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Health check
curl http://localhost:8081/health
```

## 4. Manual Node.js Deployment

```bash
# On server
git clone <repo>
cd nodejs/backend
npm ci --only=production
npm run seed
npm start
```

### PM2 (recommended)

```bash
npm install -g pm2
pm2 start server.js --name aurabuy-backend
pm2 save
pm2 startup
```

## 5. Reverse Proxy (Nginx)

```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 6. Full Stack Deployment

| Service | Port | Notes |
|---------|------|-------|
| Node.js Backend | 8081 | Internal only |
| FastAPI Gateway | 8000 | Public-facing `/api` |
| React Frontend | 443 | Static build via Nginx |

Update Gateway `.env`:
```
BACKEND_URL=http://localhost:8081
CORS_ORIGINS=https://your-frontend-domain.com
```

Update Frontend `.env`:
```
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## 7. Pre-Deployment Checklist

- [ ] Strong JWT secrets configured
- [ ] MongoDB Atlas IP whitelist set
- [ ] CORS_ORIGINS restricted to production domains
- [ ] NODE_ENV=production
- [ ] Database seeded with admin user
- [ ] Health endpoint responding
- [ ] SSL/TLS enabled on public endpoints
- [ ] Rate limiting acceptable for traffic
- [ ] Monitoring and logging configured
- [ ] Backups enabled on Atlas

## 8. Post-Deployment Verification

```bash
curl https://api.yourdomain.com/api/health
curl https://api.yourdomain.com/api/products
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aurabuy.com","password":"admin123"}'
```

## 9. Rollback

If issues occur, revert Gateway `BACKEND_URL` to Spring Boot instance on port 8081 while Node.js issues are resolved.
