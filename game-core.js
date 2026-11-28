/* Simulation, combat, AI, spawning, progression and player actions. */
(()=>{'use strict';
const {HEROES,HEROES_PER_PACK,PACKS,HERO_MAP,ENCOUNTERS,TUNING,ABILITIES,HOUND,UNDEAD,SPAWN_CONFIG}=window.FWGameData;
const QUICK_STATS=window.FWQuickStats,M=window.FWMerchant,PRE=window.FWPrestigeEnemies,E=window.FWEndless;
const ARCADE=window.FWArcade;
const BALANCE=window.FWBalance.profile; // Never changes the normal game's approved stats.
const encounter=()=>ENCOUNTERS[Math.max(0,Math.min(9,state.stage-1))];

// Build 0.6 editable DEMO tuning: all non-core numerics are explicitly provisional.
// Each current hero has one authoritative core record in HEROES and an attached combat tuning record.
const cfg=(h)=>TUNING.heroes[h.base.id];
const heroTune=(h,key)=>cfg(h)?.special?.[key];
const chargeSeconds=h=>cfg(h)?.special.chargeSeconds??TUNING.shared.specialChargeSeconds;
const acquireRadius=h=>cfg(h)?.acquisitionRange??TUNING.shared.acquisitionRange;
const guardRadius=h=>cfg(h)?.towerGuardRadius??TUNING.shared.towerGuardRadius;
const isOriginalHero=h=>Boolean(TUNING.heroes[h.base.id]);
const $=id=>document.getElementById(id);
const canvas=$('arena'),ctx=canvas.getContext('2d',{alpha:false});
const refs={stage:$('stageValue'),coins:$('coinValue'),tower:$('towerValue'),hp:$('hpMeter'),kills:$('killValue'),total:$('totalValue'),phase:$('phaseLabel'),dot:$('phaseDot'),battleDetail:$('battleDetail'),count:$('packCount'),buy:$('buyButton'),start:$('stageButton'),pause:$('pauseButton'),restart:$('restartButton'),formation:$('formation'),formationCount:$('formationCount'),events:$('events'),shopTitle:$('shopTitle'),shopDescription:$('shopDescription'),overlay:$('messageOverlay'),messageSymbol:$('messageSymbol'),messageTitle:$('messageTitle'),messageText:$('messageText'),messageButton:$('messageButton'),captionLeft:$('captionLeft'),captionRight:$('captionRight'),modal:$('revealModal'),revealTitle:$('revealTitle'),revealDesc:$('revealDescription'),revealButton:$('revealButton'),sealed:$('sealedPack'),drawGrid:$('drawGrid'),testPanel:$('testingPanel'),testStatus:$('testingStatus'),testToggle:$('testingToggle'),testControls:$('testingControls'),testGrid:$('testingGrid'),specials:$('specialValue'),acquireTune:$('acquireTune'),guardTune:$('guardTune'),chargeTune:$('chargeTune'),testQueueCount:$('testQueueCount'),clearTest:$('clearTestQueue'),packProgress:$('packProgress'),testStage:$('testStage'),treeTiers:$('treeTiers'),revealKicker:$('revealKicker'),revealFoot:$('revealFoot'),wavePhase:$('wavePhase'),waveStats:$('waveStats'),waveMeter:$('waveMeter'),waveNext:$('waveNext'),waveUP:$('waveUP'),waveBoss:$('waveBoss'),waveBossName:$('bossName'),waveBossHP:$('bossHP'),waveBossMeter:$('bossHPMeter'),battleReport:$('battleReport')};
const state={stage:1,coinMax:BALANCE.economy.startingCoinMax,coins:BALANCE.economy.startingCoinMax,towerHp:BALANCE.economy.startingTowerHP,towerMax:BALANCE.economy.startingTowerHP,shopSlots:3,shopOffers:[],selectedSlot:0,packQueue:[],shopPage:0,selectedPack:0,currentRevealPack:0,mode:'prep',paused:false,bought:0,packsToOpen:0,heroes:[],enemies:[],effects:[],notifications:[],regularSpawned:0,bossSpawned:false,kills:0,bossKilled:false,elapsed:0,spawnClock:0,bossWaitClock:0,uiClock:0,pendingPack:false,openedHeroes:null,testMode:false,testQueue:[],testSavedTowerHp:null,testSavedStage:null,sanctuaries:[],hazards:[],pendingHits:[],totems:[],traps:[],abilityCasts:0,lastTime:0,nextId:1,combatTelemetry:{overlaps:0,targetSwitches:0,blocked:0},upEarned:0,upDrops:0,deployedHeroes:0,lastReport:null};
const SKILLS=window.FWSkillTree, SKILLFX=null; // Retire historical techniques; new effects register explicitly.
const SHOP_SAVE_KEY=document.body.classList.contains('lab-mode')?'fantasy-warriors-lab-shop-1.16-tree2':'fantasy-warriors-shop-1.16-tree2';
let initialising=true;
function saveShopStock(){
 if(initialising||state.endlessHub||state.mode!=='prep'||state.testMode||SKILLS?.sandboxActive?.())return;
 try{localStorage.setItem(SHOP_SAVE_KEY,JSON.stringify({stage:state.stage,endlessWave:state.endlessWave||0,endlessId:SKILLS?.endlessState().session?.id||null,resets:SKILLS?.debug()?.resets??0,coins:state.coins,shop:state.merchantShop,id:state.merchantAttemptId,selectedSlot:state.selectedSlot}));}catch(e){}
}
function restoreShopStock(){
 if(state.mode!=='prep')return false;
 try{
  const x=JSON.parse(localStorage.getItem(SHOP_SAVE_KEY)),m=SKILLS?.merchantState?.(),shop=x?.shop;
  if(!x||x.stage!==state.stage||(x.endlessWave||0)!==(state.endlessWave||0)||(x.endlessId||null)!==(SKILLS?.endlessState().session?.id||null)||x.resets!==(SKILLS?.debug()?.resets??0)||typeof x.id!=='string'||x.id===m?.lastCommit)return false;
  if(!shop||!Array.isArray(shop.offers)||shop.offers.length<3||shop.offers.length>6||!Array.isArray(shop.tiers)||!Array.isArray(shop.flags)||!shop.tiers.includes(0))return false;
  if(!shop.tiers.every(i=>Number.isInteger(i)&&i>=0&&i<5&&SKILLS.isTierOpen(i+1))||shop.flags.some(id=>!m.flags.includes(id)))return false;
  if(!shop.offers.every(o=>o&&['standard','individual','double','triple','box','golden','mixed'].includes(o.type)&&shop.tiers.includes(o.packIndex)&&Number.isInteger(o.qty)&&o.qty>=1&&o.qty<=3&&Number.isInteger(o.listPrice)&&o.listPrice>=o.qty&&typeof o.sold==='boolean'&&(!o.heroId||HERO_MAP[o.heroId])&&(o.type!=='mixed'||shop.tiers.includes(o.other))))return false;
  if(!Number.isFinite(x.coins)||x.coins<0||x.coins>state.coinMax)return false;
  state.merchantShop=shop;state.shopOffers=shop.offers;state.merchantAttemptId=x.id;state.bought=shop.offers.filter(o=>o.sold).length;state.packQueue=shop.offers.filter(o=>o.sold).map(o=>o.packIndex);state.coins=x.coins;state.selectedSlot=Number.isInteger(x.selectedSlot)?x.selectedSlot:0;state.shopCacheKey='';updateUI();return true;
 }catch(e){return false;}
}
function applyShopTheft(){if(state.testMode||!state.merchantShop)return;const floor=M.price(state.shopOffers[0],state.merchantShop),lost=SKILLS?.applyTheft(state.merchantAttemptId,state.coins,floor)||0;state.coins-=lost;if(lost)log('Goblin Thief stole '+lost+' coins from this preparation.');}
function clearShopStock(){if(state.testMode||SKILLS?.sandboxActive?.())return;try{localStorage.removeItem(SHOP_SAVE_KEY);}catch(e){}}

const {view,resize,render}=window.FWGameRenderer.create({canvas,ctx,state,ENCOUNTERS,TUNING,clamp,cfg,chargeSeconds,isOriginalHero});
const ACTIONS=window.FWBattleActions.create({state,owns:id=>!!SKILLS?.has(id),equipped:()=>SKILLS?.spellLoadout()||[],hitEnemy,healHero,ring:visualRing,log});
const BOSSES=window.FWBossAbilities.create({state,heroList:()=>state.heroes.filter(h=>h.hp>0),hitHero,hitTower:applyTowerDamage,spawnGenerated,ring:visualRing,beam:visualBeam,scale:signatureScale,arenaRadius:e=>Math.hypot(view.worldW/2+Math.abs(e.x),view.worldH/2+Math.abs(e.y))+.01,log});
const TOWER_FIRE=window.FWTowerFire.create({canvas,ctx,view,state,config:BALANCE.towerFire,hitEnemy,addEffect,intercept:(x,y)=>{if(state.mode==='battle'&&state.paused)return true;if(Math.abs(x)>view.worldW/2||Math.abs(y)>view.worldH/2)return true;const handled=ACTIONS.pointer(x,y);if(handled)updateUI();return handled;},aimBlocked:()=>!!state.spellArmed||(state.mode==='battle'&&state.paused),previewRadius:()=>state.spellArmed?ACTIONS.values(state.spellArmed).radius:0});
function rand(a,b){return a+Math.random()*(b-a)}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function chooseHero(packIndex=0){const pool=PACKS[packIndex].pool;return HERO_MAP[pool[Math.floor(Math.random()*pool.length)]]}

const {normalInterval:NORMAL_SPAWN_INTERVAL,bossClearDelay:BOSS_AFTER_CLEAR_DELAY}=SPAWN_CONFIG;
function endlessPlan(){return state.endlessWave?E.wave(state.endlessWave):null}
function regularCount(){return endlessPlan()?.slots??BALANCE.stages[state.stage-1]?.slots??SPAWN_CONFIG.regularWaveBase}
function currentPrestige(){return state.testMode?(state.testPrestige||0):(SKILLS?.prestigeCount()||0)}
function wavePlan(){const w=endlessPlan(),p=currentPrestige(),plan=PRE.plan(state.stage,regularCount(),p,w?false:state.testMode?!state.testPreviouslyAttempted:!SKILLS?.attempted(state.stage));if(w)plan.faction=E.invasion(w.wave,p);return plan}
function totalCount(){return regularCount()+(endlessPlan()&&!endlessPlan().boss?0:1)+((state.mode==='battle'||state.mode==='over'||state.mode==='clear'||state.mode==='champion'?state.wavePlan:wavePlan())?.faction?3:0)}
function spawnScheduled(){const kind=PRE.slotKind(state.wavePlan,state.regularSpawned,state.enemies.filter(e=>e.elite&&e.hp>0).length);spawnEnemy(false,kind);state.regularSpawned++}
function rawSpawnInterval(){
 const w=SPAWN_CONFIG.wavePhases,p=state.regularSpawned/Math.max(1,regularCount()-1);
 if(p<w.openingFraction)return w.openingStart+(w.openingEnd-w.openingStart)*(p/w.openingFraction);
 if(p<w.middleEndFraction)return w.openingEnd+(w.middleEnd-w.openingEnd)*((p-w.openingFraction)/(w.middleEndFraction-w.openingFraction));
 return w.finalInterval;
}
function nextSpawnInterval(){const n=rawSpawnInterval();return state.endlessWave?E.interval(n):n}
function waveScale(stats,mutated=false){return PRE.scale(state.endlessWave?E.scale(stats,state.endlessWave):stats,state.wavePlan?.p??currentPrestige(),mutated)}
function signatureScale(){return PRE.factors(state.wavePlan.p).hpDamage*(endlessPlan()?.damage??1)}
function log(message){state.notifications.unshift(message);state.notifications.length=Math.min(5,state.notifications.length);refs.events.replaceChildren(...state.notifications.map(t=>{const li=document.createElement('li');li.textContent=t;return li}))}
function addEffect(e){state.effects.push(e);if(state.effects.length>160)state.effects.shift()}
function damageNumber(x,y,text,color){addEffect({kind:'number',x,y,text:String(text),color,life:.8,maxLife:.8})}
function createHero(base,skin=null){if(state.testMode&&HERO_MAP[base.id]===base&&QUICK_STATS)base=QUICK_STATS.heroForBattle(base);skin=skin||window.FWSkins.draw(HEROES,base.id,[],()=>0);base=window.FWSkins.apply(base,skin);const hero={skin,skinMultiplier:skin.multiplier,id:state.nextId++,base,x:0,y:0,hp:base.hp,maxHp:base.hp,cooldown:rand(0,.45),facing:0,combo:0,beamTarget:null,beamTime:0,beamTickClock:0,charge:0,casts:0,abilityStatus:"charging",activeUntil:0,shield:0,shieldUntil:0,blessingUntil:0,frenzyUntil:0,invisibleUntil:0,bearUntil:0,sanctuaryUntil:0,summonKind:null,expiry:Infinity,anchorX:0,anchorY:0,radius:base.id==='dragonkin'||base.id==='paladin'||base.id==='barbarian'?.45:.35,vx:0,vy:0,targetId:null,targetClock:rand(0,.25),lastTargetSwitch:-10,slotIndex:-1,slotTarget:null,windupTime:0,windupTarget:null,attackState:'idle',hitFlash:0};if(SKILLS&&cfg(hero)?.special.trigger==='autoCharge')hero.charge=chargeSeconds(hero)*Math.min(1,SKILLS.startCharge());if(SKILLS){hero.shield=hero.maxHp*SKILLS.startShield();hero.shieldUntil=hero.shield>0?Infinity:0;}state.heroes.push(hero);placeNewHero(hero);return hero}
// Place ONLY the new hero. Never rearrange a previously deployed unit.
function placeNewHero(h){
 const others=state.heroes.filter(a=>a!==h&&a.hp>0);
 const p=ARCADE.heroPosition(others,view.worldW,view.worldH,SPAWN_CONFIG,Math.random,h.radius);
 h.x=p.x;h.y=p.y;h.anchorX=p.x;h.anchorY=p.y;
 h.initialSpawnRadius=p.distance;
 // Heroes initially face away from the tower, defending their local sector.
 h.facing=p.angle+Math.PI/2;
}

function spawnEnemy(boss,kind='basic',at=null){
 const halfW=view.worldW/2-.85,halfH=view.worldH/2-.85;let x,y;
 if(at){x=clamp(at.x,-halfW,halfW);y=clamp(at.y,-halfH,halfH);const safe=safeGoal(x,y);x=clamp(safe.x,-halfW,halfW);y=clamp(safe.y,-halfH,halfH);}
 else if(Math.random()<.55){x=(Math.random()<.5?-1:1)*halfW;y=rand(-halfH,halfH);}
 else{y=(Math.random()<.5?-1:1)*halfH;x=rand(-halfW,halfW);}
 const w=endlessPlan(),family=boss&&w?w.boss:state.stage,profile=BALANCE.stages[family-1];
 const faction=kind==='faction',base=w?(boss?E.boss(BALANCE.stages,family):kind==='elite'?E.elite(BALANCE.stages,family):E.basic(BALANCE.stages,family)):boss?profile.boss:kind==='elite'?profile.elite:profile.basic;
 // Stationary bone piles must be reachable within the defenders' normal combat area.
 if(kind==='elite'&&state.stage===8){const angle=Math.random()*Math.PI*2,d=rand(2.6,4.2),q=safeGoal(Math.cos(angle)*d,Math.sin(angle)*d);x=clamp(q.x,-halfW,halfW);y=clamp(q.y,-halfH,halfH)}
 const overrides=state.testMode&&QUICK_STATS&&!faction&&(kind==='basic'||kind==='mutated'||boss)?(boss?QUICK_STATS.snapshot().boss[state.stage]:QUICK_STATS.snapshot().minion):null;
 const phaseBase=boss&&!faction&&family===10&&!w?{...base,...profile.boss.phases[0]}:base;const raw={...phaseBase,...(overrides||{})};
 const p=state.wavePlan?.p??currentPrestige(),mutated=kind==='mutated',stats=faction?(w?waveScale({...PRE.legion(family,state.factionSpawned,E.boss(BALANCE.stages,family).damage,0),hp:Math.floor(84*[1,.8,1.2][state.factionSpawned]+.5)}):PRE.legion(family,state.factionSpawned,profile.boss.damage,p)):waveScale(raw,mutated);
 const hp=stats.hp,elite=kind==='elite',generated=kind==='generated';
 const e={id:state.nextId++,x,y,hp,maxHp:hp,boss,elite,generated,scheduled:!boss&&!generated,stage:family,speed:stats.speed,damage:stats.damage,
  attackPeriod:stats.attackPeriod??1,firstDelay:stats.firstDelay??SPAWN_CONFIG.minionFirstAttackWindup,cooldown:rand(0,.5),
  inAttackRange:false,radius:boss?.75:elite?.48:.35,vx:0,vy:0,targetId:null,hitFlash:0,
  towerLane:((state.nextId*7)%11-5)*.13,kind:faction?'faction':boss?'boss':kind,phase:boss?1:0,mutated,faction,factionIndex:stats.factionIndex,name:faction?stats.name:boss?ENCOUNTERS[family-1].boss:elite?PRE.eliteNames[family-1]:null,nextAbility:state.elapsed+(faction?10:((!elite&&state.stage===9?10:[10,6,0,12,9,11,0,0,9,10][state.stage-1])||Infinity)),firstShield:(faction&&stats.factionIndex===0)||(!boss&&!elite&&!generated&&state.stage===5),ethereal:!boss&&!elite&&!generated&&state.stage===8};
 state.enemies.push(e);if(boss&&!faction)BOSSES.init(e);return e;
}
// Walk speed comes from each hero’s approved STATS entry, not a universal speed.
const TOWER_BLOCK=1.36;     // tower half-width + hero safety margin (map units)
const CORNER_DIST=1.73;     // navigation corners outside tower footprint
function insideTower(x,y,block=TOWER_BLOCK){return Math.abs(x)<block&&Math.abs(y)<block}
function segmentHitsTower(ax,ay,bx,by,block=TOWER_BLOCK){
 let near=0,far=1;const vx=bx-ax,vy=by-ay;
 for(const [origin,delta] of [[ax,vx],[ay,vy]]){
  if(Math.abs(delta)<1e-8){if(origin<=-block||origin>=block)return false;continue}
  const lo=(-block-origin)/delta,hi=(block-origin)/delta;
  near=Math.max(near,Math.min(lo,hi));far=Math.min(far,Math.max(lo,hi));
  if(far<near)return false;
 }
 return near<far&&far>0&&near<1;
}
function safeGoal(x,y,block=TOWER_BLOCK){
 if(!insideTower(x,y,block))return{x,y};
 // All actors must route toward a safe exterior point at the tower boundary;
 // find the nearest exterior position for approaching heroes.
 const edge=block+.04;
 if(Math.abs(x)>Math.abs(y))return{x:Math.sign(x||1)*edge,y};
 return{x,y:Math.sign(y||1)*edge};
}
function heroWaypoint(x,y,gx,gy,block=TOWER_BLOCK){
 const dest=safeGoal(gx,gy,block);
 // The physical rounded corner may legally contain an actor inside its conservative navigation square.
 // Move outward first rather than attempting an impossible visibility-graph connection.
 if(insideTower(x,y,block))return safeGoal(x,y,block);
 if(!segmentHitsTower(x,y,dest.x,dest.y,block))return dest;
 const c=block+.37;
 const pts=[{x,y},dest,{x:-c,y:-c},{x:c,y:-c},{x:c,y:c},{x:-c,y:c}];
 const dist=Array(6).fill(Infinity),prev=Array(6).fill(-1),used=Array(6).fill(false);dist[0]=0;
 for(let i=0;i<6;i++){
  let u=-1;for(let j=0;j<6;j++)if(!used[j]&&(u<0||dist[j]<dist[u]))u=j;
  if(u<0||!Number.isFinite(dist[u]))break;
  if(u===1)break;used[u]=true;
  for(let v=1;v<6;v++){
   if(v===u||used[v]||segmentHitsTower(pts[u].x,pts[u].y,pts[v].x,pts[v].y,block))continue;
   const next=dist[u]+Math.hypot(pts[v].x-pts[u].x,pts[v].y-pts[u].y);
   if(next<dist[v]){dist[v]=next;prev[v]=u}
  }
 }
 if(!Number.isFinite(dist[1]))return{x,y};
 let at=1;while(prev[at]>0)at=prev[at];
 return pts[at];
}
function moveHeroAroundTower(hero,enemy,dt){
 let target=heroWaypoint(hero.x,hero.y,enemy.x,enemy.y);
 let vx=target.x-hero.x,vy=target.y-hero.y,dist=Math.hypot(vx,vy);
 if(dist<1e-7)return;
 const move=Math.min(hero.base.walk*dt,dist);
 const nx=hero.x+vx/dist*move,ny=hero.y+vy/dist*move;
 if(!insideTower(nx,ny)){hero.x=nx;hero.y=ny}
}
function applyTowerDamage(amount){if(SKILLS&&SKILLS.has('T5-G04')&&!state.lastTowerShield&&state.towerHp/state.towerMax<.35){state.lastTowerShield=true;state.towerShield=state.towerMax*.25;log('Fortress Last Resort shield activated!')}if(state.towerShield>0){const absorbed=Math.min(amount,state.towerShield);state.towerShield-=absorbed;amount-=absorbed}state.towerHp=clamp(state.towerHp-amount,0,state.towerMax);damageNumber(.2,-1.1,'−'+amount,'#ff9682');if(state.towerHp===0)gameOver()}
function visualBeam(h,e,color=h.base.color,life=.18){addEffect({kind:'bolt',x1:h.x,y1:h.y,x2:e.x,y2:e.y,color,life,maxLife:life})}
function visualRing(x,y,r,color){addEffect({kind:'pulse',x,y,radius:r,color,life:.36,maxLife:.36})}
// Damage source is an explicit hero-class ID, never inferred from animation colours.
function heroSourceId(h){return !h?null:h.summonKind?(h.ownerHeroId||null):(isOriginalHero(h)?h.base.id:null)}
function hitEnemy(e,damage,color,sourceHeroId=null,ownerId=null,kind='direct'){if(!e||e.hp<=0||!(damage>0)||e.ethereal&&!(e.vulnerableUntil>state.elapsed))return 0;if(e.firstShield){e.firstShield=false;visualRing(e.x,e.y,.7,'#f7cf91');return 0}damage=PRE.damageAfterResistance(damage,e,state.enemies,kind==='hunterBleed'&&owns('V2-HUN-01'));const heroId=typeof sourceHeroId==='string'&&HERO_MAP[sourceHeroId]?sourceHeroId:null;if(heroId&&e.boss&&SKILLS?.has('O-5-G2'))damage*=1.25;if(heroId&&e.priestBrandUntil>state.elapsed&&heroId!=='priest')damage*=1.15;e.lastHitHero=heroId;e.lastHitOwner=ownerId;e.lastHitKind=kind;if(heroId&&kind==='direct'){e.directHits??={};e.directHits[ownerId??heroId]=state.elapsed;}const dealt=Math.min(e.hp,damage);const n=Number(Math.abs(damage).toFixed(1));e.hp-=damage;e.hitFlash=.11;if(damage>=.2)damageNumber(e.x,e.y-.15,n.toFixed(1),color);return dealt}
const owns=id=>!!SKILLS?.has(id);
function grantCharge(h,fraction){if(h&&h.hp>0&&cfg(h)?.special.trigger==='autoCharge')h.charge=Math.min(chargeSeconds(h),h.charge+fraction*chargeSeconds(h))}
function healHero(h,amount){if(h.hp<=0)return 0;const n=Math.min(h.maxHp-h.hp,Math.max(0,amount)*(owns('O-3-G2')&&!h.summonKind?1.25:1));h.hp+=n;return n}
function ownStatuses(e,h,kind){return (e.treeStatuses||[]).filter(a=>a.owner===h.id&&a.kind===kind&&a.remaining>0)}
function applyStatus(e,h,kind,total,duration,cap=1){if(e.hp<=0||!(total>0))return;const life=duration*(owns('O-4-G2')?1.25:1);e.treeStatuses??=[];const interval=kind==='hunterBleed'?.5:.25;const entry={owner:h.id,heroId:h.base.id,kind,remaining:life,tick:interval,interval,dps:total/life};const matches=e.treeStatuses.map((a,i)=>({a,i})).filter(x=>x.a.owner===h.id&&x.a.kind===kind);if(matches.length>=cap){const oldest=matches.reduce((a,b)=>a.a.remaining<=b.a.remaining?a:b);e.treeStatuses[oldest.i]=entry}else e.treeStatuses.push(entry)}
function hunterBleed(e,h){applyStatus(e,h,'hunterBleed',h.base.damage*.25*(owns('O-2-H-A2')?1.5:1),3,owns('O-2-H-A3')?3:1)}
function grantShield(h,n,seconds,owner=null,cast=null){if(h.hp<=0||h.summonKind)return;if(n>=(h.shield||0)){h.shield=n;h.shieldUntil=state.elapsed+seconds;h.shieldOwner=owner;h.shieldCast=cast}}
function timedDamage(h,n){if(!owns('O-4-G3'))return n;return ((h.damagingSpecials||0)+1)%5===0?n*1.5:n}
function finishDamagingSpecial(h){h.damagingSpecials=(h.damagingSpecials||0)+1}
function perHeroKill(e){if(e.boss||!e.scheduled)return;const h=state.heroes.find(h=>h.id===e.lastHitOwner&&h.hp>0&&!h.summonKind);if(!h)return;h.personalKills=(h.personalKills||0)+1;if(owns('O-2-G4')&&h.personalKills%5===0)healHero(h,h.maxHp*.05);if(owns('O-4-G5')&&h.personalKills%10===0)grantCharge(h,.15);if(h.base.id==='hunter'&&e.lastHitKind==='hunterBleed'&&owns('O-2-H-A5'))healHero(h,h.maxHp*.05);if(h.base.id==='barbarian'&&h.frenzyUntil>state.elapsed){h.frenzyKills=(h.frenzyKills||0)+1;if(owns('O-2-B-B3')&&(h.frenzyExtra||0)<3){h.frenzyUntil+=.5;h.frenzyExtra=(h.frenzyExtra||0)+.5}}if(h.base.id==='priest'&&owns('O-3-PR-A5'))grantCharge(h,.15);if(h.base.id==='druid'&&h.bearUntil<=state.elapsed&&owns('O-4-D-A5'))grantCharge(h,.10);if(h.blessingUntil>state.elapsed){h.blessedKills=(h.blessedKills||0)+1;if(owns('O-3-PR-B5')&&h.blessedKills%3===0)grantCharge(h,.10);if(owns('V2-PRI-01')&&h.blessedKills%5===0)healHero(h,h.maxHp*.05)}}

function burning(e){return !!e.treeStatuses?.some(a=>a.kind==='burn'&&a.remaining>0)}
function critChance(){return owns('O-1-A-A4')?.35:owns('O-1-A-A2')?.20:0}
function enemiesInRadius(x,y,r){const rr=r*r;return state.enemies.filter(e=>e.hp>0&&(e.x-x)**2+(e.y-y)**2<=rr)}
function pushEnemy(e,fromX,fromY,dist){if(e.capturing||e.boss)return;const dx=e.x-fromX,dy=e.y-fromY,len=Math.max(.01,Math.hypot(dx,dy));e.x=clamp(e.x+dx/len*dist,-view.worldW/2+.8,view.worldW/2-.8);e.y=clamp(e.y+dy/len*dist,-view.worldH/2+.8,view.worldH/2-.8)}
function pointSegmentDistance(x,y,ax,ay,bx,by){const vx=bx-ax,vy=by-ay;const t=clamp(((x-ax)*vx+(y-ay)*vy)/(vx*vx+vy*vy||1),0,1);return Math.hypot(x-ax-t*vx,y-ay-t*vy)}
// Numerical secondary effects are temporary demonstrations. Only the basic-attack concepts are approved.
function hitHero(h,d,source,linked=false){const before=h.hp;
 if(!(d>0)||h.hp<=0||h.rescueInvulnerableUntil>state.elapsed)return 0;
 if(h.base.id==='knight'&&owns('R-KNI-B')){h.incomingCount=(h.incomingCount||0)+1;if(h.incomingCount%5===0)d*=.5}
 if(h.base.id==='knight'&&owns('O-1-K-A2')&&Math.random()<(owns('O-1-K-A4')?.40:.25)){
  d*=.5;if(owns('V2-KNI-01')&&state.elapsed-(h.lastBlockHeal??-Infinity)>=2){h.lastBlockHeal=state.elapsed;healHero(h,h.maxHp*.05)}
  if(owns('O-1-K-A3')&&source?.hp>0&&state.enemies.includes(source)&&state.elapsed-(h.lastCounter??-Infinity)>=1){h.lastCounter=state.elapsed;hitEnemy(source,h.base.damage*.5,h.base.color,h.base.id,h.id)}
  if(owns('O-1-K-A5')&&state.elapsed-(h.lastBlockCharge??-Infinity)>=2){h.lastBlockCharge=state.elapsed;grantCharge(h,.10)}
 }
 if(h.resolveUntil>state.elapsed)d*=.75;if(h.aegisGuardUntil>state.elapsed)d*=.75;if(h.base.id==='barbarian'&&h.frenzyUntil>state.elapsed&&owns('O-2-B-B4'))d*=.75;if(h.base.id==='druid'&&h.bearUntil>state.elapsed)d*=owns('O-4-D-B5')?.7:.85;if(h.base.id==='dragonkin'&&owns('O-5-DR-A4'))d*=.8;
 if(h.shield>0){const absorb=Math.min(h.shield,d);h.shield-=absorb;d-=absorb;if(h.shield<=0&&h.shieldOwner!=null){const pal=state.heroes.find(a=>a.id===h.shieldOwner&&a.hp>0);if(pal&&owns('O-3-P-B5'))h.aegisGuardUntil=state.elapsed+3;if(pal&&owns('R-PAL-D')&&pal.aegisCast===h.shieldCast&&(pal.aegisRefund||0)<.2){pal.aegisRefund=(pal.aegisRefund||0)+.1;grantCharge(pal,.10)}if(pal&&owns('V2-PAL-02')){pal.brokenShields=(pal.brokenShields||0)+1;if(pal.brokenShields%5===0&&state.elapsed-(pal.lastBreakCharge??-Infinity)>=2){pal.lastBreakCharge=state.elapsed;grantCharge(pal,.25)}}h.shieldOwner=null;h.shieldCast=null}}
 if(d>0){h.hp=Math.max(0,h.hp-d);h.hitFlash=.11;if(h.base.id==='paladin'&&owns('O-3-P-A3')){h.damageHits=(h.damageHits||0)+1;if(h.damageHits%5===0)h.nextHammer=true}if(h.base.id==='dragonkin'&&owns('O-5-DR-A3')&&source?.hp>0&&state.enemies.includes(source))applyStatus(source,h,'burn',h.base.damage*.2,3);if(h.base.id==='dragonkin'&&owns('O-5-DR-A5')&&h.hp>0&&h.hp<h.maxHp*.25&&!h.dragonHeart){h.dragonHeart=true;healHero(h,h.maxHp*.2);grantCharge(h,1)}if(h.hp>0&&h.hp<h.maxHp*.25&&owns('O-5-G4')&&!h.summonKind&&!h.resolveUsed){h.resolveUsed=true;h.resolveUntil=state.elapsed+5}}
 if(h.hp<=0&&isOriginalHero(h)){if(source?.elite&&source.stage===3&&!state.testMode)SKILLS?.stealCoin();ACTIONS.down(h,source);}
 BOSSES.share(h,Math.min(before,d),source,linked);return Math.min(before,d)
}
function spawnSummon(base,atX,atY,kind,duration,ownerId){const s={id:state.nextId++,base,x:atX,y:atY,hp:base.hp,maxHp:base.hp,cooldown:.2,facing:0,charge:0,casts:0,shield:0,invisibleUntil:0,bearUntil:0,blessingUntil:0,frenzyUntil:0,summonKind:kind,ownerId,ownerHeroId:state.heroes.find(h=>h.id===ownerId&&isOriginalHero(h))?.base.id||null,expiry:state.elapsed+duration,anchorX:atX,anchorY:atY,beamTarget:null};state.heroes.push(s);return s}
function activeOriginalHeroes(){return state.heroes.filter(h=>h.hp>0&&isOriginalHero(h))}
function enemyNear(h,r){let best=null,d=r*r;for(const e of state.enemies){if(e.hp<=0||e.ethereal&&!(e.vulnerableUntil>state.elapsed))continue;const sq=(e.x-h.x)**2+(e.y-h.y)**2;if(sq<=d){d=sq;best=e}}return best}
function nearestAllowedEnemy(h){let choice=null,dist=acquireRadius(h)**2;for(const e of state.enemies){if(e.hp<=0||e.ethereal&&!(e.vulnerableUntil>state.elapsed))continue;const ds=(h.x-e.x)**2+(h.y-e.y)**2;if(ds>dist)continue;if(Math.hypot(e.x,e.y)>guardRadius(h)+Math.max(0.5,h.base.range))continue;choice=e;dist=ds}return choice}
function signalSpecial(h,label,r=.9){state.abilityCasts++;h.casts++;h.abilityStatus='active';addEffect({kind:'label',x:h.x,y:h.y-.55,text:label,color:'#fff3bd',life:1.2,maxLife:1.2});visualRing(h.x,h.y,r,h.base.color);log(h.base.name+' used '+label+'!')}
function castSpecial(h){const spec=cfg(h)?.special;if(!spec||spec.trigger!=='autoCharge')return false;const enemy=SKILLFX?SKILLFX.specialTarget(h,enemyNear(h,Math.max(acquireRadius(h),h.base.range,5))):enemyNear(h,Math.max(acquireRadius(h),h.base.range,5));const otherAllies=activeOriginalHeroes().filter(a=>Math.hypot(a.x-h.x,a.y-h.y)<=(spec.shieldRadius??spec.blessingRadius??3));const duration=(n)=>state.elapsed+n;
 switch(h.base.id){
 case 'knight':if(!enemy||Math.hypot(enemy.x-h.x,enemy.y-h.y)>2.3)return false;for(const e of enemiesInRadius(h.x,h.y,spec.bashRadius)){e.stunnedUntil=duration(e.boss?Math.min(.5,spec.bashStunSeconds):spec.bashStunSeconds);if(owns('O-1-K-B3'))hitEnemy(e,timedDamage(h,h.base.damage*.5),h.base.color,h.base.id,h.id)}if(owns('O-1-K-B5'))h.bashStrikes=2;if(owns('O-1-K-B3'))finishDamagingSpecial(h);if(owns('R-KNI-D'))grantShield(h,h.maxHp*.15,4);if(owns('V2-KNI-02')&&(h.casts+1)%3===0)for(const a of activeOriginalHeroes())if(a!==h)a.bannerUntil=state.elapsed+5;signalSpecial(h,'Shield Bash',spec.bashRadius);break;
 case 'archer':if(!enemy)return false;{const targets=enemiesInRadius(enemy.x,enemy.y,spec.volleyRadius).sort((a,b)=>Math.hypot(a.x-enemy.x,a.y-enemy.y)-Math.hypot(b.x-enemy.x,b.y-enemy.y)||a.id-b.id).slice(0,5);for(const e of targets){const d=timedDamage(h,spec.volleyDamage*h.skinMultiplier*(owns('O-1-A-B5')&&Math.random()<critChance()?2:1)*(owns('V2-ARC-01')&&Object.entries(e.directHits||{}).some(([owner,t])=>owner!==String(h.id)&&state.elapsed-t<=2)?1.5:1));hitEnemy(e,d,h.base.color,h.base.id,h.id);if(owns('O-1-A-B4'))applyStatus(e,h,'volleyBleed',d*.5,3)}for(let i=0;i<spec.volleyArrowCount;i++){const angle=2*Math.PI*i/spec.volleyArrowCount,r=.25+(i%3)*.33;addEffect({kind:'bolt',x1:h.x,y1:h.y,x2:enemy.x+Math.cos(angle)*r,y2:enemy.y+Math.sin(angle)*r,color:'#a5e1b5',life:.45,maxLife:.45})}visualRing(enemy.x,enemy.y,spec.volleyRadius,'#8acaab')}finishDamagingSpecial(h);signalSpecial(h,'Arrow Volley');break;
 case 'mage':if(!enemy)return false;{let current=enemy,used=new Set(),previous={x:h.x,y:h.y};for(let i=0;i<spec.chainJumpCount&&current;i++){used.add(current.id);addEffect({kind:'bolt',x1:previous.x,y1:previous.y,x2:current.x,y2:current.y,color:'#b7ddff',life:.5,maxLife:.5});hitEnemy(current,timedDamage(h,spec.chainDamage*h.skinMultiplier*[1,.8,.6,.4][i]*(owns('O-1-MG-B4')&&(h.casts+1)%3===0?2:1)*(owns('O-1-MG-B5')&&burning(current)?1.5:1)),'#b7ddff',h.base.id,h.id);visualRing(current.x,current.y,.45,'#c6dbff');const candidates=state.enemies.filter(e=>e.hp>0&&!used.has(e.id)&&Math.hypot(e.x-current.x,e.y-current.y)<=spec.chainJumpRange);previous=current;current=candidates.sort((a,b)=>Math.hypot(a.x-previous.x,a.y-previous.y)-Math.hypot(b.x-previous.x,b.y-previous.y))[0]||null}}if(owns('V2-MAG-02'))h.furnaceShots=2;finishDamagingSpecial(h);signalSpecial(h,'Chain Bolt');break;
 case 'hunter':if(!enemy)return false;state.traps.push({x:enemy.x,y:enemy.y,radius:spec.trapRadius,expires:duration(spec.trapDurationSeconds),slow:spec.trapSlowMultiplier,owner:h.id,seen:new Set()});signalSpecial(h,'Tripwire Trap');break;
 case 'barbarian':if(!enemy)return false;h.frenzyUntil=duration(spec.frenzyDurationSeconds);h.frenzyExtra=0;h.frenzyKills=0;h.frenzyAttacks=0;h.frenzyActive=true;signalSpecial(h,'Battle Frenzy');break;
 case 'rogue':if(!enemy)return false;h.invisibleUntil=duration(spec.invisibilityDurationSeconds);h.smokeActive=true;h.smokeHeals=0;h.smokeTargets=new Set();signalSpecial(h,'Smoke Bomb');break;
 case 'paladin':if(!otherAllies.length)return false;h.aegisCast=(h.aegisCast||0)+1;h.aegisRefund=0;for(const a of otherAllies){grantShield(a,a.maxHp*.2*(1+(owns('O-3-P-B2')?.5:0)+(owns('R-PAL-B')&&a.hp<a.maxHp*.5?.25:0)),spec.shieldDurationSeconds,h.id,h.aegisCast);if(owns('O-3-P-B3'))healHero(a,a.maxHp*.1)}if(owns('O-3-P-A5'))h.nextPatch=true;signalSpecial(h,'Divine Aegis',spec.shieldRadius);break;
 case 'nun':{const candidates=activeOriginalHeroes().filter(a=>(a!==h||spec.sanctuarySelfHealingAllowed)&&(a.hp<a.maxHp-.001||owns('O-3-N-B4'))&&Math.hypot(a.x-h.x,a.y-h.y)<=spec.sanctuaryEligibilityRadius);if(!candidates.length)return false;state.sanctuaries.push({ownerId:h.id,radius:spec.sanctuaryRadius,expires:duration(spec.sanctuaryLifetimeSeconds),clock:0,healed:new Set(),selfHeal:0});h.sanctuaryUntil=duration(spec.sanctuaryLifetimeSeconds);signalSpecial(h,'Sanctuary Prayer',spec.sanctuaryRadius);break;}
 case 'priest':if(!otherAllies.length)return false;for(const a of otherAllies){a.blessingUntil=duration(spec.blessingDurationSeconds*(owns('V2-PRI-02')&&(h.casts+1)%3===0?2:1));}signalSpecial(h,'Blessing',spec.blessingRadius);break;
 case 'shaman':if(!enemy)return false;state.totems=state.totems.filter(p=>p.owner!==h.id);for(let i=0;i<Math.min(1,spec.totemCount);i++){state.totems.push({id:state.nextId++,x:clamp(h.x+(i-0.5)*.6,-view.worldW/2,view.worldW/2),y:h.y,hp:spec.totemHealth,maxHp:spec.totemHealth,owner:h.id,expires:duration(spec.totemLifetimeSeconds),radius:spec.totemAggroRadius})}signalSpecial(h,'Spirit Totem');break;
 case 'druid':if(!enemy)return false;h.bearUntil=duration(spec.bearFormDurationSeconds*(owns('V2-DRU-02')&&(h.casts+1)%3===0?2:1));h.bearActive=true;if(owns('R-DRU-B')||owns('V2-DRU-01'))grantShield(h,h.maxHp*(owns('V2-DRU-01')?.25:.15),4);signalSpecial(h,'Bear Form');break;
 case 'warlock':if(!enemy)return false;{const marked=enemy.doomMarks?.some(a=>a.owner===h.id&&a.until>state.elapsed),mult=owns('O-4-W-B2')?1.5:1;const dealt=hitEnemy(enemy,timedDamage(h,spec.siphonDamage*h.skinMultiplier*mult),h.base.color,h.base.id,h.id,'siphon');const heal=dealt*.5*(marked&&owns('R-WAR-B')?1.25:1),actual=healHero(h,heal);if(owns('O-4-W-B4')&&heal>actual)grantShield(h,Math.min(h.maxHp*.3,(h.shield||0)+heal-actual),5);if(owns('O-4-W-B5'))h.siphonBonus=Math.min(.5,(h.siphonBonus||0)+.1);finishDamagingSpecial(h)}visualBeam(h,enemy,'#d89aff',.4);signalSpecial(h,'Life Siphon');break;
 case 'beastmaster':if(!enemy)return false;{const cap=spec.maximumActiveHounds+(owns('O-5-BM-B5')?2:0),n=owns('O-5-BM-B5')?2:1;for(let i=0;i<n;i++){const active=state.heroes.filter(a=>a.hp>0&&a.summonKind==='hound'&&a.ownerId===h.id).sort((a,b)=>a.id-b.id);if(active.length>=cap){active[0].evicted=true;active[0].hp=0}h.houndsSummoned=(h.houndsSummoned||0)+1;const alpha=owns('O-5-BM-B4')&&h.houndsSummoned%3===0;const base={...HOUND,hp:spec.houndHealth+(alpha?HOUND.hp:0),damage:spec.houndDamage+(alpha?HOUND.damage:0),speed:spec.houndAttackSpeed,walk:spec.houndWalkSpeed};spawnSummon(base,h.x+.65,h.y+.4+i*.15,'hound',spec.houndLifetimeSeconds,h.id)}}signalSpecial(h,'Summon Hound');break;
 case 'dragonkin':if(!enemy)return false;{const dx=enemy.x-h.x,dy=enemy.y-h.y,len=Math.max(.01,Math.hypot(dx,dy));let hits=0;for(const e of state.enemies){if(e.hp<=0)continue;const ex=e.x-h.x,ey=e.y-h.y,dist=Math.hypot(ex,ey),dot=(ex*dx+ey*dy)/(dist*len||1);if(hits<6&&dist<=spec.breathRange&&dot>=Math.cos(spec.breathConeDegrees*Math.PI/360)){const d=timedDamage(h,spec.breathDamage*h.skinMultiplier*(owns('O-5-DR-B4')&&burning(e)?1.5:1)*(owns('V2-DRA-02')&&(h.casts+1)%3===0?3:1));if(owns('O-5-DR-B2'))applyStatus(e,h,'burn',d*.5,4);hitEnemy(e,d,'#ffae76',h.base.id,h.id);hits++}}if(!hits)return false;if(owns('O-5-DR-B5'))h.breathLunges=3;finishDamagingSpecial(h);visualRing(h.x,h.y,spec.breathRange,'#ff905b')}signalSpecial(h,'Dragon Breath');break;
 default:return false;
 }
 if(SKILLFX)SKILLFX.afterCast(h,enemy,spec);return true;
}
function stepSanctuaries(dt){
 const heals=new Map(),ended=[];
 for(const zone of state.sanctuaries){
  const owner=state.heroes.find(h=>h.id===zone.ownerId&&h.hp>0);
  if(!owner||zone.expires<=state.elapsed){if(owner)ended.push(zone);continue}
  const spec=cfg(owner).special,tick=Math.max(.04,spec.sanctuaryTickIntervalSeconds);zone.clock+=dt;const ticks=Math.floor(zone.clock/tick);if(!ticks)continue;zone.clock-=ticks*tick;
  for(const h of activeOriginalHeroes()){
   if((h===owner&&!spec.sanctuarySelfHealingAllowed)||Math.hypot(h.x-owner.x,h.y-owner.y)>zone.radius)continue;
   let amount=spec.sanctuaryHealPerSecond*tick*ticks;if(owns('O-3-N-B5')&&h.hp<h.maxHp*.25)amount*=2;
   if(!heals.has(h)||heals.get(h).amount<amount)heals.set(h,{amount,zone,owner});
  }
 }
 for(const [h,{amount,zone,owner}] of heals){
  const actual=healHero(h,amount);if(actual>0)zone.healed.add(h.id);
  if(owns('O-3-N-B4')){const excess=amount*(owns('O-3-G2')?1.25:1)-actual;if(excess>0)grantShield(h,Math.min(h.maxHp*.2,(h.shield||0)+excess),4)}
  if(actual>0&&owns('V2-NUN-01')){owner.sanctuaryTotal=(owner.sanctuaryTotal||0)+actual;if(owner.sanctuaryTotal>=20){owner.sanctuaryTotal%=20;owner.sanctuaryCombo=true}}
  if(actual>0&&h!==owner&&owns('R-NUN-B')){const wanted=Math.min(actual*.2,Math.max(0,owner.maxHp*.1-zone.selfHeal));zone.selfHeal+=healHero(owner,wanted/(owns('O-3-G2')?1.25:1))}
 }
 if(owns('V2-NUN-02'))for(const zone of ended)for(const h of activeOriginalHeroes())if(zone.healed.has(h.id))grantShield(h,h.maxHp*.15,4);
 state.sanctuaries=state.sanctuaries.filter(z=>z.expires>state.elapsed&&state.heroes.some(h=>h.id===z.ownerId&&h.hp>0));
}
function stepSpecials(h,dt){const spec=cfg(h)?.special;if(!spec||spec.trigger!=='autoCharge')return;h.charge=Math.min(chargeSeconds(h),h.charge+dt*((SKILLS?SKILLS.rate(h):1)+(h.base.id==='warlock'&&h.hp<h.maxHp*.5&&owns('O-4-W-B3')?.5:0)));if(h.charge>=chargeSeconds(h)){h.abilityStatus='ready';if(castSpecial(h)){h.charge=0;h.abilityStatus='charging'}}}
// Every qualified enemy kill raises one undead if at least one living Necromancer exists.
function onEnemyDeath(e){
 if(owns('V2-HUN-02')&&!e.noBleedBurst){for(const h of activeOriginalHeroes().filter(a=>a.base.id==='hunter')){const stacks=ownStatuses(e,h,'hunterBleed');if(stacks.length>=3){const total=stacks.reduce((n,a)=>n+a.remaining*a.dps,0);for(const other of enemiesInRadius(e.x,e.y,1.25)){hitEnemy(other,total,h.base.color,h.base.id,h.id,'derived');if(other.hp<=0)other.noBleedBurst=true}}}}if(owns('R-HUN-D'))for(const h of activeOriginalHeroes().filter(a=>a.base.id==='hunter')){if(ownStatuses(e,h,'hunterBleed').length&&state.traps.some(p=>p.owner===h.id&&Math.hypot(e.x-p.x,e.y-p.y)<=p.radius)&&state.elapsed-(h.lastTrapKill??-Infinity)>=2){h.lastTrapKill=state.elapsed;grantCharge(h,.15)}}
 if(e.scheduled&&!e.boss){if(owns('R-PRI-B'))for(const h of activeOriginalHeroes().filter(a=>a.base.id==='priest'&&a.id!==e.lastHitOwner)){if(e.lastHitHero&&state.elapsed-(h.lastAllyKill??-Infinity)>=2){h.lastAllyKill=state.elapsed;grantCharge(h,.03)}}if(owns('O-4-S-A5'))for(const h of activeOriginalHeroes().filter(a=>a.base.id==='shaman'))if(ownStatuses(e,h,'corrosion').length)h.corrosionBonus=Math.min(1,(h.corrosionBonus||0)+.25)}
 if(owns('O-1-MG-A5')&&!e.noBurnDeathProc)for(const a of e.treeStatuses||[]){if(a.kind!=='burn'||a.heroId!=='mage'||a.remaining<=0)continue;const h=state.heroes.find(h=>h.id===a.owner&&h.hp>0);if(h)for(const other of enemiesInRadius(e.x,e.y,1.4))if(other!==e){hitEnemy(other,h.base.damage*.5,h.base.color,h.base.id,h.id);if(other.hp<=0)other.noBurnDeathProc=true}}
 if(SKILLFX)SKILLFX.enemyDeath(e);
 perHeroKill(e);
 if(e.boss||e.generated)return;
 if(e.stage===2&&e.scheduled&&!e.elite){
  state.sporeClouds.push({x:e.x,y:e.y,radius:1,life:2,clock:0,damageScale:signatureScale()});
  visualRing(e.x,e.y,1,'#b4e69c');
 }const necros=activeOriginalHeroes().filter(h=>h.base.id==='necromancer');if(!necros.length)return;const owner=necros[(state.necroRoundRobin||0)%necros.length];state.necroRoundRobin=(state.necroRoundRobin||0)+1;const spec=cfg(owner).special;owner.raisedCount=(owner.raisedCount||0)+1;const cap=owns('O-5-NE-B5')?9:6;const active=state.heroes.filter(h=>h.hp>0&&h.ownerId===owner.id&&h.summonKind==='undead').sort((a,b)=>a.id-b.id);if(active.length>=cap){active[0].evicted=true;active[0].hp=0}const veteran=owns('O-5-NE-B4')&&owner.raisedCount%5===0;const base={...UNDEAD,hp:spec.undeadHealth+(veteran?UNDEAD.hp:0),damage:spec.undeadDamage+(veteran?UNDEAD.damage:0),speed:UNDEAD.speed*(owns('O-5-NE-B5')?1.25:1)};spawnSummon(base,e.x,e.y,'undead',spec.undeadLifetimeSeconds,owner.id);signalSpecial(owner,'Raise the Fallen',.7)}

function vineWave(h,target,d,derived){const dx=target.x-h.x,dy=target.y-h.y,len=Math.max(.01,Math.hypot(dx,dy)),bx=h.x+dx/len*h.base.range,by=h.y+dy/len*h.base.range;for(const e of [target,...state.enemies.filter(e=>e!==target&&e.hp>0&&pointSegmentDistance(e.x,e.y,h.x,h.y,bx,by)<.45).sort((a,b)=>Math.hypot(a.x-h.x,a.y-h.y)-Math.hypot(b.x-h.x,b.y-h.y)||a.id-b.id).slice(0,3)]){const amount=e===target?d:d*.7;if(owns('O-4-D-A2'))applyStatus(e,h,'thorns',amount*.25,4);hitEnemy(e,amount,h.base.color,h.base.id,h.id,derived?'derived':'direct')}visualRing(target.x,target.y,.7,'#a5e882')}
function basicAttack(h,target){if(target.hp<=0)return;const id=h.base.id,col=h.base.color;h.basicCount=(h.basicCount||0)+1;let d=h.base.damage*(SKILLS?SKILLS.heroBonus(h,target):1);if(h.blessingUntil>state.elapsed)d*=1+TUNING.heroes.priest.special.blessingDamageBonus;if(h.blessingUntil>state.elapsed&&target.boss&&owns('R-PRI-D'))d*=1.15;if(id==='archer'&&owns('R-ARC-B')&&h.basicCount%4===0)d*=1.5;if(id==='rogue'&&owns('R-ROG-B')&&h.basicCount%5===0)d*=1.5;if(id==='shaman'&&owns('R-SHA-B')&&h.basicCount%3===0)d*=1.5;if(id==='dragonkin'&&owns('R-DRA-B')&&h.basicCount%3===0)d*=1.5;if(id!=='necromancer')visualBeam(h,target,col);h.cooldown=1/h.base.speed;
 switch(id){
  case 'knight':{const bonus=h.bashStrikes>0?1.5:1;if(h.bashStrikes>0)h.bashStrikes--;hitEnemy(target,d*bonus,col,id,h.id);break}
  case 'archer':{const crit=critChance()>0&&Math.random()<critChance();hitEnemy(target,d*(crit?2:1),col,id,h.id);if(crit&&owns('O-1-A-A5'))grantCharge(h,.10);if(owns('R-ARC-D')&&h.basicCount%5===0)applyStatus(target,h,'arrowBleed',h.base.damage*.25,2);if(owns('V2-ARC-02')&&h.basicCount%5===0)hitEnemy(target,h.base.damage*.75,col,id,h.id,'derived');break}
  case 'mage':{const radius=1.05*(owns('O-1-MG-A3')?1.4:1),direct=d*(owns('O-1-MG-A4')&&burning(target)?1.5:1)*(h.furnaceShots>0?1.5:1),splash=h.base.damage*.60*(owns('R-MAG-B')&&h.basicCount===1?1.5:1)*(h.furnaceShots>0?1.5:1);if(h.furnaceShots>0)h.furnaceShots--;const targets=[target,...enemiesInRadius(target.x,target.y,radius).filter(e=>e!==target).sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y)||a.id-b.id).slice(0,4)];if(owns('O-1-MG-A2'))applyStatus(target,h,'burn',direct*.25,3);hitEnemy(target,direct,col,id,h.id);if(owns('R-MAG-D')&&target.hp<=0&&state.elapsed-(h.lastPrimaryCharge??-Infinity)>=2){h.lastPrimaryCharge=state.elapsed;grantCharge(h,.1)}if(owns('V2-MAG-01')&&targets.length>=3&&state.elapsed-(h.lastCrowdCharge??-Infinity)>=2){h.lastCrowdCharge=state.elapsed;grantCharge(h,.1)}for(const e of targets)if(e!==target){if(owns('O-1-MG-A2'))applyStatus(e,h,'burn',splash*.25,3);hitEnemy(e,splash,col,id,h.id)}visualRing(target.x,target.y,radius,'#f7b961');break;}
  case 'hunter':hitEnemy(target,d,col,id,h.id);hunterBleed(target,h);break;
  case 'barbarian':{const ax=target.x-h.x,ay=target.y-h.y;let actual=0,killed=false,count=0;const frenzy=h.frenzyUntil>state.elapsed;if(frenzy)h.frenzyAttacks=(h.frenzyAttacks||0)+1;const mult=(1+(owns('V2-BAR-01')?h.nextCleaveBonus||0:0)+(owns('O-2-B-A4')&&h.basicCount%3===0?1:0)+(owns('V2-BAR-02')&&frenzy&&h.frenzyAttacks%5===0?2:0));for(const e of [target,...enemiesInRadius(h.x,h.y,1.3).filter(e=>e!==target)]){const vx=e.x-h.x,vy=e.y-h.y,dot=(ax*vx+ay*vy)/(Math.hypot(ax,ay)*Math.hypot(vx,vy)||1);if(count<4&&(e===target||dot>=Math.cos(50*Math.PI/180))){count++;actual+=hitEnemy(e,(e===target?d:d*.7)*mult,col,id,h.id);if(e.hp<=0)killed=true}}h.nextCleaveBonus=Math.min(.5,Math.max(0,count-1)*.1);if(owns('O-2-B-A3'))healHero(h,actual*.1*(frenzy&&owns('O-2-B-B5')?2:1));if(killed&&owns('R-BAR-B'))healHero(h,h.maxHp*.05);visualRing(h.x,h.y,1.3,'#f4b195');break}
  case 'rogue':h.combo=(h.combo+1)%2;{const cap=owns('O-2-R-A4')?6:3,old=ownStatuses(target,h,'poison');if(owns('O-2-R-A5')&&old.length===6){const total=old.reduce((n,a)=>n+a.dps*a.remaining,0);target.treeStatuses=target.treeStatuses.filter(a=>!old.includes(a));hitEnemy(target,total*1.5,col,id,h.id,'derived')}hitEnemy(target,d,col,id,h.id);if(owns('O-2-R-A2'))for(let i=0;i<(owns('O-2-R-B5')&&h.invisibleUntil>state.elapsed?2:1);i++)applyStatus(target,h,'poison',h.base.damage*.2,3,cap);if(owns('R-ROG-D')&&h.invisibleUntil>state.elapsed&&h.smokeHeals<2&&!h.smokeTargets?.has(target.id)){h.smokeTargets?.add(target.id);h.smokeHeals++;healHero(h,h.maxHp*.05)}}addEffect({kind:'bolt',x1:h.x+(h.combo?-.25:.25),y1:h.y,x2:target.x,y2:target.y,color:'#e4daff',life:.13,maxLife:.13});break;
  case 'paladin':hitEnemy(target,d*(h.nextHammer?1.5:1),col,id,h.id);h.nextHammer=false;state.hazards.push({x:target.x,y:target.y,life:2*(owns('V2-PAL-01')&&h.basicCount%3===0?2:1),clock:0,radius:1.1,color:'#e7bf62',damage:h.base.damage*.3/2*(owns('O-3-P-A2')?1.5:1)*(h.nextPatch?2:1),sourceHeroId:id,ownerId:h.id});h.nextPatch=false;visualRing(target.x,target.y,1.1,col);break;
  case 'nun':h.combo=(h.combo+1)%3;hitEnemy(target,d*(h.comboBoost||1)*(h.combo===0&&owns('O-3-N-A3')?2:1),col,id,h.id);if(h.combo===0){pushEnemy(target,h.x,h.y,.45);if(owns('O-3-N-A4'))grantCharge(h,.1);if(owns('O-3-N-A5'))healHero(h,h.maxHp*.05);if(owns('R-NUN-D'))healHero(h,h.maxHp*.05);h.comboBoost=1+(owns('O-3-N-A5')?.25:0)+(h.sanctuaryCombo?1:0);h.sanctuaryCombo=false;visualRing(target.x,target.y,.75,'#eedffc')}break;
  case 'priest':for(let k=1;k<=3;k++)state.pendingHits.push({time:state.elapsed+k*.3,target,damage:d/3,color:col,sourceHeroId:id,ownerId:h.id,x:h.x,y:h.y});break;
  case 'shaman':{const radius=1.15,totems=state.totems.filter(p=>p.owner===h.id&&p.hp>0);d*=1+(h.corrosionBonus||0)+(h.totemVengeance?2:0)+(owns('O-4-S-B4')&&totems.length?.25:0);h.corrosionBonus=0;h.totemVengeance=false;for(const e of [target,...enemiesInRadius(target.x,target.y,radius).filter(e=>e!==target).sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y)||a.id-b.id).slice(0,4)]){e.weakUntil=state.elapsed+3;const damage=e===target?d:d*.6;if(owns('O-4-S-A2'))applyStatus(e,h,'corrosion',damage*.3,4);hitEnemy(e,damage,col,id,h.id);if(owns('O-4-S-A3')&&h.basicCount%4===0)hitEnemy(e,damage*.5,col,id,h.id,'derived')}if(owns('V2-SHA-01')&&h.basicCount%4===0)for(const p of totems)p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.2);visualRing(target.x,target.y,radius,'#78d6c5');break;}
  case 'druid':{vineWave(h,target,d,false);if(owns('O-4-D-A3')&&h.basicCount%3===0)healHero(h,h.maxHp*.05);if(owns('O-4-D-A4')&&h.basicCount%4===0)vineWave(h,target,d*.5,true);break}
  case 'warlock':{target.doomMarks??=[];target.doomMarks=target.doomMarks.filter(a=>a.owner!==h.id&&a.until>state.elapsed);target.doomMarks.push({owner:h.id,until:state.elapsed+5*(owns('O-4-W-A2')?1.5:1),damage:h.base.damage*.6*(owns('O-4-W-A3')?1.5:1)});hitEnemy(target,d*(1+(h.doomBonus||0)+(h.siphonBonus||0)),col,id,h.id);visualRing(target.x,target.y,.55,'#a86bc5');break}
  case 'beastmaster':{const dogs=state.heroes.filter(a=>a.hp>0&&a.summonKind==='hound'&&a.ownerId===h.id);if(owns('O-5-BM-A5'))d*=1+Math.min(1,dogs.length*.25);hitEnemy(target,d,col,id,h.id);target.beastFocus=state.elapsed+3;if(owns('O-5-BM-A3')&&h.basicCount%3===0)for(const dog of dogs)dog.whipBoost=true;break}
  case 'necromancer':break;
  case 'dragonkin':{if(h.breathLunges>0){h.breathLunges--;d*=1.5;applyStatus(target,h,'burn',h.base.damage*.25,4)}hitEnemy(target,d,col,id,h.id);if(owns('R-DRA-D')&&(target.boss||target.elite)&&state.elapsed-(h.lastLungeShield??-Infinity)>=5){h.lastLungeShield=state.elapsed;grantShield(h,h.maxHp*.1,3)}}{const dx=target.x-h.x,dy=target.y-h.y,len=Math.max(.01,Math.hypot(dx,dy));const nx=h.x+dx/len*.32,ny=h.y+dy/len*.32;if(!insideTower(nx,ny)){h.x=nx;h.y=ny};pushEnemy(target,h.x,h.y,.6)}visualRing(target.x,target.y,.8,'#ff9e69');break;
 }
 if(SKILLFX)SKILLFX.afterBasic(h,target,d,false);
}
function tickAttackEffects(dt){
 for(const e of state.enemies){if(e.hp<=0)continue;for(const a of e.treeStatuses||[]){if(a.remaining<=0)continue;const active=Math.min(dt,a.remaining);a.remaining-=active;a.tick-=active;if(a.tick<=1e-8||a.remaining<=1e-8){const elapsed=(a.interval??.25)-a.tick;{const owner=state.heroes.find(h=>h.id===a.owner&&h.hp>0);let mult=1;if(a.kind==='hunterBleed'){if(owns('O-2-H-A4')&&(e.treeStatuses||[]).filter(x=>x.owner===a.owner&&x.kind==='hunterBleed'&&x.remaining>0).length>=3)mult*=1.25;if(owns('R-HUN-B')&&e.boss)mult*=1.25;if(owns('O-2-H-B5')&&state.traps.some(p=>p.owner===a.owner&&Math.hypot(e.x-p.x,e.y-p.y)<=p.radius))mult*=1.5}const actual=hitEnemy(e,a.dps*elapsed*mult,'#e9a86a',a.heroId,a.owner,a.kind);if(owner&&a.kind==='poison'&&owns('V2-ROG-01'))healHero(owner,actual*.1);if(owner&&owner.base.id==='dragonkin'&&a.kind==='burn'&&actual>0&&owns('V2-DRA-01')){if(state.elapsed-(owner.burnWindow??-Infinity)>=2){owner.burnWindow=state.elapsed;owner.burnCharge=0}if((owner.burnCharge||0)<.1){grantCharge(owner,.05);owner.burnCharge=(owner.burnCharge||0)+.05}}}a.tick=a.interval??.25}}if(e.treeStatuses)e.treeStatuses=e.treeStatuses.filter(a=>a.remaining>1e-8)}
 for(let i=state.pendingHits.length-1;i>=0;i--){const p=state.pendingHits[i];if(p.time>state.elapsed)continue;state.pendingHits.splice(i,1);const caster=state.heroes.find(h=>h.id===p.ownerId&&h.hp>0);if(!caster||caster.rootedUntil>state.elapsed||caster.controlUntil>state.elapsed)continue;if(p.target.hp<=0&&SKILLS?.has('T3-PR-T02')&&p.sourceHeroId==='priest'){p.target=enemyNear({x:p.x,y:p.y},4)||p.target;}if(p.target.hp>0){if(p.sourceHeroId==='priest'&&owns('O-3-PR-A3'))p.target.priestBrandUntil=state.elapsed+3;hitEnemy(p.target,p.damage*(p.sourceHeroId==='priest'&&owns('O-3-PR-A4')&&p.target.hp<p.target.maxHp*.3?1.5:1),p.color,p.sourceHeroId,p.ownerId);addEffect({kind:'bolt',x1:p.x,y1:p.y,x2:p.target.x,y2:p.target.y,color:p.color,life:.08,maxLife:.08})}}
 for(const e of state.enemies){if(e.hp<=0)continue;if(e.bleed){e.bleed.time-=dt;e.bleed.tick-=dt;if(e.bleed.tick<=0){e.bleed.tick+=.6;hitEnemy(e,e.bleed.damage,'#ff9d96',e.bleed.sourceHeroId)}if(e.bleed.time<=0)e.bleed=null}}
 const patches=new Map();for(const p of state.hazards){const active=Math.min(dt,Math.max(0,p.life));p.life-=dt;if(active<=0)continue;for(const e of enemiesInRadius(p.x,p.y,p.radius)){const key=e.id+':'+p.ownerId,n=p.damage*active,old=patches.get(key);if(!old||old.n<n)patches.set(key,{e,p,n})}}for(const {e,p,n} of patches.values())hitEnemy(e,n,p.color,p.sourceHeroId,p.ownerId,'status');state.hazards=state.hazards.filter(p=>p.life>1e-8);
}

