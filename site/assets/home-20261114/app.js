(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const menu = $('.menu-button');
  const navigation = $('#main-nav');
  function closeNavigation() {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  }
  menu.addEventListener('click', () => {
    const isOpen = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!isOpen));
    menu.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });
  $$('#main-nav a').forEach(link => link.addEventListener('click', closeNavigation));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeNavigation(); menu.focus();
    }
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', closeNavigation);

  // All Command rows are deliberately local sample data, never a live status feed.
  const miniIcons = {
    post: '<path d="m3 11 13-5v14L3 15Zm13-1h2a3 3 0 0 1 0 6h-2M6 16l2 6h3l-2-5"/>',
    web: '<rect x="2" y="3" width="20" height="17" rx="2"/><path d="M2 8h20M6 5.5h.01M9 5.5h.01M8 13h8M8 16h5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18m-13 5 3 3 5-5"/>',
    chat: '<path d="M21 11a9 9 0 0 1-9 9 9 9 0 0 1-4-1l-5 2 2-5a9 9 0 1 1 16-5Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>'
  };
  function miniIcon(name) {
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${miniIcons[name]}</svg>`;
  }
  let approvedInDemo = false;
  let activeTab = 'attention';
  function rowsFor(tab) {
    if (tab === 'attention') return [
      { icon: 'post', title: approvedInDemo ? 'Social post approved in demo' : 'Your next social post', detail: approvedInDemo ? 'Sample only · nothing published' : 'Draft prepared · waiting for your say', action: approvedInDemo ? '' : 'review', status: approvedInDemo ? 'Approved' : '' },
      { icon: 'web', title: 'A website update to review', detail: 'Service details · sample draft', action: 'website' }
    ];
    if (tab === 'upcoming') return [
      { icon: 'calendar', title: 'Appointment reminder', detail: 'Next in the example schedule', status: 'Coming up' },
      { icon: 'chat', title: 'Follow-up with an inquiry', detail: 'Next step saved · sample customer', status: 'Planned' },
      { icon: 'post', title: 'The next content draft', detail: 'Preparing ideas for your review', status: 'In progress' }
    ];
    return [
      { icon: 'check', title: 'Messages organized', detail: 'Example task · ready for the next step', status: 'Handled' },
      { icon: 'check', title: 'Customer details updated', detail: 'Example task · history in one place', status: 'Handled' },
      { icon: 'check', title: 'Website check completed', detail: 'Example task · no live site checked', status: 'Handled' }
    ];
  }
  function renderPanel() {
    const panel = $('#demo-panel');
    panel.innerHTML = rowsFor(activeTab).map(row => `<div class="task-row"><span class="task-symbol">${miniIcon(row.icon)}</span><div class="task-description"><strong>${row.title}</strong><span>${row.detail}</span></div>${row.action ? `<button class="task-action" data-review="${row.action}" type="button">Review</button>` : `<span class="task-status">${row.status}</span>`}</div>`).join('');
    $$('[data-review]', panel).forEach(button => {
      button.addEventListener('click', () => openReview(button, button.dataset.review));
    });
  }
  function activateTab(button, focus = false) {
    activeTab = button.dataset.demoTab;
    $$('[data-demo-tab]').forEach(tab => {
      const selected = tab === button;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    $('#demo-panel').setAttribute('aria-labelledby', button.id);
    renderPanel();
    if (focus) button.focus();
  }
  $$('[data-demo-tab]').forEach((button, i, all) => {
    button.addEventListener('click', () => activateTab(button));
    button.addEventListener('keydown', event => {
      let index;
      if (event.key === 'ArrowRight') index = (i + 1) % all.length;
      if (event.key === 'ArrowLeft') index = (i - 1 + all.length) % all.length;
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = all.length - 1;
      if (index !== undefined) { event.preventDefault(); activateTab(all[index], true); }
    });
  });
  renderPanel();

  // Native dialogs keep focus within the preview and restore it on exit.
  const lastTrigger = new WeakMap();
  function openDialog(dialog, trigger) {
    lastTrigger.set(dialog, trigger);
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      if (!$('dialog[open]')) document.body.classList.remove('dialog-open');
      const trigger = lastTrigger.get(dialog);
      if (trigger && trigger.isConnected) trigger.focus();
      else if (dialog.id === 'review-dialog') $('#tab-attention').focus();
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
  });
  $$('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));

  const scenes = [
    { kicker: '01 / THE EVERYDAY WORK · 0–15 SECONDS', title: 'Your Work, Handled.', copy: 'Calls. Messages. Appointments. The little jobs that fill your day—brought together around your business.' },
    { kicker: '02 / KEEP THE WORK MOVING · 15–32 SECONDS', title: 'One less thing to chase.', copy: 'Customer follow-ups. Website updates. Fresh social posts prepared for your review. The story shows practical work, not a list of technology.' },
    { kicker: '03 / A CLEAR VIEW · 32–50 SECONDS', title: 'Meet Peasant Command.', copy: 'See what’s done, what’s coming up, and what needs your approval. The final video will use verified, sanitized footage or clearly labeled illustrations.' },
    { kicker: '04 / THE PROMISE · 50–65 SECONDS', title: 'You stay in control.', copy: 'We set it up. We keep it running. You stay in control. Start with what needs handling; agree the scope before any commitment.' }
  ];
  let scene = 0;
  function showScene(index) {
    scene = Math.max(0, Math.min(index, scenes.length - 1));
    $('#story-kicker').textContent = scenes[scene].kicker;
    $('#overview-dialog-title').textContent = scenes[scene].title;
    $('#story-copy').textContent = scenes[scene].copy;
    $('#story-prev').disabled = scene === 0;
    $('#story-next').textContent = scene === scenes.length - 1 ? 'Finish preview' : 'Next scene →';
    $$('[data-scene]').forEach((dot, i) => {
      if (i === scene) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
  }
  $$('[data-overview]').forEach(button => button.addEventListener('click', () => {
    showScene(0); openDialog($('#overview-dialog'), button);
  }));
  $('#story-prev').addEventListener('click', () => showScene(scene - 1));
  $('#story-next').addEventListener('click', () => {
    if (scene === scenes.length - 1) $('#overview-dialog').close();
    else showScene(scene + 1);
  });
  $$('[data-scene]').forEach(button => button.addEventListener('click', () => showScene(Number(button.dataset.scene))));

  let reviewingWebsite = false;
  function openReview(trigger, kind) {
    reviewingWebsite = kind === 'website';
    $('#review-title').textContent = reviewingWebsite ? 'A website update to review.' : 'A post ready for your review.';
    $('.sample-post p').textContent = reviewingWebsite ? 'Get in touch to discuss your next project. Tell us what you need, and we’ll help you find a practical next step.' : 'Planning your next project? We’re taking inquiries for the week ahead. Send us a message and tell us what you have in mind.';
    openDialog($('#review-dialog'), trigger);
  }
  let toastTimer;
  function toast(message) {
    const element = $('#toast');
    clearTimeout(toastTimer);
    element.textContent = message; element.classList.add('visible');
    toastTimer = window.setTimeout(() => element.classList.remove('visible'), 4800);
  }
  $('#demo-approve').addEventListener('click', () => {
    if (!reviewingWebsite) {
      approvedInDemo = true;
      $('#metric-review').textContent = '1';
      $('#tab-attention span').textContent = '1';
      renderPanel();
    }
    $('#review-dialog').close();
    toast('Demo approval recorded. Nothing was sent or published.');
  });
})();
