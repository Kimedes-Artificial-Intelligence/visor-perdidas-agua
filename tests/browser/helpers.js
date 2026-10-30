const {pathToFileURL}=require('url');
const {DIST,REFERENCE_DOC}=require('../lib/page.js');
const URLS={dist:pathToFileURL(DIST).href,reference:pathToFileURL(REFERENCE_DOC).href};
const LEVELS={europa:'',espana:'#espana',municipios:'#municipios',catalunya:'#catalunya',internacional:'#internacional'};

// Abre la página sin red (las fuentes de Google no se cargan, igual en ambas versiones) y recoge los errores de JavaScript
async function open(page,which,hash=''){
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Las peticiones bloqueadas generan "Failed to load resource", que no es un error de JavaScript
  page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource'))errors.push(m.text());});
  await page.route(/^https?:/,r=>r.abort());
  await page.goto(URLS[which]+hash);
  await settle(page);
  return errors;
}

// Espera a que la página haya pintado: dos fotogramas tras la última interacción
const settle=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));

// Centro de un municipio en pantalla, para pasar el ratón o hacer clic sobre su forma
async function centerOf(page,selector){
  const b=await page.locator(selector).boundingBox();
  return {x:b.x+b.width/2,y:b.y+b.height/2,width:b.width,height:b.height};
}
module.exports={URLS,LEVELS,open,settle,centerOf};