// All units use one movement system; the tower is impassable to both teams.
function actorRadius(a){return a.radius||(a.boss?.75:.35)}
function nearTower(x,y,r=.35){const dx=Math.max(0,Math.abs(x)-1.00),dy=Math.max(0,Math.abs(y)-1.00);return Math.hypot(dx,dy)<r+.025}
function legalActorPosition(a,x,y){
 if(nearTower(x,y,actorRadius(a)))return false;
 if(a.base&&isOriginalHero(a)){
   const guard=guardRadius(a),previous=Math.hypot(a.x,a.y),next=Math.hypot(x,y);
   // Farther deployments may fight locally and move inward, but cannot wander
   // farther than their initial position; after entering guard, its limit applies.
   const leash=previous>guard?Math.max(guard,Math.min(a.initialSpawnRadius||guard,previous+.05)):guard;
   if(next>leash-.015)return false;
 }
 return Math.abs(x)<view.worldW/2-.3&&Math.abs(y)<view.worldH/2-.3;
}
function brake(a,dt){a.vx=(a.vx||0)*Math.max(0,1-dt*10);a.vy=(a.vy||0)*Math.max(0,1-dt*10)}
function steerActor(a,pt,dt,speed,guarded=false){
 const wp=heroWaypoint(a.x,a.y,pt.x,pt.y,Math.max(TOWER_BLOCK,1+actorRadius(a)+.045)),dx=wp.x-a.x,dy=wp.y-a.y,d=Math.hypot(dx,dy);
 if(d<.04){brake(a,dt);return}
 const cap=Math.min(speed,Math.sqrt(Math.max(0,d)*8.5));
 let vx=dx/d*cap,vy=dy/d*cap;
 const k=Math.min(1,dt*TUNING.shared.steerResponsiveness);
 a.vx=(a.vx||0)*(1-k)+vx*k;a.vy=(a.vy||0)*(1-k)+vy*k;
 const nx=a.x+a.vx*dt,ny=a.y+a.vy*dt;
 if(legalActorPosition(a,nx,ny)){a.x=nx;a.y=ny}
 else{a.vx*=.15;a.vy*=.15;state.combatTelemetry.blocked++}
}
function moveToPoint(h,pt,dt){steerActor(h,pt,dt,h.base.walk)}
function towerApproach(e){
 // Commit to an outside face and offset the lateral approach so enemies don't share one point.
 if(!e.approachSide){const a=Math.abs(e.x)>Math.abs(e.y)?'x':'y';e.approachSide=a;e.approachSign=(a==='x'?Math.sign(e.x):Math.sign(e.y))||1}
 const face=1.72,offset=clamp(e.towerLane||0,-.79,.79);
 return e.approachSide==='x'?{x:e.approachSign*face,y:offset}:{x:offset,y:e.approachSign*face};
}
function takeTowerSafeStep(e,goal,dt,speed){steerActor(e,goal,dt,speed)}
// Nearby collision lookup replaces O(N^2) scans on large mobile waves.
function resolveActorCollisions(){
 const units=[...state.heroes,...state.enemies].filter(a=>a.hp>0);
 const size=1.35,grid=new Map();
 for(const a of units){const x=Math.floor(a.x/size),y=Math.floor(a.y/size),key=x+','+y;let cell=grid.get(key);if(!cell){cell=[];grid.set(key,cell)}cell.push(a)}
 let overlaps=0;
 for(const a of units){const x=Math.floor(a.x/size),y=Math.floor(a.y/size);
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)for(const b of grid.get((x+i)+','+(y+j))||[]){if(b.id<=a.id||b.hp<=0)continue;
   const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy),desired=actorRadius(a)+actorRadius(b)+TUNING.shared.personalSpace;
   if(dist>=desired)continue;overlaps++;
   const angle=((a.id*37+b.id*53)%360)*Math.PI/180,nx=dist>.001?dx/dist:Math.cos(angle),ny=dist>.001?dy/dist:Math.sin(angle),push=Math.min(.23,(desired-dist)*.53);
   const weightA=a.boss?.34:1,weightB=b.boss?.34:1,shareA=weightA/(weightA+weightB),shareB=weightB/(weightA+weightB);
   const ax=a.x-nx*push*shareA*2,ay=a.y-ny*push*shareA*2,bx=b.x+nx*push*shareB*2,by=b.y+ny*push*shareB*2;
   if(!a.capturing&&!(a.elite&&a.stage===8)&&!a.signature&&!(a.rootedUntil>state.elapsed)&&legalActorPosition(a,ax,ay)){a.x=ax;a.y=ay}if(!b.capturing&&!(b.elite&&b.stage===8)&&!b.signature&&!(b.rootedUntil>state.elapsed)&&legalActorPosition(b,bx,by)){b.x=bx;b.y=by}
  }
 }
 state.combatTelemetry.overlaps=overlaps;
}
// Arcade AI: the closest living enemy in the hero's forward half-plane wins.
// If nothing is ahead, turn toward the closest accessible enemy instead.
function selectHeroTarget(h,dt){
 const current=state.enemies.find(e=>e.id===h.targetId&&e.hp>0&&(!e.ethereal||e.vulnerableUntil>state.elapsed));
 const legal=e=>e&&Math.hypot(e.x-h.x,e.y-h.y)<=acquireRadius(h)
   &&Math.hypot(e.x,e.y)<=guardRadius(h)+Math.max(1,h.base.range);
 if(h.windupTime>0&&legal(current))return current; // Finish an attack.
 h.targetClock=(h.targetClock||0)-dt;
 if(legal(current)&&h.targetClock>0)return current;
 h.targetClock=TUNING.shared.decisionInterval;
 const lure=state.enemies.filter(e=>e.hp>0&&(e.kind==='decoy'||e.stage===8&&e.elite)&&legal(e)&&Math.hypot(e.x-h.x,e.y-h.y)<=3).sort((a,b)=>Math.hypot(a.x-h.x,a.y-h.y)-Math.hypot(b.x-h.x,b.y-h.y)||a.id-b.id)[0];
 const target=lure||ARCADE.nearestFrontTarget(
   h,state.enemies.filter(e=>!e.ethereal||e.vulnerableUntil>state.elapsed),acquireRadius(h),guardRadius(h),h.base.range,
   e=>SKILLFX?.focusBias(h,e)||0
 );
 if((target?.id??null)!==(h.targetId??null)){
   h.lastTargetSwitch=state.elapsed;
   state.combatTelemetry.targetSwitches++;
   h.slotIndex=-1;h.slotTarget=null;h.windupTime=0;
 }
 h.targetId=target?.id??null;
 return target;
}
function meleeSlotGoal(h,e){
 // Straight-line chase to a nearby hit position; collision and tower geometry
 // are still resolved by the shared movement system, without slot auctions.
 const dx=h.x-e.x,dy=h.y-e.y,d=Math.max(.01,Math.hypot(dx,dy));
 const gap=actorRadius(h)+actorRadius(e)+.12;
 let x=e.x+dx/d*gap,y=e.y+dy/d*gap;
 const limit=guardRadius(h)-.08;
 const length=Math.hypot(x,y);
 if(length>limit&&Math.hypot(h.x,h.y)<=guardRadius(h)){
   x=x/length*limit;y=y/length*limit;
 }
 return safeGoal(x,y);
}
function heroCombatGoal(h,e,isMeleeForm=false){
 const dist=Math.max(.01,Math.hypot(e.x-h.x,e.y-h.y)),range=isMeleeForm?1.15:h.base.range;
 if(range<=2.15)return meleeSlotGoal(h,e);
 // Ranged and support heroes hold their current position whenever the target is in attack range.
 // No defensive kiting, backpedalling or standoff repositioning when an enemy approaches.
 if(dist<=range)return {x:h.x,y:h.y};
 const preferred=clamp(range*TUNING.shared.rangeStandoff,1.7,4.3),dx=(h.x-e.x)/dist,dy=(h.y-e.y)/dist;
 const goal={x:e.x+dx*preferred,y:e.y+dy*preferred};
 if(Math.hypot(goal.x,goal.y)>guardRadius(h)-.2){const a=Math.atan2(goal.y,goal.x);goal.x=Math.cos(a)*(guardRadius(h)-.25);goal.y=Math.sin(a)*(guardRadius(h)-.25)}
 return goal;
}

