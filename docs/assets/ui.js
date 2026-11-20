/* Styled dropdowns: replaces the system select popup, keeps the real <select> as the source of truth */
(function(){
const $$=(s,r)=>[...(r||document).querySelectorAll(s)];
let open=null,pop=null,back=null;
function label(sel){const o=sel.options[sel.selectedIndex];return o?o.textContent:''}
function sync(sel){const b=sel._ui;if(!b)return;b.firstChild.textContent=label(sel);b.disabled=sel.disabled}
function close(){if(!open)return;open.b.setAttribute('aria-expanded','false');pop&&pop.remove();back&&back.remove();pop=back=null;const b=open.b;open=null;try{b.focus({preventScroll:true})}catch(e){}}
function sheetMode(sel){return innerWidth<=640&&!!sel.closest('[data-p=looks],[data-p=share]')}
function place(){if(!open)return;const r=open.b.getBoundingClientRect(),vh=innerHeight;
 if(sheetMode(open.sel)){pop.className='ui-pop ui-sheet';pop.style.cssText='';return}
 pop.className='ui-pop';const h=Math.min(pop.scrollHeight,Math.round(vh*.5)),below=vh-r.bottom,up=below<h+16&&r.top>below;
 pop.style.cssText='left:'+Math.max(8,Math.min(r.left,innerWidth-Math.max(r.width,200)-8))+'px;min-width:'+r.width+'px;max-height:'+Math.min(h,Math.round(vh*.5))+'px;'+(up?'bottom:'+(vh-r.top+6)+'px':'top:'+(r.bottom+6)+'px')}
function pick(sel,i){if(sel.selectedIndex!==i){sel.selectedIndex=i;sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}))}sync(sel);close()}
function show(sel){
 if(open){const same=open.sel===sel;close();if(same)return}
 const b=sel._ui;b.setAttribute('aria-expanded','true');
 back=document.createElement('div');back.className='ui-back'+(sheetMode(sel)?' dim':'');back.onclick=close;document.body.appendChild(back);
 pop=document.createElement('div');pop.className='ui-pop';pop.setAttribute('role','listbox');pop.tabIndex=-1;
 let html='',n=0;
 [...sel.children].forEach(c=>{
  if(c.tagName==='OPTGROUP'){html+='<div class="ui-gh">'+esc(c.label)+'</div>';[...c.children].forEach(o=>{html+=item(o,n++)})}else html+=item(c,n++)});
 pop.innerHTML=html;document.body.appendChild(pop);open={sel,b};
 function item(o,i){return '<div role="option" class="ui-o'+(i===sel.selectedIndex?' on':'')+(o.disabled?' off':'')+'" data-i="'+i+'" aria-selected="'+(i===sel.selectedIndex)+'">'+esc(o.textContent)+'</div>'}
 pop.onclick=e=>{const o=e.target.closest('.ui-o');if(o&&!o.classList.contains('off'))pick(sel,+o.dataset.i)};
 pop.onkeydown=e=>{const os=$$('.ui-o:not(.off)',pop);let i=os.indexOf(document.activeElement);
  if(e.key==='Escape'){e.preventDefault();close()}
  else if(e.key==='ArrowDown'){e.preventDefault();os[Math.min(os.length-1,i+1)].focus()}
  else if(e.key==='ArrowUp'){e.preventDefault();os[Math.max(0,i-1)].focus()}
  else if(e.key==='Home'){e.preventDefault();os[0].focus()}
  else if(e.key==='End'){e.preventDefault();os[os.length-1].focus()}
  else if(e.key==='Enter'||e.key===' '){if(document.activeElement.dataset.i!=null){e.preventDefault();pick(sel,+document.activeElement.dataset.i)}}
  else if(e.key.length===1){const k=e.key.toLowerCase(),s=os.slice(i+1).concat(os.slice(0,i+1)).find(o=>o.textContent.trim().toLowerCase().startsWith(k));if(s)s.focus()}
  else if(e.key==='Tab')close()};
 $$('.ui-o',pop).forEach(o=>o.tabIndex=-1);
 place();const cur=pop.querySelector('.ui-o.on')||pop.querySelector('.ui-o');if(cur){cur.focus({preventScroll:true});cur.scrollIntoView({block:'nearest'})}}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function enhance(sel){
 if(sel._ui||sel.multiple||sel.size>1)return;
 const b=document.createElement('button');b.type='button';b.className='ui-sel '+sel.className;b.setAttribute('aria-haspopup','listbox');b.setAttribute('aria-expanded','false');
 if(sel.getAttribute('aria-label'))b.setAttribute('aria-label',sel.getAttribute('aria-label'));
 b.innerHTML='<span></span><svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 sel.classList.add('ui-native');sel.tabIndex=-1;sel.setAttribute('aria-hidden','true');
 sel.after(b);sel._ui=b;
 b.onclick=()=>show(sel);
 b.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();show(sel)}};
 sel.addEventListener('change',()=>sync(sel));
 /* keep the label right when code sets .value or .selectedIndex or replaces options */
 const d=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value');
 Object.defineProperty(sel,'value',{get(){return d.get.call(this)},set(v){d.set.call(this,v);sync(this)},configurable:true});
 const di=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'selectedIndex');
 Object.defineProperty(sel,'selectedIndex',{get(){return di.get.call(this)},set(v){di.set.call(this,v);sync(this)},configurable:true});
 new MutationObserver(()=>sync(sel)).observe(sel,{childList:true,subtree:true,attributes:true,characterData:true});
 sync(sel)}
function scan(r){$$('select',r).forEach(enhance)}
addEventListener('resize',place);addEventListener('scroll',e=>{if(open&&!(pop&&pop.contains(e.target)))close()},true);
document.addEventListener('DOMContentLoaded',()=>{scan();new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.tagName==='SELECT')enhance(n);else scan(n)}}))}).observe(document.body,{childList:true,subtree:true})});
})();

/* page state kept in the browser history, so refresh and the back button stay on the same step or tab */
window.FRNAV={get(){const s=history.state;return s&&typeof s==='object'?s:{}},push(o){try{history.pushState({...FRNAV.get(),...o},'')}catch(e){}},rep(o){try{history.replaceState({...FRNAV.get(),...o},'')}catch(e){}},pop(f){addEventListener('popstate',()=>f(FRNAV.get()))}};
