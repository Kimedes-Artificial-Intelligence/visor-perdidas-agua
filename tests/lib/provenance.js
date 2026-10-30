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
  // España por municipio: geometría de es-atlas simplificada en build_geo.js; población del INE; Baleares del Govern IB
  MUN:['package-lock.json','src/geometry/proj.json','scripts/build_geo.js','raw/osm_08215.json'],
  PROV:['package-lock.json','raw/ine_provincias_ccaa.psv'],
  MUD:['raw/ine_padron2025.psv','package-lock.json','raw/idescat_comarques_mun.txt'],
  POP_ES:['raw/ine_padron2025.psv'],
  IB:['raw/caib_abastiment_2000_2024.psv'],
  // España por municipio (FWG-1868): EIEL, SINAC y ESF; la clasificación de operadores es una tabla escrita a mano
  GES:['raw/esf_gestio_aigua_cat_2026-07-10.psv'],
  ESD:['raw/eiel_nucleos_2026-10-30.csv','raw/eiel_rd_2026-10-30.csv','raw/sinac_redes_2026-10-30.csv','raw/esf_gestio_aigua_cat_2026-07-10.psv','data/operadores_clasificacion.csv'],
  OPN:['raw/sinac_redes_2026-10-30.csv','data/operadores_clasificacion.csv'],
  OPT:['data/operadores_clasificacion.csv'],
  EPROV:['raw/eiel_provincias_2026-10-30.csv'],
  FC_BINS:['src/app.js'],
};

// Constantes que cambiaron sin que cambiara ninguno de sus archivos de origen
function unexplained(changedConsts,changedFiles){
  const files=new Set(changedFiles);
  return changedConsts.filter(c=>!(SOURCES[c]||[]).some(f=>files.has(f)))
    .map(c=>SOURCES[c]?`${c} cambió sin cambios en ${SOURCES[c].join(', ')}`:`${c} cambió y no tiene archivo de origen registrado`);
}
module.exports={SOURCES,unexplained};
