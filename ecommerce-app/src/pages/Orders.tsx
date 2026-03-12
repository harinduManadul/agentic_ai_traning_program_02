import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderStatus from '../components/OrderStatus';
import { orderApi } from '../services/api';
import { formatCurrency } from '../lib/helpers';
import type { Order } from '../types';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi
      .getAll()
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container" data-testid="orders-page">
      <h1>My Orders</h1>
      <p className="page-subtitle">Track the status of your orders</p>

      {loading && <p className="loading-text">Loading orders…</p>}
      {error && <p className="alert alert-error" role="alert">{error}</p>}

      {!loading && orders.length === 0 ? (
        <div className="empty-state" data-testid="orders-empty">
          <p>You haven&apos;t placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list" data-testid="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card" data-testid={`order-card-${order.id}`}>
              <div className="order-header">
                <span className="order-id" data-testid={`order-id-${order.id}`}>
                  Order #{order.id}
                </span>
                <span className="order-date">{order.createdAt}</span>
              </div>
              <div className="order-details">
                <span className="order-amount" data-testid={`order-amount-${order.id}`}>
                  {formatCurrency(order.totalAmount)}
                </span>
                <OrderStatus status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