function stepSporeClouds(dt){
 for(let i=state.sporeClouds.length-1;i>=0;i--){
  const c=state.sporeClouds[i];c.life-=dt;c.clock+=dt;
  while(c.clock>=.5){c.clock-=.5;
   for(const h of state.heroes)if(h.hp>0&&Math.hypot(h.x-c.x,h.y-c.y)<=c.radius)hitHero(h,.5*(c.damageScale||1),{kind:'mushroom-spore'});
  }
  if(c.life<=0)state.sporeClouds.splice(i,1);
 }
}
function stepNecroBeam(h,target,dt){if(!target||target.hp<=0||Math.hypot(target.x-h.x,target.y-h.y)>h.base.range||Math.hypot(h.x,h.y)>guardRadius(h)+.1){h.beamTarget=null;h.beamTime=0;h.beamTickClock=0;return}if(h.beamTarget!==target.id){h.beamTarget=target.id;h.beamTime=h.beamTransferUntil>state.elapsed?(h.beamStoredRamp||0):0;h.beamTickClock=0}const spec=cfg(h).special;h.beamTime+=dt*(SKILLFX?SKILLFX.beamRampBoost(h):1);h.beamTickClock+=dt;const ticks=Math.floor(h.beamTickClock/spec.beamTickSeconds);if(ticks>0){const n=Math.min(ticks,8);h.beamTickClock-=ticks*spec.beamTickSeconds;const mult=1+(spec.beamMaxRampMultiplier-1)*Math.min(1,h.beamTime/spec.beamRampSeconds);{const full=h.beamTime>=spec.beamRampSeconds,count=state.heroes.filter(a=>a.hp>0&&a.summonKind==='undead'&&a.ownerId===h.id).length,bonus=(owns('O-5-NE-A3')?Math.min(.5,count*.1):0)+(h.graveBonus||0),elite=(target.boss||target.elite)?(owns('R-NEC-B')?.25:0)+(full&&owns('O-5-NE-A5')?.5:0):0;hitEnemy(target,(h.base.damage*h.base.speed)*spec.beamTickSeconds*n*mult*(1+bonus)*(1+elite),h.base.color,h.base.id,h.id)}}}
function randomLiving(){const a=activeOriginalHeroes();return a.length?a[Math.floor(Math.random()*a.length)]:null}
function spawnGenerated(owner,stats,kind,dx=0,dy=0){const e=spawnEnemy(false,'generated',{x:owner.x+dx,y:owner.y+dy});Object.assign(e,waveScale(stats),{kind,generated:true,scheduled:false,elite:false,mutated:false,ethereal:false,firstShield:false,ownerId:owner.id});e.maxHp=e.hp;return e}
function enemySpecial(e,dt){
 const now=state.elapsed,p=state.wavePlan.p,scale=signatureScale();
 if(e.generated){if(e.expires&&now>=e.expires){e.expired=true;e.hp=0;return true}return e.kind==='decoy'}
 if(e.faction){
  if(e.factionIndex===0&&now>=e.nextAbility){e.firstShield=true;e.nextAbility=now+10}
  if(e.factionIndex===1&&now>=e.nextAbility){const h=randomLiving();if(h){for(const a of activeOriginalHeroes())if(a!==h&&Math.hypot(a.x-h.x,a.y-h.y)<=1.2)hitHero(a,e.damage*.5,e);visualRing(h.x,h.y,1.2,'#c9a2ff');e.nextAbility=now+10}}
  if(e.factionIndex===2){if(e.slamAt){if(now>=e.slamAt){for(const h of activeOriginalHeroes())if(Math.hypot(h.x-e.x,h.y-e.y)<=1.5)hitHero(h,e.damage*1.25,e);visualRing(e.x,e.y,1.5,'#e5a0a0');e.slamAt=0;e.nextAbility=now+10}return true}if(now>=e.nextAbility){e.slamAt=now+1;visualRing(e.x,e.y,1.5,'#e5a0a0');return true}}
  return false;
 }
 if(e.boss)return BOSSES.step(e);if(!e.elite){if(e.stage===9){if(e.ritualAt){if(now>=e.ritualAt){e.ritualAt=0;e.ritualUntil=now+4;e.nextAbility=now+10}return true}if(now>=e.nextAbility){e.ritualAt=now+1;visualRing(e.x,e.y,.8,'#af89cf');return true}}return false;}
 if(e.stage===4){if(Math.hypot(e.x,e.y)<=2.1){if(!e.bombAt&&now>=e.nextAbility){e.bombAt=now+4;visualRing(0,0,1.6,'#ffae73')}if(e.bombAt&&now>=e.bombAt){e.bombAt=0;e.nextAbility=now+12;applyTowerDamage(12*scale);visualRing(0,0,2,'#ffae73')}return true}takeTowerSafeStep(e,towerApproach(e),dt,e.speed);return true}
 if(e.stage===8)return true;
 if(now<e.nextAbility)return false;
 switch(e.stage){
 case 1:{const n=Math.min(2,4-state.enemies.filter(a=>a.kind==='decoy'&&a.ownerId===e.id&&a.hp>0).length);for(let i=0;i<n;i++){const a=spawnGenerated(e,{hp:3,damage:0,speed:0,attackPeriod:1},'decoy',(i?1:-1)*.9,.6);a.expires=now+6}e.nextAbility=now+10;break}
 case 2:for(const a of state.enemies)if(a!==e&&a.hp>0&&a.scheduled&&!a.elite&&!a.boss&&Math.hypot(a.x-e.x,a.y-e.y)<=2.4)a.hp=Math.min(a.maxHp,a.hp+3*scale);visualRing(e.x,e.y,2.4,'#ace3a1');e.nextAbility=now+6;break;
 case 5:{const h=randomLiving();if(h)state.enemyZones.push({x:h.x,y:h.y,radius:1.25,expires:now+4,damage:scale,owner:e.id});e.nextAbility=now+9;break}
 case 6:{const h=randomLiving();if(h){h.controlUntil=now+3;h.controlAngle=Math.random()*Math.PI*2;visualRing(h.x,h.y,.8,'#d6adff')}e.nextAbility=now+11;break}
 case 9:{const h=randomLiving();if(h){const q=safeGoal(h.x+.8,h.y+.5);if(legalActorPosition(e,q.x,q.y)){e.x=q.x;e.y=q.y}hitHero(h,e.damage+7*scale,e);visualRing(h.x,h.y,.8,'#d8b0e5')}e.nextAbility=now+9;break}
 case 10:{if(!e.teleportAt){const h=randomLiving();e.teleportHero=h?.id;e.teleportAt=now+.8;if(h)visualRing(h.x,h.y,.8,'#b3a5ff');return false}if(now>=e.teleportAt){const h=state.heroes.find(h=>h.id===e.teleportHero&&h.hp>0);if(h){for(let i=0;i<30;i++){const x=rand(-view.worldW/2+1,view.worldW/2-1),y=rand(-view.worldH/2+1,view.worldH/2-1);if(!nearTower(x,y,h.radius)){h.x=x;h.y=y;h.initialSpawnRadius=Math.max(h.initialSpawnRadius||0,Math.hypot(x,y));h.vx=h.vy=0;break}}}e.teleportAt=0;e.nextAbility=now+10}break}
 default:e.nextAbility=Infinity;
 }
 return false;
}
function enemyDeathSpecial(e){if(e.kind==='decoy'&&!e.expired){for(const h of activeOriginalHeroes())if(Math.hypot(h.x-e.x,h.y-e.y)<=1.2)hitHero(h,1.5*signatureScale(),e);visualRing(e.x,e.y,1.2,'#edb399')}if(e.elite&&e.stage===8)for(let i=0;i<3;i++){const a=i*Math.PI*2/3;spawnGenerated(e,{hp:6,damage:2,speed:1.2,attackPeriod:1},'skeleton',Math.cos(a),Math.sin(a))}}
function stepEnemyZones(dt){for(const z of state.enemyZones){const active=Math.max(0,Math.min(dt,z.expires-(state.elapsed-dt)));if(active>0)for(const h of state.heroes)if(h.hp>0&&Math.hypot(h.x-z.x,h.y-z.y)<=z.radius)hitHero(h,z.damage*active,state.enemies.find(e=>e.id===z.owner))}state.enemyZones=state.enemyZones.filter(z=>z.expires>state.elapsed)}
function step(dt){if(state.mode!=='battle'||state.paused)return;
 state.elapsed+=dt;if(state.endlessWave&&!state.testMode)SKILLS?.endlessCheckpoint(state.elapsed);state.spawnClock+=dt;state.uiClock+=dt;ACTIONS.tick(dt);BOSSES.tick(dt);stepEnemyZones(dt);if(state.mode!=='battle')return;if(SKILLFX)SKILLFX.tick(dt);TOWER_FIRE.step(dt);
 if(state.regularSpawned===0){spawnScheduled();state.spawnClock=0}
 else if(state.regularSpawned<regularCount()&&state.spawnClock>=nextSpawnInterval()){state.spawnClock-=nextSpawnInterval();spawnScheduled()}
 // Boss arrival is checked after dead minions are removed: spawning the full wave is not enough.
 for(const a of state.heroes)a.hitFlash=Math.max(0,(a.hitFlash||0)-dt);for(const a of state.enemies)a.hitFlash=Math.max(0,(a.hitFlash||0)-dt);state.traps=state.traps.filter(p=>p.expires>state.elapsed);
 for(const p of state.totems){if(p.hp>0&&p.expires<=state.elapsed&&owns('R-SHA-D')){const h=state.heroes.find(a=>a.id===p.owner&&a.hp>0);if(h)healHero(h,h.maxHp*.1)}}state.totems=state.totems.filter(p=>p.hp>0&&p.expires>state.elapsed);
 for(const p of state.traps)if(owns('O-2-H-B3')){const h=state.heroes.find(a=>a.id===p.owner&&a.hp>0);if(h)for(const e of enemiesInRadius(p.x,p.y,p.radius))if(!p.seen.has(e.id)){p.seen.add(e.id);hunterBleed(e,h)}}
 for(const h of state.heroes){if(h.hp<=0)continue;if(h.rootedUntil>state.elapsed){h.vx=h.vy=0;continue}if(h.controlUntil>state.elapsed){const q={x:h.x+Math.cos(h.controlAngle)*2,y:h.y+Math.sin(h.controlAngle)*2};if(!legalActorPosition(h,q.x,q.y))h.controlAngle+=1.5;takeTowerSafeStep(h,q,dt,h.base.walk);continue}if(h.expiry<=state.elapsed){h.naturalExpiry=true;h.hp=0;if(h.summonKind==='undead'&&owns('R-NEC-D')){const owner=state.heroes.find(a=>a.id===h.ownerId&&a.hp>0);if(owner&&state.elapsed-(owner.lastExpiryHeal??-Infinity)>=1){owner.lastExpiryHeal=state.elapsed;healHero(owner,owner.maxHp*.03)}}continue}if(h.shieldUntil>0&&h.shieldUntil<state.elapsed){h.shield=0;h.shieldOwner=null;h.shieldCast=null}if(h.frenzyActive&&h.frenzyUntil<=state.elapsed){h.frenzyActive=false;if(owns('R-BAR-D')&&h.frenzyKills>=3)grantShield(h,h.maxHp*.2,4)}if(h.smokeActive&&h.invisibleUntil<=state.elapsed){h.smokeActive=false;if(owns('V2-ROG-02'))for(const e of state.enemies){const total=ownStatuses(e,h,'poison').reduce((n,a)=>n+a.dps*a.remaining,0);if(total>0)hitEnemy(e,total*.25,h.base.color,h.base.id,h.id,'derived')}}if(h.bearActive&&h.bearUntil<=state.elapsed){h.bearActive=false;if(owns('R-DRU-D'))healHero(h,h.maxHp*.1)}
  if(!isOriginalHero(h)){
   h.cooldown-=dt;let enemy=null,best=Infinity,rangeDistance=Infinity;for(const e of state.enemies){if(e.hp<=0||e.ethereal&&!(e.vulnerableUntil>state.elapsed))continue;const actual=Math.hypot(e.x-h.x,e.y-h.y);let d=actual;if(h.summonKind==='hound'&&e.beastFocus>state.elapsed)d*=.35;if(SKILLFX)d+=SKILLFX.summonPriority(h,e);if(d<best&&Math.hypot(e.x,e.y)<TUNING.shared.towerGuardRadius+(h.summonKind==='hound'&&SKILLS?.has('T5-BM-T01')?-.20:1)){best=d;rangeDistance=actual;enemy=e}}
   if(enemy){h.facing=Math.atan2(enemy.y-h.y,enemy.x-h.x)+Math.PI/2;if(rangeDistance>h.base.range)moveToPoint(h,enemy,dt);else if(h.cooldown<=0){h.cooldown=1/(h.base.speed*(h.alphaBuffUntil>state.elapsed?1.2:1));{const owner=state.heroes.find(a=>a.id===h.ownerId&&a.hp>0);let mult=1;if(h.summonKind==='hound'){if(owns('R-BEA-B')&&!h.firstSummonHit)mult+=.5;if(h.whipBoost){mult+=.5;h.whipBoost=false}if(owns('V2-BEA-01')&&Math.random()<.25)mult*=2;if(owns('V2-BEA-02'))mult+=Math.min(.5,(SKILLS?.permanentDamageBonus?.('beastmaster')||0)*.5)}if(h.summonKind==='undead'&&owner&&owns('V2-NEC-01')&&owner.beamTime>=cfg(owner).special.beamRampSeconds)mult+=.5;h.firstSummonHit=true;const actual=hitEnemy(enemy,h.base.damage*mult,h.base.color,heroSourceId(h),h.ownerId,'summon');if(owner&&h.summonKind==='hound'){if(owns('O-5-BM-A4'))healHero(owner,actual*.1);if(owns('R-BEA-D')&&enemy.hp<=0&&enemy.scheduled&&state.elapsed-(owner.lastDogHeal??-Infinity)>=2){owner.lastDogHeal=state.elapsed;healHero(owner,owner.maxHp*.05)}}}visualBeam(h,enemy)}}continue;
  }
  const tc=cfg(h),isBear=h.base.id==='druid'&&h.bearUntil>state.elapsed;
  let target=selectHeroTarget(h,dt);
  if(h.base.id==='necromancer'&&h.beamTarget!=null){const ongoing=state.enemies.find(e=>e.id===h.beamTarget&&e.hp>0);if(ongoing&&Math.hypot(ongoing.x-h.x,ongoing.y-h.y)<=h.base.range&&Math.hypot(h.x,h.y)<=guardRadius(h)+.05)target=ongoing}
  stepSpecials(h,dt);
  if(!target){h.attackState='idle';h.windupTime=0;h.slotIndex=-1;h.slotTarget=null;if(h.base.id==='necromancer')stepNecroBeam(h,null,dt);if(h.base.range<=2.15&&Math.hypot(h.x-h.anchorX,h.y-h.anchorY)>.52)moveToPoint(h,{x:h.anchorX,y:h.anchorY},dt);else brake(h,dt);continue}
  const dist=Math.hypot(target.x-h.x,target.y-h.y),attackRange=(isBear?1.3:h.base.range)+(target.boss&&h.base.range<=2.15?.4:0);
  h.facing=Math.atan2(target.y-h.y,target.x-h.x)+Math.PI/2;
  const goal=heroCombatGoal(h,target,isBear);
  if(goal&&dist>attackRange-(!isBear&&h.base.range>2.15?0:.02)){h.attackState='approach';h.windupTime=0;moveToPoint(h,goal,dt);if(h.base.id==='necromancer')stepNecroBeam(h,null,dt);continue}
  if(goal&&(h.base.range<=2.15||isBear)&&Math.hypot(goal.x-h.x,goal.y-h.y)>.15)moveToPoint(h,goal,dt*.7);else brake(h,dt);
  if(h.base.id==='necromancer'){h.attackState='channel';h.engagedTargetId=target.id;stepNecroBeam(h,target,dt);continue}
  const cycle=1/((isBear?h.base.speed*.8/.65:h.base.speed)*(h.frenzyUntil>state.elapsed?cfg(h).special.frenzyAttackSpeedMultiplier:1)*(1+(h.bannerUntil>state.elapsed?.25:0)+(h.blessingUntil>state.elapsed&&owns('O-3-PR-B4')?.25:0)+ACTIONS.fellowship(h)));
  if(h.windupTime>0){h.windupTime-=dt;h.attackState='windup';if(h.windupTime>0)continue;
   const aim=state.enemies.find(e=>e.id===h.windupTarget&&e.hp>0);
   if(aim&&Math.hypot(aim.x-h.x,aim.y-h.y)<=attackRange+.2){if(isBear){const bearDamage=(SKILLS?SKILLS.bearBasicDamage()*h.skinMultiplier:h.base.damage)*(SKILLS?SKILLS.heroBonus(h,aim):1);h.clawCount=(h.clawCount||0)+1;const actual=hitEnemy(aim,bearDamage,h.base.color,h.base.id,h.id);if(owns('O-4-D-B4'))healHero(h,actual*.15);if(owns('O-4-D-B5')&&h.clawCount%3===0)vineWave(h,aim,h.base.damage,true);visualBeam(h,aim,'#b2e585');visualRing(aim.x,aim.y,.5,'#96d46e');if(SKILLFX)SKILLFX.afterBasic(h,aim,bearDamage,true)}else{basicAttack(h,aim)}}
   h.cooldown=cycle*.8;h.attackState='recovery';h.windupTarget=null;continue;
  }
  h.cooldown-=dt;
  if(h.cooldown<=0){h.windupTime=cycle*.2;h.windupTarget=target.id;h.engagedTargetId=target.id;h.attackState='windup'}else h.attackState='recovery';
 }
 stepSanctuaries(dt);
 stepSporeClouds(dt);
 tickAttackEffects(dt);
 for(const e of [...state.enemies]){if(e.hp<=0||e.capturing)continue;if(e.stunnedUntil>state.elapsed)continue;const busy=enemySpecial(e,dt);if(state.mode!=='battle')return;if(busy)continue;
  let hero=null,closest=TUNING.shared.enemyHeroDetection**2;for(const h of state.heroes){if(h.hp<=0||h.invisibleUntil>state.elapsed)continue;const d=(h.x-e.x)**2+(h.y-e.y)**2;if(d<=closest){hero=h;closest=d}}
  let totem=null,totemDist=Infinity;for(const p of state.totems){const sq=(p.x-e.x)**2+(p.y-e.y)**2;if(sq<=p.radius*p.radius&&sq<totemDist){totem=p;totemDist=sq}}
  const wraithReach=hero?actorRadius(e)+actorRadius(hero)+.22:.34;
  // A Wraith blocked against the tower must be able to complete a normal attack wind-up.
  // Only use the tower fallback after three seconds without a reachable target at its edge.
  const atTowerEdge=e.ethereal&&nearTower(e.x,e.y,actorRadius(e)+.40),heroReachable=hero&&Math.hypot(hero.x-e.x,hero.y-e.y)<=wraithReach;
  e.wraithBlockedTime=atTowerEdge&&!totem&&!heroReachable?(e.wraithBlockedTime||0)+dt:0;
  const wraithTowerFallback=atTowerEdge&&e.wraithBlockedTime>=3;
  if(wraithTowerFallback)hero=null;
  const target=totem||hero||towerApproach(e);
  // Attack the actual tower perimeter, not only the assigned movement lane.
  const towerContact=!totem&&!hero&&nearTower(e.x,e.y,actorRadius(e)+.34);
  const dist=wraithTowerFallback||towerContact?0:Math.hypot(target.x-e.x,target.y-e.y);e.attackingTower=!totem&&!hero&&dist<1.5;
  const reach=totem?actorRadius(e)+.35:hero?(e.faction&&e.factionIndex===1?3.5:(e.stage===4&&!e.elite&&!e.boss)?3:(e.stage===7&&!e.elite&&!e.boss)?3.5:actorRadius(e)+actorRadius(hero)+.22):.34;
  if(hero&&!totem&&!e.boss&&!e.elite&&!e.generated&&e.stage===6&&dist>reach&&dist<=2.5&&!(e.dashReady>state.elapsed)){const len=Math.min(2,Math.max(0,dist-reach+.02)),x=e.x+(hero.x-e.x)/dist*len,y=e.y+(hero.y-e.y)/dist*len;if(legalActorPosition(e,x,y)&&!nearTower((e.x+x)/2,(e.y+y)/2,e.radius)){e.x=x;e.y=y;e.dashReady=state.elapsed+5;e.inAttackRange=true;e.cooldown=e.attackPeriod;hitHero(hero,e.damage,e);visualRing(x,y,.5,'#f2c892');continue}}
  if(dist<=reach){
    // Regular minions need 0.65s to wind up after first reaching contact; bosses do not.
    if(!e.inAttackRange){e.inAttackRange=true;if(!e.boss)e.cooldown=Math.max(e.cooldown,e.firstDelay??SPAWN_CONFIG.minionFirstAttackWindup);}
    e.cooldown-=dt;if(e.ethereal&&e.cooldown<=.15)e.vulnerableUntil=Math.max(e.vulnerableUntil||0,state.elapsed+.15);if(e.cooldown<=0){if(e.ethereal)e.vulnerableUntil=state.elapsed+.85;e.cooldown=e.attackPeriod??1;
    const damage=e.damage*(e.ritualUntil>state.elapsed?1.5:1)*(e.weakUntil>state.elapsed?(owns('O-4-S-A4')?.775:.85):1)*(e.weakerUntil>state.elapsed?.8:1);
    if(totem){totem.hp-=damage;const h=state.heroes.find(a=>a.id===totem.owner&&a.hp>0);if(h&&damage>0){totem.hits=(totem.hits||0)+1;if(owns('O-4-S-B3')&&totem.hits%5===0)grantCharge(h,.1);if(totem.hp<=0){if(owns('V2-SHA-02'))h.totemVengeance=true;if(owns('O-4-S-B5')&&!totem.reformed&&totem.expires>state.elapsed){totem.reformed=true;totem.hp=totem.maxHp*.3}}}visualRing(totem.x,totem.y,.35,'#51dcc0')}
    else if(hero){if(!e.boss&&!e.elite&&!e.generated&&(e.stage===4||e.stage===7))visualBeam(e,hero,e.stage===7?'#ff995b':'#d3d9e0',.25);const dealt=hitHero(hero,damage,e);if(dealt>0)damageNumber(hero.x,hero.y-.7,'−'+dealt.toFixed(1),'#ffb6a7');if(hero.hp===0&&!hero.capture)log('Your '+hero.base.name+' was defeated.')}
    else{applyTowerDamage(damage);if(state.mode==='over')break}
  }}else if(dist>0){e.inAttackRange=false;let mult=ACTIONS.slow(e);for(const p of state.traps)if(Math.hypot(e.x-p.x,e.y-p.y)<=p.radius){mult=Math.min(mult,p.slow)}if(e.slowUntil>state.elapsed)mult=Math.min(mult,e.slowFactor||.75);if(e.rootUntil>state.elapsed)mult=0;if(e.stage===1&&!e.elite&&!e.boss&&e.kind!=='decoy'){const hop=((state.elapsed+e.id*.17)%0.8);if(hop<.36)takeTowerSafeStep(e,target,dt,e.speed*mult*(.8/.36));else{e.vx=e.vy=0}}else takeTowerSafeStep(e,target,dt,e.speed*mult)}else brake(e,dt)
 }
 if(state.mode!=='battle')return;
 resolveActorCollisions();
 // Process deaths after all attacks; event-based necromancy is an on-kill event, never timed or random.
 // Boss transformations are one encounter, not fresh reward-bearing enemies.
 for(let i=state.enemies.length-1;i>=0;i--){
  const e=state.enemies[i];
  if(e.boss&&!e.faction&&e.stage===1&&e.hp<=e.maxHp*.5&&!state.bossRewardPending){
   state.bossRewardPending=true;state.bossKilled=true;
   state.enemies.splice(i,1);
   for(let n=0;n<4;n++){
    const angle=Math.PI*2*n/4+.4;
    const child=spawnEnemy(false,'generated',{x:e.x+Math.cos(angle)*1.25,y:e.y+Math.sin(angle)*1.25});
    Object.assign(child,waveScale(state.endlessWave?E.basic(BALANCE.stages,1):BALANCE.stages[0].basic));child.maxHp=child.hp;child.stage=1;
    child.kind='king-split';child.scheduled=false;child.generated=true;
    child.vx=Math.cos(angle)*1.5;child.vy=Math.sin(angle)*1.5;
   }
   visualRing(e.x,e.y,2,'#9affbb');log('King Slime split into FOUR Slimes — defeat them all!');
   break;
  }
 }
 for(let i=state.enemies.length-1;i>=0;i--){
  const e=state.enemies[i];if(e.hp>0)continue;
  if(e.boss&&!e.faction&&e.stage===10&&e.phase<3){
   e.phase++;
   const next=waveScale(state.endlessWave?E.boss(BALANCE.stages,10,e.phase):BALANCE.stages[9].boss.phases[e.phase-1]);
   e.hp=e.maxHp=next.hp;e.damage=next.damage;e.speed=next.speed;e.attackPeriod=next.attackPeriod;
   e.hitFlash=.5;e.cooldown=.5;e.lastHitHero=null;e.lastHitOwner=null;e.treeStatuses=[];e.doomMarks=[];e.noDoomProc=false;e.noBurnDeathProc=false;e.noBleedBurst=false;BOSSES.init(e);
   visualRing(e.x,e.y,2+e.phase*.45,'#d18fff');
   log('Eldritch Horror reborn — Phase '+e.phase+' of 3!');
   continue;
  }
  if(e.faction){state.factionDefeated++;log(e.name+' defeated!')}else if(e.boss){BOSSES.die(e);state.bossKilled=true;log(encounter().boss+' defeated!')}
  for(const mark of e.doomMarks||[]){if(mark.until<=state.elapsed||e.noDoomProc)continue;const owner=state.heroes.find(h=>h.id===mark.owner&&h.hp>0);if(!owner)continue;const d=mark.damage*(owns('V2-WAR-02')&&e.lastHitOwner===owner.id&&e.lastHitKind==='siphon'?3:1);visualRing(e.x,e.y,1.25,'#be86df');for(const other of enemiesInRadius(e.x,e.y,1.25).slice(0,4)){if(other===e)continue;if(owns('O-4-W-A5'))applyStatus(other,owner,'darkFlame',d*.5,3);hitEnemy(other,d,'#ca91ef','warlock',owner.id,'derived');if(other.hp<=0)other.noDoomProc=true}if(owns('O-4-W-A4'))owner.doomBonus=Math.min(1,(owner.doomBonus||0)+.05);if(owns('V2-WAR-01')&&state.elapsed-(owner.lastDoomCharge??-Infinity)>=1){owner.lastDoomCharge=state.elapsed;grantCharge(owner,.05)}if(owns('R-WAR-D')&&owner.hp<owner.maxHp*.5&&state.elapsed-(owner.lastDoomHeal??-Infinity)>=1){owner.lastDoomHeal=state.elapsed;healHero(owner,owner.maxHp*.03)}}
  if(e.scheduled&&!e.boss){state.scheduledDefeated++;SKILLS?.scheduledKill()}const upDrop=SKILLS?SKILLS.recordKill(e.lastHitHero||null,!!e.boss&&!e.faction,{scheduled:!!e.scheduled,elite:!!e.elite,mutated:!!e.mutated,faction:!!e.faction,rewardId:'enemy-'+e.id}):0;if((e.mutated||e.faction||state.endlessWave&&e.boss)&&!state.testMode){state.shardsEarned=(state.shardsEarned||0)+1;log('+1 Shard · '+(e.faction?e.name:'Mutated enemy'))}
  if(upDrop>0){state.upEarned=Number((state.upEarned+upDrop).toFixed(3));state.upDrops++;const amount=Number(upDrop.toFixed(2));if(e.boss)log('Boss reward: +'+amount+' UP guaranteed!');else damageNumber(e.x,e.y-.55,'+'+amount+' UP','#ffd886');}
  enemyDeathSpecial(e);onEnemyDeath(e);if(e.scheduled||e.boss)state.kills++;state.enemies.splice(i,1);
 }
 state.enemies=state.enemies.filter(e=>!(e.expired&&e.kind==='lich-skeleton'&&e.hp<=0));

 if(owns('V2-NEC-02'))for(const h of state.heroes){if(h.hp>0||h.summonKind!=='undead'||h.naturalExpiry||h.evicted)continue;const owner=state.heroes.find(a=>a.id===h.ownerId&&a.hp>0);if(owner)owner.graveBonus=Math.min(1,(owner.graveBonus||0)+.05)}
 ACTIONS.captureTick();state.heroes=state.heroes.filter(h=>h.hp>0||h.capture);
 // Only begin the boss intermission once every regular minion has spawned AND been defeated.
 if(state.endlessWave&&!endlessPlan().boss&&state.regularSpawned===regularCount()&&state.scheduledDefeated>=regularCount()&&state.enemies.length===0){clearStage();return}
 if(!state.bossSpawned&&state.regularSpawned===regularCount()&&state.scheduledDefeated>=regularCount()&&state.enemies.length===0){
  state.bossWaitClock+=dt;
  if(state.bossWaitClock>=BOSS_AFTER_CLEAR_DELAY){state.bossWaitClock=0;if(state.wavePlan.faction&&state.factionSpawned<3){const e=spawnEnemy(true,'faction');state.factionSpawned++;log(e.name+' has arrived!')}else{spawnEnemy(true);state.bossSpawned=true;if(owns('R-G08'))for(const h of activeOriginalHeroes())grantShield(h,h.maxHp*.15,5);log((state.endlessWave?ENCOUNTERS[endlessPlan().boss-1].boss:encounter().boss)+' has arrived after the minion wave!')}}
 }else if(!state.bossSpawned)state.bossWaitClock=0;
 if(state.bossSpawned&&state.bossKilled&&state.regularSpawned===regularCount()&&state.enemies.length===0){clearStage();return}
 if(state.uiClock>=.16){state.uiClock=0;updateUI()}
}
function tick(now){
 const dt=state.lastTime?clamp((now-state.lastTime)/1000,0,.06):0;
 state.lastTime=now;
 const lab=document.body.classList.contains('lab-mode');
 const multiplier=lab?clamp(Number(window.__FW_LAB_SPEED__)||1,.25,100):1;
 const simulated=dt*multiplier;
 if(state.mode==='battle'&&!state.paused){
  if(lab){
   let remaining=simulated,steps=0;
   while(remaining>1e-7&&state.mode==='battle'&&steps<160){
    const slice=Math.min(.05,remaining);
    step(slice);
    remaining-=slice;steps++;
   }
  }else step(dt);
 }
 for(let i=state.effects.length-1;i>=0;i--){
  if(state.mode!=='battle'||!state.paused)state.effects[i].life-=lab?simulated:dt;
  if(state.effects[i].life<=0)state.effects.splice(i,1);
 }
 render(now/1000);TOWER_FIRE.draw();requestAnimationFrame(tick);
}
const {updateUI:refreshBaseUI,showBattleReport,waveStatus,rollShop,offeredPacks,selectedStock}=window.FWGameUI.create({state,refs,PACKS,HEROES,HERO_MAP,ENCOUNTERS,TUNING,SKILLS,regularCount,totalCount,encounter,chargeSeconds,isOriginalHero,nextSpawnInterval,NORMAL_SPAWN_INTERVAL,BOSS_AFTER_CLEAR_DELAY});
function updateUI(){refreshBaseUI();refreshActionsUI();refreshEndlessUI()}
function refreshActionsUI(){
 const a=ACTIONS.snapshot(),prep=state.mode==='prep',battle=state.mode==='battle',panel=$('battleActions');
 if(!panel)return;panel.hidden=!(a.known.length&&(prep||battle)||battle&&a.captures.length);
 for(let slot=0;slot<2;slot++){
  const select=$('spellEquip'+slot),button=$('spellCast'+slot);if(!select||!button)continue;
  select.hidden=!prep||!a.known.length||slot>=a.slots;button.hidden=!battle||!a.loadout[slot];
  const k=a.loadout[slot],key=JSON.stringify([a.known,a.loadout,slot]);if(select.dataset.key!==key){select.dataset.key=key;select.innerHTML='<option value="">No spell</option>'+a.known.filter(x=>!a.loadout.includes(x)||x===k).map(x=>'<option value="'+x+'">'+window.FWBattleActions.spells[x].name+'</option>').join('');select.value=k||''}
  if(k){const cd=a.cooldowns[k]||0;button.textContent=window.FWBattleActions.spells[k].name+(a.armed===k?' · choose target':cd>0?' · '+Math.ceil(cd)+'s':' · Ready');button.disabled=state.paused||cd>0;button.setAttribute('aria-pressed',String(a.armed===k))}
 }
 $('spellCancel').hidden=!battle||!a.armed;$('spellHelp').textContent=a.armed?'Tap the battlefield to cast; rescue taps take priority.':prep&&a.known.length?'Equip known spells before battle.':battle&&a.loadout.length?'Select a ready spell, then tap its target.':'';
 const selected=a.captures.find(c=>c.hero===state.selectedCapture);$('captureStatus').textContent=selected?selected.name+' · '+(selected.required?Math.floor(selected.progress)+' / '+selected.required+' taps':'No rescues remaining')+' · '+selected.remaining.toFixed(1)+'s':a.captures.length?a.captures.length+' captured · tap a downed hero to rescue.':'';
}
function buyPack(){if(state.endlessHub)return;const stock=selectedStock();if(!stock||state.mode!=='prep'||state.testMode)return;const remaining=M.buy(state.merchantShop,state.selectedSlot,state.coins);if(remaining===null)return;stock.order=state.bought;state.coins=remaining;state.packQueue.push(stock.packIndex);state.bought++;log(M.label(stock)+' purchased · '+stock.qty+' hero slot(s).');updateUI();saveShopStock()}
function rerollMerchant(){if(state.endlessHub)return;if(state.mode!=='prep'||state.testMode)return;const coins=M.reroll(state.merchantShop,state.coins);if(coins===null)return;state.coins=coins;state.shopCacheKey='';updateUI();saveShopStock()}
function reserveMerchant(){if(state.endlessHub)return;if(state.mode!=='prep'||state.testMode)return;if(M.reserve(state.merchantShop,state.selectedSlot)){state.shopCacheKey='';updateUI();saveShopStock()}}

