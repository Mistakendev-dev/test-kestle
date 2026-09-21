import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { getProduct, products, resolveVariant, type Variant } from '../data/products';
import { pushRecentlyViewed } from '../lib/recentlyViewed';
import { ProductGrid } from '../components/ProductGrid';
import { Lightbox, type LightboxFrame } from '../components/Lightbox';
import { Reveal } from '../components/anim/Reveal';
import { ProductBackdrop } from '../sections/product/ProductBackdrop';
import { ProductHero } from '../sections/product/ProductHero';
import { ProductOptions } from '../sections/product/ProductOptions';
import { ProductSpecs } from '../sections/product/ProductSpecs';
import { ProductIncludes } from '../sections/product/ProductIncludes';
import { ProductGallery } from '../sections/product/ProductGallery';
import { ProductTabs } from '../sections/product/ProductTabs';
import { ProductDock } from '../sections/product/ProductDock';

/**
 * The hub for one game. Everything below the hero is scoped to the option the
 * visitor has selected, which lives in `?v=` so a specific version stays
 * linkable without giving every variant its own route.
 */
export function GameProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const product = getProduct(slug ?? '');
  const [frameIndex, setFrameIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [qty, setQty] = useState(1);

  const variant = product ? resolveVariant(product, searchParams.get('v')) : undefined;

  const railRef = useRef<HTMLDivElement>(null);
  /** The dock takes over once the option panel leaves the viewport. `useInView`
      reports false until the observer first fires, so the dock waits until the
      panel has actually been seen rather than flashing in on load. */
  const railVisible = useInView(railRef);
  const [railSeen, setRailSeen] = useState(false);
  useEffect(() => {
    if (railVisible) setRailSeen(true);
  }, [railVisible]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setFrameIndex(0);
    setLightbox(null);
    setQty(1);
    setRailSeen(false);
    if (product) pushRecentlyViewed(product.id);
  }, [slug, product]);

  const selectVariant = useCallback(
    (next: Variant) => {
      const params = new URLSearchParams(searchParams);
      params.set('v', next.id);
      setSearchParams(params, { replace: true });
      setQty(1);
    },
    [searchParams, setSearchParams],
  );

  const stock = variant?.stock ?? 1;
  const clampQty = useCallback(
    (next: number) => setQty(Math.min(Math.max(1, next), Math.max(1, stock))),
    [stock],
  );

  /** Five frames: one lead plus four supporting, which fills the gallery strip. */
  const frames = useMemo<LightboxFrame[]>(() => {
    if (!product) return [];
    return [
      { label: product.short, variant: 0, image: product.image },
      { label: product.genre, variant: 1 },
      { label: 'Preview', variant: 2 },
      { label: 'Details', variant: 3 },
      { label: 'Delivery', variant: 4 },
    ];
  }, [product]);

  /** Titles in the same genre first, then the deepest catalogues as fill. */
  const related = useMemo(() => {
    if (!product) return [];
    const others = products.filter((p) => p.id !== product.id);
    const sameGenre = others.filter((p) => p.genre === product.genre);
    const fill = others.filter((p) => p.genre !== product.genre);
    return [...sameGenre, ...fill].slice(0, 4);
  }, [product]);

  if (!product || !variant) {
    return (
      <div className="container-wide flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-24 text-center">
        <p className="font-display text-2xl font-bold text-white">Title not found</p>
        <p className="text-zinc-400">This game may have been removed from the marketplace.</p>
        <Link to="/products" className="btn-primary btn-shine mt-2">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <ProductBackdrop product={product} />

      <div className="container-wide relative pb-28 pt-24 md:pt-28">
        <nav
          aria-label="Breadcrumb"
          className="mb-12 flex flex-wrap items-center gap-1.5 text-sm text-zinc-500"
        >
          <Link to="/" className="transition-colors hover:text-white">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/products" className="transition-colors hover:text-white">Products</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-zinc-300">{product.name}</span>
        </nav>

        <ProductHero
          product={product}
          frames={frames}
          index={frameIndex}
          onSelect={setFrameIndex}
          onExpand={() => setLightbox(frameIndex)}
        />

        <div className="mt-16 sm:mt-20">
          <ProductOptions
            product={product}
            variant={variant}
            onSelect={selectVariant}
            qty={qty}
            onQty={clampQty}
            railRef={railRef}
          />
        </div>

        <div className="mt-24">
          <Reveal>
            <ProductSpecs product={product} variant={variant} />
          </Reveal>
        </div>

        <div className="mt-28">
          <ProductIncludes product={product} />
        </div>

        <div className="mt-28">
          <ProductGallery product={product} frames={frames} onOpen={setLightbox} />
        </div>

        <div className="mt-28">
          <Reveal>
            <ProductTabs product={product} variant={variant} />
          </Reveal>
        </div>

        {related.length > 0 && (
          <section className="mt-28">
            <Reveal>
              <div className="mb-8">
                <p className="section-label">Keep looking</p>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Other titles
                </h2>
              </div>
            </Reveal>
            <ProductGrid products={related} columns="compact" animateLayout={false} />
          </section>
        )}
      </div>

      <ProductDock
        product={product}
        variant={variant}
        qty={qty}
        visible={railSeen && !railVisible}
      />

      <Lightbox
        frames={frames}
        index={lightbox}
        gameId={product.id}
        alt={product.name}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </div>
  );
}
