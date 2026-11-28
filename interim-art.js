/* Temporary production graphics, independent of combat rules and progression. */
(function(){'use strict';
const old=window.FWPrototypeArt,src=window.FWInterimAssets;if(!old||!src)return;
const imgs={},wait=[];for(const [k,url] of Object.entries(src)){const im=new Image();imgs[k]=im;wait.push(new Promise(resolve=>{im.onload=()=>resolve(true);im.onerror=()=>resolve(false);im.src=url}))}
let loaded=false;const ready=Promise.all(wait).then(v=>{loaded=true;document.documentElement.classList.add('fw-interim-art-ready');return v.every(Boolean)});
const good=k=>imgs[k]?.complete&&imgs[k].naturalWidth>0, ids=['knight','archer','mage','hunter','barbarian','rogue','paladin','nun','priest','shaman','druid','warlock','beastmaster','necromancer','dragonkin'];
const coords=[[12,40],[22,58],[41,76],[62,60],[82,71],[92,44],[90,19],[70,20],[51,22],[31,18]];
const color=['#9ab0c9','#62885a','#a45e72','#6a8062','#a67049','#74638a','#c9aa61','#c6bdc3','#d7b8df','#5a9c93','#78965d','#835b9d','#ac825c','#6d80ac','#bf744d'];
const hair=['#9c4e32','#c5a260','#3b263c','#442b25','#c07841','#252230','#674025','#342b30','#d3b07b','#2d3438','#b36b36','#252130','#75452d','#c7c0b8','#982e40'];
const skin=['#e5b496','#dfb38d','#d9ae94','#bd8867','#a77555','#e1b6aa','#bc875e','#d9b69e','#ddb89a','#855c46','#dba881','#cda8ae','#b78260','#d6c1ad','#b8795e'];
const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const pixel=(ctx,x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
const tone=(c,d)=>{const n=parseInt(c.replace('#','').slice(0,6),16);return '#'+[n>>16&255,n>>8&255,n&255].map(v=>Math.max(0,Math.min(255,v+d)).toString(16).padStart(2,'0')).join('')};
const paintKey=new WeakMap();
function delayed(el,k,draw,fallback){const stamp={};paintKey.set(el,stamp);if(good(k)){draw();return}fallback?.();ready.then(()=>{if(paintKey.get(el)===stamp&&good(k))draw()})}
function cover(c,im,x,y,w,h){const a=im.naturalWidth/im.naturalHeight,b=w/h;const sw=a>b?im.naturalHeight*b:im.naturalWidth,sh=a>b?im.naturalHeight:im.naturalWidth/b;c.drawImage(im,(im.naturalWidth-sw)/2,(im.naturalHeight-sh)/2,sw,sh,x,y,w,h)}
function title(el){delayed(el,'title',()=>{el.width=imgs.title.naturalWidth;el.height=imgs.title.naturalHeight;el.getContext('2d').drawImage(imgs.title,0,0)},()=>old.title(el))}
function merchant(el){delayed(el,'merchant',()=>{el.width=390;el.height=491;cover(el.getContext('2d'),imgs.merchant,0,0,390,491)},()=>old.merchant(el))}
function map(el,count){delayed(el,'map',()=>{el.width=780;el.height=365;const c=el.getContext('2d');cover(c,imgs.map,0,0,780,365);const fog=canvas(780,365),f=fog.getContext('2d');pixel(f,0,0,780,365,'#0d1425df');f.globalCompositeOperation='destination-out';for(const [a,b] of coords.slice(0,count)){let x=a*7.8,y=b*3.65,g=f.createRadialGradient(x,y,36,x,y,130);g.addColorStop(0,'#000');g.addColorStop(.6,'#000e');g.addColorStop(1,'#0000');f.fillStyle=g;f.fillRect(x-130,y-130,260,260)}c.drawImage(fog,0,0);c.strokeStyle='#201b19';c.lineWidth=5;c.setLineDash([3,6]);c.lineCap='round';function route(){c.beginPath();coords.slice(0,count).forEach(([x,y],i)=>{if(!i)c.moveTo(x*7.8,y*3.65);else c.lineTo(x*7.8,y*3.65)});c.stroke()}route();c.strokeStyle='#efd089';c.lineWidth=2;route();c.setLineDash([])},()=>old.map(el,count))}
const cache=new Map();
function procedural(i,col){
 const k=i+':'+col;if(cache.has(k))return cache.get(k);const el=canvas(36,48),c=el.getContext('2d'),r=(x,y,w,h,v)=>pixel(c,x,y,w,h,v),o='#151623',sh=tone(col,-47),hi=tone(col,42),h=hair[i],s=skin[i],s2=tone(s,-40),gold='#c99c54',steel='#aab8c6';
 // Deliberate 36x48 low-resolution outlines, broad cape, boots and silhouette.
 r(9,25,18,15,o);r(7,31,22,12,o);r(10,27,16,13,sh);r(8,34,7,7,sh);r(21,33,7,8,sh);r(11,34,4,12,o);r(20,34,5,12,o);r(10,42,7,4,'#37313a');r(19,42,7,4,'#37313a');r(11,42,6,1,'#77706a');r(20,42,6,1,'#77706a');
 r(10,17,17,18,o);r(12,19,13,14,col);r(13,20,10,3,hi);r(12,24,4,9,sh);r(22,24,3,9,sh);r(13,29,10,3,'#594133');r(17,29,3,3,gold);
 r(6,20,6,13,o);r(25,20,6,13,o);r(7,21,5,8,col);r(25,21,5,8,sh);r(8,28,4,4,s);r(25,28,4,4,s2);
 // Distinct hair and face silhouettes.
 r(11,4,14,14,o);r(9,8,3,12,o);r(24,7,3,12,o);r(12,5,11,4,h);r(10,9,4,10,h);r(23,8,3,11,h);r(14,8,9,11,s);r(13,10,2,5,s2);r(14,9,8,2,tone(s,20));r(15,12,2,2,o);r(20,12,2,2,o);r(16,15,4,1,s2);r(17,17,4,1,tone(s,12));r(15,18,7,2,s2);r(10,6,6,3,h);r(11,6,3,1,tone(h,45));r(24,9,2,8,tone(h,-25));
 // Distinct gear, no gameplay meaning.
 if([3,5,10,12].includes(i)){r(7,15,5,7,sh);r(24,16,5,7,sh);r(13,17,11,3,hi);r(9,34,4,7,col);r(24,34,5,7,col)}
 if([6,14].includes(i)){r(10,20,5,7,steel);r(22,20,5,7,steel);r(15,22,7,6,'#8c929e');r(16,23,4,4,gold);r(7,20,4,4,hi);r(25,20,4,4,hi)}
 if([7,8,9,10,11,13].includes(i)){r(11,3,15,4,sh);r(9,7,5,11,col);r(23,7,5,11,col);r(10,6,3,3,hi);r(26,10,2,8,sh);r(9,33,18,9,col);r(8,41,21,3,sh);r(11,40,3,2,hi)}
 if(i===3){r(30,10,2,22,'#71513a');r(28,8,4,4,gold);r(32,14,2,14,gold);r(28,30,4,3,gold);r(29,11,1,20,'#d7c49b')}
 else if(i===4){r(1,5,3,32,'#765440');r(0,3,9,7,o);r(1,4,8,5,steel);r(1,4,6,2,'#e8d6b3');r(12,19,9,6,s);r(12,24,8,2,'#73513c')}
 else if(i===5){r(1,19,2,13,steel);r(0,28,5,2,o);r(32,19,2,13,steel);r(30,28,6,2,o);r(13,15,10,2,sh)}
 else if(i===6){r(1,7,3,29,'#6c513e');r(0,5,10,8,o);r(1,6,8,6,steel);r(2,6,6,2,gold);r(25,25,8,12,o);r(26,26,6,10,'#617b9a');r(28,27,2,8,gold)}
 else if(i===7){r(2,22,7,7,'#d0c7bd');r(1,21,3,9,sh);r(28,23,6,7,'#d0c7bd');r(16,20,3,6,'#c9a55b');r(14,22,7,2,'#c9a55b')}
 else if(i===12){for(let n=0;n<8;n++){r(2+n%3,29+n,2,2,'#a86b3b')}r(0,38,6,2,'#cb9759');r(29,23,3,13,'#795033')}
 else {r(30,8,3,34,'#6d4e39');r(29,4,5,6,gold);r(28,2,7,6,hi);r(30,2,3,4,'#e6e4c3');if(i===13){r(29,2,5,5,'#e5ded5');r(30,4,1,1,o);r(32,4,1,1,o)}if(i===14){r(10,3,3,7,'#d2a268');r(24,3,3,7,'#d2a268');r(29,16,5,12,steel);r(4,34,7,3,'#b96544')}}
 cache.set(k,el);return el;
}
function artFor(i,variant,variantColor){const id=ids[i],base=variant==='Base'||!variant||variant==='Common',col=base?color[i]:(variantColor||old.palette[variant]||color[i]);const key='asset:'+i+':'+variant+':'+col;if(cache.has(key))return cache.get(key);if(i<3&&good(id)){const im=imgs[id],el=canvas(im.naturalWidth,im.naturalHeight),c=el.getContext('2d');c.drawImage(im,0,0);if(!base){c.globalCompositeOperation='source-atop';c.globalAlpha=.23;c.fillStyle=col;c.fillRect(0,0,el.width,el.height)}cache.set(key,el);return el}return procedural(i,col)}
function sprite(c,i,x,y,k=1,known=true,variant='Base',damage=0,restraint=false,variantColor){if(i<0||i>=ids.length)return;const a=artFor(i,variant,variantColor),w=18*k,h=24*k;if(!known){const silhouette=canvas(a.width,a.height),sc=silhouette.getContext('2d');sc.drawImage(a,0,0);sc.globalCompositeOperation='source-in';sc.fillStyle='#080b12';sc.fillRect(0,0,a.width,a.height);c.drawImage(silhouette,x,y,w,h);return}c.save();c.imageSmoothingEnabled=false;c.drawImage(a,x,y,w,h);if(damage){pixel(c,x+w*.38,y+h*.48,w*.16,Math.max(1,k*.8),'#4d3535');if(damage>1)pixel(c,x+w*.56,y+h*.58,w*.12,Math.max(1,k),'#984641')}if(restraint){pixel(c,x+w*.12,y+h*.44,w*.76,Math.max(1,k*1.3),'#a68b63');pixel(c,x+w*.2,y+h*.60,w*.62,Math.max(1,k*1.2),'#766046')}c.restore()}
function portrait(el,id,variant,damage=0,restraint=false,known=true,variantColor){const i=ids.indexOf(id);if(i<0)return;const stamp={};paintKey.set(el,stamp);const draw=()=>{const c=el.getContext('2d');c.fillStyle='#151b29';c.fillRect(0,0,el.width,el.height);const p='portrait_'+id;if(known&&good(p)){c.save();c.globalAlpha=.25;cover(c,imgs[p],0,0,el.width,el.height);c.restore()}const k=Math.min(el.width/20,el.height/25)*.91;sprite(c,i,(el.width-18*k)/2,(el.height-24*k)/2,k,known,variant,damage,restraint,variantColor);c.strokeStyle=known?old.palette[variant]||'#aa8950':'#3c414a';c.strokeRect(1,1,el.width-2,el.height-2)};draw();if(!loaded)ready.then(()=>{if(paintKey.get(el)===stamp)draw()})}
function terrain(c,w,h,stage=1){if(!good('field')){old.terrain(c,w,h,stage);return}cover(c,imgs.field,0,0,w,h);const overlays=['#00000000','#421c5d38','#866f2933','#56352955','#7b203d55','#8b321b65','#323c5655','#53365566','#1d215c77','#19132d88'];c.fillStyle=overlays[(stage-1)%10];c.fillRect(0,0,w,h)}
function actor(c,id,x,y,w,h){if(!good(id))return false;c.save();c.imageSmoothingEnabled=false;c.drawImage(imgs[id],x-w/2,y-h/2,w,h);c.restore();return true}
window.FWPrototypeArt={...old,title,map,merchant,portrait,sprite,terrain,coords};
window.FWInterimArt={ready,actor,loaded:()=>loaded,good,images:imgs};
})();
