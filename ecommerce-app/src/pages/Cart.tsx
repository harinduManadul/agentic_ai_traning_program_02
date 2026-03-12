import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/helpers';

export default function Cart() {
  const { items, updateQuantity, removeItem, checkout, total } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [confirmation, setConfirmation] = useState<{ orderId: number; message: string } | null>(null);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setError('');
    setCheckingOut(true);
    try {
      const result = await checkout();
      setConfirmation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  if (confirmation) {
    return (
      <div className="page-container" data-testid="cart-page">
        <div className="checkout-success" data-testid="checkout-success">
          <h1>Order Confirmed!</h1>
          <p>{confirmation.message}</p>
          <p className="order-id-display">Order ID: <strong>#{confirmation.orderId}</strong></p>
          <Link to="/orders" className="btn btn-primary">View Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" data-testid="cart-page">
      <h1>Shopping Cart</h1>
      <p className="page-subtitle">Review your items before checkout</p>

      {error && <p className="alert alert-error" role="alert">{error}</p>}

      {items.length === 0 ? (
        <div className="empty-state" data-testid="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <>
          <div className="cart-items" data-testid="cart-items">
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdateQuantity={(qty) => updateQuantity(item.productId, qty)}
                onRemove={() => removeItem(item.productId)}
              />
            ))}
          </div>

          <div className="cart-summary" data-testid="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span data-testid="cart-total-amount">{formatCurrency(total)}</span>
            </div>
            <button
              className="btn btn-primary btn-block"
              data-testid="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? 'Processing…' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
