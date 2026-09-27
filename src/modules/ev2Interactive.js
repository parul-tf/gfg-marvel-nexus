/**
 * EV2 Interactive Behaviors (Suits Slider, Parallax, Video Controls, Coalition Masks)
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playHoverClick, playSurgeSound } from './soundFX.js';

gsap.registerPlugin(ScrollTrigger);

export const SUIT_CATALOG = {
  spiderman: {
    heroName: 'Spider-Man',
    title: 'THE WEB-SLINGER SUIT',
    subtitle: 'INTEGRATED NANO-WEAVE // EARTH-616',
    lore: 'High-tensile synthetic spider-silk mesh integrated with Stark HUD heads-up display. Engineered for instantaneous reactive execution and event loop orchestration.',
    specs: { agility: '99%', compute: '94%', defense: '88%', sync: '98%' },
    color: '#e23636',
    img: '/assets/heroes/spiderman.png',
    role: 'REACTIVE SYSTEMS ARCHITECT'
  },
  ironman: {
    heroName: 'Iron Man',
    title: 'MARK 50 NANO-TECH ARMOR',
    subtitle: 'ARC REACTOR FUSION CORE // STARK TECH',
    lore: 'Autonomous micro-particle alloy that reconfigures in real time into energy cannons, repulsor thrusters, and decentralized cluster nodes.',
    specs: { agility: '92%', compute: '99%', defense: '95%', sync: '97%' },
    color: '#f39c12',
    img: '/assets/heroes/ironman.png',
    role: 'CLOUD CLUSTER OVERLORD'
  },
  'captain-america': {
    heroName: 'Captain America',
    title: 'STEALTH STRIKE S.H.I.E.L.D. UNIFORM',
    subtitle: 'VIBRANIUM ALLOY CORE // ZERO-TRUST',
    lore: 'Ballistic Kevlar-Nomex weave paired with an indestructible circular Vibranium shield. Deflects quantum cryptographic exploits and multi-vector intrusions.',
    specs: { agility: '89%', compute: '91%', defense: '99%', sync: '96%' },
    color: '#00a8ff',
    img: '/assets/heroes/captain-america.png',
    role: 'CYBERSECURITY VANGUARD'
  },
  thor: {
    heroName: 'Thor',
    title: 'ASGARDIAN BATTLE PLATE & STORMBREAKER',
    subtitle: 'BIFROST LIGHTNING CONDUCTOR // ASGARD',
    lore: 'Channeling raw cosmic thunder through heavy Ur-metal runes. Powers global distributed Kubernetes pods across multi-region edge sanctums.',
    specs: { agility: '90%', compute: '96%', defense: '97%', sync: '94%' },
    color: '#00f3ff',
    img: '/assets/heroes/thor.png',
    role: 'HIGH-VOLTAGE EDGE SPECIALIST'
  },
  hulk: {
    heroName: 'The Hulk',
    title: 'GAMMA RESILIENCE BATTLE SUIT',
    subtitle: 'UNLEASHED PETAFLOP TITAN // GAMMA CORE',
    lore: 'Endlessly scalable brute-force computing architecture. Shatters latency bottlenecks by training massive AI agent neural networks simultaneously.',
    specs: { agility: '84%', compute: '98%', defense: '99%', sync: '88%' },
    color: '#2ecc71',
    img: '/assets/heroes/hulk.png',
    role: 'GAMMA COMPUTE TITAN'
  },
  'doctor-strange': {
    heroName: 'Doctor Strange',
    title: 'SANCTUM SORCERER ROBES & EYE OF AGAMOTTO',
    subtitle: 'MYSTIC DIMENSIONAL RELIC // KAMAR-TAJ',
    lore: 'Cloak of Levitation with sentient flight and dimensional pocketing. Scans infinite timeline branches to eliminate anomalies before runtime execution.',
    specs: { agility: '93%', compute: '99%', defense: '94%', sync: '100%' },
    color: '#ff9f43',
    img: '/assets/heroes/doctor-strange.png',
    role: 'QUANTUM LOGIC SORCERER'
  },
  'black-panther': {
    heroName: 'Black Panther',
    title: 'WAKANDAN VIBRANIUM HABIT',
    subtitle: 'KINETIC ENERGY ABSORPTION // WAKANDA',
    lore: 'Micro-woven Vibranium thread absorbs kinetic impact and redirects it as cryptographic shockwaves. Zero carbon emission, infinite system resilience.',
    specs: { agility: '96%', compute: '95%', defense: '100%', sync: '97%' },
    color: '#9b59b6',
    img: '/assets/heroes/black-panther.png',
    role: 'CRYPTOGRAPHIC CORE GUARDIAN'
  }
};

export function initEV2Interactive() {
  initSuitTabs();
  initSuitParallax();
  initVideoControls();
  initCoalitionHover();
  initEV2Roadmap();
}

/**
 * 1. Bundles Suit Selector Tabs & Armory Station
 */
