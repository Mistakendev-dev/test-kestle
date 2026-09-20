import { Link } from 'react-router-dom';
import { ArrowRight, Boxes, Code2, LineChart, Palette, Tags, Wallet } from 'lucide-react';
import { Reveal, Stagger } from '../components/anim/Reveal';

const benefits = [
  {
    icon: Tags,
    title: 'Your pricing',
    text: 'Set your own margins on every listing you carry. You keep the difference.',
  },
  {
    icon: Palette,
    title: 'Your branding',
    text: 'Storefront name, colours and domain. Customers see your brand, not ours.',
  },
  {
    icon: Boxes,
    title: 'Shared catalogue',
    text: 'Pull from the full inventory across every supported title. No stock to hold.',
  },
  {
    icon: Wallet,
    title: 'Consolidated payouts',
    text: 'Orders settle to a single balance you can withdraw on your own schedule.',
  },
  {
    icon: Code2,
    title: 'API access',
    text: 'Read the catalogue and place orders programmatically. Documented endpoints.',
  },
  {
    icon: LineChart,
    title: 'Order overview',
    text: 'Track what sold, what is pending and what needs attention in one view.',
  },
];

const steps = [
  { n: '01', title: 'Apply', text: 'Tell us about your audience and where you sell today.' },
  { n: '02', title: 'Configure', text: 'Pick the catalogue you want to carry and set your pricing.' },
  { n: '03', title: 'Launch', text: 'Point your domain at the storefront and start taking orders.' },
];

export function ResellPage() {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[760px] overflow-hidden">
        <div
          className="absolute left-1/2 top-[-18%] h-[640px] w-[1180px] -translate-x-1/2 rounded-full opacity-70 blur-[130px]"
          style={{ background: 'radial-gradient(ellipse, rgba(46,48,106,0.45) 0%, transparent 65%)' }}
        />
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_15%,black,transparent)]" />
      </div>

      <div className="container-wide relative pb-28 pt-28 md:pt-36">
        <Reveal>
          <div className="max-w-3xl">
            <p className="section-label">Resell</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
              Build your own storefront.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Sell the full catalogue under your own brand. We handle inventory and
              fulfilment — you own the customer relationship and set the price.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to="/docs" className="btn-primary btn-shine !px-8 !py-3.5 text-[15px]">
                Read the docs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/products" className="btn-ghost !py-3.5">
                Browse the catalogue
              </Link>
            </div>
          </div>
        </Reveal>

        <section className="mt-24">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              What you get
            </h2>
          </Reveal>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.05}>
            {benefits.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="pane lit-edge group p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent-light/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-accent/15">
                  <Icon className="h-6 w-6 text-accent-bright" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p>
              </div>
            ))}
          </Stagger>
        </section>

        <section className="mt-24">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              How it works
            </h2>
          </Reveal>
          <Stagger className="mt-8 grid gap-4 md:grid-cols-3" step={0.08}>
            {steps.map((s) => (
              <div key={s.n} className="pane p-7">
                <span className="font-display text-4xl font-bold tracking-tight text-accent-light/50">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.text}</p>
              </div>
            ))}
          </Stagger>
        </section>

        <Reveal>
          <div className="pane-hero mt-24 flex flex-col items-start gap-6 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                Ready to start selling?
              </h2>
              <p className="mt-3 max-w-md text-[15px] text-zinc-400">
                Reach out and we will walk you through catalogue access and setup.
              </p>
            </div>
            <Link to="/docs" className="btn-primary btn-shine shrink-0 !px-8 !py-3.5 text-[15px]">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
