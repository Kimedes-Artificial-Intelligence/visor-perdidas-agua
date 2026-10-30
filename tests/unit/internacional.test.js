// Capa internacional (FWG-1870, Parte 7): Italia (ISTAT) desde raw/, geometría y tabla de estado por país
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('fs');const path=require('path');
const {ROOT}=require('../lib/page.js');
const {extract,OUT}=require('../../scripts/extract_istat.js');
const {utmToLonLat,simplify}=require('../../scripts/extract_istat_geo.js');
const {build}=require('../../scripts/build_int.js');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const rows=read(OUT).trim().split('\n').filter(l=>!l.startsWith('#')).slice(1).map(l=>l.split('|'));

test('la transcripción de ISTAT coincide con la que se extrae del xlsx de raw/italia/',()=>{
  assert.deepEqual(extract().map(r=>r.join('|')),rows.map(r=>r.join('|')));
});
test('Italia 42,4 %, Milano 13,4 %, Potenza 71,0 % y Basilicata 65,5 % en 2022 (cifras de control del ticket y del informe)',()=>{
  const v=(t,n)=>+rows.find(r=>r[0]===t&&r[1]===n)[4];
  assert.deepEqual([v('N','ITALIA'),v('C','Milano'),v('C','Potenza'),v('R','Basilicata')],[42.4,13.4,71,65.5]);
});
test('20 regiones, 2 provincias autónomas, 5 reparticiones y 109 capoluoghi; todos los porcentajes entre 0 y 100',()=>{
  const n=t=>rows.filter(r=>r[0]===t).length;assert.deepEqual([n('R'),n('A'),n('M'),n('C'),n('N'),n('T')],[20,2,5,109,1,1]);
  assert.deepEqual(rows.filter(r=>!(+r[4]>=0&&+r[4]<=100)).map(r=>r[1]),[]);
});
test('UTM 32N a lon/lat: el meridiano central y el origen de la falsa abscisa vuelven a 9° E',()=>{
  const [lon,lat]=utmToLonLat([500000,4649776.22]);assert.ok(Math.abs(lon-9)<1e-9);assert.ok(Math.abs(lat-42)<1e-4);
});
test('la simplificación conserva un anillo cerrado con sus vértices relevantes',()=>{
  const sq=[[0,0],[0,500],[0,1000],[1000,1000],[1000,0],[0,0]];const s=simplify(sq,10);
  assert.deepEqual(s,[[0,0],[0,1000],[1000,1000],[1000,0],[0,0]]);
});
test('data/internacional.json coincide con lo que se genera desde raw/ y cada capoluogo tiene geometría y dato',()=>{
  const o=build();assert.deepEqual(JSON.parse(read('data/internacional.json')),JSON.parse(JSON.stringify(o)));
  assert.equal(Object.keys(o.reg).length,20);assert.equal(Object.keys(o.cap).length,109);
  assert.equal(o.geo.licencia,'CC BY 4.0 ISTAT');assert.match(o.geo.sha256,/^[0-9a-f]{64}$/);
});
test('la tabla de estado por país explica cada país sin datos y no hay ningún país con datos sin licencia abierta',()=>{
  const {paises}=build();
  assert.deepEqual(paises.filter(p=>p.estado!=='datos'&&!p.motivo).map(p=>p.pais),[]);
  assert.deepEqual(paises.filter(p=>p.estado==='datos'&&!/CC BY|OGL|Open Government/.test(p.licencia)).map(p=>p.pais),[]);
  assert.ok(paises.some(p=>p.pais==='Oriente Medio'&&p.estado==='sin_capa'));
});
