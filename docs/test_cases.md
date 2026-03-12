# Test Cases Document

## Online Store Web Application

**Document Version:** 2.0  
**Date:** March 12, 2026  
**Prepared by:** QA Engineer — Workshop Team

---

## Test Cases

### Authentication & Authorization

| Test ID | Module         | Scenario                               | Pre-conditions                          | Steps                                                                                              | Expected Result                                                                                            | Priority |
| ------- | -------------- | -------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------- |
| TC001   | Authentication | Login with valid credentials           | User exists in database; app is running | 1. Navigate to `/login` <br> 2. Enter `john@example.com` / `password123` <br> 3. Click "Sign In"   | User is redirected to `/dashboard`. Navbar displays "John Doe". JWT token is stored in localStorage.       | High     |
| TC002   | Authentication | Login with invalid password            | User exists in database                 | 1. Navigate to `/login` <br> 2. Enter `john@example.com` / `wrongpassword` <br> 3. Click "Sign In" | Error message "Invalid email or password" is displayed. User stays on login page.                          | High     |
| TC003   | Authentication | Login with non-existent email          | App is running                          | 1. Navigate to `/login` <br> 2. Enter `nobody@example.com` / `password123` <br> 3. Click "Sign In" | Error message "Invalid email or password" is displayed. User stays on login page.                          | High     |
| TC004   | Authentication | Logout                                 | User is logged in                       | 1. Click "Logout" button in the sidebar footer                                                     | User is redirected to `/login`. JWT token is removed from localStorage. Navbar shows "Guest".              | High     |
| TC005   | Authentication | Register new user                      | App is running                          | 1. Navigate to `/register` <br> 2. Enter name, email, password <br> 3. Click "Register"            | User is created with role "customer". JWT token stored. Redirected to `/dashboard`.                        | High     |
| TC006   | Authentication | Register with duplicate email          | User with same email exists             | 1. Navigate to `/register` <br> 2. Enter duplicate email <br> 3. Click "Register"                  | Error message "Email already registered" is displayed. User stays on register page.                        | High     |
| TC007   | Authorization  | Admin login returns admin role         | Admin seeded from .env                  | 1. Navigate to `/login` <br> 2. Enter `admin@onlinestore.com` / `Admin@123`                        | Login succeeds. JWT contains `role: "admin"`. Navbar shows "Admin" badge. Sidebar shows admin nav section. | High     |
| TC008   | Authorization  | Unauthenticated access rejected        | No token                                | 1. Call `GET /api/orders` without Authorization header                                             | Returns 401 "Authentication required".                                                                     | High     |
| TC009   | Authorization  | Customer cannot access admin endpoints | Logged in as customer                   | 1. Login as customer <br> 2. Call `POST /api/products`                                             | Returns 403 "Admin access required".                                                                       | High     |

### Products

| Test ID | Module   | Scenario                     | Pre-conditions                         | Steps                                                        | Expected Result                                                                              | Priority |
| ------- | -------- | ---------------------------- | -------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | -------- |
| TC010   | Products | View product catalog         | User is logged in; products are seeded | 1. Click "Products" in the sidebar                           | Products page loads. 6 product cards are displayed with name, price, stock, and description. | High     |
| TC011   | Products | Out-of-stock product display | USB-C Hub has stock = 0                | 1. Navigate to Products page <br> 2. Find the USB-C Hub card | Card shows "Out of Stock" label. "Add to Cart" button is disabled and shows "Unavailable".   | Medium   |

### Offers

| Test ID | Module | Scenario                         | Pre-conditions                    | Steps                            | Expected Result                                                                                         | Priority |
| ------- | ------ | -------------------------------- | --------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- | -------- |
| TC012   | Offers | View offers with discount prices | Offers are seeded; user logged in | 1. Click "Offers" in the sidebar | Offers page displays 3 offer cards. Each shows discount badge, original price (struck), and sale price. | High     |

### Cart & Checkout

