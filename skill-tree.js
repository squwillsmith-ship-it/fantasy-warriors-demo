/* v1.16 skill graph runtime. Pending effects are never purchasable. */
(function(){'use strict';
const data=window.FW_SKILL_DATA,B=window.FWBalance.profile,M=window.FWMerchant,SK=window.FWSkins;
const O=data.ordinary,L=data.legacy,S=data.supported,all=[...O,...L],map=Object.fromEntries(all.map(n=>[n.id,n]));
const tiers=M.data.packs.map(p=>p.name),heroes=M.data.heroes,gateId=h=>'T'+(h.pack+1)+'-'+data.codes[data.heroes.indexOf(h.id)]+'-GATE';
const gates=heroes.map(h=>({id:gateId(h),name:h.name+' kill challenge',heroId:h.id,kind:'gate',tier:h.pack+1,goal:data.gateGoals[h.id]}));
const structural=Array.from({length:5},(_,i)=>{const t=i+1;return [{id:'T'+t+'-ROOT',name:tiers[i]+' entry',kind:'root',tier:t},{id:'T'+t+'-M1',name:'Stage '+([1,3,5,7,10][i])+' cleared',kind:'milestone',tier:t},{id:'T'+t+'-EXIT',name:t===5?'Campaign apex':'Open '+tiers[t],kind:'exit',tier:t}] }).flat();
const K=document.body.classList.contains('lab-mode')?'fantasy-warriors-lab-skilltree-1.1':'fantasy-warriors-skilltree-1.1', $=id=>document.getElementById(id);
const fresh=()=>({treeSchema:2,up:0,shards:0,resets:0,nodes:[],legacyNodes:[],kills:{},packOpens:{},highestClear:0,runHighest:0,runWins:0,campaignStage:1,gateways:[],purchaseCosts:{},eligibleKillRemainder:0,knowledgeRemainder:0,attemptedStages:[],runClears:[],merchantPity:[0,0,0,0,0],merchantCommit:null,merchantCommission:null,discoveredHeroes:[],ownedSkins:[],skinDuplicateStreak:0,spellLoadout:[],pendingTheft:0,theftShop:null,rewardAttempt:null,rewardIds:[],endless:null,endlessBest:null,endlessByPrestige:{},endlessLast:null,endlessDeepest:0,migration:null});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(v,hi=1e9)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=hi?v:0;
const integer=(v,hi)=>Math.floor(num(v,hi));
const ids=(a,allowed)=>Array.isArray(a)?[...new Set(a.filter(x=>allowed.includes(x)))]:[];
const validPity=a=>Array.isArray(a)&&a.length===5&&a.every(x=>Number.isInteger(x)&&x>=0&&x<=7)?a.slice():[0,0,0,0,0];
const uniqueInts=(a,max)=>Array.isArray(a)?[...new Set(a.filter(x=>Number.isInteger(x)&&x>=1&&x<=max))]:[];
function normalize(source){
 const q=fresh();if(!source||typeof source!=='object')return q;
 for(const k of ['up','shards'])q[k]=num(source[k]);q.shards=SK.shards(SK.cents(q.shards));
 for(const k of ['resets','runWins'])q[k]=integer(source[k],1000000);
 for(const k of ['highestClear','runHighest'])q[k]=integer(source[k],10);
 q.campaignStage=Math.max(1,integer(source.campaignStage??Math.min(10,q.runHighest+1),10));
 q.attemptedStages=uniqueInts(source.attemptedStages,10);
 q.runClears=source.treeSchema===2?uniqueInts(source.runClears,10):Array.from({length:q.runHighest},(_,i)=>i+1);
 const E=window.FWEndless;const cleanRecord=x=>x&&E.valid(x.wave)?{wave:x.wave,completed:integer(x.completed,x.wave),prestige:integer(x.prestige,1000000),profile:String(x.profile||''),seconds:num(x.seconds,1e15),kills:num(x.kills,1e15),bosses:num(x.bosses,1e15),up:num(x.up,1e15),shards:num(x.shards,1e15),reason:String(x.reason||'')}:null;q.endlessDeepest=integer(source.endlessDeepest,Number.MAX_SAFE_INTEGER);q.endlessBest=cleanRecord(source.endlessBest);q.endlessLast=cleanRecord(source.endlessLast);for(const [k,v] of Object.entries(source.endlessByPrestige||{})){const z=cleanRecord(v);if(z&&String(z.prestige)===k)q.endlessByPrestige[k]=z}const e=source.endless;if(q.runHighest===10&&e&&typeof e.id==='string'&&E.valid(e.wave)&&['prep','battle'].includes(e.phase)){const z=cleanRecord(e);q.endless={...z,id:e.id,phase:e.phase,exited:!!e.exited,attempt:typeof e.attempt==='string'?e.attempt:null,activeSeconds:num(e.activeSeconds,1e15)};}q.gateways=uniqueInts(source.gateways,5).filter(t=>t>1);
 for(const h of heroes)q.kills[h.id]=integer(source.kills?.[h.id],1e7);
 for(let i=0;i<5;i++)q.packOpens[i]=integer(source.packOpens?.[i],1e7);
 q.eligibleKillRemainder=integer(source.eligibleKillRemainder,B.economy.eligibleKillsPerUP-1);q.knowledgeRemainder=integer(source.knowledgeRemainder,14);
 q.merchantPity=validPity(source.merchantPity);q.merchantCommit=typeof source.merchantCommit==='string'?source.merchantCommit:null;
 q.pendingTheft=integer(source.pendingTheft,100000);q.theftShop=source.theftShop&&typeof source.theftShop.id==='string'?{id:source.theftShop.id,amount:integer(source.theftShop.amount,40)}:null;q.rewardAttempt=typeof source.rewardAttempt==='string'?source.rewardAttempt:null;q.rewardIds=Array.isArray(source.rewardIds)?[...new Set(source.rewardIds.filter(x=>typeof x==='string'))].slice(-5000):[];q.spellLoadout=ids(source.spellLoadout,['lightning','healing','frost','ember']).slice(0,2);q.discoveredHeroes=ids(source.discoveredHeroes,data.heroes);const skinState=SK.normalize(heroes,q.discoveredHeroes,source.ownedSkins,source.skinDuplicateStreak);q.ownedSkins=skinState.owned;q.skinDuplicateStreak=skinState.streak;q.merchantCommission=q.discoveredHeroes.includes(source.merchantCommission)?source.merchantCommission:null;
 q.legacyNodes=ids(source.legacyNodes??source.merchantNodes,L.map(n=>n.id)).filter(id=>S[id]);
 if(source.treeSchema===2){
  q.nodes=ids(source.nodes,O.map(n=>n.id)).filter(id=>S[id]);q.migration=source.migration??null;
  for(const id of q.nodes)q.purchaseCosts[id]=map[id].cost;
 }else{
  // One-time refund, never map an old positioning/targeting effect into a new node.
  let up=0,shards=0;
  for(const id of new Set(Array.isArray(source.nodes)?source.nodes:[])){
   if(typeof id!=='string'||!Object.hasOwn(B.skill.costs,id)||/-ROOT$|-GATE$|-M1$|-EXIT$/.test(id))continue;
   up+=num(source.purchaseCosts?.[id]??B.skill.costs[id],100000);
  }
  for(const [key,base,max] of [['vitality',1,6],['strength',1,6],['insight',1,6],['treasury',2,4],['merchant',3,3]]){
   const level=integer(source.legacy?.[key],max);for(let j=0;j<level;j++)shards+=base+j;
  }
  q.up+=up;q.shards=SK.shards(SK.cents(q.shards)+SK.cents(shards));q.migration={from:'legacy-205',refundedUP:up,refundedShards:shards};
 }
 // Drop orphaned Legacy nodes from malformed imports, preserving legitimate merchant chains.
 let changed=true;while(changed){const keep=q.legacyNodes.filter(id=>map[id].prerequisites==='ROOT'||q.legacyNodes.includes(map[id].prerequisites));changed=keep.length!==q.legacyNodes.length;q.legacyNodes=keep}
 return q;
}
let p=fresh(),api=null,initial=null,initialSpecials=null,initialSummons=null,sandbox=null,tab='tree',selected=null;
try{const raw=localStorage.getItem(K);if(raw){const old=JSON.parse(raw);p=normalize(old);if(old.treeSchema!==2){localStorage.setItem(K+'-pre-v1.16-backup',raw);localStorage.setItem(K,JSON.stringify(p))}}}catch(e){}
function save(){if(!sandbox)try{localStorage.setItem(K,JSON.stringify(p))}catch(e){}}
const isTierOpen=t=>t===1||p.gateways.includes(t);
function has(id){
 if(typeof id!=='string')id=id?.id;if(!id)return false;
 if(id==='ROOT')return true;
 if(/^P>=\d+$/.test(id))return p.resets>=Number(id.slice(3));
 const g=gates.find(x=>x.id===id);if(g)return isTierOpen(g.tier)&&(p.kills[g.heroId]||0)>=g.goal;
 const t=id.match(/^T([1-5])-(ROOT|M1|EXIT)$/);
 if(t){const i=+t[1];return t[2]==='ROOT'?isTierOpen(i):t[2]==='M1'?isTierOpen(i)&&p.runHighest>=[1,3,5,7,10][i-1]:i===5?p.runHighest===10:isTierOpen(i+1)}
 return p.nodes.includes(id)||p.legacyNodes.includes(id);
}
function requirements(n){return n.prerequisites.split(' + ').every(x=>x.startsWith('ANY(')?x.slice(4,-1).split(',').some(has):has(x))}
function available(){return !!api&&api.state.mode==='prep'&&!api.state.testMode&&api.state.bought===0}
function check(id){
 const n=map[id];if(!n)return {ok:false,reason:'Unknown node'};
 if(has(id))return {ok:false,reason:'Owned'};
 if(!S[id])return {ok:false,reason:'Effect pending implementation'};
 if(!requirements(n))return {ok:false,reason:'Requires '+n.prerequisites};
 const currency=id.startsWith('R-')?'shards':'up';if(p[currency]<n.cost)return {ok:false,reason:'Insufficient '+currency};
 if(!available()||(currency==='shards'&&(sandbox||p.endless)))return {ok:false,reason:'Purchase during preparation before buying offers'};
 return {ok:true,currency,cost:n.cost};
}
const sum=(kind,key)=>[...p.nodes,...p.legacyNodes].reduce((n,id)=>{const x=S[id];return n+(x?.kind===kind&&(x.key==null||x.key===key)?x.amount:0)},0);
function purchase(id){
 const c=check(id);if(!c.ok)return false;
 p[c.currency]=Math.round((p[c.currency]-c.cost)*100)/100;
 if(c.currency==='up'){p.nodes.push(id);p.purchaseCosts[id]=c.cost}else p.legacyNodes.push(id);
 save();recalc();draw();api.log(map[id].name+' purchased');return true;
}
function gateway(t){
 if(!available()||t<1||t>4||!has('T'+t+'-M1')||isTierOpen(t+1))return false;
 const cost=p.resets>=t?0:data.gateways.up[t-1];if(p.up<cost)return false;p.up-=cost;p.gateways.push(t+1);save();recalc();draw();return true;
}
function questProgress(){return gates.map(g=>({...g,className:heroes.find(h=>h.id===g.heroId).name,questName:g.name,tierName:tiers[g.tier-1],kills:p.kills[g.heroId]||0,legacyCredit:false,available:isTierOpen(g.tier),rewarded:has(g.id),rewardCoins:2}))}
function recalc(){
 if(!api)return;const state=api.state,prev=state.coinMax,oldTower=state.towerMax||100;
 state.coinMax=Math.min(40,2+2*gates.filter(g=>has(g.id)).length+sum('coins'));
 state.shopSlots=Math.min(6,3+sum('slots')+(has('R-M01')?1:0)+(has('R-M18')?1:0));
 if(state.mode==='prep'&&state.bought===0&&state.coins===prev)state.coins=state.coinMax;
 state.towerMax=B.economy.startingTowerHP*(1+sum('towerHP'));state.towerHp=state.mode==='prep'&&state.towerHp>=oldTower-.001?state.towerMax:Math.min(state.towerHp,state.towerMax);
 for(const h of api.heroes){const base=initial[h.id];for(const [field,kind] of [['hp','hp'],['damage','damage'],['speed','rate'],['walk','walk']])h[field]=Number((base[field]*(1+sum(kind,h.id))).toFixed(5));
  const sp=api.tuning.heroes[h.id].special,orig=initialSpecials[h.id];Object.assign(sp,orig);
  for(const id of [...p.nodes,...p.legacyNodes]){const x=S[id];if(x?.kind==='special'&&x.key===h.id)sp[x.field]=orig[x.field]*(1+x.amount)}
  if(h.id==='necromancer'){sp.beamBaseDamageRate=h.damage*h.speed;sp.beamRampSeconds=orig.beamRampSeconds/(1+sum('rampRate',h.id));sp.beamMaxRampMultiplier=1+(orig.beamMaxRampMultiplier-1)*(1+sum('rampBonus',h.id))}
  if(h.id==='barbarian')sp.frenzyAttackSpeedMultiplier=1+(orig.frenzyAttackSpeedMultiplier-1)*(1+sum('frenzyBonus',h.id));
 }
 for(const key of ['hound','undead']){const unit=api[key],orig=initialSummons[key];unit.hp=orig.hp*(1+sum('summonAll')+sum('summonHP',key));unit.damage=orig.damage*(1+sum('summonAll')+sum('summonDamage',key));}
 Object.assign(api.tuning.heroes.beastmaster.special,{houndHealth:api.hound.hp,houndDamage:api.hound.damage});
 Object.assign(api.tuning.heroes.necromancer.special,{undeadHealth:api.undead.hp,undeadDamage:api.undead.damage});
 api.refresh?.();
}
const credit=n=>{p.up=Math.round((p.up+n)*100)/100;return n};
const income=()=>1+sum('income');
function recordKill(heroId,boss=false,flags={}){
 if(!api||api.state.testMode)return 0;if(flags.rewardId){if(p.rewardAttempt!==api.state.rewardAttempt||p.rewardIds.includes(flags.rewardId))return 0;p.rewardIds.push(flags.rewardId)}let base=0,bonus=0;const scheduled=!boss&&!flags.faction&&flags.scheduled!==false;if(p.endless?.phase==='battle'){if(flags.scheduled&&!boss&&!flags.faction)p.endless.kills++;if(boss)p.endless.bosses++;if(flags.mutated||flags.faction||boss)p.endless.shards++;}if(boss&&p.endless?.phase==='battle')p.shards=SK.shards(SK.cents(p.shards)+100);if(flags.faction){p.shards=SK.shards(SK.cents(p.shards)+100);const gain=credit(2+(has('R-E10')?1:0));if(p.endless?.phase==='battle')p.endless.up+=gain;save();labels();return gain}if(flags.mutated&&scheduled)p.shards=SK.shards(SK.cents(p.shards)+100);
 if(scheduled){p.eligibleKillRemainder++;if(p.eligibleKillRemainder>=B.economy.eligibleKillsPerUP){p.eligibleKillRemainder-=B.economy.eligibleKillsPerUP;base++}if(flags.elite)base+=B.economy.eliteKillUP;
 if(has('O-4-G4')){p.knowledgeRemainder++;if(p.knowledgeRemainder>=15){p.knowledgeRemainder-=15;bonus++}}
 const g=gates.find(x=>x.heroId===heroId);if(g){const was=has(g.id);p.kills[heroId]=(p.kills[heroId]||0)+1;if(!was&&has(g.id)){if(has('R-E07'))bonus++;recalc();api.log(g.name+' complete: +2 max coins');}}}
 if(boss)base=5;else if(scheduled){const factors=B.economy.scheduledUPByPrestige;if(factors)base*=factors[Math.min(p.resets,factors.length-1)];}const gain=credit(base*income()+bonus);if(p.endless?.phase==='battle')p.endless.up+=gain;save();labels();return gain;
}
function prestigeCount(){return p.resets}
function attempted(stage){return p.attemptedStages.includes(stage)}
function stealCoin(){if(!api||api.state.testMode)return false;p.pendingTheft++;save();return true}
function applyTheft(id,coins,floor){if(!api||api.state.testMode)return 0;if(p.theftShop?.id===id)return p.theftShop.amount;const amount=Math.min(p.pendingTheft,Math.max(0,coins-floor));p.pendingTheft=0;p.theftShop={id,amount};save();return amount}
function markStageAttempt(stage){if(!api||api.state.testMode)return false;const seen=p.attemptedStages.includes(stage);if(!seen){p.attemptedStages.push(stage);save()}return seen}
function recordPack(i){if(!api||api.state.testMode)return;p.packOpens[i]=(p.packOpens[i]||0)+1;save()}
function endlessCheckpoint(seconds){if(p.endless?.phase==='battle'&&!api?.state.testMode&&seconds-(p.endless.activeSeconds||0)>=1){p.endless.activeSeconds=seconds;save()}}
function endlessState(){return {deepest:p.endlessDeepest,available:p.runHighest===10,discovered:p.highestClear===10,session:p.endless?JSON.parse(JSON.stringify(p.endless)):null,best:p.endlessBest,last:p.endlessLast,byPrestige:p.endlessByPrestige}}
function saveBest(e){const record={...e};delete record.id;delete record.phase;delete record.attempt;delete record.exited;delete record.activeSeconds;const better=(a,b)=>!b||a.completed>b.completed||a.completed===b.completed&&a.prestige===b.prestige&&a.profile===b.profile&&a.seconds<b.seconds; if(better(record,p.endlessBest))p.endlessBest=record;if(better(record,p.endlessByPrestige[e.prestige]))p.endlessByPrestige[e.prestige]=record;}
function enterEndless(){if(!api||api.state.testMode||sandbox||p.runHighest!==10||p.endless)return false;p.endless={id:globalThis.crypto?.randomUUID?.()||Date.now()+'-'+Math.random(),wave:1,completed:0,prestige:p.resets,profile:B.profileId,seconds:0,kills:0,bosses:0,up:0,shards:0,phase:'prep',exited:false,attempt:null,activeSeconds:0};save();return true}
function exitEndless(){if(p.endless?.phase!=='prep')return false;p.endless.exited=true;save();return true}
function resumeEndless(){if(p.endless?.phase!=='prep')return false;p.endless.exited=false;save();return true}
function endEndless(reason){if(!p.endless)return false;const e=p.endless;if(e.phase==='battle')e.seconds+=e.activeSeconds||0;e.activeSeconds=0;e.reason=reason;p.endlessLast={...e};saveBest(e);p.endless=null;save();return true}
function finishEndless(won){const e=p.endless;if(!e||e.phase!=='battle'||api.state.testMode)return false;e.seconds+=api.state.elapsed;e.activeSeconds=0;if(won){e.completed=e.wave;saveBest(e);e.wave++;e.phase='prep';e.attempt=null;e.exited=false;save();return true}e.phase='ended';return endEndless('Tower defeated')}
function recordWin(stage){if(!api||api.state.testMode)return;if(!p.runClears.includes(stage)){p.runClears.push(stage);if(has('R-E06')){credit(1);api.state.upEarned=Math.round(((api.state.upEarned||0)+1)*100)/100}}p.campaignStage=Math.min(10,stage+1);p.runWins++;p.highestClear=Math.max(p.highestClear,stage);p.runHighest=Math.max(p.runHighest,stage);save();labels()}
function startAttempt(){if(!api)return;if(!api.state.testMode){p.rewardAttempt=api.state.merchantAttemptId;p.rewardIds=[];api.state.rewardAttempt=p.rewardAttempt;save();}api.state.treeStartUP=p.up;api.state.treeStartCoins=api.state.coins;api.state.treeScheduledKills=0;api.state.treeOutcomePaid=false;api.state.attemptProgressTopup=0}
function scheduledKill(){if(api)api.state.treeScheduledKills=(api.state.treeScheduledKills||0)+1}
function finishAttempt(won){
 if(!api||api.state.testMode||api.state.mode!=='battle'||api.state.treeOutcomePaid)return 0;
 const state=api.state;state.treeOutcomePaid=true;let bonus=0;
 if(has('R-E08')&&state.treeScheduledKills>=6)bonus+=Math.min(2,Math.floor(state.treeStartUP*.1));
 if(won&&!state.endlessWave&&has('R-E11'))bonus+=Math.min(2,Math.floor(state.treeStartCoins/2));
 // A resolved battle always advances the player: top up, never add a flat farming bonus.
 const topup=Math.max(0,Math.round((2-(p.up-state.treeStartUP)-bonus)*100)/100);
 bonus+=topup;state.attemptProgressTopup=topup;credit(bonus);
 state.upEarned=Math.round(((state.upEarned||0)+bonus)*100)/100;
 if(topup>0)api.log('Attempt progression: +'+topup+' UP (minimum 2 UP per completed battle).');
 if(p.endless?.phase==='battle')p.endless.up+=bonus;save();labels();return bonus
}
function checkpointStage(stage){if(!api||api.state.testMode||p.endless||p.runHighest===10)return;p.campaignStage=Math.max(1,Math.min(10,stage));save()}
function markRestart(){if(p.endless||p.runHighest===10)return false;p.campaignStage=1;save();return true}
function resumeStage(){if(api&&api.state.mode==='prep'&&!api.state.testMode){if(p.endless?.phase==='battle')endEndless('Active battle abandoned on reload');api.state.stage=p.campaignStage;api.refresh?.()}}
function payout(){return Math.min(15,2+Math.max(1,Math.floor(1.35**(Math.max(1,p.runHighest)-1)+.5)))}
function prestige(){if(!available()||sandbox||p.runWins===0||!confirm('Prestige for '+payout()+' Shards? Ordinary upgrades, gates and class kills reset.'))return false;
 if(p.endless)endEndless('Prestige');const reward=payout(),q=fresh();Object.assign(q,{shards:SK.shards(SK.cents(p.shards)+SK.cents(reward)),resets:p.resets+1,legacyNodes:p.legacyNodes.slice(),highestClear:p.highestClear,endlessBest:p.endlessBest,endlessByPrestige:p.endlessByPrestige,endlessLast:p.endlessLast,endlessDeepest:p.endlessDeepest,attemptedStages:p.attemptedStages.slice(),discoveredHeroes:p.discoveredHeroes.slice(),ownedSkins:p.ownedSkins.slice(),skinDuplicateStreak:p.skinDuplicateStreak,merchantCommission:p.merchantCommission,migration:p.migration,up:has('R-E03')?2:0});p=q;save();api.restart();recalc();draw();return true}
function skinCollection(){const pool=SK.eligible(heroes,p.discoveredHeroes);return{available:p.resets>=3,owned:p.ownedSkins.length,eligible:pool.length,discovered:p.discoveredHeroes.slice(),skins:SK.catalog(heroes).map(s=>({...s,discovered:p.discoveredHeroes.includes(s.heroId),owned:p.discoveredHeroes.includes(s.heroId)&&(s.key==='default'||p.ownedSkins.includes(s.id))})),shards:p.shards}}
let lastSkinReward=null;
function buySkinBox(){if(!api||api.state.mode!=='prep'||api.state.testMode||sandbox||p.endless)return false;const result=SK.open({heroes,discovered:p.discoveredHeroes,owned:p.ownedSkins,streak:p.skinDuplicateStreak,balanceCents:SK.cents(p.shards),prestige:p.resets});if(!result.ok)return false;
 p.shards=SK.shards(result.balanceCents);p.ownedSkins=result.owned;p.skinDuplicateStreak=result.streak;lastSkinReward={skin:result.skin,duplicate:result.duplicate};save();labels();api.refresh?.();draw();return {...lastSkinReward}}
function drawSkin(id,rng=Math.random){return SK.draw(heroes,id,p.ownedSkins,rng)}
function merchantState(){return {flags:p.legacyNodes.filter(id=>/^R-M\d\d$/.test(id)),pity:validPity(p.merchantPity),lastCommit:p.merchantCommit,commission:p.merchantCommission,discovered:p.discoveredHeroes.slice(),firstDiscount:has('O-2-G5')}}
function commitMerchant(id,plan){if(!api||api.state.testMode||typeof id!=='string'||id===p.merchantCommit)return false;if(p.endless){if(p.endless.phase!=='prep'||p.endless.exited)return false;p.endless.phase='battle';p.endless.attempt=id;p.endless.activeSeconds=0;p.endlessDeepest=Math.max(p.endlessDeepest,p.endless.wave)}p.merchantPity=validPity(plan.pity);p.merchantCommit=id;p.discoveredHeroes=ids([...p.discoveredHeroes,...plan.heroes],data.heroes);for(let i=0;i<5;i++)p.packOpens[i]=(p.packOpens[i]||0)+(plan.packOpens[i]||0);save();labels();return true}
function spellLoadout(){return p.spellLoadout.filter(k=>has(({lightning:'O-SP01',healing:'O-SP02',frost:'O-SP03',ember:'O-SP04'})[k])).slice(0,has('O-SP11')?2:1)}
function setSpellLoadout(slot,key){if(!api||api.state.mode!=='prep'||slot<0||slot>=(has('O-SP11')?2:1))return false;const list=spellLoadout();const node=({lightning:'O-SP01',healing:'O-SP02',frost:'O-SP03',ember:'O-SP04'})[key];if(key&&(!node||!has(node)||list.some((k,i)=>i!==slot&&k===key)))return false;if(key)list[slot]=key;else list.splice(slot,1);p.spellLoadout=list.filter(Boolean);save();api.refresh?.();return true}
function setCommission(id){if(!available()||sandbox||!has('R-M20')||(id&&!p.discoveredHeroes.includes(id)))return false;p.merchantCommission=id||null;save();return true}
function labels(){const a=$('skillBalance'),b=$('skillMeta');if(a)a.textContent=p.up.toFixed(2)+' UP · '+p.shards+' Shards';if(b)b.textContent=p.resets+' resets · '+p.nodes.length+'/'+O.length+' ordinary · '+p.legacyNodes.length+'/'+L.length+' Legacy'}
function card(n){const c=check(n.id),pre=String(n.prerequisites||'ROOT');if(window.FWPrototypeArt){const kind=n.id.startsWith('R-')?'legacy':/ability|special|spell|mechanic/i.test(n.effect)?'ability':'stat';return '<button class="fw-graph-node '+kind+' '+(has(n.id)?'owned':c.ok?'ready':'locked')+'" data-node-id="'+n.id+'" data-select-node="'+n.id+'" data-graph-id="'+n.id+'"><span class="fw-node-shape">'+(has(n.id)?'✓':kind==='ability'?'◆':kind==='legacy'?'⬢':'■')+'</span><b>'+esc(n.name)+'</b><small>'+esc(has(n.id)?'OWNED':c.ok?'AVAILABLE':'LOCKED')+' · '+n.cost+(kind==='legacy'?' ◈':' UP')+'</small></button>'}return '<div class="fw-perk" data-node-id="'+n.id+'"><div class="fw-perk-body"><b>'+esc(n.name)+'</b><small>'+esc(n.effect)+'</small><span>'+esc(has(n.id)?'Owned':c.ok?'Available':c.reason)+'</span><small>Requires: '+esc(pre)+'</small></div><button type="button" data-buy="'+n.id+'" '+(!c.ok?'disabled':'')+'>'+ (has(n.id)?'OWNED':n.cost+(n.id.startsWith('R-')?' ◈':' UP'))+'</button></div>'}
function showNode(id){const n=map[id],c=check(id),d=$('skillDetails');if(!n||!d)return;d.innerHTML='<div class="fw-detail-header"><h3>'+esc(n.name)+'</h3><button id="fwNodeClose">Close</button></div><p>'+esc(n.effect)+'</p><p>Requires: '+esc(n.prerequisites)+' · '+esc(c.ok?'Available':c.reason)+'</p><button class="fw-action" id="fwNodeBuy" '+(!c.ok?'disabled':'')+'>'+ (has(id)?'Owned':'Purchase · '+n.cost+(id.startsWith('R-')?' Shards':' UP'))+'</button>';$('fwNodeClose').onclick=()=>{d.innerHTML=''};$('fwNodeBuy').onclick=()=>purchase(id)}
function drawLinks(world){if(!world?.isConnected)return;world.querySelector('.fw-graph-links')?.remove();const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.classList.add('fw-graph-links');const wr=world.getBoundingClientRect(),scale=wr.width/Math.max(1,world.offsetWidth);if(!scale)return;svg.setAttribute('viewBox','0 0 '+world.offsetWidth+' '+world.offsetHeight);const nodes=new Map([...world.querySelectorAll('[data-graph-id]')].map(x=>[x.dataset.graphId,x]));const point=(el,bottom)=>{const r=el.getBoundingClientRect();return[(r.left+r.width/2-wr.left)/scale,((bottom?r.bottom:r.top)-wr.top)/scale]};for(const [id,el] of nodes){const n=map[id];if(!n)continue;for(const [pre,from] of nodes){if(pre===id||!String(n.prerequisites).split(/[^A-Z0-9-]+/).includes(pre))continue;const a=point(from,true),b=point(el,false),path=document.createElementNS(ns,'path'),mid=(a[1]+b[1])/2;path.setAttribute('d','M'+a.join(',')+' V'+mid+' H'+b[0]+' V'+b[1]);path.setAttribute('stroke',has(pre)?'#bfa166':'#70727e');if(String(n.prerequisites).includes('ANY('))path.setAttribute('stroke-dasharray','4 4');svg.append(path)}}world.prepend(svg)}
function wirePan(pane){if(pane.dataset.panReady)return;pane.dataset.panReady='1';let drag=null;pane.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0||e.target.closest('button,input,select,a'))return;drag=[e.clientX,e.clientY,pane.scrollLeft,pane.scrollTop];pane.setPointerCapture(e.pointerId)});pane.addEventListener('pointermove',e=>{if(drag){pane.scrollLeft=drag[2]+drag[0]-e.clientX;pane.scrollTop=drag[3]+drag[1]-e.clientY}});for(const evt of ['pointerup','pointercancel','lostpointercapture'])pane.addEventListener(evt,()=>drag=null)}
function draw(){labels();const pane=$('skillPane');if(!pane||!$('skillModal')?.classList.contains('active'))return;
 for(const [t,id] of [['tree','skillTreeTab'],['legacy','skillLegacyTab'],['skins','skillSkinsTab'],['backup','skillBackupTab'],['sandbox','skillSandboxTab']])$(id)?.classList.toggle('selected',tab===t);
 $('skillTierJump').hidden=tab!=='tree';$('skillDetails').innerHTML='';
 if(tab==='tree'){
 let html='<div class="fw-tree-toolbar"><button id="fwZoomOut">−</button><button id="fwZoomIn">+</button><button id="fwZoomFit">Fit</button><span>Drag empty space or scroll · choose an upgrade</span></div><div class="fw-tree-world" id="fwTreeWorld">';
 for(let i=0;i<5;i++){const t=i+1;if(!isTierOpen(t))continue;html+='<section class="fw-tier" id="fw-tier-'+t+'"><header class="fw-tier-header"><strong>'+tiers[i]+'</strong><span>Tier '+t+'</span></header><div class="fw-graph-anchor" data-graph-id="T'+t+'-ROOT">▣ '+tiers[i]+' entry</div><div class="fw-live-tree-branches">';
 const general=O.filter(n=>n.id.startsWith('O-'+t+'-G')||(/^O-(TW|SP)/.test(n.id)&&(n.prerequisites.includes('T'+t+'-ROOT')||t===3&&['O-SP05','O-SP06','O-SP07'].includes(n.id)||t===4&&n.id==='O-SP09')));
 html+='<div class="fw-live-tree-lane"><h4>General / tower / spells</h4>'+general.map(card).join('')+'</div>';
 for(const g of gates.filter(x=>x.tier===t)){const code=data.codes[data.heroes.indexOf(g.heroId)];html+='<div class="fw-live-tree-lane"><canvas class="fw-tree-hero-art" width="72" height="96" data-art-hero="'+g.heroId+'"></canvas><h4 class="fw-graph-anchor" data-graph-id="'+g.id+'">'+esc(g.name)+'</h4><p>'+Math.min(g.goal,p.kills[g.heroId]||0)+'/'+g.goal+' kills · +2 max coins</p>'+O.filter(n=>n.id.startsWith('O-'+t+'-'+code+'-')||n.id.startsWith('V2-')&&n.prerequisites.includes(g.id)).map(card).join('')+'</div>'}
 html+='</div>';if(t<5&&!isTierOpen(t+1))html+='<button data-gateway="'+t+'" '+(!available()||!has('T'+t+'-M1')||p.up<(p.resets>=t?0:data.gateways.up[t-1])?'disabled':'')+'>Open next tier · '+(p.resets>=t?0:data.gateways.up[t-1])+' UP · clear stage '+data.gateways.stages[t-1]+'</button>';html+='</section>'}
 pane.innerHTML=html+'</div>';const world=$('fwTreeWorld');let zoom=1;const apply=()=>{world.style.zoom=String(zoom);requestAnimationFrame(()=>drawLinks(world))};$('fwZoomIn').onclick=()=>{zoom=Math.min(1.6,zoom+.15);apply()};$('fwZoomOut').onclick=()=>{zoom=Math.max(.35,zoom-.15);apply()};$('fwZoomFit').onclick=()=>{zoom=Math.min(1,pane.clientWidth/Math.max(1,world.offsetWidth));apply()};
 pane.querySelectorAll('canvas[data-art-hero]').forEach(el=>window.FWPrototypeArt?.portrait(el,el.dataset.artHero,'Base',0,false,true));if(window.FWPrototypeArt){requestAnimationFrame(()=>drawLinks(world));wirePan(pane)}
 }else if(tab==='legacy'){pane.innerHTML='<h3>Permanent Legacy Tree</h3><p>120 permanent upgrades · unlock connected prerequisites.</p><button id="fwPrestige" '+(!available()||sandbox||p.runWins===0?'disabled':'')+'>Prestige · '+payout()+' Shards</button>'+ '<div class="fw-legacy-grid">'+[...new Set(L.map(n=>n.id.match(/^R-([A-Z]+)/)?.[1]||'Other'))].map(k=>'<section class="fw-live-tree-lane"><h4>'+esc(k)+' branch</h4>'+L.filter(n=>(n.id.match(/^R-([A-Z]+)/)?.[1]||'Other')===k).map(card).join('')+'</section>').join('')+'</div>'+(has('R-M20')?'<label>Commission next restock <select id="fwCommission"><option value="">None</option>'+p.discoveredHeroes.map(id=>'<option value="'+id+'" '+(id===p.merchantCommission?'selected':'')+'>'+esc(heroes.find(h=>h.id===id).name)+'</option>').join('')+'</select></label>':'');$('fwPrestige')?.addEventListener('click',()=>{if(prestige()){const el=$('skillPane');el.classList.add('fw-ritual-flash');setTimeout(()=>el.classList.remove('fw-ritual-flash'),900)}});$('fwCommission')?.addEventListener('change',e=>setCommission(e.target.value));
 }else if(tab==='skins'){
 const c=skinCollection(),enabled=c.available&&c.eligible>c.owned&&SK.cents(c.shards)>=100&&api?.state.mode==='prep'&&!api.state.testMode&&!sandbox&&!p.endless;
 const reason=!c.available?'Unlock after your third completed prestige.':!c.eligible?'Discover a hero by deploying them first.':c.owned===c.eligible?'All eligible skins collected. Discover more heroes to expand the pool.':'Common 60% · Epic 30% · Legendary 10% · duplicates refund 0.05 Shard.';
 pane.innerHTML='<div class="fw-collection-head"><div><h3>Hero Collection</h3><p>'+c.discovered.length+' / 15 heroes discovered · '+c.owned+' / '+c.eligible+' eligible skins</p></div><div class="fw-loot-box"><span class="fw-loot-chest">✦</span><button id="fwSkinBox" class="btn" '+(!enabled?'disabled':'')+'>Open skin loot box · 1 Shard</button><small>'+esc(reason)+'</small></div></div>'+(lastSkinReward?'<p role="status" style="color:'+lastSkinReward.skin.trim+'">'+esc(lastSkinReward.skin.heroName+' · '+lastSkinReward.skin.name+' ('+lastSkinReward.skin.rarity+')')+(lastSkinReward.duplicate?' · Duplicate — 0.05 Shard refunded':' · New skin!')+'</p>':'')+[0,1,2,3,4].map(i=>'<section class="fw-card-pool"><h3>'+tiers[i]+'</h3><div class="fw-hero-cards">'+heroes.slice(i*3,i*3+3).map(h=>{const seen=c.discovered.includes(h.id);return '<button class="fw-hero-card" data-profile="'+h.id+'" '+(!seen?'disabled':'')+' style="--rar:'+(seen?(window.FWPrototypeArt?.palette[h.rarity]||'#bfa166'):'#55555f')+'"><canvas width="72" height="96" data-art-hero="'+h.id+'" data-known="'+seen+'"></canvas><b>'+esc(seen?h.name:'Undiscovered')+'</b><small>'+esc(seen?h.rarity:'?')+'</small></button>'}).join('')+'</div></section>').join('');
 pane.querySelectorAll('canvas[data-art-hero]').forEach(el=>window.FWPrototypeArt?.portrait(el,el.dataset.artHero,'Base',0,false,el.dataset.known==='true'));
 pane.querySelectorAll('[data-profile]').forEach(el=>el.addEventListener('click',()=>{const h=api.heroes.find(x=>x.id===el.dataset.profile),g=gates.find(x=>x.heroId===h.id),t=api.tuning.heroes[h.id],d=$('skillDetails');d.innerHTML='<div class="fw-detail-header"><h3>'+esc(h.name)+'</h3><button id="fwProfileClose">Close</button></div><p>'+esc(h.role)+' · '+esc(h.rarity)+' · HP '+h.hp+' · damage '+h.damage+' · attacks/s '+h.speed+' · walk '+h.walk+'</p><p>Basic: '+esc(h.role||'See class rules')+' · Special: '+esc(t?.special?.name||'See class rules')+'</p><p>Class quest: '+Math.min(g.goal,p.kills[h.id]||0)+' / '+g.goal+' kills</p><div class="fw-skin-grid">'+c.skins.filter(x=>x.heroId===h.id).map(x=>'<div><canvas width="72" height="96" data-art-hero="'+h.id+'" data-skin="'+x.rarity+'" data-known="'+x.owned+'"></canvas><b>'+esc(x.name)+'</b><small>'+esc(x.rarity)+' · '+(x.owned?'Owned':'Locked')+' · '+x.multiplier+'× HP/damage</small></div>').join('')+'</div>';d.querySelectorAll('canvas').forEach(el=>window.FWPrototypeArt?.portrait(el,el.dataset.artHero,el.dataset.skin,0,false,el.dataset.known==='true'));$('fwProfileClose').onclick=()=>{d.innerHTML=''}}));

 $('fwSkinBox')?.addEventListener('click',buySkinBox);
 }else if(tab==='backup'){pane.innerHTML='<h3>Save and backup</h3><p>Save schema 2. Old purchases refunded on migration; original save retained locally.</p><button id="fwExport">Download backup</button><input id="fwImport" type="file" accept=".json,application/json"><p>'+esc(p.migration?JSON.stringify(p.migration):'No migration needed')+'</p>';$('fwExport')?.addEventListener('click',download);$('fwImport')?.addEventListener('change',async e=>{try{if(!available()||sandbox||!e.target.files[0])return;const q=normalizeBackup(await e.target.files[0].text());if(confirm('Replace progression with this backup?')){p=q;save();api.restart();resumeStage();recalc();draw()}}catch(err){api.log(String(err))}});
 }else{pane.innerHTML='<h3>Isolated skill sandbox</h3><p>Changes are not saved. Exit to restore original progression.</p><button id="fwSandboxStart">Start</button><button id="fwSandboxReset">Refund ordinary purchases</button><button id="fwSandboxExit">Exit</button>';$('fwSandboxStart')?.addEventListener('click',startSandbox);$('fwSandboxReset')?.addEventListener('click',resetSandboxTree);$('fwSandboxExit')?.addEventListener('click',endSandbox)}
 if(window.FWPrototypeArt){pane.querySelectorAll('[data-select-node]').forEach(b=>b.addEventListener('click',()=>showNode(b.dataset.selectNode)));const legacy=pane.querySelector('.fw-legacy-grid');if(legacy)requestAnimationFrame(()=>drawLinks(legacy))}
 pane.querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>purchase(b.dataset.buy)));pane.querySelectorAll('[data-gateway]').forEach(b=>b.addEventListener('click',()=>gateway(+b.dataset.gateway)));
}
function newGame(){if(!api||api.state.mode!=='prep'||api.state.testMode||sandbox)return false;try{localStorage.setItem(K+'-before-new-game',JSON.stringify(p))}catch{}p=fresh();save();api.restart();recalc();draw();return true}
function backupPayload(){return {game:'Fantasy Warriors',kind:'skilltree-save',schema:2,state:JSON.parse(JSON.stringify(sandbox||p))}}
function normalizeBackup(raw){const b=JSON.parse(raw);if(b.game!=='Fantasy Warriors'||b.kind!=='skilltree-save'||![1,2].includes(b.schema)||!b.state)throw Error('Incompatible backup');return normalize(b.state)}
function download(){const url=URL.createObjectURL(new Blob([JSON.stringify(backupPayload(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='Fantasy_Warriors_Save.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function startSandbox(){if(!available()||sandbox||p.endless)return false;sandbox=JSON.parse(JSON.stringify(p));draw();return true}
function resetSandboxTree(){if(!available()||!sandbox)return false;credit(p.nodes.reduce((n,id)=>n+map[id].cost,0));p.nodes=[];p.purchaseCosts={};recalc();draw();return true}
function endSandbox(){if(!sandbox)return false;p=sandbox;sandbox=null;api.restart();resumeStage();recalc();draw();return true}
function showQuest(heroId){const g=gates.find(g=>g.heroId===heroId);if(!g)return false;tab='tree';$('skillModal').classList.add('active');$('skillModal').hidden=false;draw();$('fw-tier-'+g.tier)?.scrollIntoView?.();return true}
function connect(opts){api=opts;initial=Object.fromEntries(api.heroes.map(h=>[h.id,{hp:h.hp,damage:h.damage,speed:h.speed,walk:h.walk}]));initialSpecials=Object.fromEntries(api.heroes.map(h=>[h.id,{...api.tuning.heroes[h.id].special}]));initialSummons={hound:{...api.hound},undead:{...api.undead}};recalc();for(const [t,id] of [['tree','skillTreeTab'],['legacy','skillLegacyTab'],['skins','skillSkinsTab'],['backup','skillBackupTab'],['sandbox','skillSandboxTab']])$(id)?.addEventListener('click',()=>{tab=t;draw()});$('openSkillTree')?.addEventListener('click',()=>{$('skillModal').classList.add('active');$('skillModal').hidden=false;draw()});$('closeSkillTree')?.addEventListener('click',()=>{$('skillModal').classList.remove('active');$('skillModal').hidden=true});$('skillTierJump')?.addEventListener('change',()=>{$('fw-tier-'+$('skillTierJump').value)?.scrollIntoView?.()});labels()}
function heroBonus(h,e){let bonus=0;if(has('O-2-G3')&&!h.firstBasicUsed){h.firstBasicUsed=true;bonus+=.5}if(has('R-G06')&&new Set(api.state.heroes.filter(a=>a.hp>0&&!a.summonKind).map(a=>a.base.id)).size>=3)bonus+=.15;
 if(e&&e.hp<e.maxHp*.25)bonus+=sum('lowEnemy',h.base.id);if(h.invisibleUntil>api.state.elapsed)bonus+=sum('smokeDamage',h.base.id);if(e?.boss||e?.elite)bonus+=sum('eliteBoss',h.base.id);return 1+bonus}
const tower=()=>({damage:B.towerFire.damage*(1+sum('towerDamage'))+sum('towerFlat'),cooldownSeconds:B.towerFire.cooldownSeconds/(1+sum('towerRate')),pierce:sum('pierce'),splash:sum('splash'),twin:sum('twin'),overload:!!sum('overload')});
window.FWSkillTree={newGame,endlessCheckpoint,endlessState,enterEndless,exitEndless,resumeEndless,endEndless,finishEndless,skinCollection,buySkinBox,drawSkin,prestigeCount,attempted,stealCoin,applyTheft,spellLoadout,setSpellLoadout,connect,has,isTierOpen,questProgress,purchase,gateway,check,merchantState,commitMerchant,buyMerchant:purchase,setCommission,points:()=>p.up,shards:()=>p.shards,shopSlots:()=>api?.state.shopSlots||3,recordKill,markStageAttempt,recordPack,recordWin,checkpointStage,markRestart,resumeStage,prestige,recalc,notify:draw,debug:()=>JSON.parse(JSON.stringify(p)),nodes:[...structural,...gates,...O],showQuest,backupPayload,normalizeBackup,startSandbox,resetSandboxTree,endSandbox,sandboxActive:()=>!!sandbox,rate:h=>1+sum('chargeRate',h.base.id),startCharge:()=>has('O-5-G5')?1:sum('chargeStart'),startShield:()=>sum('startShield'),startAttempt,scheduledKill,finishAttempt,tower,heroBonus,guardDamage:(h,d)=>d,rangeBonus:()=>1,legacyIncome:income,bearBasicDamage:()=>api.heroes.find(h=>h.id==='druid').damage*(1+sum('bearDamage','druid')),permanentDamageBonus:id=>p.legacyNodes.reduce((n,key)=>{const x=S[key];return n+(x?.kind==='damage'&&(x.key==null||x.key===id)?x.amount:0)},0),mageSplashDamage:()=>api.heroes.find(h=>h.id==='mage').damage};
})();
