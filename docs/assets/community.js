/* FR Badges: Community made page. The list lives in the community repo (index.json). */
(()=>{
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BASE=window.FR_COMMUNITY;let all=[];const GN={community:'Other'};(window.CAT?window.CAT.groups:[]).forEach(g=>GN[g.id]=g.name);
const gn=g=>GN[g]||'Other';
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)};
function pick(id){const b=all.find(x=>x.id===id);if(!b)return;try{const l=JSON.parse(localStorage.getItem('fr_com_pick')||'[]');if(!l.some(x=>x.id===id))l.push({id:b.id,n:b.n,p:b.p,g:b.g});localStorage.setItem('fr_com_pick',JSON.stringify(l));toast('Added. Open Make a pack to see it.')}catch(e){toast('Could not save in this browser')}}
function copy(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Pattern copied')).catch(()=>toast('Could not copy'))}
function draw(){const q=$('#q').value.trim().toLowerCase();const cat=$('#cat').value;const l=all.filter(b=>(!q||(b.n+' '+b.p).toLowerCase().includes(q))&&(!cat||(b.g||'community')===cat));
 $('#list').innerHTML=l.map(b=>`<div class="cm-card"><div class="im"><img loading="lazy" src="${BASE}badges/${b.id}.png" alt="${esc(b.n)}"></div><div class="n">${esc(b.n)}</div><div class="hint" style="margin:0">${esc(gn(b.g))}</div><code title="${esc(b.p)}">${esc(b.p)}</code><div class="bar"><button class="b2 sm pri" data-a="${b.id}">Add to my pack</button><button class="b2 sm" data-c="${b.id}">Copy pattern</button><a class="b2 sm" href="create?remix=${b.id}" style="text-decoration:none">Remix</a></div></div>`).join('');
 $('#note').textContent=all.length?(l.length?'':'Nothing found. Try a different word.'):'';
 $('#list').querySelectorAll('[data-a]').forEach(x=>x.onclick=()=>pick(x.dataset.a));
 $('#list').querySelectorAll('[data-c]').forEach(x=>x.onclick=()=>copy(all.find(b=>b.id===x.dataset.c).p))}
$('#q').oninput=draw;$('#cat').onchange=draw;
fetch(BASE+'index.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{all=(j.badges||[]).filter(b=>/^[0-9a-f]{12}$/.test(b.id));
 {const used=[...new Set(all.map(b=>b.g||'community'))];$('#cat').innerHTML='<option value="">All categories</option>'+used.map(g=>`<option value="${g}">${esc(gn(g))}</option>`).join('')}
 if(!all.length){$('#note').textContent='No badges yet. Be the first to make one.';return}draw()}).catch(()=>{$('#note').textContent='The community list could not be loaded right now.'});
})();
