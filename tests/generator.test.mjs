import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generate, validate, escapeHtml } from '../generator.js';
import { STYLES, CASES, EXAMPLES } from '../config.js';
const ex = (s,k) => ({...EXAMPLES[`${s}:${k}`]});
const g = (s,k,d=ex(s,k),lang='en') => generate(s,k,d,lang);
const out = (r,id) => r.outputs.find(x=>x.id===id);

test('seis módulos de orientación oficial, con distinto alcance',()=> {
 assert.deepEqual(STYLES.map(s=>s.id),['apa','mla','chicago','acs','ama','ieee']);
 for(const s of STYLES)for(const c of CASES[s.id]) assert.ok(c.sources.length>0);
});
for(const s of STYLES)for(const c of CASES[s.id]){
 test(`cada escenario trae ejemplo válido: ${s.id}/${c.id}`,()=>{
  const r=g(s.id,c.id); assert.deepEqual(r.errors,[]); assert.ok(r.outputs.length>0);
  for(const v of r.outputs) {assert.ok(v.text.trim());assert.ok(v.html);assert.ok(!v.text.includes('undefined'));assert.ok(!v.text.includes('[object Object]'));}
 });
}
test('APA herramienta: año declarado, tipografía y cita separada',()=> {
 const r=g('apa','tool');
 assert.equal(out(r,'citation').text,'(OpenAI, 2025)');
 assert.equal(out(r,'narrative').text,'OpenAI (2025)');
 assert.equal(out(r,'reference').text,'OpenAI. (2025). ChatGPT [Modelo de lenguaje de gran tamaño]. https://chatgpt.com/');
 assert.match(out(r,'reference').html,/<em>ChatGPT<\/em>/);
});
test('APA chat: fecha completa y título en cursiva, no prompt',()=> {
 const r=g('apa','chat');
 assert.equal(out(r,'reference').text,'OpenAI. (2025, August 21). Conceptos gramaticales de bachillerato [Generative AI chat]. ChatGPT. https://chatgpt.com/share/68a77b60-0ee4-800c-9acc-cd3fd573c311');
 assert.equal(out(r,'citation').text,'(OpenAI, 2025)');
});
test('APA chat: adaptación española optativa de fecha',()=> {
 assert.match(out(g('apa','chat',ex('apa','chat'),'es'),'reference').text,/\(2025, 21 de agosto\)/);
});
test('APA imagen, gráfico y tabla: créditos distintos de referencia',()=> {
 for(const k of ['image','chart','table']){
 const r=g('apa',k); assert.ok(out(r,'heading')); assert.ok(out(r,'note')); assert.ok(out(r,'reference')); assert.equal(out(r,'citation'),undefined); assert.equal(out(r,'narrative'),undefined);
 assert.match(out(r,'note').html,/<em>Nota<\/em>\./);
 assert.match(out(r,'heading').html,/<strong>/);}
 assert.match(out(g('apa','chart'),'note').text,/base bibliométrica propia/);
 assert.match(out(g('apa','table'),'heading').text,/^Tabla 1/);
});
test('APA método: no añade citas redundantes; el párrafo ya identifica la herramienta',()=> {
 const r=g('apa','method');assert.equal(out(r,'citation'),undefined);assert.equal(out(r,'narrative'),undefined);
 assert.match(out(r,'disclosure').text,/\(OpenAI, 2025\)/);assert.ok(out(r,'reference'));
});
test('APA integrada: no fabrica referencia de uso básico',()=>{
 const r=g('apa','integrated'); assert.equal(r.outputs.length,1); assert.equal(r.outputs[0].id,'explanation');
});
test('MLA chat: sin autor IA, se usa prompt como título y modelo',()=>{
 const r=g('mla','chat');
 assert.equal(out(r,'citation').text,'(“Explica la representación”)');
 assert.match(out(r,'reference').text,/“Explica la representación de la naturaleza en Mansfield Park, de Jane Austen” prompt\. ChatGPT, model GPT-4o, OpenAI, 23 Sept\. 2024,/);
 assert.ok(out(r,'reference').html.includes('<em>ChatGPT</em>'));
});
test('MLA texto creativo: título de obra en vez de prompt',()=>{
 const r=g('mla','creative'); assert.match(out(r,'reference').text,/^“El roble” poem\. ChatGPT,/);
});
test('MLA imagen tiene alternativa de Obras citadas y pie, no referencia obligatoria duplicada',()=>{
 const r=g('mla','image'); assert.match(out(r,'credit').text,/^Fig\. 1\./);
 assert.match(out(r,'mention').text,/^\(fig\. 1\)$/);
 assert.match(out(r,'reference').text,/imagen|expresionista/i);
});
test('Chicago: nota y llamada coinciden, no inventa bibliografía',()=>{
 const d=ex('chicago','text'); d.chicagoUrl='https://chatgpt.com/share/abcd1234';
 const r=g('chicago','text',d);
 assert.equal(out(r,'marker').text,'¹');
 assert.match(out(r,'note').text,/^1\. ChatGPT, response to/);
 assert.equal(out(r,'reference'),undefined);
});
test('Chicago sin enlace: admite nota sin URL y cita dentro del texto',()=> {
 const d=ex('chicago','text'); d.chicagoUrl='';
 const r=g('chicago','text',d);
 assert.deepEqual(r.errors,[]);
 assert.ok(out(r,'note'));
 assert.ok(!out(r,'reference'));
 delete d.chicagoNoteNumber;
 const textOnly=g('chicago','text',d);
 assert.ok(out(textOnly,'credit'));
 assert.ok(!out(textOnly,'note'));
});
test('Chicago imagen: no crea bibliografía',()=>{
 const r=g('chicago','image');
 assert.match(out(r,'credit').text,/Una oficina moderna/);
 assert.equal(out(r,'reference'),undefined);
});
test('ACS chatbot imagen con descripción estándar, fecha acceso ISO',()=>{
 const chat=g('acs','chatbot'),image=g('acs','image');
 assert.equal(out(chat,'reference').text,'ChatGPT-4o (AI Chatbot). OpenAI. https://chatgpt.com/ (accessed 2024-08-28)');
 assert.equal(out(chat,'citation').text,'⁴');
 assert.equal(out(image,'citation').text,'(6)');
 assert.match(out(image,'reference').text,/\(AI Image Generator\)/);
});
test('ACS número en más de un dígito (superíndice)',()=>{
 const d=ex('acs','chatbot'); d.citationNumber='123';
 assert.equal(out(g('acs','chatbot',d),'citation').text,'¹²³');
});
test('datos obligatorios: ni campos vacíos ni URL maliciosa',()=>{
 for (const [style,kind] of [['apa','chat'],['mla','chat'],['chicago','image'],['acs','chatbot']]){
  assert.ok(g(style,kind,{}).errors.length>0);
 }
 const d=ex('apa','chat');d.shareUrl='javascript:alert(1)';assert.ok(g('apa','chat',d).errors.some(e=>e.includes('URL')));
});
test('sin fecha inválida o 29 feb en año no bisiesto',()=>{
 const d=ex('apa','chat');d.date='2025-02-29';assert.ok(g('apa','chat',d).errors.length>0);
 d.date='2024-02-29';assert.deepEqual(g('apa','chat',d).errors,[]);
});
test('no se supone el año de creación de la herramienta a partir del año de uso',()=> {
 const d=ex('apa','tool');d.year='';assert.ok(g('apa','tool',d).errors.length>0);
});
test('texto introducido por el usuario no ejecuta HTML en resultados',()=>{
 const d=ex('apa','chat');d.chatTitle='<script>alert(1)</script>';
 const r=g('apa','chat',d);assert.match(out(r,'reference').html,/&lt;script&gt;/);
 assert.ok(!out(r,'reference').html.includes('<script>'));
 assert.equal(escapeHtml('<img onerror=x>'),'&lt;img onerror=x&gt;');
});
test('formato ACS rechaza número inválido, año fuera de rango',()=> {
 const d=ex('acs','chatbot');d.citationNumber='0';assert.ok(g('acs','chatbot',d).errors.length>0);
 const a=ex('apa','tool');a.year='3025';assert.ok(g('apa','tool',a).errors.length>0);
});
test('idioma del dato visible diferenciado del formato ACS invariable',()=>{
 const a=g('mla','chat',ex('mla','chat'),'es');assert.match(out(a,'reference').text,/23 sept\. 2024/);
 const b=g('acs','chatbot',ex('acs','chatbot'),'es');assert.match(out(b,'reference').text,/2024-08-28/);
});

test('IEEE generación y corrección menor: declaración por política editorial, sin referencia ficticia',()=>{
 const generated=g('ieee','generated');
 assert.deepEqual(generated.errors,[]); assert.equal(generated.outputs.length,1);
 assert.equal(generated.outputs[0].id,'disclosure');
 assert.match(generated.outputs[0].text,/nivel de intervención/i);
 assert.ok(generated.advice.some(x=>x.includes('IEEE exige')));
 const edited=g('ieee','editing');
 assert.equal(edited.outputs.length,1);
 assert.equal(edited.outputs[0].id,'disclosure');
 assert.ok(edited.advice.some(x=>x.includes('no exige')));
});
