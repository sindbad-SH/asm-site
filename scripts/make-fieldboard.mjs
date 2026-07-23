#!/usr/bin/env node
/**
 * make-fieldboard.mjs — bake the /adventure FIELD BOARD collage frames (M3,
 * 2026-07-22, operator: the travel-story section should out-premium the
 * festival teaser; variety across locales, not one folder).
 * Sources: the operator's processed AA screenshot exports (READ-ONLY).
 * Produces public/media/adventure/fieldboard/<slug>-<w>.{avif,webp}.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
const ROOT = "E:/Amazing Ariel/Drone Footage/Sindbad Horizon Drone Footage/_PROCESSED/My_Screenshots_AA";
const OUT = join(process.cwd(), "public", "media", "adventure", "fieldboard");
const AVIF = { quality: 52, effort: 5 }, WEBP = { quality: 78 };
const JOBS = [
  { slug: "ironton", dir: "2023-06-21 - United States - Colorado - Ironton Waterfall", file: "Snapshot_20260713185401.jpg", widths: [700, 1200] },
  { slug: "ouray", dir: "2023-06-23 - United States - Colorado 2 - Ouray City", pick: "last", widths: [900, 1600] },
  { slug: "limmernsee", dir: "2023-08-05 - Switzerland 2 - Canton of Glarus - Limmernsee", pick: "last", widths: [700, 1200] },
  { slug: "trift", dir: "2023-08-06 - Switzerland 2 - Canton of Bern - Gadmen Triftbrucke", file: "Snapshot_20260713180333.jpg", widths: [700, 1200] },
  { slug: "nesso", dir: "2023-08-20 - Italy - Lombardy - Nesso Civera Bridge", file: "Snapshot_20260713145141.jpg", widths: [600, 1000] },
];
import { readdirSync } from "node:fs";
await mkdir(OUT, { recursive: true });
for (const j of JOBS) {
  let f = j.file;
  if (!f) {
    const files = readdirSync(join(ROOT, j.dir)).filter((x) => /\.jpe?g$/i.test(x)).sort();
    f = j.pick === "last" ? files[files.length - 1] : files[0];
  }
  const src = join(ROOT, j.dir, f);
  for (const w of j.widths) {
    const img = sharp(src).resize({ width: w });
    await img.clone().avif(AVIF).toFile(join(OUT, `${j.slug}-${w}.avif`));
    await img.clone().webp(WEBP).toFile(join(OUT, `${j.slug}-${w}.webp`));
  }
  console.log("baked", j.slug, "from", f);
}
