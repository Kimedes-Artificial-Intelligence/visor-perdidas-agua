# Bandeja de entrada de descargas manuales

Aquí se dejan los archivos que solo se pueden descargar a mano: webs que responden 403, con desafío anti-bots, con un `robots.txt` que no admite la consulta automatizada o que piden iniciar sesión. Nadie salta esas protecciones; las descarga una persona (David) desde su navegador.

## Cómo dejar un archivo

1. Descarga el documento (PDF, xlsx o csv) desde la URL exacta de la lista de descargas manuales del ticket.
2. Ponle el nombre `<fuente>_<AAAA-MM-DD>.<ext>`, con la fecha del día de la descarga. Ejemplos: `aqualia-vigo_2026-11-03.pdf`, `ersar-rasarp_2026-11-03.xlsx`.
3. Súbelo a esta carpeta, en una rama y un pull request propios o en el de la parte en curso. Si el documento no dice en qué URL estaba, añade un archivo `<fuente>_<AAAA-MM-DD>.txt` con la URL.

## Cómo se incorpora

Al empezar cada parte de trabajo se revisa esta carpeta:

1. Se transcribe lo que el archivo publica a su archivo de `raw/` (por ejemplo `raw/operadores_art63_2026-10.psv`), con la URL, la fecha de consulta (la de la descarga), el año del dato, el aviso legal y el SHA-256 del archivo. Nunca se calcula ni se estima nada.
2. Se cita en la ficha, en `data/sources.md` y en `DATA-LICENSES.md`.
3. Se borra el archivo de esta carpeta en el mismo pull request. Solo se guarda el original en `raw/` si su licencia permite la copia; si no, queda su URL y su SHA-256.

Esta carpeta debe estar vacía (salvo este README) en `main`.

## Lista de descargas manuales (FWG-1871, 31/10/2026)

Páginas y archivos que no admiten la consulta automatizada (403, desafío anti-bots, `robots.txt`, inicio de sesión o servidor caído). Nadie ha saltado esas protecciones.

**Pérdidas del art. 63.2 RD 3/2023 en ciudades de 50.000 hab. o más**

- FCC Aqualia (desafío anti-bots): páginas de información al ciudadano de sus 16 ciudades, por ejemplo https://www.aqualia.com/es/informacion-al-ciudadano/oviedo. Son Vigo, Oviedo, Jerez (también https://www.aquajerez.es/), Almería, Santander, Badajoz, Salamanca, Jaén, Vélez-Málaga, Talavera, Sanlúcar, La Línea, Alcoi, Ávila, Mérida y Motril. Lo mismo para las de 20.000 a 50.000 hab.: Almansa, Hellín, Cartaya, Lepe, Moguer, Candelaria, Güímar y Puerto de la Cruz.
- Aguas de Alcalá: https://www.aguasdealcala.es/ (desafío anti-bots).
- EMALGESA (Algeciras): https://emalgesa.com/ (desafío anti-bots).
- LINAQUA (Linares): https://linaqua.es/ (desafío anti-bots).
- ENTEMANSER (Adeje, Granadilla, Guía de Isora): https://entemanser.es/ (desafío anti-bots).
- ACEMSA (Ceuta): https://www.acemsa.org/ (`robots.txt`).
- Aguas de El Ejido: https://www.aguasdeelejido.es/ (403).
- Huesca: https://www.huesca.es/ (403). Mérida: https://merida.es/ (403). Salamanca: https://www.aytosalamanca.es/ (`robots.txt`).
- TAGUA (San Miguel de Abona): https://tagua.es/ (`robots.txt`).
- FACSA, para Castelló de la Plana, Vila-real y Toledo: https://www.facsa.com/wp-content/uploads/2026/04/Informe-2024.pdf, https://www.facsa.com/municipios/vila-real, https://aiguacs.es/el-agua-de-castello/ y https://facsatoledo.es/ (no responden). Además, https://www.castello.es/ (`robots.txt`).
- Aguas de Cuenca: https://aguasdecuenca.es/ (error del servidor). Los PDF de https://www.cuenca.es/ los veta su `robots.txt`.
- Guadalajara: https://www.guadalajara.es/ (`robots.txt`). Gandia: https://www.gandia.es/ (`robots.txt`).
- Granada, expedientes de tarifas con el agua no registrada: https://www.granada.org/pdf_trans/DOC_1_ExpedienteTarifas2026_GRANADA_AGUA_DEF_IPC_12092025_NuevasBonificaciones.pdf (Akamai, acceso denegado).
- Rincón de la Victoria: https://www.rincondelavictoria.es/ (`robots.txt`). ACOSOL (Mijas): https://acosol.sedelectronica.es/transparency (`robots.txt`).

**Cifras de sistema (D2)**

