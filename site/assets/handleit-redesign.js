(() => {
  'use strict';

  // Mobile navigation: collapses after a section is selected.
  const menuButton = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation menu');
      });
    });
  }

  // Manual-only slides preserve user's intent and avoid motion while reading.
  const slides = [...document.querySelectorAll('[data-slide]')];
  const dots = [...document.querySelectorAll('[data-slide-to]')];
  const count = document.querySelector('.showcase-count');
  const category = document.getElementById('carousel-category');
  const caption = document.getElementById('carousel-caption');
  const slideLabels = [
    ['THE VISION', 'Introducing HandleIT Business Essentials'],
    ['THE PHILOSOPHY', 'Own the Yoke. Graze where you want.']
  ];
  let active = 0;
  function showSlide(n) {
    if (!slides.length) return;
    active = (n + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.hidden = i !== active);
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === active);
      dot.setAttribute('aria-current', i === active ? 'true' : 'false');
    });
    if (count) count.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    if (category) category.textContent = slideLabels[active][0];
    if (caption) caption.textContent = slideLabels[active][1];
  }
  document.getElementById('prev-slide')?.addEventListener('click', () => showSlide(active - 1));
  document.getElementById('next-slide')?.addEventListener('click', () => showSlide(active + 1));
  dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slideTo))));
  document.getElementById('hero-carousel')?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      showSlide(active + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });
  showSlide(0);

  // Demonstration dashboard. No live operational claims or API calls.
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const views = [...document.querySelectorAll('[data-dashboard-view]')];
  function setDashboardTab(name, focus = false) {
    tabs.forEach(tab => {
      const selected = tab.dataset.tab === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    views.forEach(view => view.hidden = view.dataset.dashboardView !== name);
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setDashboardTab(tab.dataset.tab));
    tab.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const next = tabs[(i + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        setDashboardTab(next.dataset.tab, true);
      }
    });
  });
  setDashboardTab('overview');

  // Functional contact form without pretending to have a backend.
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const interest = String(data.get('interest') || '').trim();
    const message = String(data.get('message') || '').trim();
    const body = `Hello HandleIT,\n\nI'd like to learn about an early-access business setup.\n\nName: ${name}\nEmail: ${email}\nInterested in: ${interest}\n\nAbout my business:\n${message || '(Not specified)'}\n\nPlease contact me about the next steps.`;
    window.location.href = `mailto:info@handleit.online?subject=${encodeURIComponent('HandleIT Business Setup Inquiry - ' + name)}&body=${encodeURIComponent(body)}`;
  });
})();
