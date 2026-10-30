// Correcciones de la revisión de FWG-1870 (FWG-1871, Parte B): lector de hojas, fechas y años, tabla de países
const test=require('node:test');const assert=require('node:assert/strict');
const {xlsx}=require('../../scripts/lib/sheet.js');
const {checkA63}=require('../../scripts/build_art63.js');
const {build,PAISES_ESTADO}=require('../../scripts/build_int.js');

const sheet=rows=>({'xl/worksheets/sheet1.xml':()=>Buffer.from(`<worksheet><sheetData>${rows}</sheetData></worksheet>`)});
test('una fila vacía autocerrada (<row/>) no se traga la fila siguiente',()=>{
  const r=xlsx(sheet('<row r="1"><c r="A1"><v>1</v></c></row><row r="2" spans="1:3"/><row r="3"><c r="A3"><v>3</v></c><c r="AA3" t="inlineStr"><is><t>x</t></is></c></row>'));
  assert.deepEqual(r[0],['1']);assert.deepEqual(r[1],[]);assert.equal(r[2][0],'3');assert.equal(r[2][26],'x');
});
const row=o=>Object.assign({ine:'14021',operador:'X',indicador:'ANR',valor:'8.45',unidad:'%','año_dato':'2025',url:'https://a.es/d.pdf',fecha_consulta:'2026-10-30',
  pagina_o_seccion:'p.1',licencia_o_aviso_legal:'https://a.es/aviso «cita»',nota:'',_line:1},o);
test('la fecha de consulta tiene que existir y el año del dato no puede ser posterior a ella',()=>{
  const P=new Set(['14021']);
  assert.deepEqual(checkA63([row({})],P),[]);
  assert.ok(checkA63([row({fecha_consulta:'2026-13-45'})],P).length);
  assert.ok(checkA63([row({fecha_consulta:'2026-02-30'})],P).length);
  assert.ok(checkA63([row({'año_dato':'2027'})],P).length);
  assert.deepEqual(checkA63([row({'año_dato':'2027',fecha_consulta:'2027-03-01'})],P),[]);
});
test('la tabla de países tiene 8 columnas y estados que la leyenda conoce',()=>{
  const {paises}=build();
  for(const p of paises){assert.deepEqual(Object.keys(p),['pais','fuente','granularidad','anio','licencia','estado','motivo','url'],p.pais);assert.ok(PAISES_ESTADO.includes(p.estado),p.pais);}
});
