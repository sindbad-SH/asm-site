#!/usr/bin/env node
/**
 * make-adventure-frame.mjs — bake dual-brand (Amazing Aerial + ASM) watermarked
 * gallery frames for /adventure + /field-notes (P20).
 *
 * WHY: the adventure gallery grows one markdown micro-story at a time (see
 * src/content.config.ts). Each story points at an export SET in
 * public/media/adventure/gallery/ — <slug>-<width>.{avif,webp} at the
 * orientation's widths (landscape 800/1400/2200, vertical 800/1120/1600). Those
 * sets were hand-produced before this script existed; this codifies the recipe
 * so new places match the ESTABLISHED look exactly instead of drifting.
 *
 * THE ESTABLISHED WATERMARK (measured off the shipped exports, as canvas
 * fractions so it scales identically at every width):
 *   • Amazing Aerial wordmark — src/assets/aa-logo-white.png (already white),
 *     centred both axes, scaled to ~47% of canvas WIDTH, ~0.82 alpha.
 *   • ASM mountain monogram — public/logo-mark.png, recoloured to a flat white
 *     silhouette, bottom-right, ~7.3% of canvas WIDTH, inset ~3% of each
 *     dimension, ~0.9 alpha.
 * Both are composited AT each final width (not downscaled from a master) so the
 * marks stay crisp, exactly like the originals. Licensing note: these frames are
 * licensed THROUGH Amazing Aerial; the dual mark is the agreed comp treatment.
 *
 * PIPELINE (sharp): EXIF auto-orient (.rotate()) → cover-crop to the
 * orientation's aspect (3:2 or 4:5) → composite both marks → avif + webp at each
 * width. Same sharp settings as the repo's other bakers (make-shelby-photos.mjs).
 *
 * RUN:  node scripts/make-adventure-frame.mjs            # bake every PICK
 *       node scripts/make-adventure-frame.mjs <slug>...  # bake only these slugs
 *       node scripts/make-adventure-frame.mjs --test     # bake the calibration
 *                                                          pair into scripts/ tmp
 * Sources are read-only from the Amazing Aerial archive (SRC_ROOT); nothing is
 * written outside public/media/adventure/gallery/.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const SRC_ROOT = "E:/Amazing Ariel/Old adventure photos and footage from 2022 to 2023";
const REPO = process.cwd();
const OUT_DIR = join(REPO, "public", "media", "adventure", "gallery");

const AA_LOGO = join(REPO, "src", "assets", "aa-logo-white.png"); // white wordmark
const ASM_LOGO = join(REPO, "public", "logo-mark.png"); // mountain monogram (recoloured white)

const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

// Orientation → cover aspect (w/h) + the export widths the pages expect.
const ORIENT = {
  landscape: { aspect: 3 / 2, widths: [800, 1400, 2200] },
  vertical: { aspect: 4 / 5, widths: [800, 1120, 1600] },
};

// Watermark geometry, as fractions of the final canvas (measured off the
// shipped matterhorn/gornergrat/tseuzier exports).
const WM = {
  aaWidthFrac: 0.47, // AA wordmark width ÷ canvas width
  aaOpacity: 0.82,
  asmWidthFrac: 0.073, // ASM monogram width ÷ canvas width
  asmOpacity: 0.9,
  asmInsetFrac: 0.03, // inset from right & bottom, ÷ the respective dimension
};

// ── PICKS ──────────────────────────────────────────────────────────────────
// slug → { src (relative to SRC_ROOT), orientation, position?, extract? }
//   position — cover-crop gravity (sharp) when "attention" drifts off the
//     subject; default "attention".
//   extract  — optional { left, top, width, height } in SOURCE pixels, applied
//     BEFORE the cover-crop (to drop a foreground distraction, etc.).
// Every source is a real frame from the Amazing Aerial 2022–2023 archive; the
// folder name (date + place) is the provenance. See report for per-pick reasons.
const PICKS = {
  // TSEUZIER upgrade — a Valais Alps aerial of the turquoise reservoir becomes
  // the new lead; the existing dam close-up (lac-de-tseuzier-01) stays as a
  // band frame. Source: 2023-08-11 Ayent drone.
  "lac-de-tseuzier-02": {
    src: "2023-08-11 - Switzerland - Ayent/Photos/Drone/DJI_0038.jpg",
    orientation: "landscape",
    position: "centre",
  },

  // CRANS-MONTANA (new) — the plateau's own view over the Rhône valley toward
  // the Alps. Extract drops the heavy foreground pine on the left. Source:
  // 2023-08-11 Lens (a Crans-Montana commune).
  "crans-montana-01": {
    src: "2023-08-11 - Switzerland - Lens/Photos/AA_Tier2_Alternates/20230811_103337.jpg",
    orientation: "landscape",
    extract: { left: 1150, top: 150, width: 2850, height: 2700 },
    position: "centre",
  },

  // LUGANO (new) — Lake Lugano at dusk with Monte San Salvatore, the parkfront
  // flowers in the foreground. Source: 2023-08-16 Lugano.
  "lugano-01": {
    src: "2023-08-16 - Switzerland - Lugano/Photos/AA_Tier2_Alternates/20230816_203147.jpg",
    orientation: "landscape",
    position: "centre",
  },

  // BELLAGIO (new) — the Lake Como waterfront from the Bellagio promenade;
  // portrait source, landscape centre band. Source: 2023-08-20 Bellagio.
  "bellagio-01": {
    src: "2023-08-20 - Italy - Bellagio/Photos/AA_Tier2_Alternates/20230820_131518.jpg",
    orientation: "landscape",
    // Portrait source; keep the centre band so the waterfront village (upper
    // right) stays in frame rather than drifting down to the water.
    extract: { left: 0, top: 780, width: 3000, height: 2000 },
    position: "centre",
  },

  // VARENNA replacement — the weak hazy aerial is replaced by the ground frame
  // of the village on its promontory; extract keeps village + lake and drops
  // the large right-edge cypress. Source: 2023-08-20 Varenna.
  "varenna-lake-como-01": {
    src: "2023-08-20 - Italy - Varenna/Photos/AA_Tier2_Alternates/20230820_103127.jpg",
    orientation: "landscape",
    extract: { left: 0, top: 500, width: 2750, height: 1833 },
    position: "centre",
  },

  // ── SUPPORTING FRAMES (P22) ────────────────────────────────────────────────
  // 2–4 more per spotlight, complementary angles to each lead, so a place reads
  // as a small collection funnelling to Amazing Aerial. Every source is a real
  // frame from the same 2022–2023 archive (or, for Castel Toblino, a still pulled
  // from the outing's own drone video). Sharp/varied picks, near-duplicates of
  // the lead avoided. See the P22 report for per-pick reasoning.

  // MATTERHORN (lead = vertical aerial). Add a wide aerial + two ground frames.
  "matterhorn-zermatt-02": {
    src: "2023-08-14 - Switzerland - Zermatt/Photos/AA_Tier2_Alternates/DJI_0065.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "matterhorn-zermatt-03": {
    src: "2023-08-14 - Switzerland - Zermatt/Photos/AA_Tier2_Alternates/20230814_090502.jpg",
    orientation: "landscape",
    position: "top",
  },
  "matterhorn-zermatt-04": {
    src: "2023-08-14 - Switzerland - Zermatt/Photos/AA_Tier2_Alternates/20230814_110334.jpg",
    orientation: "landscape",
    position: "centre",
  },

  // GORNERGRAT (lead = vertical, station over the glacier). Add an aerial glacier
  // panorama + the Gorner Glacier S-curve + a moraine sweep.
  "gornergrat-glacier-02": {
    src: "2023-08-14 - Switzerland - Zermatt/Photos/AA_Tier1_Best/aerial/DJI_0080.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "gornergrat-glacier-03": {
    src: "2023-08-14 - Switzerland - Zermatt/Photos/AA_Tier2_Alternates/20230815_142853.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "gornergrat-glacier-04": {
    src: "2023-08-14 - Switzerland - Zermatt/Photos/AA_Tier2_Alternates/20230815_132619.jpg",
    orientation: "landscape",
    position: "centre",
  },

  // LAC DE TSEUZIER (already lead + dam). Add a dramatic aerial (lake at the foot
  // of the rock wall) + a ground-level lake view from the Icogne trail.
  "lac-de-tseuzier-03": {
    src: "2023-08-11 - Switzerland - Ayent/Photos/Drone/DJI_0039.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "lac-de-tseuzier-04": {
    src: "2023-08-11 - Switzerland - Icogne/Photos/AA_Tier2_Alternates/20230811_123838.jpg",
    orientation: "landscape",
    position: "centre",
  },

  // CRANS-MONTANA (lead = pine + summit). Add two Rhône-valley panoramas from the
  // same shelf (raws here are thin on variety — both are down-valley vistas).
  "crans-montana-02": {
    src: "2023-08-11 - Switzerland - Lens/Photos/AA_Tier2_Alternates/20230811_105859.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "crans-montana-03": {
    src: "2023-08-11 - Switzerland - Lens/Photos/AA_Tier2_Alternates/20230811_105910.jpg",
    orientation: "landscape",
    position: "centre",
  },

  // CASTEL TOBLINO (lead = vertical castle). Add a ground lake+mountain view + a
  // bright aerial of the castle pulled from the outing's own drone video.
  "castel-toblino-02": {
    src: "2023-08-26 - Italy - Madruzzo/Photos/AA_Tier2_Alternates/20230826_103128.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "castel-toblino-03": {
    video: "2023-08-26 - Italy - Madruzzo/Videos/DJI_0187.MP4",
    videoTime: 4,
    orientation: "landscape",
    position: "centre",
  },

  // FLATIRONS / CHAUTAUQUA (lead = aerial over the meadow). Add a ground Flatirons
  // view through a pine, a dramatic rock spire, and a plains vista from a ledge.
  "flatirons-chautauqua-04": {
    src: "2023-04-24 - Colorado - Boulder/Photos/AA_Tier2_Alternates/IMG_20230420_083820_386.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "flatirons-chautauqua-05": {
    src: "2023-04-24 - Colorado - Boulder/Photos/AA_Tier2_Alternates/IMG_20230430_080530_251.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "flatirons-chautauqua-06": {
    src: "2023-04-24 - Colorado - Boulder/Photos/AA_Tier2_Alternates/IMG_20230427_060309_287.jpg",
    orientation: "landscape",
    position: "centre",
  },

  // BELLAGIO (lead = pastel village). Add the flowered promenade + a shoreline
  // village + the ferry-quay pilings.
  "bellagio-02": {
    src: "2023-08-20 - Italy - Bellagio/Photos/AA_Tier2_Alternates/20230820_131251.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "bellagio-03": {
    src: "2023-08-20 - Italy - Bellagio/Photos/AA_Tier2_Alternates/20230820_141503.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "bellagio-04": {
    src: "2023-08-20 - Italy - Bellagio/Photos/AA_Tier2_Alternates/20230820_134846.jpg",
    orientation: "landscape",
    position: "centre",
  },

  // LUGANO (lead = dusk + white flowerbeds). Add the promenade with the cathedral
  // tower + the red flowerbeds along the lake.
  "lugano-02": {
    src: "2023-08-16 - Switzerland - Lugano/Photos/AA_Tier2_Alternates/20230816_203152.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "lugano-03": {
    src: "2023-08-16 - Switzerland - Lugano/Photos/AA_Tier2_Alternates/20230816_203405.jpg",
    orientation: "landscape",
    position: "centre",
  },

  // VARENNA / LAKE COMO (lead = the village promontory). Add three frames from the
  // adjacent Perledo shoulder of the SAME eastern shore (operator asked for "more
  // from that region"): a cypress-framed lake, an open-lake vista, a rocky shore.
  "varenna-lake-como-02": {
    src: "2023-08-20 - Italy - Perledo/Photos/AA_Tier2_Alternates/20230820_103732.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "varenna-lake-como-03": {
    src: "2023-08-20 - Italy - Perledo/Photos/AA_Tier2_Alternates/20230820_104419.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "varenna-lake-como-04": {
    src: "2023-08-20 - Italy - Perledo/Photos/AA_Tier2_Alternates/20230820_102232.jpg",
    orientation: "landscape",
    position: "centre",
  },
};

/** Build a faded (optionally recoloured-white) mark PNG at a target pixel width. */
async function buildMark(logoPath, targetW, opacity, forceWhite) {
  const { data, info } = await sharp(logoPath)
    .resize({ width: Math.round(targetW) })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (forceWhite) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
    data[i + 3] = Math.round(data[i + 3] * opacity);
  }
  return {
    buffer: await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toBuffer(),
    width: info.width,
    height: info.height,
  };
}

