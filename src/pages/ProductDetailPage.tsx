import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { getProduct, products, productsByGame } from '../data/products';
import { games, getGame } from '../data/games';
import { pushRecentlyViewed } from '../lib/recentlyViewed';
import { ProductGrid } from '../components/ProductGrid';
import { GameCard } from '../components/GameCard';
import { Lightbox, type LightboxFrame } from '../components/Lightbox';
import { Reveal, Stagger } from '../components/anim/Reveal';
import { ProductBackdrop } from '../sections/product/ProductBackdrop';
import { ProductHero } from '../sections/product/ProductHero';
import { ProductSpecs } from '../sections/product/ProductSpecs';
import { ProductIncludes } from '../sections/product/ProductIncludes';
import { ProductGallery } from '../sections/product/ProductGallery';
import { ProductTabs } from '../sections/product/ProductTabs';
import { ProductDock } from '../sections/product/ProductDock';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProduct(id ?? '');
  const [frameIndex, setFrameIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [qty, setQty] = useState(1);

  const railRef = useRef<HTMLDivElement>(null);
  /** The dock takes over once the hero's own purchase rail leaves the viewport.
      `useInView` reports false until the observer first fires, so the dock waits
      until the rail has actually been seen rather than flashing in on load. */
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
  }, [id, product]);

  const stock = product?.stock ?? 1;
  const clampQty = useCallback(
    (next: number) => setQty(Math.min(Math.max(1, next), Math.max(1, stock))),
    [stock],
  );

  /** Five frames: one lead plus four supporting, which fills the gallery strip. */
  const frames = useMemo<LightboxFrame[]>(() => {
    if (!product) return [];
    const game = getGame(product.game);
    return [
      { label: product.category, variant: 0, image: product.image },
      { label: game?.short ?? 'Game', variant: 1 },
      { label: 'Preview', variant: 2 },
      { label: 'Details', variant: 3 },
      { label: 'Delivery', variant: 4 },
    ];
  }, [product]);

  /** Same-game listings first, then same-type fill so the rail is never short. */
  const related = useMemo(() => {
    if (!product) return [];
    const sameGame = productsByGame(product.game).filter((p) => p.id !== product.id);
    if (sameGame.length >= 4) return sameGame.slice(0, 4);
    const fill = products.filter(
      (p) => p.id !== product.id && p.game !== product.game && p.category === product.category,
    );
    return [...sameGame, ...fill].slice(0, 4);
  }, [product]);

  const otherGames = useMemo(
    () => games.filter((g) => g.id !== product?.game).slice(0, 6),
    [product],
  );

  if (!product) {
    return (
      <div className="container-wide flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-24 text-center">
        <p className="font-display text-2xl font-bold text-white">Product not found</p>
        <p className="text-zinc-400">This listing may have sold out or been removed.</p>
        <Link to="/products" className="btn-primary btn-shine mt-2">
          Browse Products
        </Link>
      </div>
    );
  }

  const game = getGame(product.game);

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
          <Link to={`/games/${product.game}`} className="transition-colors hover:text-white">
            {game?.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-zinc-300">{product.name}</span>
        </nav>

        <ProductHero
          product={product}
          frames={frames}
          index={frameIndex}
          onSelect={setFrameIndex}
          onExpand={() => setLightbox(frameIndex)}
          qty={qty}
          onQty={clampQty}
          railRef={railRef}
        />

        <div className="mt-6">
          <Reveal>
            <ProductSpecs product={product} />
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
            <ProductTabs product={product} />
          </Reveal>
        </div>

        {related.length > 0 && (
          <section className="mt-28">
            <Reveal>
              <div className="mb-8">
                <p className="section-label">Keep looking</p>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                  You may also like
                </h2>
              </div>
            </Reveal>
            <ProductGrid products={related} columns="compact" animateLayout={false} />
          </section>
        )}

        <section className="mt-28">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="section-label">Discover</p>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Explore more games
                </h2>
              </div>
              <Link
                to="/games"
                className="hidden shrink-0 text-sm font-semibold text-accent-bright transition-colors hover:text-white sm:block"
              >
                View all games
              </Link>
            </div>
          </Reveal>
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" step={0.06}>
            {otherGames.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </Stagger>
        </section>
      </div>

      <ProductDock product={product} qty={qty} visible={railSeen && !railVisible} />

      <Lightbox
        frames={frames}
        index={lightbox}
        gameId={product.game}
        alt={product.name}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </div>
  );
}
