/**
 * make-meme-archive-adds.mjs — two late additions to /venture/meme, both
 * supplied by the operator on 2026-08-03 AFTER the archive round had shipped
 * to its branch. Kept as a script (not a one-off) so either can be re-baked
 * without re-deriving the crop maths. See also make-meme-evergreen.mjs (the
 * program cards + "in the world" strip) and fix-meme-roster-crops-2026-08-03.mjs
 * (the other four roster crops).
 *
 * ── 1. ERIC ABRAMSON'S HEADSHOT ──────────────────────────────────────────
 * Operator, verbatim: "for Eric's photo this one is fine … Just use it as full
 * frame. I don't know if you were just trying to zoom in to not get the other
 * person in the shot but this photo is fine, it's what he wants — is his
 * headshot."
 *
 * Context: every previous build cropped Eric tight, deliberately excluding an
 * interview subject in the background. That was the wrong instinct twice over
 * — it produced the "cut off a good chunk of their head" complaint, and it was
 * removing the very thing that makes the photo his professional identity: he
 * is on a shoot, headphones on, camera rig beside him, subject lit behind.
 *
 * NEW SOURCE — `Head shots\Eric Abramson.jpg` (1536x2048), replacing the old
 * on-set frame. This is the headshot Eric himself wants used.
 *
 * "Full frame" is honoured in substance, with one honest caveat. The roster
 * grid is square (`.meme-roster-card img { aspect-ratio: 1/1 }`), and the
 * source is 3:4 PORTRAIT — so a square crop takes the FULL WIDTH (1536px) and
 * trims only vertically. Everything the operator cares about survives: Eric's
 * whole head with generous headroom, his glasses/cap/headphones, the camera
 * body, both monitors, and the seated interview subject. Only ceiling (top)
 * and part of his lower torso (bottom) fall outside. Nothing is "zoomed in to
 * exclude the other person" — the other person is on the horizontal axis,
 * which is untouched.
 *
 * top=256 (not 0) centres his head in the square rather than leaving a band of
 * empty ceiling — verified by eye against top=0 / 256 / 400 candidates.
 *
 * ── 2. THE NOCOVA PHOTO ──────────────────────────────────────────────────
 * Operator: "for NOCOVA — my bad, there was a photo for it, I just put it in
 * the wrong folder."
 *
 * This retires a claim the page had been making in good faith but wrongly: an
 * earlier mining pass concluded "no NOCOVA photography exists anywhere" and
 * the section was built to stand photo-less around a venue/frequency card.
 * The photo existed; it was simply filed under Archive moments.
 *
 * It is close to the ideal frame for that section: NOCOVA's own branded
 * A-frame sign (reading "NOCOVA / Northern Colorado Visual Arts / Film,
 * Television, New Media, Interactive / 'Congregate, conversate, COLLABORATE'")
 * with members around it mid-conversation in a hotel lounge — i.e. it shows
 * the community networking the copy describes, and it carries MEME's own
 * branding rather than a stock-feeling crowd shot.
 *
 * ⚠ THE OPERATOR IS IN THIS PHOTO (second from left — long dark hair, dark
 * bandana, throwing a shaka). That is CLEARED, and it narrows a rule that had
 * been applied too broadly. His words: "although I am technically in one or
 * two of these photos, these ones are actually OK since I am affiliated with
 * MEME. I just didn't want my photo on the home page outside my headshot /
 * profile photo." So: the never-appears rule is HOME-PAGE scoped, not
 * site-wide. On pages about organizations he belongs to, he may appear.
 *
 * The source is 1440x955 (≈3:2), so it ships essentially FULL FRAME — a 3:2
 * crop trims 8px of width and nothing else. All five faces stay whole. The
 * section's CSS is moved from 4/5 to 3/2 to match, because forcing this
 * landscape group shot into a 4:5 portrait slot would have cropped roughly
 * half the width and cut people out of their own photo.
 */
import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "media", "venture", "meme");
const PHOTOS = String.raw`E:\Makeshift\MEME\05 - Source Docs from MEME\Photos`;

mkdirSync(OUT, { recursive: true });

/** Write the AVIF+WebP pair this page's `pair()` helper expects. */
async function emit(pipeline, slug) {
  await pipeline.clone().avif({ quality: 52 }).toFile(join(OUT, `${slug}.avif`));
  await pipeline.clone().webp({ quality: 74 }).toFile(join(OUT, `${slug}.webp`));
  console.log(`  ✓ ${slug}.{avif,webp}`);
}

const jobs = [
  {
    label: "Eric Abramson — headshot (new source, full width)",
    src: join(PHOTOS, "Head shots", "Eric Abramson.jpg"),
    slug: "eric-abramson-portrait-700",
    // full width of the 1536x2048 source; vertical trim only
    box: { left: 0, top: 256, width: 1536, height: 1536 },
    width: 700,
  },
  {
    label: "NOCOVA meetup — branded sign + members (essentially full frame)",
    src: join(PHOTOS, "Archive moments", "NOCOVA Photo.jfif"),
    slug: "nocova-meetup-1",
    // 1440x955 source → 3:2. Centre 1432x955 = an 8px trim, nothing else.
    box: { left: 4, top: 0, width: 1432, height: 955 },
    width: 1200,
  },
];

console.log("▸ MEME archive additions → public/media/venture/meme/");
for (const j of jobs) {
  if (!existsSync(j.src)) throw new Error(`missing source: ${j.src}`);
  const meta = await sharp(j.src).metadata();
  const { left, top, width, height } = j.box;
  if (left + width > meta.width || top + height > meta.height) {
    throw new Error(`${j.slug}: box ${left},${top} ${width}x${height} exceeds source ${meta.width}x${meta.height}`);
  }
  console.log(`  ${j.label}`);
  await emit(
    sharp(j.src).rotate().extract(j.box).resize({ width: j.width, withoutEnlargement: true }),
    j.slug,
  );
}
console.log("done.");
