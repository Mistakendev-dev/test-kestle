import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShieldCheck, ShoppingCart, Trash2, X, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';
import { ProductArt } from '../ProductArt';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export function CartDrawer() {
  const { isOpen, closeCart, detailed, setQty, removeItem, subtotal, count } = useCart();
  useBodyScrollLock(isOpen);
  useEscapeKey(isOpen, closeCart);

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
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col border-l border-white/[0.08] bg-[#08080e]/95 shadow-deep backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-edge px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-accent-bright" />
                <h2 className="font-display text-lg font-semibold text-white">Your Cart</h2>
                {count > 0 && (
                  <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent-bright">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailed.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-edge bg-white/[0.03]">
                  <ShoppingCart className="h-7 w-7 text-zinc-600" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-white">Your cart is empty</p>
                  <p className="mt-1 text-sm text-zinc-500">Browse the marketplace and add an account to get started.</p>
                </div>
                <Link to="/products" onClick={closeCart} className="btn-primary btn-shine mt-2">
                  Browse Products
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <AnimatePresence initial={false}>
                    {detailed.map(({ product, variant, qty }) => (
                      <motion.div
                        key={variant.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.3 }}
                        className="mb-3 flex gap-4 rounded-2xl border border-edge bg-white/[0.02] p-3"
                      >
                        <Link
                          to={`/products/${product.slug}?v=${variant.id}`}
                          onClick={closeCart}
                          className="shrink-0"
                        >
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
                            {product.name}
                          </p>
                          <Link
                            to={`/products/${product.slug}?v=${variant.id}`}
                            onClick={closeCart}
                            className="mt-0.5 block truncate text-sm font-semibold text-white hover:text-accent-bright"
                          >
                            {variant.name}
                          </Link>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-lg border border-edge bg-white/[0.03]">
                              <button
                                onClick={() => setQty(variant.id, qty - 1)}
                                aria-label="Decrease quantity"
                                className="flex h-7 w-7 items-center justify-center text-zinc-400 transition-colors hover:text-white"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-semibold text-white">{qty}</span>
                              <button
                                onClick={() => setQty(variant.id, qty + 1)}
                                aria-label="Increase quantity"
                                className="flex h-7 w-7 items-center justify-center text-zinc-400 transition-colors hover:text-white"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="font-display text-sm font-bold text-white">
                              {formatPrice(variant.price * qty)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(variant.id)}
                          aria-label="Remove item"
                          className="self-start text-zinc-600 transition-colors hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-edge px-6 py-5">
                  <div className="mb-1 flex items-center justify-between text-sm text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-display text-xl font-bold text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mb-4 text-xs text-zinc-600">Taxes calculated at checkout. Delivery is instant.</p>
                  <button type="button" className="btn-primary btn-shine w-full !py-3.5 text-base">
                    Checkout
                  </button>
                  <p className="mt-2 text-center text-[11px] text-zinc-600">Demo storefront — checkout is disabled.</p>
                  <div className="mt-4 flex items-center justify-center gap-5 text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent-bright" /> Secure checkout
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-accent-bright" /> Instant delivery
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
