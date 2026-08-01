#!/usr/bin/env node
/**
 * measure.mjs — layout measurement harness (REBUILT 2026-08-01; the original
 * lived in a retired session's scratchpad and was lost — see
 * LAYOUT-RESEQUENCE-PLAN.md step 4).
 *
 * Measures rendered story pages against SPEC-EDITORIAL-LAYOUT.md's rules +
 * the per-page acceptance criteria in LAYOUT-RESEQUENCE-PLAN.md. Runs
 * headless Chrome (puppeteer-core, hoisted via @lhci/cli) against the LOCAL
 * DEV SERVER — start `npm run dev` first. Pages are measured ONE AT A TIME,
 * sequentially (machine constraint: no parallel load).
 *
 * Per page it emits (JSON to stdout and _measure-results.json):
 *  - settledHeight (after full lazy-load scroll pass)
 *  - every rendered <img>/<video> in DOM order: display w×h, orientation
 *    (L/P/SQ at 5% tolerance), current source filename
 *  - adjacency violations: consecutive media sharing width (±2px) AND
 *    orientation, split into standalone beats vs same-group cells (grouped
 *    beats — figures sharing a parent grid — are the spec's blessed devices)
 *  - distinct display widths (±2px bucket)
 *  - caption coverage: media beats with an associated figcaption
 *  - content sha1 of every displayed source (fetched bytes) → repeated-image
 *    detection within the page AND across all measured pages
 *
 * Usage:
 *   node scripts/measure.mjs                       # the 7 audit pages
 *   node scripts/measure.mjs /venture/afm-2025 …   # explicit page list
 */
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { existsSync } from "node:fs";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const BASE = "http://localhost:4321/asm-site";
const DEFAULT_PAGES = [
  "/adventure/steel-and-dust",
  "/adventure/vybe",
  "/venture/dawn-patrol",
  "/venture/seriesfest",
  "/venture/afm-2025",
  "/work/pitchboulder",
  "/venture/meme",
];
const pages = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_PAGES;

const CHROME_PATHS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
];
const chromePath = CHROME_PATHS.find((p) => existsSync(p));
if (!chromePath) {
  console.error("No Chrome executable found in the standard locations.");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
});

const results = {};
const hashIndex = {}; // sha1 -> [{page, src}]

for (const path of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const url = `${BASE}${path}`;
  process.stderr.write(`▸ ${path} … `);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  // full scroll pass so every lazy image loads, then settle back at top
  await page.evaluate(async () => {
    const step = 700;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 600));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  const data = await page.evaluate(() => {
    const media = [...document.querySelectorAll("main img, main video, article img, article video, section img, section video")]
      // de-dupe elements matched by multiple selectors, keep DOM order
      .filter((el, i, arr) => arr.indexOf(el) === i)
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 40 && r.height > 0; // ignore icons/logos under 40px
      });
    const rows = media.map((el) => {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      const orient = w > h * 1.05 ? "L" : h > w * 1.05 ? "P" : "SQ";
      const src = (el.currentSrc || el.src || "").split("/").pop().split("?")[0] || "(none)";
      const fig = el.closest("figure");
      const grid = el.closest("div, section");
      const groupKey = grid ? Array.from(document.querySelectorAll("*")).indexOf(grid) : -1;
      const hasCaption = !!(fig && fig.querySelector("figcaption")) ||
        // hook/hero credit patterns: a caption-classed sibling in the same section
        !!(el.closest("section, figure")?.querySelector(".case-hook-credit"));
      return { src, w, h, orient, groupKey, hasCaption, tag: el.tagName.toLowerCase(),
        url: el.currentSrc || el.src || "" };
    });
    let standaloneViolations = 0, groupedSameScale = 0;
    const violations = [];
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i - 1], b = rows[i];
      if (Math.abs(a.w - b.w) <= 2 && a.orient === b.orient) {
        if (a.groupKey === b.groupKey && a.groupKey !== -1) groupedSameScale++;
        else { standaloneViolations++; violations.push(`${a.src} → ${b.src} (${a.w}px ${a.orient})`); }
      }
    }
    const widthBuckets = [];
    for (const r of rows) {
      if (!widthBuckets.some((w) => Math.abs(w - r.w) <= 2)) widthBuckets.push(r.w);
    }
    return {
      settledHeight: Math.round(document.body.scrollHeight),
      mediaCount: rows.length,
      distinctWidths: widthBuckets.sort((x, y) => x - y),
      standaloneViolations,
      violationDetail: violations,
      groupedSameScale,
      captioned: rows.filter((r) => r.hasCaption).length,
      uncaptioned: rows.filter((r) => !r.hasCaption).map((r) => r.src),
      rows: rows.map(({ url, groupKey, ...keep }) => keep),
      urls: rows.map((r) => r.url),
    };
  });

  // content hashes for repeat detection (image sources only)
  const hashes = [];
  for (const u of data.urls) {
    if (!u || u.endsWith(".mp4")) { hashes.push(null); continue; }
    try {
      const buf = await page.evaluate(async (src) => {
        const res = await fetch(src, { cache: "force-cache" });
        return Array.from(new Uint8Array(await res.arrayBuffer()));
      }, u);
      const sha = createHash("sha1").update(Buffer.from(buf)).digest("hex").slice(0, 12);
      hashes.push(sha);
      const name = u.split("/").pop().split("?")[0];
      (hashIndex[sha] ||= []).push({ page: path, src: name });
    } catch {
      hashes.push("FETCH-FAIL");
    }
  }
  data.rows.forEach((r, i) => (r.sha = hashes[i]));
  delete data.urls;

  // within-page repeats
  const seen = {};
  data.repeatsWithinPage = [];
  data.rows.forEach((r) => {
    if (!r.sha || r.sha === "FETCH-FAIL") return;
    if (seen[r.sha]) data.repeatsWithinPage.push(`${seen[r.sha]} == ${r.src}`);
    else seen[r.sha] = r.src;
  });

  results[path] = data;
  process.stderr.write(`h=${data.settledHeight} media=${data.mediaCount} widths=${data.distinctWidths.length} viol=${data.standaloneViolations} caps=${data.captioned}/${data.mediaCount}\n`);
  await page.close();
}

// cross-page repeats (same content hash on more than one measured page)
const crossPageRepeats = Object.entries(hashIndex)
  .filter(([, uses]) => new Set(uses.map((u) => u.page)).size > 1)
  .map(([sha, uses]) => ({ sha, uses }));

const out = { measuredAt: new Date().toISOString(), viewport: "1280x900", pages: results, crossPageRepeats };
writeFileSync(new URL("../_measure-results.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();
