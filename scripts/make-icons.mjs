/**
 * make-icons.mjs — regenerate the favicon/app-icon set from the FULL-COLOR
 * brand mark (public/logo-mark.png — the same aurora-S the nav shows), on
 * the brand-void plate so it reads on both light and dark tab bars.
 *
 * P12.2: the previous set used a monochrome mark; the operator wants the
 * tab icon to match the colored mark in the site header.
 *
 * Run: node scripts/make-icons.mjs   (sharp ships with astro; favicon.ico
 * is written by ffmpeg from the 48px PNG.)
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUB = path.join(ROOT, "public");
const MARK = path.join(PUB, "logo-mark.png");
const PLATE = { r: 16, g: 16, b: 32, alpha: 1 }; // --hero-void #101020

async function icon(size, out, pad = 0.12) {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(MARK)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: PLATE } })
    .composite([{ input: mark, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUB, out));
  console.log(`${out} (${size}px)`);
}

await icon(32, "favicon-32.png", 0.06); // tiny canvas: less padding, more mark
await icon(48, "favicon-48.tmp.png", 0.08);
await icon(180, "apple-touch-icon.png");
await icon(192, "icon-192.png");
await icon(512, "icon-512.png");

execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(PUB, "favicon-48.tmp.png"), path.join(PUB, "favicon.ico")]);
const { unlinkSync } = await import("node:fs");
unlinkSync(path.join(PUB, "favicon-48.tmp.png"));
console.log("favicon.ico (48px)");
