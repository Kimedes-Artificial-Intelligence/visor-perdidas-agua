// España por municipio: pérdidas, red y gestión (EIEL), operadores (SINAC) y modelo de gestión de Catalunya (ESF).
// raw/eiel_*.csv, raw/sinac_redes_*.csv, raw/esf_gestio_aigua_cat_*.psv y data/operadores_clasificacion.csv
//   -> data/es_mun.json (por código INE de 5 dígitos) y data/operadores_sin_clasificar.csv
// Port de process_es.py (FWG-1868). Ningún valor se estima: lo que la fuente no da queda sin dato.
const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const F={nu:'raw/eiel_nucleos_2026-10-30.csv',rd:'raw/eiel_rd_2026-10-30.csv',prov:'raw/eiel_provincias_2026-10-30.csv',
  sinac:'raw/sinac_redes_2026-10-30.csv',esf:'raw/esf_gestio_aigua_cat_2026-07-10.psv',cls:'data/operadores_clasificacion.csv'};

// CSV con ';' y cabecera; sin comillas en estas fuentes
const csv=text=>{const L=text.replace(/\r/g,'').trim().split('\n');const H=L[0].split(';');
  return L.slice(1).map(l=>{const a=l.split(';');return Object.fromEntries(H.map((h,i)=>[h,a[i]??'']));});};
// Número en formato español: punto de miles, coma decimal ("125.262" -> 125262, "246,48" -> 246.48)
const num=s=>s&&/^-?[\d.,]+$/.test(s)?+s.replace(/\./g,'').replace(',','.'):null;
const round=(v,d=0)=>{const k=10**d;return Math.round(v*k)/k;};

// ---------- EIEL núcleos -> pérdidas por municipio ----------
// 0, vacío o > 95 = sin dato (el 0 es campo no rellenado). Media ponderada por consumo medio; sin consumo, por padrón.
function eielLosses(rows){
  const nuc={};
  for(const r of rows){const m=/^(\d{4})-(\d{2})-(\d{3})-(\d{4})-(\d{2})$/.exec(r.code||'');if(!m)continue;
    const inv=num(r.cons_invierno_m3d),ver=num(r.cons_verano_m3d);
    (nuc[m[2]+m[3]]??=[]).push({fase:+m[1],pad:num(r.padron)||0,cons:inv||ver?((inv||0)+(ver||0))/2:null,per:num(r.perdidas_pct)});}
  const out={};
  for(const [ine,L] of Object.entries(nuc)){const pop=L.reduce((a,x)=>a+x.pad,0);
    const rep=L.filter(x=>x.per!=null&&x.per>0&&x.per<=95);
    const o={y:Math.max(...L.map(x=>x.fase)),nn:L.length,pop:Math.round(pop)};
    if(rep.length){const w=rep.map(x=>x.cons||x.pad||1);
      o.per=round(rep.reduce((a,x,i)=>a+x.per*w[i],0)/w.reduce((a,b)=>a+b,0),1);
      o.nrep=rep.length;o.cov=pop?Math.round(100*rep.reduce((a,x)=>a+x.pad,0)/pop):null;
      o.rnd=Math.round(100*rep.filter(x=>x.per%5===0).length/rep.length);} // % de valores múltiplos de 5
    out[ine]=o;}
  return out;
}

