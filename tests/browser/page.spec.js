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

test('Sant Hipòlit de Voltregà (08215) está dibujado y responde al ratón',async({page})=>{
  await open(page,'dist',LEVELS.catalunya);
  const c=await centerOf(page,'#catLayer [data-m="08215"]');
  expect(c.width).toBeGreaterThan(0);expect(c.height).toBeGreaterThan(0);
  await page.mouse.move(c.x,c.y);
  await expect(page.locator('#tip')).toContainText('Sant Hipòlit de Voltregà');
});