| Test ID | Module   | Scenario                                    | Pre-conditions                                   | Steps                                                                                                  | Expected Result                                                                                            | Priority |
| ------- | -------- | ------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | -------- |
| TC013   | Cart     | Add product to cart from Products page      | User is logged in; cart is empty                 | 1. Navigate to Products page <br> 2. Click "Add to Cart" on Wireless Headphones                        | Item appears in cart. Cart page shows 1 item: Wireless Headphones, qty 1, $79.99.                          | High     |
| TC014   | Cart     | Add same product twice (quantity increment) | User is logged in; 1 Wireless Headphones in cart | 1. Navigate to Products page <br> 2. Click "Add to Cart" on Wireless Headphones again                  | Cart shows Wireless Headphones with quantity 2. Subtotal shows $159.98.                                    | High     |
| TC015   | Cart     | Update quantity using +/- buttons           | User is logged in; items in cart                 | 1. Navigate to Cart page <br> 2. Click "+" button on an item <br> 3. Click "−" button on the same item | Quantity increments by 1 on "+", decrements by 1 on "−". Subtotal recalculates. "−" is disabled at qty 1.  | Medium   |
| TC016   | Cart     | Remove item from cart                       | User is logged in; items in cart                 | 1. Navigate to Cart page <br> 2. Click "Remove" button on an item                                      | Item is removed from the cart list. Cart total updates. If last item removed, empty state message appears. | High     |
| TC017   | Checkout | Successful checkout                         | User is logged in; 1+ items in cart              | 1. Navigate to Cart page <br> 2. Verify total is correct <br> 3. Click "Proceed to Checkout"           | Order confirmation displayed with order ID and success message. Cart is emptied. "View Orders" link shown. | High     |

### Orders & Navigation

| Test ID | Module     | Scenario                              | Pre-conditions                  | Steps                                                                                                          | Expected Result                                                                                                     | Priority |
| ------- | ---------- | ------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| TC018   | Orders     | View order history                    | User is logged in; orders exist | 1. Click "Orders" in the sidebar                                                                               | Orders page displays order list sorted by date (newest first). Each order shows ID, amount, status badge, and date. | High     |
| TC019   | Orders     | Order status badges display correctly | Seeded orders with all statuses | 1. Navigate to Orders page <br> 2. Check status badges for each order                                          | "Pending/Processing/Shipped/Delivered" each show correct style badge.                                               | Medium   |
| TC020   | Navigation | Sidebar navigation and active state   | User is logged in               | 1. Click each sidebar link: Dashboard, Products, Offers, Cart, Orders <br> 2. Observe active link highlighting | Each click navigates to correct page. Active link highlighted. All 5 customer pages render correctly.               | Medium   |

### Admin Panel

| Test ID | Module         | Scenario                                 | Pre-conditions                                       | Steps                                                                                                                      | Expected Result                                                                                              | Priority |
| ------- | -------------- | ---------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| TC021   | Admin Products | Admin creates a new product              | Logged in as admin                                   | 1. Navigate to `/admin/products` <br> 2. Click "+ Add Product" <br> 3. Fill form (name, price, stock, desc) <br> 4. Submit | Product appears in the table. Backend `GET /api/products` returns the new product.                           | High     |
| TC022   | Admin Products | Admin updates product price/stock inline | Logged in as admin; products exist                   | 1. Navigate to `/admin/products` <br> 2. Click on a price or stock value <br> 3. Edit value <br> 4. Click "Save"           | Price/stock updates in the table. Backend confirms updated values.                                           | High     |
| TC023   | Admin Products | Admin edits product via full form        | Logged in as admin; products exist                   | 1. Navigate to `/admin/products` <br> 2. Click "Edit" on a product <br> 3. Change fields <br> 4. Click "Update Product"    | Product details update in the table. All fields (name, price, stock, description) saved.                     | Medium   |
| TC024   | Admin Products | Admin deletes a product                  | Logged in as admin; products exist                   | 1. Navigate to `/admin/products` <br> 2. Click "Delete" on a product <br> 3. Confirm deletion                              | Product removed from table. Backend confirms deletion.                                                       | High     |
| TC025   | Admin Offers   | Admin creates a new offer                | Logged in as admin; products exist                   | 1. Navigate to `/admin/offers` <br> 2. Click "+ Create Offer" <br> 3. Select product, set discount %, dates <br> 4. Submit | Offer appears in the table with correct product name, discount, and dates.                                   | High     |
| TC026   | Admin Offers   | Admin deletes an offer                   | Logged in as admin; offers exist                     | 1. Navigate to `/admin/offers` <br> 2. Click "Delete" on an offer <br> 3. Confirm deletion                                 | Offer removed from table. Backend confirms deletion.                                                         | High     |
| TC027   | Admin Orders   | Admin views all orders from all users    | Logged in as admin; orders exist from multiple users | 1. Navigate to `/admin/orders`                                                                                             | Table shows all orders with customer name, email, total, date, and status dropdown. Order count displayed.   | High     |
| TC028   | Admin Orders   | Admin updates order status               | Logged in as admin; orders exist                     | 1. Navigate to `/admin/orders` <br> 2. Change status dropdown for an order (e.g., Processing → Shipped)                    | Status updates immediately in the dropdown. Backend confirms new status.                                     | High     |
| TC029   | Admin Orders   | Invalid status update rejected           | Logged in as admin                                   | 1. Call `PUT /api/orders/admin/:id/status` with `{"status":"InvalidStatus"}`                                               | Returns 400 error: "Status must be one of: Pending, Processing, Shipped, Delivered".                         | Medium   |
| TC030   | Admin Nav      | Admin sidebar shows admin section        | Logged in as admin                                   | 1. Login as admin <br> 2. View sidebar                                                                                     | Sidebar shows "Admin Panel" section with Manage Products, Manage Offers, Manage Orders links.                | Medium   |
| TC031   | Admin Nav      | Customer sidebar hides admin section     | Logged in as customer                                | 1. Login as customer <br> 2. View sidebar                                                                                  | Sidebar shows only customer nav items (Dashboard, Products, Offers, Cart, Orders). No admin section visible. | Medium   |

