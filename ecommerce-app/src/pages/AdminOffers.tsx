import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { offerApi, productApi } from '../services/api';
import type { Offer, Product } from '../types';

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: '', discountPercentage: '', startDate: '', endDate: '' });

  useEffect(() => {
    Promise.all([offerApi.getAll(), productApi.getAll()])
      .then(([o, p]) => { setOffers(o); setProducts(p); })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setForm({ productId: '', discountPercentage: '', startDate: '', endDate: '' });
    setShowForm(false);
    setError('');
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this offer?')) return;
    try {
      await offerApi.delete(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const created = await offerApi.create({
        productId: parseInt(form.productId, 10),
        discountPercentage: parseFloat(form.discountPercentage),
        startDate: form.startDate,
        endDate: form.endDate,
      });
      // Re-fetch offers to get joined product data
      const updatedOffers = await offerApi.getAll();
      setOffers(updatedOffers);
      void created;
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create offer');
    }
  }

  if (loading) return <div className="loading-text">Loading offers…</div>;

  return (
    <div className="page-container">
      <div className="admin-header">
        <h1>Manage Offers</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Create Offer
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="admin-form-card">
          <h3>New Offer</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="productId">Product</label>
                <select id="productId" value={form.productId} required
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}>
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — ${p.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="discount">Discount %</label>
                <input id="discount" type="number" min="1" max="99" step="1" value={form.discountPercentage} required
                  onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input id="startDate" type="date" value={form.startDate} required
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input id="endDate" type="date" value={form.endDate} required
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Create Offer</button>
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Discount</th>
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.productName ?? `Product #${o.productId}`}</td>
                <td>{o.discountPercentage}%</td>
                <td>{o.startDate}</td>
                <td>{o.endDate}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(o.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {offers.length === 0 && (
              <tr><td colSpan={6} className="empty-cell">No offers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
