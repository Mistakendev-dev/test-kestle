import { useRef, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Eye } from 'lucide-react';
import type { Product } from '../data/products';
import { getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { usePointerEffects } from '../hooks/usePointerEffects';
import { ProductArt } from './ProductArt';
import { Badge, StockIndicator } from './Badge';
import { WishlistButton } from './WishlistButton';

/**
 * A product as a physical display piece: portrait artwork fills the whole
 * surface and the copy is printed onto its lower third. Hovering tilts the
 * pane while the artwork travels forward on Z, so card and art separate in
 * depth instead of sliding together as one flat image.
 */
export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const game = getGame(product.game);
  const rich = usePointerEffects();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 220, damping: 26 });
  const sy = useSpring(my, { stiffness: 220, damping: 26 });

  const rotateX = useTransform(sy, [0, 1], [4, -4]);
  const rotateY = useTransform(sx, [0, 1], [-4, 4]);
  // Normalised -1..1, handed to ProductArt's layers as custom properties.
  const ax = useTransform(sx, [0, 1], [-1, 1]);
  const ay = useTransform(sy, [0, 1], [-1, 1]);

  function handleMove(e: MouseEvent) {
    if (!rich || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  const badges = [product.badge, !product.badge && product.new ? 'New' : null].filter(
    Boolean,
  ) as string[];

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={
        rich
          ? ({
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: 1000,
              '--ax': ax,
              '--ay': ay,
            } as never)
          : undefined
      }
      whileHover={rich ? { y: -8 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="group relative"
    >
      {/* Halo tinted toward the title's identity colour, resting on the brand
          accent. Sits behind the pane and never paints over it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-5 -z-10 rounded-[32px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(58% 52% at 50% 44%, ${game?.color ?? '#6b72d6'}30 0%, transparent 70%), radial-gradient(78% 72% at 50% 62%, rgba(46,48,106,0.6) 0%, transparent 72%)`,
        }}
      />

      <div className="glass-card relative aspect-[3/4] overflow-hidden rounded-[22px] transition-[border-color,box-shadow] duration-500 group-hover:border-accent-light/35 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_34px_70px_-30px_rgba(0,0,0,1)]">
        {/* Artwork fills the pane and is the dominant element. */}
        <motion.div
          aria-hidden
          style={rich ? { translateZ: 26 } : undefined}
          className="pointer-events-none absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        >
          <ProductArt
            gameId={product.game}
            image={product.image}
            alt={product.name}
            size="lg"
            depth={rich}
            className="h-full w-full"
          />
        </motion.div>

        {/* Reading scrim. Deep enough at the foot to carry the copy, clear
            across the top two-thirds so the art stays the subject. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(4,4,7,0.95) 0%, rgba(4,4,7,0.78) 26%, rgba(4,4,7,0.2) 54%, transparent 78%)',
          }}
        />
        {/* Polished top edge — the light catching the lip of the glass. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        <div className="pointer-events-none absolute left-3.5 top-3.5 z-20 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <Badge key={b} label={b} />
          ))}
        </div>

        <div className="absolute right-3.5 top-3.5 z-30">
          <WishlistButton productId={product.id} />
        </div>

        {onQuickView && (
          <div className="absolute inset-x-0 top-[34%] z-30 hidden justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 md:flex">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="glass-thin inline-flex translate-y-1.5 items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-[transform,border-color,background-color] duration-300 group-hover:translate-y-0 hover:border-accent-light/60 hover:bg-accent/40"
            >
              <Eye className="h-3.5 w-3.5" />
              Quick View
            </button>
          </div>
        )}

        {/* Copy printed onto the artwork. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: game?.color ?? '#6b72d6' }}
            />
            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              {game?.name}
            </span>
            <span className="ml-auto shrink-0 rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-300">
              {product.category}
            </span>
          </div>

          <h3 className="mt-2 line-clamp-2 font-display text-[15px] font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-accent-bright sm:text-lg">
            {product.name}
          </h3>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-xl font-bold leading-none text-white sm:text-2xl">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-zinc-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <StockIndicator stock={product.stock} className="mt-1.5" />
            </div>

            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-zinc-300 transition-all duration-300 group-hover:border-accent-light/50 group-hover:bg-accent group-hover:text-white"
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Whole pane is the link; the controls above sit on higher layers. */}
        <Link
          to={`/product/${product.id}`}
          aria-label={product.name}
          className="absolute inset-0 z-10 rounded-[22px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light"
        />
      </div>
    </motion.article>
  );
}
