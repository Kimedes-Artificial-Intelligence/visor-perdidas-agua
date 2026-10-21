// Regresión contra la v2: texto visible y capturas de las tres vistas
const {test,expect}=require('@playwright/test');
const {LEVELS,open}=require('./helpers.js');

for(const [level,hash] of Object.entries(LEVELS)){
  test(`el texto visible de la vista ${level} es idéntico al de la referencia`,async({browser})=>{
    const text=async which=>{const p=await browser.newPage();await open(p,which,hash);const t=await p.locator('body').innerText();await p.close();return t;};
    expect(await text('dist')).toBe(await text('reference'));
  });
}

const SIZES={escritorio:{width:1360,height:1000},movil:{width:390,height:844}};
for(const [level,hash] of Object.entries(LEVELS))for(const scheme of ['light','dark'])for(const [size,viewport] of Object.entries(SIZES)){
  test(`la captura ${level} ${scheme} ${size} coincide píxel a píxel con la referencia`,async({browser},info)=>{
    const shot=async which=>{const p=await browser.newPage({viewport,colorScheme:scheme,reducedMotion:'reduce'});
      await open(p,which,hash);const png=await p.screenshot({fullPage:true});await p.close();return png;};
    const ref=await shot('reference'),dist=await shot('dist');
    if(!dist.equals(ref)){await info.attach('referencia',{body:ref,contentType:'image/png'});await info.attach('generada',{body:dist,contentType:'image/png'});}
    expect(dist.equals(ref),'la captura generada difiere de la referencia (ver adjuntos)').toBe(true);
  });
}
