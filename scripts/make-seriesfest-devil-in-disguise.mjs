#!/usr/bin/env node
/**
 * make-seriesfest-devil-in-disguise.mjs — 2026-08-03, revisited 2026-08-04.
 *
 * The images for /venture/seriesfest-2025-devil-in-disguise.
 *
 * ⚠ THIS IS THE ONE PLACE ON THE SITE THAT DOES NOT SOURCE FROM A FULL-RES
 * ORIGINAL. There is none: a full-drive search for any photo captured
 * 2025-11-03..05, and for any "Gacy" / "Devil in Disguise" folder, found
 * nothing — the operator's SeriesFest pools are Apr–May 2025 (Season 11) and
 * Feb–May 2026. The only surviving frames of this screening are the three
 * LinkedIn-harvested display images in
 * E:\_LINKEDIN-ARCHIVE\seriesfest\2025-11-04-storytelling-documentary, all
 * 480px.
 *
 * Of the three (the operator asked on 2026-08-04 to use more than one):
 *   img-01 ... the Peacock key art, on its own. EXCLUDED, and it should stay
 *              excluded. It is not his photograph — it is the distributor's
 *              promotional artwork, and running it standalone publishes someone
 *              else's copyrighted image as page content. He asked whether
 *              "editing or processing it" would make it more his own; it would
 *              not. A processed copy is a derivative work and the rights stay
 *              with the holder. Nothing on the page needs it.
 *   img-02 ... The Cable Center atrium ("CABLE HALL OF FAME") with SeriesFest's
 *              own event signage tower. BAKED 2026-08-04. This one is HIS
 *              photograph of a real room. The key art appears incidentally, in
 *              situ, on the venue's own sign — the same thing as photographing
 *              a cinema marquee, and ordinary editorial event coverage. It also
 *              establishes the venue, which the page could not name before.
 *   img-03 ... the post-screening conversation on stage. BAKED.
 *
 * NO UPSCALE: withoutEnlargement keeps both exports at their native 480px, and
 * the page sizes each beat close to native so neither is ever asked to hold a
 * width it doesn't have.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const ARCHIVE = "E:/_LINKEDIN-ARCHIVE/seriesfest/2025-11-04-storytelling-documentary";
const PICKS = [
  { file: "img-02.jpg", slug: "venue-signage" },
  { file: "img-03.jpg", slug: "conversation-stage" },
];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

const outDir = join(process.cwd(), "public", "media", "venture", "seriesfest-2025-devil-in-disguise");
await mkdir(outDir, { recursive: true });

// ONE width each, unlike every other bake in this repo. The sources are 480px,
// so a second 1600w export would be a byte-identical file advertised at a size
// it does not have — a lie in the srcset. The page declares 900w only.
for (const { file, slug } of PICKS) {
  const src = join(ARCHIVE, file);
  if (!existsSync(src)) {
    console.error(`✖ missing source: ${src}`);
    process.exitCode = 1;
    continue;
  }
  const meta = await sharp(src).rotate().metadata();
  const base = sharp(src).rotate().resize({ width: 900, withoutEnlargement: true });
  const avifOut = join(outDir, `${slug}-900.avif`);
  const webpOut = join(outDir, `${slug}-900.webp`);
  await base.clone().avif(AVIF).toFile(avifOut);
  await base.clone().webp(WEBP).toFile(webpOut);
  const bytes = statSync(avifOut).size + statSync(webpOut).size;
  console.log(`✓ ${slug.padEnd(20)} native ${meta.width}×${meta.height} (no upscale)  ${(bytes / 1024).toFixed(0)}KB`);
}