/** Composite both marks onto a canvas of the given size; returns a sharp pipe. */
async function watermark(baseBuffer, W, H) {
  const aa = await buildMark(AA_LOGO, W * WM.aaWidthFrac, WM.aaOpacity, true);
  const asm = await buildMark(ASM_LOGO, W * WM.asmWidthFrac, WM.asmOpacity, true);
  const insetX = Math.round(W * WM.asmInsetFrac);
  const insetY = Math.round(H * WM.asmInsetFrac);
  return sharp(baseBuffer).composite([
    {
      input: aa.buffer,
      left: Math.round(W / 2 - aa.width / 2),
      top: Math.round(H / 2 - aa.height / 2),
    },
    { input: asm.buffer, left: W - asm.width - insetX, top: H - asm.height - insetY },
  ]);
}

/** Pull a single frame out of an archive video (ffmpeg) → a temp PNG path.
 * Used for places whose only strong extra angle lives in the outing's drone
 * clips (e.g. Castel Toblino). The archive stays read-only; the frame lands in
 * the OS temp dir and is fed to sharp exactly like a still source. */
function extractVideoFrame(videoPath, timeSec) {
  const out = join(tmpdir(), `adv-frame-${Date.now()}-${Math.round(Math.random() * 1e6)}.png`);
  execFileSync("ffmpeg", ["-y", "-ss", String(timeSec ?? 0), "-i", videoPath, "-frames:v", "1", out], {
    stdio: "ignore",
  });
  return out;
}

