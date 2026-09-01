(function () {
  const lenis = new Lenis({
    duration: 1.3,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  // Feed lenis into GSAP ticker so ScrollTrigger stays in sync
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Expose globally so other scripts can use it
  window._lenis = lenis;
})();
