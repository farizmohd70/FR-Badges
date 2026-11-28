/* FR Badges: Community made page. The list lives in the community repo (index.json). */
(()=>{
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BASE=window.FR_COMMUNITY,W=(window.FR_WORKER||'').replace(/\/$/,''),HIDE_AT=5;
let all=[],packs=[],view='badges',S={},hasStats=false,editing='',arm='';
const GN={community:'Other'};(window.CAT?window.CAT.groups:[]).forEach(g=>GN[g.id]=g.name);
const gn=g=>GN[g]||'Other';
const GOPT=(window.CAT?window.CAT.groups:[]).filter(g=>!['oneline','lang-code','lang-name'].includes(g.id)).map(g=>[g.id,g.name]).concat([['community','Other']]);
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2400)};
const ls=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||d)}catch(e){return JSON.parse(d)}};
const lset=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let ADMIN='';{const m=/admin=([^&]+)/.exec(location.hash);if(m){ADMIN=decodeURIComponent(m[1]);try{sessionStorage.setItem('fr_admin',ADMIN)}catch(e){}}else try{ADMIN=sessionStorage.getItem('fr_admin')||''}catch(e){}}
const owned=()=>ls('fr_owned','{}');
let maker='';
const who=x=>ADMIN&&x.u?`<div class="hint" style="margin:0">Maker ${x.u}</div>`:ADMIN?'<div class="hint" style="margin:0">Maker unknown (older item)</div>':'';
function post(path,body){return fetch(W+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}).then(r=>r.json().catch(()=>({})).then(j=>{if(!r.ok||j.error)throw new Error(j.error||'That did not work. Try again.');return j}))}
function pick(id){const b=all.find(x=>x.id===id);if(!b)return;try{const l=JSON.parse(localStorage.getItem('fr_com_pick')||'[]');if(!l.some(x=>x.id===id))l.push({id:b.id,n:b.n,p:b.p,g:b.g});localStorage.setItem('fr_com_pick',JSON.stringify(l));toast('Added. Open Make a pack to see it.')}catch(e){toast('Could not save in this browser')}}
function copy(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Pattern copied')).catch(()=>toast('Could not copy'))}
const likes=b=>(S[b.id]||[0,0])[0],reps=b=>(S[b.id]||[0,0])[1];
function card(b){
 const own=!!owned()[b.id],can=own||!!ADMIN;
 if(editing===b.id)return `<div class="cm-card" data-id="${b.id}"><div class="im"><img src="${BASE}badges/${b.id}.png" alt=""></div>
  <label class="f">Name<input type="text" data-f="n" maxlength="40" value="${esc(b.n)}"></label>
  <label class="f">Category<select data-f="g">${GOPT.map(([i,n])=>`<option value="${i}"${(b.g||'community')===i?' selected':''}>${esc(n)}</option>`).join('')}</select></label>
  <label class="f">Pattern<textarea data-f="p" rows="3" spellcheck="false">${esc(b.p)}</textarea></label>
  <div class="bar"><button class="b2 sm pri" data-a="save">Save</button><button class="b2 sm" data-a="cancel">Cancel</button></div></div>`;
 const liked=ls('fr_liked','[]').includes(b.id),rep=ls('fr_reported','[]').includes(b.id);
 return `<div class="cm-card" data-id="${b.id}"><div class="im"><img loading="lazy" src="${BASE}badges/${b.id}.png" alt="${esc(b.n)}"></div><div class="n">${esc(b.n)}</div><div class="hint" style="margin:0">${esc(gn(b.g))}</div><div class="mk2">Anonymous</div>${who(b)}<code title="${esc(b.p)}">${esc(b.p)}</code>
 <div class="bar"><button class="b2 sm pri" data-a="add">Add to my pack</button><button class="b2 sm" data-a="copy">Copy pattern</button><a class="b2 sm" href="make?tab=badge&amp;remix=${b.id}" style="text-decoration:none">Remix</a></div>
 <div class="bar cm-sub">${hasStats?`<button class="b2 sm${liked?' on':''}" data-a="like"${liked?' disabled':''}>&#9829; ${likes(b)}</button>`:''}${can?`<button class="b2 sm" data-a="edit">Edit</button><button class="b2 sm" data-a="del">${arm==='del'+b.id?'Tap again to delete':'Delete'}</button>`:''}${hasStats&&!own?`<button class="lk" data-a="rep"${rep?' disabled':''}>${rep?'Reported':arm==='rep'+b.id?'Tap again to report':'Report'}</button>`:''}${ADMIN&&hasStats?`<span class="hint" style="margin:0">${reps(b)} reports</span>`:''}</div></div>`}

function renderAdm(){if(!ADMIN)return;let el=document.getElementById('adm');if(!el){el=document.createElement('div');el.id='adm';el.className='hint';$('#note').insertAdjacentElement('beforebegin',el)}
 const m={};let none=0;for(const x of all)x.u?((m[x.u]=m[x.u]||{b:0,p:0}).b++):none++;for(const x of packs)x.u?((m[x.u]=m[x.u]||{b:0,p:0}).p++):none++;
 const ids=Object.keys(m).sort((a,b)=>(m[b].b+m[b].p)-(m[a].b+m[a].p));
 el.innerHTML=`<b>${ids.length}</b> makers · <b>${all.length}</b> badges · <b>${packs.length}</b> packs${none?` · ${none} older items without a maker id`:''}`+(ids.length?'<div class="bar" style="margin-top:6px;flex-wrap:wrap">'+ids.slice(0,12).map(i=>`<button class="b2 sm${maker===i?' on':''}" data-mk="${i}">${i} · ${m[i].b} badge${m[i].b===1?'':'s'}, ${m[i].p} pack${m[i].p===1?'':'s'}</button>`).join('')+(maker?'<button class="b2 sm" data-mk="">Show all</button>':'')+'</div>':'');
 el.onclick=e=>{const t=e.target.closest('[data-mk]');if(!t)return;maker=t.dataset.mk===maker?'':t.dataset.mk;keepF();view==='packs'?drawPacks():draw()}}
function draw(){const q=$('#q').value.trim().toLowerCase(),cat=$('#cat').value,so=$('#sort').value;
 let l=all.filter(b=>(!q||(b.n+' '+b.p).toLowerCase().includes(q))&&(!cat||(b.g||'community')===cat)&&(!maker||b.u===maker)&&(ADMIN||reps(b)<HIDE_AT));
 if(so==='liked')l=l.slice().sort((a,b)=>likes(b)-likes(a));
 $('#list').innerHTML=l.map(card).join('');
 $('#note').textContent=all.length?(l.length?'':'Nothing found. Try a different word.'):'';renderAdm()}
$('#list').addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;const c=t.closest('[data-id]'),id=c.dataset.id,b=all.find(x=>x.id===id),a=t.dataset.a;if(!b)return;
 if(a==='add')pick(id);else if(a==='copy')copy(b.p);
 else if(a==='edit'){editing=id;arm='';draw()}
 else if(a==='cancel'){editing='';draw()}
 else if(a==='save'){const f=k=>c.querySelector('[data-f='+k+']').value.trim();t.disabled=true;
  post('/edit',{id,k:ADMIN||owned()[id],n:f('n'),p:f('p'),g:f('g')}).then(j=>{Object.assign(b,{n:j.n,p:j.p,g:j.g});editing='';draw();toast('Saved.')}).catch(er=>{t.disabled=false;toast(er.message)})}
 else if(a==='del'){if(arm!=='del'+id){arm='del'+id;draw();setTimeout(()=>{if(arm==='del'+id){arm='';draw()}},3000);return}
  arm='';post('/edit',{id,k:ADMIN||owned()[id],del:1}).then(()=>{all=all.filter(x=>x.id!==id);const o=owned();delete o[id];lset('fr_owned',o);draw();toast('Deleted.')}).catch(er=>{draw();toast(er.message)})}
 else if(a==='like'){t.disabled=true;post('/like',{id}).then(j=>{S[id]=[j.l,j.r];const x=ls('fr_liked','[]');x.push(id);lset('fr_liked',x);draw()}).catch(er=>{t.disabled=false;toast(er.message)})}
 else if(a==='rep'){if(arm!=='rep'+id){arm='rep'+id;draw();setTimeout(()=>{if(arm==='rep'+id){arm='';draw()}},3000);return}
  arm='';post('/report',{id}).then(j=>{S[id]=[j.l,j.r];const x=ls('fr_reported','[]');x.push(id);lset('fr_reported',x);draw();toast('Thanks. We will look at it.')}).catch(er=>{draw();toast(er.message)})}});

