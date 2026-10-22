// Ensambla dist/index.html a partir de src/, data/ y .build/data.js
const fs=require('fs');
const R=f=>fs.readFileSync(f,'utf8');
const TITLE='Pérdidas de agua en Europa';
const DESC='Pérdidas de agua en las redes de abastecimiento de Europa, España y los municipios de Catalunya, con el año y la fuente de cada dato.';
const URL='https://kimedes-artificial-intelligence.github.io/visor-perdidas-agua/';
// Geometría: países y contexto de la v1; municipios de la v1 más 08215 (OSM); CCAA de build_geo.js
const cat=JSON.parse(R('src/geometry/cat.json'));cat.muni['08215']=R('data/m08215.txt');
const geo='const GEO='+R('src/geometry/geo.json')+';\n'+'const CAT='+JSON.stringify(cat)+';\n'+'const ESP='+R('data/esp.json')+';\n'+'const MUN='+R('data/esmun.json')+';\n';
// Lo que antes ponía el esqueleto del artifact
const reset=':root{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}\nbody{margin:0}\n[hidden]{display:none!important}\nimg{max-width:100%}\n';
const head=`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${TITLE}</title>
<meta name="description" content="${DESC}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${DESC}">
<meta property="og:url" content="${URL}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@500;600&family=Open+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
${reset}</style>
<style>
${R('src/styles/v1.css')}${R('src/styles/v2.css')}
</style>
</head>
<body>
`;
const body=R('src/body.html').replace('__CTX__',R('src/geometry/ctx_path.txt').trim());
const scr='<script>\n'+geo+R('.build/data.js')+R('src/app.js')+'</script>\n';
const out=head+body+scr+'</body>\n</html>\n';
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/index.html',out);
console.log('dist/index.html',Buffer.byteLength(out),'bytes');
