import { Maximize2 } from 'lucide-react';
import type { Product } from '../../data/products';
import type { LightboxFrame } from '../../components/Lightbox';
import { ProductArt } from '../../components/ProductArt';
import { Reveal, Stagger } from '../../components/anim/Reveal';

/** Large preview grid — first frame spans two columns so the row has a focal point. */
export function ProductVisuals({
  product,
  frames,
  onOpen,
}: {
  product: Product;
  frames: LightboxFrame[];
  onOpen: (index: number) => void;
}) {
  return (
    <section>
      <Reveal>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="section-label">Gallery</p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              Product previews
            </h2>
          </div>
          <p className="hidden text-sm text-zinc-500 sm:block">Click any preview to view it full screen.</p>
        </div>
      </Reveal>

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.07}>
        {frames.map((frame, i) => (
          <button
            key={frame.label}
            onClick={() => onOpen(i)}
            aria-label={`Open ${frame.label} preview`}
            className={`group relative overflow-hidden rounded-2xl border border-edge transition-all duration-500 hover:-translate-y-1 hover:border-accent-light/45 hover:shadow-[0_0_50px_-16px_rgba(74,79,158,0.85)] ${
              i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
            }`}
          >
            <ProductArt
              gameId={product.game}
              image={frame.image}
              alt={`${product.name} — ${frame.label}`}
              size={i === 0 ? 'lg' : 'md'}
              variant={frame.variant}
              className={`w-full transition-transform duration-700 group-hover:scale-[1.04] ${
                i === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'
              }`}
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-300">{frame.label}</span>
              <Maximize2 className="h-4 w-4 translate-y-1 text-accent-bright opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
          </button>
        ))}
      </Stagger>
    </section>
  );
}
