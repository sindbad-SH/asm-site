/**
 * Orthographic projection for globe pins — shared by the server-rendered
 * poster (GlobeHero.astro frontmatter) and the client hover-card layer, so
 * static and live pin positions come from one formula and cannot drift.
 *
 * Matches cobe v2's convention (from its source: a marker's longitude enters
 * the shader as `lng·π/180 − π`, and the community-standard centering helper
 * is `phi = 3π/2 − lng·DEG`): a pin at longitude `lng` is front-and-center
 * when `phi === facingPhi(lng)`. Verified visually against the marker dots
 * cobe itself draws — the ground truth for alignment.
 *
 * Output is in unit stage coords (+x right, +y up): screen-x = cx + x·r,
 * screen-y = cy − y·r.
 */

export const DEG = Math.PI / 180;

/** The `phi` at which a longitude faces the camera dead-center. */
export function facingPhi(lng: number): number {
  return 1.5 * Math.PI - lng * DEG;
}

export type ProjectedPin = {
  x: number;
  y: number;
  /** true when the pin is on the camera-facing hemisphere */
  front: boolean;
  /** 0..1 depth cue (1 = nearest) for scaling markers */
  depth: number;
};

export function projectPin(lat: number, lng: number, phi: number, theta: number): ProjectedPin {
  const la = lat * DEG;
  // offset from the camera-facing meridian (0 = centered)
  const a = phi - facingPhi(lng);

  const x0 = Math.cos(la) * Math.sin(a);
  const y0 = Math.sin(la);
  const z0 = Math.cos(la) * Math.cos(a);

  // camera tilt around the x axis (positive theta looks down from the north)
  const y = y0 * Math.cos(theta) - z0 * Math.sin(theta);
  const z = y0 * Math.sin(theta) + z0 * Math.cos(theta);

  return {
    x: x0,
    y,
    front: z > 0.12,
    depth: (z + 1) / 2,
  };
}

/** Shortest-path angular difference for smooth rotate-to-pin easing. */
export function angleDelta(from: number, to: number): number {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}
