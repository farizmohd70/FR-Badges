/* FR Badges: badge editor. Draws a PNG that fits Nuvio (16dp tall, width at most 5.75 times the height). */
(()=>{
const $=s=>document.querySelector(s),H=240,MAXR=5.7,MINR=1.25;
const FONTS=['Inter','Poppins','Montserrat','Rubik','Space Grotesk','Oswald','Barlow Condensed','Bebas Neue','Anton','Playfair Display','Roboto Mono'];
const PRE=[
 {n:'Deep blue',bg1:'#1f3a8a',bg2:'#0b1d52',gd:'v',fg:'#ffffff',bc:'#ffffff',bw:0,px:72,rd:90,sh:1},
 {n:'Neon',bg1:'#0a0c10',bg2:'#0a0c10',gd:'none',fg:'#39ff88',bc:'#39ff88',bw:8,px:72,rd:90,sh:0},
 {n:'Light',bg1:'#ffffff',bg2:'#e6e9f0',gd:'v',fg:'#13161b',bc:'#c8ceda',bw:4,px:72,rd:90,sh:0},
 {n:'Sunset',bg1:'#ff512f',bg2:'#dd2476',gd:'h',fg:'#ffffff',bc:'#ffffff',bw:0,px:72,rd:90,sh:1},
 {n:'Gold',bg1:'#f7d36b',bg2:'#c58f1d',gd:'v',fg:'#2b1a00',bc:'#fff2b8',bw:6,px:72,rd:90,sh:0},
 {n:'Black and white',bg1:'#000000',bg2:'#000000',gd:'none',fg:'#ffffff',bc:'#ffffff',bw:6,px:72,rd:90,sh:0}
];
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)};
const GR=(window.CAT?window.CAT.groups:[]).filter(g=>!['oneline','lang-code','lang-name'].includes(g.id)).map(g=>[g.id,g.name]).concat([['community','Other']]);
$('#gp').innerHTML=GR.map(([i,n])=>`<option value="${i}">${n}</option>`).join('');
$('#font').innerHTML=FONTS.map(f=>`<option value="${f}" style="font-family:'${f}'">${f}</option>`).join('');
$('#pre').innerHTML=PRE.map((p,i)=>`<button class="b2 sm" data-p="${i}">${p.n}</button>`).join('');
const v=id=>{const e=$('#'+id);return e.type==='checkbox'?e.checked:e.value};
const set=(id,x)=>{const e=$('#'+id);if(e.type==='checkbox')e.checked=!!x;else e.value=x};
let cvW=0;
function draw(cv,o,scaleOut){
 const ctx=cv.getContext('2d');
 const fam=`"${o.font}", system-ui, sans-serif`;
 const txt=o.cs==='u'?o.txt.toUpperCase():o.txt;
 let size=o.sz,padX=+o.px;
 const meas=sz=>{ctx.font=`${o.wt} ${sz}px ${fam}`;try{ctx.letterSpacing=o.ls+'px'}catch(e){}
  const tw=ctx.measureText(txt).width-(o.ls||0);let sw=0,gap=0;if(o.sym){ctx.font=`400 ${sz}px ${fam}`;sw=ctx.measureText(o.sym).width;gap=sz*0.22;ctx.font=`${o.wt} ${sz}px ${fam}`}
  return{tw,sw,gap,w:Math.ceil(padX*2+tw+sw+gap)}};
 let m=meas(size);
 if(m.w>H*MAXR){size=Math.floor(size*(H*MAXR-padX*2)/(m.w-padX*2)*0.99);m=meas(size)}
 let W=Math.max(m.w,Math.round(H*MINR));
 cv.width=W;cv.height=H;cvW=W;
 ctx.clearRect(0,0,W,H);
 const bw=+o.bw,r=Math.min(+o.rd,H/2,W/2),ins=bw/2;
 ctx.beginPath();ctx.roundRect(ins,ins,W-bw,H-bw,Math.max(0,r-ins));
 let fill=o.bg1;
 if(o.gd!=='none'){const g=o.gd==='h'?ctx.createLinearGradient(0,0,W,0):o.gd==='v'?ctx.createLinearGradient(0,0,0,H):ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,o.bg1);g.addColorStop(1,o.bg2);fill=g}
 ctx.fillStyle=fill;ctx.fill();
 if(bw>0){ctx.lineWidth=bw;ctx.strokeStyle=o.bc;ctx.stroke()}
 ctx.font=`${o.wt} ${size}px ${fam}`;try{ctx.letterSpacing=o.ls+'px'}catch(e){}
 ctx.textBaseline='alphabetic';ctx.fillStyle=o.fg;
 const x0=(W-(m.tw+m.sw+m.gap))/2;
 const mt=ctx.measureText('H'),capH=mt.actualBoundingBoxAscent||size*0.7,y=H/2+capH/2;
 if(o.sh){ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=H*0.04;ctx.shadowOffsetY=H*0.02}
 let x=x0;
 if(o.sym){ctx.font=`400 ${size}px ${fam}`;try{ctx.letterSpacing='0px'}catch(e){}ctx.fillText(o.sym,x,y);x+=m.sw+m.gap;ctx.font=`${o.wt} ${size}px ${fam}`;try{ctx.letterSpacing=o.ls+'px'}catch(e){}}
 ctx.fillText(txt,x,y);
 ctx.shadowColor='transparent';
 return{W,size}
}
const opts=()=>({txt:v('txt')||' ',sym:v('sym').trim(),font:v('font'),wt:v('wt'),sz:+v('sz'),ls:+v('ls'),fg:v('fg'),cs:v('cs'),bg1:v('bg1'),bg2:v('bg2'),gd:v('gd'),bc:v('bc'),bw:+v('bw'),rd:+v('rd'),px:+v('px'),sh:v('sh')});
let busy=0;
async function render(){
 const o=opts();const my=++busy;
 try{await Promise.all([document.fonts.load(`${o.wt} 40px "${o.font}"`,o.txt),document.fonts.load(`400 40px "${o.font}"`,o.sym||'A')])}catch(e){}
 if(my!==busy)return;
 const cv=$('#cv'),r=draw(cv,o);
 $('#szv').textContent=o.sz;$('#lsv').textContent=o.ls;$('#bwv').textContent=o.bw;$('#rdv').textContent=o.rd;$('#pxv').textContent=o.px;
 const ratio=r.W/H;
 $('#meta').textContent=`${r.W} × ${H} px, width is ${ratio.toFixed(2)}× the height (Nuvio limit 5.75)`+(r.size<o.sz?'. The text was shrunk to fit.':'');
 cv.style.height='clamp(48px,18vw,96px)';

 check();
}
function flags(p){const m=/^\(\?([a-z]+)\)/.exec(p);let f='',b=p;if(m){b=p.slice(m[0].length);for(const c of m[1])if('ims'.includes(c)&&!f.includes(c))f+=c}return[b,f]}
function rx(p){const[b,f]=flags(p);try{return new RegExp(b,f)}catch(e){try{return new RegExp(b,f+'u')}catch(e2){throw e2}}}
function check(){const p=$('#pat').value.trim(),pr=$('#pr');
 if(!p){pr.className='pr bad';pr.textContent='Add a pattern.';return false}
 let r;try{r=rx(p)}catch(e){pr.className='pr bad';pr.textContent='Not a valid pattern: '+e.message;return false}
 const m=r.test($('#tt').value);pr.className='pr '+(m?'ok':'no');pr.textContent=m?'Matches this title, so the badge will show.':'Does not match this title.';return true}
