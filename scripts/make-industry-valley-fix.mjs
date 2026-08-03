#!/usr/bin/env node
/**
 * make-industry-valley-fix.mjs — 2026-08-03, entry/utility design audit.
 *
 * VIOLATION FOUND: public/media/home/industry/cluster/valley.{avif,webp} (last
 * touched commit 7c21310, 2026-07-12 — predates the site-owner reference-photo
 * screening rule established later) was a SeriesFest step-and-repeat two-shot
 * in which the site owner appears prominently (confirmed by visual match
 * against the operator's own reference photo: long dark hair, dark bandana,
 * sunglasses pushed up, short beard, grey/olive waistcoat, lanyard — the exact
 * same two-shot pose/backdrop as the reference). Hard rule: the operator must
 * never appear in coverage photography. This script replaces ONLY that one
 * file pair with a clean SeriesFest frame — no site-owner, no posed step-and-
 * repeat photo-op, not one of the two forbidden AFM clips — sourced from the
 * SAME tiered archive convention as scripts/make-seriesfest-hub.mjs.
 *
 * Pick: Series Fest 2025 Festival, Season 11 Awards Ceremony stage — a wide
 * atmosphere shot (branded screen + trophies + presenters), unused elsewhere
 * on the site (not in make-seriesfest-hub.mjs's or make-linkedin-archive-
 * additions.mjs's pick lists). Chosen over another seated-panel frame because
 * "industry" already has two AFM panel shots (peak/ridge) — this adds visual
 * variety (stage/trophy atmosphere) instead of a third near-identical panel.
 *
 * Dimensions match the sibling `lake.webp` this replaces alongside (1050x700,
 * 3/2 — the `.float--valley` default), via attention-based crop from the
 * native 12240x12240 square capture (this phone/venue's fixed square output;
 * confirmed square even after EXIF auto-orient).
 */
import sharp from "sharp";
import { statSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const SRC =
  "E:/Old Projects/Series Fest/2025 Photos/Series Fest 2025 - Festival/_TIER 1 - TOP (make stories)/20250504_182849.jpg";
const outDir = join(repoRoot, "public", "media", "home", "industry", "cluster");
const W = 1050;
const H = 700;

const base = sharp(SRC).rotate().resize({ width: W, height: H, fit: "cover", position: sharp.strategy.attention });
const avifOut = join(outDir, "valley.avif");
const webpOut = join(outDir, "valley.webp");
await base.clone().avif({ quality: 50, effort: 5 }).toFile(avifOut);
await base.clone().webp({ quality: 72, effort: 5 }).toFile(webpOut);
const bytes = statSync(avifOut).size + statSync(webpOut).size;
console.log(`✓ industry/cluster/valley  ${W}×${H}  ${(bytes / 1024).toFixed(0)}KB (replaces site-owner-appears frame)`);
