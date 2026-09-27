/**
 * Marvel Hero Avatar Showcase Module
 * Clean, fast, cinematic character selector with interactive 3D parallax tilt,
 * smooth transitions, audio feedback, and ticket synchronization.
 */
import { gsap } from 'gsap';
import { playHoverClick, playSurgeSound } from './soundFX.js';

export const HERO_KEYS = [
  'spiderman',
  'ironman',
  'captain-america',
  'thor',
  'hulk',
  'doctor-strange',
  'black-panther'
];

export const HERO_DATA = {
  spiderman: {
    name: 'SPIDER-MAN',
    heroName: 'PETER PARKER',
    track: 'TRACK: WEB & ASYNC SYSTEMS',
    title: 'THE WEB-SLINGER // AGILITY & REACTIVE SPECIALIST',
    lore: 'Bio-enhanced reflexes capable of managing millions of concurrent websocket connections and asynchronous event streams with zero latency.',
    quote: '"With great compute power comes great responsibility."',
    stats: { agility: 99, compute: 94, defense: 88 },
    color: '#ED1D24',
    glow: 'rgba(237, 29, 36, 0.45)',
    image: '/assets/heroes/spiderman.png'
  },
  ironman: {
    name: 'IRON MAN',
    heroName: 'TONY STARK',
    track: 'TRACK: CLOUD ARCHITECTURE & AI',
    title: 'THE IRON ARCHITECT // ARC REACTOR INFRASTRUCTURE',
    lore: 'Master of nano-engineering and autonomous AI swarms. Harnesses clean fusion power to drive Bennett University supercomputing clusters.',
    quote: '"I am Iron Man. And I just refactored the entire production kernel."',
    stats: { agility: 92, compute: 100, defense: 95 },
    color: '#FFD700',
    glow: 'rgba(255, 215, 0, 0.45)',
    image: '/assets/heroes/ironman.png'
  },
  'captain-america': {
    name: 'CAPTAIN AMERICA',
    heroName: 'STEVE ROGERS',
    track: 'TRACK: ZERO-TRUST & CYBERSECURITY',
    title: 'THE FIRST AVENGER // UNBREAKABLE DEFENSE',
    lore: 'Hardened cybersecurity vanguard. Wields a cryptographic Vibranium shield deflecting distributed attacks and unauthorized intrusions.',
    quote: '"I can patch zero-days all day."',
    stats: { agility: 90, compute: 89, defense: 100 },
    color: '#0088FF',
    glow: 'rgba(0, 136, 255, 0.45)',
    image: '/assets/heroes/captain-america.png'
  },
  thor: {
    name: 'THOR ODINSON',
    heroName: 'GOD OF THUNDER',
    track: 'TRACK: HIGH-VOLTAGE DISTRIBUTED CLOUD',
    title: 'STORMBREAKER CLUSTER // HIGH-VOLTAGE SCALE',
    lore: 'Summons cosmic lightning across distributed multi-region Kubernetes nodes. Annihilates bottlenecks with thunderous throughput.',
    quote: '"Bring me your highest server spikes!"',
    stats: { agility: 91, compute: 96, defense: 97 },
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.45)',
    image: '/assets/heroes/thor.png'
  },
  hulk: {
    name: 'THE INCREDIBLE HULK',
    heroName: 'DR. BRUCE BANNER',
    track: 'TRACK: HEAVY AI & PARALLEL COMPUTE',
    title: 'GAMMA COMPUTE TITAN // HEAVY PARALLELISM',
    lore: 'Unleashes raw brute-force computing. Trains billion-parameter neural networks in seconds through pure gamma-accelerated parallelism.',
    quote: '"Hulk smash runtime exceptions!"',
    stats: { agility: 84, compute: 98, defense: 100 },
    color: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.45)',
    image: '/assets/heroes/hulk.png'
  },
  'doctor-strange': {
    name: 'DOCTOR STRANGE',
    heroName: 'STEPHEN STRANGE',
    track: 'TRACK: QUANTUM & MULTIVERSE LOGIC',
    title: 'SORCERER SUPREME // QUANTUM LOGIC',
    lore: 'Wields the Eye of Agamotto to inspect 14,000,605 execution branches simultaneously, reversing state bugs and synchronizing parallel dimensions.',
    quote: '"We are in the endgame of optimization now."',
    stats: { agility: 93, compute: 100, defense: 94 },
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.45)',
    image: '/assets/heroes/doctor-strange.png'
  },
  'black-panther': {
    name: 'BLACK PANTHER',
    heroName: "KING T'CHALLA",
    track: 'TRACK: CRYPTOGRAPHY & HARDWARE',
    title: 'KING OF WAKANDA // VIBRANIUM CRYPTOGRAPHIC CORE',
    lore: 'Wakandan kinetic absorption tech applied to cryptographic hashing and distributed ledger consensus. Zero heat emission, infinite resilience.',
    quote: '"Wakanda forever. Our distributed systems will never fall."',
    stats: { agility: 98, compute: 95, defense: 99 },
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.45)',
    image: '/assets/heroes/black-panther.png'
  }
};

