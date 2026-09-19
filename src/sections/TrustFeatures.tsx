import { Gamepad2, Headset, ShieldCheck, ShoppingBag, Verified, Zap } from 'lucide-react';
import { Reveal, Stagger } from '../components/anim/Reveal';

const features = [
  { icon: Zap, title: 'Fast Delivery', text: 'Automated delivery sends your credentials the moment your order confirms.' },
  { icon: ShieldCheck, title: 'Secure Checkout', text: 'Encrypted payments with buyer protection on every single order.' },
  { icon: Headset, title: '24/7 Support', text: 'Real humans on Discord and email, with average responses under 15 minutes.' },
  { icon: Verified, title: 'Verified Accounts', text: 'Every account is checked and tested before it is listed for sale.' },
  { icon: ShoppingBag, title: 'Easy Ordering', text: 'No accounts or sign-ups required. Three clicks from browse to delivery.' },
  { icon: Gamepad2, title: 'Large Game Selection', text: 'Stock across 15+ major titles, with new games added based on demand.' },
];

export function TrustFeatures() {
  return (
    <section className="relative border-t border-edge bg-panel/20 py-24">
      <div className="container-wide">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="section-label">Why NFA Market</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              Built to be trusted
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-zinc-400">
              A marketplace that treats every order like it matters — because it does.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.08}>
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-edge bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-accent-light/40 hover:bg-white/[0.04]"
            >
              <div
                aria-hidden
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/0 blur-2xl transition-all duration-500 group-hover:bg-accent/20"
              />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-edge bg-accent/10 transition-colors duration-500 group-hover:bg-accent/20">
                <f.icon className="h-5 w-5 text-accent-bright" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.text}</p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
