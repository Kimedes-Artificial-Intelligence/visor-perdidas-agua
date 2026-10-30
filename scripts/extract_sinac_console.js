// Extracción SINAC: pegar en la consola del navegador en
// https://sinac.sanidad.gob.es/CiudadanoWeb/ciudadano/informacionAbastecimientoActionEntrada.do
// Es el método usado el 30/10/2026 (ver SINAC_EXTRACCION.md). Tarda varias horas. No cerrar la pestaña.
(async () => {
  const S = window._S = { mun: {}, red: {}, err: [], munList: [] };
  const B = '/CiudadanoWeb/ciudadano/';
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  async function post(u, o, tries = 3) {
    for (let k = 0; k < tries; k++) {
      try {
        const r = await fetch(B + u, { method: 'POST', credentials: 'omit', body: new URLSearchParams(o) });
        if (r.ok) return await r.text();
      } catch (e) {}
      await sleep(1500 * (k + 1));
    }
    return null;
  }
  const opts = h => [...(h || '').matchAll(/<option value='([^']+)'>([^<]*)<\/option>/g)].map(m => [m[1], m[2].trim()]);
  function parseDet(h) {
    const d = new DOMParser().parseFromString(h, 'text/html');
    const L = d.body.innerText.split('\n').map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
    const T = L.join(' ');
    const g = (T.match(/Gestor (.*?) Responsable/) || [])[1] || '';
    const resp = (T.match(/Responsable (.*?) Localidades abastecidas/) || [])[1] || '';
    const i0 = L.indexOf('% Población censada abastecida');
    const i1 = L.findIndex((s, i) => i > i0 && /^DOTACION/.test(s));
    const loc = [];
    if (i0 >= 0 && i1 > i0) { const seg = L.slice(i0 + 1, i1); for (let k = 0; k + 2 < seg.length; k += 3) loc.push([seg[k], seg[k + 1], seg[k + 2]]); }
    const dot = (T.match(/DOTACION ([\d.,]+) L\/Hab/) || [])[1] || '';
    const em = (T.match(/Emisor de la factura: (.*?) Bonificaciones/) || [])[1] || '';
    return [g, resp, loc, dot, em];
  }
  // 1-2. Lista de municipios
  for (let c = 1; c <= 19; c++) {
    for (const [pv] of opts(await post('cargarComboProvinciasAction.do', { id: String(c) }))) {
      for (const [mu, n] of opts(await post('cargarComboMunicipiosAction.do', { id: pv }))) S.munList.push([String(c), pv, mu, n]);
    }
  }
  console.log('municipios', S.munList.length);
  // 3-4. Redes y detalle
  let i = 0;
  const worker = async () => {
    while (i < S.munList.length) {
      const [cc, pv, mu, name] = S.munList[i++];
      const h = await post('informacionRedes.do', { codComunidad: cc, codProvincia: pv, codMunicipio: mu, method: 'Buscar' });
      if (!h) { S.err.push('m' + mu); continue; }
      const reds = [...h.matchAll(/eleccionRedDistribucion\((\d+)\)[^>]*>([^<]*)</g)].map(m => [m[1], m[2].trim()]);
      S.mun[mu] = reds.map(r => r[0]);
      for (const [id, den] of reds) {
        if (S.red[id]) continue;
        const dh = await post('informacionAbastecimientoActionDetalleRed.do', { codMunicipio: mu, codProvincia: pv, denMunicipio: name, idRed: id });
        if (dh) { try { S.red[id] = [mu, den, ...parseDet(dh)]; } catch (e) { S.err.push('r' + id); } } else S.err.push('r' + id);
      }
      document.title = `SINAC ${Object.keys(S.red).length} redes · mun ${i}/${S.munList.length}`;
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  // CSV + botón de descarga
  const c = s => s == null ? '' : String(s).replace(/[;\r\n|]/g, ' ').replace(/\s+/g, ' ').trim();
  const txt = 'id_red;mun;denominacion;gestor;responsable;localidades;dotacion_l_hab_dia;emisor_factura\n' +
    Object.entries(S.red).map(([id, a]) => [id, a[0], a[1], a[2], a[3], (a[4] || []).map(l => l.map(c).join(':')).join('|'), a[5], a[6]]
      .map((x, k) => k === 5 ? x : c(x)).join(';')).join('\n') + '\n';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([txt], { type: 'text/csv;charset=utf-8' }));
  a.download = 'sinac_redes.csv'; a.textContent = 'Descargar sinac_redes.csv';
  a.style.cssText = 'position:fixed;top:20px;left:20px;z-index:99999;padding:14px 18px;background:#1f4e79;color:#fff;font:16px sans-serif;border-radius:4px';
  document.body.appendChild(a);
  console.log('FIN', Object.keys(S.red).length, 'redes, errores', S.err.length);
})();
