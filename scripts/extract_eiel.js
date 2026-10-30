// Extrae de la EIEL (visor GEO-EIEL, Secretaría de Estado de Política Territorial) los CSV de raw/:
//   eiel_provincias_<fecha>.csv  prov;fase;nu;rd;nu_fase
//   eiel_nucleos_<fecha>.csv     geom_id;code;nucleo;padron;cons_invierno_m3d;cons_verano_m3d;perdidas_pct
//   eiel_rd_<fecha>.csv          key;len_m  (longitud geodésica de cada tramo, radio medio terrestre 6.371.008,8 m)
// Ejecución local con Playwright: eiel.redsara.es no responde desde la nube. Concurrencia baja: 4 peticiones como máximo y 60 ms de pausa.
// Uso: node scripts/extract_eiel.js [--fecha=AAAA-MM-DD] [--prov=11,14] [--check]
//   --check vuelve a extraer y compara, fila a fila y sin importar el orden, con los archivos de raw/ de esa fecha (solo las provincias pedidas).
const fs=require('fs');const path=require('path');const d3=require('d3-geo');const {chromium}=require('@playwright/test');
const ROOT=path.resolve(__dirname,'..');const BASE='https://eiel.redsara.es/visor';
const arg=k=>{const a=process.argv.find(x=>x.startsWith('--'+k+'='));return a?a.split('=')[1]:null;};
const FECHA=arg('fecha')||'2026-10-30';const CHECK=process.argv.includes('--check');
// Provincias de régimen común (País Vasco y Navarra quedan fuera de la EIEL por ley). Las que no están en el visor devuelven fases vacías.
const ALL=['02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','21','22','23','24','25','26','27','28','29','30','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','49','50','51','52'];
const PROVS=arg('prov')?arg('prov').split(','):ALL;
const R_EARTH=6371008.8;

// Valor de la ficha HTML del núcleo, por la etiqueta que lo precede. Sin etiqueta o sin número: vacío.
// Texto literal, sin comprimir espacios: la fuente tiene nombres con espacios dobles
const text=s=>s.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').trim();
function parseNucleo(html){
  const after=(re)=>{const m=re.exec(html);if(!m)return '';const d=/<div class="col-sm-\d+ datosInfo"[^>]*>([\s\S]*?)<\/div>/.exec(html.slice(m.index+m[0].length));return d?text(d[1]):'';};
  const n=s=>{const m=/-?\d+(?:[.,]\d+)?/.exec(s.replace(/\.(?=\d{3}\b)/g,''));return m?m[0]:'';};
  const pad=/<th scope="col">Padrón<\/th>[\s\S]*?<tbody>\s*<tr>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>/.exec(html);
  return {nucleo:after(/<div class="col-sm-4 etiqueta">Núcleo<\/div>/),padron:pad?n(pad[2]):'',
    inv:n(after(/title="Consumo medio en la temporada de INVIERNO[^"]*">/)),ver:n(after(/title="Consumo medio en la temporada de VERANO[^"]*">\s*Verano\s*<\/div>/)),
    per:n(after(/Pérdidas abastecimiento %\s*<\/div>/))};
}

async function main(){
  const browser=await chromium.launch();const page=await browser.newPage();
  await page.goto(BASE+'/',{waitUntil:'domcontentloaded'});
  // Las peticiones salen del navegador, en la sesión del visor, con la concurrencia limitada
  const get=(url,type)=>page.evaluate(async([u,t])=>{const r=await fetch(u);if(!r.ok)throw new Error(r.status+' '+u);return t==='json'?r.json():r.text();},[url,type]);
  const pool=async(items,fn)=>{const out=new Array(items.length);let i=0;
    await Promise.all(Array.from({length:4},async()=>{while(i<items.length){const k=i++;out[k]=await fn(items[k]);await new Promise(r=>setTimeout(r,60));}}));return out;};
  const prov=[],nu=[],rd=[];
  for(const p of PROVS){
    const fases=(await get(`${BASE}/get_fases/entidad:${p}`,'json')).map(f=>f.fase).sort().reverse();
    if(!fases.length){prov.push([p,'',0,0,'']);console.log(p,'sin fases');continue;}
    const layer=(f,c)=>get(`${BASE}/layer-json/fase:${f}-codine:${p}/capa:${c}`,'json');
    const fase=fases[0];const rdL=await layer(fase,'RD');const nuL0=await layer(fase,'NU');
    // Núcleos: la fase más reciente que los tiene (Burgos: red 2021, núcleos 2017)
    let nuF=fase,nuL=nuL0;for(const f of fases.slice(1)){if(nuL.length)break;nuF=f;nuL=await layer(f,'NU');}
    prov.push([p,fase,nuL0.length,rdL.length,nuL.length?nuF:'']);
    const len={};for(const t of rdL)len[t.geom_key]=(len[t.geom_key]||0)+d3.geoLength(JSON.parse(t.geom))*R_EARTH;
    for(const [k,v] of Object.entries(len))rd.push([k,Math.round(v)]);
    const rows=await pool(nuL,async t=>{const x=parseNucleo(await get(`${BASE}/infowindow/show/${p}-${t.geom_id}/0/0`,'text'));
      return [t.geom_id,t.geom_key.replace('-NU-','-'),x.nucleo,x.padron,x.inv,x.ver,x.per];});
    nu.push(...rows);console.log(p,'fase',fase,'red',rdL.length,'núcleos',nuL.length,nuF);}
  await browser.close();
  const files={provincias:['prov;fase;nu;rd;nu_fase',prov],nucleos:['geom_id;code;nucleo;padron;cons_invierno_m3d;cons_verano_m3d;perdidas_pct',nu],rd:['key;len_m',rd]};
  let bad=0;
  for(const [name,[head,rows]] of Object.entries(files)){const f=path.join(ROOT,`raw/eiel_${name}_${FECHA}.csv`);const lines=rows.map(r=>r.join(';'));
    if(!CHECK){fs.writeFileSync(f,[head,...lines].join('\n')+'\n');console.log(f,lines.length,'filas');continue;}
    // Solo las filas de las provincias extraídas
    const mine=l=>PROVS.some(p=>name==='provincias'?l.startsWith(p+';'):name==='rd'?l.slice(8,10)===p:l.split(';')[1].slice(5,7)===p);
    const cur=new Set(fs.readFileSync(f,'utf8').trim().split('\n').slice(1).filter(mine));const now=new Set(lines);
    const miss=[...cur].filter(l=>!now.has(l)),extra=lines.filter(l=>!cur.has(l));
    console.log(name,cur.size,'filas en raw,',now.size,'extraídas;',miss.length,'faltan,',extra.length,'nuevas');
    for(const l of [...miss.slice(0,3).map(x=>'- '+x),...extra.slice(0,3).map(x=>'+ '+x)])console.log('  '+l);bad+=miss.length+extra.length;}
  if(CHECK&&bad)process.exitCode=1;
}
module.exports={parseNucleo};
if(require.main===module)main().catch(e=>{console.error(e);process.exit(1);});
