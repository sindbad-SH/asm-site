/**
 * portal-scene-3d.ts — P1 (V1-UPGRADE-PLAN): the Portal Hero's scene as a
 * true 2.5D WebGL world. This is the new TOP TIER of the living-portrait
 * ladder, above the DOM video loop:
 *
 *   1. WebGL scene (this file) — the brand still/video as a depth-displaced
 *      plane + GPU star field + drifting foreground motes + volumetric haze,
 *      all under a camera that sways on idle and answers the cursor.
 *   2. DOM video loop            (unchanged — .portal-video-live)
 *   3. CSS overlays over still   (unchanged — .portal-life)
 *   4. still                     (unchanged — no-JS / reduced motion base)
 *
 * Contract with PortalHero.astro:
 *   - mountPortalScene() returns null whenever this tier can't run honestly
 *     (no WebGL, software rasterizer, context creation throws) — the caller
 *     then falls through to the DOM ladder, which never changed.
 *   - The canvas mounts inside [data-portal-world], so render(p)'s CSS
 *     transform (settle + scroll-recede) applies to the whole world for free.
 *   - The caller drives setActive() from the same p>0.8 / scroll gates as the
 *     old loop; nothing renders while the hero is closed or scrolled away.
 *   - On GPU context loss we dispose and hand back via onContextLost so the
 *     caller can stand the DOM tiers back up.
 *
 * Depth: public/media/home/portal-depth.png (scripts/make-portal-depth.mjs),
 * black = far sky, white = near cloud sea, blurred so displacement bends
 * instead of tearing. Amplitude stays ~1% UV — parallax, not distortion.
 *
 * Taste rules honored (memory: sindbad-visual-taste): the RENDERED VIDEO is
 * the ground truth of the living scene (rule 4) — the WebGL tier displaces
 * and atmospherizes it, never re-paints it procedurally. Idle sway keeps the
 * scene a living portrait at rest (rule 1); every motion is a slow ease, no
 * hard cuts (rule 2).
 */
import * as THREE from "three";

export interface PortalSceneOptions {
  /** [data-portal-world] — receives the canvas; CSS-transformed by render(p) */
  worldEl: HTMLElement;
  /** the eager poster still — the scene texture until the video is live */
  stillEl: HTMLImageElement;
  /** the living-painting loop; becomes the scene texture once playing */
  videoEl: HTMLVideoElement;
  depthSrc: string;
  onContextLost?: () => void;
}

export interface PortalSceneController {
  canvas: HTMLCanvasElement;
  /** run/pause the rAF loop (hero open + on-screen gates, from the caller) */
  setActive(active: boolean): void;
  /** swap the scene texture to the (now rendering) video loop */
  useVideo(): void;
  /** QA: advance time by dt and draw one frame WITHOUT rAF — deterministic
      rendering for harness tabs, mirroring the portal's render(p) contract */
  renderOnce(dt?: number): void;
  dispose(): void;
  stats(): { live: boolean; video: boolean; frames: number };
}

/* image-space constants for the 1280×720 brand scene */
const MEDIA_ASPECT = 16 / 9;
const CAM_Z = 10;
const VIEW_H = 8; // world units of viewport height at z=0
const OVERSCAN = 1.05; // plane cover margin so camera sway never shows edges
// (every point of overscan is extra upscale of the 720p source — keep minimal)

