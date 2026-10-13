/** GenCite IA - Ayuda contextual en cuadro de diálogo nativo. */
const $=id=>document.getElementById(id);
function initHelp(){
 const dialog=$('helpDialog'),open=$('helpOpen');
 const close=()=>dialog.close();
 open?.addEventListener('click',()=>{if(!dialog.open)dialog.showModal();});
 $('helpClose')?.addEventListener('click',close);
 $('helpDone')?.addEventListener('click',close);
 dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
 if(!document.querySelector('#citationForm')){
   const erase=$('eraseAll'); if(erase)erase.remove();
   const notice=document.querySelector('.privacy-actions span'); if(notice)notice.textContent='Los campos del generador se administran desde la página Generador.';
 }
}
document.addEventListener('DOMContentLoaded',initHelp);
