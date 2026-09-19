import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Reveal } from '../components/anim/Reveal';

const popular = [
  { label: 'Rust', game: 'rust' },
  { label: 'CS2', game: 'cs2' },
  { label: 'GTA V', game: 'gta5' },
  { label: 'Fortnite', game: 'fortnite' },
  { label: 'Apex', game: 'apex' },
  { label: 'R6', game: 'r6' },
];

export function SearchSpotlight() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  }

  return (
    <section className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 55% 70% at 50% 50%, rgba(46,48,106,0.3) 0%, transparent 68%)' }}
      />
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_50%_60%_at_50%_50%,black,transparent)]" />

      <div className="container-wide relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              What are you looking for?
            </h2>
            <p className="mt-3 text-zinc-400">
              Search the full catalogue by game, product type or keyword.
            </p>

            <form onSubmit={submit} className="group relative mt-9">
              <div
                aria-hidden
                className="absolute -inset-1 rounded-2xl opacity-0 blur-lg transition-opacity duration-500 group-focus-within:opacity-100"
                style={{ background: 'radial-gradient(ellipse at center, rgba(74,79,158,0.55), transparent 70%)' }}
              />
              <div className="relative flex items-center gap-3 rounded-2xl border border-edge bg-panel/70 px-5 py-2 backdrop-blur-xl transition-colors duration-300 focus-within:border-accent-light/60">
                <Search className="h-5 w-5 shrink-0 text-zinc-500 transition-colors group-focus-within:text-accent-bright" />
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Search games, products..."
                  aria-label="Search games and products"
                  className="w-full bg-transparent py-3.5 text-base text-white placeholder-zinc-600 outline-none"
                />
                <button type="submit" className="btn-primary btn-shine shrink-0 !px-5 !py-2.5 text-sm">
                  Search
                </button>
              </div>
            </form>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">Popular</span>
              {popular.map((p) => (
                <button
                  key={p.game}
                  onClick={() => navigate(`/products?game=${p.game}`)}
                  className="rounded-lg border border-edge bg-white/[0.03] px-3.5 py-1.5 text-sm font-medium text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-light/50 hover:bg-accent/20 hover:text-white"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
