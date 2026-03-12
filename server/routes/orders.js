const express = require('express');
const { getDb } = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// GET /api/orders/admin/all (admin only — all orders from all users)
// NOTE: Must be defined BEFORE /:id to avoid Express matching "admin" as :id
router.get('/admin/all', requireAdmin, (req, res) => {
  const db = getDb();
  const orders = db.prepare(`
    SELECT o.id, o.user_id AS userId, u.name AS userName, u.email AS userEmail,
           o.total_price AS totalAmount, o.status, o.created_at AS createdAt
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
  `).all();
  res.json(orders);
});

// PUT /api/orders/admin/:id/status (admin only — update order status)
router.put('/admin/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  const updated = db.prepare(`
    SELECT o.id, o.user_id AS userId, u.name AS userName, u.email AS userEmail,
           o.total_price AS totalAmount, o.status, o.created_at AS createdAt
    FROM orders o
    JOIN users u ON u.id = o.user_id
    WHERE o.id = ?
  `).get(req.params.id);
  res.json(updated);
});

// GET /api/orders
router.get('/', (req, res) => {
  const db = getDb();
  const orders = db.prepare(`
    SELECT id, user_id AS userId, total_price AS totalAmount, status, created_at AS createdAt
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(req.user.id);
  res.json(orders);
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const order = db.prepare(`
    SELECT id, user_id AS userId, total_price AS totalAmount, status, created_at AS createdAt
    FROM orders
    WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const items = db.prepare(`
    SELECT oi.id, oi.product_id AS productId, p.name AS productName, oi.quantity, oi.price
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
  `).all(order.id);

  res.json({ ...order, items });
});

// POST /api/orders
router.post('/', (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const db = getDb();

  // Validate all products exist and have stock
  const products = [];
  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity < 1) {
      return res.status(400).json({ error: 'Each item needs productId and quantity >= 1' });
    }
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
    if (!product) {
      return res.status(404).json({ error: `Product ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    }
    products.push({ ...product, orderQty: item.quantity });
  }

  // Calculate total
  const totalPrice = products.reduce((sum, p) => sum + p.price * p.orderQty, 0);

  // Use a transaction for atomicity
  const createOrder = db.transaction(() => {
    const orderResult = db.prepare(
      'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)'
    ).run(req.user.id, totalPrice, 'Processing');

    const orderId = orderResult.lastInsertRowid;
    const insertItem = db.prepare(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
    );
    const updateStock = db.prepare(
      'UPDATE products SET stock = stock - ? WHERE id = ?'
    );

    for (const p of products) {
      insertItem.run(orderId, p.id, p.orderQty, p.price);
      updateStock.run(p.orderQty, p.id);
    }

    // Clear user's cart
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);

    return orderId;
  });

  const orderId = createOrder();
  res.status(201).json({ orderId, message: 'Order placed successfully' });
});

module.exports = router;
