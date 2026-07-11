/* ===== JavaScript for Industrial Website ===== */

// ─── Navbar scroll effect ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
const backToTopBtn = document.getElementById('backToTop');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (navbar) {
    if (currentScrollY > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  lastScrollY = currentScrollY;

  // Back to top
  if (backToTopBtn) {
    if (currentScrollY > 500) backToTopBtn.classList.add('visible');
    else backToTopBtn.classList.remove('visible');
  }
});

// ─── Back to top ────────────────────────────────────────────────────
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Search bar toggle ──────────────────────────────────────────────
const searchBtn = document.getElementById('searchBtn');
const searchBar = document.getElementById('searchBar');
const closeSearch = document.getElementById('closeSearch');

if (searchBtn && searchBar) {
  searchBtn.addEventListener('click', () => {
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
      const inp = searchBar.querySelector('input');
      if (inp) inp.focus();
    }
  });
}
if (closeSearch && searchBar) {
  closeSearch.addEventListener('click', () => {
    searchBar.classList.remove('active');
  });
}

// ─── Mobile hamburger ───────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
}

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
  if (slides.length > 1) sliderInterval = setInterval(nextSlide, 5000);
}
if (slides.length) startSlider();

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

// ─── Contact form: AJAX submit to self-hosted lead API ─────────────
function bindContactForm(form) {
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit') || form.querySelector('button[type="submit"]');
    const original = btn ? btn.textContent : '提交需求 →';
    const feedback = form.querySelector('.form-feedback');
    const data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    if (btn) { btn.disabled = true; btn.textContent = '提交中…'; }
    if (feedback) { feedback.textContent = ''; feedback.style.color = ''; }
    fetch(form.getAttribute('action') || '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      return r.json().then(function (j) { return { status: r.status, j: j }; }).catch(function () { return { status: r.status, j: {} }; });
    }).then(function (res) {
      const j = res.j || {};
      if (res.status === 200 && j.ok) {
        if (btn) { btn.textContent = '✓ 提交成功，我们将尽快联系您！'; btn.style.background = '#22c55e'; }
        if (feedback) { feedback.textContent = '提交成功，感谢您的咨询！'; feedback.style.color = '#22c55e'; }
        form.reset();
        setTimeout(function () {
          if (btn) { btn.textContent = original; btn.style.background = ''; btn.disabled = false; }
          if (feedback) { feedback.textContent = ''; }
        }, 4000);
      } else {
        const msg = (j && j.error) ? j.error : '提交失败，请稍后重试或直接拨打 188 1190 6890';
        if (btn) { btn.disabled = false; btn.textContent = original; }
        if (feedback) { feedback.textContent = msg; feedback.style.color = '#ef4444'; }
      }
    }).catch(function () {
      if (btn) { btn.disabled = false; btn.textContent = original; }
      if (feedback) { feedback.textContent = '网络错误，请稍后重试或拨打 188 1190 6890'; feedback.style.color = '#ef4444'; }
    });
  });
}
document.querySelectorAll('.contact-form, .contact-form-full').forEach(bindContactForm);

// ─── Subscribe form submit feedback ────────────────────────────────
const subscribeForm = document.querySelector('.subscribe-form');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    if (!btn) return;
    btn.textContent = '✓ 订阅成功';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.textContent = '立即订阅';
      btn.style.background = '';
      this.reset();
    }, 2500);
  });
}

// ─── 防复制 / 防爬取保护 ───────────────────────────────────
(function() {
  /* 禁用右键菜单 */
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  /* 禁用开发者工具与保存快捷键 */
  document.addEventListener('keydown', function(e) {
    var k = e.key.toLowerCase();
    var ctrl = e.ctrlKey || e.metaKey;
    if (
      k === 'f12' ||
      (ctrl && e.shiftKey && (k === 'i' || k === 'j')) ||
      (ctrl && (k === 'u' || k === 's' || k === 'p'))
    ) {
      e.preventDefault();
      return false;
    }
    /* 非 input/textarea 中禁止 Ctrl+C/V/X/A */
    var tag = (e.target.tagName || '').toUpperCase();
    if (!['INPUT', 'TEXTAREA'].includes(tag) && ctrl && ['c', 'x', 'a'].includes(k)) {
      e.preventDefault();
      return false;
    }
  });

  /* 禁止图片拖拽 */
  document.addEventListener('dragstart', function(e) {
    if (e.target && e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });

  /* 禁用 selectstart（鼠标拖动选中文本） */
  document.addEventListener('selectstart', function(e) {
    var tag = (e.target.tagName || '').toUpperCase();
    if (!['INPUT', 'TEXTAREA', 'PRE', 'CODE'].includes(tag)) {
      e.preventDefault();
      return false;
    }
  });

  /* 禁用 beforecopy（复制前事件） */
  document.addEventListener('beforecopy', function(e) {
    e.preventDefault();
    return false;
  });

  /* 禁用打印预览 */
  window.addEventListener('beforeprint', function(e) {
    e.preventDefault();
    window.print = function() {};
    return false;
  });

  /* 检测开发者工具（窗口尺寸差） */
  var devToolsOpen = false;
  function checkDevTools() {
    var w = window.outerWidth - window.innerWidth;
    var h = window.outerHeight - window.innerHeight;
    if (w > 200 || h > 200) {
      if (!devToolsOpen) {
        devToolsOpen = true;
        console.clear();
        console.log('%c', 'font-size:0');
      }
    } else {
      devToolsOpen = false;
    }
  }
  setInterval(checkDevTools, 500);

  /* 禁止 iframe 嵌套（防止被第三方站点嵌入抓取） */
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }

  /* 为所有图片添加 draggable=false */
  var imgs = document.querySelectorAll('img');
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].setAttribute('draggable', 'false');
  }
})();
