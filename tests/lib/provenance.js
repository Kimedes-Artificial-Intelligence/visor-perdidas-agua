// De qué archivos procede cada constante de datos de la página.
// Si una constante cambia, el pull request tiene que cambiar al menos uno de sus archivos de origen.
// Los scripts solo cuentan como origen cuando contienen datos escritos a mano (listas de unidades, consumo de hogares).
const ACA_MUNI=['raw/aca2024_extract.psv','raw/aca_annexIII_2022.psv','raw/aca_powerbi_2024_obligats.psv',
  'raw/idescat_pop2025.txt','raw/idescat_comarques_mun.txt','scripts/build_data.js'];
const SOURCES={
  MU:ACA_MUNI,COMS:['raw/idescat_comarques_mun.txt'],URLS:['raw/aca2024_extract.psv'],UNITS:['scripts/build_data.js'],
  CC:['raw/ine53447_2008_2024.txt','raw/ine_hogares_2024.txt','scripts/build_embed.js'],
  OPS:['data/operators.json'],
  // EurEau (transcripción en raw/eureau_ewif2026.psv), INE, SSB y Statistics Iceland, escritos en app.js
  D:['src/app.js','raw/eureau_ewif2026.psv'],M:['src/app.js','raw/eureau_ewif2026.psv'],ESM:['src/app.js'],IDX:['src/app.js'],MG:['src/app.js'],MU_BINS:['src/app.js'],FULL:['src/app.js'],
  GEO:['src/geometry/geo.json'],
  CAT:['src/geometry/cat.json','raw/osm_08215.json'],
  ESP:['package-lock.json','src/geometry/proj.json'],
};

// Constantes que cambiaron sin que cambiara ninguno de sus archivos de origen
function unexplained(changedConsts,changedFiles){
  const files=new Set(changedFiles);
  return changedConsts.filter(c=>!(SOURCES[c]||[]).some(f=>files.has(f)))
    .map(c=>SOURCES[c]?`${c} cambió sin cambios en ${SOURCES[c].join(', ')}`:`${c} cambió y no tiene archivo de origen registrado`);
}
module.exports={SOURCES,unexplained};
