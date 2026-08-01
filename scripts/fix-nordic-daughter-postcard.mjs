#!/usr/bin/env node
/**
 * fix-nordic-daughter-postcard.mjs — RE-SOURCE the "nordic-daughter" postcard
 * photos (2026-07-31 operator correction on the POSTCARD2 pass).
 *
 * The shipped postcard used "crowd-floor" / "crowd-side" — audience frames
 * from the Something for Tomorrow show at The Rickhouse, Denver (2024-07-07).
 * Operator: "For Nordic Daughter you used shots from their Something for
 * Tomorrow set. I filmed Nordic Daughter at the Scandinavian Midsummer
 * Festival — any shots will be from that." The Rickhouse night was Something
 * for Tomorrow's own show (Nordic Daughter's guitarist Jason Lycan's separate
 * hard-rock band) — Nordic Daughter itself was never on that stage. Nordic
 * Daughter WAS filmed performing at the Scandinavian Midsummer Festival
 * (Parfet Park, Golden, CO, June 2024) — see
 * `E:/Old Projects/Nordic Daughter/Scandinavian Festivle/Nordic Daughter
 * Scandi Fest Part 1/2/3.mp4` (3.8K, 60fps edited masters, titled after the
 * band). That same source already supplied the "nd-set" frame used on the
 * scandinavian-midsummer-festival postcard (an already-rendered export
 * thumbnail); this script pulls two NEW, distinct frames from the full-res
 * masters for Nordic Daughter's OWN postcard, so the two postcards don't
 * duplicate a frame.
 *
 * Frames reviewed via a 42-frame contact sheet sampled across all three
 * parts (session scratchpad), confirming continuous, clear footage of the
 * full band performing under the festival tent (Nordic flags, festival
 * crowd, "KEEP IT COLD" building visible in the background — same grounds
 * as the other Scandinavian Midsummer Festival frames). Two frames chosen:
 *   - Part 3 @ 1270s — wide band shot, singer arms raised, guitarist +
 *     drummer + keyboardist all in frame, tent + flags visible.
 *   - Part 1 @ 100s — violinist + singer close two-shot, festival grounds
 *     ("KEEP IT COLD" building, Nordic flags) behind them.
 *
 * Old crowd-floor/crowd-side files are deleted (not just replaced) so no
 * Rickhouse-sourced frame remains anywhere in the nordic-daughter postcard
 * folder. Same convention as make-postcards.mjs: 4:5 crop, sharp "attention"
 * strategy, avif ~55/effort 5, webp ~82.
 */
import sharp from "sharp";
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const OUT = join(process.cwd(), "public", "media", "adventure", "postcards", "nordic-daughter");
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };
const ATTENTION = sharp.strategy.attention;
const ENTROPY = sharp.strategy.entropy;

const SCANDI_DIR = "E:/Old Projects/Nordic Daughter/Scandinavian Festivle";
const SCRATCH =
  "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/12ab3daa-9a3b-4913-9a1f-c893c722eafd/scratchpad/nd_final";

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: "inherit" });
}

function grabFrame(part, seconds, outPng) {
  const src = join(SCANDI_DIR, `Nordic Daughter Scandi Fest Part ${part}.mp4`);
  ffmpeg(["-ss", String(seconds), "-i", src, "-frames:v", "1", "-q:v", "2", outPng]);
}

await mkdir(SCRATCH, { recursive: true });
await mkdir(OUT, { recursive: true });

// delete the old, wrongly-sourced files first
for (const old of ["crowd-floor", "crowd-side"]) {
  for (const ext of ["avif", "webp"]) {
    for (const w of [700, 1200]) {
      const f = join(OUT, `${old}-${w}.${ext}`);
      if (existsSync(f)) await rm(f);
    }
  }
}

const FRAMES = [
  // "attention" (saliency) crop centers cleanly on the singer, arms raised, mid-song.
  { slug: "festival-set", part: 3, seconds: 1270, strategy: ATTENTION },
  // "attention" cropped tight on the keyboardist alone here, losing the violinist off
  // the left edge; "entropy" keeps both musicians + the "KEEP IT COLD" grounds signage.
  { slug: "festival-strings", part: 1, seconds: 100, strategy: ENTROPY },
];

for (const { slug, part, seconds, strategy } of FRAMES) {
  const png = join(SCRATCH, `${slug}.png`);
  grabFrame(part, seconds, png);
  for (const width of [1200, 700]) {
    const height = Math.round((width * 5) / 4);
    const base = sharp(png).resize({ width, height, fit: "cover", position: strategy });
    await base.clone().avif(AVIF).toFile(join(OUT, `${slug}-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(OUT, `${slug}-${width}.webp`));
    console.log(`nordic-daughter/${slug}-${width} ok`);
  }
}
