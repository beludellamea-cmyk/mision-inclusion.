/* Pruebas del modelo: node bermejo/tests.cjs */
const assert = require('assert');
const M = require('./model.js');

function recorrido(mode) {
  const s = M.initial(); s.mode = mode; s.started = true;
  assert.strictEqual(M.current(s).id, 'intro');
  s.flags.intro = true; M.give(s, 'cuaderno'); M.addEv(s, 'p-marta');
  ['sol', 'bruno', 'nico'].forEach(k => { s.talked[k] = 1; });
  M.SOL_BOX.forEach(p => M.addPicto(s, p));
  assert.ok(M.prereq(s, 'b'), 'B bloqueado sin pistas');
  // A
  assert.strictEqual(M.markZone(s, 'nube').rel, false);
  ['borde', 'hueco', 'terrones', 'raices', 'arbol'].slice(0, M.cfg(s).aNeed).forEach(z => M.markZone(s, z));
  assert.ok(s.a.done && M.hasEv(s, 'ev-antes'));
  M.give(s, 'prismaticos');
  M.MIRADOR_EV.forEach(e => M.addEv(s, e));
  assert.strictEqual(M.prereq(s, 'b'), null);
  // B
  const st = M.bStatements(s);
  assert.strictEqual(st.length, mode === 'detective' ? 8 : 4);
  const wrong = M.classify(s, 's3', 'obs'); assert.strictEqual(wrong.ok, false); assert.ok(wrong.text);
  st.forEach(x => M.classify(s, x.id, x.k));
  assert.ok(s.b.done);
  // C
  const sim = s.c.sim; assert.strictEqual(M.pour(sim).ev, 'gasta');
  assert.strictEqual(M.cObserve(s, 'base', 'arriba').ok, false);
  M.cObserve(s, 'base', 'base');
  let r; do { r = M.pour(sim); } while (r.ev !== 'cae');
  assert.strictEqual(sim.runs.poco, 4);
  M.cObserve(s, 'cae', 'cae');
  M.setCaudal(sim, 'mucho'); do { r = M.pour(sim); } while (r.ev !== 'cae');
  assert.strictEqual(sim.runs.mucho, 2);
  assert.strictEqual(M.cObserve(s, 'caudal', 'poco').ok, false);
  M.cObserve(s, 'caudal', 'mucho');
  assert.ok(s.c.done);
  // D
  const n = M.cfg(s).dSlots;
  const bad = M.checkSequence(s, ['cae', 'hueco', 'golpe', 'arbol'].slice(0, n));
  assert.strictEqual(bad.ok, false); assert.ok(bad.msgs.length);
  const good = mode === 'detective' ? ['rio', 'golpe', 'hueco', 'cae'] : ['golpe', 'hueco', 'cae'];
  assert.ok(M.dSubmit(s, good).ok);
  if (mode === 'detective') {
    assert.ok(M.checkSequence(s, ['golpe', 'hueco', 'cae', 'orilla']).ok, 'alternativa válida');
    assert.ok(M.checkSequence(s, ['agua', 'hueco', 'cae', 'orilla']).notes.length, 'nota sobre la canilla');
    assert.strictEqual(M.checkSequence(s, ['golpe', 'rio', 'hueco', 'cae']).ok, false);
  }
  // E
  s.poster.title = 't1';
  const P = s.poster.panels;
  M.setPanel(s, 0, 'img', 'p:agua'); M.setPanel(s, 0, 'phrase', mode === 'detective' ? 'f-golpe-l' : 'f-golpe');
  M.setPanel(s, 1, 'phrase', mode === 'detective' ? 'f-hueco-l' : 'f-hueco'); M.setPanel(s, 1, 'img', 'i:hueco');
  M.setPanel(s, 2, 'phrase', 'f-arboles'); M.setPanel(s, 2, 'img', 'p:arbol');
  assert.ok(M.posterReady(s)); s.e.done = true;
  // F: primera prueba con dudas
  let ev = M.testPoster(s);
  assert.strictEqual(ev.allOk, false);
  const codes = ev.issues.map(i => i.code);
  ['ambig', 'claim', 'arbol', 'audio'].forEach(c => assert.ok(codes.includes(c), 'falta ' + c));
  if (mode === 'detective') assert.ok(codes.includes('largo') && codes.includes('metodo'));
  // revisar
  assert.strictEqual(M.setPanel(s, 0, 'word', 'río').ok, false, 'sin marcador');
  M.give(s, 'marcador'); M.setPanel(s, 0, 'word', 'agua del río');
  M.setPanel(s, 2, 'phrase', 'f-cae'); M.setPanel(s, 2, 'img', 'i:cae');
  if (mode === 'detective') {
    assert.strictEqual(M.splitPhrase(s, 0).ok, false, 'sin tijera');
    M.give(s, 'tijera');
    let sp = M.splitPhrase(s, 0); assert.ok(sp.ok, sp.t);
    assert.strictEqual(P[0].phrase, 'f-golpe-a'); assert.strictEqual(P[1].phrase, 'f-golpe-b');
    sp = M.splitPhrase(s, 2); assert.ok(sp.ok, sp.t);
    assert.strictEqual(s.poster.panels[3].phrase, 'f-hueco-b');
    M.clearPanel(s, 0); M.clearPanel(s, 2);
    M.setPanel(s, 1, 'img', 'i:golpe'); M.setPanel(s, 3, 'img', 'i:hueco');
    // pasar a: golpe, hueco, cae, modelo
    const by = id => s.poster.panels.find(p => p.phrase === id);
    s.poster.panels = [by('f-golpe-b'), by('f-hueco-b'), by('f-cae'), { img: 'i:maqueta', phrase: 'f-modelo', word: null }, { img: null, phrase: null, word: null }];
  }
  assert.strictEqual(M.setAudio(s, true).ok, false, 'sin grabadora');
  M.give(s, 'grabadora'); assert.ok(M.setAudio(s, true).ok);
  ev = M.testPoster(s);
  assert.ok(ev.allOk, JSON.stringify(ev.issues));
  assert.ok(s.f.done);
  // G
  const steps = M.gSteps(s);
  steps.forEach(x => x.pictos.forEach(p => M.addPicto(s, p)));
  assert.strictEqual(M.checkAgenda(s, [{ picto: 'leer' }, { picto: 'escuchar' }]).ok, false);
  const slots = steps.map(x => ({ picto: x.pictos[0], word: x.word }));
  assert.ok(M.gSubmit(s, slots).ok);
  assert.strictEqual(M.current(s), null, 'todos los objetivos completos');
  const back = M.validate(JSON.parse(JSON.stringify(s)));
  assert.deepStrictEqual(back, s);
  return s;
}

