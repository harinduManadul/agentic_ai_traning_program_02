const express = require('express');
const { getDb } = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/offers
router.get('/', (req, res) => {
  const db = getDb();
  const offers = db.prepare(`
    SELECT
      o.id,
      o.product_id AS productId,
      p.name AS productName,
      p.price AS originalPrice,
      o.discount_percentage AS discountPercentage,
      o.start_date AS startDate,
      o.end_date AS endDate
    FROM offers o
    JOIN products p ON p.id = o.product_id
  `).all();
  res.json(offers);
});

// POST /api/offers (admin only)
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { productId, discountPercentage, startDate, endDate } = req.body;

  if (!productId || discountPercentage == null || !startDate || !endDate) {
    return res.status(400).json({ error: 'productId, discountPercentage, startDate, and endDate are required' });
  }

  const db = getDb();
  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const result = db.prepare(
    'INSERT INTO offers (product_id, discount_percentage, start_date, end_date) VALUES (?, ?, ?, ?)'
  ).run(productId, discountPercentage, startDate, endDate);

  const offer = db.prepare(`
    SELECT o.id, o.product_id AS productId, p.name AS productName, p.price AS originalPrice,
           o.discount_percentage AS discountPercentage, o.start_date AS startDate, o.end_date AS endDate
    FROM offers o JOIN products p ON p.id = o.product_id
    WHERE o.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(offer);
});

// DELETE /api/offers/:id (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const db = getDb();
  const offer = db.prepare('SELECT id FROM offers WHERE id = ?').get(req.params.id);
  if (!offer) {
    return res.status(404).json({ error: 'Offer not found' });
  }
  db.prepare('DELETE FROM offers WHERE id = ?').run(req.params.id);
  res.json({ message: 'Offer deleted' });
});

module.exports = router;
