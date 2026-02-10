/* ═══════════════════════════════════════════════════════════ */
/*  DATA V5 PREVIEW — 17 Swaps · 3 Categories · 6 Langs        */
/*  Authoritarian Edition — Modular JS                         */
/* ═══════════════════════════════════════════════════════════ */

const TIER1_MIN_SCORE = 9;
const TIER1_MAX = 6;

let lang = 'fr';
let mult = 1;
let theme = 'swiss';
let isCompact = false;
const deletedSteps = new Set();
const deletedRows = new Set();
const deletedCats = new Set();

const CHK_SVG =
  '<svg class="w-2.5 h-2.5" style="color:var(--c-accent-fg);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

function esc(s) {
  const e = document.createElement('span');
  e.textContent = s;
  return e.innerHTML;
}

function today() {
  const loc = { en: 'en-US', fr: 'fr-FR', es: 'es-ES', it: 'it-IT', ru: 'ru-RU', jp: 'ja-JP' };
  return new Date().toLocaleDateString(loc[lang] || 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function scaleNumbers(str, f) {
  return str.replace(/(\d+(?:\.\d+)?)/g, (m) => {
    const v = parseFloat(m) * f;
    return Number.isInteger(v) ? String(v) : v.toFixed(1).replace(/\.0$/, '');
  });
}

function scoreBar(n) {
  let h = '<div class="flex gap-[3px] items-end" title="' + n + '/10">';
  for (let i = 1; i <= 10; i += 1) {
    const on = i <= n;
    h +=
      '<div class="w-[3px] rounded-sm ' +
      (on ? 'bar-filled h-[14px]' : 'bar-empty h-[10px]') +
      '"></div>';
  }
  return h + '</div>';
}

function showToast(msg) {
  const t = document.getElementById('restore-toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function getTier1Swaps() {
  const swaps = [];
  CATEGORIES.forEach((cat) => {
    if (deletedCats.has(cat.slug)) return;
    cat.swaps.forEach((swap) => {
      if (deletedRows.has(swap.id)) return;
      if (swap.score >= TIER1_MIN_SCORE) {
        swaps.push({ ...swap, slug: cat.slug });
      }
    });
  });
  return swaps.slice(0, TIER1_MAX);
}

function renderTier1() {
  const m = META[lang] || META.en;
  document.getElementById('tier-title').textContent = m.tierTitle;
  document.getElementById('tier-subtitle').textContent = m.tierSubtitle;
  const tierBody = document.getElementById('tier1-body');
  const tierSwaps = getTier1Swaps();
  tierBody.innerHTML = tierSwaps
    .map((swap) => {
      const c = swap.t[lang] || swap.t.en;
      const qty = scaleNumbers(c[2], mult);
      const mac = scaleNumbers(swap.macros, mult);
      return `
        <div class="tier1-item" data-tier-id="${swap.id}">
          <div contenteditable="true" class="editable-cell tier1-craving">${esc(c[0])}</div>
          <div contenteditable="true" class="editable-cell tier1-solution">${esc(c[1])}</div>
          <div class="tier1-meta mn">
            <span contenteditable="true" class="editable-cell" data-field="q" data-base="${esc(c[2])}">${esc(qty)}</span>
            <span contenteditable="true" class="editable-cell" data-field="m" data-base="${esc(swap.macros)}">${esc(mac)}</span>
          </div>
          <div class="tier1-score">Score ${swap.score}/10</div>
        </div>`;
    })
    .join('');
}

function render() {
  const m = META[lang] || META.en;
  document.documentElement.lang = lang === 'jp' ? 'ja' : lang;
  document.getElementById('title').innerText = m.title;
  document.getElementById('subtitle').innerText = m.subtitle;
  document.getElementById('edit-hint').textContent = m.editHint;
  document.getElementById('mult-label').textContent = m.multLbl;
  document.getElementById('shop-label').textContent = m.shopBtn;
  document.getElementById('compact-label').textContent = m.compact;
  document.getElementById('restore-label').textContent = m.restoreBtn;
  document.getElementById('print-btn-label').textContent = m.printBtn;

  renderTier1();

  const visibleSteps = PROTOCOL.filter((p) => !deletedSteps.has(p.step));
  document.getElementById('protocol-body').innerHTML = visibleSteps
    .map((p) => {
      const c = p.t[lang] || p.t.en;
      return `
          <div data-step="${p.step}" class="flex gap-4 items-start group relative">
            <button class="step-del no-print absolute -top-1 -right-1" data-action="del-step" data-step="${p.step}" title="Remove step">&times;</button>
            <span class="mn text-3xl sm:text-4xl font-bold leading-none tracking-tighter select-none shrink-0 tm">${p.step}</span>
            <div class="pt-1">
              <h3 contenteditable="true" class="editable-cell text-xs font-bold uppercase tracking-[0.12em] hd">${esc(c[0])}</h3>
              <p contenteditable="true" class="editable-cell mt-1 text-[11px] tm leading-relaxed">${esc(c[1])}</p>
            </div>
          </div>`;
    })
    .join('');

  const hdrs = m.cols;
  document.getElementById('categories-root').innerHTML = CATEGORIES.filter(
    (cat) => !deletedCats.has(cat.slug)
  )
    .map((cat) => {
      const cl = (CAT_LABELS[cat.slug] || {})[lang] || CAT_LABELS[cat.slug].en;
      const visibleSwaps = cat.swaps.filter((s) => !deletedRows.has(s.id));
      if (visibleSwaps.length === 0) return '';
      const rows = visibleSwaps
        .map((s, i) => {
          const c = s.t[lang] || s.t.en;
          const altClass = i % 2 !== 0 ? 'row-alt' : '';
          const qty = scaleNumbers(c[2], mult);
          const mac = scaleNumbers(s.macros, mult);
          return `
            <div data-row data-id="${s.id}">
              <div class="hidden md:grid gap-px items-center py-print swap-grid swap-grid-card ${altClass}">
                <div class="px-3 py-2.5"><span contenteditable="true" class="editable-cell text-[12px] font-semibold">${esc(c[0])}</span></div>
                <div class="px-3 py-2.5"><span contenteditable="true" class="editable-cell text-[12px] tm">${esc(c[1])}</span></div>
                <div class="px-3 py-2.5"><span contenteditable="true" class="editable-cell mn text-[10px] font-medium tm" data-field="q" data-base="${esc(c[2])}">${esc(qty)}</span></div>
                <div class="px-3 py-2.5"><span contenteditable="true" class="editable-cell mn text-[10px] font-medium tm" data-field="m" data-base="${esc(s.macros)}">${esc(mac)}</span></div>
                <div class="px-3 py-2.5 flex items-center">${scoreBar(s.score)}</div>
                <div class="flex items-center justify-center no-print"><button class="row-del" data-action="del-row" data-row-id="${s.id}">&times;</button></div>
              </div>
              <div class="md:hidden px-4 py-3 space-y-2 swap-grid-card ${altClass}">
                <div class="flex items-center justify-between gap-2">
                  <span contenteditable="true" class="editable-cell text-[13px] font-semibold">${esc(c[0])}</span>
                  <div class="flex items-center gap-3">
                    <div class="shrink-0">${scoreBar(s.score)}</div>
                    <button class="row-del no-print text-sm" data-action="del-row" data-row-id="${s.id}">&times;</button>
                  </div>
                </div>
                <p><span contenteditable="true" class="editable-cell text-[12px] tm">${esc(c[1])}</span></p>
                <div class="flex flex-wrap gap-2 mn text-[10px] tm">
                  <span class="rounded px-2 py-0.5 cat-qty"><span contenteditable="true" class="editable-cell" data-field="q" data-base="${esc(c[2])}">${esc(qty)}</span></span>
                  <span class="rounded px-2 py-0.5 cat-macro"><span contenteditable="true" class="editable-cell" data-field="m" data-base="${esc(s.macros)}">${esc(mac)}</span></span>
                </div>
              </div>
            </div>`;
        })
        .join('');
      return `
          <div data-category="${cat.slug}" class="print-brk">
            <div class="cat-bar flex items-center justify-between mb-3">
              <h2 contenteditable="true" class="editable-cell text-[11px] font-bold uppercase tracking-[0.2em] tm hd">${esc(cl)}</h2>
              <button class="cat-del no-print text-xs px-2 py-0.5" data-action="del-cat" data-cat="${cat.slug}">&times;</button>
            </div>
            <div class="themed-card rounded-xl overflow-hidden cat-card">
              <div class="cat-hdr hidden md:grid gap-px themed-hdr text-[9px] font-bold uppercase tracking-[0.14em] cat-hdr-row">
                ${hdrs
                  .map((h) => `<div class="px-3 py-2"><span contenteditable="true" class="editable-cell">${esc(h)}</span></div>`)
                  .join('')}
                <div></div>
              </div>
              ${rows}
            </div>
          </div>`;
    })
    .join('');

  document.getElementById('motivation').innerText = m.motto;
  document.getElementById('footer-ver').textContent = m.ver;
  document.getElementById('footer-date').textContent = today();
}

function setTheme(nextTheme) {
  theme = nextTheme;
  document.documentElement.setAttribute('data-theme', nextTheme);
  document.querySelectorAll('#tg .pl').forEach((b) =>
    b.classList.toggle('on', b.getAttribute('data-theme') === nextTheme)
  );
}

function switchLang(nextLang) {
  if (nextLang === lang) return;
  lang = nextLang;
  document.querySelectorAll('#lg .pl').forEach((b) =>
    b.classList.toggle('on', b.getAttribute('data-lang') === nextLang)
  );
  const p = document.getElementById('page');
  p.classList.add('fading');
  setTimeout(() => {
    render();
    p.classList.remove('fading');
  }, 200);
  closeShop();
}

function setMult(nextMult) {
  mult = nextMult;
  document.querySelectorAll('[data-mult]').forEach((b) =>
    b.classList.toggle('on', parseFloat(b.getAttribute('data-mult')) === nextMult)
  );
  document.querySelectorAll('[data-field]').forEach((el) => {
    const base = el.getAttribute('data-base');
    if (base) el.textContent = scaleNumbers(base, nextMult);
  });
}

function toggleCompact() {
  isCompact = !isCompact;
  document.getElementById('page').classList.toggle('compact', isCompact);
  document.getElementById('btn-compact').classList.toggle('on', isCompact);
}

function moveMod(btn, dir) {
  const mod = btn.closest('[data-module]');
  if (!mod) return;
  const container = mod.parentElement;
  const mods = [...container.querySelectorAll(':scope > [data-module]')];
  const idx = mods.indexOf(mod);
  if (dir === -1 && idx > 0) container.insertBefore(mod, mods[idx - 1]);
  else if (dir === 1 && idx < mods.length - 1) mods[idx + 1].after(mod);
}

function delStep(step) {
  const el = document.querySelector('[data-step="' + step + '"]');
  if (el) {
    el.style.opacity = '0';
    setTimeout(() => {
      deletedSteps.add(step);
      render();
    }, 250);
  }
}

function delRow(id) {
  const el = document.querySelector('[data-row][data-id="' + id + '"]');
  if (el) {
    el.style.opacity = '0';
    el.style.maxHeight = '0';
    el.style.overflow = 'hidden';
    setTimeout(() => {
      deletedRows.add(id);
      render();
    }, 280);
  }
}

function delCat(slug) {
  const el = document.querySelector('[data-category="' + slug + '"]');
  if (el) {
    el.style.opacity = '0';
    setTimeout(() => {
      deletedCats.add(slug);
      render();
    }, 300);
  }
}

function restoreDefaults() {
  deletedSteps.clear();
  deletedRows.clear();
  deletedCats.clear();
  render();
  const m = META[lang] || META.en;
  showToast(m.restoreToast);
}

function generateShoppingList() {
  const m = META[lang] || META.en;
  const ids = [];
  document.querySelectorAll('[data-row]').forEach((r) => {
    const id = parseInt(r.getAttribute('data-id'), 10);
    if (id) ids.push(id);
  });
  const seen = new Set();
  const items = [];
  ids.forEach((id) => {
    const ing = INGREDIENTS[id];
    if (!ing) return;
    (ing[lang] || ing.en).forEach((item) => {
      const k = item.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        items.push(item);
      }
    });
  });
  document.getElementById('shop-title').textContent = m.shopTitle;
  document.getElementById('shop-subtitle').textContent = m.shopSub + ' (' + ids.length + ' swaps)';
  document.getElementById('shop-footer').textContent = m.shopFoot;
  document.getElementById('shop-add-label').textContent = m.shopAdd;
  document.getElementById('shop-clear-label').textContent = m.shopClear;
  document.getElementById('shop-body').innerHTML = items.map((item) => shopItemHTML(item)).join('');
  const wrap = document.getElementById('shop-clear-wrap');
  wrap.classList.toggle('hidden', items.length === 0);
  const pg = document.getElementById('shopping-page');
  pg.classList.remove('hidden');
  pg.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function shopItemHTML(text) {
  return `<div class="shop-item flex items-center gap-3 py-1.5 group">
          <div class="shop-check" data-action="toggle-check">${CHK_SVG}</div>
          <span contenteditable="true" class="editable-cell text-[12px] flex-1">${esc(text)}</span>
          <button class="shop-del no-print" data-action="del-shop" title="Remove">&times;</button>
        </div>`;
}

function closeShop() {
  document.getElementById('shopping-page').classList.add('hidden');
}

function addShopItem() {
  const body = document.getElementById('shop-body');
  const el = document.createElement('div');
  el.className = 'shop-item flex items-center gap-3 py-1.5 group';
  el.innerHTML = `<div class="shop-check" data-action="toggle-check">${CHK_SVG}</div>
        <span contenteditable="true" class="editable-cell text-[12px] flex-1" data-placeholder="1">\u2026</span>
        <button class="shop-del no-print" data-action="del-shop" title="Remove">&times;</button>`;
  body.appendChild(el);
  const sp = el.querySelector('span[contenteditable]');
  sp.focus();
  const range = document.createRange();
  range.selectNodeContents(sp);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  document.getElementById('shop-clear-wrap').classList.remove('hidden');
}

function delShopItem(btn) {
  const item = btn.closest('.shop-item');
  item.style.opacity = '0';
  item.style.maxHeight = '0';
  item.style.overflow = 'hidden';
  setTimeout(() => {
    item.remove();
    if (document.querySelectorAll('#shop-body .shop-item').length === 0) {
      document.getElementById('shop-clear-wrap').classList.add('hidden');
    }
  }, 250);
}

function clearAllShopItems() {
  const body = document.getElementById('shop-body');
  body.innerHTML = '';
  document.getElementById('shop-clear-wrap').classList.add('hidden');
}

function handleClick(event) {
  const target = event.target.closest('button, [data-action], .shop-check');
  if (!target) return;

  if (target.matches('[data-theme]')) {
    setTheme(target.getAttribute('data-theme'));
    return;
  }
  if (target.matches('[data-lang]')) {
    switchLang(target.getAttribute('data-lang'));
    return;
  }
  if (target.matches('[data-mult]')) {
    setMult(parseFloat(target.getAttribute('data-mult')));
    return;
  }

  const action = target.getAttribute('data-action');
  if (!action) return;

  switch (action) {
    case 'toggle-compact':
      toggleCompact();
      break;
    case 'open-shop':
      generateShoppingList();
      break;
    case 'restore-defaults':
      restoreDefaults();
      break;
    case 'print':
      window.print();
      break;
    case 'move-module':
      moveMod(target, parseInt(target.getAttribute('data-dir'), 10));
      break;
    case 'del-step':
      delStep(target.getAttribute('data-step'));
      break;
    case 'del-row':
      delRow(parseInt(target.getAttribute('data-row-id'), 10));
      break;
    case 'del-cat':
      delCat(target.getAttribute('data-cat'));
      break;
    case 'close-shop':
      closeShop();
      break;
    case 'add-shop':
      addShopItem();
      break;
    case 'del-shop':
      delShopItem(target);
      break;
    case 'clear-shop':
      clearAllShopItems();
      break;
    case 'toggle-check':
      target.classList.toggle('done');
      event.preventDefault();
      break;
    default:
      break;
  }
}

function handleKeydown(event) {
  if (event.key === 'Enter' && event.target.hasAttribute('contenteditable')) {
    event.preventDefault();
    event.target.blur();
  }
}

function init() {
  render();
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('click', handleClick);
}

document.addEventListener('DOMContentLoaded', init);
