#!/usr/bin/env node
/**
 * fix-vybe-crowd-sing-round2-2026-08-02.mjs — audit-fixes-2026-08-02
 *
 * SECOND rejection on /adventure/vybe's `festival-crowd-sing` full-bleed
 * slot. Round 1 (fix-vybe-audit-2026-08-02.mjs) swapped a tight face-zoom
 * for a still-too-close frame ("a festivalgoer singing into a microphone
 * mid-dance, three more people dancing behind him") — operator: "all I see
 * is the top of dudes heads... the point was to zoom out more, or just pick
 * a different photo."
 *
 * The slot's promise (vybe.astro's own lede, ~line 359): "Sunday was the
 * same ground in daylight — a dance circle, the same band again, a rainbow
 * balloon arch over the gate." Both round-1 sources were the SAME dusk-lit
 * ground camera (Cam B Sun/CLIP/C0057.MP4, creation_time confirms ~6:30PM
 * local) — that camera's earliest clip in the folder starts at dusk, so no
 * wide daylight crowd shot exists on the ground camera at all; every close
 * candidate in it is a tight face/torso framing (confirmed by re-scanning
 * the full 299s clip at 1s resolution — see contact sheets in session
 * scratchpad). A genuinely wide, bright, full-body daylight crowd frame
 * does exist, just on a different camera: the Sunday DRONE footage
 * (`Drone B Sun/DCIM/100MEDIA/`), shot mid-afternoon per creation_time
 * (~3PM local on DJI_0102-0124, ~5PM on DJI_0125+).
 *
 * Reviewed every "person"-flagged still in
 * `_MINED_STILLS/_people` plus re-scanned the surrounding raw clips
 * (DJI_0102-0135) frame-by-frame. DJI_0126.MP4 @ ~4.5s is the strongest
 * wide candidate: a high, ~45-degree drone angle looking down over the
 * stage — the full band mid-song (4 visible members: two guitarists, drummer,
 * bassist in red), two more festivalgoers standing together in front of
 * them mid-sway, two hanging balloon clusters, cottonwood canopy framing
 * the top-left corner (environment, not subject), parked cars for scale in
 * the background. Six+ full bodies in frame, none dominating, tack-sharp,
 * genuinely bright daylight — everything round 1 was missing. It is not a
 * literal ring-shaped "dance circle," but it is the only footage in the
 * whole 2023 archive (ground cam + drone stills + drone video, all
 * reviewed) that delivers "wide crowd scene, full bodies, band + balloon
 * arch, cottonwoods as environment" instead of a performer close-up.
 *
 * Crop: source is portrait 1080x1920 (drone shooting straight down-ish).
 * Top-anchored 4:5 crop (1080x1350, y=0..1350) keeps the canopy, both
 * balloon clusters, the swaying couple, and the full band; drops only the
 * empty dirt at the very bottom of frame. Same 4:5 target ratio and same
 * light sharp()-only grading pass the slot has always used (not a new
 * LightForge look — see the taste-proof-gate rule, this isn't a new
 * aesthetic dimension).
 *
 * Alt text and the visible figcaption are rewritten to describe what's
 * actually in this frame (a band-plus-onlookers festival scene, not a
 * literal dance circle) — the site's own fact rule: on-image claims must be
 * verifiable against what's actually shown.
 *
 * Source: E:\Old Projects\Vybe\Vybe Fest\Vybe event 2023\Drone B Sun\DCIM\100MEDIA\DJI_0126.MP4 @ 4.5s
 * Output: public/media/adventure/vybe/festival-crowd-sing-<width>.{avif,webp}
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "adventure", "vybe");
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };

const SRC =
  "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/d3b8a0a5-b9b2-4cd3-83c4-86a711bb0128/scratchpad/vybe2/festival-crowd-sing-master.jpg";

// top-anchored 4:5 crop of the 1080x1920 source — keeps canopy + balloons +
// couple + full band, drops the empty dirt at the bottom.
const EXTRACT = { left: 0, top: 0, width: 1080, height: 1350 };

function lightTouch(pipeline) {
  return pipeline
    .modulate({ saturation: 1.1, brightness: 1.03 })
    .linear(1.04, -6)
    .sharpen({ sigma: 0.8 });
}

await mkdir(OUT, { recursive: true });

for (const width of [1120, 1600]) {
  const height = Math.round((width * 5) / 4);
  const base = lightTouch(sharp(SRC).extract(EXTRACT).resize({ width, height, fit: "cover" }));
  await base.clone().avif(AVIF).toFile(join(OUT, `festival-crowd-sing-${width}.avif`));
  await base.clone().webp(WEBP).toFile(join(OUT, `festival-crowd-sing-${width}.webp`));
  console.log(`festival-crowd-sing-${width} ok`);
}

console.log("vybe festival-crowd-sing round 2 done ->", OUT);
