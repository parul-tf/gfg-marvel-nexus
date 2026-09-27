/**
 * GSAP + ScrollTrigger + Lenis Orchestration Engine
 * Ultra-Smooth Momentum Scrolling, Tactical S.H.I.E.L.D. Sector Telemetry,
 * Multi-Plane Parallax Depth, Apple-Style Cinematic Scrubbing,
 * Dynamic Stat Number Rollups, and Razor-Sharp SVG Kinetic Tracing.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playHoverClick } from './soundFX.js';

gsap.registerPlugin(ScrollTrigger);

export let lenisInstance = null;

export function initScrollAnimations() {
  initLenisSmoothScroll();
  initSectorTelemetryTracker();
  initGlobalScrollBeam();
  initHeroScrollDispersal();
  initHeroAvatarEntrance();
  initAboutReveal();
  initTrailerScrubExpansion();
  initRoadmapScrollDrawing();
  initSuitsParallax();
  initTracksParallax();
  initPlanetParallax();
  initIntelCardWave();
  initRegistrationEntrance();
  initFAQCascade();
  initSmoothAnchorLinks();
}

/**
 * 1. Lenis Smooth Momentum Scrolling Engine & Telemetry Broadcast
 */
function initLenisSmoothScroll() {
  const isMobile = window.innerWidth < 768;

  lenisInstance = new Lenis({
    duration: isMobile ? 1.0 : 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
    infinite: false
  });

  window.lenis = lenisInstance;
  lenisInstance.scrollTo(0, { immediate: true });

  // DOM Telemetry elements
  const depthEl = document.getElementById('telemetry-depth-pct');
  const velocityEl = document.getElementById('telemetry-velocity-num');
  const needleEl = document.getElementById('telemetry-needle');
  const compassStroke = document.getElementById('telemetry-compass-stroke');
  const scrollBeam = document.getElementById('global-scroll-beam');

  // Broadcast scroll state to GSAP ScrollTrigger and Tactical HUD
  lenisInstance.on('scroll', (e) => {
    ScrollTrigger.update();

    const progress = Math.min(100, Math.max(0, Math.round((e.progress || 0) * 100)));
    const speed = Math.abs(e.velocity || 0);

    if (depthEl) {
      depthEl.textContent = `${String(progress).padStart(2, '0')}% DEPTH`;
    }

    if (velocityEl) {
      velocityEl.textContent = `${speed.toFixed(1)} M/S`;
    }

    if (needleEl) {
      // Rotate needle dynamically with scroll velocity
      const angle = Math.max(-85, Math.min(85, (e.velocity || 0) * 16));
      needleEl.style.transform = `rotate(${angle}deg)`;
    }

    if (compassStroke) {
      // Stroke dashoffset runs from 88 to 0 as progress goes 0 to 1
      const offset = 88 - (progress / 100) * 88;
      compassStroke.style.strokeDashoffset = offset;
    }

    if (scrollBeam) {
      // Boost beam laser brightness during fast scroll
      if (speed > 2.5) {
        scrollBeam.style.filter = 'drop-shadow(0 0 16px #00F0FF) brightness(1.25)';
      } else {
        scrollBeam.style.filter = 'none';
      }
    }
  });

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  // Butter-smooth frame pacing during media decoding and scroll scrubbing
  gsap.ticker.lagSmoothing(500, 33);

  // Debounced resize handler for buttery smooth geometry updates
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (lenisInstance) lenisInstance.resize();
      ScrollTrigger.refresh();
    }, 150);
  }, { passive: true });
}

/**
 * 2. Tactical S.H.I.E.L.D. Sector Telemetry Tracker
 * Automatically updates active sector label as the user traverses the page.
 */
