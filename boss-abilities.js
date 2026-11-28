/* Campaign boss signatures. All times are simulation seconds; damage scaling is applied once. */
(function(root){'use strict';
const rules={2:{cooldown:10,duration:2,count:2},3:{cooldown:9,warning:1.2,radius:2.8,damage:14},4:{cooldown:9,range:2,damage:[12,8,5]},5:{cooldown:10,warning:1,range:4.5,angle:80,damage:13,burn:1,burnDuration:3},6:{cooldown:12,heroDamage:3,towerDamage:2,ringSpeed:6},7:{cooldown:10,count:3,duration:3,dps:2,heal:.5},8:{cooldown:12,count:4,cap:10},9:{cooldown:11,count:3,duration:5,share:.3},10:{phases:[{cooldown:8,warning:1,radius:1.6,damage:8},{cooldown:6,warning:.9,radius:2.3,damage:11},{cooldown:4.5,warning:.8,radius:3,damage:14}]}};
const rule=e=>e.stage===10?rules[10].phases[e.phase-1]:rules[e.stage];
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const insideCone=(x,y,c)=>{const dx=x-c.x,dy=y-c.y,d=Math.hypot(dx,dy);return d<=c.range&&(d<1e-8||(dx*c.dx+dy*c.dy)/d>=Math.cos(c.angle*Math.PI/360))};
function create({state,heroList,hitHero,hitTower,spawnGenerated,ring,beam,scale,arenaRadius,log}){
 const now=()=>state.elapsed,active=()=>heroList().filter(h=>h.hp>0);
 const nearest=(point,n=1)=>active().sort((a,b)=>dist(a,point)-dist(b,point)||a.id-b.id).slice(0,n);
 const reset=()=>{state.bossPulses=[];state.bossDrains=[];state.bossBurns=[]};
 function init(e){const r=rule(e);e.signature=null;e.nextSignature=r?now()+r.cooldown:Infinity;}
 function die(e){if(e.stage===8&&!e.faction)for(const a of state.enemies)if(a.kind==='lich-skeleton'&&a.ownerId===e.id){a.expired=true;a.hp=0}state.bossDrains=state.bossDrains.filter(a=>a.owner!==e.id);for(const h of state.heroes)if(h.covenantOwner===e.id){h.covenantUntil=0;h.covenantOwner=null}}
 function tick(dt){
  const elapsed=now();
  for(const b of state.bossBurns){const h=state.heroes.find(h=>h.id===b.hero&&h.hp>0),d=Math.max(0,Math.min(dt,b.end-(elapsed-dt)));if(h&&d>0)hitHero(h,b.dps*d,null)}
  state.bossBurns=state.bossBurns.filter(b=>b.end>elapsed);
  for(const d of state.bossDrains){const owner=state.enemies.find(e=>e.id===d.owner&&e.hp>0),h=state.heroes.find(h=>h.id===d.hero&&h.hp>0),t=Math.max(0,Math.min(dt,d.end-(elapsed-dt)));if(owner&&h&&t>0){const before=h.hp;hitHero(h,d.dps*t,owner);owner.hp=Math.min(owner.maxHp,owner.hp+Math.max(0,before-h.hp)*d.heal);beam(owner,h,'#d28ce0',.12)}}
  state.bossDrains=state.bossDrains.filter(d=>d.end>elapsed&&state.enemies.some(e=>e.id===d.owner&&e.hp>0));
  for(const p of state.bossPulses){p.radius=Math.min(p.maxRadius,p.radius+p.speed*dt);for(const h of active())if(!p.hits.has(h.id)&&dist(h,p)<=p.radius){p.hits.add(h.id);hitHero(h,p.heroDamage,null)}if(!p.towerHit&&Math.hypot(p.x,p.y)<=p.radius){p.towerHit=true;hitTower(p.towerDamage)}}
  state.bossPulses=state.bossPulses.filter(p=>p.radius<p.maxRadius);
 }
 function resolve(e,c){const r=rule(e),m=scale();
  if(c.type==='cone'){for(const h of active())if(insideCone(h.x,h.y,c)){hitHero(h,r.damage*m,e);if(h.hp>0)state.bossBurns.push({hero:h.id,end:now()+r.burnDuration,dps:r.burn*m})}}
  else{for(const h of active())if(dist(h,c)<=c.radius)hitHero(h,r.damage*m,e);ring(c.x,c.y,c.radius,'#dd93ec')}
  e.signature=null;e.nextSignature=now()+r.cooldown;
 }
 function step(e){if(!e.boss||e.faction||!rule(e))return false;const r=rule(e),t=now(),m=scale();if(e.signature){if(t+1e-8>=e.signature.at)resolve(e,e.signature);return true}if(t+1e-8<e.nextSignature)return false;
  const targets=nearest(e,Math.max(3,r.count||0)),h=targets[0];e.nextSignature=t+r.cooldown;
  switch(e.stage){
   case 2:for(const a of targets.slice(0,r.count)){a.rootedUntil=t+r.duration;a.vx=a.vy=0;a.windupTime=0;a.windupTarget=null;a.beamTarget=null;a.beamTime=0;ring(a.x,a.y,.7,'#85b967')}break;
   case 3:e.signature={type:'circle',x:e.x,y:e.y,radius:r.radius,at:t+r.warning};return true;
   case 4:{let prev=e,next=h,used=new Set();for(const dmg of r.damage){if(!next)break;used.add(next.id);beam(prev,next,'#edcb8a',.4);hitHero(next,dmg*m,e);prev=next;next=nearest(prev,active().length).find(a=>!used.has(a.id)&&dist(a,prev)<=r.range)}}break;
   case 5:if(h){const len=dist(h,e)||1;e.signature={type:'cone',x:e.x,y:e.y,dx:(h.x-e.x)/len,dy:(h.y-e.y)/len,range:r.range,angle:r.angle,at:t+r.warning};return true}break;
   case 6:state.bossPulses.push({x:e.x,y:e.y,radius:0,maxRadius:arenaRadius(e),speed:r.ringSpeed,heroDamage:r.heroDamage*m,towerDamage:r.towerDamage*m,hits:new Set(),towerHit:false});break;
   case 7:for(const a of targets.slice(0,r.count))state.bossDrains.push({owner:e.id,hero:a.id,end:t+r.duration,dps:r.dps*m,heal:r.heal});break;
   case 8:{const count=Math.min(r.count,Math.max(0,r.cap-state.enemies.filter(a=>a.kind==='lich-skeleton'&&a.ownerId===e.id&&a.hp>0).length));for(let i=0;i<count;i++){const a=i*2*Math.PI/count;spawnGenerated(e,{hp:8,damage:2,speed:1.1,attackPeriod:1},'lich-skeleton',Math.cos(a)*1.2,Math.sin(a)*1.2)}}break;
   case 9:for(const a of targets.slice(0,r.count)){a.covenantOwner=e.id;a.covenantUntil=t+r.duration;ring(a.x,a.y,.65,'#a47ad5')}break;
   case 10:if(h){e.signature={type:'circle',x:h.x,y:h.y,radius:r.radius,at:t+r.warning};return true}break;
  }return false;
 }
 function share(h,actual,source,linked=false){if(linked||actual<=0||!(h.covenantUntil>now()))return;const owner=state.enemies.find(e=>e.id===h.covenantOwner&&e.hp>0);if(!owner)return;for(const a of active())if(a!==h&&a.covenantOwner===h.covenantOwner&&a.covenantUntil>now())hitHero(a,actual*rules[9].share,source,true)}
 reset();return{reset,init,step,tick,die,share};
}
const api={rules,insideCone,create};if(typeof module==='object'&&module.exports)module.exports=api;else root.FWBossAbilities=api;
})(typeof window!=='undefined'?window:globalThis);
