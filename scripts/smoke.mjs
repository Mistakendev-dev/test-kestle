// Dev-only smoke test: server-renders every route to catch render-time crashes.
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
globalThis.matchMedia = () => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
});

const paths = [
  '/',
  '/products',
  '/products?game=rust&sort=price-asc',
  '/games',
  '/games/rust',
  '/resell',
  '/docs',
  '/how-it-works',
  '/faq',
  '/this-route-does-not-exist',
];

const server = await createServer({
  root: process.cwd(),
  logLevel: 'error',
  server: { middlewareMode: true },
});

const errors = [];
const origError = console.error;
console.error = (...a) => errors.push(a.map(String).join(' '));

let failed = 0;
let ran = 0;
try {
  const { routes } = await server.ssrLoadModule('/src/routes.tsx');
  const { products } = await server.ssrLoadModule('/src/data/products.ts');
  paths.push(`/product/${products[0].id}`);

  for (const path of paths) {
    errors.length = 0;
    ran++;
    try {
      const router = createMemoryRouter(routes, { initialEntries: [path] });
      const html = renderToString(React.createElement(RouterProvider, { router }));
      const bytes = Buffer.byteLength(html);
      const bad = errors.filter((e) => !/useLayoutEffect|hydrat/i.test(e));
      if (bad.length) {
        failed++;
        origError(`WARN  ${path} — ${bad.length} console error(s)`);
        bad.slice(0, 2).forEach((e) => origError(`        ${e.slice(0, 240)}`));
      } else if (bytes < 2000) {
        failed++;
        origError(`WARN  ${path} — rendered only ${bytes}b (suspiciously empty)`);
      } else {
        origError(`OK    ${path} — ${bytes}b`);
      }
    } catch (err) {
      failed++;
      origError(`FAIL  ${path}\n        ${err.stack?.split('\n').slice(0, 5).join('\n        ')}`);
    }
  }
} finally {
  await server.close();
  if (ran !== paths.length) origError(`\nHarness aborted: only ${ran}/${paths.length} routes ran`);
  else origError(failed ? `\n${failed} route(s) need attention` : `\nAll ${ran} routes rendered cleanly`);
}

process.exit(failed || ran !== paths.length ? 1 : 0);
