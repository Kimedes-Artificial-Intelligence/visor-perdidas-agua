// ================= Precedencia del dato de pérdidas de un municipio (FWG-1870) =================
// Un municipio puede tener varias fuentes. Se pinta la primera de esta lista que tenga dato:
//   1. aca:    auditoría publicada en el registro de la ACA (Catalunya, F9 agua no registrada)
//   2. art63:  agua no registrada o pérdidas reales en % publicadas por el operador o el ayuntamiento (art. 63.2 RD 3/2023)
//   3. eiel:   pérdidas declaradas en la EIEL. Hay un solo valor por municipio (media de sus núcleos): los valores no
//              redondeados y los múltiplos de 5 no compiten entre sí; la ficha dice qué parte son múltiplos de 5
//   4. sistema: agua no registrada o pérdidas reales que el operador publica para todo un sistema de varios municipios,
//              pintada sin cambios solo en los municipios que la propia fuente lista como servidos (FWG-1871, decisión D2).
//              Va detrás de las fuentes municipales: un dato del municipio siempre gana
//   5. ib:     estimación del Govern de les Illes Balears
// El rendimiento, el IFE y el ILI del art. 63.2 no son porcentajes de pérdidas: no entran aquí ni se convierten.
const LOSS_ORDER=["aca","art63","eiel","sistema","ib"];
function pickLoss(c){for(const k of LOSS_ORDER)if(c[k])return c[k];return null;}
// Fila del art. 63.2 que se pinta: agua no registrada antes que pérdidas reales; ninguna si solo hay otros indicadores
const A63_PAINT=["ANR","PERDIDAS_REALES"];
function a63Paint(rows){for(const k of A63_PAINT){const r=(rows||[]).find(x=>x[0]===k);if(r)return r;}return null;}
// Cifra de sistema que se pinta (D2), con el mismo orden: rows en el formato de A63.s, [patrón, operador, ámbito, indicador, valor, ...]
function sysPaint(rows){for(const k of A63_PAINT){const r=(rows||[]).find(x=>x[3]===k);if(r)return r;}return null;}
// Servicio que la fuente declara en el municipio: solo se pinta donde el operador distribuye o la fuente no distingue;
// donde solo vende agua en alta o solo factura (gestión comercial), la cifra del sistema no describe la red del municipio
const SYS_SERVICIO=["distribucion","alta","comercial","sin_especificar"],SYS_PAINT_SERVICIO=["distribucion","sin_especificar"];
// Motivo común a todo municipio sin pérdidas: MITECO no publica por municipio la evaluación de fugas 2024 (Parte 5).
// sol: fecha AAAA-MM-DD de la solicitud de acceso a la información, o vacía mientras no se presente
function mitecoReason(sol){return "MITECO no publica por municipio la evaluación de fugas estructurales de 2024 (RD 3/2023), solo un resumen"+
  (sol?`; solicitud de acceso a la tabla municipal presentada el ${sol.split("-").reverse().join("/")}.`:"; la solicitud de acceso a la tabla municipal está pendiente de presentar.");}
if(typeof module!=="undefined")module.exports={LOSS_ORDER,pickLoss,A63_PAINT,a63Paint,sysPaint,SYS_SERVICIO,SYS_PAINT_SERVICIO,mitecoReason};
