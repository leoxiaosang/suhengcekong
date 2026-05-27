/* ===== JavaScript for Industrial Website ===== */

// ─── Navbar scroll effect ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = currentScrollY;

  // Back to top
  const btn = document.getElementById('backToTop');
  if (currentScrollY > 500) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
});

// ─── Back to top ────────────────────────────────────────────────────
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Search bar toggle ──────────────────────────────────────────────
const searchBtn = document.getElementById('searchBtn');
const searchBar = document.getElementById('searchBar');
const closeSearch = document.getElementById('closeSearch');

searchBtn.addEventListener('click', () => {
  searchBar.classList.toggle('active');
  if (searchBar.classList.contains('active')) {
    searchBar.querySelector('input').focus();
  }
});
closeSearch.addEventListener('click', () => {
  searchBar.classList.remove('active');
});

// ─── Mobile hamburger ───────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Mobile: toggle sub-menus
document.querySelectorAll('.nav-item.has-dropdown > a, .nav-item.has-mega > a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const parent = link.parentElement;
      parent.classList.toggle('open');
    }
  });
});

// ─── Hero slider ────────────────────────────────────────────────────
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let sliderInterval;

function goToSlide(idx) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = idx;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide((currentSlide + 1) % slides.length);
}

function startSlider() {
  sliderInterval = setInterval(nextSlide, 5000);
}
startSlider();

dots.forEach((dot, idx) => {
  dot.addEventListener('click', () => {
    clearInterval(sliderInterval);
    goToSlide(idx);
    startSlider();
  });
});

// ─── Counter animation ──────────────────────────────────────────────
function animateCounter(el, target, suffix, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const update = () => {
    start = Math.min(start + step, target);
    const display = target >= 1000 ? Math.round(start).toLocaleString() : Math.round(start);
    el.textContent = display;
    if (start < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ─── Scroll reveal ──────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

// ─── Stats counter observer ─────────────────────────────────────────
let countersStarted = false;
const statsSection = document.querySelector('.stats-section');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      document.querySelectorAll('.stat-item').forEach(item => {
        const countEl = item.querySelector('.count');
        const target = parseInt(item.dataset.count);
        if (countEl && target) {
          animateCounter(countEl, target, item.dataset.suffix || '', 1800);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (statsSection) statsObserver.observe(statsSection);

// ─── Init reveal on load ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Add reveal class to sections
  const revealTargets = [
    '.section-header',
    '.solution-card',
    '.news-card',
    '.stat-item',
    '.contact-item',
    '.global-text',
    '.global-map',
    '.footer-col',
  ];
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      el.classList.add('reveal');
      if (idx % 4 === 1) el.classList.add('reveal-delay-1');
      if (idx % 4 === 2) el.classList.add('reveal-delay-2');
      if (idx % 4 === 3) el.classList.add('reveal-delay-3');
      revealObserver.observe(el);
    });
  });

  // Smooth active nav link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item > a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.parentElement.classList.remove('active-nav');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.parentElement.classList.add('active-nav');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));
});

// ─── Contact form submit feedback ──────────────────────────────────
document.querySelector('.contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('.btn-submit');
  const original = btn.textContent;
  btn.textContent = '✓ 提交成功，我们将尽快联系您！';
  btn.style.background = '#22c55e';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.disabled = false;
    this.reset();
  }, 3500);
});

// ─── Subscribe form submit feedback ────────────────────────────────
document.querySelector('.subscribe-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button');
  btn.textContent = '✓ 订阅成功';
  btn.style.background = '#22c55e';
  setTimeout(() => {
    btn.textContent = '立即订阅';
    btn.style.background = '';
    this.reset();
  }, 2500);
});
