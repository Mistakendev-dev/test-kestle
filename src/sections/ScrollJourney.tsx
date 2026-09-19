import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { Compass, CreditCard, MousePointerClick, PackageCheck } from 'lucide-react';
import { featuredProducts } from '../data/products';
import { getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { ProductArt } from '../components/ProductArt';

const stages = [
  {
    id: 'discover',
    label: 'Discover',
    icon: Compass,
    copy: 'Start with the game you play. Every title has its own shelf, so you are never scrolling past things you do not need.',
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: MousePointerClick,
    copy: 'Filter by type, price and availability. Quick view lets you size up a product without losing your place in the grid.',
  },
  {
    id: 'choose',
    label: 'Choose',
    icon: PackageCheck,
    copy: 'Full details before anything reaches your cart — what is included, how it arrives, and what to expect.',
  },
  {
    id: 'checkout',
    label: 'Check out',
    icon: CreditCard,
    copy: 'Review the cart, adjust quantities, and head to checkout. No surprises between the product page and the total.',
  },
] as const;

/** One product per stage, so the centrepiece changes as the story advances. */
const scenes = featuredProducts.slice(0, stages.length);

/**
 * Sticky centrepiece, scrolling narrative. Deliberately kept to ~2.4 viewports
 * of scroll — long enough to land, short enough not to trap the reader.
 */
export function ScrollJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(stages.length - 1, Math.max(0, Math.floor(v * stages.length)));
    setActive((prev) => (prev === next ? prev : next));
  });

  const artY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const scene = scenes[active] ?? scenes[0];
  const game = getGame(scene.game);

  return (
    <section className="relative">
      <div ref={ref} className="relative h-[240vh]">
        <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden">
          {/* Ambient tint drifts toward the active scene's game colour. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-[background] duration-700"
            style={{
              background: `radial-gradient(ellipse 50% 45% at 30% 50%, ${game?.colorSoft ?? 'transparent'}, transparent 70%), radial-gradient(ellipse 60% 50% at 70% 50%, rgba(46,48,106,0.3), transparent 72%)`,
            }}
          />

          <div className="container-wide relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="section-label">How it goes</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
                From browsing to checkout
              </h2>

              <ol className="mt-10 space-y-2">
                {stages.map((stage, i) => {
                  const isActive = i === active;
                  const Icon = stage.icon;
                  return (
                    <li key={stage.id}>
                      <div
                        className={`relative flex gap-4 rounded-2xl border p-4 transition-all duration-500 ease-out ${
                          isActive
                            ? 'border-accent-light/40 bg-white/[0.04]'
                            : 'border-transparent bg-transparent'
                        }`}
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-500 ${
                            isActive
                              ? 'border-accent-light/50 bg-accent/25 text-white'
                              : 'border-white/[0.07] bg-white/[0.02] text-zinc-600'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <div className="flex items-baseline gap-2.5">
                            <span
                              className={`font-display text-xs font-bold transition-colors duration-500 ${
                                isActive ? 'text-accent-bright' : 'text-zinc-700'
                              }`}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <h3
                              className={`font-display text-lg font-bold transition-colors duration-500 ${
                                isActive ? 'text-white' : 'text-zinc-500'
                              }`}
                            >
                              {stage.label}
                            </h3>
                          </div>
                          <motion.p
                            animate={{
                              opacity: isActive ? 1 : 0,
                              height: isActive ? 'auto' : 0,
                            }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden text-sm leading-relaxed text-zinc-400"
                          >
                            <span className="block pt-1.5">{stage.copy}</span>
                          </motion.p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Centrepiece stays put; only its contents cross-fade. */}
            <motion.div style={{ y: artY }} className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="pane-raised bevel lit-edge overflow-hidden p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  {scenes.map((p, i) => (
                    <motion.div
                      key={p.id}
                      aria-hidden={i !== active}
                      animate={{
                        opacity: i === active ? 1 : 0,
                        scale: i === active ? 1 : 1.04,
                      }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <ProductArt
                        gameId={p.game}
                        image={p.image}
                        alt={p.name}
                        label={p.category}
                        size="lg"
                        className="h-full w-full"
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-4 px-2 pb-1 pt-4">
                  <div className="min-w-0">
                    <span className="meta">{game?.name}</span>
                    <p className="truncate font-display text-base font-bold text-white">
                      {scene.name}
                    </p>
                  </div>
                  <span className="font-display text-lg font-bold text-accent-bright">
                    {formatPrice(scene.price)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-1.5">
                {stages.map((s, i) => (
                  <span
                    key={s.id}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === active ? 'w-8 bg-accent-bright' : 'w-3 bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
