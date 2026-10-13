import { POLICIES, POLICY_REVIEW_DATE } from './policies.js';

const $=id=>document.getElementById(id);
const node=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el;};
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es-MX').trim();
const safeExternal = (url,text,cls='policy-link') => {
 const a=node('a',cls,text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;
};
const optionList=(id,items,first)=>{
 const el=$(id);el.replaceChildren(new Option(first,''));items.sort((a,b)=>a.localeCompare(b,'es')).forEach(x=>el.append(new Option(x,x)));
};
const statusClass = status=> status==='Publicada'?'status-published':status==='Propuesta'?'status-proposed':'status-guidance';
let current=[];
let visibleLimit=12;
function card(doc){
 const el=node('article','policy-card');
 const meta=node('div','policy-tags');
 meta.append(node('span','pill '+(doc.geo==='México'?'pill-mexico':'pill-world'),doc.geo),node('span','pill',doc.sector),node('span','pill '+statusClass(doc.status),doc.status));
 el.append(meta);
 el.append(node('p','policy-org',doc.org));
 el.append(node('h3','policy-title',doc.title));
 el.append(node('p','policy-description',doc.description));
 const detail=node('dl','policy-data');
 const lines=[['Ámbito',doc.unit],['Tipo',doc.type],['Edición/estado',doc.version || 'Sin versión declarada']];
 if(doc.year)lines.push(['Año',String(doc.year)]);
 lines.forEach(([key,val])=>{detail.append(node('dt','',key),node('dd','',val));});
 el.append(detail);
 const links=node('div','policy-link-row');
 links.append(safeExternal(doc.url,'Consultar documento ↗'));
 if(doc.more)links.append(safeExternal(doc.more,'Contexto oficial ↗','policy-more'));
 el.append(links);
 if(doc.history?.length){
  const disclosure=node('details','policy-history');const title=node('summary','',`Ediciones anteriores (${doc.history.length})`);disclosure.append(title);
  const ls=node('ul');doc.history.forEach(h=>{const li=node('li');li.append(safeExternal(h.url,h.label || String(h.year),'policy-history-link'));ls.append(li)});
  disclosure.append(ls);el.append(disclosure);
 }
 return el;
}
function filtered(){
 const term=norm($('policySearch').value);
 const region=$('policyGeo').value, sector=$('policySector').value, type=$('policyType').value, unit=$('policyUnit').value;
 const sort=$('policySort').value;
 let arr=POLICIES.filter(d=>(!region||d.geo===region)&&(!sector||d.sector===sector)&&(!type||d.type===type)&&(!unit||d.unit===unit)&&(!term||norm([d.org,d.unit,d.title,d.type,d.description,d.version,d.year,d.geo,d.sector,...(d.history||[]).map(h=>h.label)].join(' ')).includes(term)));
 arr.sort((a,b)=>{
  if(sort==='institution')return a.org.localeCompare(b.org,'es')||b.year-a.year;
  if(sort==='title')return a.title.localeCompare(b.title,'es');
  if(sort==='oldest')return (a.year||9999)-(b.year||9999)||a.org.localeCompare(b.org,'es');
  return (b.year||0)-(a.year||0) || (a.geo==='México'?0:1)-(b.geo==='México'?0:1) || a.org.localeCompare(b.org,'es');
 });
 return arr;
}
function update(){
 current=filtered();const root=$('policyResults');const fragment=document.createDocumentFragment();current.slice(0,visibleLimit).forEach(x=>fragment.append(card(x)));root.replaceChildren(fragment);
 $('policyCount').textContent=`${current.length} de ${POLICIES.length} documentos · mostrando ${Math.min(visibleLimit,current.length)}`;
 $('policyMore').hidden=current.length<=visibleLimit;
 $('policyEmpty').hidden=current.length!==0;
 $('policyExport').disabled=current.length===0;
}
function exportCsv(){
 const cols=[['geo','Ámbito'],['sector','Sector'],['org','Institución u organismo'],['unit','Nivel'],['title','Título'],['type','Tipo de documento'],['year','Año'],['version','Versión'],['status','Estatus'],['description','Descripción'],['url','Documento oficial'],['more','Más información'],['history','Versiones anteriores']];
 const cell=v=>`"${String(v??'').replace(/"/g,'""').replace(/\r?\n/g,' ')}"`;
 const lines=[cols.map(x=>cell(x[1])).join(',')];
 for(const doc of current)lines.push(cols.map(([key])=>cell(key==='history'?(doc.history||[]).map(h=>`${h.label}: ${h.url}`).join(' | '):doc[key])).join(','));
 const blob=new Blob(['\ufeff',lines.join('\r\n')],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob);const a=node('a');a.href=url;a.download='GenCiteIA_directorio_politicas_2026.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500);
}
function init(){
 $('policyReviewDate').textContent=POLICY_REVIEW_DATE;
 $('policyStatTotal').textContent=String(POLICIES.length);
 $('policyStatMexico').textContent=String(POLICIES.filter(d=>d.geo==='México').length);
 $('policyStatPrivate').textContent=String(POLICIES.filter(d=>d.geo==='México'&&d.sector==='Privada').length);
 $('policyStatWorld').textContent=String(POLICIES.filter(d=>d.geo==='Internacional').length);
 optionList('policyGeo',[...new Set(POLICIES.map(d=>d.geo))],'Todos los ámbitos');
 optionList('policySector',[...new Set(POLICIES.map(d=>d.sector))],'Todos los sectores');
 optionList('policyType',[...new Set(POLICIES.map(d=>d.type))],'Todos los tipos');
 optionList('policyUnit',[...new Set(POLICIES.map(d=>d.unit))],'Todos los niveles');
 ['policySearch','policyGeo','policySector','policyType','policyUnit','policySort'].forEach(id=>$(id).addEventListener(id==='policySearch'?'input':'change',()=>{visibleLimit=12;update();}));
 $('policyMore').addEventListener('click',()=>{visibleLimit+=12;update();});
 $('policyReset').addEventListener('click',()=>{
  ['policySearch','policyGeo','policySector','policyType','policyUnit'].forEach(id=>$(id).value='');$('policySort').value='recent';update();$('policySearch').focus();
 });
 $('policyExport').addEventListener('click',exportCsv);
 update();
}
document.addEventListener('DOMContentLoaded',init);
export { filtered as getFilteredPolicies };
