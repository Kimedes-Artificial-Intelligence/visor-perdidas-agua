// Índice Kimedes de prioridad comercial (FWG-1870, Parte 6): fórmula, pesos editables, percentiles y quintiles
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('fs');const path=require('path');
const {ROOT}=require('../lib/page.js');
const {priFactors,percentiles,quintileCuts,quintileOf}=require('../../src/prioridad.js');
const W=JSON.parse(fs.readFileSync(path.join(ROOT,'data/prioridad_pesos.json'),'utf8'));

test('los pesos de data/prioridad_pesos.json son los aprobados el 30/10/2026',()=>{
  assert.deepEqual([W.perdidas.tope_pct,W.perdidas.sin_dato,W.fibrocemento.sin_dato,W.antiguedad.anios_tope,W.anio_referencia],[40,0.75,0.75,10,2026]);
  assert.deepEqual(W.modelo,{V:1,M:1,P:0.6,C:0.3,O:0.6,N:0.8});
});
test('el índice es el producto de sus cinco factores',()=>{
  const f=priFactors({P:0.5,loss:20,fc:40,fase:2021,gm:'P'},W);
  assert.equal(f.L,0.5);assert.equal(f.F,0.7);assert.equal(f.A,0.75);assert.equal(f.G,0.6);
  assert.ok(Math.abs(f.idx-0.5*0.5*0.7*0.75*0.6)<1e-12);
});
test('sin dato publicado, sin EIEL o sin modelo, cada factor toma su valor "sin dato"',()=>{
  const f=priFactors({P:1,loss:null,fc:null,fase:null,gm:null},W);
  assert.deepEqual([f.L,f.F,f.A,f.G],[0.75,0.75,0.75,0.8]);
});
test('las pérdidas y la antigüedad se topan en 1',()=>{
  const f=priFactors({P:1,loss:70,fc:0,fase:2001,gm:'V'},W);assert.equal(f.L,1);assert.equal(f.A,1);
});
test('cambiar un peso del archivo cambia el índice (los pesos son editables)',()=>{
  const x={P:1,loss:null,fc:null,fase:null,gm:'P'};const w2=JSON.parse(JSON.stringify(W));w2.modelo.P=1;w2.perdidas.sin_dato=1;
  assert.ok(priFactors(x,w2).idx>priFactors(x,W).idx);
});
test('percentiles de población: 0 la menor, 1 la mayor; los empates comparten valor',()=>{
  assert.deepEqual(percentiles([10,30,20,30]),[0,2/3,1/3,2/3]);
});
test('quintiles: cinco grupos de tamaño parecido, del 1 (menor) al 5 (mayor)',()=>{
  const v=Array.from({length:100},(_,i)=>i),c=quintileCuts(v);
  const n=[1,2,3,4,5].map(q=>v.filter(x=>quintileOf(x,c)===q).length);assert.deepEqual(n,[20,20,20,20,20]);
});
