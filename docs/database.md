# Database Schema Document

## Online Store Web Application

**Document Version:** 1.0  
**Date:** March 12, 2026  
**Database Engine:** SQLite 3 (via better-sqlite3)  
**Mode:** WAL (Write-Ahead Logging)  
**Foreign Keys:** Enabled (`PRAGMA foreign_keys = ON`)

---

## 1. Table Definitions

### 1.1 users

Stores registered user accounts with hashed passwords.

| Column   | Type    | Constraints               | Description              |
| -------- | ------- | ------------------------- | ------------------------ |
| id       | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique user identifier   |
| name     | TEXT    | NOT NULL                  | User's display name      |
| email    | TEXT    | NOT NULL, UNIQUE          | User's email (login key) |
| password | TEXT    | NOT NULL                  | bcrypt-hashed password   |

### 1.2 products

Product catalog with pricing and stock tracking.

| Column      | Type    | Constraints               | Description               |
| ----------- | ------- | ------------------------- | ------------------------- |
| id          | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique product identifier |
| name        | TEXT    | NOT NULL                  | Product name              |
| price       | REAL    | NOT NULL                  | Unit price (USD)          |
| stock       | INTEGER | NOT NULL, DEFAULT 0       | Available stock quantity  |
| description | TEXT    |                           | Product description       |

### 1.3 offers

Promotional discounts linked to products.

| Column              | Type    | Constraints                 | Description                    |
| ------------------- | ------- | --------------------------- | ------------------------------ |
| id                  | INTEGER | PRIMARY KEY AUTOINCREMENT   | Unique offer identifier        |
| product_id          | INTEGER | NOT NULL, FK → products(id) | Associated product             |
| discount_percentage | REAL    | NOT NULL                    | Discount percentage (e.g., 20) |
| start_date          | TEXT    | NOT NULL                    | Offer start date (YYYY-MM-DD)  |
| end_date            | TEXT    | NOT NULL                    | Offer end date (YYYY-MM-DD)    |

### 1.4 cart_items

Per-user shopping cart items, stored server-side for persistence.

| Column     | Type    | Constraints                 | Description                 |
| ---------- | ------- | --------------------------- | --------------------------- |
| id         | INTEGER | PRIMARY KEY AUTOINCREMENT   | Unique cart item identifier |
| user_id    | INTEGER | NOT NULL, FK → users(id)    | Cart owner                  |
| product_id | INTEGER | NOT NULL, FK → products(id) | Product in cart             |
| quantity   | INTEGER | NOT NULL, DEFAULT 1         | Quantity of product         |

**Unique Constraint:** `UNIQUE(user_id, product_id)` — ensures one row per product per user.

### 1.5 orders

Order header with status tracking.

| Column      | Type    | Constraints                       | Description                      |
| ----------- | ------- | --------------------------------- | -------------------------------- |
| id          | INTEGER | PRIMARY KEY AUTOINCREMENT         | Unique order identifier          |
| user_id     | INTEGER | NOT NULL, FK → users(id)          | Customer who placed the order    |
| total_price | REAL    | NOT NULL                          | Order total (sum of item prices) |
| status      | TEXT    | NOT NULL, DEFAULT 'Processing'    | Processing / Shipped / Delivered |
| created_at  | TEXT    | NOT NULL, DEFAULT datetime('now') | Timestamp of order creation      |

### 1.6 order_items

Individual line items within an order.

| Column     | Type    | Constraints                 | Description                  |
| ---------- | ------- | --------------------------- | ---------------------------- |
| id         | INTEGER | PRIMARY KEY AUTOINCREMENT   | Unique order item identifier |
| order_id   | INTEGER | NOT NULL, FK → orders(id)   | Parent order                 |
| product_id | INTEGER | NOT NULL, FK → products(id) | Ordered product              |
| quantity   | INTEGER | NOT NULL                    | Quantity ordered             |
| price      | REAL    | NOT NULL                    | Unit price at time of order  |

