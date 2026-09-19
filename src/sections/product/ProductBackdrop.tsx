import type { Product } from '../../data/products';
import { getGame } from '../../data/games';
import { ProductArt } from '../../components/ProductArt';

/**
 * Cinematic environment for a listing: the product's own artwork blurred far
 * past legibility, darkened and tinted with the game's colour. Full-bleed, so
 * it extends beyond the content column rather than sitting inside it.
 */
export function ProductBackdrop({ product }: { product: Product }) {
  const game = getGame(product.game);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[1100px] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[680px] scale-[1.35] opacity-[0.28] blur-[90px]">
        <ProductArt
          gameId={product.game}
          image={product.image}
          alt=""
          size="xl"
          className="h-full w-full"
        />
      </div>

      {/* Colour wash from the title, kept low so the page stays on-brand. */}
      <div
        className="absolute inset-x-0 top-0 h-[560px] opacity-50"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 22% 8%, ${game?.color ?? '#6b72d6'}2e 0%, transparent 62%)`,
        }}
      />
      {/* Brand counter-light. */}
      <div
        className="absolute left-1/2 top-[-14%] h-[700px] w-[1200px] -translate-x-1/2 rounded-full opacity-75 blur-[140px]"
        style={{ background: 'radial-gradient(ellipse, rgba(46,48,106,0.45) 0%, transparent 66%)' }}
      />

      <div className="absolute inset-0 bg-void/50" />
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_50%_at_50%_18%,black,transparent)]" />
      {/* Vignette, then a hard fade into the page background. */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(130% 90% at 50% 25%, transparent 45%, rgba(5,5,7,0.8) 100%)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-72"
        style={{ background: 'linear-gradient(to bottom, transparent, #050507)' }}
      />
      <div className="noise absolute inset-0" />
    </div>
  );
}