/* style packs: shown as one card per pack */
const PLINK=id=>BASE+'packs/'+id+'/badges.json';
function packCard(p){const own=!!owned()[p.id],can=own||!!ADMIN,liked=ls('fr_liked','[]').includes(p.id),rep=ls('fr_reported','[]').includes(p.id);
 return `<div class="cm-card pkc" data-id="${p.id}"><div class="pkstrip" data-a="pview" title="See the whole pack">${(p.prev||[]).map(f=>`<img loading="lazy" src="${BASE}packs/${p.id}/${esc(f)}" alt="">`).join('')}</div>
 <div class="n">${esc(p.n)}</div><div class="hint" style="margin:0">${p.c} badges. Style pack</div><div class="mk2">Anonymous</div>${who(p)}
 <div class="bar"><a class="b2 sm pri" href="make?load=${encodeURIComponent(PLINK(p.id))}" style="text-decoration:none">Load in Builder</a><button class="b2 sm" data-a="plink">Copy URL</button><button class="b2 sm" data-a="pview">Preview</button></div>
 <div class="bar cm-sub">${hasStats?`<button class="b2 sm${liked?' on':''}" data-a="like"${liked?' disabled':''}>&#9829; ${likes(p)}</button>`:''}${can?`<button class="b2 sm" data-a="pdel">${arm==='pdel'+p.id?'Tap again to delete':'Delete'}</button>`:''}${hasStats&&!own?`<button class="lk" data-a="rep"${rep?' disabled':''}>${rep?'Reported':arm==='rep'+p.id?'Tap again to report':'Report'}</button>`:''}${ADMIN&&hasStats?`<span class="hint" style="margin:0">${reps(p)} reports</span>`:''}</div></div>`}
function drawPacks(){const q=$('#q').value.trim().toLowerCase(),so=$('#sort').value;
 let l=packs.filter(p=>(!q||p.n.toLowerCase().includes(q))&&(!maker||p.u===maker)&&(ADMIN||reps(p)<HIDE_AT));
 if(so==='liked')l=l.slice().sort((a,b)=>likes(b)-likes(a));
 $('#plist').innerHTML=l.map(packCard).join('');
 $('#note').textContent=packs.length?(l.length?'':'Nothing found. Try a different word.'):'No style packs yet. Be the first to make one.';renderAdm()}
$('#plist').addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;const id=t.closest('[data-id]').dataset.id,a=t.dataset.a;
 if(a==='plink')P_copy(PLINK(id));
 else if(a==='pview')openPack(id);
 else if(a==='like'){t.disabled=true;post('/like',{id}).then(j=>{S[id]=[j.l,j.r];const x=ls('fr_liked','[]');x.push(id);lset('fr_liked',x);drawPacks()}).catch(er=>{t.disabled=false;toast(er.message)})}
 else if(a==='rep'){if(arm!=='rep'+id){arm='rep'+id;drawPacks();setTimeout(()=>{if(arm==='rep'+id){arm='';drawPacks()}},3000);return}
  arm='';post('/report',{id}).then(j=>{S[id]=[j.l,j.r];const x=ls('fr_reported','[]');x.push(id);lset('fr_reported',x);drawPacks();toast('Thanks. We will look at it.')}).catch(er=>{drawPacks();toast(er.message)})}
 else if(a==='pdel'){if(arm!=='pdel'+id){arm='pdel'+id;drawPacks();setTimeout(()=>{if(arm==='pdel'+id){arm='';drawPacks()}},3000);return}
  arm='';post('/pack/delete',{id,k:ADMIN||owned()[id]}).then(()=>{packs=packs.filter(x=>x.id!==id);const o=owned();delete o[id];lset('fr_owned',o);drawPacks();toast('Deleted.')}).catch(er=>{drawPacks();toast(er.message)})}});
