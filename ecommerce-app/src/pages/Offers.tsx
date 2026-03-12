import { useState, useEffect } from 'react';
import { offerApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { formatCurrency, calcDiscountedPrice } from '../lib/helpers';
import type { Offer } from '../types';

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    offerApi
      .getAll()
      .then(setOffers)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load offers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container" data-testid="offers-page">
      <h1>Offers &amp; Promotions</h1>
      <p className="page-subtitle">Take advantage of our latest deals</p>

      {loading && <p className="loading-text">Loading offers…</p>}
      {error && <p className="alert alert-error" role="alert">{error}</p>}

      <div className="offers-grid" data-testid="offers-grid">
        {offers.map((offer) => {
          const discountedPrice = calcDiscountedPrice(offer.originalPrice, offer.discountPercentage);
          return (
            <div key={offer.id} className="offer-card" data-testid={`offer-card-${offer.id}`}>
              <div className="offer-badge" data-testid={`offer-badge-${offer.id}`}>
                {offer.discountPercentage}% OFF
              </div>
              <h3>{offer.productName}</h3>
              <div className="offer-pricing">
                <span className="offer-original-price" data-testid={`offer-original-${offer.id}`}>
                  {formatCurrency(offer.originalPrice)}
                </span>
                <span className="offer-discounted-price" data-testid={`offer-discounted-${offer.id}`}>
                  {formatCurrency(discountedPrice)}
                </span>
              </div>
              <p className="offer-validity">
                Valid: {offer.startDate} — {offer.endDate}
              </p>
              <button
                className="btn btn-primary"
                data-testid={`offer-add-${offer.id}`}
                onClick={() => addToCart({ id: offer.productId, name: offer.productName, price: discountedPrice })}
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
