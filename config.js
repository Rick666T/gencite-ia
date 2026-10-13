// Configuración editorial revisada: 13 de octubre de 2026.
// Los formatos con orientación explícita de fuentes primarias oficiales se separan de declaraciones sugeridas.
export const STYLES = [
  { id: 'apa', name: 'APA', edition: '7.ª edición', authority: 'American Psychological Association', note: 'Autor–fecha · citas y referencias' },
  { id: 'mla', name: 'MLA', edition: '9.ª edición', authority: 'Modern Language Association', note: 'Autor/título · obras citadas' },
  { id: 'chicago', name: 'Chicago', edition: '18.ª edición', authority: 'The Chicago Manual of Style', note: 'Notas y créditos para IA' },
  { id: 'acs', name: 'ACS', edition: 'Guía 2026', authority: 'American Chemical Society', note: 'Referencias a chatbots e imágenes' },
  { id: 'ama', name: 'AMA', edition: '11.ª edición', authority: 'American Medical Association', note: 'Declaración de IA en texto · sin entrada bibliográfica' },
  { id: 'ieee', name: 'IEEE', edition: 'Política de publicación', authority: 'Institute of Electrical and Electronics Engineers', note: 'Declaración de contenido generado · sin referencia artificial' },
];

export const SOURCES = {
  apa_chat: { title: 'APA Style · AI References (2026)', url: 'https://apastyle.apa.org/style-grammar-guidelines/references/examples/ai-references', desc: 'Ejemplos oficiales de herramientas y chats.' },
  apa_format: { title: 'APA Style · Reference formats (2025)', url: 'https://apastyle.apa.org/blog/cite-generative-ai-references', desc: 'Fechas, autor corporativo, título, modelo y URL; figuras y tablas.' },
  apa_integrated: { title: 'APA Style · IA en buscadores y software (2025)', url: 'https://apastyle.apa.org/blog/cite-generative-ai-search-software', desc: 'Casos en que no suele citarse la IA integrada.' },
  apa_figures: { title: 'APA Style · Tables and figures', url: 'https://apastyle.apa.org/style-grammar-guidelines/tables-figures', desc: 'Estructura de tablas y figuras.' },
  mla: { title: 'MLA Style Center · Guía revisada (2025)', url: 'https://style.mla.org/citing-generative-ai-updated-revised/', desc: 'Chats, texto creativo, imágenes y enlaces estables.' },
  mla_ack: { title: 'MLA · Beyond Citation (2025)', url: 'https://style.mla.org/describing-ai-use/', desc: 'Reconocimiento del uso sustantivo de IA.' },
  chicago_text: { title: 'Chicago Manual · Texto con IA (18.ª)', url: 'https://www.chicagomanualofstyle.org/qanda/data/faq/topics/Documentation/faq0422.html', desc: 'Citas formales en notas y mención de ajustes humanos.' },
  chicago_image: { title: 'Chicago Manual · Imágenes con IA (18.ª)', url: 'https://www.chicagomanualofstyle.org/qanda/data/faq/topics/Documentation/faq0423.html', desc: 'Crédito de imagen y descripción del prompt.' },
  chicago_guide: { title: 'Chicago Manual · Guía de citación', url: 'https://www.chicagomanualofstyle.org/tools_citationguide.aspx', desc: 'Diferencia entre notas–bibliografía y autor–fecha.' },
  acs: { title: 'ACS Guide · Style Quick Guide (2026)', url: 'https://pubs.acs.org/doi/10.1021/acsguide.40303', desc: 'Sección Artificial Intelligence: ejemplos de chatbot e image generator.' },
  ama: { title: 'AMA Manual of Style · actualizaciones oficiales', url: 'https://academic.oup.com/amamanualofstyle/pages/about/updates-to-the-manual', desc: 'Sección 3.15.13 (2024), sobre divulgación de uso de LLM en texto, no como referencia.' },
  ama_pub: { title: 'AMA · guía de aplicación (biblioteca universitaria)', url: 'https://guides.himmelfarb.gwu.edu/AMA/AI', desc: 'Resumen de requisitos de reporte del Manual: fecha, versión, fabricante, instrucciones y alcance.' },
  ieee: { title: 'IEEE · Política editorial (oficial)', url: 'https://journals.ieeeauthorcenter.ieee.org/become-an-ieee-journal-author/publishing-ethics/guidelines-and-policies/submission-and-peer-review-policies/', desc: 'Exige identificar sistema, secciones afectadas y grado de intervención en Agradecimientos; distingue revisión gramatical.' },
};

