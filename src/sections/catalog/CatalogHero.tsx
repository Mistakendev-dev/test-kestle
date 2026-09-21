import { motion } from 'framer-motion';
import { games } from '../../data/games';
import { products, totalVariants } from '../../data/products';
import { formatPrice } from '../../lib/utils';
import { ProductArt } from '../../components/ProductArt';

/** Demo catalogue figures, read straight off the bundled data. */
const figures = [
  { value: String(products.length), label: 'Titles' },
  { value: String(totalVariants), label: 'Options' },
  { value: formatPrice(Math.min(...products.map((p) => p.price))), label: 'From' },
];

const wall = games.slice(0, 6);

/**
 * Marketplace opener. The catalogue's own artwork becomes the environment —
 * heavily softened, graded toward the brand accent and dissolved into the page
 * — so the title sits inside the collection rather than on a panel above it.
 * Deliberately short: the grid should be a scroll away, not a page away.
 */
export function CatalogHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Artwork wall. One blur filter over the whole row rather than one
            per tile, so this costs a single composited layer. */}
        <div className="absolute inset-0 scale-110 opacity-[0.55] blur-[64px]">
          <div className="grid h-full w-full grid-cols-3 md:grid-cols-6">
            {wall.map((g) => (
              <ProductArt key={g.id} gameId={g.id} size="sm" className="h-full w-full" />
            ))}
          </div>
        </div>
        {/* Colour grade toward the accent, so fifteen palettes read as one. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(5,5,7,0.62) 0%, rgba(5,5,7,0.8) 55%, #050507 100%), radial-gradient(90% 70% at 50% 0%, rgba(46,48,106,0.5) 0%, transparent 68%)',
          }}
        />
        {/* Vignette. */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(110% 80% at 50% 38%, transparent 42%, rgba(5,5,7,0.9) 100%)',
          }}
        />
        <div className="bg-grid absolute inset-0 opacity-[0.3]" />
      </div>

      <div className="container-wide relative pb-14 pt-28 md:pb-20 md:pt-36">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="section-label"
        >
          The Marketplace
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-4xl font-display text-[2.6rem] font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Explore the
          <span className="block text-gradient">whole collection</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-lg text-[15px] leading-relaxed text-zinc-400"
        >
          Every account, every title, in one place. Search it, narrow it down, and take
          what you came for.
        </motion.p>

        {/* Figures on an open rule rather than boxed in a second panel — the
            hero already has one surface and does not need a competing one. */}
        <motion.dl
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex max-w-lg items-end gap-8 border-t border-white/[0.09] pt-5 sm:gap-12"
        >
          {figures.map((f) => (
            <div key={f.label}>
              <dd className="font-display text-2xl font-bold leading-none text-white sm:text-3xl">
                {f.value}
              </dd>
              <dt className="mt-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                {f.label}
              </dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
