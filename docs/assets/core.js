/* FR Pack Builder core: shared by all three demo UIs */
(function(){
const CAT=window.CAT;
const RAW='https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/';
const STYLES=window.STYLES_DATA;
const byId={},byGroup={},gInfo={};
CAT.groups.forEach(g=>{gInfo[g.id]=g;byGroup[g.id]=[]});
function flags(p){const m=/^\(\?([a-z]+)\)/.exec(p);let f='',b=p;if(m){b=p.slice(m[0].length);for(const c of m[1])if('ims'.includes(c)&&!f.includes(c))f+=c}return[b,f]}
let badRe=0;
CAT.badges.forEach((b,i)=>{b.i=i;byId[b.id]=b;byGroup[b.g].push(b);const[bd,f]=flags(b.p);b.re=null;
 try{b.re=new RegExp(bd,f)}catch(e){try{b.re=new RegExp(bd,f+'u')}catch(e2){badRe++}}
 b.hay=(b.id+' '+b.n).toLowerCase();});
const IND=['മലയാളം','தமிழ்','हिन्दी','తెలుగు','ಕನ್ನಡ','বাংলা','मराठी','ગુજરાતી','ਪੰਜਾਬੀ','اردو','नेपाली','অসমীয়া','ଓଡ଼ିଆ','සිංහල','English'];
const nodup=ids=>{if(ids.includes('res-4k'))ids=ids.filter(i=>i!=='hero-4k');const names=new Map();ids.forEach(i=>{const b=byId[i];if(b.g!=='hero')names.set(b.n.toLowerCase(),1)});return ids.filter(i=>{const b=byId[i];return b.g!=='hero'||!names.has(b.n.toLowerCase())})};
const PRESETS={
 lite:{name:'Lite',desc:'The 244 badges of the main FR pack',ids:()=>CAT.lite},
 essentials:{name:'Essentials',desc:'Resolution, HDR, codecs and the hero tags',ids:()=>nodup(CAT.lite.filter(id=>['hero','resolution','dynamic-range','video-codec','audio-codec','source'].includes(byId[id].g)))},
 indian:{name:'Indian languages',desc:'Essentials plus Indian languages and audio flags',ids:()=>CAT.lite.filter(id=>{const b=byId[id];return['hero','resolution','dynamic-range','audio-codec','video-codec'].includes(b.g)||(b.g==='languages'&&IND.includes(b.n))||(b.g==='audio-subs'&&/dual|multi|dubbed/i.test(b.id))})},
 audiophile:{name:'Audiophile',desc:'Audio codecs, channels, Atmos and lossless tags',ids:()=>CAT.badges.filter(b=>['audio-codec','audio-channels'].includes(b.g)||b.id==='hero-dolby-atmos'||b.id==='hero-remux').map(b=>b.id)},
 streaming:{name:'Streaming + debrid',desc:'Services, debrid providers and resolution',ids:()=>CAT.badges.filter(b=>['streaming','debrid','resolution'].includes(b.g)||b.g==='hero').map(b=>b.id)},
 fast:{name:'Light and fast',desc:'About 30 badges, quickest to load',ids:()=>['hero-cached','res-8k','res-4k','res-1080p','res-720p','res-480p','source-remux','source-uhd-bluray','source-bluray','source-webdl','source-webrip','source-hdtv','source-cam','dr-dolby-vision','dr-hdr10plus','dr-hdr10','dr-hdr','dr-10bit','codec-av1','codec-hevc','codec-avc','acodec-atmos','acodec-truehd','acodec-dtsx','acodec-dtshd-ma','acodec-ddplus','ch-7-1','ch-5-1'].filter(i=>byId[i])},
 langs:{name:'Essentials + languages',desc:'Essentials plus every language and subtitle badge',ids:()=>nodup(CAT.badges.filter(b=>['hero','resolution','dynamic-range','video-codec','audio-codec','source','audio-subs','languages','subtitles'].includes(b.g)).map(b=>b.id))},
 picture:{name:'Best picture',desc:'Resolution, HDR, Dolby Vision, codecs and sources',ids:()=>CAT.badges.filter(b=>['hero','resolution','dynamic-range','video-codec','video-format','source'].includes(b.g)).map(b=>b.id)},
 theater:{name:'Home theater',desc:'Picture and sound together, with speaker layouts',ids:()=>CAT.badges.filter(b=>['hero','resolution','dynamic-range','video-codec','source','audio-codec','audio-channels'].includes(b.g)).map(b=>b.id)},
 cinephile:{name:'Cinephile',desc:'Editions like IMAX and Criterion, plus quality tags',ids:()=>CAT.badges.filter(b=>['hero','editions','source','resolution','dynamic-range'].includes(b.g)).map(b=>b.id)},
 everything:{name:'Everything',desc:'All 361 badges in the catalog',ids:()=>CAT.badges.map(b=>b.id)},
 empty:{name:'Blank',desc:'Start from nothing',ids:()=>[]}
};
['indian','audiophile','streaming','picture','theater','cinephile'].forEach(k=>{const f=PRESETS[k].ids;PRESETS[k].ids=()=>nodup(f())});
const S={name:'My FR Pack',style:'glass',sel:new Set(),over:{},gord:CAT.groups.map(g=>g.id),bord:{},bg:'dark'};
CAT.groups.forEach(g=>S.bord[g.id]=byGroup[g.id].map(b=>b.id));
const SAMPLES=[
 'Night.Harbor.2024.2160p.UHD.BluRay.REMUX.DV.HDR10+.HEVC.TrueHD.Atmos.7.1-GRP',
 'Night Harbor 2024 1080p WEB-DL DDP5.1 Atmos H.264 Hindi English Tamil Multi Audio NF',
 'Night Harbor 2024 720p HDRip x264 AAC Hindi Tamil Telugu ESub',
 'The.Long.Quiet.S02E04.2160p.ATVP.WEB-DL.DDP5.1.DV.HEVC.English',
 'Night Harbor 2024 IMAX 1080p BluRay x265 10bit DTS-HD MA 7.1 Dual Audio Eng Hin',
 'Night Harbor 2024 1080p AMZN WEB-DL DD5.1 H264 English Subs'
];
const P={CAT,S,STYLES,PRESETS,byId,byGroup,gInfo,samples:SAMPLES.slice(),badRe,RAW};
let undo=[],redo=[],subs=[],busy=false;
const snap=()=>JSON.stringify({name:S.name,style:S.style,sel:[...S.sel],over:S.over,gord:S.gord,bord:S.bord});
const restore=s=>{const o=JSON.parse(s);S.name=o.name;S.style=o.style;S.sel=new Set(o.sel);S.over=o.over;S.gord=o.gord;S.bord=o.bord};
P.on=f=>subs.push(f);
function emit(why){subs.forEach(f=>{try{f(why)}catch(e){console.error(e)}});syncHash()}
P.commit=(fn,why)=>{const a=snap();fn();if(snap()!==a){undo.push(a);if(undo.length>100)undo.shift();redo=[]}emit(why||'sel')};
P.undo=()=>{if(!undo.length)return false;redo.push(snap());restore(undo.pop());emit('all');return true};
P.redo=()=>{if(!redo.length)return false;undo.push(snap());restore(redo.pop());emit('all');return true};
P.canUndo=()=>undo.length>0;P.canRedo=()=>redo.length>0;
P.toggle=id=>P.commit(()=>{S.sel.has(id)?S.sel.delete(id):S.sel.add(id)});
P.setMany=(ids,on)=>P.commit(()=>ids.forEach(i=>on?S.sel.add(i):S.sel.delete(i)));
P.invert=ids=>P.commit(()=>ids.forEach(i=>S.sel.has(i)?S.sel.delete(i):S.sel.add(i)));
P.preset=k=>{const ids=PRESETS[k].ids();P.commit(()=>{S.sel=new Set(ids)},'all');return ids.length};
P.setStyle=s=>P.commit(()=>{S.style=s},'style');
P.setOver=(id,s)=>P.commit(()=>{if(s&&s!==S.style)S.over[id]=s;else delete S.over[id]},'style');
P.clearOver=()=>P.commit(()=>{S.over={}},'style');
P.rename=n=>{S.name=n;emit('name')};
P.styleOf=id=>S.over[id]||S.style;
const cache={};
P.src=(id,style)=>P.rawUrl(id,style);
P.img=(id,cls,style)=>`<img class="${cls||''}" alt="${esc(byId[id].n)}" src="${P.src(id,style)}" draggable="false">`;
P.bgCol=sid=>((STYLES.find(s=>s.id===sid)||{}).bg==='light'?'#e9ebf0':'#0e0f12');P.bgOf=id=>P.bgCol(P.styleOf(id));
P.rawUrl=(id,style)=>RAW+STYLES.find(s=>s.id===(style||P.styleOf(id))).folder+'/'+byId[id].f;
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
P.esc=esc;
P.ordered=()=>{const o=[];S.gord.forEach(g=>S.bord[g].forEach(id=>{if(S.sel.has(id))o.push(byId[id])}));return o};
P.groupSel=g=>S.bord[g].filter(id=>S.sel.has(id));
P.activeGroups=()=>S.gord.filter(g=>P.groupSel(g).length);
P.moveBadge=(id,dir)=>P.commit(()=>{const g=byId[id].g,a=S.bord[g],sel=a.filter(x=>S.sel.has(x)),k=sel.indexOf(id),t=sel[k+dir];if(t==null)return;const i=a.indexOf(id),j=a.indexOf(t);a[i]=t;a[j]=id},'order');
P.moveGroup=(g,dir)=>P.commit(()=>{const a=S.gord,act=P.activeGroups(),k=act.indexOf(g),t=act[k+dir];if(t==null)return;const i=a.indexOf(g),j=a.indexOf(t);a[i]=t;a[j]=g},'order');
P.dropBadge=(id,beforeId)=>P.commit(()=>{if(id===beforeId||byId[id].g!==byId[beforeId].g)return;const a=S.bord[byId[id].g];a.splice(a.indexOf(id),1);a.splice(a.indexOf(beforeId),0,id)},'order');
P.dropGroup=(g,beforeG)=>P.commit(()=>{if(g===beforeG)return;const a=S.gord;a.splice(a.indexOf(g),1);a.splice(a.indexOf(beforeG),0,g)},'order');
P.resetOrder=()=>P.commit(()=>{S.gord=CAT.groups.map(g=>g.id);CAT.groups.forEach(g=>S.bord[g.id]=byGroup[g.id].map(b=>b.id))},'order');
P.manifest=()=>{const bs=P.ordered(),gs=P.activeGroups();
 return{filters:bs.map(b=>({id:b.id,groupId:b.g,name:b.n,pattern:b.p,imageURL:P.rawUrl(b.id),tagColor:'#00000000',borderColor:'#00000000',textColor:'#00000000',tagStyle:'filled and bordered',isEnabled:true,type:'filter'})),
 groups:gs.map(g=>({id:g,name:gInfo[g].name,color:gInfo[g].color,borderColor:gInfo[g].border||gInfo[g].color,isExpanded:true}))}};
P.manifestText=()=>JSON.stringify(P.manifest(),null,2);
P.bytes=()=>new Blob([JSON.stringify(P.manifest())]).size;
/* share code: pk-<style index>-<hex bitmask over catalog order> */
P.code=()=>{const n=CAT.badges.length,len=Math.ceil(n/4);let h='';for(let k=0;k<len;k++){let v=0;for(let j=0;j<4;j++){const i=k*4+j;if(i<n&&S.sel.has(CAT.badges[i].id))v|=1<<j}h+=v.toString(16)}return'pk-'+STYLES.findIndex(s=>s.id===S.style)+'-'+h};
P.loadCode=c=>{const m=/^#?pk-(\d+)-([0-9a-f]+)$/i.exec((c||'').trim());if(!m||!STYLES[+m[1]])return null;const ids=[];const h=m[2];for(let k=0;k<h.length;k++){const v=parseInt(h[k],16);for(let j=0;j<4;j++){const i=k*4+j;if(v>>j&1&&CAT.badges[i])ids.push(CAT.badges[i].id)}}
 P.commit(()=>{S.style=STYLES[+m[1]].id;S.sel=new Set(ids)},'all');return ids.length};
P.importText=t=>{t=(t||'').trim();if(!t)return{err:'Nothing to import'};const c=P.loadCode(t);if(c!=null)return{n:c,unknown:0,kind:'share code'};
 let ids=[],unk=0,style=null;
 try{const j=JSON.parse(t);const arr=j.filters||j.badges||(Array.isArray(j)?j:null);if(!arr)return{err:'No filters found in that JSON'};
  const fm={};STYLES.forEach(s=>fm[s.folder]=s.id);
  arr.forEach(f=>{const id=typeof f==='string'?f:f.id;let b=byId[id];if(!b&&f.imageURL){const fn=f.imageURL.split('/').pop();b=CAT.badges.find(x=>x.f===fn)}
   if(b){ids.push(b.id);if(f.imageURL&&!style){const m=/\/(Badges[^/]*)\//.exec(f.imageURL);if(m&&fm[m[1]])style=fm[m[1]]}}else unk++});
 }catch(e){t.split(/[\s,;]+/).filter(Boolean).forEach(x=>byId[x]?ids.push(x):unk++)}
 if(!ids.length)return{err:'No known badge ids found',unknown:unk};
 P.commit(()=>{S.sel=new Set(ids);if(style)S.style=style},'all');return{n:ids.length,unknown:unk,kind:'manifest'}};
/* matching */
P.match=(text,onlySel)=>{const out=[];const list=onlySel?P.ordered():CAT.badges;for(const b of list){if(b.re){try{if(b.re.test(text))out.push(b)}catch(e){}}}return out};
P.suggest=()=>{const c={};P.samples.forEach(t=>P.match(t,false).forEach(b=>{if(!S.sel.has(b.id))c[b.id]=(c[b.id]||0)+1}));return Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([id,n])=>({b:byId[id],n}))};
P.health=()=>{const sel=P.ordered(),issues=[];const t0=performance.now();let reps=3;for(let r=0;r<reps;r++)P.samples.forEach(t=>sel.forEach(b=>{if(b.re)b.re.test(t)}));
 const ms=(performance.now()-t0)/reps/Math.max(1,P.samples.length);const per=P.samples.map(t=>({t,n:P.match(t,true).length}));
 if(!sel.length)issues.push({lvl:'warn',msg:'No badges selected yet.'});
 if(sel.length>250)issues.push({lvl:'warn',msg:`${sel.length} patterns run on every stream. Packs above about 250 can feel slower on older phones.`});
 per.forEach(p=>{if(p.n>9)issues.push({lvl:'warn',msg:`A stream gets ${p.n} badges, which may look crowded: "${p.t.slice(0,38)}…"`})});
 const lang=P.groupSel('languages').length,subs=P.groupSel('subtitles').length,as=P.groupSel('audio-subs').length;
 if(lang&&!as)issues.push({lvl:'info',msg:'Languages are on, but Dual/Multi Audio flags are off. Multi-language releases will show several flags instead.'});
 if(subs&&!lang)issues.push({lvl:'info',msg:'Subtitle badges are on without audio-language badges.'});
 P.dupes().forEach(a=>issues.push({lvl:'warn',msg:(a[0].n.toLowerCase()===a[1].n.toLowerCase()?`${a[0].id} and ${a[1].id} are both named "${a[0].n}"`:`${a[0].n} (${a[0].id}) and ${a[1].n} (${a[1].id}) look the same`)+'. Streams show both. Use Remove duplicates.'}));
 if(!issues.length)issues.push({lvl:'ok',msg:'No problems found for the current sample streams.'});
 return{count:sel.length,ms,per,issues,bytes:P.bytes()}};
P.sel=id=>S.sel.has(id);
const nn=s=>s.toLowerCase().replace(/[^\p{L}\p{N}+]/gu,'');
P.dupes=()=>{const m={};P.ordered().forEach(b=>(m[nn(b.n)]=m[nn(b.n)]||[]).push(b));const r=Object.values(m).filter(a=>a.length>1);if(S.sel.has('hero-4k')&&S.sel.has('res-4k'))r.push([byId['hero-4k'],byId['res-4k']]);return r};
P.dedupe=()=>{const rm=[];P.dupes().forEach(a=>{const keep=a.find(b=>b.g!=='hero')||a[0];a.forEach(b=>{if(b!==keep)rm.push(b.id)})});P.setMany(rm,false);return rm.length};
P.setSamples=a=>{P.samples=a;emit('samples')};
P.resetSamples=()=>P.setSamples(SAMPLES.slice());
/* saved packs */
const LK='frb-demo-packs';
P.saved=()=>{try{return JSON.parse(localStorage.getItem(LK)||'[]')}catch(e){return[]}};
P.save=()=>{const l=P.saved().filter(x=>x.name!==S.name);l.unshift({name:S.name,code:P.code(),n:S.sel.size,t:Date.now()});try{localStorage.setItem(LK,JSON.stringify(l.slice(0,12)));emit('saved');return true}catch(e){return false}};
P.delSaved=n=>{try{localStorage.setItem(LK,JSON.stringify(P.saved().filter(x=>x.name!==n)))}catch(e){}emit('saved')};
P.openSaved=n=>{const x=P.saved().find(y=>y.name===n);if(!x)return;P.loadCode(x.code);S.name=n;emit('name')};
/* worker url (demo) */
const b64=u=>btoa(String.fromCharCode(...u)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const isDefaultOrder=()=>{if(Object.keys(S.over).length)return false;const def=[];CAT.groups.forEach(g=>byGroup[g.id].forEach(b=>{if(S.sel.has(b.id))def.push(b.id)}));const cur=P.ordered().map(b=>b.id);return def.length===cur.length&&def.every((x,i)=>x===cur[i])};
P.packCode=async()=>{if(isDefaultOrder())return'm'+P.code().slice(3);
 const sx=s=>STYLES.findIndex(x=>x.id===s),n=[sx(S.style)];P.ordered().forEach(b=>{const o=S.over[b.id];n.push(b.i*32+(o?sx(o)+1:0))});
 const raw=[];n.forEach(v=>{while(v>=128){raw.push(v&127|128);v>>=7}raw.push(v)});
 const cs=new CompressionStream('deflate-raw'),w=cs.writable.getWriter();w.write(new Uint8Array(raw));w.close();
 return'o'+b64(new Uint8Array(await new Response(cs.readable).arrayBuffer()))};
P.packUrl=async()=>(window.FR_WORKER||'').replace(/\/$/,'')+'/p/'+await P.packCode()+'.json';
/* utils */
P.copy=(text,msg)=>{const done=()=>P.toast(msg||'Copied');
 const fb=()=>{const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0;top:0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}ta.remove();ok?done():P.toast('Select the text and copy it')};
 try{navigator.clipboard.writeText(text).then(done,fb)}catch(e){fb()}};
let tt;P.toast=m=>{let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),1800)};
P.filter=(q,o)=>{o=o||{};q=(q||'').trim().toLowerCase();return CAT.badges.filter(b=>(!q||b.hay.includes(q))&&(!o.group||o.group==='all'||b.g===o.group)&&(o.show==='sel'?S.sel.has(b.id):o.show==='unsel'?!S.sel.has(b.id):true)&&(!o.lite||CAT.lite.includes(b.id)))};
P.liteSet=new Set(CAT.lite);
/* hash sync (plain #name only) */
let ht;function syncHash(){clearTimeout(ht);ht=setTimeout(()=>{try{const c=P.code();if(location.hash.slice(1)!==c){busy=true;history.replaceState(null,'','#'+c);setTimeout(()=>busy=false,50)}}catch(e){}},400)}
window.addEventListener('hashchange',()=>{if(busy)return;if(P.loadCode(location.hash))P.toast('Loaded pack from link')});
P.init=()=>{if(!P.loadCode(location.hash))P.preset('essentials');undo=[];redo=[];emit('all')};
window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&e.key==='z'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();P.undo()}if((e.ctrlKey||e.metaKey)&&(e.key==='y'||(e.shiftKey&&e.key==='z'))&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();P.redo()}});
window.P=P;
})();
