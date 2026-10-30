// Pérdidas publicadas por el operador o el ayuntamiento (art. 63.2 RD 3/2023, FWG-1870): formato de raw/, estado de la búsqueda y precedencia
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('fs');const path=require('path');
const {ROOT}=require('../lib/page.js');
const {psv,checkA63,checkEstado,paintable,build,F,COLS,ESTADO_COLS}=require('../../scripts/build_art63.js');
const {LOSS_ORDER,pickLoss,a63Paint}=require('../../src/loss.js');

const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const PADRON=new Set(Object.keys(JSON.parse(read('data/espmun.json')).mun));
const A63=psv(read(F.a63),COLS,F.a63),EST=psv(read(F.estado),ESTADO_COLS,F.estado);
const row=o=>Object.assign({ine:'14021',operador:'X',indicador:'ANR',valor:'8.45',unidad:'%','año_dato':'2025',url:'https://a.es/d.pdf',fecha_consulta:'2026-10-30',
  pagina_o_seccion:'p.1',licencia_o_aviso_legal:'https://a.es/aviso «cita»',nota:'',_line:1},o);

// ---- Formato
test('cada fila de pérdidas publicadas tiene sus 11 campos, un indicador admitido, año, URL, fecha de consulta y aviso legal',()=>{
  assert.deepEqual(checkA63(A63,PADRON),[]);
});
test('el control rechaza filas mal formadas',()=>{
  const bad=[row({ine:'99999'}),row({indicador:'PERDIDAS'}),row({valor:'8,45'}),row({indicador:'RENDIMIENTO',valor:'101'}),row({'año_dato':'2030'}),
    row({url:'http://a.es'}),row({fecha_consulta:'30/10/2026'}),row({licencia_o_aviso_legal:'sin URL'}),row({unidad:''})];
  for(const r of bad)assert.ok(checkA63([r],PADRON).length>0,JSON.stringify(r));
  assert.deepEqual(checkA63([row({}),row({indicador:'IFE',valor:'2.02',unidad:'sin unidad impresa'})],PADRON),[]);
  assert.equal(checkA63([row({}),row({})],PADRON).length,1); // municipio e indicador repetidos
});
test('una fila con más o menos de 11 campos se rechaza al leer',()=>{
  assert.throws(()=>psv(COLS.join('|')+'\n14021|X|ANR',COLS,'x'),/3 campos, se esperan 11/);
});
test('el estado de la búsqueda es coherente con las cifras publicadas y cada fila cita lo revisado',()=>{
  assert.deepEqual(checkEstado(EST,PADRON,A63),[]);
  assert.ok(checkEstado([{ine:'14021',estado:'no_publica',fecha_consulta:'2026-10-30',urls_revisadas:'https://x.es',motivo:'',_line:1}],PADRON,A63).length>0);
});

// ---- Cobertura de la Parte 1
test('las 126 ciudades de 50.000 hab. o más sin pérdidas previas tienen dato publicado o estado de la búsqueda (País Vasco y Navarra incluidos, Parte 4)',()=>{
  const {cities}=build();assert.equal(cities.length,126);
  const est=new Set(EST.map(r=>r.ine));
  assert.deepEqual(cities.map(c=>c[0]).filter(id=>!est.has(id)),[]);
});
test('data/art63.json y data/ciudades_50k_sin_perdidas.csv coinciden con lo que se genera desde raw/',()=>{
  const {mun,estado,cities}=build();
  const {sys,miteco}=build();
  assert.deepEqual(JSON.parse(read('data/art63.json')),{meta:{src:F.a63,estado:F.estado,sys:F.sys,miteco:F.miteco},mun,estado,sys,miteco});
  assert.equal(read('data/ciudades_50k_sin_perdidas.csv').trim().split('\n').length,cities.length+1);
});

