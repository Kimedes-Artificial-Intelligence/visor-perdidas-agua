// Pérdidas publicadas por el operador o el ayuntamiento (art. 63.2 y anexo XI parte B.1 del RD 3/2023) y estado de la búsqueda.
// raw/operadores_art63_2026-10.psv, raw/art63_estado_2026-10-30.psv, data/espmun.json, data/es_mun.json, data/muni.json
//   -> data/art63.json y data/ciudades_50k_sin_perdidas.csv
// Ningún valor se calcula: se transcribe lo publicado. Lo que no se encuentra queda sin dato, con el estado de la búsqueda.
const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const F={a63:'raw/operadores_art63_2026-10.psv',estado:'raw/art63_estado_2026-10-30.psv',cls:'data/operadores_clasificacion.csv'};
const COLS=['ine','operador','indicador','valor','unidad','año_dato','url','fecha_consulta','pagina_o_seccion','licencia_o_aviso_legal','nota'];
const IND=new Set(['ANR','PERDIDAS_REALES','IFE','ILI','RENDIMIENTO']);
const PCT=new Set(['ANR','PERDIDAS_REALES','RENDIMIENTO']);
const ESTADOS=new Set(['publica','excluido_aviso_legal','solo_sistema','no_publica','bloqueado','no_verificado']);
const ESTADO_COLS=['ine','estado','fecha_consulta','urls_revisadas','motivo'];

// PSV con cabecera; las líneas que empiezan por # son comentarios
function psv(text,cols,file){
  const L=text.replace(/\r/g,'').trim().split('\n').map((l,i)=>[i+1,l]).filter(([,l])=>!l.startsWith('#'));
  const head=L[0][1].split('|');if(head.join('|')!==cols.join('|'))throw new Error(`${file}: cabecera distinta de ${cols.join('|')}`);
  return L.slice(1).map(([n,l])=>{const a=l.split('|');if(a.length!==cols.length)throw new Error(`${file}, línea ${n}: ${a.length} campos, se esperan ${cols.length}`);
    return Object.assign(Object.fromEntries(cols.map((c,i)=>[c,a[i]])),{_line:n});});
}

