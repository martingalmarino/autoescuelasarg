# Banco Córdoba (normativa general): reporte editorial

Archivo de datos: `cordoba-general.json` (compilado el 2026-10-09). Este reporte es interno: no se publica en el sitio.

## Resumen

| Concepto | Cantidad |
| --- | --- |
| Preguntas del PDF original | 205 |
| Registros compilados (normativa general, sin gráficos) | 132 |
| Preguntas puntuables publicadas | 106 |
| Duplicados archivados | 16 |
| Pendientes de revisión | 10 |
| Excluidas por incluir gráficos | 25 |

Criterio del pool: `enabled === true && status !== "needs_review" && duplicate_of === null && correct_option_id !== null`. Lo aplica `lib/driving-tests/tests/guia-del-buen-conductor-cordoba.ts` y lo verifica `npm run check:tests`.

## Pendientes de revisión

No se publican. Para habilitarlas hace falta una fuente oficial fechada de la Ciudad de Córdoba; registrá el cambio exacto y la fuente en `editorial_changes` y `reference_ids`.

| Nº fuente | ID | Pregunta | Motivo |
| --- | --- | --- | --- |
| 71 | cordoba-general-071 | ¿Cuál es el índice máximo permitido de alcohol en aire expirado para un conductor particular mayor de 21 años de edad en la Ciudad de Córdoba? | El manual y el preguntero publicado en 2025 dicen aire expirado, pero expresan el resultado en g/l; el Código de Convivencia municipal consultado regula alcohol en sangre. Aclarar matriz, unidad y ámbito municipal antes de evaluar. No sustituir automáticamente por el régimen provincial de alcohol cero. |
| 76 | cordoba-general-076 | ¿En intersecciones NO semaforizadas puedo girar a la izquierda? | La respuesta Sí no especifica sentido de circulación, señales ni restricciones del giro. Reformular con un escenario completo antes de usarla como regla general. |
| 85 | cordoba-general-085 | Ud. posee licencia profesional “Categoría Transporte Escolar”. ¿Dicha licencia lo habilita a conducir vehículos particulares? | Confirmar equivalencias de categorías de la licencia municipal actual. La denominación Transporte Escolar del documento no permite trasladar automáticamente su respuesta al sistema vigente. |
| 86 | cordoba-general-086 | ¿Es válida la licencia de conducir en la Ciudad de Córdoba. si fue otorgada por otro Municipio o Comuna, siendo que el titular de la misma se domicilia en la Ciudad de Córdoba? | Confirmar la regla local vigente y contemplar cambios de domicilio, licencias nacionales y períodos de validez aplicables; la prohibición absoluta del manual requiere revisión. |
| 87 | cordoba-general-087 | ¿En qué plazo máximo debo denunciar obligatoriamente todo cambio de datos contenidos en mi licencia de conducir a los efectos de que no caduque la misma? | Confirmar el plazo municipal vigente para cambios de datos y su compatibilidad con el régimen actual de licencias. No dar por vigente el plazo sólo por aparecer en el manual. |
| 88 | cordoba-general-088 | ¿Es obligatorio que la licencia de conducir esté firmada por el titular de la misma? | Confirmar cómo aplica el requisito de firma a las credenciales vigentes, incluidas las digitales. El manual formula una regla absoluta. |
| 101 | cordoba-general-101 | ¿El portar la póliza del seguro, acredita que mi vehículo se encuentra asegurado? | Distinguir póliza, comprobante de cobertura vigente y recibo de pago. No enseñar que se exige recibo de pago ni que una póliza vigente es siempre insuficiente sin verificar la regla aplicable. |
| 143 | cordoba-general-143 | Las señales informativas son de color: | La respuesta Azules generaliza todas las señales informativas; existen subtipos con otros colores. Especificar el subtipo de señal o reformular antes de evaluar. |
| 148 | cordoba-general-148 | ¿En cuestas estrechas ¿qué automóvil tiene prioridad de paso? | La prioridad en cuestas estrechas puede tener excepciones vinculadas a vehículos con acoplado y posibilidades de apartamiento. Precisar el escenario antes de evaluar. |
| 150 | cordoba-general-150 | Ud. utiliza los destellos luminosos (cambio rápido de luces) para..... | La expresión Advertir el cruce en las intersecciones es demasiado amplia y puede interpretarse como autorización para avanzar. Verificar el supuesto permitido de destellos y formularlo con precisión. |

## Duplicados archivados

Equivalen a otra pregunta del banco; se conservan para trazabilidad y no se publican.

| Nº fuente | ID | Equivale a (Nº fuente) |
| --- | --- | --- |
| 32 | cordoba-general-032 | cordoba-general-013 (13) |
| 52 | cordoba-general-052 | cordoba-general-028 (28) |
| 55 | cordoba-general-055 | cordoba-general-005 (5) |
| 61 | cordoba-general-061 | cordoba-general-016 (16) |
| 79 | cordoba-general-079 | cordoba-general-066 (66) |
| 114 | cordoba-general-114 | cordoba-general-038 (38) |
| 116 | cordoba-general-116 | cordoba-general-030 (30) |
| 117 | cordoba-general-117 | cordoba-general-152 (152) |
| 120 | cordoba-general-120 | cordoba-general-119 (119) |
| 121 | cordoba-general-121 | cordoba-general-119 (119) |
| 123 | cordoba-general-123 | cordoba-general-040 (40) |
| 139 | cordoba-general-139 | cordoba-general-038 (38) |
| 141 | cordoba-general-141 | cordoba-general-012 (12) |
| 142 | cordoba-general-142 | cordoba-general-019 (19) |
| 146 | cordoba-general-146 | cordoba-general-045 (45) |
| 149 | cordoba-general-149 | cordoba-general-041 (41) |

## Excluidas

- Con gráficos o señales ilustradas (Nº fuente): 6, 9, 22, 23, 24, 25, 29, 34, 36, 51, 53, 58, 59, 77, 82, 124, 130, 131, 132, 133, 134, 135, 136, 137, 153.
- Fuera del alcance general (Nº fuente 158 a 205): Sección específica de motovehículos, carga, transporte de pasajeros, taxis y remises; no se mezcla con el test general de automóviles.

## Preguntas con cambios editoriales

| Nº fuente | ID | Cambio |
| --- | --- | --- |
| 10 | cordoba-general-010 | Se explicita que se consulta por el límite general y que puede existir señalización específica. |
| 44 | cordoba-general-044 | Se acota el enunciado a la ubicación en el vehículo, sin presentar el cinturón como único sistema de sujeción para todos los menores. |
| 47 | cordoba-general-047 | Se precisa el momento de la primera inspección y se contrasta la periodicidad municipal. |
| 54 | cordoba-general-054 | Se explicita que se consulta por el límite general y que puede existir señalización específica. |
| 70 | cordoba-general-070 | Se retira la clasificación del paragolpes como seguridad activa; se conserva la prohibición de circular en esas condiciones. |
| 80 | cordoba-general-080 | Se incorpora la excepción del tercero habilitado para evitar una respuesta absoluta incompleta. |
| 100 | cordoba-general-100 | Se simplifica el requisito sin exigir documentación adicional de pago ni definir un soporte particular. |
| 129 | cordoba-general-129 | Se evita confundir velocidad precautoria con una velocidad mínima reglamentaria fija. |
