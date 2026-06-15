# Evaluation Rubric Checklist

Use this when demonstrating the project to your evaluator.

## 1. Problem Identification & Frontend UI (10 Marks)

- [ ] `docs/PROBLEM_STATEMENT.md` — problem, users, success criteria
- [ ] React UI: Home, Login, Signup, Cart, Search, Admin Dashboard
- [ ] Role-based UI: Admin menu only for `ADMIN` role

**Demo:** Open http://localhost:5173, show pages and problem doc.

## 2. API Gateway — FastAPI (10 Marks)

- [ ] `Gateway/main.py` — CORS, `/health`, `/api/*` proxy to Spring Boot
- [ ] Swagger: http://localhost:8000/docs

**Demo:** `curl http://localhost:8000/health` and `curl http://localhost:8000/api/products`

## 3. Backend — Spring Boot (10 Marks)

- [ ] JWT: `AuthController`, `JwtUtil`, `JwtAuthFilter`
- [ ] CRUD: products, users, categories, courses controllers
- [ ] RBAC: `SecurityConfig` — ADMIN for writes, public GET for catalog/search

**Demo:** Login via gateway → receive token → POST product with Bearer token as ADMIN.

## 4. Database Design — PostgreSQL (10 Marks)

- [ ] `Database/schema.sql` — tables, constraints, indexes
- [ ] JPA entities match schema; `application.properties` points to `search_system`

**Demo:** Show tables in pgAdmin or `\dt` in psql.

## 5. System Integration (10 Marks)

- [ ] Frontend `.env` → Gateway `:8000` → Backend `:8080` → PostgreSQL
- [ ] Login stores JWT; API calls include `Authorization: Bearer`
- [ ] Search and product list hit live backend data

**Demo:** Full flow — login as user → search → login as admin → add/delete product.
