import { STYLES, CASES, SOURCES, FIELD_DEFS, EXAMPLES } from './config.js';
import { generate } from './generator.js';

const KEYS = {ui:'genciteia.ui.v1', forms:'genciteia.forms.v1'};
function restore(key,fallback) {try {return JSON.parse(localStorage.getItem(key)) || fallback;} catch {return fallback;}}
function store(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* El generador permanece funcional si se restringe almacenamiento local. */}}
let ui=restore(KEYS.ui,{style:'apa',kind:'tool'});
if (!STYLES.some(s=>s.id===ui.style)) ui.style='apa';
if (!CASES[ui.style]?.some(c=>c.id===ui.kind)) ui.kind=CASES[ui.style][0].id;
let forms=restore(KEYS.forms,{});
let lang=restore('genciteia.lang.v1','es');
if (!['en','es'].includes(lang)) lang='es';
let generated=false,outputs=[];
const $ = id => document.getElementById(id);
const make = (tag, cls, content) => {const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=content;return n;};
const key = () => `${ui.style}:${ui.kind}`;
const saveUI = () => store(KEYS.ui,ui);
const saveForms = () => store(KEYS.forms,forms);
const current = () => (forms[key()] ||= {});

function init() {
  $('dateLanguage').value=lang;
  $('dateLanguage').addEventListener('change',e=>{lang=e.target.value;store('genciteia.lang.v1',lang);if(generated)updateResults();});
  $('eraseAll').addEventListener('click',()=>{if(!window.confirm('¿Borrar definitivamente los datos introducidos en todos los formularios de GenCite IA?'))return;forms={};saveForms();generated=false;renderForm();renderEmpty();$('formErrors').hidden=true;setCopyStatus('Se borraron todos los datos de los formularios.');});
  $('citationForm').addEventListener('submit',evt=>{evt.preventDefault(); generated=true; updateResults();});
  $('exampleButton').addEventListener('click',()=> { forms[key()]={...EXAMPLES[key()]};saveForms();generated=true;renderForm();updateResults();$('formPanel').scrollIntoView({behavior:'smooth',block:'start'}); });
  $('clearButton').addEventListener('click',()=>{delete forms[key()];saveForms();generated=false;renderForm();renderEmpty();$('formErrors').hidden=true;});
  $('copyAll').addEventListener('click',async ()=>{ if(!outputs.length)return; const text=outputs.map(o=>`${o.label}\n${o.text}`).join('\n\n');const html=outputs.map(o=>`<p><strong>${esc(o.label)}</strong><br>${o.html}</p>`).join(''); const mode=await copyText(text,html);setCopyStatus(mode=== 'formatted'?'Todos los resultados copiados con formato.':mode==='plain'?'Todos los resultados copiados en texto plano (el navegador no permitió formato).':'No se pudo copiar.'); });
  renderAll();
}
function esc(s) {return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&quot;'}[c]));}
function renderAll() {renderStyles();renderCases();renderForm();renderSources();renderEmpty();}
function renderStyles() {
 const root=$('styleTabs');root.replaceChildren();
 STYLES.forEach(style=>{
  const active=ui.style===style.id;
  const b=make('button','style-tab');b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(active));b.setAttribute('tabindex',active?'0':'-1');
  b.append(make('span','style-name',style.name),make('span','style-edition',style.edition));
  b.addEventListener('click',()=>selectStyle(style.id));
  b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const idx=STYLES.findIndex(s=>s.id===ui.style);const next=e.key==='Home'?0:e.key==='End'?STYLES.length-1:e.key==='ArrowRight'?(idx+1)%STYLES.length:(idx+STYLES.length-1)%STYLES.length;selectStyle(STYLES[next].id); $('styleTabs').children[next]?.focus();}});
  root.append(b);
 });
 const style=STYLES.find(s=>s.id===ui.style);
 $('styleIntro').textContent=`${style.authority}. ${style.note}. Solo se muestran usos para los que existen orientaciones oficiales relevantes.`;
}
function selectStyle(next) {
 if(ui.style===next)return;
 ui.style=next;ui.kind=CASES[next][0].id;generated=false;outputs=[];saveUI();renderAll();
}
function renderCases() {
 const root=$('scenarioTabs');root.replaceChildren();
 CASES[ui.style].forEach(c=>{
  const active=c.id===ui.kind;
  const b=make('button','scenario-button');b.type='button';b.setAttribute('aria-pressed',String(active));
  b.append(make('span','scenario-name',c.name),make('span','scenario-description',c.summary));
  b.addEventListener('click',()=>{if(ui.kind===c.id)return;ui.kind=c.id;generated=false;outputs=[];saveUI();renderCases();renderForm();renderSources();renderEmpty();});
  root.append(b);
 });
}
function renderForm() {
 const cfg=CASES[ui.style].find(c=>c.id===ui.kind), values=current();
 $('formTitle').textContent=cfg.name;
 $('formDesc').textContent=cfg.summary;
 const root=$('formFields');root.replaceChildren();
 cfg.sections.forEach(section=>{
  const group=make('section','form-section');
  group.append(make('h3','form-section-title',section.title));
  section.fields.forEach(field=>{
   const def=FIELD_DEFS[field]; const wrap=make('div','field'); const lab=make('label');lab.setAttribute('for',`f-${field}`);lab.append(document.createTextNode(def.label));
   if(def.required)lab.append(make('span','required-mark','*'));
   wrap.append(lab);
   let el;
   if(def.type==='select') {
    el=make('select');el.append(new Option('Selecciona una opción…',''));
    (def.options||[]).forEach(([value,label])=>el.append(new Option(label,value)));
   } else if(def.type==='textarea') el=make('textarea');
   else {el=make('input');el.type=def.type||'text'; if(def.type==='number')el.min='1'; if(def.type==='url')el.inputMode='url';}
   el.id=`f-${field}`;el.name=field;el.required=!!def.required; if(def.placeholder)el.placeholder=def.placeholder;
   el.value=values[field]??'';
   el.addEventListener('input',()=>{current()[field]=el.value;saveForms();if(generated)updateResults();});
   el.addEventListener('change',()=>{current()[field]=el.value;saveForms();if(generated)updateResults();});
   wrap.append(el);if(def.hint)wrap.append(make('small','',def.hint));group.append(wrap);
  });
  root.append(group);
 });
 $('formErrors').hidden=true;
}
function renderSources() {
 const cfg=CASES[ui.style].find(c=>c.id===ui.kind);
 const root=$('sourceLinks');root.replaceChildren();
 for(const ref of cfg.sources) {
  const src=SOURCES[ref];const a=make('a','source-link'); a.href=src.url; a.target='_blank';a.rel='noopener noreferrer';a.textContent=src.title + ' ↗';a.append(make('small','',src.desc));root.append(a);
 }
}
function renderEmpty() {
 $('copyAll').hidden=true;$('copyStatus').textContent='';
 const area=$('outputArea');area.replaceChildren();
 const empty=make('div','empty-state');empty.append(make('div','empty-icon','“ ”'),make('b','', 'Aquí aparecerán tus resultados'),make('p','','Completa los campos o carga un ejemplo. Cada cita, referencia o nota se copiará por separado.'));
 area.append(empty);
}
function updateResults() {
 const result=generate(ui.style,ui.kind,current(),lang);
 const errors=$('formErrors');errors.replaceChildren();
 if (result.errors.length) {
  const title=make('b','', 'Revisa los siguientes campos:');const ul=make('ul');result.errors.forEach(t=>ul.append(make('li','',t)));errors.append(title,ul);errors.hidden=false;
  $('copyAll').hidden=true;outputs=[]; const area=$('outputArea');area.replaceChildren(make('p','output-hint','Corrige los datos para obtener resultados completos, sin valores inventados.'));
  return;
 }
 errors.hidden=true;$('copyAll').hidden=result.outputs.length<2;outputs=result.outputs;showOutputs(result);
}
function showOutputs(result) {
 const area=$('outputArea');area.replaceChildren();
 result.outputs.forEach((o,index)=>{
  const card=make('section','output');const top=make('div','output-top');top.append(make('span','output-label',o.label));
  const buttons=make('div','output-actions');
  const copy=make('button','copy-button','Copiar con formato');copy.type='button';copy.setAttribute('aria-label',`Copiar con formato: ${o.label}`);
  copy.addEventListener('click',async()=>{const mode=await copyText(o.text,o.html,o.id);setCopyStatus(mode==='formatted'?`${o.label}: copiado con cursivas y demás formato.`:mode==='plain'?`${o.label}: copiado en texto plano; revisa cursivas y negritas en Word.`:'No fue posible copiar. Prueba seleccionar el texto.');});
  const plain=make('button','copy-plain','Texto plano');plain.type='button';plain.setAttribute('aria-label',`Copiar solo texto: ${o.label}`);
  plain.addEventListener('click',async()=>{const mode=await copyText(o.text,null,o.id);setCopyStatus(mode?`${o.label}: texto plano copiado.`:'No fue posible copiar.');});
  buttons.append(copy,plain);top.append(buttons);card.append(top);
  const value=make('div','output-value');value.innerHTML=o.html;value.setAttribute('role','document');value.setAttribute('tabindex','0');card.append(value);
  if(o.hint)card.append(make('div','output-hint',o.hint));area.append(card);
 });
 if(result.advice?.length){const box=make('div','advice');box.append(make('b','', 'Comprobaciones antes de usarlo'));const ul=make('ul');result.advice.forEach(a=>ul.append(make('li','',a)));box.append(ul);area.append(box);}
 $('copyStatus').textContent='';
}
function setCopyStatus(msg) { $('copyStatus').textContent=msg; }
/**
 * Entrega text/html más text/plain. Mantiene em/strong/sup y tipografía de 12 pt en Word.
 * No promete que el procesador externo conserve sangría, interlineado u otras preferencias editoriales.
 */
async function copyText(text,html,id='') {
 if(html && navigator.clipboard?.write && typeof ClipboardItem!=='undefined'){
  try {
   const isRef=id==='reference';
   const refStyle=isRef?'padding-left:0.5in;text-indent:-0.5in;':'';
   const rich=`<!doctype html><html><body><p style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.5;color:#111;white-space:pre-line;${refStyle}">${html}</p></body></html>`;
   const item=new ClipboardItem({
     'text/plain':new Blob([text],{type:'text/plain'}),
     'text/html':new Blob([rich],{type:'text/html'})
   });
   await navigator.clipboard.write([item]);return 'formatted';
  }catch{/* La implementación de Clipboard API puede no permitir HTML en este contexto. */}
 }
 try {if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return 'plain';}}catch{}
 try {
  const box=document.createElement('textarea');box.value=text;box.setAttribute('readonly','');box.style.position='fixed';box.style.opacity='0';document.body.append(box);box.focus();box.select();const ok=document.execCommand('copy');box.remove();return ok?'plain':null;
 }catch{return null;}
}
window.addEventListener('DOMContentLoaded',init);