function toggleTesting(){if(state.mode!=='prep'||state.endlessWave||state.endlessHub)return;if(!state.testMode&&state.bought>0){log('Finish the regular-pack stage before enabling the separate Testing Shop.');return}if(!state.testMode){state.testSavedTowerHp=state.towerHp;state.testSavedStage=state.stage;state.testSavedMerchant={shop:state.merchantShop,id:state.merchantAttemptId,coins:state.coins,slot:state.selectedSlot}}state.testMode=!state.testMode;if(!state.testMode){state.testQueue=[];if(state.testSavedTowerHp!=null)state.towerHp=state.testSavedTowerHp;if(state.testSavedStage!=null)state.stage=state.testSavedStage;state.testSavedTowerHp=null;state.testSavedStage=null;if(state.testSavedMerchant){const m=state.testSavedMerchant;state.merchantShop=m.shop;state.shopOffers=m.shop.offers;state.merchantAttemptId=m.id;state.coins=m.coins;state.selectedSlot=m.slot;state.shopCacheKey='';state.testSavedMerchant=null}}log(state.testMode?'Testing mode ON · free heroes do not affect progression.':'Testing mode OFF.');updateUI()}
function addTestHero(base){if(!state.testMode||state.mode!=='prep')return;state.testQueue.push(base.id);log('Queued free '+base.name+' ('+state.testQueue.length+' test heroes).');updateUI()}
function openNextPack(){state.pendingPack=true;state.openedHeroes=null;state.currentRevealPack=state.packQueue[state.bought-state.packsToOpen]??0;const pack=PACKS[state.currentRevealPack];refs.revealKicker.textContent=pack.name+' Pack '+(state.bought-state.packsToOpen+1)+' of '+state.bought;refs.revealTitle.textContent='Open your '+pack.name+' Pack';refs.revealDesc.textContent='One random hero emerges from the '+pack.name+' pool.';refs.sealed.classList.remove('hidden');refs.drawGrid.classList.add('hidden');refs.drawGrid.replaceChildren();refs.revealButton.disabled=false;refs.revealButton.textContent='✦ Reveal hero';refs.revealFoot.textContent=PACKS[state.currentRevealPack].pool.map(id=>HERO_MAP[id].name).join(' · ')+' | Provisional equal-weight draws';refs.modal.classList.add('active');refs.modal.setAttribute('aria-hidden','false');refs.revealButton.focus();updateUI()}
function revealPack(){if(state.mode!=='opening'||!state.pendingPack)return;
 if(!state.openedHeroes){const heroes=Array.from({length:HEROES_PER_PACK},()=>chooseHero(state.currentRevealPack));state.openedHeroes=heroes;refs.revealKicker.textContent='NEW HERO';refs.revealTitle.textContent='Pack revealed!';refs.revealDesc.textContent='This hero joins the stage when you continue.';refs.drawGrid.replaceChildren(...heroes.map(hero=>{const el=document.createElement('div');el.className='draw-card';el.style.setProperty('--reveal-color',hero.color);el.innerHTML=`<span class="draw-tier">${hero.rarity}</span><span class="draw-glyph">${hero.glyph}</span><b>${hero.name}</b><small>${hero.hp} HP · ${hero.damage} DMG<br>${hero.speed}/s · ${hero.walk} walk</small>`;return el}));refs.sealed.classList.add('hidden');refs.drawGrid.classList.remove('hidden');refs.revealButton.textContent='✦ Deploy hero';refs.revealFoot.textContent='Class weights and duplicate rules remain open design choices.';log(PACKS[state.currentRevealPack].name+' Pack revealed: '+heroes.map(h=>h.name).join(', ')+'.')}
 else{for(const hero of state.openedHeroes)createHero(hero);if(SKILLS)SKILLS.recordPack(state.currentRevealPack);state.packsToOpen--;state.openedHeroes=null;state.pendingPack=false;if(state.packsToOpen>0)openNextPack();else{refs.modal.classList.remove('active');refs.modal.setAttribute('aria-hidden','true');beginBattle()}updateUI()}
}

