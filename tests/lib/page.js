// Lectura de la página generada y de la referencia, que puede ser un fragmento (v2) o un documento completo
const fs=require('fs');const path=require('path');const vm=require('vm');
const ROOT=path.resolve(__dirname,'../..');
const DIST=path.join(ROOT,'dist/index.html');
const REFERENCE=path.join(ROOT,'reference/perdidas-agua-europa.html');
const REFERENCE_DOC=path.join(ROOT,'.build/reference.html');

// Constantes de datos embebidas en el <script> de la página
const DATA_CONSTS=['GEO','CAT','ESP','MUN','CC','COMS','URLS','UNITS','MU','OPS','PROV','MUD','POP_ES','IB','M','D','ESM','IDX','MG','MU_BINS','FULL','GES','ESD','OPN','OPT','EPROV','FC_BINS'];

function parts(html){
  const css=html.slice(html.lastIndexOf('<style>\n')+8,html.lastIndexOf('</style>'));
  let body=html.slice(html.lastIndexOf('</style>\n')+9);
  if(body.startsWith('</head>'))body=body.slice(body.indexOf('<body>\n')+7,body.lastIndexOf('</body>'));
  const script=body.slice(body.indexOf('<script>\n')+9,body.lastIndexOf('</script>'));
  return {css,body,script};
}

// Fin de la expresión que empieza en i: primer ';' o salto de línea fuera de corchetes y cadenas
function exprEnd(src,i){
  let depth=0,q=null;
  for(;i<src.length;i++){const ch=src[i];
    if(q){if(ch==='\\')i++;else if(ch===q)q=null;continue;}
    if(ch==='"'||ch==="'"||ch==='`')q=ch;
    else if('([{'.includes(ch))depth++;
    else if(')]}'.includes(ch))depth--;
    else if(depth===0&&(ch===';'||ch==='\n'))return i;}
  return i;
}

// Las funciones se comparan por su código fuente; objetos y arrays se recrean fuera del contexto vm
const normalize=v=>typeof v==='function'?'fn:'+v.toString():Array.isArray(v)?Array.from(v,normalize):
  v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,normalize(x)])):v;

function dataConsts(html){
  const {script}=parts(html);const out={};
  for(const name of DATA_CONSTS){
    const m=new RegExp('^const '+name+' ?= ?','m').exec(script);
    if(!m){out[name]=undefined;continue;}
    const start=m.index+m[0].length;
    out[name]=normalize(vm.runInNewContext('('+script.slice(start,exprEnd(script,start))+')'));}
  return out;
}

// La referencia renderizada con la misma cabecera que la página generada, para que solo difiera el contenido
function referenceDocument(distHtml,refHtml){
  const head=distHtml.slice(0,distHtml.lastIndexOf('<style>\n')+8);
  const ref=parts(refHtml);
  return head+ref.css+'</style>\n</head>\n<body>\n'+ref.body+'</body>\n</html>\n';
}

const read=f=>fs.readFileSync(f,'utf8');
module.exports={ROOT,DIST,REFERENCE,REFERENCE_DOC,DATA_CONSTS,parts,dataConsts,referenceDocument,read};
