# Test Design Document

## Online Store Web Application

**Document Version:** 1.0  
**Date:** March 12, 2026  
**Prepared by:** QA Engineer — Workshop Team

---

## 1. Testing Strategy

The testing strategy for the Online Store application follows a **layered approach** covering unit tests, integration tests, API tests, and manual UI validation. Given the workshop timeframe, the focus is on ensuring core user workflows function correctly end-to-end.

### Testing Pyramid

```
        ┌───────────────┐
        │   Manual UI   │   ← Exploratory & demo validation
        │   Testing     │
        ├───────────────┤
        │   API Testing │   ← Endpoint validation (curl/Postman)
        │               │
        ├───────────────┤
        │  Integration  │   ← Component rendering + routing
        │    Tests      │
        ├───────────────┤
        │  Unit Tests   │   ← Utility functions, isolated logic
        │               │
        └───────────────┘
```

## 2. Testing Scope

### In Scope

| Area                | Coverage                                                 |
| ------------------- | -------------------------------------------------------- |
| User Authentication | Login with valid/invalid credentials, logout             |
| Product Catalog     | Product listing, product display, stock indicators       |
| Offers & Promotions | Offer listing, discount calculation, add discounted item |
| Shopping Cart       | Add item, update quantity, remove item, cart total       |
| Checkout            | Order placement, stock validation, confirmation          |
| Order Tracking      | Order history display, status badges                     |
| Navigation          | Sidebar links, active state, routing                     |
| API Endpoints       | All REST endpoints — request/response validation         |
| Error Handling      | Invalid inputs, unauthorized access, network errors      |

### Out of Scope

| Area                     | Reason                                   |
| ------------------------ | ---------------------------------------- |
| Performance/Load Testing | Not applicable for prototype             |
| Security Penetration     | Beyond workshop scope                    |
| Cross-Browser Testing    | Desktop Chrome is the target environment |
| Mobile Responsiveness    | Desktop-first design                     |
| Accessibility (WCAG)     | Not prioritized for prototype            |

## 3. Test Environment

| Component       | Detail                                                 |
| --------------- | ------------------------------------------------------ |
| OS              | Windows 10/11                                          |
| Browser         | Google Chrome (latest) or Edge                         |
| Node.js         | v18+                                                   |
| Frontend Server | Vite dev server — http://localhost:5173                |
| Backend Server  | Express — http://localhost:3000                        |
| Database        | SQLite — server/ecommerce.db (seeded with sample data) |
| Test Runner     | Vitest 4 + React Testing Library                       |
| API Testing     | PowerShell Invoke-RestMethod / Postman                 |

### Test Data

Pre-seeded via `npm run seed`:

- **3 users:** john@example.com, jane@example.com, admin@example.com (all with password `password123`)
- **6 products:** Including 1 out-of-stock item (USB-C Hub)
- **3 offers:** 20%, 15%, and 10% discounts
- **3 orders:** One each in Processing, Shipped, and Delivered status

## 4. Test Approach

### 4.1 Functional Testing

Manual and automated verification that all features work according to the functional requirements.

**Focus Areas:**

- Login flow (valid credentials → dashboard redirect, invalid → error message)
- Complete shopping workflow (browse → add to cart → checkout → view order)
- Cart operations (add, increment, decrement, remove)
- Order status display with correct visual badges
- Navigation between all pages via sidebar

### 4.2 API Testing

Validate all REST endpoints independently using HTTP requests.

**Focus Areas:**

- Correct HTTP status codes for success and error scenarios
- Response body structure matches expected schema
- Authentication enforcement (401 for missing/invalid tokens)
- Data integrity (e.g., stock reduction after checkout)

**Tools:** PowerShell `Invoke-RestMethod`, Postman, or curl

### 4.3 UI Testing

Verify that the frontend renders correctly and responds to user interactions.

**Focus Areas:**

- Page renders without errors
- Components display correct data from API responses
- Interactive elements (buttons, inputs) trigger expected behavior
- Loading and error states display appropriately
- Empty states show helpful messages with navigation links

**Tools:** Vitest + React Testing Library (automated), manual browser testing

### 4.4 Integration Testing

Verify that frontend components work together with contexts and routing.

**Focus Areas:**

- AuthContext provides correct state after login/logout
- CartContext syncs with backend API on add/remove
- React Router navigates correctly between pages
- Protected routes redirect unauthenticated users

**Tools:** Vitest + React Testing Library

## 5. Test Types Summary

| Type              | Approach  | Tools                     | Coverage            |
| ----------------- | --------- | ------------------------- | ------------------- |
| Unit Testing      | Automated | Vitest                    | Helper functions    |
| Integration Tests | Automated | Vitest + Testing Library  | Components + routes |
| API Testing       | Manual    | PowerShell / Postman      | All 14 endpoints    |
| UI Testing        | Manual    | Chrome browser            | All 6 pages         |
| Smoke Testing     | Manual    | Full workflow walkthrough | End-to-end flow     |

## 6. Entry and Exit Criteria

### Entry Criteria

- Backend server starts without errors (`npm start`)
- Database is seeded with test data (`npm run seed`)
- Frontend dev server starts without errors (`npm run dev`)
- Both servers are accessible in the browser

### Exit Criteria

- All automated tests pass (`npm run test:run` — 4/4 tests)
- ESLint reports zero errors (`npm run lint`)
- TypeScript build succeeds (`npm run build`)
- All 15 manual test cases execute with Pass result
- No critical or blocking defects remain open

## 7. Risk Assessment

| Risk                             | Likelihood | Impact | Mitigation                       |
| -------------------------------- | ---------- | ------ | -------------------------------- |
| Database corruption during tests | Low        | High   | Re-run seed script to reset data |
| Port conflict (3000 or 5173)     | Medium     | Low    | Kill conflicting processes       |
| Token expiry during testing      | Low        | Low    | Re-login to get fresh token      |
| Out-of-stock edge case missed    | Medium     | Medium | Seed data includes 1 OOS product |

## 8. Defect Management

Defects discovered during testing are categorized by severity:

| Severity | Description                                 | Action          |
| -------- | ------------------------------------------- | --------------- |
| Critical | Application crash, data loss, security flaw | Fix immediately |
| Major    | Feature not working, incorrect calculations | Fix before demo |
| Minor    | UI alignment, missing validation messages   | Fix if time     |
| Cosmetic | Typos, color inconsistencies                | Log for later   |

---

_Document prepared for the Online Store Workshop — March 2026_
