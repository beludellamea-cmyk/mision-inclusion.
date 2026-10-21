/* El mensaje perdido del Bermejo · conversaciones, paneles, desafíos A–G, cartel, descarga e impresión. */
(function () {
  'use strict';
  const G = window.BJG, M = G.M, D = G.D, C = G.C, $ = G.$, $$ = G.$$, esc = G.esc;
  const S = () => G.S();
  const say = (...a) => G.say(...a), menu = (...a) => G.menu(...a);
  const sayBtn = G.sayBtn, imgHTML = G.imgHTML;
  const CRED = 'Pictogramas: Sergio Palao · ARASAAC (arasaac.org) · Gobierno de Aragón · Licencia CC BY-NC-SA 4.0.';
  const CRED2 = 'Ilustraciones y personajes: creados para el juego «El mensaje perdido del Bermejo» (Misión Inclusión). Son inventados: no son fotos ni datos reales del río.';

  /* ---------- utilidades de interfaz ---------- */
  function keepFocus(fn) {
    const a = document.activeElement, k = a && a.dataset ? a.dataset.k : null;
    fn();
    if (k) { const n = $(`#activity-content [data-k="${CSS.escape(k)}"]`); if (n) n.focus({ preventScroll: true }); }
  }
  function feedback(t, kind) { const f = $('#act-fb'); if (!f) return; f.className = 'fb ' + (kind || ''); f.innerHTML = t ? `<span>${esc(t)}</span> ${sayBtn(t)}` : ''; if (t) { G.announce(t); G.autoSpeak(t); } }
  function helpRunner(key, steps) {
    return () => {
      const s = S(), lv = M.help(s, key); G.save(); G.setHelpLabel(lv);
      const st = steps[lv - 1];
      const txt = typeof st.t === 'function' ? st.t() : st.t;
      const box = $('#act-help'); if (box) { box.hidden = false; box.innerHTML = `<strong>${['Orientación', 'Pista visual', 'Demostración'][lv - 1]}</strong> <span>${esc(txt)}</span> ${sayBtn(txt)}`; }
      G.autoSpeak(txt);
      $$('.hint-glow').forEach(e => e.classList.remove('hint-glow'));
      if (st.hint) setTimeout(() => { const sel = st.hint(); if (sel) $$(sel).forEach(e => e.classList.add('hint-glow')); }, 30);
      if (st.demo) setTimeout(() => st.demo(), 350);
      if (lv >= 3) { M.resetHelp(s, key); G.save(); }
    };
  }
  function autoOrient(key, text) {
    if (!M.cfg(S()).autoHelp) return '';
    return `<div class="act-help" id="act-help"><strong>Orientación</strong> <span>${esc(text)}</span> ${sayBtn(text)}</div>`;
  }
  const helpBox = (key, text) => autoOrient(key, text) || '<div class="act-help" id="act-help" hidden></div>';

  /* arrastrar y soltar con alternativa de tocar-elegir-colocar */
  let dragJust = 0;
  function dnd(root, onDrop) {
    let st = null;
    root.addEventListener('pointerdown', e => {
      const p = e.target.closest('[data-pick]'); if (!p || e.button > 0) return;
      if (e.pointerType === 'mouse') e.preventDefault();
      st = { p, id: p.dataset.pick, x: e.clientX, y: e.clientY, ghost: null };
    });
    window.addEventListener('pointermove', e => {
      if (!st) return;
      if (!st.ghost) { if (Math.hypot(e.clientX - st.x, e.clientY - st.y) < 10) return; st.ghost = st.p.cloneNode(true); st.ghost.classList.add('ghost'); st.ghost.style.width = st.p.offsetWidth + 'px'; document.body.appendChild(st.ghost); st.p.classList.add('dragging'); }
      st.ghost.style.left = e.clientX + 'px'; st.ghost.style.top = e.clientY + 'px';
      $$('[data-drop].over').forEach(x => x.classList.remove('over'));
      const t = document.elementFromPoint(e.clientX, e.clientY); const d = t && t.closest('[data-drop]'); if (d) d.classList.add('over');
    });
    const end = e => {
      if (!st) return; const s0 = st; st = null;
      if (!s0.ghost) return;
      s0.ghost.remove(); s0.p.classList.remove('dragging'); $$('[data-drop].over').forEach(x => x.classList.remove('over'));
      const t = document.elementFromPoint(e.clientX, e.clientY); const d = t && t.closest('[data-drop]');
      dragJust = Date.now();
      if (d && root.contains(d)) onDrop(d.dataset.drop, s0.id);
    };
    window.addEventListener('pointerup', end); window.addEventListener('pointercancel', () => { if (st && st.ghost) { st.ghost.remove(); st.p.classList.remove('dragging'); } st = null; });
  }
  const clickOK = () => Date.now() - dragJust > 350;

  /* ======================= CONVERSACIONES ======================= */
  const T = G.talk;
  T.marta = async () => {
    const s = S();
    if (!s.flags.intro) {
      s.flags.intro = true; M.give(s, 'cuaderno'); G.save();
      await say([{ who: 'marta', e: 'preocupado', t: '¡Qué bueno que llegaste! La feria de ciencias empieza esta tarde y el material de nuestro stand quedó todo mezclado.' }, { who: 'marta', e: 'pensando', t: 'Además, en el ensayo varias personas no pudieron usar el cartel: tenía mucho texto y nada más.' }]);
      G.toast('Recibiste el cuaderno de evidencias'); G.sfx('pick'); G.refresh();
      await menu('marta', 'contento', 'Nuestra misión: reunir evidencias, entender qué pasa en la costa y armar una explicación que todos puedan entender.', [
        { q: '¿Por dónde empiezo?', lines: [{ who: 'marta', e: 'explica', t: 'Conversá con Sol, Bruno y Nico: cada uno sabe una parte. Después andá al Mirador del río, a la izquierda, a observar la costa.' }] },
        { q: '¿Qué es una evidencia?', lines: [{ who: 'marta', e: 'contento', t: 'Es algo que podemos mostrar: lo que observamos y lo que probamos. Por eso lo anotamos en el cuaderno.' }] },
        { q: '¿Por qué no entendieron el cartel?', lines: [{ who: 'marta', e: 'pensando', t: 'No fue culpa de la gente. Si damos la información de una sola manera, dejamos a algunas personas afuera. Combinemos imagen, palabra y audio.' }], run: () => { G.gain('ev', 'p-marta', 'Anotaste una pista en el cuaderno'); } },
        { q: '¡Vamos!', end: true }
      ]);
      return;
    }
    const q = M.current(s);
    let t = q ? q.t : '¡Lo lograron!';
    if (!s.b.done && !M.prereq(s, 'b')) t = 'Ya tienen pistas. En la mesa de pistas separen lo que vieron de lo que suponen.';
    else if (s.b.done && !s.c.done) t = 'Las suposiciones se pueden poner a prueba. El profe Daniel los espera en el laboratorio, a la derecha.';
    else if (s.c.done && !s.d.done) t = '¿Qué pasa primero y qué después? Ordenen la explicación en el corcho.';
    await menu('marta', 'contento', t, [
      { q: '¿Para qué sirven los pictogramas?', lines: [{ who: 'marta', e: 'explica', t: 'Ayudan a anticipar lo que va a pasar, a entender instrucciones y a comunicar ideas. Sirven a quien todavía no lee, a quien habla otro idioma… y a todas las personas.' }] },
      { q: '¿Por qué no entendieron el cartel?', lines: [{ who: 'marta', e: 'pensando', t: 'Las barreras aparecen cuando ofrecemos la información de una única manera. Por eso vamos a combinar imagen, palabra y audio.' }], run: () => { G.gain('ev', 'p-marta', 'Anotaste una pista en el cuaderno'); } },
      { q: 'Gracias, sigo', end: true }
    ]);
  };
  T.martaFeria = async () => {
    const s = S();
    if (!s.f.done) {
      await menu('marta', 'contento', 'Cuando el cartel esté listo, probalo con los visitantes. Yo voy a revisar que todo lo que diga esté en el cuaderno.', [
        { q: '¿Qué revisás?', lines: [{ who: 'marta', e: 'explica', t: 'Que no inventemos datos ni testimonios, y que no presentemos como seguro algo que no comprobamos.' }] },
        { q: 'Ir al stand', end: true, run: () => G.handlers.stand() },
        { q: 'Gracias', end: true }]);
      return;
    }
    if (!s.g.done) {
      const k = await say([{ who: 'marta', e: 'feliz', t: '¡Los visitantes entendieron el cartel!' }, { who: 'marta', e: 'explica', t: 'Falta una cosa: la gente quiere saber qué va a pasar en el stand. ¿Me ayudás a hacer una agenda visual?', opts: ['Sí, armemos la agenda', 'Después'] }]);
      if (k === 0) G.acts.agenda();
      return;
    }
    const k = await say([{ who: 'marta', e: 'feliz', t: '¡Lo lograron! El mensaje del Bermejo llegó a mucha más gente.', opts: ['Ver lo que comunicamos', 'Seguir explorando'] }]);
    if (k === 0) G.acts.finale();
  };
  T.sol = async () => {
    const s = S();
    if (!s.talked.sol) {
      s.talked.sol = 1; M.SOL_BOX.forEach(p => M.addPicto(s, p)); G.save();
      await say([{ who: 'sol', e: 'preocupado', t: '¡Ay! Abrí la ventana y el viento se llevó algunas tarjetas de pictogramas. Me quedaron estas.', html: `<div class="found row">${M.SOL_BOX.map(p => imgHTML('p:' + p)).join('')}</div><small class="cred">${CRED}</small>` }, { who: 'sol', e: 'contento', t: 'Te las presto para el cartel. Las guardé en tu mochila.' }]);
      G.toast('Recibiste 6 pictogramas ARASAAC'); G.sfx('pick'); G.refresh();
    }
    const hf = M.hiddenFound(s), det = s.mode === 'detective';
    if (hf.length >= 2 && !M.has(s, 'marcador')) {
      await say([{ who: 'sol', e: 'feliz', t: '¡Encontraste ' + hf.length + ' de mis tarjetas! Gracias. Tomá este marcador: sirve para escribir una palabra al lado de un pictograma.' }]);
      G.gain('item', 'marcador', 'Guardaste un marcador en la mochila');
    }
    const faltan = Object.keys(M.HIDDEN_PICTOS).filter(k => !s.pictos.includes(k));
    await menu('sol', hf.length >= 3 ? 'feliz' : 'contento', faltan.length ? 'Me faltan ' + faltan.length + ' tarjetas. Si las encontrás, ¡quedan en tu mochila!' : '¡Ya están todas mis tarjetas! Gracias por buscarlas.', [
      { q: '¿Para qué sirven los pictogramas?', lines: [{ who: 'sol', e: 'explica', t: 'Ayudan a anticipar, a entender instrucciones y a comunicar ideas. Mi hermanito los usa para saber qué viene después.' }] },
      { q: '¿Dónde pueden estar tus tarjetas?', lines: () => [{ who: 'sol', e: 'pensando', t: faltan.length ? (det ? 'El viento sopló fuerte… una voló hacia el río, otra quedó cerca de una planta, otra entre frascos y otra donde se esconden los actores.' : 'Busquen ' + faltan.map(k => M.HIDDEN_PICTOS[k].where).join(', ') + '.') : '¡Ya las encontraste todas!' }] },
      { q: '¿Algún consejo para el cartel?', lines: [{ who: 'sol', e: 'explica', t: 'Un pictograma solo puede entenderse de varias maneras. Una palabra al lado ayuda. ¡Y probalo con otras personas!' }], run: () => { G.gain('ev', 'p-sol', 'Anotaste una pista en el cuaderno'); } },
      { q: 'Chau, Sol', end: true }
    ]);
  };
  T.bruno = async () => {
    const s = S(); s.talked.bruno = 1; G.save();
    await menu('bruno', 'contento', 'Estoy practicando para grabar la explicación del stand en audio.', [
      { q: '¿Por qué en audio?', lines: [{ who: 'bruno', e: 'explica', t: 'Hay personas que prefieren escuchar, o que no pueden leer el cartel desde donde están. Con audio, la información llega de otra manera.' }] },
      { q: '¿Cómo te ayudo?', lines: [{ who: 'bruno', e: 'pensando', t: 'Cuando la frase es larga, me trabo y la gente se pierde. Las frases cortas se escuchan y se recuerdan mejor. Cuando el cartel esté listo, buscame en la feria.' }], run: () => { G.gain('ev', 'p-bruno', 'Anotaste una pista en el cuaderno'); } },
      { q: 'Chau, Bruno', end: true }
    ]);
  };
  T.brunoFeria = async () => {
    const s = S();
    if (!M.has(s, 'grabadora')) {
      await say([{ who: 'bruno', e: 'feliz', t: 'Ya preparé el sonido del stand. Te presto mi grabadora: en el cartel tocá «Agregar audio».' }, { who: 'bruno', e: 'explica', t: 'Eso sí: grabo solo frases cortas. Si alguna es larga, primero dividila.' }]);
      G.gain('item', 'grabadora', 'Guardaste la grabadora en la mochila'); return;
    }
    await say([{ who: 'bruno', e: 'contento', t: 'Con «Escuchar el cartel» podés probar cómo suena. ¡Frases cortas, claritas!' }]);
  };
  T.nico = async () => {
    const s = S(); const first = !s.talked.nico; s.talked.nico = 1; G.save();
    if (first) G.gain('ev', 'p-nico', 'Anotaste lo que dijo Nico');
    await menu('nico', 'duda', '¡Yo ya sé por qué se cae la costa: por los camiones que pasan cerca!', [
      { q: '¿Lo viste?', lines: [{ who: 'nico', e: 'timido', t: 'Eh… no. Pero me parece.' }] },
      { q: '¿Cómo podríamos saberlo?', lines: [{ who: 'nico', e: 'pensando', t: '¿Probándolo? Primero hay que separar lo que vimos de lo que suponemos. ¡En la mesa de pistas!' }] },
      { q: 'Chau, Nico', end: true }
    ]);
  };
  T.nicoLab = async () => {
    const s = S();
    if (!s.c.obs.golpe) await say([{ who: 'nico', e: 'pensando', t: 'En la maqueta podemos probar mi idea: golpear la mesa sin echar agua. ¿Me ayudás? El botón está junto a la maqueta.' }]);
    else await say([{ who: 'nico', e: 'feliz', t: 'Casi no se movió nada. Mi idea era una suposición, y probarla me ayudó a pensar… aunque la maqueta no es el río real.' }]);
  };
  T.tomas = async () => {
    const s = S(); const first = !s.talked.tomas; s.talked.tomas = 1; G.save();
    if (first) G.gain('ev', 'p-tomas', 'Anotaste una pista en el cuaderno');
    if (s.a.done && !M.has(s, 'prismaticos')) {
      await say([{ who: 'tomas', e: 'feliz', t: '¡Gracias! Ahora sé que mis dibujos sirven como evidencia.' }, { who: 'tomas', e: 'explica', t: 'Tomá mis prismáticos: con ellos vas a ver de cerca la base y el borde de la barranca.' }]);
      G.gain('item', 'prismaticos', 'Guardaste los prismáticos en la mochila'); return;
    }
    if (s.a.done) { await say([{ who: 'tomas', e: 'contento', t: M.hasEv(s, 'ev-hueco') ? '¿Viste las cuevitas de la base? Coinciden con mis dibujos.' : 'Con los prismáticos mirá la base y el borde de arriba de la barranca.' }]); return; }
    await menu('tomas', 'preocupado', 'Dibujé esta costa en dos momentos distintos para compararla. ¿Me ayudás a encontrar qué cambió?', [
      { q: '¿Son fotos reales?', lines: [{ who: 'tomas', e: 'explica', t: 'No. Son ilustraciones que hicimos para este juego. Sirven para practicar cómo se compara.' }] },
      { q: '¿Qué tengo que buscar?', lines: [{ who: 'tomas', e: 'pensando', t: 'Cambios de la costa. Ojo: no todo lo que cambia importa. Las nubes cambian siempre.' }] },
      { q: 'Quiero comparar', end: true, run: () => G.acts.compare() },
      { q: 'Después', end: true }
    ]);
  };
  T.profe = async () => {
    const s = S(); const first = !s.talked.profe; s.talked.profe = 1; G.save();
    if (first) G.gain('ev', 'p-daniel', 'Anotaste una pista en el cuaderno');
    const opts = [
      { q: '¿Qué puedo probar?', lines: [{ who: 'profe', e: 'explica', t: 'Echar poca o mucha agua, observar dónde se gasta y probar la idea de Nico. Antes de echar agua, pensá qué creés que va a pasar.' }] },
      { q: '¿Puedo sacar datos del río?', lines: [{ who: 'profe', e: 'pensando', t: 'No. Lo que contemos en la maqueta es de la maqueta. Una maqueta ayuda a pensar, pero no reemplaza la investigación del río real.' }] }
    ];
    if (!M.has(s, 'lupa')) opts.push({ q: '¿Hay una lupa?', lines: [{ who: 'profe', e: 'contento', t: 'Fijate en la cajonera, cerca de la puerta.' }] });
    if (s.b.done) opts.push({ q: 'Ir a la maqueta', end: true, run: () => G.acts.maqueta() });
    opts.push({ q: 'Gracias, profe', end: true });
    await menu('profe', 'contento', s.b.done ? 'La maqueta es un modelo simplificado: una bandeja, tierra húmeda y agua. Ayuda a pensar, pero no es el río real.' : 'Estoy preparando la maqueta. ' + (M.prereq(s, 'c') || ''), opts);
  };
  T.visitantes = async () => {
    const s = S();
    const lines = [
      { who: 'juli', e: 'feliz', t: '¡Hola! Tengo cinco años. Todavía no leo, pero miro los dibujos.' },
      { who: 'lucas', e: 'contento', t: 'Hola. Llegué hace poco y estoy aprendiendo castellano. Las frases cortas me ayudan.' },
      { who: 'rosa', e: 'contento', t: 'Vine con mi nieta. A mí me gusta que me cuenten las cosas en voz alta.' }
    ];
    if (s.mode === 'detective') lines.push({ who: 'mati', e: 'duda', t: '¿Y cómo saben lo que pasa en la costa? ¡Quiero saber cómo lo averiguaron!' });
    if (!s.e.done) { lines.push({ who: 'narra', t: 'Cuando tengas el cartel listo, mostráselo. Ellos te van a decir qué entienden y qué no.' }); await say(lines); return; }
    if (s.f.done) { await say([{ who: 'juli', e: 'feliz', t: '¡Ya entendimos el cartel! ¿Nos mostrás la agenda del stand?' }]); return; }
    G.acts.stand('probar');
  };

  /* ======================= PANELES ======================= */
  const ITEM_IC = { cuaderno: '📓', prismaticos: '🔭', lupa: '🔍', tijera: '✂️', marcador: '🖊️', grabadora: '🎙️' };
  G.openPanel = name => {
    const s = S();
    if (name === 'objetivos') {
      const q = M.quests(s), cur = M.current(s), hf = M.hiddenFound(s).length;
      G.openActivity('Objetivos', `<p class="muted">Modalidad: <strong>${M.MODES[s.mode].name}</strong>. Lo que ya hiciste queda guardado.</p>
        <ol class="quests">${q.map(x => `<li class="${x.done ? 'done' : ''}${cur && cur.id === x.id ? ' cur' : ''}"><span class="qi" aria-hidden="true">${x.done ? '✓' : cur && cur.id === x.id ? '▸' : '○'}</span><span>${esc(x.t)} <small>${M.AREA_NAME[x.area]}</small></span>${sayBtn(x.t)}</li>`).join('')}</ol>
        <h3>Para explorar</h3><ul class="extras"><li>Tarjetas de Sol encontradas: <strong>${hf} de 4</strong></li><li>Objetos en la mochila: <strong>${s.items.length} de 6</strong></li><li>Evidencias en el cuaderno: <strong>${s.ev.length}</strong></li></ul>`);
    } else if (name === 'mochila') {
      G.openActivity('Mochila', `<h3>Objetos</h3>${s.items.length ? `<ul class="items">${s.items.map(i => `<li><span class="it-ic" aria-hidden="true">${ITEM_IC[i]}</span><span><strong>${esc(M.ITEMS[i].n)}</strong><br>${esc(M.ITEMS[i].d)}</span></li>`).join('')}</ul>` : '<p class="muted">Todavía no tenés objetos.</p>'}
        <h3>Pictogramas</h3>${s.pictos.length ? `<ul class="pgrid">${s.pictos.map(p => `<li>${imgHTML('p:' + p)}<span>${esc(M.PICTOS[p])}</span></li>`).join('')}</ul><p class="cred">${CRED}</p>` : '<p class="muted">Sol tiene una caja de pictogramas. ¡Hablá con ella!</p>'}
        ${M.ilusOwned(s).length ? `<h3>Ilustraciones del equipo</h3><ul class="pgrid">${M.ilusOwned(s).map(i => `<li>${imgHTML('i:' + i)}<span>${esc(M.ILUS[i].n)}</span></li>`).join('')}</ul><p class="cred">${CRED2}</p>` : ''}`);
    } else if (name === 'cuaderno') {
      const groups = [['obs', 'Lo que observamos'], ['modelo', 'Lo que probamos en la maqueta'], ['dicho', 'Lo que nos contaron'], ['idea', 'Ideas para comunicar']];
      const tag = id => { if (!s.b.done) return ''; if (id === 'p-nico') return '<span class="tag sup">suposición · se puede comprobar</span>'; const e = M.EV[id]; return e.kind === 'obs' ? '<span class="tag obs">observación</span>' : ''; };
      G.openActivity('Cuaderno de evidencias', s.ev.length ? groups.map(([k, t]) => { const L = s.ev.filter(id => M.EV[id].kind === k); return L.length ? `<h3>${t}</h3><ul class="notes">${L.map(id => { const e = M.EV[id]; return `<li>${imgHTML(e.img)}<span>${esc(e.t)} ${tag(id)} <small>${M.AREA_NAME[e.place]}</small></span>${sayBtn(e.t)}</li>`; }).join('')}</ul>` : ''; }).join('') + '<p class="muted small">Los personajes y diálogos son parte del juego.</p>' : '<p class="muted">El cuaderno está vacío. Observá, conversá y probá: cada evidencia queda anotada acá.</p>');
    } else if (name === 'mapa') {
      G.openActivity('Mapa', `<p class="muted">Podés caminar hasta los bordes de cada lugar o viajar directo.</p><ol class="map">${M.AREAS.map((a, i) => `<li class="${s.area === a ? 'here' : ''}"><div class="map-art" aria-hidden="true">${D.scene(a, s, M)}</div><strong>${i + 1}. ${M.AREA_NAME[a]}</strong><button type="button" data-go="${a}" ${s.area === a ? 'disabled' : ''}>${s.area === a ? 'Estás acá' : 'Ir'}</button></li>`).join('')}</ol>`);
      $$('[data-go]').forEach(b => b.onclick = () => { G.closeActivity(); G.travel(b.dataset.go, 'center'); });
    } else if (name === 'ajustes') {
      const P = s.prefs;
      const tg = (k, t) => `<label class="tog"><input type="checkbox" data-pref="${k}" ${P[k] ? 'checked' : ''}> <span>${t}</span></label>`;
      G.openActivity('Ajustes', `<fieldset class="modes"><legend>Modalidad (cambiala cuando quieras, sin perder lo avanzado)</legend>${Object.entries(M.MODES).map(([k, m]) => `<label class="mode-opt"><input type="radio" name="mode" value="${k}" ${s.mode === k ? 'checked' : ''}> <span><strong>${m.name}</strong><br>${m.desc}</span></label>`).join('')}</fieldset>
        <fieldset class="prefs"><legend>Opciones</legend>${tg('voz', 'Leer en voz alta los diálogos')}${tg('sonido', 'Sonidos')}${tg('musica', 'Música suave')}${tg('rm', 'Reducir movimiento')}${tg('hc', 'Alto contraste')}${tg('big', 'Texto grande')}</fieldset>
        <div class="row"><button type="button" id="b-reset">Reiniciar solo esta aventura</button><button type="button" id="b-portada">Ir a la portada del juego</button></div>
        <details class="credits"><summary>Créditos y aclaraciones</summary><p>${CRED}</p><p>${CRED2}</p><p>Proyecto escolar «El río se lleva mi pueblo», Escuela 479 · Mes de la Inclusión. El juego no presenta datos ni resultados de la investigación: la maqueta es un modelo simplificado.</p></details>`);
      $$('[data-pref]').forEach(i => i.onchange = () => { s.prefs[i.dataset.pref] = i.checked; G.save(); G.applyPrefs(); if (i.dataset.pref === 'voz' && i.checked) G.speak('La lectura en voz alta está activada.'); });
      $$('input[name=mode]').forEach(i => i.onchange = () => { s.mode = i.value; G.save(); G.applyPrefs(); G.refresh(); G.toast('Modalidad: ' + M.MODES[s.mode].name + '. Tu progreso sigue igual.'); });
      $('#b-reset').onclick = () => G.confirm('¿Reiniciar esta aventura? Se borra solo el progreso de «El mensaje perdido del Bermejo». Los otros juegos y recorridos de la página no cambian.', G.reset);
      $('#b-portada').onclick = () => { G.closeActivity(); G.showStart(); };
    }
  };

  /* ======================= A · OBSERVAR Y COMPARAR ======================= */
  G.acts.compare = () => {
    const s = S(), need = M.cfg(s).aNeed;
    let view = 'lado', slider = 50, alt = 'ahora', sel = null, hintZone = null;
    const marks = () => {
      let g = '';
      s.a.seen.forEach(id => { const z = M.ZONES.find(q => q.id === id); const ok = z.rel; g += `<circle cx="${z.x}" cy="${z.y}" r="${z.r}" fill="none" stroke="${ok ? '#2b8a5a' : '#8a7a9a'}" stroke-width="5" ${ok ? '' : 'stroke-dasharray="10 8"'}/>`; if (ok) g += `<g transform="translate(${z.x + z.r * .7} ${z.y - z.r * .7})"><circle r="15" fill="#2b8a5a"/><path d="M-7 0 l5 5 9 -10" stroke="#fff" stroke-width="4" fill="none"/></g>`; });
      if (hintZone) { const z = M.ZONES.find(q => q.id === hintZone); g += `<circle class="pulse" cx="${z.x}" cy="${z.y}" r="${z.r + 26}" fill="#f1cf7633" stroke="#e0a800" stroke-width="5" stroke-dasharray="12 8"/>`; }
      if (sel) { const z = M.ZONES.find(q => q.id === sel); g += `<circle cx="${z.x}" cy="${z.y}" r="${z.r + 8}" fill="none" stroke="#684593" stroke-width="7"/>`; }
      return `<svg class="cmp-marks" viewBox="0 0 600 340" aria-hidden="true">${g}</svg>`;
    };
    const fig = (which, tap) => `<div class="cmp-box ${tap ? 'tap' : ''}" ${tap ? 'data-tap="1"' : ''}>${D.compare(which)}${marks()}</div>`;
    function render() {
      keepFocus(() => {
        const n = s.a.found.length;
        let body = '';
        if (view === 'lado') body = `<div class="cmp-two"><figure><figcaption>Antes</figcaption>${fig('antes', true)}</figure><figure><figcaption>Ahora</figcaption>${fig('ahora', true)}</figure></div>`;
        else if (view === 'desliza') body = `<div class="cmp-box tap slide" data-tap="1">${D.compare('ahora')}<div class="cmp-top" style="clip-path:inset(0 ${100 - slider}% 0 0)">${D.compare('antes')}</div><div class="cmp-line" style="left:${slider}%"></div>${marks()}</div><label class="slider">Deslizá para ver más de ANTES o de AHORA <input type="range" min="0" max="100" value="${slider}" data-k="slider" aria-label="Mostrar antes o ahora"></label>`;
        else if (view === 'alternar') body = `<div class="row center"><button type="button" data-k="alt-a" data-alt="antes" aria-pressed="${alt === 'antes'}">Ver ANTES</button><button type="button" data-k="alt-b" data-alt="ahora" aria-pressed="${alt === 'ahora'}">Ver AHORA</button></div>${fig(alt, true)}`;
        else body = `<div class="cmp-two small">${'<figure><figcaption>Antes</figcaption>' + fig('antes') + '</figure><figure><figcaption>Ahora</figcaption>' + fig('ahora') + '</figure>'}</div>
          <p class="muted">Elegí una parte para mirarla en las dos ilustraciones:</p><div class="zone-list">${M.ZONES.map(z => `<button type="button" data-k="z-${z.id}" data-zone="${z.id}" aria-pressed="${sel === z.id}" class="${s.a.seen.includes(z.id) ? (z.rel ? 'ok' : 'seen') : ''}">${esc(z.lab)}${s.a.found.includes(z.id) ? ' ✓' : ''}</button>`).join('')}</div>
          ${sel ? `<div class="zone-q"><p><strong>${esc(M.ZONES.find(z => z.id === sel).lab)}:</strong> ¿cambió algo de la costa?</p><div class="row"><button type="button" data-k="ans-si" data-ans="si">Sí, cambió la costa</button><button type="button" data-k="ans-no" data-ans="no">No cambió la costa</button></div></div>` : ''}`;
        $('#act-body').innerHTML = `<div class="views" role="group" aria-label="Formas de comparar">${[['lado', 'Lado a lado'], ['desliza', 'Deslizador'], ['alternar', 'Alternar'], ['lista', 'Por partes (lista)']].map(([k, t]) => `<button type="button" data-k="v-${k}" data-view="${k}" aria-pressed="${view === k}">${t}</button>`).join('')}</div>
          <p class="counter" aria-live="polite">Cambios de la costa encontrados: <strong>${n} de ${need}</strong></p>${body}
          ${s.a.done ? `<div class="done-box"><strong>¡Encontraste los cambios!</strong> En la ilustración de «ahora» falta tierra en el borde, el hueco de la base es más grande y hay terrones en la orilla. <button type="button" class="primary" data-k="fin" id="a-fin">Volver con Tomás</button></div>` : ''}`;
        bind();
      });
    }
    function tapAt(e, box) {
      if (view === 'lista' || s.a.done && false) return;
      const svg = $('svg', box), r = svg.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * 600, y = (e.clientY - r.top) / r.height * 340;
      const z = M.zoneAt(x, y);
      if (!z) { G.sfx('hmm'); feedback(s.mode === 'detective' ? 'Ahí no se ve un cambio.' : 'En ese lugar no veo un cambio. Mirá el borde de arriba, la base y la orilla.'); return; }
      result(M.markZone(s, z.id));
    }
    function result(r) {
      G.save(); hintZone = null;
      if (r.rel) { G.sfx(r.done ? 'fiesta' : 'ok'); feedback(r.text + (r.nuevo ? '' : ' (Ya lo habías marcado).'), 'ok'); if (r.done) G.toast('Comparación terminada: nueva evidencia en el cuaderno'); }
      else { G.sfx('hmm'); feedback(r.text); }
      render();
    }
    function bind() {
      $$('[data-view]').forEach(b => b.onclick = () => { view = b.dataset.view; sel = null; render(); });
      $$('[data-tap]').forEach(b => b.onclick = e => tapAt(e, b));
      const sl = $('[data-k=slider]'); if (sl) sl.oninput = () => { slider = +sl.value; $('.cmp-top').style.clipPath = `inset(0 ${100 - slider}% 0 0)`; $('.cmp-line').style.left = slider + '%'; };
      $$('[data-alt]').forEach(b => b.onclick = () => { alt = b.dataset.alt; render(); });
      $$('[data-zone]').forEach(b => b.onclick = () => { sel = b.dataset.zone; render(); });
      $$('[data-ans]').forEach(b => b.onclick = () => {
        const z = M.ZONES.find(q => q.id === sel), si = b.dataset.ans === 'si';
        if (z.rel && si) result(M.markZone(s, z.id));
        else if (!z.rel && !si) { M.markZone(s, z.id); G.save(); feedback('Bien pensado. ' + z.no, 'ok'); render(); }
        else if (z.rel && !si) { G.sfx('hmm'); feedback('Mirá otra vez las dos ilustraciones en esa parte. ¿Está igual?'); }
        else { G.sfx('hmm'); feedback(z.no); M.markZone(s, z.id); G.save(); render(); }
      });
      const f = $('#a-fin'); if (f) f.onclick = () => { G.closeActivity(); setTimeout(() => G.talk.tomas(), 150); };
    }
    const nextZone = () => (M.ZONES.find(z => z.rel && !s.a.found.includes(z.id)) || {}).id;
    G.openActivity('Comparar: antes y ahora', `<p class="intro">Tomás dibujó la misma costa en dos momentos. <strong>Tocá</strong> en cualquiera de las dos ilustraciones los lugares donde cambió la costa. <span class="tag-juego">ilustraciones del juego</span></p>${helpBox('a', 'Buscá cambios de la costa: el borde, la base, la orilla, el árbol. Lo que cambia todos los días, como las nubes, no cuenta.')}<div id="act-body"></div><div id="act-fb" class="fb" aria-live="polite"></div>`, {
      cls: 'wide',
      help: helpRunner('a', [
        { t: 'Buscá cambios de la costa: el borde, la base, la orilla, el árbol. Lo que cambia todos los días, como las nubes o un bote que pasa, no cuenta.' },
        { t: 'Mirá la zona marcada con amarillo en las ilustraciones.', hint: () => { hintZone = nextZone(); if (view === 'lista') view = 'lado'; render(); return null; } },
        { t: 'Mirá: te muestro un cambio.', demo: () => { const z = nextZone(); if (z) result(M.markZone(s, z)); } }
      ])
    });
    render();
  };

  /* ======================= B · OBSERVACIÓN O SUPOSICIÓN ======================= */
  G.acts.classify = () => {
    const s = S(); let picked = null;
    const list = () => M.bStatements(s);
    function render() {
      keepFocus(() => {
        const pile = list().filter(x => !s.b.placed[x.id]);
        const box = k => list().filter(x => s.b.placed[x.id] === k).map(x => `<li class="card placed">${esc(x.t)}</li>`).join('');
        $('#act-body').innerHTML = `
          <div class="pile" aria-label="Tarjetas para ordenar">${pile.length ? pile.map(x => `<button type="button" class="card" data-k="c-${x.id}" data-pick="${x.id}" aria-pressed="${picked === x.id}">${esc(x.t)} </button>`).join('') : '<p class="muted">¡No quedan tarjetas!</p>'}</div>
          <div class="boxes">
            <div class="box obs" data-drop="obs"><button type="button" class="box-h" data-k="b-obs" data-place="obs"><span aria-hidden="true">👀</span> LO VIMOS <small>observación</small></button><ul>${box('obs')}</ul></div>
            <div class="box sup" data-drop="sup"><button type="button" class="box-h" data-k="b-sup" data-place="sup"><span aria-hidden="true">💭</span> LO PENSAMOS <small>suposición</small></button><ul>${box('sup')}</ul></div>
          </div>
          ${s.b.done ? `<div class="done-box"><div class="mini-port" aria-hidden="true">${D.portrait('nico', 'feliz')}</div><p><strong>Nico:</strong> «¡Lo del camión es una suposición! ¿Y si la probamos en el laboratorio?» ${sayBtn('¡Lo del camión es una suposición! ¿Y si la probamos en el laboratorio?', 'nico')}</p><button type="button" class="primary" data-k="fin" id="b-fin">Ir al laboratorio</button></div>` : ''}`;
        $$('[data-pick]').forEach(b => b.onclick = () => { if (!clickOK()) return; picked = picked === b.dataset.pick ? null : b.dataset.pick; render(); });
        $$('[data-place]').forEach(b => b.onclick = () => place(b.dataset.place, picked));
        const f = $('#b-fin'); if (f) f.onclick = () => { G.closeActivity(); G.travel('lab', 'left'); };
      });
    }
    function place(kind, id) {
      if (!id) { feedback('Primero elegí una tarjeta. Después tocá «Lo vimos» o «Lo pensamos».'); return; }
      const r = M.classify(s, id, kind); G.save(); picked = null;
      G.sfx(r.ok ? (r.done ? 'fiesta' : 'ok') : 'hmm'); feedback(r.text, r.ok ? 'ok' : '');
      if (r.done) G.toast('Pistas ordenadas: el laboratorio está listo');
      render();
    }
    const first = () => list().find(x => !s.b.placed[x.id]);
    G.openActivity('Mesa de pistas: ¿lo vimos o lo pensamos?', `<p class="intro">Elegí una tarjeta y llevala a su caja (tocando o arrastrando).</p><p class="example"><strong>Ejemplo:</strong> «El pizarrón es verde» → <em>lo vimos</em>. «El pizarrón está viejo porque nadie lo cuida» → <em>lo pensamos</em>. ${sayBtn('Ejemplo: El pizarrón es verde: lo vimos. El pizarrón está viejo porque nadie lo cuida: lo pensamos.')}</p>${helpBox('b', '¿Se puede ver con los ojos? Es una observación. ¿Es una idea para explicar algo? Es una suposición.')}<div id="act-body"></div><div id="act-fb" class="fb" aria-live="polite"></div>`, {
      cls: 'wide',
      help: helpRunner('b', [
        { t: '¿Se puede ver con los ojos? Es una observación. ¿Es una idea para explicar por qué pasa algo? Es una suposición.' },
        { t: () => { const x = S().b.placed && (list().find(q => q.id === picked) || first()); return x ? 'Para «' + x.t + '», mirá la caja que brilla.' : 'Ya están todas.'; }, hint: () => { const x = list().find(q => q.id === picked) || first(); return x ? `.box.${x.k} .box-h` : null; } },
        { t: 'Mirá: te muestro una.', demo: () => { const x = first(); if (x) place(x.k, x.id); } }
      ])
    });
    dnd($('#act-body'), (drop, id) => place(drop, id));
    render();
  };

  /* ======================= C · LA MAQUETA ======================= */
  G.acts.maqueta = () => {
    const s = S(), sim = s.c.sim, O = s.c.obs;
    let anim = {}, lupa = false, justFell = sim.caidos > 0 && !O.cae, hintZ = null, log = [];
    const det = () => s.mode === 'detective';
    function task() {
      if (!O.base) { if (s.c.pred == null && sim.pours === 0) return 'pred'; return (sim.hueco > 0 || sim.caidos > 0) ? 'base' : 'echar'; }
      if (!O.cae) return justFell ? 'cae' : 'seguir';
      if (det() && !O.caudal) return (sim.runs.poco != null && sim.runs.mucho != null) ? 'caudalQ' : 'caudal';
      return 'libre';
    }
    const TASK = {
      pred: 'Antes de echar agua: ¿dónde creés que se va a gastar primero? Tocá esa parte de la maqueta.',
      echar: 'Echá agua y observá qué pasa.',
      base: '¿Dónde se gastó la tierra? Tocá esa parte de la maqueta.',
      seguir: 'Seguí echando agua. Observá la parte de arriba.',
      cae: '¿Qué pasó con la parte de arriba?',
      caudal: '¿Cambia algo si echás más agua por vez? Probá con poca y con mucha agua, y contá las veces hasta que se desprende.',
      caudalQ: 'Mirá la tabla: ¿con cuál se desprendió con menos veces?',
      libre: 'Podés seguir probando: cambiar la cantidad de agua, golpear la mesa o mirar con la lupa.'
    };
    function render() {
      keepFocus(() => {
        const t = task(), z = D.maquetaZones(sim);
        const marks = hintZ ? [Object.assign({ c: '#e0a800', dash: true }, z.find(q => q.id === hintZ), { r: z.find(q => q.id === hintZ).r + 14 })] : [];
        const q = t === 'cae' ? `<div class="opts3">${[['cae', 'Se desprendió y cayó al agua', 'i:cae'], ['igual', 'Quedó igual que antes', 'i:golpe'], ['crece', 'Creció más tierra arriba', '']].map(([k, l, im]) => `<button type="button" data-k="q-${k}" data-cae="${k}">${im ? imgHTML(im) : '<span class="noimg" aria-hidden="true">？</span>'}<span>${l}</span></button>`).join('')}</div>`
          : t === 'caudalQ' ? `<div class="row"><button type="button" data-k="qc-poco" data-cq="poco">Con poca agua</button><button type="button" data-k="qc-mucho" data-cq="mucho">Con mucha agua</button></div>` : '';
        $('#act-body').innerHTML = `<div class="maq">
          <div class="maq-view ${anim.shake ? 'shake' : ''}" data-k="maq" id="maq-view">${D.maqueta(sim, { pouring: anim.pour, falling: anim.fall, marks, lupa })}</div>
          <div class="maq-side">
            <div class="task"><strong>${t === 'libre' ? 'Para seguir probando' : 'Observá'}</strong><p>${esc(TASK[t])} ${sayBtn(TASK[t])}</p>${q}</div>
            <div class="ctrl" role="group" aria-label="Cantidad de agua"><button type="button" data-k="cp" data-caudal="poco" aria-pressed="${sim.caudal === 'poco'}">Poca agua</button><button type="button" data-k="cm" data-caudal="mucho" aria-pressed="${sim.caudal === 'mucho'}">Mucha agua</button></div>
            <div class="ctrl"><button type="button" class="primary" data-k="pour" id="m-pour" ${anim.pour || t === 'pred' || t === 'cae' ? 'disabled' : ''}>💧 Echar agua</button><button type="button" data-k="golpe" id="m-golpe">✊ Golpear la mesa (idea de Nico)</button>
            ${M.has(s, 'lupa') ? `<button type="button" data-k="lupa" id="m-lupa" aria-pressed="${lupa}">🔍 Mirar con la lupa</button>` : ''}<button type="button" data-k="rearmar" id="m-reset">↺ Rearmar la maqueta</button></div>
            <table class="runs"><caption>Veces que echaste agua hasta que se desprendió</caption><tr><th>Poca agua</th><td>${sim.runs.poco == null ? '—' : sim.runs.poco}</td></tr><tr><th>Mucha agua</th><td>${sim.runs.mucho == null ? '—' : sim.runs.mucho}</td></tr></table>
            ${log.length ? `<ol class="log" aria-label="Lo que viste">${log.slice(-4).map(l => `<li>${esc(l)}</li>`).join('')}</ol>` : ''}
          </div></div>
          <p class="caveat">⚠️ Es un <strong>modelo simplificado</strong>: ayuda a pensar, pero no muestra todo lo que pasa en un río real. Las cantidades son de esta maqueta del juego, no son mediciones del río.</p>
          ${s.c.done ? `<div class="done-box"><strong>¡Observaciones anotadas en el cuaderno!</strong> Ahora podés ordenar la explicación en el corcho del aula. <button type="button" class="primary" data-k="fin" id="c-fin">Ir al aula</button></div>` : ''}`;
        bind();
      });
    }
    function zoneTap(e) {
      const svg = $('#maq-view svg'), r = svg.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * 600, y = (e.clientY - r.top) / r.height * 360;
      let best = null, bd = 1e9; D.maquetaZones(sim).forEach(z => { const d = Math.hypot(z.x - x, z.y - y); if (d < z.r + 30 && d < bd) { bd = d; best = z; } });
      if (!best) return;
      pickZone(best.id);
    }
    function pickZone(id) {
      const t = task(), lab = D.maquetaZones(sim).find(z => z.id === id).lab;
      hintZ = null;
      if (lupa && id === 'agua') { M.cObserve(s, 'marron', true); G.save(); G.sfx('ok'); feedback('Con la lupa: el agua está marrón porque arrastra granitos de tierra. ¡Era una suposición y ahora la observamos en la maqueta!', 'ok'); render(); return; }
      if (t === 'pred') { s.c.pred = id; G.save(); G.sfx('suave'); feedback('Anotaste tu predicción: «' + lab + '». Ahora echá agua y observá.'); render(); return; }
      if (t === 'base') {
        const r = M.cObserve(s, 'base', id); G.save();
        if (r.ok) { G.sfx('ok'); const pr = s.c.pred; feedback('¡Sí! El agua gastó primero la base.' + (pr ? (pr === 'base' ? ' Coincidió con tu predicción.' : ' Habías pensado «' + D.maquetaZones(sim).find(z => z.id === pr).lab.toLowerCase() + '»: observar sirve para revisar ideas.') : ''), 'ok'); }
        else { G.sfx('hmm'); feedback('Mirá de nuevo: ¿dónde está el hueco? Podés echar agua otra vez para verlo.'); }
        render(); return;
      }
      feedback(lab + '.');
    }
    function bind() {
      $('#maq-view').onclick = zoneTap;
      $$('[data-caudal]').forEach(b => b.onclick = () => { M.setCaudal(sim, b.dataset.caudal); G.save(); render(); });
      $('#m-pour').onclick = pour;
      $('#m-golpe').onclick = () => { M.golpe(sim); G.sfx('toc'); anim.shake = true; render(); setTimeout(() => { anim.shake = false; const first = !O.golpe; M.cObserve(s, 'golpe'); G.save(); log.push('Golpeaste la mesa sin agua: casi no se movió nada.'); feedback(first ? 'Nico: «¡Casi no se movió! Mi idea era una suposición… y probarla me ayudó a pensar. Igual, la maqueta no es el río real».' : 'Sin agua, la tierra casi no se mueve en la maqueta.', 'ok'); render(); }, 600); };
      const l = $('#m-lupa'); if (l) l.onclick = () => { lupa = !lupa; render(); if (lupa) feedback('Tocá el agua de la maqueta para mirarla con la lupa.'); };
      $('#m-reset').onclick = () => { M.rearmar(sim); G.save(); justFell = false; log.push('Rearmaste la maqueta.'); G.sfx('suave'); render(); };
      $$('[data-cae]').forEach(b => b.onclick = () => { const r = M.cObserve(s, 'cae', b.dataset.cae); G.save(); if (r.ok) { justFell = false; G.sfx('ok'); feedback('¡Eso! Cuando la base quedó hueca, la parte de arriba se quedó sin apoyo y se desprendió.', 'ok'); } else { G.sfx('hmm'); feedback('Mirá la maqueta: ¿dónde está ahora la tierra de arriba? Podés rearmarla y repetir.'); } after(r); render(); });
      $$('[data-cq]').forEach(b => b.onclick = () => { const r = M.cObserve(s, 'caudal', b.dataset.cq); G.save(); if (r.ok) { G.sfx('ok'); feedback('Sí: en esta maqueta, con más agua por vez el desprendimiento llegó con menos vertidas.', 'ok'); } else { G.sfx('hmm'); feedback('Mirá los números de la tabla: ¿cuál es más chico?'); } after(r); render(); });
      const f = $('#c-fin'); if (f) f.onclick = () => { G.closeActivity(); G.travel('escuela', 'right'); };
    }
    function after(r) { if (r && r.done) { G.sfx('fiesta'); G.toast('¡Experimento terminado! Nuevas evidencias en el cuaderno'); } }
    function pour() {
      if (anim.pour) return;
      anim.pour = true; G.sfx('agua'); render();
      setTimeout(() => {
        const r = M.pour(sim); anim.pour = false; G.save();
        if (r.ev === 'cae') { anim.fall = true; G.sfx('cae'); justFell = !O.cae; log.push('¡Se desprendió la parte de arriba! (' + r.vertidas + ' veces con ' + (sim.caudal === 'mucho' ? 'mucha' : 'poca') + ' agua)'); render(); setTimeout(() => { anim.fall = false; render(); }, 900); }
        else { log.push(['', 'Se ve un hueco chico en la base.', 'El hueco de la base es más grande.', 'El hueco es muy grande: arriba casi no hay apoyo.', ''][r.hueco] || 'El agua golpea la base.'); render(); }
        if (det() && O.cae && !O.caudal && sim.runs.poco != null && sim.runs.mucho == null && sim.caudal === 'poco' && r.ev === 'cae') feedback('Ahora probá con «Mucha agua» y compará.');
      }, S().prefs.rm ? 150 : 700);
    }
    G.openActivity('Laboratorio: la maqueta', `<p class="intro">Probá cómo el agua puede gastar la base de una costa. Podés repetir todas las veces que quieras.</p>${helpBox('c', 'Seguí la consigna del cuadro «Observá». Después de cada vertida, mirá con atención la base y la parte de arriba.')}<div id="act-body"></div><div id="act-fb" class="fb" aria-live="polite"></div>`, {
      cls: 'wide',
      help: helpRunner('c', [
        { t: () => 'Ahora: ' + TASK[task()] },
        { t: 'Mirá lo que brilla.', hint: () => { const t = task(); if (t === 'base' || t === 'pred') { hintZ = 'base'; render(); return null; } if (t === 'cae') return '[data-cae="cae"]'; if (t === 'caudalQ') return `[data-cq="${sim.runs.mucho <= sim.runs.poco ? 'mucho' : 'poco'}"]`; if (t === 'caudal') return sim.runs.poco == null ? '[data-caudal="poco"], #m-pour' : '[data-caudal="mucho"], #m-pour'; return '#m-pour'; } },
        { t: 'Mirá cómo se hace.', demo: () => { const t = task(); if (t === 'pred') pickZone('base'); else if (t === 'base') pickZone('base'); else if (t === 'cae') $('[data-cae="cae"]').click(); else if (t === 'caudalQ') $(`[data-cq="${sim.runs.mucho <= sim.runs.poco ? 'mucho' : 'poco'}"]`).click(); else if (t === 'caudal' && sim.runs.poco != null && sim.caudal === 'poco') { M.setCaudal(sim, 'mucho'); render(); pour(); } else pour(); } }
      ])
    });
    render();
  };

  /* ======================= D · ORDENAR LA EXPLICACIÓN ======================= */
  G.acts.sequence = () => {
    const s = S(), n = M.cfg(s).dSlots, deck = M.dDeck(s);
    let slots = (s.d.slots || []).slice(0, n); while (slots.length < n) slots.push(null);
    if (slots.some(x => x && !deck.includes(x))) slots = slots.map(() => null);
    let picked = null, bad = [];
    const REF = s.mode === 'detective' ? ['rio', 'golpe', 'hueco', 'cae'] : ['golpe', 'hueco', 'cae'];
    const card = (id, extra) => { const c = M.CARDS[id]; return `${imgHTML(c.img)}<span>${esc(c.t)}</span>${extra || ''}`; };
    function render() {
      keepFocus(() => {
        $('#act-body').innerHTML = `<ol class="seq">${slots.map((id, i) => `<li class="slot${bad.includes(i) ? ' bad' : ''}" data-drop="${i}"><span class="num">${i + 1}</span>${id ? `<button type="button" class="card big" data-k="s-${i}" data-slot="${i}" aria-label="Paso ${i + 1}: ${esc(M.CARDS[id].t)}. Tocá para sacarla.">${card(id)}</button>` : `<button type="button" class="empty" data-k="s-${i}" data-slot="${i}" aria-label="Paso ${i + 1}: vacío. Tocá para colocar la tarjeta elegida.">${picked ? 'Colocar acá' : 'Vacío'}</button>`}</li>`).join('<li class="arrow" aria-hidden="true">→</li>')}</ol>
          <h3 class="sub">Tarjetas</h3><div class="deck">${deck.filter(id => !slots.includes(id)).map(id => `<button type="button" class="card" data-k="d-${id}" data-pick="${id}" aria-pressed="${picked === id}">${card(id)}</button>`).join('') || '<p class="muted">Usaste todas las tarjetas.</p>'}</div>
          <div class="row"><button type="button" class="primary" data-k="check" id="d-check">Revisar la explicación</button>${sayBtn(slots.filter(Boolean).map(id => M.CARDS[id].t).join('. ') || 'Todavía no hay tarjetas.', null, 'Escuchar la secuencia')}</div>
          ${s.d.done ? `<div class="done-box"><strong>¡Explicación ordenada!</strong> La Seño Marta y Bruno se fueron a preparar el stand en la feria. <button type="button" class="primary" data-k="fin" id="d-fin">Ir a la feria</button></div>` : ''}`;
        $$('[data-pick]').forEach(b => b.onclick = () => { if (!clickOK()) return; picked = picked === b.dataset.pick ? null : b.dataset.pick; render(); });
        $$('[data-slot]').forEach(b => b.onclick = () => { if (!clickOK()) return; const i = +b.dataset.slot; if (picked) put(i, picked); else if (slots[i]) { slots[i] = null; bad = []; render(); } });
        $('#d-check').onclick = check;
        const f = $('#d-fin'); if (f) f.onclick = () => { G.closeActivity(); G.travel('feria', 'center'); };
      });
    }
    function put(i, id) { const j = slots.indexOf(id); if (j >= 0) slots[j] = slots[i]; slots[i] = id; picked = null; bad = []; G.sfx('suave'); s.d.slots = slots.slice(); G.save(); render(); }
    function check() {
      const r = M.dSubmit(s, slots); G.save();
      bad = r.msgs ? r.msgs.map(m => m.slot).filter(i => i >= 0) : [];
      if (r.ok) { G.sfx(r.done ? 'fiesta' : 'ok'); feedback('¡Tiene sentido! ' + r.explain + '.' + (r.notes && r.notes.length ? ' ' + r.notes[0] : ''), 'ok'); if (r.done) G.toast('Explicación lista: ¡a la feria!'); }
      else { G.sfx('hmm'); feedback(r.msgs.map(m => m.t).filter((t, i, a) => a.indexOf(t) === i).slice(0, 2).join(' ')); }
      render();
    }
    const firstWrong = () => { for (let i = 0; i < n; i++) if (slots[i] !== REF[i]) return i; return -1; };
    G.openActivity('Corcho: ordenar la explicación', `<p class="intro">Ordená las tarjetas para explicar qué pasa en la costa. Tocá una tarjeta y después un lugar (o arrastrala). Puede haber más de un orden que tenga sentido.</p>${helpBox('d', 'Pensá en la maqueta: ¿qué llegó primero a la costa? ¿Qué apareció después en la base? ¿Qué pasó al final?')}<div id="act-body"></div><div id="act-fb" class="fb" aria-live="polite"></div>`, {
      cls: 'wide',
      help: helpRunner('d', [
        { t: 'Pensá en la maqueta: ¿qué llegó primero a la costa? ¿Qué apareció después en la base? ¿Qué pasó al final? Algunas tarjetas no son pasos.' },
        { t: 'Mirá la tarjeta que brilla: va en el lugar marcado.', hint: () => { const i = firstWrong(); if (i < 0) return null; bad = [i]; render(); return `[data-pick="${REF[i]}"], [data-slot="${i}"]`; } },
        { t: 'Mirá: coloco una tarjeta en su lugar.', demo: () => { const i = firstWrong(); if (i >= 0) put(i, REF[i]); } }
      ])
    });
    dnd($('#act-body'), (drop, id) => put(+drop, id));
    render();
  };

  /* ======================= CARTEL (HTML) ======================= */
  function posterHTML(s, o) {
    o = o || {};
    const n = M.panelsN(s), P = s.poster.panels.slice(0, n);
    const title = s.poster.title ? M.TITLES[s.poster.title].t : '';
    const items = o.edit ? P.map((p, i) => ({ p, i })) : M.usedPanels(s);
    return `<div class="poster${o.edit ? ' edit' : ''}">
      ${o.edit ? `<p class="p-title${title ? '' : ' empty'}">${esc(title || 'Elegí un título')}</p>` : `<h3 class="p-title">${esc(title)}</h3>`}
      <ol class="p-panels n${items.length}">${items.map(({ p, i }) => {
      const inner = `<span class="p-n" aria-hidden="true">${i + 1}</span><span class="p-img">${p.img ? imgHTML(p.img) : '<span class="p-ph">imagen</span>'}${p.word ? `<b class="p-word">${esc(p.word)}</b>` : ''}</span><span class="p-txt">${p.phrase ? esc(M.PHRASES[p.phrase].t) : '<span class="p-ph">frase</span>'}${p.phrase && M.PHRASES[p.phrase].long ? ' <em class="tag-l">larga</em>' : ''}</span>`;
      return `<li class="p-panel${o.sel === i ? ' sel' : ''}${o.bad && o.bad.includes(i) ? ' bad' : ''}" ${o.edit ? `data-drop="${i}"` : ''}>${o.edit ? `<button type="button" class="p-btn" data-k="pn-${i}" data-panel="${i}" aria-pressed="${o.sel === i}" aria-label="Cuadro ${i + 1}${p.phrase ? ': ' + esc(M.PHRASES[p.phrase].t) : ': vacío'}">${inner}</button>` : inner}</li>`;
    }).join('')}</ol>
      ${s.poster.audio ? '<p class="p-audio"><span aria-hidden="true">🔊</span> Este cartel también se puede escuchar.</p>' : ''}
      <p class="p-cred">${CRED} ${o.edit ? '' : CRED2}</p></div>`;
  }
  function posterText(s) { const t = s.poster.title ? M.TITLES[s.poster.title].t + '. ' : ''; return t + M.usedPanels(s).map(q => q.p.phrase ? M.PHRASES[q.p.phrase].t : '').filter(Boolean).join(' '); }
  G.posterHTML = posterHTML;

  /* ======================= E y F · STAND ======================= */
  const TOPIC_ILU = { golpe: 'i:golpe', agua: 'i:golpe', hueco: 'i:hueco', cae: 'i:cae', orilla: 'i:orilla', modelo: 'i:maqueta', cuidado: 'i:borde' };
  const TOPIC_PHRASE = s => ({ golpe: s.mode === 'detective' ? 'f-golpe-b' : 'f-golpe', hueco: s.mode === 'detective' ? 'f-hueco-b' : 'f-hueco', cae: 'f-cae', modelo: 'f-modelo' });
  G.acts.stand = (tab) => {
    const s = S();
    let view = tab || 'armar', sel = 0, pick = 'img', result = null, showFix = s.mode !== 'detective', badPanels = [];
    const n = M.panelsN(s);
    function render() {
      keepFocus(() => {
        const tabs = `<div class="tabs" role="tablist"><button type="button" role="tab" data-k="t-armar" data-tab="armar" aria-selected="${view === 'armar'}">1 · Armar el cartel</button><button type="button" role="tab" data-k="t-probar" data-tab="probar" aria-selected="${view === 'probar'}" ${s.e.done ? '' : 'disabled'}>2 · Probar con visitantes</button></div>`;
        $('#act-body').innerHTML = tabs + (view === 'armar' ? armar() : probar());
        bind();
      });
    }
    function armar() {
      const p = s.poster.panels[sel];
      const imgs = M.imagesOwned(s);
      let picker = '';
      if (pick === 'img') picker = `<div class="imgs">${imgs.map(im => `<button type="button" class="img-opt" data-k="im-${im}" data-pick="${im}" data-img="${im}" aria-pressed="${p.img === im}">${imgHTML(im)}<span>${esc(G.imgLabel(im))}</span><small>${im[0] === 'p' ? 'ARASAAC' : 'ilustración del juego'}</small></button>`).join('')}</div>`;
      else if (pick === 'frase') picker = `<ul class="phr">${M.phrasesAvailable(s).map(id => { const ph = M.PHRASES[id]; return `<li><button type="button" data-k="ph-${id}" data-phrase="${id}" aria-pressed="${p.phrase === id}">${esc(ph.t)} ${ph.long ? '<em class="tag-l">larga</em>' : ''}</button>${sayBtn(ph.t)}</li>`; }).join('')}${p.phrase && M.PHRASES[p.phrase].part ? `<li><button type="button" aria-pressed="true" disabled>${esc(M.PHRASES[p.phrase].t)} <em class="tag-s">parte dividida</em></button></li>` : ''}</ul>`;
      else picker = !M.has(s, 'marcador') ? '<p class="muted">Para escribir una palabra junto a un pictograma hace falta un marcador. Sol tiene uno: se lo da a quien la ayude con sus tarjetas.</p>' : (!p.img || p.img[0] !== 'p') ? '<p class="muted">La palabra va junto a un pictograma ARASAAC. Las ilustraciones del juego no la necesitan.</p>' : `<div class="words">${M.WORDS.map(w => `<button type="button" data-k="w-${w}" data-word="${esc(w)}" aria-pressed="${p.word === w}">${esc(w)}</button>`).join('')}<button type="button" data-k="w-none" data-word="">Sin palabra</button></div>`;
      return `<div class="stand">
        <div class="stand-l">
          <div class="titles" role="group" aria-label="Título del cartel"><span class="lab">Título:</span>${Object.entries(M.TITLES).map(([k, t]) => `<button type="button" data-k="ti-${k}" data-title="${k}" aria-pressed="${s.poster.title === k}">${esc(t.t)}</button>`).join('')}</div>
          ${posterHTML(s, { edit: true, sel, bad: badPanels })}
          <div class="row"><button type="button" data-k="audio" id="e-audio" aria-pressed="${s.poster.audio}">🎙️ ${s.poster.audio ? 'Audio agregado' : 'Agregar audio'}</button><button type="button" data-k="listen" id="e-listen">🔊 Escuchar el cartel</button></div>
        </div>
        <div class="stand-r">
          <h3 class="sub">Cuadro ${sel + 1}</h3>
          <div class="row tools"><button type="button" data-k="up" id="e-up" ${sel === 0 ? 'disabled' : ''} aria-label="Mover el cuadro ${sel + 1} antes">↑ Antes</button><button type="button" data-k="down" id="e-down" ${sel === n - 1 ? 'disabled' : ''} aria-label="Mover el cuadro ${sel + 1} después">↓ Después</button><button type="button" data-k="split" id="e-split">✂️ Dividir frase</button><button type="button" data-k="clear" id="e-clear">Vaciar</button></div>
          <div class="tabs small" role="tablist"><button type="button" role="tab" data-k="pk-img" data-pk="img" aria-selected="${pick === 'img'}">Imagen</button><button type="button" role="tab" data-k="pk-frase" data-pk="frase" aria-selected="${pick === 'frase'}">Frase</button><button type="button" role="tab" data-k="pk-pal" data-pk="palabra" aria-selected="${pick === 'palabra'}">Palabra</button></div>
          ${picker}
          <p class="muted small">También podés arrastrar una imagen hasta un cuadro del cartel.</p>
        </div></div>
        <div class="row"><button type="button" class="primary" data-k="ready" id="e-ready">Listo: probar con visitantes ▸</button></div>`;
    }
    function probar() {
      const vs = M.visitorsFor(s);
      const r = result;
      return `<div class="test-grid"><div class="test-top">${posterHTML(s, { bad: badPanels })}</div><div class="test-r" id="test-r">
        <ul class="visitors">${vs.map(id => { const V = M.VISITORS[id], v = r && r.visitors.find(q => q.id === id); return `<li class="vis${v ? (v.ok ? ' ok' : ' doubt') : ''}"><div class="mini-port" aria-hidden="true">${D.portrait(id, v ? (v.ok ? 'feliz' : 'duda') : 'contento')}</div><div><strong>${esc(V.n)}</strong> <span class="tag-juego">personaje del juego</span><p class="muted small">${esc(V.about)}</p>${v ? (v.ok ? `<p class="bub ok">«${esc(v.happy)}» ${sayBtn(v.happy, id)}</p>` : v.issues.map(q => `<p class="bub">«${esc(q.t)}» ${sayBtn(q.t, id)}${showFix ? `<br><small>Idea: ${esc(q.fix)}</small>` : ''}${q.panel >= 0 ? ` <button type="button" class="mini" data-k="go-${id}-${q.panel}" data-goto="${q.panel}">Revisar cuadro ${q.panel + 1}</button>` : ''}</p>`).join('')) : ''}</div></li>`; }).join('')}</ul>
        ${r && r.review.length ? `<div class="review"><div class="mini-port" aria-hidden="true">${D.portrait('marta', 'pensando')}</div><div><strong>La Seño Marta revisa el cuaderno:</strong>${r.review.map(q => `<p class="bub">${esc(q.t)} ${q.panel >= 0 ? `<button type="button" class="mini" data-k="gor-${q.panel}" data-goto="${q.panel}">Revisar cuadro ${q.panel + 1}</button>` : ''}</p>`).join('')}</div></div>` : ''}
        ${r ? `<p class="compare-n">${r.prev != null ? `Prueba anterior: <strong>${r.prev}</strong> ${r.prev === 1 ? 'duda' : 'dudas'} · ` : ''}Ahora: <strong>${r.count}</strong> ${r.count === 1 ? 'duda' : 'dudas'}</p>` : ''}
        <div class="row">${r && !r.allOk ? `<button type="button" data-k="edit" id="f-edit">✏️ Modificar el cartel</button>` : ''}<button type="button" class="primary" data-k="test" id="f-test">${r ? 'Mostrar el cartel otra vez' : 'Mostrar el cartel a los visitantes'}</button>${s.mode === 'detective' && r && !r.allOk ? `<button type="button" data-k="fix" id="f-fix" aria-pressed="${showFix}">¿Cómo lo arreglo?</button>` : ''}</div>
        ${s.f.done ? `<div class="done-box"><strong>¡Todos entendieron el cartel!</strong> La feria se llenó de luces. La Seño Marta te busca. <button type="button" class="primary" data-k="fin" id="f-fin">Hablar con la Seño Marta</button></div>` : ''}</div></div>`;
    }
    function bind() {
      $$('[data-tab]').forEach(b => b.onclick = () => { view = b.dataset.tab; render(); });
      if (view === 'armar') {
        $$('[data-title]').forEach(b => b.onclick = () => { s.poster.title = b.dataset.title; G.save(); G.sfx('suave'); render(); });
        $$('[data-panel]').forEach(b => b.onclick = () => { if (!clickOK()) return; sel = +b.dataset.panel; render(); if (window.innerWidth < 760) { const r = $('.stand-r'); if (r) r.scrollIntoView({ block: 'start', behavior: S().prefs.rm ? 'auto' : 'smooth' }); } });
        $$('[data-pk]').forEach(b => b.onclick = () => { pick = b.dataset.pk; render(); });
        $$('[data-img]').forEach(b => b.onclick = () => { if (!clickOK()) return; setP(sel, 'img', b.dataset.img); });
        $$('[data-phrase]').forEach(b => b.onclick = () => setP(sel, 'phrase', b.dataset.phrase));
        $$('[data-word]').forEach(b => b.onclick = () => setP(sel, 'word', b.dataset.word || null));
        $('#e-up').onclick = () => { if (M.movePanel(s, sel, -1)) { sel--; G.save(); render(); } };
        $('#e-down').onclick = () => { if (M.movePanel(s, sel, 1)) { sel++; G.save(); render(); } };
        $('#e-clear').onclick = () => { M.clearPanel(s, sel); G.save(); render(); };
        $('#e-split').onclick = () => { const r = M.splitPhrase(s, sel); G.save(); G.sfx(r.ok ? 'ok' : 'hmm'); feedback(r.t, r.ok ? 'ok' : ''); if (r.ok) { sel = r.at; pick = 'img'; } render(); };
        $('#e-audio').onclick = () => { const r = M.setAudio(s, !s.poster.audio); G.save(); if (r.t) { G.sfx('hmm'); feedback(r.t); } else { G.sfx('ok'); feedback(s.poster.audio ? 'Bruno grabó el cartel. Ahora también se puede escuchar.' : 'Sacaste el audio.', 'ok'); } render(); };
        $('#e-listen').onclick = () => G.speak(posterText(s) || 'El cartel está vacío.', 'bruno');
        $('#e-ready').onclick = () => {
          if (!M.posterReady(s)) { G.sfx('hmm'); feedback(!s.poster.title ? 'Falta elegir un título.' : 'Completá al menos tres cuadros con imagen o frase.'); return; }
          s.e.done = true; G.save(); G.refresh(); view = 'probar'; render(); G.toast('¡El cartel está en el stand!');
        };
      } else {
        $('#f-test').onclick = test;
        const e = $('#f-edit'); if (e) e.onclick = () => { view = 'armar'; sel = badPanels[0] || 0; render(); };
        const fx = $('#f-fix'); if (fx) fx.onclick = () => { showFix = !showFix; render(); };
        const f = $('#f-fin'); if (f) f.onclick = () => { G.closeActivity(); setTimeout(() => G.talk.martaFeria(), 200); };
      }
      $$('[data-goto]').forEach(b => b.onclick = () => { view = 'armar'; sel = +b.dataset.goto; render(); });
    }
    function setP(i, f, v) { const r = M.setPanel(s, i, f, v); if (!r.ok) { G.sfx('hmm'); if (r.t) feedback(r.t); return; } badPanels = badPanels.filter(x => x !== i); G.save(); G.sfx('suave'); if (f === 'img' && !s.poster.panels[i].phrase) pick = 'frase'; render(); }
    function test() {
      result = M.testPoster(s); G.save();
      badPanels = [...new Set(result.issues.map(q => q.panel).filter(i => i >= 0))];
      if (result.allOk) { G.sfx('fiesta'); feedback('¡Todos entendieron el cartel!', 'ok'); if (result.done) G.toast('¡La feria se transformó!'); }
      else { G.sfx('hmm'); feedback(result.count + (result.count === 1 ? ' duda' : ' dudas') + '. Escuchá a cada visitante, modificá el cartel y probalo de nuevo.'); }
      G.refresh(); render();
      const tr = $('#test-r'); if (tr && tr.scrollIntoView) tr.scrollIntoView({ block: 'start', behavior: S().prefs.rm ? 'auto' : 'smooth' });
    }
    function autoFix() {
      const ev = M.evaluate(s); const q = ev.issues[0]; if (!q) { feedback('El cartel no tiene dudas. ¡Probalo con los visitantes!', 'ok'); return; }
      const P = s.poster.panels, i = q.panel, TP = TOPIC_PHRASE(s);
      const own = im => M.imagesOwned(s).includes(im);
      const free = () => P.slice(0, n).findIndex(p => !p.img && !p.phrase);
      let msg = '';
      switch (q.code) {
        case 'titulo': case 'dificil': s.poster.title = 't1'; msg = 'Elegí un título claro: «' + M.TITLES.t1.t + '».'; break;
        case 'sinimg': { const t = M.PHRASES[P[i].phrase].topic; const im = TOPIC_ILU[t]; if (im && own(im)) P[i].img = im; msg = 'Agregué una imagen que muestra lo que dice la frase del cuadro ' + (i + 1) + '.'; break; }
        case 'sintxt': case 'nocoincide': { const info = M.imgInfo(P[i].img, P[i].word); const t = P[i].phrase ? M.PHRASES[P[i].phrase].topic : (info.topics[0] || 'golpe'); if (q.code === 'nocoincide' && TOPIC_ILU[t] && own(TOPIC_ILU[t])) { P[i].img = TOPIC_ILU[t]; P[i].word = null; } else if (TP[t]) P[i].phrase = TP[t]; msg = 'Hice coincidir la imagen y la frase del cuadro ' + (i + 1) + '.'; break; }
        case 'ambig': if (M.has(s, 'marcador')) { P[i].word = P[i].img === 'p:agua' ? 'agua del río' : 'se cae'; msg = 'Escribí una palabra junto al pictograma para aclararlo.'; } else { P[i].img = P[i].img === 'p:agua' ? 'i:golpe' : 'i:cae'; P[i].word = null; msg = 'Cambié el pictograma por una ilustración que no se confunde.'; } break;
        case 'arbol': { const t = P[i].phrase && M.PHRASES[P[i].phrase].topic; P[i].img = (t && TOPIC_ILU[t] && own(TOPIC_ILU[t])) ? TOPIC_ILU[t] : 'p:costa'; if (!own(P[i].img)) P[i].img = 'p:rio'; msg = 'Cambié el árbol por una imagen que muestra lo que pasa.'; break; }
        case 'claim': { const have = new Set(M.usedPanels(s).map(x => x.p.phrase && M.PHRASES[x.p.phrase].topic)); const t = ['golpe', 'hueco', 'cae'].find(x => !have.has(x)) || 'modelo'; P[i].phrase = TP[t]; P[i].img = own(TOPIC_ILU[t]) ? TOPIC_ILU[t] : P[i].img; P[i].word = null; msg = 'Cambié esa frase por una que está en el cuaderno.'; break; }
        case 'largo': if (M.has(s, 'tijera')) { const r = M.splitPhrase(s, i); msg = r.t; } else { const t = M.PHRASES[P[i].phrase].topic; if (s.mode !== 'detective' && TP[t]) { P[i].phrase = TP[t]; msg = 'Cambié la frase larga por una corta.'; } else msg = 'Para dividir la frase hace falta la tijera del armario del aula.'; } break;
        case 'orden': { const used = P.slice(0, n).filter(p => p.img || p.phrase), rest = P.slice(0, n).filter(p => !p.img && !p.phrase); const ord = p => { const t = p.phrase && M.PHRASES[p.phrase].topic; return ({ agua: 1, golpe: 1.5, hueco: 2, cae: 3, orilla: 4 })[t] || 5; }; used.sort((a, b) => ord(a) - ord(b)); const all = used.concat(rest); for (let k = 0; k < n; k++) P[k] = all[k]; msg = 'Ordené los cuadros: primero el agua, después el hueco y al final la tierra que se desprende.'; break; }
        case 'falta': case 'pocos': case 'metodo': { const have = new Set(M.usedPanels(s).map(x => x.p.phrase && M.PHRASES[x.p.phrase].topic)); const t = q.code === 'metodo' ? 'modelo' : ['golpe', 'hueco', 'cae'].find(x => !have.has(x)) || 'modelo'; let k = free(); let extra = '';
          if (k < 0) { const seen = {}; const topicOf = p => p.phrase && M.PHRASES[p.phrase].topic; const stepOf = t => ({ agua: 1, golpe: 1 })[t] || t; for (let j = 0; j < n; j++) { const t = stepOf(topicOf(P[j])); if (seen[t]) { k = j; break; } seen[t] = 1; } if (k >= 0) extra = ' Vacié el cuadro ' + (k + 1) + ', que repetía una idea.'; }
          if (k < 0) { msg = 'No hay cuadros libres: vaciá uno para agregar lo que falta.'; break; } P[k] = { img: own(TOPIC_ILU[t]) ? TOPIC_ILU[t] : null, phrase: TP[t], word: null }; msg = 'Agregué el cuadro que faltaba.' + extra + ' Después revisá el orden.'; break; }
        case 'audio': { const r = M.setAudio(s, true); msg = r.ok ? 'Agregué el audio con la grabadora de Bruno.' : (M.has(s, 'grabadora') ? r.t : 'Para el audio, hablá con Bruno en la feria: tiene una grabadora.'); break; }
      }
      G.save(); view = 'armar'; if (i >= 0) sel = i; feedback(msg, 'ok'); render();
    }
    G.openActivity('Stand: el cartel del río', `${helpBox('e', 'Elegí un título y completá al menos tres cuadros. Cada cuadro: una imagen y una frase corta, en el orden en que pasan las cosas.')}<div id="act-body"></div><div id="act-fb" class="fb" aria-live="polite"></div>`, {
      cls: 'wide',
      help: helpRunner('e', [
        { t: () => view === 'probar' ? 'Escuchá a cada visitante: te dicen qué no entienden. Cambiá el cartel y probalo de nuevo.' : 'Elegí un título y completá al menos tres cuadros. Cada cuadro: una imagen y una frase corta, en el orden en que pasan las cosas.' },
        { t: () => { const q = M.evaluate(s).issues[0]; return q ? 'Mirá lo que brilla. ' + q.fix : 'El cartel parece claro. ¡Probalo!'; }, hint: () => { const q = M.evaluate(s).issues[0]; if (!q) return '#f-test, #e-ready'; if (q.panel >= 0) { badPanels = [q.panel]; sel = q.panel; view = 'armar'; render(); return `[data-panel="${q.panel}"]`; } if (q.code === 'titulo' || q.code === 'dificil') { view = 'armar'; render(); return '[data-title="t1"]'; } if (q.code === 'audio') { view = 'armar'; render(); return '#e-audio'; } return null; } },
        { t: 'Mirá: arreglo una cosa del cartel.', demo: autoFix }
      ])
    });
    dnd($('#act-body'), (drop, id) => { if (id && id.includes(':')) { sel = +drop; setP(+drop, 'img', id); } });
    render();
  };

  /* ======================= G · AGENDA DEL STAND ======================= */
  const PWORD = { escuchar: 'Escuchamos', leer: 'Miramos el cartel', investigar: 'Investigamos la maqueta', comunicar: 'Contamos lo que aprendimos', familia: 'Contamos lo que aprendimos' };
  G.acts.agenda = () => {
    const s = S(), steps = M.gSteps(s), det = s.mode === 'detective';
    let slots = steps.map((_, i) => Object.assign({ picto: null, word: null }, (s.g.slots || [])[i] || {}));
    let picked = null, bad = [], wordFor = null;
    function render() {
      keepFocus(() => {
        const miss = M.gMissing(s);
        $('#act-body').innerHTML = `<blockquote class="instr">${esc(M.G_TEXT[s.mode])} ${sayBtn(M.G_TEXT[s.mode], 'marta', 'Escuchar la indicación')}</blockquote>
          ${miss.length ? `<p class="warn">Te falta ${miss.length === 1 ? 'un pictograma' : 'algunos pictogramas'} de Sol: ${miss.map(m => '<strong>' + esc(M.PICTOS[m]) + '</strong> (' + esc(M.HIDDEN_PICTOS[m] ? M.HIDDEN_PICTOS[m].where : 'en su caja') + ')').join(', ')}. Podés seguir explorando y volver.</p>` : ''}
          <ol class="seq agenda">${slots.map((sl, i) => `<li class="slot${bad.includes(i) ? ' bad' : ''}" data-drop="${i}"><span class="num">${i + 1}</span><button type="button" class="${sl.picto ? 'card big' : 'empty'}" data-k="g-${i}" data-gslot="${i}" aria-label="Paso ${i + 1}${sl.picto ? ': ' + esc(M.PICTOS[sl.picto]) : ': vacío'}">${sl.picto ? imgHTML('p:' + sl.picto) + `<span>${esc(det ? (sl.word || '…') : PWORD[sl.picto])}</span>` : (picked ? 'Colocar acá' : 'Vacío')}</button>${det ? `<button type="button" class="mini" data-k="gw-${i}" data-gw="${i}" aria-pressed="${wordFor === i}">Elegir palabra</button>` : ''}</li>`).join('<li class="arrow" aria-hidden="true">→</li>')}</ol>
          ${det && wordFor != null ? `<div class="words"><span class="lab">Palabra para el paso ${wordFor + 1}:</span>${M.G_WORDS.map(w => `<button type="button" data-k="gww-${w}" data-gword="${esc(w)}" aria-pressed="${slots[wordFor].word === w}">${esc(w)}</button>`).join('')}</div>` : ''}
          <h3 class="sub">Pictogramas</h3><div class="deck">${s.pictos.map(p => `<button type="button" class="card" data-k="gp-${p}" data-pick="${p}" aria-pressed="${picked === p}">${imgHTML('p:' + p)}<span>${esc(M.PICTOS[p])}</span></button>`).join('')}</div><p class="cred">${CRED}</p>
          <div class="row"><button type="button" class="primary" data-k="check" id="g-check">Revisar la agenda</button></div>
          ${s.g.done ? `<div class="done-box"><div class="mini-port" aria-hidden="true">${D.portrait('juli', 'feliz')}</div><p><strong>Juli:</strong> «¡Ahora sé qué viene después!» ${sayBtn('¡Ahora sé qué viene después!', 'juli')}</p><button type="button" class="primary" data-k="fin" id="g-fin">Ver lo que comunicamos</button></div>` : ''}`;
        $$('[data-pick]').forEach(b => b.onclick = () => { if (!clickOK()) return; picked = picked === b.dataset.pick ? null : b.dataset.pick; render(); });
        $$('[data-gslot]').forEach(b => b.onclick = () => { if (!clickOK()) return; const i = +b.dataset.gslot; if (picked) put(i, picked); else if (slots[i].picto) { slots[i] = { picto: null, word: slots[i].word }; render(); } });
        $$('[data-gw]').forEach(b => b.onclick = () => { wordFor = wordFor === +b.dataset.gw ? null : +b.dataset.gw; render(); });
        $$('[data-gword]').forEach(b => b.onclick = () => { slots[wordFor].word = b.dataset.gword; wordFor = null; bad = []; G.sfx('suave'); render(); });
        $('#g-check').onclick = check;
        const f = $('#g-fin'); if (f) f.onclick = () => G.acts.finale();
      });
    }
    function put(i, p) { slots[i] = { picto: p, word: slots[i].word }; picked = null; bad = []; G.sfx('suave'); s.g.slots = slots.map(x => Object.assign({}, x)); G.save(); render(); }
    function check() {
      const r = M.gSubmit(s, slots); G.save(); bad = r.msgs ? r.msgs.map(m => m.slot) : [];
      if (r.ok) { G.sfx('fiesta'); feedback('¡La agenda se entiende! Cada paso tiene su pictograma y su palabra.', 'ok'); if (r.done) { G.toast('¡Agenda lista! La feria está completa'); G.refresh(); } }
      else { G.sfx('hmm'); feedback(r.msgs.slice(0, 2).map(m => m.t).join(' ')); }
      render();
    }
    const firstWrong = () => steps.findIndex((st, i) => !st.pictos.includes(slots[i].picto) || (det && slots[i].word !== st.word));
    G.openActivity('Agenda visual del stand', `<p class="intro">La Seño Marta escribió cómo va a funcionar el stand. Convertila en una secuencia visual para que las personas sepan qué viene después.</p>${helpBox('g', 'Leé o escuchá la indicación. Buscá las acciones en orden: ¿qué se hace primero, después y al final?')}<div id="act-body"></div><div id="act-fb" class="fb" aria-live="polite"></div>`, {
      cls: 'wide',
      help: helpRunner('g', [
        { t: 'Leé o escuchá la indicación. Buscá las acciones en orden: ¿qué se hace primero, después y al final?' + (det ? ' Hay información que no es una actividad.' : '') },
        { t: 'Mirá el pictograma que brilla y el lugar marcado.', hint: () => { const i = firstWrong(); if (i < 0) return null; bad = [i]; render(); return `[data-pick="${steps[i].pictos[0]}"], [data-gslot="${i}"]`; } },
        { t: 'Mirá: completo un paso.', demo: () => { const i = firstWrong(); if (i < 0) return; const p = steps[i].pictos.find(x => s.pictos.includes(x)); if (!p) { feedback('Primero hay que encontrar el pictograma ' + M.PICTOS[steps[i].pictos[0]] + '.'); return; } slots[i] = { picto: p, word: det ? steps[i].word : null }; s.g.slots = slots.slice(); G.save(); render(); } }
      ])
    });
    dnd($('#act-body'), (drop, id) => put(+drop, id));
    render();
  };

  /* ======================= CIERRE ======================= */
  G.acts.finale = () => {
    const s = S(); s.fin = true; G.save();
    const used = M.usedPanels(s);
    G.openActivity('¡La feria se transformó!', `<div class="finale">
      <div class="fin-art" aria-hidden="true">${D.scene('feria', s, M)}</div>
      <p class="lead">Juli, Lucas${s.mode === 'detective' ? ', Mati' : ''} y la abuela Rosa entendieron qué le pasa a la costa. El mensaje perdido del Bermejo llegó con <strong>imágenes, pictogramas, frases cortas${s.poster.audio ? ' y audio' : ''}</strong>.</p>
      <div class="fin-grid"><div>${posterHTML(s)}</div><div>
        <h3>Lo que comunicaste</h3><ol>${used.map(q => `<li>${esc(q.p.phrase ? M.PHRASES[q.p.phrase].t : G.imgLabel(q.p.img))}</li>`).join('')}</ol>
        <h3>Cómo lo investigaste</h3><ul><li>${M.miradorCount(s)} observaciones en el Mirador</li><li>${s.ev.filter(id => M.EV[id].kind === 'modelo').length} observaciones con la maqueta (modelo simplificado)</li><li>${s.f.tests} ${s.f.tests === 1 ? 'prueba' : 'pruebas'} del cartel con visitantes</li></ul>
        ${s.g.done ? `<h3>Agenda del stand</h3><ol class="ag">${s.g.slots.map(x => `<li>${x.picto ? imgHTML('p:' + x.picto) : ''}<span>${esc(x.word || PWORD[x.picto] || '')}</span></li>`).join('')}</ol>` : ''}
      </div></div>
      <div class="row center"><button type="button" class="primary" id="fin-png">⬇️ Descargar el cartel (PNG)</button><button type="button" id="fin-print">🖨️ Imprimir el cartel</button><button type="button" id="fin-listen">🔊 Escuchar el cartel</button></div>
      <div class="row center"><button type="button" id="fin-otra">Probar otra forma de comunicar</button><button type="button" id="fin-seguir">Seguir explorando</button><button type="button" id="fin-home">Volver a Misión Inclusión</button></div>
      <p class="cred">${CRED} ${CRED2}</p></div>`, { cls: 'wide' });
    G.sfx('fiesta');
    $('#fin-png').onclick = () => G.downloadPoster();
    $('#fin-print').onclick = () => G.printPoster();
    $('#fin-listen').onclick = () => G.speak(posterText(s), 'bruno');
    $('#fin-otra').onclick = () => { G.closeActivity(); G.travel('feria', 'center'); setTimeout(() => G.acts.stand('armar'), 100); };
    $('#fin-seguir').onclick = () => G.closeActivity();
    $('#fin-home').onclick = () => { G.closeActivity(); G.goHome(); };
  };

  /* ======================= DESCARGA E IMPRESIÓN ======================= */
  function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
  function wrap(ctx, text, maxW) { const words = String(text).split(/\s+/), lines = []; let l = ''; for (const w of words) { const t = l ? l + ' ' + w : w; if (ctx.measureText(t).width > maxW && l) { lines.push(l); l = w; } else l = t; } if (l) lines.push(l); return lines; }
  async function renderPosterCanvas(s) {
    const Wd = 1240, Ht = 1754, c = document.createElement('canvas'); c.width = Wd; c.height = Ht;
    const x = c.getContext('2d'), F = 'Trebuchet MS, Verdana, sans-serif';
    x.fillStyle = '#fffdf9'; x.fillRect(0, 0, Wd, Ht);
    x.strokeStyle = '#684593'; x.lineWidth = 16; x.strokeRect(24, 24, Wd - 48, Ht - 48);
    x.fillStyle = '#684593'; x.fillRect(40, 40, Wd - 80, 170);
    x.fillStyle = '#fff'; x.font = `bold 64px ${F}`; x.textAlign = 'center';
    const tl = wrap(x, s.poster.title ? M.TITLES[s.poster.title].t : 'El río se lleva mi pueblo', Wd - 140).slice(0, 2); tl.forEach((l, i) => x.fillText(l, Wd / 2, (tl.length > 1 ? 112 : 147) + i * 70));
    const used = M.usedPanels(s), top = 240, foot = 220, rowH = Math.min(300, (Ht - top - foot) / Math.max(1, used.length));
    for (let k = 0; k < used.length; k++) {
      const p = used[k].p, y = top + k * rowH;
      x.fillStyle = k % 2 ? '#f6f0fb' : '#fbf8ee'; x.fillRect(60, y + 8, Wd - 120, rowH - 16);
      x.fillStyle = '#f1cf76'; x.beginPath(); x.arc(110, y + 52, 34, 0, 7); x.fill(); x.fillStyle = '#342543'; x.font = `bold 40px ${F}`; x.textAlign = 'center'; x.fillText(String(k + 1), 110, y + 66);
      const isz = rowH - 60 - (p.word ? 40 : 0);
      if (p.img) { try { const im = await loadImg(D.imgHref(p.img)); const ratio = im.width / im.height || 1; const w = Math.min(isz * 1.33, isz * ratio), h = w / ratio; x.fillStyle = '#fff'; x.fillRect(160, y + 22, isz * 1.33, isz + 8); x.drawImage(im, 160 + (isz * 1.33 - w) / 2, y + 26 + (isz - h) / 2, w, h); } catch (e) { } }
      if (p.word) { x.fillStyle = '#342543'; x.font = `bold 34px ${F}`; x.textAlign = 'center'; x.fillText(p.word.toUpperCase(), 160 + isz * .665, y + rowH - 24); }
      if (p.phrase) { x.fillStyle = '#342543'; x.font = `bold 46px ${F}`; x.textAlign = 'left'; const L = wrap(x, M.PHRASES[p.phrase].t, Wd - (200 + isz * 1.33) - 90); const lh = 56; const y0 = y + rowH / 2 - (L.length - 1) * lh / 2 + 14; L.forEach((l, i) => x.fillText(l, 200 + isz * 1.33, y0 + i * lh)); }
    }
    let fy = Ht - foot + 20;
    if (s.poster.audio) { x.fillStyle = '#2bb3a3'; x.font = `bold 36px ${F}`; x.textAlign = 'center'; x.fillText('Este cartel también se puede escuchar en el stand.', Wd / 2, fy); fy += 50; }
    x.fillStyle = '#5a4a6a'; x.font = `24px ${F}`; x.textAlign = 'center';
    wrap(x, CRED + ' ' + CRED2 + ' Proyecto «El río se lleva mi pueblo» · Escuela 479.', Wd - 160).forEach((l, i) => x.fillText(l, Wd / 2, fy + i * 32));
    return c;
  }
  G.downloadPoster = async () => {
    const s = S();
    try {
      const c = await renderPosterCanvas(s);
      const blob = await new Promise(r => c.toBlob(r, 'image/png'));
      G.lastExport = { size: blob.size, w: c.width, h: c.height };
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cartel-mensaje-del-bermejo.png'; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
      G.toast('Se descargó el cartel con sus créditos.');
    } catch (e) { G.toast('No se pudo descargar el cartel en este navegador. Probá con «Imprimir».'); }
  };
  G.printPoster = () => {
    const s = S(), pr = $('#print');
    pr.innerHTML = `<div class="print-sheet">${posterHTML(s)}<p class="print-foot">Proyecto «El río se lleva mi pueblo» · Escuela 479 · Mes de la Inclusión</p></div>`;
    const imgs = $$('img', pr); Promise.all(imgs.map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; }))).then(() => { try { window.print(); } catch (e) { } });
  };
})();
