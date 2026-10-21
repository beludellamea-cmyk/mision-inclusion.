/* El mensaje perdido del Bermejo · escenarios e ilustraciones (SVG).
   Todas las imágenes de este archivo son ilustraciones creadas para el juego:
   no son fotos ni registros reales del río Bermejo. */
(function () {
  'use strict';
  const C = window.BJC;
  const { chico, retrato, defsGlobales, mezcla, clr, osc } = C;
  const W = 1000, H = 560;
  const P = { ink: '#342543', purple: '#684593', gold: '#f1cf76', paper: '#f9f3e7', teal: '#2bb3a3', orange: '#ff9248', pink: '#ff5d8f', sky: '#bfe3f2' };

  const defsLocales = () => `<defs>
    <linearGradient id="d-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd3ee"/><stop offset="1" stop-color="#e9f6f4"/></linearGradient>
    <linearGradient id="d-rio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b88a5a"/><stop offset=".5" stop-color="#9f7348"/><stop offset="1" stop-color="#7d5a3a"/></linearGradient>
    <linearGradient id="d-barranca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8925c"/><stop offset=".55" stop-color="#a8703f"/><stop offset="1" stop-color="#7f5131"/></linearGradient>
    <linearGradient id="d-madera" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c99566"/><stop offset="1" stop-color="#9c6b43"/></linearGradient>
    <linearGradient id="d-pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe9cf"/><stop offset="1" stop-color="#f3d6b4"/></linearGradient>
    <linearGradient id="d-lab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8f0ec"/><stop offset="1" stop-color="#b9e0d9"/></linearGradient>
    <linearGradient id="d-sum" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b3f86"/><stop offset="1" stop-color="#7a5aa6"/></linearGradient>
    <pattern id="d-baldosa" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="#efe2cc"/><path d="M0 0H50V50" fill="none" stroke="#dccab0" stroke-width="2"/></pattern>
    <pattern id="d-azulejo" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#e9f7f4"/><path d="M0 0H40V40" fill="none" stroke="#c4e2dc" stroke-width="2"/></pattern>
    <filter id="d-bruma"><feGaussianBlur stdDeviation="3.2"/></filter>
    <radialGradient id="d-brillo"><stop offset="0" stop-color="#fff7c2" stop-opacity=".95"/><stop offset="1" stop-color="#fff7c2" stop-opacity="0"/></radialGradient>
  </defs>`;

  const pj = (n, o) => chico(n, o);
  const nube = (x, y, s, cls) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="${cls || 'nube'}"><path d="M-60 10 Q-62 -14 -36 -16 Q-30 -40 -4 -36 Q14 -54 36 -34 Q64 -36 62 -8 Q78 6 60 18 L-52 18 Q-70 18 -60 10Z" fill="#fff" opacity=".92"/></g></g>`;
  const pajaro = (x, y, c) => `<path class="pajaro" d="M${x - 12} ${y} q6 -8 12 0 q6 -8 12 0" fill="none" stroke="${c || '#4a3a5a'}" stroke-width="3" stroke-linecap="round"/>`;
  const flag = (x, y) => `<g class="pista-hecha" transform="translate(${x} ${y})"><path d="M0 0 V-34" stroke="#432b65" stroke-width="3"/><path d="M0 -34 L22 -27 L0 -20Z" fill="#f1cf76" stroke="#432b65" stroke-width="2"/><circle r="5" fill="#432b65"/></g>`;
  const tarjeta = (x, y, r, cls) => `<g transform="translate(${x} ${y}) rotate(${r || 0})"><g class="${cls || 'tarjeta-oculta'}"><rect x="-17" y="-21" width="34" height="42" rx="5" fill="#fff" stroke="#684593" stroke-width="2.5"/><rect x="-11" y="-15" width="22" height="20" rx="3" fill="#cfe9f5"/><path d="M-10 12 h20" stroke="#684593" stroke-width="3" stroke-linecap="round"/></g></g>`;
  const arbolito = (x, y, s, incl) => `<g transform="translate(${x} ${y}) rotate(${incl || 0}) scale(${s})"><path d="M-7 0 Q-4 -50 -9 -92 L9 -92 Q4 -50 7 0Z" fill="#7a4f2e"/><circle cx="0" cy="-112" r="44" fill="#4f9d58"/><circle cx="-30" cy="-92" r="30" fill="#5cb064"/><circle cx="30" cy="-94" r="30" fill="#468f50"/><circle cx="-8" cy="-130" r="24" fill="#6cc073" opacity=".8"/></g>`;
  const casita = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-20" y="-24" width="40" height="24" fill="${c}"/><path d="M-25 -24 L0 -44 L25 -24Z" fill="#b9503c"/><rect x="-5" y="-14" width="10" height="14" fill="#6a4a3a"/></g>`;
  const pasto = (x1, x2, y) => { let s = ''; for (let x = x1; x < x2; x += 14) s += `<path d="M${x} ${y} q3 -12 6 0 q2 -9 5 0" fill="#5cae5a"/>`; return s; };

  /* =================== MIRADOR =================== */
  function mirador(s, M) {
    const pr = M.has(s, 'prismaticos');
    const ev = id => M.hasEv(s, id);
    let g = `<rect width="${W}" height="${H}" fill="url(#d-cielo)"/>`;
    g += `<circle cx="880" cy="80" r="44" fill="#ffe08a"/><circle cx="880" cy="80" r="70" fill="url(#d-brillo)"/>`;
    g += nube(180, 70, 1) + nube(600, 50, .8, 'nube nube2');
    g += pajaro(520, 120) + pajaro(560, 104);
    /* pueblo a lo lejos (lado izquierdo, arriba) */
    g += `<path d="M0 230 Q120 200 300 214 L300 300 L0 300Z" fill="#9cc98a"/>`;
    g += casita(70, 218, .9, '#f6d6a8') + casita(130, 212, .8, '#f2b8a0') + casita(200, 216, .85, '#cfe3f5') + arbolito(250, 222, .35);
    /* barranca observada (en la otra orilla del recodo) */
    g += `<path d="M300 300 L300 214 Q360 196 430 206 L1000 196 L1000 392 L330 392 Z" fill="url(#d-barranca)"/>`;
    g += `<path d="M300 236 Q600 222 1000 220 M302 268 Q600 258 1000 254 M310 318 Q600 300 1000 300 M318 352 Q600 344 1000 340" fill="none" stroke="#8c5a35" stroke-width="3" opacity=".45"/>`;
    g += `<path d="M296 214 Q360 192 430 204 L1000 192 L1000 206 L430 216 Q360 206 300 222Z" fill="#5cae5a"/>` + pasto(300, 1000, 206);
    g += arbolito(470, 214, .62, 12) + arbolito(760, 202, .5, 0) + arbolito(930, 200, .55, -3);
    /* raíces colgando (borrosas sin prismáticos) */
    const raices = `<g class="detalle" ${pr ? '' : 'filter="url(#d-bruma)"'}><path d="M500 214 q-6 22 2 44 M512 214 q4 18 -2 40 q-2 10 4 18 M524 214 q8 26 0 52 M488 216 q-8 16 -2 34" fill="none" stroke="#5a3a22" stroke-width="3.2" stroke-linecap="round"/></g>`;
    g += raices;
    /* base con huecos */
    g += `<g class="detalle" ${pr ? '' : 'filter="url(#d-bruma)"'}><ellipse cx="610" cy="382" rx="58" ry="20" fill="#4b2f1f"/><ellipse cx="700" cy="386" rx="40" ry="14" fill="#4b2f1f"/><ellipse cx="560" cy="386" rx="28" ry="10" fill="#5a3a26"/><path d="M548 366 Q610 352 670 368" fill="none" stroke="#c8925c" stroke-width="5" opacity=".6"/></g>`;
    /* agua del río */
    g += `<path d="M0 300 L300 300 L330 392 L1000 392 L1000 452 L0 452Z" fill="url(#d-rio)"/>`;
    g += `<g class="olas"><path d="M-40 330 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 M300 410 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" fill="none" stroke="#e2c49a" stroke-width="3" opacity=".7"/><path d="M80 370 q25 -8 50 0 t50 0 t50 0 M420 432 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" fill="none" stroke="#d1ae80" stroke-width="2.5" opacity=".6"/></g>`;
    g += `<g class="flecha-agua"><path d="M960 420 L860 420 M880 410 L860 420 L880 430" fill="none" stroke="#f9f3e7" stroke-width="3" opacity=".55" stroke-linecap="round"/></g>`;
    /* terrones caídos */
    g += `<g><path d="M840 394 l18 -16 22 4 10 14z" fill="#9a6439" stroke="#6b4123" stroke-width="2"/><path d="M890 398 l12 -12 20 2 8 12z" fill="#a8703f" stroke="#6b4123" stroke-width="2"/><path d="M930 396 l10 -10 16 3 6 9z" fill="#8f5c34" stroke="#6b4123" stroke-width="2"/></g>`;
    /* mirador: baranda y deck */
    g += `<rect x="0" y="452" width="${W}" height="108" fill="url(#d-madera)"/>`;
    for (let y = 470; y < 560; y += 22) g += `<path d="M0 ${y} H${W}" stroke="#8a5a36" stroke-width="2" opacity=".5"/>`;
    for (let x = 20; x < W; x += 92) g += `<rect x="${x}" y="404" width="10" height="56" rx="3" fill="#7a4f2e"/>`;
    g += `<rect x="0" y="404" width="${W}" height="9" rx="4" fill="#8a5a36"/><rect x="0" y="428" width="${W}" height="6" rx="3" fill="#8a5a36"/>`;
    /* banco */
    g += `<g transform="translate(120 470)"><rect x="-60" y="-34" width="120" height="12" rx="5" fill="#d45d3c"/><rect x="-60" y="-58" width="120" height="10" rx="5" fill="#d45d3c"/><rect x="-52" y="-24" width="8" height="30" fill="#6a3a2a"/><rect x="44" y="-24" width="8" height="30" fill="#6a3a2a"/></g>`;
    if (!s.pictos.includes('costa')) g += tarjeta(150, 488, 14);
    /* cartel viejo */
    g += `<g transform="translate(380 464)"><rect x="-6" y="-120" width="12" height="122" fill="#6a4a3a"/><rect x="-70" y="-150" width="140" height="84" rx="6" fill="#e9e0c8" stroke="#8a7a5a" stroke-width="3"/>`;
    for (let i = 0; i < 8; i++) g += `<path d="M-60 ${-138 + i * 9} H${50 - (i % 3) * 12}" stroke="#8a7f6a" stroke-width="2.4"/>`;
    g += `</g>`;
    /* Tomás */
    const tomasE = s.a.done ? 'feliz' : (s.talked.tomas ? 'contento' : 'preocupado');
    g += pj('tomas', { x: 250, y: 510, s: .62, expr: tomasE, pose: s.a.done ? 'senala' : 'sostiene', tablero: s.a.done ? null : null });
    if (!s.a.done) g += `<g transform="translate(250 404) rotate(-6)"><rect x="-26" y="-20" width="52" height="40" rx="4" fill="#fff" stroke="#684593" stroke-width="2.5"/><path d="M-20 6 Q-6 -10 6 0 T20 -4 V14 H-20Z" fill="#c8925c"/><path d="M-20 10 H20" stroke="#5aa8d0" stroke-width="3"/></g>`;
    /* banderitas de pistas encontradas */
    if (ev('ev-costa')) g += flag(440, 300);
    if (ev('ev-agua')) g += flag(780, 448);
    if (ev('ev-caida')) g += flag(905, 396);
    if (ev('ev-hueco')) g += flag(640, 362);
    if (ev('ev-raices')) g += flag(536, 250);
    if (ev('ev-cartel')) g += flag(444, 350);
    return g;
  }

  /* =================== ESCUELA =================== */
  function escuela(s, M) {
    let g = `<rect width="${W}" height="${H}" fill="url(#d-pared)"/>`;
    g += `<rect y="0" width="${W}" height="26" fill="#e7c49c"/><rect y="440" width="${W}" height="120" fill="url(#d-baldosa)"/><rect y="432" width="${W}" height="12" fill="#c99566"/>`;
    /* banderines de la feria */
    let b = ''; const cols = ['#ff9248', '#2bb3a3', '#ffd23f', '#ff5d8f', '#684593', '#5cc06b'];
    for (let i = 0; i < 16; i++) b += `<path d="M${i * 64} 40 l32 0 l-16 30z" fill="${cols[i % 6]}"/>`;
    g += `<path d="M0 40 Q500 56 1000 40" stroke="#8a6a4a" stroke-width="2" fill="none"/>` + b;
    /* corcho */
    g += `<g transform="translate(150 230)"><rect x="-88" y="-100" width="176" height="150" rx="8" fill="#c98f5a" stroke="#8a5a36" stroke-width="6"/><rect x="-80" y="-92" width="160" height="134" fill="#d8a46c"/>`;
    if (s.d.done) {
      const seq = (s.d.slots || []).filter(Boolean);
      seq.forEach((id, i) => { const x = -66 + i * (seq.length > 3 ? 38 : 50); g += `<g transform="translate(${x} -34)"><rect x="0" y="-26" width="${seq.length > 3 ? 32 : 42}" height="54" rx="4" fill="#fff" stroke="#684593" stroke-width="2"/><circle cx="${seq.length > 3 ? 16 : 21}" cy="-24" r="4" fill="#ff5d8f"/></g>`; if (i < seq.length - 1) g += `<path d="M${x + (seq.length > 3 ? 33 : 44)} -8 h6" stroke="#684593" stroke-width="3"/>`; });
      g += `<text x="0" y="30" text-anchor="middle" font-size="15" font-weight="700" fill="#432b65">¡Ordenado!</text>`;
    } else {
      [[-50, -50, -12], [10, -60, 8], [-20, 0, 14], [40, -10, -18], [-62, 10, 5]].forEach(([x, y, r]) => { g += `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-18" y="-22" width="36" height="44" rx="4" fill="#fff" stroke="#aa8a6a" stroke-width="2"/><circle cy="-20" r="4" fill="#2bb3a3"/></g>`; });
    }
    g += `</g>`;
    /* pizarrón */
    g += `<g transform="translate(540 200)"><rect x="-170" y="-110" width="340" height="190" rx="10" fill="#2f5a4a" stroke="#8a5a36" stroke-width="8"/>
      <text x="0" y="-62" text-anchor="middle" font-size="26" font-weight="700" fill="#f9f3e7" font-family="Trebuchet MS,Verdana,sans-serif">FERIA DE CIENCIAS</text>
      <text x="0" y="-26" text-anchor="middle" font-size="19" fill="#f1cf76" font-family="Trebuchet MS,Verdana,sans-serif">«El río se lleva mi pueblo»</text>
      <path d="M-120 14 Q-60 -14 0 14 T120 14" fill="none" stroke="#9fd3ee" stroke-width="4"/><path d="M-120 40 H120" stroke="#f9f3e7" stroke-width="2" opacity=".4" stroke-dasharray="8 8"/></g>`;
    /* ventana con el río a lo lejos */
    g += `<g transform="translate(760 170)"><rect x="-70" y="-80" width="140" height="150" rx="6" fill="#bfe3f2" stroke="#fff" stroke-width="8"/><path d="M-66 20 Q0 0 66 16 V66 H-66Z" fill="#9cc98a"/><path d="M-66 44 Q0 30 66 40 V66 H-66Z" fill="#b88a5a"/><path d="M0 -80 V70 M-70 -5 H70" stroke="#fff" stroke-width="6"/>
      <rect x="-78" y="70" width="156" height="12" rx="4" fill="#e7c49c"/><g transform="translate(-36 70)"><path d="M-14 0 L-10 -22 H10 L14 0Z" fill="#d45d3c"/><path d="M0 -22 q-14 -16 -6 -34 q10 12 6 34 q8 -22 22 -26 q-6 18 -22 26" fill="#5cae5a"/></g></g>`;
    if (!s.pictos.includes('escuchar')) g += tarjeta(706, 226, -10);
    /* armario con cajón */
    g += `<g transform="translate(930 440)"><rect x="-58" y="-170" width="116" height="170" rx="6" fill="#c99566" stroke="#8a5a36" stroke-width="4"/><rect x="-50" y="-160" width="100" height="70" rx="4" fill="#d8a878"/><rect x="-50" y="-80" width="100" height="34" rx="4" fill="#d8a878" class="${M.has(s, 'tijera') ? '' : 'cajon'}"/><circle cx="0" cy="-63" r="5" fill="#6a4a3a"/><rect x="-50" y="-40" width="100" height="34" rx="4" fill="#d8a878"/><circle cx="0" cy="-23" r="5" fill="#6a4a3a"/>
      <rect x="-40" y="-150" width="16" height="50" fill="#ff9248"/><rect x="-22" y="-146" width="14" height="46" fill="#2bb3a3"/><rect x="-6" y="-152" width="18" height="52" fill="#684593"/></g>`;
    /* mesa de pistas */
    g += `<g transform="translate(400 470)"><rect x="-90" y="-46" width="180" height="16" rx="5" fill="#d8a878" stroke="#8a5a36" stroke-width="3"/><rect x="-80" y="-30" width="10" height="44" fill="#8a5a36"/><rect x="70" y="-30" width="10" height="44" fill="#8a5a36"/>
      <rect x="-60" y="-66" width="56" height="22" rx="3" fill="#fff" stroke="#684593" stroke-width="2" transform="rotate(-6)"/><rect x="6" y="-64" width="52" height="20" rx="3" fill="#ffe9a8" stroke="#c4a150" stroke-width="2" transform="rotate(5)"/>${s.b.done ? '<path d="M-20 -80 l8 8 16 -18" stroke="#2b8a5a" stroke-width="5" fill="none" stroke-linecap="round"/>' : ''}</g>`;
    /* personajes */
    const det = s.d.done;
    if (!s.b.done) g += pj('nico', { x: 280, y: 520, s: .62, expr: s.talked.nico ? 'pensando' : 'duda', pose: s.talked.nico ? 'piensa' : 'reposo' });
    if (!det) g += pj('marta', { x: 548, y: 518, s: .58, expr: s.flags.intro ? 'contento' : 'preocupado', pose: s.flags.intro ? 'explica' : 'piensa' });
    const solE = M.hiddenFound(s).length >= 3 ? 'feliz' : (s.talked.sol ? 'contento' : 'preocupado');
    if (!s.g.done) g += pj('sol', { x: 668, y: 520, s: .62, expr: solE, pose: s.talked.sol ? 'sostiene' : 'timida', tablero: s.talked.sol ? ['agua', 'rio'] : null });
    if (!det) g += pj('bruno', { x: 830, y: 516, s: .6, expr: s.talked.bruno ? 'contento' : 'neutral', pose: 'reposo' });
    if (det) g += `<g transform="translate(548 500)"><rect x="-90" y="-26" width="180" height="40" rx="10" fill="#fff" stroke="#684593" stroke-width="3"/><text x="0" y="0" text-anchor="middle" font-size="15" font-weight="700" fill="#432b65" font-family="Trebuchet MS,Verdana,sans-serif">Nos fuimos a la feria →</text></g>`;
    return g;
  }

  /* =================== LABORATORIO =================== */
  function lab(s, M) {
    let g = `<rect width="${W}" height="${H}" fill="url(#d-azulejo)"/><rect y="440" width="${W}" height="120" fill="#cfe0dc"/><rect y="432" width="${W}" height="10" fill="#8fb8b0"/>`;
    for (let x = 0; x < W; x += 60) g += `<path d="M${x} 440 L${x - 40} 560" stroke="#b6cec8" stroke-width="2"/>`;
    /* estantes con frascos */
    g += `<g transform="translate(860 150)"><rect x="-100" y="0" width="200" height="10" fill="#8a5a36"/><rect x="-100" y="90" width="200" height="10" fill="#8a5a36"/>
      ${[-80, -50, -20, 20, 56].map((x, i) => `<rect x="${x}" y="${-40 + (i % 2) * 6}" width="26" height="${40 - (i % 2) * 6}" rx="6" fill="${['#9fd3ee', '#ffd9a8', '#c7f0c0', '#f7c6d9', '#e3d6ff'][i]}" stroke="#5a6a7a" stroke-width="2"/>`).join('')}
      ${[-86, -40, 30].map((x, i) => `<rect x="${x}" y="50" width="34" height="40" rx="5" fill="${['#c8925c', '#a8703f', '#d9b48a'][i]}" stroke="#6b4123" stroke-width="2"/>`).join('')}</g>`;
    if (!s.pictos.includes('investigar')) g += tarjeta(924, 216, 8);
    /* ventana */
    g += `<g transform="translate(560 140)"><rect x="-90" y="-70" width="180" height="120" rx="6" fill="#bfe3f2" stroke="#fff" stroke-width="8"/><path d="M-86 10 Q0 -6 86 8 V46 H-86Z" fill="#9cc98a"/><path d="M0 -70 V50" stroke="#fff" stroke-width="6"/></g>`;
    /* afiche del modelo */
    g += `<g transform="translate(330 170)"><rect x="-70" y="-60" width="140" height="110" rx="6" fill="#fff" stroke="#2bb3a3" stroke-width="4"/><text x="0" y="-30" text-anchor="middle" font-size="16" font-weight="700" fill="#1e6a62" font-family="Trebuchet MS,Verdana,sans-serif">MODELO</text><text x="0" y="-10" text-anchor="middle" font-size="13" fill="#1e6a62" font-family="Trebuchet MS,Verdana,sans-serif">simplificado</text><path d="M-50 30 L-10 30 L-10 4 L0 4 L0 30 H50" fill="none" stroke="#a8703f" stroke-width="5"/><path d="M0 30 Q25 22 50 30" fill="none" stroke="#5aa8d0" stroke-width="4"/></g>`;
    /* cajonera (lupa) */
    g += `<g transform="translate(140 440)"><rect x="-70" y="-110" width="140" height="110" rx="6" fill="#9fc2bb" stroke="#5a8a80" stroke-width="4"/>${[0, 1, 2].map(i => `<rect x="-60" y="${-100 + i * 34}" width="120" height="28" rx="4" fill="#c4dfd9"/><rect x="-14" y="${-90 + i * 34}" width="28" height="7" rx="3" fill="#5a8a80"/>`).join('')}${M.has(s, 'lupa') ? '' : '<g class="brillito"><circle cx="40" cy="-78" r="8" fill="#fff7c2"/></g>'}</g>`;
    /* mesa con la maqueta */
    g += `<g transform="translate(580 440)"><rect x="-170" y="-80" width="340" height="16" rx="5" fill="#e8eef0" stroke="#5a6a7a" stroke-width="3"/><rect x="-156" y="-64" width="12" height="70" fill="#5a6a7a"/><rect x="144" y="-64" width="12" height="70" fill="#5a6a7a"/>
      <g transform="translate(-140 -170) scale(.47)">${maquetaInner(s.c.sim, { mini: true })}</g></g>`;
    if (!s.b.done) g += `<g transform="translate(580 320)"><rect x="-120" y="-24" width="240" height="38" rx="10" fill="#fff" stroke="#2bb3a3" stroke-width="3"/><text x="0" y="2" text-anchor="middle" font-size="15" font-weight="700" fill="#1e6a62" font-family="Trebuchet MS,Verdana,sans-serif">Maqueta en preparación</text></g>`;
    /* personajes */
    g += pj('profe', { x: 330, y: 520, s: .55, expr: s.c.done ? 'feliz' : 'contento', pose: s.b.done ? 'explica' : 'reposo' });
    if (s.b.done && !s.c.done) g += pj('nico', { x: 780, y: 520, s: .62, expr: s.c.obs.golpe ? 'feliz' : 'pensando', pose: s.c.obs.golpe ? 'festeja' : 'piensa' });
    return g;
  }

  /* =================== FERIA =================== */
  function feria(s, M) {
    const fin = s.g.done;
    let g = `<rect width="${W}" height="${H}" fill="${fin ? '#fff3d6' : '#f6e6cf'}"/><rect y="440" width="${W}" height="120" fill="#e2c49c"/><rect y="432" width="${W}" height="10" fill="#b8875a"/>`;
    for (let x = 0; x < W; x += 80) g += `<rect x="${x}" y="440" width="40" height="120" fill="#d8b68c" opacity=".5"/>`;
    /* telón */
    g += `<path d="M900 0 H1000 V440 H930 Q900 300 920 160 Q900 80 900 0Z" fill="#b0304a"/><path d="M920 0 Q940 200 930 440" stroke="#8a2038" stroke-width="5" fill="none"/>`;
    if (!s.pictos.includes('comunicar')) g += tarjeta(930, 420, -8);
    /* banderines */
    let b = ''; const cols = ['#ff9248', '#2bb3a3', '#ffd23f', '#ff5d8f', '#684593', '#5cc06b'];
    for (let i = 0; i < 15; i++) b += `<path d="M${i * 62} 30 l31 0 l-15 30z" fill="${cols[(i + 2) % 6]}"/>`;
    g += `<path d="M0 30 Q450 48 900 30" stroke="#8a6a4a" stroke-width="2" fill="none"/>` + b;
    if (s.f.done || fin) { for (let i = 0; i < 18; i++) g += `<circle class="luz" cx="${30 + i * 50}" cy="${86 + Math.sin(i) * 8}" r="7" fill="${cols[i % 6]}"/>`; g += `<path d="M10 86 Q450 100 900 86" stroke="#6a4a3a" stroke-width="1.5" fill="none"/>`; }
    /* stands de otros grupos */
    g += `<g transform="translate(130 300)" opacity=".85"><rect x="-90" y="-90" width="180" height="120" rx="8" fill="#cfe3f5" stroke="#5a7aa0" stroke-width="4"/><circle cx="-30" cy="-30" r="26" fill="#ffd23f"/><circle cx="34" cy="-20" r="14" fill="#ff9248"/><circle cx="60" cy="-54" r="8" fill="#9a8ad0"/><text x="0" y="22" text-anchor="middle" font-size="16" font-weight="700" fill="#2f4a70" font-family="Trebuchet MS,Verdana,sans-serif">Los planetas</text></g>`;
    /* cartel del ensayo (solo texto) */
    g += `<g transform="translate(240 460)"><path d="M-40 0 L-6 -170 M40 0 L6 -170 M0 -170 V0" stroke="#6a4a3a" stroke-width="6"/><rect x="-58" y="-200" width="116" height="140" rx="4" fill="#fff" stroke="#8a7a5a" stroke-width="3"/>`;
    for (let i = 0; i < 13; i++) g += `<path d="M-48 ${-188 + i * 10} H${44 - (i % 4) * 8}" stroke="#9a9080" stroke-width="2.4"/>`;
    g += `</g>`;
    /* nuestro stand */
    g += `<g transform="translate(520 440)"><rect x="-130" y="-70" width="260" height="70" rx="6" fill="#684593"/><rect x="-130" y="-78" width="260" height="14" rx="5" fill="#8a64b8"/><text x="0" y="-26" text-anchor="middle" font-size="17" font-weight="700" fill="#fff" font-family="Trebuchet MS,Verdana,sans-serif">El río se lleva mi pueblo</text>`;
    g += `<rect x="-110" y="-300" width="220" height="218" rx="8" fill="#fffdf9" stroke="#432b65" stroke-width="5"/>`;
    if (s.e.done) g += miniPoster(s, M, -100, -290, 200, 196);
    else g += `<g><rect x="-78" y="-250" width="60" height="44" fill="#fff" stroke="#bbb" transform="rotate(-14)"/><rect x="10" y="-230" width="56" height="40" fill="#ffe9a8" stroke="#c4a150" transform="rotate(10)"/><rect x="-40" y="-170" width="70" height="40" fill="#cfe9f5" stroke="#7ab" transform="rotate(4)"/><text x="0" y="-112" text-anchor="middle" font-size="15" fill="#7a5a8a" font-family="Trebuchet MS,Verdana,sans-serif">¡Todo mezclado!</text></g>`;
    g += `</g>`;
    if (!s.e.done) g += `<g><rect x="430" y="470" width="40" height="30" fill="#fff" stroke="#bbb" transform="rotate(20 450 485)"/><rect x="590" y="480" width="44" height="30" fill="#cfe9f5" stroke="#7ab" transform="rotate(-16 610 495)"/></g>`;
    if (s.g.done) g += `<g transform="translate(700 260)"><rect x="-40" y="-90" width="80" height="170" rx="6" fill="#fff" stroke="#2bb3a3" stroke-width="4"/>${(s.g.slots || []).slice(0, 4).map((q, i) => `<rect x="-30" y="${-80 + i * 40}" width="60" height="32" rx="4" fill="#e9f7f4"/><text x="-22" y="${-58 + i * 40}" font-size="16" font-weight="700" fill="#1e6a62">${i + 1}</text>`).join('')}</g>`;
    /* personajes */
    const det = s.d.done;
    if (det) g += pj('marta', { x: 110, y: 520, s: .58, expr: fin ? 'feliz' : 'contento', pose: fin ? 'festeja' : 'explica' });
    if (det) g += `<g transform="translate(345 470)"><rect x="-30" y="-50" width="60" height="50" rx="6" fill="#3a3550"/><circle cx="0" cy="-30" r="14" fill="#5a5570"/><circle cx="0" cy="-30" r="6" fill="#2a2540"/></g>` + pj('bruno', { x: 345, y: 528, s: .58, expr: M.has(s, 'grabadora') ? 'feliz' : 'contento', pose: M.has(s, 'grabadora') ? 'saluda' : 'reposo' });
    if (s.c.done) g += pj('nico', { x: 640, y: 530, s: .56, expr: 'feliz', pose: 'saluda' });
    if (fin) g += pj('sol', { x: 420, y: 535, s: .56, expr: 'feliz', pose: 'festeja' }) + pj('tomas', { x: 870, y: 540, s: .54, expr: 'feliz', pose: 'festeja' });
    /* visitantes */
    const ev = s.f.last == null ? null : M.evaluate(s);
    const ex = id => { if (!ev) return 'contento'; const v = ev.visitors.find(q => q.id === id); return v ? (v.ok ? 'feliz' : 'duda') : 'contento'; };
    const vs = M.visitorsFor(s);
    const pos = { juli: [740, .48], lucas: [800, .58], rosa: [870, .56], mati: [690, .54] };
    vs.slice().sort((a, b) => pos[a][0] - pos[b][0]).forEach(id => { const okv = ev && ex(id) === 'feliz'; g += pj(id, { x: pos[id][0], y: 524, s: pos[id][1], expr: ex(id), pose: okv ? (id === 'juli' ? 'festeja' : 'saluda') : (ev ? 'piensa' : 'reposo'), flip: true }); });
    if (fin) for (let i = 0; i < 40; i++) g += `<rect class="confeti" x="${(i * 97) % 1000}" y="${(i * 53) % 220 + 20}" width="9" height="14" fill="${cols[i % 6]}" transform="rotate(${i * 37} ${(i * 97) % 1000} ${(i * 53) % 220 + 20})" style="animation-delay:${(i % 10) * .3}s"/>`;
    return g;
  }

  /* cartel en miniatura (para la escena) */
  function miniPoster(s, M, x, y, w, h) {
    const used = M.usedPanels(s); const n = Math.max(1, used.length);
    let g = `<g transform="translate(${x} ${y})"><text x="${w / 2}" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#432b65" font-family="Trebuchet MS,Verdana,sans-serif">${C.esc(s.poster.title ? M.TITLES[s.poster.title].t : '')}</text>`;
    const cw = (w - 10) / Math.min(n, 3), rows = Math.ceil(n / 3), ch = (h - 40 - (s.poster.audio ? 20 : 0)) / rows;
    used.forEach((q, k) => {
      const cx = 5 + (k % 3) * cw, cy = 30 + Math.floor(k / 3) * ch;
      g += `<rect x="${cx + 2}" y="${cy + 2}" width="${cw - 4}" height="${ch - 4}" rx="4" fill="#f4eefb" stroke="#684593" stroke-width="1.5"/>`;
      if (q.p.img) g += imgTag(q.p.img, cx + cw / 2 - Math.min(cw, ch) * .3, cy + 6, Math.min(cw, ch) * .6);
      if (q.p.phrase) g += `<rect x="${cx + 8}" y="${cy + ch - 18}" width="${cw - 16}" height="5" rx="2" fill="#684593" opacity=".6"/>`;
    });
    if (s.poster.audio) g += `<g transform="translate(${w / 2} ${h - 10})"><circle r="9" fill="#2bb3a3"/><path d="M-3 -4 L1 -4 L5 -8 V8 L1 4 L-3 4Z" fill="#fff"/></g>`;
    return g + '</g>';
  }
  function imgHref(img) {
    const [t, id] = (img || '').split(':');
    if (t === 'p') return (window.BJ_PICTOS || {})[id] || '';
    if (t === 'i') return svgURL(ilu(id));
    return '';
  }
  function imgTag(img, x, y, w) { return `<image href="${imgHref(img)}" x="${x}" y="${y}" width="${w}" height="${w}" preserveAspectRatio="xMidYMid meet"/>`; }
  function svgURL(svg) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }

  /* =================== ILUSTRACIONES (240x180) =================== */
  const banco = (edge, top) => `<path d="M0 ${top} L${edge} ${top} L${edge + 10} 150 L0 150Z" fill="url(#i-tierra)"/><path d="M0 ${top - 6} L${edge + 4} ${top - 6} L${edge + 4} ${top + 4} L0 ${top + 4}Z" fill="#5cae5a"/>`;
  const idefs = `<defs><linearGradient id="i-tierra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8925c"/><stop offset="1" stop-color="#8a5a35"/></linearGradient><linearGradient id="i-agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc0dc"/><stop offset="1" stop-color="#4a8fb0"/></linearGradient></defs>`;
  const agua = (x, turbia) => `<path d="M${x} 118 Q${x + 40} 112 ${x + 80} 118 T240 118 V180 H${x}Z" fill="${turbia ? '#a88458' : 'url(#i-agua)'}"/><path d="M${x + 10} 132 q12 -6 24 0 t24 0 t24 0 t24 0" fill="none" stroke="#fff" stroke-width="2.5" opacity=".6"/>`;
  const base = (x) => `<path d="M0 150 H240 V180 H0Z" fill="#6b4a32"/>`;
  function ilu(id) {
    let g = '';
    switch (id) {
      case 'golpe':
        g = `<rect width="240" height="180" fill="#e9f6f4"/>` + banco(110, 50) + agua(110, true) + base() +
          `<path d="M206 124 H140 M156 112 L136 124 L156 136" fill="none" stroke="#432b65" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M200 150 H150 M164 140 L146 150 L164 160" fill="none" stroke="#432b65" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/><circle cx="122" cy="128" r="7" fill="#fff" opacity=".8"/>`;
        break;
      case 'hueco':
        g = `<rect width="240" height="180" fill="#e9f6f4"/>` + `<path d="M0 50 L116 50 L120 104 Q92 110 90 126 Q94 142 122 146 L124 150 L0 150Z" fill="url(#i-tierra)"/><path d="M0 44 L120 44 L120 54 L0 54Z" fill="#5cae5a"/>` + agua(120, true) + base() +
          `<path d="M120 104 Q92 110 90 126 Q94 142 122 146" fill="#4b2f1f"/><circle cx="104" cy="126" r="16" fill="none" stroke="#f1cf76" stroke-width="4" stroke-dasharray="6 5"/>`;
        break;
      case 'cae':
        g = `<rect width="240" height="180" fill="#e9f6f4"/>` + `<path d="M0 50 L84 50 L88 150 L0 150Z" fill="url(#i-tierra)"/><path d="M0 44 L84 44 L84 54 L0 54Z" fill="#5cae5a"/>` + agua(88, true) + base() +
          `<g transform="translate(118 96) rotate(24)"><path d="M-20 -30 H22 L26 30 H-18Z" fill="#a8703f" stroke="#6b4123" stroke-width="3"/><path d="M-20 -30 H22 V-22 H-20Z" fill="#5cae5a"/></g><path d="M150 70 q8 10 0 20 M160 60 q10 14 0 28" fill="none" stroke="#432b65" stroke-width="3" stroke-linecap="round"/><path d="M104 130 q10 -16 20 0 q10 -16 20 0" fill="none" stroke="#fff" stroke-width="3"/>`;
        break;
      case 'orilla':
        g = `<rect width="240" height="180" fill="#e9f6f4"/>` + banco(96, 56) + agua(100, false) + base() +
          `<path d="M96 56 L150 56 L156 150" fill="none" stroke="#684593" stroke-width="4" stroke-dasharray="9 7"/><path d="M150 40 H104 M116 30 L102 40 L116 50" fill="none" stroke="#684593" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><text x="152" y="34" font-size="13" font-weight="700" fill="#684593" font-family="Trebuchet MS,Verdana,sans-serif">antes</text>`;
        break;
      case 'maqueta':
        g = `<rect width="240" height="180" fill="#f4f7f8"/><rect x="20" y="70" width="200" height="90" rx="6" fill="#dff1f6" stroke="#5a6a7a" stroke-width="4"/><path d="M24 90 L110 90 L118 156 L24 156Z" fill="url(#i-tierra)"/><path d="M118 132 H216 V156 H118Z" fill="#a88458"/>
          <g transform="translate(186 50) rotate(-30)"><path d="M-18 -26 H18 L14 26 H-14Z" fill="#9fd3ee" stroke="#4a7aa0" stroke-width="3"/><path d="M18 -14 q12 4 8 18" fill="none" stroke="#4a7aa0" stroke-width="3"/></g><path d="M168 74 Q160 100 150 130" stroke="#7cc0dc" stroke-width="6" fill="none" stroke-linecap="round"/><text x="120" y="30" text-anchor="middle" font-size="14" font-weight="700" fill="#1e6a62" font-family="Trebuchet MS,Verdana,sans-serif">MODELO</text>`;
        break;
      case 'borde':
        g = `<rect width="240" height="180" fill="#e9f6f4"/>` + banco(130, 70) + agua(140, true) + base() +
          `<path d="M120 72 q-6 22 2 40 M128 72 q6 18 0 34 M112 74 q-8 14 -2 28" fill="none" stroke="#5a3a22" stroke-width="3" stroke-linecap="round"/>
          <g transform="translate(56 62)"><rect x="-3" y="-2" width="6" height="40" fill="#6a4a3a" transform="translate(0 -36)"/><path d="M0 -62 L24 -22 H-24Z" fill="#ffd23f" stroke="#a07a10" stroke-width="3" stroke-linejoin="round"/><path d="M0 -50 V-34 M0 -29 V-27" stroke="#432b65" stroke-width="5" stroke-linecap="round"/></g>`;
        break;
      default: g = `<rect width="240" height="180" fill="#eee"/>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" role="img">${idefs}${g}</svg>`;
  }

  /* =================== COMPARAR (600x340) =================== */
  function compare(which) {
    const ahora = which === 'ahora';
    const edge = ahora ? 300 : 360, foot = ahora ? 330 : 382;
    let g = `<rect width="600" height="340" fill="${ahora ? '#bfe3f2' : '#cfe8f2'}"/>`;
    g += ahora ? nube(480, 45, .7) : nube(400, 60, .55) + nube(540, 36, .45);
    g += ahora ? `<path d="M68 78 q6 -8 12 0 q6 -8 12 0" fill="none" stroke="#4a3a5a" stroke-width="3"/>` : `<g transform="translate(80 86)"><ellipse rx="9" ry="6" fill="#d45d3c"/><circle cx="7" cy="-5" r="4" fill="#d45d3c"/><path d="M11 -5 l5 1 -5 2z" fill="#f1cf76"/></g>`;
    /* tierra */
    const hx = ahora ? 52 : 18;
    g += `<path d="M0 100 L${edge} 100 L${edge + 8} 120 L${edge + 20} 226 Q${edge + 20 - hx} ${238} ${edge + 20 - hx} 254 Q${edge + 20 - hx} 268 ${foot} 272 L${foot} 340 L0 340Z" fill="url(#i-tierra)"/>`;
    g += `<path d="M${edge + 20} 226 Q${edge + 20 - hx} 238 ${edge + 20 - hx} 254 Q${edge + 20 - hx} 268 ${foot} 272 Z" fill="#4b2f1f"/>`;
    g += `<path d="M0 150 Q${edge / 2} 144 ${edge + 10} 150 M0 200 Q${edge / 2} 194 ${edge + 16} 198" stroke="#8c5a35" stroke-width="3" opacity=".4" fill="none"/>`;
    g += `<path d="M0 92 L${edge + 6} 92 L${edge + 10} 106 L0 106Z" fill="#5cae5a"/>` + (() => { let s = ''; for (let x = 0; x < edge; x += 14) s += `<path d="M${x} 92 q3 -10 6 0 q2 -8 5 0" fill="#5cae5a"/>`; return s; })();
    if (ahora) g += `<path d="M304 104 q-4 20 4 36 M314 104 q6 18 -2 34 q-2 8 4 14 M322 104 q8 22 0 42" fill="none" stroke="#5a3a22" stroke-width="3" stroke-linecap="round"/>`;
    g += arbolito(200, 96, .52, ahora ? 14 : 0);
    /* agua */
    g += `<path d="M${foot} 272 L600 272 L600 340 L${foot} 340Z" fill="#8fa9a8"/><path d="M${foot} 272 L600 272 L600 340 L${foot} 340Z" fill="#9f7a52" opacity=".55"/>`;
    g += `<path d="M${foot + 20} 300 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#fff" stroke-width="2.5" opacity=".6"/>`;
    if (ahora) g += `<path d="M370 284 l14 -14 18 3 9 13z" fill="#9a6439" stroke="#6b4123" stroke-width="2"/><path d="M398 292 l10 -12 18 2 8 10z" fill="#a8703f" stroke="#6b4123" stroke-width="2"/>`;
    if (!ahora) g += `<g transform="translate(520 262)"><path d="M-34 0 H34 L24 14 H-24Z" fill="#d45d3c"/><path d="M0 0 V-34 L22 -6Z" fill="#fff"/></g>`;
    g += `<text x="14" y="30" font-size="22" font-weight="700" fill="#432b65" font-family="Trebuchet MS,Verdana,sans-serif">${ahora ? 'AHORA' : 'ANTES'}</text>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" role="img" aria-label="Ilustración de la costa: ${ahora ? 'ahora' : 'antes'}">${defsGlobales()}${idefs}${g}</svg>`;
  }

  /* =================== MAQUETA (600x360) =================== */
  function maquetaGeom(sim) {
    const bankX = 300 - Math.min(sim.caidos, 3) * 46;
    return { bankX, hueco: sim.hueco };
  }
  function maquetaZones(sim) {
    const { bankX } = maquetaGeom(sim);
    return [
      { id: 'arriba', x: bankX - 60, y: 130, r: 46, lab: 'La parte de arriba' },
      { id: 'medio', x: bankX - 40, y: 200, r: 36, lab: 'El medio' },
      { id: 'base', x: bankX - 14, y: 268, r: 38, lab: 'La base' },
      { id: 'agua', x: bankX + 150, y: 290, r: 52, lab: 'El agua' }
    ];
  }
  function maquetaInner(sim, o) {
    o = o || {};
    const { bankX, hueco } = maquetaGeom(sim);
    const turb = sim.pours > 0;
    const d = hueco * 22;
    let g = `<rect x="20" y="60" width="560" height="280" rx="14" fill="#e3f4f8" stroke="#5a6a7a" stroke-width="6"/>`;
    g += `<path d="M28 116 L${bankX} 116 L${bankX + 6} 240 Q${bankX - d} 246 ${bankX - d} 268 Q${bankX - d} 292 ${bankX + 12} 300 L${bankX + 12} 332 L28 332Z" fill="#b07a48" stroke="#7a4f2e" stroke-width="3"/>`;
    g += `<path d="M28 108 L${bankX + 2} 108 L${bankX + 2} 120 L28 120Z" fill="#6cb064"/>`;
    for (let i = 0; i < 14; i++) g += `<circle cx="${40 + (i * 37) % Math.max(40, bankX - 40)}" cy="${150 + (i * 53) % 150}" r="3" fill="#8a5a35" opacity=".5"/>`;
    if (d > 0) g += `<path d="M${bankX + 6} 240 Q${bankX - d} 246 ${bankX - d} 268 Q${bankX - d} 292 ${bankX + 12} 300Z" fill="#5a3a26"/>`;
    /* terrones caídos */
    for (let k = 0; k < Math.min(sim.caidos, 3); k++) { const cx = 300 - k * 46 + 30; g += `<path d="M${cx - 18} 330 l8 -22 26 -4 12 26z" fill="#9a6439" stroke="#6b4123" stroke-width="2.5"/>`; }
    if (o.falling) g += `<g class="cayendo"><path d="M${bankX + 46 - 46} 116 L${bankX + 46} 116 L${bankX + 52} 240 L${bankX} 240Z" fill="#b07a48" stroke="#7a4f2e" stroke-width="3"/><path d="M${bankX} 108 L${bankX + 48} 108 L${bankX + 48} 120 L${bankX} 120Z" fill="#6cb064"/></g>`;
    /* agua */
    g += `<path d="M${bankX + 12} 262 Q${bankX + 140} 252 572 262 L572 332 L${bankX + 12} 332Z" fill="${turb ? '#a98a5e' : '#8cc8de'}" opacity=".92"/>`;
    g += `<path class="olas" d="M${bankX + 30} 284 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`;
    if (!o.mini) {
      /* jarra */
      const big = sim.caudal === 'mucho';
      g += `<g class="jarra ${o.pouring ? 'vierte' : ''}" transform="translate(500 120)"><path d="M-30 -40 H30 L24 40 H-24Z" fill="#cfe9f5" stroke="#4a7aa0" stroke-width="4"/><path d="M-26 ${big ? -24 : 0} H26 L24 40 H-24Z" fill="#8cc8de"/><path d="M30 -26 q22 8 14 34 q-4 6 -12 2" fill="none" stroke="#4a7aa0" stroke-width="5"/><text x="0" y="66" text-anchor="middle" font-size="16" font-weight="700" fill="#2f5a7a" font-family="Trebuchet MS,Verdana,sans-serif">${big ? 'MUCHA AGUA' : 'POCA AGUA'}</text></g>`;
      if (o.pouring) g += `<path class="chorro" d="M470 150 Q420 220 ${bankX + 40} 270" fill="none" stroke="#7cc0dc" stroke-width="${sim.caudal === 'mucho' ? 16 : 8}" stroke-linecap="round" opacity=".9"/>`;
      if (o.marks) o.marks.forEach(m => { g += `<circle cx="${m.x}" cy="${m.y}" r="${m.r}" fill="none" stroke="${m.c || '#f1cf76'}" stroke-width="5" stroke-dasharray="${m.dash ? '8 6' : ''}"/>`; });
      if (o.lupa) g += `<g transform="translate(${bankX + 120} 292)"><circle r="48" fill="#fff" opacity=".85" stroke="#432b65" stroke-width="6"/>${[...Array(16)].map((_, i) => `<circle cx="${Math.cos(i * 2.4) * 30}" cy="${Math.sin(i * 1.7) * 28}" r="${2.5 + (i % 3)}" fill="#8a5a35"/>`).join('')}<path d="M34 34 L62 62" stroke="#432b65" stroke-width="12" stroke-linecap="round"/></g>`;
      g += `<text x="34" y="92" font-size="16" font-weight="700" fill="#1e6a62" font-family="Trebuchet MS,Verdana,sans-serif">Maqueta: modelo simplificado</text>`;
    }
    return g;
  }
  function maqueta(sim, o) { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" role="img" aria-label="Maqueta de una costa con agua">${maquetaInner(sim, o)}</svg>`; }

  /* =================== PERSONAJES =================== */
  function avatar(name, o) {
    o = o || {};
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -430 240 450" aria-hidden="true" focusable="false">${defsGlobales()}${chico(name, { expr: o.expr || 'contento', pose: o.pose || 'reposo' })}</svg>`;
  }
  function portrait(name, expr) {
    const p = C.CAST[name] || {}, big = p.adulta || p.teen;
    let s = retrato(name, expr).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace('aria-hidden="true" focusable="false">', 'aria-hidden="true" focusable="false">' + defsGlobales());
    if (big) s = s.replace('viewBox="-80 -400 160 170"', 'viewBox="-88 -448 176 186"').replace(/<circle cx="0" cy="-316" r="80"/, '<circle cx="0" cy="-355" r="88"');
    return s;
  }

  function scene(area, s, M) {
    const f = { mirador, escuela, lab, feria }[area] || escuela;
    return `<svg class="scene-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${defsGlobales()}${defsLocales()}${idefs}${f(s, M)}</svg>`;
  }

  window.BJD = { W, H, scene, ilu, compare, maqueta, maquetaZones, avatar, portrait, imgHref, svgURL, P };
})();
