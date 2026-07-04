/**
 * Scroll-scrubbed frame-sequence engine (BUILD-PLAN.md §2c / §4) — the Apple
 * product-page technique. A canvas draws pre-decoded frames keyed to
 * ScrollTrigger scrub progress; the poster shows until frame 0 is ready.
 *
 * Off-thread decode: frames are fetched as blobs and decoded via
 * createImageBitmap (which decodes off the main thread), so scrubbing never
 * blocks on decode. Frames not yet decoded fall back to the nearest decoded
 * neighbour, so the scrub stays smooth while the sequence streams in.
 *
 * Budget enforcement (§4, hard):
 *   - ≤ 96 frames        (extra ignored; the component also clamps at build)
 *   - ≤ 2.5 MB / sequence (fetch stops once exceeded — nearest() covers the tail)
 *   - ≤ 2 sequences / page (excess left as poster; counter is per page load)
 *
 * Lazily imported by ScrubSequence.astro only after the scene approaches the
 * viewport (the §4 lazy boundary) and only when motion is allowed.
 */
import { ensureSmoothScroll } from "./smooth-scroll";

const MAX_FRAMES = 96;
const MAX_BYTES = 2.5 * 1024 * 1024;
const MAX_PER_PAGE = 2;
let activeCount = 0;

export interface ScrubOptions {
  frames: string[];
  scrollVh: number; // scroll distance (in vh) for one full playthrough
}

export async function initScrub(root: HTMLElement, opts: ScrubOptions): Promise<void> {
  if (activeCount >= MAX_PER_PAGE) {
    console.warn(`[scrub] max ${MAX_PER_PAGE} sequences/page — extra left as poster (§4).`);
    return;
  }
  activeCount++;

  const canvas = root.querySelector<HTMLCanvasElement>("[data-scrub-canvas]");
  const poster = root.querySelector<HTMLElement>("[data-scrub-poster]");
  const sticky = root.querySelector<HTMLElement>("[data-scrub-sticky]");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !sticky || !ctx) return;

  const frameUrls = opts.frames.slice(0, MAX_FRAMES);
  const bitmaps: (ImageBitmap | null)[] = new Array(frameUrls.length).fill(null);
  let decodedCount = 0;
  let bytes = 0;
  let posterHidden = false;
  let currentIndex = -1;

  const hidePoster = () => {
    if (posterHidden) return;
    posterHidden = true;
    canvas.classList.add("is-ready");
    poster?.classList.add("is-hidden");
  };

  // nearest already-decoded frame to index i (keeps scrub smooth while streaming)
  const nearest = (i: number): ImageBitmap | null => {
    if (bitmaps[i]) return bitmaps[i];
    for (let d = 1; d < bitmaps.length; d++) {
      if (bitmaps[i - d]) return bitmaps[i - d]!;
      if (bitmaps[i + d]) return bitmaps[i + d]!;
    }
    return null;
  };

  // `force` re-draws the current index even when it hasn't changed — used to
  // swap a blurry nearest-neighbour for the exact frame once it finishes
  // decoding (the scrub path passes force=false to skip redundant redraws).
  const draw = (i: number, force = false) => {
    const idx = Math.max(0, Math.min(frameUrls.length - 1, i));
    const bmp = nearest(idx);
    if (!bmp) return;
    if (idx === currentIndex && posterHidden && !force) return;
    currentIndex = idx;
    if (canvas.width !== bmp.width || canvas.height !== bmp.height) {
      canvas.width = bmp.width; // intrinsic size from the real frame
      canvas.height = bmp.height;
    }
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    hidePoster();
  };

  // off-thread decode, in order, budget-capped
  const decodeAll = async () => {
    for (let i = 0; i < frameUrls.length; i++) {
      try {
        const res = await fetch(frameUrls[i]!);
        if (!res.ok) continue;
        const blob = await res.blob();
        bytes += blob.size;
        // Always admit frame 0 (a permanent poster is worse than one heavy
        // frame); enforce the byte cap on every frame after it. i>0 is the
        // explicit form — the old decodedCount>0 also let frame 1 bypass if
        // frame 0's fetch had failed.
        if (bytes > MAX_BYTES && i > 0) {
          console.warn(
            `[scrub] ${(bytes / 1e6).toFixed(1)}MB exceeds ${(MAX_BYTES / 1e6).toFixed(1)}MB budget — stopped at frame ${i} (§4).`,
          );
          break;
        }
        bitmaps[i] = await createImageBitmap(blob); // decode off the main thread
        decodedCount++;
        if (posterHidden) draw(currentIndex, true); // refine the shown frame as its exact bitmap arrives
        else if (i === 0) draw(0); // poster-first handover the moment frame 0 lands
      } catch {
        /* skip a bad frame; nearest() bridges the gap */
      }
    }
  };
  void decodeAll();

  // ScrollTrigger scrub (shares the site's GSAP + Lenis singletons)
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  const lenis = await ensureSmoothScroll();
  if (lenis) lenis.on("scroll", () => ScrollTrigger.update());

  const proxy = { i: 0 };
  const last = Math.max(0, frameUrls.length - 1);
  gsap.to(proxy, {
    i: last,
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: `+=${opts.scrollVh}%`,
      pin: sticky,
      scrub: true,
      onUpdate: () => draw(Math.round(proxy.i)),
      onRefresh: () => draw(Math.round(proxy.i)),
    },
  });

  window.addEventListener(
    "pagehide",
    () => bitmaps.forEach((b) => b?.close()),
    { once: true },
  );

  // QA hook — the harness starves rAF/IO in a hidden tab; draw() is deterministic
  (window as unknown as Record<string, unknown>).__SCRUB = {
    frames: frameUrls.length,
    decoded: () => decodedCount,
    posterHidden: () => posterHidden,
    index: () => currentIndex,
    seek: (p: number) => draw(Math.round(p * last)), // p in 0..1
  };
}
