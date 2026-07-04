# ASM Site — rebuild

Scaffold for the Adventure Storytelling Media rebuild. Build order, specs, and every design/content
decision live in `BUILD-PLAN.md` (in the `asm-site-v1-reference` repo) — read that first.

Stack: Astro (static output) + Tailwind v4 (`@theme` CSS tokens) + GSAP/ScrollTrigger + Lenis.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — static build to `dist/`
- `npm run audit` — Honesty Ledger exclusion grep + `[confirm]` sweep against `dist/`
- `npm run lhci` — Lighthouse CI against the perf budgets in `lighthouserc.json`

## Deploy

`DEPLOY_TARGET=production` switches `astro.config.mjs` from the GitHub Pages staging URL/base to
the apex domain — this is the one-line flip for the live cutover (BUILD-PLAN.md §8). Do not set it
until the cutover step is explicitly confirmed.
