// Transcribe el padrón municipal del INE a 1/1/2025 (raw/ine/pobmun25.xlsx) a raw/ine_padron2025.psv
// Uso: node scripts/extract_ine_padron.js [--check]
const fs=require('fs');const path=require('path');const {readSheet}=require('./lib/sheet.js');
const ROOT=path.resolve(__dirname,'..');const SRC='raw/ine/pobmun25.xlsx';const OUT='raw/ine_padron2025.psv';
const {rows}=readSheet(path.join(ROOT,SRC));
const h=rows.findIndex(r=>r[0]==='CPRO');const H=rows[h];
const [cP,cM,cN,cT]=['CPRO','CMUN','NOMBRE','POB25'].map(k=>{const i=H.indexOf(k);if(i<0)throw new Error('falta la columna '+k);return i;});
const lines=rows.slice(h+1).filter(r=>/^\d{2}$/.test(r[cP]||'')).map(r=>{
  if(!/^\d{3}$/.test(r[cM])||!/^\d+$/.test(r[cT]))throw new Error('fila no válida: '+r.join('|'));
  return [r[cP]+r[cM],r[cN].trim(),r[cT]].join('|');}).sort();
const text=['# INE, Cifras oficiales de población resultantes de la Revisión del Padrón municipal a 1 de enero de 2025.',
  '# Fichero pobmun25.xlsx del archivo https://www.ine.es/pob_xls/pobmun.zip, descargado el 22/10/2026. Licencia CC BY 4.0 (INE).',
  '# Generado por scripts/extract_ine_padron.js desde raw/ine/pobmun25.xlsx.',
  '# codigo_ine|nombre|poblacion',...lines].join('\n')+'\n';
if(process.argv.includes('--check')){if(fs.readFileSync(path.join(ROOT,OUT),'utf8')!==text){console.error(OUT+' no coincide con '+SRC);process.exit(1);}console.log(OUT+' coincide');}
else{fs.writeFileSync(path.join(ROOT,OUT),text);console.log(OUT,lines.length,'municipios, total',lines.reduce((a,l)=>a+ +l.split('|')[2],0));}
