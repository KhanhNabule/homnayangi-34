# Community frontend

- This public repository preserves the history of nagisanzenin/truanayangi, transferred with Walter's explicit authorization on 2026-09-10.
- Current code is a standalone static frontend. No backend, OAuth/login, production API clients, cloud credentials or infrastructure state.
- Use pnpm, compatible current stable packages and committed lockfiles. Build locally; do not add Entire, GitHub Projects or a CI pipeline for MVP.
- Store preferences in bounded, versioned, host-only cookies. Validate imported/untrusted values and handle unavailable/full storage visibly.
- Counter is browser-local, never label it a global/community total.
- truanayangi.com remains on Cloudflare + GCP using three private repositories. Never point its DNS to GitHub Pages.
- Retain source and asset attribution. Historical code does not define the current deployment.

- GitHub Pages redirects to https://truanayangi.com/ by explicit request. Publish only pages-redirect/ to gh-pages; keep the standalone application source in main.
