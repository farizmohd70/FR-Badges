/* FR Badges: badge editor. Draws a PNG that fits Nuvio (16dp tall, width at most 5.75 times the height). */
(()=>{
const $=s=>document.querySelector(s),H=240,MAXR=5.7,MINR=1.25;
const {FONTS,DEF,PRE,ICO,ICN}=FRD;
let IMG=null;
const draw=(cv,o,img)=>{const r=FRD.draw(cv,o,img);cvW=r.W;return r};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)};
const GR=(window.CAT?window.CAT.groups:[]).filter(g=>!['oneline','lang-code','lang-name'].includes(g.id)).map(g=>[g.id,g.name]).concat([['community','Other']]);
$('#gp').innerHTML=GR.map(([i,n])=>`<option value="${i}">${n}</option>`).join('');
$('#font').innerHTML=FONTS.map(f=>`<option value="${f}" style="font-family:'${f}'">${f}</option>`).join('');
const pf=p=>({...DEF,...p});
$('#pre').innerHTML=PRE.map((p,i)=>{const q=pf(p),bgc=q.tr?'transparent':(q.gd==='none'?q.bg1:`linear-gradient(${q.gd==='h'?'90deg':'180deg'},${q.bg1},${q.bg2})`);return `<button class="b2 sm" data-p="${i}" style="background:${q.tr?'#4a4e57':bgc};opacity:1;color:${q.fg};border:${Math.min(q.bw,3)||1}px solid ${q.bw?q.bc:'transparent'};-webkit-text-stroke:0">${p.n}</button>`}).join('');
const v=id=>{const e=$('#'+id);return e.type==='checkbox'?e.checked:e.value};
const set=(id,x)=>{const e=$('#'+id);if(e.type==='checkbox')e.checked=!!x;else e.value=x};
let cvW=0;
/* tabs */
function tab(t){document.querySelectorAll('.cr-tabs [data-t]').forEach(b=>{const on=b.dataset.t===t;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});document.querySelectorAll('.cr-p').forEach(p=>p.classList.toggle('on',p.dataset.p===t));
 const bar=$('.cr-tabs');if(bar){const a=bar.querySelector('.on');if(a)bar.scrollLeft=a.offsetLeft-12}
 if(t==='share')refreshShare();if(t==='pat')check()}
