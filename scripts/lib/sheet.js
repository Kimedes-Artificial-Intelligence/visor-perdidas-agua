// Lectura mínima de hojas de cálculo XLSX y ODS sin dependencias: zip + XML de la primera hoja.
// Devuelve las filas como arrays de texto, tal como aparecen en la celda (sin interpretar números).
const fs=require('fs');const zlib=require('zlib');

function unzip(buf){
  let eocd=buf.length-22;while(eocd>=0&&buf.readUInt32LE(eocd)!==0x06054b50)eocd--;
  if(eocd<0)throw new Error('no es un archivo zip');
  const n=buf.readUInt16LE(eocd+10);let p=buf.readUInt32LE(eocd+16);const files={};
  for(let i=0;i<n;i++){
    const method=buf.readUInt16LE(p+10),size=buf.readUInt32LE(p+20),nl=buf.readUInt16LE(p+28),xl=buf.readUInt16LE(p+30),cl=buf.readUInt16LE(p+32),off=buf.readUInt32LE(p+42);
    const name=buf.toString('utf8',p+46,p+46+nl);
    const start=off+30+buf.readUInt16LE(off+26)+buf.readUInt16LE(off+28);const raw=buf.subarray(start,start+size);
    files[name]=()=>method===0?raw:zlib.inflateRawSync(raw);
    p+=46+nl+xl+cl;}
  return files;
}

const unxml=s=>s.replace(/<[^>]+>/g,'').replace(/&(lt|gt|amp|quot|apos|#(\d+)|#x([0-9a-f]+));/gi,(m,e,d,h)=>
  d?String.fromCodePoint(+d):h?String.fromCodePoint(parseInt(h,16)):{lt:'<',gt:'>',amp:'&',quot:'"',apos:"'"}[e]);
const colIdx=ref=>{let n=0;for(const ch of ref.match(/^[A-Z]+/)[0])n=n*26+ch.charCodeAt(0)-64;return n-1;};

// Ruta de la hoja con ese nombre, por el libro y sus relaciones; sin nombre, la primera hoja
function xlsxSheetPath(files,name){
  if(!name)return Object.keys(files).filter(f=>/^xl\/worksheets\/sheet\d+\.xml$/.test(f)).sort((a,b)=>parseInt(a.match(/\d+/))-parseInt(b.match(/\d+/)))[0];
  const wb=files['xl/workbook.xml']().toString('utf8'),rels=files['xl/_rels/workbook.xml.rels']().toString('utf8');
  const s=[...wb.matchAll(/<sheet\b[^>]*?name="([^"]*)"[^>]*?r:id="([^"]*)"/g)].find(m=>unxml(m[1])===name);if(!s)throw new Error('no existe la hoja '+name);
  const t=new RegExp('<Relationship\\b[^>]*?Id="'+s[2]+'"[^>]*?Target="([^"]*)"').exec(rels)||new RegExp('<Relationship\\b[^>]*?Target="([^"]*)"[^>]*?Id="'+s[2]+'"').exec(rels);
  return 'xl/'+t[1].replace(/^\/?xl\//,'');
}
function xlsx(files,name){
  const ss=files['xl/sharedStrings.xml']?[...files['xl/sharedStrings.xml']().toString('utf8').matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m=>unxml(m[1].replace(/<rPh[\s\S]*?<\/rPh>/g,''))):[];
  const sheet=xlsxSheetPath(files,name);
  const rows=[];
  for(const r of files[sheet]().toString('utf8').matchAll(/<row\b([^>]*)>([\s\S]*?)<\/row>/g)){
    const ri=+/r="(\d+)"/.exec(r[1])[1]-1;const row=[];
    for(const c of r[2].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)){
      const ref=/r="([A-Z]+\d+)"/.exec(c[1])[1],t=(/t="(\w+)"/.exec(c[1])||[])[1],body=c[2]||'';
      const v=(/<v>([\s\S]*?)<\/v>/.exec(body)||[])[1];
      row[colIdx(ref)]=t==='s'?ss[+v]:t==='inlineStr'?unxml((/<is>([\s\S]*?)<\/is>/.exec(body)||['',''])[1]):v==null?'':unxml(v);}
    rows[ri]=Array.from(row,x=>x??'');}
  return Array.from(rows,x=>x??[]);
}

function ods(files){
  const xml=files['content.xml']().toString('utf8');
  const table=/<table:table\b[\s\S]*?<\/table:table>/.exec(xml)[0];const rows=[];
  for(const r of table.matchAll(/<table:table-row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/table:table-row>)/g)){
    const rep=+((/table:number-rows-repeated="(\d+)"/.exec(r[1])||[])[1]||1);const row=[];
    for(const c of (r[2]||'').matchAll(/<table:(?:covered-)?table-cell\b([^>]*?)(?:\/>|>([\s\S]*?)<\/table:(?:covered-)?table-cell>)/g)){
      const crep=+((/table:number-columns-repeated="(\d+)"/.exec(c[1])||[])[1]||1);
      const val=(/office:value="([^"]*)"/.exec(c[1])||[])[1];
      const text=[...(c[2]||'').matchAll(/<text:p\b[^>]*?(?:\/>|>([\s\S]*?)<\/text:p>)/g)].map(p=>unxml((p[1]||'').replace(/<text:s\b[^>]*?c="(\d+)"[^>]*\/>/g,(m,n)=>' '.repeat(+n)).replace(/<text:s\b[^>]*\/>/g,' '))).join('\n');
      const v=val!=null?val:text;
      for(let i=0;i<Math.min(crep,1024);i++)row.push(v);}
    while(row.length&&row[row.length-1]==='')row.pop();
    for(let i=0;i<Math.min(rep,row.length?rep:1);i++)rows.push(row.slice());}
  return rows;
}

// El formato se detecta por el contenido, no por la extensión (la CAIB enlaza un XLSX como ODS)
// name: hoja de un XLSX por su nombre (opcional)
function readSheet(file,name){
  const files=unzip(fs.readFileSync(file));
  if(files['xl/workbook.xml'])return {format:'xlsx',rows:xlsx(files,name)};
  if(files['mimetype']&&files['mimetype']().toString().includes('opendocument.spreadsheet'))return {format:'ods',rows:ods(files)};
  throw new Error(file+': formato no reconocido');
}
module.exports={readSheet};
