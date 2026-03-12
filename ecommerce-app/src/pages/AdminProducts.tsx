import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { productApi } from '../services/api';
import type { Product } from '../types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '' });
  const [inlineEdit, setInlineEdit] = useState<{ id: number; price: string; stock: string } | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ name: '', price: '', stock: '', description: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  }

  function handleEdit(product: Product) {
    setForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description,
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productApi.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

  function startInlineEdit(product: Product) {
    setInlineEdit({ id: product.id, price: String(product.price), stock: String(product.stock) });
  }

  async function saveInlineEdit() {
    if (!inlineEdit) return;
    setError('');
    try {
      const updated = await productApi.update(inlineEdit.id, {
        price: parseFloat(inlineEdit.price),
        stock: parseInt(inlineEdit.stock, 10) || 0,
      });
      setProducts((prev) => prev.map((p) => (p.id === inlineEdit.id ? updated : p)));
      setInlineEdit(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const data = {
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10) || 0,
      description: form.description,
    };

    try {
      if (editingId) {
        const updated = await productApi.update(editingId, data);
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await productApi.create(data);
        setProducts((prev) => [...prev, created]);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    }
  }

  if (loading) return <div className="loading-text">Loading products…</div>;

  return (
    <div className="page-container">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Add Product
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="admin-form-card">
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input id="name" type="text" value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input id="price" type="number" step="0.01" min="0" value={form.price} required
                  onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input id="stock" type="number" min="0" value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input id="description" type="text" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
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
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>
                  {inlineEdit?.id === p.id ? (
                    <input type="number" step="0.01" min="0" className="inline-input"
                      value={inlineEdit.price}
                      onChange={(e) => setInlineEdit({ ...inlineEdit, price: e.target.value })} />
                  ) : (
                    <span className="inline-value" onClick={() => startInlineEdit(p)}>${p.price.toFixed(2)}</span>
                  )}
                </td>
                <td>
                  {inlineEdit?.id === p.id ? (
                    <input type="number" min="0" className="inline-input"
                      value={inlineEdit.stock}
                      onChange={(e) => setInlineEdit({ ...inlineEdit, stock: e.target.value })} />
                  ) : (
                    <span className={`inline-value${p.stock === 0 ? ' text-danger' : ''}`} onClick={() => startInlineEdit(p)}>{p.stock}</span>
                  )}
                </td>
                <td className="td-desc">{p.description}</td>
                <td>
                  <div className="action-btns">
                    {inlineEdit?.id === p.id ? (
                      <>
                        <button className="btn btn-sm btn-primary" onClick={saveInlineEdit}>Save</button>
                        <button className="btn btn-sm btn-outline" onClick={() => setInlineEdit(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-outline" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="empty-cell">No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
