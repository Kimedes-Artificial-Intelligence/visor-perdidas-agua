// España por municipio (FWG-1868): agregación de la EIEL y del SINAC, clasificación de operadores y modelo de gestión
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('fs');const path=require('path');
const {ROOT}=require('../lib/page.js');
const {csv,eielLosses,eielNetwork,loadClassifier,sinac,model,build,F}=require('../../scripts/build_es_mun.js');

const CLS=loadClassifier(csv(fs.readFileSync(path.join(ROOT,F.cls),'utf8')));
const nucleos=rows=>csv('geom_id;code;nucleo;padron;cons_invierno_m3d;cons_verano_m3d;perdidas_pct\n'+rows.join('\n'));
const tramos=rows=>csv('key;len_m\n'+rows.join('\n'));
const redes=rows=>csv('id_red;mun;denominacion;gestor;responsable;localidades;dotacion_l_hab_dia;emisor_factura\n'+rows.join('\n'));

// ---- Agregación EIEL de núcleos
test('las pérdidas de un municipio con varios núcleos se ponderan por su consumo medio',()=>{
  const out=eielLosses(nucleos(['1;2025-11-002-0001-01;A;1000;300;100;10','2;2025-11-002-0002-01;B;500;50;50;30']));
  // consumos medios 200 y 50: (10·200 + 30·50) / 250 = 14
  assert.equal(out['11002'].per,14);
  assert.equal(out['11002'].nrep,2);assert.equal(out['11002'].nn,2);assert.equal(out['11002'].cov,100);
});
test('sin consumo, el núcleo pondera por su padrón',()=>{
  const out=eielLosses(nucleos(['1;2025-11-002-0001-01;A;300;;;10','2;2025-11-002-0002-01;B;100;;;30']));
  assert.equal(out['11002'].per,15);
});
test('un núcleo con 0 %, vacío o más del 95 % no cuenta como dato',()=>{
  const out=eielLosses(nucleos(['1;2025-11-002-0001-01;A;900;100;100;0','2;2025-11-002-0002-01;B;100;10;10;20',
    '3;2025-11-002-0003-01;C;100;10;10;','4;2025-11-002-0004-01;D;100;10;10;96']));
  assert.equal(out['11002'].per,20);assert.equal(out['11002'].nrep,1);assert.equal(out['11002'].nn,4);
  assert.equal(out['11002'].cov,8); // 100 de 1.200 habitantes
});
test('un municipio sin ningún núcleo válido queda sin pérdidas',()=>{
  const out=eielLosses(nucleos(['1;2025-11-002-0001-01;A;900;100;100;0']));
  assert.equal(out['11002'].per,undefined);
});
test('el padrón con punto de miles se lee como número entero',()=>{
  const out=eielLosses(nucleos(['1;2025-11-002-0001-01;A;1.234;;;10']));
  assert.equal(out['11002'].pop,1234);
});

// ---- Agregación EIEL de tramos de red
test('una clave de tramo mal formada se ignora',()=>{
  const out=eielNetwork(tramos(['2025-RD-11-002-0001-01-FC-NO-M-MU-MU;1000','2025-RD-11-002-0001-01-PE-NO-B;500','basura;20','2025-XX-11-002-0001-01-PE-NO-B-MU-PV;9000']));
  assert.deepEqual(Object.keys(out),['11002']);
  assert.equal(out['11002'].km,1);assert.equal(out['11002'].fc,100);assert.equal(out['11002'].gd,'MU');
});
test('gestión, fibrocemento y estado se reparten por longitud de tramo',()=>{
  const out=eielNetwork(tramos(['2025-RD-11-002-0001-01-FC-NO-M-MU-PV;3000','2025-RD-11-002-0001-01-PE-NO-R-MU-MU;1000']));
  assert.deepEqual(out['11002'],{g:{PV:75,MU:25},gd:'PV',fc:75,em:75,er:25,km:4,ry:2025});
});

