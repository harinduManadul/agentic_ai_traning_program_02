import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productApi } from '../services/api';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    productApi
      .getAll()
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container" data-testid="products-page">
      <h1>Products</h1>
      <p className="page-subtitle">Browse our product catalog</p>

      {loading && <p className="loading-text">Loading products…</p>}
      {error && <p className="alert alert-error" role="alert">{error}</p>}

      <div className="products-grid" data-testid="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => addToCart({ id: product.id, name: product.name, price: product.price })}
          />
        ))}
      </div>
    </div>
  );
}