/* seeded PRNG (same shape as PortalHero's build-time stars) so the particle
   field is stable run-to-run — QA screenshots stay diffable */
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export async function mountPortalScene(opts: PortalSceneOptions): Promise<PortalSceneController | null> {
  const { worldEl, stillEl, videoEl, depthSrc, onContextLost } = opts;

  /* ── renderer, with the same honesty gate as the globe (f22e22a): a
        software rasterizer would jank, so it falls through to the DOM tiers ── */
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false, // full-screen textured quads; MSAA buys nothing here
      alpha: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: true,
    });
  } catch {
    return null;
  }
  const glCtx = renderer.getContext();
  const dbg = glCtx.getExtension("WEBGL_debug_renderer_info");
  const gpuName = dbg ? String(glCtx.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  if (/swiftshader|llvmpipe|software|basic render/i.test(gpuName)) {
    renderer.dispose();
    return null;
  }
  // full device resolution (capped at 2) — anything less reads soft next to
  // the browser's own video scaler, which is exactly the P1 regression report
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const canvas = renderer.domElement;
  canvas.className = "portal-gl";
  canvas.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera((Math.atan(VIEW_H / 2 / CAM_Z) * 2 * 180) / Math.PI, 1, 0.1, 40);
  camera.position.set(0, 0, CAM_Z);

  /* ── textures. Raw ShaderMaterials pass sRGB texels straight through to an
        sRGB framebuffer, so no colorspace conversion may be applied anywhere —
        the WebGL still must land pixel-identical to the DOM still under it. ── */
  const stillTex = new THREE.Texture(stillEl);
  stillTex.colorSpace = THREE.NoColorSpace;
  stillTex.minFilter = THREE.LinearFilter;
  stillTex.generateMipmaps = false;
  if (stillEl.complete && stillEl.naturalWidth > 0) stillTex.needsUpdate = true;
  else stillEl.addEventListener("load", () => (stillTex.needsUpdate = true), { once: true });

  const depthTex = await new Promise<THREE.Texture | null>((resolve) => {
    new THREE.TextureLoader().load(
      depthSrc,
      (t) => {
        t.colorSpace = THREE.NoColorSpace;
        t.minFilter = THREE.LinearFilter;
        t.generateMipmaps = false;
        resolve(t);
      },
      undefined,
      () => resolve(null),
    );
  });
  if (!depthTex) {
    // no depth, no tier — the DOM ladder is better than a flat WebGL copy
    renderer.dispose();
    return null;
  }

  let videoTex: THREE.VideoTexture | null = null;

  /* ── 1 · the world plane: still/video displaced by soft depth ── */
  const worldUniforms = {
    uMedia: { value: stillTex as THREE.Texture },
    uDepth: { value: depthTex },
    uOffset: { value: new THREE.Vector2(0, 0) }, // camera sway, normalized
    uAmp: { value: 0.011 }, // max UV displacement — parallax, not distortion
    uTexel: { value: new THREE.Vector2(1 / 1280, 1 / 720) }, // media texel size
    uSharp: { value: 0.5 }, // unsharp gain — counters bilinear upscale softness
  };
  const worldMat = new THREE.ShaderMaterial({
    uniforms: worldUniforms,
    depthWrite: false,
    depthTest: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMedia;
      uniform sampler2D uDepth;
      uniform vec2 uOffset;
      uniform float uAmp;
      uniform vec2 uTexel;
      uniform float uSharp;
      varying vec2 vUv;
      void main() {
        float d = texture2D(uDepth, vUv).r;
        // pivot around mid-depth so sky and foreground counter-move
        vec2 par = uOffset * uAmp * (d - 0.35);
        vec2 duv = vUv + par;
        // unsharp mask at media resolution: even the 1080p source is upscaled
        // past 1:1 on wide displays, and bilinear-only sampling reads soft —
        // this restores the edge contrast the browser's own video scaler kept
        vec3 c = texture2D(uMedia, duv).rgb;
        vec3 nb = (
          texture2D(uMedia, duv + vec2(uTexel.x, 0.0)).rgb +
          texture2D(uMedia, duv - vec2(uTexel.x, 0.0)).rgb +
          texture2D(uMedia, duv + vec2(0.0, uTexel.y)).rgb +
          texture2D(uMedia, duv - vec2(0.0, uTexel.y)).rgb
        ) * 0.25;
        gl_FragColor = vec4(clamp(c + (c - nb) * uSharp, 0.0, 1.0), 1.0);
      }`,
  });
  const worldGeo = new THREE.PlaneGeometry(MEDIA_ASPECT, 1);
  const worldMesh = new THREE.Mesh(worldGeo, worldMat);
  worldMesh.renderOrder = 0;
  scene.add(worldMesh);

  /* ── 2 · stars: sky-band only, clear of the headline column. These carry
        the SKY'S LIFE now: the 4K brand loop has beautiful but STATIC baked
        stars, so this overlay twinkles over them to restore the "alive sky"
        the old render had. Denser + deeper twinkle than the CSS field it
        replaced — one notch above minimal (taste rule 3), never a light show. ── */
  const rng = mulberry32(20260707);
  const STAR_N = 130;
  const starNorm: Array<{ u: number; v: number }> = [];
  const starPos = new Float32Array(STAR_N * 3);
  const starSize = new Float32Array(STAR_N);
  const starTw = new Float32Array(STAR_N * 3); // o0, o1, rate
  for (let i = 0; i < STAR_N; i++) {
    let u = 0.5;
    let v = 0.3;
    for (let tries = 0; tries < 14; tries++) {
      u = 0.02 + rng() * 0.96;
      v = 0.04 + rng() * 0.5; // sky band of the image only
      if (!(u > 0.33 && u < 0.67 && v > 0.24)) break; // clear the mark/headline
    }
    starNorm.push({ u, v });
    starPos[i * 3 + 2] = 0.6 + rng() * 2.2; // just in front of the plane
    // a few brighter stars among many faint — the sky reads layered, not uniform
    starSize[i] = 1.0 + rng() * rng() * 2.6;
    // deeper twinkle: min dips near-dark so some stars visibly wink; rates
    // spread wide so the field never pulses in unison
    starTw[i * 3] = 0.05 + rng() * 0.18; // o0 (dim floor)
    starTw[i * 3 + 1] = 0.6 + rng() * 0.4; // o1 (bright peak)
    starTw[i * 3 + 2] = 0.6 + rng() * 2.2; // twinkle rate
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute("aSize", new THREE.BufferAttribute(starSize, 1));
  starGeo.setAttribute("aTw", new THREE.BufferAttribute(starTw, 3));
  const starMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute vec3 aTw;
      uniform float uTime;
      uniform float uPx;
      varying float vA;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uPx * (10.0 / -mv.z);
        float tw = 0.5 + 0.5 * sin(uTime * aTw.z + aTw.x * 47.0);
        vA = mix(aTw.x, aTw.y, tw);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying float vA;
      void main() {
        float r = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.06, r) * vA;
        gl_FragColor = vec4(vec3(0.88, 0.93, 1.0) * a, a);
      }`,
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.renderOrder = 1;
  scene.add(stars);

  /* ── 3 · haze: two additive noise sheets breathing over the cloud sea ── */
  const hazeMat = (speed: number, alpha: number, seedOff: number) =>
    new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uSpeed: { value: speed }, uAlpha: { value: alpha }, uSeed: { value: seedOff } },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uSpeed;
        uniform float uAlpha;
        uniform float uSeed;
        varying vec2 vUv;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
                     mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
        }
        float fbm(vec2 p) {
          float v = 0.0, a = 0.5;
          for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
          return v;
        }
        void main() {
          vec2 p = vUv * vec2(3.2, 1.15) + vec2(uSeed + uTime * uSpeed, uSeed * 0.7);
          float n = fbm(p);
          // fade to nothing at the sheet's top and bottom — soft, never a line
          float band = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
          float a = smoothstep(0.35, 0.85, n) * band * uAlpha;
          gl_FragColor = vec4(vec3(0.62, 0.74, 0.88) * a, a);
        }`,
    });
  const hazeGeo = new THREE.PlaneGeometry(1, 1);
  const hazeA = new THREE.Mesh(hazeGeo, hazeMat(0.016, 0.16, 3.7));
  const hazeB = new THREE.Mesh(hazeGeo, hazeMat(-0.011, 0.11, 11.2));
  hazeA.renderOrder = 2;
  hazeB.renderOrder = 2;
  scene.add(hazeA, hazeB);

  /* ── 4 · foreground motes: the air in front of the world — the strongest
        cursor-parallax cue. Drift lives in the shader; zero CPU per frame ── */
  const MOTE_N = 110;
  const motePos = new Float32Array(MOTE_N * 3);
  const moteAttr = new Float32Array(MOTE_N * 4); // size, alpha, fallSpeed, phase
  for (let i = 0; i < MOTE_N; i++) {
    motePos[i * 3] = (rng() - 0.5) * 14;
    motePos[i * 3 + 1] = (rng() - 0.5) * 9;
    motePos[i * 3 + 2] = 4.5 + rng() * 3.2;
    moteAttr[i * 4] = 1.4 + rng() * 2.0;
    moteAttr[i * 4 + 1] = 0.05 + rng() * 0.1;
    moteAttr[i * 4 + 2] = 0.05 + rng() * 0.12;
    moteAttr[i * 4 + 3] = rng() * 6.28;
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
  moteGeo.setAttribute("aMote", new THREE.BufferAttribute(moteAttr, 4));
  const moteMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec4 aMote; // size, alpha, fallSpeed, phase
      uniform float uTime;
      uniform float uPx;
      varying float vA;
      void main() {
        vec3 pos = position;
        // slow fall with a lateral breath, wrapped over the field's height
        pos.y = mod(pos.y - uTime * aMote.z + 4.5, 9.0) - 4.5;
        pos.x += sin(uTime * 0.13 + aMote.w) * 0.35;
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aMote.x * uPx * (10.0 / -mv.z);
        vA = aMote.y;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying float vA;
      void main() {
        float r = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.1, r) * vA;
        gl_FragColor = vec4(vec3(0.82, 0.9, 1.0) * a, a);
      }`,
  });
  const motes = new THREE.Points(moteGeo, moteMat);
  motes.renderOrder = 3;
  scene.add(motes);

  /* ── layout: cover-fit the plane, place stars from image-space, size haze ── */
  let planeW = MEDIA_ASPECT;
  let planeH = 1;
  const layout = () => {
    const w = worldEl.clientWidth || 1;
    const h = worldEl.clientHeight || 1;
    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);

    const viewW = VIEW_H * aspect;
    const cover = Math.max(viewW / MEDIA_ASPECT, VIEW_H / 1) * OVERSCAN;
    planeW = MEDIA_ASPECT * cover;
    planeH = 1 * cover;
    worldMesh.scale.set(planeW, planeH, 1);

    // stars: normalized image coords → world coords on the plane's face
    for (let i = 0; i < STAR_N; i++) {
      starPos[i * 3] = (starNorm[i].u - 0.5) * planeW;
      starPos[i * 3 + 1] = (0.5 - starNorm[i].v) * planeH;
    }
    (starGeo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;

    // haze sheets hug the bottom quarter of the view
    hazeA.scale.set(viewW * 1.5, VIEW_H * 0.34, 1);
    hazeA.position.set(0, -VIEW_H * 0.36, 1.2);
    hazeB.scale.set(viewW * 1.6, VIEW_H * 0.28, 1);
    hazeB.position.set(0, -VIEW_H * 0.42, 2.1);
  };
  layout();
  const ro = new ResizeObserver(layout);
  ro.observe(worldEl);

  /* ── camera life: idle sway (living portrait at rest) + cursor answer ── */
  const pointer = { x: 0, y: 0 }; // normalized -1..1, lerped in the loop
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  let frames = 0;
  let active = false;
  let raf = 0;
  let disposed = false;
  // pause-aware elapsed time (THREE.Clock is deprecated; this is all we need):
  // accumulates only while active, so idle sway resumes where it left off
  let elapsed = 0;
  let lastT = 0;
  const cam = { x: 0, y: 0 };

  const step = () => {
    const t = elapsed;
    // idle drift: a slow lissajous, ~40s figure — visible within seconds,
    // never a jolt. Cursor adds on top, heavily lerped (soft, rule 2).
    const idleX = Math.sin(t * 0.16) * 0.1;
    const idleY = Math.cos(t * 0.11) * 0.06;
    const tx = idleX + pointer.x * 0.26; // stays inside the (reduced) overscan
    const ty = idleY - pointer.y * 0.16;
    cam.x += (tx - cam.x) * 0.035;
    cam.y += (ty - cam.y) * 0.035;
    camera.position.set(cam.x, cam.y, CAM_Z);
    camera.lookAt(0, 0, 0);

    worldUniforms.uOffset.value.set(cam.x, cam.y);
    starMat.uniforms.uTime.value = t;
    moteMat.uniforms.uTime.value = t;
    (hazeA.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    (hazeB.material as THREE.ShaderMaterial).uniforms.uTime.value = t;

    renderer.render(scene, camera);
    frames++;
  };

  const tick = () => {
    if (!active || disposed) return;
    raf = requestAnimationFrame(tick);
    const now = performance.now();
    elapsed += Math.min(0.1, (now - lastT) / 1000); // clamp tab-jank gaps
    lastT = now;
    step();
  };

  const setActive = (v: boolean) => {
    if (disposed || v === active) return;
    active = v;
    if (v) {
      lastT = performance.now();
      raf = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(raf);
    }
  };

  const useVideo = () => {
    if (disposed || videoTex) return;
    videoTex = new THREE.VideoTexture(videoEl);
    videoTex.colorSpace = THREE.NoColorSpace;
    videoTex.minFilter = THREE.LinearFilter;
    videoTex.generateMipmaps = false;
    worldUniforms.uMedia.value = videoTex;
    // the unsharp kernel follows the actual source resolution, so a higher-res
    // loop export (1080p/4K) is a pure file swap — no retune needed
    if (videoEl.videoWidth > 0) worldUniforms.uTexel.value.set(1 / videoEl.videoWidth, 1 / videoEl.videoHeight);
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    setActive(false);
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    [worldGeo, starGeo, hazeGeo, moteGeo].forEach((g) => g.dispose());
    [worldMat, starMat, moteMat, hazeA.material, hazeB.material].forEach((m) => (m as THREE.Material).dispose());
    [stillTex, depthTex, videoTex].forEach((tx) => tx?.dispose());
    renderer.dispose();
    canvas.remove();
  };

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    dispose();
    onContextLost?.();
  });

  worldEl.appendChild(canvas);
  // render one frame immediately so the fade-in reveals a finished scene,
  // never a black canvas (soft transitions, rule 2)
  worldUniforms.uOffset.value.set(0, 0);
  renderer.render(scene, camera);
  frames++;

  return {
    canvas,
    setActive,
    useVideo,
    renderOnce: (dt = 1 / 60) => {
      if (disposed) return;
      elapsed += dt;
      step();
    },
    dispose,
    stats: () => ({ live: !disposed, video: !!videoTex, frames }),
  };
}
