import { useRef, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../data/products';
import { getGame } from '../data/games';
import { formatPrice, formatSold } from '../lib/utils';
import { ProductArt } from './ProductArt';
import { Badge, StockIndicator } from './Badge';

export function ProductCard({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const game = getGame(product.game);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 300, damping: 30 });
  const sy = useSpring(my, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(sy, [0, 1], [5, -5]);
  const rotateY = useTransform(sx, [0, 1], [-5, 5]);
  const imgX = useTransform(sx, [0, 1], [-8, 8]);
  const imgY = useTransform(sy, [0, 1], [-8, 8]);
  const glowX = useTransform(sx, [0, 1], ['0%', '100%']);
  const glowY = useTransform(sy, [0, 1], ['0%', '100%']);

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  function handleMove(e: MouseEvent) {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative h-full"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel/60 backdrop-blur-sm transition-colors duration-300 group-hover:border-accent-light/40">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) =>
                `radial-gradient(300px circle at ${gx} ${gy}, rgba(74,79,158,0.15), transparent 70%)`,
            ),
          }}
        />
        <Link to={`/product/${product.id}`} className="relative block overflow-hidden">
          <motion.div style={{ x: imgX, y: imgY }} className="transition-transform duration-500 group-hover:scale-[1.04]">
            <ProductArt gameId={product.game} label={product.category} className="aspect-[16/10] w-full" />
          </motion.div>
          {product.badge && <Badge label={product.badge} className="absolute left-3 top-3 z-20" />}
        </Link>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {game?.name}
            </span>
            <span className="text-[11px] text-zinc-600">{formatSold(product.sold)} sold</span>
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-display text-lg font-semibold leading-snug text-white transition-colors group-hover:text-accent-bright">
              {product.name}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">{product.description}</p>

          <div className="mt-auto flex items-end justify-between pt-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-xl font-bold text-white">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-zinc-600 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <StockIndicator stock={product.stock} className="mt-1" />
            </div>
            <Link
              to={`/product/${product.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-edge bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-zinc-300 transition-all duration-300 hover:border-accent-light/50 hover:bg-accent/20 hover:text-white"
            >
              View
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
