/**
 * Easter Eggs & Interactivity Extras
 * 1. "Choose Your Side" Switcher (Avengers Hero Mode vs Thanos Villain Mode)
 * 2. The Thanos Snap Easter Egg (Full-screen disintegration & Eye of Agamotto timeline reversal)
 */
import { playSnapSound, playHoverClick } from './soundFX.js';

export function initEasterEggs() {
  initSideToggle();
  initThanosSnap();
}

/**
 * 1. Choose Your Side Toggle
 */
function initSideToggle() {
  const toggleBtn = document.getElementById('side-toggle-btn');
  const statusText = document.getElementById('side-status-text');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    playHoverClick();
    const isVillain = document.body.classList.toggle('theme-villain');

    if (isVillain) {
      document.body.classList.remove('theme-avengers');
      if (statusText) statusText.textContent = 'THANOS MODE';
    } else {
      document.body.classList.add('theme-avengers');
      if (statusText) statusText.textContent = 'HERO MODE';
    }
  });
}

/**
 * 2. Thanos Snap Easter Egg (Full-Screen Whiteout Void & Manual Reload)
 */
function initThanosSnap() {
  const snapBtn = document.getElementById('snap-easter-egg-btn');
  const snapOverlay = document.getElementById('snap-overlay');
  const reloadBtn = document.getElementById('snap-reload-btn');

  if (!snapBtn || !snapOverlay) return;

  let isSnapping = false;

  function triggerWhiteout() {
    if (isSnapping) return;
    isSnapping = true;

    // 1. Play Cosmic Reality Shatter Audio
    playSnapSound();

    // 2. Pause any background videos or audio players so reality freezes
    document.querySelectorAll('video, audio').forEach(el => {
      try { el.pause(); } catch(e) {}
    });

    // 3. Lock page scroll in pure white void
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // 4. Trigger Full Page Whiteout
    snapOverlay.classList.add('active');
    snapOverlay.setAttribute('aria-hidden', 'false');

    // 5. Clicking anywhere on the white void reloads the page
    snapOverlay.addEventListener('click', () => {
      window.location.reload();
    });

    // 6. Keyboard shortcuts (R, Enter, Space) trigger timeline reload
    window.addEventListener('keydown', (e) => {
      if (['Enter', 'Space', 'KeyR'].includes(e.code)) {
        window.location.reload();
      }
    });
  }

  snapBtn.addEventListener('click', triggerWhiteout);

  if (reloadBtn) {
    reloadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.reload();
    });
  }
}
