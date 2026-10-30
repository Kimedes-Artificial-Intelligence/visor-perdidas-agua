// Italia (FWG-1870, Parte 7): geometría de ISTAT, «Confini delle unità amministrative a fini statistici al 1° gennaio 2026», versión generalizada
// https://www.istat.it/storage/cartografia/confini_amministrativi/generalizzati/2026/Limiti01012026_g.zip (CC BY 4.0, ISTAT)
// Lee los shapefile de regiones y comuni (UTM 32N, WGS84) sin dependencias, simplifica las regiones (Douglas-Peucker en metros)
// y escribe raw/italia_istat_geo_2026.json: regiones (anillos en lon/lat) y el centroide de cada comune capoluogo.
// El ZIP no se guarda en el repositorio (10 MB): se pasa su carpeta descomprimida y se anota su SHA-256.
// Uso: node scripts/extract_istat_geo.js <carpeta del zip descomprimido> <SHA-256 del zip> [tolerancia_m=800]
const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..');const OUT='raw/italia_istat_geo_2026.json';

// ---- DBF: registros como objetos, campos de texto recortados
function readDbf(buf){
  const n=buf.readUInt32LE(4),hl=buf.readUInt16LE(8),rl=buf.readUInt16LE(10);const fields=[];
  for(let p=32;buf[p]!==0x0d;p+=32)fields.push({name:buf.toString('latin1',p,p+11).replace(/\0.*$/,''),len:buf[p+16]});
  const rows=[];
  for(let i=0;i<n;i++){let p=hl+i*rl+1;const o={};
    for(const f of fields){o[f.name]=buf.toString('utf8',p,p+f.len).trim();p+=f.len;}rows.push(o);}
  return rows;
}
// ---- SHP: polígonos (tipo 5) como lista de anillos en metros
function readShp(buf){
  const recs=[];let p=100;
  while(p<buf.length){const len=buf.readInt32BE(p+4)*2;const c=p+8;const type=buf.readInt32LE(c);
    if(type===5){const np=buf.readInt32LE(c+36),nv=buf.readInt32LE(c+40);const parts=[];
      for(let i=0;i<np;i++)parts.push(buf.readInt32LE(c+44+4*i));parts.push(nv);const pts=c+44+4*np;const rings=[];
      for(let i=0;i<np;i++){const r=[];for(let k=parts[i];k<parts[i+1];k++)r.push([buf.readDoubleLE(pts+16*k),buf.readDoubleLE(pts+16*k+8)]);rings.push(r);}
      recs.push(rings);}else recs.push([]);
    p=c+len;}
  return recs;
}
// ---- UTM 32N (WGS84) -> lon/lat, fórmulas inversas de la proyección transversa de Mercator
function utmToLonLat([E,N]){
  const a=6378137,f=1/298.257223563,k0=0.9996,e2=f*(2-f),ep2=e2/(1-e2),lon0=9*Math.PI/180;
  const x=E-500000,M=N/k0,mu=M/(a*(1-e2/4-3*e2*e2/64-5*e2**3/256));const e1=(1-Math.sqrt(1-e2))/(1+Math.sqrt(1-e2));
  const p1=mu+(3*e1/2-27*e1**3/32)*Math.sin(2*mu)+(21*e1*e1/16-55*e1**4/32)*Math.sin(4*mu)+(151*e1**3/96)*Math.sin(6*mu)+(1097*e1**4/512)*Math.sin(8*mu);
  const C1=ep2*Math.cos(p1)**2,T1=Math.tan(p1)**2,N1=a/Math.sqrt(1-e2*Math.sin(p1)**2),R1=a*(1-e2)/(1-e2*Math.sin(p1)**2)**1.5,D=x/(N1*k0);
  const lat=p1-(N1*Math.tan(p1)/R1)*(D*D/2-(5+3*T1+10*C1-4*C1*C1-9*ep2)*D**4/24+(61+90*T1+298*C1+45*T1*T1-252*ep2-3*C1*C1)*D**6/720);
  const lon=lon0+(D-(1+2*T1+C1)*D**3/6+(5-2*C1+28*T1-3*C1*C1+8*ep2+24*T1*T1)*D**5/120)/Math.cos(p1);
  return [lon*180/Math.PI,lat*180/Math.PI];
}
// ---- Douglas-Peucker en metros; los anillos que quedan con menos de 4 puntos se descartan.
// Un anillo cerrado (primer punto = último) se parte por el punto más lejano al inicio y se simplifica cada mitad.
function simplify(r,tol){
  const [x0,y0]=r[0],[xn,yn]=r[r.length-1];
  if(r.length>=4&&x0===xn&&y0===yn){let far=1,fd=0;for(let i=1;i<r.length-1;i++){const d=Math.hypot(r[i][0]-x0,r[i][1]-y0);if(d>fd){fd=d;far=i;}}
    return [...simplifyOpen(r.slice(0,far+1),tol).slice(0,-1),...simplifyOpen(r.slice(far),tol)];}
  return simplifyOpen(r,tol);
}
function simplifyOpen(r,tol){
  if(r.length<4)return r;const keep=new Uint8Array(r.length);keep[0]=keep[r.length-1]=1;const st=[[0,r.length-1]];
  while(st.length){const [a,b]=st.pop();let md=0,mi=-1;const [x1,y1]=r[a],[x2,y2]=r[b],dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1;
    for(let i=a+1;i<b;i++){const d=Math.abs(dy*r[i][0]-dx*r[i][1]+x2*y1-y2*x1)/L;if(d>md){md=d;mi=i;}}
    if(md>tol){keep[mi]=1;st.push([a,mi],[mi,b]);}}
  return r.filter((_,i)=>keep[i]);
}
const area=r=>r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0)/2;
// Centroide del anillo exterior mayor (en metros), para colocar el punto del capoluogo
function centroid(rings){const r=rings.reduce((a,b)=>Math.abs(area(b))>Math.abs(area(a))?b:a);const A=area(r);let cx=0,cy=0;
  for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length],k=p[0]*q[1]-q[0]*p[1];cx+=(p[0]+q[0])*k;cy+=(p[1]+q[1])*k;}
  return [cx/(6*A),cy/(6*A)];}
