import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import type { GameProduct, Variant } from '../../data/products';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';
import { StockBadge } from '../../components/Badge';

/**
 * The purchase decision for the currently selected option. Every figure here —
 * price, stock, whether buying is possible — comes from the variant, never the
 * game, so switching options updates the whole panel at once.
 */
export function ProductPurchasePanel({
  product,
  variant,
  qty,
  onQty,
}: {
  product: GameProduct;
  variant: Variant;
  qty: number;
  onQty: (next: number) => void;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { has, toggle } = useWishlist();
  const saved = has(product.id);

  return (
    <div className="pane-hero lit-edge flex flex-col gap-6 p-5 sm:p-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Selected option
        </p>
        <p className="mt-2 font-display text-xl font-semibold leading-snug text-white">
          {variant.name}
        </p>
        <StockBadge stock={variant.stock} className="mt-2" />
      </div>

      <div className="border-t border-white/[0.08] pt-5">
        <span className="font-display text-[2.75rem] font-bold leading-none tracking-tight text-white">
          {formatPrice(variant.price)}
        </span>
      </div>

      {variant.available ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04]">
            <button
              onClick={() => onQty(qty - 1)}
              aria-label="Decrease quantity"
              className="flex h-13 w-14 items-center justify-center py-3.5 text-zinc-400 transition-colors hover:text-white"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span
              className="w-10 text-center font-display text-lg font-bold text-white"
              aria-live="polite"
            >
              {qty}
            </span>
            <button
              onClick={() => onQty(qty + 1)}
              aria-label="Increase quantity"
              className="flex h-13 w-14 items-center justify-center py-3.5 text-zinc-400 transition-colors hover:text-white"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={() => {
              addItem(variant.id, qty);
              toast('Added to cart', {
                detail: `${qty} × ${product.name} — ${variant.name}`,
              });
            }}
            className="btn-primary btn-shine h-14 w-full whitespace-nowrap px-6 text-base shadow-[0_0_44px_-12px_rgba(74,79,158,0.95)]"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart — {formatPrice(variant.price * qty)}
          </button>
        </div>
      ) : (
        <button
          disabled
          className="h-14 w-full cursor-not-allowed rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-semibold text-zinc-500"
        >
          Out of stock
        </button>
      )}

      <button
        onClick={() => toggle(product.id)}
        aria-pressed={saved}
        aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-zinc-300 transition-colors duration-300 hover:border-accent-light/50 hover:text-white"
      >
        <Heart className={`h-4.5 w-4.5 ${saved ? 'fill-accent-bright text-accent-bright' : ''}`} />
        {saved ? 'Saved' : 'Save for later'}
      </button>
    </div>
  );
}
