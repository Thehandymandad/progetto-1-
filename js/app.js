/* Editor delle locandine: schermata iniziale, modifica, salvataggio, esportazione. */
(function () {
  'use strict';

  // ------------------------------------------------------------------ utilità
  const $ = (s, r = document) => r.querySelector(s);
  function h(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'style') n.style.cssText = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else if (k === 'html') n.innerHTML = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(k));
    return n;
  }
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const uid = (p = 'e') => p + Date.now().toString(36).slice(-5) + Math.random().toString(36).slice(2, 6);
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
  let toastT;
  function toast(msg, ms = 2600) {
    const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.add('hidden'), ms);
  }
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent) || /iPad|iPhone|iPod/.test(navigator.userAgent);
  const fmtDate = (ts) => new Date(ts).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });

  const FONTS = [
    ['Patrick Hand', 'Patrick Hand (Natale)', [400]],
    ['Kalam', 'Kalam (corsivo a mano)', [400, 700]],
    ['Chewy', 'Chewy (Halloween titolo)', [400]],
    ['Mali', 'Mali (Halloween / Diploma)', [400, 500, 600, 700]],
    ['Kaushan Script', 'Kaushan Script (Mercatino)', [400]],
    ['Dancing Script', 'Dancing Script', [700]],
    ['Pacifico', 'Pacifico', [400]],
    ['Libre Baskerville', 'Libre Baskerville (classico)', [400, 700]],
    ['Josefin Sans', 'Josefin Sans', [600]],
    ['Fredoka', 'Fredoka (tondo)', [400, 500, 600, 700]],
    ['Baloo 2', 'Baloo 2 (tondo grassetto)', [700, 800]],
    ['Sniglet', 'Sniglet (bolle)', [800]],
    ['Grandstander', 'Grandstander', [800]],
    ['Caveat Brush', 'Caveat Brush (pennarello)', [400]],
    ['Itim', 'Itim', [400]]
  ];
  const PALETTE = ['#b5201a', '#d0400f', '#f08a26', '#f5b731', '#2e7d32', '#13284d', '#163a78', '#7b4fa0', '#e88fb0', '#43210f', '#1d120c', '#000000', '#ffffff'];
  const BG_PRESETS = [
    { name: 'Cornice autunno / Halloween', src: 'assets/bg/halloween_9x16.jpg', w: 1080, h: 1920 },
    { name: 'Cornice biscotti (diploma)', src: 'assets/bg/diploma_biscotti.jpg', w: 1536, h: 1024 }
  ];

  // ------------------------------------------------------------------ stato
  const S = { doc: null, sel: null, undo: [], redo: [], last: null, scale: 1, tab: 'testi', models: [], drafts: [] };
  const stageEl = $('#stage');
  const overlayEl = $('#overlay');
  const scalerEl = $('#stageScaler');
  const areaEl = $('#stageArea');

  // ------------------------------------------------------------------ avvio
  async function init() {
    if (!Store.persistent) {
      try { await Store.all('docs'); } catch (e) { /* ignore */ }
    }
    const ups = await Store.all('uploads').catch(() => []);
    ups.forEach((u) => Poster.UPLOADS.set(u.id, u.data));
    if (!Store.persistent) $('#storageWarn').classList.remove('hidden');
    bindStatic();
    await showHome();
    if (document.fonts && document.fonts.load) {
      FONTS.forEach(([f, , ws]) => ws.forEach((w) => document.fonts.load(`${w} 40px "${f}"`).catch(() => {})));
    }
  }

  // ------------------------------------------------------------------ HOME
  function thumb(doc, width) {
    const sc = width / doc.w;
    const box = h('div', { class: 'thumb', style: `height:${Math.round(doc.h * sc)}px` });
    const st = h('div');
    st.style.transform = `scale(${sc})`;
    box.appendChild(st);
    Poster.renderDoc(doc, st).catch(() => {});
    return box;
  }

  async function showHome() {
    $('#editor').classList.add('hidden');
    $('#home').classList.remove('hidden');
    document.title = "Locandine · Scuola dell'infanzia Sacra Famiglia";
    S.models = (await Store.all('models').catch(() => [])).sort((a, b) => (b.updated || 0) - (a.updated || 0));
    S.drafts = (await Store.all('docs').catch(() => [])).sort((a, b) => (b.updated || 0) - (a.updated || 0));
    const cw = Math.min(200, Math.max(140, (Math.min(window.innerWidth, 1100) - 32 - 28) / 3));

    const tg = $('#templateGrid'); tg.innerHTML = '';
    BUILTIN_TEMPLATES.forEach((t) => {
      tg.appendChild(h('div', { class: 'card', onclick: () => newFromTemplate(t) },
        thumb(t, cw), h('div', { class: 'meta' }, t.name, h('small', null, t.w > t.h ? 'Orizzontale · stampa' : 'Storia Instagram 9:16'))));
    });

    const mg = $('#modelGrid'); mg.innerHTML = '';
    $('#modelsBox').classList.toggle('hidden', !S.models.length);
    S.models.forEach((m) => {
      mg.appendChild(h('div', { class: 'card' },
        h('div', { onclick: () => newFromTemplate(m) }, thumb(m, cw), h('div', { class: 'meta' }, m.name, h('small', null, 'Modello personale'))),
        h('div', { class: 'acts' },
          h('button', { onclick: () => newFromTemplate(m) }, 'Usa'),
          h('button', { onclick: async () => { if (confirm(`Eliminare il modello «${m.name}»?`)) { await Store.del('models', m.id); showHome(); } } }, 'Elimina'))));
    });

    const dg = $('#draftGrid'); dg.innerHTML = '';
    $('#draftsBox').classList.toggle('hidden', !S.drafts.length);
    S.drafts.forEach((d) => {
      dg.appendChild(h('div', { class: 'card' },
        h('div', { onclick: () => openDoc(d) }, thumb(d, cw), h('div', { class: 'meta' }, d.name, h('small', null, 'Modificata il ' + fmtDate(d.updated || Date.now())))),
        h('div', { class: 'acts' },
          h('button', { onclick: () => openDoc(d) }, 'Apri'),
          h('button', { onclick: async () => { const c = clone(d); c.id = uid('d'); c.name = d.name + ' (copia)'; c.updated = Date.now(); await Store.put('docs', c); showHome(); } }, 'Duplica'),
          h('button', { onclick: async () => { if (confirm(`Eliminare «${d.name}»?`)) { await Store.del('docs', d.id); showHome(); } } }, 'Elimina'))));
    });
  }

  function newFromTemplate(t) {
    const d = clone(t);
    d.from = t.id;
    d.id = uid('d');
    d.name = t.name + ' · ' + new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
    d.updated = Date.now();
    delete d.isModel;
    Store.put('docs', d);
    openDoc(d);
  }

  // ------------------------------------------------------------------ EDITOR
  function openDoc(d) {
    S.doc = clone(d);
    S.sel = null; S.undo = []; S.redo = []; S.last = JSON.stringify(S.doc);
    $('#home').classList.add('hidden');
    $('#editor').classList.remove('hidden');
    $('#docName').value = S.doc.name || '';
    document.title = S.doc.name + ' · Locandine';
    S.tab = 'testi';
    setTab('testi');
    renderStage().then(fitStage);
    requestAnimationFrame(fitStage);
    updateUndo();
  }

  function renderStage() {
    return Poster.renderDoc(previewDoc(), stageEl).then(drawOverlay);
  }
  // per il diploma: in anteprima mostra il primo nome dell'elenco
  function previewDoc() {
    const d = S.doc;
    const names = namesList(d);
    if (!names.length) return d;
    const c = clone(d);
    c.elements.forEach((e) => { if (e.role === 'name' && e.t && !e.t.text) e.t.text = names[0]; });
    return c;
  }
  function namesList(d) { return (d.names || '').split('\n').map((s) => s.trim()).filter(Boolean); }

  function fitStage() {
    if (!S.doc) return;
    const r = areaEl.getBoundingClientRect();
    const pad = 18;
    const s = Math.max(0.05, Math.min((r.width - pad * 2) / S.doc.w, (r.height - pad * 2) / S.doc.h));
    S.scale = s;
    const ox = (r.width - S.doc.w * s) / 2, oy = (r.height - S.doc.h * s) / 2;
    scalerEl.style.width = S.doc.w + 'px';
    scalerEl.style.height = S.doc.h + 'px';
    scalerEl.style.transform = `translate(${ox}px,${oy}px) scale(${s})`;
    scalerEl.style.setProperty('--s', s);
  }
  new ResizeObserver(() => fitStage()).observe(areaEl);

  const elById = (id) => S.doc && S.doc.elements.find((e) => e.id === id);
  const domById = (id) => stageEl.querySelector(`.el[data-id="${id}"]`);

  function updateElementDom(el) {
    const old = domById(el.id);
    if (!old) return renderStage();
    const tasks = [];
    const pd = previewDoc();
    const pel = pd.elements.find((e) => e.id === el.id) || el;
    const n = Poster.renderElement(pel, tasks);
    old.replaceWith(n);
    Poster.fitTexts(n);
    Promise.all(tasks).then(() => { Poster.fitTexts(n); drawOverlay(); });
    drawOverlay();
  }

  // ---------- storico e salvataggio ----------
  const saveSoon = debounce(() => {
    if (!S.doc) return;
    S.doc.updated = Date.now();
    Store.put('docs', clone(S.doc)).catch(() => toast('Impossibile salvare sul dispositivo'));
  }, 500);
  function commit() {
    const snap = JSON.stringify(S.doc);
    if (snap === S.last) return;
    S.undo.push(S.last);
    if (S.undo.length > 80) S.undo.shift();
    S.last = snap; S.redo = [];
    updateUndo(); saveSoon();
  }
  function updateUndo() { $('#btnUndo').disabled = !S.undo.length; $('#btnRedo').disabled = !S.redo.length; }
  function undo() {
    if (!S.undo.length) return;
    S.redo.push(S.last); S.last = S.undo.pop(); S.doc = JSON.parse(S.last);
    if (S.sel && !elById(S.sel)) S.sel = null;
    renderStage(); renderPanel(); updateUndo(); saveSoon();
  }
  function redo() {
    if (!S.redo.length) return;
    S.undo.push(S.last); S.last = S.redo.pop(); S.doc = JSON.parse(S.last);
    if (S.sel && !elById(S.sel)) S.sel = null;
    renderStage(); renderPanel(); updateUndo(); saveSoon();
  }

  // ---------- selezione e overlay ----------
  function select(id, opts = {}) {
    S.sel = id;
    drawOverlay();
    if (opts.tab) setTab(opts.tab);
    else renderPanel();
  }
  function drawOverlay(guides) {
    overlayEl.innerHTML = '';
    if (!S.doc || !S.sel) return;
    const el = elById(S.sel); const d = domById(S.sel);
    if (!el || !d) return;
    const box = h('div', { class: 'sel-box' });
    box.style.left = d.offsetLeft + 'px';
    box.style.top = d.offsetTop + 'px';
    box.style.width = d.offsetWidth + 'px';
    box.style.height = d.offsetHeight + 'px';
    if (el.rot) box.style.transform = `rotate(${el.rot}deg)`;
    const se = h('div', { class: 'handle se', title: 'Ridimensiona' });
    const rot = h('div', { class: 'handle rot', title: 'Ruota' });
    box.append(se, rot);
    if (el.type === 'text' || el.type === 'shape' || (el.type === 'image' && el.t)) box.append(h('div', { class: 'handle e', title: 'Larghezza' }));
    overlayEl.appendChild(box);
    box.querySelectorAll('.handle').forEach((hd) => hd.addEventListener('pointerdown', (ev) => startHandle(ev, hd.classList[1])));
    if (guides) guides.forEach((g) => overlayEl.appendChild(h('div', { class: 'guide ' + g })));
  }

  // ---------- trascinamento ----------
  let drag = null;
  stageEl.addEventListener('pointerdown', (ev) => {
    const target = ev.target.closest('.el');
    if (!target) { if (S.sel) { S.sel = null; drawOverlay(); renderPanel(); } return; }
    const el = elById(target.dataset.id);
    if (!el) return;
    ev.preventDefault();
    const wasSel = S.sel === el.id;
    if (!wasSel) { S.sel = el.id; drawOverlay(); if (S.tab === 'testi') highlightTextItem(); else setTab('elemento'); }
    drag = { kind: 'move', id: el.id, sx: ev.clientX, sy: ev.clientY, x0: el.x, y0: el.y, moved: false, wasSel };
    stageEl.setPointerCapture(ev.pointerId);
  });
  stageEl.addEventListener('pointermove', (ev) => {
    if (!drag || drag.kind !== 'move') return;
    const dx = (ev.clientX - drag.sx) / S.scale, dy = (ev.clientY - drag.sy) / S.scale;
    if (!drag.moved && Math.hypot(ev.clientX - drag.sx, ev.clientY - drag.sy) < 4) return;
    drag.moved = true;
    const el = elById(drag.id); const d = domById(drag.id);
    let nx = drag.x0 + dx, ny = drag.y0 + dy;
    const guides = [];
    const w = d.offsetWidth, hh = d.offsetHeight, snap = 10 / S.scale;
    if (Math.abs(nx + w / 2 - S.doc.w / 2) < snap) { nx = S.doc.w / 2 - w / 2; guides.push('v'); }
    if (Math.abs(ny + hh / 2 - S.doc.h / 2) < snap) { ny = S.doc.h / 2 - hh / 2; guides.push('h'); }
    el.x = Math.round(nx); el.y = Math.round(ny);
    d.style.left = el.x + 'px'; d.style.top = el.y + 'px';
    drawOverlay(guides);
  });
  const endDrag = () => {
    if (!drag) return;
    const dr = drag; drag = null;
    if (dr.kind === 'move') {
      if (dr.moved) { commit(); drawOverlay(); }
      else if (dr.wasSel) { setTab(S.tab === 'testi' ? 'testi' : 'elemento'); focusTextOf(dr.id); }
    }
  };
  stageEl.addEventListener('pointerup', endDrag);
  stageEl.addEventListener('pointercancel', endDrag);

  function startHandle(ev, kind) {
    ev.preventDefault(); ev.stopPropagation();
    const el = elById(S.sel); const d = domById(S.sel);
    if (!el || !d) return;
    const st = {
      kind, sx: ev.clientX, sy: ev.clientY, w0: el.w, h0: el.h || d.offsetHeight, hasH: !!el.h,
      size0: el.t ? el.t.size : null, stroke0: el.t ? el.t.stroke : null, x0: el.x, y0: el.y,
      cx: el.x + d.offsetWidth / 2, cy: el.y + d.offsetHeight / 2, rot0: el.rot || 0
    };
    const target = ev.target;
    target.setPointerCapture(ev.pointerId);
    const move = (e) => {
      const dx = (e.clientX - st.sx) / S.scale, dy = (e.clientY - st.sy) / S.scale;
      const a = -(st.rot0 * Math.PI) / 180;
      const lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
      if (kind === 'se') {
        const f = Math.max(0.08, ((st.w0 + lx) / st.w0 + (st.h0 + ly) / st.h0) / 2);
        el.w = Math.round(st.w0 * f);
        if (st.hasH) el.h = Math.round(st.h0 * f);
        if (el.t && st.size0) { el.t.size = Math.round(st.size0 * f * 10) / 10; if (st.stroke0) el.t.stroke = Math.round(st.stroke0 * f * 10) / 10; }
        updateElementDom(el);
      } else if (kind === 'e') {
        el.w = Math.max(30, Math.round(st.w0 + lx));
        updateElementDom(el);
      } else if (kind === 'rot') {
        const r = scalerEl.getBoundingClientRect();
        const px = (e.clientX - r.left) / S.scale, py = (e.clientY - r.top) / S.scale;
        let ang = (Math.atan2(py - st.cy, px - st.cx) * 180) / Math.PI + 90;
        ang = ((ang + 540) % 360) - 180;
        for (const s of [-180, -90, 0, 90, 180]) if (Math.abs(ang - s) < 4) ang = s;
        el.rot = Math.round(ang * 10) / 10;
        const dd = domById(el.id); dd.style.transform = el.rot ? `rotate(${el.rot}deg)` : '';
        drawOverlay();
      }
    };
    const up = () => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
      commit(); renderPanel();
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  }

  // ------------------------------------------------------------------ PANNELLO
  function setTab(t) {
    S.tab = t;
    document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === t));
    renderPanel();
  }
  function renderPanel() {
    const body = $('#panelBody');
    const keepScroll = body.scrollTop;
    body.innerHTML = '';
    if (!S.doc) return;
    const fn = { testi: panelTexts, elemento: panelElement, aggiungi: panelAdd, sfondo: panelBg, altro: panelMore }[S.tab];
    fn(body);
    if (S.tab === 'testi') { body.scrollTop = keepScroll; highlightTextItem(); }
  }

  // ---------- controlli riutilizzabili ----------
  function field(label, ...nodes) { return h('div', { class: 'field' }, label ? h('div', { class: 'lab' }, label) : null, ...nodes); }
  function range(label, val, min, max, step, onInput, fmt) {
    const out = h('span', { class: 'no-grow', style: 'min-width:46px;text-align:right;font-size:13px;color:#7a6a5c' }, fmt ? fmt(val) : String(val));
    const inp = h('input', { type: 'range', min, max, step, value: val });
    inp.addEventListener('input', () => { const v = parseFloat(inp.value); out.textContent = fmt ? fmt(v) : String(v); onInput(v); });
    inp.addEventListener('change', commit);
    return field(label, h('div', { class: 'inline' }, inp, out));
  }
  function colors(label, val, onPick, extra = []) {
    const wrap = h('div', { class: 'swatches' });
    const pick = h('input', { type: 'color', value: /^#[0-9a-f]{6}$/i.test(val || '') ? val : '#000000' });
    pick.addEventListener('input', () => { onPick(pick.value); mark(pick.value); });
    pick.addEventListener('change', commit);
    const all = [...extra, ...PALETTE];
    const mark = (v) => wrap.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('on', s.dataset.c === v));
    all.forEach((c) => {
      const isNone = c === 'none';
      const sw = h('button', { class: 'swatch', title: isNone ? 'Nessuno' : c, 'data-c': c,
        style: isNone ? 'background:linear-gradient(45deg,#fff 45%,#d33 45% 55%,#fff 55%)' : `background:${c}`,
        onclick: () => { onPick(c); mark(c); commit(); } });
      wrap.appendChild(sw);
    });
    wrap.appendChild(pick);
    mark(val);
    return field(label, wrap);
  }
  function seg(opts, val, onPick) {
    const s = h('div', { class: 'seg' });
    opts.forEach(([v, lab]) => s.appendChild(h('button', { class: v === val ? 'on' : '', onclick: () => { onPick(v); s.querySelectorAll('button').forEach((b) => b.classList.remove('on')); s.querySelector(`[data-v="${v}"]`).classList.add('on'); commit(); }, 'data-v': v }, lab)));
    return s;
  }
  function toggle(label, val, onPick) {
    const c = h('input', { type: 'checkbox' }); c.checked = !!val;
    c.addEventListener('change', () => { onPick(c.checked); commit(); });
    return h('label', { class: 'toggle' }, c, label);
  }
  const helpMarkup = () => h('div', { class: 'help', html:
    'Trucchi: <code>*parola*</code> = colore evidenziato · <code>**parola**</code> = grassetto · <code>^^parola^^</code> = più grande · <code>__parola__</code> = sottolineato. Vai a capo con Invio.' });

  // ---------- scheda TESTI ----------
  function editableTexts() {
    return S.doc.elements.filter((e) => (e.t && e.type !== 'qr') || e.type === 'qr')
      .map((e) => ({ e, y: e.y }))
      .sort((a, b) => a.y - b.y).map((o) => o.e);
  }
  function panelTexts(body) {
    body.appendChild(helpMarkup());
    const hasName = S.doc.elements.some((e) => e.role === 'name');
    if (hasName) {
      const ta = h('textarea', { rows: 3, placeholder: 'Mario Rossi\nGiulia Bianchi\n…' });
      ta.value = S.doc.names || '';
      ta.addEventListener('input', () => { S.doc.names = ta.value; renderStageSoon(); });
      ta.addEventListener('change', commit);
      body.appendChild(h('div', { class: 'text-item', style: 'border-color:#e3b77d' },
        h('label', null, h('span', null, '🎓 Nomi dei bambini (uno per riga)')), ta,
        h('div', { class: 'hint', style: 'margin:4px 0 0' }, 'Quando scarichi, viene creato un diploma per ogni nome.')));
    }
    const list = editableTexts();
    if (!list.length) body.appendChild(h('div', { class: 'empty' }, 'Nessun testo. Aggiungine uno dalla scheda «Aggiungi».'));
    list.forEach((e) => {
      const lab = e.label || (e.type === 'qr' ? 'QR code' : (e.t.text || 'Testo').split('\n')[0].replace(/[*_^]/g, '').slice(0, 28));
      let inp;
      if (e.type === 'qr') {
        inp = h('input', { type: 'url', value: (e.qr && e.qr.url) || '', placeholder: 'https://forms.gle/…' });
        inp.addEventListener('input', () => { e.qr.url = inp.value.trim(); updateElementDomSoon(e); });
      } else {
        if (e.role === 'name' && hasName) return;
        inp = h('textarea', { rows: Math.max(1, (e.t.text || '').split('\n').length) });
        inp.value = e.t.text || '';
        inp.addEventListener('input', () => { e.t.text = inp.value; inp.rows = Math.max(1, inp.value.split('\n').length); updateElementDomSoon(e); });
      }
      inp.addEventListener('change', commit);
      inp.addEventListener('focus', () => { if (S.sel !== e.id) { S.sel = e.id; drawOverlay(); highlightTextItem(true); } });
      body.appendChild(h('div', { class: 'text-item', 'data-id': e.id },
        h('label', null, h('span', null, (e.type === 'qr' ? '🔗 ' : '') + lab), h('span', { style: 'cursor:pointer', onclick: () => { S.sel = e.id; setTab('elemento'); drawOverlay(); } }, 'stile ›')), inp));
    });
  }
  const renderStageSoon = debounce(renderStage, 120);
  const pendingEl = new Set();
  const flushEls = debounce(() => { pendingEl.forEach((e) => updateElementDom(e)); pendingEl.clear(); }, 60);
  function updateElementDomSoon(e) { pendingEl.add(e); flushEls(); }
  function highlightTextItem(noScroll) {
    document.querySelectorAll('.text-item').forEach((n) => n.classList.toggle('on', n.dataset.id === S.sel));
    if (!noScroll && S.sel) { const n = document.querySelector(`.text-item[data-id="${S.sel}"]`); if (n) n.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }
  function focusTextOf(id) {
    const n = document.querySelector(`.panel-body [data-focus="${id}"], .text-item[data-id="${id}"] textarea, .text-item[data-id="${id}"] input`);
    if (n && window.innerWidth >= 900) n.focus();
  }

  // ---------- scheda ELEMENTO ----------
  function panelElement(body) {
    const el = elById(S.sel);
    if (!el) { body.appendChild(h('div', { class: 'empty' }, 'Tocca un elemento della locandina per modificarlo.\nTrascinalo per spostarlo, usa il pallino blu in basso a destra per ingrandirlo e quello in alto per ruotarlo.')); return; }
    const titles = { text: 'Testo', image: 'Immagine / adesivo', shape: 'Forma', logo: 'Logo della scuola', qr: 'QR code' };
    body.appendChild(h('div', { style: 'font-weight:700;margin-bottom:10px' }, titles[el.type] || 'Elemento'));
    const upd = () => updateElementDom(el);

    if (el.type === 'logo') {
      body.appendChild(colors('Colore del logo', el.color || '#000000', (c) => { el.color = c; upd(); }));
      body.appendChild(colors('Interno', el.fill || '#ffffff', (c) => { el.fill = c; upd(); }, ['none']));
    }
    if (el.type === 'qr') {
      const q = el.qr;
      const inp = h('input', { type: 'url', value: q.url || '', placeholder: 'https://…' });
      inp.addEventListener('input', () => { q.url = inp.value.trim(); updateElementDomSoon(el); });
      inp.addEventListener('change', commit);
      body.appendChild(field('Link o testo del QR code', inp));
      body.appendChild(h('div', { class: 'field' }, toggle(' Logo al centro', q.logo, (v) => { q.logo = v; upd(); })));
      body.appendChild(colors('Colore quadratini', q.color || '#000000', (c) => { q.color = c; upd(); }));
      body.appendChild(range('Margine bianco', q.pad ?? 16, 0, 60, 1, (v) => { q.pad = v; upd(); }));
      body.appendChild(range('Cornice', q.frameWidth || 0, 0, 16, 1, (v) => { q.frameWidth = v; upd(); }));
      body.appendChild(colors('Colore cornice', q.frame || '#eda23b', (c) => { q.frame = c; if (!q.frameWidth) q.frameWidth = 4; upd(); }));
    }
    if (el.type === 'image') {
      body.appendChild(h('div', { class: 'row-btns', style: 'margin-bottom:12px' },
        h('button', { class: 'btn small', onclick: () => openLibrary((it) => { el.src = it.src; if (it.w) el.w = Math.round(el.w); commit(); renderStage(); }) }, '🔁 Cambia immagine'),
        h('button', { class: 'btn small', onclick: () => { el.flip = !el.flip; upd(); commit(); } }, '↔️ Specchia')));
      body.appendChild(colors('Colora (per icone e decorazioni di un solo colore)', el.tint || 'none', (c) => { el.tint = c === 'none' ? undefined : c; upd(); }, ['none']));
    }
    if (el.type === 'shape') {
      const s = el.shape;
      if (s.kind !== 'line') body.appendChild(colors('Colore', s.fill, (c) => { s.fill = c; upd(); }, ['none']));
      else body.appendChild(colors('Colore', s.fill, (c) => { s.fill = c; upd(); }));
      if (['box', 'circle', 'panel'].includes(s.kind)) {
        body.appendChild(colors('Bordo', s.stroke || 'none', (c) => { s.stroke = c === 'none' ? undefined : c; if (!s.strokeWidth) s.strokeWidth = 3; upd(); }, ['none']));
        body.appendChild(range('Spessore bordo', s.strokeWidth || 0, 0, 14, 0.5, (v) => { s.strokeWidth = v; upd(); }));
        body.appendChild(h('div', { class: 'field' }, toggle(' Bordo tratteggiato', !!(s.dash || s.dashStyle), (v) => { s.dash = v ? '14 10' : undefined; s.dashStyle = v ? 'dashed' : undefined; upd(); })));
      }
      if (s.kind === 'box') body.appendChild(range('Angoli arrotondati', s.radius || 0, 0, 200, 1, (v) => { s.radius = v; upd(); }));
      if (s.kind === 'line') body.appendChild(range('Spessore', s.strokeWidth || 4, 1, 20, 0.5, (v) => { s.strokeWidth = v; upd(); }));
      if (el.h) body.appendChild(range('Altezza', el.h, 4, S.doc.h, 1, (v) => { el.h = Math.round(v); upd(); }));
    }
    if (el.t) {
      if (el.type !== 'text') body.appendChild(h('div', { class: 'sep' }));
      textControls(body, el);
      if (el.type !== 'text') body.appendChild(h('button', { class: 'btn small danger', style: 'margin-bottom:12px', onclick: () => { delete el.t; commit(); renderStage(); renderPanel(); } }, 'Togli il testo da sopra'));
    } else if (el.type === 'image' || el.type === 'shape') {
      body.appendChild(h('button', { class: 'btn small', style: 'margin:4px 0 12px', onclick: () => {
        el.t = { text: 'Testo', font: 'Patrick Hand', size: 56, color: el.type === 'shape' && el.shape.kind === 'ribbon' ? '#ffffff' : '#43210f', valign: 'center', fit: true, pad: 10 };
        if (!el.h) { const d = domById(el.id); el.h = d ? d.offsetHeight : 200; }
        commit(); renderStage(); renderPanel(); } }, '➕ Scrivi un testo sopra'));
    }

    body.appendChild(h('div', { class: 'sep' }));
    commonControls(body, el);
  }

  function textControls(body, el) {
    const t = el.t;
    const upd = () => updateElementDom(el);
    const ta = h('textarea', { rows: Math.max(2, (t.text || '').split('\n').length), 'data-focus': el.id });
    ta.value = t.text || '';
    ta.addEventListener('input', () => { t.text = ta.value; updateElementDomSoon(el); });
    ta.addEventListener('change', commit);
    body.appendChild(field('Testo', ta));
    body.appendChild(helpMarkup());
    const fsel = h('select');
    FONTS.forEach(([f, lab]) => fsel.appendChild(h('option', { value: f, selected: f === t.font }, lab)));
    if (!FONTS.some(([f]) => f === t.font)) fsel.appendChild(h('option', { value: t.font, selected: true }, t.font));
    fsel.addEventListener('change', () => {
      t.font = fsel.value;
      const ws = (FONTS.find(([f]) => f === t.font) || [0, 0, [400]])[2];
      if (!ws.includes(t.weight || 400)) t.weight = ws[ws.length - 1] >= 600 ? ws[ws.length - 1] : ws[0];
      upd(); commit(); renderPanel();
    });
    body.appendChild(field('Carattere', fsel));
    const ws = (FONTS.find(([f]) => f === t.font) || [0, 0, [400]])[2];
    if (ws.length > 1) body.appendChild(field('Peso', seg(ws.map((w) => [w, { 400: 'Normale', 500: 'Medio', 600: 'Semi', 700: 'Grassetto', 800: 'Nero' }[w] || w]), t.weight || ws[0], (v) => { t.weight = v; upd(); })));
    body.appendChild(range('Grandezza', t.size || 40, 8, 260, 1, (v) => { t.size = v; upd(); }));
    body.appendChild(range('Spessore extra', t.stroke || 0, 0, 8, 0.1, (v) => { t.stroke = v || undefined; upd(); }, (v) => v.toFixed(1)));
    body.appendChild(colors('Colore', t.color || '#000000', (c) => { t.color = c; if (t.strokeColor) t.strokeColor = undefined; upd(); }));
    if ((t.text || '').includes('*')) body.appendChild(colors('Colore evidenziato (*parola*)', t.accent || '#b5201a', (c) => { t.accent = c; upd(); }));
    body.appendChild(field('Allineamento', seg([['left', '⬅︎ Sinistra'], ['center', '↔︎ Centro'], ['right', 'Destra ➡︎']], t.align || 'center', (v) => { t.align = v; upd(); })));
    body.appendChild(range('Interlinea', t.lh || 1.15, 0.7, 2, 0.01, (v) => { t.lh = v; upd(); }, (v) => v.toFixed(2)));
    body.appendChild(range('Spaziatura lettere', t.ls || 0, -0.1, 0.4, 0.005, (v) => { t.ls = v || undefined; upd(); }, (v) => v.toFixed(2)));
    body.appendChild(h('div', { class: 'field inline' },
      toggle(' Riduci per stare nella larghezza', t.fit, (v) => { t.fit = v; upd(); }),
      toggle(' Corsivo', t.italic, (v) => { t.italic = v; upd(); })));
    if (el.type === 'text') {
      el.box = el.box || {};
      body.appendChild(colors('Sfondo (etichetta colorata)', el.box.bg || 'none', (c) => {
        if (c === 'none') { delete el.box.bg; } else { el.box.bg = c; if (!el.box.radius) el.box.radius = '40% 55% 45% 50% / 60% 45% 55% 40%'; if (t.pad == null) t.pad = [0, 10]; }
        upd(); }, ['none']));
    }
    const labIn = h('input', { type: 'text', value: el.label || '', placeholder: 'es. Data, Luogo, Orario…' });
    labIn.addEventListener('input', () => { el.label = labIn.value || undefined; });
    labIn.addEventListener('change', commit);
    body.appendChild(field('Nome del campo (nella scheda Testi)', labIn));
  }

  function commonControls(body, el) {
    const move = (dx, dy) => { el.x += dx; el.y += dy; const d = domById(el.id); d.style.left = el.x + 'px'; d.style.top = el.y + 'px'; drawOverlay(); commit(); };
    const st = 4;
    body.appendChild(field('Posizione', h('div', { class: 'inline' },
      h('div', { class: 'nudge no-grow' },
        h('span'), h('button', { onclick: () => move(0, -st) }, '▲'), h('span'),
        h('button', { onclick: () => move(-st, 0) }, '◀'), h('button', { title: 'Centra orizzontalmente', onclick: () => { const d = domById(el.id); el.x = Math.round(S.doc.w / 2 - d.offsetWidth / 2); move(0, 0); } }, '⊕'), h('button', { onclick: () => move(st, 0) }, '▶'),
        h('span'), h('button', { onclick: () => move(0, st) }, '▼'), h('span')),
      h('div', { style: 'display:flex;flex-direction:column;gap:6px' },
        h('button', { class: 'btn small', onclick: () => scaleEl(el, 1.08) }, '➕ Più grande'),
        h('button', { class: 'btn small', onclick: () => scaleEl(el, 1 / 1.08) }, '➖ Più piccolo')))));
    body.appendChild(range('Rotazione', el.rot || 0, -180, 180, 0.5, (v) => { el.rot = v || undefined; const d = domById(el.id); d.style.transform = v ? `rotate(${v}deg)` : ''; drawOverlay(); }, (v) => v + '°'));
    body.appendChild(range('Trasparenza', Math.round((el.opacity ?? 1) * 100), 10, 100, 1, (v) => { el.opacity = v >= 100 ? undefined : v / 100; upd2(el); }, (v) => v + '%'));
    body.appendChild(h('div', { class: 'row-btns' },
      h('button', { class: 'btn small', onclick: () => zorder(el, 1) }, '⬆︎ Porta avanti'),
      h('button', { class: 'btn small', onclick: () => zorder(el, -1) }, '⬇︎ Porta indietro'),
      h('button', { class: 'btn small', onclick: () => duplicateEl(el) }, '⧉ Duplica'),
      h('button', { class: 'btn small danger', onclick: () => deleteEl(el) }, '🗑 Elimina')));
  }
  const upd2 = (el) => updateElementDom(el);
  function scaleEl(el, f) {
    const d = domById(el.id);
    const cx = el.x + d.offsetWidth / 2, cy = el.y + d.offsetHeight / 2;
    el.w = Math.round(el.w * f); if (el.h) el.h = Math.round(el.h * f);
    if (el.t) { el.t.size = Math.round(el.t.size * f * 10) / 10; if (el.t.stroke) el.t.stroke = Math.round(el.t.stroke * f * 10) / 10; }
    updateElementDom(el);
    const d2 = domById(el.id);
    el.x = Math.round(cx - d2.offsetWidth / 2); el.y = Math.round(cy - d2.offsetHeight / 2);
    d2.style.left = el.x + 'px'; d2.style.top = el.y + 'px';
    drawOverlay(); commit(); renderPanel();
  }
  function zorder(el, dir) {
    const a = S.doc.elements; const i = a.indexOf(el); const j = i + dir;
    if (j < 0 || j >= a.length) return;
    a.splice(i, 1); a.splice(j, 0, el);
    commit(); renderStage();
  }
  function duplicateEl(el) {
    const c = clone(el); c.id = uid(); c.x += 30; c.y += 30;
    S.doc.elements.push(c); S.sel = c.id; commit(); renderStage(); renderPanel();
  }
  function deleteEl(el) {
    S.doc.elements = S.doc.elements.filter((e) => e !== el);
    S.sel = null; commit(); renderStage(); renderPanel();
  }

  // ---------- scheda AGGIUNGI ----------
  function addEl(e, center = true) {
    e.id = uid();
    if (center) {
      e.x = Math.round(S.doc.w / 2 - e.w / 2);
      e.y = Math.round(S.doc.h / 2 - (e.h || e.w * 0.6) / 2);
    }
    S.doc.elements.push(e);
    S.sel = e.id; commit();
    renderStage().then(() => setTab('elemento'));
  }
  function panelAdd(body) {
    const W = S.doc.w;
    const items = [
      ['🔤', 'Testo', () => addEl({ type: 'text', w: Math.round(W * 0.8), t: { text: 'Nuovo testo', font: 'Patrick Hand', size: 64, color: '#43210f', stroke: 1, fit: false } })],
      ['⭐', 'Adesivo', () => openLibrary((it) => addSticker(it))],
      ['🅰️', 'Titolo originale', () => openLibrary((it) => addSticker(it), 'titoli')],
      ['🏫', 'Logo', () => addEl({ type: 'logo', w: 280, color: '#000000', fill: '#ffffff' })],
      ['🔳', 'QR code', () => addEl({ type: 'qr', w: 360, label: 'Link QR', qr: { url: 'https://', color: '#000000', bg: '#ffffff', pad: 20, logo: true } })],
      ['🎀', 'Nastro', () => addEl({ type: 'shape', w: 600, h: 160, shape: { kind: 'ribbon', fill: '#c42a22' }, t: { text: 'Iscrizione entro …', font: 'Patrick Hand', size: 64, color: '#ffffff', stroke: 1.5, valign: 'center', pad: [0, 64, 34, 64], fit: true } })],
      ['🏷️', 'Etichetta', () => addEl({ type: 'text', w: 220, h: 54, rot: -1.5, t: { text: 'Etichetta:', font: 'Mali', weight: 600, size: 38, color: '#1d120c', valign: 'center', pad: [0, 10], fit: true }, box: { bg: '#face67', radius: '40% 55% 45% 50% / 60% 45% 55% 40%' } })],
      ['▭', 'Riquadro', () => addEl({ type: 'shape', w: 760, h: 200, shape: { kind: 'box', fill: '#fde6cf', stroke: '#d9a35a', strokeWidth: 3, dashStyle: 'dashed', radius: 40 }, t: { text: 'Testo nel riquadro', font: 'Patrick Hand', size: 54, color: '#43210f', valign: 'center', pad: 20, fit: true } })],
      ['🖌️', 'Pennellata', () => addEl({ type: 'shape', w: 420, h: 110, shape: { kind: 'brush', fill: '#c8102e' }, t: { text: 'IL 10/12', font: 'Fredoka', weight: 600, size: 70, color: '#ffffff', valign: 'center', pad: [0, 30], fit: true } })],
      ['🪧', 'Pannello', () => addEl({ type: 'shape', w: 900, h: 900, shape: { kind: 'panel', fill: 'rgba(255,250,240,0.6)', stroke: '#dda569', strokeWidth: 2.5, dash: '14 10' } })],
      ['⚪', 'Cerchio', () => addEl({ type: 'shape', w: 120, h: 120, shape: { kind: 'circle', fill: '#e9b75a' } })],
      ['❤️', 'Cuore', () => addEl({ type: 'shape', w: 120, h: 108, shape: { kind: 'heart', fill: '#e0464f' } })],
      ['★', 'Stella', () => addEl({ type: 'shape', w: 90, h: 86, shape: { kind: 'star', fill: '#f2c14e' } })],
      ['〰️', 'Linea', () => addEl({ type: 'shape', w: 400, h: 14, shape: { kind: 'line', fill: '#b5201a', strokeWidth: 5, curve: true } })],
      ['📷', 'Carica immagine', () => pickUpload((it) => addSticker(it))]
    ];
    const g = h('div', { class: 'add-grid' });
    items.forEach(([ic, lab, fn]) => g.appendChild(h('button', { onclick: fn }, h('span', null, ic), lab)));
    body.appendChild(g);
    body.appendChild(h('p', { class: 'hint', style: 'margin-top:14px' }, 'Gli adesivi comprendono le illustrazioni delle vostre locandine (omino, albero, Babbo Natale, zucche, biscotti…), i titoli originali e tante illustrazioni extra per Pasqua, primavera, estate, feste e scuola.'));
  }
  function addSticker(it) {
    const maxW = Math.min(S.doc.w * 0.8, Math.max(140, it.w || 300));
    const w = it.src.startsWith('assets/fluent') ? 220 : Math.round(maxW);
    addEl({ type: 'image', src: it.src, w });
  }

  // ---------- libreria adesivi ----------
  function openLibrary(onPick, startCat) {
    const cats = STICKER_CATALOG.slice();
    const ups = Array.from(Poster.UPLOADS.keys()).map((id) => ({ src: 'up:' + id, name: '' }));
    cats.push({ id: 'mie', name: '📷 Caricate da me', items: ups });
    let cur = startCat || cats[0].id;
    const tabs = h('div', { class: 'lib-tabs' });
    const grid = h('div', { class: 'lib-grid' });
    const draw = () => {
      tabs.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.c === cur));
      grid.innerHTML = '';
      const c = cats.find((x) => x.id === cur);
      if (cur === 'mie') grid.appendChild(h('div', { class: 'lib-item', onclick: () => { closeModal(); pickUpload(onPick); } }, h('div', { style: 'font-size:34px;height:80px;display:flex;align-items:center' }, '＋'), h('span', null, 'Carica dal telefono')));
      c.items.forEach((it) => grid.appendChild(h('div', { class: 'lib-item', onclick: () => { closeModal(); onPick(it); } },
        h('img', { src: Poster.resolveSrc(it.src), loading: 'lazy', alt: it.name }), it.name ? h('span', null, it.name) : null)));
    };
    cats.forEach((c) => tabs.appendChild(h('button', { 'data-c': c.id, onclick: () => { cur = c.id; draw(); } }, c.name)));
    openModal('Scegli un\'immagine', [tabs, h('div', { class: 'modal-body' }, grid)], true);
    draw();
    const on = tabs.querySelector('.on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' });
  }

  function pickUpload(onPick) {
    const inp = h('input', { type: 'file', accept: 'image/*' });
    inp.addEventListener('change', async () => {
      const f = inp.files[0]; if (!f) return;
      try {
        const it = await saveUpload(f);
        onPick(it);
      } catch (e) { toast('Impossibile leggere l\'immagine'); }
    });
    inp.click();
  }
  function saveUpload(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onerror = reject;
      r.onload = () => {
        const im = new Image();
        im.onerror = reject;
        im.onload = async () => {
          const max = 1800; let w = im.naturalWidth, hh = im.naturalHeight;
          const k = Math.min(1, max / Math.max(w, hh)); w = Math.round(w * k); hh = Math.round(hh * k);
          const c = document.createElement('canvas'); c.width = w; c.height = hh;
          c.getContext('2d').drawImage(im, 0, 0, w, hh);
          const png = /png|webp|gif/.test(file.type);
          const data = c.toDataURL(png ? 'image/png' : 'image/jpeg', 0.9);
          const id = uid('u');
          await Store.put('uploads', { id, data, name: file.name, w, h: hh });
          Poster.UPLOADS.set(id, data);
          resolve({ src: 'up:' + id, w, h: hh, name: file.name });
        };
        im.src = r.result;
      };
      r.readAsDataURL(file);
    });
  }

  // ---------- scheda SFONDO ----------
  function panelBg(body) {
    const bg = S.doc.bg || (S.doc.bg = { type: 'color', color: '#fcf4e7' });
    const set = (patch) => { Object.assign(bg, patch); renderStage(); };
    body.appendChild(field('Tipo di sfondo', seg([['color', 'Tinta unita'], ['stripes', 'Bordo a righe'], ['image', 'Immagine']], bg.type, (v) => {
      if (v === 'stripes') Object.assign(bg, { type: 'stripes', c1: bg.c1 || '#d64d43', c2: bg.c2 || '#fffaf7', band: bg.band || 30, stripe: 16, stripe2: 20, angle: -45, paper: bg.paper && bg.paper !== true ? bg.paper : '#fcf3ee', radius: 10 });
      else if (v === 'color') Object.assign(bg, { type: 'color', color: bg.color || '#fcf4e7' });
      else Object.assign(bg, { type: 'image', src: bg.src || BG_PRESETS[0].src });
      renderStage(); renderPanel();
    })));
    if (bg.type === 'color') {
      body.appendChild(colors('Colore', bg.color || '#fcf4e7', (c) => set({ color: c }), ['#fcf4e7', '#fdf6f1', '#fff8e8', '#eef6ff', '#f3fbef']));
      body.appendChild(h('div', { class: 'field' }, toggle(' Effetto carta (sfumatura)', bg.paper !== false, (v) => set({ paper: v ? undefined : false }))));
    } else if (bg.type === 'stripes') {
      body.appendChild(colors('Colore righe', bg.c1, (c) => set({ c1: c }), ['#d64d43', '#3f8f4f', '#2f6db3', '#e0a32e']));
      body.appendChild(colors('Colore tra le righe', bg.c2, (c) => set({ c2: c }), ['#fffaf7']));
      body.appendChild(colors('Colore carta', bg.paper, (c) => set({ paper: c }), ['#fcf3ee', '#fdf8ee']));
      body.appendChild(range('Spessore bordo', bg.band || 30, 0, 90, 1, (v) => set({ band: v })));
    } else {
      const g = h('div', { class: 'lib-grid' });
      BG_PRESETS.forEach((p) => g.appendChild(h('div', { class: 'lib-item', onclick: () => { set({ src: p.src }); commit(); if (p.w !== S.doc.w || p.h !== S.doc.h) toast('Questa cornice è pensata per un altro formato'); } }, h('img', { src: p.src, alt: '' }), h('span', null, p.name))));
      g.appendChild(h('div', { class: 'lib-item', onclick: () => pickUpload((it) => { set({ src: it.src }); commit(); }) }, h('div', { style: 'font-size:34px;height:80px;display:flex;align-items:center' }, '📷'), h('span', null, 'Carica una tua immagine')));
      body.appendChild(field('Immagine di sfondo', g));
    }
    body.appendChild(h('p', { class: 'hint' }, `Formato: ${S.doc.w} × ${S.doc.h} px${S.doc.w === 1080 && S.doc.h === 1920 ? ' (storia Instagram)' : ''}.`));
  }

  // ---------- scheda ALTRO ----------
  function panelMore(body) {
    body.appendChild(h('div', { class: 'row-btns', style: 'flex-direction:column;align-items:stretch' },
      h('button', { class: 'btn', onclick: saveAsModel }, '⭐ Salva come modello'),
      h('p', { class: 'hint', style: 'margin:0 0 8px' }, 'Un modello compare nella pagina iniziale: lo puoi riusare per i prossimi eventi.'),
      h('button', { class: 'btn', onclick: async () => { const c = clone(S.doc); c.id = uid('d'); c.name = S.doc.name + ' (copia)'; c.updated = Date.now(); await Store.put('docs', c); openDoc(c); toast('Copia creata'); } }, '⧉ Duplica questa locandina'),
      h('button', { class: 'btn', onclick: () => { if (confirm('Ripristinare il modello originale? Le modifiche a questa locandina andranno perse.')) { const t = BUILTIN_TEMPLATES.find((x) => x.id === S.doc.from) || S.models.find((x) => x.id === S.doc.from); if (!t) { toast('Modello originale non trovato'); return; } const id = S.doc.id, name = S.doc.name; S.doc = clone(t); S.doc.id = id; S.doc.name = name; S.doc.from = t.id; S.sel = null; commit(); renderStage(); renderPanel(); } } }, '↺ Ricomincia dal modello'),
      h('button', { class: 'btn danger', onclick: async () => { if (confirm(`Eliminare «${S.doc.name}»?`)) { await Store.del('docs', S.doc.id); S.doc = null; showHome(); } } }, '🗑 Elimina locandina')));
  }
  async function saveAsModel() {
    const name = prompt('Nome del nuovo modello:', (S.doc.name || 'Modello').replace(/ · \d\d\/\d\d$/, ''));
    if (!name) return;
    const m = clone(S.doc); m.id = uid('m'); m.name = name; m.updated = Date.now(); m.isModel = true;
    delete m.names;
    await Store.put('models', m);
    toast('Modello salvato ✓');
  }

  // ------------------------------------------------------------------ MODALE
  function openModal(title, content, wide) {
    const box = $('#modalBox'); box.innerHTML = '';
    box.appendChild(h('div', { class: 'modal-head' }, h('span', null, title), h('button', { class: 'icon-btn', onclick: closeModal }, '✕')));
    (Array.isArray(content) ? content : [h('div', { class: 'modal-body' }, content)]).forEach((c) => box.appendChild(c));
    box.style.height = wide ? '80vh' : '';
    $('#modal').classList.remove('hidden');
  }
  function closeModal() { $('#modal').classList.add('hidden'); $('#modalBox').innerHTML = ''; }
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });

  // ------------------------------------------------------------------ ESPORTAZIONE
  let fontCss = null;
  async function renderPng(doc) {
    const host = $('#exportHost');
    host.innerHTML = '';
    const node = h('div');
    host.appendChild(node);
    await Poster.renderDoc(doc, node);
    const opts = { pixelRatio: doc.exportScale || 1, width: doc.w, height: doc.h, cacheBust: false, backgroundColor: '#ffffff' };
    if (fontCss == null) {
      try { fontCss = await htmlToImage.getFontEmbedCSS(node); } catch (e) { fontCss = ''; }
    }
    if (fontCss) opts.fontEmbedCSS = fontCss;
    if (isSafari) { try { await htmlToImage.toBlob(node, opts); } catch (e) { /* primo giro di riscaldamento */ } }
    const blob = await htmlToImage.toBlob(node, opts);
    host.innerHTML = '';
    if (!blob) throw new Error('blob vuoto');
    return blob;
  }
  function slug(s) { return (s || 'locandina').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 60) || 'locandina'; }

  async function doExport() {
    if (!S.doc) return;
    S.sel = null; drawOverlay();
    const names = namesList(S.doc);
    const variants = [];
    if (names.length) {
      names.forEach((n) => { const c = clone(S.doc); c.elements.forEach((e) => { if (e.role === 'name') e.t.text = n; }); variants.push({ doc: c, file: slug(S.doc.name) + '-' + slug(n) + '.png' }); });
    } else variants.push({ doc: S.doc, file: slug(S.doc.name) + '.png' });

    const status = h('div', null, h('div', { class: 'spinner' }), h('p', { class: 'hint', style: 'text-align:center' }, variants.length > 1 ? `Preparo ${variants.length} immagini…` : 'Preparo l\'immagine…'));
    openModal('Scarica immagine', status);
    const results = [];
    try {
      for (let i = 0; i < variants.length; i++) {
        if (variants.length > 1) status.querySelector('p').textContent = `Preparo l'immagine ${i + 1} di ${variants.length}…`;
        const blob = await renderPng(variants[i].doc);
        results.push({ blob, name: variants[i].file, url: URL.createObjectURL(blob) });
      }
    } catch (e) {
      console.error(e);
      openModal('Scarica immagine', h('p', null, 'Qualcosa è andato storto durante la creazione dell\'immagine. Riprova; se il problema continua prova con un altro browser (Safari o Chrome).'));
      return;
    }
    const files = results.map((r) => new File([r.blob], r.name, { type: 'image/png' }));
    const canShare = !!(navigator.canShare && navigator.canShare({ files }));
    const content = h('div');
    if (results.length === 1) content.appendChild(h('img', { class: 'export-preview', src: results[0].url, alt: 'Anteprima' }));
    else { const l = h('div', { class: 'export-list' }); results.forEach((r) => l.appendChild(h('img', { src: r.url, alt: r.name }))); content.appendChild(l); }
    const btns = h('div', { class: 'row-btns', style: 'justify-content:center' });
    if (canShare) btns.appendChild(h('button', { class: 'btn primary', onclick: async () => {
      try { await navigator.share({ files }); } catch (e) { if (e && e.name !== 'AbortError') toast('Condivisione non riuscita, usa «Scarica»'); }
    } }, results.length > 1 ? '📲 Salva / condividi tutte' : '📲 Salva in Foto / Instagram'));
    btns.appendChild(h('button', { class: 'btn' + (canShare ? '' : ' primary'), onclick: () => {
      results.forEach((r, i) => setTimeout(() => { const a = h('a', { href: r.url, download: r.name }); document.body.appendChild(a); a.click(); a.remove(); }, i * 350));
    } }, results.length > 1 ? '⬇️ Scarica tutte (PNG)' : '⬇️ Scarica PNG'));
    content.appendChild(btns);
    const info = S.doc.w === 1080 && S.doc.h === 1920 ? 'Formato storia Instagram 1080×1920.' : `Formato ${S.doc.w * (S.doc.exportScale || 1)}×${S.doc.h * (S.doc.exportScale || 1)} px, adatto anche alla stampa.`;
    content.appendChild(h('p', { class: 'hint', style: 'text-align:center;margin-top:12px' }, info + (canShare ? ' Con «Salva in Foto» scegli «Salva immagine» oppure direttamente Instagram.' : ' Su iPhone puoi anche tenere premuto sull\'immagine e scegliere «Aggiungi a Foto».')));
    openModal('La tua locandina è pronta', content);
  }

  // ------------------------------------------------------------------ BACKUP
  async function backup() {
    const data = { app: 'locandine-sacra-famiglia', version: 1, date: new Date().toISOString(),
      docs: await Store.all('docs'), models: await Store.all('models'), uploads: await Store.all('uploads') };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `locandine-backup-${new Date().toISOString().slice(0, 10)}.json` });
    document.body.appendChild(a); a.click(); a.remove();
  }
  async function restore(file) {
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== 'locandine-sacra-famiglia') throw new Error('formato');
      for (const u of data.uploads || []) { await Store.put('uploads', u); Poster.UPLOADS.set(u.id, u.data); }
      for (const d of data.docs || []) await Store.put('docs', d);
      for (const m of data.models || []) await Store.put('models', m);
      toast(`Backup importato: ${(data.docs || []).length} locandine, ${(data.models || []).length} modelli`);
      showHome();
    } catch (e) { toast('Il file non è un backup valido'); }
  }

  // ------------------------------------------------------------------ eventi fissi
  function bindStatic() {
    $('#btnHome').addEventListener('click', () => { saveSoon(); S.sel = null; setTimeout(showHome, 50); });
    $('#btnUndo').addEventListener('click', undo);
    $('#btnRedo').addEventListener('click', redo);
    $('#btnExport').addEventListener('click', doExport);
    $('#docName').addEventListener('input', (e) => { S.doc.name = e.target.value; });
    $('#docName').addEventListener('change', commit);
    $('#tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setTab(b.dataset.tab); });
    $('#btnBackup').addEventListener('click', backup);
    $('#inpRestore').addEventListener('change', (e) => { if (e.target.files[0]) restore(e.target.files[0]); e.target.value = ''; });
    document.addEventListener('keydown', (e) => {
      if ($('#editor').classList.contains('hidden')) return;
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && !typing && S.sel) { e.preventDefault(); deleteEl(elById(S.sel)); }
      else if (e.key === 'Escape') { if (!$('#modal').classList.contains('hidden')) closeModal(); else { S.sel = null; drawOverlay(); renderPanel(); } }
      else if (S.sel && !typing && e.key.startsWith('Arrow')) {
        e.preventDefault(); const el = elById(S.sel); const st = e.shiftKey ? 20 : 2;
        if (e.key === 'ArrowLeft') el.x -= st; if (e.key === 'ArrowRight') el.x += st; if (e.key === 'ArrowUp') el.y -= st; if (e.key === 'ArrowDown') el.y += st;
        const d = domById(el.id); d.style.left = el.x + 'px'; d.style.top = el.y + 'px'; drawOverlay(); commit();
      }
    });
    window.addEventListener('pagehide', () => { if (S.doc) { S.doc.updated = Date.now(); Store.put('docs', clone(S.doc)); } });
  }

  window.App = { S, renderStage, openDoc, doExport, renderPng };
  init();
})();
