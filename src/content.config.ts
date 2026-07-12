/**
 * src/content.config.ts — Astro Content Collections (P12.4d · "Field Notes").
 *
 * NOTE ON LOCATION: Astro 7 requires the collections config at
 * `src/content.config.ts` (the old `src/content/config.ts` path is rejected as
 * a legacy config). The authoring folder still lives at `src/content/field-notes/`.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Field Notes is the operator's "blog that doesn't look like a blog": a
 * self-service story log with NO CMS. To publish, he drops ONE markdown file
 * into `src/content/field-notes/`, fills in the frontmatter, and the site
 * renders it. This file is the contract that makes that dead simple and safe —
 * the schema below is the ONLY shape a note may take, so a malformed entry
 * fails the build loudly instead of shipping broken.
 *
 * AUTHORING CONTRACT (kept in sync with `field-notes/_example.md.txt`):
 *   title    — required. The headline, set in the display serif.
 *   date     — required. `YYYY-MM-DD`. Drives newest-first ordering.
 *   location — optional. A place-name; renders on the mono survey slate.
 *   tags     — optional. A list of short labels.
 *   cover    — optional. A `/media/...` path (leading slash, no domain). The
 *              site prefixes the deploy base — the operator never writes it.
 *   draft    — optional, defaults false. `true` keeps a note OUT of the build
 *              (not listed, no page) until he's ready.
 *
 * HONESTY NOTE (P12.4d): this file defines STRUCTURE only. It makes no claim
 * about the operator, and it introduces none of the site's hard-excluded terms.
 * Every claim a note makes is the operator's own words in his own file.
 *
 * API (Astro 7 content layer): the `glob` loader reads every `*.md` under the
 * authoring folder. Files/folders beginning with `_` are ignored by Astro, so
 * the seeded `_example.md.txt` template never enters the collection (its `.txt`
 * extension keeps it out twice over — it isn't `*.md`).
 */
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const fieldNotes = defineCollection({
  // Folder-of-markdown: point the loader at the authoring folder. `id` derives
  // from the filename (e.g. `my-story.md` → `my-story`), which becomes the URL
  // slug at /field-notes/my-story.
  loader: glob({ pattern: "**/*.md", base: "./src/content/field-notes" }),
  schema: z.object({
    title: z.string(),
    // `coerce` lets the operator write a bare `YYYY-MM-DD` string and still get
    // a real Date for sorting/formatting — no quotes-vs-no-quotes footguns.
    date: z.coerce.date(),
    location: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // A site-absolute media path like `/media/field-notes/cover.jpg`. The pages
    // prepend the deploy base (`/asm-site` on staging, `/` in production).
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { fieldNotes };
