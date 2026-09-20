import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../data/products';
import { getGame } from '../../data/games';
import { formatPrice } from '../../lib/utils';
import { ProductArt } from '../../components/ProductArt';
import { Tilt } from '../../components/anim/Tilt';
import { StockIndicator } from '../../components/Badge';

/**
 * One listing given the full width of the page. The artwork becomes the
 * environment behind the copy instead of sitting in a frame beside it, so this
 * band reads as a different kind of object to the grid below and gives the
 * page a single strong moment rather than another row of cards.
 */
export function CatalogSpotlight({ product }: { product: Product }) {
  const game = getGame(product.game);
  const color = game?.color ?? '#6b72d6';

  return (
    <section className="relative isolate overflow-hidden py-16 md:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 scale-125 opacity-60 blur-[70px]">
          <ProductArt gameId={product.game} image={product.image} size="sm" className="h-full w-full" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, rgba(5,5,7,0.96) 0%, rgba(5,5,7,0.8) 45%, rgba(5,5,7,0.45) 100%), radial-gradient(80% 60% at 20% 50%, ${color}1f 0%, transparent 70%)`,
          }}
        />
        {/* Dissolve into the page at both ends so the band has no hard seam. */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-void to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-void to-transparent" />
      </div>

      <div className="container-wide">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-10" style={{ background: color }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                In the spotlight
              </span>
            </div>

            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
              {product.name}
            </h2>

            <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-zinc-400">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4 border-t border-white/[0.09] pt-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Price</p>
                <p className="mt-1.5 font-display text-3xl font-bold leading-none text-white">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Availability</p>
                <StockIndicator stock={product.stock} className="mt-2.5" />
              </div>
              <Link to={`/product/${product.id}`} className="btn-primary btn-shine ml-auto">
                View listing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <Tilt strength={4} className="w-[22rem] xl:w-[26rem]">
              <Link to={`/product/${product.id}`} aria-label={product.name} className="block">
                <div className="glass-card glass-sheen relative aspect-[3/4] overflow-hidden rounded-[26px]">
                  <ProductArt
                    gameId={product.game}
                    image={product.image}
                    alt={product.name}
                    size="lg"
                    priority
                    className="h-full w-full"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </div>
              </Link>
            </Tilt>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
