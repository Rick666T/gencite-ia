"""GenCite IA: pruebas reproducibles con Chromium en entorno sin navegación externa.
   Ejecutar: python3 tests/ui-browser.py. Se inyectan las 2 páginas y su JS real.
"""
from pathlib import Path
import re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
SHOTS=Path('/mnt/data/GenCiteIA_Web_v22_vistas');SHOTS.mkdir(parents=True,exist_ok=True)

def bundled(kind):
    cfg=(ROOT/'config.js').read_text().replace('export const ','const ')
    gen=(ROOT/'generator.js').read_text().replace("import { CASES, FIELD_DEFS } from './config.js';",'').replace('export function ','function ')
    app=(ROOT/'app.js').read_text().replace("import { STYLES, CASES, SOURCES, FIELD_DEFS, EXAMPLES } from './config.js';",'').replace("import { generate } from './generator.js';",'').replace("window.addEventListener('DOMContentLoaded',init);",'init();')
    policies=(ROOT/'policies.js').read_text().replace('export const ','const ')
    policyui=(ROOT/'policies-ui.js').read_text().replace("import { POLICIES, POLICY_REVIEW_DATE } from './policies.js';",'').replace('export { filtered as getFilteredPolicies };','').replace("document.addEventListener('DOMContentLoaded',init);",'init();')
    helper=(ROOT/'help.js').read_text().replace("document.addEventListener('DOMContentLoaded',initHelp);",'initHelp();')
    if kind=='generator': return '(function(){'+cfg+'\n'+gen+'\n'+app+'})();','(function(){'+helper+'})();'
    return '(function(){'+policies+'\n'+policyui+'})();','(function(){'+helper+'})();'

def mount(browser,name,width=1440,height=900):
    p=browser.new_page(viewport={'width':width,'height':height},permissions=['clipboard-write','clipboard-read'])
    p.set_default_timeout(3500)
    errors=[];p.on('pageerror',lambda err:errors.append(str(err)))
    p.on('console',lambda message:errors.append(message.text) if message.type=='error' else None)
    html=(ROOT/name).read_text()
    html=re.sub(r'<script type="module"[^>]*></script>','',html)
    html=re.sub(r'<link[^>]*rel="(?:stylesheet|icon)"[^>]*>','',html)
    html=html.replace('</head>','<style>'+ (ROOT/'styles.css').read_text()+'</style></head>')
    p.set_content(html,wait_until='domcontentloaded')
    for js in bundled('generator' if name=='index.html' else 'policies'):
        p.add_script_tag(content=js)
    return p,errors

def no_overflow(page,label):
    data=page.evaluate('''() => ({w:document.documentElement.scrollWidth, client:document.documentElement.clientWidth,bad:[...document.querySelectorAll('body *')].filter(e => {let q=e.getBoundingClientRect();return q.width&&q.right>innerWidth+2 && !['fixed','absolute'].includes(getComputedStyle(e).position)}).slice(0,5).map(e=>[e.tagName,e.id||e.className,e.getBoundingClientRect().right])})''')
    assert data['w']<=data['client']+2,(label,data)
    assert not data['bad'],(label,data)

def test_general(p):
    assert p.locator('#helpOpen').is_visible()
    assert p.locator('a[href="index.html"]').count()==1
    assert p.locator('a[href="politicas.html"]').count()==1
    assert p.locator('a[href="#info"]').count()==0
    assert p.locator('#helpDialog').is_hidden()
    p.locator('#helpOpen').click()
    assert p.locator('#helpDialog').is_visible()
    assert 'Cómo' in p.locator('#helpDialog').inner_text() or 'Generar una cita' in p.locator('#helpDialog').inner_text()
    p.locator('#helpClose').click()
    assert p.locator('#helpDialog').is_hidden()
    p.locator('#helpOpen').click()
    p.keyboard.press('Escape')
    assert p.locator('#helpDialog').is_hidden()

