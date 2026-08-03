#!/usr/bin/env node
/**
 * fix-vybe-band-played-on-2026-08-03.mjs — audit-fixes-2026-08-02 branch
 *
 * LAYOUT fix, not another photo swap. Three prior swaps of the `.vy-bleed`
 * full-width band ("The band played on...") all failed for the same root
 * cause: `.vy-bleed` is a 100vw-wide / max-height:70svh / object-fit:cover
 * box, and every Sunday source frame (ground camera AND drone) is portrait
 * (1080x1920 once each clip's own rotation tag is honored) — cover-cropping
 * a portrait source into a wide-short band always leaves a thin, zoomed-in
 * slice (confirmed: the deployed DJI_0126@4.5s frame crops to y~507-924 of
 * 1920, landing on the balloon-arch/couple area, not the band — "it just
 * shows two people talking"). Operator's direction: stop trying to force one
 * photo into that shape; redesign the presentation.
 *
 * Fix: retires `.vy-bleed` for this slot. Replaces it with a CONTAINED
 * two-photo composition (new `.vy-stagger--sunday` modifier: equal 1fr/1fr
 * columns, reusing `.vy-stagger`'s gap/card treatment — no new pattern, just
 * a portrait-appropriate proportion since neither source here is landscape)
 * inside the normal max-w-5xl column, each photo at a sane 4:5 crop instead
 * of a ~3.8:1 sliver:
 *
 *   - festival-band-wide (replaces festival-crowd-sing): DJI_0126.MP4 @ 3.0s
 *     — NOT the previously-used 4.5s. Re-scanned the clip at 0.5s steps
 *     (Laplacian variance): t=3.0 is the sharpest frame in the clip's wide
 *     window (1623.7 vs ~1350 at 4.5s) and the framing is if anything
 *     better — full 4-piece band clearly performing, both rainbow balloon
 *     clusters, the two onlookers by the fence, cottonwood trunk, parked
 *     cars. Top-anchored crop (left=0, top=300, width=1080, height=1350)
 *     keeps all of that and drops only empty dirt at the very bottom.
 *   - festival-dance-arch (new): Cam B Sun/CLIP/C0057.MP4 @ 62.0s — ground
 *     camera, NOT one of the two previously-rejected timestamps (172.5s,
 *     173s were both tight face zooms). Found by a fresh dense scan (every
 *     2s, Laplacian-screened, every candidate frame in the 38-76s window
 *     actually viewed): six festivalgoers dancing in a loose spread under
 *     the full rainbow balloon arch, tack-sharp, no foreground obstruction
 *     (t=46/56/60 all had a motion-blurred hand/sleeve in the extreme
 *     foreground; t=62 doesn't). This is the shot that actually delivers
 *     the chapter's own lede promise ("a rainbow balloon arch over the
 *     gate") — the old single photo never did. Tightened crop (left=140,
 *     top=200, width=800, height=1000, i.e. still 4:5) centers the dancers
 *     and arch instead of the mostly-empty grass below them.
 *
 * Both sources are portrait 1080x1920 at these timestamps, so a 4:5 crop
 * needs no upscale past native resolution at the baked widths (800/1120,
 * matching W.verticalSm elsewhere on this page) — fixes the "1600px source
 * stretched across 100vw is genuinely soft" half of the original diagnosis
 * as well as the crop half.
 *
 * Same light sharp()-only grading pass this page's photos already use (not
 * a new LightForge look).
 *
 * Sources:
 *   E:\Old Projects\Vybe\Vybe Fest\Vybe event 2023\Drone B Sun\DCIM\100MEDIA\DJI_0126.MP4 @ 3.0s
 *   E:\Old Projects\Vybe\Vybe Fest\Vybe event 2023\Cam B Sun\CLIP\C0057.MP4 @ 62.0s
 * Output: public/media/adventure/vybe/festival-band-wide-<width>.{avif,webp}
 *         public/media/adventure/vybe/festival-dance-arch-<width>.{avif,webp}
 */
import sharp from "sharp";
import { mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "adventure", "vybe");
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };
const MASTERS = "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/d3b8a0a5-b9b2-4cd3-83c4-86a711bb0128/scratchpad/vybe_masters";

function lightTouch(pipeline) {
  return pipeline
    .modulate({ saturation: 1.1, brightness: 1.03 })
    .linear(1.04, -6)
    .sharpen({ sigma: 0.8 });
}

async function bake(slug, srcFile, extract) {
  const src = join(MASTERS, srcFile);
  for (const width of [800, 1120]) {
    const height = Math.round((width * 5) / 4);
    const base = lightTouch(sharp(src).extract(extract).resize({ width, height, fit: "cover" }));
    await base.clone().avif(AVIF).toFile(join(OUT, `${slug}-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(OUT, `${slug}-${width}.webp`));
    console.log(`${slug}-${width} ok`);
  }
}

await mkdir(OUT, { recursive: true });

await bake("festival-band-wide", "festival-band-wide-master.jpg", { left: 0, top: 300, width: 1080, height: 1350 });
await bake("festival-dance-arch", "festival-dance-arch-master.jpg", { left: 140, top: 200, width: 800, height: 1000 });

// Clean up the now-unused festival-crowd-sing exports (superseded by
// festival-band-wide above; renamed because "crowd-sing" no longer
// describes what's in the new frame).
for (const width of [1120, 1600]) {
  for (const ext of ["avif", "webp"]) {
    const f = join(OUT, `festival-crowd-sing-${width}.${ext}`);
    await unlink(f).catch(() => {});
  }
}

console.log("vybe band-played-on redesign done ->", OUT);