function initSectorTelemetryTracker() {
  const sectorLabel = document.getElementById('telemetry-sector-name');
  if (!sectorLabel) return;

  const sectors = [
    { id: 'hero', name: 'SECTOR // 01 HERO APEX' },
    { id: 'heroes-lab', name: 'SECTOR // 02 AVATAR LAB' },
    { id: 'about', name: 'SECTOR // 03 MISSION BRIEF' },
    { id: 'trailer', name: 'SECTOR // 04 MARVEL ARCHIVE' },
    { id: 'roadmap', name: 'SECTOR // 05 EVENT ROADMAP' },
    { id: 'suits', name: 'SECTOR // 06 MULTIVERSE ARMOR' },
    { id: 'tracks', name: 'SECTOR // 07 BATTLE TRACKS' },
    { id: 'sanctum', name: 'SECTOR // 08 SANCTUM SANCTORUM' },
    { id: 'quantum-realm', name: 'SECTOR // 09 QUANTUM REALM' },
    { id: 'intel', name: 'SECTOR // 10 S.H.I.E.L.D. DISPATCHES' },
    { id: 'register', name: 'SECTOR // 11 CLEARANCE GATEWAY' },
    { id: 'faq', name: 'SECTOR // 12 TACTICAL PROTOCOLS' }
  ];

  let currentSector = '';

  sectors.forEach((sec) => {
    const el = document.getElementById(sec.id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => setSector(sec.name),
      onEnterBack: () => setSector(sec.name)
    });
  });

  function setSector(name) {
    if (currentSector === name) return;
    currentSector = name;

    // High-tech text decode scramble effect
    scrambleText(sectorLabel, name);
  }

  function scrambleText(targetEl, finalText) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//-';
    let iteration = 0;
    const maxIterations = 8;

    const interval = setInterval(() => {
      targetEl.textContent = finalText
        .split('')
        .map((char, index) => {
          if (index < iteration) return finalText[index];
          if (char === ' ' || char === '/') return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      iteration += 3;
      if (iteration >= finalText.length + maxIterations) {
        clearInterval(interval);
        targetEl.textContent = finalText;
      }
    }, 25);
  }
}

/**
 * 3. Top Global Marvel Quantum Laser Scroll Beam
 */
function initGlobalScrollBeam() {
  const beam = document.getElementById('global-scroll-beam');
  if (!beam) return;

  gsap.to(beam, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2
    }
  });
}

/**
 * 4. Hero Section (#hero) Cinematic Multi-Plane Dispersal
 */
function initHeroScrollDispersal() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2
    }
  });

  tl.to('#hero .hero-video-bg', { scale: 1.25, opacity: 0.2, ease: 'none' }, 0)
    .to('#hero .hero-meteors-layer', { yPercent: -45, ease: 'none' }, 0)
    .to('#hero .hero-fog-layer', { yPercent: -28, opacity: 0.12, ease: 'none' }, 0)
    .to('#hero .stark-hud-pill', { y: -35, opacity: 0, ease: 'none' }, 0)
    .to('#hero .word-avengers', { y: -60, scale: 0.92, opacity: 0.35, ease: 'none' }, 0)
    .to('#hero .word-nexus', { y: -45, scale: 0.95, opacity: 0.45, ease: 'none' }, 0)
    .to('#hero .hero-tagline', { y: -45, opacity: 0, ease: 'none' }, 0)
    .to('#hero .hero-radar-banner', { y: -30, opacity: 0, ease: 'none' }, 0)
    .to('#hero .hero-event-strip', { y: -25, opacity: 0, ease: 'none' }, 0)
    .to('#hero .btn-clip', { y: -20, opacity: 0, stagger: 0.04, ease: 'none' }, 0);
}

/**
 * 5. Choose Your Avatar Section (#heroes-lab) 3D Entrance & Dynamic Numeric Rollups
 */
function initHeroAvatarEntrance() {
  const lab = document.getElementById('heroes-lab');
  if (!lab) return;

  const chips = lab.querySelectorAll('.hero-chip-btn');
  if (chips.length) {
    gsap.fromTo(chips,
      { opacity: 0, y: 30, scale: 0.88 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.05,
        duration: 0.65,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: lab,
          start: 'top 75%'
        }
      }
    );
  }

  const stage = document.getElementById('hero-stage');
  const dossier = lab.querySelector('.hero-dossier-card');

  if (stage) {
    gsap.fromTo(stage,
      { opacity: 0, x: -60, scale: 0.92, rotateY: 6 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        rotateY: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: lab,
          start: 'top 70%'
        }
      }
    );
  }

  if (dossier) {
    gsap.fromTo(dossier,
      { opacity: 0, x: 60, scale: 0.92, rotateY: -6 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        rotateY: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: lab,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            // Animate each stat bar fill AND roll up percentage numbers
            animateStatRollup('stat-fill-agility', 'stat-val-agility', 99);
            animateStatRollup('stat-fill-compute', 'stat-val-compute', 94);
            animateStatRollup('stat-fill-defense', 'stat-val-defense', 88);
          }
        }
      }
    );
  }

  // Smooth continuous parallax for hero figure inside stage
  const heroImg = document.getElementById('hero-main-img');
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: lab,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  }
}

/**
 * Helper to roll up numbers with smooth easing
 */
function animateStatRollup(barId, valId, targetNum) {
  const bar = document.getElementById(barId);
  const val = document.getElementById(valId);
  if (!bar || !val) return;

  const counter = { num: 0 };
  gsap.fromTo(bar, { width: '0%' }, { width: `${targetNum}%`, duration: 1.25, ease: 'power2.out' });

  gsap.to(counter, {
    num: targetNum,
    duration: 1.25,
    ease: 'power2.out',
    onUpdate: () => {
      val.textContent = `${Math.round(counter.num)}%`;
    }
  });
}