with sync_playwright() as w:
 browser=w.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 g,errors1=mount(browser,'index.html')
 d,errors2=mount(browser,'politicas.html')
 assert g.locator('#policyResults').count()==0
 assert d.locator('#citationForm').count()==0
 assert g.locator('#citationForm').count()==1
 assert d.locator('#policyResults').count()==1
 test_general(g);test_general(d)
 assert g.locator('.style-tab').count()==6
 assert g.locator('#dateLanguage').input_value()=='es'
 assert 'Ricardo Tavira Sánchez' in g.locator('footer').inner_text()
 assert 'Ricardo Tavira Sánchez' in d.locator('footer').inner_text()
 g.screenshot(path=str(SHOTS/'01-generador-desktop.png'),full_page=False)
 d.screenshot(path=str(SHOTS/'02-politicas-desktop.png'),full_page=False)
 assert '65' in d.locator('#policyStatTotal').inner_text()
 assert '37' in d.locator('#policyStatMexico').inner_text()
 assert '28' in d.locator('#policyStatWorld').inner_text()
 assert d.locator('#policyResults .policy-card').count()==12
 assert 'Editorial internacional' not in d.locator('#policySector').inner_text()
 assert 'Asociación de estilo' not in d.locator('#policySector').inner_text()
 assert 'Revista universitaria' not in d.locator('#policyUnit').inner_text()
 # Full scrolling pagination of directory
 for _ in range(6):
     if d.locator('#policyMore').is_hidden():break
     d.locator('#policyMore').click()
 assert d.locator('#policyResults .policy-card').count()==65
 assert d.locator('#policyMore').is_hidden()
 d.locator('#policySearch').fill('Licenciatura')
 assert d.locator('.policy-card').count()>0
 assert 'Licenciatura' in d.locator('.policy-card').first.inner_text()
 d.locator('#policySearch').fill('ENIAG')
 assert d.locator('.policy-card').count()>=2
 assert any('Usos y percepciones' in x.inner_text() for x in d.locator('.policy-card').all())
 d.locator('#policySearch').fill('noexistenoexistenoexiste')
 assert d.locator('#policyEmpty').is_visible()
 d.locator('#policyReset').click()
 d.locator('#policyGeo').select_option('México')
 assert '37 de 65' in d.locator('#policyCount').inner_text()
 d.locator('#policySector').select_option('Privada')
 assert '8 de 65' in d.locator('#policyCount').inner_text()
 d.locator('#policyReset').click()
 d.locator('#policySort').select_option('institution')
 assert d.locator('.policy-card').count()==12
 d.locator('#policySort').select_option('recent')
 d.locator('#policyResults').scroll_into_view_if_needed()
 d.screenshot(path=str(SHOTS/'03-directorio-fichas-desktop.png'),full_page=False)
 print('DIRECTORIO: 65 fichas, exclusiones, filtros, ediciones, orden y búsqueda OK')
 # All 22 example forms in Spanish; validate output and typography tags.
 seen=0
 for i in range(6):
    g.locator('.style-tab').nth(i).click()
    name=g.locator('.style-tab').nth(i).locator('.style-name').inner_text()
    cases=g.locator('.scenario-button').count()
    for j in range(cases):
        g.locator('.scenario-button').nth(j).click()
        g.locator('#exampleButton').click()
        assert g.locator('#formErrors').is_hidden(),(name,j,g.locator('#formErrors').inner_text())
        assert g.locator('.output').count()>0,(name,j)
        assert 'undefined' not in g.locator('#outputArea').inner_text()
        assert g.locator('.output-value').count()>0
        seen+=1
 assert seen==22,seen
 print('GENERADOR: 6 estilos y 22 formularios con ejemplos válidos OK')
 # APA: not all output categories need citation pair.
 print('APA START: switch style',flush=True)
 g.locator('.style-tab').first.click()
 for j in [2,3,4,5]:
     print('APA case',j,flush=True)
     g.locator('.scenario-button').nth(j).click()
     g.locator('#exampleButton').click()
     label=' '.join(g.locator('.output-label').all_inner_texts())
     assert 'Cita parentética' not in label and 'Cita narrativa' not in label,(j,label)
 print('APA after loop, screenshot',flush=True)
 g.locator('.scenario-button').nth(3).click()
 g.locator('#exampleButton').click()
 assert g.locator('.output-value strong').count()>0
 assert g.locator('.output-value em').count()>0
 assert 'Figura' in g.locator('#outputArea').inner_text()
 g.locator('#formPanel').scroll_into_view_if_needed()
 g.screenshot(path=str(SHOTS/'04-grafica-apa-desktop.png'),full_page=False)
 # APA tool still offers alternative styles.
 print('APA tool copy tests',flush=True)
 g.locator('.scenario-button').first.click();g.locator('#exampleButton').click()
 assert 'Cita parentética (alternativa)' in g.locator('#outputArea').inner_text()
 assert 'Cita narrativa (alternativa)' in g.locator('#outputArea').inner_text()
 # Clipboard with formatted italics, text and Word ready font.
 g.evaluate('''() => {window._copied=[];window.ClipboardItem=class{constructor(data){this.data=data;this.types=Object.keys(data)}async getType(t){return this.data[t]}};Object.defineProperty(navigator,'clipboard',{configurable:true,value:{write:async items=>{window._copied=items},writeText:async txt=>{window._textCopied=txt}}});}''')
 g.get_by_role('button',name='Copiar con formato: Referencia bibliográfica').click()
 data=g.evaluate('''async()=>{const x=window._copied[0];return {types:x?.types||[],html:x?.types.includes('text/html')?await (await x.getType('text/html')).text():'',txt:x?.types.includes('text/plain')?await (await x.getType('text/plain')).text():''}}''')
 assert 'text/html' in data['types']
 assert '<em>ChatGPT</em>' in data['html']
 assert 'Calibri' in data['html'] and 'OpenAI. (2025)' in data['txt']
 g.locator('#f-company').fill('<script>alert(1)</script>')
 assert g.locator('.output-value script').count()==0
 g.locator('#f-company').fill('OpenAI')
 g.locator('#f-url').fill('javascript:alert(1)')
 assert g.locator('#formErrors').is_visible()
 print('APA: notas, citas alternativas, HTML rich clipboard, XSS y URL inválida OK')
 # Mobile layout (two separate pages) and visible Help button at 320.
 for width,height in [(1280,900),(1024,880),(768,950),(520,920),(430,900),(390,844),(375,820),(320,760)]:
    for page,place in [(g,'generator'),(d,'policies')]:
        page.set_viewport_size({'width':width,'height':height})
        page.evaluate('document.documentElement.style.scrollBehavior="auto";window.scrollTo(0,0)')
        page.wait_for_timeout(80)
        no_overflow(page,place+str(width))
        assert page.locator('#helpOpen').is_visible(),(place,width,'help invisible')
        page.locator('#helpOpen').click()
        assert page.locator('#helpDialog').is_visible()
        no_overflow(page,place+str(width)+' modal')
        page.locator('#helpDone').click()
        if width in (390,320):
            page.screenshot(path=str(SHOTS/f'{5 if place=="generator" else 6}-{place}-{width}px.png'),full_page=False)
 print('RESPONSIVO: ambas páginas, 8 anchuras, Ayuda modal y 0 desbordamientos OK')
 assert not errors1,errors1
 assert not errors2,errors2
 browser.close()
 print('Chromium OK. Screenshots',SHOTS)
