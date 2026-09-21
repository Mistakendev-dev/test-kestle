import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { GameProduct, Variant } from '../../data/products';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { ProductArt } from '../../components/ProductArt';

/**
 * Slim glass bar that docks to the bottom of the viewport once the hero's
 * purchase rail has scrolled away, so the price and the buy action stay one
 * click from anywhere on a long page.
 *
 * Sits below the drawers and navigation in the stacking order (z-50) so an
 * open cart always covers it.
 */
export function ProductDock({
  product,
  variant,
  qty,
  visible,
}: {
  product: GameProduct;
  variant: Variant;
  qty: number;
  visible: boolean;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#07070d]/85 backdrop-blur-2xl"
        >
          <div className="container-wide flex items-center gap-4 py-3">
            <ProductArt
              gameId={product.id}
              image={product.image}
              alt=""
              size="sm"
              className="hidden h-12 w-[72px] shrink-0 rounded-lg sm:block"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{product.name}</p>
              <p className="truncate text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                {variant.name}
              </p>
            </div>
            <span className="shrink-0 font-display text-xl font-bold text-white sm:text-2xl">
              {formatPrice(variant.price * qty)}
            </span>
            <button
              onClick={() => {
                addItem(variant.id, qty);
                toast('Added to cart', {
                  detail: `${qty} × ${product.name} — ${variant.name}`,
                });
              }}
              disabled={!variant.available}
              className="btn-primary btn-shine h-11 shrink-0 px-5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="max-sm:hidden">{variant.available ? 'Add to Cart' : 'Out of stock'}</span>
              <span className="sm:hidden">{variant.available ? 'Add' : '—'}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
