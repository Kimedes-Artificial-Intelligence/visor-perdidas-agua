# Cómo contribuir

Esta guía explica, paso a paso, cómo proponer un dato nuevo o una corrección en el visor. El ejemplo es el caso más habitual: añadir la auditoría 2024 de un municipio de Catalunya. Todo se hace desde la web de GitHub, sin instalar nada ni descargar el proyecto.

Cualquier persona puede contribuir, sea o no de Kimedes. Hay dos vías:

| Vía | Para quién | Qué necesitas |
|---|---|---|
| **A. Sin acceso** | Cualquier persona | Una cuenta gratuita de GitHub. Tu propuesta llega desde una copia del repositorio (un *fork*). |
| **B. Con acceso** | Miembros del equipo "visor" de la organización Kimedes | Permiso de escritura en el repositorio. Trabajas en una rama del propio repositorio. |

Si no sabes cuál es la tuya, usa la vía A: funciona siempre.

Si solo quieres avisar de un error o proponer una fuente sin editar nada, abre un issue con las plantillas "Nuevo dato o fuente" o "Corrección": https://github.com/Kimedes-Artificial-Intelligence/visor-perdidas-agua/issues/new/choose

## 1. Crear una cuenta de GitHub

Solo la primera vez.

1. Entra en https://github.com/signup y crea una cuenta. El plan gratuito es suficiente.
2. Confirma tu correo con el enlace que te envía GitHub.

Si eres de Kimedes y vas a contribuir con frecuencia, abre un issue pidiendo entrar en el equipo "visor" e indica tu usuario de GitHub. Cuando te añadan recibirás un correo con una invitación a la organización: ábrelo y pulsa **Join**. Desde entonces puedes usar la vía B.

## 2. Reunir los datos

Necesitas el documento de la auditoría 2024 publicado por el operador, normalmente un PDF enlazado desde el registro de la ACA. Anota estos datos:

| Dato | Qué es | Obligatorio |
|---|---|---|
| Código INE | Código de 5 dígitos del municipio. Lo encuentras en https://www.idescat.cat buscando el municipio, o en `raw/aca_powerbi_2024_obligats.psv` (son los 5 primeros dígitos del código de 6). | Sí |
| F1 | Pérdidas reales en litros por acometida y día | No |
| F4 | Índice de pérdidas de infraestructura (ILI) | No |
| F6 | Pérdidas aparentes, en % del consumo autorizado | No |
| F7 | Agua no facturada, en % | No |
| F9 | Agua no registrada, en %. Es el dato que pinta el mapa. | Sí |
| Año | Año de los datos, no el de publicación. Normalmente 2024. | Sí |
| URL | Dirección exacta del documento | Sí |
| PR | Pérdidas reales en % del volumen de entrada, si el balance lo publica | No |
| PA | Pérdidas aparentes en % del volumen de entrada, si el balance lo publica | No |

Reglas que no se pueden saltar:

- Solo valores publicados por una fuente oficial o por el operador. Si un indicador no aparece en el documento, deja ese campo vacío. Nunca lo calcules ni lo estimes.
- El año tiene que estar claro en el documento. Si no lo está, explícalo en las notas (paso 4).
- Si el municipio no tiene auditoría publicada, no se añade nada: el visor lo muestra en gris con "sin dato publicado".
- Toda fuente tiene que estar citada en la ficha del municipio, en `data/sources.md` y en `DATA-LICENSES.md`, con sus condiciones de uso. Desde FWG-1868 se admiten fuentes con derechos reservados o sin uso comercial (ESF / Aigua és Vida, SINAC, EIEL) siempre que se citen así; no se admiten fuentes cuyo aviso legal prohíba expresamente extraer sus datos (por ejemplo 3Cat/ACN).

## 3. Editar `raw/aca2024_extract.psv`

1. Abre https://github.com/Kimedes-Artificial-Intelligence/visor-perdidas-agua/blob/main/raw/aca2024_extract.psv
2. Pulsa el icono del lápiz (**Edit this file**), arriba a la derecha del contenido.
   - **Vía A:** GitHub te avisa de que vas a editar en tu propia copia del repositorio. Pulsa **Fork this repository**. Solo pasa la primera vez.
3. Comprueba que el municipio no está ya en el archivo: pulsa Ctrl+F (Cmd+F en Mac) y busca su código INE. Si ya está, corrige esa línea en vez de añadir otra. Un mismo código no puede aparecer dos veces.
4. Ve al final del archivo y añade una línea nueva con este formato, separando los campos con una barra vertical `|`:

   ```
   código INE|F1|F4|F6|F7|F9|año|URL|PR|PA
   ```

   Ejemplo real del archivo (Vilassar de Mar):

   ```
   08219|42.7|0.74|6.2|10.7|10.7|2024|https://www.aiguesdevilassar.cat/wp-content/uploads/2025/07/2-Indicadors_gestio_fuites.pdf|4.9|
   ```

   Fíjate en que:
   - Siempre hay 10 campos, es decir, 9 barras verticales, aunque algunos estén vacíos. En el ejemplo, PA está vacío y por eso la línea termina en `|`.
   - Los decimales llevan **punto**, no coma: `10.7`, no `10,7`.
   - No hay espacios alrededor de las barras ni el símbolo `%`.
   - El código INE lleva el cero inicial: `08219`, no `8219`.
   - Un campo vacío se escribe sin nada entre dos barras: `||`.

