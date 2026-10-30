// Capa internacional (FWG-1870, Parte 7): Italia (ISTAT), Inglaterra (Environment Agency, FWG-1871 Parte D) y estado de los demás países
// raw/italia_istat_perdite_2022.psv, raw/italia_istat_geo_2026.json, raw/italia_capoluoghi_cruce.psv, raw/internacional_paises.psv,
// raw/inglaterra_ea_fugas_2024-25.psv, raw/inglaterra_ea_wrz_2025.json
//   -> data/internacional.json
// Misma proyección que el mapa de Europa (src/geometry/proj.json), para que Italia encaje sobre el mapa base.
// Los anillos se proyectan punto a punto y se dibujan con fill-rule evenodd: los huecos (San Marino, Vaticano) quedan huecos.
const fs=require('fs');const path=require('path');const d3=require('d3-geo');
const ROOT=path.resolve(__dirname,'..');
const F={perd:'raw/italia_istat_perdite_2022.psv',geo:'raw/italia_istat_geo_2026.json',cruce:'raw/italia_capoluoghi_cruce.psv',paises:'raw/internacional_paises.psv',
  enFugas:'raw/inglaterra_ea_fugas_2024-25.psv',enGeo:'raw/inglaterra_ea_wrz_2025.json'};
const EN_COLS=['empresa','codigo','fuga_ml_d','fuga_l_prop_dia','año','url','fecha_consulta','hoja_o_pagina','licencia','nota'];
// Inglaterra: una fila por compañía e indicador (Ml/d o l/propiedad/día), con el código de la compañía en la capa de zonas de la EA
function checkEn(rows,codes){
  const err=[];const at=r=>`${F.enFugas}, línea ${r._line}`;const seen=new Set();const num=v=>/^\d+(\.\d+)?$/.test(v);
  for(const r of rows){
    if(!codes.has(r.codigo))err.push(`${at(r)}: código "${r.codigo}" sin geometría en ${F.enGeo}`);
    const k=(r.fuga_ml_d!==''?'mld':'')+(r.fuga_l_prop_dia!==''?'lpd':'');
    if(k!=='mld'&&k!=='lpd')err.push(`${at(r)}: cada fila lleva un solo indicador`);
    for(const c of ['fuga_ml_d','fuga_l_prop_dia'])if(r[c]!==''&&!num(r[c]))err.push(`${at(r)}: ${c} "${r[c]}"`);
    if(!/^(24\/25|2024 to 2025)$/.test(r['año']))err.push(`${at(r)}: año "${r['año']}"`);
    if(!/^https:\/\/\S/.test(r.url)||!/^\d{4}-\d{2}-\d{2}$/.test(r.fecha_consulta)||!r.hoja_o_pagina||!/^https:\/\/\S+ /.test(r.licencia))err.push(`${at(r)}: falta URL, fecha, página o licencia`);
    const key=r.codigo+'|'+k;if(seen.has(key))err.push(`${at(r)}: ${key} repetido`);seen.add(key);}
  return err;
}
const pr=require('../src/geometry/proj.json');const P=d3.geoAzimuthalEqualArea().rotate(pr.rotate).scale(pr.scale).translate(pr.translate);
const rows=t=>t.trim().split('\n').filter(l=>!l.startsWith('#'));
const r2=v=>Math.round(v*100)/100;

