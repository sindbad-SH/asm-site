/**
 * site-root.ts — the project root for BUILD-TIME media detection, correct in
 * both execution modes (the v2 dev-server lesson, generalized):
 *
 *   - `astro build`: cwd = package root ✓, but import.meta.url points into
 *     dist/.prerender/chunks (bundled) ✗.
 *   - `astro dev`: import.meta.url = the real src file ✓, but cwd can be
 *     wherever the dev server was launched from (editor tooling, preview
 *     harnesses) ✗ — this silently degraded every existsSync() media check
 *     to "missing" in dev, shipping placeholders over real photos.
 *
 * So: prefer whichever candidate actually contains public/media.
 * Frontmatter-only (server-side); never import from client scripts.
 */
import { existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CANDIDATE_ROOTS = [
  process.cwd(),
  // src/lib/site-root.ts -> ../.. = package root (dev); harmless junk in build
  resolve(dirname(fileURLToPath(import.meta.url)), "..", ".."),
];

export const SITE_ROOT: string =
  CANDIDATE_ROOTS.find((r) => existsSync(join(r, "public", "media"))) ?? process.cwd();
