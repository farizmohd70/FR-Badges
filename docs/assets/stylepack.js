/* FR Badges: style pack maker. One look, applied to every picked badge. */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const {FONTS,DEF,PRE}=FRD,CAT=window.CAT,LB=window.LBL,byId=P.byId;
const esc=s=>String(s).replace(/[&<>"]/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[k]));
const toast=m=>P.toast(m);
const v=id=>{const e=$('#'+id);return e.type==='checkbox'?e.checked:e.value};
const set=(id,x)=>{const e=$('#'+id);if(e.type==='checkbox')e.checked=!!x;else e.value=x};
const LOOK=['font','wt','sz','ls','fg','cs','ics','sl','s2','tow','toc','sh','shs','gw','gc','tr','bg1','bg2','gd','bgo','gl','bc','bw','bgr','bc2','rd','px'];

/* ---------- labels ---------- */
function label(id){const g=LB.b;
 if(g[id]){const [eb,main,sub,ic]=g[id];return{eb,main,sub,ic}}
 if(id.endsWith('-1l')&&g[id.slice(0,-3)]){const b=g[id.slice(0,-3)];return{eb:'',main:(b[0]?b[0]+' ':'')+b[1],sub:b[2],ic:b[3]}}
 if(id.endsWith('-code')&&g[id.slice(0,-5)])return{eb:'',main:g[id.slice(0,-5)][1],sub:'',ic:-1};
 if(id.endsWith('-name')&&g[id.slice(0,-5)]){const b=g[id.slice(0,-5)];return{eb:'',main:(b[2]||b[1]).toUpperCase(),sub:'',ic:-1}}
 return{eb:'',main:byId[id].n.toUpperCase(),sub:'',ic:-1}}
const iconCache=new Map();
function iconImg(ic,fg,bg){const k=ic+'|'+fg+'|'+bg;if(iconCache.has(k))return iconCache.get(k);
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="240" height="240">'+LB.icons[ic].replace(/#fff(fff)?\b/gi,fg).replace(/#000(000)?\b/g,bg)+'</svg>';
 const p=new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)});
 iconCache.set(k,p);return p}

/* ---------- drawing ---------- */
const look=()=>{const o={};LOOK.forEach(k=>o[k]=v(k));['sz','ls','s2','tow','shs','gw','bgo','bw','rd','px'].forEach(k=>o[k]=+o[k]);o.sl=!!o.sl;o.ics=o.ics==='1';return o};
async function drawBadge(cv,id,L){
 const lb=label(id),txt=((lb.eb?lb.eb+' ':'')+lb.main)||' ';
 const o={...L,txt,sym:'',t2:L.sl&&lb.sub?lb.sub:'',ic:'',imz:56};
 try{await Promise.all([document.fonts.load(`${o.wt} 40px "${o.font}"`,txt),document.fonts.load(`400 40px "${o.font}"`,'A')])}catch(e){}
 const ii=L.ics&&lb.ic>=0?await iconImg(lb.ic,L.fg,L.bg1):null;
 return FRD.draw(cv,o,null,ii)}
const SAMPLE=['hero-remux','res-1080p','hero-dolby-atmos','dr-hdr10','video-hevc','lang-en','flag-dubbed','audio-ddp'].filter(i=>byId[i]);
let pT=0,busy=0;
function preview(){clearTimeout(pT);pT=setTimeout(async()=>{const my=++busy,L=look(),box=$('#pvs');
 if(!box.children.length)box.innerHTML=SAMPLE.map(()=>'<canvas></canvas>').join('');
 const cvs=[...box.children];
 for(let i=0;i<SAMPLE.length;i++){if(my!==busy)return;await drawBadge(cvs[i],SAMPLE[i],L)}
 $('#meta').textContent='Sample badges. Your look is used for every badge in the pack.'},60)}

/* ---------- tabs, controls ---------- */
function tab(t){$$('.cr-tabs [data-t]').forEach(b=>{const on=b.dataset.t===t;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});$$('.cr-p').forEach(p=>p.classList.toggle('on',p.dataset.p===t));
 const bar=$('.cr-tabs'),a=bar.querySelector('.on');if(a)bar.scrollLeft=a.offsetLeft-12;if(t==='make')refreshMake()}