function beginBattle(){ACTIONS.reset();BOSSES.reset();state.necroRoundRobin=0;SKILLS?.startAttempt();state.wavePlan=wavePlan();state.firstEncounterProtected=state.wavePlan.protectedAttempt;if(!state.endlessWave)SKILLS?.markStageAttempt(state.stage);state.factionSpawned=0;state.factionDefeated=0;state.scheduledDefeated=0;state.shardsEarned=0;state.enemyZones=[];state.mode='battle';state.paused=false;state.regularSpawned=0;state.bossSpawned=false;state.kills=0;state.elapsed=0;state.spawnClock=0;state.uiClock=0;state.bossKilled=false;state.bossRewardPending=false;state.bossWaitClock=0;state.enemies=[];TOWER_FIRE.reset();state.effects=[];state.hazards=[];state.pendingHits=[];state.totems=[];state.traps=[];state.sanctuaries=[];state.sporeClouds=[];state.abilityCasts=0;state.towerShield=0;state.lastTowerShield=false;state.combatTelemetry={overlaps:0,targetSwitches:0,blocked:0};state.deployedHeroes=state.heroes.filter(h=>h.hp>0&&isOriginalHero(h)).length;state.upEarned=0;state.upDrops=0;state.lastReport=null;refs.battleReport.hidden=true;log('Stage '+state.stage+' · '+encounter().name+' — '+regularCount()+' '+encounter().minion+' units and '+encounter().boss+'.'+(state.testMode?' (test only)':''));if(state.heroes.length===0)log('Warning: no heroes have been recruited.');updateUI()}
function resetPreparation(restoreTower=true){ACTIONS.reset();BOSSES.reset();state.wavePlan=null;state.factionSpawned=0;state.factionDefeated=0;state.scheduledDefeated=0;state.shardsEarned=0;state.enemyZones=[];state.coins=state.coinMax;if(restoreTower)state.towerHp=state.towerMax||100;state.mode='prep';state.paused=false;state.bought=0;state.packQueue=[];state.packsToOpen=0;state.testQueue=[];state.heroes=[];state.enemies=[];state.effects=[];state.hazards=[];state.pendingHits=[];state.totems=[];state.traps=[];state.sanctuaries=[];state.sporeClouds=[];state.abilityCasts=0;state.regularSpawned=0;state.bossSpawned=false;state.kills=0;state.bossKilled=false;state.bossRewardPending=false;state.elapsed=0;state.spawnClock=0;state.bossWaitClock=0;state.uiClock=0;TOWER_FIRE.reset();state.upEarned=0;state.upDrops=0;state.deployedHeroes=0;state.lastReport=null;state.bossRewardPending=false;refs.battleReport.hidden=true;state.pendingPack=false;state.openedHeroes=null;refs.overlay.classList.add('hidden');if(SKILLS)SKILLS.recalc();state.coins=state.coinMax;rollShop();if(!initialising)applyShopTheft();updateUI();saveShopStock()}
function startStage(){if(state.endlessHub)return;if(state.endlessWave&&state.mode==='clear'){if(state.testMode){state.endlessWave++;state.stage=E.wave(state.endlessWave).family;resetPreparation()}else prepareEndless();return}if(state.mode==='clear'){if(!state.testMode)state.stage++;resetPreparation(true);if(SKILLS&&!state.testMode)SKILLS.checkpointStage(state.stage);log((state.testMode?'Test preparation':'Stage '+state.stage+' preparation')+' has begun.');updateUI();return}
 if(state.mode!=='prep')return;
 if(!state.endlessWave&&SKILLS&&!state.testMode)SKILLS.checkpointStage(state.stage);
 if(state.testMode){for(const id of state.testQueue)createHero(HERO_MAP[id]);state.testQueue=[]}
 else{
  if(!state.bought){log('Purchase at least one hero offer before starting.');return;}
  const plan=M.resolve(state.merchantShop,SKILLS.merchantState().pity);
  if(!SKILLS.commitMerchant(state.merchantAttemptId,plan)){log('This merchant transaction was already committed.');return;}
  clearShopStock();
  const deployed=plan.heroes.map(id=>createHero(HERO_MAP[id],SKILLS.drawSkin(id)));
  log('Deployed '+deployed.map(h=>h.base.name+(h.skin.key!=='default'?' ('+h.skin.name+' · '+h.skin.rarity+')':'')).join(', ')+'.');
 }
 state.packsToOpen=0;state.pendingPack=false;beginBattle()
}

