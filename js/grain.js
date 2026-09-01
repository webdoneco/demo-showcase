(function () {
  const canvas = document.createElement('canvas');
  canvas.className = 'grain-canvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '9990';
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0.038';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, animId;
  let frameCount = 0;

  function resize() {
    // Use smaller size for performance — still looks great
    w = canvas.width  = Math.floor(window.innerWidth  * 0.5);
    h = canvas.height = Math.floor(window.innerHeight * 0.5);
  }

  resize();
  window.addEventListener('resize', resize);

  function drawGrain() {
    frameCount++;
    // Only redraw every 2nd frame for performance
    if (frameCount % 2 !== 0) {
      animId = requestAnimationFrame(drawGrain);
      return;
    }

    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    const len = data.length;

    for (let i = 0; i < len; i += 4) {
      const val = (Math.random() * 255) | 0;
      data[i]     = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    animId = requestAnimationFrame(drawGrain);
  }

  drawGrain();
})();