/** Resolve a pick to its on-disk source path (still or, for video picks, the
 * clip that a frame is extracted from — used for the existence check). */
function pickSrcPath(pick) {
  return join(SRC_ROOT, pick.video ?? pick.src);
}

/** EXIF-orient + optional pre-crop → a source buffer to resize from per width. */
async function preparedSource(pick) {
  const input = pick.video
    ? extractVideoFrame(join(SRC_ROOT, pick.video), pick.videoTime)
    : join(SRC_ROOT, pick.src);
  let img = sharp(input).rotate();
  if (pick.extract) img = img.extract(pick.extract);
  return img.toBuffer();
}

async function bakeOne(slug, pick) {
  const srcPath = pickSrcPath(pick);
  if (!existsSync(srcPath)) {
    console.error(`  ✖ missing source: ${pick.video ?? pick.src}`);
    process.exitCode = 1;
    return;
  }
  const { aspect, widths } = ORIENT[pick.orientation];
  const src = await preparedSource(pick);
  const position = pick.position ?? "attention";
  let bytes = 0;
  for (const w of widths) {
    const h = Math.round(w / aspect);
    const base = await sharp(src).resize({ width: w, height: h, fit: "cover", position }).toBuffer();
    const marked = await watermark(base, w, h);
    const avifOut = join(OUT_DIR, `${slug}-${w}.avif`);
    const webpOut = join(OUT_DIR, `${slug}-${w}.webp`);
    await marked.clone().avif(AVIF).toFile(avifOut);
    await marked.clone().webp(WEBP).toFile(webpOut);
    bytes += statSync(avifOut).size + statSync(webpOut).size;
  }
  console.log(`  ✓ ${slug.padEnd(24)} ${pick.orientation.padEnd(9)} ${(bytes / 1024).toFixed(0)}KB`);
}

