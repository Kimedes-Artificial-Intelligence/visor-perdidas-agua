// ================= Europa (EurEau) =================
const M = {
  nrw:{lbl:"Agua no registrada",unit:"%",short:"ANR",avg:27.07,eu:28.59,bins:[10,15,20,25,35],fmt:v=>v.toFixed(1).replace('.',',')},
  rl:{lbl:"Pérdidas reales",unit:"%",short:"Reales",avg:21.96,eu:22.9,bins:[10,15,20,30,40],fmt:v=>v.toFixed(1).replace('.',',')},
  lin:{lbl:"Índice lineal de ANR",unit:"m³/km/año",short:"m³/km",avg:2416.6,eu:2309.7,bins:[1000,1500,2500,4000,6000],fmt:v=>grp(v)}
};
// [nombre, población, % conectado, ANR %, reales %, m3/km/año, producción hm3, L/hab/día, red miles km, renovación %, telelectura %, tarifa €/m3, nº servicios, gestión, operadores, nota]
const D = {
 AT:["Austria",9197200,92,18.5,12.5,1564,686,135.9,81.0,null,null,null,">5.000",null,[],"Tarifa omitida: EurEau solo reporta saneamiento para Austria."],
 BE:["Bélgica",11900100,98.9,27,27,1277,684,81.8,108.5,1.1,14.5,5.76,"11-100",[2,98,0,0,0],[]],
 BG:["Bulgaria",6437400,99.6,45,38,6233,1100,110.0,77.5,0.2,0,2.66,"11-100",[0,80,20,0,0],[]],
 CH:["Suiza",9048900,99.4,19,11.7,1140,925,142.0,95.4,1.2,null,4.50,"1.001-5.000",[70,26,4,0,0],[]],
 CY:["Chipre",979900,100,24,23,3269,68,141.0,5.8,0.5,2.9,3.16,"2-10",[100,0,0,0,0],[]],
 CZ:["Chequia",10909500,95,17,14.8,1045,575,81.9,81.4,0.6,18.0,4.50,">5.000",[10,45,28,9,8],[]],
 DE:["Alemania",83577100,100,12,6.0,733,5222,122.0,640.0,null,null,2.42,">5.000",[26,27,20,7,20],[],"Tarifa referida solo a agua potable."],
 DK:["Dinamarca",5992700,98,7.3,6.5,493,358,101.0,53.4,0.7,75.0,10.36,"1.001-5.000",[0,80,20,0,0],[]],
 EE:["Estonia",1370000,84,null,14.0,null,48,88.0,8.1,null,6.0,4.25,"101-1.000",[0,50,0,50,0],[]],
 EL:["Grecia",10409500,99,35,null,null,1288,181.7,81.0,2.0,12.8,1.60,"101-1.000",[4,48,0,0,48],[]],
 ES:["España",49078000,100,23.1,14.0,null,4233,128,248.2,0.5,27.0,1.96,">5.000",[10,35,33,0,22],[],"ANR: INE 2024 (984 de 4.267 hm³; EurEau no publica ANR para España). Pérdidas reales: EurEau 14 %; INE 2024 las sitúa en el 14,6 %. Consumo de hogares: INE 2024."],
 FI:["Finlandia",5636000,94,18,null,616,380,150.6,113.7,0.1,10.0,5.45,"1.001-5.000",[47,40,1,8,0],[]],
 FR:["Francia",68635900,99,21,19,1096,5361,179.0,910.0,0.7,null,4.52,">5.000",[43,0,57,0,0],[]],
 HR:["Croacia",3874400,null,null,null,null,null,null,null,null,null,null,null,null,[],"Croacia no aportó datos a esta edición de EurEau."],
 HU:["Hungría",9539500,95,28,21,2061,655,101.2,70.1,0.2,3.9,1.99,"11-100",[0,97,0,0,3],[]],
 IE:["Irlanda",5439900,80,null,36,null,650,122.1,65.3,0.3,null,null,"1",[0,95,5,0,0],[],"La ANR no aplica: el agua doméstica no se factura en Irlanda, y por eso tampoco hay tarifa residencial."],
 IS:["Islandia",389444,100,49,13,null,51,245.9,3.8,0.9,0,null,"11-100",[50,45,0,5,0],[]],
 IT:["Italia",58934200,100,49,42,6534,8000,null,403.8,0.8,16.7,2.10,"1.001-5.000",[12,53,1,0,34],[]],
 LT:["Lituania",2890700,82,20,21,1491,122,100.7,18.3,0.3,14.6,3.00,"11-100",[0,100,0,0,0],[]],
 LU:["Luxemburgo",682000,99.9,10,null,null,44,180.0,2.5,null,null,null,"11-100",[100,0,0,0,0],[],"EurEau reporta 0 % de pérdidas reales, valor no comparable; se omite. SEBES suministra en alta, no a hogares."],
 LV:["Letonia",1856900,85,21,null,1219,87,81.0,7.1,null,13.6,3.76,"11-100",[7,93,0,0,0],[]],
 MT:["Malta",574300,100,25.7,8.7,3874,39,93.7,2.6,4.0,91.6,2.90,"1",[100,0,0,0,0],[]],
 NL:["Países Bajos",18044000,100,6.5,5.5,659,1158,119.2,122.3,0.8,0.2,6.09,"2-10",[0,100,0,0,0],[]],
 NO:["Noruega",5594340,85,40,29,3650,700,146.7,52.6,0.6,56.7,4.63,"101-1.000",[72,24,0,4,0],[]],
 PL:["Polonia",36497500,93,18,13,2180,2091,94.7,341.1,0.4,74.0,3.41,"1.001-5.000",[5,89,2,1,3],[]],
 PT:["Portugal",10749600,96.4,null,null,null,608,130.1,121.7,0.5,null,2.31,"101-1.000",[49,35,16,0,0],[],"EurEau no publica pérdidas para Portugal. El regulador ERSAR estima unos 184 hm³/año de pérdidas (datos 2022), no comparables con esta serie."],
 RO:["Rumanía",19036400,77,44.5,44.7,4905,1263,79.0,101.5,1.5,null,1.41,"11-100",[13,71,3,0,13],[]],
 SE:["Suecia",10587700,89,22,19,1569,844,132.7,84.5,0.5,44.5,4.25,"101-1.000",[48,52,0,0,0],[]],
 SI:["Eslovenia",2130900,93,32,32,1300,183,105.4,44.8,null,null,2.52,"101-1.000",null,[]],
 SK:["Eslovaquia",5419500,90.5,null,null,null,398,83.0,31.7,null,null,3.00,null,null,[]],
 UK:["Reino Unido",69281400,99,18.1,17.1,3056,5409,141.4,427.6,null,35.7,3.10,"11-100",[3,8,0,89,0],[]]
};
for(const k in D) D[k][14]=OPS[k]||[];
const IDX={nrw:3,rl:4,lin:5};
const MG=["Ayuntamiento","Empresa pública","Operador privado","Propiedad privada","Público-privada"];

// ================= utilidades =================
const $=s=>document.querySelector(s);
const svgNS="http://www.w3.org/2000/svg";
const grp=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,".");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const es=(v,d=1)=>v==null?null:Number(v).toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d});
const pc=v=>v==null?"sin dato":es(v,1)+" %";
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

// ================= estado =================
let level="eu", metric="nrw", esMetric="anr";
const YRS=CC.years; let yi=YRS.length-1;
const pinned={eu:"ES",es:"09",mu:"07040",cat:"08019",int:null}; let hovered=null;
let rankAll=false, rankCc="";

// ================= España (INE) =================
const ESM={anr:{lbl:"Agua no registrada",short:"ANR",bins:[10,15,20,25,35],key:"a"},pr:{lbl:"Pérdidas reales",short:"Reales",bins:[10,15,20,30,40],key:"p"}};
const ccCode=id=>(id==="18"||id==="19")?"CM":id;
function ccPct(code,key,i=yi){const r=CC.r[code];if(!r)return null;if(key==="p"&&r.bad.includes(YRS[i]))return null;const n=r[key][i],s=r.s[i];return (n==null||!s)?null:n/s*100;}
const ccVal=(code,m=esMetric,i=yi)=>ccPct(code,ESM[m].key,i);
function binOf(v,bins){if(v==null)return 0;let i=0;while(i<bins.length&&v>=bins[i])i++;return i+1;}

// ================= Catalunya (ACA) =================
const MU_BINS=[[10,"#9fd3c0","< 10 %"],[20,"#f1d98a","10–20 %"],[30,"#eba25a","20–30 %"],[40,"#cf5b33","30–40 %"],[Infinity,"#8a1e2c","≥ 40 %"]];
const muColor=v=>MU_BINS.find(b=>v<b[0])[1];
const CAT_INE24=CC.r["09"]?ccPct("09","a",YRS.length-1):null;
function muLatest(id){const r=MU[id];if(!r)return null;
  if(r[3])return {v:r[3][0],y:2024,src:"Auditoría 2024",url:URLS[r[3][5]]};
  if(r[4])return {v:r[4][0],y:2022,src:"ACA, anexo III",url:null};
 
  return null;}
function muUnit(id){const r=MU[id];if(!r)return null;if(r[3])return r[3][6]>=0?UNITS[r[3][6]]:null;if(r[4])return r[4][4]>=0?UNITS[r[4][4]]:null;return null;}

// ================= Modelo de gestión, red y operadores (ESF, EIEL, SINAC) =================
// ESD: una fila por municipio (ver scripts/build_embed.js). Se decodifica al leerla.
const esdCache={};
function esd(id){if(id in esdCache)return esdCache[id];const r=ESD[id];if(!r)return esdCache[id]=null;
  const pairs=(a,n)=>{const o=[];for(let i=0;a&&i<a.length;i+=n)o.push(a.slice(i,i+n));return o;};
  return esdCache[id]={per:r[0],y:r[1],nrep:r[2],nn:r[3],cov:r[4],rnd:r[5],gm:r[6],gs:r[7],eg:r[8],st:r[9],g:pairs(r[10],2),fc:r[11],em:r[12],er:r[13],km:r[14],ry:r[15],
    ops:pairs(r[16],3).map(([i,p,resp])=>({n:OPN[i],t:OPT[i]==="-"?"":OPT[i],p,resp:!!resp,g:OPC[i]?OPC[i][0]:"",u:OPC[i]?OPC[i][1]:""})),nred:r[17],spop:r[18],dot:r[19]};}
// Provincias sin EIEL en el visor nacional; País Vasco y Navarra quedan fuera de la EIEL por ley
const EIEL_LAW=new Set(["01","20","48","31"]);
const eielPhase=id=>{const p=EPROV[id.slice(0,2)];return p&&p[0]?p:null;};
// Red de la EIEL de la Comunidad de Madrid (IDEM, fase 2023): otra fuente y otra licencia que el visor nacional
const RSI_SET=new Set(RSI);const isIdem=id=>RSI_SET.has(id);

// ================= España por municipio =================
const umCC=id=>PROV[id.slice(0,2)][1];
const ccName=c=>c==="18"?"Ceuta":c==="19"?"Melilla":CC.r[c].n;
const ccINE=c=>ccPct(ccCode(c),"a",YRS.length-1);
// Último dato municipal publicado: Catalunya (auditorías, F9 de la ACA), Illes Balears (estimación del Govern IB)
// o, en el resto, las pérdidas que declaran los ayuntamientos en la EIEL
// La precedencia entre fuentes está en src/loss.js (LOSS_ORDER)
const umCache={};
function umLatest(id){if(id in umCache)return umCache[id];const c={};
  if(MU[id]){const L=muLatest(id);if(L)c.aca={v:L.v,y:L.y,url:L.url,kind:"cat",src:"Agua no registrada, auditoría (ACA, F9)"};}
  const a=a63Paint(A63.m[id]);
  if(a)c.art63={v:a[1],dec:a[9],y:a[3],url:a[5],kind:"art63",ind:a[0],op:a[4],src:`${A63_IND[a[0]]} publicada por el operador (art. 63.2 RD 3/2023)`};
  const e=MU[id]?null:esd(id);
  if(e&&e.per!=null)c.eiel={v:e.per,y:e.y,kind:"eiel",src:"Pérdidas declaradas por el ayuntamiento (EIEL)",nrep:e.nrep,nn:e.nn,cov:e.cov,rnd:e.rnd};
  const sm=A63.sm[id],sy=sm&&SYS_PAINT_SERVICIO.includes(sm[1])?sysPaint(SYS_ROWS[sm[0]]):null;
  if(sy)c.sistema={v:sy[4],dec:sy[11],y:sy[6],url:sy[7],kind:"sistema",ind:sy[3],op:sy[1],amb:sy[2],pat:sm[0],n:SYS_N[sm[0]],
    src:`${A63_IND[sy[3]]} del sistema ${sy[1]} (${SYS_N[sm[0]]} municipios), no municipal`};
  const b=IB[id];
  if(b){let i=b[1].length-1;while(i>=0&&b[1][i]==null)i--;
    if(i>=0){const dr=b[2][i];c.ib={v:b[1][i],y:2000+i,i,kind:"ib",src:"Agua no contabilizada, estimación del Govern IB",dr,low:dr==null||dr<50};}}
  return umCache[id]=pickLoss(c);}
// Cifras de sistema (D2): filas de cada patrón y número de municipios que la fuente lista como servidos y se pintan
const SYS_ROWS={};for(const r of A63.s)(SYS_ROWS[r[0]]??=[]).push(r);
const SYS_N={};for(const [,o] of Object.entries(A63.sm))if(SYS_PAINT_SERVICIO.includes(o[1])&&sysPaint(SYS_ROWS[o[0]]))SYS_N[o[0]]=(SYS_N[o[0]]||0)+1;
// Indicadores del art. 63.2 RD 3/2023 publicados por el operador o el ayuntamiento (raw/operadores_art63_2026-10.psv)
const A63_IND={ANR:"Agua no registrada",PERDIDAS_REALES:"Pérdidas reales",IFE:"Índice de fugas estructurales (IFE)",ILI:"Índice de pérdidas de infraestructura (ILI)",RENDIMIENTO:"Rendimiento técnico hidráulico"};
// Municipio con indicador publicado que no es un % de pérdidas (rendimiento, IFE): no se pinta en la escala de pérdidas
const a63Other=id=>!umLatest(id)&&!!A63.m[id];
const A63_DATE=d=>d.split("-").reverse().join("/");
const UM_REASON={"09":"Dato de las auditorías publicadas (ACA). En gris, municipios sin auditoría publicada.","04":"Govern de les Illes Balears, estimación anual por municipio.",
  "18":"Sin dato municipal publicado. El INE publica las dos ciudades agregadas.","19":"Sin dato municipal publicado. El INE publica las dos ciudades agregadas."};
// Motivo de la falta de dato de pérdidas, según la cobertura de la EIEL
// Estado de la búsqueda del indicador del art. 63.2 RD 3/2023 en las ciudades de 50.000 hab. o más (raw/art63_estado_2026-10-30.psv)
const A63_REASON={
  solo_sistema:d=>`El operador no publica el indicador del art. 63.2 del RD 3/2023 para este municipio a fecha ${d}: solo da una cifra de todo su sistema, que no se pinta aquí.`,
  no_publica:d=>`El operador no publica el indicador del art. 63.2 del RD 3/2023 a fecha ${d}.`,
  bloqueado:d=>`No se ha podido comprobar si el operador publica el indicador del art. 63.2 del RD 3/2023: su web no admite consultas automatizadas (${d}). Pendiente de revisión manual.`,
  no_verificado:d=>`No se ha podido completar la búsqueda del indicador del art. 63.2 del RD 3/2023 a fecha ${d}.`,
  excluido_aviso_legal:d=>`El operador publica el indicador, pero su aviso legal prohíbe expresamente extraer y reutilizar sus contenidos: no se incorpora (${d}).`};
function umReason(id){return umReason0(id)+" "+mitecoReason(A63.mt.sol);}
function umReason0(id){const c=umCC(id);if(UM_REASON[c])return UM_REASON[c];
  const st=A63.e[id];if(st&&A63_REASON[st[0]])return A63_REASON[st[0]](A63_DATE(st[2]))+(st[1]?" "+st[1]+".":"");
  if(EIEL_LAW.has(id.slice(0,2)))return "País Vasco y Navarra quedan fuera de la EIEL por ley y no publican pérdidas por municipio.";
  if(isIdem(id))return "La EIEL de la Comunidad de Madrid (fase 2023, IDEM) publica la red de distribución pero no las pérdidas por núcleo, y no hay otro registro público de pérdidas por municipio.";
  const p=eielPhase(id);if(!p)return "Esta provincia no está en el visor nacional de la EIEL (la mantiene su diputación o su comunidad) y no hay otro registro público de pérdidas por municipio.";
  const e=esd(id);if(!e||!e.nn)return `La EIEL (fase ${p[1]||p[0]}) no incluye núcleos de este municipio: cubre los municipios de menos de 50.000 habitantes.`;
  return `La EIEL (fase ${p[1]||p[0]}) no trae pérdidas para este municipio: campo vacío, 0 % (campo sin rellenar) o más del 95 %.`;}
