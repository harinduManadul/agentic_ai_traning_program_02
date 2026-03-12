# Deployment Plan

## Online Store Web Application

**Document Version:** 1.0  
**Date:** March 12, 2026  
**Prepared by:** DevOps / Workshop Team

---

## 1. Overview

This document describes how to build, configure, and deploy the Online Store Web Application. The application consists of three components:

| Component | Technology              | Default Port |
| --------- | ----------------------- | ------------ |
| Frontend  | React 19 + Vite 7 (SPA) | 5173         |
| Backend   | Node.js + Express 5     | 3000         |
| Database  | SQLite (file-based)     | N/A          |

---

## 2. Prerequisites

| Requirement | Version                 | Purpose                           |
| ----------- | ----------------------- | --------------------------------- |
| Node.js     | ≥ 18.x                  | Runtime for backend & build tools |
| npm         | ≥ 9.x                   | Package manager                   |
| Git         | ≥ 2.x                   | Source control                    |
| OS          | Windows / macOS / Linux | Any modern OS                     |

---

## 3. Repository Structure

```
AI_trainning_02/
├── ecommerce-app/          # Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend (Express + SQLite)
│   ├── index.js
│   ├── db/
│   │   ├── database.js
│   │   └── seed.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── offers.js
│   │   ├── cart.js
│   │   └── orders.js
│   └── package.json
├── docs/                   # Documentation
├── package.json            # Root scripts
└── README.md
```

---

## 4. Environment Configuration

### 4.1 Backend Environment

| Variable    | Default                     | Description                   |
| ----------- | --------------------------- | ----------------------------- |
| PORT        | `3000`                      | Express server port           |
| JWT_SECRET  | `ecommerce-secret-key-2024` | Secret for signing JWT tokens |
| CORS Origin | `http://localhost:5173`     | Allowed frontend origin       |

> **Note:** For production deployment, change `JWT_SECRET` to a strong random value and restrict CORS to the actual frontend domain.

### 4.2 Frontend Environment

| Variable               | Default                     | Description      |
| ---------------------- | --------------------------- | ---------------- |
| API Base URL (in code) | `http://localhost:3000/api` | Backend API base |

The API base URL is configured in `ecommerce-app/src/services/api.ts`.

---

## 5. Deployment Steps

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd AI_trainning_02
```

### Step 2: Install Root Dependencies

```bash
npm install
```

This installs `concurrently` for running frontend and backend together.

### Step 3: Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### Step 4: Install Frontend Dependencies

```bash
cd ecommerce-app
npm install
cd ..
```

### Step 5: Seed the Database

```bash
npm run seed
```

This runs `server/db/seed.js` which:

- Creates the SQLite database file (`server/db/ecommerce.db`)
- Creates all 6 tables (users, products, offers, cart_items, orders, order_items)
- Inserts seed data: 3 users, 6 products, 3 offers, 3 sample orders

### Step 6: Start the Application

```bash
npm run dev
```

This uses `concurrently` to start both:

- **Backend:** `node server/index.js` → `http://localhost:3000`
- **Frontend:** `cd ecommerce-app && npm run dev` → `http://localhost:5173`

### Step 7: Verify Deployment

1. Open `http://localhost:5173` in a browser
2. Log in with `john@example.com` / `password123`
3. Verify Dashboard, Products, Offers, Cart, and Orders pages load correctly
4. Check API health: `GET http://localhost:3000/api/health`

---

## 6. Production Build (Frontend)

To create an optimized production build of the frontend:

```bash
cd ecommerce-app
npm run build
```

This generates a `dist/` folder with static assets that can be served by any web server (Nginx, Apache, or a static hosting service).

---

## 7. Database Management

### Location

The SQLite database file is stored at `server/db/ecommerce.db`.

### Reset Database

To reset and re-seed the database:

```bash
npm run seed
```

This drops and recreates all tables with fresh seed data.

### Backup

Since SQLite is file-based, backup is straightforward:

```bash
copy server/db/ecommerce.db server/db/ecommerce.db.bak
```

---

## 8. Docker Deployment (Optional / Future)

For containerized deployment, the following structure is recommended:

### docker-compose.yml (Reference)

```yaml
version: "3.8"
services:
  backend:
    build:
      context: .
      dockerfile: server/Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - db-data:/app/server/db
    environment:
      - JWT_SECRET=change-me-in-production
      - PORT=3000

  frontend:
    build:
      context: ./ecommerce-app
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  db-data:
```

> **Note:** Docker configuration is not included in the current project scope. This is provided as a reference for future iterations.

---

## 9. Troubleshooting

| Issue                         | Solution                                                 |
| ----------------------------- | -------------------------------------------------------- |
| Port 3000 already in use      | Kill existing process or change PORT in server/index.js  |
| Port 5173 already in use      | Vite will auto-increment to 5174                         |
| `ecommerce.db` does not exist | Run `npm run seed` to create and seed the database       |
| CORS errors in browser        | Ensure backend is running on port 3000                   |
| `MODULE_NOT_FOUND` errors     | Run `npm install` in both `server/` and `ecommerce-app/` |
| Login returns 401             | Re-seed the database: `npm run seed`                     |
| Frontend shows blank page     | Check browser console; ensure API base URL is correct    |

---

## 10. Deployment Checklist

- [ ] Node.js ≥ 18 installed
- [ ] Repository cloned
- [ ] Root dependencies installed (`npm install`)
- [ ] Server dependencies installed (`cd server && npm install`)
- [ ] Frontend dependencies installed (`cd ecommerce-app && npm install`)
- [ ] Database seeded (`npm run seed`)
- [ ] Application started (`npm run dev`)
- [ ] Backend health check passed (`GET /api/health`)
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Login works with seeded credentials
- [ ] All pages render correctly

---

_Document prepared for the Online Store Workshop — March 2026_
