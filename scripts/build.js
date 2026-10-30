// Cadena completa: raw/ -> data/ -> .build/data.js -> dist/index.html
const {execFileSync}=require('child_process');const path=require('path');
const ROOT=path.resolve(__dirname,'..');
for(const s of ['build_data.js','build_es_mun.js','build_geo.js','build_embed.js','assemble.js']){
  console.log('> '+s);execFileSync(process.execPath,[path.join(__dirname,s)],{cwd:ROOT,stdio:'inherit'});}
