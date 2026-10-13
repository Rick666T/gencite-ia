import assert from 'node:assert/strict';
import {test} from 'node:test';
import { generate,validate } from '../generator.js';
import {POLICIES} from '../policies.js';
import {STYLES,CASES,EXAMPLES,SOURCES} from '../config.js';
const result=(style,kind,data=EXAMPLES[`${style}:${kind}`],lang='en')=>generate(style,kind,data,lang);
const field=(r,id)=>r.outputs.find(x=>x.id===id);

test('directorio: fichas únicas, enlaces seguros y metadatos mínimos',()=>{
 const ids=new Set();
 for(const p of POLICIES){
  assert.ok(!ids.has(p.id),`duplicado ${p.id}`);ids.add(p.id);
  for(const attr of ['id','geo','sector','org','unit','title','type','version','status','description','url']) assert.ok(p[attr],`${p.id}: falta ${attr}`);
  for(const url of [p.url,p.more,...(p.history||[]).map(v=>v.url)].filter(Boolean))assert.match(url,/^https:\/\/[^\s]+$/i,`${p.id}: URL inválida: ${url}`);
  if(p.history?.length)assert.ok(p.history.every(v=>v.label&&v.year&&v.url));
 }
 assert.ok(POLICIES.filter(x=>x.geo==='México').length>=30);
 assert.ok(POLICIES.filter(x=>x.geo==='Internacional').length>=15);
 assert.ok(POLICIES.some(p=>p.org.includes('UdeG')&&p.version.includes('0.22')));
});
test('estilos: cada caso solo cita documentación que se incluye en FUENTES oficiales',()=>{
 for(const style of STYLES){for(const x of CASES[style.id]){
  assert.ok(x.sections.length>0);assert.ok(x.sources.length>0);
  for(const ref of x.sources)assert.ok(SOURCES[ref],`${style.id}/${x.id}: fuente ${ref} no declarada`);
 }}
});
test('MLA: la versión exacta se separa del nombre del modelo',()=>{
 const d={...EXAMPLES['mla:image']};
 const r=result('mla','image',d);
 assert.equal(field(r,'credit').text,'Fig. 1. “Crea una imagen expresionista de dos personas mirando el mar desde una playa” prompt, DALL-E, version 3, OpenAI, 23 Sept. 2024, chatgpt.com/share/66f1c3a3-3f90-8000-9750-82c57c4a6592.');
 assert.ok(field(r,'credit').html.includes('<em>DALL-E</em>'));
 assert.ok(!field(r,'reference').text.startsWith('Fig. 1'));
});
test('MLA: soporte de forma creativa y descripción corta parentética',()=>{
 const d={...EXAMPLES['mla:creative'],creativeForm:'free verse'};
 assert.match(field(result('mla','creative',d),'reference').text,/“El roble” free verse poem\. ChatGPT/);
 const q={...EXAMPLES['mla:chat'],prompt:'Escribe tres recomendaciones breves'};
 assert.equal(field(result('mla','chat',q),'citation').text,'(“Escribe tres recomendaciones breves”)');
});
test('AMA: el informe no crea falsa referencia ni cita numérica',()=>{
 for(const k of ['research','writing','figure']){
  const r=result('ama',k);
  assert.deepEqual(r.errors,[]);
  assert.equal(r.outputs.length,1);
  assert.equal(r.outputs[0].id,'disclosure');
  assert.ok(!r.outputs.some(o=>['reference','citation'].includes(o.id)));
 }
});
test('Chicago: número de nota preserva superíndice HTML y sin enlace aparece nota',()=>{
 const d={...EXAMPLES['chicago:text'],chicagoNoteNumber:'12',chicagoUrl:''};
 const r=result('chicago','text',d);
 assert.equal(field(r,'marker').text,'¹²');assert.equal(field(r,'marker').html,'<sup>12</sup>');
 assert.ok(field(r,'note').text.startsWith('12. ChatGPT, response to'));
});
test('ACS: superíndice HTML real al copiar con formato',()=>{
 const d={...EXAMPLES['acs:chatbot'],citationNumber:'42'};
 const r=result('acs','chatbot',d);
 assert.equal(field(r,'citation').text,'⁴²');assert.equal(field(r,'citation').html,'<sup>42</sup>');
 assert.ok(field(r,'reference').text.endsWith('(accessed 2024-08-28)'));
});
test('APA: títulos cursivos, no el nombre del modelo en referencia de chat',()=>{
 const r=result('apa','chat');
 assert.ok(field(r,'reference').html.includes('<em>Conceptos gramaticales de bachillerato</em>'));
 assert.ok(!field(r,'reference').html.includes('<em>ChatGPT</em>'));
 const tool=result('apa','tool');assert.ok(field(tool,'reference').html.includes('<em>ChatGPT</em>'));
});
test('APA: nota tipográfica con solo la palabra «Nota» en cursiva',()=>{
 const r=result('apa','chart');
 assert.ok(field(r,'note').html.startsWith('<em>Nota</em>. '));
 assert.ok(field(r,'heading').html.startsWith('<strong>Figura 3</strong><br><em>'));
});
test('todos los ejemplos: dos idiomas y cadenas no vacías, sin sustituciones inventadas',()=>{
 for(const lang of ['en','es'])for(const style of STYLES)for(const cfg of CASES[style.id]){
  const r=result(style.id,cfg.id,EXAMPLES[`${style.id}:${cfg.id}`],lang);
  assert.deepEqual(r.errors,[],`${style.id}/${cfg.id}/${lang}`);
  for(const o of r.outputs){
   assert.ok(!o.text.includes('undefined')&&!o.text.includes('null'),`${style.id}:${cfg.id}`);
   assert.ok(!o.html.includes('undefined'));
   assert.equal((o.html.match(/<em>/g)||[]).length,(o.html.match(/<\/em>/g)||[]).length);
   assert.equal((o.html.match(/<strong>/g)||[]).length,(o.html.match(/<\/strong>/g)||[]).length);
  }
 }
});
test('bloquea fecha imposible, enlace inseguro, select inválido, números gigantes',()=>{
 const d={...EXAMPLES['ama:research'],date:'2026-13-09'};assert.ok(validate('ama','research',d).length);
 const q={...EXAMPLES['mla:chat'],mlaUrl:'file:///etc/passwd'};assert.ok(validate('mla','chat',q).length);
 const r={...EXAMPLES['acs:chatbot'],citationNumber:'999999'};assert.ok(validate('acs','chatbot',r).length);
 const a={...EXAMPLES['apa:tool'],description:'desconocida'};assert.ok(validate('apa','tool',a).length);
});
test('inyección HTML en título, empresa, prompt y figura escapada',()=>{
 for(const [style,kind,change] of [
 ['apa','chat',{company:'<img src=x onerror=alert(1)>'}],
 ['mla','chat',{prompt:'<svg/onload=alert(1)>'}],
 ['chicago','image',{imagePrompt:'<script>console.log(1)</script>'}],
 ['ama','research',{purpose:'<b>injection</b>'}],
 ]){
 const r=result(style,kind,{...EXAMPLES[`${style}:${kind}`],...change});
 assert.deepEqual(r.errors,[]);
 assert.ok(!r.outputs.some(x=>x.html.includes('<script>')||x.html.includes('<svg/')||x.html.includes('<img src=x')||x.html.includes('<b>injection</b>')));
 }
});