function clearStage(){ACTIONS.reset();BOSSES.reset();
 if(state.bossRewardPending){
  state.bossRewardPending=false;state.kills++;
  const reward=SKILLS?SKILLS.recordKill(null,true,{rewardId:'king-split-boss'}):0;if(state.endlessWave&&!state.testMode)state.shardsEarned++;
  if(reward>0){state.upEarned=Number((state.upEarned+reward).toFixed(2));state.upDrops++;log('King Slime defeated! +'+reward+' UP boss reward.');}
 }
 if(!state.endlessWave)SKILLS?.recordWin(state.stage);SKILLS?.finishAttempt(true);showBattleReport();if(state.endlessWave){if(!state.testMode)SKILLS?.finishEndless(true);state.mode='clear';state.heroes=[];state.effects=[];refs.messageTitle.textContent='Endless Wave '+state.endlessWave+' Cleared';refs.messageText.textContent='Rewards retained. Prepare a fresh army for the next wave.';refs.messageButton.textContent='Prepare next wave';refs.overlay.classList.remove('hidden');updateUI();return}state.mode=(!state.testMode&&state.stage===10)?'champion':'clear';state.heroes=[];state.effects=[];state.hazards=[];state.pendingHits=[];refs.messageSymbol.textContent='✦';refs.messageTitle.textContent=state.mode==='champion'?'Ten Stages Complete!':'Stage '+state.stage+' Cleared';refs.messageText.textContent=state.mode==='champion'?'You have cleared all ten stages and defeated the Eldritch Horror. The campaign is complete. Continue to Endless or return to progression.':state.testMode?'Test battle completed. Debug battles do not advance your stage. Return to preparation with full coins.':'The boss has fallen and the tower stands! All heroes leave after this stage. Your next round refills to '+state.coinMax+' coins.';refs.messageButton.textContent=state.mode==='champion'?'Continue to Endless':state.testMode?'Back to Testing Prep':'Prepare Stage '+(state.stage+1);refs.overlay.classList.remove('hidden');log('Stage '+state.stage+' cleared!'+(state.testMode?' (debug only)':''));updateUI()}