document.querySelectorAll('.cr-tabs [data-t]').forEach(b=>b.onclick=()=>tab(b.dataset.t));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{tab(b.dataset.go);const y=$('.cr-tabs').getBoundingClientRect().top+scrollY-(($('#pvbox')||{}).offsetHeight||0)-12;scrollTo({top:Math.max(0,y),behavior:'smooth'})});
const opts=()=>({txt:v('txt')||' ',sym:v('sym').trim(),font:v('font'),wt:v('wt'),sz:+v('sz'),ls:+v('ls'),fg:v('fg'),cs:v('cs'),bg1:v('bg1'),bg2:v('bg2'),gd:v('gd'),bc:v('bc'),bw:+v('bw'),rd:+v('rd'),px:+v('px'),sh:v('sh'),tr:v('tr'),bgo:+v('bgo'),gl:v('gl'),tow:+v('tow'),toc:v('toc'),t2:v('t2'),s2:+v('s2'),ic:v('ic'),imz:+v('imz'),shs:+v('shs'),gw:+v('gw'),gc:v('gc'),bgr:v('bgr'),bc2:v('bc2')});
let busy=0;
async function render(){
 const o=opts();const my=++busy;
 try{await Promise.all([document.fonts.load(`${o.wt} 40px "${o.font}"`,o.txt),document.fonts.load(`400 40px "${o.font}"`,o.sym||'A')])}catch(e){}
 if(my!==busy)return;
 const cv=$('#cv'),r=draw(cv,o,IMG);
 $('#szv').textContent=o.sz;$('#lsv').textContent=o.ls;$('#bwv').textContent=o.bw;$('#rdv').textContent=o.rd;$('#pxv').textContent=o.px;$('#bgov').textContent=o.bgo+'%';$('#towv').textContent=o.tow;$('#s2v').textContent=o.s2+'%';$('#shsv').textContent=o.shs;$('#gwv').textContent=o.gw;$('#imzv').textContent=o.imz+'%';contrast(o);
 const ratio=r.W/H;
 $('#meta').textContent=`${r.W} × ${H} px, width is ${ratio.toFixed(2)}× the height (Nuvio limit 5.75)`+(r.size<o.sz?'. The text was shrunk to fit.':'');
 cv.style.height='clamp(48px,18vw,96px)';

 check();
}
function flags(p){const m=/^\(\?([a-z]+)\)/.exec(p);let f='',b=p;if(m){b=p.slice(m[0].length);for(const c of m[1])if('ims'.includes(c)&&!f.includes(c))f+=c}return[b,f]}
function rx(p){const[b,f]=flags(p);try{return new RegExp(b,f)}catch(e){try{return new RegExp(b,f+'u')}catch(e2){throw e2}}}
const esc=s=>String(s).replace(/[&<>"]/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[k]));
const PR='https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/Badges/',CRX={};
function catRx(b){if(!(b.id in CRX)){try{CRX[b.id]=rx(b.p)}catch(e){CRX[b.id]=null}}return CRX[b.id]}
function check(){const p=$('#pat').value.trim(),pr=$('#pr');
 if(!p){pr.className='pr bad';pr.textContent='Add a pattern.';return false}
 let r;try{r=rx(p)}catch(e){pr.className='pr bad';pr.textContent='Not a valid pattern: '+e.message;return false}
 const L=$('#tt').value.split('\n').map(s=>s.trim()).filter(Boolean),hit=L.map(l=>r.test(l)),n=hit.filter(Boolean).length;
 pr.className='pr '+(n?'ok':'no');
 const big=$('#pvz')&&$('#pvz').checked,h=big?28:16,mine=$('#cv').toDataURL('image/png'),CAT_=window.CAT;
 const lite=CAT_?new Set(CAT_.lite):new Set(),pool=CAT_?CAT_.badges.filter(b=>lite.has(b.id)):[];
 const card=(l,i)=>{const others=pool.filter(b=>{const x=catRx(b);try{return x&&x.test(l)}catch(e){return false}}).slice(0,8);
  return `<div class="nc ${hit[i]?'y':'n'}"><div class="nct">Stream ${i+1}<span class="nch">${hit[i]?'✓ your badge shows':'✗ no match'}</span></div><div class="ncf">${esc(l)}</div><div class="ncb">${others.map(b=>`<img src="${PR}${b.f}" alt="${esc(b.n)}" style="height:${h}px" onerror="this.remove()">`).join('')}${hit[i]?`<img class="me" src="${mine}" alt="Your badge" style="height:${h}px">`:''}</div></div>`};
 pr.innerHTML=L.length?`<b>${n} of ${L.length} titles match</b>`+(n?'. The badge shows on those.':'. The badge will not show.')+`<div class="ncs">${L.map(card).join('')}</div>`:'Add a title to test.';
 return true}
['t2','s2','ic','imz','shs','gw','gc','bgr','bc2','txt','sym','font','wt','sz','ls','fg','cs','bg1','bg2','gd','bc','bw','rd','px','sh','tr','bgo','gl','tow','toc'].forEach(id=>{$('#'+id).addEventListener('input',render);$('#'+id).addEventListener('change',render)});
['pat','tt'].forEach(id=>$('#'+id).addEventListener('input',check));$('#pvz').addEventListener('change',check);
$('#txt').addEventListener('input',()=>{const n=$('#nm');if(!n.dataset.t){n.value=v('txt').slice(0,40)}});
$('#nm').addEventListener('input',()=>{$('#nm').dataset.t=1});
/* start from an existing badge */
const BASEOK=(window.CAT?window.CAT.badges:[]).filter(b=>!['oneline','lang-code','lang-name'].includes(b.g));
const GNAME={};(window.CAT?window.CAT.groups:[]).forEach(g=>GNAME[g.id]=g.name);
function fillBase(){const q=$('#bq').value.trim().toLowerCase();const by={};
 BASEOK.filter(b=>!q||(b.n+' '+b.id).toLowerCase().includes(q)).forEach(b=>(by[b.g]=by[b.g]||[]).push(b));
 $('#base').innerHTML='<option value="">'+(Object.keys(by).length?'Choose a badge...':'Nothing found')+'</option>'+Object.keys(by).map(g=>`<optgroup label="${(GNAME[g]||g).replace(/"/g,'')}">${by[g].map(b=>`<option value="${b.id}">${b.n.replace(/[<&]/g,'')}</option>`).join('')}</optgroup>`).join('')}
$('#bq').oninput=fillBase;fillBase();
$('#base').onchange=()=>{const b=BASEOK.find(x=>x.id===$('#base').value);if(!b)return;
 $('#pat').value=b.p;set('txt',b.n.slice(0,24));$('#nm').value=(b.n+' (my style)').slice(0,40);$('#nm').dataset.t=1;
 if([...$('#gp').options].some(o=>o.value===b.g))$('#gp').value=b.g;
 render();toast('Pattern copied from '+b.n)};
$('#pxr').onclick=()=>{set('px',72);render()};
$('#pre').onclick=e=>{const b=e.target.closest('[data-p]');if(!b)return;const p=PRE[+b.dataset.p];const q=pf(p);Object.keys(DEF).forEach(k=>set(k,q[k]));render()};
/* the design is stored inside the PNG (a text chunk), so anyone can remix a shared badge */
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRC[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
function addText(png,key,val){const d=new TextEncoder().encode(key+'\0'+val),t=new TextEncoder().encode('tEXt'),body=new Uint8Array(4+d.length);body.set(t);body.set(d,4);
 const ch=new Uint8Array(12+d.length),dv=new DataView(ch.buffer);dv.setUint32(0,d.length);ch.set(body,4);dv.setUint32(8+d.length,crc(body));
 const cut=png.length-12,out=new Uint8Array(png.length+ch.length);out.set(png.subarray(0,cut));out.set(ch,cut);out.set(png.subarray(cut),cut+ch.length);return out}
function readText(png,key){const dv=new DataView(png.buffer,png.byteOffset,png.byteLength);let p=8;
 while(p+12<=png.length){const n=dv.getUint32(p),ty=String.fromCharCode(...png.subarray(p+4,p+8));
  if(ty==='tEXt'){const d=png.subarray(p+8,p+8+n),z=d.indexOf(0);if(String.fromCharCode(...d.subarray(0,z))===key)return String.fromCharCode(...d.subarray(z+1))}
  if(ty==='IEND')break;p+=12+n}return null}
const DIDS=['t2','s2','ic','imz','shs','gw','gc','bgr','bc2','txt','sym','font','wt','sz','ls','fg','cs','bg1','bg2','gd','bc','bw','rd','px','sh','tr','bgo','gl','tow','toc'];
const MIDS=['pat','nm','gp','tt','pw','pwb','pwi','pws'];
const getD=()=>{const o={};DIDS.forEach(k=>o[k]=v(k));return o};
function setD(o){DIDS.forEach(k=>{if(o[k]!==undefined)set(k,o[k])})}
const getAll=()=>{const o=getD();MIDS.forEach(k=>o[k]=v(k));o.nt=$('#nm').dataset.t?1:0;return o};
const NEWD={t2:'',s2:70,ic:'',imz:56,shs:35,gw:0,gc:'#ffffff',bgr:0,bc2:'#ffffff'};
function setAll(o){setD({...NEWD,...o});MIDS.forEach(k=>{if(o[k]!==undefined)set(k,o[k])});if(o.nt)$('#nm').dataset.t=1;else delete $('#nm').dataset.t;render()}
const blob=async()=>{const raw=await new Promise(r=>$('#cv').toBlob(r,'image/png'));
 try{const j=JSON.stringify(getD()).replace(/[\u0080-\uffff]/g,k=>'\\u'+k.charCodeAt(0).toString(16).padStart(4,'0'));
  const u=addText(new Uint8Array(await raw.arrayBuffer()),'frdesign',j);return new Blob([u],{type:'image/png'})}catch(e){return raw}};
$('#dl').onclick=async()=>{const b=await blob();const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=(($('#nm').value||'badge').trim().replace(/[^\w-]+/g,'-')||'badge')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)};
/* robot check, only when a Turnstile key is set in config.js */
let tsTok='';
if(window.FR_TURNSTILE){const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.async=true;s.onload=()=>{window.turnstile.render('#ts',{sitekey:window.FR_TURNSTILE,action:'badge',callback:t=>{tsTok=t;const r=$('#res');if(r&&r.textContent.startsWith('Robot check'))r.hidden=true},'expired-callback':()=>tsTok='','error-callback':code=>{tsTok='';const r=$('#res');r.hidden=false;r.className='pr bad';r.textContent='Robot check problem (code '+code+'). Check that farizmohd70.github.io is listed as a hostname in the Turnstile widget, turn off any blocker for this page, then reload.';return true}})};document.head.appendChild(s)}
const b64=async b=>{const u=new Uint8Array(await b.arrayBuffer());let s='';for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode(...u.subarray(i,i+8192));return btoa(s)};
$('#sub').onclick=async()=>{
 const res=$('#res');res.hidden=false;
 const name=$('#nm').value.trim(),pat=$('#pat').value.trim();
 if(!name){res.className='pr bad';res.textContent='Give the badge a name.';return}
 if(!check()){res.className='pr bad';res.textContent='Fix the pattern first.';return}
 if(window.FR_TURNSTILE&&!tsTok){res.className='pr bad';res.textContent='Please complete the robot check first.';return}
 if(/YOUR-/.test(window.FR_WORKER||'')){res.className='pr bad';res.textContent='Sharing is not set up yet.';return}
 $('#sub').disabled=true;res.className='pr no';res.textContent='Sharing...';
 try{
  const b=await blob();if(b.size>90000)throw new Error('The image is too big. Use a smaller size or fewer effects.');
  const key=[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join(''),kh=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key)))].map(x=>x.toString(16).padStart(2,'0')).join('');
  const r=await fetch(window.FR_WORKER.replace(/\/$/,'')+'/submit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({n:name,p:pat,g:$('#gp').value,png:await b64(b),ts:tsTok,kh,u:await window.frUid()})});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Could not share the badge.');
  if(!j.existed)try{const o=JSON.parse(localStorage.getItem('fr_owned')||'{}');o[j.id]=key;localStorage.setItem('fr_owned',JSON.stringify(o))}catch(e){}
  res.className='pr ok';res.innerHTML='Shared. It can take a few minutes to show on the Community made page. You can edit or delete it there later, from this browser. <button class="b2 sm" id="addm">Add to my pack</button> <a class="b2 sm" href="community" style="text-decoration:none">See community</a>';
  $('#addm').onclick=()=>{try{const l=JSON.parse(localStorage.getItem('fr_com_pick')||'[]');if(!l.some(x=>x.id===j.id))l.push({id:j.id,n:j.n,p:j.p,g:j.g});localStorage.setItem('fr_com_pick',JSON.stringify(l));toast('Added. Open Make a pack to see it.')}catch(e){toast('Could not save in this browser')}};
 }catch(e){res.className='pr bad';res.textContent=e.message||'Could not share the badge.'}
 $('#sub').disabled=false;
};
if(window.FR_TURNSTILE===undefined)0;


