const fs=require('fs');const d3=require('d3-geo');const tc=require('topojson-client');
const C=JSON.parse(fs.readFileSync('src/geometry/cat.json'));const topo=require('es-atlas/es/municipalities.json');
const fc=tc.feature(topo,topo.objects.municipalities);const F={};for(const f of fc.features)if(/^(08|17|25|43)/.test(f.id))F[f.id]=f;
console.log('missing in v1:',Object.keys(F).filter(k=>!C.muni[k]),'extra in v1:',Object.keys(C.muni).filter(k=>!F[k]));
const bb=d=>{const n=d.match(/-?\d+\.?\d*/g).map(Number);let xs=[],ys=[];for(let i=0;i<n.length;i+=2){xs.push(n[i]);ys.push(n[i+1]);}return [(Math.min(...xs)+Math.max(...xs))/2,(Math.min(...ys)+Math.max(...ys))/2,Math.max(...xs)-Math.min(...xs)]};
const P=d3.geoAzimuthalEqualArea().rotate([-10,-52]).scale(1).translate([0,0]);const path=d3.geoPath(P);
const pts=[];for(const id in C.muni){if(!F[id])continue;const [x,y,w]=bb(C.muni[id]);if(w<0.5)continue;const b=path.bounds(F[id]);pts.push([(b[0][0]+b[1][0])/2,(b[0][1]+b[1][1])/2,x,y]);}
// least squares x'=a*u+bx, y'=a*v+by
let n=pts.length,Su=0,Sv=0,Sx=0,Sy=0,Suu=0,Svv=0,Sux=0,Svy=0;for(const [u,v,x,y] of pts){Su+=u;Sv+=v;Sx+=x;Sy+=y;Suu+=u*u;Svv+=v*v;Sux+=u*x;Svy+=v*y;}
const a=((Sux-Su*Sx/n)+(Svy-Sv*Sy/n))/((Suu-Su*Su/n)+(Svv-Sv*Sv/n));const bx=(Sx-a*Su)/n,by=(Sy-a*Sv)/n;
let err=0,mx=0;for(const [u,v,x,y] of pts){const e=Math.hypot(a*u+bx-x,a*v+by-y);err+=e;mx=Math.max(mx,e);}
console.log('n',n,'scale',a,'tx',bx,'ty',by,'meanerr',err/n,'max',mx);
fs.writeFileSync('src/geometry/proj.json',JSON.stringify({rotate:[-10,-52],scale:a,translate:[bx,by]}));
