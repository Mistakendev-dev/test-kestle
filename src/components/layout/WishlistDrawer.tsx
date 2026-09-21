import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { getGame } from '../../data/games';
import { formatPrice } from '../../lib/utils';
import { ProductArt } from '../ProductArt';
import { StockIndicator } from '../Badge';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export function WishlistDrawer() {
  const { isOpen, close, detailed, remove, count } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  useBodyScrollLock(isOpen);
  useEscapeKey(isOpen, close);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-void/70 backdrop-blur-sm"
            onClick={close}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-label="Wishlist"
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col border-l border-white/[0.08] bg-[#08080e]/95 shadow-deep backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-edge px-6 py-5">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-rose-300" />
                <h2 className="font-display text-lg font-semibold text-white">Wishlist</h2>
                {count > 0 && (
                  <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-300">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={close}
                aria-label="Close wishlist"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailed.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-edge bg-white/[0.03]">
                  <Heart className="h-7 w-7 text-zinc-600" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-white">Nothing saved yet</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Tap the heart on any product to keep it here for later.
                  </p>
                </div>
                <Link to="/products" onClick={close} className="btn-primary btn-shine mt-2">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <AnimatePresence initial={false}>
                  {detailed.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.3 }}
                      className="mb-3 flex gap-4 rounded-2xl border border-edge bg-white/[0.02] p-3"
                    >
                      <Link to={`/product/${product.id}`} onClick={close} className="shrink-0">
                        <ProductArt
                          gameId={product.id}
                          image={product.image}
                          alt={product.name}
                          size="sm"
                          className="h-16 w-20 rounded-xl"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                          {getGame(product.id)?.name}
                        </p>
                        <Link
                          to={`/product/${product.id}`}
                          onClick={close}
                          className="mt-0.5 block truncate text-sm font-semibold text-white hover:text-accent-bright"
                        >
                          {product.name}
                        </Link>
                        <StockIndicator stock={product.stock} className="mt-1" />
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="font-display text-sm font-bold text-white">
                            {formatPrice(product.price)}
                          </span>
                          <button
                            onClick={() => {
                              addItem(product.id);
                              toast('Added to cart', { detail: product.name });
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-edge bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-accent-light/50 hover:bg-accent/20 hover:text-white"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            Add
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        aria-label="Remove from wishlist"
                        className="self-start text-zinc-600 transition-colors hover:text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