const UM_IDS=Object.keys(MUD),UM_HAS=UM_IDS.filter(id=>umLatest(id));
// Cobertura de cada capa de la vista por municipio, con la población del padrón
const umGes=id=>{if(MU[id])return gesOf(id);const e=esd(id);return e&&e.gm!=="N"?e.gm:null;};
const umFc=id=>{const e=esd(id);return e?e.fc:null;};
const umRed=id=>{const e=esd(id);return e&&e.em!=null?e.em+e.er:null;};
const LAYER={loss:{has:id=>!!umLatest(id),txt:"con dato de pérdidas publicado"},ges:{has:id=>!!umGes(id),txt:"con modelo de gestión"},
  fc:{has:id=>umFc(id)!=null,txt:"con material de la red (EIEL)"},est:{has:id=>umRed(id)!=null,txt:"con estado de la red (EIEL)"}};
// Calidad del dato de pérdidas que se pinta (FWG-1870, Parte 6)
const QUAL={aca:"Auditoría publicada (ACA)",art63:"Publicado por el operador (art. 63.2 RD 3/2023)",eiel5:"EIEL, declarado por el ayuntamiento: todos los valores múltiplos de 5",
  eielx:"EIEL, declarado por el ayuntamiento: con valores no redondeados",sistema:"Dato de todo el sistema del operador, no municipal",ib:"Estimación del Govern IB"};
const QSHORT={aca:"ACA",art63:"operador",eiel5:"EIEL ×5",eielx:"EIEL",sistema:"sistema",ib:"Govern IB"};
const umQual=id=>{const L=umLatest(id);if(!L)return null;return L.kind==="cat"?"aca":L.kind==="art63"?"art63":L.kind==="sistema"?"sistema":L.kind==="ib"?"ib":L.rnd===100?"eiel5":"eielx";};
// Índice Kimedes de prioridad comercial (src/prioridad.js), calculado una vez para todos los municipios
let PRI=null;
function priAll(){if(PRI)return PRI;const P=percentiles(UM_IDS.map(id=>MUD[id][1])),m={};
  UM_IDS.forEach((id,i)=>{const L=umLatest(id),e=esd(id),fase=e?(e.ry??e.y??null):null;
    m[id]=Object.assign(priFactors({P:P[i],loss:L?L.v:null,fc:umFc(id),fase,gm:umGes(id)},PRI_W),{loss:L?L.v:null,fase,fc:umFc(id),gm:umGes(id)||"N"});});
  const cuts=quintileCuts(UM_IDS.map(id=>m[id].idx));for(const id of UM_IDS)m[id].q=quintileOf(m[id].idx,cuts);
  return PRI={m,cuts};}
const PRI_COLORS=MU_BINS.map(b=>b[1]);
LAYER.pri={has:()=>true,txt:"con índice de prioridad comercial (calculado)"};
const umCount=k=>{const ids=UM_IDS.filter(LAYER[k].has);const pop=ids.reduce((a,id)=>a+MUD[id][1],0);
  return `${grp(ids.length)} de ${grp(UM_IDS.length)} municipios ${LAYER[k].txt} · ${es(pop/POP_ES*100,1)} % de la población de España`;};
// Ciudades de 50.000 hab. o más (padrón INE 2025) con dato en la capa activa (FWG-1871, E.4), con enlace al detalle de fuentes
const SRC_MD="https://github.com/Kimedes-Artificial-Intelligence/visor-perdidas-agua/blob/main/data/sources.md";
const UM_50K=UM_IDS.filter(id=>MUD[id][1]>=50000);
const umCount50=k=>`${grp(UM_50K.filter(LAYER[k].has).length)} de ${grp(UM_50K.length)} ciudades de 50.000 hab. o más ${LAYER[k].txt}`;
const UM_NOTE="Catalunya (auditorías, agua no registrada), Baleares (estimación del Govern, agua no contabilizada), las ciudades con dato del operador (agua no registrada o pérdidas reales, art. 63.2 RD 3/2023) el resto (pérdidas declaradas por los ayuntamientos en la EIEL, no medidas) y los municipios con la cifra de todo el sistema de su operador (no municipal) son indicadores distintos. Se pintan en la misma escala para leer el orden de magnitud, no para comparar municipio a municipio. El rendimiento y el índice de fugas estructurales (IFE) que publican algunos operadores tampoco son el mismo indicador: se muestran en la ficha, no en el mapa.";
// Valor de pérdidas tal como se publica: las cifras del operador con sus decimales; el resto, con uno
const lossTxt=L=>L.dec!=null?es(L.v,L.dec):es(L.v,1);
const fmt2=v=>es(Math.round(v*100)/100,v*100%10===0?1:2);

let colorBy="loss";
const GCAT={P:["Municipalizado","Gestión pública: ayuntamiento, empresa o ente 100 % público, mancomunidad o consorcio"],
  M:["Mixta","Empresa mixta público-privada"],V:["Privada (utility)","Concesión a una empresa privada"],
  C:["Vecinal / cooperativa","Gestión vecinal, cooperativa o asociación de usuarios"],O:["Otros","Otra forma de gestión declarada en la EIEL"],N:["Sin dato","Sin modelo de gestión publicado"]};
const GORD=["P","M","V","C","O"];
const gesOf=id=>{const r=GES[id];return r&&GCAT[r[0]]&&r[0]!=="N"?r[0]:null;};
const gesColor=k=>k?`var(--g-${k.toLowerCase()})`:"";
const GSRC={f:"ESF / Aigua és Vida",e:"EIEL, gestión declarada de la red de distribución",s:"SINAC, operador principal clasificado por su nombre",p:"Operador que distribuye el agua según su propia fuente (el SINAC no lo identifica)"};
const EIEL_GES={MU:"Municipal",EM:"Empresa municipal",EP:"Empresa pública no municipal",MA:"Mancomunidad",CO:"Consorcio",PV:"Privada",VE:"Vecinal",OT:"Otros"};
const OPTYPE={P:"Municipalizado",M:"Mixto",V:"Privado (utility)","":"Sin clasificar"};
const FC_BINS=[[10,"#9fd3c0","< 10 %"],[20,"#f1d98a","10–20 %"],[30,"#eba25a","20–30 %"],[50,"#cf5b33","30–50 %"],[Infinity,"#8a1e2c","≥ 50 %"]];
const binColor=(v,bins)=>bins.find(b=>v<b[0])[1];
// Color de un municipio en la vista España según la capa elegida
function umFill(id){if(colorBy==="ges")return gesColor(umGes(id));
  if(colorBy==="pri")return PRI_COLORS[priAll().m[id].q-1];
  if(colorBy==="fc"){const v=umFc(id);return v==null?"":binColor(v,FC_BINS);}
  if(colorBy==="est"){const v=umRed(id);return v==null?"":binColor(v,FC_BINS);}
  const L=umLatest(id);return L?muColor(L.v):a63Other(id)?"url(#dotsOt)":"";}
const SRC={
  esf:{n:"Enginyeria Sense Fronteres (ESF) · Aigua és Vida, «La Gestió de l'Aigua a Catalunya per Municipi»",u:"https://datawrapper.dwcdn.net/F298j/45/",d:"Datawrapper F298j v45, publicado 23/06/2026, actualizado 10/07/2026, consulta 29/10/2026. Tipología de la concesión, empresa, grupo, fechas de contrato y remunicipalización. Derechos de sus autores, citada"},
  aca22:{n:"ACA, Avaluació comparativa de les auditories d'eficiència hidràulica, annex III",u:"https://aca.gencat.cat/web/.content/20_Aigua/02_infraestructures/02_xarxes_abastament/xarxes-municipals-auditories-eficiencia-hidraulica/informe-auditories-hidrauliques.pdf",d:"Versión mayo 2025, datos 2022. Agua no registrada (F9), ILI, F1. Llicència oberta d'ús d'informació - Catalunya"},
  acareg:{n:"ACA, registro de auditorías de eficiencia hidráulica",u:"https://aca.gencat.cat/ca/laigua/infraestructures/xarxes-abastament/xarxes-municipals-auditories-deficiencia-hidraulica/",d:"Obligación: DA 26ª del Decreto Legislativo 3/2003. Llicència oberta d'ús d'informació - Catalunya"},
  idem:{n:"EIEL de la Comunidad de Madrid, fase 2023. IDEM (Infraestructura de Datos Espaciales de la Comunidad de Madrid)",u:"https://idem.comunidad.madrid/geoidem/ServiciosPublicos/ows?service=WFS&version=2.0.0&request=GetCapabilities",d:"Capa IDEM_EIEL_RED_DISTRIBUCION_23 (WFS), extracción 30/10/2026: material, estado, titular y gestión de cada tramo de la red de distribución. CC BY 4.0 Comunidad de Madrid"},
  idescat:{n:"Idescat, Padró municipal d'habitants 1/1/2025",u:"https://api.idescat.cat/taules/v2/pmh/446/477/mun/data?YEAR=2025&SEX=TOTAL",d:"Población municipal. Condiciones de reutilización de Idescat"},
  ine:{n:"INE, Revisión del Padrón municipal 1/1/2025",u:"https://www.ine.es/pob_xls/pobmun.zip",d:"Población municipal. CC BY 4.0"},
  ine53447:{n:"INE, Estadística sobre el suministro y saneamiento del agua (tabla 53447)",u:"https://ine.es/dyngs/Prensa/es/ESSA2024.htm",d:"Valor de toda la comunidad autónoma, 2024. Solo referencia. CC BY 4.0"},
  caib:{n:"Govern de les Illes Balears, Servei de Planificació. Dades d'abastiment urbà 2000-2024",u:"https://www.caib.es/sites/aigua/ca/proveament_distribucia_potabilitzacia/",d:"Consulta 22/10/2026. CC BY-SA. Agua no contabilizada estimada"},
  sinac:{n:"Ministerio de Sanidad, SINAC (Sistema de Información Nacional de Aguas de Consumo), consulta ciudadana",u:"https://sinac.sanidad.gob.es/CiudadanoWeb/",d:"Gestor, responsable, población abastecida y dotación de cada red de distribución. Extracción 30/10/2026. Información pública del Ministerio, citada"}
};
const eielSrc=id=>{const p=eielPhase(id);const f=p?(p[1]&&p[1]!==p[0]?`fase ${p[1]} (núcleos) y ${p[0]} (red)`:`fase ${p[0]}`):"";
  return {n:"EIEL, Encuesta de Infraestructura y Equipamientos Locales. © Secretaría de Estado de Política Territorial",u:"https://eiel.redsara.es/visor/",
  d:`Visor GEO-EIEL, ${f} de la provincia, extracción 29-30/10/2026. Pérdidas, consumo y padrón por núcleo; material, estado y gestión de cada tramo de red. CC BY-NC-SA 4.0`};};
// Lista numerada; una fuente citada para varias cosas aparece una sola vez
function srcList(items,id){const seen=new Map();
  for(const [what,k] of items.filter(Boolean)){const key=typeof k==="string"?k:k.n;if(seen.has(key))seen.get(key)[0].push(what);else seen.set(key,[[what],k]);}
  return `<div><h3>Fuentes de este municipio</h3><ol class="srcs">${[...seen.values()].map(([what,k])=>{const o=k==="eiel"?eielSrc(id):typeof k==="string"?SRC[k]:k;
  return `<li><span class="what">${esc(what.join(" · "))}</span><b>${esc(o.n)}</b>${o.d?". "+esc(o.d)+".":""}${o.u?` <a href="${esc(o.u)}" target="_blank" rel="noopener">Abrir fuente</a>`:""}</li>`;}).join("")}</ol></div>`;}
function gesBlock(id){const r=GES[id];
  if(!r)return `<div><h3>Modelo de gestión</h3><p><span class="gtag N">${GCAT.N[0]}</span></p><p class="note">Sin modelo de gestión publicado. No se infiere ningún valor.</p></div>`;
  const [k,emp,corp,ini,dur,fin,proc,anyR,alta,altaM]=r;const c=GCAT[k]||GCAT.N;
  return `<div><h3>Modelo de gestión del abastecimiento</h3><p><span class="gtag ${GCAT[k]?k:"N"}">${c[0]}</span></p><p class="note" style="margin-top:6px">${esc(c[1])}.</p><dl>
   ${row("Operador",esc(emp))}${corp?row("Grupo empresarial",esc(corp)):""}${ini?row("Inicio del contrato",esc(ini)):""}${dur?row("Duración",esc(dur),"años"):""}${fin?row(k==="P"?"Fin de la concesión anterior":"Fin de la concesión",esc(fin)):""}
   ${anyR?row("Remunicipalizado en",esc(anyR)):""}${proc==="Sí"?row("En proceso de remunicipalización","Sí"):""}${alta?row("Sistema en alta",esc(alta)):""}${altaM?row("Gestión en alta",esc(altaM)):""}</dl></div>`;}
// Fuera de Catalunya: el modelo elegido, su origen y, si discrepan, lo que dice cada fuente
function gesBlockES(id){const e=esd(id);const k=e?e.gm:"N";
  if(!e||k==="N")return `<div><h3>Modelo de gestión</h3><p><span class="gtag N">${GCAT.N[0]}</span></p><p class="note">Ni la EIEL ni un operador clasificado del SINAC dan el modelo de gestión. No se infiere ningún valor.</p></div>`;
  const both=e.eg&&e.st&&e.eg!==e.st;
  return `<div><h3>Modelo de gestión del abastecimiento</h3><p><span class="gtag ${k}">${GCAT[k][0]}</span></p><p class="note" style="margin-top:6px">${esc(GCAT[k][1])}.</p>
  <dl>${row("Origen",esc(GSRC[e.gs]))}${e.gs==="p"&&PVN[id]?row("Operador",esc(PVN[id][0])):""}${e.g.length?row("Gestión de la red (EIEL)",e.g.map(([c,p])=>`${esc(EIEL_GES[c]||c)} ${p} %`).join(" · ")):""}</dl>
  ${both?`<p class="note warn">Las fuentes discrepan: la EIEL declara gestión ${GCAT[e.eg][0].toLowerCase()} y el operador principal del SINAC es ${OPTYPE[e.st].toLowerCase()}.${e.gs==="s"?" Prevalece el SINAC porque el operador es una empresa mixta.":" Prevalece la EIEL."}</p>`:""}</div>`;}
function opsBlock(id){const e=esd(id);if(!e||!e.ops.length)return `<div><h3>Operadores (SINAC)</h3><p class="note">Sin redes de distribución de este municipio en el SINAC.</p></div>`;
  const resp=e.ops.some(o=>o.resp);
  return `<div><h3>Operadores (SINAC)</h3><dl class="ops2">${e.ops.map(o=>`<dt>${esc(o.n)}${o.resp?'<span class="tag">responsable</span>':""}</dt><dd>${o.p<1?"< 1":o.p} % · ${o.resp?"titular de la red":OPTYPE[o.t]}${!o.resp&&o.g?` · ${esc(o.g)}`:""}</dd>`).join("")}</dl>
  <p class="srcline">% de la población abastecida por sus redes. Tipo y grupo según data/operadores_clasificacion.csv, con la fuente que los confirma en la lista de fuentes; un nombre sin patrón queda sin clasificar.${resp?" El SINAC da como gestor un sistema de información o un laboratorio: se muestra el responsable de la red, que no indica quién la gestiona.":""}</p></div>`;}
function redBlock(id){const e=esd(id);if(!e)return "";const red=e.km!=null;
  return `<div><h3>Red y suministro</h3><dl>${red?row(`Red de distribución (EIEL ${e.ry}${isIdem(id)?", Comunidad de Madrid":""})`,es(e.km,1),"km")+row("Fibrocemento",e.fc,"% de la red")+row("Estado malo",e.em,"%")+row("Estado regular",e.er,"%"):row("Red de distribución (EIEL)",null)}
  ${row("Dotación (SINAC)",e.dot==null?null:grp(e.dot),"L/hab/día")}${row("Redes de distribución (SINAC)",e.nred==null?null:grp(e.nred))}${row("Población abastecida (SINAC)",e.spop==null?null:grp(e.spop))}</dl></div>`;}
