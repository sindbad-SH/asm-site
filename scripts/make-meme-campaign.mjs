#!/usr/bin/env node
/**
 * make-meme-campaign.mjs — 2026-08-01. Bakes the MEME campaign assets the
 * operator actually produces for the organisation, from E:\Makeshift\MEME
 * (the live campaign repo — see its "00 - START HERE.md").
 *
 * WHY: /venture/meme shipped as a typographic "bones" page on the stated
 * grounds that no MEME imagery existed. That was wrong — the operator BUILDS
 * MEME's current campaign artwork (code-rendered flyer family: coverstory/
 * render.mjs + ondemand/render.mjs, five social formats each plus 7-second
 * animated cuts, QR-gated). Those renders are his own work product and are
 * the honest illustration of what "Member At-Large / Strategic Liaison and
 * Scout" actually looks like week to week.
 *
 * SOURCES (all his own renders, FLYERS - FINAL only — never a draft or a
 * superseded date; the Aug-1 set in _REVIEW BEFORE DELETE is deliberately
 * excluded because that date is wrong and dangerous to publish):
 *   bofsb-portrait / bofsb-wide  ← Business of Show Business (Sat Aug 15 2026)
 *   crewcall-portrait            ← Crew Call (two workshops, one day)
 *   pitch-quorum-sheet           ← Pitch Quorum, on-demand program sheet
 *   market-fresh-sheet           ← Market Fresh, on-demand program sheet
 *
 * NOT baked: MEME's own older workshop flyers (05 - Source Docs). They are the
 * organisation's prior material, not his work, and showing them as a "before"
 * would be an unflattering comparison of a client's own past design. The page
 * shows what he makes, not what he replaced.
 */
import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const M = String.raw`E:\Makeshift\MEME`;
const PICKS = {
  "bofsb-portrait": `${M}\\01 - Active Events\\Business of Show Business (2026-08-15)\\FLYERS - FINAL\\bofsb_v2-cover_portrait_1080x1350.png`,
  "bofsb-wide": `${M}\\01 - Active Events\\Business of Show Business (2026-08-15)\\FLYERS - FINAL\\bofsb_v2-cover_linkedin_1200x628.png`,
  // Crew Call is NOT baked (2026-08-02, operator): the flyers exist but the
  // event has not been announced. Publishing artwork for an unannounced client
  // event front-runs MEME's own announcement — and anything under public/ is
  // fetchable on the live site whether or not a page references it. Add it back
  // only once the event is public.
  "pitch-quorum-sheet": `${M}\\01 - Active Events\\On-Demand Programs\\Pitch Quorum\\FLYERS - FINAL\\pitch-quorum_ondemand_portrait_1080x1350.png`,
  "market-fresh-sheet": `${M}\\01 - Active Events\\On-Demand Programs\\Market Fresh\\FLYERS - FINAL\\market-fresh_ondemand_portrait_1080x1350.png`,
};

const WIDTHS = [900, 1600];
const AVIF = { quality: 55, effort: 5 }; // flyers carry small type — a touch above photo quality
const WEBP = { quality: 78, effort: 5 };

const outDir = join(process.cwd(), "public", "media", "venture", "meme");
await mkdir(outDir, { recursive: true });

// collision guard (same contract as the pitchboulder bakes)
const guard = {};
(function walk(d) {
  if (!existsSync(d)) return;
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) walk(p);
    else guard[createHash("sha1").update(readFileSync(p)).digest("hex")] = p;
  }
})(outDir);

console.log(`\n▸ meme campaign → public/media/venture/meme/`);
for (const [slug, src] of Object.entries(PICKS)) {
  if (!existsSync(src)) {
    console.error(`  ✖ missing source: ${src}`);
    process.exitCode = 1;
    continue;
  }
  const meta = await sharp(src).metadata();
  let bytes = 0;
  for (const w of WIDTHS) {
    // flyers are already the right crop — never enlarge past native pixels
    if (w > meta.width) continue;
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });
    for (const [ext, opts] of [["avif", AVIF], ["webp", WEBP]]) {
      const buf = await base.clone()[ext](opts).toBuffer();
      const sha = createHash("sha1").update(buf).digest("hex");
      const hit = guard[sha];
      if (hit && !basename(hit).startsWith(`${slug}-`)) {
        throw new Error(`COLLISION: ${slug}-${w}.${ext} matches ${basename(hit)}`);
      }
      writeFileSync(join(outDir, `${slug}-${w}.${ext}`), buf);
      bytes += buf.length;
    }
  }
  console.log(`  ✓ ${slug.padEnd(20)} ${meta.width}×${meta.height} → ${(bytes / 1024).toFixed(0)}KB`);
}
console.log("");
