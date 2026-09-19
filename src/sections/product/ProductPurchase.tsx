import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Check, Headset, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Zap } from 'lucide-react';
import type { Product } from '../../data/products';
import { getGame } from '../../data/games';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';
import { StockIndicator } from '../../components/Badge';

const assurances = [
  { icon: Zap, title: 'Fast delivery', text: 'Sent automatically after checkout' },
  { icon: ShieldCheck, title: 'Secure checkout', text: 'Encrypted payment handling' },
  { icon: Headset, title: '24/7 support', text: 'Reach us any time on Discord' },
];

const benefits = ['Fast delivery', 'Secure checkout', 'Support available', 'Clear product information'];

export function ProductPurchase({ product }: { product: Product }) {
  const game = getGame(product.game);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { has, toggle } = useWishlist();
  const [qty, setQty] = useState(1);
  const saved = has(product.id);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          to={`/games/${product.game}`}
          className="rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
          style={{ background: game?.colorSoft, color: game?.color }}
        >
          {game?.name}
        </Link>
        <span className="rounded-lg border border-edge px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          {product.category}
        </span>
      </div>

      <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
        {product.name}
      </h1>
      <p className="mt-3 text-base text-zinc-400">
        {game?.name} <span className="mx-1.5 text-zinc-700">/</span> Gaming Account
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-x-5 gap-y-3">
        <span className="font-display text-5xl font-bold leading-none text-white md:text-6xl">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <div className="flex items-center gap-2.5 pb-1">
            <span className="text-xl text-zinc-600 line-through">{formatPrice(product.originalPrice)}</span>
            <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-bold text-emerald-400">
              SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          </div>
        )}
      </div>

      <div className="mt-5">
        <StockIndicator stock={product.stock} className="text-sm" />
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {assurances.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-edge bg-white/[0.02] p-4">
            <Icon className="h-6 w-6 text-accent-bright" />
            <p className="mt-3 text-sm font-semibold text-white">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex items-center justify-between rounded-xl border border-edge bg-white/[0.03] sm:justify-start">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="flex h-14 w-14 items-center justify-center text-zinc-400 transition-colors hover:text-white"
          >
            <Minus className="h-5 w-5" />
          </button>
          <span className="w-12 text-center font-display text-lg font-bold text-white" aria-live="polite">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
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
          className="btn-primary btn-shine h-14 flex-1 text-base shadow-[0_0_40px_-12px_rgba(74,79,158,0.9)] hover:-translate-y-0.5"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart — {formatPrice(product.price * qty)}
        </button>
      </div>

      <button
        onClick={() => toggle(product.id)}
        aria-pressed={saved}
        className="btn-ghost mt-3 h-12 w-full text-sm"
      >
        <Heart className={`h-4 w-4 ${saved ? 'fill-accent-bright text-accent-bright' : ''}`} />
        {saved ? 'Saved to Wishlist' : 'Add to Wishlist'}
      </button>

      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
        {benefits.map((b) => (
          <li key={b} className="flex items-center gap-2.5 text-sm text-zinc-300">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20">
              <Check className="h-3.5 w-3.5 text-accent-bright" />
            </span>
            {b}
          </li>
        ))}
      </ul>

      <ul className="mt-7 space-y-3 border-t border-edge pt-7">
        {product.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-300">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
