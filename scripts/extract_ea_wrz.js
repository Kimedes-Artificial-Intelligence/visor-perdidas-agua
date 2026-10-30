// Inglaterra (FWG-1871, Parte D): zonas de recursos hídricos de las compañías de agua, Environment Agency (Water Resource Zones, OGL v3)
// https://www.data.gov.uk/dataset/cdb93480-1d1a-4050-b3a8-12fcc9cb6a23/water-resource-zones168 (Water_Resource_Zones.geojson.zip). Coordenadas en British National Grid (EPSG:27700).
// Agrupa las zonas por compañía (wccode), simplifica cada anillo (Douglas-Peucker en metros), pasa a lon/lat WGS84
// (transversa de Mercator inversa sobre el elipsoide Airy 1830 y transformación de Helmert OSGB36 -> WGS84)
// y escribe raw/inglaterra_ea_wrz_2025.json. El ZIP (31 MB descomprimido) no se guarda: se pasa el GeoJSON y se anota el SHA-256 del ZIP.
// Uso: node scripts/extract_ea_wrz.js <Water_Resource_Zones.geojson> <SHA-256 del zip> [tolerancia_m=800]
const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..');const OUT='raw/inglaterra_ea_wrz_2025.json';
const {simplify}=require('./extract_istat_geo.js');

// ---- British National Grid (OSGB36, Airy 1830) -> lat/lon OSGB36, fórmulas del Ordnance Survey («A guide to coordinate systems in Great Britain»)
function bngToOsgb([E,N]){
  const a=6377563.396,b=6356256.909,F0=0.9996012717,lat0=49*Math.PI/180,lon0=-2*Math.PI/180,N0=-100000,E0=400000;
  const e2=1-(b*b)/(a*a),n=(a-b)/(a+b);
  const M=lat=>b*F0*((1+n+5/4*n*n+5/4*n**3)*(lat-lat0)-(3*n+3*n*n+21/8*n**3)*Math.sin(lat-lat0)*Math.cos(lat+lat0)
    +(15/8*n*n+15/8*n**3)*Math.sin(2*(lat-lat0))*Math.cos(2*(lat+lat0))-35/24*n**3*Math.sin(3*(lat-lat0))*Math.cos(3*(lat+lat0)));
  let lat=lat0,m=0;do{lat=(N-N0-m)/(a*F0)+lat;m=M(lat);}while(Math.abs(N-N0-m)>=1e-5);
  const s=Math.sin(lat),c=Math.cos(lat),t=Math.tan(lat),nu=a*F0/Math.sqrt(1-e2*s*s),rho=a*F0*(1-e2)/(1-e2*s*s)**1.5,eta2=nu/rho-1,dE=E-E0;
  const VII=t/(2*rho*nu),VIII=t/(24*rho*nu**3)*(5+3*t*t+eta2-9*t*t*eta2),IX=t/(720*rho*nu**5)*(61+90*t*t+45*t**4);
  const X=1/(c*nu),XI=1/(c*6*nu**3)*(nu/rho+2*t*t),XII=1/(c*120*nu**5)*(5+28*t*t+24*t**4),XIIA=1/(c*5040*nu**7)*(61+662*t*t+1320*t**4+720*t**6);
  return [lon0+X*dE-XI*dE**3+XII*dE**5-XIIA*dE**7,lat-VII*dE*dE+VIII*dE**4-IX*dE**6];
}
// ---- OSGB36 -> WGS84: cartesianas, Helmert de 7 parámetros del Ordnance Survey, y vuelta a geográficas
function osgbToWgs([lon,lat]){
  const toXYZ=(lon,lat,a,b)=>{const e2=1-b*b/(a*a),nu=a/Math.sqrt(1-e2*Math.sin(lat)**2);return [nu*Math.cos(lat)*Math.cos(lon),nu*Math.cos(lat)*Math.sin(lon),(1-e2)*nu*Math.sin(lat)];};
  const [x,y,z]=toXYZ(lon,lat,6377563.396,6356256.909);
  const tx=446.448,ty=-125.157,tz=542.06,s=-20.4894e-6,r=[0.1502,0.247,0.8421].map(v=>v/3600*Math.PI/180);
  const X=tx+(1+s)*x-r[2]*y+r[1]*z,Y=ty+r[2]*x+(1+s)*y-r[0]*z,Z=tz-r[1]*x+r[0]*y+(1+s)*z;
  const a=6378137,b=6356752.3142,e2=1-b*b/(a*a),p=Math.hypot(X,Y);let la=Math.atan2(Z,p*(1-e2)),prev;
  do{prev=la;const nu=a/Math.sqrt(1-e2*Math.sin(la)**2);la=Math.atan2(Z+e2*nu*Math.sin(la),p);}while(Math.abs(la-prev)>1e-12);
  return [Math.atan2(Y,X)*180/Math.PI,la*180/Math.PI];
}
const bngToWgs=p=>osgbToWgs(bngToOsgb(p));
const area=r=>r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0)/2;
const r5=([x,y])=>[Math.round(x*1e4)/1e4,Math.round(y*1e4)/1e4];

function extract(gj,tol=800){
  const cia={};
  for(const f of gj.features){const p=f.properties,g=f.geometry;if(!g)continue;
    const polys=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[];
    const o=cia[p.wccode]??={n:p.company,tipo:p.company_ty,zonas:0,rings:[]};o.zonas++;
    for(const poly of polys)for(const ring of poly){const r=simplify(ring.map(q=>[q[0],q[1]]),tol);
      if(r.length>=4&&Math.abs(area(r))>4e6)o.rings.push(r.map(q=>r5(bngToWgs(q))));}}
  return cia;
}
module.exports={bngToOsgb,osgbToWgs,bngToWgs,extract};
if(require.main===module){
  const [file,sha,tol]=process.argv.slice(2);if(!file||!/^[0-9a-f]{64}$/.test(sha||''))throw new Error('Uso: node scripts/extract_ea_wrz.js <Water_Resource_Zones.geojson> <SHA-256 del zip> [tolerancia_m]');
  const cia=extract(JSON.parse(fs.readFileSync(file,'utf8')),+(tol||800));
  fs.writeFileSync(path.join(ROOT,OUT),JSON.stringify({meta:{src:'Environment Agency, Water Resource Zones (zonas de recursos hídricos de las compañías de agua de Inglaterra y Gales)',
    url:'https://www.data.gov.uk/dataset/cdb93480-1d1a-4050-b3a8-12fcc9cb6a23/water-resource-zones168',sha256:sha,licencia:'Open Government Licence v3.0. Contains Environment Agency information © Environment Agency and/or database rights. Some information used in this dataset is © water companies. © Crown copyright and database rights AC0000807064',tolerancia_m:+(tol||800)},cia}));
  console.log(OUT,Object.keys(cia).length,'compañías,',Object.values(cia).reduce((a,o)=>a+o.rings.reduce((b,r)=>b+r.length,0),0),'puntos');
}