## 2. Entity-Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │   cart_items      │       │   products   │
│──────────────│       │──────────────────│       │──────────────│
│ PK id        │──┐    │ PK id            │    ┌──│ PK id        │
│    name      │  │    │ FK user_id    ───│────┘  │    name      │
│    email     │  │    │ FK product_id ───│───────│    price     │
│    password  │  │    │    quantity       │       │    stock     │
└──────────────┘  │    └──────────────────┘       │    description│
                  │                               └──────┬───────┘
                  │                                      │
                  │    ┌──────────────────┐              │
                  │    │    offers         │              │
                  │    │──────────────────│              │
                  │    │ PK id            │              │
                  │    │ FK product_id ───│──────────────┘
                  │    │    discount_%    │              │
                  │    │    start_date    │              │
                  │    │    end_date      │              │
                  │    └──────────────────┘              │
                  │                                      │
                  │    ┌──────────────────┐              │
                  └───►│    orders         │              │
                  │    │──────────────────│              │
                  │    │ PK id            │              │
                  │    │ FK user_id       │              │
                  │    │    total_price   │              │
                  │    │    status        │              │
                  │    │    created_at    │              │
                  │    └────────┬─────────┘              │
                  │             │                        │
                  │    ┌────────▼─────────┐              │
                  │    │  order_items      │              │
                  │    │──────────────────│              │
                  │    │ PK id            │              │
                  │    │ FK order_id      │              │
                  │    │ FK product_id ───│──────────────┘
                  │    │    quantity       │
                  │    │    price          │
                  │    └──────────────────┘

Relationships:
  users     1 ──── N  cart_items    (A user has many cart items)
  users     1 ──── N  orders        (A user has many orders)
  products  1 ──── N  cart_items    (A product appears in many carts)
  products  1 ──── N  offers        (A product can have many offers)
  products  1 ──── N  order_items   (A product appears in many order items)
  orders    1 ──── N  order_items   (An order has many line items)
```

## 3. Relationships Summary

| Parent Table | Child Table | Relationship | Foreign Key                          |
| ------------ | ----------- | ------------ | ------------------------------------ |
| users        | cart_items  | 1 : N        | cart_items.user_id → users.id        |
| users        | orders      | 1 : N        | orders.user_id → users.id            |
| products     | cart_items  | 1 : N        | cart_items.product_id → products.id  |
| products     | offers      | 1 : N        | offers.product_id → products.id      |
| products     | order_items | 1 : N        | order_items.product_id → products.id |
| orders       | order_items | 1 : N        | order_items.order_id → orders.id     |

## 4. Seed Data

The seed script (`server/db/seed.js`) populates the database with sample data:

**Users (3):**

| Name       | Email             | Password (plain) |
| ---------- | ----------------- | ---------------- |
| John Doe   | john@example.com  | password123      |
| Jane Smith | jane@example.com  | password123      |
| Admin User | admin@example.com | password123      |

**Products (6):**

| Name                | Price   | Stock | Description                                      |
| ------------------- | ------- | ----- | ------------------------------------------------ |
| Wireless Headphones | $79.99  | 25    | Premium wireless headphones with noise cancel.   |
| Smart Watch         | $199.99 | 15    | Feature-rich smartwatch with health tracking.    |
| Laptop Stand        | $49.99  | 50    | Ergonomic aluminum laptop stand.                 |
| USB-C Hub           | $34.99  | 0     | 7-in-1 USB-C hub with HDMI output.               |
| Mechanical Keyboard | $129.99 | 30    | RGB mechanical keyboard with Cherry MX switches. |
| Webcam HD           | $59.99  | 20    | 1080p HD webcam with built-in microphone.        |

**Offers (3):**

| Product             | Discount | Validity                 |
| ------------------- | -------- | ------------------------ |
| Wireless Headphones | 20%      | 2026-03-01 to 2026-03-31 |
| Smart Watch         | 15%      | 2026-03-01 to 2026-03-31 |
| Laptop Stand        | 10%      | 2026-03-10 to 2026-04-10 |

**Sample Orders (3, for user John Doe):**

| Order | Total   | Status     | Date       |
| ----- | ------- | ---------- | ---------- |
| #1    | $209.97 | Delivered  | 2026-03-01 |
| #2    | $129.99 | Shipped    | 2026-03-08 |
| #3    | $49.99  | Processing | 2026-03-12 |

## 5. Database Configuration

```javascript
// WAL mode for better read concurrency
db.pragma("journal_mode = WAL");

// Enforce foreign key constraints
db.pragma("foreign_keys = ON");
```

**File Location:** `server/ecommerce.db`  
**Driver:** better-sqlite3 (synchronous, no async overhead)

---

_Document prepared for the Online Store Workshop — March 2026_
