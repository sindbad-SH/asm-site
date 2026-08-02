#!/usr/bin/env node
/**
 * make-pitchboulder-film-poster.mjs — 2026-08-02.
 *
 * The produced-film slot on /work/pitchboulder rendered as an empty
 * topo-lines facade ("it looks like just a link to the YouTube" — operator),
 * because no poster was ever passed. This bakes one from the operator's own
 * 4K master (E:\Pitch Boulder\Video Demo\Promo video\, 3840×2160, 74s,
 * 338.7MB — which is also why the film itself stays a YouTube embed: a
 * third-of-a-gig master has no business inside a GitHub Pages repo, and §4
 * forbids self-hosting full videos regardless).
 *
 * Frame: t=20s — the PITCH BOULDER lockup dissolving over a live session,
 * brand + room in one frame (eye-picked from an 8-frame contact sheet).
 * The facade stays click-to-load and never touches i.ytimg.com; this poster
 * is self-hosted like every other image on the site.
 */
import sharp from "sharp";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const SRC = String.raw`E:\Pitch Boulder\Video Demo\Promo video\Pitch Boulder Demo with New Logo.mp4`;
const outDir = join(process.cwd(), "public", "media", "work", "pitchboulder");
const AVIF = { quality: 52, effort: 5 };
const WEBP = { quality: 74, effort: 5 };

if (!existsSync(SRC)) {
  console.error(`✖ missing master: ${SRC}`);
  process.exit(1);
}
const tmpPng = join(tmpdir(), "pb-film-poster.png");
execSync(`ffmpeg -hide_banner -loglevel error -y -ss 20 -i "${SRC}" -frames:v 1 "${tmpPng}"`);
for (const w of [1600, 900]) {
  const base = sharp(tmpPng).resize({ width: w });
  await base.clone().avif(AVIF).toFile(join(outDir, `film-poster-${w}.avif`));
  await base.clone().webp(WEBP).toFile(join(outDir, `film-poster-${w}.webp`));
}
await rm(tmpPng, { force: true });
console.log("✓ film-poster-{1600,900}.{avif,webp} ← master t=20s");