// ---- SINAC y clasificación
test('EKUIS no es un operador: se usa el responsable de la red y se marca',()=>{
  const {mun}=sinac(redes(['1;48020;;EKUIS: SISTEMA DE INFORMACIÓN DE AGUAS DE CONSUMO DE LA CAPV;AYUNTAMIENTO DE BILBAO;BILBAO:1.000:100;171;']),CLS);
  assert.deepEqual(mun['48020'].ops,[['AYUNTAMIENTO DE BILBAO',100,1]]);
});
test('los operadores se ponderan por población abastecida y el código se rellena a 5 cifras',()=>{
  const {mun}=sinac(redes(['1;1001;;FCC AQUALIA;AYTO;A:3.000:100;100,5;','2;1001;;GLOBAL OMNIUM;AYTO;B:2.000:50;200;']),CLS);
  assert.deepEqual(mun['01001'].ops,[['FCC AQUALIA',75],['GLOBAL OMNIUM',25]]);
  assert.equal(mun['01001'].spop,4000);assert.equal(mun['01001'].dot,125); // (100,5·3000 + 200·1000) / 4000
});
test('una red repetida en el archivo cuenta una sola vez',()=>{
  const {mun}=sinac(redes(['7;1001;;FCC AQUALIA;AYTO;A:100:100;;','7;1001;;FCC AQUALIA;AYTO;A:100:100;;']),CLS);
  assert.equal(mun['01001'].nred,1);
});
for(const [name,tipo] of [['EMASESA','P'],['EMASAGRA','M'],['SACYR GUADALAGUA, S.L.U.','V'],['AGUAS DEL ARCO MEDITERRANEO,S.A. (AGAMED)','M'],['FCC AQUALIA','V'],['Proveïments d\'Aigua, SA','V'],['EMMASA (EMPRESA MIXTA DE AGUAS DE SANTA CRUZ DE TENERIFE S.A.)','M'],
  ['AYTO. DE MIERES_33037_ASTURIAS','P'],['CANAL DE ISABEL II, S.A.M.P.','P'],['ANTICIMEX 3D SANIDAD AMBIENTAL S.A.U.','X']])
  test(`la tabla clasifica «${name}» como ${tipo}`,()=>assert.equal(CLS(name).t,tipo));
test('un nombre sin patrón queda sin clasificar, aunque se parezca a uno (coincidencia por palabras completas)',()=>{
  assert.equal(CLS('EMALSAS'),null);assert.equal(CLS('AGUASVIRAL'),null);assert.equal(CLS('ASPTEC AIGUES'),null); // "SPT" no casa dentro de una palabra
});


// ---- Regla de procedencia de la tabla de operadores (FWG-1870): un patrón solo con una fuente citada en «nota».
// Los patrones de arranque de FWG-1868 venían del ticket y no la tienen; la lista queda congelada.
const LEGACY=new Set(['EKUIS','ANTICIMEX','LASAOSA','CNTA','PLUS CONTROL','AQM LABORATORIOS','SPT','AIGUES DE BARCELONA EMPRESA METROPOLITANA','EMMASA',
  'SOCIEDAD MIXTA DEL AGUA JAEN','EMUASA','EMANAGUA','EMPRESA MIXTA','MIXTA','FCC AQUALIA','AQUALIA','SGAB','SOCIEDAD GENERAL DE AGUAS DE BARCELONA','AQUONA',
  'HIDRAQUA','HIDRALIA','HIDROGEA','VIAQUA','ASTURAGUA','AQUANEX','CANARAGUA','SOREA','GRUP CASSA','PROVEIMENTS D AIGUA','COMAIGUA','GLOBAL OMNIUM','AQLARA',
  'FACSA','GESTAGUA','ACCIONA AGUA','SACYR AGUA','AQUARBE','ESPINA DELFIN','TEIDAGUA','AQUARA','HIDROGESTION','COMPANYIA GENERAL D AIGUES DE CATALUNYA',
  'AYUNTAMIENTO','AYTO','CONCELLO','AJUNTAMENT','MANCOMUNIDAD','MANCOMUNITAT','CONSORCIO','COMARCA','CANAL DE ISABEL II','GIAHSA','EMPRESA PROVINCIAL',
  'EMPRESA MUNICIPAL','AIGUES DE MANRESA','SERVICIOS DE LA COMARCA DE PAMPLONA','SERVICIOS DE MONTEJURRA','AGUAS DEL HUESNA','ALJARAFESA','GALASA','EMASER','ENTEMANSER']);
const CLS_ROWS=csv(fs.readFileSync(path.join(ROOT,F.cls),'utf8'));
const SOURCE=/^Fuente: https:\/\/\S+ \(consulta \d{2}\/\d{2}\/\d{4}\): \S/;
test('cada patrón nuevo de la tabla de operadores cita su fuente, la fecha de consulta y el texto que lo confirma',()=>{
  assert.deepEqual(CLS_ROWS.filter(r=>!LEGACY.has(r.patron)&&!SOURCE.test(r.nota)).map(r=>r.patron),[]);
});
test('si se rellena el grupo, la nota cita una fuente',()=>{
  assert.deepEqual(CLS_ROWS.filter(r=>r.grupo&&!SOURCE.test(r.nota)).map(r=>r.patron),[]);
});
test('ningún patrón está repetido',()=>{
  const seen=new Set();assert.deepEqual(CLS_ROWS.filter(r=>seen.has(r.patron)||!seen.add(r.patron)).map(r=>r.patron),[]);
});
test('cada patrón nuevo casa con algún gestor o responsable del SINAC',()=>{
  const {normOp}=require('../../scripts/build_es_mun.js');
  const names=new Set(csv(fs.readFileSync(path.join(ROOT,F.sinac),'utf8')).flatMap(r=>[r.gestor,r.responsable]).filter(Boolean).map(n=>' '+normOp(n)+' '));
  const dead=CLS_ROWS.filter(r=>!LEGACY.has(r.patron)).filter(r=>{const p=' '+normOp(r.patron)+' ';return ![...names].some(n=>n.includes(p));});
  assert.deepEqual(dead.map(r=>r.patron),[]);
});

