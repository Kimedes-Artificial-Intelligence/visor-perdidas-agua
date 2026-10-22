# Visor pérdidas de agua v2 · Fuentes de datos

Consulta: 19 oct 2026. Todo dato del visor lleva año y fuente. Ningún valor estimado.

## Resumen de cobertura

| Capa | Fuente | Año | Cobertura | Verificación |
|---|---|---|---|---|
| Países | EurEau 2026 (heredado de la v1) + INE 2024 para la ANR de España | 2022-2024 | 31 países | Contrastado el 22 oct 2026 con el anexo de datos del PDF oficial (transcripción en `raw/eureau_ewif2026.psv`): 0 diferencias en pérdidas reales, ANR, m³/km/año, producción, consumo, red, telelectura, renovación, tarifa y medias EUR*/EU27. España actualizada a INE 2024 (23,1 %) |
| España por CCAA | INE ESSA, tabla 53447 | 2008-2024 | 18 filas + España | Descarga completa de la API; checksum de la transcripción idéntico al de la API |
| Catalunya, dato 2024 | Auditorías 2024 publicadas por cada operador (enlazadas desde el registro de la ACA) | 2024 | **110 municipios, 6,17 M hab.** | Texto del PDF extraído con pdf.js en el navegador; 6 casos leídos en pantalla (PDF imagen: Mataró, Caldes, la Garriga, Mollet, Figueres, Tortosa); 6 re-verificados contra el PDF original |
| Catalunya, dato 2022 | ACA, anexo III de la *Avaluació comparativa* (mayo 2025) | 2022 | 26 municipios más (0,49 M hab.) | Checksum de la transcripción idéntico al xlsx; códigos INE 108/108 iguales a los de la ACA |
| **Total Catalunya con dato** | | | **136 de 947 municipios, 6,66 M hab. (82 %)** | |
| Población municipal | Idescat, padrón 1/1/2025 | 2025 | 947/947 | Suma 8.146.265 = total Idescat |
| Nombres y comarcas | Idescat EMEX | 2026 | 947, 43 comarcas | SHA-256 de la transcripción idéntico al de la API |
| Geometría | es-atlas 0.6.0 (INE, MIT). 08215 Sant Hipòlit de Voltregà: OpenStreetMap, relación 343447 | | 947 municipios, 19 CCAA | Proyección de la v1 reconstruida: error medio 0,02 unidades sobre 873 municipios |
| Noruega / Islandia | SSB / Statistics Iceland | 1/1/2025 | 5.594.340 / 389.444 | Páginas oficiales |
| Consumo de hogares | INE, nota de prensa ESSA 2024 | 2024 | España y 6 CCAA citadas | Nota de prensa del 2 jul 2026 |
| Operadores | Web oficial de cada operador o administración | 2024-2026 | 68 en 31 países | Una URL por operador (`operators.json`) |

## Decisiones aplicadas (19 oct 2026)

1. Indicador municipal: agua no registrada (F9 de la ACA), con el dato más reciente: 2024, si no 2022 (anexo ACA). Las pérdidas reales en % del volumen de entrada aparecen solo donde la auditoría 2024 las publica en el balance.
2. Ronda 2024 extraída para 100 municipios. Quedan 30 con auditoría 2024 publicada y no incorporada (ver abajo); muestran 2022.
3. Tramo < 10 % de la escala municipal: #9fd3c0.

## Discrepancias y tratamiento

| Caso | Detalle | Tratamiento |
|---|---|---|
| Barberà del Vallès | v1 1,2 %: son las pérdidas reales 2024 del informe de SABEMSA, con margen ±693 % | ANR 2024 = 7,2 %; las pérdidas reales no se muestran |
| La Rioja 2022 (INE) | Pérdidas reales 25.870 > ANR 16.397 | Omitido; la suma de CCAA confirma el error de la fuente |
| Palamós / Mont-ras | La unidad 2022 incluía ambos; en 2024 CAPSA publica solo Palamós | Palamós 2024 (9,6 %); Mont-ras 2022 de la unidad (9,3 %) |
| Valores 2024 llamativos | ILI < 1 (Sitges, Parets, Mataró, Barberà...), Tortosa ILI 23,8, Llançà F7 50,7 vs F9 30,0 | Son los valores publicados (re-verificados Sitges y Llançà). El visor muestra solo ANR y pérdidas reales %, no ILI |

## Pendientes

