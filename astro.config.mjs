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
  integrations: [honestyAudit()],
  vite: {
    plugins: [tailwindcss()],
  },
});
