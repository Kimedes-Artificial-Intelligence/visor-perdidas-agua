// Italia (FWG-1870, Parte 7): transcribe las pérdidas de ISTAT, Censimento delle acque per uso civile, año 2022
// raw/italia/Istat-GMA2024-Tavole.xlsx (hojas «Tav 3», regiones, y «Tav 5», comuni capoluogo)
//   -> raw/italia_istat_perdite_2022.psv: tipo|nombre|immessa|erogata|perdite_pct|clase_lineal
// tipo: N Italia, M ripartición, R región, A provincia autónoma (Bolzano, Trento), C comune capoluogo, T total de capoluoghi.
// Volúmenes: regiones en millones de m3, capoluoghi en miles de m3. Perdite = % sobre el volumen inmesso en red, tal como lo publica ISTAT.
// Algunas celdas guardan el decimal como coma flotante binaria (33.799999999999997): se escribe con los decimales que publica ISTAT.
const fs=require('fs');const path=require('path');const {readSheet}=require('./lib/sheet.js');
const ROOT=path.resolve(__dirname,'..');
const SRC='raw/italia/Istat-GMA2024-Tavole.xlsx',OUT='raw/italia_istat_perdite_2022.psv';
const RIP=new Set(['Nord-ovest','Nord-est','Centro','Sud','Isole']);
const fix=(v,d)=>v===''?'':String(Math.round(+v*10**d)/10**d);
const clean=s=>s.replace(/\s+/g,' ').trim();

function extract(file=path.join(ROOT,SRC)){
  const out=[];
  for(const r of readSheet(file,'Tav 3').rows.slice(5)){const n=clean(r[0]||'');if(!n||!/^[\d.]+$/.test(r[7]||''))continue;
    const t=n==='ITALIA'?'N':RIP.has(n)?'M':/^(Bolzano\/Bozen|Trento)$/.test(n)?'A':'R';
    out.push([t,n,fix(r[1],1),fix(r[4],1),fix(r[7],1),'']);}
  const rows=readSheet(file,'Tav 5').rows,head=rows[4];
  for(const r of rows.slice(6)){const n=clean(r[0]||'');if(!n||!/^[\d.]+$/.test(r[7]||''))continue;
    const k=[8,9,10,11,12,13].find(i=>(r[i]||'').trim().toLowerCase()==='x');
    out.push([/^Totale comuni capoluogo/.test(n)?'T':'C',n.replace(/ \([a-z]\)$/,''),fix(r[1],0),fix(r[4],0),fix(r[7],1),k!=null?head[k]+' m3/día/km':'']);}
  return out;
}
module.exports={extract,SRC,OUT};
if(require.main===module){
  const out=extract();
  const sha=require('crypto').createHash('sha256').update(fs.readFileSync(path.join(ROOT,SRC))).digest('hex');
  fs.writeFileSync(path.join(ROOT,OUT),[`# ISTAT, Censimento delle acque per uso civile, anno 2022. ${SRC} (SHA-256 ${sha}), hojas «Tav 3» y «Tav 5». CC BY 4.0`,
    'tipo|nombre|immessa|erogata|perdite_pct|clase_lineal',...out.map(r=>r.join('|'))].join('\n')+'\n');
  console.log(OUT,out.length,'filas;',out.filter(r=>r[0]==='C').length,'capoluoghi');
}