- 30 municipios con auditoría 2024 publicada y no extraída: Lleida, Reus, Lloret, Molins de Rei, Sant Andreu de la Barca, Sant Feliu de Guíxols, Santa Cristina d'Aro, Tordera, Castelló d'Empúries, Castell-Platja d'Aro, l'Ametlla de Mar (Aqualia: enlaces del registro dan 404); Begur, Deltebre, la Ràpita, Malgrat (Aigües de Catalunya: documentos tras tarjetas JS); Banyoles, Olesa, Ripoll, Torelló, Llavaneres, Sant Sadurní, Torroella, Vallirana, Castellbisbal, Altafulla, Sant Quirze, Abrera (solo balance 2024), Montornès (solo 2022 en la web), la Bisbal, el Masnou.
- Sin dato: Balaguer, la Seu d'Urgell, Vielha e Mijaran (obligados sin auditoría publicada) y 797 municipios no obligados.

## URLs principales

- EurEau, Europe's Water in Figures 2026 (23 jun 2026): https://eureau.org/wp-content/uploads/2026/06/FINAL_Europes-Water-in-Figures-Report-2026.pdf (SHA-256 f12331f77d343855dec4bbb2c45b1e6195927308e7eae324cf39faf849c9ff8d; la copia enlazada en la página, en svensktvatten.se, es idéntica). Anexo de datos en las pp. 46-48 impresas.
- INE tabla 53447: https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/53447 · nota: https://ine.es/dyngs/Prensa/es/ESSA2024.htm
- ACA registro y anexo III: https://aca.gencat.cat/ca/laigua/infraestructures/xarxes-abastament/xarxes-municipals-auditories-deficiencia-hidraulica/ (cita la disposició addicional 26a del Decret Legislatiu 3/2003)
- Auditorías 2024: una URL por municipio en `raw/aca2024_extract.psv`; notas por caso en `raw/aca2024_notes.txt`
- Idescat: https://api.idescat.cat/taules/v2/pmh/446/477/mun/data?YEAR=2025&SEX=TOTAL · https://api.idescat.cat/emex/v1/nodes.json?tipus=com,mun
- SSB: https://www.ssb.no/en/befolkning/folketall/statistikk/befolkning · Statistics Iceland: https://old.statice.is/publications/news-archive/inhabitants/the-population-on-1-january-2025/
- OSM 08215: https://www.openstreetmap.org/relation/343447

## Añadido el 21 oct 2026: informe ACA de evaluación comparativa (PDF)

- Fuente: ACA, *Avaluació comparativa de les auditories sobre l'eficiència hidràulica dels serveis d'abastament*, versión mayo 2025, 90 páginas, datos 2022. https://aca.gencat.cat/web/.content/20_Aigua/02_infraestructures/02_xarxes_abastament/xarxes-municipals-auditories-eficiencia-hidraulica/informe-auditories-hidrauliques.pdf (Last-Modified 3 jul 2025, 3.963.136 bytes).
- Transcripción del anexo III del PDF: `raw/aca_informe2025_annexIII_pdf.psv` (103 unidades; F1, F4, F6, F7, F9 con su incertidumbre absoluta "IA" y clasificación; pérdidas inevitables y evitables en m³). Contraste con la transcripción del xlsx: 103/103 unidades, 0 diferencias en F1, F4, F6, F7, F9 y clasificación F9.
- Cifras agregadas de Catalunya 2022 (p. 6, 8-9, 61-63): entrada 482 hm³; pérdidas 98 hm³ (24 aparentes, 74 reales); pérdidas reales inevitables 16 hm³ y evitables 58 hm³; ILI por categoría IWA: 12 A, 32 B, 38 C, 21 D (81 % fuera de A); medianas: F4 4,2, F9 25,1 %, F7 26,4 %, F1 225,4 L/acometida/día; publicación: 77 % de los abonados.
- Incoherencias de la propia fuente: Aigües de Barcelona "24 municipis" con 23 nombres listados (el visor usa los 23); p. 61 llama "consum facturat" a 384 hm³, que es el consumo autorizado (482 − 98); ILI de Catalunya citado como 4,5 (p. 63), mediana 4,2 (tabla 16) y media 5,80 (tabla 14); Lleida F3 = 218,8 igual que F1 (error de copia en el anexo).

## Retirado el 22 oct 2026: 3Cat/ACN

- El aviso legal de 3Cat reserva todos los derechos y prohíbe distribuir y extraer datos de su portal: https://www.3cat.cat/avis-legal/condicions-utilitzacio-del-portal/
- Se retiran del repositorio sus transcripciones (`raw/aca_3cat_Zh2fK.psv` y `raw/aca_3cat_latlon.txt`) y su uso en la generación, junto con las comparaciones con sus cifras que recogía este documento.
- 15 municipios que solo tenían ese dato pasan a "sin dato publicado": Cànoves i Samalús, Granera, Monistrol de Montserrat, Sant Antoni de Vilamajor, Sant Pere de Vilamajor, la Palma de Cervelló, Santa Pau, Àger, Maials, Sant Guim de Freixenet, Seròs, Móra la Nova, la Pobla de Massaluca, Vilalba dels Arcs y Camarles (35.713 hab.).
- En 25 municipios con dato 2022 del anexo de la ACA desaparece del panel la fila "Fugas 2022 (ACA vía 3Cat)".
- Cobertura de Catalunya tras la retirada: 135 de 947 municipios, 6,65 M hab. (82 %). Con las auditorías 2024 incorporadas el mismo día (Deltebre pasa a tener dato), 136 de 947 municipios, 6,66 M hab. (82 %).

