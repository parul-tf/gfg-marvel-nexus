/**
 * S.H.I.E.L.D. Stark HUD Quantum Reticle Cursor
 * 1:1 Instant Pointer Tracking (Zero Latency), Damped Target Lock Brackets,
 * Contextual Telemetry Labels, Click Shockwaves, and Kinetic Arc Sparks.
 */
export function initCustomCursor() {
  // Disable on touch / coarse pointer devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const pointer = document.getElementById('cursor-pointer');
  const targetLock = document.getElementById('cursor-target-lock');
  const hudLabel = document.getElementById('cursor-hud-label');
  const shockwave = document.getElementById('cursor-click-shockwave');

  if (!pointer || !targetLock) return;

  let mouseX = -100;
  let mouseY = -100;
  let targetX = -100;
  let targetY = -100;
  let isDown = false;
  let lastX = -100;
  let lastY = -100;
  let isVisible = false;

  // Track spark particle emission rate
  let sparkCooldown = 0;

  // 1:1 Instant Tracking on Pointer Tip (No lag)
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      pointer.style.opacity = '1';
      targetLock.style.opacity = '1';
      targetX = mouseX;
      targetY = mouseY;
    }

    const scale = isDown ? 0.82 : 1;
    pointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${scale})`;
  }, { passive: true });

  // Smooth lerp loop for outer tactical target lock brackets
  function renderCursor() {
    targetX += (mouseX - targetX) * 0.22;
    targetY += (mouseY - targetY) * 0.22;

    const lockScale = isDown ? 0.88 : 1;
    targetLock.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${lockScale})`;

    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    pointer.style.opacity = '0';
    targetLock.style.opacity = '0';
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    pointer.style.opacity = '1';
    targetLock.style.opacity = '1';
    isVisible = true;
  });

  // Contextual Hover Detection & Dynamic Telemetry Labels
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!target || !(target instanceof Element)) return;

    const interactiveEl = target.closest('a, button, input, select, textarea, .hero-chip-btn, .suit-tab-btn, .roadmap-point, .video, .card, .faq-trigger, [role="button"]');

    if (interactiveEl) {
      document.body.classList.add('cursor-active');

      if (hudLabel) {
        if (interactiveEl.closest('.hero-chip-btn, #equip-avatar-btn')) {
          hudLabel.textContent = '[AVATAR]';
        } else if (interactiveEl.closest('.suit-tab-btn')) {
          hudLabel.textContent = '[ARMOR]';
        } else if (interactiveEl.closest('.roadmap-point, .btn-prev, .btn-next')) {
          hudLabel.textContent = '[TIMELINE]';
        } else if (interactiveEl.closest('.video, .marvel-play-trigger, .video-link')) {
          hudLabel.textContent = '[FEED]';
        } else if (interactiveEl.closest('input, select, textarea')) {
          hudLabel.textContent = '[INPUT]';
        } else if (interactiveEl.closest('.faq-trigger')) {
          hudLabel.textContent = '[INTEL]';
        } else if (interactiveEl.closest('.reg-submit-btn, .hud-cta-link, .btn--red')) {
          hudLabel.textContent = '[ENGAGE]';
        } else {
          hudLabel.textContent = '[TARGET]';
        }
      }
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (!target || !(target instanceof Element)) return;

    const interactiveEl = target.closest('a, button, input, select, textarea, .hero-chip-btn, .suit-tab-btn, .roadmap-point, .video, .card, .faq-trigger, [role="button"]');

    if (interactiveEl) {
      document.body.classList.remove('cursor-active');
      if (hudLabel) {
        hudLabel.textContent = 'EARTH-616';
      }
    }
  }, { passive: true });

  // Click Repulsor Shockwave & Kinetic Click Arc
  document.addEventListener('mousedown', (e) => {
    isDown = true;
    pointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(0.8)`;

    createSpark(e.clientX, e.clientY);
    createSpark(e.clientX, e.clientY);

    if (shockwave) {
      shockwave.style.setProperty('--pulse-x', `${e.clientX}px`);
      shockwave.style.setProperty('--pulse-y', `${e.clientY}px`);
      shockwave.classList.remove('pulse');
      // Trigger reflow to restart animation
      void shockwave.offsetWidth;
      shockwave.classList.add('pulse');
    }
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    pointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1)`;
  });

  // Kinetic Arc Sparks
  function createSpark(x, y) {
    const spark = document.createElement('div');
    spark.className = 'cursor-spark-particle';

    const colors = ['#00F0FF', '#FFD700', '#ED1D24'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 3 + 2;

    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.backgroundColor = color;
    spark.style.boxShadow = `0 0 6px ${color}`;

    const offsetRange = 8;
    const sparkX = x + (Math.random() - 0.5) * offsetRange;
    const sparkY = y + (Math.random() - 0.5) * offsetRange;

    spark.style.transform = `translate3d(${sparkX}px, ${sparkY}px, 0) translate(-50%, -50%)`;

    document.body.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 450);
  }
}
