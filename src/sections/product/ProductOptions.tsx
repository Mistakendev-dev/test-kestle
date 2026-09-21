import type { GameProduct, Variant } from '../../data/products';
import { VariantSelector } from '../../components/variants/VariantSelector';
import { ProductPurchasePanel } from './ProductPurchasePanel';

/**
 * The heart of the hub: every option this title is sold in, paired with the
 * purchase panel for whichever one is selected. The panel sticks so price and
 * stock stay in view however long the option list runs.
 */
export function ProductOptions({
  product,
  variant,
  onSelect,
  qty,
  onQty,
  railRef,
}: {
  product: GameProduct;
  variant: Variant;
  onSelect: (v: Variant) => void;
  qty: number;
  onQty: (next: number) => void;
  railRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section ref={railRef} id="options" className="scroll-mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Choose your version</p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            {product.variantCount} {product.variantCount === 1 ? 'option' : 'options'} available
          </h2>
        </div>
        {!product.available && (
          <p className="text-sm font-medium text-zinc-500">Currently unavailable</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-8">
        <VariantSelector product={product} selectedId={variant.id} onSelect={onSelect} />
        <div className="lg:sticky lg:top-28">
          <ProductPurchasePanel product={product} variant={variant} qty={qty} onQty={onQty} />
        </div>
      </div>
    </section>
  );
}
