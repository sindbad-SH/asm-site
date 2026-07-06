/**
 * drift-engine.ts — AMBIENT DRIFT (R3.5, signature move #1).
 *
 * Slow, continuous, organic idle motion for floating imagery — the life the
 * operator asked for ("floating around or moving around slowly") layered ON TOP
 * of scroll parallax. KPR energy at a surveyor's pace.
 *
 * HOW IT COMPOSES WITH THE EXISTING PARALLAX (the whole trick):
 *   Tableaux.astro scrubs `yPercent` on each [data-float]. This engine drives
 *   `x`, `y`, `rotation` on the SAME element. GSAP stores each transform
 *   component independently and merges them into one matrix — so drift and
 *   parallax never fight, and no wrapper elements are needed.
 *
 * MOTION MODEL: two incommensurate sines per axis (a cheap organic pseudo-noise
 *   — the sum never visibly repeats), plus a slower rotation sine. Per-element
 *   phase seeds advance by the golden angle so no two cards ever synchronize.
 *
 * COST MODEL: one shared gsap.ticker callback; transform-only writes; per-item
 *   IntersectionObserver so off-screen items are skipped AND the ticker
 *   detaches entirely when nothing is visible. rAF throttles in background
 *   tabs natively. Mount at requestIdleCallback from callers.
 *
 * HARD GATES (mounts nothing, costs nothing):
 *   prefers-reduced-motion: reduce · viewport ≤640px (matches the site's
 *   existing mobile motion gate) · Save-Data is NOT gated (no bytes involved).
 *
 * API:
 *   mountDrift(scope?) — scans scope (default document) for [data-drift],
 *     reads optional data-drift-amp (multiplier, default 1). Returns a handle
 *     with destroy(). Idempotent per element.
 *   window.__DRIFT — QA: { count, running, freeze(t), thaw() }. freeze(t)
 *     renders the field deterministically at time t for screenshot harnesses.
 */
import { gsap } from "gsap";

const TAU = Math.PI * 2;
const GOLDEN = 2.399963229728653; // golden angle (rad) — phase de-sync

// Base amplitudes at amp=1 — “breathing”, never “bobbing” (§0.3 ceiling).
const AX = 7;   // px, horizontal
const AY = 10;  // px, vertical (vertical reads most alive)
const AR = 0.7; // deg, rotation

// Base periods (s). Two per axis, deliberately incommensurate; each item
// jitters these ±12% so the field never falls into lockstep.
const P = { x1: 9.7, x2: 6.1, y1: 11.3, y2: 7.3, r: 13.7 };

interface Item {
  el: HTMLElement;
  amp: number;
  seed: number;
  wx1: number; wx2: number; wy1: number; wy2: number; wr: number;
  visible: boolean;
}

const items: Item[] = [];
const mounted = new WeakSet<HTMLElement>();
let tickerOn = false;
let frozen: number | null = null; // QA freeze time
let io: IntersectionObserver | null = null;

function renderAt(t: number) {
  for (const it of items) {
    if (!it.visible && frozen === null) continue;
    const s = it.seed;
    const x = it.amp * AX * (0.62 * Math.sin(t * it.wx1 + s) + 0.38 * Math.sin(t * it.wx2 + s * 2.7));
    const y = it.amp * AY * (0.58 * Math.sin(t * it.wy1 + s * 1.3) + 0.42 * Math.sin(t * it.wy2 + s * 3.1));
    const r = it.amp * AR * Math.sin(t * it.wr + s * 0.9);
    gsap.set(it.el, { x, y, rotation: r });
  }
}

function tick() {
  if (frozen !== null) return; // QA freeze owns the field
  renderAt(gsap.ticker.time);
}

function syncTicker() {
  const anyVisible = items.some((it) => it.visible);
  if (anyVisible && !tickerOn) {
    gsap.ticker.add(tick);
    tickerOn = true;
  } else if (!anyVisible && tickerOn) {
    gsap.ticker.remove(tick);
    tickerOn = false;
  }
}

export function mountDrift(scope: ParentNode = document): { destroy(): void } {
  const noop = { destroy() {} };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return noop;
  if (window.matchMedia("(max-width: 640px)").matches) return noop;

  io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const it = items.find((i) => i.el === e.target);
        if (it) it.visible = e.isIntersecting;
      }
      syncTicker();
    },
    { rootMargin: "10% 0% 10% 0%" },
  );

  const added: Item[] = [];
  scope.querySelectorAll<HTMLElement>("[data-drift]").forEach((el) => {
    if (mounted.has(el)) return;
    mounted.add(el);
    const n = items.length;
    const jit = (base: number) => (TAU / base) * (0.88 + ((n * 0.37) % 1) * 0.24); // ±12%
    const it: Item = {
      el,
      amp: Number(el.dataset.driftAmp) || 1,
      seed: n * GOLDEN,
      wx1: jit(P.x1), wx2: jit(P.x2), wy1: jit(P.y1), wy2: jit(P.y2), wr: jit(P.r),
      visible: false,
    };
    items.push(it);
    added.push(it);
    io!.observe(el);
  });

  // QA surface (idempotent reassignment is fine)
  (window as unknown as Record<string, unknown>).__DRIFT = {
    get count() { return items.length; },
    get running() { return tickerOn; },
    freeze(t: number) { frozen = t; renderAt(t); },
    thaw() { frozen = null; },
  };

  return {
    destroy() {
      for (const it of added) {
        io?.unobserve(it.el);
        gsap.set(it.el, { x: 0, y: 0, rotation: 0 });
        const idx = items.indexOf(it);
        if (idx >= 0) items.splice(idx, 1);
        mounted.delete(it.el);
      }
      syncTicker();
    },
  };
}
