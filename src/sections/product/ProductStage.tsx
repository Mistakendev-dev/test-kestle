import { useRef, type MouseEvent } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Expand } from 'lucide-react';
import type { Product } from '../../data/products';
import { getGame } from '../../data/games';
import { usePointerEffects } from '../../hooks/usePointerEffects';
import { ProductArt } from '../../components/ProductArt';
import type { LightboxFrame } from '../../components/Lightbox';
import { Badge } from '../../components/Badge';
import { cn } from '../../lib/utils';

/**
 * The product artwork as a physical object: a glass frame lifted off the
 * backdrop, tilting toward the cursor with its internal layers parallaxing at
 * different rates. Everything is transform/opacity, and the whole effect is
 * gated behind `usePointerEffects` so touch and reduced-motion get the calm
 * version.
 */
export function ProductStage({
  product,
  frames,
  index,
  onSelect,
  onExpand,
}: {
  product: Product;
  frames: LightboxFrame[];
  index: number;
  onSelect: (i: number) => void;
  onExpand: () => void;
}) {
  const rich = usePointerEffects();
  const ref = useRef<HTMLDivElement>(null);
  const game = getGame(product.game);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 150, damping: 24 });
  const sy = useSpring(my, { stiffness: 150, damping: 24 });
  const rotateX = useTransform(sy, [0, 1], [5, -5]);
  const rotateY = useTransform(sx, [0, 1], [-6, 6]);
  const ax = useTransform(sx, [0, 1], [-1, 1]);
  const ay = useTransform(sy, [0, 1], [-1, 1]);
  /** Specular sweep tracking the cursor across the glass. */
  const sheenX = useTransform(sx, [0, 1], [12, 88]);
  const sheenY = useTransform(sy, [0, 1], [10, 90]);
  const sheen = useMotionTemplate`radial-gradient(38% 46% at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.13), transparent 70%)`;

  function handleMove(e: MouseEvent) {
    if (!rich || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <div>
      <div className="relative" style={{ perspective: 1500 }}>
        {/* Pool of light the frame appears to rest in. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-12 -z-10 opacity-90 blur-[80px]"
          style={{
            background: `radial-gradient(ellipse 58% 52% at 50% 58%, ${game?.color ?? '#6b72d6'}26 0%, rgba(46,48,106,0.5) 40%, transparent 72%)`,
          }}
        />

        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={() => {
            mx.set(0.5);
            my.set(0.5);
          }}
          style={
            rich
              ? ({
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                  '--ax': ax,
                  '--ay': ay,
                } as never)
              : undefined
          }
          animate={rich ? { y: [0, -10, 0] } : undefined}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="pane-raised bevel lit-edge group relative p-2.5 shadow-deep sm:p-3"
        >
          <div className="relative overflow-hidden rounded-[18px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.04, x: 14 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.99, x: -14 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductArt
                  gameId={product.game}
                  image={frames[index]?.image ?? product.image}
                  alt={product.name}
                  size="xl"
                  variant={frames[index]?.variant ?? 0}
                  depth={rich}
                  priority
                  className="aspect-[4/3] w-full"
                />
              </motion.div>
            </AnimatePresence>

            {/* Glass reflection riding the cursor. */}
            {rich && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: sheen }}
              />
            )}
          </div>

          {product.badge && <Badge label={product.badge} className="absolute left-5 top-5 z-10" />}

          <button
            type="button"
            onClick={onExpand}
            aria-label="Open full-size preview"
            className="absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-xl border border-edge bg-void/75 px-3.5 py-2 text-xs font-semibold text-zinc-200 backdrop-blur-md transition-all duration-300 hover:border-accent-light/60 hover:bg-accent/30 hover:text-white md:opacity-0 md:group-hover:opacity-100"
          >
            <Expand className="h-3.5 w-3.5" />
            Expand
          </button>

          {/* Floating metadata, set forward in Z so it hovers off the frame. */}
          {rich && (
            <div
              aria-hidden
              style={{ transform: 'translateZ(60px)' }}
              className="pointer-events-none absolute -right-3 top-1/3 hidden rounded-xl border border-white/10 bg-void/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-300 shadow-lift backdrop-blur-md lg:block"
            >
              {game?.short} · {product.category}
            </div>
          )}
        </motion.div>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2.5 sm:gap-3">
        {frames.map((frame, i) => (
          <button
            key={frame.label}
            onClick={() => onSelect(i)}
            aria-label={`View ${frame.label}`}
            aria-current={index === i}
            className={cn(
              'overflow-hidden rounded-xl border-2 transition-all duration-300',
              index === i
                ? 'border-accent-light shadow-[0_0_24px_-6px_rgba(107,114,214,0.8)]'
                : 'border-edge opacity-55 hover:border-white/20 hover:opacity-100',
            )}
          >
            <ProductArt
              gameId={product.game}
              image={frame.image}
              size="sm"
              variant={frame.variant}
              className="aspect-[4/3] w-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
