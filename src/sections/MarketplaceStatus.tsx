import { games } from '../data/games';
import { products } from '../data/products';
import { Reveal } from '../components/anim/Reveal';

const stats = [
  { label: 'Products', value: `${Math.floor(products.length / 10) * 10}+` },
  { label: 'Games', value: `${games.length}+` },
  { label: 'Support', value: '24/7' },
];

export function MarketplaceStatus() {
  return (
    <section className="container-wide -mt-4 pb-4">
      <Reveal>
        <div className="flex flex-col gap-4 rounded-2xl border border-edge bg-white/[0.02] px-5 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Marketplace Online
            </span>
          </div>

          <div className="flex items-center gap-6 sm:gap-10">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="font-display text-lg font-bold text-white">{s.value}</span>
                <span className="text-xs text-zinc-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
