/**
 * Documentation content for the reseller API.
 *
 * Illustrative reference for this frontend demo — the endpoints below describe
 * the intended shape of the service, not a deployed backend. Replace this array
 * with real content (or a CMS response) when the API exists.
 */

export interface DocBlock {
  kind: 'text' | 'code' | 'list';
  /** Language label shown on code blocks. */
  lang?: string;
  body: string;
  items?: string[];
}

export interface DocSection {
  id: string;
  title: string;
  group: string;
  blocks: DocBlock[];
}

export const docSections: DocSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    group: 'Getting started',
    blocks: [
      {
        kind: 'text',
        body: 'The reseller API gives you programmatic access to the catalogue, pricing and order placement. Everything the storefront does, you can do from your own application.',
      },
      {
        kind: 'text',
        body: 'Requests are JSON over HTTPS. Every response includes a `request_id` you can quote when contacting support.',
      },
      { kind: 'code', lang: 'http', body: 'https://api.example.com/v1' },
    ],
  },
  {
    id: 'authentication',
    title: 'Authentication',
    group: 'Getting started',
    blocks: [
      {
        kind: 'text',
        body: 'Authenticate with a bearer token issued from your reseller dashboard. Keep it server-side — a key in browser code is a key you have published.',
      },
      {
        kind: 'code',
        lang: 'bash',
        body: 'curl https://api.example.com/v1/products \\\n  -H "Authorization: Bearer $API_KEY"',
      },
      {
        kind: 'list',
        body: 'Keys come in two scopes:',
        items: [
          'read — browse the catalogue and check availability',
          'write — place and cancel orders against your balance',
        ],
      },
    ],
  },
  {
    id: 'catalogue',
    title: 'Catalogue',
    group: 'Reference',
    blocks: [
      {
        kind: 'text',
        body: 'List available products. Results are paginated at 50 per page and can be filtered by game, category or availability.',
      },
      {
        kind: 'code',
        lang: 'json',
        body: `{
  "data": [
    {
      "id": "rust-nfa",
      "name": "Rust Steam NFA Account",
      "game": "rust",
      "category": "NFA",
      "price": 4.99,
      "stock": 24
    }
  ],
  "page": 1,
  "has_more": true
}`,
      },
    ],
  },
  {
    id: 'orders',
    title: 'Orders',
    group: 'Reference',
    blocks: [
      {
        kind: 'text',
        body: 'Create an order by referencing a product id and quantity. Orders settle against your reseller balance and return immediately with a status.',
      },
      {
        kind: 'code',
        lang: 'bash',
        body: `curl -X POST https://api.example.com/v1/orders \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"product_id":"rust-nfa","quantity":1}'`,
      },
      {
        kind: 'list',
        body: 'An order moves through these states:',
        items: [
          'pending — accepted, awaiting fulfilment',
          'delivered — credentials released to you',
          'refunded — returned to your balance',
        ],
      },
    ],
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    group: 'Reference',
    blocks: [
      {
        kind: 'text',
        body: 'Register an endpoint to receive order status changes rather than polling. Each delivery is signed so you can verify it came from us.',
      },
      {
        kind: 'code',
        lang: 'json',
        body: `{
  "event": "order.delivered",
  "order_id": "ord_8f21c4",
  "delivered_at": "2026-01-14T09:22:11Z"
}`,
      },
    ],
  },
  {
    id: 'errors',
    title: 'Errors',
    group: 'Reference',
    blocks: [
      {
        kind: 'text',
        body: 'Errors use standard HTTP status codes with a machine-readable code and a human-readable message.',
      },
      {
        kind: 'list',
        body: 'Common responses:',
        items: [
          '401 — invalid or missing API key',
          '404 — product or order not found',
          '409 — insufficient stock for the requested quantity',
          '429 — rate limit exceeded, retry after the given interval',
        ],
      },
    ],
  },
];
