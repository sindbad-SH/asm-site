/**
 * decode-text.ts — KPR-grammar "survey telemetry" text decode (V2-PLAN §2).
 *
 * Elements marked [data-decode] scramble→resolve on first approach: glyphs
 * churn through an instrument alphabet and lock in left→right. Used on mono
 * labels and short copy lines — never on long paragraphs (taste ceiling).
 *
 * Discipline (v1 rules, binding):
 *   - Text is ALWAYS present statically (no-JS/SEO read the real words);
 *     the effect only replaces characters transiently on reveal.
 *   - reduced motion → no-op.
 *   - WALL-CLOCK SAFE: progress is computed from performance.now(), and a
 *     hard setTimeout lands the final text even if rAF is throttled to
 *     nothing (background tabs — the V-1 lesson).
 *   - Idempotent per element; skipped entirely when IO is unavailable.
 *
 * QA: window.__DECODE = { count, fire(el?) } — fire() decodes immediately,
 * deterministic enough for screenshot harnesses.
 */

const GLYPHS = "▪▫△◆○●◇/\\|—·:+×0123456789ABCDEFGHKMNPRSTVWX";
const DURATION = 720; // ms — a breath, not a light show
const HARD_LAND = 1400; // ms — wall-clock backstop (rAF-starved tabs)

let mounted = false;
let count = 0;

function decode(el: HTMLElement) {
  if (el.dataset.decoded === "true") return;
  el.dataset.decoded = "true";
  const original = el.textContent ?? "";
  if (!original.trim()) return;

  const chars = [...original];
  const start = performance.now();
  let raf = 0;
  let landed = false;

  const land = () => {
    if (landed) return;
    landed = true;
    cancelAnimationFrame(raf);
    el.textContent = original;
  };

  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION);
    // resolve boundary sweeps left→right; churn only to its right
    const resolved = Math.floor(t * chars.length);
    let out = "";
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i]!;
      if (i < resolved || c === " " || t >= 1) out += c;
      else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (t >= 1) land();
    else raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  setTimeout(land, HARD_LAND); // the backstop — final text, no matter what
}

export function mountDecode(scope: ParentNode = document): void {
  if (mounted && scope === document) return;
  if (scope === document) mounted = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  const els = scope.querySelectorAll<HTMLElement>("[data-decode]");
  if (!els.length) return;
  count += els.length;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          decode(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.2 },
  );
  els.forEach((el) => io.observe(el));
  window.addEventListener("pagehide", () => io.disconnect(), { once: true });

  (window as unknown as Record<string, unknown>).__DECODE = {
    count,
    fire: (el?: HTMLElement) => {
      if (el) decode(el);
      else els.forEach((e) => decode(e));
    },
  };
}
