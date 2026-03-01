/* ===================================================
   Be Your Own AI — Main Site JS
   =================================================== */

// ── Intersection Observer: fade-in on scroll ──────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
fadeEls.forEach(el => observer.observe(el));

// ── Accordion curriculum ─────────────────────────────────────────────
function toggleModule(header) {
  const body = header.nextElementSibling;
  const arrow = header.querySelector('.module-meta span:last-child');
  const isOpen = body.classList.contains('open');
  // Close all
  document.querySelectorAll('.module-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.module-meta span:last-child').forEach(a => (a.textContent = '▾'));
  // Open clicked if it was closed
  if (!isOpen) {
    body.classList.add('open');
    if (arrow) arrow.textContent = '▴';
  }
}

// ── Voice: Web Speech API ─────────────────────────────────────────────
let voiceActive = false;

function speakTagline() {
  if (!('speechSynthesis' in window)) {
    showToast('⚠️ Your browser does not support speech synthesis.', 'error');
    return;
  }

  // If already speaking, stop
  if (voiceActive) {
    window.speechSynthesis.cancel();
    voiceActive = false;
    document.getElementById('voiceBtn').classList.remove('speaking');
    return;
  }

  const phrases = [
    'Be your own AI.',
    'Welcome to Be Your Own AI — the course that transforms the way you think, code, and create.',
    'Stop waiting for answers. Start generating them. Be your own AI.',
  ];

  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  // Pick a pleasant voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.startsWith('en') && /female|woman|zira|samantha|karen/i.test(v.name))
    || voices.find(v => v.lang.startsWith('en'))
    || voices[0];
  if (preferred) utterance.voice = preferred;

  utterance.onstart = () => {
    voiceActive = true;
    document.getElementById('voiceBtn').classList.add('speaking');
  };
  utterance.onend = utterance.onerror = () => {
    voiceActive = false;
    document.getElementById('voiceBtn').classList.remove('speaking');
  };

  window.speechSynthesis.speak(utterance);
}

// Ensure voices are loaded for browsers that load them async
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// ── Payment / Enrollment Modal ────────────────────────────────────────
// Free access code (owner can use this)
const FREE_ACCESS_CODE = 'BEYOUROWNAI';

function openPaymentModal() {
  document.getElementById('paymentModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
  document.getElementById('paymentModal').classList.remove('open');
  document.body.style.overflow = '';
  resetModal();
}

function resetModal() {
  document.getElementById('checkoutForm').style.display = 'block';
  document.getElementById('freeAccessGranted').style.display = 'none';
  document.getElementById('promoMsg').textContent = '';
  document.getElementById('promoMsg').style.color = '';
  document.getElementById('orderPrice').textContent = '$39.00';
  document.getElementById('payBtn').textContent = '🔒 Pay $39 & Enroll';
  document.getElementById('cardSection').style.display = 'block';
  const code = document.getElementById('promoCode');
  if (code) code.value = '';
}

// Close modal on backdrop click
document.getElementById('paymentModal').addEventListener('click', function (e) {
  if (e.target === this) closePaymentModal();
});

// Close on Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closePaymentModal();
});

let promoApplied = false;

function togglePromo() {
  const row = document.getElementById('promoRow');
  row.style.display = row.style.display === 'none' ? 'flex' : 'none';
}

function applyPromo() {
  const code = document.getElementById('promoCode').value.trim().toUpperCase();
  const msg = document.getElementById('promoMsg');
  if (code === FREE_ACCESS_CODE) {
    promoApplied = true;
    msg.textContent = '✅ Free access code accepted! No payment needed.';
    msg.style.color = 'var(--success)';
    document.getElementById('cardSection').style.display = 'none';
    document.getElementById('orderPrice').textContent = 'FREE';
    document.getElementById('payBtn').textContent = '🎉 Claim Free Access';
    document.getElementById('orderSummary').querySelector('strong').textContent = 'FREE';
  } else if (code === '') {
    msg.textContent = 'Please enter a code.';
    msg.style.color = 'var(--danger)';
  } else {
    msg.textContent = '❌ Invalid code. Please try again.';
    msg.style.color = 'var(--danger)';
  }
}

function grantAccess() {
  localStorage.setItem('byoa_access', 'granted');
  const name = document.getElementById('studentName').value.trim() || 'Student';
  localStorage.setItem('byoa_student_name', name);
}

