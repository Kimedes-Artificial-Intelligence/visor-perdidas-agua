// Escribe .build/reference.html: la referencia con la misma cabecera que dist/index.html
const fs=require('fs');const path=require('path');
const {DIST,REFERENCE,REFERENCE_DOC,referenceDocument,read}=require('../lib/page.js');
module.exports=()=>{
  if(!fs.existsSync(DIST))throw new Error('Falta dist/index.html: ejecuta npm run build');
  fs.mkdirSync(path.dirname(REFERENCE_DOC),{recursive:true});
  fs.writeFileSync(REFERENCE_DOC,referenceDocument(read(DIST),read(REFERENCE)));
};
