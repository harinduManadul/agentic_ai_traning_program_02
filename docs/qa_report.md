# QA Test Report

## Online Store Web Application

**Document Version:** 2.0  
**Date:** March 12, 2026  
**Prepared by:** QA Engineer — Workshop Team  
**Test Cycle:** Cycle 2 (Admin Panel + RBAC)

---

## 1. Executive Summary

This report summarizes the quality assurance testing performed for the Online Store Web Application — Cycle 2. Testing expanded to cover new functionality: User Registration, Role-Based Access Control (RBAC), and the Admin Panel (Product Management, Offer Management, Order Management). In addition, all Cycle 1 functional modules (Authentication, Product Catalog, Offers, Cart, Checkout, Orders, Navigation) were re-verified.

| Metric           | Value                         |
| ---------------- | ----------------------------- |
| Total Test Cases | 31                            |
| Passed           | 31                            |
| Failed           | 0                             |
| Blocked          | 0                             |
| Pass Rate        | **100%**                      |
| Defects Found    | 3 (all fixed — see Section 6) |

---

## 2. Test Environment

| Component      | Detail                                    |
| -------------- | ----------------------------------------- |
| OS             | Windows 11                                |
| Node.js        | v22.x                                     |
| Browser        | Google Chrome (latest)                    |
| Frontend URL   | `http://localhost:5173`                   |
| Backend URL    | `http://localhost:3000`                   |
| Database       | SQLite (better-sqlite3), seeded test data |
| Test Framework | Vitest 4.0.18 + React Testing Library     |
| Admin Account  | `admin@onlinestore.com` / `Admin@123`     |

---

## 3. Test Execution Results

### 3.1 Authentication & Authorization

| Test ID | Scenario                               | Module         | Status  | Notes                                     |
| ------- | -------------------------------------- | -------------- | ------- | ----------------------------------------- |
| TC001   | Login with valid credentials           | Authentication | ✅ Pass |                                           |
| TC002   | Login with invalid password            | Authentication | ✅ Pass |                                           |
| TC003   | Login with non-existent email          | Authentication | ✅ Pass |                                           |
| TC004   | Logout                                 | Authentication | ✅ Pass | Token cleared from localStorage           |
| TC005   | Register new user                      | Authentication | ✅ Pass | Role assigned as "customer"               |
| TC006   | Register with duplicate email          | Authentication | ✅ Pass | "Email already registered" returned       |
| TC007   | Admin login returns admin role         | Authorization  | ✅ Pass | JWT contains `role: "admin"`, badge shown |
| TC008   | Unauthenticated access rejected        | Authorization  | ✅ Pass | 401 returned with no token                |
| TC009   | Customer cannot access admin endpoints | Authorization  | ✅ Pass | 403 returned for customer on admin routes |

### 3.2 Products & Offers (Customer)

| Test ID | Scenario                         | Module   | Status  | Notes                          |
| ------- | -------------------------------- | -------- | ------- | ------------------------------ |
| TC010   | View product catalog             | Products | ✅ Pass | 6 products displayed correctly |
| TC011   | Out-of-stock product display     | Products | ✅ Pass | "Unavailable" button shown     |
| TC012   | View offers with discount prices | Offers   | ✅ Pass | Discount calculation verified  |

### 3.3 Cart & Checkout

| Test ID | Scenario                               | Module   | Status  | Notes                                  |
| ------- | -------------------------------------- | -------- | ------- | -------------------------------------- |
| TC013   | Add product to cart from Products page | Cart     | ✅ Pass | Optimistic UI + backend sync confirmed |
| TC014   | Add same product twice (qty increment) | Cart     | ✅ Pass |                                        |
| TC015   | Update quantity using +/− buttons      | Cart     | ✅ Pass | Min qty enforced at 1                  |
| TC016   | Remove item from cart                  | Cart     | ✅ Pass | Empty state renders correctly          |
| TC017   | Successful checkout                    | Checkout | ✅ Pass | Stock decremented, order created       |

### 3.4 Orders & Navigation

| Test ID | Scenario                              | Module     | Status  | Notes                    |
| ------- | ------------------------------------- | ---------- | ------- | ------------------------ |
| TC018   | View order history                    | Orders     | ✅ Pass | Sorted newest first      |
| TC019   | Order status badges display correctly | Orders     | ✅ Pass | 4 statuses verified      |
| TC020   | Sidebar navigation and active state   | Navigation | ✅ Pass | All 5 customer routes OK |

### 3.5 Admin Panel

| Test ID | Scenario                                 | Module         | Status  | Notes                                         |
| ------- | ---------------------------------------- | -------------- | ------- | --------------------------------------------- |
| TC021   | Admin creates a new product              | Admin Products | ✅ Pass | Product created via API, id returned          |
| TC022   | Admin updates product price/stock inline | Admin Products | ✅ Pass | Inline edit saves correctly via PUT           |
| TC023   | Admin edits product via full form        | Admin Products | ✅ Pass | All fields update                             |
| TC024   | Admin deletes a product                  | Admin Products | ✅ Pass | Product removed, confirmed via subsequent GET |
| TC025   | Admin creates a new offer                | Admin Offers   | ✅ Pass | Offer created with product association        |
| TC026   | Admin deletes an offer                   | Admin Offers   | ✅ Pass | Offer removed, confirmed via subsequent GET   |
| TC027   | Admin views all orders from all users    | Admin Orders   | ✅ Pass | 8 orders returned with user details           |
| TC028   | Admin updates order status               | Admin Orders   | ✅ Pass | Status changed to "Shipped" successfully      |
| TC029   | Invalid status update rejected           | Admin Orders   | ✅ Pass | 400 returned for invalid status value         |
| TC030   | Admin sidebar shows admin section        | Admin Nav      | ✅ Pass | 3 admin links visible for admin users         |
| TC031   | Customer sidebar hides admin section     | Admin Nav      | ✅ Pass | Admin section not rendered for customers      |