['txt','sym','font','wt','sz','ls','fg','cs','bg1','bg2','gd','bc','bw','rd','px','sh'].forEach(id=>{$('#'+id).addEventListener('input',render);$('#'+id).addEventListener('change',render)});
['pat','tt'].forEach(id=>$('#'+id).addEventListener('input',check));
$('#txt').addEventListener('input',()=>{const n=$('#nm');if(!n.dataset.t){n.value=v('txt').slice(0,40)}});
$('#nm').addEventListener('input',()=>{$('#nm').dataset.t=1});
$('#pxr').onclick=()=>{set('px',72);render()};
$('#pre').onclick=e=>{const b=e.target.closest('[data-p]');if(!b)return;const p=PRE[+b.dataset.p];Object.keys(p).forEach(k=>{if(k!=='n')set(k,p[k])});render()};
const blob=()=>new Promise(r=>$('#cv').toBlob(r,'image/png'));
$('#dl').onclick=async()=>{const b=await blob();const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=(($('#nm').value||'badge').trim().replace(/[^\w-]+/g,'-')||'badge')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)};
/* robot check, only when a Turnstile key is set in config.js */
let tsTok='';
if(window.FR_TURNSTILE){const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.async=true;s.onload=()=>{window.turnstile.render('#ts',{sitekey:window.FR_TURNSTILE,callback:t=>{tsTok=t;const r=$('#res');if(r&&r.textContent.startsWith('Robot check'))r.hidden=true},'expired-callback':()=>tsTok='','error-callback':code=>{tsTok='';const r=$('#res');r.hidden=false;r.className='pr bad';r.textContent='Robot check problem (code '+code+'). Check that farizmohd70.github.io is listed as a hostname in the Turnstile widget, turn off any blocker for this page, then reload.';return true}})};document.head.appendChild(s)}
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
  const r=await fetch(window.FR_WORKER.replace(/\/$/,'')+'/submit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({n:name,p:pat,g:$('#gp').value,png:await b64(b),ts:tsTok})});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Could not share the badge.');
  res.className='pr ok';res.innerHTML='Shared. It can take a few minutes to show on the Community made page. <button class="b2 sm" id="addm">Add to my pack</button> <a class="b2 sm" href="community" style="text-decoration:none">See community</a>';
  $('#addm').onclick=()=>{try{const l=JSON.parse(localStorage.getItem('fr_com_pick')||'[]');if(!l.some(x=>x.id===j.id))l.push({id:j.id,n:j.n,p:j.p,g:j.g});localStorage.setItem('fr_com_pick',JSON.stringify(l));toast('Added. Open Make a pack to see it.')}catch(e){toast('Could not save in this browser')}};
 }catch(e){res.className='pr bad';res.textContent=e.message||'Could not share the badge.'}
 $('#sub').disabled=false;
};
if(window.FR_TURNSTILE===undefined)0;
render();
})();
