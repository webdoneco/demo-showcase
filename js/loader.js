(function () {
  const loaderEl = document.getElementById('loader');
  const fillEl   = document.getElementById('lp');
  const wordEl   = document.querySelector('.lw-row span');

  let progress = 0;

  // Word reveal
  gsap.to(wordEl, {
    y: '0%',
    duration: 1.1,
    ease: 'power3.out',
    delay: 0.1,
  });

  // Fill bar
  const interval = setInterval(() => {
    progress += Math.random() * 14 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
    }
    fillEl.style.width = progress + '%';
  }, 90);

  // Hide loader after content ready
  function hideLoader() {
    gsap.to(loaderEl, {
      opacity: 0,
      duration: 0.85,
      ease: 'power2.inOut',
      onComplete: () => {
        loaderEl.style.display = 'none';
        window.dispatchEvent(new Event('loaderDone'));
      },
    });
  }

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 800);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 600));
  }
})();
