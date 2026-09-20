import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import type { Product } from '../../data/products';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';
import { StockIndicator } from '../../components/Badge';

/**
 * The purchase decision as a single horizontal rail under the stage, rather
 * than a boxed card beside it. Price reads first, controls sit at the far end,
 * and nothing competes with the artwork above.
 */
export function ProductPurchase({
  product,
  qty,
  onQty,
}: {
  product: Product;
  qty: number;
  onQty: (next: number) => void;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { has, toggle } = useWishlist();
  const saved = has(product.id);

  return (
    <div className="pane-hero lit-edge flex flex-col gap-7 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-7">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex items-end gap-3">
          <span className="font-display text-[2.75rem] font-bold leading-none tracking-tight text-white lg:text-5xl">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <div className="flex flex-col gap-1 pb-1">
              <span className="text-base leading-none text-zinc-600 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs font-bold leading-none text-emerald-400">
                Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            </div>
          )}
        </div>
        <div className="h-9 w-px shrink-0 bg-white/10 max-lg:hidden" />
        <StockIndicator stock={product.stock} className="text-sm" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch lg:shrink-0">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] sm:justify-start">
          <button
            onClick={() => onQty(qty - 1)}
            aria-label="Decrease quantity"
            className="flex h-14 w-14 items-center justify-center text-zinc-400 transition-colors hover:text-white"
          >
            <Minus className="h-5 w-5" />
          </button>
          <span className="w-10 text-center font-display text-lg font-bold text-white" aria-live="polite">
            {qty}
          </span>
          <button
            onClick={() => onQty(qty + 1)}
            aria-label="Increase quantity"
            className="flex h-14 w-14 items-center justify-center text-zinc-400 transition-colors hover:text-white"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={() => {
            addItem(product.id, qty);
            toast('Added to cart', { detail: `${qty} × ${product.name}` });
          }}
          className="btn-primary btn-shine h-14 flex-1 whitespace-nowrap px-7 text-base shadow-[0_0_44px_-12px_rgba(74,79,158,0.95)] sm:flex-none"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart — {formatPrice(product.price * qty)}
        </button>

        <button
          onClick={() => toggle(product.id)}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-zinc-300 transition-colors duration-300 hover:border-accent-light/50 hover:text-white sm:w-14"
        >
          <Heart className={`h-5 w-5 ${saved ? 'fill-accent-bright text-accent-bright' : ''}`} />
          <span className="sm:hidden">{saved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
}
