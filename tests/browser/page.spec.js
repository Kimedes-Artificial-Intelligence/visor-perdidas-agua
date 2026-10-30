// Comportamiento de la página generada en Chromium
const {test,expect}=require('@playwright/test');
const {LEVELS,open,settle,centerOf}=require('./helpers.js');

const crumbs=page=>page.locator('#crumbs button');

for(const scheme of ['light','dark'])for(const [level,hash] of Object.entries(LEVELS)){
  test(`la vista ${level} en modo ${scheme} carga sin errores de JavaScript`,async({browser})=>{
    const page=await browser.newPage({colorScheme:scheme});
    const errors=await open(page,'dist',hash);
    expect(errors).toEqual([]);
  });
}

test('el fondo usa el papel en modo claro y el navy en modo oscuro',async({browser})=>{
  const bg=async scheme=>{const p=await browser.newPage({colorScheme:scheme});await open(p,'dist');return p.evaluate(()=>getComputedStyle(document.body).backgroundColor);};
  expect(await bg('light')).toBe('rgb(242, 239, 233)');
  expect(await bg('dark')).toBe('rgb(22, 44, 64)');
});

test('la navegación Europa, España, Catalunya actualiza el hash y las migas de pan',async({page})=>{
  await open(page,'dist');
  await expect(crumbs(page)).toHaveText(['Europa']);
  await page.click('.lvl button[data-l="es"]');
  await expect(page).toHaveURL(/#espana$/);
  await expect(crumbs(page)).toHaveText(['Europa','España']);
  await page.click('.lvl button[data-l="mu"]');
  await expect(page).toHaveURL(/#municipios$/);
  await expect(crumbs(page)).toHaveText(['Europa','España','Municipios']);
  await page.click('.lvl button[data-l="cat"]');
  await expect(page).toHaveURL(/#catalunya$/);
  await expect(crumbs(page)).toHaveText(['Europa','España','Catalunya']);
  await expect(page.locator('#crumbs button[aria-current="page"]')).toHaveText('Catalunya');
});

test('la miga de pan Europa vuelve al nivel de Europa desde Catalunya',async({page})=>{
  await open(page,'dist',LEVELS.catalunya);
  await page.click('#crumbs button[data-l="eu"]');
  await expect(crumbs(page)).toHaveText(['Europa']);
  await expect(page).not.toHaveURL(/#/);
});

test('el botón atrás del navegador vuelve al nivel anterior',async({page})=>{
  await open(page,'dist',LEVELS.espana);
  await page.evaluate(()=>{location.hash='#catalunya';});
  await expect(crumbs(page)).toHaveText(['Europa','España','Catalunya']);
  await page.goBack();
  await expect(crumbs(page)).toHaveText(['Europa','España']);
});

for(const [level,hash] of Object.entries(LEVELS)){
  test(`a 390 px la vista ${level} no tiene desplazamiento horizontal`,async({browser})=>{
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await open(page,'dist',hash);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
}

test('Balaguer, sin dato, muestra "sin dato publicado" al pasar el ratón y al hacer clic',async({page})=>{
  await open(page,'dist',LEVELS.catalunya);
  const c=await centerOf(page,'#catLayer [data-m="25040"]');
  await page.mouse.move(c.x,c.y);
  await expect(page.locator('#tip')).toBeVisible();
  await expect(page.locator('#tip')).toContainText('Balaguer');
  await expect(page.locator('#tip')).toContainText('Sin dato publicado');
  await page.mouse.click(c.x,c.y);await settle(page);
  await expect(page.locator('#panel')).toContainText('Balaguer');
  await expect(page.locator('#panel')).toContainText('Sin dato publicado. No se estima ningún valor.');
});

// Auditorías 2024 incorporadas el 30/10/2026 (FWG-1870): Sant Quirze no tenía dato; Sant Sadurní pasa de 2022 a 2024
for(const [ine,name,v,host] of [['08238','Sant Quirze del Vallès','35,5','sqvaigua.cat'],['08240',"Sant Sadurní d'Anoia",'23,1','minasalut.com']]){
  test(`${name} muestra el agua no registrada de su auditoría 2024 y el enlace al documento`,async({page})=>{
    await open(page,'dist',LEVELS.catalunya);
    if(await page.locator('#moreBtn').isVisible())await page.click('#moreBtn');
    await page.click(`#rank button[data-k="${ine}"]`);await settle(page);
    const P=page.locator('#panel');
    await expect(P.locator('h2')).toHaveText(name);
    await expect(P.locator('.hero .big')).toContainText(v);
    await expect(P.locator('.hero')).toContainText('2024');
    await expect(P.locator(`.hero a[href*="${host}"]`)).toHaveCount(1);
  });
}

test('Vallirana muestra la auditoría 2024 de la red con más abonados y cita la de la otra red',async({page})=>{
  await open(page,'dist',LEVELS.catalunya);
  if(await page.locator('#moreBtn').isVisible())await page.click('#moreBtn');
  await page.click('#rank button[data-k="08295"]');await settle(page);
  const P=page.locator('#panel');
  await expect(P.locator('.hero .big')).toContainText('42,6');
  await expect(P).toContainText('Dos redes auditadas en 2024: se muestra la del servicio con más abonados (AVALLSA, 5.357 abonados, 42,6 %). La otra red (FCC, 2.218 abonados) publica 51,9 %.');
  await expect(P.locator('.srcs a[href$="Memoria_Vallirana-FCC_2024.pdf"]')).toHaveCount(1);
});

test('Sant Hipòlit de Voltregà (08215) está dibujado y responde al ratón',async({page})=>{
  await open(page,'dist',LEVELS.catalunya);
  const c=await centerOf(page,'#catLayer [data-m="08215"]');
  expect(c.width).toBeGreaterThan(0);expect(c.height).toBeGreaterThan(0);
  await page.mouse.move(c.x,c.y);
  await expect(page.locator('#tip')).toContainText('Sant Hipòlit de Voltregà');
});

// ---- España por municipio
const vb=page=>page.evaluate(()=>document.querySelector('#map').getAttribute('viewBox').split(' ').map(Number));
// Ventana alta para que el mapa entero quede a la vista: el ratón de Playwright no desplaza la página
const openMu=async(page,hash=LEVELS.municipios)=>{await page.setViewportSize({width:1360,height:1300});return open(page,'dist',hash);};

test('#municipios carga los 8.131 municipios y el contador de cobertura',async({page})=>{
  const errors=await openMu(page);
  expect(errors).toEqual([]);
  await expect(page.locator('#muLayer [data-u]')).toHaveCount(8131);
  await expect(page.locator('.lvl button[data-l="mu"]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#maphead')).toHaveText(/^5\.176 de 8\.131 municipios con dato de pérdidas publicado · \d+,\d % de la población de España$/);
  await expect(page.locator('#legend')).toContainText('son tres indicadores distintos');
});

test('la rueda, los botones y el doble clic acercan; restablecer vuelve a toda España',async({page})=>{
  await openMu(page);
  const full=await vb(page);
  const box=await page.locator('#map').boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  await page.mouse.wheel(0,-400);await settle(page);
  expect((await vb(page))[2]).toBeLessThan(full[2]);
  await page.click('#zoomCtl button[data-z="reset"]');await page.waitForTimeout(500);
  expect(await vb(page)).toEqual(full);
  await page.click('#zoomCtl button[data-z="in"]');await page.waitForTimeout(400);
  expect((await vb(page))[2]).toBeCloseTo(full[2]/2,1);
  await page.click('#zoomCtl button[data-z="out"]');await page.waitForTimeout(400);
  await page.mouse.dblclick(box.x+box.width/2,box.y+box.height/2);await page.waitForTimeout(400);
  expect((await vb(page))[2]).toBeCloseTo(full[2]/2,1);
});

test('arrastrar desplaza el mapa sin fijar ningún municipio',async({page})=>{
  await openMu(page);
  await page.click('#zoomCtl button[data-z="in"]');await page.waitForTimeout(400);
  const before=await vb(page);const pinned=await page.locator('#panel h2').innerText();
  const box=await page.locator('#map').boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
  await page.mouse.move(box.x+box.width/2+120,box.y+box.height/2+60,{steps:6});await page.mouse.up();await settle(page);
  await page.mouse.move(2,2);await settle(page);
  const after=await vb(page);
  expect(after[0]).toBeLessThan(before[0]);expect(after[2]).toBeCloseTo(before[2],5);
  await expect(page.locator('#panel h2')).toHaveText(pinned);
});

test('el selector "Ir a comunidad" acerca el mapa a esa comunidad',async({page})=>{
  await openMu(page);
  const full=await vb(page);
  await page.selectOption('#ccgo','04');await page.waitForTimeout(800);
  const v=await vb(page);
  expect(v[2]).toBeLessThan(full[2]/3);
  const b=await centerOf(page,'#muLayer [data-u="07040"]');
  const m=await page.locator('#map').boundingBox();
  expect(b.x).toBeGreaterThan(m.x);expect(b.x).toBeLessThan(m.x+m.width);
  expect(await page.locator('#ccgo option').count()).toBe(20);
});

test('un municipio con dato (Artà) muestra valor, año, fuente y aviso de poca medición real',async({page})=>{
  await openMu(page);
  await page.selectOption('#ccgo','04');await page.waitForTimeout(800);
  const c=await centerOf(page,'#muLayer [data-u="07006"]');
  await page.mouse.move(c.x,c.y);
  await expect(page.locator('#tip')).toContainText('Artà');
  await page.mouse.click(c.x,c.y);await settle(page);
  const P=page.locator('#panel');
  await expect(P.locator('h2')).toHaveText('Artà');
  await expect(P).toContainText('52,71');
  await expect(P).toContainText('2024 · Agua no contabilizada, estimación del Govern IB');
  await expect(P).toContainText('Valor estimado por el Govern, con poca o ninguna medición real');
  await expect(P.locator('.spark')).toBeVisible();
});

test('un municipio sin dato (Madrid) muestra el motivo y el valor INE de su comunidad como contexto',async({page})=>{
  await openMu(page);
  await page.selectOption('#ccgo','13');await page.waitForTimeout(800);
  const c=await centerOf(page,'#muLayer [data-u="28079"]');
  await page.mouse.move(c.x,c.y);
  await expect(page.locator('#tip')).toContainText('Sin dato municipal publicado');
  await page.mouse.click(c.x,c.y);await settle(page);
  const P=page.locator('#panel');
  await expect(P.locator('h2')).toHaveText('Madrid');
  await expect(P).toContainText('Sin dato municipal publicado. No se estima ningún valor.');
  await expect(P).toContainText('Esta provincia no está en el visor nacional de la EIEL');
  await expect(P).toContainText('Agua no registrada, Comunidad de Madrid (INE 2024)');
  await expect(P).toContainText('3.506.730');
});

test('el ranking nacional se filtra por comunidad y fija el municipio al hacer clic',async({page})=>{
  await openMu(page);
  await expect(page.locator('#rankCount')).toHaveText('5.176 municipios con dato de pérdidas publicado');
  await page.selectOption('#rankCc','04');
  await expect(page.locator('#rankCount')).toHaveText('67 municipios con dato de pérdidas publicado en Illes Balears');
  await page.click('#moreBtn');
  await expect(page.locator('#rank button')).toHaveCount(67);
  await page.click('#rank button[data-k="07024"]');
  await expect(page.locator('#panel h2')).toHaveText('Formentera');
});

test('desde el panel de una comunidad se abre la vista por municipio con zoom a esa comunidad',async({page})=>{
  await openMu(page,LEVELS.espana);
  await page.click('#espLayer [data-r="12"]');
  await page.click('#panel button[data-go="mu"]');await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/#municipios$/);
  await expect(page.locator('#ccgo')).toHaveValue('12');
  const {width}=await page.evaluate(()=>({width:+document.querySelector('#map').getAttribute('viewBox').split(' ')[2]}));
  expect(width).toBeLessThan(80);
});

test('un territorio compartido (53xxx) no se fija y lo explica al pasar el ratón',async({page})=>{
  await openMu(page);
  // El territorio compartido más grande, centrado y ampliado
  const id=await page.evaluate(()=>{const e=[...document.querySelectorAll('#muLayer [data-sh]')].sort((a,b)=>b.getBBox().width*b.getBBox().height-a.getBBox().width*a.getBBox().height)[0];
    const b=e.getBBox();animVB([b.x/100-b.width/200,b.y/100-b.height/200,b.width/50,b.height/50],0);return e.dataset.sh;});
  await page.waitForTimeout(200);
  const pt=await page.evaluate(id=>{const e=document.querySelector(`[data-sh="${id}"]`);const r=e.getBoundingClientRect();
    for(let i=0;i<400;i++){const x=r.left+Math.random()*r.width,y=r.top+Math.random()*r.height;if(document.elementFromPoint(x,y)===e)return {x,y};}return null;},id);
  expect(pt).not.toBeNull();
  const pinned=await page.locator('#panel h2').innerText();
  await page.mouse.move(pt.x,pt.y);
  await expect(page.locator('#tip')).toContainText('Territorio compartido entre municipios');
  await page.mouse.click(pt.x,pt.y);
  await expect(page.locator('#panel h2')).toHaveText(pinned);
});

// ---- España por municipio: EIEL, SINAC y modelo de gestión (FWG-1868)
const layer=async(page,g)=>{await page.click(`#segMG button[data-g="${g}"]`);await settle(page);};

test('el selector de capa cambia leyenda, contador y color; fibrocemento y estado solo existen en la vista España',async({page})=>{
  await openMu(page);
  const fill=()=>page.locator('#muLayer [data-u="11002"]').evaluate(e=>e.style.fill);
  const lossFill=await fill();
  await layer(page,'ges');
  await expect(page.locator('#maphead')).toHaveText(/^7\.528 de 8\.131 municipios con modelo de gestión/);
  await expect(page.locator('#legend')).toContainText('Vecinal / cooperativa');
  expect(await fill()).toBe('var(--g-p)');
  await layer(page,'fc');
  await expect(page.locator('#maphead')).toHaveText(/^5\.653 de 8\.131 municipios con material de la red/);
  expect(await fill()).not.toBe(lossFill); // 46 % de fibrocemento frente a 25 % de pérdidas
  await layer(page,'est');
  await expect(page.locator('#legend')).toContainText('estado malo o regular');
  await page.click('.lvl button[data-l="cat"]');
  await expect(page.locator('#segMG button[data-g="fc"]')).toBeHidden();
  await expect(page.locator('#segMG button[data-g="loss"]')).toHaveAttribute('aria-pressed','true');
});

test('un municipio EIEL (Alcalá del Valle) muestra pérdidas declaradas, gestión, operador, red y sus fuentes',async({page})=>{
  await openMu(page);
  await page.evaluate(()=>pin('11002'));
  const P=page.locator('#panel');
  await expect(P.locator('h2')).toHaveText('Alcalá del Valle');
  await expect(P.locator('.hero .big')).toHaveText('25,0%');
  await expect(P).toContainText('Dato declarado por el ayuntamiento, no medido. 1 de 1 núcleos informan');
  await expect(P).toContainText('Mancomunidad 100 %');
  await expect(P).toContainText('AGUAS SIERRA DE CÁDIZ, S.A');
  await expect(P).toContainText('46 % de la red');
  await expect(P.locator('.srcs li')).toHaveCount(4);
  await expect(P.locator('.srcs')).toContainText('fase 2025 de la provincia');
  await expect(P.locator('.srcs')).toContainText('CC BY-NC-SA 4.0');
});

test('Madrid: sin pérdidas, gestión municipalizada por el operador del SINAC (Canal de Isabel II)',async({page})=>{
  await openMu(page);
  await page.evaluate(()=>pin('28079'));
  const P=page.locator('#panel');
  await expect(P).toContainText('Sin dato municipal publicado. No se estima ningún valor.');
  await expect(P.locator('.gtag')).toHaveText('Municipalizado');
  await expect(P).toContainText('SINAC, operador principal clasificado por su nombre');
  await expect(P).toContainText('CANAL DE ISABEL II, S.A.M.P.');
});

test('País Vasco: se muestra el responsable en lugar de EKUIS y no se infiere el modelo',async({page})=>{
  await openMu(page);
  await page.evaluate(()=>pin('48020'));
  const P=page.locator('#panel');
  await expect(P).toContainText('AYUNTAMIENTO DE BILBAO');
  await expect(P).toContainText('responsable');
  await expect(P).not.toContainText('EKUIS');
  await expect(P.locator('.gtag')).toHaveText('Sin dato');
  await expect(P).toContainText('País Vasco y Navarra quedan fuera de la EIEL por ley');
});

test('el filtro por operador "FCC AQUALIA" resalta sus municipios, da el recuento y filtra el ranking',async({page})=>{
  await openMu(page);
  await page.fill('#opq','FCC AQUALIA');
  await expect(page.locator('#opCount')).toHaveText(/^\d{3} municipios · [\d.]+ hab\. \(padrón 2025\)$/);
  const n=+(await page.locator('#opCount').innerText()).split(' ')[0];
  await expect(page.locator('#muLayer .um.opm')).toHaveCount(n);
  await expect(page.locator('#muLayer')).toHaveClass(/opf/);
  await expect(page.locator('#rankCount')).toContainText('operador «FCC AQUALIA»');
  await page.selectOption('#rankGm','V');
  await expect(page.locator('#rankCount')).toContainText('privada (utility)');
  await page.fill('#opq','');
  await expect(page.locator('#muLayer')).not.toHaveClass(/opf/);
});

test('Exportar CSV descarga el ranking filtrado completo',async({page})=>{
  await openMu(page);
  await page.selectOption('#rankCc','04');
  const [dl]=await Promise.all([page.waitForEvent('download'),page.click('#csvBtn')]);
  const text=(await (await dl.createReadStream()).toArray()).join('');
  const lines=text.replace(/^\ufeff/,'').trim().split('\r\n');
  expect(lines[0].split(';').slice(0,3)).toEqual(['codigo_ine','municipio','provincia']);
  expect(lines.length-1).toBe(67);
  expect(lines.find(l=>l.startsWith('07024;'))).toContain('Formentera');
});
