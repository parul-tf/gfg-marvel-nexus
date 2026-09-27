/**
 * GEEKSFORGEEKS BENNETT UNIVERSITY x MARVEL: PROJECT NEXUS
 * Core Application Entry Point
 */

// Import all styles
import './styles/main.css';
import './styles/hero.css';
import './styles/collision.css';
import './styles/highlights.css';
import './styles/team.css';
import './styles/why-attend.css';
import './styles/registration.css';
import './styles/faq-footer.css';
import './styles/effects.css';
import './styles/ev2-core.css';
import './styles/ev2-enhancements.css';
import './styles/hero-3d-lab.css';
import './styles/preloader.css';

// Import specialized interactive modules
import { initCosmicParticles } from './modules/particles.js';
import { initScrollAnimations } from './modules/scrollAnimations.js';
import { initRegistration } from './modules/registration.js';
import { initSoundFX, playHoverClick } from './modules/soundFX.js';
import { initEasterEggs } from './modules/easterEggs.js';
import { initCustomCursor } from './modules/cursor.js';
import { initThreeHeroViewer } from './modules/threeHeroViewer.js';
import { initEV2Interactive } from './modules/ev2Interactive.js';
import { initQuantumPreloader } from './modules/preloader.js';

// Force browser to always return to top on refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

if (window.location.hash) {
  try {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  } catch (e) {}
}

window.addEventListener('pageshow', () => {
  window.scrollTo(0, 0);
  if (window.lenis) {
    try { window.lenis.scrollTo(0, { immediate: true }); } catch (e) {}
  }
});

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);

  // 0. Initialize S.H.I.E.L.D. Quantum Preloader
  initQuantumPreloader();

  // 1. Initialize EV2 Core Interactive Systems
  initEV2Interactive();

  // 1. Initialize Sound Synthesizer
  initSoundFX();

  // 2. Initialize Cosmic Particle System
  initCosmicParticles();

  // 3. Initialize Custom Energy Cursor
  initCustomCursor();

  // 5. Initialize GSAP Scroll Animations & Pin Track
  initScrollAnimations();

  // 7. Initialize Registration & Marvel Quantum Ticket Flow
  initRegistration();

  // 8. Initialize Easter Eggs (Snap & Side Mode)
  initEasterEggs();

  // 9. Initialize 3D Marvel Hero Hologram Lab
  initThreeHeroViewer();

  // 10. Initialize FAQ Accordion
  initFAQAccordion();

  // 11. Header Scroll Shadow
  initHeaderScroll();

  // 12. Curved Quantum Roadmap Milestones
  initRoadmapMilestones();

  // 13. Viewport-Aware Hero Video Play/Pause Optimizer
  initHeroVideoOptimizer();
});

/**
 * Curved Quantum Roadmap Milestone Interactive Toggles
 */
function initRoadmapMilestones() {
  const nodes = document.querySelectorAll('.roadmap-milestone-node');
  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      playHoverClick();
    });
    node.addEventListener('click', () => {
      playHoverClick();
      nodes.forEach((n) => n.classList.remove('active'));
      node.classList.add('active');
    });
  });
}

/**
 * FAQ Interactive Accordion
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      playHoverClick();
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        other.classList.remove('active');
        const btn = other.querySelector('.faq-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Header Scroll State
 */
function initHeaderScroll() {
  const header = document.querySelector('.hud-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * 13. Viewport-Aware Hero Video Play/Pause Optimizer
 * Pauses black hole video decoding when user is browsing other sections.
 */
function initHeroVideoOptimizer() {
  const heroVideo = document.querySelector('.hero-video-bg');
  const heroSection = document.getElementById('hero');
  if (!heroVideo || !heroSection || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (heroVideo.paused) {
            heroVideo.play().catch(() => {});
          }
        } else {
          if (!heroVideo.paused) {
            heroVideo.pause();
          }
        }
      });
    },
    { threshold: 0.05 }
  );

  observer.observe(heroSection);
}

