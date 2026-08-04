#!/usr/bin/env node
/**
 * make-seriesfest-devil-in-disguise.mjs — 2026-08-03.
 *
 * The one image for /venture/seriesfest-2025-devil-in-disguise.
 *
 * ⚠ THIS IS THE ONE PLACE ON THE SITE THAT DOES NOT SOURCE FROM A FULL-RES
 * ORIGINAL. There is none: a full-drive search for any photo captured
 * 2025-11-03..05, and for any "Gacy" / "Devil in Disguise" folder, found
 * nothing — the operator's SeriesFest pools are Apr–May 2025 (Season 11) and
 * Feb–May 2026. The only surviving frames of this screening are the three
 * LinkedIn-harvested display images in
 * E:\_LINKEDIN-ARCHIVE\seriesfest\2025-11-04-storytelling-documentary, all
 * 480px. OPERATOR DECISION 2026-08-03: build the chapter text-led and run ONE
 * soft photo rather than skip the visit or pad it.
 *
 * Of the three:
 *   img-01 ... the Peacock key art. EXCLUDED — third-party poster artwork, the
 *              same class of image the 2026-08-02 screening pass excluded.
 *   img-02 ... venue lobby with the event's own signage. NOT BAKED, held in
 *              reserve — one photo is the approved scope for this chapter.
 *   img-03 ... the post-screening conversation on stage. BAKED below.
 *
 * NO UPSCALE: withoutEnlargement keeps the export at its native 480px, and the
 * page renders it at a deliberately small measure (max 26rem) so it is never
 * asked to hold a size it doesn't have.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = "E:/_LINKEDIN-ARCHIVE/seriesfest/2025-11-04-storytelling-documentary/img-03.jpg";
const SLUG = "conversation-stage";
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

const outDir = join(process.cwd(), "public", "media", "venture", "seriesfest-2025-devil-in-disguise");
await mkdir(outDir, { recursive: true });

if (!existsSync(SRC)) {
  console.error(`✖ missing source: ${SRC}`);
  process.exit(1);
}

// ONE width only, unlike every other bake here. The source is 480px, so a
// second 1600w export would be a byte-identical file advertised at a size it
// does not have — a lie in the srcset. The page declares 900w only.
const meta = await sharp(SRC).rotate().metadata();
let bytes = 0;
{
  const base = sharp(SRC).rotate().resize({ width: 900, withoutEnlargement: true });
  const avifOut = join(outDir, `${SLUG}-900.avif`);
  const webpOut = join(outDir, `${SLUG}-900.webp`);
  await base.clone().avif(AVIF).toFile(avifOut);
  await base.clone().webp(WEBP).toFile(webpOut);
  bytes += statSync(avifOut).size + statSync(webpOut).size;
}
console.log(`✓ ${SLUG}  native ${meta.width}×${meta.height} (no upscale)  ${(bytes / 1024).toFixed(0)}KB`);
