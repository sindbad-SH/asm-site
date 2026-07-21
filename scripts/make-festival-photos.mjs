#!/usr/bin/env node
/**
 * make-festival-photos.mjs — bake the Colorado Medieval Festival stills for the
 * /adventure "Medieval Festival in Loveland" feature (Round 3, 2026-07-21).
 * Repeatable: re-run any time to refresh.
 *
 * Sources are the operator's own drone frame-grabs (READ-ONLY, E:/Old Projects/
 * Colorado Medieval Festival/2024/Drone screenshots/): two joust frames (the
 * charge down the lane; two riders squaring up) and two armored ground-combat
 * frames (the arena bout; the multi-bout melee). Chosen by frame review.
 *
 * Produces public/media/adventure/festival/<slug>-{1600,900}.{avif,webp}
 * (16:9 exports, quality-matched to the site's other baked photo sets).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const SRC = "E:/Old Projects/Colorado Medieval Festival/2024/Drone screenshots";
const OUT = join(process.cwd(), "public", "media", "adventure", "festival");
const AVIF = { quality: 52, effort: 5 };
const WEBP = { quality: 78 };

const PHOTOS = [
  { slug: "joust-charge", src: join(SRC, "Jousting horizontal", "Snapshot_20260713143006.jpg") },
  { slug: "joust-riders", src: join(SRC, "Jousting horizontal", "Snapshot_20260713143155.jpg") },
  { slug: "melee-arena", src: join(SRC, "Sword fights horizontal", "Snapshot_20260713131304.jpg") },
  { slug: "melee-brawl", src: join(SRC, "Sword fights horizontal", "Snapshot_20260713132007.jpg") },
];

await mkdir(OUT, { recursive: true });
for (const { slug, src } of PHOTOS) {
  for (const width of [1600, 900]) {
    const base = sharp(src).resize({ width, height: Math.round((width * 9) / 16), fit: "cover" });
    await base.clone().avif(AVIF).toFile(join(OUT, `${slug}-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(OUT, `${slug}-${width}.webp`));
    console.log(`${slug}-${width} ok`);
  }
}
