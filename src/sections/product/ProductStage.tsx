import { useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Expand } from 'lucide-react';
import type { Product } from '../../data/products';
import { getGame } from '../../data/games';
import { ProductArt } from '../../components/ProductArt';
import type { LightboxFrame } from '../../components/Lightbox';
import { cn } from '../../lib/utils';

/**
 * The product presented as a physical object on a lit stage: a back plate for
 * depth separation, the artwork in a glass frame, and a floor reflection
 * beneath it.
 *
 * Motion is deliberately not cursor-driven. The frame rises on entrance,
 * parallaxes against the backdrop on scroll, and breathes on a slow autonomous
 * loop — so the object feels alive without chasing the pointer.
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
  const ref = useRef<HTMLDivElement>(null);
  const calm = useReducedMotion();
  const game = getGame(product.id);
  const color = game?.color ?? '#6b72d6';

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.2', 'end start'],
  });

  /** The frame drifts up and recedes as the page scrolls past it. */
  const frameY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const frameScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  /** The plate behind travels further, opening the gap between the layers. */
  const plateY = useTransform(scrollYProgress, [0, 1], [0, -130]);
  /** The reflection is the first thing to go. */
  const floorOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const art = (
    <ProductArt
      gameId={product.id}
      image={frames[index]?.image ?? product.image}
      alt={product.name}
      size="xl"
      variant={frames[index]?.variant ?? 0}
      priority
      className="aspect-[16/10] w-full"
    />
  );

  return (
    <div ref={ref} className="relative">
      <div className="relative" style={{ perspective: 1600 }}>
        {/* Pool of light the object rests in. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-y-16 inset-x-0 -z-20 blur-[90px]"
          style={{
            background: `radial-gradient(ellipse 55% 50% at 50% 55%, ${color}33 0%, rgba(46,48,106,0.45) 42%, transparent 72%)`,
          }}
        />

        {/* Back plate — a second, softer copy set behind and above the frame,
            so the object separates from the environment instead of floating on
            top of it. */}
        <motion.div
          aria-hidden
          style={calm ? undefined : { y: plateY }}
          className="pointer-events-none absolute inset-x-[8%] -top-8 -z-10 hidden h-full overflow-hidden rounded-[28px] opacity-40 blur-[3px] sm:block"
        >
          <ProductArt
            gameId={product.id}
            image={product.image}
            alt=""
            size="lg"
            variant={(frames[index]?.variant ?? 0) + 2}
            className="h-full w-full scale-110"
          />
          <div className="absolute inset-0 bg-void/55" />
        </motion.div>

        <motion.div
          style={calm ? undefined : { y: frameY, scale: frameScale }}
          initial={{ opacity: 0, y: 54, rotateX: 7, scale: 1.04 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={calm ? undefined : { y: [0, -9, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            className="pane-hero bevel group relative p-2.5 sm:p-3"
          >
            <div className="relative overflow-hidden rounded-[20px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {art}
                </motion.div>
              </AnimatePresence>

              {/* Fixed specular sweep across the glass — a highlight from the
                  page's key light, not something that follows the cursor. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(112deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 22%, transparent 46%)',
                }}
              />
            </div>

            <button
              type="button"
              onClick={onExpand}
              aria-label="Open full-size preview"
              className="absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-xl border border-white/10 bg-void/75 px-3.5 py-2 text-xs font-semibold text-zinc-200 backdrop-blur-md transition-colors duration-300 hover:border-accent-light/60 hover:bg-accent/30 hover:text-white md:opacity-0 md:group-hover:opacity-100"
            >
              <Expand className="h-3.5 w-3.5" />
              Expand
            </button>
          </motion.div>
        </motion.div>

        {/* Floor reflection. The copy is hung above the clip box and mirrored
            about its own bottom edge, so the artwork's lower edge lands exactly
            on the stage floor and the rest falls away beneath it. */}
        <motion.div
          aria-hidden
          style={{
            ...(calm ? undefined : { opacity: floorOpacity }),
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 94%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 94%)',
          }}
          className="pointer-events-none absolute inset-x-3 top-full -z-10 hidden h-24 overflow-hidden sm:block"
        >
          <div className="absolute inset-x-0 bottom-full origin-bottom -scale-y-100 opacity-[0.22] blur-[2px]">
            {art}
          </div>
        </motion.div>
      </div>

      {/* Filmstrip. Centred and understated so it reads as a control strip
          rather than a second gallery. */}
      <div className="mt-8 flex justify-center gap-2 sm:mt-28 sm:gap-2.5">
        {frames.map((frame, i) => (
          <button
            key={frame.label}
            onClick={() => onSelect(i)}
            aria-label={`View ${frame.label}`}
            aria-current={index === i}
            className={cn(
              'relative h-[46px] w-[72px] shrink-0 overflow-hidden rounded-lg border transition-all duration-300 sm:h-14 sm:w-[86px]',
              index === i
                ? 'border-accent-light/80 opacity-100 shadow-[0_0_20px_-6px_rgba(107,114,214,0.9)]'
                : 'border-white/10 opacity-45 hover:opacity-90',
            )}
          >
            <ProductArt
              gameId={product.id}
              image={frame.image}
              size="sm"
              variant={frame.variant}
              className="h-full w-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