---

## Test Case Detail — Expanded

### TC001: Login with Valid Credentials

**Category:** Functional — Authentication  
**Priority:** High  
**Pre-conditions:** Backend running, database seeded with user john@example.com

**Steps:**

1. Open browser and navigate to `http://localhost:5173/login`
2. Enter email: `john@example.com`
3. Enter password: `password123`
4. Click the "Sign In" button

**Expected:**

- Page redirects to `/dashboard`
- Dashboard page renders with 4 cards (Products, Offers, Cart, Orders)
- Navbar displays "John Doe"
- `localStorage.getItem('token')` returns a JWT string
- `localStorage.getItem('user')` returns valid JSON with user data

---

### TC013: Add Product to Cart

**Category:** Functional — Cart  
**Priority:** High  
**Pre-conditions:** User logged in, cart is empty

**Steps:**

1. Navigate to `/products`
2. Wait for products to load
3. Click "Add to Cart" button on the "Wireless Headphones" card
4. Navigate to `/cart`

**Expected:**

- Cart page shows 1 item: "Wireless Headphones"
- Quantity: 1
- Price: $79.99
- Total: $79.99
- Backend `GET /api/cart` returns the item (verified via API)

---

### TC017: Successful Checkout

**Category:** Functional — Checkout (End-to-End)  
**Priority:** High  
**Pre-conditions:** User logged in, 1+ items in cart

**Steps:**

1. Navigate to `/cart`
2. Verify items and total amount
3. Click "Proceed to Checkout"
4. Wait for confirmation

**Expected:**

- Button shows "Processing…" while loading
- Confirmation message appears: "Order Confirmed!"
- Order ID is displayed (e.g., "Order ID: #4")
- "View Orders" link is shown
- Cart is emptied (navigating back to `/cart` shows empty state)
- New order appears in Orders page with status "Processing"
- Product stock is reduced in the database

---

### TC027: Admin Views All Orders

**Category:** Functional — Admin Panel  
**Priority:** High  
**Pre-conditions:** Logged in as admin, orders exist from multiple users

**Steps:**

1. Navigate to `/admin/orders`
2. Wait for orders to load

**Expected:**

- Table shows all orders from all users (not just admin's own)
- Each row shows: Order #, Customer name, Customer email, Total ($), Date, Status dropdown
- "X total orders" count is displayed in the header
- Orders sorted newest first

---

### TC028: Admin Updates Order Status

**Category:** Functional — Admin Panel  
**Priority:** High  
**Pre-conditions:** Logged in as admin, orders exist

**Steps:**

1. Navigate to `/admin/orders`
2. Find an order with status "Processing"
3. Change the status dropdown to "Shipped"

**Expected:**

- Dropdown immediately reflects "Shipped"
- Backend `PUT /api/orders/admin/:id/status` called with `{"status":"Shipped"}`
- Backend returns updated order object
- Status style class changes (color changes per status)

---

_Document prepared for the Online Store Workshop — March 2026_
