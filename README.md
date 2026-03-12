# Online Store Web Application

## Project Overview

The **Online Store Web Application** is a full-stack prototype built during a 90-minute development workshop. It demonstrates a complete online shopping workflow — from user authentication and product browsing through cart management, checkout, and order tracking — using a modern React frontend backed by a Node.js REST API and SQLite database.

## Features

- **User Authentication** — Login / Logout with JWT-based session management
- **Product Catalog** — Browse products with stock availability indicators
- **Offers & Promotions** — View active discounts with calculated sale prices
- **Shopping Cart** — Add, update quantity, remove items with optimistic UI updates
- **Checkout** — Place orders with server-side stock validation and transactional processing
- **Order Tracking** — View order history with status tracking (Processing → Shipped → Delivered)
- **Side Navigation** — Persistent sidebar menu for quick access to all sections
- **REST API Backend** — Fully documented API with authentication middleware
- **Basic Product Management** — Create and update products via authenticated API endpoints

## Technology Stack

| Layer     | Technology                                   |
| --------- | -------------------------------------------- |
| Frontend  | React 19, TypeScript, Vite 7, React Router 7 |
| Backend   | Node.js, Express 5                           |
| Database  | SQLite (better-sqlite3)                      |
| Auth      | JWT (jsonwebtoken), bcryptjs                 |
| Testing   | Vitest, React Testing Library, jsdom         |
| Linting   | ESLint 9, typescript-eslint                  |
| Dev Tools | Nodemon, Vite HMR                            |

## System Architecture Overview

```
┌─────────────────────────────┐
│    Frontend (React + Vite)  │   Port 5173
│    React Router SPA         │
│    Context API (Auth, Cart) │
└──────────┬──────────────────┘
           │  HTTP / JSON (fetch)
           ▼
┌─────────────────────────────┐
│  Backend REST API           │   Port 3000
│  Node.js + Express          │
│  JWT Auth Middleware         │
└──────────┬──────────────────┘
           │  SQL (better-sqlite3)
           ▼
┌─────────────────────────────┐
│  SQLite Database            │
│  ecommerce.db (WAL mode)    │
│  6 tables, FK constraints   │
└─────────────────────────────┘
```

## Project Folder Structure

```
online-store/
├── .github/
│   └── copilot-instructions.md
├── ecommerce-app/                 # Frontend (React + Vite + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── CartItem.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── OrderStatus.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── context/               # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── lib/
│   │   │   └── helpers.ts         # Utility functions
│   │   ├── pages/                 # Route page components
│   │   │   ├── Cart.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Offers.tsx
│   │   │   ├── Orders.tsx
│   │   │   └── Products.tsx
│   │   ├── services/
│   │   │   └── api.ts             # Centralized API service layer
│   │   ├── test/
│   │   │   └── setup.ts
│   │   ├── App.tsx                # Root app with routing
│   │   ├── App.css                # Global styles
│   │   ├── main.tsx               # Entry point
│   │   └── types.ts               # Shared TypeScript interfaces
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                        # Backend (Node.js + Express)
│   ├── db/
│   │   ├── database.js            # SQLite connection & schema init
│   │   └── seed.js                # Sample data seeder
│   ├── middleware/
│   │   └── auth.js                # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js                # Login / Register endpoints
│   │   ├── cart.js                # Cart CRUD endpoints
│   │   ├── offers.js              # Offers listing endpoint
│   │   ├── orders.js              # Order placement & history
│   │   └── products.js            # Product CRUD endpoints
│   ├── index.js                   # Express server entry point
│   └── package.json
├── docs/                          # Project documentation
├── package.json                   # Root workspace config
└── README.md
```

## Installation Guide

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### 1. Clone the Repository

