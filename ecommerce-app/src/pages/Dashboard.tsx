import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="page-container" data-testid="dashboard-page">
      <h1>Dashboard</h1>
      <p className="page-subtitle">Welcome to Online Store</p>

      <div className="dashboard-grid">
        <div className="dashboard-card" data-testid="dashboard-products-card">
          <div className="dashboard-card-icon">📦</div>
          <h3>Products</h3>
          <p>Browse our product catalog</p>
          <Link to="/products" className="btn btn-outline">View Products</Link>
        </div>

        <div className="dashboard-card" data-testid="dashboard-offers-card">
          <div className="dashboard-card-icon">🏷️</div>
          <h3>Offers</h3>
          <p>Check out the latest deals</p>
          <Link to="/offers" className="btn btn-outline">View Offers</Link>
        </div>

        <div className="dashboard-card" data-testid="dashboard-cart-card">
          <div className="dashboard-card-icon">🛒</div>
          <h3>Cart</h3>
          <p>Review items in your cart</p>
          <Link to="/cart" className="btn btn-outline">Go to Cart</Link>
        </div>

        <div className="dashboard-card" data-testid="dashboard-orders-card">
          <div className="dashboard-card-icon">📋</div>
          <h3>Orders</h3>
          <p>Track your order status</p>
          <Link to="/orders" className="btn btn-outline">View Orders</Link>
        </div>
      </div>
    </div>
  );
}
