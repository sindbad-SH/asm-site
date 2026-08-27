// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import honestyAudit from "./integrations/honesty-audit.mjs";

// Deploy target is parameterized so the eventual live-site cutover (BUILD-PLAN.md §8)
// is a one-line env change + rebuild, never a hardcoded edit.
//
// Staging (default): https://sindbad-sh.github.io/asm-site/
// Cutover:            DEPLOY_TARGET=production -> https://adventurestorytellingmedia.com/

const isProduction = process.env.DEPLOY_TARGET === "production";
const base = isProduction ? "/" : "/asm-site";

export default defineConfig({
  site: isProduction
    ? "https://adventurestorytellingmedia.com"
    : "https://sindbad-sh.github.io",
  base,
  trailingSlash: "ignore",
  // AUDIT-FIX (2026-08-02) — /work/seriesfest retired: it duplicated
  // /venture/seriesfest, a separately-designed hub for the identical four
  // SeriesFest dispatch pages, and /venture/seriesfest is the newer, better-
  // built one. Every known internal inbound was repointed (src/consts.ts
  // PAGES.ventureStories.seriesfestHub.links.moreHref, src/pages/work/
  // index.astro, src/data/territory.ts's Denver node) — this redirect is the
  // safety net for any bookmark or external link to the old URL.
  //
  // Astro's `redirects` destination is a literal path, NOT run back through
  // `base` the way every in-template href on this site is (`${base}${href}`,
  // per BASE_URL convention) — verified by inspecting the built output: an
  // unprefixed destination produced `<meta http-equiv="refresh"
  // content="0;url=/venture/seriesfest">` with no `/asm-site`, a 404 on the
  // GitHub Pages staging deploy. Prefixing manually here matches every other
  // internal link's convention and is correct for both staging and the
  // eventual production cutover (base "/" -> no double slash).
  redirects: {
    "/work/seriesfest": `${base === "/" ? "" : base}/venture/seriesfest`,
    // REPOSITION (2026-08-27) — /entertainment retired as a PAGE FILE and
    // moved here: the page-file redirect stub was being emitted into the
    // sitemap (a live pointer to the retired three-lane identity); config
    // redirects are excluded from the sitemap. Same literal-path convention
    // as the entries around it.
    "/entertainment": `${base === "/" ? "" : base}/venture`,
    // LANDING SWAP (2026-08-15, operator-directed): the world flight moved
    // from /world to the site root, and the old homepage now lives at /home.
    // This keeps every shared /world link (socials, docs, session notes)
    // landing on the flight. Same literal-path convention as above.
    "/world": base === "/" ? "/" : `${base}/`,
  },
  build: {
    // Inline all CSS into each page: removes the render-blocking stylesheet
    // round-trip from the FCP critical path (§4). Total CSS is ~25KB gz —
    // cheap per-page, and a 9-page static site loses little to re-caching.
    inlineStylesheets: "always",
  },
  // Sitemap inherits `site` + `base` above, so staging builds emit staging
  // URLs and the cutover build emits production URLs — the correct behavior,
  // not hacked (BUILD-ORDERS Task 9).
  integrations: [sitemap(), honestyAudit()],
  vite: {
    plugins: [tailwindcss()],
  },
});
