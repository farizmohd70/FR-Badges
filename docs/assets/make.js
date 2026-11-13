

const $=s=>document.querySelector(s),S=P.S,esc=P.esc;
const STEPS=['Look','Badges','Order','Get pack'];
let step=0,grp='all',q='';
const GD=Object.fromEntries(P.CAT.groups.map(g=>[g.id,g.name]));
const START=[['lite','Recommended','The everyday pack most people want'],['essentials','Clean and simple','Only the important badges'],['fast','Light and fast','About 30 badges, loads quickest'],['langlite','Essentials + main languages','Key badges, 15 common languages and subtitles'],['langs','Essentials + languages','Key badges plus all languages and subtitles'],['picture','Best picture','Resolution, HDR, Dolby Vision and codecs'],['theater','Home theater','Picture and sound, with speaker layouts'],['cinephile','Cinephile','IMAX, Criterion and other editions'],['audiophile','Sound lover','Audio formats and speaker layouts'],['streaming','Streaming services','Netflix, Prime and debrid providers'],['empty','Start empty','Pick everything yourself']];
const demoIds=()=>{const o=[];['resolution','source','audio-codec'].forEach(g=>{const b=P.byGroup[g]&&P.byGroup[g][0];if(b)o.push(b.id)});return o};
const el=(h)=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstChild};

function renderSteps(){$('#steps').innerHTML=STEPS.map((s,i)=>`<button class="${i===step?'on':''} ${i<step?'done':''}" data-s="${i}"><b>${i<step?'✓':i+1}</b>${s}</button>`).join('');
 $('#steps').querySelectorAll('button').forEach(b=>b.onclick=()=>go(+b.dataset.s));
 $('#back').style.visibility=step?'visible':'hidden';$('#next').style.display=step===3?'none':'';
 $('#next').textContent=['Next: choose badges','Next: set the order','Next: get my pack'][step]||'';
 $('#undo').disabled=!P.canUndo();stat()}
function stat(){const bg=$('#big');if(bg)bg.innerHTML=S.sel.size>200?'<div class="warn"><span>You picked '+S.sel.size+' badges. With more than 200, streams will take longer to load.</span></div>':'';
 $('#stat').textContent=S.sel.size+' badge'+(S.sel.size===1?'':'s')+' picked'}
function go(n){step=n;scrollTo(0,0);render()}
function render(){renderSteps();[v1,v2,v3,v4][step]();stat()}

/* 1 look */
function v1(){const ids=demoIds();
 $('#view').innerHTML=`<h2>Pick a look</h2><p class="sub">This is how your badges will appear next to each stream.</p>
 <div class="cards">${P.STYLES.map(s=>`<button class="card ${S.style===s.id?'on':''}" data-st="${s.id}"><div class="sw" style="background:${P.bgCol(s.id)}">${ids.map(i=>P.img(i,'',s.id)).join('')}</div><div class="t">${s.name}</div><div class="d">${esc(s.note)}</div></button>`).join('')}</div>
 <h3>Start from</h3><p class="hint">You can add or remove badges in the next step.</p>
 <div class="cards">${START.map(([k,n,d])=>`<button class="card" data-p="${k}"><div class="t">${n}</div><div class="d">${d}</div></button>`).join('')}</div>`;
 document.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>P.setStyle(b.dataset.st));
 document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const n=P.preset(b.dataset.p);P.toast(n+' badges picked');go(1)})}

