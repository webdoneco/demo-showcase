/* ═══════════════════════════════════════════════
   EMBER — main.js
   Scroll-scrubbed video hero + all animations
═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────
   GRAIN
───────────────────────────── */
(function () {
  const c   = document.getElementById('grain');
  const ctx = c.getContext('2d');
  let w, h, frame = 0;

  function resize() {
    w = c.width  = Math.floor(window.innerWidth  * 0.55);
    h = c.height = Math.floor(window.innerHeight * 0.55);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    frame++;
    if (frame % 2 === 0) {
      const img = ctx.createImageData(w, h);
      const d   = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────
   CURSOR
───────────────────────────── */
(function () {
  const dot  = document.getElementById('cd');
  const ring = document.getElementById('cc');
  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  document.querySelectorAll('a, button, .mcard, .mag').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('h'); ring.classList.add('h'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('h'); ring.classList.remove('h'); });
  });

  (function loop() {
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
})();

/* ─────────────────────────────
   LENIS SMOOTH SCROLL
───────────────────────────── */
const lenis = new Lenis({
  duration: 1.3,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothTouch: false,
});
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ─────────────────────────────
   LOADER
───────────────────────────── */
(function () {
  const loaderEl = document.getElementById('loader');
  const fillEl   = document.getElementById('ldFill');
  const pctEl    = document.getElementById('ldPct');
  const wordEl   = document.querySelector('.ld-logo span');

  gsap.to(wordEl, { y: '0%', duration: 1.1, ease: 'power3.out', delay: 0.1 });

  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 14 + 3;
    if (p >= 100) { p = 100; clearInterval(iv); }
    fillEl.style.width = p + '%';
    pctEl.textContent  = Math.round(p) + '%';
  }, 85);

  function done() {
    gsap.to(loaderEl, {
      opacity: 0, duration: 0.85, ease: 'power2.inOut',
      onComplete: () => {
        loaderEl.style.display = 'none';
        initSite();
      }
    });
  }

  if (document.readyState === 'complete') setTimeout(done, 600);
  else window.addEventListener('load', () => setTimeout(done, 500));
})();

/* ═══════════════════════════════════════════════
   SCROLL-SCRUBBED VIDEO HERO
   Strategy: load video → draw frames to canvas on scroll
═══════════════════════════════════════════════ */
function initScrollVideo() {
  const canvas  = document.getElementById('hero-canvas');
  const ctx     = canvas.getContext('2d');
  const spacer  = document.getElementById('hero-spacer');

  // ── Size canvas
  function sizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  // ── The video
  const video = document.createElement('video');
  video.src = 'https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4';
  video.crossOrigin  = 'anonymous';
  video.muted        = true;
  video.playsInline  = true;
  video.preload      = 'auto';
  // Don't autoplay — we control currentTime manually
  video.load();

  let duration    = 0;
  let isReady     = false;
  let lastT       = -1;
  let rafId       = null;

  // Draw current video frame to canvas
  function drawFrame() {
    if (!isReady) return;
    if (video.currentTime === lastT) return;
    lastT = video.currentTime;

    const vw = video.videoWidth  || canvas.width;
    const vh = video.videoHeight || canvas.height;
    const cw = canvas.width;
    const ch = canvas.height;

    // Cover-fit
    const scale = Math.max(cw / vw, ch / vh);
    const sw    = vw * scale;
    const sh    = vh * scale;
    const sx    = (cw - sw) / 2;
    const sy    = (ch - sh) / 2;

    ctx.drawImage(video, sx, sy, sw, sh);
  }

  // Seek to a specific time and draw
  function seekTo(t) {
    if (!isReady) return;
    const clamped = Math.max(0, Math.min(t, duration));
    if (Math.abs(video.currentTime - clamped) > 0.01) {
      video.currentTime = clamped;
    }
  }

  video.addEventListener('loadedmetadata', () => {
    duration = video.duration;
  });

  video.addEventListener('canplay', () => {
    isReady = true;
    video.currentTime = 0;
  });

  video.addEventListener('seeked', drawFrame);
  video.addEventListener('timeupdate', drawFrame);

  // ── Fallback: static image if video fails
  video.addEventListener('error', () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1920';
    img.onload = () => {
      isReady = true;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  });

  // ── GSAP ScrollTrigger — scrub video currentTime
  // spacer height = 500vh set in CSS
  // We scrub through 0 → video.duration as user scrolls

  ScrollTrigger.create({
    trigger: '#hero',
    start:   'top top',
    end:     'bottom top',
    scrub:   true,
    onUpdate: self => {
      if (!isReady || !duration) return;
      const targetTime = self.progress * duration;
      seekTo(targetTime);

      // Hero text fade out as video progresses
      const p = self.progress;
      gsap.set('#hero-text', { opacity: p < 0.7 ? 1 : 1 - (p - 0.7) / 0.3 });
      gsap.set('#hScroll',   { opacity: p < 0.1 ? 1 : 1 - p * 3 });
    }
  });

  // Continuous draw loop for smooth rendering
  function renderLoop() {
    drawFrame();
    rafId = requestAnimationFrame(renderLoop);
  }
  renderLoop();
}

/* ═══════════════════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll('.mag').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width  / 2;
      const dy = e.clientY - r.top  - r.height / 2;
      gsap.to(el, { x: dx * 0.28, y: dy * 0.3, duration: 0.35, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
    });
  });
}

/* ═══════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════ */
function initNav() {
  gsap.to('#nav', { opacity: 1, duration: 0.7 });
  ScrollTrigger.create({
    start: '80px top',
    onUpdate: s => {
      document.getElementById('nav').classList.toggle('sc', s.progress > 0);
    }
  });
}

/* ═══════════════════════════════════════════════
   HERO TEXT ENTRANCE
═══════════════════════════════════════════════ */
function initHeroText() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('#hTag',             { opacity: 1, y: 0, duration: 0.8, delay: 0.1 })
    .to(['#hi0','#hi1','#hi2'], { y: '0%', duration: 1.1, stagger: 0.1 }, '-=0.5')
    .to('#hSub',             { opacity: 1, y: 0, duration: 0.9 }, '-=0.65')
    .to('#hScroll',          { opacity: 1, duration: 0.8 }, '-=0.5');
}

