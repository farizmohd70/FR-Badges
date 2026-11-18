/* FR Badges: shared badge drawing (badge maker and style pack maker). Draws a PNG that fits Nuvio. */
window.FRD=(()=>{
const H=240,MAXR=5.7,MINR=1.25;
const FONTS=['Inter','Poppins','Montserrat','Rubik','Space Grotesk','Oswald','Barlow Condensed','Bebas Neue','Anton','Playfair Display','Roboto Mono'];
const DEF={shs:35,gw:0,gc:'#ffffff',bgr:0,bc2:'#ffffff',bg1:'#1f3a8a',bg2:'#1f3a8a',gd:'none',fg:'#ffffff',bc:'#ffffff',bw:0,px:72,rd:90,sh:0,tr:0,bgo:100,gl:0,tow:0,toc:'#000000'};
const PRE=[
 {n:'Glass',bg1:'#3d4f86',bg2:'#151a34',gd:'v',bc:'#ffffff',bw:3,gl:1,sh:1},
 {n:'Solid blue',bg1:'#2563eb',sh:1},
 {n:'Deep blue',bg1:'#1f3a8a',bg2:'#0b1d52',gd:'v',sh:1},
 {n:'Light',bg1:'#ffffff',bg2:'#e6e9f0',gd:'v',fg:'#13161b',bc:'#c8ceda',bw:4},
 {n:'Neon green',bg1:'#0a0c10',fg:'#39ff88',bc:'#39ff88',bw:8},
 {n:'Neon pink',bg1:'#12081a',fg:'#ff4fd8',bc:'#ff4fd8',bw:8},
 {n:'Frost',bg1:'#ffffff',bgo:22,bc:'#ffffff',bw:3,sh:1},
 {n:'Minimal',bg1:'#14161b',fg:'#e6e9f0',bc:'#2b2f38',bw:4},
 {n:'Black and white',bg1:'#000000',bc:'#ffffff',bw:6,rd:24},
 {n:'White and black',bg1:'#ffffff',fg:'#000000',bc:'#000000',bw:6,rd:24},
 {n:'Text white',tr:1,sh:1},
 {n:'Text black',tr:1,fg:'#000000'},
 {n:'Outline',tr:1,bc:'#ffffff',bw:8},
 {n:'Comic text',tr:1,tow:7,toc:'#000000',sh:0},
 {n:'Sunset',bg1:'#ff512f',bg2:'#dd2476',gd:'h',rd:90,sh:1},
 {n:'Ocean',bg1:'#00c6ff',bg2:'#0072ff',gd:'h',sh:1},
 {n:'Forest',bg1:'#11998e',bg2:'#38ef7d',gd:'h',fg:'#06231a'},
 {n:'Purple',bg1:'#7f00ff',bg2:'#e100ff',gd:'h',gl:1,sh:1},
 {n:'Red alert',bg1:'#ff1f1f',bg2:'#7a0000',gd:'v',gl:1,sh:1},
 {n:'Gold',bg1:'#f7d36b',bg2:'#c58f1d',gd:'v',fg:'#2b1a00',bc:'#fff2b8',bw:6,rd:70},
 {n:'Sticker',bg1:'#ffe14d',fg:'#111111',bc:'#111111',bw:8},
 {n:'Neon glow',bg1:'#05070d',fg:'#7df9ff',bc:'#7df9ff',bw:4,gw:26,gc:'#00e5ff'},
 {n:'Rainbow edge',bg1:'#111318',bc:'#ff4fd8',bc2:'#4fd8ff',bgr:1,bw:8},
 {n:'Chrome',bg1:'#f4f6fa',bg2:'#9aa3b2',gd:'v',fg:'#1b1f27',bc:'#ffffff',bc2:'#6b7383',bgr:1,bw:5,gl:1},
 {n:'Glow text',tr:1,gw:30,gc:'#ffffff'}
];
/* built-in icons (24 x 24 grid) */
const ICO={},STROKE={check:1};
{const star=[];for(let i=0;i<10;i++){const r=i%2?4.7:11.3,t=(-90+36*i)*Math.PI/180;star.push((i?'L':'M')+(12+r*Math.cos(t)).toFixed(2)+' '+(12.6+r*Math.sin(t)).toFixed(2))}
 const S={star:star.join('')+'Z',sparkle:'M12 1C13 8 16 11 23 12C16 13 13 16 12 23C11 16 8 13 1 12C8 11 11 8 12 1Z',
  heart:'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  play:'M7 4.5v15l13-7.5z',bolt:'M13 2L4 14h6l-1 8 9-12h-6z',check:'M4 12.5l5 5L20 6.5',diamond:'M12 2l9 8-9 12L3 10z',
  shield:'M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5z',
  sound:'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
  screen:'M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z',
  film:'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z',
  crown:'M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z',
  flame:'M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z'};
 Object.keys(S).forEach(k=>ICO[k]=new Path2D(S[k]))}
const ICN={star:'Star',sparkle:'Sparkle',heart:'Heart',play:'Play',bolt:'Lightning',check:'Tick',diamond:'Diamond',shield:'Shield',sound:'Sound',screen:'Screen',film:'Film',crown:'Crown',flame:'Flame'};
function draw(cv,o,img,iimg,probe){
 let ctx=cv.getContext('2d'),fam=`"${o.font}", system-ui, sans-serif`;
 const up=s=>o.cs==='u'?s.toUpperCase():s,two=!!(o.t2&&o.t2.trim()),t1=up(o.txt),t2=two?up(o.t2.trim()):'',hasT=!!(t1.trim()||two);
 const padX=+o.px,ls=()=>{try{ctx.letterSpacing=o.ls+'px'}catch(e){}},fnt=s=>`${o.wt} ${s}px ${fam}`;
 const cap=s=>{ctx.font=fnt(s);ls();return ctx.measureText('H').actualBoundingBoxAscent||s*.7};
 const tww=(t,s)=>{ctx.font=fnt(s);ls();return ctx.measureText(t).width-(o.ls||0)};
 function lay(sz){
  const s1=two?sz*.62:sz,s2=two?s1*o.s2/100:0,w1=hasT?tww(t1,s1):0,w2=two?tww(t2,s2):0,tw=Math.max(w1,w2);
  const c1=cap(s1),c2=two?cap(s2):0,gap=two?s1*.26:0,bh=two?c1+gap+c2:c1,LH=two?(s1+s2)*.8:sz*.95,L=[];
  if(img){const h=H*o.imz/100;L.push({k:'img',w:Math.min(h*img.width/img.height,H*2.4),h})}
  if(iimg)L.push({k:'iimg',w:LH,h:LH});
  if(o.ic)L.push({k:'ic',w:LH,h:LH});
  if(o.sym){const fs=two?LH:sz;ctx.font=`400 ${fs}px ${fam}`;try{ctx.letterSpacing='0px'}catch(e){}L.push({k:'sym',w:ctx.measureText(o.sym).width,fs})}
  const gp=sz*.22,lw=L.length?L.reduce((a,l)=>a+l.w,0)+gp*(L.length-(hasT?0:1)):0;
  return{s1,s2,w1,w2,tw,c1,c2,gap,bh,L,gp,lw,w:Math.ceil(padX*2+tw+lw)}}
 const mg=Math.max(0,Math.min(60,+o.mg||0));
 let size=o.sz,m=lay(size);
 for(let i=0;i<5;i++){let f=1;if(two&&m.bh>H*.78)f=Math.min(f,H*.78/m.bh);if(m.w>H*MAXR-2*mg)f=Math.min(f,(H*MAXR-2*mg-padX*2)/(m.w-padX*2)*.99);if(f>=1)break;size=Math.floor(size*f);m=lay(size)}
 const W=Math.min(Math.max(m.w,Math.round(H*MINR)),Math.floor(H*5.7)-2*mg);
 const Wf=W+2*mg;
 cv.width=Wf;cv.height=H;
 ctx.clearRect(0,0,Wf,H);if(mg)ctx.setTransform(1,0,0,1,mg,0);
 const bw=+o.bw,r=Math.min(+o.rd,H/2,W/2),ins=bw/2;
 ctx.beginPath();ctx.roundRect(ins,ins,W-bw,H-bw,Math.max(0,r-ins));
 let fill=o.bg1;
 if(o.gd!=='none'){const g=o.gd==='h'?ctx.createLinearGradient(0,0,W,0):o.gd==='v'?ctx.createLinearGradient(0,0,0,H):ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,o.bg1);g.addColorStop(1,o.bg2);fill=g}
 if(!o.tr){ctx.save();ctx.globalAlpha=o.bgo/100;ctx.fillStyle=fill;ctx.fill();ctx.restore()}
 if(o.gl&&!o.tr){ctx.save();ctx.beginPath();ctx.roundRect(ins,ins,W-bw,H-bw,Math.max(0,r-ins));ctx.clip();const g2=ctx.createLinearGradient(0,0,0,H*0.6);g2.addColorStop(0,'rgba(255,255,255,.34)');g2.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g2;ctx.fillRect(0,0,W,H*0.6);ctx.restore()}
 if(bw>0){ctx.lineWidth=bw;if(o.bgr){const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,o.bc);g.addColorStop(1,o.bc2);ctx.strokeStyle=g}else ctx.strokeStyle=o.bc;ctx.stroke()}
 const x0=(W-(m.tw+m.lw))/2,cy=H/2,tx=x0+m.lw;
 const outl=(fn)=>{if(o.tow>0){ctx.save();ctx.lineJoin='round';ctx.lineWidth=o.tow*2;ctx.strokeStyle=o.toc;fn();ctx.restore()}};
 const paint=()=>{let x=x0;ctx.fillStyle=o.fg;
  m.L.forEach(l=>{
   if(l.k==='img')ctx.drawImage(img,x,cy-l.h/2,l.w,l.h);
   else if(l.k==='iimg')ctx.drawImage(iimg,x,cy-l.h/2,l.w,l.h);
   else if(l.k==='ic'){const P=ICO[o.ic];ctx.save();ctx.translate(x,cy-l.h/2);ctx.scale(l.w/24,l.h/24);
    if(STROKE[o.ic]){ctx.lineWidth=3.4;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=o.fg;ctx.stroke(P)}
    else{if(o.tow>0){ctx.lineJoin='round';ctx.lineWidth=o.tow*2*24/l.w;ctx.strokeStyle=o.toc;ctx.stroke(P)}ctx.fill(P)}ctx.restore()}
   else{ctx.font=`400 ${l.fs}px ${fam}`;try{ctx.letterSpacing='0px'}catch(e){}const y=cy+l.fs*.36;outl(()=>ctx.strokeText(o.sym,x,y));ctx.fillText(o.sym,x,y)}
   x+=l.w+m.gp});
  if(!hasT)return;
  ctx.textBaseline='alphabetic';
  const line=(t,s,xx,yy)=>{ctx.font=fnt(s);ls();outl(()=>ctx.strokeText(t,xx,yy));ctx.fillText(t,xx,yy)};
  if(two){const top=cy-m.bh/2,y1=top+m.c1;line(t1,m.s1,tx+(m.tw-m.w1)/2,y1);line(t2,m.s2,tx+(m.tw-m.w2)/2,y1+m.gap+m.c2)}
  else line(t1,m.s1,tx,cy+m.c1/2)};
 if(o.gw>0){ctx.save();ctx.shadowColor=o.gc;ctx.shadowBlur=o.gw;paint();paint();ctx.restore()}
 if(o.sh){ctx.shadowColor=`rgba(0,0,0,${o.shs/100})`;ctx.shadowBlur=H*0.04*(o.shs/35);ctx.shadowOffsetY=H*0.02}
 paint();ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 ctx.setTransform(1,0,0,1,0,0);
 let clip=false,clipX=false,clipY=false;
 if(probe){ /* draw the text and icons on a bigger sheet and look for anything past the edge of the picture */
  const e=Math.ceil(H*.35),tc=document.createElement('canvas');tc.width=W+2*e;tc.height=H+2*e;
  const t=tc.getContext('2d'),keep=ctx;ctx=t;t.setTransform(1,0,0,1,e,e);
  if(o.gw>0){t.save();t.shadowColor=o.gc;t.shadowBlur=o.gw;paint();paint();t.restore()}
  if(o.sh){t.shadowColor=`rgba(0,0,0,${o.shs/100})`;t.shadowBlur=H*0.04*(o.shs/35);t.shadowOffsetY=H*0.02}
  paint();ctx=keep;
  const x0=e-mg,x1=e+W+mg,y0=e,y1=e+H,w=tc.width,d=t.getImageData(0,0,w,tc.height).data;
  for(let y=0;y<tc.height;y++){const inY=y>=y0&&y<y1;for(let x=0;x<w;x++){if(inY&&x>=x0&&x<x1){x=x1-1;continue}if(d[(y*w+x)*4+3]>24){clip=true;if(inY)clipX=true;else clipY=true}}}
 }
 return{W:Wf,size,clip,clipX,clipY}
}

return{H,MAXR,MINR,FONTS,DEF,PRE,ICO,ICN,draw};
})();