// ---- Modelo de gestión
const m=(ine,o,esf)=>model(ine,o,esf,CLS).gm;
test('en Catalunya manda ESF aunque la EIEL o el SINAC digan otra cosa',()=>{
  assert.equal(m('08019',{gd:'MU',ops:[['FCC AQUALIA',100]]},'Privada'),'V');
});
test('fuera de Catalunya, un operador SINAC mixto prevalece sobre la EIEL',()=>{
  assert.equal(m('38038',{gd:'MU',ops:[['EMMASA',100]]}),'M');
});
test('si el operador no es mixto, manda la gestión dominante de la EIEL agrupada',()=>{
  assert.equal(m('11002',{gd:'MA',ops:[['FCC AQUALIA',100]]}),'P');
  assert.equal(m('11002',{gd:'VE'}),'C');
});
test('sin EIEL, el tipo del operador SINAC; sin clasificar o responsable, sin dato',()=>{
  assert.equal(m('28079',{ops:[['CANAL DE ISABEL II, S.A.M.P.',97]]}),'P');
  assert.equal(m('41091',{ops:[['EMASESA',100]]}),'P'); // clasificado con fuente en FWG-1870
  assert.equal(m('41091',{ops:[['OPERADOR SIN PATRON, S.A.',100]]}),'N');
  assert.equal(m('48020',{ops:[['AYUNTAMIENTO DE BILBAO',100,1]]}),'N');
});

// ---- Control de los datos reales
const R=f=>fs.readFileSync(path.join(ROOT,f),'utf8').trim().split('\n');
test('las extracciones tienen 33.413 núcleos, 46.842 claves de red y 18.939 redes',()=>{
  assert.equal(R(F.nu).length-1,33413);assert.equal(R(F.rd).length-1,46842);assert.equal(R(F.sinac).length-1,18939);
});
const {mun,unk}=build();
test('la agregación reproduce la referencia del 30/10/2026: 4.972 con pérdidas, 5.653 con gestión EIEL, 7.637 con operador',()=>{
  const n=k=>Object.values(mun).filter(o=>o[k]!=null).length;
  assert.deepEqual([n('per'),n('gd'),n('ops')],[4972,5653,7637]);
});
test('ningún código INE queda fuera del padrón 2025',()=>{
  const pad=new Set(R('raw/ine_padron2025.psv').filter(l=>!l.startsWith('#')).map(l=>l.split('|')[0]));
  assert.deepEqual(Object.keys(mun).filter(k=>!pad.has(k)),[]);
});
test('todos los porcentajes están entre 0 y 100',()=>{
  const bad=[];for(const [k,o] of Object.entries(mun)){
    for(const f of ['per','cov','rnd','fc','em','er'])if(o[f]!=null&&!(o[f]>=0&&o[f]<=100))bad.push(k+' '+f);
    if(o.em!=null&&o.em+o.er>100)bad.push(k+' em+er');for(const x of o.ops||[])if(!(x[1]>=0&&x[1]<=100))bad.push(k+' op');}
  assert.deepEqual(bad,[]);
});
test('ningún operador mostrado es EKUIS ni un laboratorio',()=>{
  assert.deepEqual(Object.entries(mun).filter(([,o])=>(o.ops||[]).some(x=>CLS(x[0])?.t==='X')).map(([k])=>k),[]);
});
test('data/es_mun.json y data/operadores_sin_clasificar.csv coinciden con lo que se genera desde raw/',()=>{
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(ROOT,'data/es_mun.json'))).mun,mun);
  const csvRows=R('data/operadores_sin_clasificar.csv').slice(1);
  assert.equal(csvRows.length,unk.length);assert.equal(csvRows[0],unk[0].join(';'));
});

// ---- Extracción EIEL (scripts/extract_eiel.js): lectura de la ficha HTML de un núcleo
test('la ficha EIEL de Alcalá del Valle da su nombre, padrón, consumos y pérdidas',()=>{
  const {parseNucleo}=require('../../scripts/extract_eiel.js');
  const html=fs.readFileSync(path.join(ROOT,'tests/fixtures/eiel_infowindow_11-511763.html'),'utf8');
  assert.deepEqual(parseNucleo(html),{nucleo:'ALCALÁ DEL VALLE',padron:'4900',inv:'1292',ver:'1368',per:'25'});
});
