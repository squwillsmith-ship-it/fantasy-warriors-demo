/* Simulation, combat, AI, spawning, progression and player actions. */
(()=>{'use strict';
const {HEROES,HEROES_PER_PACK,PACKS,HERO_MAP,ENCOUNTERS,TUNING,ABILITIES,HOUND,UNDEAD,SPAWN_CONFIG}=window.FWGameData;
const QUICK_STATS=window.FWQuickStats,M=window.FWMerchant;
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
 if(initialising||state.mode!=='prep'||state.testMode||SKILLS?.sandboxActive?.())return;
 try{localStorage.setItem(SHOP_SAVE_KEY,JSON.stringify({stage:state.stage,resets:SKILLS?.debug()?.resets??0,coins:state.coins,shop:state.merchantShop,id:state.merchantAttemptId,selectedSlot:state.selectedSlot}));}catch(e){}
}
function restoreShopStock(){
 if(state.mode!=='prep')return false;
 try{
  const x=JSON.parse(localStorage.getItem(SHOP_SAVE_KEY)),m=SKILLS?.merchantState?.(),shop=x?.shop;
  if(!x||x.stage!==state.stage||x.resets!==(SKILLS?.debug()?.resets??0)||typeof x.id!=='string'||x.id===m?.lastCommit)return false;
  if(!shop||!Array.isArray(shop.offers)||shop.offers.length<3||shop.offers.length>6||!Array.isArray(shop.tiers)||!Array.isArray(shop.flags)||!shop.tiers.includes(0))return false;
  if(!shop.tiers.every(i=>Number.isInteger(i)&&i>=0&&i<5&&SKILLS.isTierOpen(i+1))||shop.flags.some(id=>!m.flags.includes(id)))return false;
  if(!shop.offers.every(o=>o&&['standard','individual','double','triple','box','golden','mixed'].includes(o.type)&&shop.tiers.includes(o.packIndex)&&Number.isInteger(o.qty)&&o.qty>=1&&o.qty<=3&&Number.isInteger(o.listPrice)&&o.listPrice>=o.qty&&typeof o.sold==='boolean'&&(!o.heroId||HERO_MAP[o.heroId])&&(o.type!=='mixed'||shop.tiers.includes(o.other))))return false;
  if(!Number.isFinite(x.coins)||x.coins<0||x.coins>state.coinMax)return false;
  state.merchantShop=shop;state.shopOffers=shop.offers;state.merchantAttemptId=x.id;state.bought=shop.offers.filter(o=>o.sold).length;state.packQueue=shop.offers.filter(o=>o.sold).map(o=>o.packIndex);state.coins=x.coins;state.selectedSlot=Number.isInteger(x.selectedSlot)?x.selectedSlot:0;state.shopCacheKey='';updateUI();return true;
 }catch(e){return false;}
}
function clearShopStock(){if(state.testMode||SKILLS?.sandboxActive?.())return;try{localStorage.removeItem(SHOP_SAVE_KEY);}catch(e){}}

const {view,resize,render}=window.FWGameRenderer.create({canvas,ctx,state,ENCOUNTERS,TUNING,clamp,cfg,chargeSeconds,isOriginalHero});
const TOWER_FIRE=window.FWTowerFire.create({canvas,ctx,view,state,config:BALANCE.towerFire,hitEnemy,addEffect});
function rand(a,b){return a+Math.random()*(b-a)}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function chooseHero(packIndex=0){const pool=PACKS[packIndex].pool;return HERO_MAP[pool[Math.floor(Math.random()*pool.length)]]}

const {normalInterval:NORMAL_SPAWN_INTERVAL,bossClearDelay:BOSS_AFTER_CLEAR_DELAY}=SPAWN_CONFIG;
function regularCount(){return BALANCE.stages[state.stage-1]?.slots??SPAWN_CONFIG.regularWaveBase}
function totalCount(){return regularCount()+1}
function nextSpawnInterval(){
 const w=SPAWN_CONFIG.wavePhases,p=state.regularSpawned/Math.max(1,regularCount()-1);
 if(p<w.openingFraction)return w.openingStart+(w.openingEnd-w.openingStart)*(p/w.openingFraction);
 if(p<w.middleEndFraction)return w.openingEnd+(w.middleEnd-w.openingEnd)*((p-w.openingFraction)/(w.middleEndFraction-w.openingFraction));
 return w.finalInterval;
}
function log(message){state.notifications.unshift(message);state.notifications.length=Math.min(5,state.notifications.length);refs.events.replaceChildren(...state.notifications.map(t=>{const li=document.createElement('li');li.textContent=t;return li}))}
function addEffect(e){state.effects.push(e);if(state.effects.length>160)state.effects.shift()}
function damageNumber(x,y,text,color){addEffect({kind:'number',x,y,text:String(text),color,life:.8,maxLife:.8})}
function createHero(base){if(state.testMode&&HERO_MAP[base.id]===base&&QUICK_STATS)base=QUICK_STATS.heroForBattle(base);const hero={id:state.nextId++,base,x:0,y:0,hp:base.hp,maxHp:base.hp,cooldown:rand(0,.45),facing:0,combo:0,beamTarget:null,beamTime:0,beamTickClock:0,charge:0,casts:0,abilityStatus:"charging",activeUntil:0,shield:0,shieldUntil:0,blessingUntil:0,frenzyUntil:0,invisibleUntil:0,bearUntil:0,sanctuaryUntil:0,summonKind:null,expiry:Infinity,anchorX:0,anchorY:0,radius:base.id==='dragonkin'||base.id==='paladin'||base.id==='barbarian'?.45:.35,vx:0,vy:0,targetId:null,targetClock:rand(0,.25),lastTargetSwitch:-10,slotIndex:-1,slotTarget:null,windupTime:0,windupTarget:null,attackState:'idle',hitFlash:0};if(SKILLS&&cfg(hero)?.special.trigger==='autoCharge')hero.charge=chargeSeconds(hero)*Math.min(1,SKILLS.startCharge());if(SKILLS){hero.shield=hero.maxHp*SKILLS.startShield();hero.shieldUntil=hero.shield>0?Infinity:0;}state.heroes.push(hero);placeNewHero(hero);return hero}
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
 const profile=BALANCE.stages[state.stage-1];
 const base=boss?profile.boss:kind==='elite'?profile.elite:profile.basic;
 const overrides=state.testMode&&QUICK_STATS&&kind!=='generated'?QUICK_STATS.enemyForBattle(state.stage,boss):null;
 const stats=overrides?{...base,...overrides}:base;
 const hp=boss&&state.stage===10&&!overrides?BALANCE.stages[9].boss.phases[0].hp:stats.hp,elite=kind==='elite',generated=kind==='generated';
 const e={id:state.nextId++,x,y,hp,maxHp:hp,boss,elite,generated,scheduled:!boss&&!generated,stage:state.stage,speed:stats.speed,damage:stats.damage,
  attackPeriod:stats.attackPeriod??1,firstDelay:stats.firstDelay??SPAWN_CONFIG.minionFirstAttackWindup,cooldown:rand(0,.5),
  inAttackRange:false,radius:boss?.75:elite?.48:.35,vx:0,vy:0,targetId:null,hitFlash:0,
  towerLane:((state.nextId*7)%11-5)*.13,kind:boss?'boss':kind,phase:boss?1:0};
 state.enemies.push(e);return e;
}
// Walk speed comes from each hero’s approved STATS entry, not a universal speed.
const TOWER_BLOCK=1.36;     // tower half-width + hero safety margin (map units)
const CORNER_DIST=1.73;     // navigation corners outside tower footprint
function insideTower(x,y){return Math.abs(x)<TOWER_BLOCK&&Math.abs(y)<TOWER_BLOCK}
function segmentHitsTower(ax,ay,bx,by){
 let near=0,far=1;const vx=bx-ax,vy=by-ay;
 for(const [origin,delta] of [[ax,vx],[ay,vy]]){
  if(Math.abs(delta)<1e-8){if(origin<=-TOWER_BLOCK||origin>=TOWER_BLOCK)return false;continue}
  const lo=(-TOWER_BLOCK-origin)/delta,hi=(TOWER_BLOCK-origin)/delta;
  near=Math.max(near,Math.min(lo,hi));far=Math.min(far,Math.max(lo,hi));
  if(far<near)return false;
 }
 return near<far&&far>0&&near<1;
}
function safeGoal(x,y){
 if(!insideTower(x,y))return{x,y};
 // All actors must route toward a safe exterior point at the tower boundary;
 // find the nearest exterior position for approaching heroes.
 const edge=CORNER_DIST+.02;
 if(Math.abs(x)>Math.abs(y))return{x:Math.sign(x||1)*edge,y};
 return{x,y:Math.sign(y||1)*edge};
}
function heroWaypoint(x,y,gx,gy){
 const dest=safeGoal(gx,gy);
 if(!segmentHitsTower(x,y,dest.x,dest.y))return dest;
 const c=CORNER_DIST;
 const pts=[{x,y},dest,{x:-c,y:-c},{x:c,y:-c},{x:c,y:c},{x:-c,y:c}];
 const dist=Array(6).fill(Infinity),prev=Array(6).fill(-1),used=Array(6).fill(false);dist[0]=0;
 for(let i=0;i<6;i++){
  let u=-1;for(let j=0;j<6;j++)if(!used[j]&&(u<0||dist[j]<dist[u]))u=j;
  if(u<0||!Number.isFinite(dist[u]))break;
  if(u===1)break;used[u]=true;
  for(let v=1;v<6;v++){
   if(v===u||used[v]||segmentHitsTower(pts[u].x,pts[u].y,pts[v].x,pts[v].y))continue;
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
function hitEnemy(e,damage,color,sourceHeroId=null){if(!e||e.hp<=0)return;if(damage>0)e.lastHitHero=typeof sourceHeroId==='string'&&HERO_MAP[sourceHeroId]?sourceHeroId:null;const n=Number(Math.abs(damage).toFixed(1));e.hp-=damage;e.hitFlash=.11;if(damage>=.2)damageNumber(e.x,e.y-.15,n.toFixed(1),color)}
function enemiesInRadius(x,y,r){const rr=r*r;return state.enemies.filter(e=>e.hp>0&&(e.x-x)**2+(e.y-y)**2<=rr)}
function pushEnemy(e,fromX,fromY,dist){const dx=e.x-fromX,dy=e.y-fromY,len=Math.max(.01,Math.hypot(dx,dy));e.x=clamp(e.x+dx/len*dist,-view.worldW/2+.8,view.worldW/2-.8);e.y=clamp(e.y+dy/len*dist,-view.worldH/2+.8,view.worldH/2-.8)}
function pointSegmentDistance(x,y,ax,ay,bx,by){const vx=bx-ax,vy=by-ay;const t=clamp(((x-ax)*vx+(y-ay)*vy)/(vx*vx+vy*vy||1),0,1);return Math.hypot(x-ax-t*vx,y-ay-t*vy)}
// Numerical secondary effects are temporary demonstrations. Only the basic-attack concepts are approved.
function hitHero(h,d,source){if(SKILLS&&isOriginalHero(h))d=SKILLS.guardDamage(h,d);if(SKILLFX)d=SKILLFX.incoming(h,d,source);if(h.shield>0){const absorb=Math.min(h.shield,d);h.shield-=absorb;d-=absorb}if(d>0){h.hp=Math.max(0,h.hp-d);h.hitFlash=.11}if(SKILLFX)SKILLFX.afterHeroHit(h);return d}
function spawnSummon(base,atX,atY,kind,duration,ownerId){const s={id:state.nextId++,base,x:atX,y:atY,hp:base.hp,maxHp:base.hp,cooldown:.2,facing:0,charge:0,casts:0,shield:0,invisibleUntil:0,bearUntil:0,blessingUntil:0,frenzyUntil:0,summonKind:kind,ownerId,ownerHeroId:state.heroes.find(h=>h.id===ownerId&&isOriginalHero(h))?.base.id||null,expiry:state.elapsed+duration,anchorX:atX,anchorY:atY,beamTarget:null};state.heroes.push(s);return s}
function activeOriginalHeroes(){return state.heroes.filter(h=>h.hp>0&&isOriginalHero(h))}
function enemyNear(h,r){let best=null,d=r*r;for(const e of state.enemies){if(e.hp<=0)continue;const sq=(e.x-h.x)**2+(e.y-h.y)**2;if(sq<=d){d=sq;best=e}}return best}
function nearestAllowedEnemy(h){let choice=null,dist=acquireRadius(h)**2;for(const e of state.enemies){if(e.hp<=0)continue;const ds=(h.x-e.x)**2+(h.y-e.y)**2;if(ds>dist)continue;if(Math.hypot(e.x,e.y)>guardRadius(h)+Math.max(0.5,h.base.range))continue;choice=e;dist=ds}return choice}
function signalSpecial(h,label,r=.9){state.abilityCasts++;h.casts++;h.abilityStatus='active';addEffect({kind:'label',x:h.x,y:h.y-.55,text:label,color:'#fff3bd',life:1.2,maxLife:1.2});visualRing(h.x,h.y,r,h.base.color);log(h.base.name+' used '+label+'!')}
function castSpecial(h){const spec=cfg(h)?.special;if(!spec||spec.trigger!=='autoCharge')return false;const enemy=SKILLFX?SKILLFX.specialTarget(h,enemyNear(h,Math.max(acquireRadius(h),h.base.range,5))):enemyNear(h,Math.max(acquireRadius(h),h.base.range,5));const otherAllies=state.heroes.filter(a=>a!==h&&a.hp>0&&Math.hypot(a.x-h.x,a.y-h.y)<=(spec.shieldRadius??spec.blessingRadius??3));const duration=(n)=>state.elapsed+n;
 switch(h.base.id){
 case 'knight':if(!enemy||Math.hypot(enemy.x-h.x,enemy.y-h.y)>2.3)return false;for(const e of enemiesInRadius(h.x,h.y,spec.bashRadius))e.stunnedUntil=duration(spec.bashStunSeconds);signalSpecial(h,'Shield Bash',spec.bashRadius);break;
 case 'archer':if(!enemy)return false;{const targets=enemiesInRadius(enemy.x,enemy.y,spec.volleyRadius);for(const e of targets)hitEnemy(e,spec.volleyDamage,h.base.color,h.base.id);for(let i=0;i<spec.volleyArrowCount;i++){const angle=2*Math.PI*i/spec.volleyArrowCount,r=.25+(i%3)*.33;addEffect({kind:'bolt',x1:h.x,y1:h.y,x2:enemy.x+Math.cos(angle)*r,y2:enemy.y+Math.sin(angle)*r,color:'#a5e1b5',life:.45,maxLife:.45})}visualRing(enemy.x,enemy.y,spec.volleyRadius,'#8acaab')}signalSpecial(h,'Arrow Volley');break;
 case 'mage':if(!enemy)return false;{let current=enemy,used=new Set(),previous={x:h.x,y:h.y};for(let i=0;i<spec.chainJumpCount&&current;i++){used.add(current.id);addEffect({kind:'bolt',x1:previous.x,y1:previous.y,x2:current.x,y2:current.y,color:'#b7ddff',life:.5,maxLife:.5});hitEnemy(current,spec.chainDamage,'#b7ddff',h.base.id);visualRing(current.x,current.y,.45,'#c6dbff');const candidates=state.enemies.filter(e=>e.hp>0&&!used.has(e.id)&&Math.hypot(e.x-current.x,e.y-current.y)<=spec.chainJumpRange);previous=current;current=candidates.sort((a,b)=>Math.hypot(a.x-previous.x,a.y-previous.y)-Math.hypot(b.x-previous.x,b.y-previous.y))[0]||null}}signalSpecial(h,'Chain Bolt');break;
 case 'hunter':if(!enemy)return false;state.traps.push({x:enemy.x,y:enemy.y,radius:spec.trapRadius,expires:duration(spec.trapDurationSeconds),slow:spec.trapSlowMultiplier});signalSpecial(h,'Tripwire Trap');break;
 case 'barbarian':if(!enemy)return false;h.frenzyUntil=duration(spec.frenzyDurationSeconds);signalSpecial(h,'Battle Frenzy');break;
 case 'rogue':if(!enemy)return false;h.invisibleUntil=duration(spec.invisibilityDurationSeconds);signalSpecial(h,'Smoke Bomb');break;
 case 'paladin':if(!otherAllies.length)return false;for(const a of otherAllies){a.shield=Math.max(a.shield||0,spec.shieldAmount);a.shieldUntil=duration(spec.shieldDurationSeconds)}signalSpecial(h,'Divine Aegis',spec.shieldRadius);break;
 case 'nun':{const candidates=state.heroes.filter(a=>a!==h&&a.hp>0&&a.hp<a.maxHp-.001&&Math.hypot(a.x-h.x,a.y-h.y)<=spec.sanctuaryEligibilityRadius);if(!candidates.length)return false;state.sanctuaries.push({ownerId:h.id,radius:spec.sanctuaryRadius,expires:duration(spec.sanctuaryLifetimeSeconds),clock:0});h.sanctuaryUntil=duration(spec.sanctuaryLifetimeSeconds);signalSpecial(h,'Sanctuary Prayer',spec.sanctuaryRadius);break;}
 case 'priest':if(!otherAllies.length)return false;for(const a of otherAllies)a.blessingUntil=duration(spec.blessingDurationSeconds);signalSpecial(h,'Blessing',spec.blessingRadius);break;
 case 'shaman':if(!enemy)return false;for(let i=0;i<spec.totemCount;i++){state.totems.push({id:state.nextId++,x:clamp(h.x+(i-0.5)*.6,-view.worldW/2,view.worldW/2),y:h.y,hp:spec.totemHealth,expires:duration(spec.totemLifetimeSeconds),radius:spec.totemAggroRadius})}signalSpecial(h,'Spirit Totem');break;
 case 'druid':if(!enemy)return false;h.bearUntil=duration(spec.bearFormDurationSeconds);signalSpecial(h,'Bear Form');break;
 case 'warlock':if(!enemy)return false;hitEnemy(enemy,spec.siphonDamage,h.base.color,h.base.id);h.hp=Math.min(h.maxHp,h.hp+spec.siphonHealAmount);visualBeam(h,enemy,'#d89aff',.4);signalSpecial(h,'Life Siphon');break;
 case 'beastmaster':if(!enemy)return false;if(state.heroes.filter(a=>a.hp>0&&a.summonKind==='hound'&&a.ownerId===h.id).length>=spec.maximumActiveHounds)return false;{const base={...HOUND,hp:spec.houndHealth,damage:spec.houndDamage,speed:spec.houndAttackSpeed,walk:spec.houndWalkSpeed};spawnSummon(base,h.x+.65,h.y+.4,'hound',spec.houndLifetimeSeconds,h.id)}signalSpecial(h,'Summon Hound');break;
 case 'dragonkin':if(!enemy)return false;{const dx=enemy.x-h.x,dy=enemy.y-h.y,len=Math.max(.01,Math.hypot(dx,dy));let hits=0;for(const e of state.enemies){if(e.hp<=0)continue;const ex=e.x-h.x,ey=e.y-h.y,dist=Math.hypot(ex,ey),dot=(ex*dx+ey*dy)/(dist*len||1);if(dist<=spec.breathRange&&dot>=Math.cos(spec.breathConeDegrees*Math.PI/360)){hitEnemy(e,spec.breathDamage,'#ffae76',h.base.id);hits++}}if(!hits)return false;visualRing(h.x,h.y,spec.breathRange,'#ff905b')}signalSpecial(h,'Dragon Breath');break;
 default:return false;
 }
 if(SKILLFX)SKILLFX.afterCast(h,enemy,spec);return true;
}
function stepSanctuaries(dt){
 const heals=new Map();state.sanctuaries=state.sanctuaries.filter(z=>z.expires>state.elapsed&&state.heroes.some(h=>h.id===z.ownerId&&h.hp>0));
 for(const zone of state.sanctuaries){const owner=state.heroes.find(h=>h.id===zone.ownerId&&h.hp>0);if(!owner)continue;const spec=cfg(owner).special;const tick=Math.max(.04,spec.sanctuaryTickIntervalSeconds);zone.clock+=dt;const ticks=Math.floor(zone.clock/tick);if(!ticks)continue;zone.clock-=ticks*tick;
   for(const h of state.heroes){if(h.hp<=0||h.hp>=h.maxHp||(h===owner&&!spec.sanctuarySelfHealingAllowed))continue;if(Math.hypot(h.x-owner.x,h.y-owner.y)>zone.radius)continue;heals.set(h,Math.max(heals.get(h)||0,spec.sanctuaryHealPerSecond*tick*ticks));}}
 for(const [hero,amount] of heals)hero.hp=Math.min(hero.maxHp,hero.hp+amount);
}
function stepSpecials(h,dt){const spec=cfg(h)?.special;if(!spec||spec.trigger!=='autoCharge')return;h.charge=Math.min(chargeSeconds(h),h.charge+dt*(SKILLS?SKILLS.rate(h):1));if(h.charge>=chargeSeconds(h)){h.abilityStatus='ready';if(castSpecial(h)){h.charge=0;h.abilityStatus='charging'}}}
// Every qualified enemy kill raises one undead if at least one living Necromancer exists.
function onEnemyDeath(e){
 if(SKILLFX)SKILLFX.enemyDeath(e);
 if(e.boss||e.generated)return;
 if(e.stage===2&&e.scheduled&&!e.elite){
  state.sporeClouds.push({x:e.x,y:e.y,radius:1,life:2,clock:0});
  visualRing(e.x,e.y,1,'#b4e69c');
 }const necros=activeOriginalHeroes().filter(h=>h.base.id==='necromancer');if(!necros.length)return;const owner=necros[0],spec=cfg(owner).special;owner.raisedCount=(owner.raisedCount||0)+1;const veteran=SKILLS?.has('T5-NE-T04')&&owner.raisedCount%3===0;const base={...UNDEAD,hp:spec.undeadHealth*(veteran?1.5:1),damage:spec.undeadDamage*(veteran?1.4:1)};spawnSummon(base,e.x,e.y,'undead',spec.undeadLifetimeSeconds,owner.id);signalSpecial(owner,'Raise the Fallen',.7)}

function basicAttack(h,target){if(target.hp<=0)return;const id=h.base.id,d=h.base.damage*(SKILLS?SKILLS.heroBonus(h,target):1),col=h.base.color;if(id!=='necromancer')visualBeam(h,target,col);h.cooldown=1/h.base.speed;
 switch(id){
  case 'knight':hitEnemy(target,d,col,id);break;
  case 'archer':hitEnemy(target,d,col,id);break;
  case 'mage':{const radius=1.4*(SKILLS?.rangeBonus('mage')||1);hitEnemy(target,d,col,id);for(const e of enemiesInRadius(target.x,target.y,radius))if(e!==target)hitEnemy(e,(SKILLS?SKILLS.mageSplashDamage():d)*.42,col,id);visualRing(target.x,target.y,radius,'#f7b961');break;}
  case 'hunter':hitEnemy(target,d,col,id);target.bleed={time:2.4*(SKILLS?.has('T2-H-S04')?1.4:1),tick:.6,damage:2,sourceHeroId:id};break;
  case 'barbarian':{const ax=target.x-h.x,ay=target.y-h.y;for(const e of enemiesInRadius(h.x,h.y,1.8)){const vx=e.x-h.x,vy=e.y-h.y,dot=(ax*vx+ay*vy)/(Math.hypot(ax,ay)*Math.hypot(vx,vy)||1);if(dot>=(SKILLS?.has('T2-B-T04')&&h.frenzyUntil>state.elapsed?-1:SKILLS?.has('T2-B-S04')?.20:.35))hitEnemy(e,e===target?d:d*.55,col,id)}visualRing(h.x,h.y,1.8,'#f4b195');break}
  case 'rogue':h.combo=(h.combo+1)%2;hitEnemy(target,d,col,id);addEffect({kind:'bolt',x1:h.x+(h.combo?-.25:.25),y1:h.y,x2:target.x,y2:target.y,color:'#e4daff',life:.13,maxLife:.13});break;
  case 'paladin':hitEnemy(target,d,col,id);state.hazards.push({x:target.x,y:target.y,life:2.4,clock:0,radius:1.15*(SKILLS?.has('T3-P-S04')?1.4:1),color:'#e7bf62',damage:.40,sourceHeroId:id});visualRing(target.x,target.y,1.15*(SKILLS?.has('T3-P-S04')?1.4:1),col);break;
  case 'nun':h.combo=(h.combo+1)%3;hitEnemy(target,d,col,id);if(h.combo===0){pushEnemy(target,h.x,h.y,.48*(SKILLS?.has('T3-N-S04')?1.4:1));visualRing(target.x,target.y,.75,'#eedffc')}break;
  case 'priest':for(let k=1;k<=4;k++)state.pendingHits.push({time:state.elapsed+k*.09,target,damage:d/4,color:col,sourceHeroId:id,x:h.x,y:h.y});break;
  case 'shaman':{const radius=1.4*(SKILLS?.rangeBonus('shaman')||1);hitEnemy(target,d,col,id);for(const e of enemiesInRadius(target.x,target.y,radius)){e.weakUntil=state.elapsed+3;if(e!==target)hitEnemy(e,d*.42,col,id)}visualRing(target.x,target.y,radius,'#78d6c5');break;}
  case 'druid':{const dx=target.x-h.x,dy=target.y-h.y,len=Math.max(.01,Math.hypot(dx,dy));const bx=h.x+dx/len*h.base.range,by=h.y+dy/len*h.base.range;for(const e of state.enemies)if(e.hp>0&&pointSegmentDistance(e.x,e.y,h.x,h.y,bx,by)<.45*(SKILLS?.has('T4-D-S04')?1.4:1))hitEnemy(e,d,col,id);visualRing(target.x,target.y,.7,'#a5e882');break}
  case 'warlock':hitEnemy(target,d,col,id);target.doom=true;target.doomSourceHeroId=id;visualRing(target.x,target.y,.55,'#a86bc5');break;
  case 'beastmaster':hitEnemy(target,d,col,id);target.beastFocus=state.elapsed+3;break;
  case 'necromancer':break;
  case 'dragonkin':hitEnemy(target,d,col,id);{const dx=target.x-h.x,dy=target.y-h.y,len=Math.max(.01,Math.hypot(dx,dy));const nx=h.x+dx/len*.32,ny=h.y+dy/len*.32;if(!insideTower(nx,ny)){h.x=nx;h.y=ny};pushEnemy(target,h.x,h.y,.72*(SKILLS?.has('T5-DR-S04')?1.4:1))}visualRing(target.x,target.y,.8,'#ff9e69');break;
 }
 if(SKILLFX)SKILLFX.afterBasic(h,target,d,false);
}
function tickAttackEffects(dt){
 for(let i=state.pendingHits.length-1;i>=0;i--){const p=state.pendingHits[i];if(p.time>state.elapsed)continue;state.pendingHits.splice(i,1);if(p.target.hp<=0&&SKILLS?.has('T3-PR-T02')&&p.sourceHeroId==='priest'){p.target=enemyNear({x:p.x,y:p.y},4)||p.target;}if(p.target.hp>0){hitEnemy(p.target,p.damage,p.color,p.sourceHeroId);addEffect({kind:'bolt',x1:p.x,y1:p.y,x2:p.target.x,y2:p.target.y,color:p.color,life:.08,maxLife:.08})}}
 for(const e of state.enemies){if(e.hp<=0)continue;if(e.bleed){e.bleed.time-=dt;e.bleed.tick-=dt;if(e.bleed.tick<=0){e.bleed.tick+=.6;hitEnemy(e,e.bleed.damage,'#ff9d96',e.bleed.sourceHeroId)}if(e.bleed.time<=0)e.bleed=null}}
 for(let i=state.hazards.length-1;i>=0;i--){const p=state.hazards[i];p.life-=dt;p.clock+=dt;if(p.clock>=.65){p.clock-=.65;for(const e of enemiesInRadius(p.x,p.y,p.radius)){hitEnemy(e,p.damage,p.color,p.sourceHeroId)}}if(p.life<=0)state.hazards.splice(i,1)}
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
 const wp=heroWaypoint(a.x,a.y,pt.x,pt.y),dx=wp.x-a.x,dy=wp.y-a.y,d=Math.hypot(dx,dy);
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
   if(legalActorPosition(a,ax,ay)){a.x=ax;a.y=ay}if(legalActorPosition(b,bx,by)){b.x=bx;b.y=by}
  }
 }
 state.combatTelemetry.overlaps=overlaps;
}
// Arcade AI: the closest living enemy in the hero's forward half-plane wins.
// If nothing is ahead, turn toward the closest accessible enemy instead.
function selectHeroTarget(h,dt){
 const current=state.enemies.find(e=>e.id===h.targetId&&e.hp>0);
 const legal=e=>e&&Math.hypot(e.x-h.x,e.y-h.y)<=acquireRadius(h)
   &&Math.hypot(e.x,e.y)<=guardRadius(h)+Math.max(1,h.base.range);
 if(h.windupTime>0&&legal(current))return current; // Finish an attack.
 h.targetClock=(h.targetClock||0)-dt;
 if(legal(current)&&h.targetClock>0)return current;
 h.targetClock=TUNING.shared.decisionInterval;
 const target=ARCADE.nearestFrontTarget(
   h,state.enemies,acquireRadius(h),guardRadius(h),h.base.range,
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
   for(const h of state.heroes)if(h.hp>0&&Math.hypot(h.x-c.x,h.y-c.y)<=c.radius)hitHero(h,.5,{kind:'mushroom-spore'});
  }
  if(c.life<=0)state.sporeClouds.splice(i,1);
 }
}
function stepNecroBeam(h,target,dt){if(!target||target.hp<=0||Math.hypot(target.x-h.x,target.y-h.y)>h.base.range||Math.hypot(h.x,h.y)>guardRadius(h)+.1){h.beamTarget=null;h.beamTime=0;h.beamTickClock=0;return}if(h.beamTarget!==target.id){h.beamTarget=target.id;h.beamTime=h.beamTransferUntil>state.elapsed?(h.beamStoredRamp||0):0;h.beamTickClock=0}const spec=cfg(h).special;h.beamTime+=dt*(SKILLFX?SKILLFX.beamRampBoost(h):1);h.beamTickClock+=dt;const ticks=Math.floor(h.beamTickClock/spec.beamTickSeconds);if(ticks>0){const n=Math.min(ticks,8);h.beamTickClock-=ticks*spec.beamTickSeconds;const mult=1+(spec.beamMaxRampMultiplier-1)*Math.min(1,h.beamTime/spec.beamRampSeconds);hitEnemy(target,(h.base.damage*h.base.speed)*spec.beamTickSeconds*n*mult,h.base.color,h.base.id)}}
function step(dt){if(state.mode!=='battle'||state.paused)return;
 state.elapsed+=dt;state.spawnClock+=dt;state.uiClock+=dt;if(SKILLFX)SKILLFX.tick(dt);TOWER_FIRE.step(dt);
 if(state.regularSpawned===0){spawnEnemy(false);state.regularSpawned=1;state.spawnClock=0}
 else if(state.regularSpawned<regularCount()&&state.spawnClock>=nextSpawnInterval()){state.spawnClock-=nextSpawnInterval();spawnEnemy(false);state.regularSpawned++}
 // Boss arrival is checked after dead minions are removed: spawning the full wave is not enough.
 for(const a of state.heroes)a.hitFlash=Math.max(0,(a.hitFlash||0)-dt);for(const a of state.enemies)a.hitFlash=Math.max(0,(a.hitFlash||0)-dt);state.traps=state.traps.filter(p=>p.expires>state.elapsed);
 state.totems=state.totems.filter(p=>p.hp>0&&p.expires>state.elapsed);
 for(const h of state.heroes){if(h.hp<=0)continue;if(h.expiry<=state.elapsed){h.hp=0;continue}if(h.shieldUntil>0&&h.shieldUntil<state.elapsed)h.shield=0;
  if(!isOriginalHero(h)){
   h.cooldown-=dt;let enemy=null,best=Infinity,rangeDistance=Infinity;for(const e of state.enemies){if(e.hp<=0)continue;const actual=Math.hypot(e.x-h.x,e.y-h.y);let d=actual;if(h.summonKind==='hound'&&e.beastFocus>state.elapsed)d*=.35;if(SKILLFX)d+=SKILLFX.summonPriority(h,e);if(d<best&&Math.hypot(e.x,e.y)<TUNING.shared.towerGuardRadius+(h.summonKind==='hound'&&SKILLS?.has('T5-BM-T01')?-.20:1)){best=d;rangeDistance=actual;enemy=e}}
   if(enemy){h.facing=Math.atan2(enemy.y-h.y,enemy.x-h.x)+Math.PI/2;if(rangeDistance>h.base.range)moveToPoint(h,enemy,dt);else if(h.cooldown<=0){h.cooldown=1/(h.base.speed*(h.alphaBuffUntil>state.elapsed?1.2:1));hitEnemy(enemy,h.base.damage,h.base.color,heroSourceId(h));visualBeam(h,enemy)}}continue;
  }
  const tc=cfg(h),isBear=h.base.id==='druid'&&h.bearUntil>state.elapsed;
  let target=selectHeroTarget(h,dt);
  if(h.base.id==='necromancer'&&h.beamTarget!=null){const ongoing=state.enemies.find(e=>e.id===h.beamTarget&&e.hp>0);if(ongoing&&Math.hypot(ongoing.x-h.x,ongoing.y-h.y)<=h.base.range&&Math.hypot(h.x,h.y)<=guardRadius(h)+.05)target=ongoing}
  stepSpecials(h,dt);
  if(!target){h.attackState='idle';h.windupTime=0;h.slotIndex=-1;h.slotTarget=null;if(h.base.id==='necromancer')stepNecroBeam(h,null,dt);if(h.base.range<=2.15&&Math.hypot(h.x-h.anchorX,h.y-h.anchorY)>.52)moveToPoint(h,{x:h.anchorX,y:h.anchorY},dt);else brake(h,dt);continue}
  const dist=Math.hypot(target.x-h.x,target.y-h.y),attackRange=(isBear?1.15:h.base.range)+(target.boss&&h.base.range<=2.15?.4:0);
  h.facing=Math.atan2(target.y-h.y,target.x-h.x)+Math.PI/2;
  const goal=heroCombatGoal(h,target,isBear);
  if(goal&&dist>attackRange-(!isBear&&h.base.range>2.15?0:.02)){h.attackState='approach';h.windupTime=0;moveToPoint(h,goal,dt);if(h.base.id==='necromancer')stepNecroBeam(h,null,dt);continue}
  if(goal&&(h.base.range<=2.15||isBear)&&Math.hypot(goal.x-h.x,goal.y-h.y)>.15)moveToPoint(h,goal,dt*.7);else brake(h,dt);
  if(h.base.id==='necromancer'){h.attackState='channel';h.engagedTargetId=target.id;stepNecroBeam(h,target,dt);continue}
  const cycle=1/(h.base.speed*(h.frenzyUntil>state.elapsed?cfg(h).special.frenzyAttackSpeedMultiplier:1));
  if(h.windupTime>0){h.windupTime-=dt;h.attackState='windup';if(h.windupTime>0)continue;
   const aim=state.enemies.find(e=>e.id===h.windupTarget&&e.hp>0);
   if(aim&&Math.hypot(aim.x-h.x,aim.y-h.y)<=attackRange+.2){if(isBear){const bearDamage=SKILLS?SKILLS.bearBasicDamage():h.base.damage;hitEnemy(aim,bearDamage,h.base.color,h.base.id);visualBeam(h,aim,'#b2e585');visualRing(aim.x,aim.y,.5,'#96d46e');if(SKILLFX)SKILLFX.afterBasic(h,aim,bearDamage,true)}else{const bonus=h.blessingUntil>state.elapsed?1+TUNING.heroes.priest.special.blessingDamageBonus:1;basicAttack(h,aim);if(bonus>1&&aim.hp>0)hitEnemy(aim,h.base.damage*(bonus-1),h.base.color,h.base.id)}}
   h.cooldown=cycle*.8;h.attackState='recovery';h.windupTarget=null;continue;
  }
  h.cooldown-=dt;
  if(h.cooldown<=0){h.windupTime=cycle*.2;h.windupTarget=target.id;h.engagedTargetId=target.id;h.attackState='windup'}else h.attackState='recovery';
 }
 stepSanctuaries(dt);
 stepSporeClouds(dt);
 tickAttackEffects(dt);
 for(const e of state.enemies){if(e.hp<=0)continue;if(e.stunnedUntil>state.elapsed)continue;
  let hero=null,closest=TUNING.shared.enemyHeroDetection**2;for(const h of state.heroes){if(h.hp<=0||h.invisibleUntil>state.elapsed)continue;const d=(h.x-e.x)**2+(h.y-e.y)**2;if(d<=closest){hero=h;closest=d}}
  let totem=null,totemDist=Infinity;for(const p of state.totems){const sq=(p.x-e.x)**2+(p.y-e.y)**2;if(sq<=p.radius*p.radius&&sq<totemDist){totem=p;totemDist=sq}}
  const target=totem||hero||towerApproach(e);const dist=Math.hypot(target.x-e.x,target.y-e.y);e.attackingTower=!totem&&!hero&&dist<1.5;
  const reach=totem?actorRadius(e)+.35:hero?((e.stage===4&&!e.elite&&!e.boss)?3:(e.stage===7&&!e.elite&&!e.boss)?3.5:actorRadius(e)+actorRadius(hero)+.22):.34;
  if(dist<=reach){
    // Regular minions need 0.65s to wind up after first reaching contact; bosses do not.
    if(!e.inAttackRange){e.inAttackRange=true;if(!e.boss)e.cooldown=Math.max(e.cooldown,e.firstDelay??SPAWN_CONFIG.minionFirstAttackWindup);}
    e.cooldown-=dt;if(e.cooldown<=0){e.cooldown=e.attackPeriod??1;
    const damage=e.damage*(e.weakUntil>state.elapsed?.8:1)*(e.weakerUntil>state.elapsed?.8:1);
    if(totem){totem.hp-=damage;visualRing(totem.x,totem.y,.35,'#51dcc0')}
    else if(hero){const dealt=hitHero(hero,damage,e);if(dealt>0)damageNumber(hero.x,hero.y-.7,'−'+dealt.toFixed(1),'#ffb6a7');if(hero.hp===0)log('Your '+hero.base.name+' was defeated.')}
    else{applyTowerDamage(damage);if(state.mode==='over')break}
  }}else if(dist>0){e.inAttackRange=false;let mult=1;for(const p of state.traps)if(Math.hypot(e.x-p.x,e.y-p.y)<=p.radius){mult=Math.min(mult,p.slow)}if(e.slowUntil>state.elapsed)mult=Math.min(mult,e.slowFactor||.75);if(e.rootUntil>state.elapsed)mult=0;takeTowerSafeStep(e,target,dt,e.speed*mult)}else brake(e,dt)
 }
 if(state.mode!=='battle')return;
 resolveActorCollisions();
 // Process deaths after all attacks; event-based necromancy is an on-kill event, never timed or random.
 // Boss transformations are one encounter, not fresh reward-bearing enemies.
 for(let i=state.enemies.length-1;i>=0;i--){
  const e=state.enemies[i];
  if(e.boss&&state.stage===1&&e.hp<=e.maxHp*.5&&!state.bossRewardPending){
   state.bossRewardPending=true;state.bossKilled=true;
   state.enemies.splice(i,1);
   for(let n=0;n<4;n++){
    const angle=Math.PI*2*n/4+.4;
    const child=spawnEnemy(false,'generated',{x:e.x+Math.cos(angle)*1.25,y:e.y+Math.sin(angle)*1.25});
    child.hp=BALANCE.stages[0].basic.hp;child.maxHp=child.hp;
    child.kind='king-split';child.scheduled=false;child.generated=true;
    child.vx=Math.cos(angle)*1.5;child.vy=Math.sin(angle)*1.5;
   }
   visualRing(e.x,e.y,2,'#9affbb');log('King Slime split into FOUR Slimes — defeat them all!');
   break;
  }
 }
 for(let i=state.enemies.length-1;i>=0;i--){
  const e=state.enemies[i];if(e.hp>0)continue;
  if(e.boss&&state.stage===10&&e.phase<3){
   e.phase++;
   const next=BALANCE.stages[9].boss.phases[e.phase-1];
   e.hp=e.maxHp=next.hp;e.damage=next.damage;e.speed=next.speed;e.attackPeriod=next.attackPeriod;
   e.hitFlash=.5;e.cooldown=.5;e.lastHitHero=null;
   visualRing(e.x,e.y,2+e.phase*.45,'#d18fff');
   log('Eldritch Horror reborn — Phase '+e.phase+' of 3!');
   continue;
  }
  if(e.boss){state.bossKilled=true;log(encounter().boss+' defeated!')}
  if(e.doom){const radius=1.6*(SKILLS?.has('T4-W-S04')?1.4:1);visualRing(e.x,e.y,radius,'#be86df');for(const other of enemiesInRadius(e.x,e.y,radius))if(other!==e)hitEnemy(other,1.2,'#ca91ef',e.doomSourceHeroId||null)}
  if(e.scheduled&&!e.boss)SKILLS?.scheduledKill();const upDrop=SKILLS?SKILLS.recordKill(e.lastHitHero||null,!!e.boss,{scheduled:!!e.scheduled,elite:!!e.elite}):0;
  if(upDrop>0){state.upEarned=Number((state.upEarned+upDrop).toFixed(3));state.upDrops++;const amount=Number(upDrop.toFixed(2));if(e.boss)log('Boss reward: +'+amount+' UP guaranteed!');else damageNumber(e.x,e.y-.55,'+'+amount+' UP','#ffd886');}
  onEnemyDeath(e);if(e.scheduled||e.boss)state.kills++;state.enemies.splice(i,1);
 }

 state.heroes=state.heroes.filter(h=>h.hp>0);
 // Only begin the boss intermission once every regular minion has spawned AND been defeated.
 if(!state.bossSpawned&&state.regularSpawned===regularCount()&&state.kills>=regularCount()&&state.enemies.every(e=>e.hp<=0||e.boss)){
  state.bossWaitClock+=dt;
  if(state.bossWaitClock>=BOSS_AFTER_CLEAR_DELAY){spawnEnemy(true);state.bossSpawned=true;log(encounter().boss+' has arrived after the minion wave!')}
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
const {updateUI,showBattleReport,waveStatus,rollShop,offeredPacks,selectedStock}=window.FWGameUI.create({state,refs,PACKS,HEROES,HERO_MAP,ENCOUNTERS,TUNING,SKILLS,regularCount,totalCount,encounter,chargeSeconds,isOriginalHero,nextSpawnInterval,NORMAL_SPAWN_INTERVAL,BOSS_AFTER_CLEAR_DELAY});
function buyPack(){const stock=selectedStock();if(!stock||state.mode!=='prep'||state.testMode)return;const remaining=M.buy(state.merchantShop,state.selectedSlot,state.coins);if(remaining===null)return;stock.order=state.bought;state.coins=remaining;state.packQueue.push(stock.packIndex);state.bought++;log(M.label(stock)+' purchased · '+stock.qty+' hero slot(s).');updateUI();saveShopStock()}
function rerollMerchant(){if(state.mode!=='prep'||state.testMode)return;const coins=M.reroll(state.merchantShop,state.coins);if(coins===null)return;state.coins=coins;state.shopCacheKey='';updateUI();saveShopStock()}
function reserveMerchant(){if(state.mode!=='prep'||state.testMode)return;if(M.reserve(state.merchantShop,state.selectedSlot)){state.shopCacheKey='';updateUI();saveShopStock()}}

function toggleTesting(){if(state.mode!=='prep')return;if(!state.testMode&&state.bought>0){log('Finish the regular-pack stage before enabling the separate Testing Shop.');return}if(!state.testMode){state.testSavedTowerHp=state.towerHp;state.testSavedStage=state.stage;state.testSavedMerchant={shop:state.merchantShop,id:state.merchantAttemptId,coins:state.coins,slot:state.selectedSlot}}state.testMode=!state.testMode;if(!state.testMode){state.testQueue=[];if(state.testSavedTowerHp!=null)state.towerHp=state.testSavedTowerHp;if(state.testSavedStage!=null)state.stage=state.testSavedStage;state.testSavedTowerHp=null;state.testSavedStage=null;if(state.testSavedMerchant){const m=state.testSavedMerchant;state.merchantShop=m.shop;state.shopOffers=m.shop.offers;state.merchantAttemptId=m.id;state.coins=m.coins;state.selectedSlot=m.slot;state.shopCacheKey='';state.testSavedMerchant=null}}log(state.testMode?'Testing mode ON · free heroes do not affect progression.':'Testing mode OFF.');updateUI()}
function addTestHero(base){if(!state.testMode||state.mode!=='prep')return;state.testQueue.push(base.id);log('Queued free '+base.name+' ('+state.testQueue.length+' test heroes).');updateUI()}
function openNextPack(){state.pendingPack=true;state.openedHeroes=null;state.currentRevealPack=state.packQueue[state.bought-state.packsToOpen]??0;const pack=PACKS[state.currentRevealPack];refs.revealKicker.textContent=pack.name+' Pack '+(state.bought-state.packsToOpen+1)+' of '+state.bought;refs.revealTitle.textContent='Open your '+pack.name+' Pack';refs.revealDesc.textContent='One random hero emerges from the '+pack.name+' pool.';refs.sealed.classList.remove('hidden');refs.drawGrid.classList.add('hidden');refs.drawGrid.replaceChildren();refs.revealButton.disabled=false;refs.revealButton.textContent='✦ Reveal hero';refs.revealFoot.textContent=PACKS[state.currentRevealPack].pool.map(id=>HERO_MAP[id].name).join(' · ')+' | Provisional equal-weight draws';refs.modal.classList.add('active');refs.modal.setAttribute('aria-hidden','false');refs.revealButton.focus();updateUI()}
function revealPack(){if(state.mode!=='opening'||!state.pendingPack)return;
 if(!state.openedHeroes){const heroes=Array.from({length:HEROES_PER_PACK},()=>chooseHero(state.currentRevealPack));state.openedHeroes=heroes;refs.revealKicker.textContent='NEW HERO';refs.revealTitle.textContent='Pack revealed!';refs.revealDesc.textContent='This hero joins the stage when you continue.';refs.drawGrid.replaceChildren(...heroes.map(hero=>{const el=document.createElement('div');el.className='draw-card';el.style.setProperty('--reveal-color',hero.color);el.innerHTML=`<span class="draw-tier">${hero.rarity}</span><span class="draw-glyph">${hero.glyph}</span><b>${hero.name}</b><small>${hero.hp} HP · ${hero.damage} DMG<br>${hero.speed}/s · ${hero.walk} walk</small>`;return el}));refs.sealed.classList.add('hidden');refs.drawGrid.classList.remove('hidden');refs.revealButton.textContent='✦ Deploy hero';refs.revealFoot.textContent='Class weights and duplicate rules remain open design choices.';log(PACKS[state.currentRevealPack].name+' Pack revealed: '+heroes.map(h=>h.name).join(', ')+'.')}
 else{for(const hero of state.openedHeroes)createHero(hero);if(SKILLS)SKILLS.recordPack(state.currentRevealPack);state.packsToOpen--;state.openedHeroes=null;state.pendingPack=false;if(state.packsToOpen>0)openNextPack();else{refs.modal.classList.remove('active');refs.modal.setAttribute('aria-hidden','true');beginBattle()}updateUI()}
}

function beginBattle(){SKILLS?.startAttempt();state.firstEncounterProtected=SKILLS?!SKILLS.markStageAttempt(state.stage):true;state.mode='battle';state.paused=false;state.regularSpawned=0;state.bossSpawned=false;state.kills=0;state.elapsed=0;state.spawnClock=0;state.uiClock=0;state.bossKilled=false;state.bossRewardPending=false;state.bossWaitClock=0;state.enemies=[];TOWER_FIRE.reset();state.effects=[];state.hazards=[];state.pendingHits=[];state.totems=[];state.traps=[];state.sanctuaries=[];state.sporeClouds=[];state.abilityCasts=0;state.towerShield=0;state.lastTowerShield=false;state.combatTelemetry={overlaps:0,targetSwitches:0,blocked:0};state.deployedHeroes=state.heroes.filter(h=>h.hp>0&&isOriginalHero(h)).length;state.upEarned=0;state.upDrops=0;state.lastReport=null;refs.battleReport.hidden=true;log('Stage '+state.stage+' · '+encounter().name+' — '+regularCount()+' '+encounter().minion+' units and '+encounter().boss+'.'+(state.testMode?' (test only)':''));if(state.heroes.length===0)log('Warning: no heroes have been recruited.');updateUI()}
function resetPreparation(restoreTower=true){state.coins=state.coinMax;if(restoreTower)state.towerHp=state.towerMax||100;state.mode='prep';state.paused=false;state.bought=0;state.packQueue=[];state.packsToOpen=0;state.testQueue=[];state.heroes=[];state.enemies=[];state.effects=[];state.hazards=[];state.pendingHits=[];state.totems=[];state.traps=[];state.sanctuaries=[];state.sporeClouds=[];state.abilityCasts=0;state.regularSpawned=0;state.bossSpawned=false;state.kills=0;state.bossKilled=false;state.bossRewardPending=false;state.elapsed=0;state.spawnClock=0;state.bossWaitClock=0;state.uiClock=0;TOWER_FIRE.reset();state.upEarned=0;state.upDrops=0;state.deployedHeroes=0;state.lastReport=null;state.bossRewardPending=false;refs.battleReport.hidden=true;state.pendingPack=false;state.openedHeroes=null;refs.overlay.classList.add('hidden');if(SKILLS)SKILLS.recalc();state.coins=state.coinMax;rollShop();updateUI();saveShopStock()}
function startStage(){if(state.mode==='clear'){if(!state.testMode)state.stage++;resetPreparation(true);if(SKILLS&&!state.testMode)SKILLS.checkpointStage(state.stage);log((state.testMode?'Test preparation':'Stage '+state.stage+' preparation')+' has begun.');updateUI();return}
 if(state.mode!=='prep')return;
 if(SKILLS&&!state.testMode)SKILLS.checkpointStage(state.stage);
 if(state.testMode){for(const id of state.testQueue)createHero(HERO_MAP[id]);state.testQueue=[]}
 else{
  if(!state.bought){log('Purchase at least one hero offer before starting.');return;}
  const plan=M.resolve(state.merchantShop,SKILLS.merchantState().pity);
  if(!SKILLS.commitMerchant(state.merchantAttemptId,plan)){log('This merchant transaction was already committed.');return;}
  clearShopStock();
  for(const id of plan.heroes)createHero(HERO_MAP[id]);
  log('Deployed '+plan.heroes.map(id=>HERO_MAP[id].name).join(', ')+'.');
 }
 state.packsToOpen=0;state.pendingPack=false;beginBattle()
}

function clearStage(){
 if(state.bossRewardPending){
  state.bossRewardPending=false;state.kills++;
  const reward=SKILLS?SKILLS.recordKill(null,true):0;
  if(reward>0){state.upEarned=Number((state.upEarned+reward).toFixed(2));state.upDrops++;log('King Slime defeated! +'+reward+' UP boss reward.');}
 }
 SKILLS?.finishAttempt(true);showBattleReport();if(SKILLS)SKILLS.recordWin(state.stage);state.mode=(!state.testMode&&state.stage===10)?'champion':'clear';state.heroes=[];state.effects=[];state.hazards=[];state.pendingHits=[];refs.messageSymbol.textContent='✦';refs.messageTitle.textContent=state.mode==='champion'?'Ten Stages Complete!':'Stage '+state.stage+' Cleared';refs.messageText.textContent=state.mode==='champion'?'You have cleared all ten stages and defeated the Eldritch Horror. The campaign is complete; post-game progression is not yet designed.':state.testMode?'Test battle completed. Debug battles do not advance your stage. Return to preparation with full coins.':'The boss has fallen and the tower stands! All heroes leave after this stage. Your next round refills to '+state.coinMax+' coins.';refs.messageButton.textContent=state.mode==='champion'?'↻ Start New Run':state.testMode?'Back to Testing Prep':'Prepare Stage '+(state.stage+1);refs.overlay.classList.remove('hidden');log('Stage '+state.stage+' cleared!'+(state.testMode?' (debug only)':''));updateUI()}
function gameOver(){SKILLS?.finishAttempt(false);showBattleReport();if(SKILLS&&!state.testMode)SKILLS.checkpointStage(state.stage);state.mode='over';state.paused=false;refs.messageSymbol.textContent='♜';refs.messageTitle.textContent='Stage '+state.stage+' Failed';refs.messageText.textContent='You defeated '+state.kills+' of '+totalCount()+' enemies. Retry this stage with a restored tower and a refilled coin budget.';refs.messageButton.textContent='↻ Retry Stage '+state.stage;refs.overlay.classList.remove('hidden');log('Stage '+state.stage+' failed. You can retry.');updateUI()}
function retryStage(){if(state.mode!=='over')return;resetPreparation();log('Retry Stage '+state.stage+' — 100 tower HP and '+state.coinMax+' coins.');updateUI()}
function restart(){state.stage=1;state.coinMax=BALANCE.economy.startingCoinMax;state.testMode=false;state.testSavedTowerHp=null;state.testSavedStage=null;state.notifications=[];resetPreparation();refs.modal.classList.remove('active');refs.modal.setAttribute('aria-hidden','true');if(SKILLS)SKILLS.recalc();log('New run — defend the tower!');updateUI()}

function init(){
 // The full tree controls available pack offers and persistent progression.
 for(const h of HEROES.filter(h=>h.pack===0)){const div=document.createElement('div');div.className='odd';div.style.setProperty('--hcolor',h.color);div.innerHTML=`<i></i><span class="nm">${h.name}</span><span class="tier">${h.rarity}</span><b>Pool</b>`;$('odds').append(div)}
 for(const p of PACKS){const div=document.createElement('div');div.className='pack-tier';div.textContent=p.name+' Pack';refs.packProgress.append(div)}
 if(SKILLS)SKILLS.connect({state,heroes:HEROES,packs:PACKS,tuning:TUNING,hound:HOUND,undead:UNDEAD,log,refresh:()=>{updateUI();saveShopStock()},restart});
 const questPanel=$('questPanel');if(questPanel)questPanel.addEventListener('click',e=>{const b=e.target.closest?.('[data-quest]');if(b)SKILLS?.showQuest?.(b.dataset.quest);});if(SKILLFX)SKILLFX.connect({state,heroes:HEROES,tuning:TUNING,hitEnemy,pushEnemy,visualRing,nearTower,addEffect});
 for(let i=1;i<=10;i++){const opt=document.createElement('option');opt.value=String(i);opt.textContent='Stage '+i+' — '+ENCOUNTERS[i-1].name;refs.testStage.append(opt)}refs.testStage.addEventListener('change',()=>{if(!state.testMode||state.mode!=='prep')return;state.stage=clamp(Number(refs.testStage.value)||1,1,10);log('Debug stage selected: '+state.stage+' · '+encounter().name);updateUI()});QUICK_STATS?.init({state,log})
 for(const h of HEROES){const b=document.createElement('button');b.className='test-hero';b.type='button';b.innerHTML=`<span class="test-icon">${h.glyph}</span><span>${h.name}</span><small>FREE · +1</small>`;b.addEventListener('click',()=>addTestHero(h));refs.testGrid.append(b)}
 for(const [field,key] of [[refs.acquireTune,'acquisitionRange'],[refs.guardTune,'towerGuardRadius'],[refs.chargeTune,'specialChargeSeconds']])field.addEventListener('change',()=>{const v=Number(field.value);if(Number.isFinite(v)&&v>0){TUNING.shared[key]=v;log('Demo tuning updated: '+key+' = '+v);updateUI()}});refs.testToggle.addEventListener('click',toggleTesting);refs.clearTest.addEventListener('click',()=>{if(state.mode!=='prep')return;state.testQueue=[];updateUI()});
 $('packOfferButtons').addEventListener('click',e=>{const b=e.target.closest('[data-shop-slot]');if(!b||state.mode!=='prep'||state.testMode)return;const slot=Number(b.dataset.shopSlot);if(!Number.isInteger(slot)||!state.shopOffers[slot]||state.shopOffers[slot].sold)return;state.selectedSlot=slot;updateUI();saveShopStock()});$('rotateShop').addEventListener('click',rerollMerchant);$('reserveShop')?.addEventListener('click',reserveMerchant);refs.buy.addEventListener('click',buyPack);refs.revealButton.addEventListener('click',revealPack);refs.start.addEventListener('click',startStage);
 refs.pause.addEventListener('click',()=>{if(state.mode!=='battle')return;state.paused=!state.paused;updateUI()});refs.restart.addEventListener('click',()=>{if(SKILLS)SKILLS.markRestart();restart()});
 refs.messageButton.addEventListener('click',()=>{if(state.mode==='clear')startStage();else if(state.mode==='over')retryStage();else if(state.mode==='champion'){if(SKILLS)SKILLS.markRestart();restart()}});
 document.addEventListener('keydown',e=>{if(e.target.closest?.('#fwQuickStats'))return;if(e.code==='Space'&&state.mode==='battle'){e.preventDefault();state.paused=!state.paused;updateUI()}else if(e.key==='Enter'&&state.mode==='prep'&&!state.pendingPack)startStage()});window.addEventListener('resize',resize);if('ResizeObserver'in window)new ResizeObserver(resize).observe(canvas.parentElement);resize();restart();if(SKILLS)SKILLS.resumeStage();initialising=false;if(!restoreShopStock()){rollShop();updateUI()}saveShopStock();requestAnimationFrame(tick)
}

window.__FW_DEMO__={snapshot:()=>({combatTelemetry:{...state.combatTelemetry},stage:state.stage,coins:state.coins,coinMax:state.coinMax,towerHp:state.towerHp,mode:state.mode,paused:state.paused,bought:state.bought,packsToOpen:state.packsToOpen,testMode:state.testMode,testQueue:state.testQueue.slice(),regularTotal:regularCount(),heroes:state.heroes.map(h=>({name:h.base.name,rarity:h.base.rarity,hp:h.hp,x:h.x,y:h.y})),regularSpawned:state.regularSpawned,worldW:view.worldW,worldH:view.worldH,bossSpawned:state.bossSpawned,bossWaitClock:state.bossWaitClock,normalSpawnInterval:NORMAL_SPAWN_INTERVAL,nextSpawnInterval:nextSpawnInterval(),kills:state.kills,enemies:state.enemies.length,hasPendingPack:state.pendingPack,abilityCasts:state.abilityCasts,totems:state.totems.length,traps:state.traps.length,heroesCharged:state.heroes.filter(h=>h.charge>=chargeSeconds(h)&&isOriginalHero(h)).length,heroesDetail:state.heroes.map(h=>({name:h.base.name,hp:h.hp,x:h.x,y:h.y,charge:h.charge,casts:h.casts,summonKind:h.summonKind,beamTarget:h.beamTarget,beamTime:h.beamTime,damage:h.base.damage})),tuning:TUNING.shared,packs:PACKS.map(p=>({name:p.name,pool:p.pool,stage:p.stage})),encounter:{...encounter()},campaignStages:ENCOUNTERS.length,towerAim:state.towerAim,projectiles:state.towerShots?.length||0,sporeClouds:state.sporeClouds?.length||0,balanceProfile:BALANCE.profileId,balanceSchema:BALANCE.schemaVersion,sanctuaries:state.sanctuaries.length,shopOffers:state.shopOffers.map(o=>({...o})),selectedSlot:state.selectedSlot,merchant:{...SKILLS?.merchantState?.(),free:state.merchantShop?.free,paid:state.merchantShop?.paid},version:'development tree integration / design-1.16.0',skillTree:SKILLS?.debug(),quests:SKILLS?.questProgress?.(),wave:waveStatus(),battleReport:state.lastReport})};

// Testing-only, non-persistent simulation controls for automated playtesting.
window.__FW_TEST__={
 advance:(seconds)=>{if(!state.testMode||state.mode!=='battle')return false;for(let i=0;i<Math.round(seconds/.05)&&state.mode==='battle';i++)step(.05);updateUI();return true},
 enemy:(x,y,hp=SPAWN_CONFIG.normalHp,damage=0)=>{if(!state.testMode||state.mode!=='battle')return false;state.enemies.push({id:state.nextId++,x,y,hp,maxHp:hp,boss:false,speed:0,damage,attackPeriod:1,firstDelay:SPAWN_CONFIG.minionFirstAttackWindup,cooldown:0,inAttackRange:false,testSpawn:true});return true},
 kill:(count=1)=>{if(!state.testMode||state.mode!=='battle')return false;let n=0;for(const e of state.enemies){if(!e.boss&&e.hp>0){e.hp=0;n++;if(n>=count)break}}return n},
 current:()=>({mode:state.mode,elapsed:state.elapsed,casts:state.abilityCasts,heroes:state.heroes.map(h=>({name:h.base.name,hp:h.hp,x:h.x,y:h.y,charge:h.charge,casts:h.casts,beamTarget:h.beamTarget,beamTime:h.beamTime,summonKind:h.summonKind,expiry:h.expiry,invisibleUntil:h.invisibleUntil,shield:h.shield})),enemies:state.enemies.map(e=>({id:e.id,hp:e.hp,maxHp:e.maxHp,x:e.x,y:e.y,damage:e.damage,speed:e.speed,attackPeriod:e.attackPeriod,cooldown:e.cooldown,inAttackRange:!!e.inAttackRange,boss:!!e.boss})),totems:state.totems.length,traps:state.traps.length,sanctuaries:state.sanctuaries.map(z=>({...z})),encounter:encounter().name})};

if(document.body.classList.contains('lab-mode')){
 window.__FW_LAB_API__={
  prepare(){
   resetPreparation();
   if(!state.testMode)toggleTesting();
   updateUI();
   return true;
  },
  setStage(n){
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