// Resumen por categoría para la leyenda: municipios y % de población
function gesSummary(ids,of=gesOf){const K=[...GORD,"N"],n={},p={};for(const k of K){n[k]=0;p[k]=0;}let tot=0;
  for(const id of ids){const k=of(id)||"N";const pop=of===gesOf&&MU[id]?MU[id][2]:(MUD[id]?MUD[id][1]:0);n[k]++;p[k]+=pop;tot+=pop;}
  return `<div class="gsum">${K.filter(k=>n[k]).map(k=>`<span><i style="display:inline-block;width:10px;height:10px;background:${k==="N"?"var(--nodata)":gesColor(k)};margin-right:6px"></i>${GCAT[k][0]}</span><span class="bar"><span style="width:${(p[k]/tot*100).toFixed(1)}%;background:${k==="N"?"var(--nodata)":gesColor(k)}"></span></span><span class="v">${grp(n[k])} mun.</span><span class="v">${es(p[k]/tot*100,1)} % pob.</span>`).join("")}</div>`;}

// ================= mapa: construcción =================
const svg=$("#map"),box=$("#mapbox"),tip=$("#tip");
const g=$("#countries"),dots=$("#dots"),els={};
for(const [c,d] of Object.entries(GEO.countries)){
  const p=document.createElementNS(svgNS,"path");p.setAttribute("d",d);p.setAttribute("class","c");p.dataset.c=c;
  p.setAttribute("tabindex","0");p.setAttribute("role","button");p.setAttribute("aria-label",D[c][0]);
  g.appendChild(p);els[c]=[p];}
for(const c of ["MT","LU"]){const [x,y]=GEO.centroids[c];const k=document.createElementNS(svgNS,"circle");
  k.setAttribute("cx",x);k.setAttribute("cy",y);k.setAttribute("r",c==="MT"?6:5);k.setAttribute("class","dot");k.dataset.c=c;dots.appendChild(k);els[c].push(k);}

const espLayer=$("#espLayer"),rEls={};
(function buildEsp(){
  let h="";const f=ESP.inset.frame;
  h+=`<rect class="inset" x="${f[0]}" y="${f[1]}" width="${f[2]}" height="${f[3]}"></rect><text class="insetlab" x="${f[0]+f[2]-1}" y="${f[1]+3.2}" text-anchor="end" font-size="2.2">CANARIAS</text>`;
  for(const [id,d] of Object.entries(ESP.ccaa)){if(id==="18"||id==="19")continue;const n=CC.r[id]?CC.r[id].n:ESP.names[id];
    h+=`<path class="r" d="${d}" data-r="${id}" tabindex="0" role="button" aria-label="${esc(n)}"></path>`;}
  for(const id of ["18","19"]){const [x,y]=ESP.cent[id];h+=`<circle class="r" cx="${x}" cy="${y}" r="0.9" data-r="${id}" tabindex="0" role="button" aria-label="${id==='18'?'Ceuta':'Melilla'} (Ceuta y Melilla)"></circle>`;}
  espLayer.innerHTML=h;
  espLayer.querySelectorAll("[data-r]").forEach(e=>{const c=ccCode(e.dataset.r);(rEls[c]??=[]).push(e);});
})();

const catLayer=$("#catLayer"),muEls={};
(function buildCat(){
  const [wx0,wy0,wx1,wy1]=CAT.win;
  let h=`<rect class="sea" x="${wx0}" y="${wy0}" width="${wx1-wx0}" height="${wy1-wy0}"></rect>`;
  h+=`<path class="c10" d="${CAT.ctx10}"></path><path class="cbase" d="${CAT.outline}" style="fill:var(--nodata)"></path><g id="muAll">`;
  const ids=Object.keys(CAT.muni).sort((a,b)=>a==="08215"?1:b==="08215"?-1:0);
  for(const id of ids){const r=MU[id],L=muLatest(id);
    h+=`<path class="mu${L?" has":""}" d="${CAT.muni[id]}" data-m="${id}" ${L?`style="fill:${muColor(L.v)}"`:""} tabindex="-1" aria-label="${esc(r?r[0]:id)}${L?", agua no registrada "+es(L.v,1)+" %, "+L.y:", sin dato publicado"}"></path>`;}
  h+=`</g><g id="mlabs">`+CAT.labels.filter(l=>l.k!=="p").map(l=>`<text class="mlab ${l.k}" x="${l.xy[0]}" y="${l.xy[1]}">${l.t}</text>`).join("")+`</g>`;
  catLayer.innerHTML=h;
  catLayer.querySelectorAll("[data-m]").forEach(e=>{muEls[e.dataset.m]=e;if(e.classList.contains("has"))e.setAttribute("tabindex","0");});
})();

const muLayer=$("#muLayer"),umEls={};let umHov,umSel;
(function buildUm(){
  const f=MUN.inset.frame;const top=new Set(MUN.top||[]);
  let h=`<rect class="inset" x="${f[0]}" y="${f[1]}" width="${f[2]}" height="${f[3]}"></rect><text class="insetlab" x="${f[0]+f[2]-1}" y="${f[1]+3.2}" text-anchor="end" font-size="2.2">CANARIAS</text><g transform="scale(.01)">`;
  for(const [id,d] of Object.entries(MUN.sh))h+=`<path class="sh" d="${d}" data-sh="${id}"></path>`;
  const mu=id=>{const L=umLatest(id),r=MUD[id],o=a63Other(id);return `<path class="um${L||o?" has":""}" d="${MUN.mu[id]}" data-u="${id}" ${L?`style="fill:${muColor(L.v)}"`:o?`style="fill:url(#dotsOt)"`:""} tabindex="-1" aria-label="${esc(r[0])}${L?", "+lossTxt(L)+" %, "+L.y:o?", otro indicador publicado por el operador":", sin dato municipal publicado"}"></path>`;};
  const ids=Object.keys(MUN.mu);
  for(const id of ids)if(!top.has(id))h+=mu(id);
  for(const id of ids)if(top.has(id))h+=mu(id);
  for(const id of ids){const L=umLatest(id);if(L&&L.low)h+=`<path class="umlow" d="${MUN.mu[id]}"></path>`;}
  // Trama de "dato declarado, no medido" (EIEL): un solo trazado con todos los municipios
  h+=`<path class="umdecl" d="${ids.filter(id=>{const L=umLatest(id);return L&&L.kind==="eiel";}).map(id=>MUN.mu[id]).join("")}"></path>`;
  // Trama de "dato publicado por el operador (art. 63.2 RD 3/2023)"
  h+=`<path class="umop" d="${ids.filter(id=>{const L=umLatest(id);return L&&L.kind==="art63";}).map(id=>MUN.mu[id]).join("")}"></path>`;
  // Trama de "dato de todo el sistema del operador, no municipal" (D2)
  h+=`<path class="umsys" d="${ids.filter(id=>{const L=umLatest(id);return L&&L.kind==="sistema";}).map(id=>MUN.mu[id]).join("")}"></path>`;
  h+=`<path class="prm" d="${MUN.pr}"></path><path class="ccm" d="${MUN.cc}"></path><path class="umhl" id="umHov" d=""></path><path class="umhl" id="umSel" d=""></path></g>`;
  for(const [id,[x,y]] of Object.entries(MUN.dot)){const L=umLatest(id);
    h+=`<circle class="um${L?" has":""}" cx="${x}" cy="${y}" r="${/^5[12]/.test(id)?0.9:0.25}" data-u="${id}" ${L?`style="fill:${muColor(L.v)}"`:""} tabindex="-1" aria-label="${esc(MUD[id][0])}"></circle>`;}
  muLayer.innerHTML=h;
  muLayer.querySelectorAll("[data-u]").forEach(e=>{umEls[e.dataset.u]=e;if(e.classList.contains("has"))e.setAttribute("tabindex","0");});
  umHov=$("#umHov");umSel=$("#umSel");
})();

// ================= Internacional: Italia (ISTAT) =================
// INT.reg: {COD_REG: [trazado, nombre, inmessa hm3, erogata hm3, perdite %]}; INT.cap: {PRO_COM_T: [x, y, nombre, inmessa miles m3, erogata miles m3, perdite %, clase lineal, región]}
const intLayer=$("#intLayer"),intEls={};
(function buildInt(){let h="";
  for(const [k,r] of Object.entries(INT.reg))h+=`<path class="ir" d="${r[0]}" data-it="r${k}" tabindex="0" role="button" aria-label="${esc(r[1])}, ${es(r[4],1)} %"></path>`;
  for(const [k,c] of Object.entries(INT.cap))h+=`<circle class="ic" cx="${c[0]}" cy="${c[1]}" r="1.6" data-it="c${k}" tabindex="0" role="button" aria-label="${esc(c[2])}, ${es(c[5],1)} %"></circle>`;
  intLayer.innerHTML=h;intLayer.querySelectorAll("[data-it]").forEach(e=>intEls[e.dataset.it]=e);})();
const intRow=k=>k[0]==="r"?{kind:"r",r:INT.reg[k.slice(1)]}:{kind:"c",c:INT.cap[k.slice(1)]};
function paintInt(){for(const [k,e] of Object.entries(intEls)){const o=intRow(k);e.style.fill=muColor(o.kind==="r"?o.r[4]:o.c[5]);}}
const INT_IND="Perdite idriche totali: % del agua inmessa en la red de distribución (ISTAT, Censimento delle acque per uso civile, 2022)";
const INT_ST={datos:"Con datos",licencia:"Sin licencia de reutilización verificada",descarga_manual:"Pendiente de descarga manual",sin_capa:"Sin fuente subnacional: no se construye capa"};

