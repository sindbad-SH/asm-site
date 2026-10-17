/**
 * /og/<page-path>.jpg — per-page 1200×630 share cards (SEO pass, 2026-10-17).
 *
 * Baked at build time from each page's own lead photo (see src/lib/seo.ts).
 * JPEG rather than the site's WebP/AVIF ladders because Open Graph scrapers
 * are inconsistent about modern formats. "attention" cropping keeps the
 * salient part of the frame when a portrait or 3:2 photo is cut to 1.91:1.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { join } from "node:path";
import sharp from "sharp";
import { ogSources } from "../../lib/seo";

export const getStaticPaths = (async () => {
  const sources = await ogSources();
  return Object.entries(sources).map(([key, s]) => ({ params: { slug: key }, props: { src: s.src } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const file = join(process.cwd(), "public", props.src as string);
  const jpg = await sharp(file)
    .resize(1200, 630, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { "Content-Type": "image/jpeg" } });
};
