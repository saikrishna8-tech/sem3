# Problem Identification — AuraBuy Platform

## Problem Statement

Modern e-commerce and learning platforms store products, courses, and categories in separate systems. Users struggle to **search across multiple content types** with one query, while administrators need **secure CRUD** and **role-based control** (shopper vs admin).

## Identified Problems

| # | Problem | Impact |
|---|---------|--------|
| 1 | Fragmented search | Users cannot find products and courses in a single search |
| 2 | Weak access control | Anyone could modify catalog data without authentication |
| 3 | Tight frontend–backend coupling | UI changes require direct backend URL changes |
| 4 | No unified API entry point | Multiple services are hard to monitor and secure |
| 5 | Unstructured data storage | Inconsistent schemas slow reporting and scaling |

## Proposed Solution

**AuraBuy** — a full-stack search & commerce platform:

- **React frontend** — browse, cart, wishlist, admin dashboard
- **FastAPI gateway** — single API entry, CORS, request routing
- **Spring Boot backend** — JWT authentication, CRUD, ADMIN/USER roles
- **PostgreSQL** — normalized schema for users, products, categories, courses

## Target Users

- **USER** — browse, search, cart, wishlist
- **ADMIN** — manage products, users, categories, courses

## Success Criteria

- Login returns JWT; protected routes enforce role
- Search returns products, courses, and categories for one query
- All client traffic flows: Frontend → Gateway → Backend → PostgreSQL
