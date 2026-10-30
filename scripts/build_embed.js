const fs=require('fs');
const C=JSON.parse(fs.readFileSync('data/ccaa.json'));const M=JSON.parse(fs.readFileSync('data/muni.json'));const O=JSON.parse(fs.readFileSync('data/operators.json'));
const map={'Andalucía':'01','Aragón':'02','Asturias, Principado de':'03','Balears, Illes':'04','Canarias':'05','Cantabria':'06','Castilla y León':'07','Castilla-La Mancha':'08','Cataluña':'09','Comunitat Valenciana':'10','Extremadura':'11','Galicia':'12','Madrid, Comunidad de':'13','Murcia, Región de':'14','Navarra, Comunidad Foral de':'15','País Vasco':'16','Rioja, La':'17','Ceuta y Melilla':'CM','España':'ES'};
const disp={'01':'Andalucía','02':'Aragón','03':'Asturias','04':'Illes Balears','05':'Canarias','06':'Cantabria','07':'Castilla y León','08':'Castilla-La Mancha','09':'Cataluña','10':'Comunitat Valenciana','11':'Extremadura','12':'Galicia','13':'Comunidad de Madrid','14':'Región de Murcia','15':'Navarra','16':'País Vasco','17':'La Rioja','CM':'Ceuta y Melilla','ES':'España'};
const CC={years:C.meta.years,r:{}};
for(const [n,o] of Object.entries(C.regions)){const k=map[n];if(!k)throw n;
  const flags=o.flags.map(f=>f.slice(0,4));
  CC.r[k]={n:disp[k],s:o.SUM,a:o.ANR,p:o.PR,q:o.PA,bad:flags.map(Number)};}
// consumption hogares 2024 (INE nota de prensa) only for ES and the 6 cited
CC.hog={ES:128,'06':186,'08':172,'03':161,'16':79,'09':100,'12':115};
// municipalities
const coms=[...new Set(M.muni.map(m=>m.comarca))].sort();const urls=[];const units=[];
const u=(arr,v)=>{if(v==null)return -1;let i=arr.indexOf(v);if(i<0){arr.push(v);i=arr.length-1;}return i;};
const MU={};
for(const m of M.muni){const a24=m.a24?[m.a24.anr,m.a24.pr,m.a24.ili,m.a24.f1,m.a24.anf,u(urls,m.a24.url),u(units,m.a24.unit||null)]:0;
  // Posición 7, solo si el municipio tiene otra auditoría 2024 de otra red: [ANR, URL, red mostrada, otra red]
  if(m.a24&&m.a24.alt)a24.push([m.a24.alt.anr,u(urls,m.a24.alt.url),m.a24.alt.shown,m.a24.alt.other]);
  const a22=m.aca?[m.aca.anr,m.aca.ili,m.aca.f1,m.aca.anf,u(units,m.aca.unit),m.aca.note?1:0]:0;
  // Posición 5: antes 3Cat/ACN, retirado por su licencia; se mantiene a 0 para no mover el resto
  MU[m.ine]=[m.name,coms.indexOf(m.comarca),m.pop,a24,a22,0,m.audit2024===true?1:m.audit2024===false?2:0];}
const ops={};for(const [k,v] of Object.entries(O)){if(k==='meta')continue;ops[k]=v.map(x=>x[0]);}
// España por municipio
const EM=JSON.parse(fs.readFileSync('data/espmun.json'));
const IB={};for(const [k,o] of Object.entries(EM.ib))IB[k]=[o.isla,o.p,o.r,o.t,o.c];
const em=`const PROV=${JSON.stringify(EM.prov)};\nconst MUD=${JSON.stringify(EM.mun)};\nconst POP_ES=${EM.meta.pop_es};\nconst IB=${JSON.stringify(IB)};\n`;
const out=`const CC=${JSON.stringify(CC)};\nconst COMS=${JSON.stringify(coms)};\nconst URLS=${JSON.stringify(urls)};\nconst UNITS=${JSON.stringify(units)};\nconst MU=${JSON.stringify(MU)};\nconst OPS=${JSON.stringify(ops)};\n`+em;
// Modelo de gestión del servicio de agua, Catalunya (ESF / Aigua és Vida, Datawrapper F298j v45, uso interno)
const GL=fs.readFileSync('raw/esf_gestio_aigua_cat_2026-07-10.psv','utf8').trim().split('\n').filter(l=>!l.startsWith('#'));
const GK={'Pública':'P','Privada':'V','Empresa mixta privada – pública':'M','Cooperativa / associació':'C','':'-'};
const GES={};for(const l of GL){const a=l.split('|');GES[a[0]]=[GK[a[1]],...a.slice(2)];}
// España por municipio: EIEL, SINAC y modelo de gestión (scripts/build_es_mun.js). Arrays por posición para que la página pese menos:
// [pérdidas %, fase, núcleos que informan, núcleos, % población cubierta, % múltiplos de 5, modelo, origen del modelo, grupo EIEL dominante,
//  tipo del operador SINAC dominante, reparto EIEL [código,%,...], % fibrocemento, % malo, % regular, km de red, fase de la red,
//  operadores [índice en OPN,%,responsable,...], redes SINAC, población abastecida SINAC, dotación L/hab/día]
const ES=JSON.parse(fs.readFileSync('data/es_mun.json'));
const opCount={};for(const o of Object.values(ES.mun))for(const x of o.ops||[])opCount[x[0]]=(opCount[x[0]]||0)+1;
const OPN=Object.keys(opCount).sort((a,b)=>opCount[b]-opCount[a]||(a<b?-1:1));const opIdx=Object.fromEntries(OPN.map((n,i)=>[n,i]));
const GS={esf:'f',eiel:'e',sinac:'s',pv:'p'};const n=v=>v??null;
const ESD={};for(const [k,o] of Object.entries(ES.mun))ESD[k]=[n(o.per),n(o.y),n(o.nrep),n(o.nn),n(o.cov),n(o.rnd),o.gm,GS[o.gs]||'',o.eg||'',o.st||'',
  o.g?Object.entries(o.g).flat():0,n(o.fc),n(o.em),n(o.er),n(o.km),n(o.ry),o.ops?o.ops.flatMap(x=>[opIdx[x[0]],x[1],x[2]||0]):0,n(o.nred),n(o.spop),n(o.dot)];
