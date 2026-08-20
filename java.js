// ============================================
// Amanda Melo — Portfólio
// script.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  setupMobileNav();
  setupScrollReveal();
  setupTimelineProgress();
});

/* Ano dinâmico no rodapé */
function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* Menu responsivo (mobile) */
function setupMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // fecha o menu ao clicar em um link (mobile)
  menu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Revelação suave dos elementos ao entrar na viewport */
function setupScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/*
  Trilha de evolução: a barra de progresso e os nós acendem
  conforme o usuário rola a seção "Minha evolução", representando
  a jornada de aprendizado descrita no conteúdo.
*/
function setupTimelineProgress() {
  const timeline = document.getElementById('timeline');
  const progress = document.getElementById('timelineProgress');
  const nodes = document.querySelectorAll('.timeline-item');
  if (!timeline || !progress || !nodes.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    progress.style.height = '100%';
    nodes.forEach((n) => n.classList.add('is-active'));
    return;
  }

  function updateProgress() {
    const rect = timeline.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // progresso de 0 a 1 conforme a timeline atravessa a viewport
    const start = viewportH * 0.8;
    const end = rect.height - viewportH * 0.3;
    const scrolled = start - rect.top;
    const ratio = Math.min(Math.max(scrolled / (end + start), 0), 1);

    progress.style.height = `${ratio * 100}%`;

    nodes.forEach((node) => {
      const nodeRect = node.getBoundingClientRect();
      const nodeCenter = nodeRect.top + nodeRect.height / 2;
      if (nodeCenter < viewportH * 0.75) {
        node.classList.add('is-active');
      } else {
        node.classList.remove('is-active');
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateProgress();
}