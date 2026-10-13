import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { POLICIES } from '../policies.js';
import { STYLES, CASES, EXAMPLES } from '../config.js';
import { generate } from '../generator.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const load = file=>readFileSync(join(root,file),'utf8');

test('GitHub Pages: los archivos están a nivel de raíz y sin backend',()=>{
 for(const file of ['index.html','politicas.html','styles.css','app.js','generator.js','policies.js','policies-ui.js','config.js','help.js','.nojekyll','icons/favicon.svg']) assert.ok(existsSync(join(root,file)),`Falta ${file}`);
 assert.ok(load('index.html').includes('href="politicas.html"'));
 assert.ok(load('politicas.html').includes('href="index.html"'));
 assert.ok(load('index.html').includes('lang="es"'));
 assert.ok(load('politicas.html').includes('lang="es"'));
});
test('Dos páginas independientes y sin la pestaña Acerca de',()=>{
 const gen=load('index.html'),pol=load('politicas.html');
 assert.ok(gen.includes('citationForm')); assert.ok(!pol.includes('id="citationForm"'));
 assert.ok(pol.includes('id="policyResults"'));assert.ok(!gen.includes('id="policyResults"'));
 assert.ok(!gen.includes('id="about"')&&!pol.includes('id="about"'));
 assert.ok(gen.includes('id="helpDialog"')&&pol.includes('id="helpDialog"'));
 assert.ok(gen.includes('id="helpOpen"')&&pol.includes('id="helpOpen"'));
 assert.ok(gen.includes('Ricardo Tavira Sánchez')&&pol.includes('Ricardo Tavira Sánchez'));
});
test('Directorio: corte 2026, cobertura y ausencia de políticas editoriales aisladas',()=>{
 assert.equal(POLICIES.length,65);
 assert.equal(POLICIES.filter(p=>p.geo==='México').length,37);
 assert.equal(POLICIES.filter(p=>p.geo==='Internacional').length,28);
 assert.equal(POLICIES.filter(p=>p.geo==='México'&&p.sector==='Privada').length,8);
 for(const p of POLICIES){
  assert.doesNotMatch(p.sector,/editorial|revista|journal|publisher/i);
  assert.doesNotMatch(p.unit,/editorial|revista|journal|publisher/i);
 }
});
test('Inclusiones verificadas: SEP y tres guías UNAM 2026',()=>{
 const sep=POLICIES.find(x=>x.org.includes('SEP')&&x.title.includes('Usos y percepciones'));
 assert.ok(sep);assert.equal(sep.year,2026);assert.match(sep.url,/^https:\/\//);
 const unam=POLICIES.filter(x=>x.org.includes('UNAM')&&x.year===2026&&x.title.toLowerCase().includes('guía de uso'));
 for(const nivel of ['Bachillerato','Licenciatura','Posgrado']) {
  assert.equal(unam.filter(x=>x.title.includes(nivel)).length,1,`Falta guía ${nivel}`);
 }
 assert.ok(unam.find(x=>x.title.includes('Licenciatura')).url.endsWith('Guia-IAGen_Licenciatura_V09.pdf'));
 assert.ok(unam.find(x=>x.title.includes('Posgrado')).url.endsWith('Guia-IAGen_Posgrado_V08.pdf'));
});
test('Ediciones verificables y últimos informes europeos 2026',()=>{
 const eu=POLICIES.find(p=>p.id==='int-eu-living');assert.equal(eu.year,2026);
 assert.match(eu.version,/3\.ª edición/);
 assert.ok(eu.history?.length && eu.history[0].year===2024);
 const eneset=POLICIES.find(p=>p.id==='int-eu-2026-students');assert.equal(eneset.year,2026);
 const recent=POLICIES.find(p=>p.id==='int-eu-2026-education-report');assert.equal(recent.year,2026);
 const iesalc=POLICIES.find(p=>p.id==='int-unesco-iesalc');assert.ok(iesalc.url.endsWith('challenges-ai-higher-education-and-imperative-competency-frameworks'));
});
test('Generador: ejemplos completos para los seis estilos y sin citas APA redundantes',()=>{
 assert.equal(STYLES.length,6);
 assert.equal(Object.keys(EXAMPLES).length,22);
 for(const style of STYLES)for(const one of CASES[style.id]){
  const r=generate(style.id,one.id,EXAMPLES[`${style.id}:${one.id}`],'es');
  assert.deepEqual(r.errors,[],`Caso ${style.id}/${one.id}`);
 }
 for(const kind of ['image','chart','table','method']){
  const r=generate('apa',kind,EXAMPLES[`apa:${kind}`],'es');
  assert.ok(!r.outputs.some(x=>x.id==='citation'||x.id==='narrative'),`No duplicar cita en ${kind}`);
 }
 for(const kind of ['tool','chat']) {
  const r=generate('apa',kind,EXAMPLES[`apa:${kind}`],'es');
  assert.ok(r.outputs.some(x=>x.id==='citation'));
  assert.ok(r.outputs.some(x=>x.id==='narrative'));
 }
});