```bash
git clone <repository-url>
cd online-store
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Seed the Database

```bash
npm run seed
```

This creates `ecommerce.db` with sample users, products, offers, and orders.

**Default test accounts:**

| Email             | Password    |
| ----------------- | ----------- |
| john@example.com  | password123 |
| jane@example.com  | password123 |
| admin@example.com | password123 |

### 4. Install Frontend Dependencies

```bash
cd ../ecommerce-app
npm install
```

## Running the Application

### Start the Backend Server

```bash
# From the project root
npm start
# Or from server/
cd server
node index.js
```

The API server starts at **http://localhost:3000**.

### Start the Frontend Development Server

```bash
# From ecommerce-app/
cd ecommerce-app
npm run dev
```

The frontend starts at **http://localhost:5173**.

### Run Both Together (from project root)

```bash
# Terminal 1 — Backend
npm start

# Terminal 2 — Frontend
cd ecommerce-app
npm run dev
```

### Build for Production

```bash
cd ecommerce-app
npm run build
```

Output is placed in `ecommerce-app/dist/`.

### Run Tests

```bash
cd ecommerce-app
npm run test:run
```

### Lint

```bash
cd ecommerce-app
npm run lint
```

## API Endpoints

| Method | Endpoint           | Auth     | Description                 |
| ------ | ------------------ | -------- | --------------------------- |
| POST   | /api/auth/register | No       | Register a new user         |
| POST   | /api/auth/login    | No       | Login and receive JWT token |
| GET    | /api/products      | No       | List all products           |
| GET    | /api/products/:id  | No       | Get product by ID           |
| POST   | /api/products      | Required | Create a new product        |
| PUT    | /api/products/:id  | Required | Update a product            |
| GET    | /api/offers        | No       | List all active offers      |
| GET    | /api/cart          | Required | Get user's cart items       |
| POST   | /api/cart/add      | Required | Add item to cart            |
| POST   | /api/cart/remove   | Required | Remove item from cart       |
| GET    | /api/orders        | Required | Get user's order history    |
| GET    | /api/orders/:id    | Required | Get order details           |
| POST   | /api/orders        | Required | Place a new order           |
| GET    | /api/health        | No       | Health check                |

## Database Schema

| Table       | Description                         |
| ----------- | ----------------------------------- |
| users       | User accounts with hashed passwords |
| products    | Product catalog                     |
| offers      | Promotional discounts on products   |
| cart_items  | Per-user shopping cart items        |
| orders      | Order header with status tracking   |
| order_items | Individual line items per order     |

See [docs/database.md](docs/database.md) for full schema and ER diagram.

## Example Screenshots

> _Screenshots placeholder — capture these during the demo:_

| Screen          | Description                             |
| --------------- | --------------------------------------- |
| Login Page      | Sign-in form with Online Store branding |
| Dashboard       | Overview cards linking to all sections  |
| Products        | Product grid with Add to Cart buttons   |
| Offers          | Discount cards with calculated prices   |
| Shopping Cart   | Cart items with quantity controls       |
| Order Confirmed | Success message with order ID           |
| Order History   | Order list with status badges           |

## Future Improvements

- User registration UI page
- Product search and filtering
- Pagination for products and orders
- Admin dashboard for product/order management
- Image uploads for products
- Email notifications for order status changes
- Payment gateway integration
- Role-based access control (Admin, Customer)
- Responsive mobile layout enhancements
- CI/CD pipeline with automated testing
- Docker containerization for deployment

## Contributors

| Role             | Contributor   |
| ---------------- | ------------- |
| Business Analyst | Workshop Team |
| Frontend Dev (A) | Workshop Team |
| Feature Dev (B)  | Workshop Team |
| Backend Dev (C)  | Workshop Team |
| Integration (D)  | Workshop Team |
| QA Engineer      | Workshop Team |

---

**Online Store Platform** — Built with React + Express + SQLite  
Workshop Prototype &copy; 2026
#   a g e n t i c _ a i _ t r a n i n g _ p r o g r a m _ 0 2  
 