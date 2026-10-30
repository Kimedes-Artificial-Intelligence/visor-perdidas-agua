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

// ---- Inglaterra (FWG-1871, Parte D): Environment Agency, fugas 2024-25 por compañía
const {bngToWgs}=require('../../scripts/extract_ea_wrz.js');
const {checkEn}=require('../../scripts/build_int.js');
test('British National Grid a WGS84: el ejemplo del Ordnance Survey (Caister Water Tower) cae a menos de 10 m',()=>{
  const [lon,lat]=bngToWgs([651409.903,313177.270]);
  assert.ok(Math.abs(lat-52.658007)*111000<10&&Math.abs(lon-1.716057)*67000<10,`${lat} ${lon}`);
});
test('Inglaterra: 17 compañías con dato de las 20 con zonas; Thames Water 135,99 l/propiedad/día y 570,57 Ml/d (cifras de control del informe de la EA)',()=>{
  const {en}=build();const has=Object.values(en.cia).filter(c=>c[4]!=null);
  assert.equal(Object.keys(en.cia).length,20);assert.equal(has.length,17);
  assert.equal(en.cia.TWS[4],135.99);assert.equal(Math.round(en.cia.TWS[3]*100)/100,570.57);
  assert.equal(en.cia.CAM[4],71.42);
  for(const k of ['DCW','HDD','VWP'])assert.equal(en.cia[k][4],null,k);
});
test('el control de la tabla de Inglaterra rechaza un código sin geometría, dos indicadores en una fila y un año distinto',()=>{
  const row=o=>Object.assign({empresa:'X',codigo:'TWS',fuga_ml_d:'',fuga_l_prop_dia:'99.1','año':'2024 to 2025',url:'https://a.uk/x',fecha_consulta:'2026-10-30',hoja_o_pagina:'p.1',licencia:'https://a.uk/l «OGL»',nota:'',_line:1},o);
  const C=new Set(['TWS']);
  assert.deepEqual(checkEn([row({})],C),[]);
  assert.ok(checkEn([row({codigo:'ZZZ'})],C).length);
  assert.ok(checkEn([row({fuga_ml_d:'5'})],C).length);
  assert.ok(checkEn([row({'año':'2023'})],C).length);
});