/* 2 badges */
function v2(){const counts={};P.CAT.badges.forEach(b=>{if(S.sel.has(b.id))counts[b.g]=(counts[b.g]||0)+1});
 $('#view').innerHTML=`<h2>Choose your badges</h2><p class="sub">Tap a badge to add it. Tap again to remove it.</p>
 <div id="big"></div><div class="bar"><input type="search" id="q" placeholder="Search, like 4K or Atmos" value="${esc(q)}"><button class="b2" id="all">Pick all shown</button><button class="b2" id="none">Clear shown</button></div>
 <div class="chips" id="chips"></div><div class="grid" id="grid"></div>`;
 const ch=[['all','All']].concat(P.CAT.groups.map(g=>[g.id,g.name]));
 $('#chips').innerHTML=ch.map(([id,n])=>`<button class="chip ${grp===id?'on':''}" data-g="${id}">${esc(n)}${id==='all'?'':`<i>${counts[id]||0}</i>`}</button>`).join('');
 $('#chips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{grp=b.dataset.g;v2()});
 const list=()=>P.filter(q,{group:grp});
 const draw=()=>{const l=list();$('#grid').innerHTML=l.length?l.map(b=>`<button class="tile ${S.sel.has(b.id)?'on':''}" data-id="${b.id}"><div class="im" style="background:${P.bgOf(b.id)}">${P.img(b.id)}</div><div class="n">${esc(b.n)}</div></button>`).join(''):'<div class="empty" style="grid-column:1/-1">Nothing found. Try a different word.</div>';
  $('#grid').querySelectorAll('.tile').forEach(t=>t.onclick=()=>P.toggle(t.dataset.id))};
 draw();
 $('#q').oninput=e=>{q=e.target.value;draw()};
 $('#all').onclick=()=>P.setMany(list().map(b=>b.id),true);
 $('#none').onclick=()=>P.setMany(list().map(b=>b.id),false)}

/* 3 order */
function v3(){const act=P.activeGroups();
 if(!act.length){$('#view').innerHTML=`<h2>Set the order</h2><p class="sub">You have not picked any badges yet.</p><button class="b2 pri" id="g2">Choose badges</button>`;$('#g2').onclick=()=>go(1);return}
 $('#view').innerHTML=`<h2>Set the order</h2><p class="sub">Nuvio shows badges in this order, top to bottom. Use the arrows to move things.</p>
 <div id="big"></div>
 <div class="bar"><button class="b2 sm" id="rst">Reset order</button>${Object.keys(S.over).length?'<button class="b2 sm" id="rso">Use one style for all</button>':''}</div>
 ${act.map((g,gi)=>{const ids=P.groupSel(g),c=P.gInfo[g];return`<div class="grp"><div class="gh"><span class="dot" style="background:${c.color}"></span>${esc(c.name)}<span class="c">${ids.length}</span><button class="ib" data-gm="${g}" data-d="-1" aria-label="Move group up" ${gi===0?'disabled':''}>↑</button><button class="ib" data-gm="${g}" data-d="1" aria-label="Move group down" ${gi===act.length-1?'disabled':''}>↓</button></div>
 ${ids.map((id,i)=>`<div class="row"><div class="im" style="background:${P.bgOf(id)}">${P.img(id)}</div><div class="n">${esc(P.byId[id].n)}</div><select class="sty" data-so="${id}" aria-label="Style">${P.STYLES.map(x=>`<option value="${x.id}" ${P.styleOf(id)===x.id?'selected':''}>${x.name}</option>`).join('')}</select><button class="ib" data-bm="${id}" data-d="-1" aria-label="Move up" ${i===0?'disabled':''}>↑</button><button class="ib" data-bm="${id}" data-d="1" aria-label="Move down" ${i===ids.length-1?'disabled':''}>↓</button><button class="ib" data-rm="${id}" aria-label="Remove">✕</button></div>`).join('')}</div>`}).join('')}`;
  const mv=(fn)=>{const y=scrollY;fn();scrollTo(0,y)};
 document.querySelectorAll('[data-gm]').forEach(b=>b.onclick=()=>mv(()=>P.moveGroup(b.dataset.gm,+b.dataset.d)));
 document.querySelectorAll('[data-bm]').forEach(b=>b.onclick=()=>mv(()=>P.moveBadge(b.dataset.bm,+b.dataset.d)));
 document.querySelectorAll('[data-so]').forEach(x=>x.onchange=()=>mv(()=>P.setOver(x.dataset.so,x.value)));
 document.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>mv(()=>P.toggle(b.dataset.rm)));
 $('#rst').onclick=()=>P.resetOrder();
 if($('#rso'))$('#rso').onclick=()=>P.clearOver();
 }