5. Pulsa **Commit changes...** (arriba a la derecha). Escribe un título corto, por ejemplo `Auditoría 2024 de Lleida`.
   - **Vía B:** marca **Create a new branch for this commit and start a pull request** y pon un nombre de rama como `auditoria-2024-lleida`.
   - **Vía A:** GitHub crea la rama en tu copia automáticamente.
6. Pulsa **Propose changes**.

## 4. Añadir una nota, si hace falta

Si el caso tiene algo particular (el PDF es una imagen y has leído los valores en pantalla, el año sale del nombre del archivo, un indicador es ilegible...), añade una línea en `raw/aca2024_notes.txt` en **la misma rama**:

1. En la página de tu cambio, pulsa el nombre de tu rama.
2. Abre `raw/aca2024_notes.txt`, pulsa el lápiz y añade al final una línea como esta:

   ```
   25120 Lleida: año 2024 por el título del informe; F1 ilegible, omitido.
   ```

3. Pulsa **Commit changes...**, deja marcada la opción **Commit directly to the ... branch** (con el nombre de tu rama) y confirma.

## 5. Abrir el pull request

Después de **Propose changes** aparece la página **Comparing changes** u **Open a pull request**.

1. Si ves el botón **Create pull request**, púlsalo.
2. Revisa el título y rellena la descripción: la plantilla pide qué cambia y la fuente (URL y página). Marca cada casilla de la lista de comprobación después de revisarla.
3. Pulsa **Create pull request**.

## 6. Esperar a las verificaciones

Al abrir el pull request se ponen en marcha unas comprobaciones automáticas. Las ves al final de la página del pull request.

**Vía B (equipo "visor"):**