// ================= pintar =================
const val=(c,m=metric)=>D[c][IDX[m]];
function paintEU(){
  for(const c in els){const k=binOf(val(c),M[metric].bins);for(const e of els[c]){
    e.classList.toggle("nodata",!k);e.style.fill=k?`var(--c${k})`:(e.tagName==="circle"?"url(#hatch)":"");}}
}
function paintES(){
  for(const c in rEls){const v=ccVal(c);const k=binOf(v,ESM[esMetric].bins);for(const e of rEls[c]){e.style.fill=k?`var(--c${k})`:"url(#hatchS)";}}
}
function binLabels(b,f){return [`< ${f(b[0])}`,...b.slice(0,-1).map((x,i)=>`${f(x)}-${f(b[i+1])}`),`≥ ${f(b[b.length-1])}`];}
// Nota larga de la leyenda: plegada en pantallas estrechas para que la ficha quede cerca del mapa (FWG-1871, revisión a 390 px)
const LG_OPEN=()=>window.matchMedia("(min-width:700px)").matches?" open":"";
function legend(){
  const L=$("#legend");
  if(level==="eu"){const m=M[metric];
    L.innerHTML=`<span class="t">${m.short} (${m.unit}) · EurEau 2026</span>`+binLabels(m.bins,m.fmt).map((l,i)=>`<span><i style="background:var(--c${i+1})"></i>${l}</span>`).join("")+`<span><i style="background:repeating-linear-gradient(45deg,var(--surface) 0 3px,var(--line) 3px 4px)"></i>sin dato</span>`;
    $("#hint").textContent="Gris rayado: miembro EurEau sin dato comparable. Blanco liso: fuera del alcance del informe. Clic en España para bajar a comunidades.";}
  else if(level==="es"){const m=ESM[esMetric];const f=v=>String(v);const dash=a=>a.map(x=>x.replace(/(\d)-(\d)/,'$1–$2'));
    L.innerHTML=`<span class="t">${m.short} (%) · INE ${YRS[yi]}</span>`+dash(binLabels(m.bins,f)).map((l,i)=>`<span><i style="background:var(--c${i+1})"></i>${l}</span>`).join("")+`<span><i style="background:repeating-linear-gradient(45deg,var(--surface) 0 3px,var(--line) 3px 4px)"></i>sin dato</span><span class="srcnote">% sobre el volumen suministrado a la red. Ceuta y Melilla, agregadas (dos ciudades, volumen reducido). Canarias, en recuadro.</span>`;
    $("#hint").textContent="Clic en una comunidad para fijarla. Desde Cataluña se baja a municipios.";}
  else if(level==="cat"&&colorBy==="ges"){
    L.innerHTML=`<span class="t">Modelo de gestión del abastecimiento · ESF / Aigua és Vida 2026</span>`+GORD.filter(k=>k!=="O").map(k=>`<span><i style="background:${gesColor(k)}"></i>${GCAT[k][0]}</span>`).join("")+`<span><i style="background:var(--nodata)"></i>sin dato</span><span class="srcnote">Catalunya, 947 municipios. Clic en un municipio para ver operador, contrato y todas las fuentes citadas.</span>`+gesSummary(Object.keys(MU));
    $("#hint").textContent="Clic en un municipio para fijarlo y ver sus fuentes.";}
  else if(level==="mu"&&colorBy==="ges"){
    L.innerHTML=`<span class="t">Modelo de gestión del abastecimiento · ESF, EIEL y SINAC</span>`+GORD.map(k=>`<span><i style="background:${gesColor(k)}"></i>${GCAT[k][0]}</span>`).join("")+`<span><i style="background:var(--nodata)"></i>sin dato</span><span class="srcnote">Catalunya: ESF / Aigua és Vida. Resto: operador principal del SINAC si es una empresa mixta; si no, la gestión declarada en la EIEL (la de más longitud de red); sin EIEL, el tipo del operador principal del SINAC. El tipo de operador se asigna por su nombre con una tabla editable; si no hay patrón, queda sin clasificar.</span>`+gesSummary(UM_IDS,umGes);
    $("#hint").textContent="Rueda, pellizco o doble clic para acercar. Clic en un municipio para ver el origen del modelo, los operadores y todas las fuentes.";}
  else if(level==="mu"&&colorBy==="pri"){const w=PRI_W;
    L.innerHTML=`<span class="t">Prioridad comercial · Índice Kimedes, calculado a partir de fuentes citadas</span>`+PRI_COLORS.map((c,i)=>`<span><i style="background:${c}"></i>Q${i+1}${i===0?" (menor)":i===4?" (mayor)":""}</span>`).join("")+
    `<span class="srcnote">No es un dato publicado. Índice = P × L × F × A × G, en quintiles de todos los municipios. P: percentil de población (INE 2025). L: pérdidas / ${w.perdidas.tope_pct} % (máx. 1); sin dato publicado, ${es(w.perdidas.sin_dato,2)}. F: ${es(w.fibrocemento.base,1)} + ${es(w.fibrocemento.pendiente,1)} × % de fibrocemento; sin dato EIEL, ${es(w.fibrocemento.sin_dato,2)}. A: ${es(w.antiguedad.base,1)} + ${es(w.antiguedad.pendiente,1)} × años desde la fase EIEL / ${w.antiguedad.anios_tope} (máx. 1); sin EIEL, ${es(w.antiguedad.sin_dato,2)}. G: privado ${es(w.modelo.V,1)}, mixto ${es(w.modelo.M,1)}, municipalizado ${es(w.modelo.P,1)}, vecinal ${es(w.modelo.C,1)}, otros ${es(w.modelo.O,1)}, sin dato ${es(w.modelo.N,1)}. Pesos editables en data/prioridad_pesos.json.</span>`;}
  else if(level==="mu"&&(colorBy==="fc"||colorBy==="est")){const fc=colorBy==="fc";
    L.innerHTML=`<span class="t">${fc?"Red de distribución en fibrocemento":"Red de distribución en estado malo o regular"} (% de la longitud) · EIEL</span>`+FC_BINS.map(b=>`<span><i style="background:${b[1]}"></i>${b[2]}</span>`).join("")+`<span><i style="background:var(--nodata)"></i>sin dato de la EIEL</span><span class="srcnote">EIEL: ${fc?"material":"estado"} declarado de cada tramo de la red de distribución, ponderado por su longitud. Comunidad de Madrid: EIEL fase 2023 de la IDEM (CC BY 4.0), sin las ciudades de 50.000 hab. o más. Sin dato en Catalunya, Baleares, País Vasco, Navarra y las provincias que no están en el visor nacional de la EIEL.</span>`;
    $("#hint").textContent="Rueda, pellizco o doble clic para acercar. En gris: la EIEL no cubre el municipio; no se estima nada.";}
  else if(level==="mu"){L.innerHTML=`<span class="t">Pérdidas por municipio (%) · último dato</span>`+MU_BINS.map(b=>`<span><i style="background:${b[1]}"></i>${b[2]}</span>`).join("")+`<span><i style="background:var(--nodata)"></i>sin dato municipal publicado</span><span><i style="background:repeating-linear-gradient(45deg,#eba25a 0 3px,rgba(22,44,64,.75) 3px 4px)"></i>estimación con poca o ninguna medición real</span><span><i style="background:repeating-linear-gradient(-45deg,#f1d98a 0 3px,rgba(22,44,64,.75) 3px 3.6px)"></i>dato declarado por el ayuntamiento, no medido (EIEL)</span><span><i style="background:repeating-linear-gradient(0deg,#9fd3c0 0 3px,rgba(22,44,64,.75) 3px 3.8px)"></i>dato publicado por el operador (art. 63.2 RD 3/2023)</span><span><i style="background:repeating-linear-gradient(90deg,#9fd3c0 0 3px,rgba(22,44,64,.75) 3px 3.8px)"></i>dato de todo el sistema del operador, no municipal</span><span><i style="background:radial-gradient(circle,var(--fg) 0 1.3px,transparent 1.6px) 0 0/4px 4px,var(--nodata)"></i>el operador publica otro indicador (rendimiento, IFE), no comparable</span><details class="lgmore"${LG_OPEN()}><summary>Cómo leer este mapa</summary><span class="srcnote">Catalunya: agua no registrada de las auditorías (ACA, F9). Ciudades con dato del operador: agua no registrada o pérdidas reales que publica en cumplimiento del art. 63.2 del RD 3/2023; si solo publica el rendimiento o el IFE, no se pinta en esta escala ni se convierte. Sistemas de varios municipios (Canal de Isabel II, Mancomunidad de la Comarca de Pamplona...): su agua no registrada o sus pérdidas reales, sin modificar, solo en los municipios que la propia fuente lista como servidos y solo si ninguna fuente municipal da dato. Illes Balears: agua no contabilizada, estimación del Govern IB 2024. Resto: pérdidas que declara el ayuntamiento en la EIEL, media de sus núcleos ponderada por consumo; la mediana de los municipios tiene todos sus valores en múltiplos de 5. ${UM_NOTE}</span></details>`;
    $("#hint").textContent="Rueda, pellizco o doble clic para acercar; arrastra para desplazar. En gris: sin dato municipal publicado, no se estima nada.";}
  else if(level==="int"){L.innerHTML=`<span class="t">Italia · perdite idriche totali (%) · ISTAT 2022</span>`+MU_BINS.map(b=>`<span><i style="background:${b[1]}"></i>${b[2]}</span>`).join("")+`<span class="srcnote">${esc(INT_IND)}. Regiones en el mapa; capitales de provincia (comuni capoluogo) en puntos. Misma escala que los municipios de España, pero otro indicador: agua inmessa en red menos agua erogada para usos autorizados. Otros países: ${INT.paises.filter(p=>p.estado!=="datos"&&p.estado!=="sin_capa").map(p=>`${esc(p.pais)} (${INT_ST[p.estado].toLowerCase()})`).join(", ")}. Oriente Medio: no hay fuente pública con granularidad subnacional; no se construye capa. Geometría: ISTAT, límites al 1/1/2026, CC BY 4.0.</span>`;}
  else{L.innerHTML=`<span class="t">Agua no registrada (%) · último dato</span>`+MU_BINS.map(b=>`<span><i style="background:${b[1]}"></i>${b[2]}</span>`).join("")+`<span><i style="background:var(--nodata)"></i>sin auditoría publicada</span><span class="srcnote">Dato 2024 de las auditorías publicadas por cada operador; si no hay, 2022 del anexo de la ACA. Cada valor lleva su año y fuente en el panel.</span>`;
    $("#hint").textContent="Todos los municipios responden al ratón y al clic. En gris: no consta auditoría publicada, no se estima nada.";}
}
function headerCtl(){
  document.querySelectorAll(".lvl button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.l===level));
  $("#segEU").hidden=level!=="eu";$("#segES").hidden=level!=="es";$("#yearsel").hidden=level!=="es";$("#ccsel").hidden=level!=="mu";$("#segMG").hidden=level!=="mu"&&level!=="cat";document.querySelectorAll("#segMG .esonly").forEach(b=>b.hidden=level!=="mu");document.querySelectorAll("#segMG button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.g===colorBy));$("#zoomCtl").hidden=level!=="mu";$("#mapSearch").hidden=level!=="mu";svg.classList.toggle("zoomable",level==="mu");
  document.querySelectorAll("#segEU button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===metric));
  document.querySelectorAll("#segES button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===esMetric));
  const A=$("#avg");
  if(level==="eu"){const m=M[metric];A.innerHTML=`Media EUR* <b>${m.fmt(m.avg)} ${m.unit}</b> · UE-27 <b>${m.fmt(m.eu)} ${m.unit}</b>`;}
  else if(level==="es"){const v=ccVal("ES");A.innerHTML=`España ${YRS[yi]} <b>${pc(v)}</b> · INE`;}
  else if(level==="mu"){A.innerHTML=`España 2024 <b>${pc(ccINE("ES"))}</b> ANR · INE`;}
  else if(level==="int"){A.innerHTML=`Italia 2022 <b>${pc(INT.it[2])}</b> perdite totali · ISTAT`;}
  else{A.innerHTML=`Cataluña 2024 <b>${pc(CAT_INE24)}</b> ANR · INE`;}
  const C=$("#crumbs");const T={eu:"Europa",es:"España",mu:"Municipios",cat:"Catalunya",int:"Internacional"};const chain={eu:["eu"],es:["eu","es"],mu:["eu","es","mu"],cat:["eu","es","cat"],int:["eu","int"]}[level];
  C.innerHTML=chain.map(l=>[l,T[l]]).map(([l,t],i)=>`${i?'<span class="sep">/</span>':''}<button data-l="${l}" ${l===level?'aria-current="page"':''}>${t}</button>`).join("");
  $("#maphead").textContent=level==="eu"?"ETRS89-LAEA · EurEau 2026":level==="es"?`Comunidades autónomas · INE ${YRS[yi]}`:level==="mu"?umCount(colorBy):level==="int"?"Italia · 20 regiones y 109 capitales de provincia · ISTAT 2022":"947 municipios · auditorías 2022-2024 (ACA y operadores)";
  if(level==="mu")$("#maphead").innerHTML=`${esc(umCount(colorBy))}<span class="cov50">${esc(umCount50(colorBy))} · <a href="${SRC_MD}" target="_blank" rel="noopener">fuentes y cobertura</a></span>`;
}
function paintMun(){
  for(const [id,e] of Object.entries(muEls)){let f="";
    if(colorBy==="ges")f=gesColor(gesOf(id));else{const L=muLatest(id);f=L?muColor(L.v):"";}
    e.style.fill=f;}
  const F=umFilt();
  for(const [id,e] of Object.entries(umEls)){e.style.fill=umFill(id);e.classList.toggle("opm",!!F&&F.has(id));}
  muLayer.classList.toggle("opf",!!F);
  muLayer.querySelectorAll(".umlow,.umdecl,.umop").forEach(e=>e.style.display=colorBy==="loss"?"":"none");}
function paint(){paintEU();paintES();paintMun();paintInt();legend();headerCtl();renderRank();renderPanel();marks();}

// Lleva un elemento al frente del SVG. Re-insertar un nodo lo desenfoca, así que el que tiene el foco de teclado no se mueve
function front(e){if(document.activeElement!==e)e.parentNode.appendChild(e);}
function marks(){
  for(const c in els)for(const e of els[c]){e.classList.toggle("sel",level==="eu"&&c===pinned.eu);e.classList.toggle("hov",level==="eu"&&c===hovered&&c!==pinned.eu);}
  for(const c in rEls)for(const e of rEls[c]){e.classList.toggle("sel",level==="es"&&c===pinned.es);e.classList.toggle("hov",level==="es"&&c===hovered&&c!==pinned.es);}
  catLayer.querySelectorAll(".mu.act,.mu.hov").forEach(e=>e.classList.remove("act","hov"));
  if(level==="cat"){if(hovered&&muEls[hovered]&&hovered!==pinned.cat){muEls[hovered].classList.add("hov");front(muEls[hovered]);}
    if(pinned.cat&&muEls[pinned.cat]){muEls[pinned.cat].classList.add("act");front(muEls[pinned.cat]);}}
  for(const e of muLayer.querySelectorAll("circle.um.act,circle.um.hov"))e.classList.remove("act","hov");
  for(const [k,e] of Object.entries(intEls)){e.classList.toggle("act",level==="int"&&k===pinned.int);e.classList.toggle("hov",level==="int"&&k===hovered&&k!==pinned.int);}
  if(level==="int")for(const k of [hovered,pinned.int])if(k&&intEls[k]&&k[0]==="c")front(intEls[k]);
  const hl=(p,k,cls)=>{const d=level==="mu"&&k&&MUN.mu[k];p.setAttribute("d",d||"");if(level==="mu"&&k&&!d&&umEls[k])umEls[k].classList.add(cls);};
  hl(umHov,hovered!==pinned.mu?hovered:null,"hov");hl(umSel,pinned.mu,"act");
  if(level==="eu"){if(hovered&&els[hovered])front(els[hovered][0]);if(pinned.eu&&els[pinned.eu])front(els[pinned.eu][0]);}
  if(level==="es"){for(const c of [hovered,pinned.es])if(c&&rEls[c])for(const e of rEls[c])front(e);}
  document.querySelectorAll("#rank button").forEach(b=>{b.classList.toggle("sel",b.dataset.k===pinned[level]);b.classList.toggle("hov",b.dataset.k===hovered);});
}

// ================= filtro por operador, ranking y CSV de la vista España =================
let rankGm="",opQuery="",opMatch=null,rankPv="",rankQ="",muQ="";
// Municipios que pasan los filtros de la vista España (operador, provincia, nombre, calidad); null si no hay ninguno
function umFilt(){if(!opMatch&&!rankPv&&!rankQ&&!muQ)return null;
  return new Set(UM_IDS.filter(id=>(!opMatch||opMatch.has(id))&&(!rankPv||id.slice(0,2)===rankPv)&&(!rankQ||umQual(id)===rankQ)&&(!muQ||opNorm(MUD[id][0]).includes(muQ))));}
const opNorm=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]+/g," ").trim();
const OPN_NORM=OPN.map(opNorm);
// Municipios con el operador entre sus operadores del SINAC (coincidencia por texto, sin acentos ni signos)
// y, en el País Vasco y Navarra, con el operador en baja que nombra su propia fuente (PVN), que el SINAC no recoge
function opIds(q){q=opNorm(q);if(q.length<2)return null;const hit=new Set(OPN_NORM.map((n,i)=>n.includes(q)?i:-1).filter(i=>i>=0));
  return new Set(UM_IDS.filter(id=>{if(PVN[id]&&opNorm(PVN[id][0]).includes(q))return true;const r=ESD[id];if(!r||!r[16])return false;for(let i=0;i<r[16].length;i+=3)if(hit.has(r[16][i]))return true;return false;}));}
const GSHORT={P:"Público",M:"Mixta",V:"Privada",C:"Vecinal",O:"Otros"};
const RANK_LAYER={
  loss:{title:"Pérdidas por municipio en España (%, último dato publicado)",note:"Línea vertical: España, INE 2024. "+UM_NOTE,v:id=>umLatest(id).v,avg:null,fmt:()=>x=>es(x,1),extra:id=>`<span class="yr">${umLatest(id).y} · ${QSHORT[umQual(id)]}</span>`},
  pri:{title:"Prioridad comercial por municipio (Índice Kimedes, calculado a partir de fuentes citadas)",note:"Índice = población × pérdidas (o ausencia de dato) × fibrocemento × antigüedad de la EIEL × modelo de gestión, con los pesos de data/prioridad_pesos.json. Es un cálculo de Kimedes, no un dato publicado.",
    v:id=>priAll().m[id].idx,avg:null,fmt:id=>()=>`Q${priAll().m[id].q} · ${es(priAll().m[id].idx,3)}`,extra:()=>""},
  ges:{title:"Municipios por modelo de gestión (ordenados por población)",note:"Barra: población (INE 2025). Color: modelo de gestión.",v:id=>MUD[id][1],avg:null,fmt:id=>()=>GSHORT[umGes(id)],extra:()=>""},
  fc:{title:"Red de distribución en fibrocemento por municipio (% de la longitud, EIEL)",note:"Material declarado de cada tramo en la EIEL.",v:umFc,avg:null,fmt:()=>x=>x+" %",extra:id=>`<span class="yr">${esd(id).ry}</span>`},
  est:{title:"Red de distribución en estado malo o regular por municipio (% de la longitud, EIEL)",note:"Estado declarado de cada tramo en la EIEL.",v:umRed,avg:null,fmt:()=>x=>x+" %",extra:id=>`<span class="yr">${esd(id).ry}</span>`}};
RANK_LAYER.loss.avg=ccINE("ES");
function umRankIds(){const Lr=RANK_LAYER[colorBy];
  const F=umFilt();
  return UM_IDS.filter(id=>LAYER[colorBy].has(id)&&(!rankCc||umCC(id)===rankCc)&&(!rankGm||umGes(id)===rankGm)&&(!F||F.has(id)))
    .sort((a,b)=>Lr.v(b)-Lr.v(a)||MUD[b][1]-MUD[a][1]);}
function setOp(q){opQuery=q.trim();opMatch=opIds(opQuery);rankAll=false;
  if(opMatch&&opMatch.size){pinned.mu=null;hovered=null;} // la ficha de operador ocupa el panel hasta que se elija un municipio
  const C=$("#opCount");
  if(!opMatch)C.textContent="";
  else{const pop=[...opMatch].reduce((a,id)=>a+MUD[id][1],0);C.textContent=opMatch.size?`${grp(opMatch.size)} municipios · ${grp(pop)} hab. (padrón 2025)`:"Ningún municipio";}
  paintMun();renderRank();marks();renderPanel();}
// CSV del ranking filtrado (todas las filas, no solo las visibles), con punto y coma y BOM para Excel
function exportCsv(ids=umRankIds()){
  // Números con coma decimal: el archivo es para Excel en español (separador ; y BOM)
  const dc=v=>v==null||v===""?"":String(v).replace(".",",");
  const q=v=>{v=typeof v==="number"?dc(v):v==null?"":String(v);return /[;"\r\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};
  const H=["codigo_ine","municipio","provincia","comunidad","poblacion_ine_2025","perdidas_pct","anio_perdidas","fuente_perdidas","modelo_gestion","origen_modelo","operador_principal_sinac","pct_poblacion_operador","tipo_operador","fibrocemento_pct","estado_malo_regular_pct","km_red_eiel","indicadores_operador_art63","calidad_dato","indice_prioridad_kimedes","quintil_prioridad","factor_poblacion","factor_perdidas","factor_fibrocemento","factor_antiguedad_eiel","factor_modelo","fase_eiel"];
  const rows=ids.map(id=>{const L=umLatest(id),e=esd(id)||{ops:[]},k=umGes(id),o=e.ops&&e.ops[0];
    return [id,MUD[id][0],PROV[id.slice(0,2)][0],ccName(umCC(id)),MUD[id][1],L?L.v:"",L?L.y:"",L?L.src:"",k?GCAT[k][0]:"",k?(MU[id]?GSRC.f:GSRC[e.gs]):"",o?o.n+(o.resp?" (responsable)":""):"",o?o.p:"",o&&!o.resp?OPTYPE[o.t]:"",e.fc??"",umRed(id)??"",e.km??"",(A63.m[id]||[]).map(r=>`${A63_IND[r[0]]} ${r[1]}${r[2]==="%"?" %":""} (${r[3]})`).join(" · "),umQual(id)?QUAL[umQual(id)]:"",
      ...(p=>[dc(p.idx.toFixed(4)),"Q"+p.q,dc(p.P.toFixed(4)),dc(p.L.toFixed(4)),dc(p.F.toFixed(4)),dc(p.A.toFixed(4)),p.G,p.fase??""])(priAll().m[id])].map(q).join(";");});
  const blob=new Blob(["\ufeff"+[H.join(";"),...rows].join("\r\n")],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`municipios_${colorBy}${rankCc?"_"+rankCc:""}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}

// ================= ranking =================
function rankRow(k,n,label,v,max,avg,col,fmt,extra=""){
  return `<button data-k="${k}"><span class="n">${n}</span><span class="nm">${esc(label)}</span>
  <span class="b">${v==null?"":`<span style="width:${(v/max*100).toFixed(1)}%;background:${col}"></span>`}${avg!=null?`<span class="avgline" style="left:${(avg/max*100).toFixed(1)}%"></span>`:""}</span>
  <span class="v ${v==null?"na":""}">${v==null?"sin dato":fmt(v)}${extra}</span></button>`;}
function renderRank(){
  const R=$("#rank");R.classList.toggle("mun",level==="cat"||level==="mu"||level==="int");$("#rankCtl").hidden=level!=="cat"&&level!=="mu";$("#rankMore").hidden=true;
  $("#onlyWrap").hidden=level!=="cat";$("#rankCcWrap").hidden=level!=="mu";$("#rankEs").hidden=level!=="mu";
  if(level==="eu"){const m=M[metric];
    const rows=Object.keys(D).sort((a,b)=>{const va=val(a),vb=val(b);if(va==null)return 1;if(vb==null)return -1;return vb-va;});
    const max=Math.max(...rows.map(c=>val(c)||0));let n=0;
    $("#rankTitle").textContent=`${m.lbl} por país (${m.unit})`;$("#rankNote").textContent="Línea vertical: media ponderada EurEau (EUR*)";
    R.innerHTML=rows.map(c=>{const v=val(c);if(v!=null)n++;return rankRow(c,v==null?"·":String(n).padStart(2,"0"),D[c][0],v,max,m.avg,`var(--c${Math.max(binOf(v,m.bins),2)})`,m.fmt);}).join("");}
  else if(level==="es"){const m=ESM[esMetric];
    const rows=Object.keys(CC.r).filter(k=>k!=="ES").sort((a,b)=>{const va=ccVal(a),vb=ccVal(b);if(va==null)return 1;if(vb==null)return -1;return vb-va;});
    const max=Math.max(...rows.map(c=>ccVal(c)||0),ccVal("ES")||0);let n=0;
    $("#rankTitle").textContent=`${m.lbl} por comunidad autónoma (% · INE ${YRS[yi]})`;$("#rankNote").textContent="Línea vertical: España";
    R.innerHTML=rows.map(c=>{const v=ccVal(c);if(v!=null)n++;return rankRow(c,v==null?"·":String(n).padStart(2,"0"),CC.r[c].n,v,max,ccVal("ES"),`var(--c${Math.max(binOf(v,m.bins),2)})`,x=>es(x,1));}).join("");}
  else if(level==="int"){const ids=Object.keys(INT.cap).sort((a,b)=>INT.cap[b][5]-INT.cap[a][5]);const max=Math.max(...ids.map(k=>INT.cap[k][5]));
    $("#rankTitle").textContent="Italia: perdite idriche totali por capital de provincia (%, ISTAT 2022)";$("#rankNote").textContent=`Línea vertical: Italia, ${es(INT.it[2],1)} %`;
    const LIM=40;const show=rankAll?ids:ids.slice(0,LIM);
    R.innerHTML=show.map((k,i)=>rankRow("c"+k,String(i+1).padStart(2,"0"),INT.cap[k][2],INT.cap[k][5],max,INT.it[2],muColor(INT.cap[k][5]),x=>es(x,1))).join("");
    if(ids.length>LIM){$("#rankMore").hidden=false;$("#moreBtn").textContent=rankAll?"Ver menos":`Ver los ${ids.length}`;}}
  else if(level==="mu"){
    const ids=umRankIds(),Lr=RANK_LAYER[colorBy];
    $("#rankTitle").textContent=Lr.title;$("#rankNote").textContent=Lr.note;
    $("#rankCount").textContent=`${grp(ids.length)} municipios ${LAYER[colorBy].txt}${rankCc?" en "+ccName(rankCc):""}${rankPv?" · provincia de "+PROV[rankPv][0]:""}${rankGm?" · "+GCAT[rankGm][0].toLowerCase():""}${rankQ?" · "+QUAL[rankQ].toLowerCase():""}${opMatch?" · operador «"+opQuery+"»":""}${muQ?" · nombre «"+$("#muq").value.trim()+"»":""}`;
    const LIM=40;const show=rankAll?ids:ids.slice(0,LIM);const max=Math.max(...ids.map(Lr.v));
    R.innerHTML=show.map((id,i)=>rankRow(id,String(i+1).padStart(2,"0"),MUD[id][0],Lr.v(id),max,Lr.avg,umFill(id),Lr.fmt(id),Lr.extra(id))).join("");
    if(ids.length>LIM){$("#rankMore").hidden=false;$("#moreBtn").textContent=rankAll?"Ver menos":`Ver los ${ids.length}`;}}
  else{const only=$("#onlyData").checked;
    let ids=Object.keys(MU).filter(id=>!only||muLatest(id));
    ids.sort((a,b)=>{const va=muLatest(a),vb=muLatest(b);if(!va&&!vb)return MU[b][2]-MU[a][2];if(!va)return 1;if(!vb)return -1;return vb.v-va.v;});
    const withData=Object.keys(MU).filter(id=>muLatest(id)).length;
    $("#rankTitle").textContent="Agua no registrada por municipio (%, último dato)";$("#rankNote").textContent="Línea vertical: Cataluña, INE 2024";
    $("#rankCount").textContent=`${withData} de 947 municipios con dato publicado`;
    const LIM=40;const show=rankAll?ids:ids.slice(0,LIM);const max=Math.max(...ids.map(id=>(muLatest(id)||{v:0}).v));let n=0;
    R.innerHTML=show.map(id=>{const L=muLatest(id);if(L)n++;return rankRow(id,L?String(n).padStart(2,"0"):"·",MU[id][0],L?L.v:null,max,CAT_INE24,L?muColor(L.v):"",x=>es(x,1),L?`<span class="yr">${L.y}</span>`:"");}).join("");
    if(ids.length>LIM){$("#rankMore").hidden=false;$("#moreBtn").textContent=rankAll?"Ver menos":`Ver los ${ids.length}`;}}
}

// ================= panel =================
function row(label,v,unit="",cls=""){return `<dt>${label}</dt><dd class="${v==null?"na":cls}">${v==null?"sin dato":v+(unit?" "+unit:"")}</dd>`}
function cmpBars(items){const max=Math.max(...items.map(x=>x[1]||0))*1.15||1;
  return `<div class="cmp">${items.map(([l,v,me])=>`<span>${l}</span><span class="bar"><span class="${me?"me":""}" style="width:${((v||0)/max*100).toFixed(1)}%"></span></span><span class="v">${v==null?"·":es(v,1)}</span>`).join("")}</div>`;}
function renderPanel(){const P=$("#panel");const k=hovered||pinned[level];
  if(level==="mu"&&!k&&opMatch&&opMatch.size)return panelOp(P);
  if(level==="int")return panelInt(P,k);
  if(!k){P.innerHTML=`<p class="empty">${level==="cat"?"Selecciona un municipio en el mapa o en el ranking.":"Selecciona un elemento en el mapa o en el ranking."}</p>`;return;}
  const chip=`<span class="chip ${k===pinned[level]?"pin":""}">${k===pinned[level]?"Fijado":"Vista previa"}</span>`;
  if(level==="eu")return panelEU(P,k,chip);if(level==="es")return panelES(P,k,chip);if(level==="mu")return panelUM(P,k,chip);return panelMU(P,k,chip);}
function panelEU(P,c,chip){const d=D[c],m=M[metric],v=val(c);
  const src=(c==="ES"&&metric==="nrw")?"INE 2024":(v==null?"Sin dato comparable en EurEau 2026":"EurEau 2026");
  const vol=c==="ES"?"984":(d[3]!=null&&d[6]!=null)?grp(d[3]/100*d[6]):null;
  const mg=d[13]?`<div class="mg">${d[13].map((p,i)=>p?`<span style="width:${p}%;background:var(--c${6-i})" title="${MG[i]} ${p}%"></span>`:"").join("")}</div><div class="mgl">${d[13].map((p,i)=>p?`<span><i style="background:var(--c${6-i})"></i>${MG[i]} ${p} %</span>`:"").join("")}</div>`:`<p class="note">Modelo de gestión sin dato.</p>`;
  P.innerHTML=`<div class="ph"><div><h2>${d[0]}</h2><span class="code">${c} · ${d[1]?(d[1]/1e6).toLocaleString('es-ES',{maximumFractionDigits:1})+" M hab.":""}</span></div>${chip}</div>
  <div class="hero"><span class="lbl">${m.lbl}</span><span class="big">${v==null?"sin dato":m.fmt(v)}${v==null?"":`<small>${m.unit}</small>`}</span><span class="src">${v==null?src:m.fmt(v)+" "+m.unit+" · "+src}</span></div>
  ${v==null?"":cmpBars([[c,v,1],["Media EUR*",m.avg,0]])}
  <div class="trio">${["nrw","rl","lin"].map(k=>`<div class="${k===metric?"cur":""}"><span class="k">${M[k].short} ${M[k].unit==="%"?"%":""}</span><span class="x">${val(c,k)==null?"·":M[k].fmt(val(c,k))}</span></div>`).join("")}</div>
  ${c==="ES"?`<div><button class="cta" data-go="es">Ver España por comunidades</button></div>`:""}
  <div><h3>Agua y población</h3><dl>
    ${row("Población",d[1]?grp(d[1]):null)}${row("Conectada a red pública",es(d[2],1),"%")}${row("Agua potable producida",d[6]==null?null:grp(d[6]),"hm³/año")}
    ${c==="ES"?row("Agua no registrada (INE 2024)",vol,"hm³/año"):row("Volumen no registrado",vol,"hm³/año","est")}${row(c==="ES"?"Consumo de hogares (INE 2024)":"Consumo residencial",es(d[7],0),"L/hab/día")}${row("Red de distribución",d[8]==null?null:grp(d[8]*1000),"km")}
    ${row("Renovación de la red",es(d[9],1),"%/año")}${row("Contadores con telelectura",es(d[10],1),"%")}${row("Tarifa residencial media",es(d[11],2),"€/m³")}</dl></div>
  <div><h3>Distribuidoras</h3><dl>${row("Servicios de agua potable",d[12])}</dl>
    <div style="margin-top:10px;font:400 12px/16px var(--mono);color:var(--muted)">Población servida por modelo de gestión</div>${mg}
    ${d[14].length?`<div class="ops">${d[14].map(o=>`<span>${esc(o)}</span>`).join("")}</div><p class="srcline">Operadores verificados en su web oficial, oct 2026. Lista no exhaustiva.</p>`:""}
    ${d[15]?`<p class="note">${d[15]}</p>`:""}</div>`;}
function spark(code){const r=CC.r[code];const W=320,H=120,L=30,Rr=8,T=10,B=22;
  const a=YRS.map((y,i)=>ccPct(code,"a",i)),p=YRS.map((y,i)=>ccPct(code,"p",i));
  const mx=Math.max(...a.filter(v=>v!=null),...p.filter(v=>v!=null))*1.12;const x=y=>L+(y-2008)/(2024-2008)*(W-L-Rr),yy=v=>T+(1-v/mx)*(H-T-B);
  const line=(arr,cls)=>{let d="",pen=false;arr.forEach((v,i)=>{if(v==null){pen=false;return;}d+=(pen?"L":"M")+x(YRS[i]).toFixed(1)+","+yy(v).toFixed(1);pen=true;});return `<path class="${cls}" d="${d}"></path>`;};
  const ticks=[0,Math.round(mx/2/5)*5||5].map(t=>`<line class="ax" x1="${L}" x2="${W-Rr}" y1="${yy(t)}" y2="${yy(t)}"></line><text x="${L-4}" y="${yy(t)+3}" text-anchor="end">${t}</text>`).join("");
  const xt=[2008,2012,2016,2020,2024].map(y=>`<text x="${x(y)}" y="${H-6}" text-anchor="middle">${y}</text>`).join("");
  const pts=a.map((v,i)=>v==null?"":`<circle class="${i===yi?"cur":"pt"}" cx="${x(YRS[i])}" cy="${yy(v)}" r="${i===yi?3.5:2}"></circle>`).join("");
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" role="img" aria-label="Serie 2008-2024 de ${esc(r.n)}">${ticks}${xt}${line(p,"l2")}${line(a,"l1")}${pts}</svg>
  <div class="keyrow"><span><i></i>Agua no registrada %</span><span><i class="d"></i>Pérdidas reales %</span></div>
  <p class="srcline">INE ESSA, tabla 53447. Anual 2008-2014, bienal desde 2014.${r.bad.length?" "+r.bad.join(", ")+": pérdidas reales inconsistentes en la fuente, omitidas.":""}</p>`;}
function panelES(P,c,chip){const r=CC.r[c],y=YRS[yi],m=ESM[esMetric],v=ccVal(c);const hm=x=>x==null?null:es(x/1000,1);const i=yi;
  const items=[[c==="CM"?"Ceuta y M.":r.n.length>12?r.n.slice(0,11)+".":r.n,v,1],["España",ccVal("ES"),0]];if(c!=="09")items.push(["Cataluña",ccVal("09"),0]);
  P.innerHTML=`<div class="ph"><div><h2>${r.n}</h2><span class="code">Comunidad autónoma · INE ${y}</span></div>${chip}</div>
  <div class="hero"><span class="lbl">${m.lbl}</span><span class="big">${v==null?"sin dato":es(v,1)}${v==null?"":"<small>%</small>"}</span><span class="src">${v==null?"Dato inconsistente en la fuente":es(v,1)+" % · INE "+y}</span></div>
  ${cmpBars(items)}
  <div class="trio">${[["ANR %","a"],["Reales %","p"],["Aparentes %","q"]].map(([l,k])=>`<div class="${ESM[esMetric].key===k?"cur":""}"><span class="k">${l}</span><span class="x">${ccPct(c,k)==null?"·":es(ccPct(c,k),1)}</span></div>`).join("")}</div>
  <div class="ctas"><button class="cta" data-go="mu" data-cc="${c}">Ver municipios de España</button>${c==="09"?`<button class="cta" data-go="cat">Ver municipios de Catalunya</button>`:""}</div>
  <div><h3>Volúmenes ${y} (hm³)</h3><dl>${row("Suministrado a la red",hm(r.s[i]))}${row("Agua no registrada",hm(r.a[i]))}${row("Pérdidas reales",r.bad.includes(y)?null:hm(r.p[i]))}${row("Pérdidas aparentes",hm(r.q[i]))}${CC.hog[c]?row("Consumo de hogares 2024",CC.hog[c],"L/hab/día"):""}</dl></div>
  <div><h3>Evolución 2008-2024</h3>${spark(c)}</div>`;}
function panelMU(P,id,chip){const r=MU[id];if(!r){P.innerHTML="";return;}const L=muLatest(id),unit=muUnit(id);const a24=r[3],a22=r[4];
  const head=`<div class="ph"><div><h2>${esc(r[0])}</h2><span class="code">INE ${id} · ${esc(COMS[r[1]])} · ${grp(r[2])} hab. (2025)</span></div>${chip}</div>`;
  if(!L){P.innerHTML=head+`<div class="hero"><span class="lbl">Agua no registrada</span><span class="big" style="font-size:24px;line-height:32px">No consta auditoría publicada en el registro de la ACA</span><span class="src">Sin dato publicado. No se estima ningún valor.</span></div>
    <p class="note">Los servicios con más de 5.000 abonados deben publicar cada dos años una auditoría de eficiencia hidráulica (disposición adicional 26ª del texto refundido de aguas de Cataluña, Decreto Legislativo 3/2003). ${r[6]===2?"La ACA lista este servicio como obligado, sin enlace a la auditoría 2024.":""}</p>
    <div><h3>Municipio</h3><dl>${row("Población (Idescat 2025)",grp(r[2]))}${row("Comarca",esc(COMS[r[1]]))}</dl></div>`+gesBlock(id)+srcList(catSources(id,null));return;}
  const srcTxt=L.url?`${es(L.v,1)} % · ${L.y} · <a href="${esc(L.url)}" target="_blank" rel="noopener">auditoría del operador</a>`:`${es(L.v,1)} % · ${L.src} ${L.y}`;
  const items=[[r[0].length>12?r[0].slice(0,11)+".":r[0],L.v,1],["Cataluña INE",CAT_INE24,0]];
 
  P.innerHTML=head+`<div class="hero"><span class="lbl">Agua no registrada</span><span class="big">${es(L.v,1)}<small>%</small></span><span class="src">${srcTxt}</span></div>
  ${cmpBars(items)}
  <div><h3>Indicadores</h3><dl>
   ${a24&&a24[1]!=null?row("Pérdidas reales (% entrada) 2024",es(a24[1],1),"%"):""}
   ${a22?row("Agua no registrada 2022 (ACA)",es(a22[0],1),"%"):""}
  
   ${row("Población (Idescat 2025)",grp(r[2]))}
  </dl></div>
  ${unit?`<p class="note">Dato de la unidad de gestión ${esc(unit)}: el mismo valor para todos sus municipios.</p>`:""}
  ${a24&&a24[7]?`<p class="note">Dos redes auditadas en 2024: se muestra la del servicio con más abonados (${esc(a24[7][2])}, ${es(a24[0],1)} %). La otra red (${esc(a24[7][3])}) publica ${es(a24[7][0],1)} %.</p>`:""}
  ${a22&&a22[5]?`<p class="note">Dos redes auditadas en Vallirana en 2022 (43,6 % y 43,5 %).</p>`:""}
  ${!a24&&r[6]===1?`<p class="note">El operador ha publicado la auditoría 2024 (registro de la ACA); aquí se muestra el dato 2022 del anexo de la ACA.</p>`:""}`+gesBlock(id)+srcList(catSources(id,L));}
function catSources(id,L){const r=MU[id];const out=[];
  if(L&&L.url)out.push(["Pérdidas 2024",{n:"Auditoría de eficiencia hidráulica 2024 publicada por el operador",u:L.url,d:"Agua no registrada (F9) y pérdidas reales, según la plantilla de la ACA"}]);
  if(r&&r[3]&&r[3][7])out.push(["Pérdidas 2024, otra red",{n:"Auditoría de eficiencia hidráulica 2024 de la otra red ("+r[3][7][3]+")",u:URLS[r[3][7][1]],d:"Agua no registrada (F9) de esa red"}]);
  if(r&&r[4])out.push(["Pérdidas 2022","aca22"]);
  out.push(["Obligación y registro de auditorías","acareg"]);
  out.push(["Modelo de gestión y operador","esf"]);
  out.push(["Población","idescat"]);
  return out;}

function sparkIB(id){const b=IB[id];const W=320,H=120,L=30,Rr=8,T=10,B=22;const v=b[1];
  const mx=Math.max(...v.filter(x=>x!=null))*1.12;const x=y=>L+(y-2000)/24*(W-L-Rr),yy=t=>T+(1-t/mx)*(H-T-B);
  let d="",pen=false;v.forEach((t,i)=>{if(t==null){pen=false;return;}d+=(pen?"L":"M")+x(2000+i).toFixed(1)+","+yy(t).toFixed(1);pen=true;});
  const ticks=[0,Math.round(mx/2/5)*5||5].map(t=>`<line class="ax" x1="${L}" x2="${W-Rr}" y1="${yy(t)}" y2="${yy(t)}"></line><text x="${L-4}" y="${yy(t)+3}" text-anchor="end">${t}</text>`).join("");
  const xt=[2000,2006,2012,2018,2024].map(y=>`<text x="${x(y)}" y="${H-6}" text-anchor="middle">${y}</text>`).join("");
  const n=v.length-1;
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" role="img" aria-label="Serie 2000-2024 de ${esc(MUD[id][0])}">${ticks}${xt}<path class="l1" d="${d}"></path>${v[n]==null?"":`<circle class="cur" cx="${x(2000+n)}" cy="${yy(v[n])}" r="3.5"></circle>`}</svg>
  <div class="keyrow"><span><i></i>Agua no contabilizada %</span></div>`;}
// Indicadores publicados por el operador o el ayuntamiento (art. 63.2 RD 3/2023), con su nombre exacto, año, página y enlace
// Tabla de MITECO por municipio (Parte 5), si llega: se muestra aparte; su precedencia en el mapa se decidirá con los datos
function mitBlock(id){const r=A63.mt.m[id];if(!r)return "";
  return `<div><h3>MITECO, evaluación de fugas 2024 (${r[3]==="detallada"?"detallada":"básica"})</h3><dl>${row("Agua no registrada",r[0]==null?null:es(r[0],2),"%")}${row("Índice de fugas estructurales (IFE)",r[1]==null?null:es(r[1],2))}${row("Rendimiento",r[2]==null?null:es(r[2],2),"%")}</dl>
  <p class="srcline">Respuesta de MITECO a la solicitud de acceso a la información (${esc(r[5])}, recibida el ${A63_DATE(r[6])}).</p></div>`;}
function a63Block(id){const R=A63.m[id];if(!R)return "";
  return `<div><h3>Publicado por el operador (art. 63.2 RD 3/2023)</h3><dl>${R.map(r=>row(`${A63_IND[r[0]]} ${r[3]}`,r[2]==="%"?es(r[1],2).replace(/,?0+$/,""):es(r[1],2),r[2]==="%"?"%":esc(r[2]))).join("")}</dl>
  <p class="srcline">${esc(R[0][4])} · ${R.map(r=>esc(r[6])).filter((x,i,a)=>a.indexOf(x)===i).join(" · ")} · <a href="${esc(R[0][5])}" target="_blank" rel="noopener">documento del operador</a>. Cifras transcritas tal como se publican; no se calcula ninguna.</p></div>`;}
const PRINT_BTN=`<div class="ctas noprint"><button class="cta" type="button" data-print>Imprimir ficha</button></div>`;
// Índice de prioridad comercial con sus factores, para que se vea de dónde sale
function priBlock(id){const p=priAll().m[id];const f=x=>es(x,2);
  return `<div><h3>Prioridad comercial (Índice Kimedes)</h3><dl>${row("Índice y quintil",`${es(p.idx,3)} · Q${p.q}`)}${row("Población (percentil)",f(p.P))}${row(`Pérdidas${p.loss==null?" (sin dato publicado)":""}`,f(p.L))}${row(`Fibrocemento${p.fc==null?" (sin dato EIEL)":""}`,f(p.F))}${row(`Antigüedad de la EIEL${p.fase==null?" (sin EIEL)":" (fase "+p.fase+")"}`,f(p.A))}${row(`Modelo de gestión (${GCAT[p.gm][0].toLowerCase()})`,f(p.G))}</dl>
  <p class="srcline">Calculado por Kimedes a partir de las fuentes de esta ficha, con los pesos de data/prioridad_pesos.json. No es un dato publicado.</p></div>`;}
function panelUM(P,id,chip){const r=MUD[id];if(!r){P.innerHTML="";return;}const c=umCC(id),L=umLatest(id),prov=PROV[id.slice(0,2)][0],ine=ccINE(c);
  const head=`<div class="ph"><div><h2>${esc(r[0])}</h2><span class="code">INE ${id} · ${esc(prov===ccName(c)?prov:prov+" · "+ccName(c))} · ${grp(r[1])} hab. (INE 2025)</span></div>${chip}</div>`;
  const muni=`<div><h3>Municipio</h3><dl>${row("Código INE",id)}${row("Provincia",esc(prov))}${row("Comunidad",esc(ccName(c)))}${row("Población (INE, 1/1/2025)",grp(r[1]))}</dl></div>`;
  // Gestión, operadores y red: en todas las comunidades; en Catalunya, además, la ficha de ESF
  const rest=muni+mitBlock(id)+(MU[id]?gesBlock(id):gesBlockES(id))+opsBlock(id)+redBlock(id)+priBlock(id)+srcList(umSources(id,L),id)+PRINT_BTN;
  if(!L&&A63.m[id]){const r=A63.m[id][0];
    P.innerHTML=head+`<div class="hero"><span class="lbl">Indicador publicado por el operador</span><span class="big">${es(r[1],2).replace(/,?0+$/,"")}<small>${r[2]==="%"?"%":""}</small></span><span class="src">${esc(A63_IND[r[0]])} · ${r[3]} · ${esc(r[4])} · <a href="${esc(r[5])}" target="_blank" rel="noopener">documento</a></span></div>
    <p class="note warn">El indicador «${esc(A63_IND[r[0]])}» no es un porcentaje de pérdidas: no se pinta en la escala de pérdidas ni se convierte (100 menos el rendimiento sería un valor calculado por Kimedes, no publicado).</p>${a63Block(id)}`+rest;return;}
  const ccShort=c==="18"||c==="19"?"Ceuta y M.":ccName(c).length>12?ccName(c).slice(0,11)+".":ccName(c);
  if(!L){P.innerHTML=head+`<div class="hero"><span class="lbl">Pérdidas de agua del municipio</span><span class="big" style="font-size:24px;line-height:32px">Sin dato municipal publicado</span><span class="src">Sin dato municipal publicado. No se estima ningún valor.</span></div>
    <p class="note">${umReason(id)}</p>
    <div><h3>Contexto: toda la comunidad</h3><dl>${row(`Agua no registrada, ${esc(c==="18"||c==="19"?"Ceuta y Melilla":ccName(c))} (INE 2024)`,ine==null?null:es(ine,1),"%")}</dl><p class="srcline">Valor de toda la comunidad, no de este municipio. INE ESSA, tabla 53447.</p></div>`+rest;return;}
  const items=[[r[0].length>12?r[0].slice(0,11)+".":r[0],L.v,1],[ccShort+" INE",ine,0]];
  if(L.kind==="cat"){
    const srcTxt=`${es(L.v,1)} % · ${L.y} · ${L.src}`+(L.url?` · <a href="${esc(L.url)}" target="_blank" rel="noopener">auditoría del operador</a>`:"");
    P.innerHTML=head+`<div class="hero"><span class="lbl">Agua no registrada</span><span class="big">${es(L.v,1)}<small>%</small></span><span class="src">${srcTxt}</span></div>
    ${cmpBars(items)}${rest}<div class="ctas"><button class="cta" data-go="cat">Ver municipios de Catalunya</button></div>`;return;}
  if(L.kind==="art63"){
    P.innerHTML=head+`<div class="hero"><span class="lbl">${esc(A63_IND[L.ind])}</span><span class="big">${lossTxt(L)}<small>%</small></span><span class="src">${lossTxt(L)} % · ${L.y} · ${esc(L.src)} · <a href="${esc(L.url)}" target="_blank" rel="noopener">documento del operador</a></span></div>
    ${cmpBars(items)}${a63Block(id)}<p class="note">${esc(UM_NOTE)}</p>${rest}`;return;}
  if(L.kind==="sistema"){const sm=A63.sm[id];
    P.innerHTML=head+`<div class="hero"><span class="lbl">${esc(A63_IND[L.ind])} del sistema</span><span class="big">${lossTxt(L)}<small>%</small></span><span class="src">Dato del sistema ${esc(L.op)} (${L.n} municipios), no municipal · ${L.y} · <a href="${esc(L.url)}" target="_blank" rel="noopener">documento del operador</a></span></div>
    ${cmpBars(items)}
    <p class="note warn">Cifra que el operador publica para todo su sistema (${esc(L.amb)}), pintada tal como se publica. No es un dato de este municipio: se muestra porque la fuente lo lista como servido por el sistema (${sm[1]==="distribucion"?"distribución en baja":"servicio sin especificar"}: «${esc(sm[5])}», ${esc(sm[3])}) y ninguna fuente municipal da dato.</p>
    ${a63Block(id)}<p class="note">${esc(UM_NOTE)}</p>${rest}`;return;}
  if(L.kind==="eiel"){
    P.innerHTML=head+`<div class="hero"><span class="lbl">Pérdidas en la red de abastecimiento</span><span class="big">${es(L.v,1)}<small>%</small></span><span class="src">${es(L.v,1)} % · EIEL fase ${L.y} · ${L.src}</span></div>
    ${cmpBars(items)}
    <p class="note warn">Dato declarado por el ayuntamiento, no medido. ${L.nrep} de ${L.nn} núcleos informan${L.cov!=null?` (${L.cov} % de la población del padrón EIEL)`:""}; el ${L.rnd} % de sus valores son múltiplos de 5.</p>
    <p class="note">Media de los núcleos ponderada por su consumo medio (invierno y verano); sin consumo, por padrón. Los núcleos con 0 % o más del 95 % no cuentan. La barra de la comunidad es el agua no registrada del INE, otro indicador.</p>${rest}`;return;}
  const b=IB[id],i=L.i;const hm=x=>x==null?null:es(x,3);
  P.innerHTML=head+`<div class="hero"><span class="lbl">Agua no contabilizada</span><span class="big">${fmt2(L.v)}<small>%</small></span><span class="src">${fmt2(L.v)} % · ${L.y} · ${L.src}</span></div>
  ${cmpBars(items)}
  ${L.low?`<p class="note warn">Valor estimado por el Govern, con poca o ninguna medición real${L.dr==null?" (sin dato de mediciones reales).":` (${es(L.dr,0)} % de datos reales).`}</p>`:""}
  <div><h3>Indicadores ${L.y}</h3><dl>${row("Datos reales",L.dr==null?null:es(L.dr,0),"%")}${row("Total suministrado",hm(b[3][i]),"hm³")}${row("Consumo",hm(b[4][i]),"hm³")}${row("Isla",esc(b[0]))}</dl></div>
  <div><h3>Evolución 2000-2024</h3>${sparkIB(id)}<p class="srcline">Font: Govern de les Illes Balears, Servei de Planificació. Dades d'abastiment urbà 2000-2024. Consulta 22/10/2026. CC BY-SA. % d'aigua no comptabilitzada = (total subministrat − consum) / total subministrat. Datos reales sin publicar de 2000 a 2015.</p></div>
  <p class="note">La barra de la comunidad es el agua no registrada del INE, otro indicador: sirve de referencia, no de comparación exacta.</p>${rest}`;}
// Ficha de la vista internacional: una región o capital de Italia; sin selección, el estado de cada país
function panelInt(P,k){
  const src=`<div><h3>Fuentes</h3><ol class="srcs"><li><span class="what">Pérdidas</span><b>ISTAT, Censimento delle acque per uso civile, anno 2022</b>. Tavole «Le statistiche dell'Istat sull'acqua. Anni 2020-2023» (22/03/2024), Tav 3 (regiones) y Tav 5 (capoluoghi). CC BY 4.0. <a href="https://www.istat.it/comunicato-stampa/le-statistiche-dellistat-sullacqua-anni-2020-2023/" target="_blank" rel="noopener">Abrir fuente</a></li>
    <li><span class="what">Geometría</span><b>${esc(INT.geo.src)}</b>. ${esc(INT.geo.licencia)}. <a href="${esc(INT.geo.url)}" target="_blank" rel="noopener">Abrir fuente</a></li></ol></div>`;
  if(!k){P.innerHTML=`<div class="ph"><div><h2>Internacional</h2><span class="code">Fuentes subnacionales con licencia abierta</span></div></div>
    <p class="note">La vista Europa da el dato por país (EurEau). Aquí solo entran países con una fuente oficial abierta por ciudad, región o compañía. Selecciona una región o una capital de Italia.</p>
    <div><h3>Estado por país (30/10/2026)</h3><dl>${INT.paises.map(p=>row(esc(p.pais),`${INT_ST[p.estado]}`)).join("")}</dl>
    <p class="srcline">${INT.paises.filter(p=>p.estado!=="datos").map(p=>`${esc(p.pais)}: ${esc(p.motivo)}.`).join(" ")}</p></div>`+src;return;}
  const o=intRow(k),chip=`<span class="chip ${k===pinned.int?"pin":""}">${k===pinned.int?"Fijado":"Vista previa"}</span>`;
  const v=o.kind==="r"?o.r[4]:o.c[5],name=o.kind==="r"?o.r[1]:o.c[2];
  const items=[[name.length>12?name.slice(0,11)+".":name,v,1],["Italia",INT.it[2],0]];
  P.innerHTML=`<div class="ph"><div><h2>${esc(name)}</h2><span class="code">${o.kind==="r"?"Región":"Capital de provincia · "+esc(Object.values(INT.reg).find((r,i)=>Object.keys(INT.reg)[i]===o.c[7])[1])} · Italia</span></div>${chip}</div>
  <div class="hero"><span class="lbl">Perdite idriche totali</span><span class="big">${es(v,1)}<small>%</small></span><span class="src">${es(v,1)} % · 2022 · ISTAT, Censimento delle acque per uso civile</span></div>${cmpBars(items)}
  <div><h3>Indicadores 2022</h3><dl>${o.kind==="r"?row("Agua inmessa en red",es(o.r[2],1),"millones de m³")+row("Agua erogada para usos autorizados",es(o.r[3],1),"millones de m³"):row("Agua inmessa en red",grp(o.c[3]),"miles de m³")+row("Agua erogada para usos autorizados",grp(o.c[4]),"miles de m³")+row("Pérdidas lineales (clase)",o.c[6]?esc(o.c[6]):null)}</dl>
  <p class="srcline">${esc(INT_IND)}. ${o.kind==="c"?"Total de los comuni capoluogo: "+es(INT.tc[2],1)+" %. ":""}No es el mismo indicador que el agua no registrada de España: se compara el orden de magnitud.</p></div>`+src;}
// Ficha de operador (FWG-1870, Parte 6): los municipios donde el filtro de operador casa con alguno de sus operadores del SINAC
function panelOp(P){const ids=[...opMatch],pop=ids.reduce((a,id)=>a+MUD[id][1],0);
  const q=opNorm(opQuery),names=[...OPN.map((n,i)=>[n,i]).filter(([,i])=>OPN_NORM[i].includes(q)),
    ...[...new Set(Object.values(PVN).map(p=>p[0]))].filter(n=>opNorm(n).includes(q)&&!OPN_NORM.includes(opNorm(n))).map(n=>[n,-1])];
  const grupos=[...new Set(names.map(([,i])=>i>=0&&OPC[i]&&OPC[i][0]).filter(Boolean))],tipos=[...new Set(names.map(([,i])=>i>=0?OPT[i]:"-").filter(t=>t!=="-"))];
  const withL=ids.filter(id=>umLatest(id));
  // Por fuente: cuántos municipios tienen dato y entre qué valores publicados están. No se calcula ninguna media (FWG-1871, revisión)
  const by={};for(const id of withL){const k=umQual(id),v=umLatest(id).v;const b=by[k]??=[Infinity,-Infinity,0];b[0]=Math.min(b[0],v);b[1]=Math.max(b[1],v);b[2]++;}
  const gm={};for(const id of ids){const k=umGes(id)||"N";gm[k]=(gm[k]||0)+1;}
  const sys=A63.s.filter(r=>names.some(([n])=>(" "+opNorm(n)+" ").includes(" "+opNorm(r[0])+" ")));
  P.innerHTML=`<div class="ph"><div><h2>${esc(opQuery)}</h2><span class="code">Ficha de operador · ${grp(names.length)} nombre${names.length===1?"":"s"} del SINAC</span></div></div>
  <div><h3>Municipios</h3><dl>${row("Municipios donde opera",grp(ids.length))}${row("Población (INE 2025)",grp(pop))}${row("Con dato de pérdidas",`${grp(withL.length)} (${es(100*withL.length/ids.length,0)} %)`)}
   ${tipos.length?row("Tipo",tipos.map(t=>OPTYPE[t]).join(" · ")):""}${grupos.length?row("Grupo",esc(grupos.join(" · "))):""}
   ${row("Modelo de gestión de sus municipios",Object.entries(gm).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`${GCAT[k][0]} ${grp(n)}`).join(" · "))}</dl></div>
  <div><h3>Pérdidas publicadas en sus municipios</h3>${Object.keys(by).length?`<dl>${Object.entries(by).map(([k,[lo,hi,n]])=>row(`${QUAL[k]} (${grp(n)} mun.)`,n>1&&lo!==hi?`de ${es(lo,1)} a ${es(hi,1)}`:es(lo,1),"%")).join("")}</dl>`:`<p class="note">Ninguno de sus municipios tiene dato de pérdidas publicado.</p>`}
   <p class="srcline">Valor mínimo y máximo publicados, por separado para cada fuente: son indicadores distintos. No se calcula ninguna media; el detalle está en el ranking y en el CSV.</p></div>
  <div><h3>Publicado para todo su sistema (art. 63.2 RD 3/2023)</h3>${sys.length?`<dl>${sys.map(r=>row(`${A63_IND[r[3]]} ${r[6]} · ${esc(r[2])}`,r[5]==="%"?es(r[4],2).replace(/,?0+$/,""):es(r[4],2),r[5]==="%"?"%":esc(r[5]))).join("")}</dl>
   <p class="srcline">${sys.map(r=>`${esc(r[1])}, ${esc(r[8])}: <a href="${esc(r[7])}" target="_blank" rel="noopener">documento</a>`).filter((x,i,a)=>a.indexOf(x)===i).join(" · ")}. Cifras de todo el sistema: el agua no registrada y las pérdidas reales se pintan, sin modificar, en los municipios que la propia fuente lista como servidos y sin dato municipal (${grp(ids.filter(id=>{const L=umLatest(id);return L&&L.kind==="sistema";}).length)} de los de este filtro).</p>`:`<p class="note">No se ha encontrado ninguna cifra publicada para todo su sistema.</p>`}</div>
  <div class="ctas"><button class="cta" id="opCsv" type="button">Exportar sus municipios (CSV)</button></div>`;
  $("#opCsv").addEventListener("click",()=>exportCsv([...opMatch].sort((a,b)=>MUD[b][1]-MUD[a][1])));}
// Todas las fuentes que alimentan la ficha, en el orden en que aparecen
function umSources(id,L){const e=esd(id);const out=[];
  if(MU[id])out.push(...catSources(id,L).filter(x=>x[1]!=="idescat"));
  else{if(A63.m[id]){const R=A63.m[id];
      out.push([L&&L.kind==="art63"?"Pérdidas publicadas por el operador":"Indicador publicado por el operador",{n:`${R[0][4]}, indicadores del art. 63.2 del RD 3/2023`,u:R[0][5],
        d:`${R.map(r=>A63_IND[r[0]]+" "+r[3]).join(", ")}. Consulta ${A63_DATE(R[0][8])}. Aviso legal: ${R[0][7]}. Dato de hecho citado; derechos del operador`}]);}
    if(L&&L.kind==="sistema"){const sm=A63.sm[id],R=SYS_ROWS[L.pat].find(r=>r[3]===L.ind);
      out.push(["Pérdidas del sistema (no municipales)",{n:`${R[1]}, ${A63_IND[R[3]]} ${R[6]} de todo el sistema`,u:R[7],d:`${R[8]}. Ámbito: ${R[2]}. Consulta ${A63_DATE(R[10])}. Aviso legal: ${R[9]}. Dato de hecho citado; derechos del operador`}]);
      out.push(["Municipios servidos por el sistema",{n:`${R[1]}, lista de municipios servidos`,u:sm[2],d:`${sm[3]}. Figura como «${sm[5]}». Consulta ${A63_DATE(sm[4])}`}]);}
    if(L&&L.kind==="ib")out.push(["Pérdidas (agua no contabilizada)","caib"]);if(L&&L.kind==="eiel")out.push(["Pérdidas declaradas","eiel"]);
    if(e&&e.gm!=="N")out.push(["Modelo de gestión",e.gs==="p"&&PVN[id]?{n:`${PVN[id][0]}, operador del abastecimiento en baja`,u:PVN[id][1],d:`${PVN[id][2]}. Consulta 30/10/2026`}:e.gs==="e"?(isIdem(id)?"idem":"eiel"):"sinac"]);}
  if(e&&e.ops.length)out.push(["Operadores, dotación y población abastecida","sinac"]);
  // Fuente que confirma el tipo (y el grupo) de cada operador clasificado
  if(e)for(const o of e.ops)if(!o.resp&&o.u)out.push([`Tipo de operador: ${o.n}`,{n:`Clasificación de ${o.n}`,u:o.u,d:`${OPTYPE[o.t]}${o.g?", grupo "+o.g:""}, según la fuente citada en data/operadores_clasificacion.csv`}]);
  if(e&&e.km!=null)out.push(["Red: longitud, material, estado y gestión",isIdem(id)?"idem":"eiel"]);
  out.push(["Referencia de la comunidad","ine53447"]);out.push(["Población","ine"]);
  return out;}

// ================= tooltip =================
function placeTip(x,y){const W=box.clientWidth,w=tip.offsetWidth,h=tip.offsetHeight;let l=Math.min(Math.max(x-w/2,8),W-w-8),tp=y-h-14;if(tp<6)tp=y+18;tip.style.left=l+"px";tip.style.top=tp+"px";}
function showTip(html,x,y){tip.innerHTML=html;tip.hidden=false;placeTip(x,y);}
const hideTip=()=>{tip.hidden=true};
const rel=e=>{const r=box.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
function tipFor(k){
  if(level==="int"){const o=intRow(k);if(o.kind==="r")return `<b>${esc(o.r[1])}</b><span>Perdite totali: ${es(o.r[4],1)} % · ISTAT 2022</span><span class="tn">Región</span>`;
    return `<b>${esc(o.c[2])}</b><span>Perdite totali: ${es(o.c[5],1)} % · ISTAT 2022</span><span class="tn">Capital de provincia (comune capoluogo)</span>`;}
  if(level==="eu"){const v=val(k),m=M[metric];return `<b>${D[k][0]}</b><span>${m.short}: ${v==null?"sin dato":m.fmt(v)+" "+m.unit} · ${(k==="ES"&&metric==="nrw")?"INE 2024":"EurEau 2026"}</span>`;}
  if(level==="es"){const r=CC.r[k],v=ccVal(k);return `<b>${r.n}</b><span>${ESM[esMetric].short}: ${pc(v)} · INE ${YRS[yi]}</span>`;}
  if(level==="mu"){const r=MUD[k],c=umCC(k),L=umLatest(k),e=esd(k);
    const pv=PROV[k.slice(0,2)][0];
    const gk=umGes(k),op=e&&e.ops[0];
    const gl=gk?`<span>Gestión: ${GCAT[gk][0]}${MU[k]&&GES[k]?" · "+esc(GES[k][1]):""}</span>`:"";
    const ol=op?`<span>${op.resp?"Responsable":"Operador"}: ${esc(op.n)}${op.p<100?` (${op.p<1?"< 1":op.p} %)`:""}</span>`:"";
    const lyr=colorBy==="fc"?`<span>Fibrocemento: ${e&&e.fc!=null?e.fc+" % de la red · EIEL "+e.ry:"sin dato"}</span>`:colorBy==="est"?`<span>Estado malo o regular: ${umRed(k)!=null?umRed(k)+" % de la red · EIEL "+e.ry:"sin dato"}</span>`:"";
    const a0=!L&&A63.m[k]?A63.m[k][0]:null;
    const loss=L?`<span>${L.kind==="cat"?"ANR":L.kind==="ib"?"No contabilizada":L.kind==="art63"||L.kind==="sistema"?(L.ind==="ANR"?"ANR":"Pérdidas reales"):"Pérdidas declaradas"}: ${L.kind==="ib"?fmt2(L.v):lossTxt(L)} % · ${L.kind==="cat"?(L.y==2024?"auditoría 2024":"ACA "+L.y):L.kind==="ib"?"Govern IB "+L.y:L.kind==="art63"?"operador, art. 63.2 RD 3/2023, "+L.y:L.kind==="sistema"?esc(L.op)+", "+L.y:"EIEL "+L.y}</span>`+(L.kind==="sistema"?`<span class="tn">Dato del sistema ${esc(L.op)} (${L.n} municipios), no municipal</span>`:"")+(L.low?`<span class="tn">Valor estimado por el Govern, con poca o ninguna medición real</span>`:"")+(L.kind==="eiel"?`<span class="tn">Dato declarado por el ayuntamiento, no medido</span>`:""):a0?`<span>${esc(A63_IND[a0[0]])}: ${es(a0[1],2).replace(/,?0+$/,"")}${a0[2]==="%"?" %":""} · operador ${a0[3]}</span><span class="tn">Otro indicador, no comparable con las pérdidas</span>`:`<span>Sin dato municipal publicado</span>${colorBy==="loss"?`<span class="tn">${umReason(k)}</span>`:""}`;
    return `<b>${esc(r[0])}</b><span>${esc(pv===ccName(c)?pv:pv+" · "+ccName(c))} · ${grp(r[1])} hab.</span>`+(colorBy==="loss"?loss+gl+ol:colorBy==="ges"?gl+ol+loss:lyr+gl+ol);}
  const r=MU[k],L=muLatest(k),u=muUnit(k);
  return `<b>${esc(r[0])}</b><span>${esc(COMS[r[1]])} · ${grp(r[2])} hab.</span>`+(L?`<span>ANR: ${es(L.v,1)} % · ${L.y==2024?"auditoría 2024":L.src+" "+L.y}</span>`+(r[3]&&r[3][1]!=null?`<span>Pérdidas reales: ${es(r[3][1],1)} % · 2024</span>`:""):`<span>Sin dato publicado</span>`)+(u?`<span class="tn">Unidad: ${esc(u)}</span>`:"")+(gesOf(k)?`<span>Gestión: ${GCAT[gesOf(k)][0]} · ${esc(GES[k][1])}</span>`:"");}

// ================= zoom y niveles =================
const FULL=[0,0,760,700];let curVB=FULL.slice(),anim=null;
const reduce=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const VB={eu:FULL,es:ESP.vb,mu:MUN.vb,cat:CAT.vb,int:INT.vb};
function sizeLabels(){const s=svg.getBoundingClientRect().width/curVB[2];const fs=(10/s).toFixed(3);catLayer.querySelectorAll(".mlab").forEach(e=>e.setAttribute("font-size",fs));}
const hatchMu=$("#hatchMu"),hatchDe=$("#hatchDe"),hatchOp=$("#hatchOp"),hatchSy=$("#hatchSy"),dotsOt=$("#dotsOt");
// El rayado de la vista por municipio mantiene el mismo grosor en pantalla con cualquier zoom
function setVB(v){curVB=v;svg.setAttribute("viewBox",v.map(n=>n.toFixed(3)).join(" "));const k=(v[2]/MUN.vb[2]).toFixed(4);hatchMu.setAttribute("patternTransform",`rotate(45) scale(${k})`);hatchOp.setAttribute("patternTransform",`scale(${k})`);hatchSy.setAttribute("patternTransform",`scale(${k})`);dotsOt.setAttribute("patternTransform",`scale(${k})`);hatchDe.setAttribute("patternTransform",`rotate(-45) scale(${k})`);}
function layerVis(o){for(const [L,v] of [[espLayer,o.es],[muLayer,o.mu||0],[catLayer,o.cat],[intLayer,o.int||0]]){L.toggleAttribute("hidden",v<=0);L.setAttribute("opacity",v.toFixed(3));}}
function setLevel(l,animate=true,vb=null){
  if(!VB[l])l="eu";level=l;if(l==="cat"&&(colorBy==="fc"||colorBy==="est"||colorBy==="pri"))colorBy="loss";hovered=null;hideTip();rankAll=false;
  g.classList.toggle("dim",l!=="eu");dots.classList.toggle("dim",l!=="eu");
  const from=curVB.slice(),to=vb||VB[l],start={es:+espLayer.getAttribute("opacity"),mu:+muLayer.getAttribute("opacity"),cat:+catLayer.getAttribute("opacity"),int:+intLayer.getAttribute("opacity")},end={es:l==="es"?1:0,mu:l==="mu"?1:0,cat:l==="cat"?1:0,int:l==="int"?1:0};
  cancelAnimationFrame(anim);const t0=performance.now(),DUR=(animate&&!reduce())?750:0;
  espLayer.removeAttribute("hidden");muLayer.removeAttribute("hidden");catLayer.removeAttribute("hidden");intLayer.removeAttribute("hidden");
  const step=now=>{const k=DUR?Math.min(1,(now-t0)/DUR):1,e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
    setVB(from.map((v,i)=>v+(to[i]-v)*e));
    const fade=x=>Math.min(1,Math.max(0,x));
    const mix=c=>start[c]+(end[c]-start[c])*fade(end[c]?(k-.5)/.5:k/.4);
    layerVis({es:mix("es"),mu:mix("mu"),cat:mix("cat"),int:mix("int")});
    sizeLabels();if(k<1)anim=requestAnimationFrame(step);};
  anim=requestAnimationFrame(step);
  svg.setAttribute("aria-label",l==="eu"?"Mapa de Europa por pérdidas de agua":l==="es"?"Mapa de España por comunidades autónomas":l==="mu"?"Mapa de España por municipios":l==="int"?"Mapa de Italia por regiones y capitales de provincia":"Mapa de Catalunya por municipios");
  syncHash();
  store.set("lv",l);paint();
}
window.addEventListener("resize",sizeLabels);

// ================= zoom de la vista por municipio =================
const MIN_W=MUN.vb[2]/60;let drag=null,suppressClick=false;const pts=new Map();
function clampVB(v){const [x0,y0,w0,h0]=MUN.vb;let [x,y,w,h]=v;if(w>w0){const k=w0/w;w=w0;h*=k;x+=(v[2]-w)/2;y+=(v[3]-h)/2;}if(w<MIN_W){const k=MIN_W/w;w=MIN_W;h*=k;x-=(w-v[2])/2;y-=(h-v[3])/2;}
  x=Math.min(Math.max(x,x0-w/2),x0+w0-w/2);y=Math.min(Math.max(y,y0-h/2),y0+h0-h/2);return [x,y,w,h];}
function animVB(to,ms=250){cancelAnimationFrame(anim);to=clampVB(to);const from=curVB.slice(),t0=performance.now(),DUR=reduce()?0:ms;
  const step=now=>{const k=DUR?Math.min(1,(now-t0)/DUR):1,e=1-Math.pow(1-k,3);setVB(from.map((v,i)=>v+(to[i]-v)*e));if(k<1)anim=requestAnimationFrame(step);};anim=requestAnimationFrame(step);}
const svgPt=(cx,cy)=>{const m=svg.getScreenCTM();return m?new DOMPoint(cx,cy).matrixTransform(m.inverse()):new DOMPoint(0,0);};
function zoomAt(p,k,animate=false){const w=curVB[2]/k,h=curVB[3]/k;const v=clampVB([p.x-(p.x-curVB[0])/k,p.y-(p.y-curVB[1])/k,w,h]);if(animate)animVB(v);else{cancelAnimationFrame(anim);setVB(v);}}
function vbFor(code){const bs=(code==="CM"?["18","19"]:[code]).map(c=>MUN.cb[c]).filter(Boolean);if(!bs.length)return MUN.vb.slice();
  let x0=Math.min(...bs.map(b=>b[0])),y0=Math.min(...bs.map(b=>b[1])),x1=Math.max(...bs.map(b=>b[0]+b[2])),y1=Math.max(...bs.map(b=>b[1]+b[3]));
  const p=Math.max(x1-x0,y1-y0)*.06;return [x0-p,y0-p,x1-x0+2*p,y1-y0+2*p];}
function goMu(code){const v=code?vbFor(code):MUN.vb.slice();$("#ccgo").value=code&&code!=="CM"?code:"";if(level!=="mu")setLevel("mu",true,v);else animVB(v,500);}
svg.addEventListener("wheel",e=>{if(level!=="mu")return;e.preventDefault();zoomAt(svgPt(e.clientX,e.clientY),Math.exp(-Math.max(-300,Math.min(300,e.deltaY*(e.deltaMode===1?33:1)))*.002));hideTip();},{passive:false});
svg.addEventListener("pointerdown",e=>{if(level!=="mu"||(e.pointerType==="mouse"&&e.button!==0))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size===1)drag={x:e.clientX,y:e.clientY,moved:false,id:e.pointerId};});
svg.addEventListener("pointermove",e=>{if(level!=="mu"||!pts.has(e.pointerId))return;const prev=pts.get(e.pointerId);
  if(pts.size===2){const [a,b]=[...pts.values()];const other=a===prev?b:a;const d0=Math.hypot(prev.x-other.x,prev.y-other.y),d1=Math.hypot(e.clientX-other.x,e.clientY-other.y);
    pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(d0>0&&d1>0){zoomAt(svgPt((e.clientX+other.x)/2,(e.clientY+other.y)/2),d1/d0);if(drag)drag.moved=true;}hideTip();return;}
  pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(!drag)return;
  if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<5)return;
  if(!drag.moved){drag.moved=true;svg.classList.add("dragging");try{svg.setPointerCapture(e.pointerId)}catch(_){}}
  const a=svgPt(prev.x,prev.y),b=svgPt(e.clientX,e.clientY);cancelAnimationFrame(anim);setVB(clampVB([curVB[0]-(b.x-a.x),curVB[1]-(b.y-a.y),curVB[2],curVB[3]]));hideTip();});
const endPtr=e=>{if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);if(drag&&drag.moved&&pts.size===0){suppressClick=true;setTimeout(()=>{suppressClick=false},0);}
  if(pts.size===0){drag=null;svg.classList.remove("dragging");}};
svg.addEventListener("pointerup",endPtr);svg.addEventListener("pointercancel",endPtr);
document.querySelectorAll("#zoomCtl button").forEach(b=>b.addEventListener("click",()=>{const c=new DOMPoint(curVB[0]+curVB[2]/2,curVB[1]+curVB[3]/2);
  if(b.dataset.z==="in")zoomAt(c,2,true);else if(b.dataset.z==="out")zoomAt(c,.5,true);else{$("#ccgo").value="";animVB(MUN.vb.slice(),400);}}));
{const sel=$("#ccgo");sel.innerHTML=`<option value="">España completa</option>`+Object.keys(MUN.cb).sort((a,b)=>ccName(a).localeCompare(ccName(b),"es")).map(c=>`<option value="${c}">${esc(ccName(c))}</option>`).join("");
  sel.addEventListener("change",()=>goMu(sel.value));}
{const sel=$("#rankCc");const cs=[...new Set(UM_IDS.map(umCC))].sort((a,b)=>ccName(a).localeCompare(ccName(b),"es"));
  sel.innerHTML=`<option value="">Todas</option>`+cs.map(c=>`<option value="${c}">${esc(ccName(c))}</option>`).join("");
  sel.addEventListener("change",()=>{rankCc=sel.value;rankAll=false;renderRank();marks();});}
// Provincias de la comunidad elegida (o todas)
function fillPv(){const sel=$("#rankPv");const ps=Object.keys(PROV).filter(p=>!rankCc||PROV[p][1]===rankCc&&UM_IDS.some(id=>id.startsWith(p))).sort((a,b)=>PROV[a][0].localeCompare(PROV[b][0],"es"));
  if(!ps.includes(rankPv))rankPv="";sel.innerHTML=`<option value="">Todas</option>`+ps.map(p=>`<option value="${p}"${p===rankPv?" selected":""}>${esc(PROV[p][0])}</option>`).join("");}
fillPv();$("#rankPv").addEventListener("change",e=>{rankPv=e.target.value;rankAll=false;paintMun();renderRank();marks();});
$("#rankCc").addEventListener("change",()=>{fillPv();paintMun();});
{const sel=$("#rankQ");sel.innerHTML=`<option value="">Todas</option>`+Object.entries(QUAL).map(([k,t])=>`<option value="${k}">${esc(t)}</option>`).join("");
  sel.addEventListener("change",()=>{rankQ=sel.value;rankAll=false;paintMun();renderRank();marks();});}
// Búsqueda por nombre: filtra el ranking y el mapa; si queda un solo municipio, se fija
{let t=null;$("#muq").addEventListener("input",e=>{clearTimeout(t);t=setTimeout(()=>{const v=e.target.value.trim();muQ=v.length>=2?opNorm(v):"";rankAll=false;paintMun();renderRank();marks();
  const F=umFilt();if(muQ&&F&&F.size===1)pin([...F][0]);},200);});}
{const sel=$("#rankGm");sel.innerHTML=`<option value="">Todos</option>`+GORD.map(k=>`<option value="${k}">${GCAT[k][0]}</option>`).join("");
  sel.addEventListener("change",()=>{rankGm=sel.value;rankAll=false;renderRank();marks();});}
// Autocompletado: los operadores con más municipios primero (OPN ya viene ordenado así)
$("#opl").innerHTML=OPN.slice(0,400).map(n=>`<option value="${esc(n)}"></option>`).join("");
{let t=null;$("#opq").addEventListener("input",e=>{clearTimeout(t);t=setTimeout(()=>setOp(e.target.value),200);});}
$("#csvBtn").addEventListener("click",()=>exportCsv());

// ================= enlaces para compartir (FWG-1871, E.1) =================
// #<vista>[/<clave>][/<capa>]: la vista, el elemento fijado por el usuario y la capa activa (p. ej. #municipios/46250/perdidas),
// para que un enlace pegado en un correo abra la misma ficha. Sin selección del usuario, solo la vista, como antes.
const VIEW_SLUG={eu:"europa",es:"espana",mu:"municipios",cat:"catalunya",int:"internacional"},SLUG_VIEW=Object.fromEntries(Object.entries(VIEW_SLUG).map(([k,v])=>[v,k]));
const LAYER_SLUG={loss:"perdidas",ges:"gestion",fc:"fibrocemento",est:"estado",pri:"prioridad"},SLUG_LAYER=Object.fromEntries(Object.entries(LAYER_SLUG).map(([k,v])=>[v,k]));
const chosen={};
const layerOk=(l,g)=>l==="mu"||(l==="cat"&&(g==="loss"||g==="ges"));
const keyOk=(l,k)=>l==="mu"?!!MUD[k]:l==="cat"?!!MU[k]:l==="es"?!!CC.r[k]:l==="eu"?!!D[k]:l==="int"?!!(k[0]==="r"?INT.reg[k.slice(1)]:k[0]==="c"&&INT.cap[k.slice(1)]):false;
function hashFor(){const k=chosen[level]&&pinned[level];const p=[VIEW_SLUG[level]];if(k)p.push(encodeURIComponent(k));
  if(layerOk(level,colorBy)&&(k||colorBy!=="loss"))p.push(LAYER_SLUG[colorBy]);
  return level==="eu"&&p.length===1?location.pathname+location.search:"#"+p.join("/");}
function syncHash(){try{history.replaceState(null,"",hashFor())}catch(e){}}
// Lee el hash; lo que no se reconoce se ignora y se abre la vista de Europa, como antes
function parseHash(h){const seg=h.replace(/^#/,"").split("/").map(x=>{try{return decodeURIComponent(x)}catch(e){return ""}});
  const l=SLUG_VIEW[seg[0]]||"eu";let key=null,layer=null;
  for(const x of seg.slice(1)){if(SLUG_LAYER[x]&&layerOk(l,SLUG_LAYER[x]))layer=SLUG_LAYER[x];else if(x&&keyOk(l,x))key=x;}
  return {l,key,layer};}
// Encuadre de un municipio: su forma (en el grupo escalado a 1/100) o su punto, con margen para ver el entorno
function muBox(id){const e=umEls[id];if(!e)return null;const b=e.getBBox(),k=e.tagName==="path"?.01:1;
  const w=Math.max(b.width*k,b.height*k,MUN.vb[2]/40)*4,cx=(b.x+b.width/2)*k,cy=(b.y+b.height/2)*k,h=w*MUN.vb[3]/MUN.vb[2];
  return [cx-w/2,cy-h/2,w,h];}
function focusMu(id,animate=true){const v=muBox(id);if(!v)return;if(level!=="mu"){setLevel("mu",animate,clampVB(v));}else if(animate)animVB(v,500);else{cancelAnimationFrame(anim);setVB(clampVB(v));}}
function openKey(k,animate=true){if(level==="mu")focusMu(k,animate);pin(k);}

// ================= buscador de municipios sobre el mapa (FWG-1871, E.2) =================
// Por nombre sin acentos o por código INE; al elegir, el mapa se acerca y la ficha queda fijada
const UM_NORM=Object.fromEntries(UM_IDS.map(id=>[id,opNorm(MUD[id][0])]));
function muFind(q){const n=opNorm(q);if(!n)return [];
  const byCode=/^\d{2,5}$/.test(q.trim())?UM_IDS.filter(id=>id.startsWith(q.trim())):[];
  const byName=UM_IDS.filter(id=>(" "+UM_NORM[id]).includes(" "+n)||UM_NORM[id].includes(n));
  const rank=id=>(UM_NORM[id]===n?0:UM_NORM[id].startsWith(n)?1:2);
  return [...new Set([...byCode,...byName])].sort((a,b)=>rank(a)-rank(b)||MUD[b][1]-MUD[a][1]).slice(0,8);}
{const inp=$("#mapq"),list=$("#mapqList");let hits=[],act=-1;
  const close=()=>{list.hidden=true;inp.setAttribute("aria-expanded","false");inp.removeAttribute("aria-activedescendant");act=-1;};
  const show=()=>{list.innerHTML=hits.length?hits.map((id,i)=>`<li role="option" id="mapq${i}" data-id="${id}" aria-selected="${i===act}">${esc(MUD[id][0])}<small>${esc(PROV[id.slice(0,2)][0])} · INE ${id}</small></li>`).join(""):`<li class="none" role="option" aria-disabled="true">Sin resultados</li>`;
    list.hidden=false;inp.setAttribute("aria-expanded","true");if(act>=0)inp.setAttribute("aria-activedescendant","mapq"+act);else inp.removeAttribute("aria-activedescendant");};
  const choose=id=>{inp.value=MUD[id][0];close();openKey(id);};
  inp.addEventListener("input",()=>{const q=inp.value.trim();hits=q.length>=2||/^\d+$/.test(q)?muFind(q):[];act=hits.length?0:-1;if(q.length>=2||/^\d+$/.test(q))show();else close();});
  inp.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){if(!hits.length)return;e.preventDefault();act=(act+(e.key==="ArrowDown"?1:hits.length-1))%hits.length;show();}
    else if(e.key==="Enter"){if(act>=0&&hits[act]){e.preventDefault();choose(hits[act]);}}else if(e.key==="Escape")close();});
  list.addEventListener("pointerdown",e=>{const li=e.target.closest("[data-id]");if(li){e.preventDefault();choose(li.dataset.id);}});
  inp.addEventListener("blur",()=>setTimeout(close,100));}

// ================= ficha imprimible (FWG-1871, E.3) =================
// Imprime solo la ficha fijada, con la cabecera de Kimedes, el enlace a la misma ficha y todas sus fuentes numeradas
function printCard(){const h=$("#printHead");const d=new Date();
  h.innerHTML=`<div class="eyebrow">Kimedes · Visor de pérdidas de agua</div><div class="pmeta">Ficha impresa el ${d.toLocaleDateString("es-ES")} · ${esc(location.href)}</div>`;
  document.documentElement.classList.add("printing");window.print();}
window.addEventListener("afterprint",()=>document.documentElement.classList.remove("printing"));
document.addEventListener("click",e=>{if(e.target.closest("[data-print]"))printCard();});

// ================= eventos =================
const keyOf=t=>{if(level==="int"){const e=t.closest("[data-it]");return e?e.dataset.it:null;}if(level==="mu"){const e=t.closest("[data-u]");return e?e.dataset.u:null;}if(level==="eu"){const e=t.closest("[data-c]");return e?e.dataset.c:null;}if(level==="es"){const e=t.closest("[data-r]");return e?ccCode(e.dataset.r):null;}const e=t.closest("[data-m]");return e?e.dataset.m:null;};
function setHover(k){if(hovered===k)return;hovered=k;marks();renderPanel();}
function pin(k){pinned[level]=k;chosen[level]=true;hovered=null;marks();renderPanel();syncHash();
  if(window.matchMedia("(max-width:900px)").matches)$("#panel").scrollIntoView({behavior:reduce()?"auto":"smooth",block:"start"});}
svg.addEventListener("pointermove",e=>{if(e.pointerType==="touch"||(drag&&drag.moved))return;const k=keyOf(e.target);const [x,y]=rel(e);
  if(!k){const s=level==="mu"&&e.target.closest("[data-sh]");if(s)showTip(`<b>${esc(MUN.shn[s.dataset.sh]||"")}</b><span>Territorio compartido entre municipios</span>`,x,y);else hideTip();setHover(null);return;}showTip(tipFor(k),x,y);setHover(k);});
svg.addEventListener("pointerleave",e=>{if(e.pointerType==="touch")return;hideTip();setHover(null);});
svg.addEventListener("click",e=>{if(suppressClick)return;const k=keyOf(e.target);const [x,y]=rel(e);
  if(!k){hideTip();return;}
  pin(k);if(e.pointerType==="touch"||e.pointerType==="pen")showTip(tipFor(k),x,y);});
svg.addEventListener("dblclick",e=>{if(level==="mu"){e.preventDefault();zoomAt(svgPt(e.clientX,e.clientY),2,true);return;}const k=keyOf(e.target);if(level==="eu"&&k==="ES")setLevel("es");else if(level==="es"&&k==="09")setLevel("cat");});
svg.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const k=keyOf(e.target);if(k){e.preventDefault();pin(k);}});
svg.addEventListener("focusin",e=>{const k=keyOf(e.target);if(!k)return;const r=e.target.getBoundingClientRect(),b=box.getBoundingClientRect();showTip(tipFor(k),r.left+r.width/2-b.left,r.top-b.top);setHover(k);});
svg.addEventListener("focusout",()=>{hideTip();setHover(null);});
$("#rank").addEventListener("click",e=>{const b=e.target.closest("[data-k]");if(b)pin(b.dataset.k);});
$("#rank").addEventListener("pointerover",e=>{const b=e.target.closest("[data-k]");if(b&&e.pointerType!=="touch")setHover(b.dataset.k);});
$("#rank").addEventListener("pointerleave",()=>setHover(null));
$("#onlyData").addEventListener("change",()=>{rankAll=false;renderRank();marks();});
$("#moreBtn").addEventListener("click",()=>{rankAll=!rankAll;renderRank();marks();});
document.addEventListener("click",e=>{const b=e.target.closest("[data-go],.lvl button,.crumbs button");if(!b)return;const l=b.dataset.go||b.dataset.l;if(l==="mu"&&b.dataset.cc)goMu(b.dataset.cc);else if(l&&l!==level)setLevel(l);});
document.querySelectorAll("#segEU button").forEach(b=>b.addEventListener("click",()=>{metric=b.dataset.m;store.set("m",metric);paint();}));
document.querySelectorAll("#segMG button").forEach(b=>b.addEventListener("click",()=>{colorBy=b.dataset.g;paint();syncHash();}));
document.querySelectorAll("#segES button").forEach(b=>b.addEventListener("click",()=>{esMetric=b.dataset.m;store.set("em",esMetric);paint();}));
const ysel=$("#year");ysel.innerHTML=YRS.map((y,i)=>`<option value="${i}" ${i===yi?"selected":""}>${y}</option>`).join("");
ysel.addEventListener("change",()=>{yi=+ysel.value;paint();});
window.addEventListener("hashchange",()=>{const o=parseHash(location.hash);if(o.layer)colorBy=o.layer;if(o.l!==level)setLevel(o.l);else paint();if(o.key)openKey(o.key);});

// ================= inicio =================
{const s=store.get("m");if(s&&M[s])metric=s;const t=store.get("em");if(t&&ESM[t])esMetric=t;}
const h0=parseHash(location.hash),l0=h0.l;if(h0.layer)colorBy=h0.layer;
setVB(VB[l0]||FULL);layerVis({es:l0==="es"?1:0,mu:l0==="mu"?1:0,cat:l0==="cat"?1:0,int:l0==="int"?1:0});setLevel(l0,false);
if(h0.key)openKey(h0.key,false);
