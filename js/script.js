/* ══════════════════════════════════════════════
   PACIFIC OFF ROAD GARAGE — script.js
   ══════════════════════════════════════════════ */

const WA_NUMBER = '523221003855';
const WEB3FORMS_KEY = 'TU_ACCESS_KEY_WEB3FORMS'; // Reemplaza con tu clave de web3forms.com

async function sendEmailNotification(interestMsg) {
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: '¡Nuevo interesado en Pacific Off Road Garage!',
        from_name: 'Sitio Web Pacific Off Road',
        message: `Alguien hizo clic en el sitio web mostrando interés.\n\nDetalle: ${interestMsg}\n\nRevisa tu WhatsApp para ver el mensaje del cliente.`
      })
    });
  } catch (e) {
    // No interrumpir la experiencia del usuario si el email falla
  }
}

function openWhatsApp(message) {
  sendEmailNotification(message);
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

/* ─── NAVBAR scroll effect ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── Mobile nav toggle ─── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── Reveal on scroll ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ─── Animated counters ─── */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count, 10));
      });
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

/* ─── Hero particles ─── */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${60 + Math.random() * 40}%;
      width: ${1 + Math.random() * 3}px;
      height: ${1 + Math.random() * 3}px;
      animation-duration: ${4 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 6}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ─── Inventory filter ─── */
const filterBtns = document.querySelectorAll('.filter-btn');
const vehicleCards = document.querySelectorAll('.vehicle-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    vehicleCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      card.style.opacity    = show ? '1' : '0';
      card.style.transform  = show ? 'scale(1)' : 'scale(0.92)';
      card.style.pointerEvents = show ? 'all' : 'none';
      card.style.display    = show ? '' : 'none';
      if (show) {
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
      }
    });
  });
});

/* ─── Contact form → WhatsApp ─── */
function submitToWhatsApp(e) {
  e.preventDefault();
  const name    = document.getElementById('contactName').value.trim();
  const phone   = document.getElementById('contactPhone').value.trim();
  const service = document.getElementById('contactService').value;
  const msg     = document.getElementById('contactMsg').value.trim();

  const waMsg = `¡Hola Pacific Off Road Garage! 👋\n\n*Nombre:* ${name}\n*Teléfono:* ${phone}\n*Interés:* ${service}${msg ? `\n*Mensaje:* ${msg}` : ''}\n\nMe contacté desde su sitio web.`;
  openWhatsApp(waMsg);
}

/* ─── Chatbot widget ─── */
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotBubble = document.getElementById('chatbotBubble');
const chatbotClose  = document.getElementById('chatbotClose');
const chatbotNotif  = document.getElementById('chatbotNotif');
const toggleOpen    = chatbotToggle.querySelector('.toggle-open');
const toggleClose   = chatbotToggle.querySelector('.toggle-close');

let chatOpen = false;

function openChat() {
  chatOpen = true;
  chatbotBubble.classList.add('open');
  toggleOpen.style.display  = 'none';
  toggleClose.style.display = 'flex';
  chatbotNotif.style.display = 'none';
}

function closeChat() {
  chatOpen = false;
  chatbotBubble.classList.remove('open');
  toggleOpen.style.display  = 'flex';
  toggleClose.style.display = 'none';
}

chatbotToggle.addEventListener('click', () => chatOpen ? closeChat() : openChat());
chatbotClose.addEventListener('click', closeChat);

/* auto-open after 5s on first visit */
if (!sessionStorage.getItem('chatOpened')) {
  setTimeout(() => {
    if (!chatOpen) openChat();
    sessionStorage.setItem('chatOpened', '1');
  }, 5000);
}

/* ─── Smooth active nav link on scroll ─── */
const sections = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--orange)' : '';
      });
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('#servicios, #inventario, #accesorios, #nosotros, #contacto')
  .forEach(s => navObserver.observe(s));
