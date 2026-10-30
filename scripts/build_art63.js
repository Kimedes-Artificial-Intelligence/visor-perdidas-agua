// Pérdidas publicadas por el operador o el ayuntamiento (art. 63.2 y anexo XI parte B.1 del RD 3/2023) y estado de la búsqueda.
// raw/operadores_art63_2026-10.psv, raw/art63_estado_2026-10-30.psv, raw/operadores_sistema_2026-10.psv, raw/sistema_municipios_2026-10-30.psv,
// raw/miteco_fugas_2024.psv, data/espmun.json, data/es_mun.json, data/muni.json
//   -> data/art63.json y data/ciudades_50k_sin_perdidas.csv
// Ningún valor se calcula: se transcribe lo publicado. Lo que no se encuentra queda sin dato, con el estado de la búsqueda.
const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const F={a63:'raw/operadores_art63_2026-10.psv',estado:'raw/art63_estado_2026-10-30.psv',sys:'raw/operadores_sistema_2026-10.psv',miteco:'raw/miteco_fugas_2024.psv',smun:'raw/sistema_municipios_2026-10-30.psv',cls:'data/operadores_clasificacion.csv'};
const SYS_COLS=['patron','operador','ambito','indicador','valor','unidad','año_dato','url','fecha_consulta','pagina_o_seccion','licencia_o_aviso_legal','nota'];
// Municipios que la fuente de cada sistema lista como servidos (FWG-1871, decisión D2); nunca se deducen del SINAC
const SMUN_COLS=['patron','nombre_en_fuente','ine','servicio','url','fecha_consulta','pagina_o_seccion','nota'];
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

