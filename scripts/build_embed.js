const fs=require('fs');
const C=JSON.parse(fs.readFileSync('data/ccaa.json'));const M=JSON.parse(fs.readFileSync('data/muni.json'));const O=JSON.parse(fs.readFileSync('data/operators.json'));
const map={'Andalucía':'01','Aragón':'02','Asturias, Principado de':'03','Balears, Illes':'04','Canarias':'05','Cantabria':'06','Castilla y León':'07','Castilla-La Mancha':'08','Cataluña':'09','Comunitat Valenciana':'10','Extremadura':'11','Galicia':'12','Madrid, Comunidad de':'13','Murcia, Región de':'14','Navarra, Comunidad Foral de':'15','País Vasco':'16','Rioja, La':'17','Ceuta y Melilla':'CM','España':'ES'};
const disp={'01':'Andalucía','02':'Aragón','03':'Asturias','04':'Illes Balears','05':'Canarias','06':'Cantabria','07':'Castilla y León','08':'Castilla-La Mancha','09':'Cataluña','10':'Comunitat Valenciana','11':'Extremadura','12':'Galicia','13':'Comunidad de Madrid','14':'Región de Murcia','15':'Navarra','16':'País Vasco','17':'La Rioja','CM':'Ceuta y Melilla','ES':'España'};
const CC={years:C.meta.years,r:{}};
for(const [n,o] of Object.entries(C.regions)){const k=map[n];if(!k)throw n;
  const flags=o.flags.map(f=>f.slice(0,4));
  CC.r[k]={n:disp[k],s:o.SUM,a:o.ANR,p:o.PR,q:o.PA,bad:flags.map(Number)};}
// consumption hogares 2024 (INE nota de prensa) only for ES and the 6 cited
CC.hog={ES:128,'06':186,'08':172,'03':161,'16':79,'09':100,'12':115};
// municipalities
const coms=[...new Set(M.muni.map(m=>m.comarca))].sort();const urls=[];const units=[];
const u=(arr,v)=>{if(v==null)return -1;let i=arr.indexOf(v);if(i<0){arr.push(v);i=arr.length-1;}return i;};
const MU={};
for(const m of M.muni){const a24=m.a24?[m.a24.anr,m.a24.pr,m.a24.ili,m.a24.f1,m.a24.anf,u(urls,m.a24.url),u(units,m.a24.unit||null)]:0;
  const a22=m.aca?[m.aca.anr,m.aca.ili,m.aca.f1,m.aca.anf,u(units,m.aca.unit),m.aca.note?1:0]:0;
  // Posición 5: antes 3Cat/ACN, retirado por su licencia; se mantiene a 0 para no mover el resto
  MU[m.ine]=[m.name,coms.indexOf(m.comarca),m.pop,a24,a22,0,m.audit2024===true?1:m.audit2024===false?2:0];}
const ops={};for(const [k,v] of Object.entries(O)){if(k==='meta')continue;ops[k]=v.map(x=>x[0]);}
// España por municipio
const EM=JSON.parse(fs.readFileSync('data/espmun.json'));
const IB={};for(const [k,o] of Object.entries(EM.ib))IB[k]=[o.isla,o.p,o.r,o.t,o.c];
const em=`const PROV=${JSON.stringify(EM.prov)};\nconst MUD=${JSON.stringify(EM.mun)};\nconst POP_ES=${EM.meta.pop_es};\nconst IB=${JSON.stringify(IB)};\n`;
const out=`const CC=${JSON.stringify(CC)};\nconst COMS=${JSON.stringify(coms)};\nconst URLS=${JSON.stringify(urls)};\nconst UNITS=${JSON.stringify(units)};\nconst MU=${JSON.stringify(MU)};\nconst OPS=${JSON.stringify(ops)};\n`+em;
// Modelo de gestión del servicio de agua, Catalunya (ESF / Aigua és Vida, Datawrapper F298j v45, uso interno)
const GL=fs.readFileSync('raw/esf_gestio_aigua_cat_2026-07-10.psv','utf8').trim().split('\n').filter(l=>!l.startsWith('#'));
const GK={'Pública':'P','Privada':'V','Empresa mixta privada – pública':'M','Cooperativa / associació':'C','':'-'};
const GES={};for(const l of GL){const a=l.split('|');GES[a[0]]=[GK[a[1]],...a.slice(2)];}
const out2=`const GES=${JSON.stringify(GES)};\n`;
fs.mkdirSync('.build',{recursive:true});fs.writeFileSync('.build/data.js',out+out2);console.log('data.js',out.length,'urls',urls.length,'units',units);
