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
  await page.setViewportSize({width:1280,height:1000}); // el mapa entero a la vista: el ratón de Playwright no desplaza la página
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
  await page.setViewportSize({width:1280,height:1000}); // el mapa entero a la vista: el ratón de Playwright no desplaza la página
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
  await expect(page.locator('#maphead')).toHaveText(/^5\.178 de 8\.131 municipios con dato de pérdidas publicado · \d+,\d % de la población de España$/);
  await expect(page.locator('#legend')).toContainText('son indicadores distintos');
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
  await expect(P).toContainText('El operador no publica el indicador del art. 63.2 del RD 3/2023 para este municipio a fecha 30/10/2026: solo da la cifra de todo su sistema');
  await expect(P).toContainText('MITECO no publica por municipio la evaluación de fugas estructurales de 2024 (RD 3/2023), solo un resumen; la solicitud de acceso a la tabla municipal está pendiente de presentar.');
  await expect(P).toContainText('Agua no registrada, Comunidad de Madrid (INE 2024)');
  await expect(P).toContainText('3.506.730');
});

// ---- Pérdidas publicadas por el operador (art. 63.2 RD 3/2023, FWG-1870)
test('Córdoba: el agua no registrada del operador se pinta con la escala, con trama propia, y la ficha da el IFE y la fuente',async({page})=>{
  await openMu(page);
  expect(await page.locator('#muLayer [data-u="14021"]').evaluate(e=>e.style.fill)).toBe('rgb(159, 211, 192)'); // 8,45 % -> tramo < 10 %
  expect(await page.locator('#muLayer .umop').getAttribute('d')).not.toBe('');
  await page.evaluate(()=>pin('14021'));
  const P=page.locator('#panel');
  await expect(P.locator('.hero .lbl')).toHaveText('Agua no registrada');
  await expect(P.locator('.hero .big')).toHaveText('8,5%');
  await expect(P.locator('.hero')).toContainText('2025 · Agua no registrada publicada por el operador (art. 63.2 RD 3/2023)');
  await expect(P).toContainText('Índice de fugas estructurales (IFE) 2025');
  await expect(P).toContainText('2,02');
  await expect(P.locator('.srcs a[href*="emacsa.es"]')).toHaveCount(1);
  await expect(P.locator('.srcs')).toContainText('Aviso legal');
});
test('Granada: el operador solo publica el rendimiento; no se pinta en la escala ni se convierte',async({page})=>{
  await openMu(page);
  expect(await page.locator('#muLayer [data-u="18087"]').evaluate(e=>e.style.fill)).toContain('dotsOt');
  await page.evaluate(()=>pin('18087'));
  const P=page.locator('#panel');
  await expect(P.locator('.hero .lbl')).toHaveText('Indicador publicado por el operador');
  await expect(P.locator('.hero .big')).toHaveText('80,98%');
  await expect(P.locator('.hero')).toContainText('Rendimiento técnico hidráulico · 2025 · EMASAGRA');
  await expect(P).toContainText('no es un porcentaje de pérdidas: no se pinta en la escala de pérdidas ni se convierte');
  await expect(P.locator('#rank button[data-k="18087"]')).toHaveCount(0);
});
for(const [ine,name,txt] of [['30027','Molina de Segura','su aviso legal prohíbe expresamente extraer y reutilizar sus contenidos'],
  ['36057','Vigo','su web no admite consultas automatizadas (30/10/2026). Pendiente de revisión manual'],
  ['29067','Málaga','El operador no publica el indicador del art. 63.2 del RD 3/2023 a fecha 30/10/2026.']])
  test(`${name}: sin dato, el motivo dice el resultado exacto de la búsqueda del art. 63.2`,async({page})=>{
    await openMu(page);await page.evaluate(id=>pin(id),ine);
    const P=page.locator('#panel');
    await expect(P.locator('h2')).toHaveText(name);
    await expect(P).toContainText('Sin dato municipal publicado');
    await expect(P).toContainText(txt);
  });

