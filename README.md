# Visor de pérdidas de agua

Mapa interactivo de las pérdidas de agua en las redes de abastecimiento, en cinco niveles:

- **Europa:** agua no registrada, pérdidas reales e índice lineal por país (EurEau; España con INE 2024).
- **España:** serie 2008-2024 por comunidad autónoma (INE, tabla 53447).
- **España por municipio:** los 8.131 municipios en cinco capas: pérdidas (Catalunya, auditorías; ciudades cuyo operador publica el indicador del art. 63.2 del RD 3/2023; Illes Balears, estimación del Govern IB; resto, pérdidas declaradas por los ayuntamientos en la EIEL), modelo de gestión (ESF en Catalunya; EIEL y SINAC en el resto), red en fibrocemento y red en mal estado (EIEL), y el índice Kimedes de prioridad comercial. Ficha por municipio con operadores (SINAC) y todas las fuentes numeradas, imprimible; buscador sobre el mapa; enlaces que abren la misma ficha; filtros por operador, provincia y calidad del dato, y exportación del ranking a CSV. Lo que ninguna fuente da, en gris con el motivo. Con zoom y selector de comunidad.
- **Internacional:** Italia por región y capital de provincia (ISTAT, perdite idriche totali 2022, CC BY 4.0) y el estado de las fuentes subnacionales de otros países (Inglaterra y Gales, Portugal, Francia, Brasil, Chile).
- **Catalunya:** agua no registrada por municipio, a partir de las auditorías de eficiencia hidráulica publicadas (ACA y operadores, 2024 y 2022).

Cada dato visible lleva su año y su fuente. Donde no hay dato publicado, el municipio aparece en gris con el texto "sin dato publicado". No hay valores estimados.

La página es un único archivo HTML sin dependencias en tiempo de ejecución, salvo las fuentes de Google Fonts.

## Guía rápida para ventas

1. **Dónde trabajar.** Botón **Municipios**: los 8.131 municipios de España. Escribe un nombre (sin acentos) o un código INE en el buscador del mapa, elige y la ficha queda fijada a la derecha.
2. **Capas.** **Pérdidas**: el último dato publicado de agua perdida, en %. **Modelo de gestión**: municipalizado, mixto, privado o vecinal. **Fibrocemento** y **Estado de la red**: % de la red de distribución en ese material o en estado malo o regular (EIEL). **Prioridad comercial**: índice calculado por Kimedes, no es un dato publicado.
3. **Calidad del dato.** Cada valor dice de dónde sale, de más a menos fiable: auditoría publicada (ACA, Catalunya); publicado por el operador (art. 63.2 del RD 3/2023); EIEL, declarado por el ayuntamiento y no medido ("EIEL ×5" si todos sus valores son múltiplos de 5, señal de cifra redondeada); dato de todo el sistema del operador, no del municipio; estimación del Govern IB (Baleares).
4. **Tramas del mapa.** Rayas horizontales: dato del operador. Rayas verticales: cifra de todo el sistema del operador, no municipal. Rayas diagonales: dato declarado en la EIEL. Puntos: el operador publica otro indicador (rendimiento, IFE) que no se compara con las pérdidas.
5. **Gris.** Ninguna fuente pública da el dato. No se estima nada: pasa el ratón o abre la ficha para leer el motivo exacto (el operador no publica, su web está bloqueada y queda pendiente de revisión manual...).
6. **Filtros y exportación.** Bajo el mapa, el ranking se filtra por comunidad, provincia, nombre, modelo, calidad del dato y operador. **Exportar CSV** descarga la lista filtrada completa, con todas las columnas (pérdidas, año, fuente, calidad, operador, red, índice), para abrirla en Excel.
7. **Ficha de operador.** Escribe un operador (p. ej. FCC AQUALIA) en el filtro "Operador": sin municipio seleccionado, el panel muestra sus municipios, población, modelos y las cifras que publica para todo su sistema.
8. **Compartir.** La dirección de la página guarda la vista, el municipio fijado y la capa (por ejemplo `#municipios/46250/perdidas`): copia el enlace y pégalo en un correo para abrir la misma ficha.
9. **Llevar a una reunión.** **Imprimir ficha**, al final de la ficha del municipio, imprime solo la ficha con la cabecera de Kimedes y todas sus fuentes numeradas; elige "Guardar como PDF".
10. **Cobertura.** Encima del mapa: cuántos municipios y qué % de la población tienen dato en la capa activa, y cuántas ciudades de 50.000 habitantes o más. El detalle de fuentes y decisiones está en `data/sources.md`.