export const FIELD_DEFS = {
  company: { label: 'Empresa o entidad responsable', placeholder: 'Ej. OpenAI, Google, Anthropic', required: true, hint: 'No se atribuya autoría académica al modelo de IA.' },
  tool: { label: 'Herramienta o modelo utilizado', placeholder: 'Ej. ChatGPT, Gemini 3 Flash', required: true },
  model: { label: 'Modelo específico (si se conoce)', placeholder: 'Ej. GPT-4o, DALL·E 3', hint: 'No invente versiones ni números de modelo.' },
  year: { label: 'Año de actualización o copyright de la herramienta', type: 'number', required: true, placeholder: 'Ej. 2025', hint: 'APA: NO es automáticamente el año de la conversación ni el de hoy.' },
  date: { label: 'Fecha real de la conversación o generación', type: 'date', required: true },
  accessed: { label: 'Fecha de consulta de la herramienta', type: 'date', required: true },
  url: { label: 'URL de la herramienta', type: 'url', required: true, placeholder: 'https://...', hint: 'Compruebe que corresponda exactamente a la herramienta.' },
  shareUrl: { label: 'URL pública y estable de la conversación', type: 'url', required: true, placeholder: 'https://chatgpt.com/share/...', hint: 'Compruebe que otra persona pueda abrirla sin su sesión personal.' },
  mlaUrl: { label: 'URL de conversación/resultado o de la herramienta', type: 'url', required: true, placeholder: 'https://...', hint: 'MLA prefiere enlace directo estable; si no existe, admite la página general de la herramienta.' },
  chicagoUrl: { label: 'URL de la conversación compartida (si existe)', type: 'url', placeholder: 'https://...' },
  chatTitle: { label: 'Título real o descriptivo del chat', required: true, placeholder: 'Ej. Conceptos para un curso de IA', hint: 'No introduzca aquí todo el prompt; el título debe describir el chat.' },
  description: { label: 'Descripción del tipo de herramienta', type: 'select', options: [['Modelo de lenguaje de gran tamaño', 'Modelo de lenguaje de gran tamaño'], ['Generador de imágenes', 'Generador de imágenes'], ['Herramienta de IA generativa', 'Herramienta de IA generativa']], required: true },
  visualNumber: { label: 'Número de figura o tabla en el trabajo', type: 'number', required: true, placeholder: 'Ej. 2', hint: 'Debe coincidir con la numeración de su manuscrito.' },
  visualTitle: { label: 'Título del elemento visual', required: true, placeholder: 'Ej. Distribución de artículos por año' },
  dataset: { label: 'Fuente de los datos o material base', required: true, placeholder: 'Ej. Base propia de encuestas 2026', hint: 'Si hay datos de terceros, cite también su fuente original en el trabajo.' },
  review: { label: 'Verificación o revisión humana realizada', required: true, placeholder: 'Ej. revisé cálculos, escalas y rótulos' },
  humanName: { label: 'Responsable humano del elemento', required: true, placeholder: 'Ej. la autora, el equipo de investigación' },
  task: { label: 'Intervención concreta de la IA', required: true, placeholder: 'Ej. proponer código para el gráfico' },
  appendix: { label: 'Apéndice o repositorio de trazabilidad (opcional)', placeholder: 'Ej. Apéndice A' },
  workType: { label: 'Tipo de contenido', type: 'select', required: true, options: [['poema', 'Poema'], ['cuento', 'Cuento'], ['ensayo', 'Ensayo'], ['guion', 'Guion'], ['texto creativo', 'Otro texto creativo']] },
  workTitle: { label: 'Título o frase inicial de la obra generada', required: true, placeholder: 'Ej. El roble' },
  prompt: { label: 'Prompt o descripción de lo generado', required: true, type: 'textarea', placeholder: 'Ej. Explica los beneficios de los repositorios abiertos', hint: 'MLA y Chicago admiten describir lo solicitado; APA no incluye el prompt en la referencia.' },
  chicagoPrompt: { label: 'Prompt citado (opcional si ya aparece en el texto)', type: 'textarea', placeholder: 'Ej. Explica cómo elaborar una receta', hint: 'Si no se introduce, la nota atribuye el texto generado sin describir la instrucción.' },
  chicagoNoteNumber: { label: 'Número de nota (si se incluye enlace compartido)', type: 'number', placeholder: 'Ej. 1', hint: 'Sin URL, se produce una atribución textual y no es necesario numerarla.' },
  imagePrompt: { label: 'Descripción del prompt visual', required: true, type: 'textarea', placeholder: 'Ej. Diseña una infografía sobre verificación de fuentes' },
  original: { label: 'Material de terceros adaptado (si existe)', placeholder: 'Ej. imagen de Autor, 2023 (citar por separado)', hint: 'No borre la atribución ni las obligaciones de licencia del original.' },
  software: { label: 'Aplicación o software donde se integró la IA', required: true, placeholder: 'Ej. Microsoft Word, Canva' },
  function: { label: 'Función integrada usada', required: true, placeholder: 'Ej. autocorrección, asistente de diseño' },
  degree: { label: 'Grado o nivel concreto de generación por IA', required: true, placeholder: 'Ej. generó un borrador preliminar que fue reescrito por la persona autora' },
  purpose: { label: 'Finalidad real del uso de IA', required: true, type: 'textarea', placeholder: 'Ej. organizar una matriz inicial de categorías' },
  scope: { label: 'Parte del trabajo donde intervino', required: true, placeholder: 'Ej. metodología, figura 3, revisión del lenguaje' },
  noteNumber: { label: 'Número de nota dentro del documento', type: 'number', required: true, placeholder: 'Ej. 1' },
  citationNumber: { label: 'Número asignado a la fuente en su lista final', type: 'number', required: true, placeholder: 'Ej. 8', hint: 'En ACS la herramienta no puede conocer la posición real de su bibliografía.' },
  citationMode: { label: 'Sistema numérico de cita en el documento', type: 'select', required: true, options: [['sup', 'Superíndice'], ['paren', 'Número entre paréntesis']], hint: 'Mantenga el sistema que le exijan la revista o institución.' },
  creativeForm: { label: 'Forma de la obra (opcional)', placeholder: 'Ej. free verse, soneto, haiku', hint: 'Si se indica, aparece antes del tipo de obra (por ejemplo, poema en verso libre).' },
  editNote: { label: 'Descripción de ediciones humanas (opcional)', placeholder: 'Ej. editado por claridad y contenido' },
};

