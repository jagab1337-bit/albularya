'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  const data = rituals[key]; if (!data) return;
  currentRitual = key;
  $$('.ritual-tabs [role=tab]').forEach((tab) => {const active = tab.dataset.ritual === key;tab.setAttribute('aria-selected',String(active));tab.tabIndex = active ? 0 : -1; if (active && focus) {tab.focus();tab.scrollIntoView({block:'nearest',inline:'nearest',behavior:reduced?'instant':'smooth'});}});
  const index = Object.keys(rituals).indexOf(key) + 1;
  $('#ritual-panel').setAttribute('aria-labelledby',`tab-${key}`);
  $('#ritual-kicker').textContent = `0${index} / ${key === 'glow' ? 'GLOW & RESTORE' : key.toUpperCase()}`;
  $('#ritual-name').innerHTML = data.title;
  $('#ritual-description').textContent = data.description;
  $('#ritual-img').src = `assets/${data.image}.webp`;
  $('#ritual-img').alt = data.alt;
  $('#ritual-image-tag').textContent = data.tag;
  $('#ritual-note').textContent = data.note;
  $('#ritual-items').replaceChildren(...data.items.map(([name,note])=>{const row=document.createElement('div');const title=document.createElement('span');title.textContent=name;const subtitle=document.createElement('small');subtitle.textContent=note;row.append(title,subtitle);return row;}));
  if(!reduced && $('#ritual-panel').animate) $('#ritual-panel').animate([{opacity:.4,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:350,easing:'ease-out'});
}
$$('[data-ritual]').forEach(tab=>tab.addEventListener('click',()=>selectRitual(tab.dataset.ritual)));
$('.ritual-tabs').addEventListener('keydown',event=>{let index=Object.keys(rituals).indexOf(currentRitual);if(event.key==='ArrowRight')index=(index+1)%6;else if(event.key==='ArrowLeft')index=(index+5)%6;else if(event.key==='Home')index=0;else if(event.key==='End')index=5;else return;event.preventDefault();selectRitual(Object.keys(rituals)[index],true);});
$('[data-go-stock]').addEventListener('click',()=>selectRitual('stock'));
const nav=$('#main-nav'), toggle=$('.menu-toggle');
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');nav.classList.toggle('open',open);});
function closeNav(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');nav.classList.remove('open');}
$$('a',nav).forEach(a=>a.addEventListener('click',closeNav));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && nav.classList.contains('open')){closeNav();toggle.focus();}});
window.addEventListener('scroll',()=>$('.header').classList.toggle('scrolled',window.scrollY>40),{passive:true});
if ('IntersectionObserver' in window) {document.documentElement.classList.add('js');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));}
function openDialog(dialog){$$('dialog[open]').forEach(d=>d.close());dialog.showModal();document.body.classList.add('modal-open');}
$$('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{if(!$('dialog[open]'))document.body.classList.remove('modal-open');});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});$$('.close-modal',dialog).forEach(button=>button.addEventListener('click',()=>dialog.close()));});
$$('[data-open-lounge]').forEach(button=>button.addEventListener('click',()=>openDialog($('#lounge-dialog'))));
$('[data-open-about]').addEventListener('click',()=>openDialog($('#about-dialog')));
$$('[data-lightbox]').forEach(button=>button.addEventListener('click',()=>{$('#lightbox-img').src=button.dataset.lightbox;$('#lightbox-img').alt=$('img',button).alt;$('#lightbox-caption').textContent=button.dataset.caption;openDialog($('#lightbox'));}));
const storageKey='albularya-concept-interest-v1';
function savedInterest(){try{const data=JSON.parse(localStorage.getItem(storageKey)||'null');return data && typeof data.name==='string' && data.name.trim() && typeof data.email==='string' && typeof data.interest==='string' ? data : null;}catch{return null;}}
function showSuccess(data){$('#interest-form-content').hidden=true;$('#interest-success').hidden=false;$('#success-copy').textContent=`Thank you, ${data.name}. Your interest in ${data.interest.toLowerCase()} is saved for this preview.`;}
$$('[data-open-interest]').forEach(button=>button.addEventListener('click',()=>{const saved=savedInterest();if(saved?.name&&saved?.email)showSuccess(saved);else{$('#interest-form-content').hidden=false;$('#interest-success').hidden=true;}openDialog($('#interest-dialog'));}));
$('#interest-form').addEventListener('submit',e=>{e.preventDefault();const name=$('#name').value.trim(), email=$('#email').value.trim();if(!name){$('#name').setCustomValidity('Please enter your name.');$('#name').reportValidity();return;}const data={name,email,interest:$('#interest').value};try{localStorage.setItem(storageKey,JSON.stringify(data));showSuccess(data);$('.close-success').focus();}catch{$('#form-error').textContent='Your browser could not save this preview. Please allow local storage and try again.';}});
$('#name').addEventListener('input',()=>$('#name').setCustomValidity(''));
$('.close-success').addEventListener('click',()=>$('#interest-dialog').close());
$('#clear-interest').addEventListener('click',()=>{try{localStorage.removeItem(storageKey);}catch{}$('#interest-form').reset();$('#interest-form-content').hidden=false;$('#interest-success').hidden=true;$('#name').focus();});
$('#year').textContent=new Date().getFullYear();
