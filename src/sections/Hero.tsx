import { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight, Gamepad2, ShieldCheck, Zap } from 'lucide-react';
import { products } from '../data/products';
import { games, getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { Particles } from '../components/effects/Particles';
import { MagneticButton } from '../components/anim/MagneticButton';
import { ProductArt } from '../components/ProductArt';
import { usePointerEffects } from '../hooks/usePointerEffects';

const floatCards = [products[0], products[6], products[29], products[38]];

/** Per-card parallax depth — front cards travel further than the ones behind. */
const depths = [1, 0.62, 0.4, 0.22];

const cardPositions = [
  'left-[8%] top-[6%] z-30',
  'right-[4%] top-[18%] z-20',
  'left-[18%] bottom-[8%] z-10',
  'right-[14%] bottom-[2%] z-0',
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  const pointerFx = usePointerEffects();
  const sectionRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerFx || !sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [pointerFx, mx, my],
  );

  const resetPointer = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
      className="noise relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{ background: 'radial-gradient(ellipse, rgba(46,48,106,0.35) 0%, transparent 65%)' }}
      />
      <div
        aria-hidden
        className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full opacity-40 blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(74,79,158,0.3) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="beam-drift pointer-events-none absolute -top-1/4 left-1/4 h-[150%] w-[40%] blur-[90px]"
        style={{ background: 'linear-gradient(100deg, transparent, rgba(46,48,106,0.28), transparent)' }}
      />
      <Particles density={45} />

      <div className="container-wide relative grid items-center gap-16 pb-24 pt-32 lg:grid-cols-2 lg:pb-16 lg:pt-24">
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-edge bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-zinc-300">
                <span className="font-semibold text-emerald-400">LIVE</span> — {products.length} products across{' '}
                {games.length} games
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            THE GAMING
            <br />
            <span className="bg-gradient-to-r from-accent-bright via-accent-light to-accent-bright bg-clip-text text-transparent">
              MARKETPLACE
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-6 max-w-md text-lg leading-relaxed text-zinc-400"
          >
            Premium gaming accounts. Instant access. Built for gamers.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              <Link to="/products" className="btn-primary btn-shine !px-8 !py-4 text-base">
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/games" className="btn-ghost !px-8 !py-4 text-base">
                <Gamepad2 className="h-4 w-4" />
                View Games
              </Link>
            </MagneticButton>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.55}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3"
          >
            {[
              { icon: Zap, text: 'Instant delivery' },
              { icon: ShieldCheck, text: 'Verified accounts' },
              { icon: Gamepad2, text: '15+ games supported' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2 text-sm text-zinc-500">
                <Icon className="h-4 w-4 text-accent-bright" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="relative hidden h-[520px] lg:block" style={{ perspective: 1200 }}>
          {floatCards.map((p, i) => (
            <HeroCard key={p.id} product={p} index={i} sx={sx} sy={sy} />
          ))}
        </div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-edge p-1.5">
          <motion.div
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-2 w-1 rounded-full bg-accent-bright"
          />
        </div>
      </motion.div>
    </section>
  );
}

function HeroCard({
  product,
  index,
  sx,
  sy,
}: {
  product: (typeof products)[number];
  index: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const game = getGame(product.game);
  const depth = depths[index];
  const x = useTransform(sx, (v) => v * 46 * depth);
  const y = useTransform(sy, (v) => v * 34 * depth);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateY: -18 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 1, delay: 0.5 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute w-60 ${cardPositions[index]}`}
    >
      {/* Cursor parallax — springs rest at 0 when pointer effects are disabled. */}
      <motion.div style={{ x, y }}>
        <motion.div
          animate={{ y: [0, -14, 0], rotateZ: [0, index % 2 === 0 ? 1.5 : -1.5, 0] }}
          transition={{ duration: 6 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.6 }}
        >
          <Link
            to={`/product/${product.id}`}
            className="glass-strong block overflow-hidden rounded-2xl p-3 transition-all duration-500 hover:border-accent-light/50 hover:shadow-[0_0_50px_-10px_rgba(74,79,158,0.5)]"
            style={{ transform: `rotateY(${index % 2 === 0 ? -6 : 6}deg) rotateX(3deg)` }}
          >
            <ProductArt
              gameId={product.game}
              image={product.image}
              alt={product.name}
              label={product.category}
              className="aspect-[16/10] w-full rounded-xl"
            />
            <div className="flex items-center justify-between px-1 pb-1 pt-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{game?.name}</p>
                <p className="truncate text-sm font-semibold text-white">{product.name}</p>
              </div>
              <span className="font-display text-sm font-bold text-accent-bright">{formatPrice(product.price)}</span>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
