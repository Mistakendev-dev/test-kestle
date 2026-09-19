import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { cn } from '../lib/utils';

/** Grid that owns its own quick-view state so pages stay declarative. */
export function ProductGrid({
  products,
  className,
  animateLayout = true,
}: {
  products: Product[];
  className?: string;
  animateLayout?: boolean;
}) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  return (
    <>
      <motion.div
        layout={animateLayout}
        className={cn(
          'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4',
          className,
        )}
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
