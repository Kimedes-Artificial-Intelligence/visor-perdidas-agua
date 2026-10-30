const fs=require('fs');const {find,cat,norm}=require('./match.js');
const R=f=>fs.readFileSync('raw/'+f,'utf8').trim().split('\n');
// Idescat names + comarca
const info={};let com=null;
for(const l of R('idescat_comarques_mun.txt')){if(l.startsWith('#')){com=l.slice(1);continue}const [c,n]=l.split('|');
  const m=n.match(/^(.*), (el|la|els|les|l'|Es)$/);const disp=m?(m[2]==="l'"?"l'"+m[1]:m[2]+' '+m[1]):n; info[c]={name:disp,comarca:com};}
const pop=Object.fromEntries(R('idescat_pop2025.txt')[0].split(',').map(s=>s.split(':')).map(([k,v])=>[k,+v]));
const byName=n=>{const m=cat.find(c=>norm(c.name)===norm(n));if(!m)throw 'nf '+n;return m.ine};
// ACA annex III units -> municipalities
const UNITS={AMB:['Badalona','Barcelona','Begues','Castelldefels','Cerdanyola del Vallès','Cornellà de Llobregat','El Papiol','Esplugues de Llobregat','Gavà',"L'Hospitalet de Llobregat",'Montcada i Reixac','Montgat','Pallejà','Sant Adrià de Besòs','Sant Boi de Llobregat','Sant Climent de Llobregat','Sant Feliu de Llobregat','Sant Joan Despí','Sant Just Desvern','Santa Coloma de Cervelló','Santa Coloma de Gramenet','Torrelles de Llobregat','Viladecans'],
 BAN:['Banyoles','Porqueres','Camós','Cornellà del Terri','Fontcoberta'],GIR:['Girona','Salt','Sarrià de Ter'],PLM:['Palamós','Mont-ras'],SLV:['Salou','Vila-seca']};
const UNAME={AMB:'Aigües de Barcelona (23 municipios)',BAN:'Aigües de Banyoles (5 municipios)',GIR:"Cicle de l'Aigua del Ter (Girona, Salt, Sarrià de Ter)",PLM:"Companyia d'Aigües de Palamós (Palamós y Mont-ras)",SLV:'SGAB (Salou y Vila-seca)'};
const aca={};
for(const l of R('aca_annexIII_2022.psv')){if(l.startsWith('#'))continue;const [u,ab,f1,f4,f6,f7,f9,cl]=l.split('|');
  if(ab==='VLR2')continue; // Vallirana: two systems (VLR1 43.6, VLR2 43.5); VLR1 shown, note
  const rec={anr:+f9,anf:+f7,f1:+f1,ili:+f4,app_auth:+f6,cls:cl,year:2022,unit:UNAME[ab]||null,abbr:ab};
  if(ab==='VLR1')rec.note='Dues xarxes auditades a Vallirana (ANR 43,6 % i 43,5 %).';
  const list=UNITS[ab]?UNITS[ab].map(byName):[find(u).ine];
  for(const c of list){if(aca[c])throw 'dup '+c;aca[c]=rec;}}
const a24={};
for(const l of R('aca2024_extract.psv')){if(l.startsWith('#'))continue;const [id,f1,f4,f6,f7,f9,y,url,pr,pa]=l.split('|');const num=x=>x===''?null:+x;
  const rec={anr:+f9,anf:num(f7),f1:num(f1),ili:num(f4),app_auth:num(f6),pr:num(pr),pa:num(pa),year:+y,url};
  const list=id==='AMB'?UNITS.AMB.map(byName):id==='GIR'?UNITS.GIR.map(byName):[id];
  if(id==='AMB')rec.unit=UNAME.AMB; if(id==='GIR')rec.unit=UNAME.GIR; if(id==='43171'||id==='43905')rec.unit=UNAME.SLV;
  // Vallirana: dos auditorías 2024, una por red. Se muestra la del servicio con más abonados (decisión de David, 30/10/2026)
  if(id==='08295')rec.alt={anr:51.9,url:'https://www.vallirana.cat/media/repository/serveis/Subministrament_Aigua/Dades_Aigua_2025/Memoria_Vallirana-FCC_2024.pdf',shown:'AVALLSA, 5.357 abonados',other:'FCC, 2.218 abonados'};
  for(const c of list){if(a24[c])throw 'dup24 '+c;a24[c]=rec;}}
const pb={};for(const l of R('aca_powerbi_2024_obligats.psv')){const [c,n,link]=l.split('|');if(c==='varis')continue;pb[c.slice(0,5)]=link==='1';}
for(const c of UNITS.AMB.map(byName))pb[c]=true; for(const c of UNITS.SLV.map(byName))pb[c]=true;
const muni=cat.map(({ine})=>({ine,name:info[ine].name,comarca:info[ine].comarca,pop:pop[ine],aca:aca[ine]||null,a24:a24[ine]||null,audit2024:pb[ine]??null})).sort((a,b)=>a.ine<b.ine?-1:1);
fs.mkdirSync('data',{recursive:true});
fs.writeFileSync('data/muni.json',JSON.stringify({meta:{generated:'2026-10-19',pop_source:'Idescat, Padró municipal 1/1/2025 (api.idescat.cat pmh/446/477)',names:'Idescat EMEX nodes',aca:'ACA, Avaluació comparativa auditories eficiència hidràulica, annex III (maig 2025), dades 2022'},muni},null,0));
// CCAA
const Y=[2008,2009,2010,2011,2012,2013,2014,2016,2018,2020,2022,2024];const cc={};
for(const l of R('ine53447_2008_2024.txt')){const [r,k,v]=l.split('|');(cc[r]??={})[k]=v.split(',').map(Number);}
const out={meta:{source:'INE, Estadística sobre el Suministro y Saneamiento del Agua (ESSA), tabla 53447',url:'https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/53447',unit:'miles de m3',years:Y,consulted:'2026-10-19',note:'Serie bienal desde 2014. INE advierte que 2000-2006 no es comparable con 2007+ (no incluido).'},regions:{}};
for(const [r,d] of Object.entries(cc)){const pct=(a)=>a.map((x,i)=>Math.round(x/d.SUM[i]*1000)/10);
  const o={...d,anr_pct:pct(d.ANR),pr_pct:pct(d.PR),pa_pct:pct(d.PA),flags:[]};
  d.ANR.forEach((x,i)=>{if(Math.abs(x-(d.PR[i]+d.PA[i]))>2)o.flags.push(Y[i]+': PR+PA ('+(d.PR[i]+d.PA[i])+') != ANR ('+x+') en la fuente INE');});
  out.regions[r]=o;}
fs.writeFileSync('data/ccaa.json',JSON.stringify(out,null,0));
// summary
const n=k=>muni.filter(m=>m[k]).length;
console.log('munis',muni.length,'with ACA annex',n('aca'),'with 2024',n('a24'),'with either',muni.filter(m=>m.aca||m.a24).length,'pop covered either',muni.filter(m=>m.aca||m.a24).reduce((a,m)=>a+m.pop,0));
for(const [r,o] of Object.entries(out.regions))if(o.flags.length)console.log('FLAG',r,o.flags);
console.log('2024 audit published (obligats):',n('audit2024'),'with 2024 values',n('a24'),'pop',muni.filter(m=>m.a24).reduce((a,m)=>a+m.pop,0));
console.log('ESP 2024',out.regions['España'].anr_pct.at(-1),out.regions['España'].pr_pct.at(-1),'CAT',out.regions['Cataluña'].anr_pct.at(-1),out.regions['Cataluña'].pr_pct.at(-1));
// España por municipio: población (INE, padrón 1/1/2025), provincias y datos de Illes Balears (Govern IB)
{
  const atlas=require('es-atlas/es/municipalities.json');
  const pad={};let popES=0;
  for(const l of R('ine_padron2025.psv')){if(l.startsWith('#'))continue;const [c,,p]=l.split('|');pad[c]=+p;popES+=+p;}
  const pc={};for(const l of R('ine_provincias_ccaa.psv')){if(l.startsWith('#'))continue;const [p,c]=l.split('|');pc[p]=c;}
  const prov={};for(const g of atlas.objects.provinces.geometries)if(pc[g.id])prov[g.id]=[g.properties.name,pc[g.id]];
  const catName=Object.fromEntries(muni.map(m=>[m.ine,m.name]));
  const mun={};
  for(const g of atlas.objects.municipalities.geometries){if(/^5[34]/.test(g.id))continue;
    if(pad[g.id]==null)throw 'sin población INE '+g.id;mun[g.id]=[catName[g.id]||g.properties.name,pad[g.id]];}
  // Govern IB: una serie 2000-2024 por municipio. Valores tal como vienen en la fuente; null si la celda está vacía.
  const ib={};const v=x=>x===''?null:+x;
  for(const l of R('caib_abastiment_2000_2024.psv')){if(l.startsWith('#'))continue;const [c,,isla,y,t,co,p,r]=l.split('|');
    const o=ib[c]??={isla,y0:2000,t:[],c:[],p:[],r:[]};const i=+y-2000;o.t[i]=v(t);o.c[i]=v(co);o.p[i]=v(p);o.r[i]=v(r);}
  fs.writeFileSync('data/espmun.json',JSON.stringify({meta:{pop:'INE, Revisión del Padrón municipal a 1/1/2025 (pobmun25.xlsx)',ib:'Govern de les Illes Balears, Servei de Planificació. Dades d\'abastiment urbà 2000-2024. Consulta 22/10/2026',pop_es:popES},prov,mun,ib}));
  console.log('España por municipio:',Object.keys(mun).length,'municipios; Baleares',Object.keys(ib).length,'; población España',popES);
}
