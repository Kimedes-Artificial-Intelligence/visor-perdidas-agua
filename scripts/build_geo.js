const fs=require('fs');const d3=require('d3-geo');const tc=require('topojson-client');const ts=require('topojson-simplify');
const pr=require('../src/geometry/proj.json');const P=d3.geoAzimuthalEqualArea().rotate(pr.rotate).scale(pr.scale).translate(pr.translate);
const R=(p,dig)=>d3.geoPath(p).digits(dig);
// ---- CCAA
let topo=JSON.parse(fs.readFileSync(require.resolve('es-atlas/es/autonomous_regions.json')));
topo=ts.presimplify(topo);const minW=ts.quantile(topo,0.30);topo=ts.simplify(topo,minW);
const fc=tc.feature(topo,topo.objects.autonomous_regions);
const out={ccaa:{},cent:{},names:{}};
const pen=fc.features.filter(f=>!['05','20'].includes(f.id));
const path2=R(P,2);
for(const f of pen){out.ccaa[f.id]=path2(f);out.cent[f.id]=path2.centroid(f).map(v=>+v.toFixed(2));out.names[f.id]=f.properties.name;}
// window: peninsula + Baleares bounds
const b=path2.bounds({type:'FeatureCollection',features:pen.filter(f=>!['18','19'].includes(f.id))});
const pad=4;let vb=[b[0][0]-pad,b[0][1]-pad,b[1][0]-b[0][0]+2*pad,b[1][1]-b[0][1]+2*pad];
// Canarias inset bottom-left
const can=fc.features.find(f=>f.id==='05');const cb=d3.geoPath(P).bounds(can);
const cw=cb[1][0]-cb[0][0],ch=cb[1][1]-cb[0][1];const ix=vb[0]+vb[2]-cw-6,iy=vb[1]+vb[3]+2; // place below-left, extend vb
const P2=d3.geoAzimuthalEqualArea().rotate(pr.rotate).scale(pr.scale).translate([pr.translate[0]+(ix+1.5-cb[0][0]),pr.translate[1]+(iy+1.5-cb[0][1])]);
const pc=R(P2,2);out.ccaa['05']=pc(can);out.cent['05']=pc.centroid(can).map(v=>+v.toFixed(2));out.names['05']=can.properties.name;
const fr=[ix,iy,cw+3,ch+3];out.inset={frame:fr,label:'Canarias'};
vb=[vb[0],vb[1],vb[2],vb[3]+ch+6];out.vb=vb.map(v=>+v.toFixed(2));
// Ceuta y Melilla markers
const raw=JSON.parse(fs.readFileSync(require.resolve('es-atlas/es/autonomous_regions.json')));const rfc=tc.feature(raw,raw.objects.autonomous_regions);for(const id of ['18','19']){const f=rfc.features.find(x=>x.id===id);out.cent[id]=path2.centroid(f).map(v=>+v.toFixed(2));delete out.ccaa[id];}
// context: Portugal, France, Andorra, Morocco from world? use v1 GEO countries for PT/FR; ctx path from v1 first path (non-eurEau land)
fs.mkdirSync('data',{recursive:true});fs.writeFileSync('data/esp.json',JSON.stringify(out));
console.log('vb',out.vb,'size',JSON.stringify(out).length,'ids',Object.keys(out.ccaa).join(','));
// ---- 08215 from OSM
const ring=JSON.parse(fs.readFileSync('raw/osm_08215.json'));let poly={type:'Feature',geometry:{type:'Polygon',coordinates:[ring]}};
if(d3.geoArea(poly)>2*Math.PI){poly.geometry.coordinates=[ring.slice().reverse()];}
const d=R(P,2)(poly);fs.writeFileSync('data/m08215.txt',d);console.log('08215',d.length,R(P,2).bounds(poly));
// ---- España por municipio (8.131 municipios y 81 territorios compartidos 53xxx). Gibraltar (54006) no se dibuja.
// Coordenadas en centésimas de la proyección común, con órdenes relativas: la capa se dibuja con transform="scale(.01)".
// MUN_Q: cuantil de topojson-simplify. Se eligió el mayor detalle que deja la página holgada bajo el límite de 2,5 MB.
const MUN_Q=0.6;
// Codifica una geometría ya proyectada; los anillos se tratan por separado para que un anillo descartado no altere los demás
function encodeFeature(feature,proj){
  const rings=[];const ctx={cur:null,moveTo(x,y){this.cur=[[x,y]];},lineTo(x,y){this.cur.push([x,y]);},closePath(){rings.push(this.cur);this.cur=null;},point(){},beginPath(){}};
  d3.geoPath(proj,ctx)(feature);
  let s='',lx=null,ly=null;
  for(const r of rings){const q=[];for(const [x,y] of r){const X=Math.round(x*100),Y=Math.round(y*100);const l=q[q.length-1];if(!l||l[0]!==X||l[1]!==Y)q.push([X,Y]);}
    if(q.length>1&&q[0][0]===q[q.length-1][0]&&q[0][1]===q[q.length-1][1])q.pop();
    if(q.length<3)continue;
    const num=(dx,dy)=>dx+(dy<0?'':',')+dy;
    s+=lx==null?`M${q[0][0]},${q[0][1]}`:`m${num(q[0][0]-lx,q[0][1]-ly)}`;
    s+='l'+q.slice(1).map((p,i)=>{const t=num(p[0]-q[i][0],p[1]-q[i][1]);return (i&&p[0]-q[i][0]>=0?' ':'')+t;}).join('')+'z';
    lx=q[0][0];ly=q[0][1];}
  return s;
}
{
  const src=require('es-atlas/es/municipalities.json');
  let mt=ts.presimplify(JSON.parse(JSON.stringify(src)));mt=ts.simplify(mt,ts.quantile(mt,MUN_Q));
  // Polígonos con el sentido de giro invertido (en la fuente o tras simplificar): d3 los dibujaría como el resto del globo
  const rewind=f=>{const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[];
    for(const p of polys)if(d3.geoArea({type:'Polygon',coordinates:p})>2*Math.PI)for(const r of p)r.reverse();return f;};
  const full=tc.feature(src,src.objects.municipalities).features.map(rewind),simp=tc.feature(mt,mt.objects.municipalities).features.map(rewind);
  const isCan=id=>id.startsWith('35')||id.startsWith('38');
  const projOf=id=>isCan(id)?P2:P;
  const M={vb:out.vb,inset:out.inset,mu:{},dot:{},sh:{},cb:{}};
  const r2=v=>+v.toFixed(2);
  // Punto de un recinto sin área: media de sus vértices proyectados (el centroide de d3 no está definido)
  const dotAt=(f,proj)=>{const c=d3.geoPath(proj).centroid(f);if(c.every(Number.isFinite))return c.map(r2);
    const v=JSON.stringify(f.geometry.coordinates).match(/-?[\d.]+,-?[\d.]+/g).map(t=>proj(t.split(',').map(Number)));
    return [0,1].map(k=>r2(v.reduce((a,p)=>a+p[k],0)/v.length));};
  for(let i=0;i<simp.length;i++){const f=simp[i],id=f.id;if(id.startsWith('54'))continue;
    // Los recintos pequeños de un solo arco se pierden al simplificar: se dibujan sin simplificar y al final, encima de sus vecinos
    let d=id==='08215'?null:encodeFeature(f,projOf(id));if(!d&&id!=='08215'){d=encodeFeature(full[i],projOf(id));if(d)(M.top??=[]).push(id);}
    if(/^5[12]/.test(id)){M.dot[id]=d3.geoPath(P).centroid(full[i]).map(r2);continue;} // Ceuta y Melilla: punto, como en la vista por comunidades
    if(id.startsWith('53')){if(d){M.sh[id]=d;(M.shn??={})[id]=f.properties.name;}continue;}
    if(d)M.mu[id]=d;else if(id!=='08215')M.dot[id]=dotAt(full[i],projOf(id));}
  // 08215: la geometría de es-atlas tiene área nula; se usa la de OpenStreetMap (misma proyección)
  {const ring=JSON.parse(fs.readFileSync('raw/osm_08215.json'));let poly={type:'Feature',geometry:{type:'Polygon',coordinates:[ring]}};
    if(d3.geoArea(poly)>2*Math.PI)poly.geometry.coordinates=[ring.slice().reverse()];M.mu['08215']=encodeFeature(poly,P);}
  // Límites: provincias (trazo fino) y comunidades autónomas (trazo grueso), solo los interiores
  const meshD=(obj,skip)=>{const m=tc.mesh(mt,mt.objects[obj],(a,b)=>a!==b&&a.id!==skip&&b.id!==skip);
    return m.coordinates.map(line=>{const q=line.map(c=>P(c).map(v=>Math.round(v*100)));
      return `M${q[0][0]},${q[0][1]}l`+q.slice(1).map((p,i)=>{const dx=p[0]-q[i][0],dy=p[1]-q[i][1];return (i&&dx>=0?' ':'')+dx+(dy<0?'':',')+dy;}).join('');}).join('');};
  M.pr=meshD('provinces','54');M.cc=meshD('autonomous_regions','20');
  // Recuadro de cada comunidad, para el zoom (Ceuta y Melilla con un margen fijo)
  const reg=tc.feature(src,src.objects.autonomous_regions).features;
  for(const f of reg){if(f.id==='20')continue;const b=d3.geoPath(f.id==='05'?P2:P).bounds(f);let [x0,y0]=b[0],[x1,y1]=b[1];
    if(f.id==='18'||f.id==='19'){const [cx,cy]=d3.geoPath(P).centroid(f);x0=cx-4;x1=cx+4;y0=cy-3;y1=cy+3;}
    M.cb[f.id]=[x0,y0,x1-x0,y1-y0].map(r2);}
  const n=Object.keys(M.mu).length+Object.keys(M.dot).length;
  if(n!==8131)throw new Error('municipios dibujados: '+n+' de 8131');
  fs.writeFileSync('data/esmun.json',JSON.stringify(M));
  console.log('esmun',JSON.stringify(M).length,'bytes; trazados',Object.keys(M.mu).length,'puntos',Object.keys(M.dot).length,Object.keys(M.dot).join(','),'compartidos',Object.keys(M.sh).length);
}
