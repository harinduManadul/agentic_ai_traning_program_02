require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { getDb } = require('./database');

function seed() {
  const db = getDb();

  // Clear existing data and reset auto-increment
  db.exec(`
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM cart_items;
    DELETE FROM offers;
    DELETE FROM products;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `);

  // Seed admin from environment variables
  const adminName = process.env.ADMIN_NAME || 'Admin User';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@onlinestore.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  // Seed users
  const passwordHash = bcrypt.hashSync('password123', 10);
  const adminHash = bcrypt.hashSync(adminPassword, 10);
  const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
  insertUser.run('John Doe', 'john@example.com', passwordHash, 'customer');
  insertUser.run('Jane Smith', 'jane@example.com', passwordHash, 'customer');
  insertUser.run(adminName, adminEmail, adminHash, 'admin');

  // Seed products
  const insertProduct = db.prepare('INSERT INTO products (name, price, stock, description) VALUES (?, ?, ?, ?)');
  insertProduct.run('Wireless Headphones', 79.99, 25, 'Premium wireless headphones with noise cancellation.');
  insertProduct.run('Smart Watch', 199.99, 15, 'Feature-rich smartwatch with health tracking.');
  insertProduct.run('Laptop Stand', 49.99, 50, 'Ergonomic aluminum laptop stand.');
  insertProduct.run('USB-C Hub', 34.99, 0, '7-in-1 USB-C hub with HDMI output.');
  insertProduct.run('Mechanical Keyboard', 129.99, 30, 'RGB mechanical keyboard with Cherry MX switches.');
  insertProduct.run('Webcam HD', 59.99, 20, '1080p HD webcam with built-in microphone.');

  // Seed offers
  const insertOffer = db.prepare('INSERT INTO offers (product_id, discount_percentage, start_date, end_date) VALUES (?, ?, ?, ?)');
  insertOffer.run(1, 20, '2026-03-01', '2026-03-31');
  insertOffer.run(2, 15, '2026-03-01', '2026-03-31');
  insertOffer.run(3, 10, '2026-03-10', '2026-04-10');

  // Seed orders for user 1
  const insertOrder = db.prepare('INSERT INTO orders (user_id, total_price, status, created_at) VALUES (?, ?, ?, ?)');
  const insertOrderItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');

  const order1 = insertOrder.run(1, 209.97, 'Delivered', '2026-03-01');
  insertOrderItem.run(order1.lastInsertRowid, 1, 2, 79.99);
  insertOrderItem.run(order1.lastInsertRowid, 3, 1, 49.99);

  const order2 = insertOrder.run(1, 129.99, 'Shipped', '2026-03-08');
  insertOrderItem.run(order2.lastInsertRowid, 5, 1, 129.99);

  const order3 = insertOrder.run(1, 49.99, 'Processing', '2026-03-12');
  insertOrderItem.run(order3.lastInsertRowid, 3, 1, 49.99);

  console.log('Database seeded successfully.');
}

seed();
