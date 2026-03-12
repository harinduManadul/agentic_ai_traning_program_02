const express = require('express');
const { getDb } = require('../db/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// GET /api/cart
router.get('/', (req, res) => {
  const db = getDb();
  const items = db.prepare(`
    SELECT
      c.id,
      c.product_id AS productId,
      p.name,
      p.price,
      c.quantity
    FROM cart_items c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
  `).all(req.user.id);
  res.json(items);
});

// POST /api/cart/add
router.post('/add', (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const qty = quantity ?? 1;
  const existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(req.user.id, productId);

  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(qty, existing.id);
  } else {
    db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(req.user.id, productId, qty);
  }

  const items = db.prepare(`
    SELECT c.id, c.product_id AS productId, p.name, p.price, c.quantity
    FROM cart_items c JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
  `).all(req.user.id);
  res.json(items);
});

// POST /api/cart/remove
router.post('/remove', (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  const db = getDb();
  db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(req.user.id, productId);

  const items = db.prepare(`
    SELECT c.id, c.product_id AS productId, p.name, p.price, c.quantity
    FROM cart_items c JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
  `).all(req.user.id);
  res.json(items);
});

module.exports = router;
