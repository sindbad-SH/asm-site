/**
 * 14islands-style hover-distortion engine (BUILD-PLAN.md §2e) — ambient
 * texture for media tiles, never text, never site-wide. ONE fixed WebGL
 * canvas (OGL) overlays the viewport; each participating tile gets a plane
 * synced to its DOM rect every frame. A displacement/ripple shader responds
 * to hover position + smoothed scroll velocity.
 *
 * Textures come from what the page already loaded (§2e "no double download"):
 *   - a tile containing an <img> uses that image directly (Phase 6 media);
 *   - today's annotated placeholders get a procedural "survey field" texture
 *     drawn from the tile's own computed ground color + contour linework —
 *     lane-aware for free (adventure tiles pick up the violet-slate ground).
 *
 * The DOM stays authoritative: the tile's label text is lifted above the
 *  canvas (CSS .is-distorted rules), only the media SURFACE is replaced.
 * This module is dynamically imported by DistortionLayer.astro only after
 * feature gates pass and a grid approaches the viewport — the CSS hover
 * fallback is the default until then.
 */
import { Renderer, Camera, Transform, Plane, Mesh, Program, Texture } from "ogl";
import type { OGLRenderingContext } from "ogl";

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tMap;
uniform vec2 uHover;
uniform float uStrength;
uniform float uVel;
uniform float uTime;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;

  // scroll-velocity wave — the whole surface breathes with the scroll (LP-3: up a notch)
  uv.x += sin(uv.y * 5.0 + uTime * 0.8) * uVel * 0.037;
  uv.y += sin(uv.x * 3.0) * uVel * 0.015;

  // hover ripple — rings emanate from the pointer, eased by uStrength (LP-3: stronger)
  float d = distance(uv, uHover);
  float fall = smoothstep(0.6, 0.0, d);
  float ripple = sin(d * 26.0 - uTime * 3.4) * 0.015;
  uv += normalize(uv - uHover + 1e-4) * ripple * fall * uStrength * 2.35;

  vec3 color = texture2D(tMap, uv).rgb;
  color *= 1.0 + 0.09 * uStrength * fall; // brightness lift (LP-3: was 0.07)
  gl_FragColor = vec4(color, 1.0);
}
`;

type TileState = {
  inset: HTMLElement;
  media: HTMLElement;
  mesh: InstanceType<typeof Mesh>;
  uniforms: {
    uHover: { value: [number, number] };
    uStrength: { value: number };
    uVel: { value: number };
    uTime: { value: number };
  };
  target: number;
};

function proceduralTexture(gl: OGLRenderingContext, inset: HTMLElement, media: HTMLElement) {
  const w = 512;
  const aspect = media.clientHeight / Math.max(media.clientWidth, 1) || 1.25;
  const h = Math.round(w * aspect);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d")!;

  // ground = the tile's real computed background (lane-aware: elevated on
  // /work, violet-slate inside data-lane="adventure")
  const bg = getComputedStyle(inset).backgroundColor;
  x.fillStyle = bg && bg !== "rgba(0, 0, 0, 0)" ? bg : "#1c2530";
  x.fillRect(0, 0, w, h);

  // contour linework in the peak voice, two survey centres
  x.strokeStyle = "rgba(201, 214, 218, 0.07)";
  x.lineWidth = 1.5;
  for (const [cx, cy] of [
    [w * 0.28, h * 0.22],
    [w * 0.8, h * 0.86],
  ] as const) {
    for (let r = 26; r < w * 1.1; r += 34) {
      x.beginPath();
      x.arc(cx, cy, r, 0, Math.PI * 2);
      x.stroke();
    }
  }

  // gentle vignette so the frame reads as depth, not a flat fill
  const g = x.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.85);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(10,13,18,0.5)");
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);

  return new Texture(gl, { image: c, generateMipmaps: false });
}

export function initDistortion(grids: HTMLElement[]): void {
  const insets = grids.flatMap((g) => [...g.querySelectorAll<HTMLElement>(".map-inset")]);
  if (!insets.length) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const renderer = new Renderer({ dpr, alpha: true, antialias: false });
  const gl = renderer.gl;
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.style.cssText = "position:fixed;inset:0;z-index:5;pointer-events:none;";
  document.body.appendChild(canvas);

  const camera = new Camera(gl);
  camera.position.z = 1;
  const scene = new Transform();
  const geometry = new Plane(gl);

  let W = 0;
  let H = 0;
  let rectsDirty = true; // re-measure tile rects on the next frame
  const resize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    renderer.setSize(W, H);
    camera.orthographic({ left: -W / 2, right: W / 2, top: H / 2, bottom: -H / 2, near: 0.1, far: 100 });
    rectsDirty = true;
  };
  resize();
  window.addEventListener("resize", resize);

  const tiles: TileState[] = insets.map((inset) => {
    const img = inset.querySelector<HTMLImageElement>("img");
    const media = img ?? inset.querySelector<HTMLElement>(":scope > div") ?? inset;

    let texture: InstanceType<typeof Texture>;
    if (img) {
      texture = new Texture(gl, { generateMipmaps: false });
      const assign = () => {
        texture.image = img;
        rectsDirty = true; // a late-loading image can change the tile's box
      };
      img.complete && img.naturalWidth > 0 ? assign() : img.addEventListener("load", assign, { once: true });
    } else {
      texture = proceduralTexture(gl, inset, media);
    }

    const uniforms = {
      tMap: { value: texture },
      uHover: { value: [0.5, 0.5] as [number, number] },
      uStrength: { value: 0 },
      uVel: { value: 0 },
      uTime: { value: 0 },
    };
    const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms });
    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    const state: TileState = { inset, media, mesh, uniforms, target: 0 };

    inset.addEventListener("pointerenter", () => (state.target = 1));
    inset.addEventListener("pointerleave", () => (state.target = 0));
    inset.addEventListener("pointermove", (e) => {
      const r = media.getBoundingClientRect();
      uniforms.uHover.value = [
        Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1),
        1 - Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1),
      ];
    });

    return state;
  });

  // smoothed scroll velocity feeds the wave uniform
  let lastY = window.scrollY;
  let vel = 0;

  // Tile DOM rects only move on scroll, resize, or a layout shift — measuring
  // every tile every frame forces a reflow per tile and scales with the gallery
  // (the media guide points toward 20–40 photos). Cache them and re-measure only
  // when one of those fires; a rare non-scroll shift self-heals on the next
  // scroll/frame, and the effect is ambient (text is lifted above via CSS).
  const rects: DOMRect[] = [];
  const measure = () => {
    for (let k = 0; k < tiles.length; k++) rects[k] = tiles[k]!.media.getBoundingClientRect();
    rectsDirty = false;
  };

  const step = (now: number) => {
    const t = now * 0.001;
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;
    vel += (Math.max(-1, Math.min(1, dy * 0.05)) - vel) * 0.12;

    if (rectsDirty || dy !== 0) measure();

    for (let k = 0; k < tiles.length; k++) {
      const tile = tiles[k]!;
      const r = rects[k]!;
      const off = r.bottom < -40 || r.top > H + 40 || r.width === 0;
      tile.mesh.visible = !off;
      if (off) continue;
      tile.mesh.position.set(r.left + r.width / 2 - W / 2, H / 2 - (r.top + r.height / 2), 0);
      tile.mesh.scale.set(r.width, r.height, 1);
      tile.uniforms.uStrength.value += (tile.target - tile.uniforms.uStrength.value) * 0.08;
      tile.uniforms.uVel.value = vel;
      tile.uniforms.uTime.value = t;
    }
    renderer.render({ scene, camera });
  };

  // loop runs only while a grid is on-screen (rAF also stops in hidden tabs)
  let rafId = 0;
  let running = false;
  const loop = (now: number) => {
    step(now);
    rafId = requestAnimationFrame(loop);
  };
  const start = () => {
    if (!running) {
      running = true;
      rectsDirty = true; // layout may have shifted while the grid was off-screen
      rafId = requestAnimationFrame(loop);
    }
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };
  const io = new IntersectionObserver(
    (entries) => (entries.some((e) => e.isIntersecting) ? start() : stop()),
    { rootMargin: "120px" },
  );
  grids.forEach((g) => io.observe(g));

  // synchronous first paint (never wait on the rAF loop or a hidden tab),
  // then hand the media surface to WebGL
  step(performance.now());
  grids.forEach((g) => g.classList.add("distort-on"));
  insets.forEach((inset) => inset.classList.add("is-distorted"));
  start();

  window.addEventListener(
    "pagehide",
    () => {
      stop();
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    },
    { once: true },
  );

  // QA/debug surface (harness tabs pause rAF; step() lets checks advance frames)
  (window as unknown as Record<string, unknown>).__DISTORT = {
    tiles: tiles.length,
    step: () => step(performance.now()),
    strengths: () => tiles.map((t) => Number(t.uniforms.uStrength.value.toFixed(3))),
    targets: () => tiles.map((t) => t.target),
  };
}
