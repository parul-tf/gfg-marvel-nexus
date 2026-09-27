/**
 * Cosmic Particle & Energy Field System (High-Performance Optimized)
 * Lightweight Canvas 2D simulation with zero software blur penalties.
 */

export function initCosmicParticles() {
  const canvas = document.getElementById('cosmic-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Balanced particle count: pristine visuals with near-zero CPU footprint
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 22 : 45;

  const colors = [
    'rgba(237, 29, 36, ',   // Marvel Red
    'rgba(0, 240, 255, ',   // Arc Cyan
    'rgba(255, 215, 0, ',   // Stark Gold
    'rgba(176, 38, 255, ',  // Power Purple
    'rgba(255, 255, 255, '  // Cosmic Starlight
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 1.8 + 0.8;
      this.speedY = -(Math.random() * 0.35 + 0.12);
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.baseAlpha = Math.random() * 0.5 + 0.25;
      this.alpha = this.baseAlpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.angle = Math.random() * Math.PI * 2;
    }

    update(mouseX, mouseY) {
      this.angle += this.pulseSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.angle) * 0.2;

      // Mouse subtle gravitational pull (distance-squared for high performance)
      if (mouseX !== null && mouseY !== null) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distSq = dx * dx + dy * dy;
        const maxDistSq = 40000; // 200px ^ 2

        if (distSq < maxDistSq && distSq > 100) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 200) * 0.25;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }

      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around bounds
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      const a = Math.max(0.05, Math.min(1, this.alpha));

      // Soft ambient aura (zero-overhead alternative to ctx.shadowBlur)
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `${this.colorBase}${a * 0.25})`;
      ctx.fill();

      // Sharp stellar core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.colorBase}${a})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: particleCount }, () => new Particle());

  let mouseX = null;
  let mouseY = null;
  let isTabVisible = true;
  let animationFrameId = null;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
  }, { passive: true });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 150);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    if (isTabVisible && !animationFrameId) {
      render();
    }
  });

  // Highly optimized render loop
  function render() {
    if (!isTabVisible) {
      animationFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Batched single-path filament lines (10x faster than individual strokes)
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';

    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < len; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        if (dx * dx + dy * dy < 5625) { // 75px squared
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
    }
    ctx.stroke();

    // Draw all particle bodies
    for (let i = 0; i < len; i++) {
      particles[i].update(mouseX, mouseY);
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };
}
