import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { cartApi, orderApi } from '../services/api';
import type { CartItemData, OrderConfirmation } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItemData[];
  addToCart: (product: { id: number; name: string; price: number }) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  checkout: () => Promise<OrderConfirmation>;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemData[]>([]);
  const { isAuthenticated } = useAuth();

  // Fetch cart from backend when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    cartApi
      .getCart()
      .then((data) => { if (!cancelled) setItems(data); })
      .catch(() => { /* silently fail — cart will appear empty */ });
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Derive effective items — empty when not authenticated
  const effectiveItems = useMemo(() => isAuthenticated ? items : [], [isAuthenticated, items]);

  const addToCart = useCallback(async (product: { id: number; name: string; price: number }) => {
    // Optimistic local update
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: Date.now(), productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    // Sync with backend
    try {
      const updated = await cartApi.addToCart(product.id);
      setItems(updated);
    } catch { /* keep optimistic state */ }
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeItem = useCallback(async (productId: number) => {
    // Optimistic local update
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    // Sync with backend
    try {
      const updated = await cartApi.removeFromCart(productId);
      setItems(updated);
    } catch { /* keep optimistic state */ }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const checkout = useCallback(async (): Promise<OrderConfirmation> => {
    const payload = effectiveItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    const confirmation = await orderApi.create(payload);
    setItems([]);
    return confirmation;
  }, [effectiveItems]);

  const total = effectiveItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items: effectiveItems, addToCart, updateQuantity, removeItem, checkout, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