// Errores de forma de cada fila de pérdidas publicadas; padron = conjunto de códigos INE válidos
function checkA63(rows,padron){
  const err=[];const at=r=>`${F.a63}, línea ${r._line}`;const seen=new Set();
  for(const r of rows){
    if(!padron.has(r.ine))err.push(`${at(r)}: código INE "${r.ine}" fuera del padrón`);
    if(!IND.has(r.indicador))err.push(`${at(r)}: indicador "${r.indicador}" no admitido`);
    if(!/^\d+(\.\d+)?$/.test(r.valor))err.push(`${at(r)}: valor "${r.valor}" no es un número con punto decimal`);
    else if(PCT.has(r.indicador)&&(r.unidad!=='%'||+r.valor>100))err.push(`${at(r)}: ${r.indicador} debe ser un % entre 0 y 100`);
    if(!/^20\d\d$/.test(r['año_dato'])||+r['año_dato']>2026)err.push(`${at(r)}: año "${r['año_dato']}"`);
    if(!/^https:\/\/\S+$/.test(r.url))err.push(`${at(r)}: URL "${r.url}"`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(r.fecha_consulta))err.push(`${at(r)}: fecha de consulta "${r.fecha_consulta}"`);
    for(const c of ['operador','unidad','pagina_o_seccion','licencia_o_aviso_legal'])if(!r[c])err.push(`${at(r)}: ${c} vacío`);
    if(!/^https:\/\/\S+ /.test(r.licencia_o_aviso_legal))err.push(`${at(r)}: el aviso legal debe empezar por su URL`);
    const k=r.ine+'|'+r.indicador;if(seen.has(k))err.push(`${at(r)}: ${k} repetido`);seen.add(k);}
  return err;
}
function checkEstado(rows,padron,a63){
  const err=[];const at=r=>`${F.estado}, línea ${r._line}`;const seen=new Set();const pub=new Set(a63.map(r=>r.ine));
  for(const r of rows){
    if(!padron.has(r.ine))err.push(`${at(r)}: código INE "${r.ine}" fuera del padrón`);
    if(!ESTADOS.has(r.estado))err.push(`${at(r)}: estado "${r.estado}"`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(r.fecha_consulta))err.push(`${at(r)}: fecha de consulta "${r.fecha_consulta}"`);
    if(!/https?:\/\//.test(r.urls_revisadas))err.push(`${at(r)}: sin URL revisada`);
    if(seen.has(r.ine))err.push(`${at(r)}: ${r.ine} repetido`);seen.add(r.ine);
    if((r.estado==='publica')!==pub.has(r.ine))err.push(`${at(r)}: estado "${r.estado}" no cuadra con ${F.a63}`);}
  return err;
}

// Indicador que se pinta con la escala de pérdidas: solo agua no registrada o pérdidas reales en %, por este orden.
// El rendimiento, el IFE y el ILI no son porcentajes de pérdidas: se muestran en la ficha, no se pintan ni se convierten.
const PAINT=['ANR','PERDIDAS_REALES'];
function paintable(rows){for(const k of PAINT){const r=rows.find(x=>x.indicador===k);if(r)return r;}return null;}

function build(read=f=>fs.readFileSync(path.join(ROOT,f),'utf8')){
  const EM=JSON.parse(read('data/espmun.json')),ES=JSON.parse(read('data/es_mun.json')).mun,M=JSON.parse(read('data/muni.json')).muni;
  const padron=new Set(Object.keys(EM.mun));
  const a63=psv(read(F.a63),COLS,F.a63),est=psv(read(F.estado),ESTADO_COLS,F.estado);
  const err=[...checkA63(a63,padron),...checkEstado(est,padron,a63)];if(err.length)throw new Error(err.join('\n'));
  const mun={};for(const r of a63)(mun[r.ine]??=[]).push({ind:r.indicador,v:+r.valor,unit:r.unidad,y:+r['año_dato'],op:r.operador,url:r.url,
    page:r.pagina_o_seccion,legal:r.licencia_o_aviso_legal,date:r.fecha_consulta});
  const estado=Object.fromEntries(est.map(r=>[r.ine,{e:r.estado,date:r.fecha_consulta,motivo:r.motivo}]));
  // Ciudades de 50.000 hab. o más sin pérdidas en las fuentes anteriores a FWG-1870 (ACA, Govern IB, EIEL): la lista de trabajo de la Parte 1
  const {csv,loadClassifier}=require('./build_es_mun.js');const classify=loadClassifier(csv(read(F.cls)));
  const cat=new Set(M.filter(m=>m.a24||m.aca).map(m=>m.ine));
  const cities=Object.entries(EM.mun).filter(([id,[,pop]])=>pop>=50000&&!cat.has(id)&&!EM.ib[id]&&!(ES[id]&&ES[id].per!=null))
    .sort((a,b)=>b[1][1]-a[1][1]).map(([id,[name,pop]])=>{const top=ES[id]&&ES[id].ops&&ES[id].ops[0];const c=top&&!top[2]&&classify(top[0]);
      const p=paintable(mun[id]||[]);
      return [id,name,pop,top?top[0]+(top[2]?' (responsable)':''):'',c?(c.grupo||c.p.trim()):'',estado[id]?estado[id].e:'',
        (mun[id]||[]).map(r=>`${r.ind} ${r.v}${r.unit==='%'?' %':''} (${r.y})`).join(' · '),p?'sí':'no'];});
  return {mun,estado,cities};
}

module.exports={psv,checkA63,checkEstado,paintable,build,F,COLS,ESTADO_COLS};

if(require.main===module){
  const {mun,estado,cities}=build();
  fs.writeFileSync(path.join(ROOT,'data/art63.json'),JSON.stringify({meta:{src:F.a63,estado:F.estado},mun,estado}));
  fs.writeFileSync(path.join(ROOT,'data/ciudades_50k_sin_perdidas.csv'),
    ['ine;nombre;poblacion_ine_2025;operador_sinac;operador_agrupado;estado_art63;indicadores_publicados;se_pinta',...cities.map(r=>r.join(';'))].join('\n')+'\n');
  const n={};for(const o of Object.values(estado))n[o.e]=(n[o.e]||0)+1;
  console.log('art63:',Object.keys(mun).length,'municipios con indicador publicado;',cities.length,'ciudades >= 50.000 hab. sin pérdidas previas; estados',JSON.stringify(n));
}
