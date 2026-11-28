/* Pack Builder workbench: look, select and reorder on the left; live preview, order and URL on the right. */
const $=s=>document.querySelector(s),S=P.S,esc=P.esc;
const QS=new URLSearchParams(location.search);
let tab=['badge','style'].includes(QS.get('tab'))?QS.get('tab'):'build';
let sub=FRNAV.get().sub==='ord'?'ord':'sel',grp=FRNAV.get().grp||'all',q=FRNAV.get().q||'';
const START=[['lite','Lite pack','The everyday pack most people want'],['essentials','Essentials','Only the important badges'],['fast','Light and fast','About 30 badges, loads quickest'],['langlite','Essentials + main languages','Key badges, 15 common languages and subtitles'],['langs','Essentials + languages','Key badges plus all languages and subtitles'],['picture','Best picture','Resolution, HDR, Dolby Vision and codecs'],['theater','Home theater','Picture and sound, with speaker layouts'],['cinephile','Cinephile','IMAX, Criterion and other editions'],['audiophile','Sound lover','Audio formats and speaker layouts'],['streaming','Streaming services','Netflix, Prime and debrid providers'],['empty','Start empty','Pick everything yourself']];
const demoIds=()=>{const o=[];const gs=['resolution','source','audio-codec','hero','dynamic-range','streaming','video-codec','audio-channels','languages','editions'];for(let k=0;k<3;k++)gs.forEach(g=>{const b=P.byGroup[g]&&P.byGroup[g][k];if(b&&!o.includes(b.id)&&!o.some(x=>P.byId[x].n.toUpperCase()===b.n.toUpperCase()))o.push(b.id)});return o};
const kb=()=>(P.bytes()/1024).toFixed(0);

/* ---- tabs ---- */
function setTab(t){tab=t;
 document.querySelectorAll('#tabs [data-t]').forEach(b=>b.setAttribute('aria-selected',b.dataset.t===t));
 ['build','badge','style'].forEach(k=>{$('#t-'+k).hidden=k!==t});
 const f=$('#t-'+t+' iframe');if(f&&!f.getAttribute('src')){const r=QS.get('remix');f.src=f.dataset.src+'?embed=1'+(t==='badge'&&r?'&remix='+encodeURIComponent(r):'')}
 $('#mbar').hidden=t!=='build';$('#strip').hidden=t!=='build';closeSide();
 try{history.replaceState(history.state,'',t==='build'?location.pathname:location.pathname+'?tab='+t)}catch(e){}}
document.querySelectorAll('#tabs [data-t]').forEach(b=>b.onclick=()=>setTab(b.dataset.t));

/* ---- step 1 ---- */
function rLook(){const ids=demoIds().slice(0,4);
 $('#look').innerHTML=P.STYLES_UI.map((s,i,A)=>(s.animated&&!(A[i-1]&&A[i-1].animated)?'<div class="rgn">Animated</div>':'')+`<button type="button" class="lk2" aria-pressed="${S.style===s.id}" data-st="${s.id}"><span class="sw" style="background:${P.bgCol(s.id)}">${ids.map(i=>P.img(i,'',s.id)).join('')}</span><span><b>${esc(s.name)}</b><small>${esc(s.note)}</small></span></button>`).join('');
 document.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>P.setStyle(b.dataset.st))}
function markLook(){document.querySelectorAll('[data-st]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.st===S.style))}
function rPre(){$('#presets').innerHTML='<span class="l">Start from</span>'+START.map(([k,n,d])=>`<button type="button" class="b2 sm" data-p="${k}" title="${esc(d)}">${esc(n)}</button>`).join('');
 document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const n=P.preset(b.dataset.p);P.toast(n+' badges picked');setSub('sel')})}

