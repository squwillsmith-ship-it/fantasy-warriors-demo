/* v1.16 skill graph runtime. Pending effects are never purchasable. */
(function(){'use strict';
const data=window.FW_SKILL_DATA,B=window.FWBalance.profile,M=window.FWMerchant;
const O=data.ordinary,L=data.legacy,S=data.supported,all=[...O,...L],map=Object.fromEntries(all.map(n=>[n.id,n]));
const tiers=M.data.packs.map(p=>p.name),heroes=M.data.heroes,gateId=h=>'T'+(h.pack+1)+'-'+data.codes[data.heroes.indexOf(h.id)]+'-GATE';
const gates=heroes.map(h=>({id:gateId(h),name:h.name+' kill challenge',heroId:h.id,kind:'gate',tier:h.pack+1,goal:data.gateGoals[h.id]}));
const structural=Array.from({length:5},(_,i)=>{const t=i+1;return [{id:'T'+t+'-ROOT',name:tiers[i]+' entry',kind:'root',tier:t},{id:'T'+t+'-M1',name:'Stage '+([1,3,5,7,10][i])+' cleared',kind:'milestone',tier:t},{id:'T'+t+'-EXIT',name:t===5?'Campaign apex':'Open '+tiers[t],kind:'exit',tier:t}] }).flat();
const K=document.body.classList.contains('lab-mode')?'fantasy-warriors-lab-skilltree-1.1':'fantasy-warriors-skilltree-1.1', $=id=>document.getElementById(id);
const fresh=()=>({treeSchema:2,up:0,shards:0,resets:0,nodes:[],legacyNodes:[],kills:{},packOpens:{},highestClear:0,runHighest:0,runWins:0,campaignStage:1,gateways:[],purchaseCosts:{},eligibleKillRemainder:0,knowledgeRemainder:0,attemptedStages:[],runClears:[],merchantPity:[0,0,0,0,0],merchantCommit:null,merchantCommission:null,discoveredHeroes:[],migration:null});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(v,hi=1e9)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=hi?v:0;
const integer=(v,hi)=>Math.floor(num(v,hi));
const ids=(a,allowed)=>Array.isArray(a)?[...new Set(a.filter(x=>allowed.includes(x)))]:[];
const validPity=a=>Array.isArray(a)&&a.length===5&&a.every(x=>Number.isInteger(x)&&x>=0&&x<=7)?a.slice():[0,0,0,0,0];
const uniqueInts=(a,max)=>Array.isArray(a)?[...new Set(a.filter(x=>Number.isInteger(x)&&x>=1&&x<=max))]:[];
function normalize(source){
 const q=fresh();if(!source||typeof source!=='object')return q;
 for(const k of ['up','shards'])q[k]=num(source[k]);
 for(const k of ['resets','runWins'])q[k]=integer(source[k],1000000);
 for(const k of ['highestClear','runHighest'])q[k]=integer(source[k],10);
 q.campaignStage=Math.max(1,integer(source.campaignStage??Math.min(10,q.runHighest+1),10));
 q.attemptedStages=uniqueInts(source.attemptedStages,10);
 q.runClears=source.treeSchema===2?uniqueInts(source.runClears,10):Array.from({length:q.runHighest},(_,i)=>i+1);
 q.gateways=uniqueInts(source.gateways,5).filter(t=>t>1);
 for(const h of heroes)q.kills[h.id]=integer(source.kills?.[h.id],1e7);
 for(let i=0;i<5;i++)q.packOpens[i]=integer(source.packOpens?.[i],1e7);
 q.eligibleKillRemainder=integer(source.eligibleKillRemainder,5);q.knowledgeRemainder=integer(source.knowledgeRemainder,14);
 q.merchantPity=validPity(source.merchantPity);q.merchantCommit=typeof source.merchantCommit==='string'?source.merchantCommit:null;
 q.discoveredHeroes=ids(source.discoveredHeroes,data.heroes);q.merchantCommission=q.discoveredHeroes.includes(source.merchantCommission)?source.merchantCommission:null;
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
  q.up+=up;q.shards+=shards;q.migration={from:'legacy-205',refundedUP:up,refundedShards:shards};
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
 if(!available()||(currency==='shards'&&sandbox))return {ok:false,reason:'Purchase during preparation before buying offers'};
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
 if(!api||api.state.testMode)return 0;let base=0,bonus=0;const scheduled=!boss&&flags.scheduled!==false;
 if(scheduled){p.eligibleKillRemainder++;if(p.eligibleKillRemainder>=6){p.eligibleKillRemainder-=6;base++}if(flags.elite)base++;
 if(has('O-4-G4')){p.knowledgeRemainder++;if(p.knowledgeRemainder>=15){p.knowledgeRemainder-=15;bonus++}}
 const g=gates.find(x=>x.heroId===heroId);if(g){const was=has(g.id);p.kills[heroId]=(p.kills[heroId]||0)+1;if(!was&&has(g.id)){if(has('R-E07'))bonus++;recalc();api.log(g.name+' complete: +2 max coins');}}}
 if(boss)base=5;const gain=credit(base*income()+bonus);save();labels();return gain;
}
function markStageAttempt(stage){if(!api||api.state.testMode)return false;const seen=p.attemptedStages.includes(stage);if(!seen){p.attemptedStages.push(stage);save()}return seen}
function recordPack(i){if(!api||api.state.testMode)return;p.packOpens[i]=(p.packOpens[i]||0)+1;save()}
function recordWin(stage){if(!api||api.state.testMode)return;if(!p.runClears.includes(stage)){p.runClears.push(stage);if(has('R-E06'))credit(1)}p.campaignStage=Math.min(10,stage+1);p.runWins++;p.highestClear=Math.max(p.highestClear,stage);p.runHighest=Math.max(p.runHighest,stage);save();labels()}
function startAttempt(){if(!api)return;api.state.treeStartUP=p.up;api.state.treeStartCoins=api.state.coins;api.state.treeScheduledKills=0;api.state.treeOutcomePaid=false}
function scheduledKill(){if(api)api.state.treeScheduledKills=(api.state.treeScheduledKills||0)+1}
function finishAttempt(won){if(!api||api.state.testMode||api.state.treeOutcomePaid)return;api.state.treeOutcomePaid=true;let bonus=0;if(has('R-E08')&&api.state.treeScheduledKills>=6)bonus+=Math.min(2,Math.floor(api.state.treeStartUP*.1));if(won&&has('R-E11'))bonus+=Math.min(2,Math.floor(api.state.treeStartCoins/2));credit(bonus);save();labels()}
function checkpointStage(stage){if(!api||api.state.testMode)return;p.campaignStage=Math.max(1,Math.min(10,stage));save()}
function markRestart(){p.campaignStage=1;save()}
function resumeStage(){if(api&&api.state.mode==='prep'&&!api.state.testMode){api.state.stage=p.campaignStage;api.refresh?.()}}
function payout(){return Math.max(1,Math.floor(1.35**(Math.max(1,p.runHighest)-1)+.5))}
function prestige(){if(!available()||sandbox||p.runWins===0||!confirm('Prestige for '+payout()+' Shards? Ordinary upgrades, gates and class kills reset.'))return false;
 const reward=payout(),q=fresh();Object.assign(q,{shards:p.shards+reward,resets:p.resets+1,legacyNodes:p.legacyNodes.slice(),highestClear:p.highestClear,attemptedStages:p.attemptedStages.slice(),discoveredHeroes:p.discoveredHeroes.slice(),merchantCommission:p.merchantCommission,migration:p.migration,up:has('R-E03')?2:0});p=q;save();api.restart();recalc();draw();return true}
function merchantState(){return {flags:p.legacyNodes.filter(id=>/^R-M\d\d$/.test(id)),pity:validPity(p.merchantPity),lastCommit:p.merchantCommit,commission:p.merchantCommission,discovered:p.discoveredHeroes.slice(),firstDiscount:has('O-2-G5')}}
function commitMerchant(id,plan){if(!api||api.state.testMode||typeof id!=='string'||id===p.merchantCommit)return false;p.merchantPity=validPity(plan.pity);p.merchantCommit=id;p.discoveredHeroes=ids([...p.discoveredHeroes,...plan.heroes],data.heroes);for(let i=0;i<5;i++)p.packOpens[i]=(p.packOpens[i]||0)+(plan.packOpens[i]||0);save();labels();return true}
function setCommission(id){if(!available()||sandbox||!has('R-M20')||(id&&!p.discoveredHeroes.includes(id)))return false;p.merchantCommission=id||null;save();return true}
function labels(){const a=$('skillBalance'),b=$('skillMeta');if(a)a.textContent=p.up.toFixed(2)+' UP · '+p.shards+' Shards';if(b)b.textContent=p.resets+' resets · '+p.nodes.length+'/'+O.length+' ordinary · '+p.legacyNodes.length+'/'+L.length+' Legacy'}
function card(n){const c=check(n.id);return '<div class="fw-perk"><div class="fw-perk-body"><b>'+esc(n.name)+'</b><small>'+esc(n.effect)+'</small><span>'+esc(has(n.id)?'Owned':c.ok?'Available':c.reason)+'</span></div><button type="button" data-buy="'+n.id+'" '+(!c.ok?'disabled':'')+'>'+ (has(n.id)?'OWNED':n.cost+(n.id.startsWith('R-')?' ◈':' UP'))+'</button></div>'}
function draw(){labels();const pane=$('skillPane');if(!pane||!$('skillModal')?.classList.contains('active'))return;
 for(const [t,id] of [['tree','skillTreeTab'],['legacy','skillLegacyTab'],['backup','skillBackupTab'],['sandbox','skillSandboxTab']])$(id)?.classList.toggle('selected',tab===t);
 $('skillTierJump').hidden=tab!=='tree';$('skillDetails').innerHTML='';
 if(tab==='tree'){
 let html='<p>Canonical ordinary tree · 228 upgrades. Pending effects are locked until implemented.</p>';
 for(let i=0;i<5;i++){const t=i+1;html+='<section id="fw-tier-'+t+'"><h3>'+tiers[i]+'</h3>';if(!isTierOpen(t)){html+='<p>Locked: activate the previous tier gateway.</p></section>';continue}
 for(const g of gates.filter(x=>x.tier===t)){html+='<p><b>'+esc(g.name)+'</b> '+Math.min(g.goal,p.kills[g.heroId]||0)+'/'+g.goal+' · +2 maximum coins</p>';const code=data.codes[data.heroes.indexOf(g.heroId)];for(const n of O.filter(n=>n.id.startsWith('O-'+t+'-'+code+'-')||n.id.startsWith('V2-')&&n.prerequisites.includes(g.id)))html+=card(n)}
 for(const n of O.filter(n=>n.id.startsWith('O-'+t+'-G')||(/^O-(TW|SP)/.test(n.id)&&n.prerequisites.includes('T'+t+'-ROOT'))))html+=card(n);
 if(t<5)html+='<button data-gateway="'+t+'" '+(!available()||!has('T'+t+'-M1')||isTierOpen(t+1)||p.up<(p.resets>=t?0:data.gateways.up[t-1])?'disabled':'')+'>Open '+tiers[t]+' · '+(p.resets>=t?0:data.gateways.up[t-1])+' UP · clear stage '+data.gateways.stages[t-1]+'</button>';
 html+='</section>'}pane.innerHTML=html;
 }else if(tab==='legacy'){pane.innerHTML='<h3>Permanent Legacy Tree</h3><p>120 nodes · connected progression · pending effects are locked.</p><button id="fwPrestige" '+(!available()||sandbox||p.runWins===0?'disabled':'')+'>Prestige · '+payout()+' Shards</button>'+L.filter(n=>has(n.id)||requirements(n)).map(card).join('')+(has('R-M20')?'<label>Commission next restock <select id="fwCommission"><option value="">None</option>'+p.discoveredHeroes.map(id=>'<option value="'+id+'" '+(id===p.merchantCommission?'selected':'')+'>'+esc(heroes.find(h=>h.id===id).name)+'</option>').join('')+'</select></label>':'');$('fwPrestige')?.addEventListener('click',prestige);$('fwCommission')?.addEventListener('change',e=>setCommission(e.target.value));
 }else if(tab==='backup'){pane.innerHTML='<h3>Save and backup</h3><p>Save schema 2. Old purchases refunded on migration; original save retained locally.</p><button id="fwExport">Download backup</button><input id="fwImport" type="file" accept=".json,application/json"><p>'+esc(p.migration?JSON.stringify(p.migration):'No migration needed')+'</p>';$('fwExport')?.addEventListener('click',download);$('fwImport')?.addEventListener('change',async e=>{try{if(!available()||sandbox||!e.target.files[0])return;const q=normalizeBackup(await e.target.files[0].text());if(confirm('Replace progression with this backup?')){p=q;save();api.restart();resumeStage();recalc();draw()}}catch(err){api.log(String(err))}});
 }else{pane.innerHTML='<h3>Isolated skill sandbox</h3><p>Changes are not saved. Exit to restore original progression.</p><button id="fwSandboxStart">Start</button><button id="fwSandboxReset">Refund ordinary purchases</button><button id="fwSandboxExit">Exit</button>';$('fwSandboxStart')?.addEventListener('click',startSandbox);$('fwSandboxReset')?.addEventListener('click',resetSandboxTree);$('fwSandboxExit')?.addEventListener('click',endSandbox)}
 pane.querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>purchase(b.dataset.buy)));pane.querySelectorAll('[data-gateway]').forEach(b=>b.addEventListener('click',()=>gateway(+b.dataset.gateway)));
}
function backupPayload(){return {game:'Fantasy Warriors',kind:'skilltree-save',schema:2,state:JSON.parse(JSON.stringify(sandbox||p))}}
function normalizeBackup(raw){const b=JSON.parse(raw);if(b.game!=='Fantasy Warriors'||b.kind!=='skilltree-save'||![1,2].includes(b.schema)||!b.state)throw Error('Incompatible backup');return normalize(b.state)}
function download(){const url=URL.createObjectURL(new Blob([JSON.stringify(backupPayload(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='Fantasy_Warriors_Save.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function startSandbox(){if(!available()||sandbox)return false;sandbox=JSON.parse(JSON.stringify(p));draw();return true}
function resetSandboxTree(){if(!available()||!sandbox)return false;credit(p.nodes.reduce((n,id)=>n+map[id].cost,0));p.nodes=[];p.purchaseCosts={};recalc();draw();return true}
function endSandbox(){if(!sandbox)return false;p=sandbox;sandbox=null;api.restart();resumeStage();recalc();draw();return true}
function showQuest(heroId){const g=gates.find(g=>g.heroId===heroId);if(!g)return false;tab='tree';$('skillModal').classList.add('active');$('skillModal').hidden=false;draw();$('fw-tier-'+g.tier)?.scrollIntoView?.();return true}
function connect(opts){api=opts;initial=Object.fromEntries(api.heroes.map(h=>[h.id,{hp:h.hp,damage:h.damage,speed:h.speed,walk:h.walk}]));initialSpecials=Object.fromEntries(api.heroes.map(h=>[h.id,{...api.tuning.heroes[h.id].special}]));initialSummons={hound:{...api.hound},undead:{...api.undead}};recalc();for(const [t,id] of [['tree','skillTreeTab'],['legacy','skillLegacyTab'],['backup','skillBackupTab'],['sandbox','skillSandboxTab']])$(id)?.addEventListener('click',()=>{tab=t;draw()});$('openSkillTree')?.addEventListener('click',()=>{$('skillModal').classList.add('active');$('skillModal').hidden=false;draw()});$('closeSkillTree')?.addEventListener('click',()=>{$('skillModal').classList.remove('active');$('skillModal').hidden=true});$('skillTierJump')?.addEventListener('change',()=>{$('fw-tier-'+$('skillTierJump').value)?.scrollIntoView?.()});labels()}
function heroBonus(h,e){let bonus=0;if(has('O-2-G3')&&!h.firstBasicUsed){h.firstBasicUsed=true;bonus+=.5}if(has('R-G06')&&new Set(api.state.heroes.filter(a=>a.hp>0&&!a.summonKind).map(a=>a.base.id)).size>=3)bonus+=.15;
 if(e&&e.hp<e.maxHp*.25)bonus+=sum('lowEnemy',h.base.id);if(h.invisibleUntil>api.state.elapsed)bonus+=sum('smokeDamage',h.base.id);if(e?.boss||e?.elite)bonus+=sum('eliteBoss',h.base.id);return 1+bonus}
const tower=()=>({damage:B.towerFire.damage*(1+sum('towerDamage'))+sum('towerFlat'),cooldownSeconds:B.towerFire.cooldownSeconds/(1+sum('towerRate')),pierce:sum('pierce'),splash:sum('splash'),twin:sum('twin'),overload:!!sum('overload')});
window.FWSkillTree={connect,has,isTierOpen,questProgress,purchase,gateway,check,merchantState,commitMerchant,buyMerchant:purchase,setCommission,points:()=>p.up,shards:()=>p.shards,shopSlots:()=>api?.state.shopSlots||3,recordKill,markStageAttempt,recordPack,recordWin,checkpointStage,markRestart,resumeStage,prestige,recalc,notify:draw,debug:()=>JSON.parse(JSON.stringify(p)),nodes:[...structural,...gates,...O],showQuest,backupPayload,normalizeBackup,startSandbox,resetSandboxTree,endSandbox,sandboxActive:()=>!!sandbox,rate:h=>1+sum('chargeRate',h.base.id),startCharge:()=>has('O-5-G5')?1:sum('chargeStart'),startShield:()=>sum('startShield'),startAttempt,scheduledKill,finishAttempt,tower,heroBonus,guardDamage:(h,d)=>d,rangeBonus:()=>1,legacyIncome:income,bearBasicDamage:()=>api.heroes.find(h=>h.id==='druid').damage*(1+sum('bearDamage','druid')),permanentDamageBonus:id=>p.legacyNodes.reduce((n,key)=>{const x=S[key];return n+(x?.kind==='damage'&&(x.key==null||x.key===id)?x.amount:0)},0),mageSplashDamage:()=>api.heroes.find(h=>h.id==='mage').damage};
})();
