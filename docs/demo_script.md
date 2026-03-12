# Client Demo Script

## Online Store Web Application

**Duration:** ~5 minutes  
**Date:** March 12, 2026  
**Presenter:** Workshop Team

---

## Pre-Demo Checklist

- [ ] Backend running on `http://localhost:3000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Database freshly seeded (`npm run seed`)
- [ ] Browser open (Chrome recommended), cache cleared
- [ ] Screen sharing / projector ready

---

## Demo Flow

### Scene 1: Introduction (30 seconds)

**Talking Points:**

> "Welcome. Today we'll demo the Online Store Web Application — a full-stack React and Node.js application featuring product browsing, special offers, cart management, and order tracking."

- Briefly mention the tech stack: React 19 + TypeScript, Express 5, SQLite, JWT authentication
- Note that this is a workshop deliverable built by the four-developer team

---

### Scene 2: Login (45 seconds)

**Action:** Open `http://localhost:5173/login`

1. **Show the login page** — Online Store branding, clean form layout
2. **Demonstrate invalid login first:**
   - Enter `john@example.com` with password `wrongpassword`
   - Click "Sign In"
   - **Point out:** Error message "Invalid email or password" appears
3. **Login with valid credentials:**
   - Enter `john@example.com` / `password123`
   - Click "Sign In"
   - **Point out:** Redirected to Dashboard, Navbar shows "John Doe"

**Talking Points:**

> "Authentication uses JWT tokens. The backend validates credentials with bcrypt password hashing and returns a signed token stored in the browser."

---

### Scene 3: Dashboard Overview (30 seconds)

**Action:** You are now on `/dashboard`

1. **Point out the dashboard cards:** Products, Offers, Cart, Orders — each with a count summary
2. **Show the sidebar navigation** — All 5 sections accessible
3. **Show the navbar** — Displays logged-in user name and Online Store branding

**Talking Points:**

> "The dashboard gives the user a quick overview of the entire application. Each card links to its respective section."

---

### Scene 4: Browse Products (45 seconds)

**Action:** Click "Products" in the sidebar

1. **Show the product grid** — 6 product cards with images, names, prices, and stock counts
2. **Highlight an in-stock product:** Wireless Headphones — $79.99, 45 in stock
3. **Show out-of-stock handling:** Find USB-C Hub — shows "Out of Stock" label, "Add to Cart" button is disabled
4. **Add items to cart:**
   - Click "Add to Cart" on **Wireless Headphones**
   - Click "Add to Cart" on **Mechanical Keyboard**
   - **Point out:** Instant UI feedback (optimistic update)

**Talking Points:**

> "Products are fetched from the REST API. Out-of-stock items are clearly indicated and cannot be added to the cart. The cart uses optimistic updates — the UI responds immediately while syncing with the backend."

---

### Scene 5: View Offers (30 seconds)

**Action:** Click "Offers" in the sidebar

1. **Show offer cards** — 3 offers with discount badges (e.g., "20% OFF")
2. **Point out:** Original price (struck through) and calculated sale price
3. **Show the offer details** — Description, validity period, product association
4. **Add an offer item to cart** (if available)

**Talking Points:**

> "The offers page joins offer data with product data to show discounted prices. Each offer card shows the discount percentage and the calculated sale price."

---

### Scene 6: Cart Management (60 seconds)

**Action:** Click "Cart" in the sidebar

1. **Show cart items** — Wireless Headphones and Mechanical Keyboard listed
2. **Demonstrate quantity controls:**
   - Click "+" on Wireless Headphones → quantity goes to 2, subtotal updates
   - Click "−" to go back to 1
3. **Show the cart total** — Dynamically calculated
4. **Remove an item:**
   - Click "Remove" on Mechanical Keyboard
   - **Point out:** Item disappears, total recalculates
5. **Proceed to Checkout:**
   - Click "Proceed to Checkout"
   - **Point out:** Order confirmation appears with order ID
   - Cart is now empty

**Talking Points:**

> "The cart supports full CRUD operations — add, update quantity, remove, and checkout. Checkout creates an order transaction on the backend: it validates stock, decrements quantities, and creates the order atomically."

---

### Scene 7: Order Tracking (30 seconds)

**Action:** Click "Orders" in the sidebar (or click "View Orders" from the confirmation)

1. **Show the orders list** — The newly created order appears at the top
2. **Point out order details:** Order ID, total amount, status badge ("Processing"), date
3. **Show pre-seeded orders** with different statuses:
   - "Processing" (new order)
   - "Shipped" (seeded)
   - "Delivered" (seeded)
4. **Show the status badge colors** — Different visual treatment for each status

**Talking Points:**

> "Orders are tracked with three statuses: Processing, Shipped, and Delivered. The user can see their complete order history sorted by most recent."

---

### Scene 8: Logout & Wrap-Up (30 seconds)

**Action:** Click "Logout" in the sidebar footer

1. **Point out:** Redirected back to the login page
2. **Mention:** JWT token cleared from localStorage

**Closing Statement:**

> "That concludes our demo of the Online Store Web Application. The application demonstrates a complete full-stack implementation with React, Express, and SQLite — covering authentication, product management, cart operations, and order tracking. Thank you."

---

## Backup Demo Notes

### If something goes wrong:

- **Backend not responding:** Run `cd server && node index.js` in a terminal
- **Database empty:** Run `npm run seed` from the project root
- **Frontend not loading:** Run `cd ecommerce-app && npm run dev`
- **Login fails:** Re-seed the database and try `john@example.com` / `password123`

### Test Accounts Available:

| Name       | Email            | Password    |
| ---------- | ---------------- | ----------- |
| John Doe   | john@example.com | password123 |
| Jane Smith | jane@example.com | password123 |
| Bob Wilson | bob@example.com  | password123 |

---

_Demo script prepared for the Online Store Workshop — March 2026_
