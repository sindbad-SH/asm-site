/**
 * decode-text.ts (P3) — the "decode" label effect ported into the ASM tableaux.
 *
 * A mono label reveals by SCRAMBLING its glyphs (from a surveyor-instrument
 * set of uppercase letters + digits) and RESOLVING them left-to-right over
 * ~700ms, as if a coordinate readout is locking in. Applied only to
 * mono-font labels via [data-decode], keyed to the SAME reveal moment the
 * rest of the chapter uses.
 *
 * DISCIPLINE (mirrors PortalHero.astro's fallback rigour):
 *  • Runs ONCE per element. We piggyback on the site's existing reveal grammar
 *    (the `is-revealed` class the tableaux engine adds) via a MutationObserver
 *    — no second IntersectionObserver, no competing trigger. If the element is
 *    ALREADY revealed when we mount (watchdog fired, reduced motion, fast
 *    scroll), we resolve immediately. Simplest reliable path.
 *  • WALL-CLOCK BACKSTOP: a setTimeout force-finishes the label even if rAF
 *    never ticks (a hidden/backgrounded tab starves requestAnimationFrame).
 *    The final text is always written from a stored `original`, so the real
 *    words can NEVER be permanently lost to a scramble frame.
 *  • Reduced motion → no scramble at all; the label just shows its final text.
 *  • no-JS → this never runs; the label is server-rendered with its real text
 *    (the scramble only ever writes ON TOP of already-correct DOM).
 *  • NO LAYOUT SHIFT: every scramble frame is the SAME length as the original
 *    (we only substitute glyphs in place, never add/remove characters), and
 *    the effect is applied only inside `ch`-stable mono contexts (hud-labels).
 */

// Surveyor-instrument glyph set — uppercase letters + digits, the same
// alphabet the mono HUD labels already read in. Spaces/punctuation in the
// source are held fixed (never scrambled) so the label keeps its shape.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const DURATION = 700; // ms — the resolve window (brief: ~700ms)

/** Is this character one we scramble? Letters/digits yes; spaces, ·, punctuation no. */
function isScrambleable(ch: string): boolean {
  return /[A-Za-z0-9]/.test(ch);
}

function randomGlyph(): string {
  return GLYPHS[(Math.random() * GLYPHS.length) | 0]!;
}

/**
 * Decode one element: scramble → resolve left-to-right over DURATION.
 * `reduce` skips straight to the final text (reduced motion).
 */
function decode(el: HTMLElement, reduce: boolean): void {
  if (el.dataset.decoded === "true") return; // once per element
  el.dataset.decoded = "true";

  // The real text, captured from the SERVER-RENDERED DOM. This is the single
  // source of truth we always resolve back to — the words can never be lost.
  const original = el.textContent ?? "";
  const chars = Array.from(original);

  if (reduce || original.trim() === "") {
    el.textContent = original; // no-op visually; disarms nothing else
    return;
  }

  const start = performance.now();
  let settled = false;

  // Force the true final text, exactly once. Both the rAF loop (on completion)
  // and the wall-clock backstop call this; whichever wins, the label ends
  // correct and identical either way.
  const finish = () => {
    if (settled) return;
    settled = true;
    el.textContent = original;
  };

  // WALL-CLOCK BACKSTOP — independent of rAF. If the tab is backgrounded the
  // whole time (rAF paused), this still lands the real text. +80ms slack so it
  // never pre-empts a normally-completing animation.
  const backstop = window.setTimeout(finish, DURATION + 80);

  const tick = (now: number) => {
    if (settled) return;
    const t = Math.min(1, (now - start) / DURATION);
    // resolve boundary sweeps left→right; chars left of it are locked to their
    // real glyph, chars right of it scramble. Non-scrambleable chars (spaces,
    // ·) are always shown as-is so the label keeps its structure.
    const resolvedUpTo = t * chars.length;
    let out = "";
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i]!;
      if (!isScrambleable(ch) || i < resolvedUpTo) out += ch;
      else out += randomGlyph();
    }
    el.textContent = out;

    if (t >= 1) {
      window.clearTimeout(backstop);
      finish();
    } else {
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}

/**
 * Mount the decode effect on every [data-decode] within `root` (default: the
 * document). Idempotent per element. Each label fires ONCE, keyed to the
 * moment its nearest reveal-tracked ancestor (or itself) gains `is-revealed`
 * — the same signal the tableaux engine already sets, so decode and the
 * chapter's arrival land together.
 */
export function mountDecode(root: ParentNode = document): void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const labels = root.querySelectorAll<HTMLElement>("[data-decode]");

  labels.forEach((el) => {
    if (el.dataset.decodeWired === "true") return;
    el.dataset.decodeWired = "true";

    // Reduced motion → nothing to schedule; the server text already shows.
    if (reduce) return;

    // The reveal signal lives on an ancestor (the .tableau-content that the
    // engine flips to .is-revealed), or on the element itself as a fallback.
    const tracked = el.closest<HTMLElement>(".is-revealed, [data-tableau-content]") ?? el;

    // Already revealed when we arrive (watchdog forced it, or we mounted late)
    // → decode now.
    if (tracked.classList.contains("is-revealed")) {
      decode(el, reduce);
      return;
    }

    // Otherwise watch for the reveal class to land, then decode once.
    const mo = new MutationObserver(() => {
      if (tracked.classList.contains("is-revealed")) {
        mo.disconnect();
        decode(el, reduce);
      }
    });
    mo.observe(tracked, { attributes: true, attributeFilter: ["class"] });

    // Safety net: if the reveal never comes (engine failure that the 4s
    // watchdog also can't reach for this node), resolve the text anyway well
    // after the watchdog window, so a [data-decode] label can never sit
    // permanently scrambled or blank.
    window.setTimeout(() => {
      if (el.dataset.decoded !== "true") {
        mo.disconnect();
        decode(el, reduce);
      }
    }, 5000);
  });
}
