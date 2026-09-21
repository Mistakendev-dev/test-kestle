import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../../data/products';
import { getGame } from '../../data/games';
import type { LightboxFrame } from '../../components/Lightbox';
import { ProductStage } from './ProductStage';
import { ProductPurchase } from './ProductPurchase';

const rise = {
  hidden: { opacity: 0, y: 26 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/**
 * The cinematic half of the page: a centred title card, the product on its
 * stage beneath it, then the purchase rail. Deliberately vertical and
 * symmetrical — the homepage owns cards and rails, this owns one object.
 */
export function ProductHero({
  product,
  frames,
  index,
  onSelect,
  onExpand,
  qty,
  onQty,
  railRef,
}: {
  product: Product;
  frames: LightboxFrame[];
  index: number;
  onSelect: (i: number) => void;
  onExpand: () => void;
  qty: number;
  onQty: (next: number) => void;
  railRef: React.RefObject<HTMLDivElement | null>;
}) {
  const game = getGame(product.id);

  return (
    <div className="relative">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div variants={rise} initial="hidden" animate="visible" custom={0.05}>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link
              to={`/games/${product.id}`}
              className="rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
              style={{ background: game?.colorSoft, color: game?.color }}
            >
              {game?.name}
            </Link>
            <span className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              {product.category}
            </span>
          </div>
        </motion.div>

        <motion.h1
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={0.15}
          className="mt-6 font-display text-[2.5rem] font-bold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]"
        >
          {product.name}
        </motion.h1>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={0.25}
          className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-zinc-400 sm:text-base"
        >
          {product.description}
        </motion.p>
      </div>

      <div className="mt-14 sm:mt-16 lg:mt-20">
        <div className="mx-auto max-w-4xl">
          <ProductStage
            product={product}
            frames={frames}
            index={index}
            onSelect={onSelect}
            onExpand={onExpand}
          />
        </div>
      </div>

      <motion.div
        ref={railRef}
        variants={rise}
        initial="hidden"
        animate="visible"
        custom={0.45}
        className="mt-10 sm:mt-12"
      >
        <ProductPurchase product={product} qty={qty} onQty={onQty} />
      </motion.div>
    </div>
  );
}