/* ═══════════════════════════════════════════════
   PARALLAX IMAGES
═══════════════════════════════════════════════ */
function initParallax() {
  document.querySelectorAll('.pimg:not(.fb-pimg):not(.res-pimg)').forEach(img => {
    gsap.to(img, {
      y: '8%',
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.img-wrap') || img.parentElement,
        start: 'top bottom',
        end:   'bottom top',
        scrub: true
      }
    });
  });

  // Full bleed parallax
  gsap.to('.fb-pimg', {
    y: '12%', ease: 'none',
    scrollTrigger: { trigger: '#fullbleed', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  // Reserve parallax
  gsap.to('.res-pimg', {
    y: '12%', ease: 'none',
    scrollTrigger: { trigger: '#reserve', start: 'top bottom', end: 'bottom top', scrub: true }
  });
}

/* ═══════════════════════════════════════════════
   SCROLL REVEALS
═══════════════════════════════════════════════ */
function initReveals() {

  // Helper
  function reveal(targets, vars, trigger, start) {
    gsap.to(targets, {
      ...vars,
      scrollTrigger: { trigger: trigger || targets, start: start || 'top 78%' }
    });
  }

  // STORY
  reveal('.story-l .rv-f',  { opacity:1,y:0, duration:.9, stagger:.15, ease:'power3.out' }, '#story');
  reveal('.story-l .rv-u',  { opacity:1,y:0, duration:1,  ease:'power3.out' }, '#story');
  reveal('.story-r.rv-img', { opacity:1,scale:1,y:0, duration:1.1, ease:'power3.out' }, '#story', 'top 72%');

  // MENU
  reveal('.menu-hd .rv-f',  { opacity:1,y:0, duration:.9, stagger:.12, ease:'power3.out' }, '#menu');
  reveal('.menu-hd .rv-u',  { opacity:1,y:0, duration:1,  ease:'power3.out' }, '#menu');
  gsap.to('.rv-card', {
    opacity:1, y:0, duration:.75, stagger:.12, ease:'power2.out',
    scrollTrigger: { trigger: '.menu-cards', start: 'top 80%' }
  });

  // FULL BLEED
  reveal('.fb-text .rv-u', { opacity:1,y:0, duration:1, ease:'power3.out' }, '#fullbleed', 'top 75%');

  // SPACE
  reveal('.sp-right .rv-f', { opacity:1,y:0, duration:.9, stagger:.14, ease:'power3.out' }, '#space');
  reveal('.sp-right .rv-u', { opacity:1,y:0, duration:1,  ease:'power3.out' }, '#space');
  reveal('.sp-img.rv-img',  { opacity:1,scale:1,y:0, duration:1.1, ease:'power3.out' }, '#space', 'top 72%');
  reveal('.sp-img2.rv-img', { opacity:1,scale:1,y:0, duration:1,   ease:'power3.out' }, '.sp-img2');
  gsap.to('.rv-s', {
    opacity:1, y:0, duration:.7, stagger:.1, ease:'power2.out',
    scrollTrigger: { trigger: '.stats', start: 'top 82%' }
  });

  // Counters
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to({ v:0 }, {
        v: target, duration: 1.8, ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(this.targets()[0].v); }
      })
    });
  });

  // QUOTE
  reveal('#quote .rv-u',  { opacity:1,y:0, duration:1,  ease:'power3.out' }, '#quote');
  reveal('#quote .rv-f',  { opacity:1,y:0, duration:.9, delay:.2, ease:'power3.out' }, '#quote');

  // RESERVE
  reveal('.res-content .rv-f', { opacity:1,y:0, duration:.9, stagger:.14, ease:'power3.out' }, '#reserve');
  reveal('.res-content .rv-u', { opacity:1,y:0, duration:1.1, ease:'power3.out' }, '#reserve');

  // FOOTER
  gsap.from('.ft-top > *', {
    opacity:0, y:24, duration:.8, stagger:.1, ease:'power2.out',
    scrollTrigger: { trigger: 'footer', start: 'top 85%' }
  });
}

/* ═══════════════════════════════════════════════
   INIT EVERYTHING AFTER LOADER
═══════════════════════════════════════════════ */
function initSite() {
  initNav();
  initHeroText();
  initScrollVideo();
  initParallax();
  initReveals();
  initMagnetic();
}
