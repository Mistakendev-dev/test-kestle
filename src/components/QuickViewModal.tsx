import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, X } from 'lucide-react';
import type { Product } from '../data/products';
import { getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { ProductArt } from './ProductArt';
import { Badge, StockIndicator } from './Badge';
import { WishlistButton } from './WishlistButton';

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  useBodyScrollLock(Boolean(product));

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  const game = product ? getGame(product.game) : null;

  return (
    <AnimatePresence>
      {product && (
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
            className="glass-strong relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl sm:rounded-3xl"
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
                  gameId={product.game}
                  image={product.image}
                  alt={product.name}
                  label={product.category}
                  className="aspect-[16/11] w-full sm:h-full sm:aspect-auto"
                />
                {product.badge && <Badge label={product.badge} className="absolute left-4 top-4" />}
              </div>

              <div className="flex flex-col gap-3 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-bright">
                  {game?.name}
                </p>
                <h3 className="font-display text-xl font-bold leading-tight text-white">{product.name}</h3>
                <StockIndicator stock={product.stock} />
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-white">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-zinc-600 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <p className="line-clamp-4 text-sm leading-relaxed text-zinc-400">{product.description}</p>

                <div className="mt-auto flex flex-col gap-2 pt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        addItem(product.id);
                        toast('Added to cart', { detail: product.name });
                      }}
                      className="btn-primary btn-shine flex-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <WishlistButton productId={product.id} size="md" />
                  </div>
                  <Link to={`/product/${product.id}`} onClick={onClose} className="btn-ghost w-full">
                    View Product
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
