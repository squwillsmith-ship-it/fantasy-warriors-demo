/* v1.16 manual spells + capture: shared deterministic gameplay rules. */
(function(root){'use strict';
const capture=Object.freeze({seconds:5,thresholds:[10,20],decayDelay:.5,decayRate:.5,invulnerability:1,hitRadius:.85});
const spells=Object.freeze({
 lightning:{id:'O-SP01',name:'Lightning Strike',radius:1.25,amount:12,cooldown:25,duration:0,upgrade:'O-SP05',color:'#b8dfff'},
 healing:{id:'O-SP02',name:'Healing Circle',radius:2,amount:2,cooldown:30,duration:5,upgrade:'O-SP06',color:'#a8efbc'},
 frost:{id:'O-SP03',name:'Frost Field',radius:2,amount:.35,cooldown:30,duration:5,upgrade:'O-SP07',color:'#9de3ff'},
 ember:{id:'O-SP04',name:'Ember Rain',radius:2,amount:1.5,cooldown:35,duration:5,upgrade:'O-SP09',color:'#ffad73'}
});
function create({state,owns,equipped,hitEnemy,healHero,ring,log}){
 const inBattle=()=>state.mode==='battle'&&!state.paused;
 const known=k=>Object.hasOwn(spells,k)&&owns(spells[k].id);
 const slots=()=>owns('O-SP11')?2:1;
 const loadout=()=>[...new Set((equipped()||[]).filter(known))].slice(0,slots());
 const radius=(k)=>spells[k].radius*(owns('O-SP10')?1.25:1);
 function values(k){const s=spells[k];return {radius:radius(k),amount:s.amount*(k==='frost'?1:1+(owns(s.upgrade)?.5:0)+(owns('O-SP12')?.25:0)),duration:s.duration*(k==='frost'&&owns(s.upgrade)?1.5:1),cooldown:s.cooldown*(owns('O-SP08')?.8:1)}}
 function reset(){for(const h of state.heroes||[])if(h.capture){release(h);h.capture=null}state.spellReady={};state.spellZones=[];state.spellEchoes=[];state.spellArmed=null;state.spellCasts=0;state.removedClasses=[];state.captureSerial=0;state.selectedCapture=null;}
 function release(h){const e=state.enemies.find(e=>e.id===h.capture?.captor);if(e&&e.capturing===h.capture.id){e.capturing=null;e.inAttackRange=false;e.cooldown=Math.max(e.cooldown||0,.65)}}
 function down(h,source){
  if(h.summonKind||h.capture||h.hp>0||state.mode!=='battle')return false;
  const captor=source&&state.enemies.includes(source)&&source.hp>0&&!source.boss&&!source.elite&&!source.generated&&!source.capturing?source:null;
  const id=++state.captureSerial;
  h.capture={id,captor:captor?.id??null,start:state.elapsed,expires:state.elapsed+capture.seconds,lastPress:state.elapsed,progress:0,required:capture.thresholds[h.rescues||0]??0,decayAt:state.elapsed+capture.decayDelay};
  if(captor){captor.capturing=id;captor.vx=0;captor.vy=0}
  h.vx=0;h.vy=0;h.targetId=null;h.windupTime=0;h.windupTarget=null;h.beamTarget=null;h.beamTime=0;h.shield=0;h.shieldOwner=null;
  log(h.base.name+(h.capture.required?' is captured! Rescue with rapid taps.':' is restrained — no rescues remaining.'));
  return true;
 }
 function remove(h){if(!h.capture)return;release(h);h.capture=null;h.hp=0;if(!state.removedClasses.includes(h.base.id))state.removedClasses.push(h.base.id);if(state.selectedCapture===h.id)state.selectedCapture=null;log(h.base.name+' was restrained.')}
 function rescue(h){if(!h.capture?.required||state.elapsed>=h.capture.expires)return false;release(h);h.capture=null;h.rescues=(h.rescues||0)+1;h.hp=1;h.rescueInvulnerableUntil=state.elapsed+capture.invulnerability;h.armourDamaged=true;h.attackState='idle';h.cooldown=Math.max(h.cooldown||0,.2);if(state.selectedCapture===h.id)state.selectedCapture=null;log(h.base.name+' rescued at 1 HP!');return true;}
 function decay(h,now){const c=h.capture;if(!c)return;if(now>c.decayAt){c.progress=Math.max(0,c.progress-(now-c.decayAt)*capture.decayRate);c.decayAt=now}}
 function press(id){if(!inBattle())return false;const h=state.heroes.find(a=>a.id===id&&a.capture);if(!h)return false;state.selectedCapture=h.id;if(state.elapsed>=h.capture.expires){remove(h);return true}if(!h.capture.required)return true;decay(h,state.elapsed);h.capture.progress++;h.capture.lastPress=state.elapsed;h.capture.decayAt=state.elapsed+capture.decayDelay;if(h.capture.progress>=h.capture.required)rescue(h);return true}
 function captureTick(){for(const h of state.heroes){const c=h.capture;if(!c)continue;if(state.elapsed>=c.expires){remove(h);continue}if(c.captor!=null&&!state.enemies.some(e=>e.id===c.captor&&e.hp>0)){if(c.required)rescue(h);else remove(h);continue}decay(h,state.elapsed)}}
 function cancel(){state.spellArmed=null}
 function ready(k){return known(k)&&loadout().includes(k)&&(state.spellReady[k]??0)<=state.elapsed+1e-8}
 function arm(k){if(!inBattle()||!ready(k))return false;state.spellArmed=state.spellArmed===k?null:k;return true}
 function apply(k,x,y,v,potency){const s=spells[k];ring(x,y,v.radius,s.color);if(k==='lightning'){for(const e of state.enemies)if(e.hp>0&&Math.hypot(e.x-x,e.y-y)<=v.radius)hitEnemy(e,v.amount*potency,s.color,null,null,'playerSpell')}else state.spellZones.push({key:k,x,y,radius:v.radius,amount:v.amount*potency,start:state.elapsed,end:state.elapsed+v.duration,color:s.color})}
 function cast(x,y){const k=state.spellArmed;if(!inBattle()||!k||!ready(k)||!Number.isFinite(x)||!Number.isFinite(y))return false;const v=values(k);cancel();state.spellReady[k]=state.elapsed+v.cooldown;state.spellCasts++;apply(k,x,y,v,1);if(owns('O-SP13')&&state.spellCasts%3===0)state.spellEchoes.push({key:k,x,y,v,at:state.elapsed+(k==='lightning'?.5:v.duration)});log(spells[k].name+' cast.');return true}
 function pointer(x,y){if(!inBattle())return false;const h=state.heroes.filter(h=>h.capture&&Math.hypot(h.x-x,h.y-y)<=capture.hitRadius).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y)||a.id-b.id)[0];if(h)return press(h.id);return state.spellArmed?cast(x,y):false}
 function tick(dt){if(!inBattle())return;captureTick();const start=state.elapsed-dt;const active=state.spellZones.filter(z=>z.end>start&&z.start<=state.elapsed);
  // Per simulation slice integrate only the strongest overlapping instance of each spell.
  for(const h of state.heroes){if(h.hp<=0||h.summonKind)continue;let n=0;for(const z of active)if(z.key==='healing'&&Math.hypot(h.x-z.x,h.y-z.y)<=z.radius)n=Math.max(n,z.amount*Math.max(0,Math.min(z.end,state.elapsed)-Math.max(z.start,start)));if(n>0)healHero(h,n)}
  for(const e of state.enemies){if(e.hp<=0)continue;let n=0;for(const z of active)if(z.key==='ember'&&Math.hypot(e.x-z.x,e.y-z.y)<=z.radius)n=Math.max(n,z.amount*Math.max(0,Math.min(z.end,state.elapsed)-Math.max(z.start,start)));if(n>0)hitEnemy(e,n,spells.ember.color,null,null,'playerSpell')}
  state.spellZones=state.spellZones.filter(z=>z.end>state.elapsed);
  const echoes=state.spellEchoes.filter(z=>z.at<=state.elapsed+1e-8);state.spellEchoes=state.spellEchoes.filter(z=>z.at>state.elapsed+1e-8);for(const z of echoes)apply(z.key,z.x,z.y,z.v,.5)
 }
 function slow(e){let factor=1;for(const z of state.spellZones)if(z.key==='frost'&&z.end>state.elapsed&&Math.hypot(e.x-z.x,e.y-z.y)<=z.radius)factor=Math.min(factor,1-z.amount);return factor}
 function fellowship(h){return owns('R-G10')?Math.min(.25,.05*state.removedClasses.filter(id=>id!==h.base.id).length):0}
 function snapshot(){return {loadout:loadout(),known:Object.keys(spells).filter(known),slots:slots(),armed:state.spellArmed,casts:state.spellCasts,cooldowns:Object.fromEntries(loadout().map(k=>[k,Math.max(0,(state.spellReady[k]||0)-state.elapsed)])),zones:state.spellZones.map(z=>({...z})),echoes:state.spellEchoes.length,captures:state.heroes.filter(h=>h.capture).map(h=>({hero:h.id,name:h.base.name,rescues:h.rescues||0,...h.capture,remaining:Math.max(0,h.capture.expires-state.elapsed)}))}}
 reset();return {reset,down,press,tick,arm,cancel,cast,pointer,slow,fellowship,snapshot,values,loadout,known,slots,captureTick};
}
const api={capture,spells,create};if(typeof module==='object'&&module.exports)module.exports=api;else root.FWBattleActions=api;
})(typeof window!=='undefined'?window:globalThis);
