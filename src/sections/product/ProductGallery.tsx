import { Maximize2 } from 'lucide-react';
import type { Product } from '../../data/products';
import type { LightboxFrame } from '../../components/Lightbox';
import { ProductArt } from '../../components/ProductArt';
import { Reveal } from '../../components/anim/Reveal';
import { cn } from '../../lib/utils';

/**
 * Editorial gallery: one focal frame at 2×2 with four supporting frames
 * filling the remaining cells, rather than a uniform grid of thumbnails.
 */
export function ProductGallery({
  product,
  frames,
  onOpen,
}: {
  product: Product;
  frames: LightboxFrame[];
  onOpen: (index: number) => void;
}) {
  if (frames.length === 0) return null;

  return (
    <section>
      <Reveal>
        <div className="mb-8">
          <p className="section-label">Gallery</p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            Inside the product
          </h2>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2">
          {frames.map((frame, i) => (
            <button
              key={frame.label}
              onClick={() => onOpen(i)}
              aria-label={`Open ${frame.label} preview`}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-rest transition-all duration-500 hover:border-accent-light/45 hover:shadow-lift',
                i === 0
                  ? 'col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto'
                  : 'aspect-[4/3] md:aspect-auto',
              )}
            >
              <ProductArt
                gameId={product.game}
                image={frame.image}
                alt={`${product.name} — ${frame.label}`}
                size={i === 0 ? 'lg' : 'md'}
                variant={frame.variant}
                className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />

              {/* Glass overlay + control, revealed on approach. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-void/35 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <span className="flex h-11 w-11 scale-90 items-center justify-center rounded-full border border-white/15 bg-void/75 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </span>

              <span className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-white/10 bg-void/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-300 backdrop-blur-sm">
                {frame.label}
              </span>
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
