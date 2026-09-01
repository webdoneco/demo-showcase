(function () {
  const dot    = document.getElementById('cd');
  const circle = document.getElementById('cc');

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Hoverable elements
  document.querySelectorAll('a, button, .menu-item, .dish-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-hovering');
      circle.classList.add('is-hovering');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-hovering');
      circle.classList.remove('is-hovering');
    });
  });

  function animateCursor() {
    // dot follows instantly
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    // circle follows with lag
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    circle.style.left = cx + 'px';
    circle.style.top  = cy + 'px';

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
})();
