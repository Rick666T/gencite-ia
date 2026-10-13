# GenCite IA 2.1 · Bitácora de pruebas y límites

**Fecha:** 13 de octubre de 2026 · **Responsable:** Ricardo Tavira Sánchez.  
**Objetivo:** verificar integridad del generador, navegación entre dos páginas, accesibilidad básica, fuentes del directorio y usabilidad responsiva.

## 1. Resultados automatizados

Comando ejecutado: `npm test` (equivalente a `node --test tests/*.test.mjs`).

**66/66 comprobaciones aprobadas**, sin casos fallidos. Incluyen:

- 6 autoridades bibliográficas y 22 casos con ejemplos completables en español.
- Escapado de HTML introducido por el usuario; validación de enlaces, fechas imposibles, número de referencia y selección de opciones válidas.
- APA: año/fecha, cursivas en títulos, negrita de número de figura/tabla, cursivas exclusivamente en **Nota**, referencias de herramientas y chats, citas narrativa y parentética como **alternativas**, notas para gráficos/tablas/imágenes sin pares de citas redundantes y menciones incorporadas en Método.
- MLA: título descriptivo entre comillas, nombre de herramienta en cursivas, fechas y créditos de figuras. Las expresiones inglesas indispensables de los ejemplos normativos oficiales se conservan como elementos de estilo, aunque el ejemplo aportado por el usuario sea español.
- Chicago: notas, créditos, numeración en superíndice y distinción respecto de bibliografía recuperable.
- ACS: referencias y llamadas numéricas con superíndices HTML reales; no inventa posiciones bibliográficas.
- AMA e IEEE: declaración en lugar de referencia artificial cuando las instrucciones oficiales así lo establecen.
- Directorio: 65 ID únicos, 37 fichas mexicanas, 8 privadas mexicanas, 28 internacionales; 3 guías UNAM 2026, estudio SEP 2026, 3.ª edición Comisión Europea en investigación (con historial); links con esquema HTTPS y ausencia de sector editorial o revista en fichas.
- Estructura GitHub Pages: existencia de los dos HTML, navegación relativa bidireccional, guía modal en ambas páginas y atribución © 2026 Ricardo Tavira Sánchez.

## 2. Navegador y diseño

Pruebas con Chromium/Playwright sobre **los archivos HTML/CSS/JS reales** (en el entorno de ejecución se inyectaron en un DOM porque el navegador administrado bloquea `file://`; no es una prueba de sitio desplegado).

**Resultado:** escenario integral completado sin errores JavaScript:

- Cambio entre seis estilos y 22 formularios; carga de ejemplos válidos.
- Verificación de salidas APA con imagen/gráfica/tabla/método sin duplicación parentética/narrativa; sí se ofrecen ambas formas como alternativas en herramienta/chat.
- Copia de HTML enriquecido (`text/html`) y texto plano (`text/plain`) comprobada con API de portapapeles simulada: `<em>`, `<strong>` y `<sup>` presentes donde corresponden.
- Filtrado del directorio, búsqueda sin tildes, orden cronológico, tipo/sector, restauración, caso sin resultados, historial de ediciones y exportación CSV.
- Botón **Ayuda** abre y cierra el diálogo en **ambas páginas**.
- Ocho resoluciones de interfaz (1280, 1024, 768, 520, 430, 390, 375 y 320 px): **sin desplazamiento horizontal indebido ni desbordamiento** en los escenarios comprobados.
- Capturas revisadas de Generador, Políticas y guías, salidas APA de gráfica y anchos móviles de 320 y 390 px.

## 3. Exclusiones y verificación documental

- Se eliminaron políticas particulares de revistas, editoriales y manuales bibliográficos del directorio; estos últimos permanecen enlazados desde el generador para documentar sus reglas.
- Se integraron las guías UNAM de bachillerato, licenciatura y posgrado (2026) y el informe general de la SEP relativo a usos y percepciones de IAG en educación superior mexicana (2026).
- Se añadieron fuentes oficiales globales reconocidas: UNESCO IESALC, Russell Group, European University Association y dos informes de la Comisión Europea publicados en septiembre de 2026.
- **La revisión no garantiza que los 65 documentos sean el universo completo de todas las IES mexicanas** ni que cada URL siga accesible indefinidamente; el sitio no hace comprobación de enlaces en tiempo real. Se comprueba la autenticidad de los enlaces originales según su fuente institucional al incorporar registros.

## 4. Pruebas pendientes antes de distribución pública

- Publicar la carpeta completa en un repositorio de GitHub Pages y comprobar manualmente las dos rutas públicas `index.html` y `politicas.html`.
- Comprobar `Copiar con formato` pegando en las versiones de Microsoft Word, Google Docs o los editores usados por los destinatarios (el comportamiento del editor receptor no está controlado por JavaScript).
- Revisar periódicamente las URL institucionales y ediciones vigentes. El directorio es estático, no se sincroniza de manera automática.

La ausencia de fallas en las pruebas indicadas **no permite afirmar que el programa sea perfecto**; delimita los escenarios efectivamente comprobados.