// Tipo de cada operador según data/operadores_clasificacion.csv, una letra por operador ('-' = sin clasificar)
const {csv,loadClassifier}=require('./build_es_mun.js');const classify=loadClassifier(csv(fs.readFileSync('data/operadores_clasificacion.csv','utf8')));
const OPT=OPN.map(x=>{const c=classify(x);return c&&c.t!=='X'?c.t:'-';}).join('');
// Grupo y fuente de la clasificación de cada operador que la tiene (FWG-1870): {índice en OPN: [grupo, URL de la fuente]}
const OPC={};OPN.forEach((x,i)=>{const c=classify(x);if(!c||c.t==='X')return;const u=(/https:\/\/\S+/.exec(c.nota)||[''])[0];if(c.grupo||u)OPC[i]=[c.grupo,u];});
// País Vasco y Navarra: operador en baja según su propia fuente, cuando da el modelo de gestión: {INE: [operador, URL, cita]}
const PVN=Object.fromEntries(Object.entries(ES.mun).filter(([,o])=>o.pv).map(([k,o])=>[k,o.pv]));
// Municipios cuya red sale de la EIEL de la Comunidad de Madrid (IDEM) y no del visor nacional
const RSI=Object.keys(ES.mun).filter(k=>ES.mun[k].rs==='idem');
const EPROV=Object.fromEntries(Object.entries(ES.meta.prov).map(([p,o])=>[p,[o.fase,o.nu_fase]]));
// Indicadores del art. 63.2 RD 3/2023 publicados por el operador (scripts/build_art63.js):
// m: {INE: [[indicador, valor, unidad, año, operador, URL, página, aviso legal, fecha de consulta], ...]}; e: {INE: [estado de la búsqueda, motivo, fecha]}
const AR=JSON.parse(fs.readFileSync('data/art63.json'));
const A63={m:Object.fromEntries(Object.entries(AR.mun).map(([k,R])=>[k,R.map(r=>[r.ind,r.v,r.unit,r.y,r.op,r.url,r.page,r.legal,r.date])])),
  e:Object.fromEntries(Object.entries(AR.estado).filter(([,o])=>o.e!=='publica').map(([k,o])=>[k,[o.e,o.motivo,o.date]])),
  // s: cifras de todo el sistema de un operador, para la ficha de operador: [patrón, operador, ámbito, indicador, valor, unidad, año, URL, página, aviso legal, fecha]
  // mt: tabla de MITECO por municipio (vacía hasta la respuesta a la solicitud) y fecha de la solicitud
  mt:{sol:AR.miteco.sol,m:Object.fromEntries(Object.entries(AR.miteco.mun).map(([k,o])=>[k,[o.anr,o.ife,o.rend,o.tipo,o.y,o.doc,o.rec]]))},
  s:AR.sys.map(r=>[r.pat,r.op,r.amb,r.ind,r.v,r.unit,r.y,r.url,r.page,r.legal,r.date])};
// Pesos del índice de prioridad comercial (src/prioridad.js)
const PRI_W=JSON.parse(fs.readFileSync('data/prioridad_pesos.json'));
// Capa internacional (scripts/build_int.js): Italia por regiones y comuni capoluogo, y estado de los demás países
const INT=JSON.parse(fs.readFileSync('data/internacional.json'));
const out2=`const INT=${JSON.stringify(INT)};\nconst PRI_W=${JSON.stringify(PRI_W)};\nconst A63=${JSON.stringify(A63)};\nconst GES=${JSON.stringify(GES)};\nconst ESD=${JSON.stringify(ESD)};\nconst OPN=${JSON.stringify(OPN)};\nconst OPT=${JSON.stringify(OPT)};\nconst OPC=${JSON.stringify(OPC)};\nconst EPROV=${JSON.stringify(EPROV)};\nconst RSI=${JSON.stringify(RSI)};\nconst PVN=${JSON.stringify(PVN)};\n`;
fs.mkdirSync('.build',{recursive:true});fs.writeFileSync('.build/data.js',out+out2);console.log('data.js',out.length,'urls',urls.length,'units',units);
