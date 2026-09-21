import { motion } from 'framer-motion';
import { CreditCard, Package, Search } from 'lucide-react';
import { Reveal } from '../components/anim/Reveal';

const steps = [
  {
    num: '01',
    icon: Search,
    title: 'Choose Your Product',
    text: 'Browse every game we carry, then pick the option you want. Filter by game, type, and price to find exactly what you need.',
  },
  {
    num: '02',
    icon: CreditCard,
    title: 'Complete Your Order',
    text: 'Add what you want to the cart and review it in one place before you confirm the order.',
  },
  {
    num: '03',
    icon: Package,
    title: 'Receive Your Account',
    text: 'Order details appear on your order page once checkout completes, with support on hand if anything looks wrong.',
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24">
      <div className="container-wide">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="section-label">How It Works</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              From checkout to in-game in minutes
            </h2>
          </div>
        </Reveal>

        <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="absolute left-[16%] right-[16%] top-10 hidden h-px origin-left bg-gradient-to-r from-accent-light/60 via-accent-bright/60 to-accent-light/60 md:block"
          />
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={0.2 + i * 0.25}>
              <div className="group relative text-center">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl border border-edge bg-panel/80 backdrop-blur-sm transition-colors duration-500 group-hover:border-accent-light/50" />
                  <div className="absolute inset-0 rounded-2xl bg-accent/0 blur-xl transition-all duration-500 group-hover:bg-accent/25" />
                  <s.icon className="relative h-8 w-8 text-accent-bright transition-transform duration-500 group-hover:scale-110" />
                </div>
                <span className="mt-5 block font-display text-xs font-bold tracking-[0.3em] text-accent-bright">
                  {s.num}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">{s.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
