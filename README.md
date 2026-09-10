# Trưa Nay Ăn Gì 🍜

CS-style lunch roulette — open a case, choose lunch.

**Main website:** https://truanayangi.com (Cloudflare + GCP).  
**Standalone community demo:** https://truanayangi-com.github.io/truanayangi/

This repository was transferred from `nagisanzenin/truanayangi`, preserving its Git history and community. The current application is a static frontend with **no account, login, backend or production API dependency**. Preferences, custom dishes and browser-local spin totals use versioned cookies, not server storage. Clearing cookies resets them. The historical global community count belongs to the main website, not this demo.

## Local development

Use Node.js 22.12+ and the pnpm version in package.json.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
pnpm preview
```

For GitHub project Pages:

```sh
PUBLIC_BASE_PATH=/truanayangi/ pnpm build
```

Publish the generated `dist/` to the `gh-pages` branch. Builds run locally; there is no custom Actions pipeline, Entire integration or GitHub Projects requirement. GitHub Pages may use its own platform publishing job.

## Storage

Cookies are host-only, scoped to the application path, `SameSite=Lax`, `Secure` on HTTPS, and expire after one year. Each encoded value is bounded to 3,500 bytes; oversized custom pools are rejected without replacing the previous saved pool. Some browser storage policies can shorten retention. Save only meal preferences, never sensitive personal data. Cookie contents are sent with requests to the static host by the browser. There is no cross-device sync or shared global counter in this version.

The three production repositories (`web`, `server`, `infrastructure`) remain private. No production database, secrets or private Git history is included here. Backend files can still be found in the preserved historical commits, but are not used or deployed by this app.

See [ATTRIBUTION.md](ATTRIBUTION.md) for original authorship and third-party assets.