$$('.cr-tabs [data-t]').forEach(b=>b.onclick=()=>tab(b.dataset.t));
$$('[data-go]').forEach(b=>b.onclick=()=>{tab(b.dataset.go);const y=$('.cr-tabs').getBoundingClientRect().top+scrollY-$('#pvbox').offsetHeight-12;scrollTo({top:Math.max(0,y),behavior:'smooth'})});
$('#font').innerHTML=FONTS.map(f=>`<option value="${f}" style="font-family:'${f}'">${f}</option>`).join('');
const pf=p=>({...DEF,...p});
$('#pre').innerHTML=PRE.map((p,i)=>{const q=pf(p),bgc=q.tr?'transparent':(q.gd==='none'?q.bg1:`linear-gradient(${q.gd==='h'?'90deg':'180deg'},${q.bg1},${q.bg2})`);return `<button class="b2" data-p="${i}" style="background:${bgc};color:${q.fg};border:${q.bw?'2px solid '+q.bc:'1px solid var(--line)'}">${esc(p.n)}</button>`}).join('');
$('#pre').onclick=e=>{const b=e.target.closest('[data-p]');if(!b)return;const q=pf(PRE[+b.dataset.p]);Object.keys(DEF).forEach(k=>{if(LOOK.includes(k))set(k,q[k])});update();save()};
$('#pxr').onclick=()=>{set('px',72);update();save()};
const vals=()=>{const m={sz:'szv',ls:'lsv',bw:'bwv',rd:'rdv',px:'pxv',bgo:'bgov',tow:'towv',s2:'s2v',shs:'shsv',gw:'gwv'};Object.keys(m).forEach(k=>{$('#'+m[k]).textContent=v(k)+(k==='bgo'||k==='s2'?'%':'')})};
function update(){vals();preview();genKey=''}
LOOK.forEach(k=>{const e=$('#'+k);e.addEventListener('input',()=>{update();save()});e.addEventListener('change',()=>{update();save()})});

/* ---------- saved look and picks (this browser) ---------- */
function save(){try{const o={};LOOK.forEach(k=>o[k]=v(k));localStorage.setItem('fr_sp',JSON.stringify({look:o,sel:[...P.S.sel],name:v('pn')}))}catch(e){}}
function restore(){try{const s=JSON.parse(localStorage.getItem('fr_sp')||'null');if(!s)return false;LOOK.forEach(k=>{if(s.look&&s.look[k]!==undefined)set(k,s.look[k])});
 if(Array.isArray(s.sel)){const ok=s.sel.filter(i=>byId[i]);if(ok.length)P.commit(()=>{P.S.sel=new Set(ok)},'all')}if(s.name)set('pn',s.name);return true}catch(e){return false}}

/* ---------- badge picking ---------- */
const GROUPS=CAT.groups;
$('#spre').innerHTML=Object.keys(P.PRESETS).map(k=>`<button class="b2 sm" data-k="${k}" title="${esc(P.PRESETS[k].desc)}">${esc(P.PRESETS[k].name)}</button>`).join('');
$('#spre').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;P.preset(b.dataset.k);save()};
$('#grp').innerHTML=GROUPS.map(g=>{const ids=CAT.badges.filter(b=>b.g===g.id);return `<details class="sg" data-g="${g.id}"><summary><b>${esc(g.name)}</b> <span class="sc"></span></summary><div class="bar sgb"><button class="b2 sm" data-a="all">Pick all</button><button class="b2 sm" data-a="none">Pick none</button></div><div class="sl">${ids.map(b=>`<label class="sr" data-n="${esc((b.n+' '+b.id).toLowerCase())}"><input type="checkbox" data-id="${b.id}"> <span>${esc(b.n)}</span></label>`).join('')}</div></details>`}).join('');
function refreshSel(){const tot=P.S.sel.size;$('#cnt').innerHTML=`<b>${tot}</b> badges picked`;
 $$('#grp input[data-id]').forEach(i=>i.checked=P.S.sel.has(i.dataset.id));
 $$('#grp .sg').forEach(d=>{const ids=[...d.querySelectorAll('input')].map(i=>i.dataset.id),n=ids.filter(i=>P.S.sel.has(i)).length;d.querySelector('.sc').textContent=n+' of '+ids.length})}