/**
 * 6. About Section (#about) Kinetic Directive Reveal
 */
function initAboutReveal() {
  const about = document.getElementById('about');
  if (!about) return;

  gsap.fromTo('#about .section-title',
    { opacity: 0, y: 40, filter: 'blur(8px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: about,
        start: 'top 80%'
      }
    }
  );

  gsap.fromTo('#about p',
    { opacity: 0, y: 35 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: about,
        start: 'top 80%'
      }
    }
  );

  gsap.to('#about .meteors', {
    yPercent: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: about,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.4
    }
  });

  gsap.to('#about .fog', {
    yPercent: -25,
    ease: 'none',
    scrollTrigger: {
      trigger: about,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.6
    }
  });
}

/**
 * 7. Marvel Trailer Video (#trailer) Apple-Style Expansion Scrub
 */
function initTrailerScrubExpansion() {
  const trailerSec = document.getElementById('trailer');
  if (!trailerSec) return;

  const videoCard = trailerSec.querySelector('.video');
  const playPulse = trailerSec.querySelector('.play-pulse-ring');
  if (!videoCard) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trailerSec,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2
    }
  });

  tl.fromTo(videoCard,
    { scale: 0.82, borderRadius: 36, filter: 'brightness(0.85)' },
    { scale: 1.0, borderRadius: 10, filter: 'brightness(1.08)', ease: 'power1.out', duration: 1 }
  ).to(videoCard,
    { scale: 0.88, borderRadius: 28, filter: 'brightness(0.88)', ease: 'power1.in', duration: 1 }
  );

  if (playPulse) {
    ScrollTrigger.create({
      trigger: trailerSec,
      start: 'top 70%',
      onEnter: () => {
        gsap.fromTo(playPulse,
          { scale: 1, opacity: 0.9 },
          { scale: 2.2, opacity: 0, repeat: -1, duration: 1.8, ease: 'power2.out' }
        );
      }
    });
  }
}

/**
 * 8. Event Roadmap (#roadmap) SVG Path Drawing & Milestone Activation
 */
function initRoadmapScrollDrawing() {
  const roadmapSec = document.getElementById('roadmap');
  if (!roadmapSec) return;

  const glowPath = document.getElementById('roadmap-glow-path');
  const points = roadmapSec.querySelectorAll('.roadmap-point');

  if (glowPath && points.length) {
    try {
      const pathLength = glowPath.getTotalLength();
      glowPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
      glowPath.style.strokeDashoffset = pathLength;

      gsap.to(glowPath, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: roadmapSec,
          start: 'top 65%',
          end: 'bottom 45%',
          scrub: 1.2,
          onUpdate: (self) => {
            const progress = self.progress;
            const phaseIndex = Math.min(
              points.length - 1,
              Math.floor(progress * points.length)
            );
            if (window.setRoadmapMilestone) {
              window.setRoadmapMilestone(phaseIndex, false);
            }
          }
        }
      });
    } catch (e) {
      console.warn('Roadmap path length calculation:', e);
    }
  }

  if (points.length) {
    gsap.fromTo(points,
      { opacity: 0, scale: 0.7, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(1.6)',
        scrollTrigger: {
          trigger: roadmapSec,
          start: 'top 75%'
        }
      }
    );
  }
}

/**
 * 9. Multiverse Armor Section (#suits) Parallax & Dynamic Specs
 */
