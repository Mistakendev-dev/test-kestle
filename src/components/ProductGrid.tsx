import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { cn } from '../lib/utils';

/**
 * Column presets rather than a free-form className so callers can never create
 * two competing `lg:grid-cols-*` utilities (where the winner depends on
 * Tailwind's output order, not the class attribute).
 */
const columnPresets = {
  full: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
  sidebar: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  compact: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  /* Portrait poster wall. Two-up only once there is room for the printed copy. */
  catalog: 'grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
} as const;

/** Grid that owns its own quick-view state so pages stay declarative. */
export function ProductGrid({
  products,
  columns = 'full',
  animateLayout = true,
}: {
  products: Product[];
  columns?: keyof typeof columnPresets;
  animateLayout?: boolean;
}) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  return (
    <>
      <motion.div
        layout={animateLayout}
        className={cn('grid gap-4 overflow-x-clip sm:gap-5', columnPresets[columns])}
      >
        <AnimatePresence mode="popLayout">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              layout={animateLayout}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} onQuickView={setQuickView} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