function section(title, fields) { return { title, fields }; }
export const CASES = {
  apa: [
    { id: 'tool', name: 'Herramienta o modelo', summary: 'Referencia general del software, sin asociarla a un chat concreto.', icon: 'tool', sources: ['apa_chat','apa_format'], sections: [section('Identificación', ['company','tool','description']), section('Publicación y localización', ['year','url'])] },
    { id: 'chat', name: 'Conversación compartida', summary: 'Cita breve y referencia a un diálogo recuperable.', icon: 'chat', sources: ['apa_chat','apa_format'], sections: [section('Conversación', ['company','tool','chatTitle']), section('Fecha y recuperación', ['date','shareUrl'])] },
    { id: 'image', name: 'Imagen o infografía con IA', summary: 'Encabezado, nota de figura y referencia de herramienta.', icon: 'image', sources: ['apa_format','apa_figures'], sections: [section('Figura', ['visualNumber','visualTitle','humanName','task']), section('IA utilizada', ['company','tool','description','year','url']), section('Detalles de atribución', ['review','original','appendix'])] },
    { id: 'chart', name: 'Gráfico apoyado por IA', summary: 'Identifica datos originales, tarea y comprobación humana.', icon: 'chart', sources: ['apa_format','apa_figures'], sections: [section('Gráfico', ['visualNumber','visualTitle','dataset']), section('IA y control humano', ['humanName','task','review','company','tool','description','year','url']), section('Trazabilidad', ['appendix'])] },
    { id: 'table', name: 'Tabla apoyada por IA', summary: 'Crea encabezado y nota, sin confundir datos e IA.', icon: 'table', sources: ['apa_format','apa_figures'], sections: [section('Tabla', ['visualNumber','visualTitle','dataset']), section('IA y control humano', ['humanName','task','review','company','tool','description','year','url']), section('Trazabilidad', ['appendix'])] },
    { id: 'method', name: 'IA en método o redacción', summary: 'Cita la herramienta y explica su participación en el estudio.', icon: 'pen', sources: ['apa_format','apa_integrated'], sections: [section('Herramienta', ['company','tool','description','year','url']), section('Intervención', ['purpose','scope','review'])] },
    { id: 'integrated', name: 'IA integrada o búsqueda', summary: 'Orientación oficial sobre casos que normalmente no requieren cita.', icon: 'help', sources: ['apa_integrated'], sections: [section('Uso instrumental', ['software','function'])] },
  ],
  mla: [
    { id: 'chat', name: 'Respuesta o conversación', summary: 'Obras citadas y cita abreviada según la descripción del prompt.', icon: 'chat', sources: ['mla'], sections: [section('Contenido utilizado', ['prompt']), section('Origen', ['tool','model','company','date','mlaUrl'])] },
    { id: 'creative', name: 'Obra textual generada', summary: 'Poema, cuento o texto creativo con título o primera línea.', icon: 'pen', sources: ['mla'], sections: [section('Obra', ['workTitle','creativeForm','workType']), section('Origen', ['tool','model','company','date','mlaUrl'])] },
    { id: 'image', name: 'Imagen o ilustración', summary: 'Crédito completo en pie de figura o entrada en Obras citadas.', icon: 'image', sources: ['mla'], sections: [section('Figura', ['visualNumber','imagePrompt']), section('Origen', ['tool','model','company','date','mlaUrl'])] },
    { id: 'ack', name: 'Uso asistencial', summary: 'Reconocimiento de edición, traducción o planificación con IA.', icon: 'pen', sources: ['mla_ack'], sections: [section('Transparencia', ['tool','company','purpose','scope','review'])] },
  ],
  chicago: [
    { id: 'text', name: 'Texto o conversación', summary: 'Nota formal de atribución; bibliografía de chat no exigida aquí.', icon: 'chat', sources: ['chicago_text','chicago_guide'], sections: [section('Nota al pie', ['chicagoNoteNumber','tool','company','date','chicagoUrl']), section('Contenido', ['chicagoPrompt','editNote'])] },
    { id: 'image', name: 'Imagen generada', summary: 'Crédito directo de imagen conforme a los ejemplos oficiales.', icon: 'image', sources: ['chicago_image'], sections: [section('Crédito de imagen', ['imagePrompt','tool','company','date']), section('Localización opcional', ['chicagoUrl'])] },
    { id: 'ack', name: 'Reconocimiento de uso', summary: 'Mención en el texto: no crea bibliografía artificial.', icon: 'pen', sources: ['chicago_text'], sections: [section('Transparencia', ['tool','company','purpose','scope'])] },
  ],
  acs: [
    { id: 'chatbot', name: 'Chatbot o modelo', summary: 'Formato oficial de referencia a la herramienta como chatbot.', icon: 'chat', sources: ['acs'], sections: [section('Herramienta', ['tool','company','url','accessed']), section('Cita numérica', ['citationNumber','citationMode'])] },
    { id: 'image', name: 'Generador de imágenes', summary: 'Referencia oficial de herramienta generadora de imágenes.', icon: 'image', sources: ['acs'], sections: [section('Herramienta', ['tool','company','url','accessed']), section('Cita numérica', ['citationNumber','citationMode'])] },
    { id: 'ack', name: 'Declaración de uso', summary: 'La guía exige considerar transparencia adicional, no solo una cita.', icon: 'pen', sources: ['acs'], sections: [section('Intervención', ['tool','company','purpose','scope','review'])] },
  ],
  ieee: [
    { id: 'generated', name: 'Texto, figura o código generado', summary: 'Declaración IEEE obligatoria en Agradecimientos de artículos: sistema, secciones y nivel de uso.', icon: 'pen', sources: ['ieee'], sections: [section('Sistema utilizado', ['tool','model','company']), section('Generación y alcance', ['scope','purpose','degree','review'])] },
    { id: 'editing', name: 'Revisión gramatical o de estilo', summary: 'Aclaración opcional: IEEE recomienda declarar el uso puramente lingüístico, pero no lo exige.', icon: 'help', sources: ['ieee'], sections: [section('Herramienta', ['tool','model','company']), section('Apoyo lingüístico', ['scope','purpose','review'])] },
  ],
  ama: [
    { id: 'research', name: 'IA empleada en investigación', summary: 'Descripción en Métodos: herramienta, fecha, tareas, instrucciones y validación.', icon: 'tool', sources: ['ama','ama_pub'], sections: [section('Identificación', ['tool','model','company','date']), section('Método y control', ['purpose','scope','prompt','review'])] },
    { id: 'writing', name: 'Apoyo en escritura o edición', summary: 'Declaración en Agradecimientos, sin referencia bibliográfica.', icon: 'pen', sources: ['ama','ama_pub'], sections: [section('Identificación', ['tool','model','company','date']), section('Alcance y responsabilidad', ['purpose','scope','review'])] },
    { id: 'figure', name: 'IA en figuras o análisis', summary: 'Informe el proceso en Métodos; la IA no reemplaza las fuentes de datos.', icon: 'image', sources: ['ama','ama_pub'], sections: [section('Herramienta', ['tool','model','company','date']), section('Producto y revisión', ['scope','purpose','dataset','review'])] },
  ]
};

