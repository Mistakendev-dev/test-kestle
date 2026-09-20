import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HowItWorks } from '../sections/HowItWorks';
import { WhyShopHere } from '../sections/WhyShopHere';
import { Reveal } from '../components/anim/Reveal';

export function HowItWorksPage() {
  return (
    <div className="pt-16">
      <div className="container-wide pt-16 text-center">
        <Reveal>
          <p className="section-label">The Process</p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Ordering takes less than two minutes
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">
            No sign-ups, no waiting rooms, no manual processing. Here is exactly what happens when you order.
          </p>
        </Reveal>
      </div>
      <HowItWorks />
      <WhyShopHere />
      <div className="container-wide py-20 text-center">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">See it in action</h2>
          <p className="mx-auto mt-3 max-w-md text-zinc-400">
            Browse live stock and place your first order — delivery is instant.
          </p>
          <div className="mt-7 flex justify-center">
            <Link to="/products" className="btn-primary btn-shine !px-8 !py-3.5">
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