/* icon list, image upload, contrast, swatches */
$('#ic').innerHTML='<option value="">None</option>'+Object.keys(ICN).map(k=>`<option value="${k}">${ICN[k]}</option>`).join('');
function clearImg(){IMG=null;$('#img').value='';$('#imgx').hidden=true;render()}
$('#img').onchange=()=>{const f=$('#img').files[0];if(!f)return;
 if(f.size>3e6){toast('That image is too big. Use one under 3 MB.');$('#img').value='';return}
 const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{IMG=im;$('#imgx').hidden=false;render();URL.revokeObjectURL(u)};im.onerror=()=>{toast('Could not read that image.');$('#img').value='';URL.revokeObjectURL(u)};im.src=u};
$('#imgx').onclick=clearImg;
const lum=h=>{const n=parseInt(h.slice(1),16),f=x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)};return .2126*f(n>>16&255)+.7152*f(n>>8&255)+.0722*f(n&255)};
const cr=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
function contrast(o){const w=$('#cw');if(!w)return;let t='';
 if(!o.tr&&o.bgo>=60&&(o.txt.trim()||o.t2)){const bgs=o.gd==='none'?[o.bg1]:[o.bg1,o.bg2],worst=Math.min(...bgs.map(b=>cr(o.fg,b)));if(worst<3)t='Low contrast ('+worst.toFixed(1)+' to 1). The text may be hard to read.'}
 w.textContent=t;w.hidden=!t}
{const cs=[];(window.CAT?window.CAT.groups:[]).forEach(g=>{[g.color,g.border].forEach(x=>{if(x&&!cs.includes(x.toLowerCase()))cs.push(x.toLowerCase())})});['#ffffff','#000000'].forEach(x=>{if(!cs.includes(x))cs.push(x)});
 $('#sw').innerHTML=cs.map(x=>`<button type="button" class="swb" data-c="${x}" style="background:${x}" aria-label="${x}"></button>`).join('');
 $('#sw').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;set($('#swt').value,b.dataset.c);render();sched()};
 if(window.EyeDropper){$('#eyed').hidden=false;$('#eyed').onclick=()=>{new EyeDropper().open().then(r=>{set($('#swt').value,r.sRGBHex);render();sched()}).catch(()=>{})}}}

