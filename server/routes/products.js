const express = require('express');
const { getDb } = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/products
router.get('/', (req, res) => {
  const db = getDb();
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST /api/products (admin only)
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { name, price, stock, description } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO products (name, price, stock, description) VALUES (?, ?, ?, ?)'
  ).run(name, price, stock ?? 0, description ?? '');

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(product);
});

// PUT /api/products/:id (admin only)
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const { name, price, stock, description } = req.body;
  const db = getDb();

  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.prepare(
    'UPDATE products SET name = ?, price = ?, stock = ?, description = ? WHERE id = ?'
  ).run(
    name ?? existing.name,
    price ?? existing.price,
    stock ?? existing.stock,
    description ?? existing.description,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/products/:id (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