/* ---- step 2: select ---- */
let COM=null,COMERR=false,chipX=0;
function loadCom(){COM=[];fetch((window.FR_COMMUNITY||'')+'index.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{COM=(j.badges||[]).filter(b=>/^[0-9a-f]{12}$/.test(b.id));if(sub==='sel'&&grp==='community')rSel()}).catch(()=>{COMERR=true;if(sub==='sel'&&grp==='community')rSel()})}
function comAll(){const l=(COM||[]).slice();Object.entries(S.com).forEach(([id,m])=>{if(!l.some(b=>b.id===id))l.unshift({id,n:m.n,p:m.p})});const qq=q.trim().toLowerCase();return qq?l.filter(b=>(b.n+' '+b.p).toLowerCase().includes(qq)):l}
function comHtml(){const l=comAll();if(!l.length)return `<div class="empty">${COM===null?'Loading community badges...':COMERR?'The community list could not be loaded right now.':'No community badges yet. Make the first one in the Make a badge tab.'}</div>`;
 return `<p class="hint">Badges shared by other people. <a href="community">See them all</a>. They are added to the end of your pack.</p><div class="grid">${l.map(b=>`<button type="button" class="tile ${S.com[b.id]?'on':''}" data-com="${b.id}"><div class="im" style="background:var(--bd)"><img src="${P.comUrl(b.id)}" alt="" loading="lazy" style="max-height:30px;max-width:90%"></div><div class="n">${esc(b.n)}</div></button>`).join('')}</div>`}
function rSel(){const oc=document.getElementById('chips');if(oc)chipX=oc.scrollLeft;const oy=window.scrollY;const counts={};P.CAT.badges.forEach(b=>{if(S.sel.has(b.id))counts[b.g]=(counts[b.g]||0)+1});
 $('#sel').innerHTML=`<div id="big"></div><label class="hint" style="display:flex;gap:8px;align-items:flex-start;margin:0 0 12px;cursor:pointer"><input type="checkbox" id="dvw" style="margin-top:3px"><span><b>Dolby Vision wins</b> (optional). When a stream says Dolby Vision, the HDR10, HDR10+, HDR and HLG badges stay hidden, so you only get one badge. This turns off the DV + HDR combo badges.</span></label>
 <div class="bar"><input type="search" id="q" placeholder="Search, like 4K or Atmos" value="${esc(q)}" aria-label="Search badges"><button type="button" class="b2" id="all">Pick all shown</button><button type="button" class="b2" id="none">Clear shown</button><button type="button" class="b2" id="mkb">Create your own badge</button></div>
 <div class="chips" id="chips" role="tablist" aria-label="Category"></div><div id="grid"></div>`;
 {const c=document.getElementById('dvw');if(c){c.checked=P.dvwOn();c.onchange=()=>P.setDvw(c.checked)}}
 $('#mkb').onclick=()=>setTab('badge');
 const ch=[['all','All']].concat(P.CAT.groups.map(g=>[g.id,g.name]),[['community','Community made']]);if(!ch.some(c=>c[0]===grp))grp='all';
 counts.community=P.comCount();
 $('#chips').innerHTML=ch.map(([id,n])=>`<button type="button" class="chip ${grp===id?'on':''}" data-g="${id}">${esc(n)}${id==='all'?'':`<i>${counts[id]||0}</i>`}</button>`).join('');
 $('#chips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{grp=b.dataset.g;FRNAV.rep({grp});rSel()});
 {const c=$('#chips');c.scrollLeft=chipX;const on=c.querySelector('.chip.on');if(on){const l=on.offsetLeft-c.offsetLeft,r=l+on.offsetWidth;if(l<c.scrollLeft)c.scrollLeft=l-8;else if(r>c.scrollLeft+c.clientWidth)c.scrollLeft=r-c.clientWidth+8}window.scrollTo(0,oy)}
 const list=()=>P.filter(q,{group:grp});
 const tile=b=>`<button type="button" class="tile ${S.sel.has(b.id)?'on':''}" data-id="${b.id}" aria-pressed="${S.sel.has(b.id)}"><div class="im" style="background:${P.bgOf(b.id)}">${P.img(b.id)}</div><div class="n">${esc(b.n)}</div></button>`;
 const tiles=arr=>{let pr;return arr.map(b=>{const h=b.r&&b.r!==pr?`<div class="rgn">${esc(P.CAT.regions[b.r])}</div>`:'';pr=b.r;return h+tile(b)}).join('')};
 const draw=()=>{const l=list();let h='';
  if(grp==='community'){h=comHtml()}
  else if(!l.length)h='<div class="empty">Nothing found. Try a different word.</div>';
  else if(grp!=='all')h=`<div class="grid">${tiles(l)}</div>`;
  else P.CAT.groups.forEach(g=>{const gl=l.filter(b=>b.g===g.id);if(!gl.length)return;
   h+=`<div class="sec" data-sec="${g.id}"><div class="sh"><span class="dot" style="background:${g.color}"></span><b>${esc(g.name)}</b><span class="c"></span><button type="button" class="lnk" data-pa="${g.id}">Pick all</button><button type="button" class="lnk" data-pc="${g.id}">Clear</button></div><div class="grid">${tiles(gl)}</div></div>`});
  $('#grid').innerHTML=h;
  $('#grid').querySelectorAll('.tile[data-id]').forEach(t=>t.onclick=()=>P.toggle(t.dataset.id));
  $('#grid').querySelectorAll('.tile[data-com]').forEach(t=>t.onclick=()=>{const id=t.dataset.com,b=comAll().find(x=>x.id===id);P.toggleCom(id,b)});
  if(grp==='community'&&COM===null)loadCom();
  const ids=g=>[...$('#grid').querySelectorAll('[data-sec="'+g+'"] .tile')].map(t=>t.dataset.id);
  $('#grid').querySelectorAll('[data-pa]').forEach(x=>x.onclick=()=>P.setMany(ids(x.dataset.pa),true));
  $('#grid').querySelectorAll('[data-pc]').forEach(x=>x.onclick=()=>P.setMany(ids(x.dataset.pc),false));
  secCounts()};
 draw();
 $('#q').oninput=e=>{q=e.target.value;FRNAV.rep({q});draw()};
 $('#all').onclick=()=>P.setMany(list().map(b=>b.id),true);
 $('#none').onclick=()=>P.setMany(list().map(b=>b.id),false)}
function secCounts(){document.querySelectorAll('#sel .sec').forEach(s=>{const t=s.querySelectorAll('.tile'),n=s.querySelectorAll('.tile.on').length;s.querySelector('.c').textContent=n+' of '+t.length+' picked'})}

/* ---- step 2: reorder and edit ---- */
let editing=null,lastTest='';
function peHtml(id){const t=lastTest||(P.samples.find(x=>{try{return P.testPat(P.byId[id].p,x)}catch(e){return false}})||P.samples[0]);lastTest=t;
 return`<div class="pe"><label for="pt">Regex pattern for ${esc(P.byId[id].n)}</label><textarea id="pt" rows="4" spellcheck="false" autocapitalize="off" autocomplete="off">${esc(P.pat(id))}</textarea>
 <label for="pq">Test it on a stream title</label><input type="text" id="pq" value="${esc(t)}" spellcheck="false">
 <div class="pr" id="pr"></div>
 <div class="bar"><button type="button" class="b2 pri sm" id="ps">Save</button><button type="button" class="b2 sm" id="pz">Reset to default</button><button type="button" class="b2 sm" id="px">Close</button></div>
 <p class="hint">Nuvio tests this pattern on each stream title. Start with <code>(?i)</code> to ignore capital letters. A custom pattern makes your link a little longer.</p></div>`}
function peBind(){if(!editing)return;const id=editing,pt=$('#pt'),pq=$('#pq'),pr=$('#pr');if(!pt)return;
 const upd=()=>{lastTest=pq.value;const e=P.checkPat(pt.value);if(e){pr.className='pr bad';pr.textContent='Not a valid pattern: '+e;$('#ps').disabled=true;return}
  $('#ps').disabled=false;let m;try{m=P.testPat(pt.value,pq.value)}catch(x){m=false}pr.className='pr '+(m?'ok':'no');pr.textContent=m?'Matches this title, so the badge will show.':'Does not match this title.'};
 pt.oninput=upd;pq.oninput=upd;upd();
 $('#ps').onclick=()=>{const y=scrollY;editing=null;P.setPat(id,pt.value);P.toast('Pattern saved');scrollTo(0,y)};
 $('#pz').onclick=()=>{pt.value=P.byId[id].p;upd()};
 $('#px').onclick=()=>{const y=scrollY;editing=null;rOrd();scrollTo(0,y)}}
function rOrd(){const act=P.activeGroups();
 if(!act.length){$('#ord').innerHTML=`<div class="empty">You have not picked any badges yet.</div><button type="button" class="b2 pri" id="g2">Select badges</button>`;$('#g2').onclick=()=>setSub('sel');return}
 $('#ord').innerHTML=`<p class="hint">Nuvio shows badges in this order, top to bottom. Drag a row or use the arrows.</p><div id="big2"></div>
 <div class="bar"><button type="button" class="b2 sm" id="rst">Reset order</button>${Object.keys(S.over).length?'<button type="button" class="b2 sm" id="rso">Use one style for all</button>':''}</div>
 ${act.map((g,gi)=>{const ids=P.groupSel(g),c=P.gInfo[g];return`<div class="grp"><div class="gh"><span class="dot" style="background:${c.color}"></span>${esc(c.name)}<span class="c">${ids.length}</span><button type="button" class="ib" data-gm="${g}" data-d="-1" aria-label="Move group up" ${gi===0?'disabled':''}>&uarr;</button><button type="button" class="ib" data-gm="${g}" data-d="1" aria-label="Move group down" ${gi===act.length-1?'disabled':''}>&darr;</button></div>
 ${ids.map((id,i)=>`<div class="rw" draggable="true" data-bid="${id}"><div class="row"><div class="im" style="background:${P.bgOf(id)}">${P.img(id)}</div><div class="n">${esc(P.byId[id].n)}${S.pat[id]!=null?' <span class="ed">edited</span>':''}</div>${P.byId[id]._com?`<select class="sty" data-cg="${P.byId[id]._com}" aria-label="Group">${P.comGroups().map(([gid,gn])=>`<option value="${gid}" ${P.byId[id].g===gid?'selected':''}>${esc(gn)}</option>`).join('')}</select>`:`<select class="sty" data-so="${id}" aria-label="Style">${P.STYLES.map(x=>`<option value="${x.id}" ${P.styleOf(id)===x.id?'selected':''}>${x.name}</option>`).join('')}</select>`}<button type="button" class="ib" data-bm="${id}" data-d="-1" aria-label="Move up" ${i===0?'disabled':''}>&uarr;</button><button type="button" class="ib" data-bm="${id}" data-d="1" aria-label="Move down" ${i===ids.length-1?'disabled':''}>&darr;</button><button type="button" class="ib${S.pat[id]!=null?' on':''}" data-pe="${id}" aria-label="Edit pattern" title="Edit pattern">{}</button><button type="button" class="ib" data-rm="${id}" aria-label="Remove">&times;</button></div>${editing===id?peHtml(id):''}</div>`).join('')}</div>`}).join('')}`;
 const mv=fn=>{const y=scrollY;fn();scrollTo(0,y)};
 const o=$('#ord');
 o.querySelectorAll('[data-gm]').forEach(b=>b.onclick=()=>mv(()=>P.moveGroup(b.dataset.gm,+b.dataset.d)));
 o.querySelectorAll('[data-bm]').forEach(b=>b.onclick=()=>mv(()=>P.moveBadge(b.dataset.bm,+b.dataset.d)));
 o.querySelectorAll('[data-so]').forEach(x=>x.onchange=()=>mv(()=>P.setOver(x.dataset.so,x.value)));
 o.querySelectorAll('[data-cg]').forEach(x=>x.onchange=()=>mv(()=>P.setComGroup(x.dataset.cg,x.value)));
 o.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>mv(()=>P.toggle(b.dataset.rm)));
 o.querySelectorAll('[data-pe]').forEach(b=>b.onclick=()=>{const y=scrollY;editing=editing===b.dataset.pe?null:b.dataset.pe;rOrd();scrollTo(0,y);if(editing){const t=$('#pt');if(t)t.scrollIntoView({block:'nearest'})}});
 /* drag a badge onto another badge of the same group */
 let drag=null;
 o.querySelectorAll('.rw[data-bid]').forEach(r=>{
  r.addEventListener('dragstart',e=>{if(e.target.closest('select,textarea,input'))return;drag=r.dataset.bid;r.classList.add('dragging');try{e.dataTransfer.setData('text/plain',drag);e.dataTransfer.effectAllowed='move'}catch(x){}});
  r.addEventListener('dragend',()=>{drag=null;o.querySelectorAll('.dragging,.over').forEach(x=>x.classList.remove('dragging','over'))});
  r.addEventListener('dragover',e=>{if(drag&&drag!==r.dataset.bid&&P.byId[drag].g===P.byId[r.dataset.bid].g){e.preventDefault();r.classList.add('over')}});
  r.addEventListener('dragleave',()=>r.classList.remove('over'));
  r.addEventListener('drop',e=>{e.preventDefault();const d=drag;drag=null;if(d)mv(()=>P.dropBadge(d,r.dataset.bid))})});
 peBind();
 $('#rst').onclick=()=>P.resetOrder();
 if($('#rso'))$('#rso').onclick=()=>P.clearOver()}

function setSub(v,keep){sub=v;if(!keep)FRNAV.rep({sub});
 document.querySelectorAll('#sub [data-v]').forEach(b=>{const on=b.dataset.v===v;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
 $('#sel').hidden=v!=='sel';$('#ord').hidden=v!=='ord';v==='sel'?rSel():rOrd();stat()}
document.querySelectorAll('#sub [data-v]').forEach(b=>b.onclick=()=>setSub(b.dataset.v));

/* ---- right panel ---- */
function rPv(){const pv=$('#pv');pv.style.background=P.bgCol(S.style);
 pv.innerHTML=P.samples.slice(0,3).map(t=>`<div class="s"><div>${esc(t)}</div><div class="bd">${P.match(t,true).map(b=>P.img(b.id)).join('')||'<span style="color:#c4c9d2;font-size:12px">No selected badge matches this one</span>'}</div></div>`).join('')}
let dragG=null;
function rSo(){const act=P.activeGroups();$('#soc').textContent=S.sel.size+' badge'+(S.sel.size===1?'':'s');
 if(!act.length){$('#so').innerHTML='<p class="hint" style="margin:0">Nothing selected yet. Pick a starting preset or tap badges in step 2.</p>';return}
 $('#so').innerHTML='<div class="so-list">'+act.map((g,i)=>{const c=P.gInfo[g];return`<div class="so" draggable="true" data-g="${g}"><i style="background:${c.color}"></i><span class="nm">${esc(c.name)}</span><span class="ct">${P.groupSel(g).length}</span><button type="button" class="ib" data-gm="${g}" data-d="-1" aria-label="Move ${esc(c.name)} up" ${i===0?'disabled':''}>&uarr;</button><button type="button" class="ib" data-gm="${g}" data-d="1" aria-label="Move ${esc(c.name)} down" ${i===act.length-1?'disabled':''}>&darr;</button></div>`}).join('')+'</div>';
 const o=$('#so');
 o.querySelectorAll('[data-gm]').forEach(b=>b.onclick=()=>P.moveGroup(b.dataset.gm,+b.dataset.d));
 o.querySelectorAll('.so').forEach(r=>{
  r.addEventListener('dragstart',e=>{dragG=r.dataset.g;r.classList.add('dragging');try{e.dataTransfer.setData('text/plain',dragG);e.dataTransfer.effectAllowed='move'}catch(x){}});
  r.addEventListener('dragend',()=>{dragG=null;o.querySelectorAll('.dragging,.over').forEach(x=>x.classList.remove('dragging','over'))});
  r.addEventListener('dragover',e=>{if(dragG&&dragG!==r.dataset.g){e.preventDefault();r.classList.add('over')}});
  r.addEventListener('dragleave',()=>r.classList.remove('over'));
  r.addEventListener('drop',e=>{e.preventDefault();const d=dragG;dragG=null;if(d)P.dropGroup(d,r.dataset.g)})})}
let curUrl='',ut=0;
function rOut(){const ph=/YOUR-/.test(window.FR_WORKER||'');
 $('#out').innerHTML=`<div class="kv"><span>Badges and size</span><b id="kv"></b></div>
 <label class="hint" for="nm" style="display:block;margin:0 0 4px">Pack name</label><input type="text" id="nm" value="${esc(S.name)}" style="width:100%;margin-bottom:12px" maxlength="40">
 <label class="hint" for="lk" style="display:block;margin:0 0 4px">URL</label><div class="urlbox"><input type="text" readonly id="lk" value="Making your URL..."><button type="button" class="b2 pri" id="cp">Copy</button></div>
 <p class="hint" id="lkh" style="margin:8px 0 0"><a id="tst" href="#" target="_blank" rel="noopener">Open the URL to test it</a>${ph?'<br>Set your Worker address in <code>assets/config.js</code> to make this URL work.':''}</p>
 <p class="nvp"><b>Nuvio</b> › Profile › Layout › Streams › <b>Fusion badge URLs</b><br>Paste the URL, then clear the Nuvio cache and reopen a stream list.</p>
 <details class="imp"><summary>More options</summary><div class="bar" style="margin-top:10px"><button type="button" class="b2 sm" id="sv">Save in this browser</button><button type="button" class="b2 sm" id="cj">Copy JSON</button><button type="button" class="b2 sm" id="cc">Copy share code</button></div><p class="hint">Share code: <code id="code" style="word-break:break-all"></code></p></details>`;
 $('#nm').oninput=e=>P.rename(e.target.value||'My FR Pack');
 $('#cp').onclick=()=>copyUrl();
 $('#cj').onclick=()=>P.copy(P.manifestText(),'JSON copied');
 $('#cc').onclick=()=>P.copy(P.code(),'Code copied');
 $('#sv').onclick=()=>P.toast(P.save()?'Saved':'Could not save here')}
function rUrl(){clearTimeout(ut);ut=setTimeout(()=>{if(!$('#lk'))return;$('#kv').textContent=S.sel.size+' / '+kb()+' KB';$('#code').textContent=P.code();
 $('#cp').disabled=!S.sel.size;P.packUrl().then(u=>{curUrl=u;if(!$('#lk'))return;$('#lk').value=u;$('#tst').href=u})},90)}
function copyUrl(){if(!S.sel.size){P.toast('Pick some badges first');return}P.packUrl().then(u=>P.copy(u,'URL copied'))}
function stat(){const b=$('#big'),b2=$('#big2'),w=S.sel.size>200?'<div class="warn"><span>You picked '+S.sel.size+' badges. With more than 200, streams will take longer to load.</span></div>':'';if(b)b.innerHTML=w;if(b2)b2.innerHTML=w;
 $('#mcnt').innerHTML='<b>'+S.sel.size+'</b> badge'+(S.sel.size===1?'':'s')+' &middot; '+kb()+' KB';$('#mcp').disabled=!S.sel.size;$('#undo').disabled=!P.canUndo()}
function rSide(){rPv();rSo();rUrl();stat()}

/* ---- mobile drawer ---- */
function openSide(){$('#side').classList.add('open');$('#scrim').hidden=false;$('#mpv').textContent='Close';$('#mpv').setAttribute('aria-expanded','true')}
function closeSide(){$('#side').classList.remove('open');$('#scrim').hidden=true;$('#mpv').textContent='Preview';$('#mpv').setAttribute('aria-expanded','false')}
$('#mpv').onclick=()=>$('#side').classList.contains('open')?closeSide():openSide();
$('#scrim').onclick=closeSide;
$('#mcp').onclick=copyUrl;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSide()});
matchMedia('(min-width:1000px)').addEventListener('change',closeSide);

/* ---- import, help, undo ---- */
$('#strip').onsubmit=async e=>{e.preventDefault();if(!$('#imp').value.trim()){$('#msg').textContent='Paste a URL, JSON or share code first.';return}const b=$('#go');b.disabled=true;$('#msg').textContent='Loading...';const r=await P.importAny($('#imp').value);b.disabled=false;
 if(r.err){$('#msg').textContent=r.err;return}$('#msg').textContent='';P.toast('Loaded '+r.n+' badges'+(r.unknown?', skipped '+r.unknown+' not in the catalog':''));$('#imp').value='';setSub('sel')};
$('#undo').onclick=()=>P.undo();
$('#helpB').onclick=()=>$('#help').showModal();$('#helpX').onclick=()=>$('#help').close();

P.on(why=>{stat();
 if(why==='name'){rUrl();return}
 if(why==='saved')return;
 if(why==='samples'){rPv();return}
 if(why==='sel'){document.querySelectorAll('#sel .tile[data-id]').forEach(t=>{const on=S.sel.has(t.dataset.id);t.classList.toggle('on',on);t.setAttribute('aria-pressed',on)});document.querySelectorAll('#sel .tile[data-com]').forEach(t=>t.classList.toggle('on',!!S.com[t.dataset.com]));{const cc=document.querySelector('.chip[data-g="community"] i');if(cc)cc.textContent=P.comCount()}secCounts();
  const c={};P.CAT.badges.forEach(b=>{if(S.sel.has(b.id))c[b.g]=(c[b.g]||0)+1});document.querySelectorAll('.chip[data-g]').forEach(x=>{const i=x.querySelector('i');if(i&&x.dataset.g!=='all'&&x.dataset.g!=='community')i.textContent=c[x.dataset.g]||0});
  if(sub==='ord')rOrd();rSide();return}
 if(why==='style'){markLook();if(sub==='sel')rSel();else rOrd();rSide();return}
 markLook();sub==='sel'?rSel():rOrd();rSide()});

P.init({draft:true});
rLook();rPre();rOut();setSub(sub,true);rSide();
FRNAV.pop(s=>{if(s.sub)setSub(s.sub,true)});
setTab(tab);
{const ld=QS.get('load');if(ld&&/^https?:\/\//.test(ld)){P.importAny(ld).then(r=>{if(r.err){P.toast(r.err);return}P.toast('Loaded '+r.n+' badges'+(r.unknown?', skipped '+r.unknown+' not in the catalog':''));setSub('sel')})}}
