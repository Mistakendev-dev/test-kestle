import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gamepad2, ShieldCheck, Zap } from 'lucide-react';
import { products } from '../data/products';
import { games, getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { Particles } from '../components/effects/Particles';
import { ProductArt } from '../components/ProductArt';

const floatCards = [...products].sort((a, b) => b.variantCount - a.variantCount).slice(0, 4);

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
  return (
    <section className="noise relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Static depth layers. Ambient drift comes from the beam below, not the
          cursor, so the scene reads as receding space without tracking input. */}
      <div
        aria-hidden
        className="bg-grid absolute -inset-12 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
      />
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
      {/* Horizon glow bleeding into the section below — §21 section continuity. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(46,48,106,0.16) 60%, rgba(5,5,7,0.9))' }}
      />
      <Particles density={45} />

      <div className="container-wide relative grid items-center gap-16 pb-24 pt-32 lg:grid-cols-2 lg:pb-16 lg:pt-24">
        <div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
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
            <Link to="/products" className="btn-primary btn-shine !px-8 !py-4 text-base">
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/resell" className="btn-ghost !px-8 !py-4 text-base">
              <Gamepad2 className="h-4 w-4" />
              Start reselling
            </Link>
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
              { icon: ShieldCheck, text: 'Secure checkout' },
              { icon: Gamepad2, text: `${games.length} games supported` },
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
            <HeroCard key={p.id} product={p} index={i} />
          ))}
        </div>

        {/* Touch devices get one floating card instead of the cursor-driven
            stack — same product, no pointer maths. */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.65}
          className="mx-auto w-full max-w-sm lg:hidden"
        >
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 blur-[60px]"
              style={{
                background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${getGame(floatCards[0].id)?.color}33, transparent 70%), radial-gradient(ellipse 70% 65% at 50% 60%, rgba(46,48,106,0.5), transparent 72%)`,
              }}
            />
            <div className="float-slow">
              <Link
                to={`/products/${floatCards[0].slug}`}
                className="pane-raised bevel block overflow-hidden p-3"
              >
                <ProductArt
                  gameId={floatCards[0].id}
                  image={floatCards[0].image}
                  alt={floatCards[0].name}
                  label={floatCards[0].genre}
                  size="lg"
                  priority
                  className="aspect-[16/10] w-full rounded-xl"
                />
                <div className="flex items-center justify-between gap-3 px-1 pb-1 pt-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {floatCards[0].variantCount} options
                    </p>
                    <p className="truncate text-sm font-semibold text-white">{floatCards[0].name}</p>
                  </div>
                  <span className="font-display text-sm font-bold text-accent-bright">
                    {formatPrice(floatCards[0].price)}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}

function HeroCard({ product, index }: { product: (typeof products)[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateY: -18 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 1, delay: 0.5 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute w-60 ${cardPositions[index]}`}
    >
      <motion.div
        animate={{ y: [0, -14, 0], rotateZ: [0, index % 2 === 0 ? 1.5 : -1.5, 0] }}
        transition={{ duration: 6 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.6 }}
      >
        <Link
          to={`/products/${product.slug}`}
          className="pane-raised bevel lit-edge block overflow-hidden p-3 transition-all duration-500 hover:border-accent-light/50 hover:shadow-glow-lg"
          style={{ transform: `rotateY(${index % 2 === 0 ? -6 : 6}deg) rotateX(3deg)` }}
        >
          <ProductArt
            gameId={product.id}
            image={product.image}
            alt={product.name}
            label={product.genre}
            className="aspect-[16/10] w-full rounded-xl"
          />
          <div className="flex items-center justify-between px-1 pb-1 pt-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {product.variantCount} options
              </p>
              <p className="truncate text-sm font-semibold text-white">{product.name}</p>
            </div>
            <span className="font-display text-sm font-bold text-accent-bright">{formatPrice(product.price)}</span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