test('el ranking nacional se filtra por comunidad y fija el municipio al hacer clic',async({page})=>{
  await openMu(page);
  await expect(page.locator('#rankCount')).toHaveText('5.178 municipios con dato de pérdidas publicado');
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
  await expect(page.locator('#maphead')).toHaveText(/^7\.581 de 8\.131 municipios con modelo de gestión/);
  await expect(page.locator('#legend')).toContainText('Vecinal / cooperativa');
  expect(await fill()).toBe('var(--g-p)');
  await layer(page,'fc');
  await expect(page.locator('#maphead')).toHaveText(/^5\.808 de 8\.131 municipios con material de la red/);
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

test('Granada: el operador clasificado con fuente (EMASAGRA, mixta) da el modelo, el grupo y su fuente en la ficha',async({page})=>{
  await openMu(page);
  await page.evaluate(()=>pin('18087'));
  const P=page.locator('#panel');
  await expect(P.locator('h2')).toHaveText('Granada');
  await expect(P.locator('.gtag')).toHaveText('Mixta');
  await expect(P).toContainText('EMASAGRA');
  await expect(P).toContainText('Mixto · Hidralia (Veolia y Unicaja)');
  await expect(P.locator('.srcs a[href="https://www.emasagra.es/informacion-corporativa"]')).toHaveCount(1);
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

test('Comunidad de Madrid: la red sale de la EIEL de la IDEM (CC BY 4.0) y la ficha explica que no publica pérdidas',async({page})=>{
  await openMu(page);
  await page.evaluate(()=>pin('28001'));
  const P=page.locator('#panel');
  await expect(P.locator('h2')).toHaveText('La Acebeda');
  await expect(P).toContainText('La EIEL de la Comunidad de Madrid (fase 2023, IDEM) publica la red de distribución pero no las pérdidas por núcleo');
  await expect(P).toContainText('Red de distribución (EIEL 2023, Comunidad de Madrid)');
  await expect(P.locator('.srcs')).toContainText('CC BY 4.0 Comunidad de Madrid');
  await expect(P.locator('.srcs')).not.toContainText('CC BY-NC-SA');
});

test('Almonte (20.000-50.000 hab., provincia sin EIEL): la ficha municipal del RD 3/2023 de GIAHSA da rendimiento e IFE, sin pintar pérdidas',async({page})=>{
  await openMu(page);
  expect(await page.locator('#muLayer [data-u="21005"]').evaluate(e=>e.style.fill)).toContain('dotsOt');
  await page.evaluate(()=>pin('21005'));
  const P=page.locator('#panel');
  await expect(P.locator('.hero .big')).toHaveText('65,87%');
  await expect(P).toContainText('Índice de fugas estructurales (IFE) 2025');
  await expect(P).toContainText('2,98');
  await expect(P.locator('.srcs a[href*="giahsa.com"]')).toHaveCount(1);
});

test('Irun: el modelo sale del operador en baja que nombra su propia fuente (Servicios de Txingudi) y la pérdida, del estado de la búsqueda',async({page})=>{
  await openMu(page);
  await page.evaluate(()=>pin('20045'));
  const P=page.locator('#panel');
  await expect(P.locator('h2')).toHaveText('Irun');
  await expect(P.locator('.gtag')).toHaveText('Municipalizado');
  await expect(P).toContainText('Operador que distribuye el agua según su propia fuente');
  await expect(P).toContainText('SERVICIOS DE TXINGUDI');
  await expect(P.locator('.srcs a[href="https://txinzer.eus/zer-egiten-dugu/uraren-kudeaketa/"]')).toHaveCount(1);
  await expect(P).toContainText('Servicios de Txingudi publica el rendimiento de su red conjunta de Irun y Hondarribia');
});

test('País Vasco: se muestra el responsable en lugar de EKUIS y no se infiere el modelo',async({page})=>{
  await openMu(page);
  await page.evaluate(()=>pin('48020'));
  const P=page.locator('#panel');
  await expect(P).toContainText('AYUNTAMIENTO DE BILBAO');
  await expect(P).toContainText('responsable');
  await expect(P).not.toContainText('EKUIS');
  await expect(P.locator('.gtag')).toHaveText('Sin dato');
  await expect(P).toContainText('El Consorcio de Aguas Bilbao Bizkaia solo publica el rendimiento de su red primaria (en alta)');
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

// ---- Herramientas de venta (FWG-1870, Parte 6)
test('ficha de operador "FCC AQUALIA": municipios, población, pérdidas medias por fuente sin mezclar indicadores y exportación',async({page})=>{
  await openMu(page);
  await page.fill('#opq','FCC AQUALIA');
  await expect(page.locator('#opCount')).toHaveText(/^\d{3} municipios/);
  const n=(await page.locator('#opCount').innerText()).split(' ')[0];
  const P=page.locator('#panel');
  await expect(P.locator('h2')).toHaveText('FCC AQUALIA');
  await expect(P).toContainText('Ficha de operador');
  await expect(P).toContainText('Municipios donde opera'+n);
  await expect(P).toContainText('Tipo'+'Privado (utility)');
  await expect(P).toContainText('calculada por Kimedes por separado para cada fuente');
  await expect(P.locator('#opCsv')).toBeVisible();
});
test('ficha de operador "CANAL DE ISABEL II": da las cifras de todo su sistema, sin asignarlas a un municipio',async({page})=>{
  await openMu(page);
  await page.fill('#opq','CANAL DE ISABEL II');
  const P=page.locator('#panel');
  await expect(P).toContainText('Pérdidas reales 2025 · Toda la empresa: Comunidad de Madrid y Delegación de Cáceres');
  await expect(P).toContainText('Agua no registrada 2024 · Toda la empresa');
  await expect(P).toContainText('13,44');
  await expect(P.locator('a[href*="canaldeisabelsegunda.es"]').first()).toBeVisible();
});
test('filtro de calidad del dato: filtra ranking y mapa, y aparece en el ranking',async({page})=>{
  await openMu(page);
  await page.selectOption('#rankQ','art63');
  await expect(page.locator('#rankCount')).toHaveText('2 municipios con dato de pérdidas publicado · publicado por el operador (art. 63.2 rd 3/2023)');
  await expect(page.locator('#muLayer')).toHaveClass(/opf/);
  await expect(page.locator('#rank button')).toHaveCount(2);
  await expect(page.locator('#rank')).toContainText('operador');
  await page.selectOption('#rankQ','eiel5');
  const n=+(await page.locator('#rankCount').innerText()).split(' ')[0].replace('.','');
  expect(n).toBeGreaterThan(1000);
  await expect(page.locator('#rank .yr').first()).toContainText('EIEL ×5');
});
test('filtro de provincia y búsqueda por nombre: la provincia depende de la comunidad y un solo resultado se fija',async({page})=>{
  await openMu(page);
  await page.selectOption('#rankCc','01');
  await page.selectOption('#rankPv','11');
  await expect(page.locator('#rankCount')).toContainText('provincia de Cádiz');
  await page.fill('#muq','Alcalá del Valle');
  await expect(page.locator('#panel h2')).toHaveText('Alcalá del Valle');
  await expect(page.locator('#muLayer .um.opm')).toHaveCount(1);
});
test('capa de prioridad comercial: quintiles, leyenda que dice que es un cálculo, ficha con sus factores y CSV con las entradas',async({page})=>{
  await openMu(page);
  await layer(page,'pri');
  await expect(page.locator('#legend')).toContainText('Índice Kimedes, calculado a partir de fuentes citadas');
  await expect(page.locator('#legend')).toContainText('No es un dato publicado');
  await expect(page.locator('#rankTitle')).toContainText('Prioridad comercial');
  await expect(page.locator('#rank button').first().locator('.v')).toHaveText(/^Q5 · \d,\d{3}$/);
  await page.evaluate(()=>pin('28079'));
  await expect(page.locator('#panel')).toContainText('Prioridad comercial (Índice Kimedes)');
  await expect(page.locator('#panel')).toContainText('Pérdidas (sin dato publicado)');
  const [dl]=await Promise.all([page.waitForEvent('download'),page.click('#csvBtn')]);
  const csv=require('fs').readFileSync(await dl.path(),'utf8');
  expect(csv.split('\r\n')[0]).toContain('indice_prioridad_kimedes;quintil_prioridad;factor_poblacion;factor_perdidas;factor_fibrocemento;factor_antiguedad_eiel;factor_modelo');
  expect(csv.split('\r\n').length).toBe(8132);
});

// ---- Vista internacional (FWG-1870, Parte 7)
test('vista internacional: Italia por región y capital, con el indicador exacto de ISTAT y el estado de los demás países',async({page})=>{
  await page.setViewportSize({width:1360,height:1300});await open(page,'dist','#internacional');
  await expect(page.locator('#crumbs button')).toHaveText(['Europa','Internacional']);
  await expect(page.locator('#intLayer .ir')).toHaveCount(20);
  await expect(page.locator('#intLayer .ic')).toHaveCount(109);
  await expect(page.locator('#legend')).toContainText('Perdite idriche totali: % del agua inmessa en la red de distribución');
  await expect(page.locator('#legend')).toContainText('Oriente Medio: no hay fuente pública con granularidad subnacional');
  await expect(page.locator('#panel')).toContainText('Estado por país (30/10/2026)');
  await expect(page.locator('#panel')).toContainText('Inglaterra y GalesSin licencia de reutilización verificada');
  await expect(page.locator('#rank button')).toHaveCount(40);
  await expect(page.locator('#rank button').first()).toContainText('Potenza');
  await page.click('#rank button[data-k="c076063"]');await settle(page);
  const P=page.locator('#panel');
  await expect(P.locator('h2')).toHaveText('Potenza');
  await expect(P.locator('.hero .big')).toHaveText('71,0%');
  await expect(P).toContainText('Capital de provincia · Basilicata · Italia');
  await expect(P.locator('.srcs')).toContainText('CC BY 4.0');
  expect(await page.locator('#intLayer [data-it="c015146"]').evaluate(e=>e.style.fill)).toBe('rgb(241, 217, 138)'); // Milano 13,4 %
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
