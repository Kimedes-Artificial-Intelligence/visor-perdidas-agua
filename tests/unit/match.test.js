// Unión de municipios por código INE: las fuentes con nombre se asignan al municipio correcto
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('fs');const path=require('path');
const {find}=require('../../scripts/match.js');
const RAW=f=>fs.readFileSync(path.join(__dirname,'../../raw',f),'utf8').trim();

test('el nombre de cada municipio del Power BI de la ACA da su mismo código INE',()=>{
  const rows=RAW('aca_powerbi_2024_obligats.psv').split('\n').map(l=>l.split('|')).filter(([c])=>c!=='varis')
    .map(([c,n])=>({ine:c.slice(0,5),name:n,m:find(n)})).filter(r=>r.m);
  assert.equal(rows.length,108);
  assert.deepEqual(rows.filter(r=>r.m.ine!==r.ine).map(r=>`${r.name} ${r.ine} vs ${r.m.ine}`),[]);
});

