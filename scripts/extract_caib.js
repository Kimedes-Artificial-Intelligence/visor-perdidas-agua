// Transcribe los cuatro ficheros del Govern de les Illes Balears (raw/caib/) a raw/caib_abastiment_2000_2024.psv
// Uso: node scripts/extract_caib.js [--check]  (--check compara con el archivo existente sin escribirlo)
const fs=require('fs');const path=require('path');const {readSheet}=require('./lib/sheet.js');
const ROOT=path.resolve(__dirname,'..');
const PAGE='https://www.caib.es/sites/aigua/ca/proveament_distribucia_potabilitzacia/';
const FILES=[
  ['raw/caib/mallorca_2026-10-22.xlsx','Mallorca','MCRST259ZI474988&id=474988'],
  ['raw/caib/menorca_2026-10-22.ods','Menorca','MCRST259ZI474963&id=474963'],
  ['raw/caib/eivissa_2026-10-22.ods','Eivissa','MCRST259ZI474986&id=474986'],
  ['raw/caib/formentera_2026-10-22.ods','Formentera','MCRST259ZI474987&id=474987'],
];
const CONSULTA='2026-10-22';const YEARS=25;const OUT='raw/caib_abastiment_2000_2024.psv';
const COLS=['codigo_ine','municipio','isla','anio','total_subministrat_hm3','consum_hm3','pct_aigua_no_comptabilitzada','pct_dades_reals','fuente_url','fecha_consulta'];

// Tabla de cruce: nombre en la fuente -> código INE. Nunca se une por nombre aproximado.
const cruce={};
for(const l of fs.readFileSync(path.join(ROOT,'raw/caib_cruce_ine.psv'),'utf8').trim().split('\n')){
  if(l.startsWith('#'))continue;const [ine,,fuente,isla]=l.split('|');cruce[isla+'|'+fuente]=ine;}

const clean=s=>String(s??'').trim();
// Celdas vacías o con guion: sin valor. Coma decimal (Formentera): se pasa a punto. El valor se conserva sin redondear.
const num=s=>{s=clean(s);if(s===''||/^-+$/.test(s))return '';s=s.replace(',','.');if(!/^-?\d+(\.\d+)?(e-?\d+)?$/i.test(s))throw new Error('valor no numérico: "'+s+'"');return s;};

function extract([file,isla,param]){
  const {rows}=readSheet(path.join(ROOT,file));
  // Cabecera: la fila con una celda exactamente igual a TERME MUNICIPAL (la del título también contiene el texto)
  const h=rows.findIndex(r=>r&&r.some(c=>clean(c)==='TERME MUNICIPAL'));if(h<0)throw new Error(file+': sin cabecera');
  const H=rows[h].map(clean);const col=re=>{const i=H.findIndex(c=>re.test(c));if(i<0)throw new Error(file+': falta la columna '+re);return i;};
  const cN=H.indexOf('TERME MUNICIPAL'),cY=col(/^ANY$/),cT=col(/^TOTAL SUBMINISTRAT/),cC=col(/^CONSUM/),cP=col(/no comptabilitzada/),cR=col(/^% dades reals/);
  const out=[];let cur=null;
  for(let i=h+1;i<rows.length;i++){const r=rows[i]||[];const y=clean(r[cY]);const nm=clean(r[cN]);
    // Tras los datos vienen las notas al pie: la primera fila con texto y sin año cierra la tabla
    if(!/^\d{4}$/.test(y)){if(cur&&nm)break;continue;}
    // Cada municipio es un bloque de 25 filas que empieza en 2000; el nombre puede venir partido en varias filas
    if(y==='2000'){if(cur)out.push(cur);cur={name:[],rows:[]};}
    if(!cur)throw new Error(file+': año '+y+' antes de un bloque');
    if(nm)cur.name.push(nm);
    cur.rows.push({y,t:num(r[cT]),c:num(r[cC]),p:num(r[cP]),r:num(r[cR])});}
  if(cur)out.push(cur);
  const url=PAGE+'archivopub.do?ctrl='+param;
  return out.map(b=>{const name=b.name.join(' ');const ine=cruce[isla+'|'+name];
    if(!ine)throw new Error(`${file}: "${name}" no está en raw/caib_cruce_ine.psv`);
    if(b.rows.length!==YEARS||b.rows.some((x,i)=>+x.y!==2000+i))throw new Error(`${file}: ${name} no tiene los años 2000-2024 seguidos`);
    return b.rows.map(x=>[ine,name,isla,x.y,x.t,x.c,x.p,x.r,url,CONSULTA].join('|'));}).flat();
}

const lines=FILES.flatMap(extract).sort();
const text=['# Govern de les Illes Balears, Servei de Planificació (Portal de l\'Aigua). Resum anual de dades d\'abastiment urbà d\'aigua, anys 2000 a 2024.',
  '# Estimacions del Servei de Planificació a partir de la informació rebuda dels gestors de l\'abastiment i ABAQUA. Llicència CC BY-SA (aviso legal CAIB).',
  '# Generado por scripts/extract_caib.js desde raw/caib/. No editar a mano: las correcciones van en los originales o en el script.',
  '# '+COLS.join('|'),...lines].join('\n')+'\n';
if(process.argv.includes('--check')){
  const cur=fs.readFileSync(path.join(ROOT,OUT),'utf8');
  if(cur!==text){console.error(OUT+' no coincide con la extracción de raw/caib/');process.exit(1);}
  console.log(OUT+' coincide con la extracción');}
else{fs.writeFileSync(path.join(ROOT,OUT),text);console.log(OUT,lines.length,'filas,',new Set(lines.map(l=>l.slice(0,5))).size,'municipios');}