## Añadido el 22 oct 2026: España por municipio e Illes Balears (FWG-1826)

Vista nueva `#municipios` con los 8.131 municipios de España. Coloreados donde hay dato municipal publicado y redistribuible; en gris, con el motivo de su comunidad, donde no lo hay. No se estima ni se interpola ningún municipio y ninguno se tiñe con el valor de su comunidad.

| Capa | Fuente | Año | Cobertura | Verificación |
|---|---|---|---|---|
| Catalunya | Los mismos datos de la vista Catalunya (`muLatest`), sin cambiar ningún valor | 2024 o 2022 | 136 de 947 municipios, 6,66 M hab. | Constante `MU` idéntica a la de `main` |
| Illes Balears | Govern de les Illes Balears, Servei de Planificació (Portal de l'Aigua), *Resum anual de dades d'abastiment urbà d'aigua, anys 2000 a 2024* | 2000-2024 (se muestra 2024) | 67 de 67 municipios, 1,24 M hab. | 67 valores de 2024 iguales a la tabla de control del ticket (`tests/fixtures/caib_control_2024.psv`, tolerancia 0,01) |
| Población | INE, Revisión del Padrón municipal a 1/1/2025 (`pobmun25.xlsx` de https://www.ine.es/pob_xls/pobmun.zip) | 2025 | 8.132 municipios, 49.114.494 hab. | Catalunya: 947 cifras iguales a las de Idescat |
| Geometría | es-atlas 0.6.0, `es/municipalities.json` | | 8.131 municipios y 64 de los 81 territorios compartidos (53xxx) | Ningún municipio desaparece (prueba en `tests/unit/espmun.test.js`) |
| **Total con dato** | | | **203 de 8.131 municipios, 7,90 M hab. (16,1 % de España)** | Calculado en la página con el padrón |

### Illes Balears: fuente y extracción

- Página: https://www.caib.es/sites/aigua/ca/proveament_distribucia_potabilitzacia/ (consulta 22/10/2026). Origen declarado: "Estimacions del Servei de Planificació a partir de la informació rebuda dels gestors de l'abastiment i ABAQUA".
- Indicador: `% d'aigua no comptabilitzada` = (total subministrat − consum) / total subministrat. Equivale conceptualmente al agua no registrada, pero es una estimación, no una auditoría. En la página se llama "Agua no contabilizada, estimación del Govern IB".
- Originales en `raw/caib/` (descarga del 22/10/2026; el servidor exige la cookie de sesión de la página y la cabecera Referer):

| Isla | Archivo | Parámetro `archivopub.do?ctrl=` | Formato real | SHA-256 |
|---|---|---|---|---|
| Mallorca | `mallorca_2026-10-22.xlsx` | `MCRST259ZI474988&id=474988` | XLSX (la web lo enlaza como ODS) | 791e41a82979a3a3b2f4c6b404be97d317630a5e2493e53aeca258870c2f136f |
| Menorca | `menorca_2026-10-22.ods` | `MCRST259ZI474963&id=474963` | ODS | b4928267a827fc8e6dcf00aabb6efb7eec10f574e033540cc580ae2059c840b7 |
| Eivissa | `eivissa_2026-10-22.ods` | `MCRST259ZI474986&id=474986` | ODS | ed234beedc6975a5a2dc3916109637a6ea671d2ce0e818f61b8cb178abf60018 |
| Formentera | `formentera_2026-10-22.ods` | `MCRST259ZI474987&id=474987` | ODS | aff9c95f6acfbca6515d79156d146b42d486ef42c4b5154d048d38e478c4d677 |

- PDF de cada isla en la misma página (ids 392375, 392376, 392372 y 392373) para revisión humana; no se guardan en el repositorio.
- Transcripción: `raw/caib_abastiment_2000_2024.psv`, generada por `node scripts/extract_caib.js` (lector propio de XLSX y ODS en `scripts/lib/sheet.js`, sin dependencias). La prueba unitaria vuelve a extraer los originales y exige el mismo archivo. Unión por código INE con `raw/caib_cruce_ine.psv` (67 de 67 contra es-atlas 0.6.0), nunca por nombre aproximado.
- Trampas de parseo tratadas: formato detectado por contenido; cabecera localizada por la celda exactamente igual a `TERME MUNICIPAL`; columnas buscadas por nombre en cada archivo; nombres partidos en dos filas ("SANT ANTONI" / "DE PORTMANY", "VILAFRANCA" / "DE BONANY", "SANTA EULÀRIA" / "DES RIU") unidos en bloques de 25 años que empiezan en 2000; coma decimal de Formentera pasada a punto; valores de 2019 con muchos decimales conservados en bruto y redondeados a 2 al mostrar; notas al pie excluidas.
- `% dades reals` vacío de 2000 a 2015 en todos los municipios y en Sa Pobla 2024.
- Nota al pie de Mallorca: "A partir de 2023 s'ha estimat el % d'aigua subministrada a la xarxa en alta d'Abaqua segons origen, de manera que s'han llevat les dades d'Indiferenciada". Afecta al desglose por origen, no al % de agua no contabilizada.
- Regla de calidad: si `% dades reals` es menor que 50 o está vacío, el municipio se pinta con un rayado encima y el panel dice "Valor estimado por el Govern, con poca o ninguna medición real". En 2024: Bunyola, Campanet, Escorca, Fornalutx, Lloseta, Petra, Puigpunyent, Valldemossa y Ferreries (0), Artà (5), Es Migjorn Gran (31) y Sa Pobla (vacío).
- Comparabilidad: Catalunya (auditorías, F9) y Baleares (estimaciones) no son el mismo indicador. Se pintan con la misma escala `MU_BINS` para leer el orden de magnitud; la página lo dice en la leyenda y en el ranking.

### Geometría nacional

- `scripts/build_geo.js` genera `data/esmun.json`: misma proyección que el resto (`src/geometry/proj.json`), Canarias en el mismo recuadro que la vista por comunidades, simplificación topojson-simplify al cuantil 0,6 y coordenadas en centésimas con órdenes relativas (la capa se dibuja con `transform="scale(.01)"`). Página resultante: unos 1,45 MB sin comprimir, con límite de 2,5 MB comprobado en la CI.
- 17 recintos pequeños de un solo arco se pierden al simplificar: se dibujan sin simplificar y encima de sus vecinos.
- 11 municipios tienen área nula en es-atlas 0.6.0 y se dibujan como un punto: Geldo (12067), Castellfollit de la Roca (17046), Castilleja de Guzmán (41028), El Puente del Arzobispo (45138), Benirredrà (46066), Emperador (46117), Llocnou de la Corona (46152), Maleján (50156), Puigdàlber (08174), l'Alqueria d'Asnar (03017) y Rafal (03109). Ceuta y Melilla, como en la vista por comunidades, también son puntos.
- Sant Hipòlit de Voltregà (08215) tiene área nula en es-atlas: se usa el trazado de OpenStreetMap, como en la vista Catalunya.
- Cuatro recintos tienen el sentido de giro invertido (03131, 20015 y 53065 en la fuente; 08111 tras simplificar). Se corrigen antes de proyectar; si no, d3 los dibuja como el resto del globo.
- Territorios compartidos (53xxx): grises, sin interacción, con el texto "territorio compartido entre municipios" al pasar el ratón. 17 de los 81 tienen área nula en es-atlas y no se dibujan. Gibraltar (54006) no se dibuja.
- Límites de provincia (trazo fino) y de comunidad autónoma (trazo grueso) con `topojson.mesh` sobre la misma topología simplificada.
- Usansolo (48916) figura en el padrón de 2025 pero no en es-atlas 0.6.0 (segregado de Galdakao): cuenta en la población de España, pero no se dibuja; su superficie aparece dentro de Galdakao.

### Motivo por comunidad (sin dato municipal)

| Comunidad | Texto |
|---|---|
| Cataluña | Dato de las auditorías publicadas (ACA). En gris, municipios sin auditoría publicada. |
| Illes Balears | Govern de les Illes Balears, estimación anual por municipio. |
| Andalucía, Castilla-La Mancha | MITECO, Informe nacional de fugas 2024 (nov. 2025), p. 29: no hay registro público de pérdidas por municipio. |
| Ceuta y Melilla | Sin dato municipal publicado. El INE publica las dos ciudades agregadas. |
| Resto | Sin registro público de pérdidas por municipio a 22/10/2026. Algunos operadores publican su cifra, pero con todos los derechos reservados. |

### Pendientes

- Confirmar con la CAIB la versión de la licencia CC BY-SA de su aviso legal.
- La estructura (índice por código INE, motivo por comunidad) admite cargar la tabla municipal de la evaluación de fugas 2024 de MITECO (RD 3/2023) si se obtiene por solicitud de acceso.
- No se usan cifras de operadores con derechos reservados (Canal, EMASESA, EMUASA, Aguas de Alicante, Aguas de Huelva, Hidralia, AMVISA) ni de prensa.