// Fecha AAAA-MM-DD que existe en el calendario
const isDate=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T00:00:00Z');return !isNaN(d)&&d.toISOString().slice(0,10)===s;};
// Errores de forma de cada fila de pérdidas publicadas; padron = conjunto de códigos INE válidos
function checkA63(rows,padron){
  const err=[];const at=r=>`${F.a63}, línea ${r._line}`;const seen=new Set();
  for(const r of rows){
    if(!padron.has(r.ine))err.push(`${at(r)}: código INE "${r.ine}" fuera del padrón`);
    if(!IND.has(r.indicador))err.push(`${at(r)}: indicador "${r.indicador}" no admitido`);
    if(!/^\d+(\.\d+)?$/.test(r.valor))err.push(`${at(r)}: valor "${r.valor}" no es un número con punto decimal`);
    else if(PCT.has(r.indicador)&&(r.unidad!=='%'||+r.valor>100))err.push(`${at(r)}: ${r.indicador} debe ser un % entre 0 y 100`);
    if(!isDate(r.fecha_consulta))err.push(`${at(r)}: fecha de consulta "${r.fecha_consulta}"`);
    // El año del dato no puede ser posterior al de la consulta
    if(!/^20\d\d$/.test(r['año_dato'])||+r['año_dato']>+String(r.fecha_consulta).slice(0,4))err.push(`${at(r)}: año "${r['año_dato']}"`);
    if(!/^https:\/\/\S+$/.test(r.url))err.push(`${at(r)}: URL "${r.url}"`);
    for(const c of ['operador','unidad','pagina_o_seccion','licencia_o_aviso_legal'])if(!r[c])err.push(`${at(r)}: ${c} vacío`);
    if(!/^https:\/\/\S+ /.test(r.licencia_o_aviso_legal))err.push(`${at(r)}: el aviso legal debe empezar por su URL`);
    const k=r.ine+'|'+r.indicador;if(seen.has(k))err.push(`${at(r)}: ${k} repetido`);seen.add(k);}
  return err;
}
// MITECO, tabla por municipio del Informe nacional de fugas 2024 (Parte 5): vacía hasta que llegue la respuesta a la solicitud
const MIT_COLS=['ine','anr_pct','ife','rendimiento_pct','tipo_evaluacion','año_dato','documento','fecha_recepcion','nota'];
function parseMiteco(text){
  const sol=(/^solicitud_presentada:(.*)$/m.exec(text)||['',''])[1].trim();
  const body=text.split('\n').filter(l=>!/^solicitud_presentada:/.test(l)).join('\n');
  return {sol,rows:psv(body,MIT_COLS,F.miteco)};
}
function checkMiteco({sol,rows},padron){
  const err=[];const at=r=>`${F.miteco}, línea ${r._line}`;const seen=new Set();const num=v=>v===''||/^\d+(\.\d+)?$/.test(v);
  if(sol&&!/^\d{4}-\d{2}-\d{2}$/.test(sol))err.push(`${F.miteco}: solicitud_presentada "${sol}" no es AAAA-MM-DD`);
  for(const r of rows){
    if(!padron.has(r.ine))err.push(`${at(r)}: código INE "${r.ine}" fuera del padrón`);
    for(const c of ['anr_pct','ife','rendimiento_pct'])if(!num(r[c]))err.push(`${at(r)}: ${c} "${r[c]}" no es un número con punto decimal`);
    if(r.anr_pct===''&&r.ife===''&&r.rendimiento_pct==='')err.push(`${at(r)}: ningún indicador`);
    if(!/^(basica|detallada)$/.test(r.tipo_evaluacion))err.push(`${at(r)}: tipo_evaluacion "${r.tipo_evaluacion}"`);
    if(r['año_dato']!=='2024')err.push(`${at(r)}: año "${r['año_dato']}"`);
    if(!r.documento||!/^\d{4}-\d{2}-\d{2}$/.test(r.fecha_recepcion))err.push(`${at(r)}: falta el documento o la fecha de recepción`);
    if(seen.has(r.ine))err.push(`${at(r)}: ${r.ine} repetido`);seen.add(r.ine);}
  return err;
}
// Cifras de todo el sistema de un operador: mismas reglas que las municipales, con el patrón y el ámbito en lugar del código INE
function checkSys(rows){
  const err=checkA63(rows.map(r=>Object.assign({},r,{ine:r.patron})),new Set(rows.map(r=>r.patron))).map(e=>e.replace(F.a63,F.sys));
  for(const r of rows)for(const c of ['patron','ambito'])if(!r[c])err.push(`${F.sys}, línea ${r._line}: ${c} vacío`);
  return [...new Set(err)];
}
function checkSmun(rows,padron,sys){
  const {SYS_SERVICIO}=require('../src/loss.js');
  const err=[];const at=r=>`${F.smun}, línea ${r._line}`;const seen=new Set();const pats=new Set(sys.map(r=>r.patron));
  for(const r of rows){
    if(!pats.has(r.patron))err.push(`${at(r)}: patrón "${r.patron}" sin cifra en ${F.sys}`);
    if(!padron.has(r.ine))err.push(`${at(r)}: código INE "${r.ine}" fuera del padrón`);
    if(!SYS_SERVICIO.includes(r.servicio))err.push(`${at(r)}: servicio "${r.servicio}"`);
    if(!/^https:\/\/\S+$/.test(r.url))err.push(`${at(r)}: URL "${r.url}"`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(r.fecha_consulta))err.push(`${at(r)}: fecha de consulta "${r.fecha_consulta}"`);
    for(const c of ['nombre_en_fuente','pagina_o_seccion'])if(!r[c])err.push(`${at(r)}: ${c} vacío`);
    if(seen.has(r.ine))err.push(`${at(r)}: ${r.ine} repetido`);seen.add(r.ine);}
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
// rows son las filas ya leídas de data/art63.json (clave ind), no las de raw/ (clave indicador).
const PAINT=['ANR','PERDIDAS_REALES'];
function paintable(rows){for(const k of PAINT){const r=rows.find(x=>x.ind===k);if(r)return r;}return null;}

function build(read=f=>fs.readFileSync(path.join(ROOT,f),'utf8')){
  const EM=JSON.parse(read('data/espmun.json')),ES=JSON.parse(read('data/es_mun.json')).mun,M=JSON.parse(read('data/muni.json')).muni;
  const padron=new Set(Object.keys(EM.mun));
  const a63=psv(read(F.a63),COLS,F.a63),est=psv(read(F.estado),ESTADO_COLS,F.estado);
  const sys=psv(read(F.sys),SYS_COLS,F.sys),mit=parseMiteco(read(F.miteco)),smun=psv(read(F.smun),SMUN_COLS,F.smun);
  const err=[...checkA63(a63,padron),...checkEstado(est,padron,a63),...checkSys(sys),...checkMiteco(mit,padron),...checkSmun(smun,padron,sys)];if(err.length)throw new Error(err.join('\n'));
  // d: decimales tal como se publican (79.00 se muestra 79,00), para no redondear la cifra del operador en la ficha
  const dec=v=>(v.split('.')[1]||'').length;
  const mun={};for(const r of a63)(mun[r.ine]??=[]).push({ind:r.indicador,v:+r.valor,d:dec(r.valor),unit:r.unidad,y:+r['año_dato'],op:r.operador,url:r.url,
    page:r.pagina_o_seccion,legal:r.licencia_o_aviso_legal,date:r.fecha_consulta});
  const estado=Object.fromEntries(est.map(r=>[r.ine,{e:r.estado,date:r.fecha_consulta,motivo:r.motivo}]));
  // Ciudades de 50.000 hab. o más sin pérdidas en las fuentes anteriores a FWG-1870 (ACA, Govern IB, EIEL): la lista de trabajo de la Parte 1
  const {csv,loadClassifier}=require('./build_es_mun.js');const classify=loadClassifier(csv(read(F.cls)));
  const cat=new Set(M.filter(m=>m.a24||m.aca).map(m=>m.ine));
  // Municipios que se pintan con una cifra de sistema (D2): listados por la fuente, con servicio pintable y con ANR o pérdidas reales del sistema
  const {SYS_PAINT_SERVICIO}=require('../src/loss.js');
  const sysPainted=Object.fromEntries(smun.filter(r=>SYS_PAINT_SERVICIO.includes(r.servicio)&&paintable(sys.filter(x=>x.patron===r.patron).map(x=>({ind:x.indicador}))))
    .map(r=>[r.ine,r.patron]));
  const cities=Object.entries(EM.mun).filter(([id,[,pop]])=>pop>=50000&&!cat.has(id)&&!EM.ib[id]&&!(ES[id]&&ES[id].per!=null))
    .sort((a,b)=>b[1][1]-a[1][1]).map(([id,[name,pop]])=>{const top=ES[id]&&ES[id].ops&&ES[id].ops[0];const c=top&&!top[2]&&classify(top[0]);
      const p=paintable(mun[id]||[]),sp=!p&&sysPainted[id];
      return [id,name,pop,top?top[0]+(top[2]?' (responsable)':''):'',c?(c.grupo||c.p.trim()):'',estado[id]?estado[id].e:'',
        (mun[id]||[]).map(r=>`${r.ind} ${r.v}${r.unit==='%'?' %':''} (${r.y})`).join(' · '),p?'sí':sp?'sistema':'no'];});
  const sysOut=sys.map(r=>({pat:r.patron,op:r.operador,amb:r.ambito,ind:r.indicador,v:+r.valor,d:dec(r.valor),unit:r.unidad,y:+r['año_dato'],url:r.url,page:r.pagina_o_seccion,legal:r.licencia_o_aviso_legal,date:r.fecha_consulta,nota:r.nota}));
  const miteco={sol:mit.sol,mun:Object.fromEntries(mit.rows.map(r=>[r.ine,{anr:r.anr_pct===''?null:+r.anr_pct,ife:r.ife===''?null:+r.ife,rend:r.rendimiento_pct===''?null:+r.rendimiento_pct,tipo:r.tipo_evaluacion,y:2024,doc:r.documento,rec:r.fecha_recepcion}]))};
  const smunOut=Object.fromEntries(smun.map(r=>[r.ine,{pat:r.patron,name:r.nombre_en_fuente,srv:r.servicio,url:r.url,page:r.pagina_o_seccion,date:r.fecha_consulta}]));
  return {mun,estado,cities,sys:sysOut,miteco,smun:smunOut};
}

module.exports={psv,checkA63,checkEstado,checkSys,checkSmun,parseMiteco,checkMiteco,paintable,build,F,COLS,ESTADO_COLS,SYS_COLS,SMUN_COLS,MIT_COLS};

if(require.main===module){
  const {mun,estado,cities,sys,miteco,smun}=build();
  fs.writeFileSync(path.join(ROOT,'data/art63.json'),JSON.stringify({meta:{src:F.a63,estado:F.estado,sys:F.sys,miteco:F.miteco,smun:F.smun},mun,estado,sys,miteco,smun}));
  fs.writeFileSync(path.join(ROOT,'data/ciudades_50k_sin_perdidas.csv'),
    ['ine;nombre;poblacion_ine_2025;operador_sinac;operador_agrupado;estado_art63;indicadores_publicados;se_pinta',...cities.map(r=>r.join(';'))].join('\n')+'\n');
  const n={};for(const o of Object.values(estado))n[o.e]=(n[o.e]||0)+1;
  console.log('art63:',Object.keys(mun).length,'municipios con indicador publicado;',cities.length,'ciudades >= 50.000 hab. sin pérdidas previas; estados',JSON.stringify(n));
}
