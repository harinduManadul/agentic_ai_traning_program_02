# System Design Document

## Online Store Web Application

**Document Version:** 1.0  
**Date:** March 12, 2026  
**Prepared by:** Workshop Team

---

## 1. System Architecture

The application follows a **three-tier architecture** with clear separation between presentation, business logic, and data storage layers.

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │            Frontend (React + Vite)                 │  │
│  │                                                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │  │
│  │  │  Pages   │  │Components│  │ Context API    │    │  │
│  │  │ Login    │  │ Navbar   │  │ AuthContext    │    │  │
│  │  │ Dashboard│  │ Sidebar  │  │ CartContext    │    │  │
│  │  │ Products │  │ Product  │  │               │    │  │
│  │  │ Offers   │  │   Card   │  └───────┬───────┘    │  │
│  │  │ Cart     │  │ CartItem │          │            │  │
│  │  │ Orders   │  │ Order    │          │            │  │
│  │  │          │  │  Status  │          │            │  │
│  │  └────┬─────┘  └──────────┘          │            │  │
│  │       │                              │            │  │
│  │       └──────────┬───────────────────┘            │  │
│  │                  ▼                                │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │         API Service Layer (api.ts)         │   │  │
│  │  │  fetch() + JWT Bearer Token + JSON         │   │  │
│  │  └──────────────────┬─────────────────────────┘   │  │
│  └─────────────────────┼─────────────────────────────┘  │
│                        │ HTTP/JSON                       │
└────────────────────────┼────────────────────────────────┘
                         │
                    Port 5173 → Port 3000 (CORS)
                         │
┌────────────────────────┼────────────────────────────────┐
│                  SERVER (Node.js)                        │
│                        │                                │
│  ┌─────────────────────▼─────────────────────────────┐  │
│  │            Express.js Application                 │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │          Middleware Pipeline                 │  │  │
│  │  │  CORS → JSON Parser → Route Matching        │  │  │
│  │  │                    → JWT Auth (protected)    │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  ┌───────────┬───────────┬──────────┬──────────┐  │  │
│  │  │ /api/auth │/api/      │/api/     │/api/     │  │  │
│  │  │ routes    │products   │offers    │cart      │  │  │
│  │  │           │routes     │routes    │routes    │  │  │
│  │  └───────────┴───────────┴──────────┴──────────┘  │  │
│  │  ┌────────────────────┐                           │  │
│  │  │ /api/orders routes │                           │  │
│  │  └────────┬───────────┘                           │  │
│  │           │                                       │  │
│  └───────────┼───────────────────────────────────────┘  │
│              │                                          │
│  ┌───────────▼───────────────────────────────────────┐  │
│  │          SQLite Database (better-sqlite3)         │  │
│  │          ecommerce.db  |  WAL mode  |  FK ON      │  │
│  │                                                   │  │
│  │  ┌────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐ │  │
│  │  │ users  │ │ products │ │ offers │ │cart_items│ │  │
│  │  └────────┘ └──────────┘ └────────┘ └──────────┘ │  │
│  │  ┌────────┐ ┌────────────┐                        │  │
│  │  │ orders │ │order_items │                        │  │
│  │  └────────┘ └────────────┘                        │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### High-Level Data Flow

```
Frontend (React)
       ↓
  API Service Layer (fetch + JWT)
       ↓
  Backend REST API (Node + Express)
       ↓
  SQLite Database
```

## 2. Module Design

### 2.1 Authentication Module

**Purpose:** Manage user login, token issuance, and session lifecycle.

**Frontend Components:**

- `AuthContext.tsx` — React Context providing `login()`, `logout()`, `user`, `token`, and `isAuthenticated` state
- `Login.tsx` — Login form page with email/password fields, error display, and loading state

**Backend Components:**

- `routes/auth.js` — POST `/api/auth/login` and POST `/api/auth/register`
- `middleware/auth.js` — JWT verification middleware (`authenticate`), token signing helper (`signToken`)

**Flow:**

```
Login Page → AuthContext.login(email, password)
  → POST /api/auth/login
    → Validate credentials (bcrypt compare)
    → Issue JWT token (24h expiry)
  → Store token + user in localStorage
  → Navigate to Dashboard
```

**Logout Flow:**

```
Sidebar Logout button → AuthContext.logout()
  → Clear localStorage (token + user)
  → Navigate to Login page
```

### 2.2 Product Catalog Module

**Purpose:** Display available products for browsing and purchase.

**Frontend Components:**

- `Products.tsx` — Page that fetches and displays products in a grid
- `ProductCard.tsx` — Card component showing product details with Add to Cart button

**Backend Components:**

- `routes/products.js` — GET `/api/products`, GET `/api/products/:id`, POST `/api/products`, PUT `/api/products/:id`

**Flow:**

```
Products Page loads → useEffect → productApi.getAll()
  → GET /api/products
    → SELECT * FROM products
  → Render ProductCard grid
  → User clicks "Add to Cart" → CartContext.addToCart()
```

### 2.3 Offers Module

**Purpose:** Display promotional discounts and allow adding discounted items to the cart.

**Frontend Components:**

- `Offers.tsx` — Page that fetches offers and displays discount cards with calculated sale prices

**Backend Components:**

- `routes/offers.js` — GET `/api/offers` (JOINs offers with products)

