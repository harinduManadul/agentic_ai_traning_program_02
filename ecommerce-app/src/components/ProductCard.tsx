import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const outOfStock = product.stock === 0;

  return (
    <div
      className={`product-card${outOfStock ? ' out-of-stock' : ''}`}
      data-testid={`product-card-${product.id}`}
    >
      <div className="product-card-body">
        <h3 className="product-name" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <span className="product-price" data-testid={`product-price-${product.id}`}>
            ${product.price.toFixed(2)}
          </span>
          <span
            className={`product-stock${outOfStock ? ' stock-zero' : ''}`}
            data-testid={`product-stock-${product.id}`}
          >
            {outOfStock ? 'Out of Stock' : `${product.stock} in stock`}
          </span>
        </div>
      </div>
      <div className="product-card-footer">
        <button
          className="btn btn-primary"
          disabled={outOfStock}
          data-testid={`add-to-cart-${product.id}`}
          aria-label={`Add ${product.name} to cart`}
          onClick={onAddToCart}
        >
          {outOfStock ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
