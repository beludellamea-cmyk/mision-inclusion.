/* Personajes de Misión Inclusión (originales, creados para el juego). Renderizador SVG compartido con la página principal. */
(function(){'use strict';
/* ===== Utilidades de color y dibujo ===== */
function hx(c){c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return [0,2,4].map(i=>parseInt(c.substr(i,2),16));}
function aHex(a){return '#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
function mezcla(c1,c2,t){const a=hx(c1),b=hx(c2);return aHex(a.map((v,i)=>v+(b[i]-v)*t));}
const osc=(c,t=.22)=>mezcla(c,'#2a1838',t);
const clr=(c,t=.3)=>mezcla(c,'#ffffff',t);
const lin=c=>mezcla(c,'#24142e',.6);
let UID=0; const uid=p=>(p||'g')+(++UID);
const f1=n=>Math.round(n*10)/10;
function esc(x){ return String(x==null?'':x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
/* sombra de contacto suave en el piso */
const sombraPiso=(x,y,rx,ry,op=.28)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry||rx*.18}" fill="#2a1838" opacity="${op}" filter="url(#f-blur6)"/>`;
/* defs globales del escenario */
function defsGlobales(){
  return `<defs>
  <filter id="f-blur3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="f-blur6" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="f-blur14" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="f-grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix type="matrix" values="0 0 0 0 .2  0 0 0 0 .12  0 0 0 0 .1  0 0 0 .06 0"/></filter>
  <linearGradient id="g-luzv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8dc" stop-opacity=".55"/><stop offset="1" stop-color="#fff8dc" stop-opacity="0"/></linearGradient>
  <linearGradient id="g-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9d3e6"/><stop offset=".5" stop-color="#8592ad"/><stop offset="1" stop-color="#5a6680"/></linearGradient>
  <radialGradient id="g-rubor"><stop offset="0" stop-color="#ff6f7d" stop-opacity=".55"/><stop offset="1" stop-color="#ff6f7d" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-vineta" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#1a1030" stop-opacity="0"/><stop offset="1" stop-color="#1a1030" stop-opacity=".22"/></radialGradient>
  </defs>`;
}
/* ===== Personajes originales (cartoon/anime, contorno fino, sombreado suave) ===== */
const CAST={
  luna:{n:'Luna',piel:'#f8d5bd',pelo:'#3e2c63',peinado:'coletas',ojos:'#8a5ad8',remera:'#ff9248',estampa:'estrella',abajo:'pollera',abajoC:'#3d4f96',medias:'#ffffff',zap:'#ff5d8f',acc:'#ff5d8f'},
  nico:{n:'Nico',piel:'#c88a62',pelo:'#22202e',peinado:'puntas',ojos:'#6a4428',anteojos:true,remera:'#2bb3a3',estampa:'rayas',abajo:'pantalon',abajoC:'#33415f',zap:'#ffcf3a'},
  sol:{n:'Sol',piel:'#8d5b3e',pelo:'#22140f',peinado:'rulos',ojos:'#6a3a1c',remera:'#ffc53d',estampa:'flor',abajo:'short',abajoC:'#7b3fa0',medias:'#ffffff',zap:'#3fb6ff',acc:'#ff5d8f'},
  bruno:{n:'Bruno',piel:'#f6d3b5',pelo:'#d4682c',peinado:'corto',ojos:'#2f8a4a',remera:'#4a8de0',estampa:'dino',abajo:'pantalon',abajoC:'#2b3550',zap:'#ff8a3d',silla:true},
  ema:{n:'Ema',piel:'#e3aa82',pelo:'#5e351a',peinado:'largo',ojos:'#4a8a34',remera:'#e2557a',estampa:'cuello',abajo:'pantalon',abajoC:'#2f5d8a',zap:'#f4f4f4',acc:'#ffd23f'},
  mia:{n:'Mía',piel:'#6e4632',pelo:'#16100d',peinado:'rodete',ojos:'#4a2814',remera:'#5cc06b',estampa:'bolsillo',abajo:'pollera',abajoC:'#46305e',medias:'#ffe08a',zap:'#ff5d8f',acc:'#ffd23f'},
  tomas:{n:'Tomás',piel:'#f1c39c',pelo:'#7c4b24',peinado:'flequillo',ojos:'#2a64a8',remera:'#7c5ce0',estampa:'cohete',abajo:'pantalon',abajoC:'#2c3a5a',zap:'#ffcf3a'},
  caro:{n:'Caro',piel:'#bb7c54',pelo:'#2e1b11',peinado:'trenza',ojos:'#5a3218',remera:'#ff6f91',estampa:'corazon',abajo:'pantalon',abajoC:'#3a4f7a',zap:'#7bdff2',acc:'#7bdff2',andador:true},
  joaquin:{n:'Joaquín',piel:'#9e6846',pelo:'#161111',peinado:'puntas',ojos:'#4a2c16',remera:'#f0a020',estampa:'barco',abajo:'pantalon',abajoC:'#2f3d66',zap:'#e84a5f'},
  valen:{n:'Valen',piel:'#f7dac2',pelo:'#e3ab3d',peinado:'melena',ojos:'#2a7ab0',remera:'#40b8e8',estampa:'rayas',abajo:'pollera',abajoC:'#5a3f8a',medias:'#ffffff',zap:'#ffffff',acc:'#ff8a3d'},
  pablo:{n:'Pablo',piel:'#dba27c',pelo:'#3c2616',peinado:'corto',ojos:'#4a2c16',remera:'#e84a5f',estampa:'numero',abajo:'short',abajoC:'#2a3d5c',medias:'#ffffff',zap:'#2bb3a3'},
  lucia:{n:'Lucía',piel:'#c98d66',pelo:'#2a1810',peinado:'largo',ojos:'#5a3218',remera:'#2f8f9d',saco:'#2f8f9d',estampa:'buzo',abajo:'pantalon',abajoC:'#27324d',zap:'#f4ead2',acc:'#f08a3c',teen:true},
  agus:{n:'Agus',piel:'#f0c7a6',pelo:'#5a3a22',peinado:'flequillo',ojos:'#3d6a3a',remera:'#e2553f',saco:'#e2553f',estampa:'buzo',abajo:'pantalon',abajoC:'#2b2f45',zap:'#ffffff',teen:true},
  camila:{n:'Camila',piel:'#f6d8c4',pelo:'#b5502a',peinado:'trenza',ojos:'#4a7aa8',remera:'#c9d36a',estampa:'rayas',abajo:'pantalon',abajoC:'#3b4a6b',zap:'#e2553f',acc:'#2f8f9d',teen:true},
  thiago:{n:'Thiago',piel:'#8e5a3c',pelo:'#151010',peinado:'puntas',ojos:'#3a2412',remera:'#27324d',saco:'#27324d',estampa:'buzo',abajo:'pantalon',abajoC:'#5a6a8a',zap:'#f08a3c',teen:true},
  benja:{n:'Benja',piel:'#e6b48c',pelo:'#2e2a28',peinado:'corto',ojos:'#4a2c16',anteojos:true,remera:'#f08a3c',estampa:'',abajo:'pantalon',abajoC:'#2b3550',zap:'#2f8f9d',teen:true},
  valentina:{n:'Valentina',piel:'#7a4a32',pelo:'#120c0a',peinado:'rulos',ojos:'#3a1f10',remera:'#8a5ad8',saco:'#8a5ad8',estampa:'buzo',abajo:'pantalon',abajoC:'#27324d',zap:'#ffffff',acc:'#c9d36a',teen:true},
  franco:{n:'Franco',piel:'#d9a07a',pelo:'#3c2616',peinado:'corto',ojos:'#4a2c16',remera:'#5a8a3a',saco:'#5a8a3a',estampa:'buzo',abajo:'pantalon',abajoC:'#2a2f40',zap:'#e2553f',teen:true},
  martina:{n:'Martina',piel:'#f2cfb2',pelo:'#d9a83a',peinado:'melena',ojos:'#2a7ab0',remera:'#e2553f',estampa:'cuello',abajo:'pollera',abajoC:'#27324d',medias:'#27324d',zap:'#2b2f45',acc:'#f4ead2',teen:true},
  profe:{n:'Profe Daniel',piel:'#d29a74',pelo:'#3a2a20',peinado:'corto',ojos:'#4a2c16',anteojos:true,remera:'#f4ead2',estampa:'cardigan',saco:'#5a6a8a',abajo:'pantalon',abajoC:'#2a2f40',zap:'#3a2f45',adulta:true},
  marta:{n:'Seño Marta',piel:'#e9b792',pelo:'#6a3520',peinado:'rodete',ojos:'#5a3a1a',anteojos:true,remera:'#f3efe6',estampa:'cardigan',saco:'#3d6fb5',abajo:'pollera',abajoC:'#2a3555',zap:'#3a2f45',acc:'#ffd23f',adulta:true}
};
const NOMBRE=k=>CAST[k]?CAST[k].n:(k==='narra'?'Misión':k);

/* ---- ojos ---- */
function ojo(ex,ey,lado,p,o,clipId,irisId){
  const e=o.expr, mx=(o.mira?o.mira[0]:0), my=(o.mira?o.mira[1]:0);
  const L='#2a1626';
  const T=`transform="translate(${ex} ${ey}) scale(${lado} 1)"`;
  if(e==='feliz'||e==='orgulloso') return `<g ${T}><path d="M-11 3 Q0 -11 11 3" fill="none" stroke="${L}" stroke-width="3.6" stroke-linecap="round"/><path d="M11 2 l4 -3" stroke="${L}" stroke-width="2.4" stroke-linecap="round"/></g>`;
  const ix=mx*4*lado, iy=my*3;
  const lid={timido:.32,concentrado:.36,triste:.18,cansado:.4}[e]||0;
  const ry={sorpresa:1.1}[e]||1;
  const blanco=`M-12 -3 Q-11 ${-15*ry} 0 ${-15*ry} Q12 ${-15*ry} 12 -3 Q12 13 0 14 Q-12 13 -12 -3Z`;
  let s=`<g ${T}><clipPath id="${clipId}${lado>0?'d':'i'}"><path d="${blanco}"/></clipPath>`;
  s+=`<path d="${blanco}" fill="#fff"/>`;
  s+=`<g clip-path="url(#${clipId}${lado>0?'d':'i'})"><ellipse cx="${ix}" cy="${2+iy}" rx="9.4" ry="${e==='sorpresa'?10:11.8}" fill="url(#${irisId})"/>`;
  s+=`<ellipse cx="${ix}" cy="${3+iy}" rx="${e==='sorpresa'?3:4.4}" ry="${e==='sorpresa'?4.2:6}" fill="#1a0f1c"/>`;
  s+=`<path d="M-12 -6 Q0 -13 12 -6 L12 -16 L-12 -16Z" fill="#2a1626" opacity=".18"/>`;
  s+=`<ellipse cx="${ix-3.6*lado}" cy="${-3.5+iy}" rx="3.6" ry="4.2" fill="#fff"/><circle cx="${ix+3.6*lado}" cy="${7+iy}" r="1.7" fill="#fff" opacity=".9"/></g>`;
  if(lid>0) s+=`<path d="M-14 -19 L15 -19 L15 ${-15+29*lid} Q0 ${-13+29*lid} -14 ${-14+29*lid}Z" fill="${p.piel}"/>`;
  const dy=lid*29;
  s+=`<path transform="translate(0 ${f1(dy*.92)})" d="M-13 -1 Q-12 -17 0 -17.6 Q11 -17.6 15 -6 L18.5 -9.5 Q15.5 -1 12.2 -2.5 Q11 -14 0 -14.6 Q-10 -14.2 -11 -1 Z" fill="${L}"/>`;
  s+=`<path d="M3 13.4 Q9.5 11.6 11.6 6.5" fill="none" stroke="${L}" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>`;
  return s+'</g>';
}
function cejas(e,p){
  const c=mezcla(p.pelo,'#2a1626',.35), k=`fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"`;
  const b=(lado,a,m,z)=>`<path transform="translate(${21*lado} 0) scale(${lado} 1)" d="M-10 ${a} Q1 ${m} 11 ${z}" ${k}/>`;
  switch(e){
    case 'duda': return b(-1,-25,-29,-26)+b(1,-31,-37,-32);
    case 'pensando': return b(-1,-26,-30,-27)+b(1,-30,-36,-31);
    case 'triste': case 'timido': return b(-1,-30,-29,-24)+b(1,-30,-29,-24);
    case 'sorpresa': return b(-1,-33,-39,-33)+b(1,-33,-39,-33);
    case 'concentrado': return b(-1,-23,-25,-25)+b(1,-23,-25,-25);
    case 'preocupado': return b(-1,-31,-30,-25)+b(1,-31,-30,-25);
    default: return b(-1,-26,-31,-27)+b(1,-26,-31,-27);
  }
}
function boca(e,p){
  const L='#5a1f2c', k=`fill="none" stroke="${L}" stroke-width="2.4" stroke-linecap="round"`;
  switch(e){
    case 'feliz': return `<path d="M-13 30 Q0 50 13 30 Q0 34 -13 30Z" fill="#8a2f3c" stroke="${L}" stroke-width="1.6" stroke-linejoin="round"/><path d="M-11 31 Q0 34 11 31 L10 33.6 Q0 36 -10 33.6Z" fill="#fff"/><path d="M-6 41 Q0 37 6 41 Q0 45 -6 41Z" fill="#ff8b9a"/>`;
    case 'contento': case 'orgulloso': return `<path d="M-10 32 Q0 44 10 32 Q0 36 -10 32Z" fill="#8a2f3c" stroke="${L}" stroke-width="1.5" stroke-linejoin="round"/><path d="M-4 39 Q0 37 4 39 Q0 41 -4 39Z" fill="#ff8b9a"/>`;
    case 'neutral': return `<path d="M-6 36 Q0 37.6 6 36" ${k}/>`;
    case 'duda': return `<path d="M-8 37 Q-4 33 0 37 T8 36" ${k}/>`;
    case 'triste': case 'preocupado': return `<path d="M-8 39 Q0 32 8 39" ${k}/>`;
    case 'sorpresa': return `<ellipse cx="0" cy="38" rx="5.5" ry="7.5" fill="#8a2f3c" stroke="${L}" stroke-width="1.6"/>`;
    case 'pensando': return `<path d="M-3 37 Q3 39.5 9 34" ${k}/>`;
    case 'timido': return `<path d="M-5 36 Q0 39.5 5 36" ${k}/>`;
    case 'concentrado': return `<path d="M-6 36 Q0 38 6 36" ${k}/><path d="M3 37 q3 5 6 1" fill="#ff8b9a" stroke="${L}" stroke-width="1.4"/>`;
    case 'habla': return `<path d="M-7 33 Q0 43 7 33 Q0 35 -7 33Z" fill="#8a2f3c" stroke="${L}" stroke-width="1.5"/>`;
    default: return `<path d="M-9 33 Q0 41 9 33" ${k}/>`;
  }
}
/* ---- pelo ---- */
function flecos(pts,yL,yR,top=-88){
  let d=`M-55 ${yL} C-60 -56 -34 ${top} 0 ${top} C34 ${top} 60 -56 55 ${yR}`;
  let px=55, py=yR;
  for(const [x,y] of pts){ const cx=f1(px+(x-px)*.65), cy=f1(Math.min(py,y)+Math.abs(y-py)*.2); d+=` Q${cx} ${cy} ${x} ${y}`; px=x; py=y; }
  return d+` Q-56 ${yL-10} -55 ${yL}Z`;
}
function brilloPelo(p,y=-64,ancho=38){ return `<path d="M${-ancho} ${y+6} Q0 ${y-14} ${ancho} ${y+6}" fill="none" stroke="${clr(p.pelo,.42)}" stroke-width="7" stroke-linecap="round" stroke-dasharray="20 9 28 9 14 40" opacity=".55"/>`; }
function hebilla(x,y,c,r=0){ return `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 L-11 -8 Q-14 0 -11 8Z M0 0 L11 -8 Q14 0 11 8Z" fill="${c}" stroke="${lin(c)}" stroke-width="1.4"/><circle r="3.6" fill="${clr(c,.25)}" stroke="${lin(c)}" stroke-width="1.4"/></g>`; }
function peloAtras(p){
  const c=p.pelo, o=osc(c,.18), L=lin(c), k=`stroke="${L}" stroke-width="2" stroke-linejoin="round"`;
  switch(p.peinado){
    case 'largo': return `<path d="M-57 -24 C-70 30 -66 80 -56 108 Q-48 116 -40 104 L40 104 Q48 116 56 108 C66 80 70 30 57 -24Z" fill="${o}" ${k}/>`;
    case 'coletas': return [-1,1].map(l=>`<g transform="scale(${l} 1)"><path d="M48 -50 C80 -64 104 -30 98 10 C94 46 82 76 70 96 C72 66 70 40 62 20 C58 0 54 -20 48 -30Z" fill="${c}" ${k}/><path d="M66 -30 C84 -20 90 10 84 40" fill="none" stroke="${o}" stroke-width="5" stroke-linecap="round"/><path d="M70 -46 C90 -40 98 -14 96 6" fill="none" stroke="${clr(c,.4)}" stroke-width="4" stroke-linecap="round" opacity=".5"/></g>`).join('');
    case 'rulos': { let s=''; const R=[[-60,-40,26],[-66,-6,24],[-58,24,22],[60,-40,26],[66,-6,24],[58,24,22],[-40,-74,28],[-12,-90,28],[18,-90,28],[44,-72,28]]; R.forEach(([x,y,r])=>{s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${o}" ${k}/>`;}); s+=`<circle cx="0" cy="-30" r="58" fill="${o}"/>`; R.forEach(([x,y,r])=>{s+=`<path d="M${x-r*.5} ${y-r*.3} q${r*.5} -${r*.4} ${r} 0" fill="none" stroke="${clr(c,.25)}" stroke-width="3" opacity=".6"/>`;}); return s; }
    case 'rodete': return `<circle cx="0" cy="-92" r="25" fill="${c}" ${k}/><path d="M-14 -96 Q0 -112 14 -98 M-10 -86 Q2 -80 14 -88" fill="none" stroke="${o}" stroke-width="3" stroke-linecap="round"/><path d="M-12 -104 Q-2 -112 8 -108" fill="none" stroke="${clr(c,.4)}" stroke-width="3.5" stroke-linecap="round" opacity=".6"/>`;
    case 'melena': return `<path d="M-60 -30 C-68 10 -64 40 -54 56 Q-40 62 -30 52 L30 52 Q40 62 54 56 C64 40 68 10 60 -30Z" fill="${o}" ${k}/>`;
    case 'trenza': return `<path d="M-56 -24 C-62 0 -58 14 -48 22 Q0 34 48 22 C58 14 62 0 56 -24Z" fill="${o}" ${k}/>`;
    case 'puntas': return `<path d="M-56 -8 Q-70 -26 -76 -42 Q-62 -44 -56 -50 Q-70 -70 -68 -86 Q-50 -80 -36 -80 Q-36 -100 -28 -112 Q-14 -98 -4 -92 Q6 -112 14 -120 Q20 -100 24 -92 Q38 -104 52 -106 Q50 -88 46 -78 Q62 -78 76 -72 Q66 -58 58 -48 Q70 -40 78 -26 Q64 -22 56 -8Z" fill="${c}" ${k}/>`;
    default: return '';
  }
}
function peloFrente(p){
  const c=p.pelo, o=osc(c,.2), L=lin(c), k=`stroke="${L}" stroke-width="2" stroke-linejoin="round"`;
  const lat=(l,largo=30,ancho=10)=>`<path transform="scale(${l} 1)" d="M48 -40 Q62 0 56 ${largo} Q52 ${largo+10} 46 ${largo-4} Q${50-ancho*.2} 10 ${44-ancho*.3} -14Z" fill="${c}" ${k}/>`;
  switch(p.peinado){
    case 'corto': return `<path d="${flecos([[44,-30],[36,-10],[26,-34],[14,-12],[2,-38],[-10,-16],[-22,-36],[-32,-12],[-42,-30]],-4,-4,-92)}" fill="${c}" ${k}/>`+lat(1,6,8)+lat(-1,6,8)+`<path d="M6 -90 Q14 -108 28 -104 Q18 -100 16 -88" fill="${c}" ${k}/>`+brilloPelo(p,-66,34);
    case 'puntas': return `<path d="${flecos([[46,-34],[38,-4],[26,-36],[16,-6],[4,-40],[-8,-8],[-20,-38],[-30,-6],[-42,-32]],-2,-2,-90)}" fill="${c}" ${k}/>`+lat(1,8,8)+lat(-1,8,8)+brilloPelo(p,-66,34);
    case 'flequillo': return `<path d="${flecos([[46,-24],[38,-2],[28,-22],[18,2],[8,-20],[-4,4],[-16,-18],[-28,0],[-40,-22]],0,0,-92)}" fill="${c}" ${k}/>`+lat(1,14,10)+lat(-1,14,10)+brilloPelo(p,-68,36);
    case 'largo': return `<path d="M8 -86 C30 -86 56 -66 56 -20 Q50 -40 40 -46 Q42 -26 30 -10 Q32 -34 22 -50 Q14 -30 0 -22 Q8 -44 6 -60 Q-10 -36 -34 -24 Q-22 -40 -20 -52 Q-36 -38 -54 -14 C-58 -60 -30 -88 8 -86Z" fill="${c}" ${k}/>`+`<path d="M50 -34 Q60 10 56 70 Q53 80 48 70 Q50 30 44 -4Z" fill="${c}" ${k}/><path d="M-50 -34 Q-60 10 -56 70 Q-53 80 -48 70 Q-50 30 -44 -4Z" fill="${c}" ${k}/>`+brilloPelo(p,-68,36)+(p.acc?hebilla(-38,-50,p.acc,-20):'');
    case 'coletas': return `<path d="${flecos([[46,-26],[36,-6],[26,-28],[14,-4],[2,-30],[-10,-6],[-22,-28],[-34,-6],[-44,-26]],-6,-6,-90)}" fill="${c}" ${k}/>`+lat(1,20,10)+lat(-1,20,10)+hebilla(-54,-48,p.acc||'#ff5d8f',-30)+hebilla(54,-48,p.acc||'#ff5d8f',30)+brilloPelo(p,-66,36);
    case 'rulos': { let s=`<path d="M-56 -10 C-60 -60 -30 -86 0 -86 C30 -86 60 -60 56 -10 Q46 -30 34 -30 Q24 -18 12 -30 Q0 -20 -12 -30 Q-24 -18 -34 -30 Q-46 -30 -56 -10Z" fill="${c}" ${k}/>`; [[-40,-30],[-20,-28],[0,-30],[20,-28],[40,-30],[-50,-12],[50,-12]].forEach(([x,y])=>{s+=`<circle cx="${x}" cy="${y}" r="11" fill="${c}" ${k}/><path d="M${x-5} ${y-3} q5 -4 10 0" fill="none" stroke="${clr(c,.3)}" stroke-width="2.4" opacity=".7"/>`;}); s+=`<path d="M-52 -46 Q0 -78 52 -46" fill="none" stroke="${p.acc||'#ff5d8f'}" stroke-width="9" stroke-linecap="round"/><path d="M-50 -48 Q0 -79 50 -48" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/>`; return s; }
    case 'rodete': return `<path d="M0 -88 C34 -88 58 -64 56 -16 Q48 -40 30 -50 Q24 -30 8 -24 Q14 -46 2 -62 Q-14 -40 -40 -34 Q-48 -26 -56 -14 C-58 -62 -32 -88 0 -88Z" fill="${c}" ${k}/>`+lat(1,8,8)+lat(-1,8,8)+brilloPelo(p,-68,32)+(p.acc?hebilla(28,-78,p.acc,20):'');
    case 'melena': return `<path d="${flecos([[46,-20],[36,-4],[26,-18],[14,-2],[2,-18],[-10,-2],[-22,-18],[-34,-4],[-46,-20]],-10,-10,-92)}" fill="${c}" ${k}/>`+`<path d="M54 -40 Q66 10 58 54 Q48 60 42 50 Q48 20 40 -10Z" fill="${c}" ${k}/><path d="M-54 -40 Q-66 10 -58 54 Q-48 60 -42 50 Q-48 20 -40 -10Z" fill="${c}" ${k}/>`+brilloPelo(p,-68,38)+(p.acc?hebilla(40,-52,p.acc,25):'');
    case 'trenza': { let s=`<path d="M-4 -88 C30 -90 58 -64 56 -18 Q46 -42 28 -46 Q30 -28 18 -18 Q18 -40 6 -54 Q-12 -32 -38 -28 Q-48 -22 -56 -12 C-60 -60 -34 -86 -4 -88Z" fill="${c}" ${k}/>`+lat(-1,10,8);
      s+=`<path d="M48 -30 Q62 -8 58 12" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/>`;
      for(let i=0;i<5;i++){ const y=10+i*20, x=58-i*1.5; s+=`<ellipse cx="${x}" cy="${y}" rx="11" ry="13" fill="${c}" ${k}/><path d="M${x-7} ${y-4} q7 6 14 0" fill="none" stroke="${o}" stroke-width="2.4"/>`; }
      s+=`<rect x="48" y="104" width="18" height="8" rx="4" fill="${p.acc||'#7bdff2'}" stroke="${lin(p.acc||'#7bdff2')}" stroke-width="1.4"/><path d="M50 112 q7 14 14 0" fill="${c}" ${k}/>`;
      return s+brilloPelo(p,-68,34); }
    default: return '';
  }
}
/* ---- cabeza completa en coordenadas locales (centro de la cara = 0,0) ---- */
function cabeza(p,o){
  const e=o.expr||'contento', P=p.piel, Ls=lin(P), gid=uid('ir'), cid=uid('cl');
  let s=`<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${osc(p.ojos,.45)}"/><stop offset=".55" stop-color="${p.ojos}"/><stop offset="1" stop-color="${clr(p.ojos,.45)}"/></linearGradient></defs>`;
  if(!o.sinAtras) s+=peloAtras(p);
  s+=`<ellipse cx="-50" cy="6" rx="8" ry="11" fill="${P}" stroke="${Ls}" stroke-width="1.8"/><ellipse cx="50" cy="6" rx="8" ry="11" fill="${P}" stroke="${Ls}" stroke-width="1.8"/><path d="M-51 2 q3 4 0 9 M51 2 q-3 4 0 9" fill="none" stroke="${osc(P,.25)}" stroke-width="2"/>`;
  s+=`<path d="M-51 -12 C-53 -52 -30 -68 0 -68 C30 -68 53 -52 51 -12 C50 16 38 38 18 52 Q0 62 -18 52 C-38 38 -50 16 -51 -12Z" fill="${P}" stroke="${Ls}" stroke-width="2"/>`;
  s+=`<path d="M30 40 C42 26 50 10 51 -12 C46 14 36 32 18 46Z" fill="${osc(P,.1)}" opacity=".8"/>`;
  s+=`<path d="M-50 -26 Q0 -10 50 -26 L50 -40 Q0 -22 -50 -40Z" fill="${osc(P,.14)}" opacity=".7"/>`;
  s+=`<ellipse cx="-31" cy="24" rx="12" ry="7" fill="url(#g-rubor)"/><ellipse cx="31" cy="24" rx="12" ry="7" fill="url(#g-rubor)"/>`;
  if(e==='timido') s+=`<ellipse cx="-31" cy="24" rx="14" ry="8" fill="url(#g-rubor)"/><ellipse cx="31" cy="24" rx="14" ry="8" fill="url(#g-rubor)"/>`;
  s+=ojo(-21,6,-1,p,o,cid,gid)+ojo(21,6,1,p,o,cid,gid)+cejas(e,p);
  s+=`<path d="M1.5 21 q-2.4 4.4 1 5.6" fill="none" stroke="${osc(P,.38)}" stroke-width="1.8" stroke-linecap="round"/>`;
  s+=boca(e,p);
  if(e==='duda') s+=`<path d="M58 -40 q6 10 0 15 q-6 -5 0 -15z" fill="#9ad6ff" stroke="#4a86b8" stroke-width="1.4"/>`;
  s+=peloFrente(p);
  if(p.anteojos) s+=`<g fill="rgba(255,255,255,.12)" stroke="#2f2440" stroke-width="2.6"><rect x="-36" y="-8" width="30" height="26" rx="10"/><rect x="6" y="-8" width="30" height="26" rx="10"/><path d="M-6 0 Q0 -4 6 0" fill="none"/></g><path d="M-30 -4 l8 8 M12 -4 l8 8" stroke="#fff" stroke-width="2" opacity=".6"/>`;
  if(o.auris) s+=`<path d="M-56 4 Q-60 -84 0 -84 Q60 -84 56 4" fill="none" stroke="#e2557a" stroke-width="7"/><rect x="-66" y="-12" width="16" height="30" rx="7" fill="#e2557a" stroke="#7a2140" stroke-width="1.6"/><rect x="50" y="-12" width="16" height="30" rx="7" fill="#e2557a" stroke="#7a2140" stroke-width="1.6"/>`;
  return s;
}
/* ---- manos y brazos ---- */
function mano(t,P){
  const L=lin(P), k=`fill="${P}" stroke="${L}" stroke-width="1.8" stroke-linejoin="round"`;
  if(t==='senala') return `<path d="M-8 -2 Q-10 10 -4 14 L6 14 Q10 8 8 -2Z" ${k}/><path d="M-2 12 Q-3 30 0 34 Q4 34 4 28 L4 12Z" ${k}/>`;
  if(t==='abierta') return `<path d="M-9 -2 Q-12 12 -8 20 Q0 26 8 20 Q12 12 9 -2Z" ${k}/><path d="M-6 18 v6 M-1 20 v7 M4 19 v6" stroke="${L}" stroke-width="1.6" stroke-linecap="round"/><path d="M8 4 Q16 6 14 14" fill="none" stroke="${L}" stroke-width="1.8" stroke-linecap="round"/>`;
  return `<path d="M-9 -2 Q-12 10 -7 16 Q0 21 7 16 Q12 10 9 -2Z" ${k}/><path d="M7 4 Q12 8 9 12" fill="none" stroke="${L}" stroke-width="1.6" stroke-linecap="round"/>`;
}
function brazo(sx,sy,u,f,p,tipoMano,manga){
  const R=p.saco||p.remera, P=p.piel, L=lin(R), LP=lin(P), rel=f-u;
  const sup=manga==='larga'?R:R;
  let s=`<g transform="translate(${sx} ${sy}) rotate(${u})">`;
  s+=`<path d="M-11 -6 Q-12 30 -9 52 L9 52 Q12 30 11 -6 Q0 -12 -11 -6Z" fill="${sup}" stroke="${L}" stroke-width="2"/><path d="M4 -6 Q11 20 9 50 L3 50Z" fill="${osc(R,.14)}"/>`;
  s+=`<g transform="translate(0 46) rotate(${rel})">`;
  if(manga==='larga') s+=`<path d="M-9 -4 L-8 40 L8 40 L9 -4Z" fill="${R}" stroke="${L}" stroke-width="2"/><path d="M-9 34 h18 v6 h-18z" fill="${osc(R,.18)}"/>`;
  else s+=`<path d="M-7.5 -4 Q-8.5 20 -7 42 L7 42 Q8.5 20 7.5 -4Z" fill="${P}" stroke="${LP}" stroke-width="1.8"/><path d="M-11 -2 L11 -2 L10 8 L-10 8Z" fill="${R}" stroke="${L}" stroke-width="2"/>`;
  s+=`<g transform="translate(0 40)">${mano(tipoMano,P)}</g></g></g>`;
  return s;
}
/* poses: [hombro, antebrazo] por brazo (ángulo global desde abajo; + hacia la izquierda de la pantalla) */
const POSE={
  reposo:{i:[10,4],d:[-10,-4]},
  saluda:{i:[10,4],d:[-128,-172],md:'abierta'},
  senala:{i:[10,4],d:[-74,-92],md:'senala'},
  senalaIzq:{i:[74,92],d:[-10,-4],mi:'senala'},
  senalaArriba:{i:[10,4],d:[-148,-166],md:'senala'},
  piensa:{i:[16,-40],d:[-40,148]},
  festeja:{i:[148,172],d:[-148,-172],mi:'abierta',md:'abierta'},
  sostiene:{i:[18,-62],d:[-18,62]},
  mesa:{i:[14,-48],d:[-14,48]},
  timida:{i:[12,-34],d:[-12,34]},
  explica:{i:[18,-60],d:[-60,-110],md:'abierta'},
  andador:{i:[12,-6],d:[-12,6]},
  ofrece:{i:[10,4],d:[-40,-70],md:'abierta'},
  pinta:{i:[14,-48],d:[-30,40]}
};
/* ---- ropa / cuerpo ---- */
function estampa(t,p){
  switch(t){
    case 'estrella': return `<path d="M-10 -196 l3.5 7 7.5 1 -5.5 5.3 1.4 7.6 -6.9 -3.6 -6.9 3.6 1.4 -7.6 -5.5 -5.3 7.5 -1z" fill="#fff36b" stroke="#c4861c" stroke-width="1.3"/>`;
    case 'rayas': return `<path d="M-34 -196 h68 v7 h-68z M-34 -176 h68 v7 h-68z" fill="#fff" opacity=".55"/>`;
    case 'flor': return `<g transform="translate(-10 -186)">${[0,72,144,216,288].map(a=>`<circle cx="${f1(Math.cos(a*Math.PI/180)*6)}" cy="${f1(Math.sin(a*Math.PI/180)*6)}" r="4.6" fill="#ff5d8f"/>`).join('')}<circle r="3.6" fill="#fff"/></g>`;
    case 'dino': return `<path d="M-22 -176 q2 -12 12 -12 q5 -9 12 -5 q-2 5 -7 5 v12 h-3 v-6 h-7 v6 h-3z" fill="#5cd65c" stroke="#2f7a3a" stroke-width="1.4"/>`;
    case 'cohete': return `<path d="M-10 -200 q8 8 7 18 h-14 q-1 -10 7 -18z" fill="#fff" stroke="#5a4a8a" stroke-width="1.4"/><path d="M-13 -182 l3 7 3 -7z" fill="#ff8a3d"/>`;
    case 'corazon': return `<path d="M-10 -176 C-22 -186 -18 -198 -10 -191 C-2 -198 2 -186 -10 -176Z" fill="#fff" stroke="#b03a5a" stroke-width="1.4"/>`;
    case 'barco': return `<path d="M-20 -184 h20 l-4 7 h-12z M-10 -184 v-14 l9 10z" fill="#fff" stroke="#8a5a10" stroke-width="1.4"/>`;
    case 'numero': return `<text x="0" y="-172" text-anchor="middle" font-family="Lilita One,Arial Rounded MT Bold,sans-serif" font-size="30" fill="#fff" opacity=".9">7</text>`;
    case 'bolsillo': return `<path d="M8 -200 h16 v14 q-8 4 -16 0z" fill="${osc(p.remera,.1)}" stroke="${lin(p.remera)}" stroke-width="1.4"/>`;
    case 'buzo': return `<path d="M-22 -170 L22 -170 L26 -146 L-26 -146Z" fill="${osc(p.remera,.12)}" stroke="${lin(p.remera)}" stroke-width="1.4"/><path d="M-6 -236 L-8 -206 M6 -236 L8 -206" stroke="#f4ead2" stroke-width="2.4" stroke-linecap="round"/><path d="M-30 -232 Q0 -214 30 -232" fill="none" stroke="${osc(p.remera,.25)}" stroke-width="5"/>`;
    case 'cuello': return `<path d="M-14 -236 L-2 -222 L-6 -236Z M14 -236 L2 -222 L6 -236Z" fill="#fff" stroke="#b03a5a" stroke-width="1.4"/>`;
    default: return '';
  }
}
function torso(p,dy){
  const R=p.remera, L=lin(R);
  let s=`<g transform="translate(0 ${dy})">`;
  s+=`<path d="M-9 -252 L9 -252 L10 -230 L-10 -230Z" fill="${osc(p.piel,.12)}" stroke="${lin(p.piel)}" stroke-width="1.6"/>`;
  s+=`<path d="M-36 -224 Q-38 -234 -26 -236 L-13 -239 Q0 -228 13 -239 L26 -236 Q38 -234 36 -224 L35 -150 Q35 -136 20 -136 L-20 -136 Q-35 -136 -35 -150Z" fill="${R}" stroke="${L}" stroke-width="2"/>`;
  s+=`<path d="M17 -237 L26 -236 Q38 -234 36 -224 L35 -150 Q35 -136 20 -136 L12 -136 Q24 -186 17 -237Z" fill="${osc(R,.13)}"/>`;
  s+=`<path d="M-13 -239 Q0 -226 13 -239" fill="none" stroke="${L}" stroke-width="2"/><path d="M-12 -238 Q0 -230 12 -238 Q0 -234 -12 -238Z" fill="${osc(p.piel,.2)}"/>`;
  s+=`<path d="M-24 -200 Q-20 -180 -24 -160" fill="none" stroke="${osc(R,.18)}" stroke-width="1.6" opacity=".7"/>`;
  if(p.estampa==='cardigan') s+=`<path d="M-36 -224 Q-38 -234 -26 -236 L-13 -239 L-4 -136 L-20 -136 Q-35 -136 -35 -150Z" fill="${p.saco}" stroke="${lin(p.saco)}" stroke-width="2"/><path d="M36 -224 Q38 -234 26 -236 L13 -239 L4 -136 L20 -136 Q35 -136 35 -150Z" fill="${osc(p.saco,.1)}" stroke="${lin(p.saco)}" stroke-width="2"/><circle cx="-8" cy="-196" r="2.6" fill="#ffd23f"/><circle cx="-7" cy="-172" r="2.6" fill="#ffd23f"/>`;
  else s+=estampa(p.estampa,p);
  return s+'</g>';
}
function piernas(p){
  const C=p.abajoC, L=lin(C), P=p.piel, z=p.zap, LZ=lin(z), m=p.medias;
  const zap=x=>`<path d="M${x-15} -2 Q${x-16} -16 ${x-2} -17 Q${x+15} -17 ${x+16} -4 Q${x+16} 2 ${x+10} 2 L${x-12} 2 Q${x-16} 2 ${x-15} -2Z" fill="${z}" stroke="${LZ}" stroke-width="1.8"/><path d="M${x-14} -3 h29" stroke="#fff" stroke-width="2.6" opacity=".85"/><path d="M${x-6} -14 q4 -3 9 0" fill="none" stroke="${clr(z,.5)}" stroke-width="2" opacity=".8"/>`;
  let s='';
  const pierna=(x,piel)=>`<path d="M${x-9} -140 L${x-8} -16 L${x+8} -16 L${x+9} -140Z" fill="${piel?P:C}" stroke="${lin(piel?P:C)}" stroke-width="1.8"/>`;
  if(p.abajo==='pantalon'){
    s+=`<path d="M-30 -146 L-2 -146 L-3 -18 L-25 -18Z" fill="${C}" stroke="${L}" stroke-width="2"/><path d="M2 -146 L30 -146 L25 -18 L3 -18Z" fill="${C}" stroke="${L}" stroke-width="2"/><path d="M14 -146 L30 -146 L25 -18 L18 -18Z" fill="${osc(C,.14)}"/><path d="M-25 -30 h22 M3 -30 h22" stroke="${clr(C,.2)}" stroke-width="2.4"/>`;
  } else {
    s+=pierna(-14,true)+pierna(14,true);
    if(m) s+=`<path d="M-22 -50 L-22 -16 L-6 -16 L-6 -50Z M6 -50 L6 -16 L22 -16 L22 -50Z" fill="${m}" stroke="${lin(m)}" stroke-width="1.6"/>`;
    if(p.abajo==='short') s+=`<path d="M-33 -148 L33 -148 L35 -96 L4 -96 L0 -112 L-4 -96 L-35 -96Z" fill="${C}" stroke="${L}" stroke-width="2"/><path d="M14 -148 L33 -148 L35 -96 L18 -96Z" fill="${osc(C,.14)}"/>`;
    else s+=`<path d="M-34 -150 L34 -150 L46 -88 Q0 -80 -46 -88Z" fill="${C}" stroke="${L}" stroke-width="2"/><path d="M14 -150 L34 -150 L46 -88 Q30 -84 22 -84Z" fill="${osc(C,.14)}"/><path d="M-20 -146 L-26 -88 M0 -146 L0 -84" stroke="${osc(C,.2)}" stroke-width="1.6"/>`;
  }
  s+=zap(-14)+zap(14);
  return s;
}
/* ---- silla de ruedas y andador ---- */
function sillaAtras(){
  return `<path d="M-46 -250 L-42 -120 M46 -250 L42 -120" stroke="#55607a" stroke-width="7" stroke-linecap="round"/><path d="M-50 -254 h12 M38 -254 h12" stroke="#2c3247" stroke-width="10" stroke-linecap="round"/><path d="M-40 -234 L40 -234 L38 -150 L-38 -150Z" fill="#3a4466" stroke="#252b40" stroke-width="2"/>`;
}
function sillaFrente(){
  let s='';
  const rueda=(cx,cy,rx,ry,front)=>{ let r=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2c3247" stroke="#1a1e2e" stroke-width="2"/><ellipse cx="${cx}" cy="${cy}" rx="${rx-7}" ry="${ry-8}" fill="none" stroke="url(#g-metal)" stroke-width="3"/>`;
    for(let a=0;a<180;a+=30){ const c=Math.cos(a*Math.PI/180), sn=Math.sin(a*Math.PI/180); r+=`<line x1="${f1(cx+c*(rx-8))}" y1="${f1(cy+sn*(ry-9))}" x2="${f1(cx-c*(rx-8))}" y2="${f1(cy-sn*(ry-9))}" stroke="#9aa6c0" stroke-width="1.4" opacity="${front?.9:.5}"/>`; }
    r+=`<ellipse cx="${cx}" cy="${cy}" rx="6" ry="7" fill="#9aa6c0"/><ellipse cx="${cx}" cy="${cy}" rx="${rx+3}" ry="${ry+3}" fill="none" stroke="#9aa6c0" stroke-width="2.4" opacity=".9"/>`; return r; };
  s+=rueda(-52,-70,22,66,true)+rueda(52,-70,22,66,true);
  s+=`<path d="M-34 -132 L34 -132 L30 -104 L-30 -104Z" fill="#46507a" stroke="#252b40" stroke-width="2"/>`;
  s+=`<path d="M-22 -30 L-30 -14 L30 -14 L22 -30Z" fill="#55607a" stroke="#252b40" stroke-width="2"/><path d="M-20 -104 L-22 -30 M20 -104 L22 -30" stroke="#55607a" stroke-width="5"/>`;
  s+=`<circle cx="-34" cy="-8" r="8" fill="#2c3247"/><circle cx="34" cy="-8" r="8" fill="#2c3247"/>`;
  return s;
}
function piernasSentado(p){
  const C=p.abajoC, L=lin(C), z=p.zap, LZ=lin(z);
  let s=`<path d="M-34 -150 L34 -150 L36 -116 Q0 -108 -36 -116Z" fill="${C}" stroke="${L}" stroke-width="2"/>`;
  s+=`<path d="M-26 -118 L-4 -118 L-6 -34 L-24 -34Z M4 -118 L26 -118 L24 -34 L6 -34Z" fill="${C}" stroke="${L}" stroke-width="2"/><path d="M14 -118 L26 -118 L24 -34 L16 -34Z" fill="${osc(C,.14)}"/>`;
  [-15,15].forEach(x=>{ s+=`<path d="M${x-13} -24 Q${x-14} -38 ${x-1} -38 Q${x+13} -38 ${x+14} -26 Q${x+14} -20 ${x+9} -20 L${x-10} -20 Q${x-14} -20 ${x-13} -24Z" fill="${z}" stroke="${LZ}" stroke-width="1.8"/>`; });
  return s;
}
function andador(){
  return `<g><path d="M-46 -138 L-50 -10 M46 -138 L50 -10" stroke="url(#g-metal)" stroke-width="7" stroke-linecap="round"/><path d="M-48 -60 L48 -60" stroke="#8592ad" stroke-width="6" stroke-linecap="round"/><rect x="-55" y="-146" width="18" height="18" rx="5" fill="#3d4a66"/><rect x="37" y="-146" width="18" height="18" rx="5" fill="#3d4a66"/><circle cx="-50" cy="-6" r="9" fill="#2c3247" stroke="#9aa6c0" stroke-width="2"/><circle cx="50" cy="-6" r="9" fill="#2c3247" stroke="#9aa6c0" stroke-width="2"/></g>`;
}
/* tablero de comunicación que sostiene Tomás */
function tableroMano(pictos){
  let s=`<g transform="translate(0 -170)"><rect x="-46" y="-30" width="92" height="64" rx="8" fill="#fff8e6" stroke="#8a6a3a" stroke-width="2"/>`;
  const ps=pictos||['sol','pelota','arbol','casa','si','no'];
  ps.slice(0,6).forEach((k,i)=>{ const x=-40+(i%3)*28, y=-25+Math.floor(i/3)*29; s+=`<rect x="${x}" y="${y}" width="24" height="25" rx="4" fill="#fff" stroke="#c9b48a" stroke-width="1.2"/><g transform="translate(${x+12} ${y+12.5}) scale(.28)">${picto(k)}</g>`; });
  return s+'</g>';
}
/* ---- personaje completo ---- */
function chico(nombre,o={}){
  const p=Object.assign({},CAST[nombre]||CAST.luna,o.p||{});
  o=Object.assign({x:0,y:0,s:1,expr:'contento',pose:'reposo',mira:null,tilt:0,flip:false,clase:'',id:'',extra:'',delante:''},o);
  const sent=p.silla && o.sentado!==false, dy=sent?38:0;
  const pose=POSE[o.pose]||POSE.reposo;
  const larga=p.saco?'larga':(p.manga||'corta');
  const HY=-300+dy;
  let g=sombraPiso(0,0,sent?82:48,sent?14:9,.32);
  if(sent) g+=sillaAtras();
  const hs0=p.adulta?.86:p.teen?.82:1, HYc=HY+(1-hs0)*54;
  g+=`<g transform="translate(0 ${HYc}) rotate(${o.tilt}) scale(${hs0})">${peloAtras(p)}</g>`;
  const hs=p.adulta?.86:p.teen?.82:1;
  /* cabeza detrás si hace falta (pelo largo atrás ya dentro de cabeza) */
  if(!sent) g+=piernas(p); else g+=piernasSentado(p);
  const brazoI=brazo(-35,-226+dy,pose.i[0],pose.i[1],p,pose.mi||'puno',larga);
  const brazoD=brazo(35,-226+dy,pose.d[0],pose.d[1],p,pose.md||'puno',larga);
  const delanteBrazos=['sostiene','mesa','timida','piensa','explica','pinta'].includes(o.pose);
  if(!delanteBrazos){ g+=brazoI+brazoD; }
  g+=torso(p,dy);
  if(sent) g+=sillaFrente();
  g+=`<g transform="translate(0 ${HYc}) rotate(${o.tilt}) scale(${hs})">${cabeza(p,Object.assign({},o,{sinAtras:true}))}</g>`;
  if(delanteBrazos){ g+=o.delante+brazoI+brazoD; }
  if(p.andador) g+=andador();
  if(o.pose==='sostiene' && o.tablero) g+=tableroMano(o.tablero);
  g+=o.extra;
  const S=o.s*(p.adulta?1.18:p.teen?1.12:1);
  return `<g ${o.id?`id="${o.id}"`:''} class="pj pj-${nombre}" transform="translate(${o.x} ${o.y}) scale(${o.flip?-S:S} ${S})"><g class="${o.clase}">${g}</g></g>`;
}
/* busto para el diálogo */
function retrato(nombre,expr){
  if(!CAST[nombre]) return `<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">${emblema()}</svg>`;
  const p=CAST[nombre];
  return `<svg viewBox="-80 -400 160 170" aria-hidden="true" focusable="false"><circle cx="0" cy="-316" r="80" fill="${clr(p.remera,.6)}"/>${chico(nombre,{expr:expr||'contento',pose:'reposo',p:{silla:false,andador:false},sentado:false}).replace(/<ellipse[^>]*f-blur6[^>]*\/>/,'')}</svg>`;
}
function picto(k){const src=(window.BJ_PICTOS||{})[k];return src?'<image href="'+src+'" x="-42" y="-42" width="84" height="84"/>':'<circle r="30" fill="#cfe9f5"/>';}
function emblema(){return '<circle cx="60" cy="60" r="44" fill="#f1cf76"/><path d="M36 64 Q60 30 84 64" fill="none" stroke="#684593" stroke-width="8" stroke-linecap="round"/>';}
Object.assign(CAST,{
  rosa:{n:'Abuela Rosa',piel:'#d9a27c',pelo:'#d6d2dc',peinado:'rodete',ojos:'#5a3a1a',anteojos:true,remera:'#f6e7d6',estampa:'cardigan',saco:'#b0567a',abajo:'pollera',abajoC:'#3f3a5a',zap:'#5a3f45',acc:'#7bdff2',adulta:true},
  juli:{n:'Juli',piel:'#f3cba9',pelo:'#a3542a',peinado:'coletas',ojos:'#3b7a4a',remera:'#ffd23f',estampa:'flor',abajo:'pollera',abajoC:'#2f8f9d',medias:'#ffffff',zap:'#e2557a',acc:'#7bdff2'},
  lucas:{n:'Lucas',piel:'#a46a46',pelo:'#1c1210',peinado:'rulos',ojos:'#3a2412',remera:'#3fb6ff',estampa:'numero',abajo:'pantalon',abajoC:'#34405e',zap:'#ffffff'},
  mati:{n:'Mati',piel:'#e8b48e',pelo:'#2e2a28',peinado:'puntas',ojos:'#2a64a8',remera:'#ff8a3d',estampa:'cohete',abajo:'short',abajoC:'#2f5d8a',medias:'#ffffff',zap:'#5cc06b'}
});
window.BJC={chico,retrato,CAST,NOMBRE,defsGlobales,sombraPiso,mezcla,clr,osc,lin,esc,f1,uid};
})();
