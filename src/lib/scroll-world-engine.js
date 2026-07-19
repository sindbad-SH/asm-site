/* ============================================================================
   scroll-world — portable scroll-scrubbed camera-flight engine
   ----------------------------------------------------------------------------
   Framework-agnostic. Vanilla JS, zero dependencies. It builds its own DOM and
   injects its own (namespaced) CSS into a container you give it, so it drops into
   plain HTML, Next.js (call from a ref/useEffect), Vue (onMounted), a server-
   rendered page, anything.

   USAGE
     mountScrollWorld(document.getElementById('world'), {
       brand: { name: 'Pearl & Co.', href: '#top' },
       diveScroll: 1.3,   // viewport-heights of scroll per dive clip
       connScroll: 0.9,   // ...per connector clip
       hint: 'scroll to fly in',
       nav: true,         // show the top section nav
       atmosphere: true,  // subtle gradient + drifting particles behind the clips
       sections: [
         { id, label, still, clip, clipMobile, accent,
           scroll: 1.6,   // optional per-section override of diveScroll — more scroll
                          // distance = a slower, longer dwell in this scene
           linger: 0.5,   // optional 0..1 — remaps time so the camera settles mid-scene
                          // (exactly where the copy peaks) and moves quicker at the
                          // edges. 0 = linear (default). Keep ≤ 0.6; 1 = full pause.
           eyebrow, title, body, tags:[…],
           cta:{ primary:{label,href}, secondary:{label,href} } }, // last section only
         …
       ],
       connectors: [clipUrl, …],          // length = sections.length - 1 (nulls allowed)
       connectorsMobile: [clipUrl, …],    // optional lighter connectors for phones (same length)

   MOBILE (the clipMobile/connectorsMobile variants are the opt-in "mobile beta";
   the rest of the phone handling below is always on)
     The engine is phone-aware out of the box: on a coarse-pointer / ≤860px viewport it
       - loads `clipMobile` / `connectorsMobile` when provided (encode these smaller +
         tighter-GOP — seek cost on a phone decoder is dominated by frames-from-keyframe,
         so a 720p, -g 4 file scrubs far smoother than the 1080p desktop master; see
         pipeline.md). Falls back to the desktop `clip` if no mobile variant is given.
       - coalesces seeks (never issues a new currentTime while the decoder is still
         `seeking`) so fast flicks can't pile up and freeze the video.
       - keeps the still as a live poster until the clip actually paints its first frame,
         and primes each video (muted play→pause) on first touch — this is what stops iOS
         from showing a blank scene before the first seek.
       - drops the drifting particles and ignores URL-bar-only resizes (no scroll jump).
     Nothing here is required — a config with only `clip`/`connectors` still works on
     phones; the mobile variants just make it lighter and smoother.

   THEME (CSS custom properties; set on the container or :root to override)
     --sw-bg         page background (match your scene bg for seamless posters)
     --sw-ink        primary text
     --sw-ink-soft   secondary text
     --sw-accent     default accent (each section overrides via its `accent`)
     --sw-font-display / --sw-font-body

   REQUIREMENTS ON YOUR ASSETS
     - clips encoded native-res, crf~20, -g 8, +faststart, no audio (see pipeline.md)
     - connectors' endpoints are the neighbouring dives' ACTUAL frames (see SKILL Step 5)
     - (optional) mobile variants at ~720p, -g 4 for smoother phone scrubbing
   The engine loads each clip as a Blob (always seekable) and scrubs currentTime; it does
   NOT depend on HTTP byte-range support.
   ========================================================================== */

