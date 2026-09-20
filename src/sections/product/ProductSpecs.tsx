import type { Product } from '../../data/products';
import { getGame } from '../../data/games';

/**
 * Thin divided band of the facts a buyer checks before committing. Reads as a
 * spec plate on the object rather than a card grid.
 */
export function ProductSpecs({ product }: { product: Product }) {
  const game = getGame(product.game);

  const specs = [
    { label: 'Game', value: game?.name ?? product.game },
    { label: 'Type', value: product.category },
    { label: 'Platform', value: 'PC' },
    { label: 'Delivery', value: 'Instant' },
    { label: 'Stock', value: product.stock > 0 ? `${product.stock} available` : 'Sold out' },
  ];

  return (
    <dl className="pane grid grid-cols-2 gap-px overflow-hidden bg-white/[0.06] sm:grid-cols-3 lg:grid-cols-5">
      {specs.map((s) => (
        <div key={s.label} className="bg-[#08080f]/90 px-5 py-5 lg:px-6">
          <dt className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-600">{s.label}</dt>
          <dd className="mt-2 font-display text-base font-semibold text-white lg:text-lg">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
