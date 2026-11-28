/* Shared header: menu toggle, active link, and the live badge/look count read from the data files. */
(function(){
document.addEventListener('click',e=>{const b=e.target.closest('.inf');document.querySelectorAll('.infw.open').forEach(w=>{if(!b||w!==b.parentNode)w.classList.remove('open')});if(b)b.parentNode.classList.toggle('open')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.infw.open').forEach(w=>w.classList.remove('open'))});

var V=(/[?&]v=([0-9]+)/.exec((document.currentScript||{}).src||'')||[])[1]||'';
if(/[?&]embed=1/.test(location.search))[].forEach.call(document.querySelectorAll('a[href]:not([target])'),function(a){a.target='_top'});
var nav=document.getElementById('hnav'),btn=document.getElementById('mbtn');
if(nav){var here=(location.pathname.replace(/\/$/,'').split('/').pop()||'').replace(/\.html$/,'');
 [].forEach.call(nav.querySelectorAll('a[href]'),function(a){var h=a.getAttribute('href').replace(/\.html$/,'');if(h&&h===here)a.setAttribute('aria-current','page')})}
if(btn&&nav){
 var set=function(o){nav.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false');if(window.ic)btn.innerHTML=ic(o?'x':'menu')};
 btn.onclick=function(e){e.stopPropagation();set(!nav.classList.contains('open'))};
 document.addEventListener('click',function(e){if(!nav.contains(e.target))set(false)});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){set(false);btn.focus()}});
 matchMedia('(min-width:768px)').addEventListener('change',function(){set(false)})}
function meta(){var C=window.CAT,S=window.STYLES_DATA;if(!C||!S)return;
 window.FRMETA={badges:C.badges.length,looks:S.length,groups:C.groups.length};
 var t=document.getElementById('vtag');if(t)t.textContent=FRMETA.badges+' badges · '+FRMETA.looks+' looks';
 [].forEach.call(document.querySelectorAll('[data-meta]'),function(e){e.textContent=FRMETA[e.dataset.meta]});
 document.dispatchEvent(new Event('frmeta'))}
if(window.CAT)meta();else{var s=document.createElement('script');s.src='assets/catalog.js'+(V?'?v='+V:'');s.async=true;s.onload=meta;document.head.appendChild(s)}
})();