recorrido('acomp');
recorrido('detective');
const s = recorrido('acomp'); s.mode = 'detective';
const v = M.validate(JSON.parse(JSON.stringify(s)));
assert.strictEqual(v.mode, 'detective'); assert.ok(v.a.done && v.b.done && v.c.done && v.d.done && v.f.done && v.g.done);
assert.deepStrictEqual(M.validate(null), M.initial());
assert.deepStrictEqual(M.validate({ v: 2 }), M.initial());
const junk = M.validate({ v: 3, mode: 'x', area: 'luna', items: ['tijera', 'nada', 5], ev: ['ev-costa', 'zzz'], poster: { title: 'qq', panels: [{ img: 'p:nada', phrase: 'f-golpe', word: 'hola' }] } });
assert.strictEqual(junk.mode, 'acomp'); assert.strictEqual(junk.area, 'escuela');
assert.deepStrictEqual(junk.items, ['tijera']); assert.deepStrictEqual(junk.ev, ['ev-costa']);
assert.strictEqual(junk.poster.title, null); assert.deepStrictEqual(junk.poster.panels[0], { img: null, phrase: 'f-golpe', word: null });
assert.ok(/modelo simplificado/.test(M.EV['p-daniel'].t));
console.log('PASS: modelo, recorridos acompañado y detective, guardado y validación');
