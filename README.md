# GenCite IA · versión web 2.1

**Herramienta de citas y referencias especializadas en inteligencia artificial generativa y directorio de documentos académicos.**

- **Autoría, concepto bibliotecológico y recopilación:** Ricardo Tavira Sánchez.
- **Año de creación:** 2026.
- **Versión entregada:** 2.1 (13 de octubre de 2026).
- **Destino:** GitHub Pages o cualquier hospedaje estático de HTML, CSS y JavaScript.
- **Idioma:** interfaz, instrucciones, campos y ejemplos didácticos en español; se conservan los nombres propios y expresiones prescriptivas de los estilos en sus idiomas originales cuando corresponde.

## 1. Publicación en GitHub Pages

1. Descomprima `GenCiteIA_GitHub_Pages_2_1.zip`.
2. En GitHub, cree un repositorio público, por ejemplo `gencite-ia`.
3. Suba **todos los archivos y carpetas del ZIP** a la **raíz** del repositorio (no cargue la carpeta contenedora). En la raíz deben quedar, entre otros, `index.html`, `politicas.html`, `styles.css`, `generator.js` y `policies.js`.
4. Confirme los cambios mediante **Commit changes**.
5. Abra **Settings → Pages** y configure **Deploy from a branch**, rama `main`, carpeta `/(root)`.
6. La dirección final será similar a `https://USUARIO.github.io/gencite-ia/`. El ejemplo no indica que el sitio ya esté publicado.
7. Compruebe que funcionan las dos páginas, el botón **Ayuda**, los enlaces institucionales y la función **Copiar con formato**.

El paquete incluye `.nojekyll` para evitar modificaciones de rutas. **No necesita servidor propio, Node.js, API, claves, compilación, módulos descargados ni servicios de terceros** para funcionar. Node.js y Playwright son opcionales **solo para repetir las pruebas de desarrollo**.

Si desea abrir la herramienta sin GitHub, puede servir los archivos localmente con un servidor estático; algunos navegadores bloquean las importaciones JavaScript desde `file://`.

## 2. Organización de la web

El sitio tiene **dos páginas separadas**, con navegación persistente en el encabezado:

| Página | Dirección relativa | Contenido |
| --- | --- | --- |
| **Generador** | `index.html` | Selección de seis estilos, 22 casos, formularios de datos, resultados bibliográficos y enlaces a fuentes oficiales. |
| **Políticas y guías** | `politicas.html` | Directorio documental con buscador, filtros, descripciones, estados, ediciones anteriores verificadas y exportación CSV. |

El antiguo enlace «Acerca de» desapareció. En **ambas páginas** el botón **Ayuda** abre una guía superpuesta que puede cerrarse con «Cerrar», «Entendido» o `Esc`. No se necesita desplazarse hasta el pie para consultar las instrucciones. El diseño utiliza verde bosque, terracota, melocotón y beige cálido; fue revisado en escritorio y móvil.

## 3. Conceptos y funcionamiento del generador

- **Cita:** indicación breve de la fuente en el texto, o llamada a una nota en los estilos correspondientes.
- **Referencia:** descripción bibliográfica completa en la lista final, cuando el tipo de fuente y el estilo así lo establecen.
- **Nota o crédito:** información sobre origen, autoría humana, materiales base y participación de IA en una figura, tabla o imagen.
- **Declaración:** explicación del papel de la IA en la elaboración del trabajo o en la metodología. No es sinónimo de cita ni de referencia.

### Pasos de uso

1. Abra **Generador** y seleccione un estilo.
2. Elija el caso que corresponda exactamente con su uso: herramienta, conversación, tabla, gráfico, imagen, método o declaración, según lo previsto por esa autoridad.
3. Introduzca **datos reales** de su uso de IA. Para conocer el mecanismo pulse **Cargar ejemplo en español**. Los ejemplos son simulaciones didácticas: no asuma que sus URL compartidas son fuentes reales de consulta.
4. Pulse **Generar resultados**. Se mostrarán solamente los productos que correspondan: cita, referencia, encabezado, nota, crédito o declaración.
5. Use **Copiar con formato** si desea mantener cursivas, negritas y superíndices al pegar en Word u otro procesador compatible; la opción de texto plano elimina las marcas tipográficas.
6. Abra **Verificar en la fuente oficial** y revise las reglas originales y las instrucciones particulares de su institución o publicación. Tras pegar, revise interlineado, sangría francesa y tipografía del documento final.

### Estilos y alcance

| Autoridad | Productos abordados |
| --- | --- |
| **APA 7** | Herramienta, chat con enlace público, notas y encabezados de figuras/tablas, intervención metodológica y casos de IA integrada. |
| **MLA 9** | Conversaciones, creación textual, imágenes y reconocimientos; obras citadas cuando corresponde. |
| **Chicago 18** | Notas de atribución, créditos de imágenes y declaraciones descriptivas, sin inventar bibliografía. |
| **ACS** | Modelos oficiales de referencia para chatbot/generador de imágenes y sistema de citas numéricas. |
| **AMA 11** | Declaración de uso de modelos en investigación y redacción; no crea una referencia artificial. |
| **IEEE** | Declaración de texto/código/figura generado mediante IA o de asistencia editorial, conforme a la política de publicaciones. |

Las fuentes oficiales por caso se enlazan **desde el propio generador**. Una adaptación descriptiva en español no equivale necesariamente a una fórmula de texto impuesta por la autoridad editorial.

