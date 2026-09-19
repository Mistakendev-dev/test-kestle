import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProduct, type Product } from '../data/products';
import { useToast } from './ToastContext';

const STORAGE_KEY = 'nfa-wishlist';

interface WishlistContextValue {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  detailed: Product[];
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => setIds(read()), []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — wishlist stays in memory */
    }
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: string) => {
      const name = getProduct(id)?.name;
      if (ids.includes(id)) {
        persist(ids.filter((x) => x !== id));
        toast('Removed from wishlist', { detail: name, kind: 'remove' });
      } else {
        persist([id, ...ids]);
        toast('Added to wishlist', { detail: name, kind: 'wishlist' });
      }
    },
    [ids, persist, toast],
  );

  const remove = useCallback(
    (id: string) => {
      persist(ids.filter((x) => x !== id));
      toast('Removed from wishlist', { detail: getProduct(id)?.name, kind: 'remove' });
    },
    [ids, persist, toast],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const detailed = useMemo(
    () => ids.map(getProduct).filter((p): p is Product => Boolean(p)),
    [ids],
  );

  const value = useMemo(
    () => ({
      ids,
      has,
      toggle,
      remove,
      clear,
      count: ids.length,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      detailed,
    }),
    [ids, has, toggle, remove, clear, isOpen, detailed],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