export function initThreeHeroViewer() {
  const stageCard = document.getElementById('hero-stage');
  const heroImg = document.getElementById('hero-main-img');
  const heroImageWrap = document.getElementById('hero-image-wrap');
  const stageAura = document.getElementById('hero-stage-aura');
  const pedestalDisc = document.querySelector('.hero-pedestal-disc');
  const ambientGlow = document.getElementById('hero-ambient-glow');

  if (!stageCard || !heroImg) return;

  let currentIndex = 0;
  let isTransitioning = false;

  // DOM Elements for Dossier
  const elSecret = document.getElementById('hero-secret');
  const elTrack = document.getElementById('hero-track');
  const elName = document.getElementById('hero-name');
  const elTitle = document.getElementById('hero-title');
  const elLore = document.getElementById('hero-lore');
  const elQuote = document.getElementById('hero-quote');

  const valAgility = document.getElementById('stat-val-agility');
  const valCompute = document.getElementById('stat-val-compute');
  const valDefense = document.getElementById('stat-val-defense');

  const fillAgility = document.getElementById('stat-fill-agility');
  const fillCompute = document.getElementById('stat-fill-compute');
  const fillDefense = document.getElementById('stat-fill-defense');

  const chipButtons = document.querySelectorAll('.hero-chip-btn');
  const btnPrev = document.getElementById('hero-prev-btn');
  const btnNext = document.getElementById('hero-next-btn');

  const equipBtn = document.getElementById('equip-avatar-btn');
  const equipSuccessBadge = document.getElementById('equip-success-badge');
  const equipSuccessText = document.getElementById('equip-success-text');

  function renderHero(heroKey, animateDirection = 0) {
    if (isTransitioning) return;
    isTransitioning = true;

    const data = HERO_DATA[heroKey] || HERO_DATA.spiderman;
    currentIndex = HERO_KEYS.indexOf(heroKey);
    if (currentIndex === -1) currentIndex = 0;

    // 1. Update chip buttons active state
    chipButtons.forEach((btn) => {
      const isSelected = btn.getAttribute('data-hero') === heroKey;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      if (isSelected) {
        btn.style.borderColor = data.color;
        btn.style.boxShadow = `0 0 16px ${data.glow}`;
      } else {
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
      }
    });

    // 2. Animate Hero Image Transition
    const slideOutX = animateDirection * 40;
    const slideInX = -animateDirection * 40;

    gsap.to(heroImg, {
      opacity: 0,
      x: slideOutX,
      scale: 0.95,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        heroImg.src = data.image;
        heroImg.alt = data.name;

        gsap.fromTo(
          heroImg,
          { opacity: 0, x: slideInX, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.35,
            ease: 'back.out(1.5)',
            onComplete: () => {
              isTransitioning = false;
            }
          }
        );
      }
    });

    // 3. Update stage background glow & pedestal
    if (stageAura) {
      stageAura.style.background = data.glow;
    }
    if (pedestalDisc) {
      pedestalDisc.style.borderColor = data.color;
      pedestalDisc.style.boxShadow = `0 0 25px ${data.glow}`;
    }
    if (ambientGlow) {
      ambientGlow.style.background = `radial-gradient(circle at 30% 40%, ${data.glow} 0%, transparent 60%)`;
    }

    // 4. Update text dossier
    if (elSecret) elSecret.textContent = `IDENTITY: ${data.heroName}`;
    if (elTrack) elTrack.textContent = data.track;
    if (elName) {
      elName.textContent = data.name;
      elName.style.textShadow = `0 0 25px ${data.glow}`;
    }
    if (elTitle) elTitle.textContent = data.title;
    if (elLore) elLore.textContent = data.lore;
    if (elQuote) elQuote.textContent = data.quote;

    // 5. Update stats with smooth bar fill
    if (valAgility) valAgility.textContent = `${data.stats.agility}%`;
    if (valCompute) valCompute.textContent = `${data.stats.compute}%`;
    if (valDefense) valDefense.textContent = `${data.stats.defense}%`;

    if (fillAgility) fillAgility.style.width = `${data.stats.agility}%`;
    if (fillCompute) fillCompute.style.width = `${data.stats.compute}%`;
    if (fillDefense) fillDefense.style.width = `${data.stats.defense}%`;

    // 6. Reset equip badge if hero changed
    if (equipSuccessBadge) {
      equipSuccessBadge.classList.add('hidden');
    }
    const equipBtnText = document.getElementById('equip-avatar-btn-text');
    if (equipBtnText) {
      equipBtnText.textContent = `EQUIP AVATAR ON TICKET`;
    }
  }

  // Chip buttons click handlers
  chipButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playHoverClick();
      const heroKey = btn.getAttribute('data-hero');
      const targetIndex = HERO_KEYS.indexOf(heroKey);
      const direction = targetIndex >= currentIndex ? 1 : -1;
      renderHero(heroKey, direction);
    });
  });

  // Prev / Next button handlers
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      playHoverClick();
      const prevIndex = (currentIndex - 1 + HERO_KEYS.length) % HERO_KEYS.length;
      renderHero(HERO_KEYS[prevIndex], -1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      playHoverClick();
      const nextIndex = (currentIndex + 1) % HERO_KEYS.length;
      renderHero(HERO_KEYS[nextIndex], 1);
    });
  }

  // Keyboard navigation when stage is in view
  window.addEventListener('keydown', (e) => {
    const rect = stageCard.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + HERO_KEYS.length) % HERO_KEYS.length;
      renderHero(HERO_KEYS[prevIndex], -1);
    } else if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % HERO_KEYS.length;
      renderHero(HERO_KEYS[nextIndex], 1);
    }
  });

  // Interactive 3D Parallax Tilt on Hero Stage
  stageCard.addEventListener('mousemove', (e) => {
    if (!heroImageWrap) return;
    const rect = stageCard.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normX = (mouseX / rect.width - 0.5) * 2; // -1 to +1
    const normY = (mouseY / rect.height - 0.5) * 2; // -1 to +1

    const tiltX = normX * 8; // deg
    const tiltY = -normY * 5; // deg

    heroImageWrap.style.transform = `perspective(900px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) translateY(${normY * 4}px)`;
  });

  stageCard.addEventListener('mouseleave', () => {
    if (!heroImageWrap) return;
    heroImageWrap.style.transform = `perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px)`;
  });

  // Equip Avatar Button
  if (equipBtn) {
    equipBtn.addEventListener('click', () => {
      playSurgeSound();
      const currentHeroKey = HERO_KEYS[currentIndex];
      const data = HERO_DATA[currentHeroKey] || HERO_DATA.spiderman;

      try {
        localStorage.setItem('gfg_marvel_avatar', currentHeroKey);
      } catch (e) {
        console.debug(e);
      }

      if (equipSuccessBadge) {
        equipSuccessBadge.classList.remove('hidden');
      }
      if (equipSuccessText) {
        equipSuccessText.textContent = `✓ ${data.name} EQUIPPED ON OFFICIAL PASS`;
      }

      const equipBtnText = document.getElementById('equip-avatar-btn-text');
      if (equipBtnText) {
        equipBtnText.textContent = `AVATAR EQUIPPED: ${data.name}`;
      }

      window.dispatchEvent(
        new CustomEvent('hero-avatar-changed', {
          detail: { heroKey: currentHeroKey, hero: data }
        })
      );
    });
  }

  // Initial render (Spider-Man)
  renderHero('spiderman', 0);
}
