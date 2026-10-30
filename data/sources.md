# Visor pérdidas de agua v2 · Fuentes de datos

Consulta: 19 oct 2026. Todo dato del visor lleva año y fuente. Ningún valor estimado.

## Resumen de cobertura

| Capa | Fuente | Año | Cobertura | Verificación |
|---|---|---|---|---|
| Países | EurEau 2026 (heredado de la v1) + INE 2024 para la ANR de España | 2022-2024 | 31 países | Contrastado el 22 oct 2026 con el anexo de datos del PDF oficial (transcripción en `raw/eureau_ewif2026.psv`): 0 diferencias en pérdidas reales, ANR, m³/km/año, producción, consumo, red, telelectura, renovación, tarifa y medias EUR*/EU27. España actualizada a INE 2024 (23,1 %) |
| España por CCAA | INE ESSA, tabla 53447 | 2008-2024 | 18 filas + España | Descarga completa de la API; checksum de la transcripción idéntico al de la API |
| Catalunya, dato 2024 | Auditorías 2024 publicadas por cada operador (enlazadas desde el registro de la ACA) | 2024 | **113 municipios, 6,22 M hab.** (30 oct 2026) | Texto del PDF extraído con pdf.js en el navegador; 6 casos leídos en pantalla (PDF imagen: Mataró, Caldes, la Garriga, Mollet, Figueres, Tortosa); 6 re-verificados contra el PDF original |
| Catalunya, dato 2022 | ACA, anexo III de la *Avaluació comparativa* (mayo 2025) | 2022 | 26 municipios más (0,49 M hab.) | Checksum de la transcripción idéntico al xlsx; códigos INE 108/108 iguales a los de la ACA |
| **Total Catalunya con dato** | | | **137 de 947 municipios, 6,68 M hab. (82 %)** (30 oct 2026) | |
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

