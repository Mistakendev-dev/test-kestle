import { Headset, ListFilter, ScrollText, ShoppingBag } from 'lucide-react';
import { Reveal, Stagger } from '../components/anim/Reveal';

/**
 * Describes the shopping experience the UI actually provides — no claims about
 * delivery times, volumes or protections that the frontend cannot back up.
 */
const reasons = [
  {
    icon: ListFilter,
    title: 'Easy browsing',
    text: 'Find products quickly with filters and game categories.',
  },
  {
    icon: ScrollText,
    title: 'Clear product details',
    text: 'See product information before adding anything to your cart.',
  },
  {
    icon: ShoppingBag,
    title: 'Simple checkout',
    text: 'A straightforward shopping experience from product to cart.',
  },
  {
    icon: Headset,
    title: 'Customer support',
    text: 'Get help when you need it.',
  },
];

export function WhyShopHere() {
  return (
    <section className="relative border-t border-edge bg-panel/20 py-24">
      <div className="container-wide">
        <Reveal>
          <div className="mb-14 max-w-xl">
            <p className="section-label">Why shop here</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              Built around the browse
            </h2>
            <p className="mt-3 text-zinc-400">
              Everything here is designed to get you from landing page to the right product with as little
              friction as possible.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" step={0.08}>
          {reasons.map((r) => (
            <div
              key={r.title}
              className="group relative overflow-hidden rounded-2xl border border-edge bg-white/[0.02] p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent-light/40 hover:bg-white/[0.04]"
            >
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/0 blur-2xl transition-all duration-500 group-hover:bg-accent/25"
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-edge bg-accent/10 transition-all duration-500 group-hover:scale-105 group-hover:bg-accent/25">
                <r.icon className="h-8 w-8 text-accent-bright" />
              </div>
              <h3 className="relative mt-6 font-display text-xl font-semibold text-white">{r.title}</h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-zinc-400">{r.text}</p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
