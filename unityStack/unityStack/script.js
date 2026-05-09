
// ─── PAGE NAVIGATION ─────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(observeFadeIns, 100);
}

// ─── MOBILE MENU ─────────────────────────────
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}
function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ─── NAV SCROLL ──────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── FAQ TOGGLE ──────────────────────────────
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ─── PORTFOLIO FILTER ────────────────────────
function filterPortfolio(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.portfolio-item').forEach(item => {
    if (cat === 'all' || item.dataset.cat === cat) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// ─── FORM SUBMIT → WHATSAPP REDIRECT ─────────

const YOUR_WHATSAPP = '2347047548830';

function submitForm() {
  const fname    = document.getElementById('fname').value.trim();
  const lname    = document.getElementById('lname').value.trim();
  const femail   = document.getElementById('femail').value.trim();
  const fphone   = document.getElementById('fphone').value.trim();
  const forg     = document.getElementById('forg').value.trim();
  const fservice = document.getElementById('fservice').value;
  const fbudget  = document.getElementById('fbudget').value;
  const fmessage = document.getElementById('fmessage').value.trim();

  // ── Validation ──────────────────────────────
  if (!fname || !femail || !fservice || !fmessage) {
    showToast('⚠️ Please fill in all required fields.', false);
    return;
  }
  if (!femail.includes('@')) {
    showToast('⚠️ Please enter a valid email address.', false);
    return;
  }

  // ── Build the WhatsApp message ───────────────
  const msg = [
    '👋 *New Project Inquiry — UnityStack*',
    '',
    `👤 *Name:* ${fname} ${lname}`,
    `📧 *Email:* ${femail}`,
    fphone   ? `📞 *Phone:* ${fphone}`           : null,
    forg     ? `🏢 *Organization:* ${forg}`       : null,
    `🛠️ *Service Needed:* ${fservice}`,
    fbudget  ? `💰 *Budget Range:* ${fbudget}`    : null,
    '',
    `📝 *Project Details:*`,
    fmessage,
    '',
    '_Sent via unitystack.netlify.app contact form_'
  ].filter(line => line !== null).join('\n');

  const encoded = encodeURIComponent(msg);
  const waURL   = `https://wa.me/${YOUR_WHATSAPP}?text=${encoded}`;

  // ── Show toast, clear form, open WhatsApp ───
  showToast('✅ Opening WhatsApp with your message...');

  ['fname','lname','femail','fphone','forg','fservice','fbudget','fmessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  setTimeout(() => window.open(waURL, '_blank'), 800);
}

function showToast(msg, success = true) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.style.borderColor = success ? 'rgba(124,58,237,0.4)' : 'rgba(239,68,68,0.4)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ─── FADE-IN OBSERVER ────────────────────────
function observeFadeIns() {
  const els = document.querySelectorAll('.page.active .fade-in:not(.visible)');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
  } else {
    els.forEach(el => el.classList.add('visible'));
  }
}


// ─── DARK / LIGHT MODE TOGGLE ────────────────
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem('dht-theme', isLight ? 'light' : 'dark');
  updateThemeIcon(isLight);
  showToast(isLight ? '☀️ Light mode on' : '🌙 Dark mode on');
}

function updateThemeIcon(isLight) {
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = isLight ? '🌙' : '☀️';
}

// INIT
window.addEventListener('load', () => {
  // Restore saved theme preference
  const saved = localStorage.getItem('dht-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useLightMode = saved === 'light' || (!saved && !prefersDark);
  if (useLightMode) {
    document.documentElement.classList.add('light');
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }

  observeFadeIns();
  document.querySelector('.page.active .fade-in') && observeFadeIns();
  // Wire direct WhatsApp button to the same number
  const waBtn = document.getElementById('waDirectBtn');
  if (waBtn) waBtn.href = `https://wa.me/${YOUR_WHATSAPP}`;
});
document.addEventListener('scroll', () => observeFadeIns(), { passive: true });
