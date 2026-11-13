'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = motionPreference.matches;
motionPreference.addEventListener('change', event => {
  reduced = event.matches;
  if (reduced) resetStarBoost();
  syncStarAnimations();
  scheduleScrollUpdate();
});
const rituals = {
  sip: {title:'Sip something<br> <em>rooted in good.</em>', description:'From your morning coffee to a slow afternoon steep. Familiar island botanicals, with room for a little discovery.', image:'herbal-tea', alt:'A botanical tea setting with jars of herbs, roots and fragrant leaves', tag:'SLOW STEEPS · FAMILIAR BOTANICALS', items:[['Island herbal teas','Malunggay, tanglad, pandan'],['Salabat','A warming ginger ritual'],['Coffee & cacao','Daily brews, cacao tablea'],['House tonics & elixirs','Cold steeps, botanical shots']],note:'Also on the concept menu: matcha, tropical drinks and coffee with tincture add-ons.'},
  simmer: {title:'A bowl of<br> <em>coming home.</em>', description:'Slowly simmered, generously served. Nourishing broths, soups and congee for after the surf or a quiet afternoon.', image:'pantry-still-life', alt:'Golden herbal broth alongside fresh produce and pantry jars', tag:'SLOW SIMMERED · FAMILY-SCALE NOURISHMENT', items:[['House broths','Warm, simple, restorative'],['Seasonal soups','Led by the island pantry'],['Congee','Comfort by the bowl'],['Broth pouches','Chilled or frozen, for home']],note:'Seasonal recipes are being developed. Final menu and prices will be announced closer to opening.'},
  spoon: {title:'Simple food.<br> <em>Island generosity.</em>', description:'A light meal, a full bowl, a little something cultured on the side. Everyday food with Filipino ingredients at its heart.', image:'ferments', alt:'Glass jars of cultured vegetables and island ferments', tag:'FILIPINO INGREDIENTS · EVERYDAY GENEROSITY', items:[['Rice bowls','A daily island staple'],['Seasonal vegetables','Fresh, local, thoughtfully prepared'],['Cultured sides','A little bright, a little tangy'],['Light meals','For the hours between adventures']],note:'A concept menu guided by tropical seasonality and what the kitchen has to hand.'},
  scoop: {title:'A scoop of<br> <em>something good.</em>', description:'Our botanical take on ice cream. A dairy-free coconut base meets the herbs, fruits and flavors of the islands.', image:'ice-cream', alt:'Botanical ice cream in warm yellow, coconut white and pandan green', tag:'COCONUT BASE · ISLAND INGREDIENTS', items:[['Turmeric & ginger','Earthy, golden, gently warming'],['Pandan & tanglad','Fragrant leaves, a fresh finish'],['Reishi & cacao tablea','Deep cacao, a little earthiness'],['Calamansi & honey sorbet','Bright, tart, island sunshine']],note:'Plus malunggay-coconut, black sesame-goji & a rotating lab flavor.'},
  stock: {title:'A little ritual.<br> <em>For your shelves.</em>', description:'Small bottles, good jars, everyday staples. Our take-home pantry brings the café into your kitchen — or into someone else’s as a pasalubong.', image:'elixirs', alt:'Amber tincture bottles and botanical tonics on a sunlit wooden counter', tag:'THE TAKE-HOME APOTHECARY', items:[['Ferments & pickles','Atchara, kamias, burong mangga'],['Tinctures & elixirs','Botanicals by the drop or shot'],['Teas & dry blends','An island steep, wherever you are'],['Concentrates & broth pouches','A kitchen restock worth the trip']],note:'Retail lines are planned concepts, subject to production, label review and applicable approvals.'},
  glow: {title:'Come back<br> <em>to yourself.</em>', description:'A quieter rhythm upstairs. Beauty and Filipino healing rituals sit alongside physician-led restorative care by Raya Clinic.', image:'lounge-treatment', alt:'A peaceful treatment lounge with linen beds and soft tropical light', tag:'PRIVATE RESTORATIVE LOUNGE · SECOND FLOOR', items:[['Glow','Facials & reflexology'],['Filipino healing rituals','Hilot, suob & more'],['Restore by Raya Clinic','Physician-led IV & peptide care'],['A calm guest journey','Separate clinical screening & booking']],note:'Planned services only. Appointments are not open in this preview. Raya Clinic assesses clinical suitability.'}
};
let currentRitual = 'scoop';
function selectRitual(key, focus = false) {
  const data = rituals[key];
  if (!data || !$('#ritual-panel')) return;
  currentRitual = key;
  $$('.ritual-tabs [role=tab]').forEach(tab => {
    const active = tab.dataset.ritual === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active) {
      if (focus) tab.focus({ preventScroll: true });
      const tabs = $('.ritual-tabs');
      const bounds = tab.getBoundingClientRect();
      const track = tabs.getBoundingClientRect();
      const left = tabs.scrollLeft + bounds.left - track.left - (tabs.clientWidth - bounds.width) / 2;
      tabs.scrollTo({ left: Math.max(0, Math.min(tabs.scrollWidth - tabs.clientWidth, left)), behavior: reduced ? 'instant' : 'smooth' });
    }
  });
  const index = Object.keys(rituals).indexOf(key) + 1;
  $('#ritual-panel').setAttribute('aria-labelledby', `tab-${key}`);
  $('#ritual-kicker').textContent = `0${index} / ${key === 'glow' ? 'GLOW & RESTORE' : key.toUpperCase()}`;
  $('#ritual-name').innerHTML = data.title;
  $('#ritual-description').textContent = data.description;
  $('#ritual-img').src = `/assets/${data.image}.webp`;
  $('#ritual-img').alt = data.alt;
  $('#ritual-image-tag').textContent = data.tag;
  $('#ritual-note').textContent = data.note;
  $('#ritual-items').replaceChildren(...data.items.map(([name, note]) => {
    const row = document.createElement('div');
    const title = document.createElement('span');
    const subtitle = document.createElement('small');
    title.textContent = name;
    subtitle.textContent = note;
    row.append(title, subtitle);
    return row;
  }));
  if (!reduced && $('#ritual-panel').animate) {
    $('#ritual-panel').animate([{ opacity: .4, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
}
$$('[data-ritual]').forEach(tab => tab.addEventListener('click', () => selectRitual(tab.dataset.ritual)));
$('.ritual-tabs')?.addEventListener('keydown', event => {
  let index = Object.keys(rituals).indexOf(currentRitual);
  if (event.key === 'ArrowRight') index = (index + 1) % 6;
  else if (event.key === 'ArrowLeft') index = (index + 5) % 6;
  else if (event.key === 'Home') index = 0;
  else if (event.key === 'End') index = 5;
  else return;
  event.preventDefault();
  selectRitual(Object.keys(rituals)[index], true);
});
$('[data-go-stock]')?.addEventListener('click', () => selectRitual('stock'));

// A shared sticky header and native anchor scrolling on every page.
const nav = $('#main-nav');
const toggle = $('.menu-toggle');
function closeNav() {
  if (!toggle || !nav) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  nav.classList.remove('open');
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav?.classList.toggle('open', open);
});
if (nav) $$('a', nav).forEach(a => a.addEventListener('click', closeNav));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    closeNav();
    toggle?.focus();
  }
});
function scrollToTop() {
  closeNav();
  const heading = $('main h1');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
  history.replaceState(null, '', `${location.pathname}${location.search}#top`);
  window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'instant' : 'smooth' });
}
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!link || link.target || link.hasAttribute('download')) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin !== location.origin || destination.pathname !== location.pathname || destination.search !== location.search || !destination.hash) return;
  if (destination.hash === '#top') {
    event.preventDefault();
    scrollToTop();
    return;
  }
  const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
  if (!target) return;
  event.preventDefault();
  closeNav();
  const headerHeight = $('.header')?.offsetHeight || 0;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 24);
  history.pushState(null, '', destination.hash);
  window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' });
});

