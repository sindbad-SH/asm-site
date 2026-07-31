#!/usr/bin/env node
/**
 * make-postcards.mjs — bake Adventure "postcard" micro-story stills.
 *
 * POSTCARD2 (2026-07-27, "Postcards from the Road" v2, publication-v1
 * branch) extends the original POSTCARD pass (same date): the two original
 * postcards (Valkyrie Dance, Market Row) MERGE into one
 * "scandinavian-midsummer-festival" postcard (same 6 frames, re-baked under
 * the new slug, plus one added Nordic Daughter festival frame), and three
 * new postcards are filed — nordic-daughter, something-for-tomorrow,
 * brazilian-living. See src/data/postcards.ts's header for the full sourcing
 * / honesty note on every entry (band-name correction, the audience/stage
 * split, the venue ID for Brazilian Living).
 *
 * Sources (READ-ONLY):
 *  - Scandinavian Midsummer Festival frames: unchanged from the original
 *    pass — see git history / SITE-COPY-DECK-publication-v1.md for that
 *    sourcing note (Valkyrie Dance export + the reconstructed "Chef Eric
 *    Mcbride" .wfp timeline, which is actually a vendor-market walkthrough).
 *  - "nd-set": a frame from `Nordic Daughter\Scandinavian Festivle\Nordic
 *    Daughter Scandi Fest Par 1-Thumbnail.jpg` (an already-rendered export
 *    thumbnail) — Nordic Daughter performing under the festival tent,
 *    confirmed by the Nordic flags + festival crowd visible in frame.
 *  - nordic-daughter + something-for-tomorrow: frame grabs from
 *    `Nordic Daughter\Something for tomorrow\` — the two raw DJI drone
 *    masters (DJI_..._0005_D.MP4, DJI_..._0006_D.MP4) for the
 *    nordic-daughter (audience/crowd) frames, and the edited highlight cut
 *    ("Rickhouse 7-7-2024.mp4") for the something-for-tomorrow (confirmed
 *    on-stage) frames — the venue's own screen displays "Something For
 *    Tomorrow" throughout the edit, confirming the act.
 *  - brazilian-living: frame grabs from `The Art of Brazilian Living\Best 2
 *    Hours\Best Raw Footage\` (Aline Performance 1.MP4, Samba Dancers.MP4,
 *    Venue Walk 1.MP4, Brazilian Festival Crowd Dance.MP4) — all dated
 *    2025-06-22.
 *
 * Frame grabs were extracted via ffmpeg fast-seek (`-ss` before `-i`) at
 * native/near-native resolution into the session scratchpad; this script
 * just resizes and re-encodes them into the site's postcard media
 * convention:
 *   public/media/adventure/postcards/<postcard-slug>/<photo-slug>-{700,1200}.{avif,webp}
 * 4:5 crop (matches the .postcard-photo / .pc-photo CSS aspect-ratio),
 * quality-matched to the site's other baked photo sets (avif ~55/effort 5,
 * webp ~82). Busy / wide-scene frames (crowds, venue-overview shots) crop
 * with sharp's "attention" strategy instead of a dumb center-crop, so the
 * subject isn't guaranteed to be chopped out of a 4:5 portrait crop.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "adventure", "postcards");
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };

const SCRATCH =
  "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/41a1cf87-9fbd-4211-b6e3-402504cae585/scratchpad";
const FRAMES_DIR = join(SCRATCH, "postcard_hires");
const RICKHOUSE_DIR = join(SCRATCH, "rickhouse_hi");
const BRAZIL_DIR = join(SCRATCH, "fastgrab");
const ND_FESTIVAL_THUMB =
  "E:/Old Projects/Nordic Daughter/Scandinavian Festivle/Nordic Daughter Scandi Fest Par 1-Thumbnail.jpg";

const CENTRE = sharp.gravity.center;
const ATTENTION = sharp.strategy.attention;

const PHOTOS = [
  // ── Scandinavian Midsummer Festival (merged; same 6 frames as the
  // original valkyrie-dance/market-row postcards, re-baked under the new
  // combined slug, plus one added Nordic-Daughter-at-the-festival frame) ──
  { postcard: "scandinavian-midsummer-festival", slug: "formation", src: join(FRAMES_DIR, "valkyrie-formation.jpg"), position: CENTRE },
  { postcard: "scandinavian-midsummer-festival", slug: "motion", src: join(FRAMES_DIR, "valkyrie-motion.jpg"), position: CENTRE },
  { postcard: "scandinavian-midsummer-festival", slug: "closeup", src: join(FRAMES_DIR, "valkyrie-closeup.jpg"), position: CENTRE },
  { postcard: "scandinavian-midsummer-festival", slug: "overview", src: join(FRAMES_DIR, "market-overview.jpg"), position: CENTRE },
  { postcard: "scandinavian-midsummer-festival", slug: "stalls", src: join(FRAMES_DIR, "market-stalls.jpg"), position: CENTRE },
  { postcard: "scandinavian-midsummer-festival", slug: "parasols", src: join(FRAMES_DIR, "market-parasols.jpg"), position: CENTRE },
  { postcard: "scandinavian-midsummer-festival", slug: "nd-set", src: ND_FESTIVAL_THUMB, position: ATTENTION },

  // ── Nordic Daughter (audience/crowd frames from the Rickhouse show — see
  // postcards.ts header for why this postcard carries no stage footage) ──
  { postcard: "nordic-daughter", slug: "crowd-floor", src: join(RICKHOUSE_DIR, "crowd_0006_t288.jpg"), position: ATTENTION },
  { postcard: "nordic-daughter", slug: "crowd-side", src: join(RICKHOUSE_DIR, "crowd_0005_t298.jpg"), position: ATTENTION },

  // ── Something for Tomorrow (confirmed on-stage frames, same night) ──
  { postcard: "something-for-tomorrow", slug: "stage-wide", src: join(RICKHOUSE_DIR, "edit_t010.jpg"), position: ATTENTION },
  { postcard: "something-for-tomorrow", slug: "stage-bassist", src: join(RICKHOUSE_DIR, "edit_t034.jpg"), position: ATTENTION },
  { postcard: "something-for-tomorrow", slug: "stage-hero", src: join(RICKHOUSE_DIR, "edit_t048.jpg"), position: ATTENTION },

  // ── The Art of Brazilian Living (Levitt Pavilion, Ruby Hill Park, Denver — 2025-06-22) ──
  { postcard: "brazilian-living", slug: "aline-stage", src: join(BRAZIL_DIR, "aline1_t120.jpg"), position: ATTENTION },
  { postcard: "brazilian-living", slug: "dancers-headdress", src: join(BRAZIL_DIR, "samba_t150.jpg"), position: ATTENTION },
  { postcard: "brazilian-living", slug: "dancer-motion", src: join(BRAZIL_DIR, "samba_t060.jpg"), position: ATTENTION },
  { postcard: "brazilian-living", slug: "venue-wide", src: join(BRAZIL_DIR, "venuewalk_hi_t224.jpg"), position: ATTENTION },
  { postcard: "brazilian-living", slug: "community-dance", src: join(BRAZIL_DIR, "crowddance_hi_t000.jpg"), position: ATTENTION },
];

for (const { postcard, slug, src, position } of PHOTOS) {
  const dir = join(OUT, postcard);
  await mkdir(dir, { recursive: true });
  for (const width of [1200, 700]) {
    const height = Math.round((width * 5) / 4);
    const base = sharp(src).resize({ width, height, fit: "cover", position });
    await base.clone().avif(AVIF).toFile(join(dir, `${slug}-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(dir, `${slug}-${width}.webp`));
    console.log(`${postcard}/${slug}-${width} ok`);
  }
}