function P_copy(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('URL copied. Paste it into Nuvio.')).catch(()=>toast('Could not copy'))}

/* whole pack preview */
let pk=null,pkv='all';
const SK=(n)=>`<div class="sk"><i class="w1"></i><i class="w2"></i><div class="skb">${n}</div></div>`;
function pkRender(){const q=$('#pmq').value.trim().toLowerCase(),b=$('#pmb');if(!pk){return}
 const f=pk.f.filter(x=>!q||(x.name||'').toLowerCase().includes(q)||x.id.toLowerCase().includes(q));
 if(!f.length){b.innerHTML='<p class="hint">Nothing found.</p>';return}
 if(pkv==='nuvio'){const src=f.slice(0,48),cards=[];for(let i=0;i<src.length;i+=5)cards.push(SK(src.slice(i,i+5).map(x=>`<img loading="lazy" src="${esc(x.imageURL)}" alt="${esc(x.name||'')}" title="${esc(x.name||'')}">`).join('')));
  b.innerHTML='<p class="hint">How the badges sit on a Nuvio stream card. Nuvio shows them 16dp tall with a small gap, under the title lines.</p><div class="ncs">'+cards.join('')+'</div>'+(f.length>48?`<p class="hint">Showing the first 48 of ${f.length}. Use search to find others.</p>`:'');return}
 const gn2={};(pk.g||[]).forEach(g=>gn2[g.id]=g.name);const by={},ord=[];f.forEach(x=>{const g=x.groupId||'';if(!by[g]){by[g]=[];ord.push(g)}by[g].push(x)});
 b.innerHTML=ord.map(g=>`<h4 class="shd">${esc(gn2[g]||'Badges')} (${by[g].length})</h4><div class="pm-g">${by[g].map(x=>`<figure><img loading="lazy" src="${esc(x.imageURL)}" alt="${esc(x.name||'')}"><figcaption>${esc(x.name||x.id)}</figcaption></figure>`).join('')}</div>`).join('')}
