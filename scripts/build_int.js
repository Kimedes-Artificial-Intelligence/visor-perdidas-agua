// Capa internacional (FWG-1870, Parte 7): Italia (ISTAT) y estado de los demás países
// raw/italia_istat_perdite_2022.psv, raw/italia_istat_geo_2026.json, raw/italia_capoluoghi_cruce.psv, raw/internacional_paises.psv
//   -> data/internacional.json
// Misma proyección que el mapa de Europa (src/geometry/proj.json), para que Italia encaje sobre el mapa base.
// Los anillos se proyectan punto a punto y se dibujan con fill-rule evenodd: los huecos (San Marino, Vaticano) quedan huecos.
const fs=require('fs');const path=require('path');const d3=require('d3-geo');
const ROOT=path.resolve(__dirname,'..');
const F={perd:'raw/italia_istat_perdite_2022.psv',geo:'raw/italia_istat_geo_2026.json',cruce:'raw/italia_capoluoghi_cruce.psv',paises:'raw/internacional_paises.psv'};
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
  return {vb,reg,cap,it:[it.im,it.er,it.p],tc:[tc.im,tc.er,tc.p],geo:{src:G.meta.src,url:G.meta.url,sha256:G.meta.sha256,licencia:G.meta.licencia},paises};
}
module.exports={build,F,PAISES_COLS,PAISES_ESTADO};
if(require.main===module){const o=build();fs.writeFileSync(path.join(ROOT,'data/internacional.json'),JSON.stringify(o));
  console.log('internacional: Italia',Object.keys(o.reg).length,'regiones,',Object.keys(o.cap).length,'capoluoghi;',o.paises.length,'países en la tabla de estado');}
