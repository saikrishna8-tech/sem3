# AuraBuy Testing Guide

## Prerequisites

- MongoDB Atlas connection configured in `.env`
- Backend running: `npm run dev` (port 8081)
- Optional: Gateway (8000) + Frontend (5173) for E2E tests

## Automated Tests

```bash
npm test
```

Runs `src/utils/verify.js` which validates:

1. MongoDB connection
2. Seeded data exists
3. Health endpoint
4. Auth test endpoint
5. User registration + duplicate prevention
6. Login + JWT token
7. Profile access with JWT
8. Role authorization (USER blocked from /users)
9. Product listing
10. Search functionality

## Postman Collection

Import `postman/AuraBuy_API.postman_collection.json`.

**Recommended flow:**
1. Login (Admin) — saves token to collection variable
2. Get All Products — copy an `id` to `productId` variable
3. Create/Update/Delete Product
4. Search with query
5. Create Order / Review

## Manual Test Cases

### Authentication Tests

| # | Test | Expected |
|---|------|----------|
| A1 | Register with valid data | 200, user returned |
| A2 | Register duplicate email | 400, "Email already exists" |
| A3 | Login valid credentials | 200, token + user |
| A4 | Login wrong password | 400, "Invalid password" |
| A5 | Login unknown email | 400, "User not found" |
| A6 | Profile without token | 401 |
| A7 | Profile with valid token | 200, user data |
| A8 | Refresh token | 200, new access token |
| A9 | Logout | 200, cookie cleared |

### Validation Tests

| # | Test | Expected |
|---|------|----------|
| V1 | Register without email | 400 validation error |
| V2 | Register password < 6 chars | 400 validation error |
| V3 | Create product without price | 400 validation error |
| V4 | Create course invalid difficulty | 400 validation error |
| V5 | Create review rating > 5 | 400 validation error |

### Role Authorization Tests

| # | Test | Expected |
|---|------|----------|
| R1 | USER creates product | 403 |
| R2 | ADMIN creates product | 201 |
| R3 | USER lists /users | 403 |
| R4 | ADMIN lists /users | 200 |
| R5 | Public GET /products | 200 (no auth) |

### MongoDB Connection Tests

| # | Test | Expected |
|---|------|----------|
| M1 | Start with valid MONGODB_URI | "Successfully connected" |
| M2 | Start with invalid URI | Retry 5x then exit |
| M3 | npm run seed on empty DB | Users, products, categories, courses created |
| M4 | npm run seed on populated DB | Skips existing collections |

### Search Tests

| # | Test | Expected |
|---|------|----------|
| S1 | GET /search (no query) | Empty arrays |
| S2 | GET /search?query=headphones | Products with "headphones" |
| S3 | GET /search?query=java | Courses matching "java" |
| S4 | GET /search?category=Electronics | Filtered products |
| S5 | GET /search?query=test&page=1&limit=5 | Paginated results |

### Frontend Compatibility Tests

| # | Test | Steps | Expected |
|---|------|-------|----------|
| F1 | Home page products | Open http://localhost:5173 | Products load |
| F2 | Admin login | admin@aurabuy.com / admin123 | Redirect to /admin |
| F3 | Admin CRUD | Create/edit/delete product | Success messages |
| F4 | Search page | Search "headphones" | Results displayed |
| F5 | User signup + login | Register new user, login | Session persisted |

## Security Tests

| # | Test | Expected |
|---|------|----------|
| SEC1 | Send `{ "$gt": "" }` in body | Sanitized, no injection |
| SEC2 | Exceed rate limit (200+ req/15min) | 429 Too Many Requests |
| SEC3 | Invalid JWT | 401 |
| SEC4 | Expired JWT | 401 |

## Docker Tests

```bash
docker-compose up --build
curl http://localhost:8081/health
```

Expected: `{ "status": "ok", "service": "aurabuy-backend-nodejs" }`