export const EXAMPLES = {
  'apa:tool': { company: 'OpenAI', tool: 'ChatGPT', description: 'Modelo de lenguaje de gran tamaño', year: '2025', url: 'https://chatgpt.com/' },
  'apa:chat': { company: 'OpenAI', tool: 'ChatGPT', chatTitle: 'Conceptos gramaticales de bachillerato', date: '2025-08-21', shareUrl: 'https://chatgpt.com/share/68a77b60-0ee4-800c-9acc-cd3fd573c311' },
  'apa:image': { visualNumber: '2', visualTitle: 'Infografía sobre bibliotecas digitales', humanName: 'la autora', task: 'generar una propuesta visual inicial', company: 'OpenAI', tool: 'ChatGPT', description: 'Generador de imágenes', year: '2025', url: 'https://chatgpt.com/', review: 'revisó y corrigió rótulos y elementos visuales', appendix: 'Apéndice A' },
  'apa:chart': { visualNumber: '3', visualTitle: 'Artículos publicados por año', dataset: 'base bibliométrica propia, 2026', humanName: 'el equipo investigador', task: 'sugerir el código de visualización', review: 'comprobó los conteos, las escalas y las etiquetas', company: 'OpenAI', tool: 'ChatGPT', description: 'Modelo de lenguaje de gran tamaño', year: '2025', url: 'https://chatgpt.com/', appendix: 'Apéndice B' },
  'apa:table': { visualNumber: '1', visualTitle: 'Categorías de análisis', dataset: 'corpus revisado manualmente', humanName: 'la investigadora', task: 'proponer agrupaciones iniciales', review: 'contrastó categorías con los documentos', company: 'Anthropic', tool: 'Claude', description: 'Modelo de lenguaje de gran tamaño', year: '2025', url: 'https://claude.ai/' },
  'apa:method': { company: 'OpenAI', tool: 'ChatGPT', description: 'Modelo de lenguaje de gran tamaño', year: '2025', url: 'https://chatgpt.com/', purpose: 'sugerir código para visualización', scope: 'etapa de generación de gráficos', review: 'se verificaron los resultados contra los datos originales' },
  'apa:integrated': { software: 'Microsoft Word', function: 'corrección ortográfica con Copilot' },
  'mla:chat': { prompt: 'Explica la representación de la naturaleza en Mansfield Park, de Jane Austen', tool: 'ChatGPT', model: 'GPT-4o', company: 'OpenAI', date: '2024-09-23', mlaUrl: 'https://chatgpt.com/share/66f1b0a0-d704-8000-be9a-85f53c850607' },
  'mla:creative': { workTitle: 'El roble', workType: 'poema', tool: 'ChatGPT', model: 'GPT-4o', company: 'OpenAI', date: '2024-09-23', mlaUrl: 'https://chatgpt.com/share/66f1c740-7500-8000-a38b-6d6045c811f5' },
  'mla:image': { visualNumber: '1', imagePrompt: 'Crea una imagen expresionista de dos personas mirando el mar desde una playa', tool: 'DALL-E', model: '3', company: 'OpenAI', date: '2024-09-23', mlaUrl: 'https://chatgpt.com/share/66f1c3a3-3f90-8000-9750-82c57c4a6592' },
  'mla:ack': { tool: 'ChatGPT', company: 'OpenAI', purpose: 'la corrección de claridad y estilo', scope: 'primer borrador del texto', review: 'se revisaron todos los cambios antes de incorporarlos' },
  'chicago:text': { chicagoNoteNumber: '1', tool: 'ChatGPT', company: 'OpenAI', date: '2025-08-21', chicagoUrl: 'https://chatgpt.com/share/68a77b60-0ee4-800c-9acc-cd3fd573c311', chicagoPrompt: 'Enumera los temas de gramática que debería dominar un estudiante al terminar el bachillerato' },
  'chicago:image': { imagePrompt: 'Una oficina moderna representada como pintura cubista', tool: 'DALL·E 2', company: 'OpenAI', date: '2023-03-05' },
  'chicago:ack': { tool: 'ChatGPT', company: 'OpenAI', purpose: 'la revisión de claridad', scope: 'el manuscrito' },
  'acs:chatbot': { tool: 'ChatGPT-4o', company: 'OpenAI', url: 'https://chatgpt.com/', accessed: '2024-08-28', citationNumber: '4', citationMode: 'sup' },
  'acs:image': { tool: 'Craiyon v3', company: 'Craiyon LLC', url: 'https://www.craiyon.com/', accessed: '2024-08-28', citationNumber: '6', citationMode: 'paren' },
  'acs:ack': { tool: 'ChatGPT-4o', company: 'OpenAI', purpose: 'generación de diagramas preliminares', scope: 'sección de figuras', review: 'se verificaron los diagramas antes de la publicación' },
  'ieee:generated': { tool:'ChatGPT',model:'GPT-4o',company:'OpenAI',scope:'la sección 3 y la figura 2',purpose:'proponer un primer borrador de texto y una gráfica',degree:'se generó un borrador inicial, posteriormente revisado y reescrito',review:'las personas autoras comprobaron las cifras, fuentes y atribuciones' },
  'ieee:editing': { tool:'Claude',model:'Sonnet',company:'Anthropic',scope:'el manuscrito completo',purpose:'correcciones de ortografía y gramática',review:'se conservó el contenido científico y se revisaron los cambios' },
  'ama:research': {tool:'ChatGPT',model:'GPT-4o',company:'OpenAI',date:'2026-02-12',purpose:'proponer códigos iniciales para clasificar respuestas',scope:'fase de análisis cualitativo',prompt:'Sugiere una codificación preliminar para fragmentos anonimizados',review:'dos investigadores verificaron y ajustaron la codificación'},
  'ama:writing': {tool:'Claude',model:'Sonnet',company:'Anthropic',date:'2026-04-18',purpose:'mejorar la claridad y fluidez de la redacción',scope:'apartado de Introducción',review:'la autora revisó cada modificación y conservó la responsabilidad intelectual'},
  'ama:figure': {tool:'ChatGPT',model:'GPT-4o',company:'OpenAI',date:'2026-03-15',scope:'Figura 2',purpose:'proponer un script para representar datos',dataset:'base de datos propia validada',review:'el equipo verificó cálculos y gráficos en Python'}
};
