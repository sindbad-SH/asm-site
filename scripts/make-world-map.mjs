/**
 * make-world-map.mjs — bake an accurate low-poly world outline for
 * WorldMapBackdrop.astro (P19 map fix).
 *
 * WHY: the old backdrop used hand-authored coastlines, so honest lon/lat pings
 * landed on the wrong pixels (Italy in the sea, a US ping reading like Africa).
 * This script converts a real, simplified world dataset into a single SVG path
 * in the SAME equirectangular projection the component uses, so true
 * coordinates seat correctly against a true coastline.
 *
 * SOURCE (fetched once, at authoring time — NEVER at runtime):
 *   world-atlas 110m land — Natural Earth 1:110m land, packed as TopoJSON.
 *   https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json
 *   (Natural Earth is public domain.)
 *
 * PROJECTION: equirectangular. x = lon + 180, y = 90 - lat, so the artboard is
 * viewBox "0 0 360 180" and 1 unit = 1°. Antarctica is dropped (it only eats
 * bytes at the bottom edge and never carries a ping).
 *
 * OUTPUT: writes scripts/world-map-path.txt (the `d` string) and prints size +
 * a ping-seating self-check (each real territory coordinate is point-in-polygon
 * tested against the decoded land so we PROVE Italy is on Italy before baking).
 *
 * RE-RUN: `node scripts/make-world-map.mjs`. Paste the emitted `d` string into
 * WorldMapBackdrop.astro's LAND constant (kept inline; no runtime fetch).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";
const ROUND = 10; // 1 decimal place in 0–360 space (~0.1° ≈ 11 km) — plenty coarse
const DROP_LAT = -56; // drop rings that live entirely below this (Antarctica)
const SIMPLIFY_EPS = 0.28; // Douglas–Peucker tolerance in degrees (faint backdrop)
const MIN_RING_AREA = 4; // deg² — drop islands smaller than this (noise at low opacity)

// The pinged territories, at true lat/lon. These MUST land on the right
// landmass once baked — the self-check below enforces it. Kept in sync with the
// PINGS array in WorldMapBackdrop.astro. New Mexico is intentionally NOT pinged
// (operator direction: too small a trip to flag on the world map).
const PINGS = [
  { label: "Colorado (Boulder)", lat: 40.0, lon: -105.3 },
  { label: "Switzerland (Valais)", lat: 46.0, lon: 7.75 },
  { label: "Italy (Como/Trentino)", lat: 45.85, lon: 9.5 },
];

/* ── TopoJSON decode (no dependency — the format is simple) ───────────────── */
function decodeArcs(topo) {
  const { scale, translate } = topo.transform;
  return topo.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]]; // → [lon, lat]
    });
  });
}

// Stitch one ring (array of arc indices) into an absolute lon/lat point list.
function stitchRing(arcs, ring) {
  const pts = [];
  for (const idx of ring) {
    const arc = idx < 0 ? arcs[~idx].slice().reverse() : arcs[idx];
    for (let i = 0; i < arc.length; i++) {
      if (pts.length && i === 0) continue; // drop shared join vertex
      pts.push(arc[i]);
    }
  }
  return pts;
}

// Collect every ring from a land object (GeometryCollection of Polygon /
// MultiPolygon) into absolute lon/lat rings.
function ringsFromLand(arcs, land) {
  const geoms = land.type === "GeometryCollection" ? land.geometries : [land];
  const out = [];
  for (const g of geoms) {
    if (g.type === "MultiPolygon") {
      for (const polygon of g.arcs) for (const ring of polygon) out.push(stitchRing(arcs, ring));
    } else if (g.type === "Polygon") {
      for (const ring of g.arcs) out.push(stitchRing(arcs, ring));
    }
  }
  return out;
}

