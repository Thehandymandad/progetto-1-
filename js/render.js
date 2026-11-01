/* Disegna una locandina (documento JSON) dentro un elemento DOM.
   Usato sia dall'editor sia dall'esportazione PNG. */
(function () {
  'use strict';

  const LOGO = {
    full: 'assets/logo/logo.png',
    lines: 'assets/logo/logo_lines.png',
    fill: 'assets/logo/logo_fill.png',
    ratio: 955 / 1241 // larghezza / altezza
  };

  // Immagini caricate dall'utente: id -> dataURL (riempito da app.js)
  const UPLOADS = new Map();

  function resolveSrc(src) {
    if (!src) return '';
    if (src.startsWith('up:')) return UPLOADS.get(src.slice(3)) || '';
    return src;
  }

  // ---------- immagini colorate (logo, icone monocromatiche) ----------
  const imgCache = new Map();
  function loadImage(src) {
    if (imgCache.has(src)) return imgCache.get(src);
    const p = new Promise((res, rej) => {
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => res(im);
      im.onerror = () => rej(new Error('Immagine non trovata: ' + src.slice(0, 80)));
      im.src = src;
    });
    imgCache.set(src, p);
    return p;
  }
  const tintCache = new Map();
  function tinted(src, color) {
    const key = src + '|' + color;
    if (tintCache.has(key)) return tintCache.get(key);
    const p = loadImage(src).then((im) => {
      const c = document.createElement('canvas');
      c.width = im.naturalWidth; c.height = im.naturalHeight;
      const g = c.getContext('2d');
      g.drawImage(im, 0, 0);
      g.globalCompositeOperation = 'source-in';
      g.fillStyle = color;
      g.fillRect(0, 0, c.width, c.height);
      return c.toDataURL('image/png');
    });
    tintCache.set(key, p);
    return p;
  }

  // ---------- testo ----------
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  // *parola* = colore evidenziato, **parola** = grassetto, __parola__ = sottolineato, ^^parola^^ = più grande
  function markup(s) {
    let h = esc(s || '');
    h = h.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    h = h.replace(/\*(.+?)\*/g, '<span class="acc">$1</span>');
    h = h.replace(/__(.+?)__/g, '<u>$1</u>');
    h = h.replace(/\^\^(.+?)\^\^/g, '<span class="big">$1</span>');
    return h.replace(/\n/g, '<br>');
  }

  function textCss(t) {
    const css = [];
    css.push(`font-family:'${t.font || 'Patrick Hand'}',cursive`);
    css.push(`font-size:${t.size || 40}px`);
    css.push(`font-weight:${t.weight || 400}`);
    css.push(`color:${t.color || '#3c1d0f'}`);
    css.push(`text-align:${t.align || 'center'}`);
    css.push(`line-height:${t.lh || 1.15}`);
    if (t.ls) css.push(`letter-spacing:${t.ls}em`);
    if (t.italic) css.push('font-style:italic');
    if (t.upper) css.push('text-transform:uppercase');
    if (t.stroke) {
      css.push(`-webkit-text-stroke:${t.stroke}px ${t.strokeColor || t.color || '#000'}`);
      if (t.strokeColor && t.strokeColor !== t.color) css.push('paint-order:stroke fill');
    }
    if (t.shadow) css.push(`text-shadow:${t.shadow}`);
    css.push(`--acc:${t.accent || t.color || '#b5201a'}`);
    css.push(`--big:${t.bigScale || 1.3}`);
    return css.join(';');
  }

  // ---------- forme SVG ----------
  function shapeSvg(el) {
    const s = el.shape || {};
    const fill = s.fill || '#c62f27';
    const stroke = s.stroke || 'none';
    const sw = s.strokeWidth || 0;
    const dash = s.dash ? `stroke-dasharray="${s.dash}"` : '';
    const common = `vector-effect="non-scaling-stroke" stroke="${stroke}" stroke-width="${sw}" ${dash} stroke-linecap="round"`;
    switch (s.kind) {
      case 'ribbon': {
        const dark = s.dark || shade(fill, -0.28);
        return `<svg viewBox="0 0 200 64" preserveAspectRatio="none" width="100%" height="100%">
          <defs><linearGradient id="g${el.id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${shade(fill, 0.12)}"/><stop offset="1" stop-color="${shade(fill, -0.08)}"/></linearGradient></defs>
          <path d="M0,20 L24,16 L24,56 L0,60 L9,40 Z" fill="${dark}"/>
          <path d="M200,20 L176,16 L176,56 L200,60 L191,40 Z" fill="${dark}"/>
          <path d="M14,46 L24,56 L24,46 Z" fill="${shade(fill, -0.45)}"/>
          <path d="M186,46 L176,56 L176,46 Z" fill="${shade(fill, -0.45)}"/>
          <path d="M14,10 Q100,-4 186,10 L186,46 Q100,32 14,46 Z" fill="url(#g${el.id})" ${common}/>
          <path d="M20,14 Q100,1 180,14" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>
        </svg>`;
      }
      case 'panel':
        return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
          <path d="M1,9 Q50,-3 99,9 L99,97 Q99,99.5 96,99.5 L4,99.5 Q1,99.5 1,97 Z" fill="${fill}" ${common}/></svg>`;
      case 'brush':
        return `<svg viewBox="0 0 120 40" preserveAspectRatio="none" width="100%" height="100%">
          <path d="M6,9 C22,3 52,5 76,4 C92,3 108,4 116,8 C119,15 117,24 118,31 C104,37 70,35 46,37 C30,38 14,37 4,34 C1,27 3,22 2,16 C2,13 4,10 6,9 Z" fill="${fill}" ${common}/>
          <path d="M10,12 C40,9 80,10 110,11" stroke="rgba(255,255,255,.22)" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/></svg>`;
      case 'heart':
        return `<svg viewBox="0 0 100 90" preserveAspectRatio="none" width="100%" height="100%">
          <path d="M50,86 C20,64 2,46 4,26 C6,10 20,2 33,4 C42,5 48,11 50,18 C52,11 58,5 67,4 C80,2 94,10 96,26 C98,46 80,64 50,86 Z" fill="${fill}" ${common}/></svg>`;
      case 'star':
        return `<svg viewBox="0 0 100 96" preserveAspectRatio="none" width="100%" height="100%">
          <path d="M50,4 C53,4 55,22 60,30 C66,36 92,33 94,37 C95,41 74,54 72,61 C70,69 81,89 78,92 C74,94 58,79 50,79 C42,79 26,94 22,92 C19,89 30,69 28,61 C26,54 5,41 6,37 C8,33 34,36 40,30 C45,22 47,4 50,4 Z" fill="${fill}" stroke="${s.stroke || shade(fill, -0.2)}" stroke-width="${sw || 1.5}" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>`;
      case 'line':
        return `<svg viewBox="0 0 100 10" preserveAspectRatio="none" width="100%" height="100%">
          <path d="M1,5 Q50,${s.curve ? 1 : 5} 99,5" fill="none" stroke="${fill}" stroke-width="${sw || 4}" ${dash} stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;
      default:
        return '';
    }
  }

  // schiarisce (amt>0) o scurisce (amt<0) un colore esadecimale
  function shade(hex, amt) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return hex;
    const n = parseInt(m[1], 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = (c) => Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt));
    r = f(r); g = f(g); b = f(b);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // ---------- QR ----------
  function qrSvg(text, color, bg) {
    const qr = window.qrcode(0, 'H');
    qr.addData(text || ' ', 'Byte');
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += `M${c},${r}h1v1h-1z`;
      }
    }
    return `<svg viewBox="0 0 ${n} ${n}" width="100%" height="100%" shape-rendering="crispEdges">` +
      `<rect width="${n}" height="${n}" fill="${bg || '#fff'}"/><path d="${d}" fill="${color || '#000'}"/></svg>`;
  }
  if (window.qrcode && window.qrcode.stringToBytesFuncs && window.qrcode.stringToBytesFuncs['UTF-8']) {
    window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs['UTF-8'];
  }

  // ---------- sfondo ----------
  function renderBg(doc, root) {
    const bg = doc.bg || { type: 'color', color: '#fdf6ec' };
    const d = document.createElement('div');
    d.className = 'bg';
    if (bg.type === 'image') {
      d.style.background = bg.color || '#fff';
      const im = document.createElement('img');
      im.src = resolveSrc(bg.src);
      im.className = 'bg-img';
      im.draggable = false;
      d.appendChild(im);
    } else if (bg.type === 'stripes') {
      const band = bg.band || 30;
      const sw = bg.stripe || 15;
      const sw2 = bg.stripe2 || sw;
      d.style.background = `repeating-linear-gradient(${bg.angle || -45}deg, ${bg.c1 || '#d24a40'} 0 ${sw}px, ${bg.c2 || '#fffaf6'} ${sw}px ${sw + sw2}px)`;
      const card = document.createElement('div');
      card.className = 'bg-card';
      card.style.inset = band + 'px';
      card.style.borderRadius = (bg.radius ?? 8) + 'px';
      card.style.background = paper(bg.paper || '#fdf6f1');
      d.appendChild(card);
    } else {
      d.style.background = bg.paper === false ? (bg.color || '#fdf6ec') : paper(bg.color || '#fdf6ec');
    }
    root.appendChild(d);
  }
  function paper(c) {
    return `radial-gradient(ellipse at 50% 42%, ${shade(c, 0.35)} 0%, ${c} 55%, ${shade(c, -0.035)} 100%)`;
  }

  // ---------- elementi ----------
  function textBlock(t, el) {
    const d = document.createElement('div');
    d.className = 'txt' + (t.fit ? ' fit' : '');
    d.style.cssText = textCss(t);
    const pad = t.pad;
    if (pad != null) d.style.padding = Array.isArray(pad) ? pad.map((p) => p + 'px').join(' ') : pad + 'px';
    if (t.underline) d.style.textDecoration = 'underline';
    d.innerHTML = markup(t.text);
    return d;
  }

  function renderElement(el, tasks) {
    const d = document.createElement('div');
    d.className = 'el el-' + el.type;
    d.dataset.id = el.id;
    const st = d.style;
    st.left = el.x + 'px';
    st.top = el.y + 'px';
    st.width = el.w + 'px';
    if (el.h) st.height = el.h + 'px';
    if (el.rot) st.transform = `rotate(${el.rot}deg)`;
    if (el.opacity != null && el.opacity < 1) st.opacity = el.opacity;
    if (el.hidden) st.display = 'none';

    if (el.type === 'image') {
      const im = document.createElement('img');
      im.draggable = false;
      im.alt = '';
      const src = resolveSrc(el.src);
      if (el.tint) {
        tasks.push(tinted(src, el.tint).then((u) => { im.src = u; }).catch(() => { im.src = src; }));
      } else im.src = src;
      if (el.flip) im.style.transform = 'scaleX(-1)';
      d.appendChild(im);
    } else if (el.type === 'shape') {
      const k = (el.shape || {}).kind;
      if (k === 'box' || k === 'circle') {
        const s = el.shape;
        const b = document.createElement('div');
        b.className = 'shape-box';
        b.style.background = s.fill || 'transparent';
        b.style.borderRadius = k === 'circle' ? '50%' : (s.radius || 0) + 'px';
        if (s.strokeWidth) b.style.border = `${s.strokeWidth}px ${s.dashStyle || 'solid'} ${s.stroke || '#000'}`;
        if (s.shadow) b.style.boxShadow = s.shadow;
        d.appendChild(b);
      } else {
        const b = document.createElement('div');
        b.className = 'shape-svg';
        b.innerHTML = shapeSvg(el);
        d.appendChild(b);
      }
    } else if (el.type === 'logo') {
      const color = (el.color || '#000000').toLowerCase();
      const fill = el.fill || '#ffffff';
      if (!el.h) st.height = Math.round(el.w / LOGO.ratio) + 'px';
      if ((color === '#000' || color === '#000000') && fill.toLowerCase() === '#ffffff') {
        const im = document.createElement('img'); im.src = LOGO.full; im.draggable = false; d.appendChild(im);
      } else {
        if (fill !== 'none') {
          const f = document.createElement('img'); f.draggable = false; d.appendChild(f);
          tasks.push(tinted(LOGO.fill, fill).then((u) => { f.src = u; }));
        }
        const l = document.createElement('img'); l.draggable = false; d.appendChild(l);
        tasks.push(tinted(LOGO.lines, color).then((u) => { l.src = u; }));
      }
    } else if (el.type === 'qr') {
      const q = el.qr || {};
      if (!el.h) st.height = el.w + 'px';
      const box = document.createElement('div');
      box.className = 'qr-box';
      box.style.background = q.bg || '#fff';
      box.style.padding = (q.pad ?? 16) + 'px';
      if (q.frameWidth) box.style.border = `${q.frameWidth}px solid ${q.frame || '#eda23b'}`;
      box.style.borderRadius = (q.radius || 0) + 'px';
      const inner = document.createElement('div');
      inner.className = 'qr-inner';
      inner.innerHTML = qrSvg(q.url, q.color, q.bg);
      if (q.logo) {
        const lg = document.createElement('img');
        lg.className = 'qr-logo';
        lg.src = LOGO.full;
        lg.draggable = false;
        inner.appendChild(lg);
      }
      box.appendChild(inner);
      d.appendChild(box);
    }

    // testo (elemento testo o testo sopra a immagine/forma)
    if (el.t && el.type !== 'qr') {
      const tb = textBlock(el.t, el);
      if (el.type !== 'text') tb.classList.add('overlay');
      if (el.t.valign) tb.dataset.valign = el.t.valign;
      if (el.type === 'text' && el.box) {
        const b = el.box;
        if (b.bg) tb.style.background = b.bg;
        if (b.radius != null) tb.style.borderRadius = typeof b.radius === 'number' ? b.radius + 'px' : b.radius;
        if (b.border) tb.style.border = b.border;
        if (b.borderBottom) tb.style.borderBottom = b.borderBottom;
      }
      d.appendChild(tb);
    }
    return d;
  }

  // adatta la dimensione del testo alla larghezza del riquadro
  function fitTexts(root) {
    root.querySelectorAll('.txt.fit').forEach((t) => {
      const box = t.parentElement;
      const maxW = box.clientWidth;
      const maxH = box.style.height ? box.clientHeight : Infinity;
      let size = parseFloat(t.style.fontSize);
      let guard = 0;
      t.style.whiteSpace = 'pre';
      while ((t.scrollWidth > maxW + 1 || t.scrollHeight > maxH + 1) && size > 8 && guard++ < 80) {
        size *= 0.96;
        t.style.fontSize = size.toFixed(2) + 'px';
      }
    });
  }

  /** Disegna il documento. Restituisce una Promise che si risolve quando tutto è pronto. */
  function renderDoc(doc, root) {
    root.innerHTML = '';
    root.classList.add('stage');
    root.style.width = doc.w + 'px';
    root.style.height = doc.h + 'px';
    renderBg(doc, root);
    const tasks = [];
    const layer = document.createElement('div');
    layer.className = 'layer';
    (doc.elements || []).forEach((el) => layer.appendChild(renderElement(el, tasks)));
    root.appendChild(layer);
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    return Promise.all(tasks).catch(() => {}).then(() => fontsReady).then(() => {
      fitTexts(root);
      const imgs = Array.from(root.querySelectorAll('img'));
      return Promise.all(imgs.map((im) => (im.complete && im.naturalWidth) ? Promise.resolve() : (im.decode ? im.decode().catch(() => {}) : new Promise((r) => { im.onload = im.onerror = r; }))));
    });
  }

  window.Poster = { renderDoc, renderElement, fitTexts, markup, shade, LOGO, UPLOADS, resolveSrc, tinted, loadImage };
})();