---

## 4. Automated Test Results

Vitest automated unit/integration tests were executed as part of the CI verification.

```
 ✓ src/App.test.tsx (4 tests)

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  ...
   Duration  ...
```

| Suite        | Tests | Passed | Failed |
| ------------ | ----- | ------ | ------ |
| App.test.tsx | 4     | 4      | 0      |
| **Total**    | **4** | **4**  | **0**  |

### Build Verification

```
vite build — 61 modules transformed
dist/index.html              0.46 kB │ gzip: 0.30 kB
dist/assets/index-*.css     12.06 kB │ gzip: 3.20 kB
dist/assets/index-*.js     259.90 kB │ gzip: 84.98 kB
✓ built in ~2s — 0 errors, 0 warnings
```

---

## 5. Module Coverage Summary

| Module         | Test Cases | Pass   | Fail  | Coverage |
| -------------- | ---------- | ------ | ----- | -------- |
| Authentication | 6          | 6      | 0     | 100%     |
| Authorization  | 3          | 3      | 0     | 100%     |
| Products       | 2          | 2      | 0     | 100%     |
| Offers         | 1          | 1      | 0     | 100%     |
| Cart           | 4          | 4      | 0     | 100%     |
| Checkout       | 1          | 1      | 0     | 100%     |
| Orders         | 2          | 2      | 0     | 100%     |
| Navigation     | 1          | 1      | 0     | 100%     |
| Admin Products | 4          | 4      | 0     | 100%     |
| Admin Offers   | 2          | 2      | 0     | 100%     |
| Admin Orders   | 3          | 3      | 0     | 100%     |
| Admin Nav      | 2          | 2      | 0     | 100%     |
| **Total**      | **31**     | **31** | **0** | **100%** |

---

## 6. Defects Summary

Three defects were discovered during this test cycle. All were fixed before final verification.

| ID    | Severity | Module       | Description                                                                                 | Status |
| ----- | -------- | ------------ | ------------------------------------------------------------------------------------------- | ------ |
| DEF-1 | High     | Admin Orders | `AdminOrders.tsx` referenced `o.total` instead of `o.totalAmount`, causing TypeScript error | Fixed  |
| DEF-2 | High     | Admin Orders | Express matched `/admin/all` as `/:id` (id="admin") due to route ordering — returned 404    | Fixed  |
| DEF-3 | Medium   | Admin Orders | Backend `validStatuses` array was missing "Pending", causing 400 on valid Pending status    | Fixed  |

### Defect Resolution Details

- **DEF-1:** Changed `o.total` to `o.totalAmount` in `AdminOrders.tsx` to match the `Order` interface.
- **DEF-2:** Moved `/admin/all` and `/admin/:id/status` routes above `/:id` in `server/routes/orders.js` to prevent Express matching "admin" as a route parameter.
- **DEF-3:** Added `'Pending'` to the `validStatuses` array in the PUT `/admin/:id/status` handler.

---

## 7. Observations & Recommendations

### Observations

- All functional modules operate as specified in the design documents
- JWT authentication correctly secures protected endpoints — unauthorized requests receive 401 responses
- Role-based access control correctly restricts admin endpoints — customers receive 403 responses
- Admin panel CRUD operations (products, offers, orders) work correctly with proper validation
- Inline stock/price editing provides efficient admin workflow without full form navigation
- Cart uses a hybrid optimistic update pattern: UI updates instantly, then syncs with the backend
- Order checkout is transactional — stock validation and order creation happen atomically
- Admin is auto-seeded from `.env` on first server start; role is embedded in the JWT
- The application is responsive and renders correctly on standard desktop viewports

### Recommendations for Future Iterations

1. **Increase automated test coverage** — Add component tests for Admin pages, Cart, Orders
2. **Add E2E tests** — Use Playwright or Cypress for full user-journey testing including admin flows
3. **Performance testing** — Load-test the API endpoints with larger datasets
4. **Cross-browser testing** — Verify on Firefox and Safari
5. **Accessibility audit** — Run WCAG 2.1 checks on all pages
6. **Admin audit logging** — Log admin CRUD actions for accountability

---

## 8. Conclusion

The Online Store Web Application has passed all **31 test cases** (up from 15 in Cycle 1) and all **4 automated unit tests**. Three defects were discovered and resolved during testing. The system is stable, functionally complete — including the admin panel with role-based access — and ready for the workshop demonstration.

**QA Sign-off:** ✅ Approved for Workshop Demo

---

_Document prepared for the Online Store Workshop — March 2026_