// ── run ──
const args = process.argv.slice(2);
const testMode = args.includes("--test");
const wanted = args.filter((a) => !a.startsWith("--"));

await mkdir(OUT_DIR, { recursive: true });

if (testMode) {
  // Bake a watermarked preview PNG for every pick (or the named slugs) next to
  // scripts/ so framing + mark placement can be eyeballed before committing the
  // avif/webp sets to the gallery. Not shipped — _preview-*.png is gitignored.
  const slugs = wanted.length ? wanted : Object.keys(PICKS);
  for (const slug of slugs) {
    const pick = PICKS[slug];
    if (!pick) continue;
    const { aspect } = ORIENT[pick.orientation];
    const w = 1000,
      h = Math.round(w / aspect);
    const src = await preparedSource(pick);
    const base = await sharp(src)
      .resize({ width: w, height: h, fit: "cover", position: pick.position ?? "attention" })
      .toBuffer();
    const out = join(REPO, "scripts", `_preview-${slug}.png`);
    await (await watermark(base, w, h)).png().toFile(out);
    console.log(`preview → ${out}`);
  }
} else {
  const slugs = wanted.length ? wanted : Object.keys(PICKS);
  console.log(`\n▸ adventure frames → public/media/adventure/gallery/`);
  for (const slug of slugs) {
    if (!PICKS[slug]) {
      console.error(`  ✖ unknown slug: ${slug}`);
      process.exitCode = 1;
      continue;
    }
    await bakeOne(slug, PICKS[slug]);
  }
}
