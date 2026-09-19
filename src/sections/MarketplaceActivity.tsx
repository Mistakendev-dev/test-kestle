import { Link } from 'react-router-dom';
import { Activity, Eye, PackagePlus, TriangleAlert } from 'lucide-react';
import { products } from '../data/products';
import { getGame } from '../data/games';
import { Reveal } from '../components/anim/Reveal';
import { ProductArt } from '../components/ProductArt';

type Kind = 'added' | 'viewed' | 'low';

const meta: Record<Kind, { label: string; icon: typeof Eye; tone: string }> = {
  added: { label: 'Recently added', icon: PackagePlus, tone: 'text-accent-bright bg-accent/15' },
  viewed: { label: 'Recently viewed', icon: Eye, tone: 'text-zinc-300 bg-white/[0.06]' },
  low: { label: 'Low stock', icon: TriangleAlert, tone: 'text-amber-300 bg-amber-500/15' },
};

const newest = [...products].sort((a, b) => b.createdAt - a.createdAt);
const lowStock = products.filter((p) => p.stock <= 6);

const feed: { id: string; kind: Kind }[] = (
  [
    { id: newest[0]?.id, kind: 'added' },
    { id: products.find((p) => p.game === 'cs2')?.id ?? products[1].id, kind: 'viewed' },
    { id: lowStock[0]?.id ?? products[2].id, kind: 'low' },
    { id: newest[1]?.id, kind: 'added' },
  ] as { id: string | undefined; kind: Kind }[]
).filter((x): x is { id: string; kind: Kind } => Boolean(x.id));

export function MarketplaceActivity() {
  return (
    <section className="border-t border-edge py-16 md:py-20">
      <div className="container-wide">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4 text-accent-bright" />
              <h2 className="font-display text-lg font-semibold text-white">Marketplace activity</h2>
            </div>
            <span className="rounded-lg border border-edge bg-white/[0.02] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Demo data
            </span>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {feed.map((entry, i) => {
            const product = products.find((p) => p.id === entry.id);
            if (!product) return null;
            const { label, icon: Icon, tone } = meta[entry.kind];
            return (
              <Reveal key={`${entry.id}-${entry.kind}`} delay={i * 0.07}>
                <Link
                  to={`/product/${product.id}`}
                  className="group flex h-full items-center gap-3 rounded-2xl border border-edge bg-white/[0.02] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-light/40 hover:bg-white/[0.04]"
                >
                  <ProductArt
                    gameId={product.game}
                    image={product.image}
                    alt={product.name}
                    className="h-14 w-16 shrink-0 rounded-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-accent-bright">
                      {getGame(product.game)?.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">{product.name}</p>
                    <span
                      className={`mt-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${tone}`}
                    >
                      <Icon className="h-3 w-3" />
                      {label}
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