// ---------- EIEL tramos de red -> gestión, material, estado ----------
// key = fase-RD-PP-MMM-NNNN-NN-MATERIAL-SISTTRANS-ESTADO-TITULAR-GESTION. Claves mal formadas: se ignoran.
const GES_OK=new Set(['MU','EM','EP','MA','CO','PV','VE','OT']);
function eielNetwork(rows){
  const agg={};
  for(const r of rows){const a=(r.key||'').split('-');if(a.length!==11||a[1]!=='RD'||!/^\d{4}$/.test(a[0])||!/^\d{2}$/.test(a[2])||!/^\d{3}$/.test(a[3]))continue;
    const L=+r.len_m||0,w=L>0?L:1;const A=agg[a[2]+a[3]]??={L:0,y:0,g:{},mat:{},est:{}};
    A.L+=L;A.y=Math.max(A.y,+a[0]);if(GES_OK.has(a[10]))A.g[a[10]]=(A.g[a[10]]||0)+w;
    A.mat[a[6]]=(A.mat[a[6]]||0)+w;A.est[a[8]]=(A.est[a[8]]||0)+w;}
  const out={};const sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
  for(const [ine,A] of Object.entries(agg)){const o={};
    const tg=sum(A.g);if(tg){const s=Object.entries(A.g).sort((x,y)=>y[1]-x[1]);
      o.g=Object.fromEntries(s.map(([k,v])=>[k,Math.round(100*v/tg)]).filter(([,p])=>p>0));o.gd=s[0][0];}
    const tm=sum(A.mat);if(tm)o.fc=Math.round(100*(A.mat.FC||0)/tm);
    const te=sum(A.est);if(te){o.em=Math.round(100*(A.est.M||0)/te);o.er=Math.round(100*(A.est.R||0)/te);}
    o.km=round(A.L/1000,1);o.ry=A.y;out[ine]=o;}
  return out;
}

// ---------- Clasificación de operadores ----------
// Coincidencia por palabras completas, sin acentos, en mayúsculas y sin signos. Gana el primer patrón del archivo.
const normOp=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim();
const TIPOS={'Municipalizado':'P','Mixto':'M','Privado':'V','No es operador':'X'};
function loadClassifier(rows){
  const pats=rows.map((r,i)=>{const t=TIPOS[r.tipo];if(!t)throw new Error(`${F.cls}, fila ${i+2}: tipo desconocido "${r.tipo}"`);
    return {p:' '+normOp(r.patron)+' ',t,grupo:r.grupo||''};});
  return name=>{const n=' '+normOp(name)+' ';return pats.find(x=>n.includes(x.p))||null;};
}

// ---------- SINAC ----------
// Operadores (gestor) ponderados por población abastecida (población × %). Si el gestor no es un operador
// (EKUIS, laboratorios), se usa el responsable de la red y se marca.
function sinac(rows,classify){
  const red={};for(const r of rows)red[r.id_red]=r;
  const by={};const unk={};
  for(const r of Object.values(red)){const ine=r.mun.padStart(5,'0');let p=0;
    for(const loc of (r.localidades||'').split('|')){const q=loc.split(':');if(q.length===3)p+=(num(q[1])||0)*(num(q[2])||0)/100;}
    let name=(r.gestor||'').trim(),resp=0;const c=name&&classify(name);
    if(c&&c.t==='X'){name=(r.responsable||'').trim();resp=1;}
    const B=by[ine]??={g:{},resp:{},pob:0,n:0,dots:[]};B.n++;B.pob+=p;
    if(name){B.g[name]=(B.g[name]||0)+(p>0?p:1);if(resp)B.resp[name]=1;
      if(!classify(name)){const U=unk[name]??={pob:0,redes:0,mun:new Set()};U.pob+=p;U.redes++;U.mun.add(ine);}}
    const d=num(r.dotacion_l_hab_dia);if(d&&d>0)B.dots.push([d,p||1]);}
  const out={};
  for(const [ine,B] of Object.entries(by)){const o={};const s=Object.entries(B.g).sort((a,b)=>b[1]-a[1]);
    if(s.length){const tot=s.reduce((a,x)=>a+x[1],0);o.ops=s.slice(0,4).map(([n,v])=>B.resp[n]?[n,Math.round(100*v/tot),1]:[n,Math.round(100*v/tot)]);}
    o.nred=B.n;if(B.pob)o.spop=Math.round(B.pob);
    if(B.dots.length)o.dot=Math.round(B.dots.reduce((a,[d,w])=>a+d*w,0)/B.dots.reduce((a,[,w])=>a+w,0));
    out[ine]=o;}
  return {mun:out,unk};
}

