import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { featuredProducts } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Reveal, Stagger } from '../components/anim/Reveal';

export function FeaturedProducts() {
  return (
    <section className="relative py-24">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: 'radial-gradient(ellipse, rgba(46,48,106,0.4) 0%, transparent 70%)' }}
      />
      <div className="container-wide relative">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-label">Featured</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                Featured products
              </h2>
              <p className="mt-3 max-w-lg text-zinc-400">
                Best sellers and limited stock, hand-picked from the marketplace.
              </p>
            </div>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-accent-bright transition-colors hover:text-white"
            >
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