1. Es normal que la primera comprobación salga en rojo con el mensaje "data/ no coincide con lo que genera npm run build": el visor todavía no se ha regenerado con tu dato.
2. En uno o dos minutos aparece en tu pull request un commit automático llamado **Regenerar data/ y referencia desde raw/**.
3. Después de ese commit las comprobaciones se repiten y deben quedar en verde (una marca verde junto a "Generación y verificaciones"). Tarda unos tres minutos.
4. Si mientras tanto se han unido otros cambios a `main`, GitHub avisará de que tu rama está desactualizada o tiene conflictos. No uses **Update branch** ni **Resolve conflicts**: en la columna de la derecha, en **Labels**, pon la etiqueta **regenerar**. GitHub incorpora los cambios de `main`, regenera el visor y quita la etiqueta al terminar.

**Vía A (fork):**

1. Las comprobaciones de un pull request desde un fork no arrancan solas la primera vez: una persona del equipo tiene que aprobarlas. Es una medida de seguridad de GitHub.
2. Una persona del equipo revisará tu cambio y pondrá la etiqueta **regenerar**. Entonces GitHub copia tus cambios de `raw/` a una rama del repositorio, regenera el visor y abre un pull request nuevo con tus cambios, firmado con tu usuario.
3. Recibirás un comentario con el enlace. La revisión sigue en ese pull request nuevo; el tuyo se cerrará. No tienes que hacer nada más salvo responder si te preguntan algo.

Si después de la regeneración algo sigue en rojo:

1. Pulsa **Details** junto a la comprobación en rojo.
2. Busca el paso marcado con una cruz y lee el mensaje. Los errores más habituales:
   - Un código INE que no existe o que no es de Catalunya.
   - Un número con coma en vez de punto, o un `%` dentro de un campo.
   - Una línea con más o menos de 10 campos.
   - Un código que ya estaba en el archivo.
3. Corrige el archivo en tu rama (como en el paso 4). En la vía A, avisa con un comentario para que vuelvan a poner la etiqueta **regenerar**.

Si no entiendes el error, escribe un comentario en el pull request.

## 7. Ver la vista previa

Cuando las comprobaciones estén en verde puedes ver cómo queda el visor con tu dato:

1. En el pull request con el commit de regeneración, abre la pestaña **Checks**.
2. Elige la última ejecución de **CI**.
3. En el resumen, baja hasta **Artifacts** y pulsa **vista-previa**. Se descarga un archivo `.zip`.
4. Descomprímelo (doble clic) y abre `index.html` con el navegador.
5. Pulsa **Catalunya**, busca tu municipio en el mapa o en el ranking y comprueba el valor, el año y la fuente.

## 8. Revisión y publicación

Una persona responsable del repositorio revisa el pull request y lo une a `main`, o te pide cambios con un comentario. Si pide cambios, corrígelos en la misma rama, como en el paso 4.

Todo cambio entra por pull request y solo se une a `main` con las comprobaciones en verde; no hace falta una aprobación formal. No pulses **Merge pull request** aunque el botón aparezca activo: lo hace quien revisa.

## Para quien trabaje en local

Si cambias código, estilos o textos de la página, la regeneración automática no se aplica y hay que hacerlo en local. Necesitas Node 24 o posterior y Git.

```bash
npm ci
```

```bash
npm run build
```

```bash
npm test
```

Las pruebas en el navegador necesitan Chromium la primera vez:

```bash
npx playwright install chromium
```

Si el cambio altera a propósito los datos o la página publicada, actualiza la referencia de regresión y súbela en el mismo pull request, para que el cambio quede visible en la revisión:

```bash
npm run reference:update
```

Antes de abrir el pull request, comprueba la regla de procedencia (ningún dato cambia sin que cambie su archivo de origen):

```bash
npm run check:provenance -- main
```

## Clasificar operadores del SINAC

El SINAC da el nombre del gestor de cada red, no su tipo. El tipo (municipalizado, mixto o privado) sale de `data/operadores_clasificacion.csv`, una tabla que se edita a mano:

```
patron;tipo;grupo;nota
FCC AQUALIA;Privado;;
```

- `patron`: texto que debe aparecer en el nombre del gestor. Se compara sin acentos, en mayúsculas, sin signos y por palabras completas (`SPT` no casa con `ASPTEC`).
- `tipo`: `Municipalizado`, `Mixto`, `Privado` o `No es operador`. Este último sirve para sistemas de información y laboratorios (EKUIS, ANTICIMEX...): en su lugar se muestra el responsable de la red, que no se usa para deducir el modelo de gestión.
- Gana el **primer** patrón que casa, así que los más específicos y los mixtos van antes que los genéricos.
- Solo se añade un patrón cuando el tipo está confirmado en una fuente (web del operador, portal de transparencia del ayuntamiento, boletín oficial, registro mercantil, pliego). Nunca por intuición: lo que no casa queda "Sin clasificar". Un nombre de empresa con "Municipal" o "Pública" no basta: para `Municipalizado` la fuente tiene que decir que el capital es 100 % público (o que es una entidad pública empresarial, un organismo autónomo o un medio propio unipersonal); si hay socio privado, es `Mixto`.
- `nota` cita la fuente con este formato, que comprueban las pruebas: `Fuente: <URL> (consulta DD/MM/AAAA): «cita literal que lo confirma»`, y opcionalmente detrás un punto y el tipo de documento o la fecha. Sin `;`, que separa columnas.
- `grupo`: el socio privado o el grupo empresarial, solo si la fuente lo nombra. La ficha del municipio muestra el grupo y enlaza la fuente.
- Los patrones de arranque de FWG-1868 (EKUIS, AQUALIA, AYUNTAMIENTO...) no tienen nota; la prueba los lista y cualquier patrón nuevo debe citar su fuente.

`npm run build` regenera `data/operadores_sin_clasificar.csv`, ordenado por población abastecida: es la lista de trabajo para completar la tabla.

## Volver a extraer la EIEL de la Comunidad de Madrid

La Comunidad de Madrid no está en el visor nacional de la EIEL: publica su fase 2023 en la IDEM con licencia CC BY 4.0. La red de distribución se extrae del servicio WFS, sin navegador:

```bash
node scripts/extract_idem_eiel.js --fecha=2026-10-30
```

Lee primero el esquema de la capa `IDEM_EIEL_RED_DISTRIBUCION_23` (se para si cambia algún campo), descarga los tramos de 10.000 en 10.000 con una pausa de un segundo y escribe `raw/idem_eiel_rd_<fecha>.csv` con los valores literales de la fuente y la longitud geodésica sumada por combinación de atributos. Con `--check` compara con el archivo de `raw/` sin escribir nada. `scripts/build_es_mun.js` traduce las palabras de la IDEM (FIBROCEMENTO, EMPRESA PUBLICA NO MUNICIPAL...) a los códigos del diccionario EIEL; una palabra nueva para la generación hasta que se añada a `IDEM_CODE`.

## Volver a extraer la EIEL

`eiel.redsara.es` no responde desde la nube; se extrae en local con Playwright:

```bash
node scripts/extract_eiel.js --fecha=2026-10-30
```

Escribe `raw/eiel_provincias_<fecha>.csv`, `raw/eiel_nucleos_<fecha>.csv` y `raw/eiel_rd_<fecha>.csv` (4 peticiones a la vez como máximo, 60 ms de pausa). Con `--prov=11 --check` vuelve a extraer una provincia y la compara con los archivos de `raw/` sin escribir nada. Si cambia la fecha, actualiza las rutas de `scripts/build_es_mun.js` y de `tests/lib/provenance.js`.
