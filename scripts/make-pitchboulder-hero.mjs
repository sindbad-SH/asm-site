#!/usr/bin/env node
/**
 * make-pitchboulder-hero.mjs — 2026-08-01. Replaces the rejected PitchBoulder
 * hero and fixes the duplication it exposed.
 *
 * WHY: the operator rejected the previous hero — "the one time we did it at the
 * Boulder Chamber ... too much boulder chamber image plus you're choosing a
 * close up shot of a presenter. The hero shot should be 1 of the shots that's
 * capturing the whole room with a lot of people in it."
 *
 * A three-stage workflow (scout → treatment → adversarial judge) reviewed all
 * 95 eligible frames. The judge OVERTURNED the treatment's pick (20260617_090837)
 * on measurement: on that frame "NOBILITY SPACE" renders ~110px at a 1600px hero
 * while "PITCH BOULDER" renders ~46px and is clipped by the screen bezel — i.e.
 * it repeats the exact failure that got the last hero rejected, a third party's
 * branding owning the client's hero. It also has ~7 empty chairs directly under
 * the headline and an edge-weighted crowd that vanishes in the phone crop.
 *
 * BAKES:
 *   hook-room            ← DSC08301 (2026-01-28, Galvanize). ~30 people, all
 *     faces, room reads full, and the only brand in frame is PitchBoulder's.
 *     Native 3:2, so it loses the least height to the ~1.98:1 desktop hero box.
 *     Verified: its centre-weighted crowd survives the site's naive phone crop.
 *   room-full            ← 20260429_091146(0) (2026-04-29). Takes over the
 *     Wednesday-Room full-bleed band FROM room-wide, which is the same moment
 *     as the new hero and would have run one photograph twice on the page.
 *   context-followus     ← 20260520_090713 (2026-05-20). Replaces context-room,
 *     which was the DSC08304 moment — a near-twin of the new hero. This frame
 *     carries PitchBoulder's own "Follow Us!" slide on both screens, which is
 *     what a Context still wants; its thinner crowd doesn't matter at that size.
 *
 * Net effect: the page now spans FOUR sessions (Jan 28, Apr 29, May 6, May 20)
 * instead of leaning on one — which was the operator's original complaint about
 * PitchBoulder's imagery.
 *
 * Also copies PitchBoulder's own lockup into public/. consts.ts's PARTNER-LOGO
 * RULE gates this on a real asset being supplied; the operator supplied it this
 * session, pointing at 2026 Recordings\00 Assets. The teal-alpha variant was
 * measured unusable on photography (never clears 3.61:1) — the white-outline
 * lockup is the one that survives.
 */
import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdir, copyFile } from "node:fs/promises";
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const PB = String.raw`E:\Pitch Boulder`;
const WEBP = { quality: 74, effort: 5 };
const AVIF = { quality: 52, effort: 5 };

const JOBS = [
  {
    slug: "hook-room",
    dir: join(process.cwd(), "public", "media", "work", "pitchboulder"),
    src: `${PB}\\2026 Recordings\\1-28-2026\\Photos\\Edited\\_TIER 2 - GOOD\\DSC08301.jpg`,
    // 6272x4168 · yFrac 0.55 → 1.9754:1, matching the ~1.98:1 desktop hero box.
    extract: { left: 0, top: 546, width: 6272, height: 3175 },
    widths: [1600, 900],
  },
  {
    slug: "room-full",
    dir: join(process.cwd(), "public", "media", "work", "pitchboulder", "wednesday-room"),
    src: `${PB}\\Top photos for web build\\_TIER 3 - MAYBE\\20260429_091146(0).jpg`,
    // square 6112² after rotate; take a wide band biased to the seated crowd.
    extract: { left: 0, top: 1680, width: 6112, height: 3094 },
    widths: [1600, 900],
  },
  {
    slug: "context-followus",
    dir: join(process.cwd(), "public", "media", "work", "pitchboulder"),
    src: `${PB}\\Top photos for web build\\_TIER 3 - MAYBE\\20260520_090713.jpg`,
    // square 6112²; 16:9 band holding both "Follow Us!" screens + the seated rows.
    extract: { left: 0, top: 1750, width: 6112, height: 3438 },
    widths: [1600, 900],
  },
];

// collision guard — a bake matching an existing file under another slug throws.
const guard = {};
(function walk(d) {
  if (!existsSync(d)) return;
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) walk(p);
    else guard[createHash("sha1").update(readFileSync(p)).digest("hex")] = p;
  }
})(join(process.cwd(), "public", "media", "work", "pitchboulder"));

console.log("\n▸ pitchboulder hero + duplication fix");
for (const job of JOBS) {
  if (!existsSync(job.src)) {
    console.error(`  ✖ missing source: ${job.src}`);
    process.exitCode = 1;
    continue;
  }
  await mkdir(job.dir, { recursive: true });
  const meta = await sharp(job.src).rotate().metadata();
  let bytes = 0;
  for (const w of job.widths) {
    const base = sharp(job.src).rotate().extract(job.extract).resize({ width: w });
    for (const [ext, opts] of [["avif", AVIF], ["webp", WEBP]]) {
      const buf = await base.clone()[ext](opts).toBuffer();
      const sha = createHash("sha1").update(buf).digest("hex");
      const hit = guard[sha];
      if (hit && !basename(hit).startsWith(`${job.slug}-`)) {
        throw new Error(`COLLISION: ${job.slug}-${w}.${ext} matches ${basename(hit)}`);
      }
      writeFileSync(join(job.dir, `${job.slug}-${w}.${ext}`), buf);
      bytes += buf.length;
    }
  }
  const ar = (job.extract.width / job.extract.height).toFixed(3);
  console.log(`  ✓ ${job.slug.padEnd(18)} ${basename(job.src)}  src ${meta.width}×${meta.height} → crop ${ar}:1  ${(bytes / 1024).toFixed(0)}KB`);
}

// PitchBoulder lockup → public/. pitchboulder.astro already existence-gates on
// exactly this path (the PARTNER-LOGO RULE's "IF a real asset is supplied").
const logoSrc = `${PB}\\2026 Recordings\\00 Assets\\PB-logo-horizontal-lockup-teal-white-outline.png`;
const logoDst = join(process.cwd(), "public", "media", "work", "pitchboulder", "pb-logo.png");
if (existsSync(logoSrc)) {
  await copyFile(logoSrc, logoDst);
  const m = await sharp(logoDst).metadata();
  console.log(`  ✓ pb-logo.png       ${m.width}×${m.height} (white-outline lockup — the teal-alpha variant measures unusable on photography)`);
} else {
  console.error("  ✖ logo source missing");
  process.exitCode = 1;
}
console.log("");
