/* DOM UI, shop presentation, wave tracker and battle report views. */
window.FWGameUI={create({state,refs,PACKS,HEROES,HERO_MAP,ENCOUNTERS,TUNING,SKILLS,regularCount,totalCount,encounter,chargeSeconds,isOriginalHero,nextSpawnInterval,NORMAL_SPAWN_INTERVAL,BOSS_AFTER_CLEAR_DELAY}){
const $=id=>document.getElementById(id),M=window.FWMerchant;
function updateFormation(){const groups=[];for(const h of state.heroes){let g=groups.find(g=>g.base.id===h.base.id);if(g)g.count++;else groups.push({base:h.base,count:1,charge:h.charge??0,activeUntil:Math.max(h.bearUntil||0,h.invisibleUntil||0,h.frenzyUntil||0,h.blessingUntil||0,h.shieldUntil||0,h.sanctuaryUntil||0),casts:h.casts||0})}
 refs.formation.innerHTML='';
 if(!groups.length){const e=document.createElement('div');e.className='empty-formation';e.textContent=state.mode==='battle'?'No heroes remain.':state.mode==='opening'?'Opening purchased packs…':state.testMode&&state.testQueue.length?state.testQueue.length+' test heroes queued to spawn when stage starts.':'Buy Recruit Packs or enable the separate Testing Shop.';refs.formation.append(e)}
 else for(const g of groups){const row=document.createElement('div');row.className='hero-row';row.style.setProperty('--hcolor',g.base.color);row.innerHTML=`<div class="hero-avatar">${g.base.glyph}</div><div class="hero-line"><b>${g.base.name}</b><small>${g.base.rarity} · ${g.base.role}</small><div class="ability-readout">${TUNING.heroes[g.base.id]?((TUNING.heroes[g.base.id].special.trigger==='unassigned')?'<span class="ability-undefined">Special TBD</span>':(TUNING.heroes[g.base.id].special.trigger==='onEnemyKill'?'<span class="cast-text">On enemy death · raised '+g.count+' active</span>':('<span>'+TUNING.heroes[g.base.id].special.name+'</span><span class="ability-meter"><i style="width:'+Math.round(100*g.charge/Math.max(.1,chargeSeconds(g)))+'%"></i></span><span class="'+(g.charge>=chargeSeconds(g)?'ability-ready':'')+'">'+(g.activeUntil>state.elapsed?'ACTIVE':g.charge>=chargeSeconds(g)?'READY':Math.ceil(Math.max(0,chargeSeconds(g)-g.charge))+'s')+'</span>'))):'<span class="cast-text">Summoned ally</span>'}</div></div><div class="hero-amount">×${g.count}</div>`;refs.formation.append(row)}
 refs.formationCount.textContent=state.heroes.length+' active · '+(state.testMode?state.testQueue.length+' test queued':'regular')
}
function updateTestingUI(){refs.testStatus.textContent=state.testMode?'ON · FREE':'OFF';refs.testStatus.style.color=state.testMode?'#92f2c9':'';refs.testToggle.textContent=state.testMode?'Disable testing mode':'Enable testing mode';refs.testToggle.setAttribute('aria-pressed',String(state.testMode));refs.testToggle.disabled=state.mode!=='prep';refs.testControls.classList.toggle('hidden',!state.testMode);refs.testStage.disabled=!state.testMode||state.mode!=='prep';refs.testQueueCount.textContent=state.testQueue.length+' queued';refs.clearTest.disabled=!state.testQueue.length||state.mode!=='prep';for(const b of refs.testGrid.querySelectorAll('button'))b.disabled=state.mode!=='prep';window.FWQuickStats?.sync()}

function waveStatus(){
 const total=regularCount(),dead=Math.min(total,state.scheduledDefeated||0),live=state.enemies.filter(e=>!e.boss&&e.hp>0).length,unspawned=Math.max(0,total-state.regularSpawned);
 const boss=state.enemies.find(e=>e.boss&&e.hp>0);
 const preparing=state.mode==='prep'||state.mode==='opening',finished=['clear','champion','over'].includes(state.mode);
 let phase='WAVE PREPARATION',next='Buy packs and start the stage';
 if(state.mode==='battle'){
   if(boss){phase=boss.faction?'HOLLOW LEGION '+state.factionSpawned+'/3':state.stage===10?'ELDRITCH PHASE '+boss.phase+'/3':'BOSS FIGHT';next=(boss.name||encounter().boss)+' has arrived';}
   else if(unspawned){const p=state.regularSpawned/total;phase=p<.30?'OPENING WAVE':p<.85?'ESCALATING WAVE':'FINAL RUSH';next='Next '+encounter().minion+': '+Math.max(0,nextSpawnInterval()-state.spawnClock).toFixed(1)+'s · '+unspawned+' left';}
   else if(live){phase=state.bossRewardPending?'KING SLIME SPLIT':'CLEAR THE WAVE';next=live+' '+encounter().minion+' remaining on field';}
   else{const faction=state.wavePlan?.faction&&state.factionSpawned<3;phase=faction?'LEGION INCOMING':'BOSS INCOMING';next=(faction?window.FWPrestigeEnemies.factionNames[state.factionSpawned]:encounter().boss)+' in '+Math.max(0,BOSS_AFTER_CLEAR_DELAY-state.bossWaitClock).toFixed(1)+'s';}
   if(state.paused)phase='PAUSED · '+phase;
 } else if(finished){phase=state.mode==='over'?'STAGE FAILED':'STAGE COMPLETE';next=state.mode==='over'?'Retry when ready':'Wave resolved';}
 return {total,dead,live,unspawned,boss,phase,next,progress:total?dead/total:0,up:state.upEarned||0};
}
function updateWaveTracker(){
 const w=waveStatus();
 refs.wavePhase.textContent=w.phase;
 refs.waveStats.textContent=w.dead+' / '+w.total+' '+encounter().minion+' defeated · '+w.live+' alive';
 refs.waveMeter.style.width=(Math.min(1,Math.max(0,w.progress))*100).toFixed(1)+'%';
 refs.waveNext.textContent=w.next;
 refs.waveUP.textContent='UP earned: '+Number(w.up.toFixed(2))+' · Shards: '+(state.shardsEarned||0);
 refs.waveBoss.hidden=!w.boss;
 if(w.boss){refs.waveBossName.textContent=w.boss.name||encounter().boss;refs.waveBossHP.textContent=Math.max(0,Number(w.boss.hp.toFixed(1)))+' / '+w.boss.maxHp+' HP';refs.waveBossMeter.style.width=(Math.max(0,Math.min(1,w.boss.hp/w.boss.maxHp))*100).toFixed(1)+'%';}
}
function battleSummary(){
 const alive=state.heroes.filter(h=>h.hp>0&&isOriginalHero(h)).length;
 const minutes=Math.floor(state.elapsed/60),seconds=String(Math.floor(state.elapsed%60)).padStart(2,'0');
 return {time:minutes+':'+seconds,kills:state.kills,total:totalCount(),up:Number((state.upEarned||0).toFixed(2)),shards:state.shardsEarned||0,drops:state.upDrops||0,casts:state.abilityCasts||0,heroesAlive:alive,heroesStarted:state.deployedHeroes||0,towerHp:Math.max(0,Number(state.towerHp.toFixed(1))),test:state.testMode};
}
function showBattleReport(){
 const data=battleSummary();state.lastReport=data;
 const rows=[['Time',data.time],['Defeated',data.kills+' / '+data.total],['UP earned',data.test?'TEST':String(data.up)],['Shards earned',data.test?'TEST':String(data.shards)],['Hero survivors',data.heroesAlive+' / '+data.heroesStarted],['Special casts',String(data.casts)],['Tower HP',String(data.towerHp)]];
 refs.battleReport.replaceChildren(...rows.map(([name,value])=>{const div=document.createElement('div'),small=document.createElement('span'),strong=document.createElement('b');small.textContent=name;strong.textContent=value;div.append(small,strong);return div;}));
 refs.battleReport.hidden=false;
}


function updateQuests(){
 const root=$('questRecruit'),other=$('questOther'),label=$('questCount');
 if(!root||!other||!label||!SKILLS?.questProgress)return;
 const quests=SKILLS.questProgress(),done=quests.filter(q=>q.rewarded).length,early=quests.filter(q=>q.tier===1);
 const signature=quests.map(q=>q.id+':'+q.kills+':'+Number(q.available)+':'+Number(q.rewarded)).join('|')+'|'+Number(state.testMode)+'|'+state.coinMax;
 if(state.questJournalSignature===signature)return;
 state.questJournalSignature=signature;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const row=q=>{
  const pct=100*Math.min(1,q.kills/q.goal),earned=q.rewarded,locked=!q.available;
  const status=earned?'✓ +2 permanently earned':locked?'Tier '+q.tier+' locked':'Earn +2 max coins';
  const stateClass=earned?'complete':locked?'sealed':'incomplete';
  return '<button type="button" class="quest-item '+stateClass+'" data-quest="'+escape(q.heroId)+'" aria-label="Open '+escape(q.className)+' kill quest in skill tree"><div class="quest-row"><div class="quest-identity"><strong>'+escape(q.className)+'</strong><small>'+escape(q.questName)+'</small></div><span class="quest-progress">'+Math.min(q.kills,q.goal)+' / '+q.goal+'</span></div>'+
   '<div class="quest-track" role="progressbar" aria-label="'+escape(q.className)+' minion kills" aria-valuemin="0" aria-valuemax="'+q.goal+'" aria-valuenow="'+Math.min(q.kills,q.goal)+'"><span style="width:'+pct.toFixed(1)+'%"></span></div>'+
   '<div class="quest-reward">'+escape(status)+'</div></button>';
 };
 root.innerHTML=early.map(row).join('');
 other.innerHTML=[2,3,4,5].map(t=>'<div class="quest-tier-heading">Tier '+t+' · '+escape(quests.find(q=>q.tier===t)?.tierName||'')+'</div>'+quests.filter(q=>q.tier===t).map(row).join('')).join('');
 label.textContent=done+' / '+quests.length;
 $('questSummary').textContent='Recruit quests: '+early.filter(q=>q.rewarded).length+'/3 complete · Total quest rewards: +'+(done*2)+' max coins · Current cap: '+state.coinMax;
 $('questModeHint').textContent=state.testMode?'TESTING MODE: free hero battles do not advance quests or award coins.':'Quest rewards are automatic, permanent and stack with shop/Legacy bonuses.';
}

function updateUI(){
 const offer=selectedStock(),offers=offeredPacks(),pack=offer?{name:M.label(offer),price:M.price(offer,state.merchantShop)}:null;
 refs.stage.textContent=String(state.stage).padStart(2,'0')+' / 10';
 $('encounterName').textContent=encounter().name;
 $('encounterUnits').textContent=encounter().minion+' → '+encounter().boss;
 $('encounterApproval').textContent=(encounter().approved?'SELECTED':'PROVISIONAL')+' · STAGE '+state.stage+'/10';
 if(refs.testStage&&state.testMode)refs.testStage.value=String(state.stage);
 refs.coins.textContent=state.coins+' / '+state.coinMax;
 refs.tower.textContent=String(Math.ceil(state.towerHp));
 $('towerMaxValue').textContent=String(Math.ceil(state.towerMax||100));
 refs.hp.style.width=(100*state.towerHp/(state.towerMax||100))+'%';
 refs.hp.style.background=state.towerHp/(state.towerMax||100)<.35?'linear-gradient(90deg,#ca5754,#ec997c)':'linear-gradient(90deg,#7abca1,#b4e0a6)';
 refs.specials.textContent=String(state.abilityCasts);
 refs.kills.textContent=String(state.kills);
 refs.total.textContent=String(totalCount());
 updateQuests();
 updateWaveTracker();
 const units=offers.filter(o=>o.sold).reduce((n,o)=>n+o.qty,0);
 refs.count.textContent=state.bought+' offers held · '+units+' hero slots';
 $('coinCapNote').textContent='Current maximum '+state.coinMax+' coins · +2 for every completed class kill quest.';
 const shopKey=JSON.stringify([offers,state.selectedSlot,state.mode,state.testMode,state.merchantShop.firstUsed]);
 if(state.shopCacheKey!==shopKey){
  state.shopCacheKey=shopKey;
  $('packOfferButtons').innerHTML=offers.map((o,i)=>'<button type="button" class="btn secondary compact" data-shop-slot="'+i+'" '+(state.mode!=='prep'||state.testMode||o.sold?'disabled':'')+' style="flex:1;min-width:120px;'+(state.selectedSlot===i&&!o.sold?'border-color:#f4d392;background:#344b4c;':'')+'">'+M.label(o)+' · '+(o.sold?o.paidPrice:M.price(o,state.merchantShop))+'◈'+(o.sold?' · SOLD':o.reserved?' · RESERVED':o.anchor?' · PROTECTED':'')+'</button>').join('');
  $('liveShopSlots').innerHTML=offers.map((o,i)=>'<div class="shop-slot '+(o.sold?'locked':'available')+'"><span>✦ Slot '+(i+1)+(o.sold?' · SOLD':o.anchor?' · PROTECTED':o.reserved?' · RESERVED':' · IN STOCK')+'</span><strong>'+M.label(o)+' · '+(o.sold?o.paidPrice:M.price(o,state.merchantShop))+' coins · '+o.qty+' hero'+(o.qty===1?'':'es')+'</strong></div>').join('');
  $('packProgress').innerHTML=PACKS.map((p,i)=>'<div class="pack-tier"><b>'+p.name+' Pack</b> · '+(SKILLS?.isTierOpen(i+1)?'UNLOCKED · '+p.price+' coins':'LOCKED · Tier '+(i+1)+' gateway')+'<small>'+p.pool.map((k,j)=>HERO_MAP[k].name+' '+Math.round(p.weights[j]*100)+'%').join(' · ')+' · eighth-draw rarest guarantee</small></div>').join('');
 }
 const shop=state.merchantShop,canRoll=offers.some(o=>!o.sold&&!o.anchor&&!o.reserved)&&(shop.free>0||(shop.paid>0&&state.coins>0));
 $('rotateShop').disabled=state.mode!=='prep'||state.testMode||!canRoll;
 $('rotateShop').textContent='↻ Reroll ('+shop.free+' free / '+shop.paid+' paid)';
 const reserve=$('reserveShop');if(reserve){reserve.disabled=state.mode!=='prep'||state.testMode||!offer||offer.sold||!!offer.anchor||!shop.flags.includes('R-M03');reserve.textContent=offer?.reserved?'Release reserve':'Reserve selected offer';}
  refs.shopTitle.textContent=state.mode==='prep'?'Hero Pack Shop':state.mode==='opening'?'Opening Packs':state.mode==='battle'?'Battle Underway':state.mode==='clear'?'Stage Complete':state.mode==='champion'?'Campaign Complete':'Stage Failed';
 refs.shopDescription.textContent=state.mode==='prep'?'Finite stock: Recruit and newest eligible pack protected. Purchases lock their slots; new stock arrives next attempt.':state.mode==='opening'?'Purchased heroes deploy automatically.':state.mode==='battle'?'Heroes defend automatically; coin budget refills after this attempt.':state.mode==='clear'?'All heroes leave; your next round starts at the current coin maximum.':state.mode==='champion'?'Ten stages complete.':'Stage failed: retry with new packs and restored coins.';
 refs.buy.disabled=state.mode!=='prep'||!pack||state.coins<pack.price||state.testMode;
 refs.buy.textContent=state.testMode?'Testing mode · free hero picker':state.mode==='prep'?(pack?(state.coins<pack.price?'Need '+pack.price+' coins':'◈ Buy '+pack.name+' · '+pack.price+' coins'):'All shop slots sold out'):'Shop closed during combat';
 refs.start.disabled=state.mode!=='prep'&&state.mode!=='clear';
 refs.start.textContent=state.mode==='prep'?'⚔ Start Stage '+state.stage:state.mode==='clear'?(state.testMode?'↻ Return to test prep':'➜ Prepare Stage '+(state.stage+1)):state.mode==='opening'?'✦ Opening packs':state.mode==='battle'?'⚔ Stage in progress':'↻ Retry Stage '+state.stage;
 refs.pause.disabled=state.mode!=='battle';refs.pause.textContent=state.paused?'▶ Resume':'Ⅱ Pause';
 refs.phase.textContent=state.mode==='prep'?(state.testMode?'TEST PREPARATION':'PREPARATION'):state.mode==='opening'?'PACK OPENING':state.mode==='battle'?(state.paused?'PAUSED':state.testMode?'TEST BATTLE':'IN BATTLE'):state.mode==='clear'?'STAGE CLEARED':state.mode==='champion'?'CAMPAIGN COMPLETE':'TOWER FALLEN';
 refs.dot.className='dot '+(state.mode==='battle'?'fighting':state.mode==='clear'?'finished':'');
 refs.battleDetail.textContent=state.mode==='battle'?('Spawned '+state.regularSpawned+'/'+regularCount()+' · '+encounter().boss+' '+(state.bossSpawned?'arrived':state.bossWaitClock>0?'incoming': 'waiting until all minions are defeated')):regularCount()+' '+encounter().minion+' · '+encounter().boss;
 refs.captionLeft.textContent=state.mode==='prep'?'Buy packs; heroes deploy at battle start':state.mode==='opening'?'Revealing your heroes':state.mode==='battle'?'Heroes defend the tower and trigger specials':state.mode==='clear'?'Stage cleared! All heroes leave.':state.mode==='champion'?'The ten-stage campaign is complete!':'Stage failed — retry available';
 refs.captionRight.textContent=state.testMode?'⚒ DEBUG · NON-PROGRESSION':state.mode==='battle'?'Boss at end · coins refill':'Automatic combat';
 updateFormation();updateTestingUI();
}

// Finite merchant stock. New inventory is generated once per stage attempt.
function eligiblePackIndices(){return PACKS.map((_,i)=>i).filter(i=>SKILLS?SKILLS.isTierOpen(i+1):i===0);}
function rollShop(){
 const m=SKILLS?.merchantState?.()||{flags:[],commission:null};
 state.merchantShop=M.roll({tiers:eligiblePackIndices(),slots:state.shopSlots,flags:m.flags,commission:m.commission,firstDiscount:m.firstDiscount});
 state.shopOffers=state.merchantShop.offers;
 state.merchantAttemptId=(globalThis.crypto?.randomUUID?.()||Date.now()+'-'+Math.random());
 state.selectedSlot=0;state.shopCacheKey='';return state.shopOffers;
}
function ensureShopStock(){if(!state.merchantShop||!Array.isArray(state.shopOffers)||!state.shopOffers.length)rollShop();}

function offeredPacks(){ensureShopStock();return state.shopOffers;}
function selectedStock(){
 const stock=offeredPacks();
 if(!stock[state.selectedSlot]||stock[state.selectedSlot].sold)state.selectedSlot=stock.findIndex(o=>!o.sold);
 return state.selectedSlot>=0?stock[state.selectedSlot]:null;
}
function selectedOffer(){return selectedStock()?.packIndex??0;}

return {updateUI,updateQuests,updateFormation,updateTestingUI,updateWaveTracker,showBattleReport,battleSummary,waveStatus,rollShop,offeredPacks,selectedStock,selectedOffer};
}};
