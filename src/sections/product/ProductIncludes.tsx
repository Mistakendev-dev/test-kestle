import { Check } from 'lucide-react';
import type { Product } from '../../data/products';
import { Reveal, Stagger } from '../../components/anim/Reveal';

/**
 * What the listing actually contains, from the product's own `features`.
 * The old panel showed a fixed list of site-wide assurances here, which said
 * the same thing on all 47 listings.
 */
export function ProductIncludes({ product }: { product: Product }) {
  if (product.features.length === 0) return null;

  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
      <Reveal>
        <div>
          <p className="section-label">Included</p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            What you get
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-zinc-500">
            Everything listed here is delivered with this account. Support can answer questions before
            you order.
          </p>
        </div>
      </Reveal>

      <Stagger className="grid gap-px overflow-hidden rounded-2xl bg-white/[0.06] sm:grid-cols-2" step={0.05}>
        {product.features.map((f) => (
          <div key={f} className="flex h-full items-start gap-3.5 bg-[#08080f]/90 p-5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/25">
              <Check className="h-3.5 w-3.5 text-accent-bright" />
            </span>
            <span className="text-[15px] leading-snug text-zinc-300">{f}</span>
          </div>
        ))}
      </Stagger>
    </section>
  );
}
