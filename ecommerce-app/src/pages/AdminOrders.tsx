import { useState, useEffect } from 'react';
import { adminOrderApi } from '../services/api';
import type { AdminOrder } from '../types';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered'] as const;

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminOrderApi
      .getAll()
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(orderId: number, newStatus: string) {
    try {
      const updated = await adminOrderApi.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  if (loading) return <div className="loading-text">Loading orders…</div>;

  return (
    <div className="page-container">
      <div className="admin-header">
        <h1>Manage Orders</h1>
        <span className="admin-count">{orders.length} total orders</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.userName}</td>
                <td>{o.userEmail}</td>
                <td>${o.totalAmount.toFixed(2)}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    className={`status-select status-${o.status.toLowerCase()}`}
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="empty-cell">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
