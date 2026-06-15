# AuraBuy Migration Report

## Executive Summary

The Spring Boot + PostgreSQL backend has been migrated to **Node.js + Express + MongoDB Atlas** while preserving full compatibility with the existing **React frontend** and **FastAPI API Gateway**.

| Layer | Before | After |
|-------|--------|-------|
| Backend | Spring Boot (Java 17) | Node.js 18+ / Express 4 |
| Database | PostgreSQL + JPA/Hibernate | MongoDB Atlas + Mongoose |
| Auth | JWT generated, not enforced | JWT + bcrypt + RBAC enforced |
| Port | 8081 | 8081 (unchanged) |
| Gateway | FastAPI :8000 → :8081 | Unchanged |

---

## Original Architecture Analysis

### Folder Structure (Spring Boot)

```
Backend/src/main/java/com/example/demo/
├── controller/   Auth, User, Product, Category, Course, Search
├── entity/       User, Product, Category, Course
├── dto/          LoginRequest (+ unused AuthRequest, AuthResponse)
├── repository/   JPA repositories
├── service/      Business logic + search
├── security/     JwtUtil, JwtAuthFilter (bypassed)
└── config/       SecurityConfig (permitAll)
```

### Entities Migrated

| PostgreSQL Table | MongoDB Collection | Key Fields |
|------------------|-------------------|------------|
| users | users | name, email, password, role |
| products | products | name, description, price, rating, category, imageUrl |
| categories | categories | categoryName (unique) |
| courses | courses | courseName, description, difficulty, category |

### Additional Collections (New)

| Collection | Purpose |
|------------|---------|
| orders | E-commerce order management |
| reviews | Product reviews (unique per user+product) |
| searchhistories | Search analytics logging |

---

## API Endpoint Mapping

Gateway receives `/api/*` and forwards to backend as `/*` (strips `/api` prefix).

| Spring Boot | Node.js | Status |
|-------------|---------|--------|
| GET /auth/test | GET /auth/test | ✅ |
| POST /auth/login | POST /auth/login | ✅ |
| POST /auth/register | POST /auth/register | ✅ |
| — | POST /auth/logout | ✅ New |
| — | POST /auth/refresh-token | ✅ New |
| — | GET /auth/profile | ✅ New |
| CRUD /users | CRUD /users | ✅ + ADMIN guard |
| CRUD /products | CRUD /products | ✅ + ADMIN write guard |
| CRUD /categories | CRUD /categories | ✅ + ADMIN write guard |
| CRUD /courses | CRUD /courses | ✅ + ADMIN write guard |
| GET /search | GET /search | ✅ Enhanced |
| — | CRUD /orders | ✅ New |
| — | CRUD /reviews | ✅ New |

---

## Authentication & Authorization Changes

### Before (Spring Boot)

- JWT generated on login with `email` subject and `role` claim
- `SecurityConfig`: all routes `permitAll()`
- `JwtAuthFilter`: passes all requests without validation

### After (Node.js)

- **Access Token**: 24h expiry, Bearer header
- **Refresh Token**: 7d expiry, httpOnly cookie
- **Password**: bcrypt (salt rounds: 10)
- **Roles**: USER, ADMIN
- **Middleware**: `authenticateUser`, `authorizeRoles`, `optionalAuthenticate`
- **Protected routes**: Admin-only writes on products/categories/courses/users; authenticated orders/reviews

### Frontend Compatibility

Login response includes both nested `{ token, user }` and flat `{ id, name, email, role }` fields so existing `AuthContext` works without changes.

---

## Search System Migration

### Before

Spring Data JPA `ContainingIgnoreCase` queries across products, courses, categories.

### After

- Regex-based case-insensitive search (Spring Boot equivalent)
- Extended: filtering, sorting, pagination, category/difficulty/price filters
- MongoDB text indexes on searchable fields
- Async search history logging

---

## Database Schema Design

See `API_DOCUMENTATION.md` for full field definitions.

### Indexes

- `users.email` — unique
- `categories.categoryName` — unique + text
- `products` — text index on name, description, category
- `courses` — text index on courseName, description, category
- `reviews` — compound unique on (user, product)

---

## Security Enhancements

| Feature | Implementation |
|---------|----------------|
| Helmet | HTTP security headers |
| Rate limiting | Global + auth-specific |
| NoSQL injection | sanitizeMiddleware strips `$` keys |
| Input validation | express-validator on all writes |
| CORS | Configurable via CORS_ORIGINS |
| JWT validation | Full enforcement on protected routes |

---

## DevOps

- `Dockerfile` — Node 18 Alpine production image
- `docker-compose.yml` — Backend service with `.env` file
- `.env.example` — Template with MongoDB Atlas URI format

---

## Testing

- `npm test` — Automated verification script (`src/utils/verify.js`)
- Postman collection — `postman/AuraBuy_API.postman_collection.json`
- See `TESTING_GUIDE.md` for manual test cases

---

## Migration Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Numeric IDs → ObjectId strings | Mongoose `toJSON` maps `_id` → `id` |
| Gateway path mismatch | Routes mounted without `/api` prefix |
| Auth not enforced in Spring | Node enforces RBAC; frontend already sends JWT |
| Empty signup token | Register unchanged; users login after signup |

---

## Default Seed Data

| Email | Password | Role |
|-------|----------|------|
| admin@aurabuy.com | admin123 | ADMIN |
| user@aurabuy.com | user123 | USER |

Run: `npm run seed`