/* share tab: preview in the pack, real size, duplicate warning */
const PACK_RAW='https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/Badges/';
let comIdx=null;
const comList=()=>comIdx||(comIdx=fetch(window.FR_COMMUNITY+'index.json').then(r=>r.json()).then(j=>j.badges||[]).catch(()=>[]));
const norm=s=>String(s).toLowerCase().replace(/\(\?i\)/g,'').replace(/\\b/g,'').replace(/[^a-z0-9]+/g,'');
function refreshShare(){
 const g=v('gp'),url=$('#cv').toDataURL('image/png'),w=$('#cv').width,h=$('#cv').height,near=(window.CAT?window.CAT.badges:[]).filter(b=>b.g===g).slice(0,5);
 const row=hpx=>`<div class="pkr">${near.map(b=>`<img src="${PACK_RAW}${b.f}" alt="" style="height:${hpx}px" onerror="this.remove()">`).join('')}<img src="${url}" alt="Your badge" style="height:${hpx}px;outline:1px dashed rgba(255,255,255,.55);outline-offset:2px"></div>`;
 $('#pk').innerHTML='<div class="pkl">Real size (16dp tall)</div>'+row(16)+'<div class="pkl">Zoomed</div>'+row(32);
 const dp=Math.round(16*w/h);
 $('#pkn').textContent=`Your badge is ${dp}dp wide at 16dp tall. Nuvio shows up to about 92dp. The dashed outline marks your badge.`+(dp>86?' It is close to the limit, so shorten the text if it looks cut off.':'');
 dupCheck()}
