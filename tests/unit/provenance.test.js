// Regla de procedencia: un dato no cambia sin que cambie su archivo de origen
const test=require('node:test');const assert=require('node:assert/strict');
const {SOURCES,unexplained}=require('../lib/provenance.js');
const {DATA_CONSTS}=require('../lib/page.js');

test('acepta un cambio en MU acompañado del archivo raw del que procede',()=>{
  assert.deepEqual(unexplained(['MU'],['raw/aca2024_extract.psv','data/muni.json']),[]);
});

test('rechaza un cambio en MU si solo cambia el script de ensamblado',()=>{
  assert.deepEqual(unexplained(['MU'],['scripts/build_embed.js']),[`MU cambió sin cambios en ${SOURCES.MU.join(', ')}`]);
});

test('rechaza un cambio en una constante sin origen registrado',()=>{
  assert.deepEqual(unexplained(['NUEVA'],['src/app.js']),['NUEVA cambió y no tiene archivo de origen registrado']);
});

test('todas las constantes de datos comparadas tienen origen registrado',()=>{
  assert.deepEqual(DATA_CONSTS.filter(c=>!SOURCES[c]),[]);
});