- Mancomunidad de la Comarca de Pamplona: los municipios con servicio de agua, en https://www.mcp.es/ (por ejemplo, la sección de ciclo integral) y la última memoria, en https://recursos-prod.mcp.es/. Aviso legal: https://www.mcp.es/aviso-legal (todo responde HTTP 444).
- CABB, municipios abastecidos en baja: https://www.consorciodeaguas.eus/gobierno/informacion-ayuntamientos/ (pide iniciar sesión).

**Modelo de gestión, País Vasco**

- Bilbao: https://www.bilbao.eus/ (`robots.txt`). Barakaldo: https://www.barakaldo.eus/ (`robots.txt`); ver también https://www.iagua.es/noticias/acciona/acciona-se-adjudica-mantenimiento-red-abastecimiento-agua-barakaldo (`robots.txt`). Getxo: https://www.getxo.eus/ (corta la conexión).
- Gipuzkoako Urak: https://www.gipuzkoakour.eus/ (`robots.txt`). Servicios de Montejurra: https://www.montejurra.com/ (desafío anti-bots). Aguas del Añarbe: https://www.añarbe.eus/ (certificado caducado).

**Operadores sin clasificar**

- Aquaoleiros: https://www.oleiros.org/ (403). COSMA-Narón: https://cosmanaron.es/ (desafío anti-bots). Aguas de Langreo: https://aguasdelangreo.es/ y https://www.langreo.as/ (desafío anti-bots y 403). Aqua Campiña: https://www.xn--aquacampia-19a.es/informacion-al-ciudadano/ecija (desafío anti-bots). Aguas Sierra de Cádiz: https://www.villamartin.es/ (403).
- Boletín Oficial de la Provincia de Barcelona, https://bop.diba.cat/ (su `robots.txt` lo cierra entero): concesión de Aigua de Rigat (https://bop.diba.cat/anuncio/descargar-pdf/3591779). Sirve también para volver a comprobar a mano las fuentes de TERRASSA, CCB, MALGRAT, GESTAIGUA, VILANOVA y SERVEIS MUNICIPALS SANT QUIRZE que ya están en `data/operadores_clasificacion.csv`.
- Fuentes ya citadas que no se pudieron volver a comprobar por `robots.txt`: Aigües de Mataró (https://oficinavirtual.aiguesmataro.com/), Figueres de Serveis (https://ssl4.ddgi.cat/) y la auditoría de Vallirana (https://www.vallirana.cat/).

**Auditorías 2024 de Catalunya (FCC Aqualia, desafío anti-bots)**

- Lloret de Mar: https://www.aqualia.com/informacion-al-ciudadano/ciclo-integral/lloret-de-mar
- Molins de Rei: https://www.aqualia.com/web/aqualia-ca/informacio-al-ciutada/cicle-integral/molins-de-rei
- Sant Andreu de la Barca: https://www.aqualia.com/responsabilidad-social/conexion-ciudadana/-/asset_publisher/UsVCWw4W7Pek/document/id/49241269
- Sant Feliu de Guíxols: https://www.aqualia.com/ca/web/aqualia-ca/informacio-al-ciutada/cicle-integral/sant-feliu
- Santa Cristina d'Aro: https://www.aqualia.com/web/aqualia-ca/informacio-al-ciutada/cicle-integral/santa-cristina-d-aro
- Tordera: https://www.aqualia.com/ca/informacion-al-ciudadano/ciclo-integral/tordera
- Castell-Platja d'Aro: https://www.aqualia.com/informacion-al-ciudadano/ciclo-integral/playa-de-aro
- l'Ametlla de Mar: https://www.aqualia.com/informacion-al-ciudadano/la-ametlla-de-mar
- Lleida y Castelló d'Empúries: página no localizada en https://www.aqualia.com/
- Sant Andreu de Llavaneres: https://aigua.ajllavaneres.cat/ (403)

**Internacional**

- Ofwat, Water company performance report 2024-25, fichero de datos y su licencia: https://www.ofwat.gov.uk/?p=57275 (403). Con licencia abierta, Gales (Dŵr Cymru, Hafren Dyfrdwy) entraría igual que Inglaterra.
- Water UK, condiciones (Discover Water): https://www.water.org.uk/terms-and-conditions (403).
- ERSAR, Portugal: https://www.ersar.pt/pt. SISS, Chile: https://www.siss.gob.cl/. SNIS/SINISA, Brasil: http://app4.mdr.gov.br/serieHistorica/ (ya no resuelve). OFB-SISPEA, Francia: https://www.services.eaufrance.fr/donnees/telechargement

**Pendiente de respuesta (escribe David; no hay nada que descargar)**

- EIEL de León: permiso de reutilización a la Diputación, https://www.dipuleon.es/municipios/encuesta-de-infraestructura-y-equipamientos-locales/
- EIEL de Tenerife: conflicto de licencia, por confirmar con el Gobierno de Canarias, https://www3.gobiernodecanarias.org/aplicaciones/unifica/Transparencia/ExportShape/Index
