/**
 * Masked-line headline splitter (§3.3 motion grammar). Wraps each visual line
 * of an element's text in `.line-mask > span` so the design-system CSS can
 * rise each line out of its mask, staggered. Measures real line breaks at the
 * element's current width, so it must run AFTER fonts are ready.
 *
 * Idempotent + accessible: the element's text content is preserved (screen
 * readers read the same words); re-running is a no-op. Under no-JS / reduced
 * motion this never runs and the plain heading shows (CSS handles that).
 */
export function splitLines(el: HTMLElement): void {
  if (el.dataset.split === "true") return;

  const original = (el.textContent ?? "").trim();
  if (!original) return;

  // 1. lay out each word as an inline-block so we can read its line via offsetTop
  const words = original.split(/\s+/);
  el.textContent = "";
  const wordEls = words.map((word, i) => {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.textContent = word;
    el.append(span);
    if (i < words.length - 1) el.append(document.createTextNode(" "));
    return span;
  });

  // 2. group words into lines by vertical position
  const lines: string[][] = [];
  let lastTop: number | null = null;
  for (const span of wordEls) {
    const top = span.offsetTop;
    if (lastTop === null || Math.abs(top - lastTop) > 2) {
      lines.push([]);
      lastTop = top;
    }
    lines[lines.length - 1]!.push(span.textContent ?? "");
  }

  // 3. rebuild as masked lines with a per-line reveal stagger
  el.textContent = "";
  lines.forEach((line, idx) => {
    const mask = document.createElement("span");
    mask.className = "line-mask";
    const inner = document.createElement("span");
    inner.style.setProperty("--reveal-delay", `${idx * 90}ms`); // V-5: line-rise stagger on the 40/55/70/90 site scale (top step)
    inner.textContent = line.join(" ");
    mask.append(inner);
    el.append(mask);
  });

  el.classList.add("is-split");
  el.dataset.split = "true";
}
