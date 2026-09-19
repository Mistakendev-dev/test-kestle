import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../sections/Hero';
import { TheLatestDrop } from '../sections/TheLatestDrop';
import { ProductBelt } from '../sections/ProductBelt';
import { FindYourGame } from '../sections/FindYourGame';
import { MarketplaceOverview } from '../sections/MarketplaceOverview';
import { Reveal } from '../components/anim/Reveal';
import { MagneticButton } from '../components/anim/MagneticButton';

/**
 * Deliberately short. One big visual moment, one supporting section, repeat —
 * rather than a stack of competing product rails.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <div id="marketplace" className="scroll-mt-20">
        <TheLatestDrop />
      </div>
      <ProductBelt />
      <FindYourGame />
      <MarketplaceOverview />

      <section className="relative overflow-hidden py-28 md:py-36">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(46,48,106,0.35) 0%, transparent 70%)' }}
        />
        <div className="container-wide relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              Ready to get back in the game?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-zinc-400">
              Browse the full catalogue, pick your account, and get instant access. No waiting around.
            </p>
            <div className="mt-9 flex justify-center">
              <MagneticButton>
                <Link to="/products" className="btn-primary btn-shine !px-10 !py-4 text-base">
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