// Tabla de estado por país: columnas fijas y estados que conoce la leyenda (INT_ST en src/app.js)
const PAISES_COLS=['pais','fuente','granularidad','anio','licencia','estado','motivo','url'],PAISES_ESTADO=['datos','licencia','descarga_manual','sin_capa'];
function build(read=f=>fs.readFileSync(path.join(ROOT,f),'utf8')){
  const [ph,...pl]=rows(read(F.perd));if(ph!=='tipo|nombre|immessa|erogata|perdite_pct|clase_lineal')throw new Error(F.perd+': cabecera');
  const perd=pl.map(l=>{const [t,n,im,er,p,cl]=l.split('|');return {t,n,im:+im,er:+er,p:+p,cl};});
  const G=JSON.parse(read(F.geo));
  const reg={};let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
  for(const [k,o] of Object.entries(G.reg)){const v=perd.find(r=>r.t==='R'&&r.n===o.n);if(!v)throw new Error(`Región sin dato en ${F.perd}: ${o.n}`);
    const d=o.rings.map(r=>'M'+r.map(p=>{const [x,y]=P(p);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);return r2(x)+','+r2(y);}).join('L')+'Z').join('');
    reg[k]=[d,o.n,v.im,v.er,v.p];}
  const [,...cl]=rows(read(F.cruce));const cap={};
  for(const l of cl){const [n,pro]=l.split('|');const c=G.com[pro];if(!c)throw new Error(`${F.cruce}: ${pro} sin geometría`);
    const v=perd.find(r=>r.t==='C'&&r.n===n);if(!v)throw new Error(`${F.cruce}: ${n} sin dato`);const [x,y]=P(c.c);
    cap[pro]=[r2(x),r2(y),n,v.im,v.er,v.p,v.cl,c.reg];}
  if(Object.keys(cap).length!==perd.filter(r=>r.t==='C').length)throw new Error('Faltan capoluoghi en el cruce');
  const pad=8,vb=[r2(x0-pad),r2(y0-pad),r2(x1-x0+2*pad),r2(y1-y0+2*pad)];
  const it=perd.find(r=>r.t==='N'),tc=perd.find(r=>r.t==='T');
  const {psv}=require('./build_art63.js');
  const paises=psv(read(F.paises),PAISES_COLS,F.paises).map(({_line,...r})=>r);
  for(const p of paises)if(!PAISES_ESTADO.includes(p.estado))throw new Error(`${F.paises}: estado "${p.estado}" de ${p.pais}`);
  return {vb,reg,cap,it:[it.im,it.er,it.p],tc:[tc.im,tc.er,tc.p],geo:{src:G.meta.src,url:G.meta.url,sha256:G.meta.sha256,licencia:G.meta.licencia},paises,en:buildEn(read,psv)};
}
// Inglaterra: zonas de cada compañía proyectadas igual que Italia; fugas por compañía tal como se publican
function buildEn(read,psv){
  const G=JSON.parse(read(F.enGeo));const rows=psv(read(F.enFugas),EN_COLS,F.enFugas);
  const err=checkEn(rows,new Set(Object.keys(G.cia)));if(err.length)throw new Error(err.join('\n'));
  const src=k=>{const r=rows.find(x=>x[k]!=='');return {url:r.url,legal:r.licencia,date:r.fecha_consulta,y:r['año']};};
  let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;const cia={};
  for(const [code,o] of Object.entries(G.cia)){
    const d=o.rings.map(r=>'M'+r.map(p=>{const [x,y]=P(p);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);return r2(x)+','+r2(y);}).join('L')+'Z').join('');
    const m=rows.find(r=>r.codigo===code&&r.fuga_ml_d!==''),l=rows.find(r=>r.codigo===code&&r.fuga_l_prop_dia!=='');
    // [trazado, nombre, tipo, Ml/d, l/propiedad/día, celda o figura de cada uno]
    cia[code]=[d,o.n,o.tipo,m?+m.fuga_ml_d:null,l?+l.fuga_l_prop_dia:null,m?m.hoja_o_pagina:'',l?l.hoja_o_pagina:''];}
  const pad=6;
  return {vb:[r2(x0-pad),r2(y0-pad),r2(x1-x0+2*pad),r2(y1-y0+2*pad)],cia,src:{mld:src('fuga_ml_d'),lpd:src('fuga_l_prop_dia')},
    geo:{src:G.meta.src,url:G.meta.url,sha256:G.meta.sha256,licencia:G.meta.licencia}};
}
module.exports={build,F,PAISES_COLS,PAISES_ESTADO,EN_COLS,checkEn};
if(require.main===module){const o=build();fs.writeFileSync(path.join(ROOT,'data/internacional.json'),JSON.stringify(o));
  console.log('internacional: Italia',Object.keys(o.reg).length,'regiones,',Object.keys(o.cap).length,'capoluoghi; Inglaterra',Object.values(o.en.cia).filter(c=>c[4]!=null).length,'de',Object.keys(o.en.cia).length,'compañías con dato;',o.paises.length,'países en la tabla de estado');}
