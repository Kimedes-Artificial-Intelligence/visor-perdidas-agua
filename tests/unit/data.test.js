// Los datos embebidos en dist/index.html son idénticos a los de la referencia (tolerancia cero)
const test=require('node:test');const assert=require('node:assert/strict');
const {DIST,REFERENCE,DATA_CONSTS,dataConsts,read}=require('../lib/page.js');

const dist=dataConsts(read(DIST)),ref=dataConsts(read(REFERENCE));

for(const name of DATA_CONSTS){
  test(`la constante ${name} es idéntica a la de la referencia`,()=>{
    assert.notEqual(ref[name],undefined,`${name} no aparece en la referencia`);
    assert.deepStrictEqual(dist[name],ref[name]);
  });
}

// 3Cat/ACN reserva todos los derechos: ni sus datos ni su nombre pueden aparecer en la página
test('la página no contiene datos ni menciones de 3Cat/ACN',()=>{
  assert.doesNotMatch(read(DIST),/3Cat|ACN/);
  assert.deepEqual(Object.keys(dist.MU).filter(k=>dist.MU[k][5]!==0),[]);
});

test('los 15 municipios que solo tenían dato de 3Cat/ACN quedan sin dato publicado',()=>{
  const ids=['08042','08095','08127','08198','08234','08905','17184','25002','25133','25192','25204','43094','43110','43175','43903'];
  assert.deepEqual(ids.filter(k=>dist.MU[k][3]||dist.MU[k][4]),[]);
});

test('el municipio 08215 tiene geometría y fila de datos',()=>{
  assert.match(dist.CAT.muni['08215'],/^M[\d.,L]+Z$/);
  assert.equal(dist.MU['08215'][0],'Sant Hipòlit de Voltregà');
});
