// Extrae de la IDEM (Comunidad de Madrid) la red de distribución de la EIEL fase 2023 y escribe raw/idem_eiel_rd_<fecha>.csv:
//   fase;prov;mun;ent;nucleo;tipo;transporte;estado;titular;gestion;tramos;len_m
// Una fila por combinación de núcleo y atributos, con los valores literales de la fuente y la suma de longitudes geodésicas
// (radio medio terrestre 6.371.008,8 m, como scripts/extract_eiel.js). Licencia: CC BY 4.0 Comunidad de Madrid.
// WFS 2.0 de la IDEM, GeoJSON en EPSG:4326, páginas de 10.000 objetos de una en una.
// Uso: node scripts/extract_idem_eiel.js [--fecha=AAAA-MM-DD] [--check]
//   --check vuelve a descargar y compara con raw/idem_eiel_rd_<fecha>.csv sin escribir nada.
const fs=require('fs');const path=require('path');const crypto=require('crypto');const d3=require('d3-geo');
const ROOT=path.resolve(__dirname,'..');
const WFS='https://idem.comunidad.madrid/geoidem/ServiciosPublicos/ows';
const LAYER='ServiciosPublicos:IDEM_EIEL_RED_DISTRIBUCION_23';
const FIELDS=['FASE','PROV','MUN','ENT','NUCLEO','TIPO','TRANSPORTE','ESTADO','TITULAR','GESTION'];
const R_EARTH=6371008.8;
const arg=k=>{const a=process.argv.find(x=>x.startsWith('--'+k+'='));return a?a.split('=')[1]:null;};
const FECHA=arg('fecha')||'2026-10-30';const CHECK=process.argv.includes('--check');
const OUT=`raw/idem_eiel_rd_${FECHA}.csv`;

async function get(params){
  const u=WFS+'?'+new URLSearchParams({service:'WFS',version:'2.0.0',...params});
  const r=await fetch(u);if(!r.ok)throw new Error(r.status+' '+u);return r;
}

// Agrega los tramos por combinación de atributos; los valores de la fuente se copian tal cual
function aggregate(features){
  const agg=new Map();
  for(const f of features){const p=f.properties;
    const k=FIELDS.map(x=>p[x]??'').join(';');
    const L=d3.geoLength(f.geometry)*R_EARTH;
    const a=agg.get(k)||{n:0,L:0};a.n++;a.L+=L;agg.set(k,a);}
  return [...agg].sort((a,b)=>a[0]<b[0]?-1:1).map(([k,a])=>`${k};${a.n};${Math.round(a.L)}`);
}

async function main(){
  // Primero el esquema: si la capa cambia de campos, se para aquí
  const xsd=await (await get({request:'DescribeFeatureType',typeNames:LAYER})).text();
  const missing=FIELDS.filter(f=>!xsd.includes(`name="${f}"`));if(missing.length)throw new Error('Faltan campos en '+LAYER+': '+missing);
  const hits=+/numberMatched="(\d+)"/.exec(await (await get({request:'GetFeature',typeNames:LAYER,resultType:'hits'})).text())[1];
  const feats=[];const ids=new Set();const pages=[];
  for(let s=0;s<hits;s+=10000){
    const buf=Buffer.from(await (await get({request:'GetFeature',typeNames:LAYER,outputFormat:'application/json',srsName:'EPSG:4326',count:10000,startIndex:s,sortBy:'FASE'})).arrayBuffer());
    pages.push(crypto.createHash('sha256').update(buf).digest('hex'));
    for(const f of JSON.parse(buf).features){if(ids.has(f.id))throw new Error('Objeto repetido entre páginas: '+f.id);ids.add(f.id);feats.push(f);}
    console.log(`página ${s/10000+1}: ${feats.length} de ${hits}`);
    await new Promise(r=>setTimeout(r,1000));}
  if(feats.length!==hits)throw new Error(`Se esperaban ${hits} objetos y llegaron ${feats.length}`);
  const text=['fase;prov;mun;ent;nucleo;tipo;transporte;estado;titular;gestion;tramos;len_m',...aggregate(feats)].join('\n')+'\n';
  if(CHECK){const old=fs.readFileSync(path.join(ROOT,OUT),'utf8');console.log(old===text?'Sin diferencias con '+OUT:'DIFERENCIAS con '+OUT);process.exitCode=old===text?0:1;return;}
  fs.writeFileSync(path.join(ROOT,OUT),text);
  console.log(OUT,feats.length,'tramos;',text.split('\n').length-2,'filas; SHA-256 de las páginas:',pages.join(' '));
}
module.exports={aggregate,FIELDS};
if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
