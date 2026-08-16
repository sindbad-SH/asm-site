#!/usr/bin/env node
/**
 * shots.mjs — full-page screenshots at a given viewport, for eyeballing.
 *
 * The in-app Browser pane can't composite frames in this environment, so
 * measurement alone was driving design decisions and missing what the operator
 * actually sees. This renders real PNGs. Same puppeteer-core hoist and Chrome
 * discovery as measure.mjs; run `npm run dev` first.
 *
 * Usage:
 *   node scripts/shots.mjs <outDir> <width> [/path ...]
 *   node scripts/shots.mjs C:/tmp/shots 390 / /adventure
 */
import { createRequire } from "node:module";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const BASE = "http://localhost:4321/asm-site";
const [outDir, widthArg, ...pathArgs] = process.argv.slice(2);
if (!outDir || !widthArg) {
  console.error("usage: node scripts/shots.mjs <outDir> <width> [/path ...]");
  process.exit(1);
}
const width = Number(widthArg);
const paths = pathArgs.length ? pathArgs : ["/"];
mkdirSync(outDir, { recursive: true });

const CHROME_PATHS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
];
const chromePath = CHROME_PATHS.find((p) => existsSync(p));
if (!chromePath) {
  console.error("No Chrome executable found.");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

for (const path of paths) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1, isMobile: width < 700, hasTouch: width < 700 });
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle2", timeout: 60000 });
  // full scroll pass so lazy media mounts, then settle at top
  await page.evaluate(async () => {
    const step = 600;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  // wait for every mounted image to finish DECODING — a fullPage screenshot
  // otherwise captures loaded-but-undecoded frames as empty boxes, which reads
  // as a layout bug that isn't there.
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].filter((i) => i.currentSrc).map((i) => i.decode().catch(() => {})),
    );
  });
  await new Promise((r) => setTimeout(r, 250));
  const name = (path === "/" ? "home-root" : path.replace(/^\//, "").replace(/\//g, "-")) + `-${width}.png`;
  await page.screenshot({ path: join(outDir, name), fullPage: true });
  const h = await page.evaluate(() => document.body.scrollHeight);
  console.log(`${name}  (fullPage height ${h}px)`);
  await page.close();
}
await browser.close();