function gameOver(){ACTIONS.reset();BOSSES.reset();SKILLS?.finishAttempt(false);showBattleReport();if(state.endlessWave){if(!state.testMode)SKILLS?.finishEndless(false);state.mode='over';state.paused=false;refs.messageTitle.textContent='Endless run ended';refs.messageText.textContent='Wave '+state.endlessWave+' attempted. Earned rewards are retained.';refs.messageButton.textContent='Return to progression';refs.overlay.classList.remove('hidden');updateUI();return}if(SKILLS&&!state.testMode)SKILLS.checkpointStage(state.stage);state.mode='over';state.paused=false;refs.messageSymbol.textContent='♜';refs.messageTitle.textContent='Stage '+state.stage+' Failed';refs.messageText.textContent='You defeated '+state.kills+' of '+totalCount()+' enemies. Earned UP is retained; spend it before retrying with restored tower health and coins.';refs.messageButton.textContent='↻ Retry Stage '+state.stage;refs.overlay.classList.remove('hidden');log('Stage '+state.stage+' failed. You can retry.');updateUI()}
function retryStage(){if(state.mode!=='over')return;if(state.endlessWave){if(state.testMode){state.endlessWave=1;state.stage=1;resetPreparation()}else returnHub();return}resetPreparation();log('Retry Stage '+state.stage+' — 100 tower HP and '+state.coinMax+' coins.');updateUI()}
function restart(){state.endlessWave=0;state.endlessHub=false;state.stage=1;state.coinMax=BALANCE.economy.startingCoinMax;state.testMode=false;state.testSavedTowerHp=null;state.testSavedStage=null;state.notifications=[];resetPreparation();refs.modal.classList.remove('active');refs.modal.setAttribute('aria-hidden','true');if(SKILLS)SKILLS.recalc();log('New run — defend the tower!');updateUI()}