function mountScrollWorld(container, config) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Phone detection. `coarse` is captured once (input type doesn't change mid-session);
  // the ≤860px query is read live via isMobile() so a desktop resize/DevTools toggle
  // switches sources and seek behaviour without a reload.
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const smallMQ = window.matchMedia('(max-width: 860px)');
  const isMobile = () => coarse || smallMQ.matches;
  const SECTIONS = config.sections || [];
  const CONNECTORS = config.connectors || [];
  const CONNECTORS_M = config.connectorsMobile || [];
  const DIVE_W = config.diveScroll || 1.3;
  const CONN_W = config.connScroll || 0.9;
  const CROSSFADE = (config.crossfade != null) ? config.crossfade : 0.12;  // seam dissolve width (vh)
  // Auto-flight: the page flies itself (rAF-driven scroll) with a control cluster.
  // Off by default (keeps the engine portable); reduced-motion always disables it.
  const AUTOFLIGHT = !!config.autoFlight && !reduce;
  const AUTOSECONDS = config.autoFlightSeconds || 105;   // ~seconds for a full forward flight at 1x
  const SKIP = (config.skip && config.skip.href) ? config.skip : null;  // persistent "enter the full site"
  const N = SECTIONS.length;
  if (!N) return;

  // --- idempotent (re)mount ---------------------------------------------------
  // HMR / a double mountScrollWorld() call on the SAME container must not stack a
  // second rAF loop or a duplicate control cluster: two autopilot loops both
  // nudging window.scrollTo integrate the flight twice per frame → the visible
  // "it super-speeds through the whole thing". Tear down any prior instance, wipe
  // the container, and scope every listener to an AbortController we can abort.
  if (container.__swDestroy) { try { container.__swDestroy(); } catch (e) {} }
  while (container.firstChild) container.removeChild(container.firstChild);
  const _ac = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  const _sig = _ac ? _ac.signal : undefined;
  const _alive = { v: true };
  container.__swDestroy = () => { _alive.v = false; if (_ac) { try { _ac.abort(); } catch (e) {} } };

  injectCSS();
  container.classList.add('sw-root');

  // ---- build the interleaved segment chain: dive0, conn0, dive1, … diveN-1 ----
  const SEGMENTS = [];
  SECTIONS.forEach((s, i) => {
    const dive = { kind: 'dive', si: i, clip: s.clip, clipM: s.clipMobile, still: s.still, accent: s.accent,
                   w: s.scroll || DIVE_W, linger: s.linger || 0 };
    SEGMENTS.push(dive);
    s._seg = dive;
    // A connector is optional: if connectors[i] is falsy, the two dives simply
    // crossfade directly (no fly-over). Lets a page complete even when a
    // connector can't be generated (e.g. a content-filter false-positive).
    if (i < N - 1 && CONNECTORS[i]) {
      SEGMENTS.push({ kind: 'conn', si: i, clip: CONNECTORS[i], clipM: CONNECTORS_M[i],
                      still: SECTIONS[i + 1].still, accent: SECTIONS[i + 1].accent, w: CONN_W });
    }
  });
  const NSEG = SEGMENTS.length;

  // ---- DOM ----
  const sky = el('div', 'sw-sky');
  if (config.atmosphere !== false) {
    sky.appendChild(el('div', 'sw-sky__grad'));
    sky.appendChild(el('div', 'sw-sky__glow'));
  }
  const particles = el('div', 'sw-particles'); sky.appendChild(particles);

  const scrollbar = el('div', 'sw-scrollbar');
  const scrollbarFill = el('span'); scrollbar.appendChild(scrollbarFill);

  const topbar = el('div', 'sw-topbar');
  if (config.brand) {
    const brand = el('a', 'sw-brand'); brand.href = (config.brand.href || '#');
    brand.appendChild(el('span', 'sw-brand__mark'));
    const nm = el('span', 'sw-brand__name'); nm.textContent = config.brand.name || ''; brand.appendChild(nm);
    topbar.appendChild(brand);
  }
  const nav = el('nav', 'sw-nav'); if (config.nav !== false) topbar.appendChild(nav);
  if (config.cta && config.cta.label) {
    const c = el('a', 'sw-topcta'); c.href = config.cta.href || '#'; c.textContent = config.cta.label;
    topbar.appendChild(c);
  }

  const stage = el('div', 'sw-stage');
  const copylayer = el('div', 'sw-copylayer');
  const route = el('div', 'sw-route');
  const hint = el('div', 'sw-hint');
  const hintText = el('span'); hintText.textContent = config.hint || 'scroll'; hint.appendChild(hintText);
  hint.appendChild(el('i'));
  const track = el('div', 'sw-track');

  [sky, scrollbar, topbar, stage, copylayer, route, hint, track].forEach(n => container.appendChild(n));

  // segment scenes
  SEGMENTS.forEach(s => {
    const scene = el('div', 'sw-scene'); scene.style.setProperty('--sw-accent', s.accent || '');
    const img = el('img', 'sw-scene__still'); img.alt = ''; img.decoding = 'async'; img.loading = 'lazy';
    if (s.still) img.src = s.still;
    scene.appendChild(img); stage.appendChild(scene);
    s.el = scene; s.img = img; s.video = null; s.hasClip = false;
    s.loading = false; s.ready = false; s.cur = 0; s.target = 0; s.visible = false;
  });

  // per-section copy / route / nav
  const copies = [], dots = [];
  SECTIONS.forEach((s, i) => {
    const c = el('article', 'sw-copy'); c.style.setProperty('--sw-accent', s.accent || '');
    c.innerHTML =
      `<span class="sw-copy__num">${pad(i + 1)} / ${pad(N)}</span>` +
      (s.eyebrow ? `<span class="sw-copy__eyebrow">${esc(s.eyebrow)}</span>` : '') +
      (s.title ? `<h2 class="sw-copy__title">${esc(s.title)}</h2>` : '') +
      (s.body ? `<p class="sw-copy__body">${esc(s.body)}</p>` : '') +
      (s.tags && s.tags.length ? `<ul class="sw-copy__tags">${s.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '') +
      (s.cta ? `<div class="sw-copy__cta">${ctaBtns(s.cta)}</div>` : '');
    copylayer.appendChild(c); copies.push(c);

    const dot = el('button', 'sw-route__dot'); dot.style.setProperty('--sw-accent', s.accent || '');
    dot.innerHTML = `<span class="sw-route__label">${esc(s.label || '')}</span><i></i>`;
    dot.addEventListener('click', () => jumpTo(i)); route.appendChild(dot); dots.push(dot);

    if (config.nav !== false) {
      const b = el('button', 'sw-nav__item'); b.textContent = s.label || '';
      b.addEventListener('click', () => jumpTo(i)); nav.appendChild(b);
    }
  });

  // ---- center-stage CTA (finale) --------------------------------------------
  // A section may declare centerCta:{label,href,at} — a single dead-center
  // button that pops in once that section's clip crosses progress `at`
  // (e.g. the forge take's mid-clip push-in to the closer angle). One global
  // element; toggled from raf() where per-frame clip progress lives.
  let centerEl = null, centerSeg = null, centerAt = 1, centerOn = false;
  SECTIONS.forEach((s, i) => {
    if (!s.centerCta || centerEl) return;
    centerAt = (s.centerCta.at == null) ? 0.5 : s.centerCta.at;
    centerEl = el('div', 'sw-centercta');
    centerEl.style.setProperty('--sw-accent', s.accent || '');
    centerEl.innerHTML = `<a class="sw-btn sw-btn--primary sw-centercta__btn" href="${esc(s.centerCta.href || '#')}">${esc(s.centerCta.label || '')}</a>`;
    container.appendChild(centerEl);
    centerSeg = SEGMENTS.find(g => g.kind === 'dive' && g.si === i) || null;
  });

  // ---- math ----
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  // Per-section dwell: monotone remap of scroll→time so the camera settles mid-scene
  // (where the copy peaks) and moves quicker near the seams. L=0 linear, L=1 full
  // mid-scene pause. f(0)=0, f(1)=1 always, so seam frames are untouched.
  const lingerEase = (x, L) => { L = clamp(L); const c = x - 0.5; return (1 - L) * x + L * (4 * c * c * c + 0.5); };
  let vh = window.innerHeight, stageX = 0, totalW = 0, activeIndex = -1, ticking = false;
  let laidOutW = window.innerWidth;   // width the current layout was computed at (see onResize)

  function layout() {
    vh = window.innerHeight;
    laidOutW = window.innerWidth;
    stageX = window.innerWidth > 860 ? 4 : 0;
    let off = 0;
    SEGMENTS.forEach(s => { s.start = off * vh; off += s.w; s.end = off * vh; });
    totalW = off;
    track.style.height = (totalW * vh + vh) + 'px';   // +1vh so the last flight completes
    read();
  }

  function jumpTo(i) {
    // A rail/nav jump is a deliberate manual takeover: stop the autopilot so the
    // smooth-scroll to the target isn't fought (or read as divergence). AUTOFLIGHT
    // is a const declared above; playing/setPlaying are in scope by click time.
    if (AUTOFLIGHT && playing) setPlaying(false);
    const seg = SECTIONS[i]._seg;
    window.scrollTo({ top: seg.start + (seg.end - seg.start) * 0.5, behavior: reduce ? 'auto' : 'smooth' });
  }

  function loadClip(s) {
    // Under prefers-reduced-motion we never load the clips at all — the stills stay up
    // and simply cross-dissolve as you scroll. No scrubbed video motion, no decode cost.
    if (reduce || s.loading || !s.clip) return;
    s.loading = true;
    // Serve the lighter mobile encode on phones when one was provided.
    const url = (isMobile() && s.clipM) ? s.clipM : s.clip;
    fetch(url).then(r => r.ok ? r.blob() : Promise.reject(new Error('404')))
      .then(blob => {
        const v = document.createElement('video');
        v.className = 'sw-scene__video';
        v.muted = true; v.playsInline = true; v.preload = 'auto';
        v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        v.src = URL.createObjectURL(blob);
        v.addEventListener('loadedmetadata', () => { s.ready = true; read(); });
        // Reveal the video (hide the still poster) only once a real frame has
        // painted — on iOS a seeked-but-never-played muted video stays blank, so
        // hiding the still on metadata alone would flash an empty scene.
        v.addEventListener('seeked', () => { s.el.classList.add('has-clip'); }, { once: true });
        v.addEventListener('loadeddata', () => { try { v.pause(); } catch (e) {} if (userReady) primeVideo(v); });
        s.el.appendChild(v); s.video = v; s.hasClip = true;
      }).catch(() => { s.loading = false; });
  }

  function read() {
    const y = window.scrollY || window.pageYOffset;
    const fade = CROSSFADE * vh;
    let ci = 0;
    for (let i = 0; i < NSEG; i++) if (y >= SEGMENTS[i].start) ci = i;

    for (let i = 0; i < NSEG; i++) {
      const s = SEGMENTS[i];
      if (y > s.start - 1.6 * vh && y < s.end + 1.6 * vh) loadClip(s);
      const local = clamp((y - s.start) / (s.end - s.start), 0, 1);
      s.target = s.linger ? lingerEase(local, s.linger) : local;
      let outside = 0;
      if (y < s.start) outside = s.start - y; else if (y > s.end) outside = y - s.end;
      const op = smooth(1 - outside / fade);
      s.el.style.opacity = op; s.visible = op > 0.001;
      s.el.style.zIndex = (i === ci) ? '120' : String(100 + Math.round(op * 10));
      if (!s.hasClip || !s.ready) {
        const sc = reduce ? 1 : 1.03 + local * 0.14;
        s.img.style.transform = `translateX(${stageX - 2}vw) scale(${sc.toFixed(3)})`;
      }
    }

    for (let i = 0; i < N; i++) {
      const seg = SECTIONS[i]._seg;
      const pr = clamp((y - seg.start) / (seg.end - seg.start), 0, 1);
      const before = y < seg.start, after = y > seg.end;
      let cop;
      if (i === 0) cop = after ? 0 : smooth(1 - pr / 0.62);            // greets on landing
      else if (i === N - 1) cop = before ? 0 : smooth(pr / 0.4);       // holds CTA at the end
      else cop = (before || after) ? 0 : smooth(1 - Math.abs(pr - 0.5) / 0.5);
      const c = copies[i];
      c.style.opacity = cop;
      c.style.transform = reduce ? 'none' : `translateY(${(0.5 - pr) * 4}vh)`;
      c.style.pointerEvents = cop > 0.5 ? 'auto' : 'none';
    }

    const cur = SEGMENTS[ci];
    const near = clamp(cur.kind === 'dive' ? cur.si
      : (((y - cur.start) / (cur.end - cur.start)) > 0.5 ? cur.si + 1 : cur.si), 0, N - 1);
    if (near !== activeIndex) {
      activeIndex = near;
      dots.forEach((d, k) => d.classList.toggle('is-active', k === near));
      nav.querySelectorAll('.sw-nav__item').forEach((n, k) => n.classList.toggle('is-active', k === near));
      container.style.setProperty('--sw-accent', SECTIONS[near].accent || '');
    }
    scrollbarFill.style.transform = `scaleX(${clamp(y / (totalW * vh))})`;
    hint.style.opacity = clamp(1 - y / (0.5 * vh));
    if (particles) particles.style.transform = `translate3d(0, ${-y * 0.05}px, 0)`;
    ticking = false;
  }

  function raf() {
    const eps = isMobile() ? 0.02 : 0.008;   // coarser seek step on phones = fewer decodes
    for (let i = 0; i < NSEG; i++) {
      const s = SEGMENTS[i];
      if (!s.hasClip || !s.ready || !s.video) continue;
      // Never queue a seek while the decoder is still resolving the last one.
      // On phones a fast flick would otherwise pile up seeks and freeze the clip;
      // cur keeps lerping, so we snap to the latest target the moment it's free.
      if (s.video.seeking) continue;
      if (!s.visible && Math.abs(s.cur - s.target) < 0.002) continue;
      s.cur += (s.target - s.cur) * (reduce ? 1 : 0.18);
      const dur = s.video.duration || 1;
      const t = clamp(s.cur, 0, 0.999) * dur;
      if (Math.abs(s.video.currentTime - t) > eps) { try { s.video.currentTime = t; } catch (e) {} }
    }
    if (centerEl && centerSeg) {
      const on = !!centerSeg.visible && centerSeg.cur >= centerAt;
      if (on !== centerOn) { centerOn = on; centerEl.classList.toggle('is-on', on); }
    }
    if (_alive.v) requestAnimationFrame(raf);
  }

  // iOS needs a user gesture before a muted video will decode/paint reliably. On the
  // first touch we prime every loaded clip (muted play→pause) so the first seek is
  // instant instead of showing a blank frame. `userReady` also makes freshly-loaded
  // clips prime themselves (see loadClip).
  let userReady = false;
  function primeVideo(v) {
    if (!isMobile() || !v) return;
    try { const p = v.play(); if (p && p.then) p.then(() => { try { v.pause(); } catch (e) {} }).catch(() => {}); }
    catch (e) {}
  }
  function onFirstGesture() {
    if (userReady) return;
    userReady = true;
    SEGMENTS.forEach(s => primeVideo(s.video));
  }
  window.addEventListener('pointerdown', onFirstGesture, { once: true, passive: true, signal: _sig });
  window.addEventListener('touchstart', onFirstGesture, { once: true, passive: true, signal: _sig });

  // Particles are a per-frame cost we can't afford alongside video scrubbing on a phone.
  seedParticles(particles, reduce || coarse);
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(read); } }, { passive: true, signal: _sig });
  // Mobile browsers fire `resize` every time the URL bar slides in/out. Re-running
  // layout() there rebuilds the track height and yanks the scroll position, so on
  // touch we ignore height-only changes and only relayout when the width actually
  // changes (rotation still comes through orientationchange). layout() records the
  // width it laid out at.
  function onResize() {
    if (coarse && window.innerWidth === laidOutW) return;
    layout();
  }
  window.addEventListener('resize', onResize, { signal: _sig });
  window.addEventListener('orientationchange', layout, { signal: _sig });
  window.addEventListener('load', layout, { signal: _sig });
  layout();
  if (_alive.v) requestAnimationFrame(raf);

  // ---- auto-flight: the page flies itself -----------------------------------
  // Integration: the whole engine already keys off window.scrollY (scroll -> read
  // -> raf scrub). So auto-flight is just "who moves the scrollbar" — a rAF loop
  // that nudges window.scrollTo. Everything downstream (scene crossfades, copy
  // pinning, route rail, video scrub) keeps working with zero changes. Any REAL
  // user scroll hands the stick back instantly and we never fight it.
  // armed  — the scrollY-divergence "user took the stick" detector is DISARMED until
  //          the flight has actually flown one frame, so a load-time scroll write
  //          (scroll restoration, anchor jump, URL-bar/viewport resize) can't trip it
  //          and silently pause before the flight ever starts.
  let playing = false, reversed = false, speedI = 1, autoPos = 0, lastTs = 0, lastSetY = null, autoStarted = false, armed = false;
  const SPEEDS = [0.5, 1, 2, 4];
  const DT_CLAMP = 0.05;   // s — cap per-frame dt so a tab-away / stall can't lurch (was 0.1)
  const DIVERGE_PX = 6;    // px — real user scroll past this hands the stick back
  const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const perfNow = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
  let flyEls = null;
  // With the page flying itself, the browser restoring a prior scroll position on
  // reload/back would fight the autopilot on the first frames — pin it to manual.
  if (AUTOFLIGHT && typeof history !== 'undefined' && 'scrollRestoration' in history) {
    try { history.scrollRestoration = 'manual'; } catch (e) {}
  }

  // Persistent "enter the full site" skip control (built regardless of auto-flight).
  if (SKIP) {
    const sk = el('a', 'sw-skip'); sk.href = SKIP.href;
    sk.innerHTML = esc(SKIP.label || 'Enter site') + ' <span class="sw-skip__arw" aria-hidden="true">→</span>';
    container.appendChild(sk);
  }

  // ---- loop wrap-around: fade to ground, jump, fade back in -------------------
  // Scroll (or fly) past the bottom and you're back at the top of the mountain;
  // scroll above the top and you drop to the finale. Both the autopilot (on
  // reaching an end) and a manual wheel/touch/scroll past an edge wrap the same
  // seamless way: a ~350ms fade-to-ground overlay hides the jump, then the scene/
  // copy/route state is rebuilt from the new scroll position by read(). A brief
  // cooldown after each wrap stops momentum from immediately wrapping again.
  const wrapFade = el('div', 'sw-wrapfade'); wrapFade.setAttribute('aria-hidden', 'true');
  container.appendChild(wrapFade);
  let wrapping = false, wrapCooldownUntil = 0;
  const WRAP_HALF = 175;   // ms per half (fade-out, then fade-in) ≈ 350ms round trip
  function doWrap(dir) {
    if (wrapping) return;
    wrapping = true;
    const jump = () => {
      const target = (dir === 'forward') ? 0 : maxScroll();
      window.scrollTo(0, target);
      // Keep the autopilot's bookkeeping in lock-step with the jump so it neither
      // detects "divergence" (see stepAuto) nor lurches on the next frame. Disarm
      // so the post-jump scroll write can't read as the user grabbing the stick;
      // stepAuto re-adopts the position and re-arms on its next frame.
      autoPos = target; lastSetY = null; lastTs = 0; armed = false;
      read();
      // Snap every segment's scrub position to its post-jump target. Without
      // this the 0.18 lerp in raf() walks each video from its OLD time to the
      // new one — after a forward wrap the gateway visibly rewinds from its
      // final frames instead of opening at frame 0.
      for (let i = 0; i < NSEG; i++) { const s = SEGMENTS[i]; s.cur = s.target; }
    };
    if (reduce) {
      // Reduced-motion: honour the wrap but skip the fade animation — jump straight.
      jump(); wrapping = false; wrapCooldownUntil = perfNow() + 700; return;
    }
    wrapFade.classList.add('is-on');
    setTimeout(() => {
      jump();
      wrapFade.classList.remove('is-on');
      setTimeout(() => { wrapping = false; wrapCooldownUntil = perfNow() + 700; }, WRAP_HALF);
    }, WRAP_HALF);
  }
  // Manual edge wrap: only fires when a gesture pushes past the very top/bottom
  // (the browser has already clamped scrollY there), and never during a cooldown.
  function edgeWrap(dir) {
    if (wrapping || perfNow() < wrapCooldownUntil) return;
    const y = window.scrollY || window.pageYOffset;
    if (dir === 'forward' && y >= maxScroll() - 2) doWrap('forward');
    else if (dir === 'backward' && y <= 2) doWrap('backward');
  }
  // Always-on (works with autopilot off, and under reduced-motion).
  window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) edgeWrap('forward'); else if (e.deltaY < 0) edgeWrap('backward');
  }, { passive: true, signal: _sig });
  let wrapTouchY = null;
  window.addEventListener('touchstart', (e) => { wrapTouchY = (e.touches && e.touches[0]) ? e.touches[0].clientY : null; }, { passive: true, signal: _sig });
  window.addEventListener('touchmove', (e) => {
    if (wrapTouchY == null || !e.touches || !e.touches[0]) return;
    const cy = e.touches[0].clientY, dy = wrapTouchY - cy; wrapTouchY = cy;
    if (dy > 1) edgeWrap('forward'); else if (dy < -1) edgeWrap('backward');
  }, { passive: true, signal: _sig });

  function setPlaying(on) {
    playing = on;
    if (on) {
      // Resume cleanly: reset the dt baseline (no huge first-frame dt → no lurch),
      // hard-sync to the real scroll position, and DISARM divergence until the
      // first flown frame so a scroll write that lands right after play (restoration,
      // the click's own focus scroll) can't immediately pause us again.
      lastTs = 0; autoPos = window.scrollY || window.pageYOffset; lastSetY = null; armed = false;
      onFirstGesture();
    }
    if (flyEls) {
      flyEls.play.textContent = on ? 'PAUSE' : 'PLAY';
      flyEls.play.setAttribute('aria-label', on ? 'Pause flight' : 'Play flight');
      flyEls.play.classList.toggle('is-active', on);
    }
  }
  function setRate(i) { speedI = clamp(i, 0, SPEEDS.length - 1); if (flyEls) flyEls.rate.textContent = SPEEDS[speedI] + '×'; }
  function setReversed(on) {
    reversed = on;
    if (flyEls) { flyEls.rev.classList.toggle('is-active', on); flyEls.rev.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  }
  // Instant hand-over: a wheel/touch drag pauses auto-flight the moment it starts.
  function handOver() { if (playing) setPlaying(false); }

  const flyT0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

  // One integration step of the autopilot. Split out of the rAF loop and made a
  // pure function of (timestamp, current scroll/state) so it can be driven with
  // SYNTHETIC timestamps for verification — headless/background panes suspend rAF,
  // so the only reliable way to prove the flight advances is to pump this directly.
  // Returns a small telemetry record for tests; also mutates the closure state.
  function stepAuto(ts) {
    if (!playing) { lastTs = 0; return { moved: 0, dt: 0, paused: 'idle' }; }
    // While a wrap fade jumps the scroll position, freeze our bookkeeping so the
    // divergence check below can't misfire on the jump.
    if (wrapping) { lastTs = 0; return { moved: 0, dt: 0, paused: 'wrapping' }; }

    const y = window.scrollY || window.pageYOffset;
    // Divergence = a REAL external scroll (scrollbar drag, PgUp/PgDn, momentum).
    // Only consult it once armed (after the flight's first frame) so a load-time /
    // resume-time scroll write can't pause the flight before it starts.
    if (armed && lastSetY != null && Math.abs(y - lastSetY) > DIVERGE_PX) {
      setPlaying(false);
      return { moved: 0, dt: 0, paused: 'diverged' };
    }

    // First flown frame (or first after a resume/wrap): adopt the real scroll
    // position and seed the dt baseline so this frame moves nothing (dt 0) — never
    // a lurch, and the browser-restored position is absorbed rather than fought.
    if (!armed || lastSetY == null) { autoPos = y; lastTs = ts; }
    if (!lastTs) lastTs = ts;
    let dt = (ts - lastTs) / 1000; lastTs = ts;
    if (!(dt > 0)) dt = 0;                 // guard NaN / non-monotonic clocks
    if (dt > DT_CLAMP) dt = DT_CLAMP;      // cap a tab-away / stall so we can't lurch

    const max = maxScroll();
    const before = autoPos;
    autoPos += (max / AUTOSECONDS) * SPEEDS[speedI] * (reversed ? -1 : 1) * dt;
    // Loop forever: reaching an end wraps to the opposite end and keeps flying.
    // Only wrap on a frame that actually integrated (dt > 0) — otherwise the adopt
    // frame at the summit (y===0) would instantly wrap to the finale.
    if (dt > 0 && autoPos <= 0) { doWrap('backward'); return { moved: autoPos - before, dt, wrap: 'backward' }; }
    if (dt > 0 && autoPos >= max) { doWrap('forward'); return { moved: autoPos - before, dt, wrap: 'forward' }; }
    window.scrollTo(0, autoPos); lastSetY = Math.round(autoPos); armed = true;
    return { moved: autoPos - before, dt, y: autoPos };
  }

  function autoTick(ts) {
    if (AUTOFLIGHT) {
      // Begin only once the first scene is ready (or a short fallback, so a failed
      // clip still auto-advances the stills).
      if (!autoStarted && (SECTIONS[0]._seg.ready || ts - flyT0 > 2500)) { autoStarted = true; setPlaying(true); }
      stepAuto(ts);
    }
    if (_alive.v) requestAnimationFrame(autoTick);
  }

  // Returning to a foregrounded tab after it was hidden: the clock jumped, so
  // reset the dt baseline and disarm — the next frame re-adopts and flies on
  // smoothly instead of lurching or reading the gap as a user grab.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && playing) { lastTs = 0; armed = false; lastSetY = null; autoPos = window.scrollY || window.pageYOffset; }
  }, { signal: _sig });

  // Debug/verification handle (headless panes suspend rAF; drive stepAuto by hand).
  const _api = {
    get state() { return { playing, reversed, speedI, autoPos, lastTs, lastSetY, armed, autoStarted, wrapping }; },
    step: (ts) => stepAuto(ts),
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    maxScroll,
    seconds: () => AUTOSECONDS,
    speeds: () => SPEEDS.slice(),
  };
  container.__scrollWorld = _api;
  if (typeof window !== 'undefined') window.__scrollWorld = _api;

  if (AUTOFLIGHT) {
    container.classList.add('sw-has-fly');
    // ⚠ OPERATOR READ-APPROVAL REQUIRED — new visible control labels (mono HUD voice):
    // PLAY / PAUSE, SLOWER (−) / FASTER (+) / rate "1×", REVERSE (REV).
    const fly = el('div', 'sw-fly'); fly.setAttribute('role', 'group'); fly.setAttribute('aria-label', 'Flight controls');
    const play = el('button', 'sw-fly__btn sw-fly__play'); play.type = 'button'; play.textContent = 'PLAY'; play.setAttribute('aria-label', 'Play flight');
    const speedWrap = el('div', 'sw-fly__speed');
    const slower = el('button', 'sw-fly__btn sw-fly__step'); slower.type = 'button'; slower.textContent = '−'; slower.setAttribute('aria-label', 'Slower');
    const rate = el('span', 'sw-fly__rate'); rate.setAttribute('aria-live', 'polite'); rate.textContent = '1×';
    const faster = el('button', 'sw-fly__btn sw-fly__step'); faster.type = 'button'; faster.textContent = '+'; faster.setAttribute('aria-label', 'Faster');
    speedWrap.append(slower, rate, faster);
    const rev = el('button', 'sw-fly__btn sw-fly__rev'); rev.type = 'button'; rev.textContent = 'REV'; rev.setAttribute('aria-label', 'Reverse flight'); rev.setAttribute('aria-pressed', 'false');
    fly.append(play, speedWrap, rev);
    container.appendChild(fly);
    flyEls = { play, rate, rev };
    requestAnimationFrame(() => fly.classList.add('is-on'));

    play.addEventListener('click', () => setPlaying(!playing));
    slower.addEventListener('click', () => setRate(speedI - 1));
    faster.addEventListener('click', () => { if (!playing) setPlaying(true); setRate(speedI + 1); });
    rev.addEventListener('click', () => { if (!playing) setPlaying(true); setReversed(!reversed); });

    window.addEventListener('wheel', handOver, { passive: true, signal: _sig });
    window.addEventListener('touchmove', handOver, { passive: true, signal: _sig });
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;   // don't hijack shortcuts
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      switch (e.key) {
        case ' ': case 'Spacebar':
          if (t && (t.tagName === 'BUTTON' || t.tagName === 'A')) return;   // let the control activate
          e.preventDefault(); setPlaying(!playing); break;
        case 'ArrowUp':    e.preventDefault(); if (!playing) setPlaying(true); setRate(speedI + 1); break;
        case 'ArrowDown':  e.preventDefault(); setRate(speedI - 1); break;
        case 'ArrowRight': e.preventDefault(); if (!playing) setPlaying(true); setReversed(false); break;
        case 'ArrowLeft':  e.preventDefault(); if (!playing) setPlaying(true); setReversed(true); break;
      }
    }, { signal: _sig });
    if (_alive.v) requestAnimationFrame(autoTick);
  }

  // ---- helpers ----
  function el(tag, cls) { const n = document.createElement(tag); if (cls) n.className = cls; return n; }
  function pad(n) { return String(n).padStart(2, '0'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function ctaBtns(cta) {
    let h = '';
    if (cta.primary) h += `<a class="sw-btn sw-btn--primary" href="${esc(cta.primary.href || '#')}">${esc(cta.primary.label)}</a>`;
    if (cta.secondary) h += `<a class="sw-btn sw-btn--ghost" href="${esc(cta.secondary.href || '#')}">${esc(cta.secondary.label)}</a>`;
    return h;
  }
}

function seedParticles(host, reduce) {
  if (!host || reduce) return;
  const kinds = ['dot', 'dot', 'ring'];
  const seeds = [7, 23, 41, 58, 71, 88, 12, 34, 52, 66, 83, 95, 18, 29, 47, 63, 77, 91, 5, 38, 55, 69, 82, 97];
  for (let k = 0; k < 20; k++) {
    const s = document.createElement('span');
    s.className = 'sw-pt sw-pt--' + kinds[k % kinds.length];
    s.style.left = seeds[k % seeds.length] + 'vw';
    s.style.top = ((seeds[(k * 3) % seeds.length] * 1.3) % 100) + 'vh';
    s.style.setProperty('--sw-sc', (0.5 + ((seeds[(k * 5) % seeds.length] % 60) / 60) * 1.1).toFixed(2));
    const dur = 14 + (seeds[(k * 7) % seeds.length] % 22);
    s.style.animationDuration = dur + 's';
    s.style.animationDelay = (-(seeds[(k * 2) % seeds.length] % dur)) + 's';
    host.appendChild(s);
  }
}

function injectCSS() {
  if (document.getElementById('sw-css')) return;
  const css = `
  .sw-root{--sw-bg:#F5EDE0;--sw-ink:#241d2b;--sw-ink-soft:#6a6072;--sw-accent:#8a7bb5;
    --sw-font-display:ui-rounded,"SF Pro Rounded","Segoe UI",system-ui,sans-serif;
    --sw-font-body:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,system-ui,sans-serif;
    color:var(--sw-ink);font-family:var(--sw-font-body);}
  html,body{margin:0;background:var(--sw-bg,#F5EDE0);overflow-x:hidden;}
  .sw-sky{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;background:var(--sw-bg);}
  .sw-sky__grad{position:absolute;inset:-10%;background:linear-gradient(178deg,color-mix(in srgb,var(--sw-accent) 12%,var(--sw-bg)) 0%,var(--sw-bg) 55%,color-mix(in srgb,var(--sw-accent) 6%,var(--sw-bg)) 100%);}
  .sw-sky__glow{position:absolute;inset:0;background:radial-gradient(60% 42% at 74% 16%,color-mix(in srgb,var(--sw-accent) 22%,transparent),transparent 70%),radial-gradient(46% 34% at 50% 50%,color-mix(in srgb,#fff 45%,transparent),transparent 70%);}
  .sw-particles{position:absolute;inset:-6% -2%;will-change:transform;}
  .sw-pt{position:absolute;width:13px;height:13px;transform:scale(var(--sw-sc,1));opacity:0;animation:sw-drift linear infinite;}
  .sw-pt::before{content:"";position:absolute;inset:0;border-radius:50%;}
  .sw-pt--dot::before{background:radial-gradient(circle at 34% 30%,color-mix(in srgb,var(--sw-accent) 60%,#000),#000 82%);}
  .sw-pt--ring::before{background:transparent;border:2px solid color-mix(in srgb,var(--sw-accent) 55%,transparent);}
  @keyframes sw-drift{0%{opacity:0;transform:scale(var(--sw-sc)) translate(0,12vh) rotate(0)}12%{opacity:.5}88%{opacity:.45}100%{opacity:0;transform:scale(var(--sw-sc)) translate(4vw,-22vh) rotate(210deg)}}
  .sw-scrollbar{position:fixed;top:0;left:0;right:0;height:3px;z-index:60;background:color-mix(in srgb,var(--sw-accent) 14%,transparent);}
  .sw-scrollbar span{display:block;height:100%;width:100%;transform-origin:0 50%;transform:scaleX(0);background:var(--sw-accent);}
  .sw-topbar{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(14px,2.4vw,26px) clamp(18px,5vw,64px);}
  .sw-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--sw-ink);}
  .sw-brand__mark{width:24px;height:28px;border-radius:7px 7px 10px 10px;background:linear-gradient(160deg,var(--sw-accent),color-mix(in srgb,var(--sw-accent) 60%,#000));box-shadow:0 6px 14px color-mix(in srgb,var(--sw-accent) 40%,transparent);}
  .sw-brand__name{font-family:var(--sw-font-display);font-weight:700;font-size:1.1rem;}
  .sw-nav{display:flex;gap:4px;padding:5px;background:color-mix(in srgb,#fff 55%,transparent);backdrop-filter:blur(10px);border:1px solid color-mix(in srgb,var(--sw-accent) 16%,transparent);border-radius:999px;}
  .sw-nav__item{font:inherit;font-size:.82rem;color:var(--sw-ink-soft);border:0;background:transparent;cursor:pointer;padding:7px 14px;border-radius:999px;transition:color .25s,background .25s;}
  .sw-nav__item:hover{color:var(--sw-ink);} .sw-nav__item.is-active{color:#fff;background:var(--sw-accent);}
  .sw-topcta{text-decoration:none;font-weight:600;font-size:.9rem;color:#fff;background:var(--sw-ink);padding:10px 20px;border-radius:999px;white-space:nowrap;}
  .sw-stage{position:fixed;inset:0;z-index:10;pointer-events:none;}
  .sw-scene{position:absolute;inset:0;opacity:0;overflow:hidden;will-change:opacity;}
  .sw-scene__video,.sw-scene__still{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 42%;}
  .sw-scene__still{will-change:transform;} .sw-scene.has-clip .sw-scene__still{opacity:0;} .sw-scene__video{z-index:1;}
  .sw-copylayer{position:fixed;inset:0;z-index:20;pointer-events:none;}
  .sw-copylayer::before{content:"";position:absolute;inset:0 0 0 auto;width:min(58vw,780px);background:linear-gradient(270deg,var(--sw-bg) 0%,color-mix(in srgb,var(--sw-bg) 82%,transparent) 34%,color-mix(in srgb,var(--sw-bg) 40%,transparent) 62%,transparent 100%);}
  .sw-copy{position:absolute;right:clamp(96px,10vw,170px);left:auto;top:clamp(84px,13vh,150px);transform:none;width:min(38vw,430px);text-align:right;opacity:0;will-change:opacity,transform;}
  .sw-copy .sw-copy__tags{justify-content:flex-end;}
  .sw-copy .sw-copy__cta{justify-content:flex-end;}
  .sw-centercta{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0;transform:translateY(14px) scale(.97);transition:opacity .5s ease,transform .5s cubic-bezier(.2,.9,.3,1.2);z-index:40;}
  .sw-centercta.is-on{opacity:1;transform:none;}
  .sw-centercta__btn{pointer-events:auto;font-size:1.15rem;padding:18px 34px;box-shadow:0 0 0 1px color-mix(in srgb,var(--sw-accent) 45%,transparent),0 12px 48px rgba(0,0,0,.55),0 0 42px color-mix(in srgb,var(--sw-accent) 35%,transparent);}
  .sw-centercta:not(.is-on) .sw-centercta__btn{visibility:hidden;}
  .sw-copy__num{font-family:ui-monospace,Menlo,monospace;font-size:.74rem;letter-spacing:.12em;color:var(--sw-ink-soft);}
  .sw-copy__eyebrow{display:block;margin-top:18px;font-family:var(--sw-font-display);font-weight:700;font-size:.8rem;letter-spacing:.16em;text-transform:uppercase;color:var(--sw-accent);}
  .sw-copy__title{font-family:var(--sw-font-display);font-weight:700;color:var(--sw-ink);font-size:clamp(2rem,4.4vw,3.5rem);line-height:1.03;margin:12px 0 0;letter-spacing:-.01em;text-shadow:0 2px 20px color-mix(in srgb,var(--sw-bg) 70%,transparent);}
  .sw-copy__body{margin-top:18px;font-size:clamp(1rem,1.25vw,1.14rem);line-height:1.55;color:color-mix(in srgb,var(--sw-ink) 78%,var(--sw-ink-soft));max-width:40ch;text-shadow:0 1px 12px color-mix(in srgb,var(--sw-bg) 90%,transparent);}
  .sw-copy__tags{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 0;padding:0;}
  .sw-copy__tags li{font-size:.82rem;font-weight:600;color:color-mix(in srgb,var(--sw-accent) 70%,#000);padding:7px 14px;border-radius:999px;background:color-mix(in srgb,var(--sw-accent) 14%,#fff);border:1px solid color-mix(in srgb,var(--sw-accent) 30%,transparent);}
  .sw-copy__cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px;pointer-events:auto;}
  .sw-btn{text-decoration:none;font-weight:600;font-size:.95rem;padding:13px 24px;border-radius:999px;transition:transform .2s;}
  .sw-btn--primary{color:#fff;background:var(--sw-ink);} .sw-btn--primary:hover{transform:translateY(-2px);}
  .sw-btn--ghost{color:var(--sw-ink);border:1.5px solid color-mix(in srgb,var(--sw-ink) 25%,transparent);} .sw-btn--ghost:hover{transform:translateY(-2px);}
  .sw-route{position:fixed;right:clamp(14px,2.4vw,30px);top:50%;z-index:40;transform:translateY(-50%);display:flex;flex-direction:column;gap:22px;padding:18px 10px;}
  .sw-route::before{content:"";position:absolute;left:50%;top:22px;bottom:22px;width:2px;transform:translateX(-50%);background:var(--sw-accent);opacity:.28;}
  .sw-route__dot{position:relative;border:0;background:transparent;cursor:pointer;width:14px;height:14px;display:grid;place-items:center;}
  .sw-route__dot i{width:9px;height:9px;border-radius:50%;background:color-mix(in srgb,var(--sw-accent) 40%,transparent);transition:transform .3s,background .3s,box-shadow .3s;}
  .sw-route__dot:hover i{transform:scale(1.25);background:var(--sw-accent);}
  .sw-route__dot.is-active i{background:var(--sw-accent);transform:scale(1.4);box-shadow:0 0 0 5px color-mix(in srgb,var(--sw-accent) 22%,transparent);}
  .sw-route__label{position:absolute;right:24px;top:50%;transform:translateY(-50%) translateX(6px);white-space:nowrap;font-size:.78rem;font-weight:600;color:var(--sw-ink);background:color-mix(in srgb,#fff 85%,transparent);backdrop-filter:blur(6px);padding:5px 11px;border-radius:999px;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;border:1px solid color-mix(in srgb,var(--sw-accent) 14%,transparent);}
  .sw-route__dot:hover .sw-route__label,.sw-route__dot.is-active .sw-route__label{opacity:1;transform:translateY(-50%) translateX(0);}
  .sw-hint{position:fixed;left:50%;bottom:26px;z-index:30;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;color:var(--sw-ink-soft);transition:opacity .3s;}
  .sw-hint i{width:22px;height:34px;border-radius:12px;border:2px solid color-mix(in srgb,var(--sw-ink) 28%,transparent);position:relative;}
  .sw-hint i::after{content:"";position:absolute;left:50%;top:7px;width:4px;height:7px;border-radius:2px;background:var(--sw-accent);transform:translateX(-50%);animation:sw-wheel 1.7s ease-in-out infinite;}
  @keyframes sw-wheel{0%{opacity:0;top:6px}40%{opacity:1}100%{opacity:0;top:17px}}
  .sw-track{position:relative;z-index:1;width:100%;pointer-events:none;}
  @media (max-width:860px){
    .sw-nav{display:none;}
    .sw-copylayer::before{width:100%;height:60%;top:auto;bottom:0;background:linear-gradient(0deg,var(--sw-bg) 8%,color-mix(in srgb,var(--sw-bg) 70%,transparent) 46%,transparent 100%);}
    /* Anchor copy to the bottom, clear of the home indicator / collapsing URL bar.
       dvh + env() are progressive: browsers that lack them keep the vh fallback line. */
    .sw-copy{left:clamp(18px,5vw,64px);right:clamp(18px,5vw,64px);top:auto;bottom:clamp(64px,14vh,120px);transform:none;width:auto;max-width:560px;}
    .sw-copy{bottom:calc(clamp(56px,12dvh,110px) + env(safe-area-inset-bottom));}
    .sw-copy__title{font-size:clamp(1.9rem,7.5vw,2.7rem);}
    .sw-copy__body{max-width:none;font-size:clamp(.98rem,3.6vw,1.1rem);} .sw-scene__video,.sw-scene__still{object-position:center 46%;}
    .sw-hint{bottom:calc(20px + env(safe-area-inset-bottom));}
    .sw-route{gap:16px;right:6px;} .sw-route__label{display:none;}
  }
  /* Portrait phones crop a 16:9 clip hard; keep the framing centred so the focal
     subject (which the camera dives toward) stays in view. */
  @media (max-width:860px) and (orientation:portrait){
    .sw-scene__video,.sw-scene__still{object-position:center 44%;}
  }
  /* Touch: give the route dots a finger-sized hit area without growing the visible dot. */
  @media (hover:none) and (pointer:coarse){
    .sw-route{padding:14px 6px;}
    .sw-route__dot{width:28px;height:28px;}
    .sw-btn{padding:15px 26px;}
  }
  @media (prefers-reduced-motion:reduce){ .sw-hint i::after{animation:none;} .sw-pt{display:none;} }
  /* --- loop wrap-around: full-bleed fade-to-ground during the seam jump --- */
  .sw-wrapfade{position:fixed;inset:0;z-index:65;background:var(--sw-bg);opacity:0;pointer-events:none;transition:opacity .175s ease;}
  .sw-wrapfade.is-on{opacity:1;}
  /* --- auto-flight chrome: skip link + control cluster (mono HUD voice) --- */
  .sw-skip{position:fixed;z-index:55;top:calc(env(safe-area-inset-top,0px) + clamp(14px,2.4vw,26px));right:clamp(16px,5vw,64px);
    display:inline-flex;align-items:center;gap:.5em;min-height:40px;padding:0 14px;text-decoration:none;
    font-family:var(--sw-font-mono,var(--font-mono,ui-monospace,monospace));font-size:.7rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
    color:var(--sw-ink-soft);border:1px solid color-mix(in srgb,var(--sw-ink) 24%,transparent);border-radius:2px;
    background:color-mix(in srgb,var(--sw-bg) 42%,transparent);backdrop-filter:blur(8px);
    clip-path:polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%);transition:color .25s,border-color .25s;}
  .sw-skip:hover,.sw-skip:focus-visible{color:var(--sw-accent);border-color:color-mix(in srgb,var(--sw-accent) 60%,transparent);outline:none;}
  .sw-skip__arw{transition:transform .25s;} .sw-skip:hover .sw-skip__arw{transform:translateX(3px);}
  .sw-fly{position:fixed;z-index:56;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);transform:translateX(-50%);
    display:flex;align-items:stretch;gap:8px;padding:8px;border-radius:4px;
    font-family:var(--sw-font-mono,var(--font-mono,ui-monospace,monospace));
    background:color-mix(in srgb,var(--sw-bg) 60%,transparent);backdrop-filter:blur(12px) saturate(1.1);
    border:1px solid color-mix(in srgb,var(--sw-ink) 16%,transparent);
    opacity:0;transition:opacity .45s var(--ease-survey,ease);}
  .sw-fly.is-on{opacity:1;}
  .sw-fly__btn{appearance:none;font:inherit;font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
    min-height:44px;min-width:44px;padding:0 14px;cursor:pointer;color:var(--sw-ink);background:transparent;
    border:1px solid color-mix(in srgb,var(--sw-ink) 24%,transparent);border-radius:2px;
    clip-path:polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%);
    display:inline-flex;align-items:center;justify-content:center;transition:color .2s,border-color .2s,background .2s;}
  .sw-fly__btn:hover,.sw-fly__btn:focus-visible{color:var(--sw-accent);border-color:color-mix(in srgb,var(--sw-accent) 60%,transparent);outline:none;}
  .sw-fly__btn.is-active{color:var(--sw-accent);border-color:color-mix(in srgb,var(--sw-accent) 70%,transparent);background:color-mix(in srgb,var(--sw-accent) 12%,transparent);}
  .sw-fly__step{font-size:1rem;padding:0 10px;}
  .sw-fly__play{min-width:70px;}
  .sw-fly__speed{display:flex;align-items:center;gap:4px;}
  .sw-fly__rate{min-width:3ch;text-align:center;font-size:.72rem;font-weight:700;letter-spacing:.06em;color:var(--sw-ink-soft);}
  /* Keep the bottom-anchored copy + hint clear of the control cluster. */
  .sw-root.sw-has-fly .sw-hint{bottom:calc(env(safe-area-inset-bottom,0px) + 96px);}
  @media (max-width:860px){
    .sw-fly{bottom:calc(env(safe-area-inset-bottom,0px) + 14px);gap:6px;padding:6px;}
    .sw-fly__btn{padding:0 11px;}
    .sw-root.sw-has-fly .sw-copy{bottom:calc(clamp(92px,20dvh,150px) + env(safe-area-inset-bottom,0px));}
    .sw-root.sw-has-fly .sw-hint{bottom:calc(env(safe-area-inset-bottom,0px) + 84px);}
  }
  `;
  // Wrap in a cascade layer so the page's own theme tokens (unlayered
  // :root / .sw-root { --sw-bg / --sw-ink / --sw-accent … }) always win over
  // these defaults, regardless of injection order. Enables clean dark themes.
  const style = document.createElement('style'); style.id = 'sw-css';
  style.textContent = '@layer sw {\n' + css + '\n}';
  document.head.appendChild(style);
}

// Expose for module + global use.
if (typeof module !== 'undefined' && module.exports) module.exports = { mountScrollWorld };
if (typeof window !== 'undefined') window.mountScrollWorld = mountScrollWorld;

export { mountScrollWorld };