// Douglas–Peucker for an OPEN polyline (distinct endpoints).
function simplifyOpen(points, eps) {
  if (points.length < 3) return points;
  const keep = new Array(points.length).fill(false);
  keep[0] = keep[points.length - 1] = true;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    let maxD = -1;
    let maxI = -1;
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      const d = Math.abs((px - ax) * dy - (py - ay) * dx) / len; // perpendicular distance
      if (d > maxD) {
        maxD = d;
        maxI = i;
      }
    }
    if (maxD > eps) {
      keep[maxI] = true;
      stack.push([a, maxI], [maxI, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

// Simplify a CLOSED ring. Naive DP degenerates when the first and last points
// coincide (zero-length baseline), so split the ring at the vertex farthest
// from the start and DP each half as an open polyline.
function simplify(points, eps) {
  if (points.length < 5) return points;
  const [sx, sy] = points[0];
  let far = 0;
  let farD = -1;
  for (let i = 1; i < points.length; i++) {
    const d = Math.hypot(points[i][0] - sx, points[i][1] - sy);
    if (d > farD) {
      farD = d;
      far = i;
    }
  }
  const head = simplifyOpen(points.slice(0, far + 1), eps);
  const tail = simplifyOpen(points.slice(far), eps);
  return head.concat(tail.slice(1));
}

// Signed-area magnitude of a ring (deg²) — used to drop tiny islands.
function ringArea(ring) {
  let s = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    s += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(s / 2);
}

// Ray-casting point-in-polygon over a single ring (lon/lat space).
function pointInRing([lon, lat], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const hit = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

const topo = await fetch(SRC).then((r) => {
  if (!r.ok) throw new Error(`fetch ${SRC} → ${r.status}`);
  return r.json();
});

const arcs = decodeArcs(topo);
const rawRings = ringsFromLand(arcs, topo.objects.land);

// Build the rings that will actually ship: drop Antarctica, drop tiny islands,
// then Douglas–Peucker simplify. The ping check runs against THESE so we prove
// seating on the exact geometry the site renders, not a denser stand-in.
const bakedRings = rawRings
  .filter((ring) => !ring.every(([, lat]) => lat < DROP_LAT)) // Antarctica
  .filter((ring) => ringArea(ring) >= MIN_RING_AREA) // tiny islands
  .map((ring) => simplify(ring, SIMPLIFY_EPS))
  .filter((ring) => ring.length >= 4);

// ── ping self-check (against the BAKED lon/lat rings) ──
let allSeated = true;
console.log("Ping seating self-check (point-in-land over the baked coastline):");
for (const p of PINGS) {
  const onLand = bakedRings.some((ring) => pointInRing([p.lon, p.lat], ring));
  if (!onLand) allSeated = false;
  const x = (p.lon + 180).toFixed(1);
  const y = (90 - p.lat).toFixed(1);
  console.log(`  ${onLand ? "✓" : "✗ NOT ON LAND"}  ${p.label.padEnd(24)} lat ${p.lat} lon ${p.lon} → x=${x} y=${y}`);
}

// ── project → one SVG path ──
const r = (n) => Math.round(n * ROUND) / ROUND;
let subpaths = 0;
let d = "";
for (const ring of bakedRings) {
  let seg = "";
  let prev = "";
  for (const [lon, lat] of ring) {
    const px = r(lon + 180);
    const py = r(90 - lat);
    const token = `${px},${py}`;
    if (token === prev) continue; // collapse duplicates after rounding
    seg += seg ? ` L${token}` : `M${token}`;
    prev = token;
  }
  if (seg) {
    d += `${seg}Z`;
    subpaths++;
  }
}

const outPath = join(process.cwd(), "scripts", "world-map-path.txt");
writeFileSync(outPath, d);
console.log(`\nBaked: ${subpaths} rings, ${(d.length / 1024).toFixed(1)} KB path.`);
console.log(`Wrote ${outPath}`);
if (!allSeated) {
  console.error("\nERROR: a ping did not land on the baked landmass. Fix coordinates before baking.");
  process.exit(1);
}