// Stars and arrows share one idle speed and the same scroll boost. Hover adds
// a local boost without rotating the surrounding text or changing a hit target.
const starEntries = $$('svg').filter(svg => $('use[href="#spark"], use[href="#arrow"]', svg)).map(svg => {
  const isStar = Boolean($('use[href="#spark"]', svg));
  const base = getComputedStyle(svg).transform;
  svg.classList.add('spin-icon');
  if (isStar) svg.classList.add('scroll-star');
  const entry = { element: svg, visible: !('IntersectionObserver' in window), animation: null, hoverRate: 1, hoverTarget: 1 };
  if (svg.animate) {
    const prefix = base === 'none' ? '' : `${base} `;
    svg.classList.add('spin-managed');
    if (isStar) svg.classList.add('star-managed');
    entry.animation = svg.animate(
      [{ transform: `${prefix}rotate(0deg)` }, { transform: `${prefix}rotate(360deg)` }],
      { duration: 36000, iterations: Infinity, easing: 'linear' }
    );
    entry.animation.pause();
  }
  const hoverArea = svg.closest('a, button') || svg;
  hoverArea.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch' || reduced) return;
    entry.hoverTarget = 3;
    startStarEase();
  });
  const leave = () => { entry.hoverTarget = 1; if (!reduced) startStarEase(); };
  hoverArea.addEventListener('pointerleave', leave);
  hoverArea.addEventListener('pointercancel', leave);
  return entry;
});
let starScrollSpeed = 0;
let starRate = 1;
let starFrame = 0;
let previousStarFrame = 0;
let previousScrollY = window.scrollY;
let previousScrollTime = performance.now();
function applyStarRate() {
  starEntries.forEach(entry => {
    const rate = Math.min(24, starRate * entry.hoverRate);
    if (entry.animation) {
      if (entry.animation.updatePlaybackRate) entry.animation.updatePlaybackRate(rate);
      else entry.animation.playbackRate = rate;
    } else entry.element.style.animationDuration = `${36000 / rate}ms`;
  });
}
function syncStarAnimations() {
  starEntries.forEach(entry => {
    const active = entry.visible && !reduced && !document.hidden;
    entry.element.classList.toggle('spin-active', active);
    entry.element.classList.toggle('star-active', active);
    if (!entry.animation) return;
    if (active) entry.animation.play();
    else {
      entry.animation.pause();
      if (reduced) entry.animation.currentTime = 0;
    }
  });
}
function resetStarBoost() {
  cancelAnimationFrame(starFrame);
  starFrame = 0;
  previousStarFrame = 0;
  starScrollSpeed = 0;
  starRate = 1;
  starEntries.forEach(entry => { entry.hoverRate = 1; entry.hoverTarget = 1; });
  previousScrollY = window.scrollY;
  previousScrollTime = performance.now();
  applyStarRate();
}
function startStarEase() {
  if (starFrame || reduced || document.hidden) return;
  previousStarFrame = 0;
  starFrame = requestAnimationFrame(easeStarBoost);
}
function easeStarBoost(time) {
  const elapsed = previousStarFrame ? Math.min(64, time - previousStarFrame) : 16;
  previousStarFrame = time;
  starScrollSpeed *= Math.exp(-elapsed / 300);
  const targetRate = 1 + Math.min(11, starScrollSpeed * .003);
  starRate += (targetRate - starRate) * (1 - Math.exp(-elapsed / 110));
  let hoverSettling = false;
  starEntries.forEach(entry => {
    entry.hoverRate += (entry.hoverTarget - entry.hoverRate) * (1 - Math.exp(-elapsed / 140));
    if (Math.abs(entry.hoverTarget - entry.hoverRate) > .01) hoverSettling = true;
    else entry.hoverRate = entry.hoverTarget;
  });
  applyStarRate();
  if (starScrollSpeed < 3 && Math.abs(starRate - 1) < .015 && !hoverSettling) {
    starRate = 1;
    applyStarRate();
    starFrame = 0;
    previousStarFrame = 0;
  } else starFrame = requestAnimationFrame(easeStarBoost);
}
function sampleStarScrollSpeed() {
  const now = performance.now();
  const y = window.scrollY;
  const elapsed = Math.max(16, Math.min(120, now - previousScrollTime));
  const velocity = Math.min(10000, Math.abs(y - previousScrollY) / elapsed * 1000);
  previousScrollY = y;
  previousScrollTime = now;
  if (reduced || document.hidden || !starEntries.length) return;
  starScrollSpeed = Math.max(starScrollSpeed * .65, velocity);
  startStarEase();
}
if ('IntersectionObserver' in window) {
  const starObserver = new IntersectionObserver(entries => {
    entries.forEach(observed => {
      const entry = starEntries.find(item => item.element === observed.target);
      if (entry) { entry.visible = observed.isIntersecting; if (!entry.visible) entry.hoverTarget = 1; }
    });
    syncStarAnimations();
  });
  starEntries.forEach(entry => starObserver.observe(entry.element));
}
document.addEventListener('visibilitychange', () => {
  resetStarBoost();
  syncStarAnimations();
});
syncStarAnimations();

