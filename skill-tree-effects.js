/* Skill-tree technique effects. All unspecified magnitudes are provisional demo tuning, not final balance. */
(function(){
'use strict';
let api=null;const owned=id=>window.FWSkillTree?.has(id);
const NOW=()=>api.state.elapsed;
const enemies=()=>api.state.enemies.filter(e=>e.hp>0);
const heroes=()=>api.state.heroes.filter(h=>h.hp>0);
const near=(x,y,r)=>enemies().filter(e=>Math.hypot(e.x-x,e.y-y)<=r);
const dmg=(e,n,h)=>api.hitEnemy(e,n,h?.base?.color||'#f0cd99');
const circle=(x,y,r,col)=>api.visualRing(x,y,r,col||'#b7ddaa');
const hit=(e,h)=>Math.hypot(e.x-h.x,e.y-h.y);
const randEnemy=(x,y,r,excluded)=>near(x,y,r).filter(e=>e!==excluded)[0];
function focusBias(h,e){
 const towerDistance=Math.hypot(e.x,e.y),id=h.base.id;
 if(id==='knight'&&owned('T1-K-T01'))return towerDistance<2.4?2.2:0;
 if(id==='archer'&&owned('T1-A-T01'))return towerDistance<3?2:0;
 if(id==='hunter'&&owned('T2-H-T01')&&e.bleed)return 2.5;
 if(id==='paladin'&&owned('T3-P-T04')&&heroes().some(a=>a!==h&&a.hp<a.maxHp*.65&&hit(e,a)<1.8))return 2.4;
 if(id==='nun'&&owned('T3-N-T03')&&heroes().some(a=>a!==h&&a.hp<a.maxHp*.55&&hit(e,a)<1.8))return 2;
 if(id==='beastmaster'&&owned('T5-BM-T02')&&e.beastFocus>NOW())return 1.1;
 if(id==='priest'&&e.priestMarkUntil>NOW())return .45;
 if(id==='rogue'&&e.vulnerableUntil>NOW())return 1;
 return 0;
}
function specialTarget(h,e){
 if(h.base.id==='archer'&&owned('T1-A-T05')){
  const marked=enemies().filter(q=>q.arrowMarkUntil>NOW()&&Math.hypot(q.x-h.x,q.y-h.y)<=h.base.range+1);
  return marked[0]||e;
 }
 return e;
}
function afterBasic(h,e,d,isBear=false){
 const id=h.base.id,t=NOW(),count=(h.skillAttackCount=(h.skillAttackCount||0)+1);
 if(id==='knight'){
  if(owned('T1-K-T02')&&h.counterReady){dmg(e,d*.35,h);h.counterReady=false;circle(e.x,e.y,.55,'#e8e4d4');}
 }
 if(id==='archer'){
  if(owned('T1-A-T02')&&count%3===0){const other=near(e.x,e.y,1.85).filter(q=>q!==e&&((q.x-h.x)*(e.x-h.x)+(q.y-h.y)*(e.y-h.y))>0)[0];if(other)dmg(other,d*.55,h);}
  if(owned('T1-A-T05')){e.arrowMarks=(e.arrowMarks||0)+1;if(e.arrowMarks>=2){e.arrowMarkUntil=t+6;e.arrowMarks=0;}}
 }
 if(id==='mage'){
  if(owned('T1-MG-T01'))api.state.hazards.push({x:e.x,y:e.y,life:2.1,clock:0,radius:.86,damage:.42,color:'#e8a068',source:'mage'});
  if(owned('T1-MG-T02'))api.state.pendingHits.push({time:t+.35,target:e,damage:d*.30,color:'#e9b984',x:e.x,y:e.y});
  if(owned('T1-MG-T03'))e.fireRuneUntil=t+5;
 }
 if(id==='hunter'){
  if(owned('T2-H-T02')&&e.bleed){e.slowUntil=t+2.5;e.slowFactor=.70;}
  if(owned('T2-H-T05')&&e.bleed&&e.trappedUntil>t)dmg(e,d*.35,h);
 }
 if(id==='barbarian'){
  if(owned('T2-B-T02'))for(const q of near(h.x,h.y,1.7))api.pushEnemy(q,h.x,h.y,.14);
 }
 if(id==='rogue'){
  if(owned('T2-R-T03')&&count%4===0)e.vulnerableUntil=t+2.5;
  if(owned('T2-R-T04')&&h.smokeAmbushReady&&h.invisibleUntil<=t){dmg(e,d*.50,h);h.smokeAmbushReady=false;}
 }
 if(id==='paladin'){
  if(owned('T3-P-T01'))for(const a of heroes())if(Math.hypot(a.x-e.x,a.y-e.y)<1.2)a.patchShieldUntil=t+1.6;
 }
 if(id==='nun'){
  if(h.combo===0){
   if(owned('T3-N-T01')){if(h.lastComboTarget===e.id)h.comboPrimed=true;h.lastComboTarget=e.id;}
   if(owned('T3-N-T02'))e.stunnedUntil=Math.max(e.stunnedUntil||0,t+.28);
   if(owned('T3-N-T04'))for(const q of near(e.x,e.y,.9))if(q!==e)api.pushEnemy(q,h.x,h.y,.25);
  }else if(owned('T3-N-T01')&&h.combo===1&&h.comboPrimed){dmg(e,d*.25,h);h.comboPrimed=false;}
 }
 if(id==='priest'&&owned('T3-PR-T01'))e.priestMarkUntil=t+3;
 if(id==='shaman'){
  if(owned('T4-S-T01')){for(const q of near(e.x,e.y,1.4)){q.slowUntil=t+2.3;q.slowFactor=.75;}}
  if(owned('T4-S-T02'))api.state.hazards.push({x:e.x,y:e.y,life:2.8,clock:0,radius:.85,damage:.15,color:'#78d6c5',source:'shaman'});
  if(owned('T4-S-T05')&&h.vialEcho){h.vialEcho=false;for(const q of near(e.x,e.y,.9))dmg(q,d*.22,h);}
 }
 if(id==='druid'){
  if(isBear){
   if(owned('T4-D-T03'))for(const q of near(e.x,e.y,.8))if(q!==e)dmg(q,d*.40,h);
  }else{
   if(owned('T4-D-T01'))e.rootUntil=t+1.15;
   if(owned('T4-D-T02'))for(const a of heroes())if(Math.hypot(a.x-h.x,a.y-h.y)<2.1)a.shield=(a.shield||0)+.25;
  }
 }
 if(id==='warlock'){
  if(owned('T4-W-T01'))e.weakerUntil=t+2.8;
 }
 if(id==='beastmaster'){
  if(owned('T5-BM-T02'))e.beastFocus=t+6;
  if(owned('T5-BM-T03')&&!h.skillFollowupUntil||owned('T5-BM-T03')&&h.skillFollowupUntil<t){
   const ally=heroes().find(a=>a.summonKind==='hound'&&Math.hypot(a.x-e.x,a.y-e.y)<1.4);
   if(ally){dmg(e,ally.base.damage*.65,h);h.skillFollowupUntil=t+2.4;}
  }
 }
 if(id==='dragonkin'){
  if(owned('T5-DR-T01'))for(const q of near(e.x,e.y,1.05))if(q!==e)dmg(q,d*.30,h);
  if(owned('T5-DR-T04'))h.tauntUntil=t+2.2;
 }
}
function afterCast(h,target,spec){
 const t=NOW(),id=h.base.id;
 if(id==='knight'){
  if(owned('T1-K-T03'))for(const e of near(h.x,h.y,spec.bashRadius))api.pushEnemy(e,h.x,h.y,.35);
  if(owned('T1-K-T04'))h.tauntUntil=t+2.8;
 }
 if(id==='archer'){
  if(owned('T1-A-T03')&&target){for(const e of near(target.x,target.y,spec.volleyRadius))api.state.pendingHits.push({time:t+.22,target:e,damage:spec.volleyDamage*.25,color:h.base.color,x:h.x,y:h.y});}
  if(owned('T1-A-T04')&&target)for(const e of near(target.x,target.y,spec.volleyRadius)){e.slowUntil=t+2;e.slowFactor=.7;}
 }
 if(id==='mage'&&target){
  if(owned('T1-MG-T04')){const second=randEnemy(target.x,target.y,spec.chainJumpRange,target);if(second)dmg(second,spec.chainDamage*.45,h);}
  if(owned('T1-MG-T05'))for(const e of near(target.x,target.y,1.6))if(e.fireRuneUntil>t){e.fireRuneUntil=0;for(const q of near(e.x,e.y,.9))dmg(q,spec.chainDamage*.38,h);}
 }
 if(id==='hunter'){
  const trap=api.state.traps.at(-1);if(trap&&owned('T2-H-T03'))trap.radius*=1.22;
  if(trap&&owned('T2-H-T04'))trap.slow=Math.min(trap.slow,.3);
 }
 if(id==='barbarian'&&owned('T2-B-T03'))h.tauntUntil=t+2.5;
 if(id==='rogue'){
  if(owned('T2-R-T04'))h.smokeAmbushReady=true;
  if(owned('T2-R-T02')&&target){const dx=h.x-target.x,dy=h.y-target.y,dist=Math.max(.01,Math.hypot(dx,dy));const nx=target.x-dx/dist*.85,ny=target.y-dy/dist*.85;if(!api.nearTower(nx,ny,.4)&&Math.hypot(nx,ny)<api.tuning.shared.towerGuardRadius){h.x=nx;h.y=ny;}}
  if(owned('T2-R-T05'))api.state.totems.push({id:api.state.nextId++,x:h.x,y:h.y,hp:8,expires:t+2.6,radius:2.0,decoy:true});
 }
 if(id==='priest'&&owned('T3-PR-T03'))for(const a of heroes())if(a.blessingUntil>t)a.prayerShieldUntil=t+2.4;
 if(id==='shaman'&&owned('T4-S-T03')){const totem=api.state.totems.at(-1);if(totem)totem.radius*=1.2;}
 if(id==='druid'&&owned('T4-D-T05'))h.tauntUntil=t+2.5;
 if(id==='warlock'){
  if(owned('T4-W-T03')&&target){const other=near(target.x,target.y,3).find(e=>e!==target&&e.doom);if(other)dmg(other,spec.siphonDamage*.45,h);}
  if(owned('T4-W-T04'))h.shield=(h.shield||0)+Math.max(0,h.hp+spec.siphonHealAmount-h.maxHp);
 }
 if(id==='beastmaster'&&owned('T5-BM-T04')){const hs=heroes().filter(a=>a.summonKind==='hound'&&a.ownerId===h.id);hs.forEach((a,i)=>a.alphaBuffUntil=t+(i===0?0:4));}
 if(id==='dragonkin'){
  if(owned('T5-DR-T03')&&target)api.state.hazards.push({x:target.x,y:target.y,life:2.4,clock:0,radius:1,damage:.48,color:'#eaa261',source:'dragonkin'});
 }
}
function incoming(h,d,attacker){
 const t=NOW(),id=h.base.id;
 if(id==='knight'){
  if(owned('T1-K-T02')){h.counterHits=(h.counterHits||0)+1;if(h.counterHits>=3){h.counterReady=true;h.counterHits=0;d*=.8;}}
  if(owned('T1-K-T05')&&!h.lastStandUsed&&h.hp-d<=0){h.lastStandUsed=true;h.lastStandUntil=t+2.3;d=Math.max(0,h.hp-1);}
  if(h.lastStandUntil>t)d*=.20;
 }
 if(id==='barbarian'&&owned('T2-B-T05')&&h.hp<h.maxHp*.28)d*=.70;
 if(id==='paladin'&&owned('T3-P-T05')&&h.shield>0&&d>=h.shield){
  for(const e of near(h.x,h.y,1.5))api.pushEnemy(e,h.x,h.y,.35);
 }
 if(h.patchShieldUntil>t||h.prayerShieldUntil>t)d*=.8;
 if(id==='dragonkin'&&owned('T5-DR-T02')&&attacker&&attacker.hp>0){dmg(attacker,.55,h);attacker.burnUntil=t+1.4;}
 if(id==='beastmaster'&&owned('T5-BM-T05')){const guard=heroes().find(a=>a.summonKind==='hound'&&a.ownerId===h.id&&Math.hypot(a.x-h.x,a.y-h.y)<1.6);if(guard){const share=d*.3;guard.hp=Math.max(0,guard.hp-share);d-=share;}}
 return d;
}
function afterHeroHit(h){
 if(h.hp<=0&&h.base.id==='priest'&&owned('T3-PR-T04'))for(const ally of heroes())if(ally.blessingUntil>NOW())ally.blessingUntil+=2;
 if(h.hp>0||!owned('T3-P-T03'))return;
 const t=NOW();if(!h.shield||h.shield<=0)return;
 const other=heroes().find(a=>a!==h&&Math.hypot(a.x-h.x,a.y-h.y)<2.5);if(other){other.shield=(other.shield||0)+h.shield;other.shieldUntil=t+3;h.shield=0;}
}
function enemyDeath(e){
 const t=NOW(),killedBy=e.lastHitHero;
 if(killedBy==='barbarian'&&owned('T2-B-T01'))for(const h of heroes())if(h.base.id==='barbarian'&&h.frenzyUntil>t)h.frenzyUntil=Math.min(h.frenzyUntil+1,t+8);
 if(owned('T3-PR-T05'))for(const h of heroes())if(h.blessingUntil>t)h.blessingUntil=Math.min(h.blessingUntil+.8,t+8);
 if(e.doom&&owned('T4-W-T02'))api.state.hazards.push({x:e.x,y:e.y,life:2.2,clock:0,radius:1,damage:.32,color:'#b67acc',source:'warlock'});
 if(e.doom&&owned('T4-W-T05')&&!e.chainDoom){
  const next=randEnemy(e.x,e.y,1.7,e);if(next&&!next.doom){next.doom=true;next.chainDoom=true;}
 }
 if(owned('T5-NE-T01'))for(const h of heroes())if(h.base.id==='necromancer'&&h.beamTarget===e.id){h.beamStoredRamp=h.beamTime*.45;h.beamTransferUntil=t+1.0;}
}
function totemDestroyed(totem){
 if(totem.spiritBurst)return;totem.spiritBurst=true;
 if(owned('T4-S-T04'))for(const e of near(totem.x,totem.y,1.65))e.weakUntil=NOW()+2.7;
 if(owned('T4-S-T05'))for(const h of heroes())if(h.base.id==='shaman')h.vialEcho=true;
}
function tick(dt){
 const t=NOW();
 if(owned('T4-S-T04')||owned('T4-S-T05'))for(const totem of api.state.totems)if(totem.hp<=0)totemDestroyed(totem);
 if(owned('T2-H-T02'))for(const e of enemies())if(e.bleed){e.slowUntil=t+.22;e.slowFactor=.7;}
 if(owned('T3-P-T02'))for(const patch of api.state.hazards)if(patch.color==='#e7bf62')for(const e of near(patch.x,patch.y,patch.radius)){e.slowUntil=t+.2;e.slowFactor=.7;}
 if(owned('T4-W-T01'))for(const e of enemies())if(e.doom)e.weakerUntil=t+.4;
}
function summonPriority(h,e){
 if(h.summonKind==='undead'){
  if(owned('T5-NE-T02')){const owner=heroes().find(a=>a.id===h.ownerId);if(owner?.beamTarget===e.id)return -.65;}
  if(owned('T5-NE-T03'))return Math.hypot(e.x,e.y)*.12;
 }
 if(h.summonKind==='hound'&&owned('T5-BM-T02')&&e.beastFocus>NOW())return -.75;
 return 0;
}
function beamRampBoost(h){
 let m=1;if(owned('T5-NE-T05'))m+=Math.min(.5,heroes().filter(a=>a.summonKind==='undead'&&Math.hypot(a.x-h.x,a.y-h.y)<3).length*.12);
 return m;
}
window.FWSkillEffects={connect(x){api=x},afterBasic,afterCast,incoming,afterHeroHit,enemyDeath,tick,focusBias,specialTarget,summonPriority,beamRampBoost};
})();