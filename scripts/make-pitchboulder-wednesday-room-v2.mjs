#!/usr/bin/env node
/**
 * make-pitchboulder-wednesday-room-v2.mjs — 2026-08-01, second archive pass.
 *
 * The operator asked for the PitchBoulder page to be built from
 * E:\Pitch Boulder\2026 Recordings. The richest untouched seam there is the
 * 2026-01-28 session: 98 Sony .ARW frames of which only 5 were ever exported
 * (Photos\Edited). Neither sharp nor ffmpeg decodes compressed ARW, so this
 * script lifts each file's EMBEDDED full-size JPEG preview (6192x4128 — the
 * camera's own render, not an interpolated demosaic) by scanning for the
 * largest SOI..EOI segment in the raw bytes, then bakes the picks.
 *
 * PICKS (eye-reviewed on 4 contact sheets of all 98 frames, then re-checked
 * at 780px before selection — per SPEC-SHOT-SELECTION.md):
 *   - room-wide     ← DSC08299: the packed room from the back of the long
 *     tables — ~25 attendees, note-takers, presenters at the screen. The page
 *     had no evidence of ROOM SCALE; this is it. Deliberately a different
 *     vantage from the existing coworking-* frames (which shoot the room from
 *     the front-left of the same session).
 *   - after-the-pitch ← DSC08322: shallow-DOF over-shoulder portrait, an
 *     attendee mid-sentence after the pitch. The page had no human close-up
 *     at all.
 *   - close-slide   ← DSC08291: the two founders standing at their own
 *     "Let's Connect" close slide (Humming Agent AI legible in frame).
 *
 * HONESTY: no LinkedIn recap on file names the 2026-01-28 founders, so the
 * captions state only the session date (from the archive folder) and what is
 * legible in frame. No names are invented.
 *
 * Collision guard: same sha1 gate as make-pitchboulder-variety.mjs — a bake
 * that matches an existing file under a different slug throws rather than
 * shipping a cross-page repeat.
 */
import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const SRC = String.raw`E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos`;
const PICKS = {
  "room-wide": "DSC08299.ARW",
  "after-the-pitch": "DSC08322.ARW",
  "close-slide": "DSC08291.ARW",
};
const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

const outDir = join(process.cwd(), "public", "media", "work", "pitchboulder", "wednesday-room");
await mkdir(outDir, { recursive: true });

/** largest embedded JPEG (SOI..EOI) inside a Sony ARW */
function embeddedJpeg(buf) {
  const segs = [];
  for (let i = 0; i < buf.length - 2; i++) {
    if (buf[i] === 0xff && buf[i + 1] === 0xd8 && buf[i + 2] === 0xff) {
      for (let j = i + 2; j < buf.length - 1; j++) {
        if (buf[j] === 0xff && buf[j + 1] === 0xd9) {
          segs.push({ start: i, end: j + 2, len: j + 2 - i });
          i = j + 1;
          break;
        }
      }
    }
  }
  if (!segs.length) return null;
  segs.sort((a, b) => b.len - a.len);
  return buf.subarray(segs[0].start, segs[0].end);
}

// hash every existing pitchboulder file (recursive) for the collision guard
const guard = {};
(function walk(d) {
  if (!existsSync(d)) return;
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) walk(p);
    else guard[createHash("sha1").update(readFileSync(p)).digest("hex")] = p;
  }
})(join(process.cwd(), "public", "media", "work", "pitchboulder"));

console.log(`\n▸ pitchboulder / wednesday-room v2 (from 2026-01-28 RAW archive)`);
for (const [slug, file] of Object.entries(PICKS)) {
  const src = join(SRC, file);
  if (!existsSync(src)) {
    console.error(`  ✖ missing source: ${src}`);
    process.exitCode = 1;
    continue;
  }
  const jpg = embeddedJpeg(readFileSync(src));
  if (!jpg) {
    console.error(`  ✖ no embedded preview in ${file}`);
    process.exitCode = 1;
    continue;
  }
  const meta = await sharp(jpg).metadata();
  let bytes = 0;
  for (const w of WIDTHS) {
    const base = sharp(jpg).rotate().resize({ width: w, withoutEnlargement: true });
    for (const [ext, opts] of [["avif", AVIF], ["webp", WEBP]]) {
      const buf = await base.clone()[ext](opts).toBuffer();
      const sha = createHash("sha1").update(buf).digest("hex");
      const hit = guard[sha];
      if (hit && !basename(hit).startsWith(`${slug}-`)) {
        throw new Error(`COLLISION: ${slug}-${w}.${ext} is byte-identical to ${basename(hit)}`);
      }
      writeFileSync(join(outDir, `${slug}-${w}.${ext}`), buf);
      bytes += buf.length;
    }
  }
  console.log(`  ✓ ${slug.padEnd(16)} ${file}  ${meta.width}×${meta.height} → ${(bytes / 1024).toFixed(0)}KB`);
}
console.log("");