let dT=0;
function dupCheck(){clearTimeout(dT);dT=setTimeout(async()=>{
 const n=norm(v('nm')),p=norm(v('pat'));if(!n&&!p){$('#dup').hidden=true;return}
 const f=[];f.push=function(x){if(!this.includes(x))Array.prototype.push.call(this,x)};(window.CAT?window.CAT.badges:[]).forEach(b=>{if(f.length>=3)return;
  if(p&&norm(b.p)===p)f.push(`The pack already has <b>${esc(b.n)}</b> with the same pattern.`);
  else if(n&&norm(b.n)===n)f.push(`The pack already has a badge called <b>${esc(b.n)}</b>.`)});
 (await comList()).forEach(b=>{if(f.length>=3)return;
  if(p&&norm(b.p)===p)f.push(`Someone already shared <b>${esc(b.n)}</b> with the same pattern. <a href="create?remix=${b.id}">Remix it</a> instead?`);
  else if(n&&norm(b.n)===n)f.push(`Someone already shared a badge called <b>${esc(b.n)}</b>.`)});
 const d=$('#dup');d.hidden=!f.length;d.innerHTML=f.length?'<b>Heads up.</b> '+f.join(' ')+' You can still share yours.':''},300)}
['nm','pat'].forEach(i=>$('#'+i).addEventListener('input',()=>{if($('.cr-p.on').dataset.p==='share')dupCheck()}));
$('#gp').addEventListener('change',()=>{if($('.cr-p.on').dataset.p==='share')refreshShare()});

