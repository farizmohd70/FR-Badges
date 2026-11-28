/* Badge Library: search, category tabs, and a global look switcher over every badge in the catalog. */
(()=>{
const $=s=>document.querySelector(s),P=window.P,esc=P.esc,CAT=P.CAT;
const SUP=[['all','All',null,'grid'],
 ['picture','Picture',['resolution','dynamic-range','video-codec','video-format','containers'],'image'],
 ['sound','Sound',['audio-codec','audio-channels'],'sound'],
 ['source','Source',['source','tiers'],'disc'],
 ['edition','Edition',['hero','editions'],'clapper'],
 ['service','Service',['streaming','streaming-logo','streaming-intro','debrid'],'tv'],
 ['language','Language',['audio-subs','languages','lang-code','lang-name','dub-code','dub-name','subtitles','sub-code'],'lang']];
const mapped=new Set(SUP.flatMap(s=>s[2]||[]));
const rest=CAT.groups.map(g=>g.id).filter(g=>!mapped.has(g));
if(rest.length)SUP.push(['other','Other',rest,'more']);
const GN=Object.fromEntries(CAT.groups.map(g=>[g.id,g.name])),GC=Object.fromEntries(CAT.groups.map(g=>[g.id,g.color]));
const st0=FRNAV.get();
let q=st0.q||'',cat=st0.c||'all',look=st0.s||(P.S.style||'glass'),cur=null;
if(!P.STYLES.some(s=>s.id===look))look='glass';
const inCat=(b,c)=>{const e=SUP.find(s=>s[0]===c);return !e||!e[2]||e[2].includes(b.g)};
const visible=()=>{P.S.style=look;return CAT.badges.filter(b=>!P.same1l(b.id))};
function counts(){const v=visible(),qq=q.trim().toLowerCase(),m=v.filter(b=>!qq||b.hay.includes(qq)||b.p.toLowerCase().includes(qq));const c={};SUP.forEach(s=>c[s[0]]=m.filter(b=>inCat(b,s[0])).length);return {m,c}}
function tabs(c){$('#tabs').innerHTML=SUP.map(s=>`<button type="button" role="tab" class="chip ${cat===s[0]?'on':''}" aria-selected="${cat===s[0]}" data-c="${s[0]}">${ic(s[3]||'more')}${s[1]}<i>${c[s[0]]}</i></button>`).join('')}
function draw(){const {m,c}=counts();tabs(c);const l=m.filter(b=>inCat(b,cat));
 $('#cnt').textContent=l.length+' badge'+(l.length===1?'':'s')+(q.trim()?' matching "'+q.trim()+'"':'')+' shown in '+P.STYLES.find(s=>s.id===look).name;
 if(!l.length){$('#grid').innerHTML='<div class="empty">Nothing found. Try a different word.</div>';return}
 const by={},ord=[];l.forEach(b=>{if(!by[b.g]){by[b.g]=[];ord.push(b.g)}by[b.g].push(b)});
 $('#grid').innerHTML=ord.map(g=>`<section class="lib-g"><h3><span class="dot" style="background:${GC[g]||'var(--text-muted)'};width:8px;height:8px;border-radius:2px"></span>${esc(GN[g]||g)} <span class="c">${by[g].length}</span></h3><div class="lib-grid">${by[g].map(b=>`<button type="button" class="bt" data-id="${b.id}" aria-haspopup="dialog" title="${esc(b.n)}"><span class="im">${P.img(b.id,'',look).replace('<img ','<img loading="lazy" ')}</span><span class="nm">${esc(b.n)}</span><span class="rx">${esc(b.p.length>150?b.p.slice(0,150)+'...':b.p)}</span></button>`).join('')}</div></section>`).join('')}
function save(){FRNAV.rep({q,c:cat,s:look})}
function pick(id,btn){cur=id;const b=P.byId[id],d=$('#det');
 d.innerHTML=`<button type="button" class="b2 sm x" id="dx" aria-label="Close">${ic('x')}Close</button><h3>${esc(b.n)}</h3><div class="hint" style="margin:0">${esc(GN[b.g]||b.g)}</div>
 <div class="big">${P.img(id,'',look)}</div>
 <dl><dt>Slug</dt><dd>${esc(b.id)}</dd><dt>File</dt><dd>${esc(b.f)}</dd><dt>Matches</dt><dd>${esc(b.p)}</dd></dl>
 <div class="copyrow"><button type="button" class="b2 sm" data-cp="p">${ic('copy')}Copy pattern</button><button type="button" class="b2 sm" data-cp="s">${ic('link')}Copy slug</button><a class="b2 sm" href="make" style="text-decoration:none">${ic('package')}Open Pack Builder</a></div>
 <h4 class="shd" style="margin-top:16px">In every look</h4><div class="all">${P.STYLES_UI.map(s=>`<button type="button" data-look="${s.id}" title="${esc(s.name)}"><img loading="lazy" alt="" src="${P.src(id,s.id)}"><span>${esc(s.name)}</span></button>`).join('')}</div>`;
 d.hidden=false;d._from=btn;$('#dx').focus();
 document.querySelectorAll('.bt').forEach(x=>x.setAttribute('aria-expanded',x.dataset.id===id))}
function close(){const d=$('#det');if(d.hidden)return;d.hidden=true;cur=null;document.querySelectorAll('.bt[aria-expanded=true]').forEach(x=>x.setAttribute('aria-expanded','false'));if(d._from&&document.contains(d._from))d._from.focus()}
$('#grid').addEventListener('click',e=>{const t=e.target.closest('.bt');if(!t)return;if(cur===t.dataset.id){close();return}pick(t.dataset.id,t)});
$('#det').addEventListener('click',e=>{if(e.target.closest('#dx')){close();return}
 const c=e.target.closest('[data-cp]');if(c){const b=P.byId[cur];P.copy(c.dataset.cp==='p'?b.p:b.id,c.dataset.cp==='p'?'Pattern copied':'Slug copied');return}
 const l=e.target.closest('[data-look]');if(l){setLook(l.dataset.look)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close();
 if(e.key==='/'&&!/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement||{}).tagName)){e.preventDefault();$('#q').focus()}});
$('#tabs').addEventListener('click',e=>{const t=e.target.closest('[data-c]');if(!t)return;cat=t.dataset.c;save();draw()});
let tm=0;$('#q').addEventListener('input',e=>{q=e.target.value;clearTimeout(tm);tm=setTimeout(()=>{save();draw()},60)});
function setLook(id){look=id;$('#look').value=id;save();const keep=cur;draw();if(keep)pick(keep,document.querySelector('.bt[data-id="'+keep+'"]'))}
$('#look').innerHTML=P.STYLES_UI.map(s=>`<option value="${s.id}">${esc(s.name)}${s.animated?' (animated)':''}</option>`).join('');
$('#look').value=look;$('#look').onchange=e=>setLook(e.target.value);
$('#q').value=q;draw();
})();
