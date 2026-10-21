/* El mensaje perdido del Bermejo · núcleo: mundo, movimiento, diálogos, sonido y guardado. */
(function () {
  'use strict';
  const M = window.BJM, D = window.BJD, C = window.BJC;
  const $ = (q, r) => (r || document).querySelector(q);
  const $$ = (q, r) => Array.from((r || document).querySelectorAll(q));
  const esc = C.esc;
  const G = window.BJG = { M, D, C, $, $$, esc, acts: {}, talk: {} };

  /* ---------------- guardado ---------------- */
  function load() { try { const raw = localStorage.getItem(M.KEY); if (raw) return M.validate(JSON.parse(raw)); } catch (e) { } const s = M.initial(); if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) s.prefs.rm = true; return s; }
  let S = load(); G.S = () => S;
  let saveT = 0;
  function save() { clearTimeout(saveT); saveT = setTimeout(saveNow, 120); }
  function saveNow() { clearTimeout(saveT); try { S.updated = Date.now(); localStorage.setItem(M.KEY, JSON.stringify(S)); } catch (e) { } }
  function resetAdventure() {
    const prefs = Object.assign({}, S.prefs);
    try { localStorage.removeItem(M.KEY); M.OLD_KEYS.forEach(k => localStorage.removeItem(k)); } catch (e) { }
    S = M.initial(); S.prefs = prefs; G.S = () => S;
    closeActivity(); stopVoice(); applyPrefs(); showStart();
    announce('La aventura se reinició. Los otros juegos de la página no cambiaron.');
  }
  G.save = save; G.saveNow = saveNow; G.reset = resetAdventure;

  /* ---------------- utilidades ---------------- */
  function announce(t) { const a = $('#announcement'); if (!a) return; a.textContent = ''; setTimeout(() => { a.textContent = t; }, 40); }
  function toast(t, kind) { const el = $('#toast'); el.textContent = t; el.className = 'show ' + (kind || ''); clearTimeout(toast.t); toast.t = setTimeout(() => { el.className = ''; }, 3600); announce(t); }
  function imgLabel(img) { const [t, id] = (img || '').split(':'); return t === 'p' ? M.PICTOS[id] : t === 'i' ? M.ILUS[id].n : ''; }
  function imgHTML(img, cls) {
    if (!img) return '';
    const t = img.split(':')[0];
    return `<img draggable="false" class="${cls || ''} ${t === 'p' ? 'is-picto' : 'is-ilu'}" src="${D.imgHref(img)}" alt="${esc((t === 'p' ? 'Pictograma: ' : 'Ilustración: ') + imgLabel(img))}">`;
  }
  G.announce = announce; G.toast = toast; G.imgHTML = imgHTML; G.imgLabel = imgLabel;

  /* ---------------- preferencias ---------------- */
  function applyPrefs() {
    const b = document.body.classList;
    b.toggle('rm', !!S.prefs.rm); b.toggle('hc', !!S.prefs.hc); b.toggle('big', !!S.prefs.big);
    b.toggle('mode-detective', S.mode === 'detective'); b.toggle('mode-acomp', S.mode !== 'detective');
    music(S.prefs.musica);
  }
  G.applyPrefs = applyPrefs;

  /* ---------------- sonido (opcional) ---------------- */
  const SND = { ctx: null, master: null, timer: 0, step: 0 };
  function audio() {
    if (SND.ctx) { if (SND.ctx.state === 'suspended') SND.ctx.resume(); return SND.ctx; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    try { SND.ctx = new AC(); SND.master = SND.ctx.createGain(); SND.master.gain.value = .5; SND.master.connect(SND.ctx.destination); } catch (e) { return null; }
    return SND.ctx;
  }
  G.audio = audio;
  function tone(f, t, d, type, v) { const c = SND.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v || .12, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(SND.master); o.start(t); o.stop(t + d + .05); }
  function noise(t, d, f, v) { const c = SND.ctx, n = Math.floor(c.sampleRate * d), b = c.createBuffer(1, n, c.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = b; fl.type = 'lowpass'; fl.frequency.value = f; g.gain.value = v; s.connect(fl); fl.connect(g); g.connect(SND.master); s.start(t); }
  const mf = n => 440 * Math.pow(2, (n - 69) / 12);
  function sfx(k) {
    if (!S.prefs.sonido || !audio()) return; const t = SND.ctx.currentTime + .03;
    switch (k) {
      case 'pick': [76, 83].forEach((n, i) => tone(mf(n), t + i * .09, .3, 'triangle', .1)); break;
      case 'ok': [72, 76, 79].forEach((n, i) => tone(mf(n), t + i * .08, .35, 'sine', .11)); break;
      case 'fiesta': [72, 76, 79, 84, 88].forEach((n, i) => tone(mf(n), t + i * .1, .5, 'triangle', .12)); break;
      case 'suave': tone(mf(67), t, .28, 'sine', .07); break;
      case 'hmm': tone(mf(64), t, .25, 'sine', .07); tone(mf(62), t + .14, .3, 'sine', .07); break;
      case 'agua': noise(t, .9, 900, .25); break;
      case 'cae': noise(t, .5, 300, .5); tone(70, t, .4, 'sine', .25); break;
      case 'toc': tone(120, t, .12, 'square', .06); tone(110, t + .14, .12, 'square', .06); break;
      case 'paso': tone(mf(52 + Math.floor(Math.random() * 3)), t, .07, 'sine', .025); break;
      case 'puerta': tone(mf(60), t, .15, 'triangle', .05); tone(mf(67), t + .1, .2, 'triangle', .05); break;
    }
  }
  function music(on) {
    clearInterval(SND.timer); SND.timer = 0;
    if (!on || !audio()) return;
    const notes = [60, 64, 67, 72, 69, 67, 64, 62, 60, 64, 67, 69, 67, 64, 62, 59];
    SND.timer = setInterval(() => { if (!S.prefs.musica || speaking) return; const t = SND.ctx.currentTime + .02; tone(mf(notes[SND.step % notes.length]), t, .9, 'triangle', .022); if (SND.step % 4 === 0) tone(mf(notes[SND.step % notes.length] - 24), t, 1.6, 'sine', .02); SND.step++; }, 520);
  }
  G.sfx = sfx;

  /* ---------------- voz (opcional) ---------------- */
  let speaking = false;
  const VOZ = { marta: [1.05, .98], profe: [.82, .95], tomas: [1.15, 1], sol: [1.25, 1], bruno: [1.1, .98], nico: [1.12, 1.03], rosa: [.95, .9], juli: [1.4, 1.02], lucas: [1.12, .98], mati: [1.2, 1.05] };
  function pickVoice() { try { const vs = speechSynthesis.getVoices().filter(v => /^es/i.test(v.lang)); return vs.find(v => /es-AR/i.test(v.lang)) || vs.find(v => /es-(419|US|MX)/i.test(v.lang)) || vs[0] || null; } catch (e) { return null; } }
  function speak(text, who) {
    if (!('speechSynthesis' in window)) { toast('Este navegador no tiene lectura en voz alta.'); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/[«»“”]/g, ''));
      u.lang = 'es-AR'; const v = pickVoice(); if (v) u.voice = v;
      const p = VOZ[who] || [1, 1]; u.pitch = p[0]; u.rate = p[1] * .95;
      u.onstart = () => { speaking = true; }; u.onend = u.onerror = () => { speaking = false; };
      speechSynthesis.speak(u);
    } catch (e) { }
  }
  function stopVoice() { try { speechSynthesis.cancel(); } catch (e) { } speaking = false; }
  function autoSpeak(text, who) { if (S.prefs.voz) speak(text, who); }
  G.speak = speak; G.autoSpeak = autoSpeak; G.stopVoice = stopVoice;
  document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (b) { e.preventDefault(); e.stopPropagation(); speak(b.dataset.say, b.dataset.who); } }, true);
  const sayBtn = (t, who, lab) => `<button type="button" class="say" data-say="${esc(t)}" ${who ? `data-who="${who}"` : ''} aria-label="${esc(lab || 'Escuchar')}"><span aria-hidden="true">🔊</span></button>`;
  G.sayBtn = sayBtn;

  /* ---------------- puntos de interés ---------------- */
  const NEIGHBOR = { mirador: [null, 'escuela'], escuela: ['mirador', 'lab'], lab: ['escuela', 'feria'], feria: ['lab', null] };
  function spots() {
    const s = S, a = s.area, L = [];
    const add = o => L.push(Object.assign({ w: 90, h: 110, y: 440, kind: 'obj' }, o));
    const [left, right] = NEIGHBOR[a];
    if (left) add({ id: 'exitL', x: 30, y: 515, w: 60, h: 70, kind: 'exit', label: 'Ir a ' + M.AREA_NAME[left], icon: '←', to: left });
    if (right) add({ id: 'exitR', x: 970, y: 515, w: 60, h: 70, kind: 'exit', label: 'Ir a ' + M.AREA_NAME[right], icon: '→', to: right });
    if (a === 'mirador') {
      add({ id: 'tomas', x: 250, y: 430, w: 90, h: 170, kind: 'npc', label: 'Hablar con Tomás', done: s.a.done });
      if (!s.pictos.includes('costa')) add({ id: 'banco', x: 135, y: 470, w: 130, h: 70, kind: 'secret', label: 'Mirar debajo del banco' });
      add({ id: 'cartel', x: 380, y: 360, w: 140, h: 100, label: 'Leer el cartel viejo', done: M.hasEv(s, 'ev-cartel') });
      add({ id: 'costa', x: 440, y: 290, w: 110, h: 120, label: 'Observar la barranca', done: M.hasEv(s, 'ev-costa') });
      add({ id: 'raices', x: 530, y: 232, w: 90, h: 70, label: 'Mirar el borde de arriba', done: M.hasEv(s, 'ev-raices') });
      add({ id: 'base', x: 635, y: 378, w: 150, h: 52, label: 'Mirar la base de la barranca', done: M.hasEv(s, 'ev-hueco') });
      add({ id: 'agua', x: 770, y: 420, w: 140, h: 50, label: 'Mirar el agua del río', done: M.hasEv(s, 'ev-agua') });
      add({ id: 'orilla', x: 895, y: 390, w: 120, h: 50, label: 'Mirar la orilla', done: M.hasEv(s, 'ev-caida') });
    } else if (a === 'escuela') {
      add({ id: 'corcho', x: 150, y: 230, w: 170, h: 150, label: 'Ordenar la explicación en el corcho', done: s.d.done });
      if (!s.b.done) add({ id: 'nico', x: 280, y: 430, w: 90, h: 170, kind: 'npc', label: 'Hablar con Nico' });
      add({ id: 'mesa', x: 400, y: 420, w: 170, h: 80, label: 'Mesa de pistas', done: s.b.done });
      if (!s.d.done) add({ id: 'marta', x: 548, y: 430, w: 90, h: 170, kind: 'npc', label: 'Hablar con la Seño Marta' });
      if (!s.g.done) add({ id: 'sol', x: 668, y: 430, w: 90, h: 170, kind: 'npc', label: 'Hablar con Sol' });
      if (!s.pictos.includes('escuchar')) add({ id: 'maceta', x: 712, y: 232, w: 70, h: 70, kind: 'secret', label: 'Mirar detrás de la maceta' });
      add({ id: 'ventana', x: 790, y: 140, w: 120, h: 120, label: 'Mirar por la ventana' });
      if (!s.d.done) add({ id: 'bruno', x: 830, y: 430, w: 110, h: 170, kind: 'npc', label: 'Hablar con Bruno' });
      if (!M.has(s, 'tijera')) add({ id: 'armario', x: 930, y: 380, w: 110, h: 100, kind: 'secret', label: 'Abrir el cajón del armario' });
    } else if (a === 'lab') {
      if (!M.has(s, 'lupa')) add({ id: 'cajonera', x: 140, y: 385, w: 140, h: 110, kind: 'secret', label: 'Abrir la cajonera' });
      add({ id: 'profe', x: 330, y: 430, w: 90, h: 170, kind: 'npc', label: 'Hablar con el profe Daniel' });
      add({ id: 'afiche', x: 330, y: 170, w: 140, h: 110, label: 'Leer el afiche del modelo' });
      add({ id: 'maqueta', x: 580, y: 320, w: 300, h: 120, label: 'Usar la maqueta', done: s.c.done });
      if (s.b.done && !s.c.done) add({ id: 'nico', x: 780, y: 430, w: 90, h: 170, kind: 'npc', label: 'Hablar con Nico' });
      if (!s.pictos.includes('investigar')) add({ id: 'estante', x: 900, y: 200, w: 120, h: 80, kind: 'secret', label: 'Revisar el estante' });
    } else if (a === 'feria') {
      if (s.d.done) add({ id: 'marta', x: 110, y: 430, w: 90, h: 170, kind: 'npc', label: 'Hablar con la Seño Marta' });
      add({ id: 'planetas', x: 130, y: 250, w: 170, h: 110, label: 'Mirar el stand de los planetas' });
      add({ id: 'ensayo', x: 240, y: 330, w: 110, h: 150, label: 'Leer el cartel del ensayo', done: M.hasEv(s, 'ev-ensayo') });
      if (s.d.done) add({ id: 'bruno', x: 345, y: 440, w: 90, h: 160, kind: 'npc', label: 'Hablar con Bruno' });
      add({ id: 'stand', x: 520, y: 300, w: 240, h: 240, label: s.e.done ? 'Revisar el cartel del stand' : 'Armar el cartel del stand', done: s.f.done });
      if (s.c.done) add({ id: 'nico', x: 640, y: 450, w: 80, h: 150, kind: 'npc', label: 'Hablar con Nico' });
      add({ id: 'visitantes', x: 800, y: 440, w: 220, h: 170, kind: 'npc', label: 'Hablar con los visitantes', done: s.f.done });
      if (!s.pictos.includes('comunicar')) add({ id: 'telon', x: 945, y: 330, w: 90, h: 200, kind: 'secret', label: 'Mirar detrás del telón' });
    }
    return L;
  }
  G.spots = spots;

  /* ---------------- pantalla de juego ---------------- */
  const P = { x: 500, y: 505, tx: null, ty: null, dir: 1, walking: false, pending: null };
  const keys = {};
  let busy = false;
  let revealed = {};
  G.isBusy = () => busy;

  function shell() {
    $('#game').innerHTML = `
    <header class="topbar">
      <button type="button" class="tb-b tb-home" id="b-home" aria-label="Volver al inicio de Misión Inclusión"><span aria-hidden="true">⌂</span><span class="tb-l">Inicio</span></button>
      <div class="tb-title"><strong>El mensaje perdido del Bermejo</strong><span id="area-name"></span></div>
      <nav class="tb-nav" aria-label="Herramientas del juego">
        <button type="button" id="b-obj" class="tb-b"><span aria-hidden="true">🎯</span><span class="tb-l">Objetivos</span></button>
        <button type="button" id="b-mochila" class="tb-b"><span aria-hidden="true">🎒</span><span class="tb-l">Mochila</span><span class="badge" id="n-mochila"></span></button>
        <button type="button" id="b-cuaderno" class="tb-b"><span aria-hidden="true">📓</span><span class="tb-l">Cuaderno</span><span class="badge" id="n-cuaderno"></span></button>
        <button type="button" id="b-mapa" class="tb-b"><span aria-hidden="true">🗺️</span><span class="tb-l">Mapa</span></button>
        <button type="button" id="b-ayuda" class="tb-b"><span aria-hidden="true">💡</span><span class="tb-l">Ayuda</span></button>
        <button type="button" id="b-ajustes" class="tb-b"><span aria-hidden="true">⚙️</span><span class="tb-l">Ajustes</span></button>
      </nav>
    </header>
    <main class="world" id="world">
      <div class="goal" id="goal"></div>
      <div class="viewport" id="vp"><div class="stage" id="stage"><div id="scene"></div><div class="spots" id="spots"></div><div class="player" id="player" aria-hidden="true"></div><div class="help-arrow" id="help-arrow" hidden aria-hidden="true">⬇</div></div></div>
      <div class="prompt" id="prompt" hidden></div>
      <section class="talk" id="talk" hidden aria-live="polite" aria-label="Conversación"></section>
    </main>
    <div class="pad" id="pad" role="group" aria-label="Controles para moverse">
      <div class="pad-dir">
        <button type="button" class="pad-b" data-k="left" aria-label="Caminar a la izquierda">◀</button>
        <button type="button" class="pad-b" data-k="up" aria-label="Caminar hacia el fondo">▲</button>
        <button type="button" class="pad-b" data-k="down" aria-label="Caminar hacia adelante">▼</button>
        <button type="button" class="pad-b" data-k="right" aria-label="Caminar a la derecha">▶</button>
      </div>
      <button type="button" class="pad-act" id="b-act" disabled><span aria-hidden="true">✋</span> <span id="b-act-l">Acercate a algo</span></button>
    </div>`;
    $('#b-home').onclick = goHome;
    $('#b-obj').onclick = () => G.openPanel('objetivos');
    $('#b-mochila').onclick = () => G.openPanel('mochila');
    $('#b-cuaderno').onclick = () => G.openPanel('cuaderno');
    $('#b-mapa').onclick = () => G.openPanel('mapa');
    $('#b-ajustes').onclick = () => G.openPanel('ajustes');
    $('#b-ayuda').onclick = worldHelp;
    $('#b-act').onclick = () => { const n = nearest(); if (n) interact(n); };
    $$('.pad-b').forEach(b => {
      const k = b.dataset.k;
      const on = e => { e.preventDefault(); keys[k] = true; P.tx = null; P.pending = null; loop(); };
      const off = () => { keys[k] = false; };
      b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
      b.addEventListener('contextmenu', e => e.preventDefault());
      b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); keys[k] = true; loop(); } });
      b.addEventListener('keyup', e => { if (e.key === 'Enter' || e.key === ' ') keys[k] = false; });
    });
    $('#vp').addEventListener('click', e => {
      if (busy || e.target.closest('.spot')) return;
      const r = $('#stage').getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * D.W, y = (e.clientY - r.top) / r.height * D.H;
      if (y > 300) walkTo(x, Math.max(470, Math.min(540, y)), null);
    });
    window.addEventListener('resize', layout);
  }

  function enterWorld() {
    shell(); P.x = S.x; P.y = S.y; renderAll(); layout(); setTimeout(layout, 60);
    $('#game').focus({ preventScroll: true });
    if (!S.flags.intro) setTimeout(() => interact(spots().find(q => q.id === 'marta')), 450);
  }
  G.enterWorld = enterWorld;

  function renderAll() { renderScene(); renderPlayer(); renderHUD(); }
  G.refresh = () => { if ($('#scene')) { renderScene(); renderHUD(); } };
  function renderScene() {
    $('#scene').innerHTML = D.scene(S.area, S, M);
    $('#area-name').textContent = M.AREA_NAME[S.area];
    renderSpots();
  }
  function renderSpots() {
    const cfg = M.cfg(S), box = $('#spots'); if (!box) return;
    const foc = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.spot : null;
    box.innerHTML = spots().map(q => {
      const near = Math.abs(q.x - P.x) < 170, secret = q.kind === 'secret';
      if (secret && !cfg.markers && !near && !revealed[q.id]) return '';
      const mark = q.kind === 'exit' ? '' : (q.done ? '<span class="spot-ok" aria-hidden="true">✓</span>' : ((cfg.markers || revealed[q.id] || secret) ? '<span class="spot-mark" aria-hidden="true">✦</span>' : ''));
      return `<button type="button" class="spot spot-${q.kind}${revealed[q.id] ? ' revealed' : ''}" data-spot="${q.id}" style="left:${q.x / 10}%;top:${q.y / 5.6}%;width:${q.w / 10}%;height:${q.h / 5.6}%" aria-label="${esc(q.label + (q.done ? ' (ya revisado)' : ''))}">${q.icon ? `<span class="spot-ic" aria-hidden="true">${q.icon}</span>` : ''}${mark}<span class="spot-tip" aria-hidden="true">${esc(q.label)}</span></button>`;
    }).join('');
    $$('.spot', box).forEach(b => {
      b.onclick = e => { e.stopPropagation(); if (busy) return; const q = spots().find(z => z.id === b.dataset.spot); if (!q) return; goAndInteract(q); };
      b.onfocus = () => center(b.dataset.spot);
    });
    if (foc) { const f = $(`[data-spot="${foc}"]`, box); if (f) f.focus({ preventScroll: true }); }
    updatePrompt();
  }
  function goAndInteract(q) {
    if (q.kind === 'exit') { interact(q); return; }
    const tx = clampX(q.x + (q.x > P.x ? -45 : 45));
    if (S.prefs.rm || Math.abs(q.x - P.x) < 95) { P.x = tx; P.dir = q.x >= P.x ? 1 : -1; renderPlayer(); interact(q); } else walkTo(tx, P.y, q);
  }
  function center(id) { const q = spots().find(z => z.id === id); if (q) pan(q.x); }
  function renderHUD() {
    const q = M.current(S), g = $('#goal'); if (!g) return;
    g.innerHTML = q ? `<span class="goal-ic" aria-hidden="true">🎯</span><span class="goal-t">${esc(q.t)}</span>${sayBtn(q.t, null, 'Escuchar el objetivo')}` : `<span class="goal-ic" aria-hidden="true">🎉</span><span class="goal-t">¡Misión cumplida! Podés seguir explorando o probar otras formas de comunicar.</span>`;
    $('#n-mochila').textContent = (S.items.length + S.pictos.length) || '';
    $('#n-cuaderno').textContent = S.ev.length || '';
  }
  G.renderHUD = renderHUD;

  function renderPlayer() {
    const el = $('#player'); if (!el) return;
    if (el.dataset.av !== S.avatar) { el.innerHTML = `<div class="pl-in">${D.avatar(S.avatar, { expr: 'contento' })}</div>`; el.dataset.av = S.avatar; }
    el.style.left = (P.x / 10) + '%'; el.style.top = (P.y / 5.6) + '%';
    el.style.setProperty('--sc', (.92 + (P.y - 470) / 70 * .12).toFixed(3));
    el.classList.toggle('walk', P.walking && !S.prefs.rm); el.classList.toggle('flip', P.dir < 0);
    el.style.zIndex = 2;
    pan(P.x);
  }
  let scale = 1, offX = 0;
  function layout() {
    const vp = $('#vp'); if (!vp) return;
    const W = vp.clientWidth, H = vp.clientHeight;
    let sc = Math.min(W / D.W, H / D.H);
    if (W / D.W < H / D.H * .8) sc = Math.min(H / D.H, (W / D.W) * 2.4);
    scale = sc;
    const st = $('#stage'); st.style.width = (D.W * sc) + 'px'; st.style.height = (D.H * sc) + 'px';
    st.style.top = Math.max(0, (H - D.H * sc) / 2) + 'px';
    pan(P.x, true);
  }
  function pan(x, force) {
    const vp = $('#vp'), st = $('#stage'); if (!vp || !st) return;
    const W = vp.clientWidth, sw = D.W * scale;
    const o = sw <= W ? (W - sw) / 2 : Math.max(W - sw, Math.min(0, W / 2 - x * scale));
    if (force || Math.abs(o - offX) > .5) { offX = o; st.style.transform = `translateX(${o}px)`; }
  }
  const clampX = x => Math.max(40, Math.min(960, x));

  /* ---------------- movimiento ---------------- */
  let raf = 0, last = 0, stepT = 0, lastSpotsX = -999;
  function walkTo(x, y, spot) { P.tx = clampX(x); P.ty = y; P.pending = spot; if (S.prefs.rm) { P.dir = P.tx >= P.x ? 1 : -1; P.x = P.tx; P.y = P.ty; P.tx = null; arrive(); return; } loop(); }
  G.walkTo = walkTo;
  function loop() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  function tick(now) {
    raf = 0; const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (busy || $('#activity').open) { P.walking = false; renderPlayer(); return; }
    let dx = 0, dy = 0;
    if (keys.left) dx -= 1; if (keys.right) dx += 1; if (keys.up) dy -= 1; if (keys.down) dy += 1;
    if (dx || dy) { P.tx = null; P.pending = null; }
    else if (P.tx != null) { const ex = P.tx - P.x, ey = (P.ty == null ? P.y : P.ty) - P.y, d = Math.hypot(ex, ey); if (d < 6) { P.x = P.tx; P.tx = null; arrive(); return; } dx = ex / d; dy = ey / d; }
    if (dx || dy) {
      P.walking = true; if (dx) P.dir = dx > 0 ? 1 : -1;
      P.x += dx * 300 * dt; P.y = Math.max(470, Math.min(540, P.y + dy * 150 * dt));
      if (P.x < 34 && keys.left && NEIGHBOR[S.area][0]) { travel(NEIGHBOR[S.area][0], 'right'); return; }
      if (P.x > 966 && keys.right && NEIGHBOR[S.area][1]) { travel(NEIGHBOR[S.area][1], 'left'); return; }
      P.x = clampX(P.x);
      stepT += dt; if (stepT > .32) { stepT = 0; sfx('paso'); }
      renderPlayer(); updatePrompt(); if (Math.abs(lastSpotsX - P.x) > 60) { lastSpotsX = P.x; renderSpots(); }
      raf = requestAnimationFrame(tick);
    } else { P.walking = false; renderPlayer(); S.x = P.x; S.y = P.y; save(); renderSpots(); }
  }
  function arrive() { const q = P.pending; P.pending = null; P.walking = false; renderPlayer(); S.x = P.x; S.y = P.y; save(); renderSpots(); if (q) interact(q); }
  function travel(to, side) {
    stopVoice(); sfx('puerta');
    S.area = to; P.x = side === 'right' ? 920 : side === 'left' ? 80 : 500; P.y = 505; P.tx = null; P.pending = null;
    Object.keys(keys).forEach(k => { keys[k] = false; });
    S.x = P.x; S.y = P.y; revealed = {}; save();
    const sc = $('#scene'); if (sc && !S.prefs.rm) { sc.classList.remove('fade'); void sc.offsetWidth; sc.classList.add('fade'); }
    renderAll(); layout(); lastSpotsX = P.x;
    const q = M.current(S);
    announce('Llegaste a: ' + M.AREA_NAME[to] + '. ' + (q && q.area === to ? 'Objetivo: ' + q.t : ''));
    if (to === 'feria' && !S.flags.feriaVista) { S.flags.feriaVista = true; save(); setTimeout(() => say([{ who: 'narra', t: 'La feria de ciencias. El stand «El río se lleva mi pueblo» está vacío y sus papeles quedaron mezclados. Algunos visitantes ya esperan.' }]), 350); }
  }
  G.travel = travel;

  function nearest() {
    let best = null, bd = 1e9;
    for (const q of spots()) { if (q.kind === 'secret' && !M.cfg(S).markers && Math.abs(q.x - P.x) > 170 && !revealed[q.id]) continue; const d = Math.abs(q.x - P.x) + (q.kind === 'exit' ? 25 : 0); if (d < 85 && d < bd) { bd = d; best = q; } }
    return best;
  }
  function updatePrompt() {
    const n = busy ? null : nearest(), pr = $('#prompt'), b = $('#b-act'); if (!pr) return;
    $$('#spots .spot.near').forEach(x => x.classList.remove('near'));
    if (n) { pr.hidden = false; pr.innerHTML = `<kbd>E</kbd> ${esc(n.label)}`; b.disabled = false; $('#b-act-l').textContent = n.label; const el = $(`#spots [data-spot="${n.id}"]`); if (el) el.classList.add('near'); }
    else { pr.hidden = true; b.disabled = true; $('#b-act-l').textContent = 'Acercate a algo'; }
  }

  /* teclado */
  const KMAP = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down' };
  document.addEventListener('keydown', e => {
    if (!$('#world') || $('#activity').open || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
    if (busy) { if (e.key === 'Escape') G.talkClose(); return; }
    const k = KMAP[e.key];
    if (k) { if (t && t.closest && t.closest('.talk, nav, .goal')) return; e.preventDefault(); keys[k] = true; P.tx = null; loop(); return; }
    if (e.key === 'e' || e.key === 'E' || ((e.key === 'Enter' || e.key === ' ') && (t === document.body || t.id === 'game'))) { const n = nearest(); if (n) { e.preventDefault(); interact(n); } }
  });
  document.addEventListener('keyup', e => { const k = KMAP[e.key]; if (k) keys[k] = false; });
  window.addEventListener('blur', () => Object.keys(keys).forEach(k => { keys[k] = false; }));

  /* ---------------- conversaciones ---------------- */
  let talkResolve = null;
  function say(lines) {
    return new Promise(res => {
      if (talkResolve) { const r = talkResolve; talkResolve = null; r(-1); }
      busy = true; updatePrompt();
      let i = 0; const box = $('#talk');
      const show = () => {
        const l = lines[i]; if (!l) { finish(-1); return; }
        const npc = l.who !== 'narra' && l.who !== 'yo';
        const name = l.who === 'narra' ? 'Misión' : l.who === 'yo' ? 'Vos' : (C.CAST[l.who] ? C.CAST[l.who].n : l.who);
        const port = l.who === 'narra' ? '<div class="portrait narra" aria-hidden="true">✦</div>' : `<div class="portrait" aria-hidden="true">${D.portrait(l.who === 'yo' ? S.avatar : l.who, l.e || 'contento')}</div>`;
        const opts = l.opts ? l.opts.map((o, k) => `<button type="button" class="opt${l.asked && l.asked.includes(k) ? ' asked' : ''}" data-o="${k}">${esc(o)}</button>`).join('') : `<button type="button" class="opt primary" data-o="next">${i < lines.length - 1 ? 'Seguir ▸' : 'Listo'}</button>`;
        box.innerHTML = `<div class="talk-in">${port}<div class="talk-body"><p class="talk-name">${esc(name)}${npc ? ' <span class="tag-juego">personaje del juego</span>' : ''}</p><p class="talk-t">${esc(l.t)} ${sayBtn(l.t, l.who)}</p>${l.html || ''}<div class="talk-opts">${opts}</div></div></div>`;
        box.hidden = false;
        autoSpeak(l.t, l.who);
        $$('.opt', box).forEach(b => b.onclick = () => { sfx('suave'); const o = b.dataset.o; if (o === 'next') { i++; show(); } else finish(+o); });
        const f = $('.opt', box); if (f) f.focus({ preventScroll: true });
      };
      const finish = v => { talkResolve = null; box.hidden = true; box.innerHTML = ''; busy = false; updatePrompt(); if (!$('#activity').open) $('#game').focus({ preventScroll: true }); res(v); };
      talkResolve = res; show();
    });
  }
  G.say = say;
  G.talkClose = () => { const box = $('#talk'); if (box) { box.hidden = true; box.innerHTML = ''; } busy = false; if (talkResolve) { const r = talkResolve; talkResolve = null; r(-1); } updatePrompt(); };
  /* menú de preguntas: se repite hasta elegir una opción final */
  async function menu(who, e, t, options) {
    const asked = []; let txt = t;
    for (; ;) {
      const k = await say([{ who, e, t: txt, opts: options.map(o => o.q), asked }]);
      if (k < 0) return;
      const o = options[k]; if (!asked.includes(k)) asked.push(k);
      if (o.lines) { const ls = typeof o.lines === 'function' ? o.lines() : o.lines; if (o.end) { await say(ls); } else { if (ls.length > 1) await say(ls.slice(0, -1)); txt = ls[ls.length - 1].t; e = ls[ls.length - 1].e || e; who = ls[ls.length - 1].who || who; } }
      if (o.run) { const r = await o.run(); if (r === 'stop') return; }
      if (o.end) return;
    }
  }
  G.menu = menu;

  /* ---------------- interacción ---------------- */
  function gain(kind, id, msg) {
    let ok = false;
    if (kind === 'item') ok = M.give(S, id); else if (kind === 'ev') ok = M.addEv(S, id); else if (kind === 'picto') ok = M.addPicto(S, id);
    if (ok) { sfx('pick'); if (msg) toast(msg, 'gain'); save(); G.refresh(); }
    return ok;
  }
  G.gain = gain;
  function interact(q) {
    if (!q || busy) return;
    if (q.kind === 'exit') { travel(q.to, q.id === 'exitL' ? 'right' : 'left'); return; }
    if (revealed[q.id]) { revealed[q.id] = false; }
    const h = G.handlers[q.id + '@' + S.area] || G.handlers[q.id];
    if (h) Promise.resolve(h(q)).then(() => { G.refresh(); });
  }
  G.interact = interact;

  async function useTool(need, okFn, sinTexto) {
    const opts = S.items.filter(i => i !== 'cuaderno');
    if (!opts.length) { await say([{ who: 'narra', t: sinTexto }]); return; }
    const k = await say([{ who: 'narra', t: 'Desde acá no se distingue bien. ¿Querés usar algo de la mochila?', opts: opts.map(i => 'Usar: ' + M.ITEMS[i].n).concat(['Solo mirar']) }]);
    if (k < 0 || k >= opts.length) { await say([{ who: 'narra', t: sinTexto }]); return; }
    if (opts[k] !== need) { sfx('hmm'); await say([{ who: 'narra', t: 'Con ' + M.ITEMS[opts[k]].n.toLowerCase() + ' no se ve mejor de lejos. ¿Qué otra cosa podría servir?' }]); return; }
    await okFn();
  }
  const found = id => `<div class="found">${imgHTML('p:' + id)}<small>Pictograma ARASAAC</small></div>`;
  const obs = async (t, ev) => { await say([{ who: 'narra', t }]); gain('ev', ev, 'Nueva observación en el cuaderno'); };

  G.handlers = {
    tomas: () => G.talk.tomas(),
    banco: async () => { if (gain('picto', 'costa', '¡Encontraste el pictograma COSTA!')) await say([{ who: 'narra', t: 'Debajo del banco había una tarjeta de Sol: el pictograma COSTA. Quedó guardada en tu mochila.', html: found('costa') }]); },
    cartel: async () => {
      const t = 'ATENCIÓN: SE SOLICITA A LOS SEÑORES VISITANTES NO TRASPASAR LA BARANDA NI APROXIMARSE AL BORDE DE LA BARRANCA, DADO QUE EL TERRENO PUEDE PRESENTAR INESTABILIDAD Y DESPRENDIMIENTOS…';
      await say([{ who: 'narra', t: 'El cartel viejo dice:', html: `<p class="old-sign">${t}</p>` }, { who: 'yo', t: 'Mucho texto, todo en mayúsculas y con letras chicas. De lejos cuesta entenderlo. ¿Y si alguien todavía no lee?' }]);
      gain('ev', 'ev-cartel', 'Anotaste una idea en el cuaderno');
    },
    costa: () => obs('Del otro lado del recodo se ve una barranca alta: una pared de tierra con pasto arriba y el agua abajo.', 'ev-costa'),
    agua: () => obs('El agua se mueve y llega hasta el pie de la barranca. Tiene color marrón.', 'ev-agua'),
    orilla: () => obs('En la orilla, junto al agua, hay terrones de tierra caída.', 'ev-caida'),
    base: async () => {
      if (M.hasEv(S, 'ev-hueco')) { await say([{ who: 'narra', t: 'Ya anotaste los huecos de la base.' }]); return; }
      await useTool('prismaticos', () => obs('Con los prismáticos se ve clarito: en la base, donde llega el agua, hay huecos como cuevitas.', 'ev-hueco'),
        M.has(S, 'prismaticos') ? 'La base está lejos y se ve borrosa.' : 'La base está lejos y se ve borrosa. Algo para mirar de lejos ayudaría… ¿Tomás tendrá algo?');
    },
    raices: async () => {
      if (M.hasEv(S, 'ev-raices')) { await say([{ who: 'narra', t: 'Ya anotaste las raíces del borde.' }]); return; }
      await useTool('prismaticos', () => obs('Con los prismáticos: debajo del pasto, algunas raíces quedaron colgando en el aire.', 'ev-raices'),
        M.has(S, 'prismaticos') ? 'El borde de arriba está lejos y se ve borroso.' : 'El borde de arriba está lejos y se ve borroso. Algo para mirar de lejos ayudaría.');
    },
    marta: () => G.talk.marta(),
    sol: () => G.talk.sol(),
    bruno: () => G.talk.bruno(),
    nico: () => G.talk.nico(),
    mesa: async () => { const r = M.prereq(S, 'b'); if (r) { await say([{ who: 'narra', t: 'En la mesa de pistas se ordenan las observaciones. ' + r }]); return; } G.acts.classify(); },
    corcho: async () => { const r = M.prereq(S, 'd'); if (r) { await say([{ who: 'narra', t: 'En el corcho están las tarjetas mezcladas del stand. ' + r }]); return; } G.acts.sequence(); },
    maceta: async () => { if (gain('picto', 'escuchar', '¡Encontraste el pictograma ESCUCHAR!')) await say([{ who: 'narra', t: 'Detrás de la maceta había otra tarjeta de Sol: ESCUCHAR.', html: found('escuchar') }]); },
    ventana: () => say([{ who: 'narra', t: 'Desde la ventana se ve el río a lo lejos. El Mirador queda hacia la izquierda; el laboratorio y la feria, hacia la derecha.' }]),
    armario: async () => { if (gain('item', 'tijera', 'Guardaste una tijera en la mochila')) await say([{ who: 'narra', t: 'En el cajón del armario hay una tijera de papel. Sirve para dividir un texto largo en partes cortas.' }]); },
    profe: () => G.talk.profe(),
    afiche: () => say([{ who: 'narra', t: 'El afiche dice: «MODELO SIMPLIFICADO. Una maqueta ayuda a pensar cómo pasan las cosas, pero no es el río real».' }]),
    maqueta: async () => { const r = M.prereq(S, 'c'); if (r) { await say([{ who: 'profe', e: 'contento', t: r }]); return; } G.acts.maqueta(); },
    cajonera: async () => { if (gain('item', 'lupa', 'Guardaste una lupa en la mochila')) await say([{ who: 'narra', t: 'En la cajonera hay una lupa. Sirve para ver detalles pequeños… por ejemplo, en la maqueta.' }]); },
    estante: async () => { if (gain('picto', 'investigar', '¡Encontraste el pictograma INVESTIGAR!')) await say([{ who: 'narra', t: 'Entre los frascos del estante había una tarjeta de Sol: INVESTIGAR.', html: found('investigar') }]); },
    planetas: () => say([{ who: 'narra', t: 'Otro grupo explica los planetas con una maqueta, dibujos grandes y palabras cortas. ¡Se entiende desde lejos!' }]),
    ensayo: async () => {
      await say([{ who: 'narra', t: 'Es el cartel que se usó en el ensayo. Tiene un solo bloque de texto, sin imágenes ni audio.', html: '<p class="old-sign small">La erosión de las costas es un proceso en el cual el agua del río, al desplazarse de manera constante y transportar sedimentos, produce el desgaste progresivo de la base de las barrancas, lo cual puede ocasionar…</p>' }, { who: 'marta', e: 'preocupado', t: 'En el ensayo, varias personas pasaron de largo. No era culpa de ellas: el cartel daba la información de una sola manera.' }]);
      gain('ev', 'ev-ensayo', 'Anotaste una idea en el cuaderno');
    },
    stand: async () => { const r = M.prereq(S, 'e'); if (r) { await say([{ who: 'narra', t: 'Los papeles del stand están mezclados. ' + r }]); return; } G.acts.stand(S.e.done ? 'probar' : 'armar'); },
    visitantes: () => G.talk.visitantes(),
    telon: async () => { if (gain('picto', 'comunicar', '¡Encontraste el pictograma COMUNICAR!')) await say([{ who: 'narra', t: 'Detrás del telón había una tarjeta de Sol: COMUNICAR.', html: found('comunicar') }]); },
    'marta@feria': () => G.talk.martaFeria(),
    'bruno@feria': () => G.talk.brunoFeria(),
    'nico@feria': () => say([{ who: 'nico', e: 'feliz', t: 'Ahora, cuando tengo una idea, me pregunto: ¿lo vi o lo supongo? Y si se puede, ¡lo pruebo!' }]),
    'nico@lab': () => G.talk.nicoLab()
  };

  /* ---------------- ayuda en el mundo (3 niveles) ---------------- */
  async function worldHelp() {
    if (busy) return;
    const q = M.current(S);
    if (!q) { await say([{ who: 'narra', t: '¡Completaste la misión! Podés volver a cualquier lugar, revisar el cartel o probar otras formas de comunicar.' }]); return; }
    const key = 'w-' + q.id, lv = M.help(S, key); save();
    const here = q.area === S.area, dir = M.AREAS.indexOf(q.area) - M.AREAS.indexOf(S.area);
    if (lv === 1) { await say([{ who: 'narra', t: 'Ayuda 1 de 3 · Orientación: ' + q.t + (here ? ' Es en este lugar.' : ' Queda en: ' + M.AREA_NAME[q.area] + (dir < 0 ? ', hacia la izquierda.' : ', hacia la derecha.')) }]); return; }
    if (lv === 2) {
      await say([{ who: 'narra', t: 'Ayuda 2 de 3 · Pista visual: seguí la flecha amarilla.' }]);
      if (here) { revealed[q.spot] = true; renderSpots(); pointAt(q.spot); } else pointAt(dir < 0 ? 'exitL' : 'exitR');
      return;
    }
    await say([{ who: 'narra', t: 'Ayuda 3 de 3 · Demostración: te acompaño hasta ahí.' }]);
    M.resetHelp(S, key); save();
    if (!here) travel(q.area, dir < 0 ? 'right' : 'left');
    setTimeout(() => { revealed[q.spot] = true; renderSpots(); const sp = spots().find(z => z.id === q.spot); if (sp) { pointAt(sp.id); walkTo(sp.x + (sp.x > P.x ? -45 : 45), 505, null); } }, 250);
  }
  function pointAt(id) {
    const sp = spots().find(z => z.id === id), ar = $('#help-arrow'); if (!sp || !ar) return;
    ar.hidden = false; ar.style.left = (sp.x / 10) + '%'; ar.style.top = Math.max(2, (sp.y - sp.h / 2) / 5.6 - 9) + '%';
    pan(sp.x);
    clearTimeout(pointAt.t); pointAt.t = setTimeout(() => { ar.hidden = true; }, 8000);
  }
  G.worldHelp = worldHelp;

  /* ---------------- volver al sitio ---------------- */
  function goHome() {
    stopVoice(); saveNow();
    if (window.parent && window.parent !== window) { try { window.parent.postMessage({ type: 'bermejo:home' }, location.origin); return; } catch (e) { } }
    location.href = '../';
  }
  G.goHome = goHome;

  /* ---------------- ventana de actividades ---------------- */
  const dlg = () => $('#activity');
  let actClose = null;
  function openActivity(title, html, opts) {
    opts = opts || {};
    const d = dlg();
    if (talkResolve) G.talkClose();
    $('#activity-title').textContent = title;
    d.className = opts.cls || '';
    $('#activity-content').innerHTML = html;
    const hb = $('#activity-help'); hb.hidden = !opts.help; hb.textContent = '';
    G.helpFn = opts.help || null; if (opts.help) G.setHelpLabel(0);
    actClose = opts.onClose || null;
    if (!d.open) { try { d.showModal(); } catch (e) { d.setAttribute('open', ''); } }
    $('#activity-content').scrollTop = 0;
    const f = $('[autofocus]', d) || $('#activity-content button'); if (f) f.focus({ preventScroll: true });
  }
  function closeActivity() { const d = dlg(); if (d && d.open) d.close(); }
  G.openActivity = openActivity; G.closeActivity = closeActivity;
  G.setHelpLabel = n => { const hb = $('#activity-help'); if (hb) hb.innerHTML = `<span aria-hidden="true">💡</span> Ayuda${n ? ` <small>${n}/3</small>` : ''}`; };
  function setupDialog() {
    const d = dlg();
    $('#activity-close').onclick = () => closeActivity();
    d.addEventListener('close', () => { stopVoice(); const f = actClose; actClose = null; G.helpFn = null; if (f) f(); G.refresh(); const g = $('#game'); if (g) g.focus({ preventScroll: true }); });
    $('#activity-help').onclick = () => { if (G.helpFn) G.helpFn(); };
  }
  G.confirm = (t, yes, yesLabel) => {
    openActivity('Confirmar', `<div class="confirm"><p>${esc(t)}</p><div class="row"><button type="button" class="primary" id="c-yes">${esc(yesLabel || 'Sí, reiniciar')}</button><button type="button" id="c-no" autofocus>No, volver</button></div></div>`, { cls: 'small' });
    $('#c-yes').onclick = () => { closeActivity(); yes(); }; $('#c-no').onclick = closeActivity; $('#c-no').focus();
  };

  /* ---------------- pantalla de inicio ---------------- */
  const AVATARS = [['luna', 'Luna'], ['mia', 'Mía'], ['caro', 'Caro'], ['joaquin', 'Joaquín']];
  const HISTORIA = 'La feria de ciencias está por empezar, pero las imágenes y explicaciones del stand quedaron mezcladas. En el ensayo, algunas personas no pudieron usar el cartel. Tu equipo tiene que reunir evidencias, investigar qué pasa en la costa y armar una explicación que todos puedan entender.';
  function showStart() {
    const cont = S.started;
    const demo = M.initial(); demo.d.done = true; demo.c.done = true;
    $('#game').innerHTML = `<div class="start">
      <div class="start-art" aria-hidden="true">${D.scene('feria', demo, M)}</div>
      <div class="start-card">
        <p class="kicker">Mes de la Inclusión · Escuela 479 · Proyecto «El río se lleva mi pueblo»</p>
        <h1>El mensaje perdido del Bermejo</h1>
        <p class="lead">${HISTORIA} ${sayBtn(HISTORIA, null, 'Escuchar la historia')}</p>
        <fieldset class="pick"><legend>Elegí tu personaje</legend><div class="pick-row">${AVATARS.map(([k, n]) => `<button type="button" class="av${S.avatar === k ? ' on' : ''}" data-av="${k}" aria-pressed="${S.avatar === k}"><span class="av-img" aria-hidden="true">${D.avatar(k, { expr: 'feliz', pose: 'saluda' })}</span><span>${n}</span></button>`).join('')}</div></fieldset>
        <fieldset class="pick"><legend>Elegí cómo jugar <span class="hint">(se puede cambiar en Ajustes sin perder lo avanzado)</span></legend><div class="mode-row">${Object.entries(M.MODES).map(([k, m]) => `<button type="button" class="mode${S.mode === k ? ' on' : ''}" data-mode="${k}" aria-pressed="${S.mode === k}"><strong><span aria-hidden="true">${k === 'acomp' ? '🧭' : '🔎'}</span> ${m.name}</strong><span>${m.desc}</span></button>`).join('')}</div></fieldset>
        <div class="start-actions"><button type="button" class="primary big-b" id="b-start">${cont ? 'Continuar la aventura ▸' : 'Empezar la aventura ▸'}</button>${cont ? '<button type="button" id="b-restart">Empezar de nuevo</button>' : ''}<button type="button" id="b-home2">Volver a Misión Inclusión</button></div>
        <p class="fine">Los personajes, los diálogos y las ilustraciones son inventados para este juego: no son testimonios, datos ni resultados reales de la investigación. Pictogramas: Sergio Palao · ARASAAC · Gobierno de Aragón · CC BY-NC-SA. Se juega con teclado (flechas y E), con mouse o tocando la pantalla.</p>
      </div></div>`;
    $$('.av').forEach(b => b.onclick = () => { S.avatar = b.dataset.av; save(); $$('.av').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); });
    $$('.mode').forEach(b => b.onclick = () => { S.mode = b.dataset.mode; save(); applyPrefs(); $$('.mode').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); });
    $('#b-start').onclick = () => { audio(); S.started = true; saveNow(); enterWorld(); };
    $('#b-home2').onclick = goHome;
    const r = $('#b-restart'); if (r) r.onclick = () => G.confirm('¿Empezar de nuevo? Se borra el progreso de esta aventura. Los otros juegos de la página no cambian.', resetAdventure);
    $('#b-start').focus({ preventScroll: true });
  }
  G.showStart = showStart;

  function boot() {
    const bar = $('.dialog-bar');
    if (bar && !$('#activity-help')) $('#activity-close').insertAdjacentHTML('beforebegin', '<button type="button" id="activity-help" class="help-b" hidden></button>');
    setupDialog(); applyPrefs();
    if (location.hash === '#jugar' && S.started) enterWorld(); else showStart();
    try { speechSynthesis.getVoices(); } catch (e) { }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot);
})();
