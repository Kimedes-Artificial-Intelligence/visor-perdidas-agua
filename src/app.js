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
const pinned={eu:"ES",es:"09",cat:"08019"}; let hovered=null;
let rankAll=false;

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
function legend(){
  const L=$("#legend");
  if(level==="eu"){const m=M[metric];
    L.innerHTML=`<span class="t">${m.short} (${m.unit}) · EurEau 2026</span>`+binLabels(m.bins,m.fmt).map((l,i)=>`<span><i style="background:var(--c${i+1})"></i>${l}</span>`).join("")+`<span><i style="background:repeating-linear-gradient(45deg,var(--surface) 0 3px,var(--line) 3px 4px)"></i>sin dato</span>`;
    $("#hint").textContent="Gris rayado: miembro EurEau sin dato comparable. Blanco liso: fuera del alcance del informe. Clic en España para bajar a comunidades.";}
  else if(level==="es"){const m=ESM[esMetric];const f=v=>String(v);const dash=a=>a.map(x=>x.replace(/(\d)-(\d)/,'$1–$2'));
    L.innerHTML=`<span class="t">${m.short} (%) · INE ${YRS[yi]}</span>`+dash(binLabels(m.bins,f)).map((l,i)=>`<span><i style="background:var(--c${i+1})"></i>${l}</span>`).join("")+`<span><i style="background:repeating-linear-gradient(45deg,var(--surface) 0 3px,var(--line) 3px 4px)"></i>sin dato</span><span class="srcnote">% sobre el volumen suministrado a la red. Ceuta y Melilla, agregadas (dos ciudades, volumen reducido). Canarias, en recuadro.</span>`;
    $("#hint").textContent="Clic en una comunidad para fijarla. Desde Cataluña se baja a municipios.";}
  else{L.innerHTML=`<span class="t">Agua no registrada (%) · último dato</span>`+MU_BINS.map(b=>`<span><i style="background:${b[1]}"></i>${b[2]}</span>`).join("")+`<span><i style="background:var(--nodata)"></i>sin auditoría publicada</span><span class="srcnote">Dato 2024 de las auditorías publicadas por cada operador; si no hay, 2022 del anexo de la ACA. Cada valor lleva su año y fuente en el panel.</span>`;
    $("#hint").textContent="Todos los municipios responden al ratón y al clic. En gris: no consta auditoría publicada, no se estima nada.";}
}
function headerCtl(){
  document.querySelectorAll(".lvl button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.l===level));
  $("#segEU").hidden=level!=="eu";$("#segES").hidden=level!=="es";$("#yearsel").hidden=level!=="es";
  document.querySelectorAll("#segEU button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===metric));
  document.querySelectorAll("#segES button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===esMetric));
  const A=$("#avg");
  if(level==="eu"){const m=M[metric];A.innerHTML=`Media EUR* <b>${m.fmt(m.avg)} ${m.unit}</b> · UE-27 <b>${m.fmt(m.eu)} ${m.unit}</b>`;}
  else if(level==="es"){const v=ccVal("ES");A.innerHTML=`España ${YRS[yi]} <b>${pc(v)}</b> · INE`;}
  else{A.innerHTML=`Cataluña 2024 <b>${pc(CAT_INE24)}</b> ANR · INE`;}
  const C=$("#crumbs");const items=[["eu","Europa"],["es","España"],["cat","Catalunya"]];const upto=items.findIndex(x=>x[0]===level);
  C.innerHTML=items.slice(0,upto+1).map(([l,t],i)=>`${i?'<span class="sep">/</span>':''}<button data-l="${l}" ${l===level?'aria-current="page"':''}>${t}</button>`).join("");
  $("#maphead").textContent=level==="eu"?"ETRS89-LAEA · EurEau 2026":level==="es"?`Comunidades autónomas · INE ${YRS[yi]}`:"947 municipios · auditorías 2022-2024 (ACA y operadores)";
}
function paint(){paintEU();paintES();legend();headerCtl();renderRank();renderPanel();marks();}

function marks(){
  for(const c in els)for(const e of els[c]){e.classList.toggle("sel",level==="eu"&&c===pinned.eu);e.classList.toggle("hov",level==="eu"&&c===hovered&&c!==pinned.eu);}
  for(const c in rEls)for(const e of rEls[c]){e.classList.toggle("sel",level==="es"&&c===pinned.es);e.classList.toggle("hov",level==="es"&&c===hovered&&c!==pinned.es);}
  catLayer.querySelectorAll(".mu.act,.mu.hov").forEach(e=>e.classList.remove("act","hov"));
  if(level==="cat"){if(hovered&&muEls[hovered]&&hovered!==pinned.cat){muEls[hovered].classList.add("hov");muEls[hovered].parentNode.appendChild(muEls[hovered]);}
    if(pinned.cat&&muEls[pinned.cat]){muEls[pinned.cat].classList.add("act");muEls[pinned.cat].parentNode.appendChild(muEls[pinned.cat]);}}
  if(level==="eu"){if(hovered&&els[hovered])g.appendChild(els[hovered][0]);if(pinned.eu&&els[pinned.eu])g.appendChild(els[pinned.eu][0]);}
  if(level==="es"){for(const c of [hovered,pinned.es])if(c&&rEls[c])for(const e of rEls[c])e.parentNode.appendChild(e);}
  document.querySelectorAll("#rank button").forEach(b=>{b.classList.toggle("sel",b.dataset.k===pinned[level]);b.classList.toggle("hov",b.dataset.k===hovered);});
}

// ================= ranking =================
function rankRow(k,n,label,v,max,avg,col,fmt,extra=""){
  return `<button data-k="${k}"><span class="n">${n}</span><span class="nm">${esc(label)}</span>
  <span class="b">${v==null?"":`<span style="width:${(v/max*100).toFixed(1)}%;background:${col}"></span>`}${avg!=null?`<span class="avgline" style="left:${(avg/max*100).toFixed(1)}%"></span>`:""}</span>
  <span class="v ${v==null?"na":""}">${v==null?"sin dato":fmt(v)}${extra}</span></button>`;}
function renderRank(){
  const R=$("#rank");R.classList.toggle("mun",level==="cat");$("#rankCtl").hidden=level!=="cat";$("#rankMore").hidden=true;
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
  if(!k){P.innerHTML=`<p class="empty">${level==="cat"?"Selecciona un municipio en el mapa o en el ranking.":"Selecciona un elemento en el mapa o en el ranking."}</p>`;return;}
  const chip=`<span class="chip ${k===pinned[level]?"pin":""}">${k===pinned[level]?"Fijado":"Vista previa"}</span>`;
  if(level==="eu")return panelEU(P,k,chip);if(level==="es")return panelES(P,k,chip);return panelMU(P,k,chip);}
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
  ${c==="09"?`<div><button class="cta" data-go="cat">Ver municipios de Catalunya</button></div>`:""}
  <div><h3>Volúmenes ${y} (hm³)</h3><dl>${row("Suministrado a la red",hm(r.s[i]))}${row("Agua no registrada",hm(r.a[i]))}${row("Pérdidas reales",r.bad.includes(y)?null:hm(r.p[i]))}${row("Pérdidas aparentes",hm(r.q[i]))}${CC.hog[c]?row("Consumo de hogares 2024",CC.hog[c],"L/hab/día"):""}</dl></div>
  <div><h3>Evolución 2008-2024</h3>${spark(c)}</div>`;}
function panelMU(P,id,chip){const r=MU[id];if(!r){P.innerHTML="";return;}const L=muLatest(id),unit=muUnit(id);const a24=r[3],a22=r[4];
  const head=`<div class="ph"><div><h2>${esc(r[0])}</h2><span class="code">INE ${id} · ${esc(COMS[r[1]])} · ${grp(r[2])} hab. (2025)</span></div>${chip}</div>`;
  if(!L){P.innerHTML=head+`<div class="hero"><span class="lbl">Agua no registrada</span><span class="big" style="font-size:24px;line-height:32px">No consta auditoría publicada en el registro de la ACA</span><span class="src">Sin dato publicado. No se estima ningún valor.</span></div>
    <p class="note">Los servicios con más de 5.000 abonados deben publicar cada dos años una auditoría de eficiencia hidráulica (disposición adicional 26ª del texto refundido de aguas de Cataluña, Decreto Legislativo 3/2003). ${r[6]===2?"La ACA lista este servicio como obligado, sin enlace a la auditoría 2024.":""}</p>
    <div><h3>Municipio</h3><dl>${row("Población (Idescat 2025)",grp(r[2]))}${row("Comarca",esc(COMS[r[1]]))}</dl></div>`;return;}
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
  ${a22&&a22[5]?`<p class="note">Dos redes auditadas en Vallirana en 2022 (43,6 % y 43,5 %).</p>`:""}
  ${!a24&&r[6]===1?`<p class="note">El operador ha publicado la auditoría 2024 (registro de la ACA); aquí se muestra el dato 2022 del anexo de la ACA.</p>`:""}`;}

// ================= tooltip =================
function placeTip(x,y){const W=box.clientWidth,w=tip.offsetWidth,h=tip.offsetHeight;let l=Math.min(Math.max(x-w/2,8),W-w-8),tp=y-h-14;if(tp<6)tp=y+18;tip.style.left=l+"px";tip.style.top=tp+"px";}
function showTip(html,x,y){tip.innerHTML=html;tip.hidden=false;placeTip(x,y);}
const hideTip=()=>{tip.hidden=true};
const rel=e=>{const r=box.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
function tipFor(k){
  if(level==="eu"){const v=val(k),m=M[metric];return `<b>${D[k][0]}</b><span>${m.short}: ${v==null?"sin dato":m.fmt(v)+" "+m.unit} · ${(k==="ES"&&metric==="nrw")?"INE 2024":"EurEau 2026"}</span>`;}
  if(level==="es"){const r=CC.r[k],v=ccVal(k);return `<b>${r.n}</b><span>${ESM[esMetric].short}: ${pc(v)} · INE ${YRS[yi]}</span>`;}
  const r=MU[k],L=muLatest(k),u=muUnit(k);
  return `<b>${esc(r[0])}</b><span>${esc(COMS[r[1]])} · ${grp(r[2])} hab.</span>`+(L?`<span>ANR: ${es(L.v,1)} % · ${L.y==2024?"auditoría 2024":L.src+" "+L.y}</span>`+(r[3]&&r[3][1]!=null?`<span>Pérdidas reales: ${es(r[3][1],1)} % · 2024</span>`:""):`<span>Sin dato publicado</span>`)+(u?`<span class="tn">Unidad: ${esc(u)}</span>`:"");}

// ================= zoom y niveles =================
const FULL=[0,0,760,700];let curVB=FULL.slice(),anim=null;
const reduce=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const VB={eu:FULL,es:ESP.vb,cat:CAT.vb};
function sizeLabels(){const s=svg.getBoundingClientRect().width/curVB[2];const fs=(10/s).toFixed(3);catLayer.querySelectorAll(".mlab").forEach(e=>e.setAttribute("font-size",fs));}
function setVB(v){curVB=v;svg.setAttribute("viewBox",v.map(n=>n.toFixed(3)).join(" "));}
function layerVis(o){espLayer.toggleAttribute("hidden",o.es<=0);catLayer.toggleAttribute("hidden",o.cat<=0);espLayer.setAttribute("opacity",o.es.toFixed(3));catLayer.setAttribute("opacity",o.cat.toFixed(3));}
function setLevel(l,animate=true){
  if(!VB[l])l="eu";level=l;hovered=null;hideTip();rankAll=false;
  g.classList.toggle("dim",l!=="eu");dots.classList.toggle("dim",l!=="eu");
  const from=curVB.slice(),to=VB[l],start={es:+espLayer.getAttribute("opacity"),cat:+catLayer.getAttribute("opacity")},end={es:l==="es"?1:0,cat:l==="cat"?1:0};
  cancelAnimationFrame(anim);const t0=performance.now(),DUR=(animate&&!reduce())?750:0;
  espLayer.removeAttribute("hidden");catLayer.removeAttribute("hidden");
  const step=now=>{const k=DUR?Math.min(1,(now-t0)/DUR):1,e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
    setVB(from.map((v,i)=>v+(to[i]-v)*e));
    const fade=x=>Math.min(1,Math.max(0,x));
    layerVis({es:start.es+(end.es-start.es)*fade(end.es?(k-.5)/.5:k/.4),cat:start.cat+(end.cat-start.cat)*fade(end.cat?(k-.5)/.5:k/.4)});
    sizeLabels();if(k<1)anim=requestAnimationFrame(step);};
  anim=requestAnimationFrame(step);
  svg.setAttribute("aria-label",l==="eu"?"Mapa de Europa por pérdidas de agua":l==="es"?"Mapa de España por comunidades autónomas":"Mapa de Catalunya por municipios");
  try{history.replaceState(null,"",l==="eu"?location.pathname+location.search:"#"+(l==="es"?"espana":"catalunya"))}catch(e){}
  store.set("lv",l);paint();
}
window.addEventListener("resize",sizeLabels);

// ================= eventos =================
const keyOf=t=>{if(level==="eu"){const e=t.closest("[data-c]");return e?e.dataset.c:null;}if(level==="es"){const e=t.closest("[data-r]");return e?ccCode(e.dataset.r):null;}const e=t.closest("[data-m]");return e?e.dataset.m:null;};
function setHover(k){if(hovered===k)return;hovered=k;marks();renderPanel();}
function pin(k){pinned[level]=k;hovered=null;marks();renderPanel();
  if(window.matchMedia("(max-width:900px)").matches)$("#panel").scrollIntoView({behavior:reduce()?"auto":"smooth",block:"start"});}
svg.addEventListener("pointermove",e=>{if(e.pointerType==="touch")return;const k=keyOf(e.target);const [x,y]=rel(e);
  if(!k){hideTip();setHover(null);return;}showTip(tipFor(k),x,y);setHover(k);});
svg.addEventListener("pointerleave",e=>{if(e.pointerType==="touch")return;hideTip();setHover(null);});
svg.addEventListener("click",e=>{const k=keyOf(e.target);const [x,y]=rel(e);
  if(!k){hideTip();return;}
  pin(k);if(e.pointerType==="touch"||e.pointerType==="pen")showTip(tipFor(k),x,y);});
svg.addEventListener("dblclick",e=>{const k=keyOf(e.target);if(level==="eu"&&k==="ES")setLevel("es");else if(level==="es"&&k==="09")setLevel("cat");});
svg.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const k=keyOf(e.target);if(k){e.preventDefault();pin(k);}});
svg.addEventListener("focusin",e=>{const k=keyOf(e.target);if(!k)return;const r=e.target.getBoundingClientRect(),b=box.getBoundingClientRect();showTip(tipFor(k),r.left+r.width/2-b.left,r.top-b.top);setHover(k);});
svg.addEventListener("focusout",()=>{hideTip();setHover(null);});
$("#rank").addEventListener("click",e=>{const b=e.target.closest("[data-k]");if(b)pin(b.dataset.k);});
$("#rank").addEventListener("pointerover",e=>{const b=e.target.closest("[data-k]");if(b&&e.pointerType!=="touch")setHover(b.dataset.k);});
$("#rank").addEventListener("pointerleave",()=>setHover(null));
$("#onlyData").addEventListener("change",()=>{rankAll=false;renderRank();marks();});
$("#moreBtn").addEventListener("click",()=>{rankAll=!rankAll;renderRank();marks();});
document.addEventListener("click",e=>{const b=e.target.closest("[data-go],.lvl button,.crumbs button");if(!b)return;const l=b.dataset.go||b.dataset.l;if(l&&l!==level)setLevel(l);});
document.querySelectorAll("#segEU button").forEach(b=>b.addEventListener("click",()=>{metric=b.dataset.m;store.set("m",metric);paint();}));
document.querySelectorAll("#segES button").forEach(b=>b.addEventListener("click",()=>{esMetric=b.dataset.m;store.set("em",esMetric);paint();}));
const ysel=$("#year");ysel.innerHTML=YRS.map((y,i)=>`<option value="${i}" ${i===yi?"selected":""}>${y}</option>`).join("");
ysel.addEventListener("change",()=>{yi=+ysel.value;paint();});
window.addEventListener("hashchange",()=>{const h=location.hash;const l=h==="#espana"?"es":h==="#catalunya"?"cat":"eu";if(l!==level)setLevel(l);});

// ================= inicio =================
{const s=store.get("m");if(s&&M[s])metric=s;const t=store.get("em");if(t&&ESM[t])esMetric=t;}
const h0=location.hash;let l0=h0==="#espana"?"es":h0==="#catalunya"?"cat":h0==="#europa"?"eu":"eu";
setVB(VB[l0]||FULL);layerVis({es:l0==="es"?1:0,cat:l0==="cat"?1:0});setLevel(l0,false);
