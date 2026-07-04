// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import honestyAudit from "./integrations/honesty-audit.mjs";

// Deploy target is parameterized so the eventual live-site cutover (BUILD-PLAN.md §8)
// is a one-line env change + rebuild, never a hardcoded edit.
//
// Staging (default): https://sindbad-sh.github.io/asm-site/
// Cutover:            DEPLOY_TARGET=production -> https://adventurestorytellingmedia.com/

const isProduction = process.env.DEPLOY_TARGET === "production";

export default defineConfig({
  site: isProduction
    ? "https://adventurestorytellingmedia.com"
    : "https://sindbad-sh.github.io",
  base: isProduction ? "/" : "/asm-site",
  trailingSlash: "ignore",
  build: {
    // Inline all CSS into each page: removes the render-blocking stylesheet
    // round-trip from the FCP critical path (§4). Total CSS is ~25KB gz —
    // cheap per-page, and a 9-page static site loses little to re-caching.
    inlineStylesheets: "always",
  },
  integrations: [honestyAudit()],
  vite: {
    plugins: [tailwindcss()],
  },
});
