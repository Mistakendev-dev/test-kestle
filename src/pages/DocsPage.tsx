import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { type DocBlock, docSections } from '../data/docs';
import { cn } from '../lib/utils';

function CodeBlock({ block }: { block: DocBlock }) {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#07070c]">
      {block.lang && (
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {block.lang}
          </span>
          <span aria-hidden className="flex gap-1.5">
            {['#2e306a', '#1e2048', '#15161f'].map((c) => (
              <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />
            ))}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-4">
        <code className="font-mono text-[13px] leading-relaxed text-zinc-300">{block.body}</code>
      </pre>
    </div>
  );
}

function Block({ block }: { block: DocBlock }) {
  if (block.kind === 'code') return <CodeBlock block={block} />;

  if (block.kind === 'list') {
    return (
      <div className="mt-5">
        <p className="text-[15px] leading-[1.75] text-zinc-400">{block.body}</p>
        <ul className="mt-3 space-y-2">
          {block.items?.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-zinc-400">
              <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent-bright" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <p className="mt-5 text-[15px] leading-[1.75] text-zinc-400">{block.body}</p>;
}

export function DocsPage() {
  const [active, setActive] = useState(docSections[0].id);

  const groups = useMemo(() => {
    const map = new Map<string, typeof docSections>();
    for (const s of docSections) {
      const list = map.get(s.group) ?? [];
      list.push(s);
      map.set(s.group, list);
    }
    return [...map.entries()];
  }, []);

  // Scroll spy. The observer does the work, so nothing runs per scroll frame.
  useEffect(() => {
    const nodes = docSections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <div
          className="absolute left-1/2 top-[-22%] h-[520px] w-[1000px] -translate-x-1/2 rounded-full opacity-60 blur-[130px]"
          style={{ background: 'radial-gradient(ellipse, rgba(46,48,106,0.4) 0%, transparent 65%)' }}
        />
      </div>

      <div className="container-wide relative pb-28 pt-28 md:pt-32">
        <div className="max-w-2xl">
          <p className="section-label">Documentation</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
            Reseller API
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-zinc-400">
            Everything you need to integrate the catalogue into your own storefront.
          </p>
          <p className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm text-zinc-500">
            Illustrative reference for this demo storefront. The endpoints describe the intended
            shape of the service rather than a live backend.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="Documentation" className="pane p-4">
              {groups.map(([group, items]) => (
                <div key={group} className="mb-4 last:mb-0">
                  <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                    {group}
                  </p>
                  <ul className="space-y-0.5">
                    {items.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          aria-current={active === s.id ? 'true' : undefined}
                          className={cn(
                            'block rounded-lg px-3 py-2 text-sm transition-colors duration-200',
                            active === s.id
                              ? 'bg-accent/20 font-medium text-white'
                              : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white',
                          )}
                        >
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <Link
              to="/resell"
              className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm text-zinc-400 transition-colors hover:border-accent-light/40 hover:text-white"
            >
              Reseller programme
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>

          <div className="min-w-0">
            {docSections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 border-t border-edge pt-12 first:border-0 first:pt-0 [&+section]:mt-16">
                <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {section.title}
                </h2>
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