// ---------- Modelo de gestión por municipio ----------
// Catalunya: ESF. Resto: operador SINAC dominante si es Mixto; si no, código EIEL dominante agrupado;
// si no hay EIEL, tipo del operador SINAC dominante. Sin nada de eso: sin dato.
// Un responsable puesto en lugar del gestor (EKUIS, laboratorios) es el titular, no el gestor: no da el modelo.
const EIEL_GROUP={MU:'P',EM:'P',EP:'P',MA:'P',CO:'P',PV:'V',VE:'C',OT:'O'};
const ESF_GROUP={'Pública':'P','Privada':'V','Empresa mixta privada – pública':'M','Cooperativa / associació':'C'};
const CAT_PROV=new Set(['08','17','25','43']);
function model(ine,o,esfTipus,classify){
  const eg=o.gd?EIEL_GROUP[o.gd]:null;const top=o.ops&&o.ops[0];const c=top&&!top[2]&&classify(top[0]);const st=c?c.t:null;
  if(eg)o.eg=eg;if(st)o.st=st;
  if(CAT_PROV.has(ine.slice(0,2))&&ESF_GROUP[esfTipus])return {gm:ESF_GROUP[esfTipus],gs:'esf'};
  if(st==='M')return {gm:'M',gs:'sinac'};
  if(eg)return {gm:eg,gs:'eiel'};
  if(st==='P'||st==='V')return {gm:st,gs:'sinac'};
  return {gm:'N',gs:null};
}

function build(read=f=>fs.readFileSync(path.join(ROOT,f),'utf8')){
  const classify=loadClassifier(csv(read(F.cls)));
  const mun=eielLosses(csv(read(F.nu)));
  for(const [ine,o] of Object.entries(eielNetwork(csv(read(F.rd)))))Object.assign(mun[ine]??={},o);
  const S=sinac(csv(read(F.sinac)),classify);
  for(const [ine,o] of Object.entries(S.mun))Object.assign(mun[ine]??={},o);
  const esf={};for(const l of read(F.esf).trim().split('\n')){if(l.startsWith('#'))continue;const a=l.split('|');esf[a[0]]=a[1];}
  for(const ine of Object.keys(esf))mun[ine]??={};
  for(const [ine,o] of Object.entries(mun))Object.assign(o,model(ine,o,esf[ine],classify));
  const prov=Object.fromEntries(csv(read(F.prov)).map(r=>[r.prov,{fase:r.fase?+r.fase:null,nu_fase:r.nu_fase?+r.nu_fase:null}]));
  const sorted=Object.fromEntries(Object.keys(mun).sort().map(k=>[k,mun[k]]));
  const unk=Object.entries(S.unk).sort((a,b)=>b[1].pob-a[1].pob||b[1].redes-a[1].redes||(a[0]<b[0]?-1:1))
    .map(([n,u])=>[n,Math.round(u.pob),u.redes,u.mun.size,[...u.mun].sort()[0]]);
  return {mun:sorted,prov,unk};
}

module.exports={csv,num,normOp,eielLosses,eielNetwork,loadClassifier,sinac,model,build,F};

if(require.main===module){
  const {mun,prov,unk}=build();
  const meta={eiel:'Secretaría de Estado de Política Territorial, EIEL (visor GEO-EIEL, eiel.redsara.es). Extracción 29-30/10/2026. CC BY-NC-SA 4.0',
    sinac:'Ministerio de Sanidad, SINAC, consulta ciudadana (sinac.sanidad.gob.es). Extracción 30/10/2026',
    esf:"Enginyeria Sense Fronteres / Aigua és Vida, La Gestió de l'Aigua a Catalunya per Municipi, Datawrapper F298j v45 (10/07/2026)",prov};
  fs.writeFileSync(path.join(ROOT,'data/es_mun.json'),JSON.stringify({meta,mun}));
  fs.writeFileSync(path.join(ROOT,'data/operadores_sin_clasificar.csv'),['gestor;poblacion_abastecida;redes;municipios;ejemplo_ine',...unk.map(r=>r.join(';'))].join('\n')+'\n');
  const n=k=>Object.values(mun).filter(o=>o[k]!=null).length;const gm={};for(const o of Object.values(mun))gm[o.gm]=(gm[o.gm]||0)+1;
  console.log('es_mun:',Object.keys(mun).length,'municipios; con pérdidas',n('per'),'con gestión EIEL',n('gd'),'con operador SINAC',n('ops'),'; modelo',JSON.stringify(gm),'; operadores sin clasificar',unk.length);
}
