import { Maximize2 } from 'lucide-react';
import type { Product } from '../../data/products';
import type { LightboxFrame } from '../../components/Lightbox';
import { ProductArt } from '../../components/ProductArt';
import { Reveal } from '../../components/anim/Reveal';
import { Tilt } from '../../components/anim/Tilt';
import { cn } from '../../lib/utils';

/**
 * Film stills rather than a thumbnail grid: one wide lead frame, then the
 * supporting frames in a strip beneath it. Each frame tilts a few degrees
 * toward the cursor so it reads as a physical print.
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

  const [lead, ...rest] = frames;

  return (
    <section>
      <Reveal>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="section-label">Gallery</p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              Inside the product
            </h2>
          </div>
          <span className="hidden text-sm text-zinc-600 sm:block">{frames.length} frames</span>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <Frame
          product={product}
          frame={lead}
          index={0}
          onOpen={onOpen}
          className="aspect-[16/9] w-full md:aspect-[21/9]"
          size="lg"
        />
      </Reveal>

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {rest.map((frame, i) => (
          <Reveal key={frame.label} delay={0.1 + i * 0.05}>
            <Frame
              product={product}
              frame={frame}
              index={i + 1}
              onOpen={onOpen}
              className="aspect-[4/3] w-full"
              size="md"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Frame({
  product,
  frame,
  index,
  onOpen,
  className,
  size,
}: {
  product: Product;
  frame: LightboxFrame;
  index: number;
  onOpen: (index: number) => void;
  className?: string;
  size: 'md' | 'lg';
}) {
  return (
    <Tilt strength={3.5}>
      <button
        onClick={() => onOpen(index)}
        aria-label={`Open ${frame.label} preview`}
        className={cn(
          'group relative block overflow-hidden rounded-2xl border border-white/[0.08] shadow-rest transition-colors duration-500 hover:border-accent-light/45',
          className,
        )}
      >
        <ProductArt
          gameId={product.id}
          image={frame.image}
          alt={`${product.name} — ${frame.label}`}
          size={size}
          variant={frame.variant}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-void/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 scale-90 items-center justify-center rounded-full border border-white/15 bg-void/75 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </span>
        </span>

        <span className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-white/10 bg-void/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-300 backdrop-blur-sm">
          {frame.label}
        </span>
      </button>
    </Tilt>
  );
}
