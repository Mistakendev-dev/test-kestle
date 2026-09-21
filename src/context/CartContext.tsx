import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { GameProduct, Variant } from '../data/products';
import { findVariant } from '../data/products';

/** Keyed on the variant, so two options of the same game are separate lines. */
export interface CartItem {
  productId: string;
  variantId: string;
  qty: number;
}

export interface CartLine {
  product: GameProduct;
  variant: Variant;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, qty?: number) => void;
  removeItem: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  detailed: CartLine[];
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((variantId: string, qty = 1) => {
    const found = findVariant(variantId);
    if (!found) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === variantId);
      if (existing) {
        return prev.map((i) => (i.variantId === variantId ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { productId: found.product.id, variantId, qty }];
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.variantId !== variantId)
        : prev.map((i) => (i.variantId === variantId ? { ...i, qty } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const detailed = useMemo(
    () =>
      items
        .map((i) => {
          const found = findVariant(i.variantId);
          return found ? { product: found.product, variant: found.variant, qty: i.qty } : null;
        })
        .filter((line): line is CartLine => line !== null),
    [items],
  );

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => detailed.reduce((s, line) => s + line.variant.price * line.qty, 0),
    [detailed],
  );

  const value = useMemo(
    () => ({ items, isOpen, openCart, closeCart, addItem, removeItem, setQty, clear, count, subtotal, detailed }),
    [items, isOpen, openCart, closeCart, addItem, removeItem, setQty, clear, count, subtotal, detailed],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
