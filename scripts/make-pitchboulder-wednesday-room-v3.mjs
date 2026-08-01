#!/usr/bin/env node
/**
 * make-pitchboulder-wednesday-room-v3.mjs — 2026-08-01. Third pass on the
 * Wednesday-Room chapter, replacing three photographs the operator rejected.
 *
 * HIS COMPLAINTS, and what each bake here answers:
 *
 * 1. "I'm not a fan that we have the 'a different Wednesday the same shape
 *    April 29th' — it's too similar to the hero photo. It should be a just
 *    different angle altogether."
 *    → `room-about` (20260429_090426): shot square-on from the BACK of the
 *      room toward the front wall, which kills the hero's down-the-tables
 *      one-point perspective completely. ~18 people in two banks either side
 *      of a centre aisle, the host mid-introduction, and both projector
 *      screens legibly reading "About PitchBoulder" — so the frame captions
 *      itself and the only branding in it is PitchBoulder's.
 *
 * 2. "The after the pitch ... the guy's kind of just squinting in there, plus
 *    it's the same guys [as] the photo just below it."
 *    → `after-the-pitch` is RE-BAKED from DSC08315 instead of DSC08322: a
 *      founder mid-word answering one person, listener's hair as foreground,
 *      flat grey wall behind. One unmistakable subject, which matters because
 *      this renders at only ~272px wide.
 *
 * 3. "'The last slide is always the same shape' is not a great photo because
 *    the guy on the right is kind of blurry and his eyes are closed."
 *    → The closing image is DELETED, not replaced. Every closing candidate in
 *      the archive repeats one or both of the two men from the Jan-28 session
 *      (verified across all 98 RAW frames), and the two best — DSC08329 and
 *      the posed DSC08341 — are respectively compositionally weak and generic.
 *      Swapping a weak photo for another weak photo does not answer the note.
 *      Dropping it also frees DSC08315 for slot 2 with ZERO repetition: after
 *      this pass each person appears exactly once on the page. The chapter now
 *      ends on the season list, which is a stronger close than a filler frame.
 *
 * 4. Separately: "we have Ashle Jantzen kind of twice."
 *    → `origami-title` replaces `leyden-space-title` in the two-up. Ashle now
 *      appears once (the chapter's opening photo). The new frame is a
 *      different founder, a different company and a different month, which is
 *      the whole point of that pair. Slide text is transcribed VERBATIM from
 *      the frame — "origami" and "The First Smart Cabinet to Autonomously Fold
 *      Laundry". There is a letterspaced word beneath the wordmark that is NOT
 *      legible here, so it is not captioned. No founder name appears on the
 *      slide and none is invented.
 *
 * Sources: the operator's own curated archive and the Jan-28 RAW session. ARW
 * files are Sony compressed RAW that neither sharp nor ffmpeg decodes — the
 * embedded full-size JPEG preview (6192x4128) is lifted by scanning for the
 * largest SOI..EOI segment, same proven method as v2.
 */
import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { existsSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { join, basename } from "node:path";

const PB = String.raw`E:\Pitch Boulder`;
const AVIF = { quality: 52, effort: 5 };
const WEBP = { quality: 74, effort: 5 };
const outDir = join(process.cwd(), "public", "media", "work", "pitchboulder", "wednesday-room");

function embeddedJpeg(buf) {
  const segs = [];
  for (let i = 0; i < buf.length - 2; i++) {
    if (buf[i] === 0xff && buf[i + 1] === 0xd8 && buf[i + 2] === 0xff) {
      for (let j = i + 2; j < buf.length - 1; j++) {
        if (buf[j] === 0xff && buf[j + 1] === 0xd9) { segs.push({ s: i, e: j + 2, len: j + 2 - i }); i = j + 1; break; }
      }
    }
  }
  if (!segs.length) return null;
  segs.sort((a, b) => b.len - a.len);
  return buf.subarray(segs[0].s, segs[0].e);
}

const JOBS = [
  {
    slug: "room-about",
    src: `${PB}\\Top photos for web build\\_TIER 2 - GOOD\\20260429_090426.jpg`,
    raw: false,
    extract: { left: 0, top: 2380, width: 6112, height: 3087 }, // 1.980:1 band
    widths: [1600, 900],
  },
  {
    slug: "after-the-pitch",
    src: `${PB}\\2026 Recordings\\1-28-2026\\Photos\\DSC08315.ARW`,
    raw: true,
    extract: { left: 1486, top: 83, width: 2848, height: 3560 }, // 4:5 portrait
    widths: [1600, 900],
  },
  {
    slug: "origami-title",
    src: `${PB}\\2026 Recordings\\2-18-2026\\589e539e-225c-44c5-864a-7c180cee4b51.jpg`,
    raw: false,
    extract: null, // native 1080 square, already 1:1
    widths: [900],
  },
];

await mkdir(outDir, { recursive: true });
const guard = {};
(function walk(d) {
  if (!existsSync(d)) return;
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) walk(p);
    else guard[createHash("sha1").update(readFileSync(p)).digest("hex")] = p;
  }
})(join(process.cwd(), "public", "media", "work", "pitchboulder"));

console.log("\n▸ wednesday-room v3 — operator photo rejections");
for (const job of JOBS) {
  if (!existsSync(job.src)) { console.error(`  ✖ missing: ${job.src}`); process.exitCode = 1; continue; }
  const input = job.raw ? embeddedJpeg(readFileSync(job.src)) : job.src;
  if (!input) { console.error(`  ✖ no embedded preview: ${job.src}`); process.exitCode = 1; continue; }
  const meta = await sharp(input).rotate().metadata();
  let bytes = 0;
  for (const w of job.widths) {
    let p = sharp(input).rotate();
    if (job.extract) p = p.extract(job.extract);
    const base = p.resize({ width: w, withoutEnlargement: true });
    for (const [ext, opts] of [["avif", AVIF], ["webp", WEBP]]) {
      const buf = await base.clone()[ext](opts).toBuffer();
      const sha = createHash("sha1").update(buf).digest("hex");
      const hit = guard[sha];
      if (hit && !basename(hit).startsWith(`${job.slug}-`)) throw new Error(`COLLISION: ${job.slug}-${w}.${ext} matches ${basename(hit)}`);
      writeFileSync(join(outDir, `${job.slug}-${w}.${ext}`), buf);
      bytes += buf.length;
    }
  }
  console.log(`  ✓ ${job.slug.padEnd(16)} ${basename(job.src)}  ${meta.width}×${meta.height} → ${(bytes / 1024).toFixed(0)}KB`);
}

// Retire the rejected frames and the dropped closer.
for (const dead of ["close-slide", "room-full", "leyden-space-title"]) {
  for (const f of readdirSync(outDir)) {
    if (f.startsWith(`${dead}-`)) { unlinkSync(join(outDir, f)); console.log(`  – removed ${f}`); }
  }
}
console.log("");
