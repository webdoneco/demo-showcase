(function () {
  gsap.registerPlugin(ScrollTrigger);

  function init() {
    // ── NAV ──
    gsap.to('#nav', { opacity: 1, duration: 0.6, delay: 0.2 });

    ScrollTrigger.create({
      start: '100px top',
      onUpdate: self => {
        document.getElementById('nav').classList.toggle('scrolled', self.progress > 0);
      },
    });

    // ── HERO ENTRANCE ──
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTL
      .to('#hLoc', { opacity: 1, y: 0, duration: 0.8, delay: 0.15 })
      .to(['#ht0', '#ht1', '#ht2'], { y: '0%', duration: 1.1, stagger: 0.1 }, '-=0.5')
      .to('#hBottom', { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .to('.hero-scroll-hint', { opacity: 1, duration: 0.8 }, '-=0.5');

    // ── HERO IMAGE PARALLAX ──
    gsap.to('.hero-img', {
      y: '15%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // ── STORY REVEALS ──
    gsap.to('.section-story .reveal-fade', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.section-story', start: 'top 75%' },
    });

    gsap.to('.section-story .reveal-up', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.section-story', start: 'top 75%' },
    });

    gsap.to('.story-right.reveal-img', {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.section-story', start: 'top 70%' },
    });

    // ── MENU REVEALS ──
    gsap.to('.menu-header .reveal-fade', {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.section-menu', start: 'top 80%' },
    });
    gsap.to('.menu-header .reveal-up', {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.section-menu', start: 'top 80%' },
    });
    gsap.to('.menu-item.reveal-item', {
      opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: '.menu-list', start: 'top 80%' },
    });

    // ── FULL BLEED PARALLAX ──
    gsap.to('.fb-img', {
      y: '12%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.full-bleed',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.to('.full-bleed .reveal-up', {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.full-bleed', start: 'top 75%' },
    });

    // ── SPACE REVEALS ──
    gsap.to('.section-space .reveal-fade', {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.section-space', start: 'top 75%' },
    });
    gsap.to('.section-space .reveal-up', {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.section-space', start: 'top 75%' },
    });
    gsap.to('.space-img-main.reveal-img', {
      opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.section-space', start: 'top 70%' },
    });
    gsap.to('.space-img-small.reveal-img', {
      opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.space-img-small', start: 'top 80%' },
    });

    // ── STATS COUNTERS ──
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].val);
            },
          });
        },
      });
    });

    gsap.to('.reveal-stat', {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: '.space-stats', start: 'top 82%' },
    });

    // ── QUOTE ──
    gsap.to('.section-quote .reveal-up', {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.section-quote', start: 'top 78%' },
    });
    gsap.to('.section-quote .reveal-fade', {
      opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.section-quote', start: 'top 78%' },
    });

    // ── RESERVE ──
    gsap.to('.reserve-img-wrap .parallax-img', {
      y: '12%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.section-reserve',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
    gsap.to('.reserve-content .reveal-fade', {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.section-reserve', start: 'top 75%' },
    });
    gsap.to('.reserve-content .reveal-up', {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.section-reserve', start: 'top 75%' },
    });

    // ── PARALLAX on story/space images ──
    document.querySelectorAll('.story-img-wrap .parallax-img, .space-img-main .parallax-img, .space-img-small .parallax-img').forEach(img => {
      gsap.to(img, {
        y: '8%',
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('div'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // ── FOOTER ──
    gsap.from('.footer-top > *', {
      opacity: 0, y: 25, duration: 0.8, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: '#footer', start: 'top 85%' },
    });
  }

  // Wait for loader to finish
  window.addEventListener('loaderDone', init);
})();
