import { useRef, type MouseEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Expand } from 'lucide-react';
import type { Product } from '../../data/products';
import { usePointerEffects } from '../../hooks/usePointerEffects';
import { ProductArt } from '../../components/ProductArt';
import type { LightboxFrame } from '../../components/Lightbox';
import { Badge } from '../../components/Badge';
import { cn } from '../../lib/utils';

export function ProductShowcase({
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

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 180, damping: 26 });
  const sy = useSpring(my, { stiffness: 180, damping: 26 });
  const rotateX = useTransform(sy, [0, 1], [4, -4]);
  const rotateY = useTransform(sx, [0, 1], [-5, 5]);
  const ax = useTransform(sx, [0, 1], [-1, 1]);
  const ay = useTransform(sy, [0, 1], [-1, 1]);

  function handleMove(e: MouseEvent) {
    if (!rich || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  function reset() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <div>
      <div className="relative" style={{ perspective: 1400 }}>
        {/* Ambient pool of light under the frame. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-10 -z-10 opacity-80 blur-[70px]"
          style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 55%, rgba(46,48,106,0.55), transparent 70%)' }}
        />

        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={reset}
          style={
            rich ? ({ rotateX, rotateY, transformStyle: 'preserve-3d', '--ax': ax, '--ay': ay } as never) : undefined
          }
          animate={rich ? { y: [0, -10, 0] } : undefined}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="group relative overflow-hidden rounded-3xl border border-edge bg-panel/50 p-2.5 shadow-[0_40px_90px_-40px_rgba(0,0,0,1)] backdrop-blur-sm"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductArt
                gameId={product.game}
                image={frames[index]?.image ?? product.image}
                alt={product.name}
                label={frames[index]?.label}
                size="xl"
                variant={frames[index]?.variant ?? 0}
                depth={rich}
                priority
                className="aspect-[4/3] w-full rounded-2xl"
              />
            </motion.div>
          </AnimatePresence>

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
        </motion.div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-3">
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
