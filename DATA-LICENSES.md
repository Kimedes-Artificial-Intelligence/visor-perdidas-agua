# Licencias de los datos

El código de este repositorio se publica con licencia MIT (`LICENSE`). Esa licencia no se aplica a los datos: cada archivo de `raw/` y `data/` conserva las condiciones de su fuente original, que se resumen aquí.

Condiciones comprobadas el 21 y el 22 de octubre de 2026. Lo que no se ha podido confirmar en una página oficial se marca como **pendiente de verificar**.

## Por fuente

| Fuente | Licencia o condiciones | Atribución | Página que lo confirma |
|---|---|---|---|
| ACA (Agència Catalana de l'Aigua): registro de auditorías, anexo III de la *Avaluació comparativa* y Power BI de municipios obligados | **Llicència oberta d'ús d'informació - Catalunya**, del aviso legal de la Generalitat, que se aplica a aca.gencat.cat. Obliga a citar la fuente y la fecha de actualización de la información, y a no desnaturalizar su sentido. No permite usar logos ni marcas de la Generalitat. | "Generalitat de Catalunya. Agència Catalana de l'Aigua", con la fecha de actualización de cada archivo (tabla de abajo) | https://tramits.gencat.cat/ca/ajuda/avis_legal/ |
| INE: tabla 53447 (ESSA) y nota de prensa ESSA 2024 | **CC BY 4.0**, salvo indicación en contra. Condiciones: no desnaturalizar la información, indicar la fecha de actualización y no sugerir que el INE respalda el uso. | "Elaboración propia con datos extraídos del sitio web del INE: www.ine.es" | https://ine.es/dyngs/AYU/es/index.htm?cid=125 |
| Idescat: padrón municipal 2025 y EMEX | Sin licencia Creative Commons declarada. Permite reutilizar con condiciones: no alterar el contenido ni su sentido, indicar la fecha de actualización y no sugerir respaldo. Las condiciones de la API prohíben modificar datos, metadatos y enlaces. | "Font: elaboració pròpia a partir de dades de l'Idescat" | https://www.idescat.cat/institut/web/ · https://www.idescat.cat/dev/api/?lang=ca |
| EurEau, *Europe's Water in Figures* | **Pendiente de verificar.** Ni las publicaciones (ediciones 2021 y 2026) ni la web tienen licencia o condiciones de reutilización; solo "Copyright EurEau". Se citan cifras puntuales con su fuente. | "EurEau, Europe's Water in Figures" | https://www.eureau.org |
| es-atlas 0.6.0 (geometría de municipios y comunidades) | Código del paquete: **MIT**. Geometría: Instituto Geográfico Nacional (CNIG), **CC BY 4.0** según el README del paquete; los códigos y nombres de municipio proceden del INE. Texto exacto de atribución que pide el IGN: **pendiente de verificar**. | "© Instituto Geográfico Nacional" | https://github.com/martgnz/es-atlas · http://www.ign.es/resources/licencia/Condiciones_licenciaUso_IGN.pdf |
| OpenStreetMap: límite de Sant Hipòlit de Voltregà (08215), relación 343447 | **ODbL 1.0**: atribución y compartir igual. Los archivos con esta geometría son una base de datos derivada y se distribuyen bajo ODbL. La página generada es una obra producida y muestra la atribución. | "© OpenStreetMap contributors", con enlace a https://www.openstreetmap.org/copyright | https://www.openstreetmap.org/copyright · https://osmfoundation.org/wiki/Licence/Attribution_Guidelines |
| SSB (Statistics Norway) | CC BY 4.0 | "Statistics Norway" | https://www.ssb.no/en/diverse/lisens |
| Statistics Iceland | CC BY 4.0 | "Statistics Iceland" | https://statice.is/publications/open-data-access |
| Auditorías 2024 de cada operador (enlazadas desde el registro de la ACA) | Documentos publicados por obligación legal (disposició addicional 26a del Decret Legislatiu 3/2003). Se transcriben solo los indicadores, con la URL de origen. Condiciones de reutilización de cada operador: **pendiente de verificar**. | URL de origen por municipio en `raw/aca2024_extract.psv` | Registro de la ACA (ver `data/sources.md`) |
| Webs de operadores (`data/operators.json`) | Solo se citan nombres y enlaces; no se reproduce contenido. | No aplica | No aplica |

## Por archivo

| Archivo | Fuente | Licencia | Actualización de la fuente |
|---|---|---|---|
| `raw/aca_annexIII_2022.psv` | ACA, anexo III (xlsx) | Llicència oberta d'ús d'informació - Catalunya | Mayo de 2025, datos 2022 |
| `raw/aca_informe2025_annexIII_pdf.psv` | ACA, informe de evaluación comparativa (PDF) | Llicència oberta d'ús d'informació - Catalunya | Mayo de 2025 (archivo modificado el 3 de julio de 2025), datos 2022 |
| `raw/aca_powerbi_2024_obligats.psv` | ACA, registro de auditorías | Llicència oberta d'ús d'informació - Catalunya | Consultado el 19 de octubre de 2026 |
| `raw/aca2024_extract.psv` | Auditorías 2024 de los operadores | Pendiente de verificar | Una URL por municipio |
| `raw/aca2024_notes.txt` | Notas propias sobre las auditorías 2024 | MIT | |
| `raw/ine53447_2008_2024.txt` | INE | CC BY 4.0 | Consultado el 19 de octubre de 2026 |
| `raw/ine_hogares_2024.txt` | INE, nota de prensa | CC BY 4.0 | 2 de julio de 2026 |
| `raw/idescat_pop2025.txt` | Idescat | Condiciones de reutilización de Idescat | Padrón a 1 de enero de 2025 |
| `raw/idescat_comarques_mun.txt` | Idescat | Condiciones de reutilización de Idescat | Consultado el 19 de octubre de 2026 |
| `raw/osm_08215.json` | OpenStreetMap | **ODbL 1.0** | |
| `data/m08215.txt` | OpenStreetMap, proyectado | **ODbL 1.0** | |
| `data/muni.json` | ACA, auditorías 2024 e Idescat | La de cada fuente | |
| `data/ccaa.json` | INE | CC BY 4.0 | |
| `data/esp.json` | es-atlas (IGN) | CC BY 4.0 | |
| `data/operators.json` | Webs de operadores | No aplica | |
| `src/geometry/cat.json` | es-atlas (IGN) | CC BY 4.0 | |
| `src/geometry/geo.json` | Geometría de países de la v1. Origen: pendiente de verificar | Pendiente de verificar | |
| `src/geometry/ctx_path.txt` | Geometría de contexto de la v1. Origen: pendiente de verificar | Pendiente de verificar | |
| Constantes `D`, `M` y `ESM` en `src/app.js` | EurEau, INE, SSB y Statistics Iceland | La de cada fuente. EurEau: pendiente de verificar | |

## Archivos bajo ODbL

`raw/osm_08215.json` y `data/m08215.txt` contienen datos de OpenStreetMap y se distribuyen bajo la Open Database License 1.0 (https://opendatacommons.org/licenses/odbl/1-0/). Cualquier copia o derivado de esos archivos debe mantener la atribución "© OpenStreetMap contributors" y la misma licencia. La página generada en `dist/` incluye esa geometría como obra producida y muestra la atribución.

## Fuentes excluidas

**3Cat/ACN** (gráfico Datawrapper Zh2fK, octubre de 2024). Su aviso legal reserva todos los derechos y prohíbe distribuir y extraer datos del portal (https://www.3cat.cat/avis-legal/condicions-utilitzacio-del-portal/). No se usa en este repositorio. Los municipios que solo tenían ese dato aparecen como "sin dato publicado".