// One scheduled frame per scroll event; only visible leaf scenes are measured.
const progress = $('.scroll-progress');
const scenes = $$('.botanical-scene');
let framePending = false;
function scheduleScrollUpdate() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(() => {
    framePending = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const shifts = reduced ? [] : scenes.filter(scene => scene.classList.contains('motion-active')).map(scene => {
      const rect = scene.getBoundingClientRect();
      return [scene, Math.max(-22, Math.min(22, (window.innerHeight / 2 - rect.top - rect.height / 2) * .035))];
    });
    $('.header')?.classList.toggle('scrolled', y > 40);
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, y / max)) : 0})`;
    scenes.forEach(scene => { if (reduced) scene.style.removeProperty('--leaf-scroll'); });
    shifts.forEach(([scene, shift]) => scene.style.setProperty('--leaf-scroll', `${shift.toFixed(1)}px`));
  });
}
window.addEventListener('scroll', () => {
  sampleStarScrollSpeed();
  scheduleScrollUpdate();
}, { passive: true });
window.addEventListener('resize', scheduleScrollUpdate, { passive: true });
window.addEventListener('pageshow', scheduleScrollUpdate);
scheduleScrollUpdate();

if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js');
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: .06, rootMargin: '0px 0px -20px 0px' });
  $$('.reveal').forEach(element => revealObserver.observe(element));
  const leafObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('motion-active', entry.isIntersecting));
    scheduleScrollUpdate();
  }, { rootMargin: '80px' });
  $$('.botanical-scene, .botanical-mark, .story-leaf, .closing-leaf, .ambient-leaf, .brand-logo').forEach(element => leafObserver.observe(element));
}

// Native dialogs handle focus trapping, Escape and focus restoration.
function openDialog(dialog) {
  if (!dialog) return;
  $$('dialog[open]').forEach(d => d.close());
  dialog.showModal();
  document.body.classList.add('modal-open');
  // Focus a visible static heading instead of showing an unsolicited close-button
  // focus ring or opening the phone keyboard as soon as the dialog appears.
  const focusTarget = $$('h2', dialog).find(heading => heading.getClientRects().length) || $('p', dialog) || dialog;
  focusTarget.setAttribute('tabindex', '-1');
  focusTarget.focus({ preventScroll: true });
}
$$('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => {
    if (!$('dialog[open]')) document.body.classList.remove('modal-open');
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  $$('.close-modal', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
});
$$('[data-open-lounge]').forEach(button => button.addEventListener('click', () => openDialog($('#lounge-dialog'))));
$$('[data-open-about]').forEach(button => button.addEventListener('click', () => openDialog($('#about-dialog'))));
$$('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
  if (!$('#lightbox')) return;
  $('#lightbox-img').src = button.dataset.lightbox;
  $('#lightbox-img').alt = $('img', button).alt;
  $('#lightbox-caption').textContent = button.dataset.caption;
  openDialog($('#lightbox'));
}));
const storageKey = 'albularya-concept-interest-v1';
function savedInterest() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || 'null');
    return data && typeof data.name === 'string' && data.name.trim() && typeof data.email === 'string' && typeof data.interest === 'string' ? data : null;
  } catch { return null; }
}
function showSuccess(data) {
  $('#interest-form-content').hidden = true;
  $('#interest-success').hidden = false;
  $('#success-copy').textContent = `Thank you, ${data.name}. Your interest in ${data.interest.toLowerCase()} is saved for this preview.`;
}
$$('[data-open-interest]').forEach(button => button.addEventListener('click', () => {
  if (!$('#interest-dialog')) return;
  const saved = savedInterest();
  if (saved?.name && saved?.email) showSuccess(saved);
  else {
    $('#interest-form-content').hidden = false;
    $('#interest-success').hidden = true;
  }
  openDialog($('#interest-dialog'));
}));
$('#interest-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  if (!name) {
    $('#name').setCustomValidity('Please enter your name.');
    $('#name').reportValidity();
    return;
  }
  const data = { name, email, interest: $('#interest').value };
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    showSuccess(data);
    $('.close-success').focus();
  } catch {
    $('#form-error').textContent = 'Your browser could not save this preview. Please allow local storage and try again.';
  }
});
$('#name')?.addEventListener('input', () => $('#name').setCustomValidity(''));
$('.close-success')?.addEventListener('click', () => $('#interest-dialog').close());
$('#clear-interest')?.addEventListener('click', () => {
  try { localStorage.removeItem(storageKey); } catch { /* Storage can be unavailable in private browser modes. */ }
  $('#interest-form').reset();
  $('#interest-form-content').hidden = false;
  $('#interest-success').hidden = true;
  $('#name').focus();
});
if ($('#year')) $('#year').textContent = new Date().getFullYear();
