import { motion } from 'framer-motion';
import type { GameProduct } from '../../data/products';
import { formatPrice } from '../../lib/utils';
import type { LightboxFrame } from '../../components/Lightbox';
import { ProductStage } from './ProductStage';

const rise = {
  hidden: { opacity: 0, y: 26 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/**
 * The cinematic half of the hub: a centred title card with the game on its
 * stage beneath it. Deliberately vertical and symmetrical — the homepage owns
 * cards and rails, this owns one title.
 */
export function ProductHero({
  product,
  frames,
  index,
  onSelect,
  onExpand,
}: {
  product: GameProduct;
  frames: LightboxFrame[];
  index: number;
  onSelect: (i: number) => void;
  onExpand: () => void;
}) {
  return (
    <div className="relative">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div variants={rise} initial="hidden" animate="visible" custom={0.05}>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span
              className="rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ background: product.colorSoft, color: product.color }}
            >
              {product.genre}
            </span>
            <span className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              {product.variantCount} {product.variantCount === 1 ? 'option' : 'options'}
            </span>
            <span className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              From {formatPrice(product.price)}
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

    </div>
  );
}
