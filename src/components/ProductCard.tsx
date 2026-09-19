import { useRef, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';
import type { Product } from '../data/products';
import { getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { usePointerEffects } from '../hooks/usePointerEffects';
import { ProductArt } from './ProductArt';
import { Badge, StockIndicator } from './Badge';
import { WishlistButton } from './WishlistButton';

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
  const sx = useSpring(mx, { stiffness: 260, damping: 28 });
  const sy = useSpring(my, { stiffness: 260, damping: 28 });

  const rotateX = useTransform(sy, [0, 1], [3.5, -3.5]);
  const rotateY = useTransform(sx, [0, 1], [-3.5, 3.5]);
  const imgX = useTransform(sx, [0, 1], [-6, 6]);
  const imgY = useTransform(sy, [0, 1], [-6, 6]);
  const glowX = useTransform(sx, [0, 1], ['0%', '100%']);
  const glowY = useTransform(sy, [0, 1], ['0%', '100%']);
  const sheen = useMotionTemplate`radial-gradient(260px circle at ${glowX} ${glowY}, rgba(107,114,214,0.16), transparent 68%)`;
  const rim = useMotionTemplate`radial-gradient(180px circle at ${glowX} ${glowY}, rgba(107,114,214,0.55), transparent 60%)`;

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

  const badges = [
    product.badge,
    !product.badge && product.new ? 'New' : null,
  ].filter(Boolean) as string[];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={rich ? { rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 } : undefined}
      whileHover={rich ? { y: -6 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative h-full"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel/60 backdrop-blur-sm transition-colors duration-300 group-hover:border-accent-light/40">
        {rich && (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: sheen }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-px z-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: rim, maskImage: 'linear-gradient(#000,#000)', padding: 1 }}
            />
          </>
        )}

        <div className="relative overflow-hidden">
          <Link to={`/product/${product.id}`} className="block" aria-label={product.name}>
            <motion.div
              style={rich ? { x: imgX, y: imgY } : undefined}
              className="transition-transform duration-500 group-hover:scale-[1.04]"
            >
              <ProductArt
                gameId={product.game}
                image={product.image}
                alt={product.name}
                label={product.category}
                size="lg"
                className="aspect-[4/3] w-full"
              />
            </motion.div>
          </Link>

          <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <Badge key={b} label={b} />
            ))}
          </div>

          <div className="absolute right-3 top-3 z-20">
            <WishlistButton productId={product.id} />
          </div>

          {onQuickView && (
            <div className="absolute inset-x-3 bottom-3 z-20 hidden translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-edge bg-void/80 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:border-accent-light/60 hover:bg-accent/30"
              >
                <Eye className="h-3.5 w-3.5" />
                Quick View
              </button>
            </div>
          )}
        </div>

        <div className="relative z-10 flex flex-1 flex-col p-5">
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {game?.name}
          </span>

          <Link to={`/product/${product.id}`} className="mt-1.5">
            <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-white transition-colors group-hover:text-accent-bright">
              {product.name}
            </h3>
          </Link>

          {product.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-edge bg-white/[0.02] px-2 py-0.5 text-[10px] font-medium capitalize text-zinc-500"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold leading-none text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-zinc-600 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <StockIndicator stock={product.stock} className="mt-2" />
            </div>
            <Link
              to={`/product/${product.id}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-edge bg-white/[0.03] px-3.5 py-2.5 text-xs font-semibold text-zinc-300 transition-all duration-300 hover:border-accent-light/50 hover:bg-accent/20 hover:text-white"
            >
              View Product
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
