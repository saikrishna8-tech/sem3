# AuraBuy API Documentation

Base URL (direct): `http://localhost:8081`  
Via Gateway: `http://localhost:8000/api`

All JSON responses use camelCase. Entity IDs are MongoDB ObjectId strings exposed as `id`.

---

## Authentication

### POST /auth/register

Register a new user.

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "USER"
}
```

**Response (200):**
```json
{
  "id": "...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "USER",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Errors:** `400 Email already exists`

---

### POST /auth/login

**Body:**
```json
{ "email": "user@aurabuy.com", "password": "user123" }
```

**Response (200):**
```json
{
  "token": "eyJ...",
  "user": { "id": "...", "name": "...", "email": "...", "role": "USER" },
  "id": "...",
  "name": "...",
  "email": "...",
  "role": "USER"
}
```

**Errors:** `400 User not found`, `400 Invalid password`

---

### POST /auth/refresh-token

Uses httpOnly `refreshToken` cookie or body `{ "refreshToken": "..." }`.

**Response (200):**
```json
{ "token": "new_access_token", "refreshToken": "new_refresh_token" }
```

---

### POST /auth/logout

Clears refresh token cookie.

**Response (200):**
```json
{ "message": "Successfully logged out." }
```

---

### GET /auth/profile

**Headers:** `Authorization: Bearer <token>`

**Response (200):** User object (password omitted)

---

## Products

### GET /products

Returns array of products. Public.

### GET /products/:id

Returns single product or 404.

### POST /products (ADMIN)

**Body:**
```json
{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "rating": 4.5,
  "category": "Electronics",
  "imageUrl": "https://example.com/image.jpg"
}
```

### PUT /products/:id (ADMIN)

Partial or full update. Same body shape as create.

### DELETE /products/:id (ADMIN)

**Response:** `{ "message": "Product deleted successfully" }`

---

## Categories

**Schema:** `{ "categoryName": "Electronics" }`

Same CRUD pattern as products. Writes require ADMIN role.

---

## Courses

**Schema:**
```json
{
  "courseName": "Node.js Basics",
  "description": "Learn Node.js",
  "difficulty": "Beginner",
  "category": "Programming"
}
```

`difficulty` enum: `Beginner`, `Intermediate`, `Advanced`

---

## Users (ADMIN only)

All routes require ADMIN JWT.

**Schema:**
```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

---

## Search

### GET /search

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| query | string | Keyword search |
| category | string | Filter by category |
| minPrice | number | Min product price |
| maxPrice | number | Max product price |
| difficulty | string | Course difficulty filter |
| sortBy | string | Sort field |
| sortOrder | asc/desc | Sort direction |
| page | number | Page number (default: 1) |
| limit | number | Results per entity (default: 20) |

**Response:**
```json
{
  "products": [ /* Product[] */ ],
  "courses": [ /* Course[] */ ],
  "categories": [ /* Category[] */ ]
}
```

Empty query returns three empty arrays.

---

## Orders (Authenticated)

### POST /orders

**Body:**
```json
{
  "items": [
    { "product": "<productId>", "quantity": 2 }
  ]
}
```

### GET /orders

- USER: own orders only
- ADMIN: all orders

### PUT /orders/:id (ADMIN)

Update order status: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

---

## Reviews (Authenticated for writes)

### POST /reviews

**Body:**
```json
{
  "product": "<productId>",
  "rating": 5,
  "comment": "Great product!"
}
```

One review per user per product (unique constraint).

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

HTTP status codes: 400 (validation), 401 (auth), 403 (forbidden), 404 (not found), 429 (rate limit), 500 (server)

---

## MongoDB Collections

### users
- name, email (unique), password (hashed), role (USER|ADMIN)
- timestamps, email index

### products
- name, description, price, rating, category, imageUrl
- text index on name, description, category

### categories
- categoryName (unique)
- text index

### courses
- courseName, description, difficulty, category
- text index

### orders
- user (ref), items[{ product, quantity, price }], totalAmount, status
- user index

### reviews
- user (ref), product (ref), rating (1-5), comment
- compound unique (user, product)

### searchhistories
- user (ref, optional), query, resultsCount
- query index
