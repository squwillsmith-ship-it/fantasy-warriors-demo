/* DOM UI, shop presentation, wave tracker and battle report views. */
window.FWGameUI={create({state,refs,PACKS,HEROES,HERO_MAP,ENCOUNTERS,TUNING,SKILLS,regularCount,totalCount,encounter,chargeSeconds,isOriginalHero,NORMAL_SPAWN_INTERVAL,BOSS_AFTER_CLEAR_DELAY}){
const $=id=>document.getElementById(id);
function updateFormation(){const groups=[];for(const h of state.heroes){let g=groups.find(g=>g.base.id===h.base.id);if(g)g.count++;else groups.push({base:h.base,count:1,charge:h.charge??0,activeUntil:Math.max(h.bearUntil||0,h.invisibleUntil||0,h.frenzyUntil||0,h.blessingUntil||0,h.shieldUntil||0,h.sanctuaryUntil||0),casts:h.casts||0})}
 refs.formation.innerHTML='';
 if(!groups.length){const e=document.createElement('div');e.className='empty-formation';e.textContent=state.mode==='battle'?'No heroes remain.':state.mode==='opening'?'Opening purchased packs…':state.testMode&&state.testQueue.length?state.testQueue.length+' test heroes queued to spawn when stage starts.':'Buy Recruit Packs or enable the separate Testing Shop.';refs.formation.append(e)}
 else for(const g of groups){const row=document.createElement('div');row.className='hero-row';row.style.setProperty('--hcolor',g.base.color);row.innerHTML=`<div class="hero-avatar">${g.base.glyph}</div><div class="hero-line"><b>${g.base.name}</b><small>${g.base.rarity} · ${g.base.role}</small><div class="ability-readout">${TUNING.heroes[g.base.id]?((TUNING.heroes[g.base.id].special.trigger==='unassigned')?'<span class="ability-undefined">Special TBD</span>':(TUNING.heroes[g.base.id].special.trigger==='onEnemyKill'?'<span class="cast-text">On enemy death · raised '+g.count+' active</span>':('<span>'+TUNING.heroes[g.base.id].special.name+'</span><span class="ability-meter"><i style="width:'+Math.round(100*g.charge/Math.max(.1,chargeSeconds(g)))+'%"></i></span><span class="'+(g.charge>=chargeSeconds(g)?'ability-ready':'')+'">'+(g.activeUntil>state.elapsed?'ACTIVE':g.charge>=chargeSeconds(g)?'READY':Math.ceil(Math.max(0,chargeSeconds(g)-g.charge))+'s')+'</span>'))):'<span class="cast-text">Summoned ally</span>'}</div></div><div class="hero-amount">×${g.count}</div>`;refs.formation.append(row)}
 refs.formationCount.textContent=state.heroes.length+' active · '+(state.testMode?state.testQueue.length+' test queued':'regular')
}
function updateTestingUI(){refs.testStatus.textContent=state.testMode?'ON · FREE':'OFF';refs.testStatus.style.color=state.testMode?'#92f2c9':'';refs.testToggle.textContent=state.testMode?'Disable testing mode':'Enable testing mode';refs.testToggle.setAttribute('aria-pressed',String(state.testMode));refs.testToggle.disabled=state.mode!=='prep';refs.testControls.classList.toggle('hidden',!state.testMode);refs.testStage.disabled=!state.testMode||state.mode!=='prep';refs.testQueueCount.textContent=state.testQueue.length+' queued';refs.clearTest.disabled=!state.testQueue.length||state.mode!=='prep';for(const b of refs.testGrid.querySelectorAll('button'))b.disabled=state.mode!=='prep';window.FWQuickStats?.sync()}

function waveStatus(){
 const total=regularCount(),dead=Math.min(total,state.kills),live=state.enemies.filter(e=>!e.boss&&e.hp>0).length,unspawned=Math.max(0,total-state.regularSpawned);
 const boss=state.enemies.find(e=>e.boss&&e.hp>0);
 const preparing=state.mode==='prep'||state.mode==='opening',finished=['clear','champion','over'].includes(state.mode);
 let phase='WAVE PREPARATION',next='Buy packs and start the stage';
 if(state.mode==='battle'){
   if(boss){phase='BOSS FIGHT';next=encounter().boss+' has arrived';}
   else if(unspawned){phase='MINION WAVE';next='Next '+encounter().minion+': '+Math.max(0,NORMAL_SPAWN_INTERVAL-state.spawnClock).toFixed(1)+'s · '+unspawned+' yet to spawn';}
   else if(live){phase='CLEAR THE WAVE';next=live+' '+encounter().minion+' remaining on field';}
   else{phase='BOSS INCOMING';next=encounter().boss+' in '+Math.max(0,BOSS_AFTER_CLEAR_DELAY-state.bossWaitClock).toFixed(1)+'s';}
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
 refs.waveUP.textContent='UP earned: '+Number(w.up.toFixed(2));
 refs.waveBoss.hidden=!w.boss;
 if(w.boss){refs.waveBossName.textContent=encounter().boss;refs.waveBossHP.textContent=Math.max(0,Number(w.boss.hp.toFixed(1)))+' / '+w.boss.maxHp+' HP';refs.waveBossMeter.style.width=(Math.max(0,Math.min(1,w.boss.hp/w.boss.maxHp))*100).toFixed(1)+'%';}
}
function battleSummary(){
 const alive=state.heroes.filter(h=>h.hp>0&&isOriginalHero(h)).length;
 const minutes=Math.floor(state.elapsed/60),seconds=String(Math.floor(state.elapsed%60)).padStart(2,'0');
 return {time:minutes+':'+seconds,kills:state.kills,total:totalCount(),up:Number((state.upEarned||0).toFixed(2)),drops:state.upDrops||0,casts:state.abilityCasts||0,heroesAlive:alive,heroesStarted:state.deployedHeroes||0,towerHp:Math.max(0,Number(state.towerHp.toFixed(1))),test:state.testMode};
}
function showBattleReport(){
 const data=battleSummary();state.lastReport=data;
 const rows=[['Time',data.time],['Defeated',data.kills+' / '+data.total],['UP earned',data.test?'TEST':String(data.up)],['Hero survivors',data.heroesAlive+' / '+data.heroesStarted],['Special casts',String(data.casts)],['Tower HP',String(data.towerHp)]];
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
 const offer=selectedOffer(),pack=PACKS[offer],offers=offeredPacks();
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
 const packs=state.packQueue.length?state.packQueue.reduce((a,i)=>(a[PACKS[i].name]=(a[PACKS[i].name]||0)+1,a),{}):{};
 refs.count.textContent=state.bought+' packs held · '+(Object.entries(packs).map(([k,v])=>v+' '+k).join(' · ')||'1 hero each');
 $('coinCapNote').textContent='Current maximum '+state.coinMax+' coins · +2 for every completed class kill quest.';
 const shopKey=offers.join(',')+'|'+offer+'|'+state.shopSlots+'|'+state.mode+'|'+state.testMode;
 if(state.shopCacheKey!==shopKey){
  state.shopCacheKey=shopKey;
  $('packOfferButtons').innerHTML=offers.map(i=>'<button type="button" class="btn secondary compact" data-pack="'+i+'" '+(state.mode!=='prep'||state.testMode?'disabled':'')+' style="flex:1;min-width:120px;'+(offer===i?'border-color:#f4d392;background:#344b4c;':'')+'">'+PACKS[i].name+' · '+PACKS[i].price+'◈</button>').join('');
  $('liveShopSlots').innerHTML=Array.from({length:Math.min(5,state.shopSlots)},(_,idx)=>'<div class="shop-slot '+(idx<offers.length?'available':'locked')+'"><span>✦ Slot '+(idx+1)+'</span><strong>'+(idx<offers.length?PACKS[offers[idx]].name+' Pack · 1 hero':'No additional offer')+'</strong></div>').join('');
  $('packProgress').innerHTML=PACKS.map((p,i)=>'<div class="pack-tier"><b>'+p.name+' Pack</b> · '+(SKILLS?.isTierOpen(i+1)?'UNLOCKED · '+p.price+' coins':'LOCKED · Tier '+(i+1)+' gateway')+'<small>'+p.pool.map(k=>HERO_MAP[k].name).join(' · ')+'</small></div>').join('');
 }
 $('rotateShop').disabled=state.mode!=='prep'||state.testMode||PACKS.filter((_,i)=>SKILLS?.isTierOpen(i+1)).length<=offers.length;
 refs.shopTitle.textContent=state.mode==='prep'?'Hero Pack Shop':state.mode==='opening'?'Opening Packs':state.mode==='battle'?'Battle Underway':state.mode==='clear'?'Stage Complete':state.mode==='champion'?'Campaign Complete':'Stage Failed';
 refs.shopDescription.textContent=state.mode==='prep'?'Buy unlocked packs (1 random hero each). Shop prices and offer rotation for later tiers are provisional test values.':state.mode==='opening'?'One hero emerges from each purchased pack.':state.mode==='battle'?'Heroes defend automatically; coin budget refills after this attempt.':state.mode==='clear'?'All heroes leave; your next round starts at the current coin maximum.':state.mode==='champion'?'Ten stages complete.':'Stage failed: retry with new packs and restored coins.';
 refs.buy.disabled=state.mode!=='prep'||state.coins<pack.price||state.testMode;
 refs.buy.textContent=state.testMode?'Testing mode · free hero picker':state.mode==='prep'?(state.coins<pack.price?'Need '+pack.price+' coins':'◈ Buy '+pack.name+' Pack · '+pack.price+' coins'):'Shop closed during combat';
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

function offeredPacks(){const unlocked=PACKS.map((p,i)=>i).filter(i=>SKILLS?SKILLS.isTierOpen(i+1):i===0);const limit=Math.min(unlocked.length,Math.max(1,state.shopSlots||1));const offset=unlocked.length?state.shopPage%unlocked.length:0;return Array.from({length:limit},(_,i)=>unlocked[(offset+i)%unlocked.length]);}
function selectedOffer(){const offers=offeredPacks();if(!offers.includes(state.selectedPack))state.selectedPack=offers[0]??0;return state.selectedPack;}

return {updateUI,updateQuests,updateFormation,updateTestingUI,updateWaveTracker,showBattleReport,battleSummary,waveStatus,offeredPacks,selectedOffer};
}};