$('#grp').addEventListener('change',e=>{const i=e.target.closest('input[data-id]');if(!i)return;P.toggle(i.dataset.id);save()});
$('#grp').addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;e.preventDefault();const g=b.closest('.sg').dataset.g,ids=CAT.badges.filter(x=>x.g===g).map(x=>x.id);P.setMany(ids,b.dataset.a==='all');save()});
$('#sq').oninput=()=>{const q=$('#sq').value.trim().toLowerCase();$$('#grp .sg').forEach(d=>{let any=0;d.querySelectorAll('.sr').forEach(r=>{const m=!q||r.dataset.n.includes(q);r.hidden=!m;if(m)any++});d.hidden=!any;if(q&&any)d.open=true})};
P.on(()=>{refreshSel();genKey=''});

/* ---------- making the files ---------- */
let genKey='',gen=null,running=false;
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc32=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRC[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
/* ---------- smaller PNG files: 256 colours with transparency (same idea as the built-in styles) ---------- */
const QB=524288,QC=new Uint32Array(QB),QR=new Float32Array(QB),QG=new Float32Array(QB),QBL=new Float32Array(QB),QA=new Float32Array(QB);
const chunk=(ty,data)=>{const o=new Uint8Array(12+data.length),dv=new DataView(o.buffer);dv.setUint32(0,data.length);for(let i=0;i<4;i++)o[4+i]=ty.charCodeAt(i);o.set(data,8);dv.setUint32(8+data.length,crc32(o.subarray(4,8+data.length)));return o};
async function quantPng(cv){
 if(typeof CompressionStream==='undefined')return null;
 const w=cv.width,h=cv.height,px=cv.getContext('2d').getImageData(0,0,w,h).data,n=w*h,keys=new Int32Array(n),touched=[];
 for(let i=0;i<n;i++){const r=px[i*4],g=px[i*4+1],b=px[i*4+2],a=px[i*4+3],k=((r>>3)<<14)|((g>>3)<<9)|((b>>3)<<4)|(a>>4);keys[i]=k;if(!QC[k]){touched.push(k)}QC[k]++;QR[k]+=r;QG[k]+=g;QBL[k]+=b;QA[k]+=a}
 const ch=(k,c)=>c===0?(k>>14)&31:c===1?(k>>9)&31:c===2?(k>>4)&31:((k&15)<<1);
 let boxes=[{k:touched,n:n}];
 while(boxes.length<256){let bi=-1,bn=0;for(let i=0;i<boxes.length;i++)if(boxes[i].k.length>1&&boxes[i].n>bn){bn=boxes[i].n;bi=i}if(bi<0)break;
  const bx=boxes[bi],ks=bx.k;let best=0,bv=-1;
  for(let c=0;c<4;c++){let lo=99,hi=-1;for(let i=0;i<ks.length;i++){const x=ch(ks[i],c);if(x<lo)lo=x;if(x>hi)hi=x}const r=(hi-lo)*(c===3?1.4:1);if(r>bv){bv=r;best=c}}
  ks.sort((a,b)=>ch(a,best)-ch(b,best));let acc=0,cut=0;for(;cut<ks.length-1;cut++){acc+=QC[ks[cut]];if(acc*2>=bx.n)break}
  const A=ks.slice(0,cut+1),B=ks.slice(cut+1);if(!B.length){bx.k=A;bx.n=bx.n;boxes[bi]=bx;break}
  let an=0;A.forEach(k=>an+=QC[k]);boxes.splice(bi,1,{k:A,n:an},{k:B,n:bx.n-an})}
 const map=new Map(),pal=new Uint8Array(boxes.length*3),tr=new Uint8Array(boxes.length);
 boxes.forEach((bx,i)=>{let c=0,r=0,g=0,b=0,a=0;bx.k.forEach(k=>{map.set(k,i);c+=QC[k];r+=QR[k];g+=QG[k];b+=QBL[k];a+=QA[k]});pal[i*3]=Math.round(r/c);pal[i*3+1]=Math.round(g/c);pal[i*3+2]=Math.round(b/c);const al=Math.round(a/c);tr[i]=al<6?0:al>249?255:al});
 touched.forEach(k=>{QC[k]=0;QR[k]=0;QG[k]=0;QBL[k]=0;QA[k]=0});
 /* map each pixel to the palette, spreading the rounding error to neighbours (Floyd-Steinberg) so smooth gradients do not turn into blocks */
 const np=boxes.length,near=(r,g,b,a)=>{let bi=0,bd=1e9;for(let i=0;i<np;i++){const dr=pal[i*3]-r,dg=pal[i*3+1]-g,db=pal[i*3+2]-b,da=tr[i]-a,d=dr*dr+dg*dg+db*db+da*da*1.5;if(d<bd){bd=d;bi=i}}return bi};
 const raw=new Uint8Array(h*(w+1));let e0=new Float32Array((w+2)*3),e1=new Float32Array((w+2)*3);
 for(let y=0;y<h;y++){const o=y*(w+1);raw[o]=0;e1.fill(0);
  for(let x=0;x<w;x++){const p=(y*w+x)*4,a=px[p+3];
   const ex=e0[(x+1)*3],eg=e0[(x+1)*3+1],eb=e0[(x+1)*3+2];
   let r=px[p]+ex,g=px[p+1]+eg,b=px[p+2]+eb;r=r<0?0:r>255?255:r;g=g<0?0:g>255?255:g;b=b<0?0:b>255?255:b;
   const k=((r&248)<<11)|((g&248)<<6)|((b&248)<<1)|(a>>4);let i=map.get(k);if(i===undefined){i=near(r,g,b,a);map.set(k,i)}
   raw[o+1+x]=i;
   if(a>8){const dr=(r-pal[i*3])*.5,dg=(g-pal[i*3+1])*.5,db=(b-pal[i*3+2])*.5;
    e0[(x+2)*3]+=dr*7/16;e0[(x+2)*3+1]+=dg*7/16;e0[(x+2)*3+2]+=db*7/16;
    e1[x*3]+=dr*3/16;e1[x*3+1]+=dg*3/16;e1[x*3+2]+=db*3/16;
    e1[(x+1)*3]+=dr*5/16;e1[(x+1)*3+1]+=dg*5/16;e1[(x+1)*3+2]+=db*5/16;
    e1[(x+2)*3]+=dr/16;e1[(x+2)*3+1]+=dg/16;e1[(x+2)*3+2]+=db/16}}
  const t=e0;e0=e1;e1=t}
 const cs=new CompressionStream('deflate'),wr=cs.writable.getWriter();wr.write(raw);wr.close();
 const z=new Uint8Array(await new Response(cs.readable).arrayBuffer());
 const ih=new Uint8Array(13),idv=new DataView(ih.buffer);idv.setUint32(0,w);idv.setUint32(4,h);ih[8]=8;ih[9]=3;
 const parts=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',pal),chunk('tRNS',tr),chunk('IDAT',z),chunk('IEND',new Uint8Array(0))];
 const out=new Uint8Array(parts.reduce((s,p)=>s+p.length,0));let o=0;parts.forEach(p=>{out.set(p,o);o+=p.length});return out}

const slug=s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'style-pack';
const imgH=()=>+v('isz');
function refreshMake(){const n=P.S.sel.size,kb=v("fq")?(imgH()===160?30:60):(imgH()===160?8:14);
 $('#est').textContent=n?`${n} badges, about ${(n*kb/1000).toFixed(1)} MB.`:'Pick some badges first on the Badges tab.';
 if(!$('#gf').dataset.t)set('gf',slug(v('pn')))}
$('#pn').addEventListener('input',()=>{if(!$('#gf').dataset.t)set('gf',slug(v('pn')));save()});$('#gf').addEventListener('input',()=>$('#gf').dataset.t=1);$('#isz').addEventListener('change',()=>{genKey='';refreshMake()});$('#fq').addEventListener('change',()=>{genKey='';refreshMake()});
const prog=(i,n,msg)=>{$('#prg').hidden=false;$('#prgb').style.width=(n?i/n*100:0)+'%';$('#prgt').textContent=msg||''};
const toBlob=cv=>new Promise(r=>cv.toBlob(r,'image/png'));
async function generate(){
 const ids=P.ordered().filter(b=>!b._com),L=look(),key=JSON.stringify([L,ids.map(b=>b.id),imgH(),v('fq')]);
 if(gen&&key===genKey)return gen;
 const cv=document.createElement('canvas'),out=document.createElement('canvas'),files=[];
 for(let i=0;i<ids.length;i++){
  prog(i,ids.length,`Drawing ${i+1} of ${ids.length}`);
  const b=ids[i];await drawBadge(cv,b.id,L);
  let src=cv;const h=imgH();
  if(h<240){out.height=h;out.width=Math.max(1,Math.round(cv.width*h/240));const c=out.getContext('2d');c.imageSmoothingQuality='high';c.clearRect(0,0,out.width,out.height);c.drawImage(cv,0,0,out.width,out.height);src=out}
  let data=null;if(!v('fq')){try{data=await quantPng(src)}catch(e){data=null}}
  if(!data){const bl=await toBlob(src);data=new Uint8Array(await bl.arrayBuffer());if(data.length>85000){try{data=(await quantPng(src))||data}catch(e){}}}
  files.push({id:b.id,f:b.f,data});
 }
 prog(ids.length,ids.length,'All images are ready.');
 genKey=key;gen={files,ids:ids.map(b=>b.id)};return gen}

function zipBlob(files){const enc=new TextEncoder(),parts=[],cd=[];let off=0,cds=0;
 files.forEach(f=>{const nm=enc.encode(f.name),crc=crc32(f.data),sz=f.data.length;
  const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(12,0x21,true);h.setUint32(14,crc,true);h.setUint32(18,sz,true);h.setUint32(22,sz,true);h.setUint16(26,nm.length,true);
  parts.push(h.buffer,nm,f.data);
  const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(14,0x21,true);c.setUint32(16,crc,true);c.setUint32(20,sz,true);c.setUint32(24,sz,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);
  cd.push(c.buffer,nm);cds+=46+nm.length;off+=30+nm.length+sz});
 const e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cds,true);e.setUint32(16,off,true);
 return new Blob([...parts,...cd,e.buffer],{type:'application/zip'})}
