import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { newProducts } from '../data/products';
import { getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { usePointerEffects } from '../hooks/usePointerEffects';
import { ProductArt } from '../components/ProductArt';
import { StockIndicator } from '../components/Badge';
import { Reveal } from '../components/anim/Reveal';
import { MagneticButton } from '../components/anim/MagneticButton';

const ROTATE_MS = 7000;
const slides = newProducts.slice(0, 4);

export function TheLatestDrop() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const animate = usePointerEffects();

  const go = useCallback((delta: number) => {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setTimeout(() => go(1), ROTATE_MS);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  const product = slides[index];
  const game = getGame(product.game);

  return (
    <section
      className="relative overflow-hidden border-y border-edge py-20 md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Background wash tinted by the active title. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 70% at 22% 45%, ${game?.color}1f 0%, transparent 62%), radial-gradient(ellipse 50% 60% at 85% 30%, rgba(46,48,106,0.35) 0%, transparent 65%)`,
          }}
        />
      </AnimatePresence>
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />

      <div className="container-wide relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <div className="relative" style={{ perspective: 1200 }}>
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 blur-[70px]"
              style={{ background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${game?.color}3d, transparent 70%)` }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.96, rotateY: animate ? -8 : 0 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/product/${product.id}`} className="group block">
                  <ProductArt
                    gameId={product.game}
                    image={product.image}
                    alt={product.name}
                    label={product.category}
                    size="xl"
                    className="aspect-[16/10] w-full rounded-3xl border border-edge shadow-[0_40px_90px_-40px_rgba(0,0,0,1)] transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <p className="section-label">The latest drop</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: game?.color }}>
                  {game?.name}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl">
                  {product.name}
                </h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-400 line-clamp-3">
                  {product.description}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <span className="font-display text-4xl font-bold text-white">{formatPrice(product.price)}</span>
                  <StockIndicator stock={product.stock} className="text-sm" />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton>
                <Link to={`/product/${product.id}`} className="btn-primary btn-shine !px-7 !py-3.5 text-base">
                  View Product
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
              <button
                onClick={() => {
                  addItem(product.id);
                  toast('Added to cart', { detail: product.name });
                }}
                className="btn-ghost !px-7 !py-3.5 text-base"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous drop"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-edge bg-white/[0.03] text-zinc-400 transition-colors hover:border-accent-light/50 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next drop"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-edge bg-white/[0.03] text-zinc-400 transition-colors hover:border-accent-light/50 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* CSS-driven so pausing is a play-state flip, not a React re-render loop. */}
              <div className={`flex flex-1 gap-2 ${paused ? 'drop-paused' : ''}`}>
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setIndex(i)}
                    aria-label={`Show ${s.name}`}
                    aria-current={i === index}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
                  >
                    {i === index && (
                      <span
                        key={index}
                        className="drop-progress block h-full rounded-full bg-accent-bright"
                        style={{ animationDuration: `${ROTATE_MS}ms` }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
