import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../sections/Hero';
import { ProductMarquee } from '../sections/ProductMarquee';
import { MarketplaceStatus } from '../sections/MarketplaceStatus';
import { GameCategories } from '../sections/GameCategories';
import { FeaturedProducts } from '../sections/FeaturedProducts';
import { Stats } from '../sections/Stats';
import { HowItWorks } from '../sections/HowItWorks';
import { TrustFeatures } from '../sections/TrustFeatures';
import { PopularProducts } from '../sections/PopularProducts';
import { MarketplaceActivity } from '../sections/MarketplaceActivity';
import { RecentlyViewed } from '../sections/RecentlyViewed';
import { Testimonials } from '../sections/Testimonials';
import { FaqSection } from '../sections/FaqSection';
import { Reveal } from '../components/anim/Reveal';
import { MagneticButton } from '../components/anim/MagneticButton';

export function HomePage() {
  return (
    <>
      <Hero />
      <ProductMarquee />
      <MarketplaceStatus />
      <FeaturedProducts />
      <GameCategories />
      <Stats />
      <PopularProducts />
      <HowItWorks />
      <TrustFeatures />
      <MarketplaceActivity />
      <RecentlyViewed />
      <Testimonials />
      <FaqSection limit={4} />

      <section className="relative overflow-hidden py-24">
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
            <div className="mt-8 flex justify-center">
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