function manifestFor(base){const m=P.manifest();m.filters.forEach(f=>{if(byId[f.id]&&byId[f.id].f)f.imageURL=base+byId[f.id].f});return m}
const guard=()=>{if(!P.S.sel.size){toast('Pick some badges first.');tab('pick');return false}if(running){toast('Still working. Wait a moment.');return false}return true};

$('#zip').onclick=async()=>{if(!guard())return;
 const gu=v('gu').trim().replace(/[^\w-]/g,''),gr=v('gr').trim().replace(/[^\w.-]/g,'')||'FR-Styles',gf=slug(v('gf')),zr=$('#zr');
 if(!gu){zr.hidden=false;zr.className='pr bad';zr.textContent='Type your GitHub name so the pack file can point to your images.';return}
 running=true;$('#zip').disabled=true;zr.hidden=true;
 try{const g=await generate(),base=`https://raw.githubusercontent.com/${gu}/${gr}/main/${gf}/`;
  const files=g.files.map(f=>({name:gf+'/'+f.f,data:f.data}));
  files.push({name:gf+'/badges.json',data:new TextEncoder().encode(JSON.stringify(manifestFor(base),null,2))});
  const bl=zipBlob(files),a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=gf+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);
  const link=base+'badges.json';
  zr.hidden=false;zr.className='pr ok';zr.innerHTML=`ZIP ready (${(bl.size/1e6).toFixed(1)} MB). Unzip it and upload the <b>${esc(gf)}</b> folder to your repo <b>${esc(gu)}/${esc(gr)}</b> on the main branch. Then use this link in Nuvio: <code style="word-break:break-all">${esc(link)}</code> <button class="b2 sm" id="zc">Copy link</button>`;
  $('#zc').onclick=()=>P.copy(link,'Link copied');save()}
 catch(e){zr.hidden=false;zr.className='pr bad';zr.textContent='Something went wrong: '+(e.message||e)}
 running=false;$('#zip').disabled=false};

