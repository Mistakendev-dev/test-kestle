import type { Product } from '../../data/products';
import { getGame } from '../../data/games';
import { ProductArt } from '../../components/ProductArt';

/**
 * The environment the product sits in. The listing's own artwork, blown up far
 * past legibility and colour-graded toward the game's hue, then pushed back
 * behind a vignette so it reads as surrounding space rather than an image.
 * Full-bleed and fixed height, fading out before the editorial sections.
 */
export function ProductBackdrop({ product }: { product: Product }) {
  const game = getGame(product.game);
  const color = game?.color ?? '#6b72d6';

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[1400px] overflow-hidden"
    >
      {/* The artwork itself, scaled well past the frame so no edges are legible. */}
      <div className="absolute inset-x-0 top-0 h-[820px] scale-[1.6] opacity-[0.3] blur-[110px]">
        <ProductArt gameId={product.game} image={product.image} alt="" size="xl" className="h-full w-full" />
      </div>

      {/* Colour grade: key light in the game's hue, brand counter-light opposite. */}
      <div
        className="absolute inset-x-0 top-0 h-[760px]"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 18% 4%, ${color}3d 0%, transparent 58%),
                       radial-gradient(ellipse 55% 50% at 88% 22%, rgba(46,48,106,0.5) 0%, transparent 62%)`,
        }}
      />
      <div
        className="absolute left-1/2 top-[-18%] h-[820px] w-[1300px] -translate-x-1/2 rounded-full opacity-70"
        style={{ background: `radial-gradient(ellipse, rgba(46,48,106,0.4) 0%, transparent 62%)` }}
      />

      {/* Push the whole environment back so foreground glass reads as lifted. */}
      <div className="absolute inset-0 bg-void/55" />
      <div className="bg-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_45%_at_50%_16%,black,transparent)]" />

      {/* Vignette, then a long fade into the page background. */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(125% 85% at 50% 22%, transparent 38%, rgba(5,5,7,0.85) 100%)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[420px]"
        style={{ background: 'linear-gradient(to bottom, transparent, #050507 82%)' }}
      />
      <div className="noise absolute inset-0" />
    </div>
  );
}
