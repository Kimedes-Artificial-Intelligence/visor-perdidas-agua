// Formato de raw/aca2024_extract.psv, el archivo que se edita a mano para añadir auditorías 2024
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('fs');const path=require('path');
const {cat}=require('../../scripts/match.js');

const FILE='raw/aca2024_extract.psv';
const rows=fs.readFileSync(path.join(__dirname,'../..',FILE),'utf8').trim().split('\n')
  .map((l,i)=>({line:i+1,l,f:l.split('|')})).filter(r=>!r.l.startsWith('#'));
const INE=new Set(cat.map(m=>m.ine));
const UNITS=new Set(['AMB','GIR']); // unidades de gestión de varios municipios, ver scripts/build_data.js
const at=r=>`${FILE}, línea ${r.line}`;

test('cada línea tiene 10 campos separados por |',()=>{
  assert.deepEqual(rows.filter(r=>r.f.length!==10).map(r=>`${at(r)}: ${r.f.length} campos`),[]);
});

test('cada código es un municipio de Catalunya de 5 dígitos o una unidad de gestión conocida',()=>{
  assert.deepEqual(rows.filter(r=>!INE.has(r.f[0])&&!UNITS.has(r.f[0])).map(r=>`${at(r)}: código "${r.f[0]}"`),[]);
});

test('ningún código aparece dos veces',()=>{
  const seen=new Set();
  assert.deepEqual(rows.filter(r=>seen.has(r.f[0])||!seen.add(r.f[0])).map(r=>`${at(r)}: ${r.f[0]} repetido`),[]);
});

test('F9 es un porcentaje con punto decimal entre 0 y 100',()=>{
  assert.deepEqual(rows.filter(r=>!/^\d+(\.\d+)?$/.test(r.f[5])||+r.f[5]>100).map(r=>`${at(r)}: F9 "${r.f[5]}"`),[]);
});

test('los demás indicadores están vacíos o son números con punto decimal',()=>{
  const bad=[];
  for(const r of rows)for(const [i,name] of [[1,'F1'],[2,'F4'],[3,'F6'],[4,'F7'],[8,'PR'],[9,'PA']])
    if(r.f[i]!==undefined&&r.f[i]!==''&&!/^-?\d+(\.\d+)?$/.test(r.f[i]))bad.push(`${at(r)}: ${name} "${r.f[i]}"`);
  assert.deepEqual(bad,[]);
});

test('el año tiene 4 cifras y la fuente es una URL https',()=>{
  assert.deepEqual(rows.filter(r=>!/^20\d\d$/.test(r.f[6])||!/^https:\/\/\S+$/.test(r.f[7])).map(r=>`${at(r)}: año "${r.f[6]}", URL "${r.f[7]}"`),[]);
});