## Generar la página

Necesitas Node 24 o posterior.

```bash
npm ci
npm run build
```

El resultado se escribe en `dist/index.html`. Puedes abrirlo directamente en el navegador.

## Refrescar los datos del SINAC

Los operadores de cada red de distribución salen de la consulta ciudadana del SINAC (Ministerio de Sanidad). El SINAC responde 403 a clientes automatizados (curl, Playwright), así que la extracción se hace con un **script de consola de navegador**, `scripts/extract_sinac_console.js`. El script lanza las peticiones desde la propia página del SINAC, sin saltar ninguna protección. Es el método que se usó el 30/10/2026.

1. Abre en el navegador https://sinac.sanidad.gob.es/CiudadanoWeb/ciudadano/informacionAbastecimientoActionEntrada.do
2. Abre la consola (Cmd+Opt+J en Mac, Ctrl+Mayús+J en Windows), pega el contenido de `scripts/extract_sinac_console.js` y pulsa Intro.
3. Espera: son unas 27.000 peticiones y el servidor atiende una o dos por segundo, así que tarda varias horas. El título de la pestaña muestra el avance. No la cierres.
4. Al terminar aparece un botón azul **Descargar sinac_redes.csv**: púlsalo (el navegador no permite descargas automáticas sin clic). La consola indica cuántas redes se han descargado y cuántos errores ha habido.
5. Copia el archivo a `raw/sinac_redes_<fecha>.csv`, actualiza esa ruta en `scripts/build_es_mun.js` y en `tests/lib/provenance.js`, y ejecuta `npm run build` y `npm test`.

Cómo funciona: pide las provincias y los municipios de cada comunidad (`cargarComboProvinciasAction.do`, `cargarComboMunicipiosAction.do`), las redes de cada municipio (`informacionRedes.do`) y la ficha de cada red (`informacionAbastecimientoActionDetalleRed.do`). Todas las peticiones son POST con `credentials: 'omit'`: sin la cookie de sesión, el servidor no pone las peticiones en cola y va de 5 a 10 veces más rápido. Trata 4 municipios en paralelo y reintenta cada petición 3 veces. De cada ficha guarda gestor, responsable, localidades abastecidas (localidad, población y %), dotación y emisor de la factura. La extracción del 30/10/2026 dio 8.132 municipios, 18.939 redes y 2 errores. En aquella ejecución se procesaron primero las ciudades de más de 20.000 habitantes; el script recorre las comunidades en orden, lo que cambia el orden de las filas pero no su contenido.

La EIEL se refresca con `node scripts/extract_eiel.js` (ver `CONTRIBUTING.md`).

## Estructura

| Carpeta | Contenido |
|---|---|
| `raw/` | Transcripciones de cada fuente, tal como se publicaron. Es el origen de todos los datos. |
| `data/` | Datos intermedios generados desde `raw/`, y `sources.md` con el detalle de fuentes, decisiones y discrepancias. |
| `src/` | Código de la página: `body.html`, `app.js`, estilos y geometría base. |
| `scripts/` | Generación de los datos y ensamblado de la página. |
| `tests/` | Verificaciones automáticas. |
| `reference/` | Versión 2 publicada, usada como referencia de regresión. |
| `dist/` | Salida de la generación. No se guarda en el repositorio. |

## Fuentes y licencias

El código se publica con licencia MIT (`LICENSE`). Los datos conservan la licencia de su fuente original: consulta `DATA-LICENSES.md`.

Desde FWG-1868 el visor usa también fuentes que no permiten redistribuir libremente sus datos (ESF / Aigua és Vida, con derechos de sus autores; SINAC, información pública del Ministerio de Sanidad cuyas condiciones de reutilización están pendientes de verificar; EIEL, CC BY-NC-SA 4.0, sin uso comercial). Se admiten porque cada dato se cita con su fuente en la ficha del municipio, en `data/sources.md` y en `DATA-LICENSES.md`. Que el visor sea privado se decidirá en otro ticket. El detalle de cada fuente, la fecha de consulta y las decisiones aplicadas están en `data/sources.md`.

## Cómo contribuir

Todo cambio entra por pull request y solo se une a `main` con las verificaciones en verde. Las correcciones de datos deben cambiar primero el archivo de `raw/` del que proceden.
