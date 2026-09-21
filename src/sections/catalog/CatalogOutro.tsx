import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { games } from '../../data/games';
import { products, totalStock, totalVariants } from '../../data/products';
import { ProductArt } from '../../components/ProductArt';
import { Reveal } from '../../components/anim/Reveal';

/** Demo catalogue figures. Derived from the bundled data, never invented. */
const figures = [
  { value: String(products.length), label: 'Games' },
  { value: String(totalVariants), label: 'Options' },
  { value: totalStock.toLocaleString(), label: 'In stock' },
];

const backdrop = games.slice(0, 4);

/**
 * The page's full stop, and the only place the heaviest glass is used — so it
 * reads as a single closing statement rather than one more panel.
 */
export function CatalogOutro() {
  return (
    <section className="pb-24 pt-4">
      <div className="container-wide">
        <Reveal>
          <div className="glass-deep glass-sheen relative overflow-hidden rounded-[28px]">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 scale-110 opacity-30 blur-[60px]">
                <div className="grid h-full w-full grid-cols-4">
                  {backdrop.map((g) => (
                    <ProductArt key={g.id} gameId={g.id} size="sm" className="h-full w-full" />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex flex-col gap-10 p-8 sm:p-12 lg:flex-row lg:items-end lg:justify-between lg:p-14">
              <div className="max-w-md">
                <p className="section-label">Marketplace</p>
                <h2 className="mt-4 font-display text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl">
                  Everything available, in one place.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
                  Accounts across every title we carry, delivered the moment you check out.
                </p>
                <Link to="/how-it-works" className="btn-ghost mt-8">
                  How it works
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <dl className="flex gap-8 sm:gap-14">
                {figures.map((f) => (
                  <div key={f.label}>
                    <dd className="font-display text-3xl font-bold leading-none text-white sm:text-5xl">
                      {f.value}
                    </dd>
                    <dt className="mt-2.5 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      {f.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