function initSuitTabs() {
  const tabs = document.querySelectorAll('.suit-tab-btn');
  const heroImg = document.getElementById('bundle-suit-img');
  const heroTitle = document.getElementById('bundle-suit-title');
  const heroSubtitle = document.getElementById('bundle-suit-sub');
  const heroLore = document.getElementById('bundle-suit-lore');
  const heroRole = document.getElementById('bundle-suit-role');
  
  // Spec progress bars
  const statAgility = document.getElementById('bundle-stat-agility');
  const statCompute = document.getElementById('bundle-stat-compute');
  const statDefense = document.getElementById('bundle-stat-defense');
  const statSync = document.getElementById('bundle-stat-sync');

  // Spec numeric readouts
  const statAgilityVal = document.getElementById('bundle-stat-agility-val');
  const statComputeVal = document.getElementById('bundle-stat-compute-val');
  const statDefenseVal = document.getElementById('bundle-stat-defense-val');
  const statSyncVal = document.getElementById('bundle-stat-sync-val');

  // Stage holographic elements
  const stageAura = document.getElementById('armory-stage-aura');
  const pedestalOuter = document.querySelector('.pedestal-disc-outer');

  // Equip button & notification badge
  const equipBtn = document.getElementById('armory-equip-btn');
  const equipSuccess = document.getElementById('armory-equip-success');
  const equipText = document.getElementById('armory-equip-text');

  let currentSuitKey = 'spiderman';

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playHoverClick();
      playSurgeSound();
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const suitKey = tab.getAttribute('data-suit');
      const data = SUIT_CATALOG[suitKey];
      if (!data) return;

      currentSuitKey = suitKey;

      if (heroTitle) heroTitle.textContent = data.title;
      if (heroSubtitle) heroSubtitle.textContent = data.subtitle;
      if (heroLore) heroLore.textContent = data.lore;
      if (heroRole) heroRole.textContent = data.role;

      // Animate progress meters
      if (statAgility) statAgility.style.width = data.specs.agility;
      if (statCompute) statCompute.style.width = data.specs.compute;
      if (statDefense) statDefense.style.width = data.specs.defense;
      if (statSync) statSync.style.width = data.specs.sync;

      // Update numeric readouts
      if (statAgilityVal) statAgilityVal.textContent = data.specs.agility;
      if (statComputeVal) statComputeVal.textContent = data.specs.compute;
      if (statDefenseVal) statDefenseVal.textContent = data.specs.defense;
      if (statSyncVal) statSyncVal.textContent = data.specs.sync;

      // Dynamic color theme for holographic aura & pedestal
      if (stageAura && data.color) {
        stageAura.style.background = `radial-gradient(circle, ${data.color}44 0%, ${data.color}15 50%, transparent 70%)`;
      }
      if (pedestalOuter && data.color) {
        pedestalOuter.style.borderColor = `${data.color}99`;
        pedestalOuter.style.boxShadow = `0 0 25px ${data.color}66, inset 0 0 15px ${data.color}33`;
      }

      // Hide success notification when switching suits
      if (equipSuccess) equipSuccess.classList.add('hidden');

      if (heroImg) {
        gsap.fromTo(heroImg, 
          { opacity: 0.15, scale: 0.9, y: 15 },
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.4, 
            ease: 'power3.out',
            onStart: () => {
              heroImg.src = data.img;
              heroImg.alt = `${data.heroName || data.title} Suit`;
            }
          }
        );
      }
    });
  });

  // Equip suit button click handler
  if (equipBtn) {
    equipBtn.addEventListener('click', () => {
      playHoverClick();
      playSurgeSound();

      const data = SUIT_CATALOG[currentSuitKey] || SUIT_CATALOG.spiderman;
      const heroName = data.heroName || data.title;

      try {
        localStorage.setItem('gfg_marvel_avatar', currentSuitKey);
      } catch (e) {
        console.warn('LocalStorage error', e);
      }

      window.dispatchEvent(
        new CustomEvent('hero-avatar-changed', {
          detail: {
            heroKey: currentSuitKey,
            hero: { name: heroName }
          }
        })
      );

      if (equipSuccess) {
        equipSuccess.classList.remove('hidden');
      }

      if (equipText) {
        equipText.textContent = `EQUIPPED: ${heroName.toUpperCase()}`;
        setTimeout(() => {
          if (equipText) equipText.textContent = 'EQUIP SUIT ON TICKET';
        }, 3200);
      }
    });
  }
}

/**
 * 2. 3D Mouse Parallax Tilt on Character Display & Hologram Stage
 */
