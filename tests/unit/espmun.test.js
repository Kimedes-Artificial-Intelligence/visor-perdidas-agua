// España por municipio: datos de Illes Balears (Govern IB), padrón del INE, geometría nacional y tamaño de la página
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('fs');const path=require('path');const {execFileSync}=require('child_process');
const {ROOT,DIST,dataConsts,read}=require('../lib/page.js');
const rows=f=>fs.readFileSync(path.join(ROOT,f),'utf8').trim().split('\n').filter(l=>!l.startsWith('#')).map(l=>l.split('|'));
const atlas=require('es-atlas/es/municipalities.json').objects.municipalities.geometries;
const ATLAS=new Set(atlas.map(g=>g.id));
const MUNIS=atlas.filter(g=>!/^5[34]/.test(g.id)).map(g=>g.id);

const IB=rows('raw/caib_abastiment_2000_2024.psv');
test('Baleares: 67 municipios con los 25 años 2000-2024 cada uno',()=>{
  const by={};for(const r of IB)(by[r[0]]??=[]).push(+r[3]);
  assert.equal(Object.keys(by).length,67);
  const want=Array.from({length:25},(_,i)=>2000+i);
  assert.deepEqual(Object.entries(by).filter(([,y])=>JSON.stringify(y.sort())!==JSON.stringify(want)).map(([c])=>c),[]);
});
test('Baleares: todos los códigos están en es-atlas y son de la provincia 07',()=>{
  assert.deepEqual(IB.filter(r=>!ATLAS.has(r[0])||!r[0].startsWith('07')).map(r=>r[0]),[]);
});
test('Baleares: los 67 valores de 2024 coinciden con la tabla de control (tolerancia 0,01)',()=>{
  const d=Object.fromEntries(IB.filter(r=>r[3]==='2024').map(r=>[r[0],r]));
  const ctl=rows('tests/fixtures/caib_control_2024.psv');assert.equal(ctl.length,67);
  assert.deepEqual(ctl.filter(([c,p,dr])=>!d[c]||Math.abs(+d[c][6]-+p)>0.01||d[c][7]!==dr).map(([c])=>c),[]);
});
test('Baleares: todos los porcentajes están entre 0 y 100',()=>{
  const bad=IB.filter(r=>[r[6],r[7]].some(v=>v!==''&&!(+v>=0&&+v<=100)));
  assert.deepEqual(bad.map(r=>r[0]+' '+r[3]),[]);
  assert.deepEqual(IB.filter(r=>r[6]==='').map(r=>r[0]+' '+r[3]),[]);
});
test('Baleares: la transcripción coincide con la extracción de los originales de raw/caib/',()=>{
  execFileSync(process.execPath,['scripts/extract_caib.js','--check'],{cwd:ROOT,stdio:'pipe'});
});
test('Padrón INE 2025: la transcripción coincide con el original y cubre todos los municipios de es-atlas',()=>{
  execFileSync(process.execPath,['scripts/extract_ine_padron.js','--check'],{cwd:ROOT,stdio:'pipe'});
  const pad=new Set(rows('raw/ine_padron2025.psv').map(r=>r[0]));
  assert.deepEqual(MUNIS.filter(id=>!pad.has(id)),[]);
});

const dist=dataConsts(read(DIST));
// 4 MB desde FWG-1868 (datos EIEL y SINAC de 8.000 municipios); antes 2,5 MB
test('la página no supera 4 MB sin comprimir',()=>{
  const size=fs.statSync(DIST).size;
  assert.ok(size<=4*1024*1024,`dist/index.html ocupa ${size} bytes`);
});
test('ningún municipio desaparece: los 8.131 tienen trazado o punto, y nada más',()=>{
  const drawn=[...Object.keys(dist.MUN.mu),...Object.keys(dist.MUN.dot)].sort();
  assert.deepEqual(drawn,MUNIS.slice().sort());
  assert.deepEqual(Object.keys(dist.MUN.sh).filter(id=>!id.startsWith('53')),[]);
});
test('cada municipio tiene nombre, población y una provincia con comunidad',()=>{
  assert.deepEqual(Object.keys(dist.MUD).sort(),MUNIS.slice().sort());
  assert.deepEqual(MUNIS.filter(id=>!(dist.MUD[id][1]>0)||!dist.PROV[id.slice(0,2)]),[]);
});
test('los nombres de Catalunya son los de la vista Catalunya',()=>{
  assert.deepEqual(Object.keys(dist.MU).filter(id=>dist.MUD[id][0]!==dist.MU[id][0]),[]);
});
test('la población de España es la suma del padrón',()=>{
  assert.equal(dist.POP_ES,rows('raw/ine_padron2025.psv').reduce((a,r)=>a+ +r[2],0));
});
test('la tabla provincia-comunidad coincide con la geometría de es-atlas',()=>{
  const tc=require('topojson-client'),d3=require('d3-geo');const t=require('es-atlas/es/municipalities.json');
  const cc=tc.feature(t,t.objects.autonomous_regions).features,mu=tc.feature(t,t.objects.municipalities).features;
  const bad=[];
  for(const [p,[,c]] of Object.entries(dist.PROV)){const m=mu.find(f=>f.id.startsWith(p)&&d3.geoArea(f)>0);
    const r=cc.find(f=>d3.geoContains(f,d3.geoCentroid(m)));if(!r||r.id!==c)bad.push(p);}
  assert.deepEqual(bad,[]);
});
