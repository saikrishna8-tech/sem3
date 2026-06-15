# AuraBuy Node.js Backend

Production-ready Node.js backend migrated from Spring Boot + PostgreSQL to Express + MongoDB Atlas.

## Stack

- Node.js 18+, Express 4, Mongoose 8
- MongoDB Atlas (`aurabuy_db`)
- JWT + bcrypt authentication
- Helmet, CORS, rate limiting, input validation

## Quick Start

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB Atlas credentials

npm install
npm run seed    # Seed default users & sample data
npm run dev     # Start with nodemon on port 8081
```

### Full Stack (with existing frontend + gateway)

1. **Backend** — `npm run dev` (port 8081)
2. **Gateway** — `cd Full_Stack/Gateway && uvicorn main:app --port 8000`
3. **Frontend** — `cd Full_Stack/Frontend && npm run dev` (port 5173)

Frontend calls `http://localhost:8000/api/*` → Gateway proxies to `http://localhost:8081/*`.

## Project Structure

```
backend/
├── src/
│   ├── config/          db.js, jwt.js
│   ├── constants/       roles, orderStatus, difficulty
│   ├── controllers/     Route handlers
│   ├── middleware/      auth, error, rate limit, sanitize
│   ├── models/          Mongoose schemas
│   ├── routes/          Express routers
│   ├── services/        Business logic (search)
│   ├── validators/      express-validator rules
│   ├── utils/           ApiError, asyncHandler, seed, verify
│   └── app.js
├── server.js
├── postman/             Postman collection
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8081) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Access token signing secret |
| `JWT_EXPIRATION` | Access token expiry (default: 24h) |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `JWT_REFRESH_EXPIRATION` | Refresh token expiry (default: 7d) |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `NODE_ENV` | development / production |

## MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create database user with read/write permissions
3. Add your IP to Network Access (or `0.0.0.0/0` for dev)
4. Copy connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/aurabuy_db?retryWrites=true&w=majority
```

5. Replace `<username>`, `<password>`, and cluster hostname

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | — | Health check |
| GET | /auth/test | — | Auth health |
| POST | /auth/register | — | Register user |
| POST | /auth/login | — | Login, get JWT |
| POST | /auth/logout | — | Clear refresh cookie |
| POST | /auth/refresh-token | Cookie/body | Refresh access token |
| GET | /auth/profile | JWT | Current user profile |
| GET/POST/PUT/DELETE | /products | Admin for writes | Product CRUD |
| GET/POST/PUT/DELETE | /categories | Admin for writes | Category CRUD |
| GET/POST/PUT/DELETE | /courses | Admin for writes | Course CRUD |
| GET/POST/PUT/DELETE | /users | Admin | User CRUD |
| GET | /search | Optional JWT | Multi-entity search |
| GET/POST/PUT/DELETE | /orders | JWT | Order management |
| GET/POST/PUT/DELETE | /reviews | JWT | Review management |

Full API docs: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Production start |
| `npm run dev` | Development with nodemon |
| `npm run seed` | Seed database |
| `npm test` | Run automated API tests |

## Docker

```bash
docker-compose up --build
```

## Default Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@aurabuy.com | admin123 | ADMIN |
| user@aurabuy.com | user123 | USER |

## Documentation

- [MIGRATION_REPORT.md](./MIGRATION_REPORT.md) — Migration analysis
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) — Full API reference
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) — Test cases
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) — Production deployment
- [postman/AuraBuy_API.postman_collection.json](./postman/AuraBuy_API.postman_collection.json)
