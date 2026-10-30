// ================= Índice Kimedes de prioridad comercial (FWG-1870, Parte 6) =================
// Calculado a partir de fuentes citadas; no es un dato publicado. Pesos en data/prioridad_pesos.json (constante PRI_W).
//   P población: percentil de la población del municipio (INE 2025) entre todos los municipios, de 0 a 1
//   L pérdidas: min(pérdidas / tope, 1); sin dato publicado, el valor "sin_dato" (la ausencia de dato también puntúa)
//   F fibrocemento: base + pendiente × % de la red en fibrocemento / 100; sin dato EIEL, "sin_dato"
//   A antigüedad de la fase EIEL: base + pendiente × min((año de referencia − fase) / años tope, 1); sin EIEL, "sin_dato"
//   G modelo de gestión: peso de cada modelo (V privado, M mixto, P municipalizado, C vecinal, O otros, N sin dato)
// Índice = P × L × F × A × G. En el mapa, quintiles del índice entre todos los municipios.
function priFactors(x,w){
  const L=x.loss==null?w.perdidas.sin_dato:Math.min(x.loss/w.perdidas.tope_pct,1);
  const F=x.fc==null?w.fibrocemento.sin_dato:w.fibrocemento.base+w.fibrocemento.pendiente*x.fc/100;
  const A=x.fase==null?w.antiguedad.sin_dato:w.antiguedad.base+w.antiguedad.pendiente*Math.min(Math.max(w.anio_referencia-x.fase,0)/w.antiguedad.anios_tope,1);
  const G=w.modelo[x.gm||"N"]??w.modelo.N;
  return {P:x.P,L,F,A,G,idx:x.P*L*F*A*G};
}
// Percentil de cada población (0 = la menor, 1 = la mayor); los empates reciben el mismo valor
function percentiles(pops){const s=[...pops].sort((a,b)=>a-b),n=s.length,first=new Map();
  s.forEach((v,i)=>{if(!first.has(v))first.set(v,i);});return pops.map(v=>n>1?first.get(v)/(n-1):1);}
// Límites de los quintiles (4 cortes) y quintil de un valor: 1 el más bajo, 5 el más alto
function quintileCuts(vals){const s=[...vals].sort((a,b)=>a-b);return [1,2,3,4].map(k=>s[Math.floor(k*s.length/5)]);}
const quintileOf=(v,cuts)=>1+cuts.filter(c=>v>=c).length;
if(typeof module!=="undefined")module.exports={priFactors,percentiles,quintileCuts,quintileOf};