/* design code: copy or load a whole design */
const enc=s=>{const u=new TextEncoder().encode(s);let t='';u.forEach(x=>t+=String.fromCharCode(x));return btoa(t)};
const dec=s=>{const t=atob(s),u=new Uint8Array(t.length);for(let i=0;i<t.length;i++)u[i]=t.charCodeAt(i);return new TextDecoder().decode(u)};
$('#dcc').onclick=()=>{const o=getAll();delete o.tt;const code='frb1:'+enc(JSON.stringify(o));$('#dc').value=code;
 (navigator.clipboard?navigator.clipboard.writeText(code):Promise.reject()).then(()=>toast('Design code copied')).catch(()=>{$('#dc').select();toast('Select the code and copy it')})};
$('#dcl').onclick=()=>{try{const t=$('#dc').value.trim();if(!t.startsWith('frb1:'))throw 0;const o=JSON.parse(dec(t.slice(5)));if(!o||typeof o!=='object')throw 0;
 const safe={};[...DIDS,'pat','nm','gp','nt'].forEach(k=>{if(o[k]!==undefined&&typeof o[k]!=='object')safe[k]=o[k]});
 if(!$('#gp').querySelector('option[value="'+String(safe.gp).replace(/"/g,'')+'"]'))delete safe.gp;
 clearImg();setAll(safe);pushH();toast('Design loaded.')}catch(e){toast('That is not a valid design code.')}};
/* easy pattern builder */
const rxEsc=s=>s.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&');
function buildPat(){const ws=v('pw').split(/[,\n]/).map(s=>s.trim()).filter(Boolean);if(!ws.length)return;
 const parts=ws.map(w=>{let e=w.split(/\s+/).map(rxEsc).join(v('pws')?'[ ._-]?':'\\s');if(v('pwb')){if(/^\w/.test(w))e='\\b'+e;if(/\w$/.test(w))e+='\\b'}return e});
 $('#pat').value=(v('pwi')?'(?i)':'')+(parts.length>1?'(?:'+parts.join('|')+')':parts[0]);check();sched()}
['pw','pwb','pwi','pws'].forEach(id=>{$('#'+id).addEventListener('input',buildPat);$('#'+id).addEventListener('change',buildPat)});
/* undo, redo, surprise */
const hist=[],fut=[];let cur=null,hT=0;
const snap=()=>JSON.stringify(getAll());
function btns(){$('#undo').disabled=!hist.length;$('#redo').disabled=!fut.length}
function pushH(){clearTimeout(hT);const s=snap();if(s===cur)return;if(cur!==null){hist.push(cur);if(hist.length>60)hist.shift()}cur=s;fut.length=0;btns();try{localStorage.setItem('fr_cur',s)}catch(e){}}
function sched(){clearTimeout(hT);hT=setTimeout(pushH,450)}
document.querySelector('main').addEventListener('input',sched,true);document.querySelector('main').addEventListener('change',sched,true);
$('#undo').onclick=()=>{pushH();if(!hist.length)return;fut.push(cur);cur=hist.pop();setAll(JSON.parse(cur));btns();try{localStorage.setItem('fr_cur',cur)}catch(e){}};
$('#redo').onclick=()=>{pushH();if(!fut.length)return;hist.push(cur);cur=fut.pop();setAll(JSON.parse(cur));btns();try{localStorage.setItem('fr_cur',cur)}catch(e){}};
const hex=(h,s,l)=>{s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return '#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('')};
const pk=a=>a[Math.floor(Math.random()*a.length)];
$('#rnd').onclick=()=>{const h=Math.random()*360,h2=(h+40+Math.random()*100)%360,l1=32+Math.random()*26,l2=16+Math.random()*30,s=65+Math.random()*30,light=l1>52;
 const o={tr:0,bgo:100,tow:0,bg1:hex(h,s,l1),bg2:hex(h2,s,l2),gd:pk(['none','h','v','d','h','v']),fg:light?'#14161b':'#ffffff',bw:pk([0,0,4,6,8]),bc:pk(['#ffffff',light?'#14161b':'#ffffff',hex(h,s,75)]),gl:pk([0,1]),sh:light?0:1,rd:pk([24,60,90,90,120])};
 setD(o);render();pushH()};
/* saved badges (this browser only) */
const DK='fr_drafts',drafts=()=>{try{return JSON.parse(localStorage.getItem(DK)||'[]')}catch(e){return[]}};
const putD=l=>{try{localStorage.setItem(DK,JSON.stringify(l.slice(0,30)));return true}catch(e){toast('Could not save in this browser');return false}};
function thumb(){const c=document.createElement('canvas'),k=56/H;c.height=56;c.width=Math.max(1,Math.round($('#cv').width*k));c.getContext('2d').drawImage($('#cv'),0,0,c.width,c.height);return c.toDataURL('image/png')}
function mine(){const l=drafts();$('#minebox').hidden=!l.length;
 $('#mine').innerHTML=l.map(d=>`<div class="mc"><div class="mi"><img src="${d.t}" alt=""></div><div class="mn2">${esc(d.n)}</div><div class="bar"><button class="b2 sm pri" data-o="${d.id}">Open</button><button class="b2 sm" data-x="${d.id}">Delete</button></div></div>`).join('');
 $('#mine').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const d=drafts().find(x=>x.id===b.dataset.o);if(d){clearImg();setAll(d.s);pushH();toast('Opened. Keep editing.')}});
 $('#mine').querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{putD(drafts().filter(x=>x.id!==b.dataset.x));mine()})}