function initSuitParallax() {
  const container = document.querySelector('.armory-showcase-card, .bundles-showcase-box');
  const imgLayer = document.querySelector('.armory-character-wrap, .bundle-character-layer');
  const pedestal = document.querySelector('.armory-stage-pedestal');
  if (!container || !imgLayer) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(imgLayer, {
      x: x * 35,
      y: y * 25,
      rotationY: x * 14,
      rotationX: -y * 12,
      duration: 0.45,
      ease: 'power1.out'
    });

    if (pedestal) {
      gsap.to(pedestal, {
        x: x * 15,
        rotationY: x * 8,
        duration: 0.45,
        ease: 'power1.out'
      });
    }
  });

  container.addEventListener('mouseleave', () => {
    gsap.to(imgLayer, {
      x: 0,
      y: 0,
      rotationY: 0,
      rotationX: 0,
      duration: 0.75,
      ease: 'power2.out'
    });

    if (pedestal) {
      gsap.to(pedestal, {
        x: 0,
        rotationY: 0,
        duration: 0.75,
        ease: 'power2.out'
      });
    }
  });
}

/**
 * 3. Video Section Play Controls (Marvel Trailer Inline YouTube Stream)
 */
function initVideoControls() {
  const videoSec = document.querySelector('.video-section');
  if (!videoSec) return;

  const videoCard = videoSec.querySelector('.video');
  const statusBtn = videoSec.querySelector('.video-status, .marvel-play-trigger');
  if (!videoCard) return;

  function launchMarvelTrailer() {
    playHoverClick();
    if (videoCard.querySelector('iframe')) return;

    videoCard.innerHTML = `
      <iframe 
        class="marvel-trailer-embed" 
        src="https://www.youtube-nocookie.com/embed/wS_qbDztgVY?autoplay=1&rel=0&modestbranding=1" 
        title="Marvel Studios' The Marvels | Official Trailer"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    `;
    videoCard.classList.add('playing-iframe');
  }

  if (statusBtn) {
    statusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      launchMarvelTrailer();
    });
  }

  videoCard.addEventListener('click', () => {
    launchMarvelTrailer();
  });

  videoCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      launchMarvelTrailer();
    }
  });
}

/**
 * 4. Planet Sections Parallax Scrubbing
 */
function initPlanetParallax() {
  const planet1 = document.querySelector('.planet-section.planet-1 .section-bg');
  const planet2 = document.querySelector('.planet-section.planet-2 .section-bg');

  if (planet1) {
    gsap.to(planet1, {
      yPercent: 20,
      scale: 1.08,
      scrollTrigger: {
        trigger: '.planet-section.planet-1',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  }

  if (planet2) {
    gsap.to(planet2, {
      yPercent: -20,
      scale: 1.08,
      scrollTrigger: {
        trigger: '.planet-section.planet-2',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  }
}

/**
 * 5. Coalition Hover Sync
 */
function initCoalitionHover() {
  const heroes = document.querySelectorAll('.coalition-section .hero');
  const textBlocks = document.querySelectorAll('.coalition-section .text-block');

  heroes.forEach((h, idx) => {
    h.addEventListener('mouseenter', () => {
      playHoverClick();
      textBlocks.forEach(tb => tb.classList.remove('active'));
      const target = document.querySelector(`.coalition-section .text-block-${idx + 1}`);
      if (target) target.classList.add('active');
    });

    h.addEventListener('mouseleave', () => {
      textBlocks.forEach(tb => tb.classList.remove('active'));
      const defaultBlock = document.querySelector('.coalition-section .text-block-0');
      if (defaultBlock) defaultBlock.classList.add('active');
    });
  });
}

/**
 * 6. Curved SVG Roadmap Navigation & Milestones
 */
function initEV2Roadmap() {
  const points = document.querySelectorAll('.roadmap-section .roadmap-point');
  const items = document.querySelectorAll('.roadmap-section .roadmap-items .item');
  const prevBtn = document.querySelector('.roadmap-section .btn-prev');
  const nextBtn = document.querySelector('.roadmap-section .btn-next');
  if (!points.length) return;

  let currentIndex = 0;

  window.setRoadmapMilestone = function(index, playSound = true) {
    if (index < 0) index = points.length - 1;
    if (index >= points.length) index = 0;
    if (index === currentIndex && points[index].classList.contains('active')) return;
    currentIndex = index;

    if (playSound) playHoverClick();

    points.forEach((p, i) => {
      if (i === currentIndex) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    items.forEach((item, i) => {
      if (i === currentIndex) {
        item.style.display = 'flex';
        gsap.fromTo(item, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      } else {
        item.style.display = 'none';
      }
    });
  };

  points.forEach((p, i) => {
    p.addEventListener('click', () => {
      window.setRoadmapMilestone(i, true);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      window.setRoadmapMilestone(currentIndex - 1, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      window.setRoadmapMilestone(currentIndex + 1, true);
    });
  }

  window.setRoadmapMilestone(0, false);
}