/* ---------- share with the community ---------- */
let tsTok='';
if(window.FR_TURNSTILE){const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.async=true;s.onload=()=>{window.turnstile.render('#ts',{sitekey:window.FR_TURNSTILE,action:'pack',callback:t=>{tsTok=t;const r=$('#res');if(r.textContent.startsWith('Robot check'))r.hidden=true},'expired-callback':()=>tsTok='','error-callback':code=>{tsTok='';const r=$('#res');r.hidden=false;r.className='pr bad';r.textContent='Robot check problem (code '+code+'). Check that farizmohd70.github.io is listed as a hostname in the Turnstile widget, turn off any blocker for this page, then reload.';return true}})};document.head.appendChild(s)}
const W=()=>(window.FR_WORKER||'').replace(/\/$/,'');
async function post(path,body){const r=await fetch(W()+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw new Error(j.error||'That did not work. Try again.');return j}
const b64=u=>{let s='';for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode(...u.subarray(i,i+8192));return btoa(s)};
const hexs=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('');
$('#pub').onclick=async()=>{const res=$('#res');res.hidden=false;
 if(!guard()){res.hidden=true;return}
 const name=v('pn').trim();
 if(!name){res.className='pr bad';res.textContent='Give the pack a name.';return}
 if(P.S.sel.size>800){res.className='pr bad';res.textContent='A shared pack can hold up to 800 badges.';return}
 if(/YOUR-/.test(W())||!W()){res.className='pr bad';res.textContent='Sharing is not set up yet.';return}
 if(window.FR_TURNSTILE&&!tsTok){res.className='pr bad';res.textContent='Robot check: please complete it first.';return}
 running=true;$('#pub').disabled=true;res.className='pr no';res.textContent='Getting ready.';
 try{const g=await generate();
  const key=[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join(''),kh=await hexs(key);
  const st=await post('/pack/start',{n:name,count:g.files.length,ts:tsTok,kh});
  const shas={};
  for(let i=0;i<g.files.length;i+=24){prog(i,g.files.length,`Uploading ${Math.min(i+24,g.files.length)} of ${g.files.length}`);
   const r=await post('/pack/blobs',{token:st.token,files:g.files.slice(i,i+24).map(f=>({f:f.f,png:b64(f.data)}))});r.shas.forEach(x=>shas[x.f]=x.sha)}
  prog(g.files.length,g.files.length,'Publishing the pack');
  const prev=g.files.slice(0,6).map(f=>f.f);
  const fin=await post('/pack/finish',{token:st.token,n:name,ids:g.ids,shas,prev,kh});
  try{const o=JSON.parse(localStorage.getItem('fr_owned')||'{}');o[st.id]=key;localStorage.setItem('fr_owned',JSON.stringify(o))}catch(e){}
  prog(1,1,'Done.');tsTok='';try{window.turnstile&&window.turnstile.reset()}catch(e){}
  res.className='pr ok';res.innerHTML=`Shared. Your pack is on the Community page as <b>${esc(name)}</b>. Pack link for Nuvio: <code style="word-break:break-all">${esc(fin.url)}</code> <button class="b2 sm" id="pc">Copy link</button> You can delete it later from the Community page in this browser.`;
  $('#pc').onclick=()=>P.copy(fin.url,'Link copied')}
 catch(e){res.className='pr bad';res.textContent=e.message||'Something went wrong.'}
 running=false;$('#pub').disabled=false};

/* ---------- start ---------- */
if(!restore())P.preset('essentials');
refreshSel();vals();preview();refreshMake();
})();
