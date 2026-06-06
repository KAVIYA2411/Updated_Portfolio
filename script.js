'use strict';

// CUSTOM CURSOR 
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let isHovering = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth follower animation
function animateFollower() {
  followerX += (mouseX - followerX) * 0.14;
  followerY += (mouseY - followerY) * 0.14;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Hover effects on interactive elements
const hoverTargets = document.querySelectorAll(
  'a, button, .proj-card, .skill-pill, .info-card, .cert-item, .contact-row, .role-tag'
);
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    follower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    follower.classList.remove('hover');
  });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity  = '0';
  follower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity  = '1';
  follower.style.opacity = '1';
});

// NAVBAR 
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Scroll: add scrolled class + active nav link
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// SCROLL REVEAL 
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// HERO ROLE CYCLE 
const roles = [
  'Full Stack Developer',
  'React Developer',
  'Java Developer',
  'MERN Developer',
  'JS Developer',
  'Backend Developer'
];
let roleIndex = 0;
const roleCycleEl = document.getElementById('roleCycle');

function typeRole(text, cb) {
  let i = 0;
  roleCycleEl.textContent = '';
  const typing = setInterval(() => {
    roleCycleEl.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(typing);
      setTimeout(cb, 1800);
    }
  }, 55);
}

function eraseRole(cb) {
  const text = roleCycleEl.textContent;
  let i = text.length;
  const erasing = setInterval(() => {
    roleCycleEl.textContent = text.slice(0, i - 1);
    i--;
    if (i <= 0) { clearInterval(erasing); cb(); }
  }, 35);
}

function cycleRoles() {
  roleIndex = (roleIndex + 1) % roles.length;
  eraseRole(() => typeRole(roles[roleIndex], cycleRoles));
}

// Start cycle after 2 seconds
setTimeout(() => typeRole(roles[0], cycleRoles), 2000);

// ANIMATED COUNTER
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// PROJECT FILTER 
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards  = document.querySelectorAll('.proj-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projCards.forEach(card => {
      const cats = (card.dataset.category || '').split(' ');
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
        // Re-trigger reveal animation
        card.classList.remove('in-view');
        setTimeout(() => card.classList.add('in-view'), 50);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

//SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.offsetTop - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

//SKILL PILL HOVER GLOW 
document.querySelectorAll('.skill-pill.tier-1').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    pill.style.boxShadow = '0 0 16px rgba(240,165,0,0.2)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.boxShadow = '';
  });
});

// PROJECT CARD TILT
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const maxTilt = 4;
    card.style.transform = `translateY(-4px) rotateX(${-dy * maxTilt}deg) rotateY(${dx * maxTilt}deg)`;
    card.style.transition = 'box-shadow 0.25s, border-color 0.25s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.25s ease';
  });
});

// CONTACT ROW HOVER
document.querySelectorAll('.contact-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.style.paddingLeft = '28px';
  });
  row.addEventListener('mouseleave', () => {
    row.style.paddingLeft = '';
  });
});

// PAGE LOAD ANIMATION 
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});

// KEYBOARD ACCESSIBILITY 
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('focus', () => {
    cursor.style.opacity  = '0';
    follower.style.opacity = '0';
  });
  el.addEventListener('blur', () => {
    cursor.style.opacity  = '1';
    follower.style.opacity = '1';
  });
});