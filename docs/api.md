# API Specification Document

## Online Store Web Application

**Document Version:** 1.0  
**Date:** March 12, 2026  
**Base URL:** `http://localhost:3000/api`  
**Content-Type:** `application/json`  
**Authentication:** JWT Bearer Token (where required)

---

## Authentication

Protected endpoints require the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained from the login endpoint and expire after 24 hours.

---

## 1. Auth Endpoints

### POST /api/auth/register

Register a new user account.

**Auth Required:** No

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

- `400` — Name, email, or password missing
- `409` — Email already registered

---

### POST /api/auth/login

Authenticate a user and receive a JWT token.

**Auth Required:** No

**Request:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

- `400` — Email or password missing
- `401` — Invalid email or password

---

## 2. Product Endpoints

### GET /api/products

Retrieve all products.

**Auth Required:** No

**Request:** No body required.

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "price": 79.99,
    "stock": 25,
    "description": "Premium wireless headphones with noise cancellation."
  },
  {
    "id": 2,
    "name": "Smart Watch",
    "price": 199.99,
    "stock": 15,
    "description": "Feature-rich smartwatch with health tracking."
  }
]
```

---

### GET /api/products/:id

Retrieve a single product by ID.

**Auth Required:** No

**Request:** No body required.

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "Wireless Headphones",
  "price": 79.99,
  "stock": 25,
  "description": "Premium wireless headphones with noise cancellation."
}
```

**Error Responses:**

- `404` — Product not found

---

### POST /api/products

Create a new product.

**Auth Required:** Yes

**Request:**

```json
{
  "name": "Bluetooth Speaker",
  "price": 45.99,
  "stock": 40,
  "description": "Portable Bluetooth speaker with 12h battery."
}
```

**Response (201 Created):**

```json
{
  "id": 7,
  "name": "Bluetooth Speaker",
  "price": 45.99,
  "stock": 40,
  "description": "Portable Bluetooth speaker with 12h battery."
}
```

**Error Responses:**

- `400` — Name or price missing
- `401` — Authentication required

---

### PUT /api/products/:id

Update an existing product.

**Auth Required:** Yes

**Request:**

```json
{
  "name": "Bluetooth Speaker Pro",
  "price": 49.99,
  "stock": 35,
  "description": "Updated portable speaker with improved bass."
}
```

**Response (200 OK):**

```json
{
  "id": 7,
  "name": "Bluetooth Speaker Pro",
  "price": 49.99,
  "stock": 35,
  "description": "Updated portable speaker with improved bass."
}
```

**Error Responses:**

- `401` — Authentication required
- `404` — Product not found

---

## 3. Offers Endpoint

### GET /api/offers

Retrieve all active offers with product details.

**Auth Required:** No

**Request:** No body required.

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "productId": 1,
    "productName": "Wireless Headphones",
    "originalPrice": 79.99,
    "discountPercentage": 20,
    "startDate": "2026-03-01",
    "endDate": "2026-03-31"
  },
  {
    "id": 2,
    "productId": 2,
    "productName": "Smart Watch",
    "originalPrice": 199.99,
    "discountPercentage": 15,
    "startDate": "2026-03-01",
    "endDate": "2026-03-31"
  }
]
```

---

## 4. Cart Endpoints

### GET /api/cart

Retrieve the authenticated user's cart items.

**Auth Required:** Yes

**Request:** No body required.

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "productId": 1,
    "name": "Wireless Headphones",
    "price": 79.99,
    "quantity": 2
  },
  {
    "id": 2,
    "productId": 3,
    "name": "Laptop Stand",
    "price": 49.99,
    "quantity": 1
  }
]
```

**Error Responses:**

- `401` — Authentication required

---

### POST /api/cart/add

Add a product to the cart. If the product already exists in the cart, its quantity is incremented.

**Auth Required:** Yes

**Request:**

```json
{
  "productId": 1,
  "quantity": 1
}
```

> `quantity` defaults to 1 if omitted.

**Response (200 OK):** Returns the full updated cart.

```json
[
  {
    "id": 1,
    "productId": 1,
    "name": "Wireless Headphones",
    "price": 79.99,
    "quantity": 3
  },
  {
    "id": 2,
    "productId": 3,
    "name": "Laptop Stand",
    "price": 49.99,
    "quantity": 1
  }
]
```

**Error Responses:**

- `400` — productId missing
- `401` — Authentication required
- `404` — Product not found

---

### POST /api/cart/remove

Remove a product from the cart entirely.

**Auth Required:** Yes

**Request:**

```json
{
  "productId": 1
}
```

**Response (200 OK):** Returns the full updated cart (without the removed item).

```json
[
  {
    "id": 2,
    "productId": 3,
    "name": "Laptop Stand",
    "price": 49.99,
    "quantity": 1
  }
]
```

**Error Responses:**

- `400` — productId missing
- `401` — Authentication required

---

## 5. Order Endpoints

### GET /api/orders

Retrieve all orders for the authenticated user, sorted by newest first.

**Auth Required:** Yes

**Request:** No body required.

**Response (200 OK):**

```json
[
  {
    "id": 3,
    "userId": 1,
    "totalAmount": 49.99,
    "status": "Processing",
    "createdAt": "2026-03-12"
  },
  {
    "id": 2,
    "userId": 1,
    "totalAmount": 129.99,
    "status": "Shipped",
    "createdAt": "2026-03-08"
  },
  {
    "id": 1,
    "userId": 1,
    "totalAmount": 209.97,
    "status": "Delivered",
    "createdAt": "2026-03-01"
  }
]
```

**Error Responses:**

- `401` — Authentication required

---

### GET /api/orders/:id

Retrieve a single order with its line items.

**Auth Required:** Yes

**Request:** No body required.

**Response (200 OK):**

```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 209.97,
  "status": "Delivered",
  "createdAt": "2026-03-01",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Wireless Headphones",
      "quantity": 2,
      "price": 79.99
    },
    {
      "id": 2,
      "productId": 3,
      "productName": "Laptop Stand",
      "quantity": 1,
      "price": 49.99
    }
  ]
}
```

**Error Responses:**

- `401` — Authentication required
- `404` — Order not found

---

### POST /api/orders

Place a new order (checkout). This is a transactional operation that:

1. Validates stock for all items
2. Creates the order and order items
3. Reduces product stock
4. Clears the user's cart

**Auth Required:** Yes

**Request:**

```json
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

**Response (201 Created):**

```json
{
  "orderId": 4,
  "message": "Order placed successfully"
}
```

**Error Responses:**

- `400` — Items array empty, missing productId/quantity, or insufficient stock
- `401` — Authentication required
- `404` — Product not found

---

## 6. Health Check

### GET /api/health

Check if the server is running.

**Auth Required:** No

**Response (200 OK):**

```json
{
  "status": "ok",
  "timestamp": "2026-03-12T10:30:00.000Z"
}
```

---

## 7. Error Response Format

All error responses follow this format:

```json
{
  "error": "Description of the error"
}
```

**Common HTTP Status Codes:**

| Code | Meaning                                  |
| ---- | ---------------------------------------- |
| 200  | Success                                  |
| 201  | Resource created                         |
| 400  | Bad request / validation error           |
| 401  | Authentication required or invalid token |
| 404  | Resource not found                       |
| 409  | Conflict (e.g., duplicate email)         |
| 500  | Internal server error                    |

---

_Document prepared for the Online Store Workshop — March 2026_