**Flow:**

```
Offers Page loads → useEffect → offerApi.getAll()
  → GET /api/offers
    → SELECT offers JOIN products (get name, price, discount)
  → Calculate discounted price: originalPrice × (1 - discountPercentage / 100)
  → Render offer cards with badge, prices, validity dates
  → User clicks "Add to Cart" → addToCart at sale price
```

### 2.4 Cart Module

**Purpose:** Manage the shopping cart with backend persistence and optimistic UI updates.

**Frontend Components:**

- `CartContext.tsx` — Context providing `items`, `addToCart()`, `updateQuantity()`, `removeItem()`, `checkout()`, `total`
- `Cart.tsx` — Cart page with item list, quantity controls, total display, and checkout button
- `CartItem.tsx` — Individual cart item row with +/- quantity controls and remove button

**Backend Components:**

- `routes/cart.js` — GET `/api/cart`, POST `/api/cart/add`, POST `/api/cart/remove` (all authenticated)

**Architecture — Hybrid Optimistic Updates:**

```
User clicks "Add to Cart"
  → Optimistic update: setItems() locally (instant UI feedback)
  → Async: cartApi.addToCart(productId)
    → POST /api/cart/add → Upsert cart_items row
    → Response: full cart items array
  → Reconcile: setItems(serverResponse)
```

**Cart Fetch on Login:**

```
isAuthenticated changes to true → useEffect triggers
  → cartApi.getCart()
    → GET /api/cart → SELECT cart_items JOIN products
  → setItems(serverCart)
```

### 2.5 Order Management Module

**Purpose:** Place orders, process checkout, and track order history.

**Frontend Components:**

- `Cart.tsx` — Checkout button triggers order creation; displays confirmation
- `Orders.tsx` — Page showing order history with status badges
- `OrderStatus.tsx` — Visual badge component for Processing/Shipped/Delivered

**Backend Components:**

- `routes/orders.js` — GET `/api/orders`, GET `/api/orders/:id`, POST `/api/orders`

**Checkout Flow (Transactional):**

```
User clicks "Proceed to Checkout"
  → CartContext.checkout()
    → POST /api/orders { items: [{ productId, quantity }] }
      → BEGIN TRANSACTION
        → Validate all products exist and have stock
        → Calculate total: Σ(price × quantity)
        → INSERT INTO orders (user_id, total_price, status='Processing')
        → For each item:
            → INSERT INTO order_items
            → UPDATE products SET stock = stock - quantity
        → DELETE FROM cart_items WHERE user_id = ?
      → COMMIT
    → Response: { orderId, message }
  → Display order confirmation with link to Orders page
```

**Order Tracking Flow:**

```
Orders Page loads → useEffect → orderApi.getAll()
  → GET /api/orders
    → SELECT orders WHERE user_id = ? ORDER BY created_at DESC
  → Render order cards with status badges
```

## 3. Component Architecture

```
App.tsx
├── BrowserRouter
│   ├── AuthProvider (AuthContext)
│   │   ├── CartProvider (CartContext)
│   │   │   ├── Routes
│   │   │   │   ├── /login → Login
│   │   │   │   ├── /dashboard → AppLayout > Dashboard
│   │   │   │   ├── /products → AppLayout > Products
│   │   │   │   │                              └── ProductCard (×N)
│   │   │   │   ├── /offers → AppLayout > Offers
│   │   │   │   ├── /cart → AppLayout > Cart
│   │   │   │   │                        └── CartItem (×N)
│   │   │   │   ├── /orders → AppLayout > Orders
│   │   │   │   │                          └── OrderStatus (×N)
│   │   │   │   └── /* → Navigate to /dashboard
│   │   │   │
│   │   │   └── AppLayout
│   │   │       ├── Sidebar (NavLink navigation + logout)
│   │   │       ├── Navbar (user display)
│   │   │       └── <main> (page content)
```

## 4. Security Considerations

| Concern             | Implementation                                                    |
| ------------------- | ----------------------------------------------------------------- |
| Password Storage    | bcryptjs with 10 salt rounds — never stored in plain text         |
| Authentication      | JWT with 24-hour expiry, sent as Bearer token                     |
| Authorization       | Auth middleware validates token before accessing protected routes |
| CORS                | Restricted to `http://localhost:5173` only                        |
| Input Validation    | Server-side validation on all endpoints (required fields, types)  |
| SQL Injection       | Parameterized queries via better-sqlite3 prepared statements      |
| Atomic Transactions | Order creation uses SQLite transactions for data integrity        |
| Foreign Keys        | Enforced at database level (`PRAGMA foreign_keys = ON`)           |

## 5. Technology Integration Points

| Integration        | Mechanism                                                            |
| ------------------ | -------------------------------------------------------------------- |
| Frontend → Backend | HTTP fetch over REST (JSON), CORS-enabled                            |
| Auth Token Flow    | JWT issued on login → stored in localStorage → sent as Bearer header |
| Cart Sync          | Optimistic UI + async backend reconciliation                         |
| Database Access    | Synchronous better-sqlite3 (no callback/promise overhead)            |
| Type Safety        | TypeScript interfaces (types.ts) mirror backend response shapes      |

---

_Document prepared for the Online Store Workshop — March 2026_