function prepareEndless(){const e=SKILLS?.endlessState().session;if(!e||e.phase!=='prep')return false;state.endlessHub=false;state.endlessWave=e.wave;state.stage=E.wave(e.wave).family;resetPreparation();return true}
function returnHub(){state.endlessWave=0;state.endlessHub=true;state.stage=10;state.mode='prep';state.paused=false;state.bought=0;state.heroes=[];state.enemies=[];refs.overlay.classList.add('hidden');updateUI();return true}
function enterEndless(){if(!SKILLS?.enterEndless())return false;return prepareEndless()}
function saveExitEndless(){if(state.mode==='clear'&&state.endlessWave)prepareEndless();if(state.mode!=='prep'||!state.endlessWave||!SKILLS?.exitEndless())return false;saveShopStock();return returnHub()}
function resumeEndless(){if(!SKILLS?.resumeEndless())return false;const e=SKILLS.endlessState().session;state.endlessHub=false;state.endlessWave=e.wave;state.stage=E.wave(e.wave).family;state.mode='prep';state.towerHp=state.towerMax;if(!restoreShopStock())prepareEndless();updateUI();return true}
function retireEndless(){if(!SKILLS?.endlessState().session||!confirm('Retire this Endless run? Earned rewards are retained.'))return false;SKILLS.endEndless('Retired');clearShopStock();return returnHub()}
function refreshEndlessUI(){const e=SKILLS?.endlessState();if(!e)return;const panel=$('endlessPanel');if(!panel)return;panel.hidden=state.testMode||!e.available;const w=endlessPlan(),session=e.session;const secondary=$('endlessOverlayExit');if(secondary){secondary.hidden=!(state.mode==='champion'||state.endlessWave&&state.mode==='clear'&&!state.testMode);secondary.textContent=state.mode==='champion'?'Return to progression':'Save & Exit'} $('endlessInfo').textContent=(w?'Endless Wave '+w.wave+' · '+ENCOUNTERS[w.family-1].minion+' · '+w.slots+' enemies'+(w.boss?' · Boss: '+ENCOUNTERS[w.boss-1].boss:'')+(E.invasion(w.wave,currentPrestige())?' · Hollow Legion':''):'Campaign complete')+' · Best: '+(e.best?.completed||0)+' · Deepest: '+e.deepest+(e.last?' · Last run: '+e.last.completed+' cleared / '+e.last.wave+' attempted · '+e.last.kills+' kills · '+e.last.bosses+' bosses · '+Math.floor(e.last.seconds)+'s · '+e.last.up.toFixed(2)+' UP / '+e.last.shards+' Shards':'');$('endlessEnter').hidden=!!session||!['prep','champion','over'].includes(state.mode);$('endlessResume').hidden=!session||!state.endlessHub;$('endlessExit').hidden=!state.endlessWave||!['prep','clear'].includes(state.mode);$('endlessRetire').hidden=!session||state.mode==='battle';$('endlessHub').hidden=state.mode!=='champion'&&!(state.endlessWave&&state.mode==='over');if(state.endlessHub){refs.buy.disabled=true;refs.start.disabled=true;$('rotateShop').disabled=true;$('reserveShop').disabled=true;refs.shopTitle.textContent='Progression Hub';refs.shopDescription.textContent='Spend Legacy Shards outside an active Endless run, or enter/resume Endless.'}else if(w){refs.start.textContent=state.mode==='prep'?'Start Endless Wave '+w.wave:state.mode==='clear'?'Prepare next wave':refs.start.textContent;} }
function init(){
 $('endlessOverlayExit')?.addEventListener('click',()=>state.mode==='champion'?returnHub():saveExitEndless());
 for(const [id,fn] of [['endlessEnter',enterEndless],['endlessResume',resumeEndless],['endlessExit',saveExitEndless],['endlessRetire',retireEndless],['endlessHub',returnHub]])$(id)?.addEventListener('click',fn);
 for(let slot=0;slot<2;slot++){ $('spellEquip'+slot)?.addEventListener('change',e=>{SKILLS?.setSpellLoadout(slot,e.target.value);updateUI()});$('spellCast'+slot)?.addEventListener('click',()=>{const k=ACTIONS.loadout()[slot];if(k)ACTIONS.arm(k);updateUI()})} $('spellCancel')?.addEventListener('click',()=>{ACTIONS.cancel();updateUI()});
 // The full tree controls available pack offers and persistent progression.
 for(const h of HEROES.filter(h=>h.pack===0)){const div=document.createElement('div');div.className='odd';div.style.setProperty('--hcolor',h.color);div.innerHTML=`<i></i><span class="nm">${h.name}</span><span class="tier">${h.rarity}</span><b>Pool</b>`;$('odds').append(div)}
 for(const p of PACKS){const div=document.createElement('div');div.className='pack-tier';div.textContent=p.name+' Pack';refs.packProgress.append(div)}
 if(SKILLS)SKILLS.connect({state,heroes:HEROES,packs:PACKS,tuning:TUNING,hound:HOUND,undead:UNDEAD,log,refresh:()=>{updateUI();saveShopStock()},restart});
 const questPanel=$('questPanel');if(questPanel)questPanel.addEventListener('click',e=>{const b=e.target.closest?.('[data-quest]');if(b)SKILLS?.showQuest?.(b.dataset.quest);});if(SKILLFX)SKILLFX.connect({state,heroes:HEROES,tuning:TUNING,hitEnemy,pushEnemy,visualRing,nearTower,addEffect});
 for(let i=1;i<=10;i++){const opt=document.createElement('option');opt.value=String(i);opt.textContent='Stage '+i+' — '+ENCOUNTERS[i-1].name;refs.testStage.append(opt)}$('testPrestige')?.addEventListener('change',e=>{if(state.testMode&&state.mode==='prep'){state.testPrestige=clamp(Math.floor(Number(e.target.value)||0),0,100);state.testPreviouslyAttempted=true;updateUI()}});$('testFirstAttempt')?.addEventListener('change',e=>{if(state.testMode&&state.mode==='prep'){state.testPreviouslyAttempted=!e.target.checked;updateUI()}});refs.testStage.addEventListener('change',()=>{if(!state.testMode||state.mode!=='prep')return;state.stage=clamp(Number(refs.testStage.value)||1,1,10);log('Debug stage selected: '+state.stage+' · '+encounter().name);updateUI()});QUICK_STATS?.init({state,log})
 for(const h of HEROES){const b=document.createElement('button');b.className='test-hero';b.type='button';b.innerHTML=`<span class="test-icon">${h.glyph}</span><span>${h.name}</span><small>FREE · +1</small>`;b.addEventListener('click',()=>addTestHero(h));refs.testGrid.append(b)}
 for(const [field,key] of [[refs.acquireTune,'acquisitionRange'],[refs.guardTune,'towerGuardRadius'],[refs.chargeTune,'specialChargeSeconds']])field.addEventListener('change',()=>{const v=Number(field.value);if(Number.isFinite(v)&&v>0){TUNING.shared[key]=v;log('Demo tuning updated: '+key+' = '+v);updateUI()}});refs.testToggle.addEventListener('click',toggleTesting);refs.clearTest.addEventListener('click',()=>{if(state.mode!=='prep')return;state.testQueue=[];updateUI()});
 $('packOfferButtons').addEventListener('click',e=>{const b=e.target.closest('[data-shop-slot]');if(!b||state.mode!=='prep'||state.testMode)return;const slot=Number(b.dataset.shopSlot);if(!Number.isInteger(slot)||!state.shopOffers[slot]||state.shopOffers[slot].sold)return;state.selectedSlot=slot;updateUI();saveShopStock()});$('rotateShop').addEventListener('click',rerollMerchant);$('reserveShop')?.addEventListener('click',reserveMerchant);refs.buy.addEventListener('click',buyPack);refs.revealButton.addEventListener('click',revealPack);refs.start.addEventListener('click',startStage);
 refs.pause.addEventListener('click',()=>{if(state.mode!=='battle')return;state.paused=!state.paused;updateUI()});refs.restart.addEventListener('click',()=>{if(SKILLS&&!SKILLS.markRestart()){if(SKILLS.endlessState().session)retireEndless();else returnHub();return}restart()});
 refs.messageButton.addEventListener('click',()=>{if(state.mode==='clear')startStage();else if(state.mode==='over')retryStage();else if(state.mode==='champion')enterEndless()});
 document.addEventListener('keydown',e=>{if(e.target.closest?.('#fwQuickStats'))return;if(e.code==='Space'&&state.mode==='battle'){e.preventDefault();state.paused=!state.paused;updateUI()}else if(e.key==='Enter'&&state.mode==='prep'&&!state.pendingPack)startStage()});window.addEventListener('resize',resize);if('ResizeObserver'in window)new ResizeObserver(resize).observe(canvas.parentElement);resize();restart();if(SKILLS)SKILLS.resumeStage();const end=SKILLS?.endlessState();if(end?.available){if(end.session&&!end.session.exited){state.endlessWave=end.session.wave;state.stage=E.wave(state.endlessWave).family}else returnHub()}initialising=false;if(!state.endlessHub&&!restoreShopStock()){rollShop();applyShopTheft();updateUI()}saveShopStock();requestAnimationFrame(tick)
}

window.__FW_DEMO__={snapshot:()=>({combatTelemetry:{...state.combatTelemetry},stage:state.stage,coins:state.coins,coinMax:state.coinMax,towerHp:state.towerHp,mode:state.mode,paused:state.paused,bought:state.bought,packsToOpen:state.packsToOpen,testMode:state.testMode,testQueue:state.testQueue.slice(),regularTotal:regularCount(),heroes:state.heroes.map(h=>({name:h.base.name,rarity:h.base.rarity,skin:h.skin?.id,skinRarity:h.skin?.rarity,skinMultiplier:h.skinMultiplier||1,hp:h.hp,maxHp:h.maxHp,damage:h.base.damage,x:h.x,y:h.y})),regularSpawned:state.regularSpawned,worldW:view.worldW,worldH:view.worldH,bossSpawned:state.bossSpawned,bossWaitClock:state.bossWaitClock,normalSpawnInterval:NORMAL_SPAWN_INTERVAL,nextSpawnInterval:nextSpawnInterval(),kills:state.kills,enemies:state.enemies.length,hasPendingPack:state.pendingPack,abilityCasts:state.abilityCasts,totems:state.totems.length,traps:state.traps.length,heroesCharged:state.heroes.filter(h=>h.charge>=chargeSeconds(h)&&isOriginalHero(h)).length,heroesDetail:state.heroes.map(h=>({name:h.base.name,hp:h.hp,x:h.x,y:h.y,charge:h.charge,casts:h.casts,summonKind:h.summonKind,beamTarget:h.beamTarget,beamTime:h.beamTime,damage:h.base.damage})),tuning:TUNING.shared,packs:PACKS.map(p=>({name:p.name,pool:p.pool,stage:p.stage})),encounter:{...encounter()},campaignStages:ENCOUNTERS.length,towerAim:state.towerAim,projectiles:state.towerShots?.length||0,sporeClouds:state.sporeClouds?.length||0,balanceProfile:BALANCE.profileId,balanceSchema:BALANCE.schemaVersion,sanctuaries:state.sanctuaries.length,shopOffers:state.shopOffers.map(o=>({...o})),selectedSlot:state.selectedSlot,merchant:{...SKILLS?.merchantState?.(),free:state.merchantShop?.free,paid:state.merchantShop?.paid},version:'development combat / design-1.16.0',skillTree:SKILLS?.debug(),quests:SKILLS?.questProgress?.(),wave:waveStatus(),battleReport:state.lastReport})};

// Testing-only, non-persistent simulation controls for automated playtesting.
window.__FW_TEST__={endless:()=>({wave:state.endlessWave||0,hub:!!state.endlessHub,...SKILLS.endlessState()}),
 defeatEnemy:id=>{if(!state.testMode||state.mode!=='battle')return false;const e=state.enemies.find(e=>e.id===id);if(!e)return false;e.hp=0;return true},prestige:()=>({plan:state.wavePlan,factionSpawned:state.factionSpawned,factionDefeated:state.factionDefeated,scheduledDefeated:state.scheduledDefeated,shardsEarned:state.shardsEarned}),actions:()=>ACTIONS.snapshot(),armSpell:k=>state.testMode&&ACTIONS.arm(k),castSpell:(x,y)=>state.testMode&&ACTIONS.cast(x,y),rescue:id=>state.testMode&&ACTIONS.press(id),damageHero:(id,amount,enemyId)=>{if(!state.testMode||state.mode!=='battle')return false;const h=state.heroes.find(h=>h.id===id);if(!h)return false;hitHero(h,amount,state.enemies.find(e=>e.id===enemyId));return true},
 advance:(seconds)=>{if(!state.testMode||state.mode!=='battle')return false;for(let i=0;i<Math.round(seconds/.05)&&state.mode==='battle';i++)step(.05);updateUI();return true},
 enemy:(x,y,hp=SPAWN_CONFIG.normalHp,damage=0)=>{if(!state.testMode||state.mode!=='battle')return false;state.enemies.push({id:state.nextId++,x,y,hp,maxHp:hp,boss:false,speed:0,damage,attackPeriod:1,firstDelay:SPAWN_CONFIG.minionFirstAttackWindup,cooldown:0,inAttackRange:false,testSpawn:true});return true},
 kill:(count=1)=>{if(!state.testMode||state.mode!=='battle')return false;let n=0;for(const e of state.enemies){if(!e.boss&&e.hp>0){e.hp=0;n++;if(n>=count)break}}return n},
 current:()=>({mode:state.mode,elapsed:state.elapsed,casts:state.abilityCasts,heroes:state.heroes.map(h=>({skin:h.skin?.id,skinRarity:h.skin?.rarity,skinMultiplier:h.skinMultiplier||1,maxHp:h.maxHp,damage:h.base.damage,id:h.id,rescues:h.rescues||0,downed:!!h.capture,invulnerableUntil:h.rescueInvulnerableUntil||0,name:h.base.name,hp:h.hp,x:h.x,y:h.y,charge:h.charge,casts:h.casts,beamTarget:h.beamTarget,beamTime:h.beamTime,summonKind:h.summonKind,expiry:h.expiry,invisibleUntil:h.invisibleUntil,shield:h.shield})),enemies:state.enemies.map(e=>({id:e.id,name:e.name,elite:!!e.elite,mutated:!!e.mutated,faction:!!e.faction,generated:!!e.generated,phase:e.phase,hp:e.hp,maxHp:e.maxHp,x:e.x,y:e.y,damage:e.damage,speed:e.speed,attackPeriod:e.attackPeriod,cooldown:e.cooldown,inAttackRange:!!e.inAttackRange,boss:!!e.boss})),totems:state.totems.length,traps:state.traps.length,sanctuaries:state.sanctuaries.map(z=>({...z})),encounter:encounter().name})};

if(document.body.classList.contains('lab-mode')){
 window.__FW_LAB_API__={
  prepare(){
   state.endlessHub=false;state.endlessWave=0;resetPreparation();
   if(!state.testMode)toggleTesting();state.testPrestige=0;state.testPreviouslyAttempted=false;
   updateUI();
   return true;
  },
  setPrestige(n,previouslyAttempted=true){if(state.mode!=='prep'||!state.testMode)return false;state.testPrestige=Math.max(0,Math.min(100,Math.floor(Number(n)||0)));state.testPreviouslyAttempted=!!previouslyAttempted;updateUI();return true},
  setEndlessWave(n){if(!state.testMode||state.mode!=='prep'||!E.valid(n))return false;state.endlessWave=n;state.stage=E.wave(n).family;updateUI();return true},
  setStage(n){state.endlessWave=0;
   if(state.mode!=='prep')return false;
   state.stage=clamp(Math.round(Number(n)||1),1,ENCOUNTERS.length);
   refs.testStage.value=String(state.stage);
   updateUI();return true;
  },
  setTowerHP(n){
   if(state.mode!=='prep')return false;
   const hp=clamp(Number(n)||100,1,100000);
   state.towerMax=hp;state.towerHp=hp;
   updateUI();return true;
  },
  queueHero(id,count=1){
   if(state.mode!=='prep'||!state.testMode||!HERO_MAP[id])return false;
   for(let i=0;i<Math.min(80,Math.max(0,Math.floor(count)));i++)state.testQueue.push(id);
   updateUI();return true;
  },
  clearQueue(){
   if(state.mode!=='prep')return false;
   state.testQueue=[];updateUI();return true;
  },
  start(){
   if(state.mode!=='prep'||!state.testMode)return false;
   startStage();return true;
  },
  pause(){
   if(state.mode!=='battle')return false;
   state.paused=!state.paused;updateUI();return state.paused;
  },
  snapshot(){
   return {mode:state.mode,paused:state.paused,elapsed:state.elapsed,stage:state.stage,
    towerHP:state.towerHp,towerMax:state.towerMax,kills:state.kills,
    regularSpawned:state.regularSpawned,regularTotal:regularCount(),
    heroesAlive:state.heroes.filter(h=>h.hp>0&&isOriginalHero(h)).length,
    heroesTotal:state.deployedHeroes,enemiesAlive:state.enemies.length,
    bossKilled:state.bossKilled,specialCasts:state.abilityCasts,
    report:state.lastReport};
  }
 };
}
window.__FW_TUNING__=TUNING;
init();
})();