function closePack(){$('#pm').hidden=true;document.body.style.overflow='';pk=null}
function openPack(id){const p=packs.find(x=>x.id===id);if(!p)return;pk=null;pkv='all';$('#pmq').value='';
 [...document.querySelectorAll('#pm [data-pv]')].forEach(b=>b.classList.toggle('on',b.dataset.pv==='all'));
 $('#pmn').textContent=p.n;$('#pmc').textContent=p.c+' badges. Style pack';$('#pmb').innerHTML='<p class="hint">Loading the pack.</p>';
 $('#pm').hidden=false;document.body.style.overflow='hidden';$('#pmx').focus();$('#pml').onclick=()=>P_copy(PLINK(id));
 fetch(PLINK(id)).then(r=>{if(!r.ok)throw 0;return r.json()}).then(m=>{pk={f:(m.filters||[]).filter(x=>x&&x.id&&/^https:\/\//.test(x.imageURL||'')),g:m.groups||[]};$('#pmc').textContent=pk.f.length+' badges. Style pack';pkRender()}).catch(()=>{$('#pmb').innerHTML='<p class="hint warn">Could not load this pack. Try again in a moment.</p>'})}
$('#pmx').onclick=closePack;$('#pm').addEventListener('click',e=>{if(e.target.id==='pm')closePack()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#pm').hidden)closePack()});
$('#pmq').oninput=pkRender;
document.querySelectorAll('#pm [data-pv]').forEach(b=>b.onclick=()=>{pkv=b.dataset.pv;document.querySelectorAll('#pm [data-pv]').forEach(x=>x.classList.toggle('on',x===b));pkRender()});
function setView(v2,pop){if(!pop&&v2!==view)FRNAV.push({view:v2});view=v2;$$('#vt [data-v]').forEach(b=>{const on=b.dataset.v===v2;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
 $('#list').hidden=v2!=='badges';{const h=$('#cth');h.className='ct-h'+(v2==='packs'?' pk':'');h.innerHTML=v2==='packs'?'<span>Sample strip</span><span>Pack</span><span>Creator</span><span></span>':'<span>Sample</span><span>Name</span><span>Matches</span><span>Creator</span><span></span>'}$('#plist').hidden=v2!=='packs';const ui=$('#cat')._ui;if(ui)ui.hidden=v2!=='badges';
 $('#q').placeholder=v2==='packs'?'Search packs':'Search badges';v2==='packs'?drawPacks():draw()}
const $$=s=>[...document.querySelectorAll(s)];
$$('#vt [data-v]').forEach(b=>b.onclick=()=>setView(b.dataset.v));
FRNAV.pop(s=>setView(s.view||'badges',true));
{const sv=FRNAV.get().view;if(sv==='packs')setView('packs',true);else FRNAV.rep({view})}
function keepF(){FRNAV.rep({q:$('#q').value,cat:$('#cat').value,so:$('#sort').value,mk:maker})}
{const s=FRNAV.get();if(s.q)$('#q').value=s.q;if(s.so)$('#sort').value=s.so;maker=s.mk||''}
$('#q').oninput=()=>{keepF();view==='packs'?drawPacks():draw()};$('#cat').onchange=()=>{keepF();draw()};$('#sort').onchange=()=>{keepF();view==='packs'?drawPacks():draw()};
if(ADMIN)$('#note').insertAdjacentHTML('beforebegin','<p class="hint warn">Admin mode: you can edit or delete any badge here.</p>');
fetch(BASE+'packs.json').then(r=>r.ok?r.json():[]).then(l=>{packs=Array.isArray(l)?l.filter(p=>/^[0-9a-f]{12}$/.test(p.id)):[];if(view==='packs')drawPacks()}).catch(()=>{});
const stats=W?fetch(W+'/stats').then(r=>r.json()).then(j=>{if(j&&j.ok){S=j.s||{};hasStats=true;$('#sortw').hidden=false}}).catch(()=>{}):Promise.resolve();
fetch(BASE+'index.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{all=(j.badges||[]).filter(b=>/^[0-9a-f]{12}$/.test(b.id));
 {const used=[...new Set(all.map(b=>b.g||'community'))];$('#cat').innerHTML='<option value="">All categories</option>'+used.map(g=>`<option value="${g}">${esc(gn(g))}</option>`).join('');const c0=FRNAV.get().cat;if(c0&&used.includes(c0))$('#cat').value=c0}
 if(!all.length){$('#note').textContent='No badges yet. Be the first to make one.';return}
 return stats.then(()=>{draw();if(!FRNAV.get().view&&/[?&]v=packs/.test(location.search))setView('packs',true)})}).catch(()=>{$('#note').textContent='The community list could not be loaded right now.'});
})();
