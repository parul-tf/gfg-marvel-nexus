/**
 * S.H.I.E.L.D. QUANTUM PRELOADER // PROJECT NEXUS BOOT SEQUENCE
 * Orchestrates multi-stage holographic boot, counter interpolation,
 * SVG Arc Reactor calibration, and cinematic dual-shutter exit reveal.
 */

import { gsap } from 'gsap';
import { playHoverClick } from './soundFX.js';

export function initQuantumPreloader() {
  const preloader = document.getElementById('quantum-preloader');
  if (!preloader) return;

  const percentNum = document.getElementById('loader-percent-num');
  const barFill = document.getElementById('loader-bar-fill');
  const statusMsg = document.getElementById('loader-status-msg');
  const skipBtn = document.getElementById('loader-skip-btn');
  const ringEnergy = document.querySelector('.ring-fill-energy');

  const CIRCUMFERENCE = 565.48; // 2 * PI * 90

  // Status Milestones
  const statusLog = [
    { threshold: 0,  text: "INITIALIZING S.H.I.E.L.D. QUANTUM PROTOCOLS..." },
    { threshold: 24, text: "LINKING EARTH-616 SANCTUM SERVERS..." },
    { threshold: 52, text: "CALIBRATING MULTIVERSAL EVENT FREQUENCIES..." },
    { threshold: 76, text: "COMPILING STARK NEURAL GAUNTLETS & SUITS..." },
    { threshold: 92, text: "SYNCHRONIZING 1,000+ COGNITIVE HERO NODES..." },
    { threshold: 100, text: "CLEARANCE GRANTED // AVENGERS ASSEMBLE." }
  ];

  let currentProgress = 0;
  let targetProgress = 0;
  let isFinished = false;
  let animFrameId = null;

  // Stop Lenis virtual scrolling during boot sequence so the viewport stays pinned
  window.scrollTo(0, 0);
  if (window.lenis) {
    try {
      window.lenis.scrollTo(0, { immediate: true });
      window.lenis.stop();
    } catch (e) {}
  }

  // Update DOM elements to reflect progress
  function updateProgress(value) {
    const clamped = Math.min(100, Math.max(0, Math.round(value)));
    if (percentNum) percentNum.textContent = clamped;
    if (barFill) barFill.style.width = `${clamped}%`;

    if (ringEnergy) {
      const offset = CIRCUMFERENCE - (CIRCUMFERENCE * clamped / 100);
      ringEnergy.style.strokeDashoffset = offset;
    }

    // Match status text to threshold
    if (statusMsg) {
      for (let i = statusLog.length - 1; i >= 0; i--) {
        if (clamped >= statusLog[i].threshold) {
          if (statusMsg.textContent !== statusLog[i].text) {
            statusMsg.style.opacity = '0.3';
            setTimeout(() => {
              statusMsg.textContent = statusLog[i].text;
              statusMsg.style.opacity = '1';
            }, 100);
          }
          break;
        }
      }
    }
  }

  // Linear interpolation animation loop
  function loop() {
    if (isFinished) return;

    // Smoothly step towards target
    const step = (targetProgress - currentProgress) * 0.12;
    currentProgress += step;

    if (Math.abs(targetProgress - currentProgress) < 0.2) {
      currentProgress = targetProgress;
    }

    updateProgress(currentProgress);

    if (currentProgress >= 100) {
      completeBoot();
      return;
    }

    animFrameId = requestAnimationFrame(loop);
  }

  // Staged timeline progression
  const sequence = [
    { target: 28, delay: 100 },
    { target: 56, delay: 500 },
    { target: 78, delay: 1050 },
    { target: 94, delay: 1550 },
    { target: 100, delay: 2000 }
  ];

  sequence.forEach(({ target, delay }) => {
    setTimeout(() => {
      if (!isFinished) {
        targetProgress = target;
        try { playHoverClick(); } catch (e) {}
      }
    }, delay);
  });

  animFrameId = requestAnimationFrame(loop);

  // Instant skip / bypass trigger
  function forceComplete() {
    if (isFinished) return;
    targetProgress = 100;
    currentProgress = 100;
    updateProgress(100);
    completeBoot();
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      forceComplete();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !isFinished) {
      forceComplete();
    }
  });

  // Finish boot and trigger cinematic shutter reveal
  function completeBoot() {
    if (isFinished) return;
    isFinished = true;
    cancelAnimationFrame(animFrameId);

    // Brief 250ms celebration pause at 100%
    setTimeout(() => {
      preloader.classList.add('exiting');

      // Keep scroll anchored to top when exiting preloader
      window.scrollTo(0, 0);
      if (window.lenis) {
        try {
          window.lenis.scrollTo(0, { immediate: true });
          window.lenis.start();
        } catch (e) {}
      }

      // Signal document loaded
      document.documentElement.classList.remove('loading');
      document.documentElement.classList.add('loaded');
      document.body.classList.add('boot-complete');

      // Trigger hero entrance stagger with GSAP
      gsap.fromTo('.intro-section .stark-hud-pill, .intro-section .hero-hud-eyebrow', 
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
      );
      gsap.fromTo('.intro-section .hero-main-title .title-word', 
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)', delay: 0.3 }
      );
      gsap.fromTo('.intro-section .hero-title-telemetry, .intro-section .hero-tagline, .intro-section .hero-radar-banner', 
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out', delay: 0.5 }
      );
      gsap.fromTo('.intro-section .btn-clip', 
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.4)', delay: 0.7 }
      );

      // Hide and unbind after shutters slide completely clear (850ms)
      setTimeout(() => {
        preloader.classList.add('loaded-hidden');
        preloader.setAttribute('aria-hidden', 'true');
      }, 900);
    }, 250);
  }
}
