# Global spin counter

Standalone Cloudflare Worker + D1. The public frontend stays on GitHub Pages;
this backend has no Sites or OpenAI service dependency.

GET /spins returns `{ "count": 0 }`. POST /spins accepts `{ "id": "<UUID v4>" }`.
The client calls POST after a completed roll. Unique IDs prevent retries from
counting twice; a SQL trigger increments the shared total atomically. No user
accounts, IPs, or food selections are stored. This is an anonymous activity
counter, not a fraud-proof analytics system. Historical spins are not available.

## Deploy

Run from the repository root:

1. `npx wrangler login`
2. `npx wrangler d1 create truanayangi-counter`
3. Copy the returned database_id into counter/wrangler.jsonc's D1 binding.
4. `npx wrangler d1 migrations apply DB --remote --config counter/wrangler.jsonc`
5. `npx wrangler deploy --config counter/wrangler.jsonc`
6. Set counter/public-config.json apiUrl to the returned HTTPS worker URL + /spins.
7. Rebuild and publish the GitHub Pages frontend.

Never put Cloudflare credentials in frontend code. public-config.json contains
only the public endpoint. An empty endpoint hides the counter.

## Local testing

`npx wrangler d1 migrations apply DB --local --config counter/wrangler.jsonc`

`npx wrangler dev --config counter/wrangler.jsonc --var ALLOWED_ORIGIN:http://127.0.0.1:4173 --port 8788`

`node counter/tests/api.mjs`

`NEXT_PUBLIC_COUNTER_API_URL=http://127.0.0.1:8788/spins npx vite build --config vite.pages.config.ts`

The tests write only to local D1 by default. Do not run write/load tests against
the production counter. Back up D1 before any schema change that removes data.
