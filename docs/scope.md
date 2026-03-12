# Scope & Requirement Document

## Online Store Web Application

**Document Version:** 1.0  
**Date:** March 12, 2026  
**Prepared by:** Workshop Team (Business Analyst, Developer, QA Engineer)

---

## 1. Project Overview

The Online Store Web Application is a prototype online shopping platform developed during a 90-minute workshop. The application demonstrates a complete e-commerce workflow including user authentication, product browsing, cart management, checkout, and order tracking. It serves as a proof-of-concept for a full-scale e-commerce solution.

## 2. Business Objective

- Demonstrate a functional e-commerce workflow within a constrained timeframe
- Showcase full-stack development capabilities using modern web technologies
- Deliver a working prototype that covers the core online shopping experience
- Provide a foundation that can be extended into a production-grade application

## 3. In-Scope Features

| Feature                  | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| User Login               | Email/password authentication with JWT token management        |
| User Logout              | Clear session and redirect to login page                       |
| Product Catalog          | Browse all products with name, price, stock, description       |
| Offers & Promotions      | View active discounts with calculated sale prices              |
| Shopping Cart            | Add items, adjust quantities, remove items                     |
| Checkout                 | Place order with stock validation and total calculation        |
| Order Placement          | Transactional order creation with cart clearing                |
| Order Tracking           | View order history with status (Processing/Shipped/Delivered)  |
| Side Navigation Menu     | Persistent sidebar for navigating between application sections |
| REST API Backend         | Complete API layer for all features with JWT authentication    |
| Basic Product Management | Create and update products via authenticated API               |
| Database Seeding         | Pre-populated sample data for demonstration purposes           |

## 4. Out-of-Scope Features

| Feature                     | Reason                                               |
| --------------------------- | ---------------------------------------------------- |
| User Registration UI        | Time constraint — API endpoint exists but no UI page |
| Payment Gateway Integration | Requires third-party service setup                   |
| Product Image Uploads       | File handling not in workshop scope                  |
| Email Notifications         | Requires email service configuration                 |
| Admin Dashboard UI          | Time constraint — basic API management exists        |
| Product Search & Filtering  | Not prioritized for prototype                        |
| Pagination                  | Not needed for sample data volume                    |
| Mobile Responsive Layout    | Desktop-first for demo purposes                      |
| Role-Based Access Control   | All authenticated users have same permissions        |
| CI/CD Pipeline              | Infrastructure setup beyond workshop scope           |

## 5. Functional Requirements

### FR-01: User Authentication

- The system shall allow users to log in using email and password.
- The system shall issue a JWT token upon successful authentication.
- The system shall store the JWT token in the browser's localStorage.
- The system shall redirect authenticated users to the Dashboard.
- The system shall allow users to log out, clearing stored tokens and redirecting to the Login page.

### FR-02: Product Catalog

- The system shall display all products in a grid layout.
- Each product card shall show the product name, price, stock count, and description.
- Products with zero stock shall display "Out of Stock" and disable the Add to Cart button.
- Products shall be fetched from the backend API on page load.

### FR-03: Offers & Promotions

- The system shall display active promotional offers with discount percentages.
- Each offer shall show the original price, discount badge, and calculated sale price.
- Each offer shall display its validity period (start date — end date).
- Users shall be able to add discounted products to the cart at the sale price.

### FR-04: Shopping Cart

- The system shall allow authenticated users to add products to their cart.
- The system shall allow users to increase or decrease item quantities.
- The system shall allow users to remove items from the cart.
- The cart shall display item subtotals and a running total.
- Cart operations shall sync with the backend API (optimistic updates with server reconciliation).
- The cart shall be fetched from the backend when a user logs in.

### FR-05: Checkout

- The system shall validate that all cart items have sufficient stock before placing an order.
- The system shall calculate the order total on the server side.
- The system shall create the order atomically (transaction) including order items and stock reduction.
- The system shall clear the user's cart after successful checkout.
- The system shall display an order confirmation with the new order ID.

### FR-06: Order Tracking

- The system shall display the user's order history sorted by date (newest first).
- Each order shall show the order ID, total amount, status, and creation date.
- Order statuses shall be displayed with visual badges: Processing, Shipped, Delivered.
- Empty order history shall show a message with a link to browse products.

### FR-07: Navigation

- The application shall provide a persistent sidebar with links to all sections.
- The active page shall be visually highlighted in the sidebar.
- The navbar shall display the logged-in user's name or "Guest".

## 6. Non-Functional Requirements

| ID     | Requirement                                                                  |
| ------ | ---------------------------------------------------------------------------- |
| NFR-01 | The application shall respond to API requests within 500ms under normal load |
| NFR-02 | All passwords shall be hashed using bcrypt before storage                    |
| NFR-03 | JWT tokens shall expire after 24 hours                                       |
| NFR-04 | The frontend shall be built with TypeScript for type safety                  |
| NFR-05 | The application shall follow RESTful API conventions                         |
| NFR-06 | The database shall use WAL mode for concurrent read performance              |
| NFR-07 | Foreign key constraints shall be enforced at the database level              |
| NFR-08 | The frontend shall be linted with ESLint with zero errors                    |
| NFR-09 | The application shall include automated unit/integration tests               |
| NFR-10 | CORS shall be configured to allow only the frontend origin                   |

## 7. User Roles

| Role     | Description                                                             |
| -------- | ----------------------------------------------------------------------- |
| Customer | Can log in, browse products, manage cart, place orders, track orders    |
| Guest    | Can view the login page only; all other features require authentication |

> **Note:** The prototype does not implement distinct admin roles. All authenticated users share the same permissions for simplicity.

## 8. User Stories

| ID   | As a...  | I want to...                            | So that...                                            |
| ---- | -------- | --------------------------------------- | ----------------------------------------------------- |
| US01 | Customer | Log in with my email and password       | I can access the e-commerce platform                  |
| US02 | Customer | View a catalog of available products    | I can find items I want to purchase                   |
| US03 | Customer | See current promotional offers          | I can take advantage of discounts                     |
| US04 | Customer | Add products to my shopping cart        | I can collect items before purchasing                 |
| US05 | Customer | Adjust quantities in my cart            | I can buy the right amount of each product            |
| US06 | Customer | Remove items from my cart               | I can change my mind before checkout                  |
| US07 | Customer | Proceed to checkout                     | I can complete my purchase                            |
| US08 | Customer | Receive an order confirmation           | I know my order was placed successfully               |
| US09 | Customer | View my order history                   | I can track my past and current orders                |
| US10 | Customer | See the status of each order            | I know whether it's processing, shipped, or delivered |
| US11 | Customer | Log out of the application              | My session is secured when I'm done                   |
| US12 | Customer | Navigate via the sidebar menu           | I can quickly move between sections                   |
| US13 | Customer | See my name displayed in the navbar     | I can confirm I'm logged in as the right user         |
| US14 | Customer | Add discounted products from offers     | I can purchase items at the promotional price         |
| US15 | Customer | See "Out of Stock" on unavailable items | I know which products are currently unavailable       |

---

_Document prepared for the Online Store Workshop — March 2026_