**Cuestión frecuente sobre APA:** las citas **parentética** y **narrativa** son **alternativas según la sintaxis de la oración**, no dos elementos que deban añadirse conjuntamente por cada uso. Para figuras y tablas elaboradas con ayuda de IA, la herramienta prepara encabezado, nota y referencia del software cuando corresponde, **sin generar dos citas redundantes**. El apartado de método incorpora la mención a la IA en el propio párrafo. Esto no exime de citar los datos originales, ni de cumplir las políticas adicionales de una revista, universidad o curso.

## 4. Directorio de políticas y guías

**65 documentos identificados: 37 de México y 28 internacionales**, incluidos **8 de instituciones privadas mexicanas**. Se trata de un directorio selectivo: **NO es un censo exhaustivo de universidades**, y el número de documentos no es el número de instituciones.

**Admisibles:** marcos, políticas, lineamientos y guías emitidos por universidades, facultades, centros y organizaciones académicas; estudios e informes institucionales relevantes para educación superior, investigación o docencia.

**Exclusiones:** políticas particulares de revistas académicas; normativas elaboradas solo por editoriales comerciales; fichas publicitarias o noticias sin documento académico útil. Las instrucciones de APA/MLA/Chicago/ACS/AMA/IEEE no se mezclan con las políticas universitarias: están vinculadas exclusivamente desde el generador.

El directorio incluye documentos particularmente solicitados:

- **SEP:** *Usos y percepciones sobre la Inteligencia Artificial Generativa en la educación superior mexicana*, resultados ENIAG 2025 publicados en 2026.
- **UNAM, Coordinación de Evaluación Educativa:** guías específicas de IA generativa en evaluación educativa para **bachillerato, licenciatura y posgrado** (2026), con sus enlaces originales.
- **Comisión Europea:** tercera edición de las orientaciones sobre IA generativa en investigación (mayo 2026), documentación de la edición de 2024 y dos informes educativos europeos de septiembre de 2026.
- **UNESCO y UNESCO IESALC**, **OCDE**, **Russell Group**, **European University Association**, QAA y orientaciones institucionales de universidades internacionales.

Las fichas distinguen *Publicada*, *Orientativa* y *Propuesta*; el año se deja vacío si no está documentado. Una guía orientativa **no equivale a una disposición institucional obligatoria**. Las ediciones históricas se incluyen solo donde hay evidencia y URL oficial: una simple actualización de una página no se registra como edición antigua inventada.

### Búsqueda, filtros y exportación

En **Políticas y guías**, busque por título, universidad, palabra clave, nivel, tema o versión. Combine ámbito, sector, tipo, nivel y orden cronológico/alfabético. El botón **Limpiar filtros** restablece la consulta; **Mostrar más documentos** despliega fichas adicionales. **Exportar CSV filtrado** guarda una hoja de registros UTF-8 con las fichas que cumplen los filtros, **no solo las primeras doce visibles**.

Para actualizar el directorio, edite los objetos en `policies.js`; cada ficha requiere `id` único, `geo`, `sector`, `org`, `unit`, `title`, `type`, `version`, `status`, `description`, `url`, año confirmado o `null`, y opcionalmente `more` y `history`. Verifique siempre la fuente en la web institucional y ajuste `POLICY_REVIEW_DATE` solo tras una nueva revisión.

**Corte documental:** 13 de octubre de 2026. El directorio **no se actualiza de forma automática**.

## 5. Privacidad, integridad y límites

- No se envían campos del generador a un servidor. Las entradas se almacenan localmente en `localStorage` del navegador. El botón de borrado se encuentra en la **Ayuda del Generador**.
- Al abrir una URL del directorio, la navegación sale de GenCite IA y se aplican las políticas del sitio de origen.
- La herramienta **no** busca metadatos, analiza chats por API, comprueba la validez actual de enlaces, verifica derechos de autor, juzga la integridad académica ni confirma si un contenido es fiable.
- No se inventan fechas, versiones ni referencias de documentos originales. El usuario es responsable de verificar atribución, año, edición, permisos, datos, citas y políticas aplicables.
- La opción de copiar HTML conserva etiquetas de énfasis, pero **no puede imponer márgenes, sangría o estilo global** al procesador de texto receptor.

## 6. Archivos

| Archivo | Contenido |
| --- | --- |
| `index.html` | Generador, formulario y sección de resultados. |
| `politicas.html` | Directorio, filtros y fichas institucionales. |
| `styles.css` | Diseño responsivo compartido. |
| `help.js` | Guía de uso contextual mediante diálogo modal. |
| `config.js` | Estilos, casos, campos, fuentes oficiales y ejemplos en español. |
| `generator.js` | Validación y generación bibliográfica con texto y HTML tipográfico. |
| `app.js` | Eventos del generador, persistencia local y portapapeles enriquecido. |
| `policies.js` | Documentos académicos enlazados y versiones identificadas. |
| `policies-ui.js` | Filtros, búsqueda, fichas, paginación y CSV. |
| `icons/` | Identidad visual local y favicon SVG. |
| `.nojekyll` | Compatibilidad con GitHub Pages. |
| `tests/` | Pruebas automatizadas y de navegador. |
| `PRUEBAS.md` | Protocolo y resultados de la revisión. |

## 7. Pruebas y mantenimiento

Opcionalmente, ejecute `npm test` o `node --test tests/*.test.mjs` para comprobar el motor y los contratos de la web (requiere Node.js 20 o superior). Para reproducir las pruebas de navegador se necesita Python, Playwright y Chromium; véase `tests/ui-browser.py` y `PRUEBAS.md`. Ninguno de estos paquetes se requiere **para usar** el sitio.

---

**GenCite IA © 2026 · Autor: Ricardo Tavira Sánchez.** Los documentos normativos y marcas citadas pertenecen a sus respectivas instituciones. La herramienta y el directorio no representan una aprobación, certificación o coautoría de esas entidades.
