/* El mensaje perdido del Bermejo · modelo de juego (sin DOM).
   Se usa en el navegador (window.BJM) y en Node (tests.cjs).
   Personajes, diálogos e ilustraciones son inventados para el juego:
   no contienen datos ni resultados reales de la investigación escolar. */
(function (root) {
  'use strict';

  const VERSION = 3;
  const KEY = 'bermejo-mensaje-v3';
  const OLD_KEYS = ['bermejo-aventura-v2'];

  const AREAS = ['mirador', 'escuela', 'lab', 'feria'];
  const AREA_NAME = { mirador: 'Mirador del río', escuela: 'Escuela 479', lab: 'Laboratorio', feria: 'Feria de ciencias' };

  const MODES = {
    acomp: {
      name: 'Exploración acompañada',
      desc: 'Menos cosas a la vez, consignas cortas y apoyos frecuentes.',
      evNeed: 3, aNeed: 3, panels: 4, dSlots: 3, gSlots: 3, markers: true, autoHelp: true
    },
    detective: {
      name: 'Modo detective',
      desc: 'Más pistas para relacionar, menos ayudas al comienzo y decisiones más complejas.',
      evNeed: 5, aNeed: 5, panels: 5, dSlots: 4, gSlots: 4, markers: false, autoHelp: false
    }
  };

  const ITEMS = {
    cuaderno: { n: 'Cuaderno de evidencias', d: 'Para anotar lo que observamos, lo que probamos y lo que nos cuentan.' },
    prismaticos: { n: 'Prismáticos', d: 'Sirven para mirar de cerca algo que está lejos.' },
    lupa: { n: 'Lupa', d: 'Sirve para ver detalles pequeños.' },
    tijera: { n: 'Tijera de papel', d: 'Sirve para dividir un texto largo en partes cortas.' },
    marcador: { n: 'Marcador', d: 'Sirve para escribir una palabra junto a un pictograma.' },
    grabadora: { n: 'Grabadora', d: 'Sirve para agregar una versión en audio al cartel.' }
  };

  /* Pictogramas ARASAAC disponibles en el juego */
  const PICTOS = {
    agua: 'agua', rio: 'río', costa: 'costa', tierra: 'tierra', arbol: 'árbol', familia: 'familia',
    comunicar: 'comunicar', escuchar: 'escuchar', leer: 'leer', investigar: 'investigar'
  };
  const SOL_BOX = ['agua', 'rio', 'tierra', 'arbol', 'familia', 'leer'];
  const HIDDEN_PICTOS = {
    costa: { area: 'mirador', where: 'debajo del banco del mirador' },
    escuchar: { area: 'escuela', where: 'detrás de la maceta del aula' },
    investigar: { area: 'lab', where: 'en el estante del laboratorio' },
    comunicar: { area: 'feria', where: 'detrás del telón de la feria' }
  };

  /* Ilustraciones creadas para el juego (no son fotos reales) */
  const ILUS = {
    golpe: { n: 'El agua llega a la base', topics: ['golpe', 'agua'] },
    hueco: { n: 'Base con hueco', topics: ['hueco'] },
    cae: { n: 'Tierra que se desprende', topics: ['cae'] },
    orilla: { n: 'La costa queda más atrás', topics: ['orilla'] },
    maqueta: { n: 'La maqueta del laboratorio', topics: ['modelo'] },
    borde: { n: 'Borde de la barranca', topics: ['cuidado', 'costa'] }
  };

  /* Evidencias del cuaderno */
  const EV = {
    'ev-costa': { kind: 'obs', place: 'mirador', t: 'La costa es alta y empinada, como una pared de tierra.', img: 'p:costa' },
    'ev-agua': { kind: 'obs', place: 'mirador', t: 'El agua se mueve y llega hasta la base de la costa. Tiene color marrón.', img: 'i:golpe' },
    'ev-caida': { kind: 'obs', place: 'mirador', t: 'En la orilla hay terrones de tierra caída.', img: 'i:cae' },
    'ev-hueco': { kind: 'obs', place: 'mirador', t: 'Con los prismáticos: en la base hay huecos, como cuevitas.', img: 'i:hueco', tool: 'prismaticos' },
    'ev-raices': { kind: 'obs', place: 'mirador', t: 'Con los prismáticos: arriba hay raíces que quedaron colgando en el aire.', img: 'i:borde', tool: 'prismaticos' },
    'ev-antes': { kind: 'obs', place: 'mirador', t: 'Al comparar las dos ilustraciones de Tomás, en la de “ahora” el borde está más cerca del árbol.', img: 'i:orilla' },
    'ev-cartel': { kind: 'idea', place: 'mirador', t: 'El cartel viejo del mirador tiene mucho texto y letras chicas: de lejos cuesta entenderlo.', img: 'p:leer' },
    'ev-ensayo': { kind: 'idea', place: 'feria', t: 'El cartel del ensayo tenía solo texto, todo junto. Algunas personas no lo pudieron usar.', img: 'p:leer' },
    'p-marta': { kind: 'dicho', place: 'escuela', who: 'marta', t: 'Seño Marta: «Si damos la información de una sola manera, dejamos gente afuera. Combinemos imagen, palabra y audio».', img: 'p:comunicar' },
    'p-tomas': { kind: 'dicho', place: 'mirador', who: 'tomas', t: 'Tomás: «Dibujé la misma costa en dos momentos distintos para poder comparar».', img: 'p:investigar' },
    'p-sol': { kind: 'dicho', place: 'escuela', who: 'sol', t: 'Sol: «Un pictograma solo puede entenderse de varias maneras. Una palabra al lado ayuda».', img: 'p:comunicar' },
    'p-bruno': { kind: 'dicho', place: 'escuela', who: 'bruno', t: 'Bruno: «Las frases cortas se escuchan y se recuerdan mejor».', img: 'p:escuchar' },
    'p-nico': { kind: 'dicho', place: 'escuela', who: 'nico', t: 'Nico: «Para mí, la tierra se cayó porque pasó un camión».', img: 'p:tierra' },
    'p-daniel': { kind: 'dicho', place: 'lab', who: 'profe', t: 'Profe Daniel: «Una maqueta es un modelo simplificado. Ayuda a pensar, pero no es el río real».', img: 'p:investigar' },
    'm-base': { kind: 'modelo', place: 'lab', t: 'En la maqueta, el agua gastó primero la base.', img: 'i:hueco' },
    'm-cae': { kind: 'modelo', place: 'lab', t: 'En la maqueta, cuando la base quedó hueca, la parte de arriba se desprendió.', img: 'i:cae' },
    'm-caudal': { kind: 'modelo', place: 'lab', t: 'En la maqueta, con más agua por vez el cambio llegó más rápido.', img: 'i:golpe' },
    'm-marron': { kind: 'modelo', place: 'lab', t: 'Con la lupa: el agua de la maqueta se puso marrón porque arrastraba granitos de tierra.', img: 'p:investigar' },
    'm-golpe': { kind: 'modelo', place: 'lab', t: 'En la maqueta, golpear la mesa sin agua casi no movió la tierra. (Eso no explica todo lo que pasa en un río real).', img: 'i:maqueta' }
  };
  const MIRADOR_EV = ['ev-costa', 'ev-agua', 'ev-caida', 'ev-hueco', 'ev-raices'];

  /* A · Observar y comparar: zonas sobre las ilustraciones (viewBox 600x340) */
  const ZONES = [
    { id: 'borde', x: 300, y: 96, r: 48, rel: true, lab: 'El borde de arriba', ok: 'El borde de la costa ahora está más cerca del árbol: falta un pedazo de tierra.' },
    { id: 'hueco', x: 305, y: 250, r: 42, rel: true, lab: 'La base de la costa', ok: 'En la base el hueco es más grande y más profundo.' },
    { id: 'terrones', x: 392, y: 292, r: 40, rel: true, lab: 'La orilla del agua', ok: 'Ahora hay terrones de tierra caída en la orilla.' },
    { id: 'raices', x: 314, y: 142, r: 28, rel: true, lab: 'Debajo del pasto', ok: 'Se ven raíces colgando: la tierra que las cubría ya no está.' },
    { id: 'arbol', x: 200, y: 58, r: 42, rel: true, lab: 'El árbol', ok: 'El árbol está más inclinado hacia el río.' },
    { id: 'nube', x: 480, y: 45, r: 46, rel: false, lab: 'El cielo', no: 'Las nubes sí cambiaron, pero cambian todos los días: no nos cuentan nada de la costa.' },
    { id: 'bote', x: 520, y: 240, r: 40, rel: false, lab: 'El río a lo lejos', no: 'El bote estaba de paso. Es un cambio, pero no es un cambio de la costa.' },
    { id: 'pajaro', x: 80, y: 78, r: 32, rel: false, lab: 'El pasto de la izquierda', no: 'Hay un pájaro distinto, pero eso no cambia la costa.' }
  ];

  /* B · Observación o suposición */
  const STATEMENTS = [
    { id: 's1', t: 'En la base de la costa hay huecos.', k: 'obs' },
    { id: 's2', t: 'Hay terrones de tierra en la orilla.', k: 'obs' },
    { id: 's3', t: 'La tierra se cayó porque pasó un camión.', k: 'sup' },
    { id: 's4', t: 'El agua del río está marrón.', k: 'obs' },
    { id: 's5', t: 'El agua está marrón porque lleva tierra.', k: 'sup', det: true },
    { id: 's6', t: 'Arriba hay raíces colgando.', k: 'obs', det: true },
    { id: 's7', t: 'Seguro que mañana se cae otro pedazo.', k: 'sup', det: true },
    { id: 's8', t: 'En la ilustración de “ahora”, el borde está más cerca del árbol.', k: 'obs', det: true }
  ];
  const B_FEED = {
    obs: 'Esto se puede ver con los ojos (en la costa o en la ilustración). Es una observación.',
    sup: '¿Alguien lo vio pasar? Es una idea para explicar lo que vemos: una suposición. Se puede intentar comprobar.'
  };

  /* D · Tarjetas para ordenar la explicación */
  const CARDS = {
    rio: { img: 'p:rio', t: 'El río', role: 'ctx' },
    golpe: { img: 'i:golpe', t: 'El agua llega y golpea la base', role: 1 },
    agua: { img: 'p:agua', t: 'Agua', role: 1, note: 'Vale como primer paso, pero este pictograma muestra una canilla: en el cartel conviene aclarar que es el agua del río.' },
    hueco: { img: 'i:hueco', t: 'La base se gasta y queda un hueco', role: 2 },
    cae: { img: 'i:cae', t: 'La tierra de arriba se desprende', role: 3 },
    orilla: { img: 'i:orilla', t: 'La costa queda más atrás', role: 4 },
    arbol: { img: 'p:arbol', t: 'Un árbol', role: 'x', why: 'El árbol está en la costa, pero no cuenta qué le pasa. Esta tarjeta no ayuda a explicar la secuencia.' },
    familia: { img: 'p:familia', t: 'Una familia', role: 'x', why: 'La familia puede visitar el stand, pero no es un paso de lo que pasa en la costa.' }
  };
  const D_DECK = { acomp: ['cae', 'golpe', 'arbol', 'hueco'], detective: ['cae', 'rio', 'orilla', 'familia', 'golpe', 'agua', 'arbol', 'hueco'] };

  /* E · Contenido del cartel */
  const TITLES = {
    t1: { t: '¿Qué le pasa a la costa del río?' },
    t2: { t: 'El río se lleva mi pueblo' },
    t3: { t: 'Erosión hídrica en barrancas fluviales', hard: true }
  };
  const PHRASES = {
    'f-golpe': { t: 'El agua del río golpea la base de la costa.', topic: 'golpe' },
    'f-hueco': { t: 'La base se gasta y queda un hueco.', topic: 'hueco' },
    'f-cae': { t: 'La tierra de arriba puede desprenderse.', topic: 'cae' },
    'f-golpe-l': { t: 'El agua del río, que se mueve todo el tiempo y arrastra arena y barro, golpea una y otra vez la parte de abajo de la costa.', topic: 'golpe', long: true, split: ['f-golpe-a', 'f-golpe-b'] },
    'f-golpe-a': { t: 'El agua del río se mueve todo el tiempo.', topic: 'agua', part: true },
    'f-golpe-b': { t: 'El agua golpea la parte de abajo de la costa.', topic: 'golpe', part: true },
    'f-hueco-l': { t: 'Como el agua pega muchas veces en el mismo lugar, la base de la costa se va gastando de a poco hasta que se forma un hueco.', topic: 'hueco', long: true, split: ['f-hueco-a', 'f-hueco-b'] },
    'f-hueco-a': { t: 'El agua pega muchas veces.', topic: 'golpe', part: true },
    'f-hueco-b': { t: 'La base se gasta y se forma un hueco.', topic: 'hueco', part: true },
    'f-cae-l': { t: 'Cuando abajo queda un hueco grande, la tierra de arriba se queda sin apoyo y en algún momento puede desprenderse y caer al río.', topic: 'cae', long: true, split: ['f-cae-a', 'f-cae-b'] },
    'f-cae-a': { t: 'Abajo queda un hueco grande.', topic: 'hueco', part: true },
    'f-cae-b': { t: 'La tierra de arriba puede caer al río.', topic: 'cae', part: true },
    'f-orilla': { t: 'La costa queda más atrás.', topic: 'orilla' },
    'f-modelo': { t: 'Lo probamos con una maqueta.', topic: 'modelo' },
    'f-cuidado': { t: 'Cuidado: no te acerques al borde.', topic: 'cuidado' },
    'f-arboles': { t: 'Plantando árboles se termina el problema.', claim: 'certeza' },
    'f-dato': { t: 'Cada año el río se lleva 100 metros de costa.', claim: 'inventado' },
    'f-malo': { t: 'El río es malo.', claim: 'opinion' },
    'f-camion': { t: 'Los camiones tiran la costa.', claim: 'suposicion' }
  };
  const PHRASE_POOL = {
    acomp: ['f-golpe', 'f-hueco', 'f-cae-l', 'f-cae', 'f-modelo', 'f-cuidado', 'f-arboles', 'f-dato'],
    detective: ['f-golpe-l', 'f-hueco-l', 'f-cae-l', 'f-cae', 'f-orilla', 'f-modelo', 'f-cuidado', 'f-arboles', 'f-dato', 'f-malo', 'f-camion']
  };
  const CLAIM_FEED = {
    certeza: 'Nuestra investigación no comprobó eso. No lo presentemos como algo seguro.',
    inventado: 'Ese número no está en nuestro cuaderno. No inventemos datos.',
    opinion: 'El río no es bueno ni malo: contamos lo que observamos y lo que probamos.',
    suposicion: 'Es una suposición que no comprobamos. En la maqueta, el golpe sin agua casi no movió la tierra.'
  };
  const WORDS = ['río', 'agua del río', 'canilla', 'costa', 'base', 'tierra', 'se cae', 'maqueta'];
  const STEP_ORDER = { agua: 1, golpe: 1, hueco: 2, cae: 3, orilla: 4 };
  const STEP_TXT = { 1: 'el agua golpea la base', 2: 'se forma un hueco', 3: 'la tierra se desprende', 4: 'la costa queda más atrás' };

  /* temas que cuenta cada imagen; 'ambig' = puede entenderse de otra manera */
  function imgInfo(img, word) {
    if (!img) return null;
    const [t, id] = img.split(':');
    if (t === 'i') return { topics: (ILUS[id] || {}).topics || [], ambig: null };
    const w = word || '';
    switch (id) {
      case 'agua': return (w === 'río' || w === 'agua del río') ? { topics: ['golpe', 'agua'] } : { topics: ['golpe', 'agua'], ambig: 'canilla' };
      case 'tierra': return (w === 'tierra' || w === 'se cae') ? { topics: ['cae'] } : { topics: ['cae'], ambig: 'planta' };
      case 'rio': return { topics: ['agua', 'golpe', 'orilla'] };
      case 'costa': return { topics: ['costa', 'hueco', 'cae', 'cuidado', 'orilla'] };
      case 'investigar': return { topics: ['modelo'] };
      case 'arbol': return { topics: [], mislead: 'arbol' };
      default: return { topics: [], unrelated: true };
    }
  }

  /* G · Agenda del stand */
  const G_STEPS = {
    acomp: [
      { id: 'escuchar', pictos: ['escuchar'], word: 'Escuchamos' },
      { id: 'leer', pictos: ['leer'], word: 'Miramos el cartel' },
      { id: 'investigar', pictos: ['investigar'], word: 'Investigamos la maqueta' }
    ],
    detective: [
      { id: 'escuchar', pictos: ['escuchar'], word: 'Escuchamos' },
      { id: 'leer', pictos: ['leer'], word: 'Miramos el cartel' },
      { id: 'investigar', pictos: ['investigar'], word: 'Investigamos la maqueta' },
      { id: 'cierre', pictos: ['comunicar', 'familia'], word: 'Contamos lo que aprendimos' }
    ]
  };
  const G_TEXT = {
    acomp: 'En el stand, primero escuchamos al equipo. Después miramos el cartel. Al final investigamos la maqueta.',
    detective: 'Al llegar al stand vamos a escuchar la explicación del equipo y, cuando termine, cada visitante mira el cartel; si llueve la feria sigue adentro del salón; luego se investiga la maqueta con la lupa y, para terminar, cada familia cuenta lo que aprendió.'
  };
  const G_WORDS = ['Escuchamos', 'Miramos el cartel', 'Investigamos la maqueta', 'Contamos lo que aprendimos', 'Corremos', 'Si llueve'];

  /* ---------- estado ---------- */
  function blankPanels(n) { const a = []; for (let i = 0; i < n; i++) a.push({ img: null, phrase: null, word: null }); return a; }
  function initial() {
    return {
      v: VERSION, started: false, mode: 'acomp', avatar: 'luna', area: 'escuela', x: 450, y: 512,
      flags: {}, items: [], pictos: [], ev: [], talked: {},
      a: { found: [], seen: [], done: false },
      b: { placed: {}, done: false },
      c: { sim: simInit(), pred: null, obs: {}, done: false },
      d: { slots: [], done: false, tries: 0 },
      poster: { title: null, panels: blankPanels(5), audio: false },
      e: { done: false },
      f: { tests: 0, last: null, best: null, done: false },
      g: { slots: [], done: false },
      help: {},
      prefs: { voz: false, sonido: true, musica: false, rm: false, hc: false, big: false },
      fin: false, updated: 0
    };
  }
  const isObj = o => o && typeof o === 'object' && !Array.isArray(o);
  const strArr = (a, ok) => Array.isArray(a) ? [...new Set(a.filter(x => typeof x === 'string' && (!ok || ok(x))))] : [];

  function validate(raw) {
    const s = initial();
    if (!isObj(raw) || raw.v !== VERSION) return s;
    s.started = !!raw.started;
    s.mode = MODES[raw.mode] ? raw.mode : 'acomp';
    s.avatar = ['luna', 'mia', 'caro', 'joaquin'].includes(raw.avatar) ? raw.avatar : 'luna';
    s.area = AREAS.includes(raw.area) ? raw.area : 'escuela';
    s.x = clampNum(raw.x, 40, 960, 500); s.y = clampNum(raw.y, 470, 540, 505);
    if (isObj(raw.flags)) for (const k in raw.flags) if (typeof raw.flags[k] === 'boolean' || typeof raw.flags[k] === 'number') s.flags[k] = raw.flags[k];
    s.items = strArr(raw.items, x => ITEMS[x]);
    s.pictos = strArr(raw.pictos, x => PICTOS[x]);
    s.ev = strArr(raw.ev, x => EV[x]);
    if (isObj(raw.talked)) for (const k in raw.talked) if (typeof raw.talked[k] === 'number') s.talked[k] = raw.talked[k];
    if (isObj(raw.a)) { s.a.found = strArr(raw.a.found, id => ZONES.some(z => z.id === id)); s.a.seen = strArr(raw.a.seen, id => ZONES.some(z => z.id === id)); s.a.done = !!raw.a.done; }
    if (isObj(raw.b)) { if (isObj(raw.b.placed)) for (const k in raw.b.placed) if (STATEMENTS.some(x => x.id === k) && (raw.b.placed[k] === 'obs' || raw.b.placed[k] === 'sup')) s.b.placed[k] = raw.b.placed[k]; s.b.done = !!raw.b.done; }
    if (isObj(raw.c)) {
      if (isObj(raw.c.sim)) { const m = raw.c.sim; s.c.sim = { caudal: m.caudal === 'mucho' ? 'mucho' : 'poco', hueco: clampNum(m.hueco, 0, 4, 0), caidos: clampNum(m.caidos, 0, 99, 0), pours: clampNum(m.pours, 0, 999, 0), ciclo: clampNum(m.ciclo, 0, 99, 0), golpes: clampNum(m.golpes, 0, 999, 0), runs: { poco: numOrNull(m.runs && m.runs.poco), mucho: numOrNull(m.runs && m.runs.mucho) } }; }
      s.c.pred = ['arriba', 'medio', 'base', 'agua'].includes(raw.c.pred) ? raw.c.pred : null;
      if (isObj(raw.c.obs)) for (const k of ['base', 'cae', 'caudal', 'golpe', 'marron']) if (raw.c.obs[k]) s.c.obs[k] = true;
      s.c.done = !!raw.c.done;
    }
    if (isObj(raw.d)) { s.d.slots = Array.isArray(raw.d.slots) ? raw.d.slots.slice(0, 5).map(x => CARDS[x] ? x : null) : []; s.d.done = !!raw.d.done; s.d.tries = clampNum(raw.d.tries, 0, 999, 0); }
    if (isObj(raw.poster)) {
      const p = raw.poster; s.poster.title = TITLES[p.title] ? p.title : null; s.poster.audio = !!p.audio;
      if (Array.isArray(p.panels)) s.poster.panels = blankPanels(5).map((b, i) => {
        const q = p.panels[i]; if (!isObj(q)) return b;
        return { img: validImg(q.img) ? q.img : null, phrase: PHRASES[q.phrase] ? q.phrase : null, word: WORDS.includes(q.word) ? q.word : null };
      });
    }
    if (isObj(raw.e)) s.e.done = !!raw.e.done;
    if (isObj(raw.f)) { s.f.tests = clampNum(raw.f.tests, 0, 999, 0); s.f.done = !!raw.f.done; s.f.last = numOrNull(raw.f.last); s.f.best = numOrNull(raw.f.best); }
    if (isObj(raw.g)) { s.g.slots = Array.isArray(raw.g.slots) ? raw.g.slots.slice(0, 4).map(x => isObj(x) ? { picto: PICTOS[x.picto] ? x.picto : null, word: G_WORDS.includes(x.word) ? x.word : null } : { picto: null, word: null }) : []; s.g.done = !!raw.g.done; }
    if (isObj(raw.help)) for (const k in raw.help) if (typeof raw.help[k] === 'number') s.help[k] = clampNum(raw.help[k], 0, 3, 0);
    if (isObj(raw.prefs)) for (const k in s.prefs) if (typeof raw.prefs[k] === 'boolean') s.prefs[k] = raw.prefs[k];
    s.fin = !!raw.fin; s.updated = clampNum(raw.updated, 0, 9e15, 0);
    return s;
  }
  function validImg(x) { if (typeof x !== 'string') return false; const [t, id] = x.split(':'); return (t === 'p' && !!PICTOS[id]) || (t === 'i' && !!ILUS[id]); }
  function clampNum(v, a, b, d) { return typeof v === 'number' && isFinite(v) ? Math.max(a, Math.min(b, v)) : d; }
  function numOrNull(v) { return typeof v === 'number' && isFinite(v) ? v : null; }
  const cfg = s => MODES[s.mode] || MODES.acomp;

  /* ---------- objetos y evidencias ---------- */
  const has = (s, it) => s.items.includes(it);
  function give(s, it) { if (!ITEMS[it] || has(s, it)) return false; s.items.push(it); return true; }
  function addEv(s, id) { if (!EV[id] || s.ev.includes(id)) return false; s.ev.push(id); return true; }
  function addPicto(s, id) { if (!PICTOS[id] || s.pictos.includes(id)) return false; s.pictos.push(id); return true; }
  const hasEv = (s, id) => s.ev.includes(id);
  const miradorCount = s => MIRADOR_EV.filter(id => hasEv(s, id)).length;
  function hiddenFound(s) { return Object.keys(HIDDEN_PICTOS).filter(k => s.pictos.includes(k)); }

  function ilusOwned(s) {
    const o = [];
    if (hasEv(s, 'ev-agua') || hasEv(s, 'm-base')) o.push('golpe');
    if (hasEv(s, 'ev-hueco') || hasEv(s, 'm-base')) o.push('hueco');
    if (hasEv(s, 'ev-caida') || hasEv(s, 'm-cae')) o.push('cae');
    if (hasEv(s, 'ev-antes')) o.push('orilla');
    if (s.c.sim.pours > 0 || s.c.done) o.push('maqueta');
    if (hasEv(s, 'ev-costa') || hasEv(s, 'ev-raices')) o.push('borde');
    return o;
  }
  function imagesOwned(s) { return s.pictos.map(p => 'p:' + p).concat(ilusOwned(s).map(i => 'i:' + i)); }

  /* ---------- A ---------- */
  function markZone(s, id) {
    const z = ZONES.find(q => q.id === id); if (!z) return { ok: false, text: '' };
    if (!s.a.seen.includes(id)) s.a.seen.push(id);
    if (!z.rel) return { ok: false, rel: false, text: z.no, zone: z };
    const nuevo = !s.a.found.includes(id); if (nuevo) s.a.found.push(id);
    const need = cfg(s).aNeed, n = s.a.found.length;
    let done = false;
    if (n >= need && !s.a.done) { s.a.done = true; done = true; addEv(s, 'ev-antes'); }
    return { ok: true, rel: true, nuevo, text: z.ok, zone: z, n, need, done };
  }
  function zoneAt(x, y) { let best = null, bd = 1e9; for (const z of ZONES) { const d = Math.hypot(z.x - x, z.y - y); if (d < z.r + 12 && d < bd) { bd = d; best = z; } } return best; }

  /* ---------- B ---------- */
  function bStatements(s) { return STATEMENTS.filter(x => s.mode === 'detective' || !x.det); }
  function classify(s, id, kind) {
    const st = STATEMENTS.find(x => x.id === id); if (!st) return { ok: false };
    const ok = st.k === kind;
    if (ok) s.b.placed[id] = kind; else delete s.b.placed[id];
    const all = bStatements(s).every(x => s.b.placed[x.id] === x.k);
    let done = false; if (all && !s.b.done) { s.b.done = true; done = true; }
    return { ok, text: ok ? (kind === 'obs' ? '¡Sí! Es una observación: se puede ver.' : '¡Sí! Es una suposición: hay que comprobarla.') : B_FEED[st.k], done };
  }

  /* ---------- C · maqueta (modelo simplificado) ---------- */
  function simInit() { return { caudal: 'poco', hueco: 0, caidos: 0, pours: 0, ciclo: 0, golpes: 0, runs: { poco: null, mucho: null } }; }
  function pour(sim) {
    const step = sim.caudal === 'mucho' ? 2 : 1;
    sim.pours++; sim.ciclo++; sim.hueco = Math.min(4, sim.hueco + step);
    if (sim.hueco >= 4) {
      sim.caidos++; if (sim.runs[sim.caudal] == null) sim.runs[sim.caudal] = sim.ciclo;
      const n = sim.ciclo; sim.ciclo = 0; sim.hueco = 0;
      return { ev: 'cae', vertidas: n };
    }
    return { ev: 'gasta', hueco: sim.hueco };
  }
  function golpe(sim) { sim.golpes++; return { ev: 'golpe' }; }
  function rearmar(sim) { sim.hueco = 0; sim.ciclo = 0; sim.caidos = 0; return sim; }
  function setCaudal(sim, c) { if (c !== 'poco' && c !== 'mucho') return; if (sim.caudal !== c) { sim.caudal = c; sim.hueco = 0; sim.ciclo = 0; } }
  function cObserve(s, k, val) {
    const o = s.c.obs; let r = { ok: false };
    if (k === 'base') { r.ok = val === 'base'; if (r.ok) { o.base = true; addEv(s, 'm-base'); } }
    else if (k === 'cae') { r.ok = val === 'cae'; if (r.ok) { o.cae = true; addEv(s, 'm-cae'); } }
    else if (k === 'caudal') { const R = s.c.sim.runs; r.ok = R.poco != null && R.mucho != null && val === (R.mucho <= R.poco ? 'mucho' : 'poco'); if (r.ok) { o.caudal = true; addEv(s, 'm-caudal'); } }
    else if (k === 'golpe') { r.ok = true; o.golpe = true; addEv(s, 'm-golpe'); }
    else if (k === 'marron') { r.ok = true; o.marron = true; addEv(s, 'm-marron'); }
    r.done = cCheck(s);
    return r;
  }
  function cNeeds(s) { return s.mode === 'detective' ? ['base', 'cae', 'caudal'] : ['base', 'cae']; }
  function cCheck(s) { if (!s.c.done && cNeeds(s).every(k => s.c.obs[k])) { s.c.done = true; return true; } return false; }

  /* ---------- D ---------- */
  function dDeck(s) { return D_DECK[s.mode] || D_DECK.acomp; }
  function checkSequence(s, slots) {
    const n = cfg(s).dSlots, arr = (slots || []).slice(0, n);
    const msgs = [], notes = [];
    for (let i = 0; i < n; i++) if (!arr[i]) msgs.push({ slot: i, t: 'Todavía hay un lugar vacío.' });
    if (msgs.length) return { ok: false, msgs };
    const roles = arr.map(id => CARDS[id] ? CARDS[id].role : 'x');
    arr.forEach((id, i) => { const c = CARDS[id]; if (c.role === 'x') msgs.push({ slot: i, t: c.why }); if (c.role === 'ctx' && i !== 0) msgs.push({ slot: i, t: '«El río» presenta el tema: queda mejor al principio, antes de los pasos.' }); if (c.note) notes.push(c.note); });
    const steps = roles.map((r, i) => ({ r, i })).filter(q => typeof q.r === 'number');
    const seen = new Set(steps.map(q => q.r));
    for (const need of [1, 2, 3]) if (!seen.has(need)) msgs.push({ slot: -1, t: need === 2 ? 'Falta el paso del medio: ¿qué le pasa a la base antes de que se desprenda la tierra? Pensá en la maqueta.' : need === 1 ? 'Falta el comienzo: ¿qué llega primero hasta la costa?' : 'Falta el final: ¿qué puede pasar con la tierra de arriba?' });
    const cnt = {}; steps.forEach(q => { cnt[q.r] = (cnt[q.r] || 0) + 1; });
    for (const r in cnt) if (cnt[r] > 1) msgs.push({ slot: -1, t: 'Hay dos tarjetas que cuentan lo mismo (' + STEP_TXT[r] + '). Con una alcanza: usá el lugar para otro paso.' });
    for (let k = 1; k < steps.length; k++) if (steps[k].r < steps[k - 1].r) {
      const a = steps[k - 1].r, b = steps[k].r;
      msgs.push({ slot: steps[k].i, t: (a === 3 && b === 2) ? 'Si la tierra se desprende antes de que haya un hueco, ¿qué la dejó sin apoyo? Mirá otra vez el orden.' : 'Revisá el orden: ahora dice que primero ' + STEP_TXT[a] + ' y después ' + STEP_TXT[b] + '.' });
      break;
    }
    const ok = msgs.length === 0;
    return { ok, msgs, notes, explain: ok ? arr.map(id => CARDS[id].t).join(' → ') : '' };
  }
  function dSubmit(s, slots) { s.d.slots = slots.slice(); s.d.tries++; const r = checkSequence(s, slots); if (r.ok && !s.d.done) { s.d.done = true; r.done = true; } return r; }

  /* ---------- E · cartel ---------- */
  const panelsN = s => cfg(s).panels;
  function phrasesAvailable(s) { return PHRASE_POOL[s.mode] || PHRASE_POOL.acomp; }
  function usedPanels(s) { return s.poster.panels.slice(0, panelsN(s)).map((p, i) => ({ p, i })).filter(q => q.p.img || q.p.phrase); }
  function setPanel(s, i, field, val) {
    if (i < 0 || i >= panelsN(s)) return { ok: false };
    const p = s.poster.panels[i];
    if (field === 'img') { if (val && !imagesOwned(s).includes(val)) return { ok: false, t: 'Todavía no tenés esa imagen.' }; p.img = val || null; if (!val || val.split(':')[0] === 'i') p.word = null; }
    else if (field === 'phrase') { if (val && !PHRASES[val]) return { ok: false }; p.phrase = val || null; if (p.phrase && PHRASES[p.phrase].long) s.poster.audio = false; }
    else if (field === 'word') { if (val && !has(s, 'marcador')) return { ok: false, t: 'Para escribir una palabra junto al pictograma hace falta un marcador. Sol tiene uno.' }; if (val && (!p.img || p.img[0] !== 'p')) return { ok: false, t: 'La palabra va junto a un pictograma.' }; p.word = val && WORDS.includes(val) ? val : null; }
    return { ok: true };
  }
  function clearPanel(s, i) { if (s.poster.panels[i]) s.poster.panels[i] = { img: null, phrase: null, word: null }; }
  function movePanel(s, i, dir) { const j = i + dir, P = s.poster.panels; if (j < 0 || j >= panelsN(s)) return false; [P[i], P[j]] = [P[j], P[i]]; return true; }
  function splitPhrase(s, i) {
    const P = s.poster.panels, p = P[i], n = panelsN(s);
    if (!p || !p.phrase || !PHRASES[p.phrase].long) return { ok: false, t: 'Esa frase ya es corta.' };
    if (!has(s, 'tijera')) return { ok: false, t: 'Para dividir el texto hace falta una tijera. Buscala en el aula.' };
    let free = -1; for (let k = i + 1; k < n; k++) if (!P[k].img && !P[k].phrase) { free = k; break; }
    if (free < 0) for (let k = n - 1; k > i; k--) if (!P[k].img && !P[k].phrase) { free = k; break; }
    if (free < 0) { for (let k = 0; k < n; k++) if (k !== i && !P[k].img && !P[k].phrase) { free = k; break; } }
    if (free < 0) return { ok: false, t: 'No hay un cuadro libre para la segunda parte. Vaciá un cuadro y volvé a cortar.' };
    const [a, b] = PHRASES[p.phrase].split;
    P.splice(free, 1); const at = P.indexOf(p) + 1; P.splice(at, 0, { img: null, phrase: b, word: null }); p.phrase = a;
    return { ok: true, at, t: 'Dividiste la frase en dos partes cortas. La segunda parte quedó en el cuadro ' + (at + 1) + ': elegile una imagen.' };
  }
  function setAudio(s, on) {
    if (!on) { s.poster.audio = false; return { ok: true }; }
    if (!has(s, 'grabadora')) return { ok: false, t: 'Para agregar audio hace falta la grabadora de Bruno.' };
    const largo = usedPanels(s).find(q => q.p.phrase && PHRASES[q.p.phrase].long);
    if (largo) return { ok: false, t: 'Bruno dice: «Grabo cuando las frases sean cortas. La del cuadro ' + (largo.i + 1) + ' es muy larga para escucharla de una vez».' };
    s.poster.audio = true; return { ok: true };
  }
  function posterReady(s) { return !!s.poster.title && usedPanels(s).length >= 3; }

  /* ---------- F · visitantes ---------- */
  const VISITORS = {
    juli: { n: 'Juli', who: 'juli', about: 'Tiene 5 años. Todavía no lee: mira los dibujos y los pictogramas.' },
    lucas: { n: 'Lucas', who: 'lucas', about: 'Llegó hace poco a la escuela y está aprendiendo castellano.' },
    rosa: { n: 'Abuela Rosa', who: 'rosa', about: 'Vino con su nieta. Le gusta que le cuenten las cosas en voz alta.' },
    mati: { n: 'Mati', who: 'mati', about: 'Es muy curioso: siempre pregunta “¿y cómo lo saben?”.' }
  };
  function visitorsFor(s) { return s.mode === 'detective' ? ['juli', 'lucas', 'rosa', 'mati'] : ['juli', 'lucas', 'rosa']; }
  function evaluate(s) {
    const P = s.poster, used = usedPanels(s), issues = [];
    const add = (who, code, t, fix, panel) => issues.push({ who, code, t, fix, panel: panel == null ? -1 : panel });
    if (!P.title) add('rosa', 'titulo', '¿De qué se trata este cartel? No encuentro un título.', 'Elegí un título.');
    else if (TITLES[P.title].hard) add('lucas', 'dificil', 'El título tiene palabras que no conozco: «' + TITLES[P.title].t + '».', 'Probá con un título con palabras de todos los días.');
    if (used.length < 3) add('juli', 'pocos', 'Hay muy poquitos cuadros. No entiendo qué pasa.', 'Completá al menos tres cuadros.');
    const topics = [];
    used.forEach(({ p, i }) => {
      const ph = p.phrase ? PHRASES[p.phrase] : null, im = imgInfo(p.img, p.word), N = i + 1;
      if (ph && ph.claim) add('marta', 'claim', '«' + ph.t + '» ' + CLAIM_FEED[ph.claim], 'Cambiá esa frase por algo que esté en el cuaderno.', i);
      if (ph && !p.img) add('juli', 'sinimg', 'En el cuadro ' + N + ' no hay dibujo. Yo todavía no leo, ¿qué dice?', 'Agregá una imagen o un pictograma.', i);
      if (p.img && !ph) add('lucas', 'sintxt', 'En el cuadro ' + N + ' veo la imagen, pero no sé qué quiere decir.', 'Agregá una frase corta.', i);
      if (ph && ph.long) add('lucas', 'largo', 'La frase del cuadro ' + N + ' es muy larga: me pierdo en el medio.', 'Usá la tijera para dividirla en partes.', i);
      if (im && im.ambig === 'canilla') add('juli', 'ambig', (p.word === 'canilla' ? 'Dice «canilla»… ' : '') + '¿En el cuadro ' + N + ' hay una canilla? ¿Hay que cerrar la canilla?', 'Escribí una palabra que aclare de qué agua se habla, o usá otra imagen.', i);
      if (im && im.ambig === 'planta') add('juli', 'ambig', 'En el cuadro ' + N + ' veo una plantita. ¿Hay que plantar algo?', 'Escribí una palabra que aclare la imagen, o usá otra.', i);
      if (im && im.mislead) add('rosa', 'arbol', 'En el cuadro ' + N + ' veo un árbol. ¿El cartel dice que hay que plantar árboles?', 'Elegí una imagen que muestre lo que dice la frase.', i);
      if (ph && !ph.claim && im && !im.ambig && !im.mislead && ph.topic && im.topics.length && !im.topics.includes(ph.topic)) add('juli', 'nocoincide', 'El dibujo y la frase del cuadro ' + N + ' cuentan cosas distintas.', 'Buscá una imagen que muestre lo que dice la frase.', i);
      if (ph && !ph.claim && im && im.unrelated) add('juli', 'nocoincide', 'El pictograma del cuadro ' + N + ' no tiene que ver con la frase.', 'Buscá una imagen que muestre lo que dice la frase.', i);
      if (ph && STEP_ORDER[ph.topic]) topics.push({ r: STEP_ORDER[ph.topic], i });
    });
    for (let k = 1; k < topics.length; k++) if (topics[k].r < topics[k - 1].r) { add('rosa', 'orden', 'Primero dice que ' + STEP_TXT[topics[k - 1].r] + ' y después que ' + STEP_TXT[topics[k].r] + '. ¿En qué orden pasa?', 'Ordená los cuadros como en el corcho.', topics[k].i); break; }
    const has3 = r => topics.some(q => q.r === r);
    if (used.length >= 3) {
      if (!has3(2) && has3(3)) add('rosa', 'falta', 'No entiendo por qué se desprende la tierra. ¿Qué pasa antes abajo?', 'Agregá el paso del hueco en la base.');
      else if (!has3(1)) add('rosa', 'falta', '¿Qué es lo que gasta la costa? Falta contarlo.', 'Agregá el paso del agua que golpea la base.');
      else if (!has3(3) && !has3(2)) add('rosa', 'falta', 'Falta contar qué le pasa a la costa.', 'Agregá los pasos del hueco y de la tierra que se desprende.');
      else if (!has3(3)) add('rosa', 'falta', '¿Y qué pasa después del hueco? Falta el final.', 'Agregá el paso de la tierra que se desprende.');
    }
    if (!P.audio) add('rosa', 'audio', '¿Alguien me lo puede contar? Me gusta escuchar las explicaciones.', 'Bruno tiene una grabadora para agregar audio al cartel.');
    if (s.mode === 'detective' && !used.some(q => q.p.phrase && PHRASES[q.p.phrase].topic === 'modelo')) add('mati', 'metodo', '¿Y cómo saben que pasa así? El cartel no cuenta qué investigaron.', 'Agregá un cuadro sobre la maqueta.');
    const vis = visitorsFor(s).map(id => {
      const mine = issues.filter(q => q.who === id);
      return { id, n: VISITORS[id].n, ok: mine.length === 0, issues: mine, happy: happyLine(id, s) };
    });
    const review = issues.filter(q => q.who === 'marta');
    const lucasDup = vis.find(v => v.id === 'mati'); if (lucasDup && !lucasDup.ok) { /* nada */ }
    return { visitors: vis, review, issues, allOk: issues.length === 0, count: issues.length };
  }
  function happyLine(id, s) {
    switch (id) {
      case 'juli': return '¡Lo entendí con los dibujos! Primero el agua, después el hueco y después se cae la tierra.';
      case 'lucas': return 'Las frases son cortas y cada una tiene su imagen. ¡Ahora entiendo!';
      case 'rosa': return 'Escuché el audio y miré los dibujos. Ahora sé qué le pasa a la costa.';
      case 'mati': return '¡Ah, lo probaron con una maqueta! Aunque es un modelo, ayuda a entender.';
    }
    return '';
  }
  function testPoster(s) {
    const r = evaluate(s); s.f.tests++; const prev = s.f.last; s.f.last = r.count; s.f.best = s.f.best == null ? r.count : Math.min(s.f.best, r.count);
    r.prev = prev; let done = false; if (r.allOk && !s.f.done) { s.f.done = true; done = true; } r.done = done; return r;
  }

  /* ---------- G ---------- */
  function gSteps(s) { return G_STEPS[s.mode] || G_STEPS.acomp; }
  function checkAgenda(s, slots) {
    const steps = gSteps(s), msgs = [];
    steps.forEach((st, i) => {
      const sl = slots[i] || {};
      if (!sl.picto) { msgs.push({ slot: i, t: 'Falta el pictograma del paso ' + (i + 1) + '.' }); return; }
      if (!st.pictos.includes(sl.picto)) {
        const real = steps.findIndex(q => q.pictos.includes(sl.picto));
        msgs.push({ slot: i, t: real >= 0 ? 'Ese pictograma corresponde a otro momento: el paso ' + (real + 1) + '. Volvé a leer o escuchar la indicación.' : 'Ese pictograma no aparece en la indicación del stand.' });
      }
      if (s.mode === 'detective') {
        if (!sl.word) msgs.push({ slot: i, t: 'Falta una palabra corta en el paso ' + (i + 1) + '.' });
        else if (sl.word !== st.word) msgs.push({ slot: i, t: sl.word === 'Si llueve' ? '«Si llueve» es un aviso, no una actividad del stand.' : 'La palabra del paso ' + (i + 1) + ' no coincide con su pictograma.' });
      }
    });
    return { ok: msgs.length === 0, msgs };
  }
  function gSubmit(s, slots) { s.g.slots = slots.map(x => ({ picto: x && x.picto || null, word: x && x.word || null })); const r = checkAgenda(s, s.g.slots); if (r.ok && !s.g.done) { s.g.done = true; r.done = true; } return r; }
  function gMissing(s) { const need = new Set(); gSteps(s).forEach(st => { if (!st.pictos.some(p => s.pictos.includes(p))) need.add(st.pictos[0]); }); return [...need]; }

  /* ---------- ayudas progresivas ---------- */
  function help(s, key) { const n = Math.min(3, (s.help[key] || 0) + 1); s.help[key] = n; return n; }
  function helpLevel(s, key) { return s.help[key] || 0; }
  function resetHelp(s, key) { s.help[key] = 0; }

  /* ---------- objetivos ---------- */
  function quests(s) {
    const c = cfg(s), q = [];
    const talkedAll = ['sol', 'bruno', 'nico'].every(k => s.talked[k]);
    q.push({ id: 'intro', t: 'Hablá con la Seño Marta en el aula.', done: !!s.flags.intro, area: 'escuela', spot: 'marta' });
    q.push({ id: 'equipo', t: 'Conversá con Sol, Bruno y Nico: cada uno sabe una parte.', done: talkedAll, area: 'escuela', spot: !s.talked.sol ? 'sol' : !s.talked.bruno ? 'bruno' : 'nico' });
    const mc = miradorCount(s);
    q.push({ id: 'mirador', t: 'En el Mirador: compará las ilustraciones de Tomás y reuní ' + c.evNeed + ' observaciones de la costa (' + Math.min(mc, c.evNeed) + '/' + c.evNeed + ').', done: s.a.done && mc >= c.evNeed, area: 'mirador', spot: !s.a.done ? 'tomas' : nextMiradorSpot(s) });
    q.push({ id: 'b', t: 'En la mesa de pistas del aula: separá lo que vimos de lo que suponemos.', done: s.b.done, area: 'escuela', spot: 'mesa' });
    q.push({ id: 'c', t: 'En el laboratorio: probá la maqueta y anotá lo que observás.', done: s.c.done, area: 'lab', spot: 'maqueta' });
    q.push({ id: 'd', t: 'En el corcho del aula: ordená la explicación con imágenes y pictogramas.', done: s.d.done, area: 'escuela', spot: 'corcho' });
    q.push({ id: 'e', t: 'En la feria: armá el cartel con título, imágenes y frases.', done: s.e.done, area: 'feria', spot: 'stand' });
    q.push({ id: 'f', t: 'Probá el cartel con los visitantes y mejoralo.', done: s.f.done, area: 'feria', spot: 'visitantes' });
    q.push({ id: 'g', t: 'Hacé la agenda visual del stand para la Seño Marta.', done: s.g.done, area: 'feria', spot: 'agenda' });
    return q;
  }
  function nextMiradorSpot(s) {
    const order = ['ev-costa', 'ev-agua', 'ev-caida', 'ev-hueco', 'ev-raices'];
    const spot = { 'ev-costa': 'costa', 'ev-agua': 'agua', 'ev-caida': 'orilla', 'ev-hueco': 'base', 'ev-raices': 'raices' };
    const id = order.find(k => !hasEv(s, k)); return id ? spot[id] : 'tomas';
  }
  function current(s) { return quests(s).find(x => !x.done) || null; }
  function prereq(s, act) {
    const c = cfg(s);
    switch (act) {
      case 'b': if (!(s.a.done && miradorCount(s) >= c.evNeed)) return 'Primero hacen falta pistas del Mirador: ' + c.evNeed + ' observaciones de la costa y la comparación de Tomás.'; if (!s.talked.nico) return 'Antes, escuchá lo que piensa Nico: él tiene una idea para revisar.'; return null;
      case 'c': return s.b.done ? null : 'El profe Daniel dice: «Antes de experimentar, separen en la mesa de pistas lo que vieron de lo que suponen. Así sabemos qué probar».';
      case 'd': return s.c.done ? null : 'Para ordenar la explicación, primero probá la maqueta del laboratorio.';
      case 'e': return s.d.done ? null : 'El stand espera la explicación ordenada del corcho del aula.';
      case 'f': return s.e.done ? null : 'Primero armá el cartel en el stand.';
      case 'g': return s.f.done ? null : 'La Seño Marta te va a pedir la agenda cuando los visitantes entiendan el cartel.';
    }
    return null;
  }
  function progress(s) { const q = quests(s); return { done: q.filter(x => x.done).length, total: q.length }; }

  const api = {
    VERSION, KEY, OLD_KEYS, AREAS, AREA_NAME, MODES, ITEMS, PICTOS, SOL_BOX, HIDDEN_PICTOS, ILUS, EV, MIRADOR_EV, ZONES, STATEMENTS, CARDS, D_DECK,
    TITLES, PHRASES, WORDS, VISITORS, G_STEPS, G_TEXT, G_WORDS, CLAIM_FEED,
    initial, validate, cfg, has, give, addEv, addPicto, hasEv, miradorCount, hiddenFound, ilusOwned, imagesOwned, imgInfo,
    markZone, zoneAt, bStatements, classify,
    simInit, pour, golpe, rearmar, setCaudal, cObserve, cNeeds, cCheck,
    dDeck, checkSequence, dSubmit,
    panelsN, phrasesAvailable, usedPanels, setPanel, clearPanel, movePanel, splitPhrase, setAudio, posterReady,
    visitorsFor, evaluate, testPoster, gSteps, checkAgenda, gSubmit, gMissing,
    help, helpLevel, resetHelp, quests, current, prereq, progress
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BJM = api;
})(typeof window !== 'undefined' ? window : globalThis);
