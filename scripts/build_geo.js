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