test('directorio extendido: nivel y documentos diferenciados por institución, año no inventado',()=>{
 const colima=POLICIES.filter(p=>p.org==='Universidad de Colima');
 const ug=POLICIES.filter(p=>p.org==='Universidad de Guanajuato');
 const uabc=POLICIES.filter(p=>p.org.startsWith('Universidad Autónoma de Baja California'));
 assert.equal(colima.length,3);assert.equal(ug.length,2);assert.equal(uabc.length,3);
 assert.ok(ug.every(p=>p.year===null));
 assert.ok(uabc.every(p=>p.year===null));
 assert.ok(POLICIES.some(p=>p.id==='mx-unison-titulacion'&&p.unit==='Unidad académica'));
});

test('directorio curado: sin documentos de revistas o editoriales',()=>{
 assert.ok(POLICIES.every(x=>x.unit!=='Revista universitaria'));
 assert.ok(POLICIES.every(x=>x.sector!=='Editorial internacional'&&x.sector!=='Asociación de estilo'));
 assert.ok(POLICIES.every(x=>!/(política editorial|revista de |revista [a-z]+: política)/i.test(x.title)));
});
test('SEP y guías UNAM de bachillerato, licenciatura y posgrado',()=>{
 const ids=new Set(POLICIES.map(x=>x.id));
 for(const id of ['mx-sep-resultados','mx-sep-principios','mx-unam-ceide-bach','mx-unam-ceide-lic','mx-unam-ceide-pos'])assert.ok(ids.has(id),id);
 const sep=POLICIES.find(x=>x.id==='mx-sep-resultados');assert.equal(sep.year,2026);
 assert.ok(sep.url.includes('/Dossier_Resultados_ENIAG2025'));
});
test('versionado institucional sin confundir revisiones de archivo y nuevas ediciones',()=>{
 assert.ok(POLICIES.find(x=>x.id==='mx-unam-gaia').history.length>0);
 assert.ok(POLICIES.find(x=>x.id==='int-oxford-research').history.length>0);
 assert.ok(POLICIES.find(x=>x.id==='int-eu-living').version.includes('3.ª'));
 assert.ok(POLICIES.find(x=>x.id==='mx-unam-ceide-lic').version.includes('archivo'));
});