$('#savem').onclick=()=>{const s=getAll(),l=drafts();l.unshift({id:Date.now().toString(36),n:(v('nm').trim()||v('txt')||'Badge').slice(0,40),t:thumb(),s});if(putD(l)){mine();toast('Saved to My saved badges (Looks tab).')}};
mine();
/* keep the last design when the page is closed */
try{const s=localStorage.getItem('fr_cur');if(s)setAll(JSON.parse(s))}catch(e){}
/* remix a community badge: ?remix=<id> */
(async()=>{const id=new URLSearchParams(location.search).get('remix');if(!/^[0-9a-f]{12}$/.test(id||''))return;
 try{const B=window.FR_COMMUNITY,idx=await (await fetch(B+'index.json')).json(),b=(idx.badges||[]).find(x=>x.id===id);if(!b)throw 0;
  const png=new Uint8Array(await (await fetch(B+'badges/'+id+'.png')).arrayBuffer());let d=null;try{d=JSON.parse(readText(png,'frdesign')||'null')}catch(e){}
  clearImg();if(d)setD({...NEWD,...d});else set('txt',b.n.slice(0,24));
  set('pat',b.p);set('nm',(b.n+' (remix)').slice(0,40));$('#nm').dataset.t=1;if([...$('#gp').options].some(o=>o.value===b.g))set('gp',b.g);
  render();pushH();toast(d?'Loaded. Change anything you like.':'Loaded the pattern and name. The look was not saved with this badge.')}catch(e){toast('Could not load that badge.')}})();
render().then(()=>{cur=snap();btns()});
})();