import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, X } from 'lucide-react';
import type { Product, Variant } from '../data/products';
import { defaultVariant } from '../data/products';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { ProductArt } from './ProductArt';
import { StockBadge } from './Badge';
import { WishlistButton } from './WishlistButton';
import { VariantSelector } from './variants/VariantSelector';

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Variant | null>(null);

  useBodyScrollLock(Boolean(product));

  // A game has no single price, so quick view always opens on a concrete
  // option — the first in stock — and resets whenever the game changes.
  useEffect(() => {
    setSelected(product ? defaultVariant(product) : null);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          className="fixed inset-0 z-[92] flex items-end justify-center bg-void/80 backdrop-blur-md sm:items-center sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="pane-raised max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-b-none rounded-t-3xl sm:rounded-b-3xl"
          >
            <button
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-edge bg-void/70 text-zinc-400 backdrop-blur-md transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid sm:grid-cols-2">
              <div className="relative">
                <ProductArt
                  gameId={product.id}
                  image={product.image}
                  alt={product.name}
                  label={product.genre}
                  className="aspect-[16/11] w-full sm:h-full sm:aspect-auto"
                />
              </div>

              <div className="flex flex-col gap-3 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-bright">
                  {product.variantCount} option{product.variantCount === 1 ? '' : 's'}
                </p>
                <h3 className="font-display text-xl font-bold leading-tight text-white">{product.name}</h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">{product.description}</p>

                <div className="mt-1">
                  <VariantSelector
                    product={product}
                    selectedId={selected.id}
                    onSelect={setSelected}
                    compact
                  />
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-4">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs text-zinc-500">{selected.name}</p>
                      <StockBadge stock={selected.stock} className="mt-1" />
                    </div>
                    <span className="shrink-0 font-display text-3xl font-bold text-white">
                      {formatPrice(selected.price)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        addItem(selected.id);
                        toast('Added to cart', { detail: `${product.name} · ${selected.name}` });
                      }}
                      disabled={!selected.available}
                      className="btn-primary btn-shine flex-1 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {selected.available ? 'Add to Cart' : 'Out of stock'}
                    </button>
                    <WishlistButton productId={product.id} size="md" />
                  </div>

                  <Link
                    to={`/products/${product.slug}?v=${selected.id}`}
                    onClick={onClose}
                    className="btn-ghost w-full"
                  >
                    View all options
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
