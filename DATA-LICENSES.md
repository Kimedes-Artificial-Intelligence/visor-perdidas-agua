# Licencias de los datos

El código de este repositorio se publica con licencia MIT (`LICENSE`). Esa licencia no se aplica a los datos: cada archivo de `raw/` y `data/` conserva las condiciones de su fuente original, que se resumen aquí.

Condiciones comprobadas el 21 y el 22 de octubre de 2026 (EurEau, IGN y origen de las geometrías de la v1 revisados en la auditoría del 22 de octubre). Lo que no se ha podido confirmar en una página oficial se marca como **pendiente de verificar**.

## Por fuente

| Fuente | Licencia o condiciones | Atribución | Página que lo confirma |
|---|---|---|---|
| ACA (Agència Catalana de l'Aigua): registro de auditorías, anexo III de la *Avaluació comparativa* y Power BI de municipios obligados | **Llicència oberta d'ús d'informació - Catalunya**, del aviso legal de la Generalitat, que se aplica a aca.gencat.cat. Obliga a citar la fuente y la fecha de actualización de la información, y a no desnaturalizar su sentido. No permite usar logos ni marcas de la Generalitat. | "Generalitat de Catalunya. Agència Catalana de l'Aigua", con la fecha de actualización de cada archivo (tabla de abajo) | https://tramits.gencat.cat/ca/ajuda/avis_legal/ |
| INE: tabla 53447 (ESSA) y nota de prensa ESSA 2024 | **CC BY 4.0**, salvo indicación en contra. Condiciones: no desnaturalizar la información, indicar la fecha de actualización y no sugerir que el INE respalda el uso. | "Elaboración propia con datos extraídos del sitio web del INE: www.ine.es" | https://ine.es/dyngs/AYU/es/index.htm?cid=125 |
| Idescat: padrón municipal 2025 y EMEX | Sin licencia Creative Commons declarada. Permite reutilizar con condiciones: no alterar el contenido ni su sentido, indicar la fecha de actualización y no sugerir respaldo. Las condiciones de la API prohíben modificar datos, metadatos y enlaces. | "Font: elaboració pròpia a partir de dades de l'Idescat" | https://www.idescat.cat/institut/web/ · https://www.idescat.cat/dev/api/?lang=ca |
| EurEau, *Europe's Water in Figures* | Sin licencia ni condiciones de reutilización publicadas. Comprobado el 22 de octubre de 2026: la página del informe en eureau.org y el pie de la web solo dicen "Copyright EurEau 2026" y no existe página de aviso legal. Se citan cifras puntuales con su fuente, como datos de hecho, sin reproducir el informe. | "EurEau, Europe's Water in Figures 2026" | https://eureau.org/publications/ (categoría Reports & Annual Reports, 23 de junio de 2026) |
| es-atlas 0.6.0 (geometría de municipios y comunidades) | Código del paquete: **MIT**. Geometría: el script de generación del paquete descarga las *Líneas límite municipales* del Centro de Descargas del CNIG (descarga 9000029, licencia 15), producto del Instituto Geográfico Nacional bajo **CC BY 4.0** (Orden FOM/2807/2015). La licencia del IGN exige, para obras derivadas, la fórmula "Obra derivada de <producto> <fecha> CC-BY 4.0 <productores>", visible a pie de mapa o en los créditos; admite la forma abreviada "CC-BY 4.0 <productores> <fecha>". Los códigos y nombres de municipio proceden del INE. | "Obra derivada de las Líneas límite municipales CC-BY 4.0 ign.es" (versión 0.6.0 del paquete, publicada el 10 de febrero de 2024; el IGN no fecha el producto en el paquete) | https://github.com/martgnz/es-atlas · https://www.ign.es/resources/licencia/Condiciones_licenciaUso_IGN.pdf |
| OpenStreetMap: límite de Sant Hipòlit de Voltregà (08215), relación 343447 | **ODbL 1.0**: atribución y compartir igual. Los archivos con esta geometría son una base de datos derivada y se distribuyen bajo ODbL. La página generada es una obra producida y muestra la atribución. | "© OpenStreetMap contributors", con enlace a https://www.openstreetmap.org/copyright | https://www.openstreetmap.org/copyright · https://osmfoundation.org/wiki/Licence/Attribution_Guidelines |
| SSB (Statistics Norway) | CC BY 4.0 | "Statistics Norway" | https://www.ssb.no/en/diverse/lisens |
| Statistics Iceland | CC BY 4.0 | "Statistics Iceland" | https://statice.is/publications/open-data-access |
| Auditorías 2024 de cada operador (enlazadas desde el registro de la ACA) | Documentos publicados por obligación legal (disposició addicional 26a del Decret Legislatiu 3/2003, en la redacción que obliga a publicar la auditoría en la web de la entidad). Se transcriben solo los indicadores numéricos, que son datos de hecho, con la URL de origen; no se reproduce ningún texto ni gráfico. Condiciones de reutilización de cada operador: **pendiente de verificar** (87 documentos distintos a 30 de octubre de 2026; el aviso legal de cada web no se ha revisado uno a uno). | URL de origen por municipio en `raw/aca2024_extract.psv` | Registro de la ACA (ver `data/sources.md`) |
| Govern de les Illes Balears, Servei de Planificació (Portal de l'Aigua): *Resum anual de dades d'abastiment urbà d'aigua, anys 2000 a 2024* | **Creative Commons Reconeixement-Compartir Igual (by-sa)**, según el aviso legal de la CAIB, que se aplica a caib.es. El aviso no indica la versión: **pendiente de confirmar con la CAIB**; se usará 4.0 solo si la CAIB lo confirma. Compartir igual: los datos de Baleares y sus derivados (`raw/caib_abastiment_2000_2024.psv`, `data/espmun.json` y la constante `IB` de la página) se distribuyen con la misma licencia. | "Font: Govern de les Illes Balears, Servei de Planificació. Dades d'abastiment urbà 2000-2024. Consulta 22/10/2026" | https://www.caib.es/webgoib/aviso-legal · https://www.caib.es/sites/aigua/ca/proveament_distribucia_potabilitzacia/ |
| INE: cifras oficiales de población, Revisión del Padrón municipal a 1/1/2025 (`pobmun25.xlsx`) | **CC BY 4.0**, como el resto del INE (ver la fila del INE). | "Elaboración propia con datos extraídos del sitio web del INE: www.ine.es" | https://ine.es/dyngs/AYU/es/index.htm?cid=125 |
| Webs de operadores (`data/operators.json`) | Solo se citan nombres y enlaces; no se reproduce contenido. | No aplica | No aplica |
| EIEL, Encuesta de Infraestructura y Equipamientos Locales (visor GEO-EIEL): núcleos, tramos de red y fases por provincia | **CC BY-NC-SA 4.0** según el ticket FWG-1868: atribución, **sin uso comercial** y compartir igual. Los archivos derivados (`raw/eiel_*`, `data/es_mun.json`, constantes `ESD` y `EPROV`) se distribuyen con la misma licencia. **Pendiente de verificar** en una página oficial de la EIEL y de valorar el uso comercial del visor (ver `data/sources.md`). | "© Secretaría de Estado de Política Territorial", con la fase de cada provincia | https://eiel.redsara.es/visor/ |
| SINAC, Ministerio de Sanidad: consulta ciudadana de redes de distribución | Información pública del Ministerio. Condiciones de reutilización: **pendiente de verificar**. Se citan en cada ficha el gestor, el responsable, la población abastecida y la dotación de cada red. | "Ministerio de Sanidad, SINAC", con la fecha de extracción | https://sinac.sanidad.gob.es/CiudadanoWeb/ |
| Enginyeria Sense Fronteres / Aigua és Vida, *La Gestió de l'Aigua a Catalunya per Municipi* (Datawrapper F298j v45) | **Derechos de sus autores**: sin licencia de reutilización publicada. Se usa con cita en cada ficha de Catalunya, por decisión del ticket FWG-1868. | "Enginyeria Sense Fronteres (ESF) · Aigua és Vida", con la versión y la fecha de actualización (10/07/2026) | https://datawrapper.dwcdn.net/F298j/45/ |
| Tabla de clasificación de operadores (`data/operadores_clasificacion.csv`) | Tabla propia de Kimedes | MIT | |

## Por archivo

| Archivo | Fuente | Licencia | Actualización de la fuente |
|---|---|---|---|
| `raw/aca_annexIII_2022.psv` | ACA, anexo III (xlsx) | Llicència oberta d'ús d'informació - Catalunya | Mayo de 2025, datos 2022 |
| `raw/aca_informe2025_annexIII_pdf.psv` | ACA, informe de evaluación comparativa (PDF) | Llicència oberta d'ús d'informació - Catalunya | Mayo de 2025 (archivo modificado el 3 de julio de 2025), datos 2022 |
| `raw/aca_powerbi_2024_obligats.psv` | ACA, registro de auditorías | Llicència oberta d'ús d'informació - Catalunya | Consultado el 19 de octubre de 2026 |
| `raw/aca2024_extract.psv` | Auditorías 2024 de los operadores | Pendiente de verificar | Una URL por municipio |
| `raw/aca2024_notes.txt` | Notas propias sobre las auditorías 2024 | MIT | |
| `raw/eureau_ewif2026.psv` | EurEau, Europe's Water in Figures 2026, anexo de datos | Pendiente de verificar (solo "Copyright EurEau 2026") | 23 de junio de 2026 |
| `raw/ine53447_2008_2024.txt` | INE | CC BY 4.0 | Consultado el 19 de octubre de 2026 |
| `raw/ine_hogares_2024.txt` | INE, nota de prensa | CC BY 4.0 | 2 de julio de 2026 |
| `raw/idescat_pop2025.txt` | Idescat | Condiciones de reutilización de Idescat | Padrón a 1 de enero de 2025 |
| `raw/idescat_comarques_mun.txt` | Idescat | Condiciones de reutilización de Idescat | Consultado el 19 de octubre de 2026 |
| `raw/osm_08215.json` | OpenStreetMap | **ODbL 1.0** | |
| `raw/caib/*.xlsx`, `raw/caib/*.ods` | Govern de les Illes Balears, originales descargados el 22/10/2026 | **CC BY-SA** (versión pendiente de confirmar) | Datos 2000-2024 |
| `raw/caib_abastiment_2000_2024.psv` | Govern de les Illes Balears, transcripción generada por `scripts/extract_caib.js` | **CC BY-SA** (versión pendiente de confirmar) | Consultado el 22 de octubre de 2026 |
| `raw/caib_cruce_ine.psv` | Tabla propia: nombres de la fuente CAIB y códigos y nombres de es-atlas (INE) | La de cada fuente | |
| `raw/ine/pobmun25.xlsx` | INE, padrón municipal | CC BY 4.0 | Padrón a 1 de enero de 2025 (archivo de noviembre de 2025) |
| `raw/ine_padron2025.psv` | INE, transcripción generada por `scripts/extract_ine_padron.js` | CC BY 4.0 | Padrón a 1 de enero de 2025 |
| `raw/ine_provincias_ccaa.psv` | INE, relación de provincias y comunidades | CC BY 4.0 | |
| `data/m08215.txt` | OpenStreetMap, proyectado | **ODbL 1.0** | |
| `data/muni.json` | ACA, auditorías 2024 e Idescat | La de cada fuente | |
| `data/ccaa.json` | INE | CC BY 4.0 | |
| `data/esp.json` | es-atlas (IGN) | CC BY 4.0 | |
| `data/esmun.json` | es-atlas (IGN) y, para 08215, OpenStreetMap | CC BY 4.0; **ODbL 1.0** por la geometría de 08215 | |
| `data/espmun.json` | INE (padrón) y Govern de les Illes Balears | CC BY 4.0 y **CC BY-SA** (datos de Baleares) | |
| `data/operators.json` | Webs de operadores | No aplica | |
| `raw/eiel_nucleos_2026-10-30.csv`, `raw/eiel_rd_2026-10-30.csv`, `raw/eiel_provincias_2026-10-30.csv` | EIEL, extracción de `scripts/extract_eiel.js` | **CC BY-NC-SA 4.0** (pendiente de verificar) | Fase de cada provincia (2016-2025); extracción 29-30/10/2026 |
| `raw/sinac_redes_2026-10-30.csv` | SINAC, Ministerio de Sanidad | Pendiente de verificar | Extracción 30/10/2026 |
| `raw/esf_gestio_aigua_cat_2026-07-10.psv` | ESF / Aigua és Vida, transcripción exacta | Derechos de sus autores | Actualización 10/07/2026 |
| `data/es_mun.json` | EIEL, SINAC y ESF, agregados por `scripts/build_es_mun.js` | La de cada fuente; **CC BY-NC-SA 4.0** por los datos EIEL | |
| `data/operadores_clasificacion.csv` | Tabla propia | MIT | |
| `data/operadores_sin_clasificar.csv` | Nombres de gestores del SINAC, generado | La del SINAC | |
| `src/geometry/cat.json` | es-atlas (IGN) | CC BY 4.0 | |
| `src/geometry/geo.json` | Geometría de países de la v1, ya proyectada (ETRS89-LAEA) y sin metadatos. Origen: **pendiente de verificar**; la auditoría del 22 de octubre de 2026 no ha podido determinarlo a partir del archivo | Pendiente de verificar | |
| `src/geometry/ctx_path.txt` | Geometría de contexto de la v1, ya proyectada y sin metadatos. Origen: **pendiente de verificar** (misma situación que `geo.json`) | Pendiente de verificar | |
| Constantes `D`, `M` y `ESM` en `src/app.js` | EurEau, INE, SSB y Statistics Iceland | La de cada fuente. EurEau: sin licencia publicada, solo "Copyright EurEau 2026" (ver arriba) | |

## Archivos bajo ODbL

`raw/osm_08215.json`, `data/m08215.txt` y `data/esmun.json` (solo el trazado de 08215) contienen datos de OpenStreetMap y se distribuyen bajo la Open Database License 1.0 (https://opendatacommons.org/licenses/odbl/1-0/). Cualquier copia o derivado de esos archivos debe mantener la atribución "© OpenStreetMap contributors" y la misma licencia. La página generada en `dist/` incluye esa geometría como obra producida y muestra la atribución.

## Fuentes excluidas

**3Cat/ACN** (gráfico Datawrapper Zh2fK, octubre de 2024). Su aviso legal reserva todos los derechos y prohíbe distribuir y extraer datos del portal (https://www.3cat.cat/avis-legal/condicions-utilitzacio-del-portal/). No se usa en este repositorio. Los municipios que solo tenían ese dato aparecen como "sin dato publicado".
