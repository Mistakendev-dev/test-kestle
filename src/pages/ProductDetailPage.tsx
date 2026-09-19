import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getProduct, products, productsByGame } from '../data/products';
import { games, getGame } from '../data/games';
import { pushRecentlyViewed } from '../lib/recentlyViewed';
import { ProductGrid } from '../components/ProductGrid';
import { GameCard } from '../components/GameCard';
import { Lightbox, type LightboxFrame } from '../components/Lightbox';
import { Reveal, Stagger } from '../components/anim/Reveal';
import { ProductShowcase } from '../sections/product/ProductShowcase';
import { ProductPurchase } from '../sections/product/ProductPurchase';
import { ProductTabs } from '../sections/product/ProductTabs';
import { ProductVisuals } from '../sections/product/ProductVisuals';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProduct(id ?? '');
  const [frameIndex, setFrameIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setFrameIndex(0);
    setLightbox(null);
    if (product) pushRecentlyViewed(product.id);
  }, [id, product]);

  const frames = useMemo<LightboxFrame[]>(() => {
    if (!product) return [];
    const game = getGame(product.game);
    return [
      { label: product.category, variant: 0, image: product.image },
      { label: game?.short ?? 'GAME', variant: 1 },
      { label: 'Instant', variant: 2 },
      { label: 'Verified', variant: 3 },
    ];
  }, [product]);

  /** Same-game listings first, then other titles so the rail is never short. */
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
      {/* Page-level ambient system — keeps the product lifted off the background. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[900px] overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_25%,black,transparent)]" />
        <div
          className="absolute left-1/2 top-[-12%] h-[620px] w-[1100px] -translate-x-1/2 rounded-full opacity-70 blur-[130px]"
          style={{ background: 'radial-gradient(ellipse, rgba(46,48,106,0.4) 0%, transparent 65%)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-56"
          style={{ background: 'linear-gradient(to bottom, transparent, #050507)' }}
        />
      </div>

      <div className="container-wide relative pb-28 pt-24 md:pt-32">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
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
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          <Reveal>
            <ProductShowcase
              product={product}
              frames={frames}
              index={frameIndex}
              onSelect={setFrameIndex}
              onExpand={() => setLightbox(frameIndex)}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ProductPurchase product={product} />
          </Reveal>
        </div>

        <div className="mt-24">
          <Reveal>
            <ProductTabs product={product} />
          </Reveal>
        </div>

        <div className="mt-24">
          <ProductVisuals product={product} frames={frames} onOpen={setLightbox} />
        </div>

        {related.length > 0 && (
          <section className="mt-24">
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

        <section className="mt-24">
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
