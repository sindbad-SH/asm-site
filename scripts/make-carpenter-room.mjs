// make-carpenter-room.mjs — bake the "from the room" still for /venture/meme's
// Carpenter Not the Tools segment. Source: a frame mined from the operator's own
// recording of the 2025-12-03 session (E:\Makeshift\MEME\The Carpenter Not The
// Tools 12-3-2025\DJI_20251203170854_0006_D.MP4 @ 00:37:30, extracted + screened
// in E:\Makeshift\MEME\_CARPENTER-MINED — see its CONTENT-BRIEF.md). The crop
// already excludes the operator (he attended; standing rule). Native 1440x1080,
// so the "1600" tier emits at 1440 (withoutEnlargement — never upscale).
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "E:/Makeshift/MEME/_CARPENTER-MINED/stills/part1_00-37-30_eric-teaching-gesture.jpg";
const OUT = join(process.cwd(), "public", "media", "venture", "meme");
mkdirSync(OUT, { recursive: true });

for (const width of [900, 1440]) {
  const base = sharp(SRC).rotate().resize({ width, withoutEnlargement: true });
  await base.clone().avif({ quality: 52 }).toFile(join(OUT, `carpenter-room-${width}.avif`));
  await base.clone().webp({ quality: 74 }).toFile(join(OUT, `carpenter-room-${width}.webp`));
  console.log(`baked carpenter-room-${width}.{avif,webp}`);
}
