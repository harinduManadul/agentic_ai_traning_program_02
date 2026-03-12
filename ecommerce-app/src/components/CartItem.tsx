import type { CartItemData } from '../types';
import { formatCurrency } from '../lib/helpers';

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const subtotal = item.price * item.quantity;

  return (
    <div className="cart-item" data-testid={`cart-item-${item.id}`}>
      <div className="cart-item-info">
        <h4 className="cart-item-name" data-testid={`cart-item-name-${item.id}`}>
          {item.name}
        </h4>
        <span className="cart-item-price">{formatCurrency(item.price)} each</span>
      </div>

      <div className="cart-item-controls">
        <button
          className="btn btn-sm btn-secondary"
          data-testid={`cart-item-dec-${item.id}`}
          aria-label={`Decrease quantity for ${item.name}`}
          onClick={() => onUpdateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <label htmlFor={`qty-${item.id}`} className="sr-only">
          Quantity for {item.name}
        </label>
        <input
          id={`qty-${item.id}`}
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val >= 1) onUpdateQuantity(val);
          }}
          className="cart-item-qty"
          data-testid={`cart-item-qty-${item.id}`}
        />
        <button
          className="btn btn-sm btn-secondary"
          data-testid={`cart-item-inc-${item.id}`}
          aria-label={`Increase quantity for ${item.name}`}
          onClick={() => onUpdateQuantity(item.quantity + 1)}
        >
          +
        </button>
      </div>

      <div className="cart-item-subtotal" data-testid={`cart-item-subtotal-${item.id}`}>
        {formatCurrency(subtotal)}
      </div>

      <button
        className="btn btn-danger btn-sm"
        data-testid={`cart-item-remove-${item.id}`}
        aria-label={`Remove ${item.name} from cart`}
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  );
}
