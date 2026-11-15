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
    { kicker: '03 / A CLEAR VIEW · 32–50 SECONDS', title: 'Your Customer Hub.', copy: 'Services, messages, documents, billing and activity in one place. This prototype uses a sample account; no live services or billing are connected.' },
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
})();