/* 4 get */
function v4(){const kb=(P.bytes()/1024).toFixed(0);
 $('#view').innerHTML=`<h2>Your pack is ready</h2><p class="sub">${S.sel.size} badges, ${kb} KB.</p>
 <div class="two"><div>
  <h3 style="margin-top:0">Name</h3><input type="text" id="nm" value="${esc(S.name)}" style="width:100%" maxlength="40">
  <h3>Copy your link</h3><div class="linkbox"><input type="text" readonly value="Making your link..." id="lk" aria-label="Pack link"><button class="b2 pri" id="cp">Copy</button></div>
  <p class="hint" id="lkh"><a id="tst" href="#" target="_blank" rel="noopener">Open the link to test it</a></p>
  <h3>Add it to Nuvio</h3><ol class="how"><li>Open <b>Profile</b>, then <b>Layout</b>, then <b>Streams</b>.</li><li>Open <b>Fusion badge URLs</b> and paste your link.</li><li>Clear the Nuvio cache and reopen a stream list.</li></ol>
 </div><div><h3 style="margin-top:0">Preview</h3><div class="pv" id="pv"></div></div></div>
 <details><summary>More options</summary>
  <div class="bar" style="margin-top:12px"><button class="b2" id="sv">Save in this browser</button><button class="b2" id="cj">Copy JSON</button><button class="b2" id="cc">Copy share code</button></div>
  <p class="hint">Share code: <code id="code">${esc(P.code())}</code></p>
  <p class="hint">Have a pack to load? Paste a share code or JSON.</p>
  <textarea id="imp" placeholder="Paste here"></textarea><div class="bar" style="margin-top:8px"><button class="b2" id="go">Load it</button><span class="hint" id="msg" style="margin:0"></span></div></details>`;
 $('#pv').style.background=P.bgCol(S.style);$('#pv').innerHTML=P.samples.slice(0,6).map(t=>`<div class="s"><div>${esc(t)}</div><div class="bd">${P.match(t,true).map(b=>P.img(b.id)).join('')||'<span style="color:#9aa0ad;font-size:13px">No badges match this one</span>'}</div></div>`).join('');
 $('#nm').oninput=e=>P.rename(e.target.value||'My FR Pack');
 const placeholder=/YOUR-/.test(window.FR_WORKER||'');
 P.packUrl().then(u=>{if(!$('#lk'))return;$('#lk').value=u;$('#tst').href=u;$('#cp').onclick=()=>P.copy(u,'Link copied');
  if(placeholder)$('#lkh').innerHTML='Set your Worker address in <code>assets/config.js</code> to make this link work.'});
 $('#cj').onclick=()=>P.copy(P.manifestText(),'JSON copied');
 $('#cc').onclick=()=>P.copy(P.code(),'Code copied');
 $('#sv').onclick=()=>P.toast(P.save()?'Saved':'Could not save here');
 $('#go').onclick=()=>{const r=P.importText($('#imp').value);$('#msg').textContent=r.err||('Loaded '+r.n+' badges');if(!r.err)v4stat()}}
const v4stat=()=>{stat();renderSteps()};

$('#back').onclick=()=>go(step-1);$('#next').onclick=()=>go(step+1);
$('#undo').onclick=()=>P.undo();
$('#helpB').onclick=()=>$('#help').showModal();$('#helpX').onclick=()=>$('#help').close();
P.on(why=>{renderSteps();
 if(why==='sel'&&step===1){document.querySelectorAll('.tile').forEach(t=>t.classList.toggle('on',S.sel.has(t.dataset.id)));
  const c={};P.CAT.badges.forEach(b=>{if(S.sel.has(b.id))c[b.g]=(c[b.g]||0)+1});document.querySelectorAll('.chip[data-g]').forEach(x=>{const i=x.querySelector('i');if(i&&x.dataset.g!=='all')i.textContent=c[x.dataset.g]||0});return}
 if(why==='name'||why==='saved'||why==='samples')return;
 [v1,v2,v3,v4][step]();stat()});
P.init();render();
