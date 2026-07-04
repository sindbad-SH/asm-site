/**
 * Lenis smooth-scroll singleton (v1 KEEP dependency). One instance site-wide,
 * driven by a single rAF loop. Scroll-animation modules (tableaux, globe
 * handoff) call ensureSmoothScroll() and hook ScrollTrigger.update to the
 * `scroll` event so GSAP triggers stay in sync with the smoothed position.
 *
 * Lenis uses the REAL window scroll (just smoothed), so ScrollTrigger works
 * against the default scroller — no scrollerProxy needed. Disabled entirely
 * under reduced motion (returns null → native scroll).
 */
import type Lenis from "lenis";

let instance: Lenis | null = null;
let started = false;

export async function ensureSmoothScroll(): Promise<Lenis | null> {
  if (started) return instance;
  started = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  const { default: LenisCtor } = await import("lenis");
  instance = new LenisCtor({ lerp: 0.11, wheelMultiplier: 1 });

  const raf = (time: number) => {
    instance!.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  return instance;
}