// ---- Precedencia y qué se pinta
test('la precedencia es auditoría ACA, operador (art. 63.2), EIEL y Govern IB',()=>{
  assert.deepEqual(LOSS_ORDER,['aca','art63','eiel','ib']);
  const c={aca:{v:1},art63:{v:2},eiel:{v:3},ib:{v:4}};
  assert.equal(pickLoss(c).v,1);delete c.aca;assert.equal(pickLoss(c).v,2);delete c.art63;assert.equal(pickLoss(c).v,3);delete c.eiel;assert.equal(pickLoss(c).v,4);
  assert.equal(pickLoss({}),null);
});
test('del art. 63.2 solo se pinta el agua no registrada y, si no hay, las pérdidas reales; nunca el rendimiento ni el IFE',()=>{
  assert.equal(a63Paint([['RENDIMIENTO',80],['ANR',8]])[0],'ANR');
  assert.equal(a63Paint([['PERDIDAS_REALES',12],['IFE',2]])[0],'PERDIDAS_REALES');
  assert.equal(a63Paint([['RENDIMIENTO',80],['IFE',2],['ILI',3]]),null);
  assert.equal(a63Paint(undefined),null);
  assert.equal(paintable([{ind:'RENDIMIENTO'}]),null);
  assert.equal(paintable([{ind:'IFE'},{ind:'PERDIDAS_REALES'},{ind:'ANR'}]).ind,'ANR');
});
test('la columna se_pinta dice "sí" en las ciudades cuyo operador publica ANR o pérdidas reales (Córdoba, Elx) y "no" en el resto (FWG-1871, A.1)',()=>{
  const {cities,mun}=build();const pinta=Object.fromEntries(cities.map(c=>[c[0],c[7]]));
  assert.equal(pinta['14021'],'sí');assert.equal(pinta['03065'],'sí');assert.equal(pinta['15030'],'no');
  for(const c of cities)assert.equal(c[7],(mun[c[0]]||[]).some(r=>r.ind==='ANR'||r.ind==='PERDIDAS_REALES')?'sí':'no',c[1]);
  const csv=read('data/ciudades_50k_sin_perdidas.csv').trim().split('\n').slice(1).map(l=>l.split(';'));
  assert.deepEqual(csv.map(r=>[r[0],r[7]]),cities.map(c=>[c[0],c[7]]));
});

// ---- Cifras de todo el sistema de un operador (ficha de operador, Parte 6)
const {checkSys,SYS_COLS}=require('../../scripts/build_art63.js');
const SYS=psv(read(F.sys),SYS_COLS,F.sys);
test('cada cifra de sistema tiene patrón, ámbito, indicador admitido, año, URL y aviso legal',()=>{
  assert.deepEqual(checkSys(SYS),[]);
  assert.ok(checkSys([Object.assign({},SYS[0],{ambito:''})]).length>0);
});
test('cada patrón de las cifras de sistema casa con algún operador del SINAC',()=>{
  const {csv,normOp,F:FE}=require('../../scripts/build_es_mun.js');
  const pv=read(FE.pvnav).trim().split('\n').filter(l=>/^\d{5}\|/.test(l)).map(l=>l.split('|')[1]); // operadores en baja del País Vasco
  const names=new Set([...csv(read(FE.sinac)).map(r=>r.gestor),...pv].map(n=>' '+normOp(n)+' '));
  assert.deepEqual(SYS.filter(r=>![...names].some(n=>n.includes(' '+normOp(r.patron)+' '))).map(r=>r.patron),[]);
});

// ---- MITECO (Parte 5): estructura para la tabla por municipio del Informe nacional de fugas 2024
const {parseMiteco,checkMiteco}=require('../../scripts/build_art63.js');
const {mitecoReason}=require('../../src/loss.js');
const MIT_HEAD='solicitud_presentada:2026-11-05\nine|anr_pct|ife|rendimiento_pct|tipo_evaluacion|año_dato|documento|fecha_recepcion|nota\n';
test('la tabla de MITECO está vacía hasta que llegue la respuesta y sin fecha de solicitud',()=>{
  const m=parseMiteco(read(F.miteco));assert.equal(m.sol,'');assert.deepEqual(m.rows,[]);assert.deepEqual(checkMiteco(m,PADRON),[]);
});
test('una tabla de MITECO bien formada se acepta y una mal formada se rechaza',()=>{
  assert.deepEqual(checkMiteco(parseMiteco(MIT_HEAD+'28079|12.5|3.1||detallada|2024|Resolución 001/2027|2027-01-15|'),PADRON),[]);
  for(const l of ['99999|12.5|||basica|2024|R|2027-01-15|','28079|12,5|||basica|2024|R|2027-01-15|','28079||||basica|2024|R|2027-01-15|',
    '28079|12.5|||otra|2024|R|2027-01-15|','28079|12.5|||basica|2023|R|2027-01-15|','28079|12.5|||basica|2024||2027-01-15|'])
    assert.ok(checkMiteco(parseMiteco(MIT_HEAD+l),PADRON).length>0,l);
  assert.ok(checkMiteco(parseMiteco(MIT_HEAD.replace('2026-11-05','5/11/2026')),PADRON).length>0);
});
test('el motivo en gris dice si la solicitud a MITECO está pendiente o presentada y cuándo',()=>{
  assert.match(mitecoReason(''),/pendiente de presentar\.$/);
  assert.match(mitecoReason('2026-11-05'),/presentada el 05\/11\/2026\.$/);
});