function processPayment() {
  const name = document.getElementById('studentName').value.trim();
  const email = document.getElementById('studentEmail').value.trim();

  if (!name) { showToast('Please enter your name.', 'error'); return; }
  if (!email || !email.includes('@')) { showToast('Please enter a valid email.', 'error'); return; }

  if (promoApplied) {
    // Free access
    localStorage.setItem('byoa_access', 'granted');
    localStorage.setItem('byoa_student_name', name);
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('freeAccessGranted').style.display = 'block';
    return;
  }

  // Stripe payment flow.
  // IMPORTANT: Raw card fields are only used for UI validation and are passed
  // to simulateStripeCharge() — a local stub that never transmits card data.
  // In production, replace simulateStripeCharge() with Stripe.js tokenization:
  // stripe.createToken(cardElement) → send only the token to your backend.
  const cardNum = document.getElementById('cardNumber').value.replace(/\s/g, '');
  const expiry = document.getElementById('cardExpiry').value.trim();
  const cvc = document.getElementById('cardCvc').value.trim();

  if (cardNum.length < 13) { showToast('Please enter a valid card number.', 'error'); return; }
  if (!expiry) { showToast('Please enter your card expiry.', 'error'); return; }
  if (!cvc || cvc.length < 3) { showToast('Please enter a valid CVC.', 'error'); return; }

  // Simulate Stripe tokenization and charge
  const btn = document.getElementById('payBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Processing…';

  simulateStripeCharge({ name, email, cardNum, expiry, cvc, amount: 3900 })
    .then(() => {
      localStorage.setItem('byoa_access', 'granted');
      localStorage.setItem('byoa_student_name', name);
      btn.disabled = false;
      document.getElementById('checkoutForm').style.display = 'none';
      document.getElementById('freeAccessGranted').style.display = 'block';
      document.getElementById('freeAccessGranted').querySelector('h3').textContent = 'Payment Successful! 🎉';
      document.getElementById('freeAccessGranted').querySelector('p').textContent =
        `Thank you, ${name}! A confirmation will be sent to ${email}. You now have full access.`;
    })
    .catch((err) => {
      btn.disabled = false;
      btn.textContent = '🔒 Pay $39 & Enroll';
      showToast(err.message || 'Payment failed. Please try again.', 'error');
    });
}

/**
 * Simulates a Stripe charge.
 * In production, replace this with a real Stripe.js + backend endpoint call.
 * See: https://stripe.com/docs/payments/accept-a-payment
 */
function simulateStripeCharge({ name, email, cardNum, amount }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Decline a specific test card to show error handling
      if (cardNum === '4000000000000002') {
        reject(new Error('Your card was declined. Please use a different card.'));
      } else {
        resolve({ id: 'pi_test_' + Math.random().toString(36).slice(2), amount, email, name });
      }
    }, 1800);
  });
}

// Format card number with spaces
const cardInput = document.getElementById('cardNumber');
if (cardInput) {
  cardInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 16);
    this.value = v.replace(/(.{4})/g, '$1 ').trim();
  });
}
const expiryInput = document.getElementById('cardExpiry');
if (expiryInput) {
  expiryInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
    this.value = v;
  });
}

// ── Star Rating ───────────────────────────────────────────────────────
const userStarsContainer = document.getElementById('userStars');
if (userStarsContainer) {
  const stars = userStarsContainer.querySelectorAll('.star');

  stars.forEach((star, i) => {
    star.addEventListener('mouseenter', () => highlightStars(stars, i));
    star.addEventListener('mouseleave', () => {
      const saved = parseInt(localStorage.getItem('byoa_rating') || '0');
      highlightStars(stars, saved - 1);
    });
    star.addEventListener('click', () => submitRating(stars, i + 1));
    star.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); submitRating(stars, i + 1); }
    });
  });

  // Restore saved rating
  const saved = parseInt(localStorage.getItem('byoa_rating') || '0');
  if (saved > 0) {
    highlightStars(stars, saved - 1);
    document.getElementById('ratingThanks').style.display = 'block';
  }
}

function highlightStars(stars, upTo) {
  stars.forEach((s, i) => {
    s.classList.toggle('active', i <= upTo);
    s.classList.toggle('hover', false);
  });
}

function submitRating(stars, value) {
  localStorage.setItem('byoa_rating', value);
  highlightStars(stars, value - 1);
  document.getElementById('ratingThanks').style.display = 'block';
  showToast(`You rated this course ${value} star${value > 1 ? 's' : ''}! ⭐`, 'success');
}

// ── Toast notifications ───────────────────────────────────────────────
let toastTimeout;
function showToast(message, type = 'info') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Auto-play voice greeting on page load (once per session) ──────────
window.addEventListener('load', () => {
  if (!sessionStorage.getItem('byoa_greeted')) {
    sessionStorage.setItem('byoa_greeted', '1');
    // Small delay to allow voices to load
    setTimeout(() => {
      if ('speechSynthesis' in window) {
        const greet = new SpeechSynthesisUtterance('Be your own AI. Welcome!');
        greet.rate = 0.9;
        greet.pitch = 1.1;
        greet.volume = 0.8;
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(x => x.lang.startsWith('en') && /female|woman|zira|samantha|karen/i.test(x.name))
          || voices.find(x => x.lang.startsWith('en'));
        if (v) greet.voice = v;
        window.speechSynthesis.speak(greet);
      }
    }, 1200);
  }
});