const r5=([x,y])=>[Math.round(x*1e4)/1e4,Math.round(y*1e4)/1e4];

function extract(dir,tol=800){
  const f=(d,n)=>fs.readFileSync(path.join(dir,d,n));
  const regD=readDbf(f('Reg01012026_g','Reg01012026_g_WGS84.dbf')),regS=readShp(f('Reg01012026_g','Reg01012026_g_WGS84.shp'));
  const reg={};regD.forEach((d,i)=>{const rings=regS[i].map(r=>simplify(r,tol)).filter(r=>r.length>=4&&Math.abs(area(r))>4e6);
    reg[String(d.COD_REG).padStart(2,'0')]={n:d.DEN_REG,rings:rings.map(r=>r.map(p=>r5(utmToLonLat(p))))};});
  const comD=readDbf(f('Com01012026_g','Com01012026_g_WGS84.dbf')),comS=readShp(f('Com01012026_g','Com01012026_g_WGS84.shp'));
  const com={};comD.forEach((d,i)=>{if(!comS[i].length)return;com[d.PRO_COM_T]={n:d.COMUNE,a:d.COMUNE_A,cc:+d.CC_UTS,reg:String(d.COD_REG).padStart(2,'0'),c:r5(utmToLonLat(centroid(comS[i])))};});
  return {reg,com};
}
module.exports={readDbf,readShp,utmToLonLat,simplify,extract};
if(require.main===module){
  const [dir,sha,tol]=process.argv.slice(2);if(!dir||!/^[0-9a-f]{64}$/.test(sha||''))throw new Error('Uso: node scripts/extract_istat_geo.js <carpeta> <SHA-256 del zip> [tolerancia_m]');
  const {reg,com}=extract(dir,+(tol||800));
  // Solo se guardan los capoluoghi (CC_UTS = 1) y los comuni con nombre de capoluogo en la tabla de ISTAT
  const names=new Set(fs.readFileSync(path.join(ROOT,'raw/italia_istat_perdite_2022.psv'),'utf8').split('\n').filter(l=>l.startsWith('C|')).map(l=>l.split('|')[1].toLowerCase()));
  const keep=Object.fromEntries(Object.entries(com).filter(([,o])=>o.cc===1||names.has(o.n.toLowerCase())||names.has((o.a||'').toLowerCase())));
  fs.writeFileSync(path.join(ROOT,OUT),JSON.stringify({meta:{src:'ISTAT, Confini delle unità amministrative a fini statistici al 1° gennaio 2026, versione generalizzata (Limiti01012026_g.zip)',
    url:'https://www.istat.it/storage/cartografia/confini_amministrativi/generalizzati/2026/Limiti01012026_g.zip',sha256:sha,licencia:'CC BY 4.0 ISTAT',tolerancia_m:+(tol||800)},reg,com:keep}));
  console.log(OUT,Object.keys(reg).length,'regiones,',Object.values(reg).reduce((a,o)=>a+o.rings.reduce((b,r)=>b+r.length,0),0),'puntos;',Object.keys(keep).length,'comuni');
}