function initSuitsParallax() {
  const suitsSec = document.getElementById('suits');
  if (!suitsSec) return;

  const tabs = suitsSec.querySelectorAll('.suit-tab-btn');
  if (tabs.length) {
    gsap.fromTo(tabs,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: suitsSec,
          start: 'top 80%'
        }
      }
    );
  }

  const suitImg = document.getElementById('bundle-suit-img');
  if (suitImg) {
    gsap.to(suitImg, {
      yPercent: -20,
      rotate: 2,
      ease: 'none',
      scrollTrigger: {
        trigger: suitsSec,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  }

  const specsGrid = suitsSec.querySelector('.bundle-specs-grid');
  if (specsGrid) {
    ScrollTrigger.create({
      trigger: specsGrid,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const fills = specsGrid.querySelectorAll('.bundle-spec-fill');
        fills.forEach(fill => {
          const target = fill.style.width || '90%';
          gsap.fromTo(fill, { width: '0%' }, { width: target, duration: 1.2, ease: 'power2.out' });
        });
      }
    });
  }
}

/**
 * 10. Coalition Battle Tracks Section (#tracks) Multi-Plane Parallax Silhouettes
 */
function initTracksParallax() {
  const tracksSec = document.getElementById('tracks');
  if (!tracksSec) return;

  const h1 = tracksSec.querySelector('.hero-1');
  const h2 = tracksSec.querySelector('.hero-2');
  const h3 = tracksSec.querySelector('.hero-3');

  if (h1) {
    gsap.to(h1, {
      yPercent: -35,
      rotation: 3,
      ease: 'none',
      scrollTrigger: {
        trigger: tracksSec,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.4
      }
    });
  }

  if (h2) {
    gsap.to(h2, {
      yPercent: -60,
      rotation: -3,
      ease: 'none',
      scrollTrigger: {
        trigger: tracksSec,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.8
      }
    });
  }

  if (h3) {
    gsap.to(h3, {
      yPercent: -25,
      rotation: 2,
      ease: 'none',
      scrollTrigger: {
        trigger: tracksSec,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  }

  const content = tracksSec.querySelector('.section-content');
  if (content) {
    gsap.fromTo(content,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: tracksSec,
          start: 'top 75%'
        }
      }
    );
  }
}

/**
 * 11. Celestial Battleground Planets (#sanctum & #quantum-realm) Parallax
 */
function initPlanetParallax() {
  const sanctum = document.getElementById('sanctum');
  const quantum = document.getElementById('quantum-realm');

  if (sanctum) {
    const bg1 = sanctum.querySelector('.section-bg');
    if (bg1) {
      gsap.to(bg1, {
        yPercent: 28,
        rotation: 6,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sanctum,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4
        }
      });
    }

    gsap.fromTo('#sanctum .section-content',
      { opacity: 0, y: 45, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sanctum,
          start: 'top 75%'
        }
      }
    );
  }

  if (quantum) {
    const bg2 = quantum.querySelector('.section-bg');
    if (bg2) {
      gsap.to(bg2, {
        yPercent: -28,
        rotation: -6,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: quantum,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4
        }
      });
    }

    gsap.fromTo('#quantum-realm .section-content',
      { opacity: 0, y: 45, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: quantum,
          start: 'top 75%'
        }
      }
    );
  }
}

/**
 * 12. S.H.I.E.L.D. Dispatches (#intel) 3D Card Waves
 */
function initIntelCardWave() {
  const intelSec = document.getElementById('intel');
  if (!intelSec) return;

  const cards = intelSec.querySelectorAll('.card');
  if (cards.length) {
    gsap.fromTo(cards,
      { opacity: 0, y: 70, rotateX: 20, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        stagger: 0.16,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: intelSec,
          start: 'top 75%'
        }
      }
    );

    const images = intelSec.querySelectorAll('.card-image img');
    images.forEach(img => {
      gsap.to(img, {
        scale: 1.16,
        ease: 'none',
        scrollTrigger: {
          trigger: intelSec,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    });
  }
}

/**
 * 13. Clearance Registration & Ticket Forge (#register)
 */
function initRegistrationEntrance() {
  const regSec = document.getElementById('register');
  if (!regSec) return;

  const terminal = regSec.querySelector('.reg-terminal-card');
  const ticketWrap = document.getElementById('ticket-output-container');
  const stepper = regSec.querySelector('.reg-stepper');
  const benefits = regSec.querySelectorAll('.reg-benefits-showcase .benefit-item');

  if (terminal) {
    gsap.fromTo(terminal,
      { opacity: 0, x: -60, scale: 0.95 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: regSec,
          start: 'top 75%'
        }
      }
    );
  }

  if (ticketWrap) {
    gsap.fromTo(ticketWrap,
      { opacity: 0, x: 60, scale: 0.95 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: regSec,
          start: 'top 75%'
        }
      }
    );
  }

  if (stepper) {
    const steps = stepper.querySelectorAll('.reg-step-item');
    gsap.fromTo(steps,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: stepper,
          start: 'top 85%'
        }
      }
    );
  }

  if (benefits.length) {
    gsap.fromTo(benefits,
      { opacity: 0, y: 35, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.reg-benefits-showcase',
          start: 'top 85%'
        }
      }
    );
  }
}

/**
 * 14. Tactical Intel FAQ (#faq) Cascade
 */
function initFAQCascade() {
  const faqSec = document.getElementById('faq');
  if (!faqSec) return;

  const items = faqSec.querySelectorAll('.faq-item');
  if (items.length) {
    gsap.fromTo(items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: faqSec,
          start: 'top 75%'
        }
      }
    );
  }
}

/**
 * 15. Smooth Anchor Link Navigation via Lenis
 */
function initSmoothAnchorLinks() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        playHoverClick();
        if (lenisInstance) {
          lenisInstance.scrollTo(target, { offset: -60, duration: 1.35 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
