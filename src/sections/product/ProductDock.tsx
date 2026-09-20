import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../../data/products';
import { getGame } from '../../data/games';
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
  qty,
  visible,
}: {
  product: Product;
  qty: number;
  visible: boolean;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const game = getGame(product.game);

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
              gameId={product.game}
              image={product.image}
              alt=""
              size="sm"
              className="hidden h-12 w-[72px] shrink-0 rounded-lg sm:block"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{product.name}</p>
              <p className="truncate text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                {game?.name} · {product.category}
              </p>
            </div>
            <span className="shrink-0 font-display text-xl font-bold text-white sm:text-2xl">
              {formatPrice(product.price * qty)}
            </span>
            <button
              onClick={() => {
                addItem(product.id, qty);
                toast('Added to cart', { detail: `${qty} × ${product.name}` });
              }}
              className="btn-primary btn-shine h-11 shrink-0 px-5 text-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="max-sm:hidden">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