- Revisión del 30 oct 2026 (FWG-1870) de los 30 municipios que figuraban aquí: 10 ya se incorporaron el 22 oct (Reus, Begur, Deltebre, la Ràpita, Malgrat, Banyoles, Olesa, Torelló, Torroella, Castellbisbal) y 3 el 30 oct (Sant Sadurní d'Anoia, Sant Quirze del Vallès, Vallirana). Quedan 17, que muestran 2022 o nada:
  - Aqualia (aqualia.com responde con un desafío anti-bots; no se insiste, descarga manual): Lleida, Lloret de Mar, Molins de Rei, Sant Andreu de la Barca, Sant Feliu de Guíxols, Santa Cristina d'Aro, Tordera, Castelló d'Empúries, Castell-Platja d'Aro, l'Ametlla de Mar.
  - Sant Andreu de Llavaneres: aigua.ajllavaneres.cat responde 403.
  - Abrera: solo el balance 2024, sin indicadores. Ripoll y Montornès: solo 2022 en la web del operador. el Masnou, Altafulla, la Bisbal d'Empordà: sin auditoría 2024 encontrada.
  - Detalle y URLs en `raw/aca2024_notes.txt` y en la sección del 30 oct 2026, al final.
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

## Añadido el 30 oct 2026: pérdidas, red, gestión y operadores en toda España (FWG-1868)

La vista `#municipios` tiene cuatro capas: pérdidas, modelo de gestión, fibrocemento y estado de la red. La ficha de cada municipio cita todas sus fuentes en una lista numerada. Ningún valor lo estima Kimedes: lo que no da ninguna fuente queda en gris con el motivo.

| Capa | Fuente | Año | Cobertura (padrón INE 2025) | Verificación |
|---|---|---|---|---|
| Pérdidas, resto de España | EIEL, pérdidas declaradas por núcleo (visor GEO-EIEL) | Fase de cada provincia, 2016-2025 | 4.972 municipios | Agregación portada de `process_es.py`: mismos recuentos (8.015 municipios, 4.972 con pérdidas, 5.653 con gestión, 7.637 con operador); valores iguales salvo el redondeo de 0,5 (Python redondea al par) |
| Pérdidas, total | ACA + Govern IB + EIEL | | **5.175 de 8.131 municipios, 43,0 % de la población** | Contador de la página |
| Modelo de gestión | ESF (Catalunya), EIEL y SINAC | | **7.528 municipios, 83,0 % de la población** | Precedencia probada en `tests/unit/es_mun.test.js` |
| Fibrocemento y estado de la red | EIEL, material y estado de cada tramo | Fase de cada provincia | 5.653 municipios, 27,9 % de la población | 1.793 municipios con 30 % o más de su red en fibrocemento, igual que la referencia del ticket |
| Operadores | SINAC, gestor y responsable de cada red de distribución | Extracción 30/10/2026 | 7.637 municipios con operador | 18.939 redes |

### Archivos de `raw/` (SHA-256)

| Archivo | Filas | SHA-256 |
|---|---|---|
| `eiel_nucleos_2026-10-30.csv` | 33.413 núcleos | 02fea6ef963760774974ff6cfac82387265633e035c66679ae5dd56bb307dd49 |
| `eiel_rd_2026-10-30.csv` | 46.842 claves de tramo | 1effa2c93a324c713ace616ec355b654bef1b18e772000523bf1b4636f365f73 |
| `eiel_provincias_2026-10-30.csv` | 48 provincias | 98b4f9ade1c35c39775d7e7bcef5b1f68f3cd02bd762c7f22334773aa4705b28 |
| `sinac_redes_2026-10-30.csv` | 18.939 redes | fcf43bcda6d64106ea7713c08fe4afcb82a63d334c6d204e4343e8b3a23a5d5e |
| `esf_gestio_aigua_cat_2026-07-10.psv` | 947 municipios | f47b2144c9aaf421c0825ac8dc4b30ad49cec36f25e9b82facabbc38ab7d9ba4 |

Copias exactas de los archivos de la extracción del 29-30/10/2026 (carpeta VISOR de David); las versiones `sinac_*_parcial.csv` se descartan. `scripts/extract_eiel.js` reproduce la EIEL: la comprobación `--prov=11 --check` del 30/10/2026 dio 0 diferencias en Cádiz (1 provincia, 117 núcleos, 259 tramos).

### Agregación (`scripts/build_es_mun.js`)

1. Pérdidas EIEL: 0, vacío o más del 95 % = sin dato (el 0 es campo sin rellenar: 18.426 de los 33.413 núcleos). Media de los núcleos ponderada por el consumo medio ((invierno + verano) / 2); sin consumo, por padrón. Se guardan el valor, la fase, los núcleos que informan y el total, el % de población cubierta y el % de valores múltiplos de 5. La mediana de los municipios tiene el 100 % de sus valores en múltiplos de 5: en la página se etiquetan como "dato declarado por el ayuntamiento, no medido" y se pintan con trama.
2. Gestión EIEL: longitud de tramo por código de gestión; reparto en % y código dominante. Códigos (metadatos del visor): MU municipal, EM empresa municipal, EP empresa pública no municipal, MA mancomunidad, CO consorcio, VE vecinal, PV privada, OT otros.
3. Red EIEL: % de longitud en fibrocemento (FC), % en estado malo (M) y regular (R), km y fase. La longitud es la geodésica de la geometría (radio medio 6.371.008,8 m). Materiales según los metadatos del visor (`getmetadata`, consulta 30/10/2026): FC fibrocemento, FU fundición, PE polietileno, **PC PVC**, **PL plomo**, PV poliéster reforzado con fibra de vidrio, HO hormigón, OT otros. Con esto queda resuelto el pendiente de verificar PC y PL.
4. Claves de tramo mal formadas (no tienen 11 partes o la segunda no es RD): se ignoran.
5. SINAC: operadores ponderados por población abastecida (población × % de cada localidad); redes repetidas cuentan una vez; dotación media ponderada.

### Clasificación de operadores y modelo de gestión

- `data/operadores_clasificacion.csv` (editable; ver CONTRIBUTING): coincidencia por palabras completas, sin acentos ni signos; gana el primer patrón. Arranque con los patrones del ticket. EMALSA, AGUAS DE LORCA, ACOSOL y AGUASVIRA quedan sin clasificar, a la espera de revisión una a una. La columna `grupo` se deja vacía: no se ha comprobado el grupo de ningún operador.
- "No es operador" (EKUIS y laboratorios): se usa el `responsable` de la red y la ficha lo marca como responsable. **Decisión de implementación:** el responsable es el titular (normalmente el ayuntamiento), no el gestor, así que no se usa para deducir el modelo de gestión. Por eso la mayor parte del País Vasco queda sin modelo.
- 1.272 nombres sin clasificar, en `data/operadores_sin_clasificar.csv`, ordenados por población abastecida (EMASESA, EMASAGRA, AQUAVALL, EMALCSA... en cabeza).
- Precedencia: Catalunya → ESF. Resto → si el operador principal del SINAC es Mixto, Mixto; si no, la gestión dominante de la EIEL agrupada (MU, EM, EP, MA, CO → Municipalizado; PV → Privado; VE → Vecinal / cooperativa; OT → Otros); sin EIEL, el tipo del operador principal del SINAC. En 1.095 municipios la EIEL y el SINAC no coinciden: la ficha muestra ambas.

### Motivo por municipio sin pérdidas (sustituye a la tabla por comunidad)

| Caso | Texto |
|---|---|
| País Vasco y Navarra | País Vasco y Navarra quedan fuera de la EIEL por ley y no publican pérdidas por municipio. |
| Provincia sin EIEL en el visor nacional (Albacete, Huelva, Huesca, León, Madrid, Santa Cruz de Tenerife; Barcelona, Girona, Lleida, Tarragona e Illes Balears tienen su propia fuente) | Esta provincia no está en el visor nacional de la EIEL (la mantiene su diputación o su comunidad) y no hay otro registro público de pérdidas por municipio. |
| Municipio sin núcleos en la EIEL | La EIEL no incluye núcleos de este municipio: cubre los municipios de menos de 50.000 habitantes. |
| Núcleos sin pérdidas | La EIEL no trae pérdidas para este municipio: campo vacío, 0 % (campo sin rellenar) o más del 95 %. |
| Catalunya, Illes Balears, Ceuta y Melilla | Sin cambios. |

### Incidencias de las fuentes

- 210 nombres de núcleo con la codificación rota en la extracción (por ejemplo "VVA. DE CÃÂRDOBA"). No se usan en la página y no se corrigen a mano en `raw/`.
- Población abastecida del SINAC en Madrid capital: 70.669 (la tabla de localidades de las redes grandes reparte la ciudad por distritos con % bajos). Se muestra tal cual, como el resto del SINAC; pendiente de revisar.
- SINAC: la consulta ciudadana responde 403 a clientes automatizados. La extracción se reproduce con `scripts/extract_sinac_console.js`, el script de consola de navegador que se usó el 30/10/2026 (8.132 municipios, 18.939 redes, 2 errores). Uso en el README.

### Página

- Tamaño: 2,56 MB sin comprimir (756 KB con gzip). El límite de la CI sube de 2,5 a 4 MB (`tests/unit/espmun.test.js`).
- Regresión: en Europa, España por comunidades y Catalunya (modo Pérdidas) el mapa, la leyenda, el ranking y el contador son idénticos a `main` (DOM del mapa comparado elemento a elemento). Cambian a propósito la cabecera (sin el sello "Uso interno", con el selector de capa), el pie y, en Catalunya, la ficha, que añade el modelo de gestión de ESF y la lista de fuentes.

## Añadido el 30 oct 2026: auditorías 2024 pendientes de Catalunya (FWG-1870)

Consulta: 30/10/2026. Se repasan los 30 municipios de la lista de pendientes. Los valores se transcriben del documento del operador, como el resto de `raw/aca2024_extract.psv`; no se guarda el PDF, solo su URL y su SHA-256.

| INE | Municipio | Documento | Año | F9 | SHA-256 del PDF |
|---|---|---|---|---|---|
| 08240 | Sant Sadurní d'Anoia | https://minasalut.com/wp-content/uploads/2025/07/AUDITORIA-EFICIENCIA-HIDRAULICA-DEL-2024.pdf (Comunitat Mina i Aigües de la Salut). Red principal, Sant Sadurní - Can Catassús | 2024 (p.1) | 23,1 % | 0883bb81caa36f3c045ca99e0448ff83c1457012f083d75ce37886644ce74369 |
| 08295 | Vallirana | https://www.vallirana.cat/media/repository/serveis/Subministrament_Aigua/Dades_Aigua_2025/Memoria_Vallirana-AVALLSA_2024.pdf (red AVALLSA, 5.357 abonados). La otra red (FCC, 2.218 abonados, F9 51,9 %, https://www.vallirana.cat/media/repository/serveis/Subministrament_Aigua/Dades_Aigua_2025/Memoria_Vallirana-FCC_2024.pdf, SHA-256 025bc379c7b86cf4dd9fe444dc2dbce07d70a2f1ec4f1c75acf7f8c8e05de202) va como nota en la ficha | 2024 (p.3) | 42,6 % | 632da0760ff5ea2c6caefbd5a6d49c4f325990ef3f3caa29bbfcaba7dc4646cd |
| 08238 | Sant Quirze del Vallès | https://sqvaigua.cat/wp-content/uploads/2026/01/2024-Auditoria_HidrC3A0ulica-SQVaigua.Compl_.pdf (SQVaigua), enlazado desde https://sqvaigua.cat/informat/auditoria-hidraulica/ | 2024 (nombre del archivo) | 35,5 % | 07e17e2b2130c56e312476c9103f7190ba9f35b46d4b09fee2df0df9b26fab2c |

Cobertura de Catalunya: 137 de 947 municipios, 6,68 M hab. (82 %); 113 con dato 2024. Vallirana: se muestra la red con más abonados (decisión de David, 30/10/2026). España por municipio: 5.176 municipios con pérdidas.

Sin incorporar (no se salta ninguna protección):

| Municipio | Motivo | URL para descarga manual |
|---|---|---|
| Lloret de Mar | aqualia.com: desafío anti-bots (Incapsula) | https://www.aqualia.com/informacion-al-ciudadano/ciclo-integral/lloret-de-mar |
| Molins de Rei | Ídem | https://www.aqualia.com/web/aqualia-ca/informacio-al-ciutada/cicle-integral/molins-de-rei |
| Sant Andreu de la Barca | Ídem | https://www.aqualia.com/responsabilidad-social/conexion-ciudadana/-/asset_publisher/UsVCWw4W7Pek/document/id/49241269 |
| Sant Feliu de Guíxols | Ídem | https://www.aqualia.com/ca/web/aqualia-ca/informacio-al-ciutada/cicle-integral/sant-feliu |
| Santa Cristina d'Aro | Ídem | https://www.aqualia.com/web/aqualia-ca/informacio-al-ciutada/cicle-integral/santa-cristina-d-aro |
| Tordera | Ídem | https://www.aqualia.com/ca/informacion-al-ciudadano/ciclo-integral/tordera |
| Castell-Platja d'Aro | Ídem | https://www.aqualia.com/informacion-al-ciudadano/ciclo-integral/playa-de-aro |
| l'Ametlla de Mar | Ídem | https://www.aqualia.com/informacion-al-ciudadano/la-ametlla-de-mar |
| Lleida, Castelló d'Empúries | Ídem; sin página localizada (el buscador de Aqualia también está protegido) | https://www.aqualia.com/ |
| Sant Andreu de Llavaneres | 403 | https://aigua.ajllavaneres.cat/ |
| Abrera | Solo balance 2024, sin F9 | https://www.ajuntamentabrera.cat/files/doc6924/balanc-hidric-2024.pdf |
| Ripoll, Montornès del Vallès | Solo auditoría 2022 publicada | https://somasrsa.cat/wp-content/uploads/2025/09/Auditoria-hidraulica-Ripoll-2022.pdf · https://giacsa.com/wp-content/uploads/2024/05/Annex-Auditoria-Hidraulica-vs-2-1.pdf |
| el Masnou, Altafulla, la Bisbal d'Empordà | Sin auditoría 2024 en las webs del ayuntamiento y del operador | |

## Añadido el 30 oct 2026: clasificación de operadores del SINAC (FWG-1870, Parte 2)

Consulta: 30/10/2026. Se clasifican 62 operadores nuevos en `data/operadores_clasificacion.csv`, cada uno con la URL, la fecha de consulta y la frase literal que confirma el tipo en la columna `nota`. Además se citan las fuentes de dos patrones existentes (EMUASA, mixta con Veolia; HIDRALIA, participada por Veolia y Unicaja). Cada cita se comprobó descargando la página o el PDF y buscando la frase; las que no aparecían en el texto descargado no se usan (Aguas de Telde, cuya web la genera con JavaScript).

| | Antes | Después |
|---|---|---|
| Operadores sin clasificar | 1.272 nombres | 1.210 nombres |
| Municipios con modelo de gestión | 7.528 (83,0 % de la población) | 7.576 (93,5 %) |
| Ciudades de 50.000 hab. o más con modelo | 116 de 153 | 142 de 153 |
| Municipios en Mixta | 108 | 168 |

Hallazgos que corrigen supuestos del ticket: EMASAGRA (51 % Granada, 49 % Hidralia), EMAHSA (51 % Huelva, 49 % Hidralia), EMALSA (34 % Las Palmas, 33 % Nuinsa, 33 % Saur), ASTOSAM (5 % Torremolinos, 95 % Hidralia), SERCOMOSA (51,396 % Molina de Segura, 48,604 % Acciona), AGAMED (26 % Torrevieja, 74 % Hidraqua), Aguas de Albacete (26 % Ayuntamiento, 74 % Aquona) y Aigües d'Elx (51 % / 49 % Hidraqua) son mixtas, no municipales. EMASESA, EMASA, EMALCSA, AQUAVALL, Aguas de Burgos, EMAYA y Aguas de Cádiz sí son de capital 100 % público según su fuente.

Criterios aplicados:
- `Municipalizado` solo con una frase que diga que el capital es 100 % público, o que es una entidad pública empresarial, un organismo autónomo o un medio propio unipersonal. Aigües de Mataró: su memoria 2024 dice "empresa privada propietat de l'Ajuntament de Mataró", sin porcentaje; se clasifica como municipalizada y queda señalada para revisión.
- `Privado` para concesionarias cuando la fuente habla de concesión a la empresa (Hidrobal, Aigües de Vic, Sacyr Guadalagua, Inima, GS Inima Environment, Aigües Potables de Malgrat) o de un grupo privado (Fobesa, grupo Nealis).
- `Municipalizado` también para entes 100 % públicos no municipales: SOMACYL (Junta de Castilla y León), GIACSA (socio único CONGIAC), CCB Serveis Mediambientals (medio propio del Consorci Besòs Tordera), Figueres de Serveis (solo Figueres, Vilafant y el Consell Comarcal de l'Alt Empordà).
- No se clasifica un nombre del SINAC con la fuente de otra entidad: "GRUP AIGÜES DE TERRASSA" (la fuente describe a TAIGUA EPEL, que la sustituyó) ni Abastaments d'Aigua del Tordera ("entitat mercantil", sin capital declarado).
- Fuentes antiguas: la participación de Hidrogea en Aguas de Cieza, Jumilla y Sermubeniel sale de su Informe de Responsabilidad Corporativa 2017; Sermubeniel sigue siendo mixta según el BORM de 2020. Tudela: informe de la Cámara de Comptos sobre 2010.
- Cooperativas (Comunitat Minera Olesana) y comunidades de propietarios: la tabla no tiene ese tipo, quedan sin clasificar. En Catalunya manda ESF de todos modos.

Siguen sin clasificar, de los 60 primeros: Aguas de Alcalá UTE (UTE concesionaria; socios sin fuente primaria), Aguas de Telde, ARCGISA (certificado TLS no válido), Aguas Sierra de Cádiz, Aquaoleiros, Aqua Campiña, COSMA-Narón (certificado caducado; Aqualia tras desafío anti-bots), C.P. La Cizaña, Tagus Servicios Integrales, Aguas de Langreo (desafío anti-bots), ARU Obras y Servicios, UTE Aigües de SVH (el BOP de 2024 nombra a SGAB como gestora, no a la UTE), Aigües de Banyoles, Aigua de Rigat, Comunitat Minera Olesana, Aguas de Narixa (desafío anti-bots) y Augaservi.

La ficha del municipio muestra el grupo junto a cada operador y añade a la lista de fuentes la página que confirma su tipo (constante `OPC`).

## Añadido el 30 oct 2026: pérdidas publicadas por el operador en las ciudades de 50.000 hab. o más (FWG-1870, Parte 1)

Palanca legal: art. 63.2 y anexo XI parte B.1 del RD 3/2023. El ayuntamiento o el operador debe publicar en su web el rendimiento del sistema y el indicador de fugas estructurales (IFE). Consulta: 30/10/2026.

- Lista de trabajo: `data/ciudades_50k_sin_perdidas.csv`. Son las 126 ciudades de 50.000 hab. o más (padrón INE 2025) sin pérdidas de la ACA, el Govern IB ni la EIEL, con su operador principal del SINAC y su grupo. Las 7 del País Vasco y Navarra van en la Parte 4.
- Cifras: `raw/operadores_art63_2026-10.psv`, una fila por municipio e indicador. Recoge el nombre del operador, el indicador (ANR, PERDIDAS_REALES, IFE, ILI, RENDIMIENTO) con su valor y unidad tal como se publican, y el año del dato. Añade la URL, la fecha de consulta, la página o sección, el aviso legal (URL y frase literal) y una nota con el año tal como lo dice el documento y el SHA-256 del PDF descargado. Solo cifras que la fuente atribuye al municipio: las de un sistema de varios municipios (Canal de Isabel II, EMASESA, Hidraqua, Viaqua) no se asignan a ninguno y se reservan para la ficha de operador (Parte 6).
- No se guardan los PDF en `raw/art63/`: todos los avisos legales revisados reservan los derechos de reproducción. Queda la URL y el SHA-256 de la copia descargada el 30/10/2026.
- Resultado de la búsqueda por ciudad: `raw/art63_estado_2026-10-30.psv`, con las URL revisadas y el motivo.

| Estado | Ciudades | Texto en la ficha |
|---|---|---|
| publica | 14 | El indicador, con su nombre exacto, año, página y enlace |
| solo_sistema | 33 | "El operador no publica el indicador del art. 63.2 del RD 3/2023 para este municipio a fecha 30/10/2026: solo da la cifra de todo su sistema..." |
| no_publica | 45 | "El operador no publica el indicador del art. 63.2 del RD 3/2023 a fecha 30/10/2026." |
| bloqueado | 24 | "No se ha podido comprobar si el operador publica el indicador...: su web no admite consultas automatizadas... Pendiente de revisión manual." |
| no_verificado | 2 (Cuenca, Toledo: la web del operador falla) | "No se ha podido completar la búsqueda..." y el detalle |
| excluido_aviso_legal | 1 (Molina de Segura) | "El operador publica el indicador, pero su aviso legal prohíbe expresamente extraer y reutilizar sus contenidos: no se incorpora." |

Cifras incorporadas (todas comprobadas descargando el documento y leyendo la página citada; las infografías, renderizadas):

| INE | Ciudad | Operador | Indicador | Año | Se pinta |
|---|---|---|---|---|---|
| 14021 | Córdoba | EMACSA | ANR 8,45 % e IFE 2,02 (sin unidad impresa) | 2025 | Sí (ANR) |
| 03065 | Elche | Aigües d'Elx | ANR 11,71 % y rendimiento 88,30 % | 2025 | Sí (ANR) |
| 18087 | Granada | EMASAGRA | Rendimiento 80,98 % | 2025 | No |
| 21041 | Huelva | Aguas de Huelva | Rendimiento 81,76 % | 2025 | No |
| 30030 | Murcia | EMUASA | Rendimiento 85,74 % | 2024 | No |
| 33004 | Avilés | Aguas de Avilés | Rendimiento 81 % | 2023 | No |
| 29069 | Marbella | Hidralia | Rendimiento 93,9 % | 2025 | No |
| 29051 | Estepona | Hidralia | Rendimiento 84 % | 2024 | No |
| 11031 | San Fernando | Hidralia | Rendimiento 90,3 % | 2023 | No |
| 03014 | Alicante | Aguas de Alicante | Rendimiento 88,55 % | 2024 | No |
| 03122 | Sant Vicent del Raspeig | Aguas de Alicante | Rendimiento 85,99 % | 2024 | No |
| 03133 | Torrevieja | AGAMED | Rendimiento 87,45 % | 2025 | No |
| 15030 | A Coruña | EMALCSA | IFE 7,3 (zona de abastecimiento ZA–A Coruña) | 2025 | No |
| 29901 | Torremolinos | ASTOSAM | Rendimiento 79 % | 2024 | No |

Reglas aplicadas (decisiones de David del 30/10/2026):
- Solo el agua no registrada y las pérdidas reales en % se pintan con `MU_BINS`, con una trama horizontal propia. El rendimiento, el IFE y el ILI se muestran en la ficha y en el mapa con un punteado, "el operador publica otro indicador, no comparable". No se calcula 100 menos el rendimiento.
- Precedencia (`src/loss.js`): auditoría ACA > operador (art. 63.2) > EIEL > Govern IB. La EIEL da un solo valor por municipio, así que "medido" y "declarado" no compiten. La ficha dice qué parte de sus valores son múltiplos de 5.
- Avisos legales: se cita el dato de hecho aunque el aviso reserve los derechos. Se excluye SERCOMOSA (Molina de Segura), cuyo aviso prohíbe la "estracción, reutilización" de sus contenidos: rendimiento 87,65 % en 2025 en su EINF, p.39, no incorporado.

Cobertura de pérdidas en España por municipio: 5.176 → 5.178 municipios (43,1 → 44,2 % de la población). Ciudades de 50.000 hab. o más con pérdidas en el mapa: 27 → 29; con algún indicador del operador en la ficha: 14.

Pendiente de decisión: la EMA de Gijón publica el "% agua no controlada por contador" (14,77 %, memoria 2023), que no es uno de los indicadores admitidos. Gandia: una noticia municipal del 14/04/2025 cita un rendimiento del 85 % sin año del dato. Ninguno se incorpora.
