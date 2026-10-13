import { CASES, FIELD_DEFS } from './config.js';

const MONTH_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const MONTH_MLA_EN = ['Jan.','Feb.','Mar.','Apr.','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];
const MONTH_MLA_ES = ['ene.','feb.','mar.','abr.','may','jun.','jul.','ago.','sept.','oct.','nov.','dic.'];

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
const P = value => ({text: String(value ?? ''), html: escapeHtml(value)});
const join = (...parts) => parts.reduce((a,b) => ({text: a.text + b.text, html: a.html + b.html}), {text:'',html:''});
const em = p => ({text:p.text,html:`<em>${p.html}</em>`});
const strong = p => ({text:p.text,html:`<strong>${p.html}</strong>`});
const LB = {text:'\n', html:'<br>'};
const sentence = value => String(value).trim().replace(/[.\s]+$/u, '');
const endWithPeriod = value => /[.!?…]$/u.test(String(value).trim()) ? String(value).trim() : `${String(value).trim()}.`;
const displayTool = d => `${t(d,'tool')}${t(d,'model') ? ` (modelo ${t(d,'model')})` : ''}`;
const t = (v, k) => String(v[k] ?? '').trim();
const emptyResult = () => ({ outputs:[], advice:[], sources:[] });
const add = (r, id, label, value, hint='') => { r.outputs.push({id,label,...value,hint}); };
const warn = (r, message) => r.advice.push(message);
const citePair = (r, company, year) => {
  add(r, 'citation', 'Cita parentética (alternativa)', P(`(${company}, ${year})`), 'Elija esta forma O la narrativa según su oración; no tiene que insertar las dos.');
  add(r, 'narrative', 'Cita narrativa (alternativa)', P(`${company} (${year})`), 'Elija esta forma O la parentética según su oración; no tiene que insertar las dos.');
};
function dateParts(raw) {
  const value=String(raw||'');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1000 || year > 2100 || month<1 || month>12 || day<1 || day>31) return null;
  const parsed=new Date(Date.UTC(year,month-1,day));
  return parsed.getUTCFullYear()===year && parsed.getUTCMonth()===month-1 && parsed.getUTCDate()===day ? {year, month, day} : null;
}
const yearOf = date => dateParts(date)?.year;
const apaDate = (value, lang) => {
  const d=dateParts(value); return d ? (lang==='es' ? `${d.year}, ${d.day} de ${MONTH_ES[d.month-1]}` : `${d.year}, ${MONTH_EN[d.month-1]} ${d.day}`) : '';
};
const chicagoDate = (value,lang) => {
  const d=dateParts(value);return d ? (lang==='es' ? `${d.day} de ${MONTH_ES[d.month-1]} de ${d.year}` : `${MONTH_EN[d.month-1]} ${d.day}, ${d.year}`): '';
};
const mlaDate = (value,lang) => {
  const d=dateParts(value);return d ? `${d.day} ${(lang==='es' ? MONTH_MLA_ES : MONTH_MLA_EN)[d.month-1]} ${d.year}` : '';
};
const numberSup = n => String(n).replace(/[0-9]/g, x => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(x)]);
const safeNum = x => Number.isSafeInteger(Number(x)) && Number(x)>0 && Number(x)<=99999;
export function validate(style, kind, data) {
  const selected=(CASES[style]||[]).find(x=>x.id===kind);
  if (!selected) return ['El estilo o caso seleccionado no existe.'];
  const errors=[];
  for (const key of selected.sections.flatMap(s=>s.fields)) {
    const cfg=FIELD_DEFS[key]; const value=t(data,key);
    if (cfg.required && !value) errors.push(`Falta: ${cfg.label}.`);
    if (!value) continue;
    if (cfg.type==='number' && (!/^\d+$/.test(value) || !safeNum(value))) errors.push(`Introduzca un número entero positivo válido en ${cfg.label}.`);
    if (cfg.type==='number' && key==='year' && (Number(value)<1900 || Number(value)>2100)) errors.push('El año de la herramienta debe estar entre 1900 y 2100.');
    if (cfg.type==='date' && !dateParts(value)) errors.push(`Fecha inválida en ${cfg.label}.`);
    if (cfg.type==='url') { try { const url = new URL(value); if (!['https:','http:'].includes(url.protocol) || !url.hostname.includes('.')) throw Error('invalid'); } catch { errors.push(`La URL de ${cfg.label} debe comenzar con https:// o http:// y tener un dominio válido.`); } }
    if (cfg.type==='select' && cfg.options && !cfg.options.some(option=>option[0]===value)) errors.push(`Valor no permitido en ${cfg.label}.`);
  }
  if (style==='chicago' && kind==='text' && t(data,'chicagoUrl') && !t(data,'chicagoNoteNumber')) errors.push('Indique el número de la nota cuando se incluye una URL compartida.');
  return errors;
}
function apaToolRef(d) { return join(P(`${t(d,'company')}. (${t(d,'year')}). `), em(P(t(d,'tool'))), P(` [${t(d,'description')}]. ${t(d,'url')}`)); }
function apaFigure(r,d,lang,type) {
  const num=t(d,'visualNumber'); const title=t(d,'visualTitle');
  add(r,'heading','Encabezado (encima del elemento)', join(strong(P(`${type==='table'?'Tabla':'Figura'} ${num}`)),LB,em(P(title))), 'Inserte el elemento visual debajo del encabezado; la nota va debajo de la imagen o tabla.');
  const who=t(d,'humanName'); const task=sentence(t(d,'task'));
  const source=t(d,'dataset'); const check=sentence(t(d,'review'));
  const orig=t(d,'original');const appendix=t(d,'appendix');
  let note=`${type==='chart'?'Gráfico elaborado':type==='table'?'Tabla elaborada':'Figura elaborada'} por ${who} con apoyo de ${t(d,'tool')} (${t(d,'company')}, ${t(d,'year')})`;
  if (source) note+=` a partir de ${sentence(source)}`;
  note+=`. La IA se utilizó para ${task}. ${who.charAt(0).toUpperCase()+who.slice(1)} ${check}.`;
  if(orig) note+=` Material de origen adaptado: ${sentence(orig)}; confirme por separado su atribución, licencia y referencia.`;
  if(appendix) note+=` La trazabilidad se documenta en ${sentence(appendix)}.`;
  add(r,'note','Nota (debajo del elemento)',join(em(P('Nota')), P('. '+note)), 'El contenido de la nota es una descripción contextual, no una referencia bibliográfica independiente.');
  add(r,'reference','Referencia de la herramienta',apaToolRef(d));
  warn(r,'El encabezado y la nota ya identifican el recurso. No es obligatorio agregar citas parentética y narrativa por separado para una figura o tabla propia. Son formas alternativas de citar cuando correspondan.');
  if(source) warn(r,'Si los datos son de terceros, incluya además su referencia bibliográfica original. Esta herramienta no inventa ni genera esa referencia.');
  warn(r,'La redacción descriptiva de la nota se adapta a su caso; APA regula el formato de notas y recomienda identificar el uso de IA, no una frase única obligatoria para cada gráfico.');
}
function mlaContainer(d,lang) {
  const version=t(d,'model') ? `, ${/^\d/.test(t(d,'model')) ? 'version' : 'model'} ${t(d,'model')}` : '';
  const value=t(d,'mlaUrl');
  const location=value.replace(/^https?:\/\//i,'');
  return join(em(P(t(d,'tool'))),P(`${version}, ${t(d,'company')}, ${mlaDate(t(d,'date'),lang)}, ${location}.`));
}
function mlaCitationTitle(raw) {
  const words=String(raw).trim().split(/\s+/u);
  return words.length>5 ? `${words.slice(0,3).join(' ')}` : String(raw).trim();
}
function mlaQuotedTitle(title) {return `“${sentence(title)}”`;}
function mlaResult(r,d,lang,sourceTitle,kind) {
  const ref=join(P(`${mlaQuotedTitle(sourceTitle)} ${kind}. `),mlaContainer(d,lang));
  add(r,'reference','Entrada en Obras citadas',ref);
  const short=mlaCitationTitle(sourceTitle);
  add(r,'citation','Cita en el texto',P(`(${mlaQuotedTitle(short)})`), 'Usa el título abreviado de la entrada, porque la herramienta de IA no se presenta como autora.');
  if (!/\/(share|search)\//i.test(t(d,'mlaUrl'))) warn(r,'Si no existe una URL directa y estable del contenido, MLA acepta el enlace general de la herramienta, aunque ese enlace no permita recuperar la respuesta exacta.');
}
export function generate(style, kind, raw, lang='en') {
  const d={}; Object.keys(raw||{}).forEach(k=>{d[k]=typeof raw[k]==='string' ? raw[k].trim() : raw[k]});
  const errors=validate(style,kind,d);
  if (errors.length) return { outputs:[], advice:[], errors, sources:[] };
  const r=emptyResult(); r.errors=[];
  const selected=CASES[style].find(x=>x.id===kind);
  r.sources=[...selected.sources];
  if(style==='apa') {
    const company=t(d,'company'),year=t(d,'year');
    if(kind==='tool') {citePair(r,company,year);add(r,'reference','Referencia bibliográfica',apaToolRef(d));}
    else if(kind==='chat') {
      citePair(r,company,yearOf(t(d,'date')));
      add(r,'reference','Referencia de la conversación',join(P(`${company}. (${apaDate(t(d,'date'),lang)}). `),em(P(t(d,'chatTitle'))),P(` [${lang==='es'?'Chat de IA generativa':'Generative AI chat'}]. ${t(d,'tool')}. ${t(d,'shareUrl')}`)));
      warn(r,'Compruebe la accesibilidad de la conversación desde una sesión ajena. El enlace no se verifica automáticamente.');
    }
    else if(['image','chart','table'].includes(kind)) apaFigure(r,d,lang,kind);
    else if(kind==='method') {
      add(r,'reference','Referencia de la herramienta',apaToolRef(d));
      add(r,'disclosure','Ejemplo editable para el apartado de método',P(`Se utilizó ${t(d,'tool')} (${company}, ${year}) para ${sentence(t(d,'purpose'))} en ${sentence(t(d,'scope'))}. La persona autora verificó el resultado: ${sentence(t(d,'review'))}.`));
      warn(r,'La mención a la herramienta se incorpora en el propio párrafo metodológico. No es necesario añadir, además, una cita parentética y otra narrativa aisladas. El texto es orientativo, no una fórmula oficial obligatoria.');
    }
    else if(kind==='integrated') {
      add(r,'explanation','Orientación para este caso',P(`El uso de ${t(d,'function')} integrado en ${t(d,'software')} normalmente no requiere cita dentro del texto ni entrada en Referencias, si se trata de un uso ordinario del software.`));
      warn(r,'Excepción: si la funcionalidad de IA forma parte significativa de una estrategia de investigación, explique el procedimiento y considere referenciar la herramienta; consulte la política de su institución.');
    }
  }
  if(style==='mla') {
    if(kind==='chat') mlaResult(r,d,lang,t(d,'prompt'),'prompt');
    else if(kind==='creative') {
      const type=t(d,'workType');
      const names={poema:'poem',cuento:'short story',ensayo:'essay',guion:'screenplay','texto creativo':'creative text'};
      const form=t(d,'creativeForm');
      mlaResult(r,d,lang,t(d,'workTitle'),`${form?sentence(form)+' ':''}${lang==='es'?type:names[type]||type}`);
    }
    else if(kind==='image') {
      const cap=join(P(`Fig. ${t(d,'visualNumber')}. ${mlaQuotedTitle(t(d,'imagePrompt'))} prompt, `),mlaContainer(d,lang));
      add(r,'credit','Pie de figura con crédito completo',cap,'En MLA la atribución completa puede ir en el pie, en vez de repetirse obligatoriamente en Obras citadas.');
      add(r,'reference','Entrada alternativa en Obras citadas',join(P(`${mlaQuotedTitle(t(d,'imagePrompt'))} prompt. `),mlaContainer(d,lang)));
      add(r,'mention','Mención de la figura en el texto',P(`(fig. ${t(d,'visualNumber')})`));
      warn(r,'La entrada en Obras citadas es alternativa a colocar la información completa en el pie: siga el criterio del trabajo y evite duplicaciones innecesarias.');
    }
    else if(kind==='ack') {
      add(r,'disclosure','Reconocimiento del uso de IA',P(`Se utilizó ${t(d,'tool')} (${t(d,'company')}) para ${sentence(t(d,'purpose'))} en ${sentence(t(d,'scope'))}. Supervisión humana: ${sentence(t(d,'review'))}.`));
      warn(r,'Esto es un reconocimiento de uso (transparencia), no una referencia bibliográfica ni una cita de un contenido concreto.');
    }
  }
  if(style==='chicago') {
    if(kind==='text') {
      const url=t(d,'chicagoUrl');const prompt=t(d,'chicagoPrompt');const extra=t(d,'editNote'); const date=chicagoDate(t(d,'date'),lang);
      const body=prompt ? `${t(d,'tool')}, ${lang==='es'?'respuesta a':'response to'} “${sentence(prompt)},” ${t(d,'company')}, ${date}${url?`, ${url}`:''}` : `${lang==='es'?'Texto generado por':'Text generated by'} ${t(d,'tool')}, ${t(d,'company')}, ${date}${url?`, ${url}`:''}`;
      if(t(d,'chicagoNoteNumber')) {
        add(r,'marker','Llamada de nota',join({text:numberSup(t(d,'chicagoNoteNumber')),html:`<sup>${escapeHtml(t(d,'chicagoNoteNumber'))}</sup>`}));
        add(r,'note','Nota al pie o final',P(`${t(d,'chicagoNoteNumber')}. ${body}${extra?`, ${sentence(extra)}`:''}.`));
        if(!url)warn(r,'Nota sin URL de chat: puede funcionar como comunicación no recuperable; no la añada automáticamente a la bibliografía.');
      } else {
        add(r,'credit','Atribución dentro del texto',P(`El contenido siguiente se generó con ${t(d,'tool')} (${t(d,'company')}) el ${date}${extra?` y fue ${sentence(extra)}`:''}.`));
      }
      warn(r,'Chicago permite crédito en el texto o en nota. Una entrada en bibliografía se reserva para casos recuperables y sujetos a las instrucciones del editor.');
    } else if(kind==='image') {
      const date=chicagoDate(t(d,'date'),lang);
      add(r,'credit','Crédito para acompañar la imagen',P(`“${sentence(t(d,'imagePrompt'))},” ${lang==='es'?`imagen generada con ${t(d,'tool')} de ${t(d,'company')}`:`image generated by ${t(d,'company')}’s ${t(d,'tool')}`}, ${date}${t(d,'chicagoUrl')?`, ${t(d,'chicagoUrl')}`:''}.`));
      warn(r,'Este resultado es un crédito de imagen de acuerdo con las FAQ de Chicago, no una referencia bibliográfica del software.');
    } else if(kind==='ack') {
      add(r,'disclosure','Reconocimiento en el texto',P(`En ${sentence(t(d,'scope'))} se utilizó ${t(d,'tool')} (${t(d,'company')}) para ${sentence(t(d,'purpose'))}.`));
      warn(r,'Declaración descriptiva basada en el principio de transparencia de Chicago; no es una fórmula obligatoria del manual.');
    }
  }
  if(style==='acs') {
    if(['chatbot','image'].includes(kind)) {
      const label=kind==='image'?'AI Image Generator':'AI Chatbot';
      add(r,'reference','Entrada en la lista de referencias',P(`${t(d,'tool')} (${label}). ${t(d,'company')}. ${t(d,'url')} (accessed ${t(d,'accessed')})`));
      const num=t(d,'citationNumber');
      add(r,'citation','Marca de cita numérica',t(d,'citationMode')==='sup'?{text:numberSup(num),html:`<sup>${escapeHtml(num)}</sup>`}:P(`(${num})`), 'El número debe coincidir con la entrada de su lista final. Inserte el superíndice donde corresponda según la revista.');
      warn(r,'ACS indica que las referencias a herramientas generativas son formatos sugeridos cuando corresponda citarlas; una referencia nunca sustituye la declaración de uso pertinente.');
    } else if(kind==='ack') {
      add(r,'disclosure','Declaración descriptiva de uso de IA',P(`Se utilizó ${t(d,'tool')} (${t(d,'company')}) para ${sentence(t(d,'purpose'))} en ${sentence(t(d,'scope'))}. Se documentaron las instrucciones relevantes y ${sentence(t(d,'review'))}.`));
      warn(r,'La redacción de la declaración es una propuesta de la extensión. ACS señala que la transparencia debe ir más allá de una simple referencia, pero no impone esta frase.');
    }
  }
  if(style==='ieee') {
    const tool=displayTool(d), company=t(d,'company'),scope=sentence(t(d,'scope'));
    if(kind==='generated'){
      add(r,'disclosure','Declaración para Agradecimientos',P(`Se utilizó ${tool} (${company}) para ${sentence(t(d,'purpose'))} en ${scope}. El nivel de intervención fue: ${sentence(t(d,'degree'))}. Se realizó la siguiente revisión humana: ${endWithPeriod(t(d,'review'))}`));
      warn(r,'IEEE exige en artículos sometidos a sus publicaciones identificar el sistema, las secciones afectadas y el nivel de generación mediante IA en Agradecimientos. La frase es un modelo editable, no una fórmula textual oficial ni una referencia bibliográfica.');
    } else if(kind==='editing') {
      add(r,'disclosure','Declaración opcional de revisión lingüística',P(`Se empleó ${tool} (${company}) para ${sentence(t(d,'purpose'))} en ${scope}. La revisión humana consistió en lo siguiente: ${endWithPeriod(t(d,'review'))}`));
      warn(r,'Según IEEE, el uso de IA exclusivamente para edición y mejora gramatical normalmente no exige declaración, aunque se recomienda. Este texto es opcional y editable.');
    }
  }
  if(style==='ama') {
    const model=displayTool(d), company=t(d,'company'),date=chicagoDate(t(d,'date'),lang);
    if(kind==='research') {
      const phr=t(d,'prompt');
      add(r,'disclosure','Descripción del uso en la sección Métodos',P(`Durante ${sentence(t(d,'scope'))} se utilizó ${model}, de ${company}, el ${date} para ${sentence(t(d,'purpose'))}. ${phr?`Instrucción empleada: “${sentence(phr)}”. `:''}La supervisión humana consistió en lo siguiente: ${endWithPeriod(t(d,'review'))}`));
    } else if(kind==='writing') {
      add(r,'disclosure','Reconocimiento para la sección Agradecimientos',P(`Se empleó ${model} (${company}) el ${date} como apoyo para ${sentence(t(d,'purpose'))} en ${sentence(t(d,'scope'))}. ${endWithPeriod(t(d,'review'))} Las personas autoras asumen toda la responsabilidad por la exactitud e integridad del contenido final.`));
    } else if(kind==='figure') {
      add(r,'disclosure','Descripción del procedimiento en Métodos',P(`Se utilizó ${model} (${company}) el ${date} para ${sentence(t(d,'purpose'))} en ${sentence(t(d,'scope'))}, a partir de ${sentence(t(d,'dataset'))}. ${endWithPeriod(t(d,'review'))} La herramienta no sustituye la referencia bibliográfica de la fuente de datos.`));
    }
    warn(r,'AMA, sección 3.15.13: el uso de LLM y chatbots se describe en el texto. No se genera una referencia bibliográfica para la herramienta ni una cita numérica ficticia. Los párrafos son propuestas editables, no frases oficiales obligatorias.');
  }
  r.advice.push('Las referencias describen lo que usted capturó; la herramienta no consulta APIs, no completa metadatos y no verifica automáticamente enlaces, políticas editoriales ni permisos.');
  return r;
}
