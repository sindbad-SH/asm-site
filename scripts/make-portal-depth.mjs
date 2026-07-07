/**
 * make-portal-depth.mjs — authors the Portal Hero's depth map (P1 WebGL scene).
 *
 * The 2.5D parallax shader (src/lib/portal-scene-3d.ts) displaces the scene
 * texture by cursor motion scaled by this map: BLACK = far (sky), WHITE = near
 * (foreground cloud sea). The silhouettes are hand-traced from
 * public/media/home/portal-scene.webp (1280×720) and then HEAVILY blurred on
 * purpose — displacement amplitude is small (~1.2% UV) and soft depth edges
 * turn silhouette-tracing error into gentle bending instead of visible tearing.
 *
 * Run: node scripts/make-portal-depth.mjs   (sharp comes with astro)
 * Output: public/media/home/portal-depth.png (grayscale, ~10KB)
 *
 * Regenerate ONLY if the portal scene art itself is replaced — the traced
 * ridgelines below belong to the 2026-07 brand-sting frame.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "media", "home", "portal-depth.png");

// Hand-traced from the 1280×720 scene: central peak apex ≈ (655,452);
// left range ≈ (140,510)(340,545)(480,555); right ≈ (930,555)(1060,520)(1230,560).
const svg = `
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- sky: far, easing slightly nearer toward the horizon glow -->
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"   stop-color="#0a0a0a"/>
      <stop offset="0.7" stop-color="#1e1e1e"/>
      <stop offset="1"   stop-color="#2e2e2e"/>
    </linearGradient>
    <!-- cloud sea: nearest, fading up into the ranges -->
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a8a8a" stop-opacity="0"/>
      <stop offset="1" stop-color="#d8d8d8"/>
    </linearGradient>
  </defs>

  <rect width="1280" height="720" fill="url(#sky)"/>

  <!-- distant flanking ranges (mid-far) -->
  <path d="M0,560 L60,530 L140,510 L220,548 L300,530 L340,545 L420,565 L480,555 L560,585 L640,600 L0,600 Z
           M640,600 L720,585 L800,570 L870,585 L930,555 L1000,570 L1060,520 L1130,555 L1180,540 L1230,560 L1280,545 L1280,620 L640,620 Z"
        fill="#6a6a6a"/>

  <!-- the central peak (mid) — nearer than the flanks, the scene's anchor -->
  <path d="M500,720 L560,600 L620,510 L655,452 L690,505 L740,585 L800,660 L820,720 Z" fill="#7e7e7e"/>

  <!-- lower shoulder ridges (near-mid) -->
  <path d="M0,660 L120,615 L260,650 L400,610 L540,660 L700,630 L860,665 L1000,620 L1150,660 L1280,630 L1280,720 L0,720 Z"
        fill="#9a9a9a"/>

  <!-- the cloud sea / foreground haze band (nearest) -->
  <rect y="600" width="1280" height="120" fill="url(#sea)"/>
</svg>`;

const png = await sharp(Buffer.from(svg))
  .blur(9) // soft depth edges by design — see header comment
  .grayscale()
  .png({ compressionLevel: 9, palette: true })
  .toBuffer();

await sharp(png).toFile(OUT);
const kb = (png.length / 1024).toFixed(1);
console.log(`portal-depth.png written (${kb} KB) → ${OUT}`);
