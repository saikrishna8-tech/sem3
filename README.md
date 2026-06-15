# AuraBuy — Full Stack Search & E-Commerce Platform

Full-stack project aligned with the **5 evaluation components** (10 marks each).

| Component | Marks | Location |
|-----------|-------|----------|
| 1. Problem Identification & Frontend UI | 10 | `docs/PROBLEM_STATEMENT.md`, `Frontend/` |
| 2. API Gateway (FastAPI) | 10 | `Gateway/` |
| 3. Backend (Spring Boot, JWT, CRUD, RBAC) | 10 | `Backend/` |
| 4. Database Design (PostgreSQL) | 10 | `Database/schema.sql` |
| 5. System Integration | 10 | End-to-end flow below |

## Architecture

```
┌─────────────┐     HTTP      ┌──────────────┐     HTTP      ┌──────────────┐     JDBC      ┌────────────┐
│   React     │ ────────────► │ FastAPI      │ ────────────► │ Spring Boot  │ ────────────► │ PostgreSQL │
│  Frontend   │  :5173→:8000  │ API Gateway  │  :8000→:8080  │   Backend    │               │ search_system│
│  (Vite)     │               │  (Python)    │               │  (Java 17)   │               │            │
└─────────────┘               └──────────────┘               └──────────────┘               └────────────┘
```

## Prerequisites

- Node.js 18+
- Java 17+, Maven
- Python 3.10+
- PostgreSQL (database `search_system` — see `Database/schema.sql`)

## Quick Start

### 1. Database

```bash
psql -U postgres -f Database/schema.sql
```

Update `Backend/src/main/resources/application.properties` if your DB user/password differ.

### 2. Backend (port 8080)

```bash
cd Backend
mvn spring-boot:run
```

Default users (seeded on first run):

| Email | Password | Role |
|-------|----------|------|
| admin@aurabuy.com | admin123 | ADMIN |
| user@aurabuy.com | user123 | USER |

### 3. API Gateway (port 8000)

```bash
cd Gateway
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Docs: http://localhost:8000/docs

### 4. Frontend (port 5173)

```bash
cd Frontend
npm install
npm run dev
```

Set `Frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## API Flow (Integration)

| Action | Frontend | Gateway | Backend |
|--------|----------|---------|---------|
| Login | `POST /api/auth/login` | proxy | `POST /auth/login` → JWT |
| Products | `GET /api/products` | proxy | `GET /products` |
| Search | `GET /api/search?query=` | proxy | `GET /search?query=` |
| Admin CRUD | `POST/PUT/DELETE /api/products` | proxy | JWT + **ADMIN** role |

## Rubric Mapping

### 1. Problem & Frontend UI
- Problem analysis: `docs/PROBLEM_STATEMENT.md`
- UI: Home, Login, Signup, Cart, Admin Dashboard, search, role-based admin route

### 2. API Gateway
- FastAPI app with CORS, health check, reverse proxy to Spring Boot
- See `Gateway/main.py`

### 3. Backend
- JWT (`jjwt`), Spring Security filter chain
- CRUD: `/products`, `/users`, `/categories`, `/courses`
- RBAC: `ADMIN` vs `USER` on write operations

### 4. Database
- ERD-style tables in `Database/schema.sql`
- JPA entities mirror schema; Hibernate `ddl-auto=update`

### 5. Integration
- Frontend uses `VITE_API_BASE_URL` → Gateway → Backend → PostgreSQL
- Bearer token attached on protected requests

## Project Structure

```
Full_Stack/
├── Frontend/          # React + Vite + Tailwind
├── Gateway/           # FastAPI API Gateway
├── Backend/           # Spring Boot + JWT + JPA
├── Database/          # PostgreSQL schema
└── docs/              # Problem statement & rubric notes
```
