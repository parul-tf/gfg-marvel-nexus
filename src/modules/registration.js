/**
 * Registration & Quantum Ticket Generation Module
 * Strict @bennett.edu.in validation, client-side QR generation,
 * localStorage persistence, Marvel confetti burst, download PNG & print layouts.
 */
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { playSuccessFanfare, playHoverClick } from './soundFX.js';

const STORAGE_KEY = 'gfg_marvel_nexus_registrations';

const HERO_NAMES = {
  spiderman: 'Spider-Man (Peter Parker)',
  ironman: 'Iron Man (Tony Stark)',
  thor: 'Thor (God of Thunder)',
  captain: 'Captain America (Steve Rogers)',
  panther: 'Black Panther (Shuri)',
  scarlet: 'Scarlet Witch (Wanda)'
};

function getEquippedAvatar() {
  try {
    const key = localStorage.getItem('gfg_marvel_avatar') || 'spiderman';
    return {
      key,
      name: HERO_NAMES[key] || 'Spider-Man'
    };
  } catch (e) {
    return { key: 'spiderman', name: 'Spider-Man' };
  }
}

function showToast(message) {
  let toast = document.getElementById('event-toast-alert');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'event-toast-alert';
    toast.className = 'event-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>🛡️</span><span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

export function initRegistration() {
  const form = document.getElementById('registration-form');
  const nameInput = document.getElementById('reg-fullname');
  const enrollmentInput = document.getElementById('reg-enrollment');
  const branchSelect = document.getElementById('reg-branch');
  const yearSelect = document.getElementById('reg-year');
  const emailInput = document.getElementById('reg-email');
  const trackSelect = document.getElementById('reg-track');
  const modeSelect = document.getElementById('reg-mode');
  const squadInput = document.getElementById('reg-squad');
  const avatarNameEl = document.getElementById('reg-avatar-name');

  // Error & Feedback Elements
  const errorName = document.getElementById('error-fullname');
  const errorEnrollment = document.getElementById('error-enrollment');
  const errorBranch = document.getElementById('error-branch');
  const errorYear = document.getElementById('error-year');
  const errorEmail = document.getElementById('error-email');
  const errorTrack = document.getElementById('error-track');
  const successEmail = document.getElementById('success-email');

  // Ticket Elements
  const placeholderCard = document.getElementById('ticket-placeholder-card');
  const ticketCard = document.getElementById('marvel-ticket-card');
  const qrCanvas = document.getElementById('ticket-qr-canvas');

  // Display Elements
  const displayId = document.getElementById('t-display-id');
  const displayName = document.getElementById('t-display-name');
  const displayEnrollment = document.getElementById('t-display-enrollment');
  const displayDept = document.getElementById('t-display-dept');
  const displayEmail = document.getElementById('t-display-email');
  const displaySerial = document.getElementById('t-display-serial');
  const displayTrack = document.getElementById('t-display-track');
  const displayAvatar = document.getElementById('t-display-avatar');

  // Ticket Action Buttons
  const btnDownload = document.getElementById('btn-download-ticket');
  const btnCopy = document.getElementById('btn-copy-ticket');
  const btnPrint = document.getElementById('btn-print-ticket');
  const btnReset = document.getElementById('btn-reset-ticket');
  const btnViewStored = document.getElementById('btn-view-stored');
  const storedMsg = document.getElementById('stored-tickets-msg');

  // Modal elements
  const modal = document.getElementById('saved-tickets-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const savedList = document.getElementById('saved-tickets-list');

  if (!form || !emailInput) return;

  // Sync avatar display
  function updateAvatarSyncDisplay() {
    const av = getEquippedAvatar();
    if (avatarNameEl) avatarNameEl.textContent = av.name;
  }
  updateAvatarSyncDisplay();

  window.addEventListener('hero-avatar-changed', (e) => {
    updateAvatarSyncDisplay();
    if (e.detail && e.detail.hero && displayAvatar) {
      displayAvatar.textContent = e.detail.hero.name.toUpperCase();
    }
  });

  updateStoredTicketsCount();

  // -------------------------------------------------------------
  // Validation Logic
  // -------------------------------------------------------------
  function validateName() {
    const val = nameInput.value.trim();
    if (val.length < 2) {
      nameInput.classList.add('is-invalid');
      nameInput.classList.remove('is-valid');
      if (errorName) errorName.style.display = 'block';
      return false;
    }
    nameInput.classList.remove('is-invalid');
    nameInput.classList.add('is-valid');
    if (errorName) errorName.style.display = 'none';
    return true;
  }

  function validateEnrollment() {
    const val = enrollmentInput.value.trim();
    if (val.length < 5) {
      enrollmentInput.classList.add('is-invalid');
      enrollmentInput.classList.remove('is-valid');
      if (errorEnrollment) errorEnrollment.style.display = 'block';
      return false;
    }
    enrollmentInput.classList.remove('is-invalid');
    enrollmentInput.classList.add('is-valid');
    if (errorEnrollment) errorEnrollment.style.display = 'none';
    return true;
  }

  function validateBranch() {
    if (!branchSelect.value) {
      branchSelect.classList.add('is-invalid');
      branchSelect.classList.remove('is-valid');
      if (errorBranch) errorBranch.style.display = 'block';
      return false;
    }
    branchSelect.classList.remove('is-invalid');
    branchSelect.classList.add('is-valid');
    if (errorBranch) errorBranch.style.display = 'none';
    return true;
  }

  function validateYear() {
    if (!yearSelect.value) {
      yearSelect.classList.add('is-invalid');
      yearSelect.classList.remove('is-valid');
      if (errorYear) errorYear.style.display = 'block';
      return false;
    }
    yearSelect.classList.remove('is-invalid');
    yearSelect.classList.add('is-valid');
    if (errorYear) errorYear.style.display = 'none';
    return true;
  }

  function validateTrack() {
    if (!trackSelect || !trackSelect.value) {
      if (trackSelect) {
        trackSelect.classList.add('is-invalid');
        trackSelect.classList.remove('is-valid');
      }
      if (errorTrack) errorTrack.style.display = 'block';
      return false;
    }
    trackSelect.classList.remove('is-invalid');
    trackSelect.classList.add('is-valid');
    if (errorTrack) errorTrack.style.display = 'none';
    return true;
  }

  /**
   * STRICT EMAIL VALIDATION: Must strictly end with "@bennett.edu.in"
   */
  function validateEmail() {
    const val = emailInput.value.trim().toLowerCase();
    const bennettDomainRegex = /^[a-zA-Z0-9._%+-]+@bennett\.edu\.in$/;

    if (!bennettDomainRegex.test(val)) {
      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-valid');
      if (errorEmail) errorEmail.style.display = 'block';
      if (successEmail) successEmail.style.display = 'none';
      return false;
    }

    emailInput.classList.remove('is-invalid');
    emailInput.classList.add('is-valid');
    if (errorEmail) errorEmail.style.display = 'none';
    if (successEmail) successEmail.style.display = 'block';
    return true;
  }

  // Real-time blur & input listeners
  nameInput.addEventListener('blur', validateName);
  enrollmentInput.addEventListener('blur', validateEnrollment);
  branchSelect.addEventListener('change', validateBranch);
  yearSelect.addEventListener('change', validateYear);
  if (trackSelect) trackSelect.addEventListener('change', validateTrack);
  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('input', () => {
    if (emailInput.value.trim().endsWith('@bennett.edu.in')) {
      validateEmail();
    }
  });

  // -------------------------------------------------------------
  // Form Submission
  // -------------------------------------------------------------
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEnrollmentValid = validateEnrollment();
    const isBranchValid = validateBranch();
    const isYearValid = validateYear();
    const isTrackValid = validateTrack();
    const isEmailValid = validateEmail();

    if (!isNameValid || !isEnrollmentValid || !isBranchValid || !isYearValid || !isTrackValid || !isEmailValid) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Generate unique Ticket ID & Serial
    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ticketId = `AVN-NEXUS-${randomChars}`;
    const randomSerial = `SEC-616-${Math.floor(1000 + Math.random() * 9000)}-${randomChars.slice(0, 3)}`;
    const currentAvatar = getEquippedAvatar();

    const registrationData = {
      id: ticketId,
      serial: randomSerial,
      name: nameInput.value.trim(),
      enrollment: enrollmentInput.value.trim().toUpperCase(),
      branch: branchSelect.value,
      year: yearSelect.value,
      email: emailInput.value.trim().toLowerCase(),
      track: trackSelect ? trackSelect.value : 'Quantum AI & Neural Swarms',
      mode: modeSelect ? modeSelect.value : 'Solo Cadet',
      squad: squadInput ? squadInput.value.trim() : '',
      avatar: currentAvatar.name.split(' (')[0],
      timestamp: new Date().toISOString()
    };

    // Save to LocalStorage
    saveTicketToStorage(registrationData);

    // Render Ticket
    renderTicket(registrationData);

    // Play fanfare & Confetti Blast in Marvel Colors
    playSuccessFanfare();
    launchMarvelConfetti();
    showToast('✓ Registration Confirmed! S.H.I.E.L.D. Boarding Pass Issued.');
  });

  // -------------------------------------------------------------
  // Ticket Rendering & QR Generation
  // -------------------------------------------------------------
  function renderTicket(data) {
    if (displayName) displayName.textContent = data.name.toUpperCase();
    if (displayEnrollment) displayEnrollment.textContent = data.enrollment;
    const shortBranch = data.branch.split(' - ')[0] || data.branch;
    const shortYear = data.year.split(' ')[0] || data.year;
    if (displayDept) displayDept.textContent = `${shortBranch} // ${shortYear.toUpperCase()}`;
    if (displayEmail) displayEmail.textContent = data.email;
    if (displayId) displayId.textContent = data.id;
    if (displaySerial) displaySerial.textContent = data.serial;
    if (displayTrack) displayTrack.textContent = data.track ? data.track.toUpperCase() : 'QUANTUM AI & AGENTS';
    if (displayAvatar) displayAvatar.textContent = (data.avatar || 'SPIDER-MAN').toUpperCase();

    // Generate QR Code with attendee metadata
    if (qrCanvas) {
      const qrData = JSON.stringify({
        event: 'PROJECT_NEXUS_OFFICIAL_REGISTRATION',
        ticketId: data.id,
        attendee: data.name,
        enrollment: data.enrollment,
        email: data.email,
        track: data.track,
        avatar: data.avatar,
        clearance: 'EARTH-616_LEVEL-5'
      });

      QRCode.toCanvas(
        qrCanvas,
        qrData,
        {
          width: 130,
          margin: 1,
          color: {
            dark: '#0A0A0F',
            light: '#FFFFFF'
          }
        },
        (error) => {
          if (error) console.error('QR Generation Error:', error);
        }
      );
    }

    // Show ticket, hide placeholder
    if (placeholderCard) placeholderCard.classList.add('hidden');
    if (ticketCard) {
      ticketCard.classList.remove('hidden');
      ticketCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    updateStoredTicketsCount();
  }

  // -------------------------------------------------------------
  // Marvel Confetti Burst
  // -------------------------------------------------------------
  function launchMarvelConfetti() {
    const marvelColors = ['#ED1D24', '#FFD700', '#00F0FF', '#B026FF', '#FFFFFF'];

    // Left cannon
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 65,
      origin: { x: 0.1, y: 0.7 },
      colors: marvelColors
    });

    // Right cannon
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 65,
      origin: { x: 0.9, y: 0.7 },
      colors: marvelColors
    });

    // Center starburst
    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.6 },
        colors: marvelColors
      });
    }, 250);
  }

  // -------------------------------------------------------------
  // Ticket Actions: Download PNG & Print
  // -------------------------------------------------------------
  if (btnDownload) {
    btnDownload.addEventListener('click', async () => {
      playHoverClick();
      const ticketEl = document.getElementById('printable-ticket');
      if (!ticketEl) return;

      const origHtml = btnDownload.innerHTML;
      btnDownload.innerHTML = '<span class="btn-icon">⏳</span><span>GENERATING PNG...</span>';

      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        const canvas = await html2canvas(ticketEl, {
          backgroundColor: '#0E0F17',
          scale: 2.5,
          useCORS: true,
          allowTaint: false,
          logging: false,
          ignoreElements: (element) => {
            return element.classList && element.classList.contains('ticket-hologram-border');
          },
          onclone: (clonedDoc) => {
            const clonedTicket = clonedDoc.getElementById('printable-ticket');
            if (clonedTicket) {
              clonedTicket.style.border = '2px solid #ED1D24';
              clonedTicket.style.boxShadow = '0 0 30px rgba(237, 29, 36, 0.4)';
              const holo = clonedTicket.querySelector('.ticket-hologram-border');
              if (holo) holo.remove();

              // Synchronize QR code canvas buffer
              const liveQr = document.getElementById('ticket-qr-canvas');
              const clonedQr = clonedDoc.getElementById('ticket-qr-canvas');
              if (liveQr && clonedQr) {
                const ctx = clonedQr.getContext('2d');
                if (ctx) ctx.drawImage(liveQr, 0, 0);
              }
            }
          }
        });

        const passSerial = (displayId && displayId.textContent) ? displayId.textContent.trim() : 'AVN-PASS';
        const filename = `BENNETT_NEXUS_TICKET_${passSerial}.png`;

        // Multi-platform safe download using toBlob
        if (canvas.toBlob) {
          canvas.toBlob((blob) => {
            if (!blob) {
              const image = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = filename;
              link.href = image;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              showToast('✓ Ticket Pass Downloaded (PNG)!');
              return;
            }
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = blobUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
            showToast('✓ High-Resolution Ticket Pass Downloaded (PNG)!');
          }, 'image/png', 1.0);
        } else {
          const image = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = filename;
          link.href = image;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('✓ Ticket Pass Downloaded (PNG)!');
        }
      } catch (err) {
        console.error('Download error:', err);
        showToast('⚠️ Could not generate PNG. Please use Print Pass.');
      } finally {
        setTimeout(() => {
          btnDownload.innerHTML = origHtml;
        }, 1200);
      }
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', async () => {
      playHoverClick();
      const idToCopy = displayId ? displayId.textContent : 'AVN-NEXUS-8429';
      try {
        await navigator.clipboard.writeText(idToCopy);
        showToast(`✓ Clearance Pass ID ${idToCopy} copied to clipboard!`);
      } catch (err) {
        showToast(`Clearance ID: ${idToCopy}`);
      }
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      playHoverClick();
      printIsolatedTicket();
    });
  }

  function printIsolatedTicket() {
    const ticketEl = document.getElementById('printable-ticket');
    if (!ticketEl) {
      window.print();
      return;
    }

    const qrCanvas = document.getElementById('ticket-qr-canvas');
    let qrImgData = '';
    try {
      qrImgData = qrCanvas ? qrCanvas.toDataURL('image/png') : '';
    } catch (e) {
      console.warn('Canvas export warning:', e);
    }

    const passId = (displayId && displayId.textContent) ? displayId.textContent.trim() : 'AVN-NEXUS-PASS';

    // Remove any previous print iframe
    let printFrame = document.getElementById('marvel-print-iframe');
    if (printFrame) printFrame.remove();

    printFrame = document.createElement('iframe');
    printFrame.id = 'marvel-print-iframe';
    printFrame.setAttribute('style', 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;');
    document.body.appendChild(printFrame);

    // Deep clone ticket
    const clone = ticketEl.cloneNode(true);

    // Replace cloned canvas with high-res <img> to guarantee pixel preservation in print
    const clonedQrCanvas = clone.querySelector('#ticket-qr-canvas');
    if (clonedQrCanvas && qrImgData) {
      const qrImg = document.createElement('img');
      qrImg.src = qrImgData;
      qrImg.style.width = '130px';
      qrImg.style.height = '130px';
      qrImg.style.display = 'block';
      qrImg.style.margin = '0 auto';
      qrImg.alt = 'Entry QR Code';
      clonedQrCanvas.parentNode.replaceChild(qrImg, clonedQrCanvas);
    }

    // Remove holographic border animation overlay for clean paper contrast
    const holo = clone.querySelector('.ticket-hologram-border');
    if (holo) holo.remove();

    const frameWindow = printFrame.contentWindow;
    const frameDoc = frameWindow.document;

    frameDoc.open();
    frameDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PROJECT NEXUS PASS - ${passId}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Inter:wght@400;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: landscape;
      margin: 8mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      background: #08090E !important;
      color: #FFFFFF !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
    }
    .print-header-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 780px;
      margin-bottom: 12px;
      padding: 8px 14px;
      border: 1px solid rgba(237, 29, 36, 0.4);
      background: rgba(237, 29, 36, 0.08);
      border-radius: 8px;
    }
    .print-header-banner .tag {
      font-family: 'Orbitron', monospace, sans-serif;
      font-size: 10px;
      letter-spacing: 1.5px;
      color: #00F0FF;
      font-weight: 700;
    }
    .print-header-banner .notice {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      color: #FFD700;
      font-weight: 600;
    }
    .marvel-ticket {
      position: relative;
      display: grid;
      grid-template-columns: 1fr auto 200px;
      background: #0E0F17 !important;
      border-radius: 18px;
      box-shadow: none !important;
      overflow: hidden;
      border: 2px solid #ED1D24 !important;
      width: 780px;
      height: 440px;
    }
    .ticket-main-section {
      padding: 26px 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #0B0C14 !important;
    }
    .ticket-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      padding-bottom: 12px;
    }
    .ticket-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .ticket-logo-a {
      font-family: 'Cinzel', serif;
      font-size: 1.8rem;
      color: #ED1D24;
      background: rgba(237, 29, 36, 0.15);
      border: 1px solid #ED1D24;
      width: 36px;
      height: 36px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
    }
    .ticket-brand-text {
      display: flex;
      flex-direction: column;
    }
    .ticket-event-name {
      font-family: 'Cinzel', serif;
      font-size: 1.15rem;
      letter-spacing: 1px;
      color: #FFFFFF;
      font-weight: 800;
    }
    .ticket-sub {
      font-family: 'Orbitron', monospace;
      font-size: 0.55rem;
      letter-spacing: 1px;
      color: #8E92A4;
    }
    .ticket-clearance-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 255, 157, 0.1);
      border: 1px solid rgba(0, 255, 157, 0.5);
      padding: 4px 10px;
      border-radius: 999px;
    }
    .ticket-clearance-pill .pill-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00FF9D;
    }
    .ticket-clearance-pill .pill-txt {
      font-family: 'Orbitron', monospace;
      font-size: 0.58rem;
      letter-spacing: 1px;
      color: #00FF9D;
      font-weight: 700;
    }
    .ticket-attendee-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 18px;
    }
    .t-span-2 {
      grid-column: span 2;
    }
    .t-label {
      font-family: 'Orbitron', monospace;
      font-size: 0.55rem;
      letter-spacing: 1.5px;
      color: #8E92A4;
      margin-bottom: 2px;
    }
    .t-value {
      font-family: 'Orbitron', monospace;
      font-size: 0.85rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.5px;
    }
    .name-val {
      font-size: 1.3rem;
      color: #FFD700 !important;
      letter-spacing: 1.5px;
    }
    .email-val {
      color: #00F0FF !important;
      font-size: 0.82rem;
    }
    .gold-text {
      color: #FFD700 !important;
    }
    .ticket-bottom-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 10px;
    }
    .ticket-barcode-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .mock-barcode {
      width: 140px;
      height: 24px;
      background: repeating-linear-gradient(
        90deg,
        #fff 0,
        #fff 2px,
        transparent 2px,
        transparent 4px,
        #fff 4px,
        #fff 5px,
        transparent 5px,
        transparent 8px
      );
      opacity: 0.85;
    }
    .barcode-serial {
      font-family: 'Orbitron', monospace;
      font-size: 0.55rem;
      color: #8E92A4;
      letter-spacing: 1px;
    }
    .shield-watermark {
      font-family: 'Orbitron', monospace;
      font-size: 0.58rem;
      letter-spacing: 1.5px;
      color: #ED1D24;
      font-weight: 800;
      border: 1px solid #ED1D24;
      padding: 3px 8px;
      border-radius: 3px;
    }
    .ticket-perforation {
      position: relative;
      width: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #0B0C14 !important;
    }
    .notch-top {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #08090E !important;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .notch-bottom {
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #08090E !important;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .perf-dashed-line {
      height: 80%;
      border-left: 2px dashed rgba(255, 255, 255, 0.3);
    }
    .ticket-stub-section {
      position: relative;
      background: #0A0A10 !important;
      padding: 24px 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      width: 200px;
    }
    .stub-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 8px;
    }
    .stub-title {
      font-family: 'Orbitron', monospace;
      font-size: 0.65rem;
      letter-spacing: 1.5px;
      color: #FFFFFF;
      font-weight: 700;
    }
    .stub-status {
      font-family: 'Orbitron', monospace;
      font-size: 0.58rem;
      color: #00FF9D;
      font-weight: 700;
    }
    .stub-qr-container {
      width: 130px;
      height: 130px;
      background: #FFFFFF !important;
      padding: 4px;
      border-radius: 8px;
      border: 2px solid #ED1D24;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stub-id-block {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .stub-id-label {
      font-family: 'Orbitron', monospace;
      font-size: 0.55rem;
      letter-spacing: 1px;
      color: #8E92A4;
    }
    .stub-id-val {
      font-family: 'Orbitron', monospace;
      font-size: 0.85rem;
      font-weight: 800;
      color: #FFD700;
      letter-spacing: 1px;
    }
    .stub-watermark-a {
      position: absolute;
      bottom: -15px;
      right: 5px;
      font-family: 'Cinzel', serif;
      font-size: 5rem;
      font-weight: 900;
      color: rgba(237, 29, 36, 0.08);
      pointer-events: none;
      line-height: 1;
    }
    .print-footer-notice {
      margin-top: 14px;
      font-size: 9px;
      color: #8E92A4;
      text-align: center;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="print-header-banner">
    <span class="tag">🛡️ S.H.I.E.L.D. MULTIVERSE CLEARANCE PASS // GEEKSFORGEEKS BENNETT UNIVERSITY</span>
    <span class="notice">OFFICIAL EVENT ADMISSION PASS</span>
  </div>
  ${clone.outerHTML}
  <div class="print-footer-notice">
    Official Verified Admission Pass for Project Nexus • Bennett University Campus • Greater Noida
  </div>
</body>
</html>`);
    frameDoc.close();

    showToast('✓ Preparing Clean 1-Page Pass for Print...');

    setTimeout(() => {
      try {
        frameWindow.focus();
        frameWindow.print();
      } catch (err) {
        console.error('Iframe print error, falling back to window.print():', err);
        window.print();
      }
    }, 400);
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      playHoverClick();
      form.reset();
      nameInput.classList.remove('is-valid', 'is-invalid');
      enrollmentInput.classList.remove('is-valid', 'is-invalid');
      branchSelect.classList.remove('is-valid', 'is-invalid');
      yearSelect.classList.remove('is-valid', 'is-invalid');
      if (trackSelect) trackSelect.classList.remove('is-valid', 'is-invalid');
      if (errorTrack) errorTrack.style.display = 'none';
      emailInput.classList.remove('is-valid', 'is-invalid');
      if (successEmail) successEmail.style.display = 'none';

      if (ticketCard) ticketCard.classList.add('hidden');
      if (placeholderCard) placeholderCard.classList.remove('hidden');
    });
  }

  // -------------------------------------------------------------
  // Storage & Modal Vault
  // -------------------------------------------------------------
  function saveTicketToStorage(data) {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      existing.unshift(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 10)));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function getStoredTickets() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function updateStoredTicketsCount() {
    const list = getStoredTickets();
    if (storedMsg) {
      storedMsg.textContent = `${list.length} pass${list.length === 1 ? '' : 'es'} saved in browser vault.`;
    }
    // If there's an existing ticket and current card is hidden, we could render the latest
    if (list.length > 0 && placeholderCard && !placeholderCard.classList.contains('hidden')) {
      // keep placeholder until user registers or clicks to view
    }
  }

  if (btnViewStored && modal && savedList) {
    btnViewStored.addEventListener('click', () => {
      playHoverClick();
      const list = getStoredTickets();
      savedList.innerHTML = '';

      if (list.length === 0) {
        savedList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No passes saved yet.</p>';
      } else {
        list.forEach((t) => {
          const item = document.createElement('div');
          item.className = 'saved-ticket-item';
          item.innerHTML = `
            <div class="st-info">
              <h4>${t.name}</h4>
              <p>${t.id} // ${t.enrollment} // ${t.email}</p>
            </div>
            <div class="st-actions">
              <button class="st-view-btn" data-id="${t.id}">LOAD PASS</button>
            </div>
          `;
          savedList.appendChild(item);
        });

        savedList.querySelectorAll('.st-view-btn').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            const tid = e.target.getAttribute('data-id');
            const found = list.find((item) => item.id === tid);
            if (found) {
              renderTicket(found);
              modal.classList.add('hidden');
              modal.setAttribute('aria-hidden', 'true');
            }
          });
        });
      }

      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    });
  }

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    });
  }
}
