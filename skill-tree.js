/* Fantasy Warriors · 205-node skill tree runtime · test-balance values explicitly provisional. */
(function(){
'use strict';
const data=window.FW_SKILL_DATA;
if(!data||!Array.isArray(data.nodes)||data.nodes.length!==205){console.error('Missing full skill-tree data');return;}
const nodeMap=Object.fromEntries(data.nodes.map(n=>[n.id,n]));
const classIds=[['knight','archer','mage'],['hunter','barbarian','rogue'],['paladin','nun','priest'],['shaman','druid','warlock'],['beastmaster','necromancer','dragonkin']];
const gatePrices=[28,48,75,110];
const legacyPerks=[
 {key:'vitality',name:'Ancestral Vitality',icon:'♥',description:'Permanent +8% base hero HP per rank.',max:6,cost:1},
 {key:'strength',name:'Ancestral Arms',icon:'⚔',description:'Permanent +8% basic hero damage per rank.',max:6,cost:1},
 {key:'insight',name:'Mastery Insight',icon:'✧',description:'Permanent +25% ordinary Upgrade Point income per rank.',max:6,cost:1},
 {key:'treasury',name:'Royal Treasury',icon:'◈',description:'Permanent +2 to round coin maximum per rank.',max:4,cost:2},
 {key:'merchant',name:'Market Charter',icon:'▤',description:'Permanent +1 shop offer slot per rank.',max:3,cost:3}
];
const K='fantasy-warriors-skilltree-1.1';
const defaultSave=()=>({up:0,upRemainder:0,nodes:[],kills:{},packOpens:{},highestClear:0,runHighest:0,runWins:0,campaignStage:1,tierWins:{},gateways:[],resets:0,shards:0,legacy:{},stats:{}}); 
function load(){try{const p=JSON.parse(localStorage.getItem(K));if(p&&Array.isArray(p.nodes)){const migrated=Object.assign(defaultSave(),p);if(!Number.isInteger(p.campaignStage))migrated.campaignStage=Math.max(1,Math.min(10,1+Number(p.runHighest||0)));return migrated;}}catch(e){}return defaultSave();}
let p=load(),api=null,active='tree',selected='T1-ROOT',initial=null,initialSpecials=null,initialSummons=null;
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(K,JSON.stringify(p));}catch(e){}}
function has(n){const node=typeof n==='string'?nodeMap[n]:n;if(!node)return false;
 if(node.kind==='root')return isTierOpen(node.tier);
 if(node.kind==='milestone')return isTierOpen(node.tier)&&!!p.tierWins[node.tier];
 if(node.kind==='gate')return isTierOpen(node.tier)&&(p.kills[classIds[node.tier-1][node.heroIndex]]||0)>=node.goal;
 if(node.kind==='exit')return node.tier===5?Boolean(p.highestClear>=10&&p.nodes.includes(node.id)):isTierOpen(node.tier+1);
 return p.nodes.includes(node.id);
}
function isTierOpen(t){return t===1||p.gateways.includes(t);}
function progressGate(){let changed=false;for(let t=1;t<5;t++)if(isTierOpen(t)&&p.resets>=t&&!isTierOpen(t+1)){p.gateways.push(t+1);changed=true;}if(changed)save();}
function affordability(node){if(!isTierOpen(node.tier))return {ok:false,reason:'Unlock '+data.tiers[node.tier-1]+' tier first'};
 if(has(node))return {ok:false,reason:'Unlocked'};
 if(node.kind==='root'||node.kind==='milestone'||node.kind==='gate')return {ok:false,reason:'Automatic task or milestone'};
 if(node.kind==='exit'){if(node.tier===5){return p.highestClear>=10?{ok:true,cost:0}:{ok:false,reason:'Clear Stage 10'};}
  if(!has('T'+node.tier+'-M1'))return {ok:false,reason:'Complete this tier’s mastery milestone first'};
  const cost=gatePrices[node.tier-1];return p.up>=cost?{ok:true,cost}:{ok:false,reason:'Need '+cost+' Upgrade Points (or qualify through voluntary prestige)',cost};}
 for(const id of node.requires){if(!has(id))return {ok:false,reason:'Requires '+(nodeMap[id]?.name||id)};}
 if(node.packTask){const count=p.packOpens[node.tier-1]||0;if(count<node.packTask)return {ok:false,reason:'Open '+node.packTask+' '+data.tiers[node.tier-1]+' Packs ('+count+'/'+node.packTask+')'};}
 return p.up>=node.cost?{ok:true,cost:node.cost}:{ok:false,reason:'Need '+node.cost+' Upgrade Points',cost:node.cost};
}
function statPercent(id){if(!has(id))return 0;const m=nodeMap[id]?.description.match(/\+(\d+)%/);return m?Number(m[1])/100:0;}
function rank(k){return Math.max(0,Math.min(20,Number(p.legacy[k]||0)));}
function owns(id){return has(id);}
function heroCode(t,index){return ['K','A','MG','H','B','R','P','N','PR','S','D','W','BM','NE','DR'][(t-1)*3+index];}
function specialRate(hero){const heroId=typeof hero==='string'?hero:hero?.base?.id;const found=api?.heroes.find(h=>h.id===heroId);if(!found)return 1;const t=found.pack+1,code=heroCode(t,classIds[t-1].indexOf(heroId));let rate=1;
 if(owns('T4-G02')&&t===4)rate+=.35;
 if(heroId==='archer'&&owns('T1-A-S05'))rate+=.35;
 if(heroId==='rogue'&&owns('T2-R-S05'))rate+=.35;
 if(heroId==='dragonkin'&&typeof hero==='object'&&owns('T5-DR-T05')&&hero.hp<=hero.maxHp*.35&&!hero.heartOfDragonUsed)rate+=.55;
 return rate;
}
function generalBonus(t,name){return owns('T'+t+'-'+name);}
function getProposedEffect(name,fallback){return fallback;}
const specialStatFields={
 knight:['bashRadius','bashStunSeconds'],
 archer:['volleyRadius',null],
 mage:[null,'chainJumpRange'],
 hunter:[null,'trapRadius'],
 barbarian:[null,'frenzyAttackSpeedMultiplier'],
 rogue:['invisibilityDurationSeconds',null],
 paladin:[null,'shieldAmount'],
 nun:[null,'sanctuaryRadius'],
 priest:['blessingRadius','blessingDamageBonus'],
 shaman:[null,'totemHealth'],
 druid:[null,'bearFormDurationSeconds'],
 warlock:[null,'siphonHealAmount'],
 beastmaster:['houndHealth','houndDamage'],
 necromancer:['beamMaxRampMultiplier','undeadHealth'],
 dragonkin:[null,'breathConeDegrees']
};
function recalc(){
 if(!api)return;
 const previousMax=api.state.coinMax||12;
 const priorTowerMax=api.state.towerMax||100;
 const maxTower=100*(1+(generalBonus(1,'G01')?.35:0)+(generalBonus(3,'G01')?.40:0));
 api.state.towerMax=Number(maxTower.toFixed(3));
 if(api.state.mode==='prep'&&api.state.towerHp>=priorTowerMax-.001)api.state.towerHp=api.state.towerMax;
 else api.state.towerHp=Math.min(api.state.towerMax,api.state.towerHp);
 const cap=12+(generalBonus(1,'G04')?4:0)+(generalBonus(2,'G04')?3:0)+(generalBonus(4,'G05')?4:0)+(generalBonus(5,'G05')?5:0)+2*rank('treasury');
 api.state.coinMax=cap;api.state.shopSlots=1+(generalBonus(1,'G05')?1:0)+(generalBonus(2,'G05')?1:0)+(generalBonus(3,'G05')?1:0)+rank('merchant');
 if(api.state.mode==='prep'&&api.state.bought===0&&api.state.coins===previousMax)api.state.coins=cap;
 for(const h of api.heroes){
  const orig=initial[h.id],t=h.pack+1,heroIdx=classIds[t-1].indexOf(h.id),code=heroCode(t,heroIdx);
  const path='T'+t+'-'+code+'-S';
  const hpPct=statPercent(path+'01') + rank('vitality')*.08 +
    (t===1&&generalBonus(1,'G02')?.30:0)+(t===2&&generalBonus(2,'G01')?.35:0)+(t===3&&generalBonus(3,'G02')?.35:0)+(t===4&&generalBonus(4,'G01')?.35:0)+(t===5&&generalBonus(5,'G01')?.45:0);
  const damagePct=(h.id!=='necromancer'?statPercent(path+'02'):statPercent(path+'02'))+rank('strength')*.08+(t===4&&generalBonus(4,'G04')?.35:0);
  const speedPct=(h.id!=='necromancer'?statPercent(path+'03'):0);
  h.hp=Number((orig.hp*(1+hpPct)).toFixed(3));h.damage=Number((orig.damage*(1+damagePct)).toFixed(3));
  h.speed=Number((orig.speed*(1+speedPct)).toFixed(5));h.walk=orig.walk;
  const spec=api.tuning.heroes[h.id].special,base=initialSpecials[h.id];
  for(const key of Object.keys(base))spec[key]=base[key];
  const fields=specialStatFields[h.id];for(let k=0;k<2;k++){
   const key=fields[k],pct=statPercent(path+'0'+(k+4));
   if(key&&pct&&typeof base[key]==='number'){spec[key]=Number((base[key]*(1+pct)).toFixed(4));}
  }
  if(h.id==='necromancer'){
   spec.beamBaseDamageRate=h.damage*h.speed;
   if(owns('T5-NE-S03'))spec.beamRampSeconds=base.beamRampSeconds/1.35;
  }
 }
 const hound=api.hound,undead=api.undead,hm=1+(owns('T5-BM-S04')?.5:0)+(owns('T5-G03')?.4:0),um=1+(owns('T5-NE-S05')?.5:0)+(owns('T5-G03')?.4:0);
 hound.hp=Number((initialSummons.hound.hp*hm).toFixed(3));hound.damage=Number((initialSummons.hound.damage*(1+(owns('T5-BM-S05')?.45:0))).toFixed(3));
 undead.hp=Number((initialSummons.undead.hp*um).toFixed(3));
 api.tuning.heroes.beastmaster.special.houndHealth=hound.hp;api.tuning.heroes.beastmaster.special.houndDamage=hound.damage;
 api.tuning.heroes.necromancer.special.undeadHealth=undead.hp;
 api.tuning.heroes.necromancer.special.beamBaseDamageRate=api.heroes.find(h=>h.id==='necromancer').damage*api.heroes.find(h=>h.id==='necromancer').speed;
 if(api.refresh)api.refresh();
}
function purchase(id){const n=nodeMap[id];if(!n||!api||api.state.mode!=='prep'||api.state.testMode)return;
 const check=affordability(n);if(!check.ok)return;
 if(n.kind==='exit'&&n.tier<5){p.up-=check.cost;p.gateways.push(n.tier+1);p.gateways=[...new Set(p.gateways)].sort();api.log('Unlocked '+data.tiers[n.tier]+' Tier (test gateway price).');}
 else{p.up-=check.cost;p.nodes.push(id);api.log(n.name+' purchased ('+check.cost+' UP).');}
 save();recalc();draw();updateLabels();
}
function addUP(amount){const gain=Number((Math.max(0,amount)*(1+rank('insight')*.25)).toFixed(2));p.up=Number((p.up+gain).toFixed(2));}
function recordKill(heroId){if(!api||api.state.testMode)return;
 if(heroId&&classIds.some(a=>a.includes(heroId)))p.kills[heroId]=(p.kills[heroId]||0)+1;
 p.upRemainder=(p.upRemainder||0)+1;
 if(p.upRemainder>=5){const count=Math.floor(p.upRemainder/5);p.upRemainder%=5;addUP(count);}
 save();updateLabels();
}
function recordPack(packIndex){if(!api||api.state.testMode)return;p.packOpens[packIndex]=(p.packOpens[packIndex]||0)+1;save();updateLabels();}
function recordWin(stage){if(!api||api.state.testMode)return;p.campaignStage=Math.min(10,Math.max(1,stage+1));addUP(6);p.runWins++;p.highestClear=Math.max(p.highestClear,stage);p.runHighest=Math.max(p.runHighest||0,stage);
 for(let t=1;t<=5;t++)if(isTierOpen(t))p.tierWins[t]=(p.tierWins[t]||0)+1;
 save();updateLabels();
}
function checkpointStage(stage){if(!api||api.state.testMode)return;p.campaignStage=Math.max(1,Math.min(10,Number(stage)||1));save();}
function markRestart(){p.campaignStage=1;save();}
function resumeStage(){if(!api||api.state.mode!=='prep'||api.state.testMode)return;api.state.stage=Math.max(1,Math.min(10,Number(p.campaignStage)||1));api.refresh?.();}
function notify(){if($('skillModal')?.classList.contains('active'))draw();updateLabels();}
function prestige(){
 if(!api||api.state.mode!=='prep'||api.state.testMode||p.runWins===0)return;
 const reward=Math.max(1,Math.floor(Math.max(1,p.runHighest||0)/2));
 if(!confirm('Voluntarily reset stage and ordinary upgrades for '+reward+' permanent Legacy Shards? Earned class kills, pack quests, and permanent tier gateways are kept.'))return;
 p.resets++;p.shards+=reward;p.up=0;p.upRemainder=0;p.nodes=[];p.tierWins={};p.runWins=0;p.runHighest=0;p.campaignStage=1;
 progressGate();save();api.restart();recalc();draw();updateLabels();api.log('Prestige '+p.resets+': +'+reward+' permanent Shards.');
}
function buyLegacy(key){if(!api||api.state.mode!=='prep'||api.state.testMode)return;const def=legacyPerks.find(x=>x.key===key);if(!def)return;const level=rank(key),cost=def.cost+level;if(level>=def.max||p.shards<cost)return;p.shards-=cost;p.legacy[key]=level+1;save();recalc();draw();updateLabels();}
function stateFor(n){if(has(n))return 'owned';if(!isTierOpen(n.tier))return 'sealed';if(n.kind==='gate')return 'quest';
 const c=affordability(n);return c.ok?'ready':'locked';
}
function nodeMark(n){return n.kind==='gate'?'⚔':n.kind==='stat'?'✚':n.kind==='technique'?'✦':n.kind==='general'?'◆':n.kind==='exit'?'⬡':n.kind==='root'?'♜':'★';}
function nodeButton(n){const state=stateFor(n);const requirement=n.kind==='gate'?((p.kills[classIds[n.tier-1][n.heroIndex]]||0)+'/'+n.goal+' kills'):n.kind==='exit'?(n.tier===5?'Apex':gatePrices[n.tier-1]+' UP / prestige'):n.cost?n.cost+' UP':'FREE';
 return '<button type="button" class="fw-node fw-'+state+' fw-'+n.kind+'" data-node="'+escapeHTML(n.id)+'" aria-label="'+escapeHTML(n.name)+'; '+state+'"><span class="fw-node-symbol">'+nodeMark(n)+'</span><span class="fw-node-name">'+escapeHTML(n.name.replace(/ \((PROPOSED|DRAFT)\)/gi,''))+'</span><span class="fw-node-cost">'+(state==='owned'?'✓ Unlocked':escapeHTML(requirement))+'</span></button>';
}
function lane(t,code,i){
 const all=data.nodes.filter(n=>n.tier===t&&n.lane===code);const gate=all.find(n=>n.kind==='gate');
 const stats=all.filter(n=>n.kind==='stat').sort((a,b)=>a.id.localeCompare(b.id)),tech=all.filter(n=>n.kind==='technique').sort((a,b)=>a.id.localeCompare(b.id));
 const hero=data.classes[t-1][i];
 return '<div class="fw-hero-lane"><div class="fw-lane-title"><span>'+escapeHTML(hero)+'</span><small>Challenge → split paths</small></div>'+nodeButton(gate)+'<div class="fw-split"><div class="fw-subbranch"><span>STATS</span>'+stats.map(nodeButton).join('')+'</div><div class="fw-subbranch"><span>TACTICS</span>'+tech.map(nodeButton).join('')+'</div></div></div>';
}
function tierPanel(t){
 const all=data.nodes.filter(n=>n.tier===t);
 const root=all.find(n=>n.kind==='root'),m1=all.find(n=>n.kind==='milestone'),exit=all.find(n=>n.kind==='exit'),general=all.filter(n=>n.kind==='general');
 const opened=isTierOpen(t),ownedCount=all.filter(has).length;
 return '<section class="fw-tier '+(opened?'fw-tier-open':'fw-tier-sealed')+'" id="fw-tier-'+t+'"><div class="fw-tier-header"><strong>Tier '+t+' · '+escapeHTML(data.tiers[t-1])+'</strong><span>'+ownedCount+'/41 · '+(opened?'OPEN':'SEALED')+'</span></div>'+
  '<div class="fw-branches">'+lane(t,heroCode(t,0),0)+lane(t,heroCode(t,1),1)+
  '<div class="fw-spine"><div class="fw-lane-title">Main path</div>'+nodeButton(root)+'<div class="fw-spine-line"></div>'+nodeButton(m1)+'<div class="fw-spine-line"></div>'+nodeButton(exit)+'</div>'+
  lane(t,heroCode(t,2),2)+'<div class="fw-general-lane"><div class="fw-lane-title">⚜ General upgrades</div>'+general.map(nodeButton).join('')+'</div></div></section>';
}
function renderTree(){const pane=$('skillPane');if(!pane)return;const savedTop=Number(pane.dataset.keepTop??pane.scrollTop),savedLeft=Number(pane.dataset.keepLeft??pane.scrollLeft);
 pane.innerHTML='<div class="fw-tree-guide">Swipe sideways to explore each hero branch. The central spine travels down through all five packs. Select any node for details and purchase.</div>'+[1,2,3,4,5].map(tierPanel).join('<div class="fw-tier-connector">↓ MAIN PATH ↓</div>');pane.scrollTop=savedTop;pane.scrollLeft=savedLeft;
}
function details(){
 const n=nodeMap[selected];if(!n)return;
 const status=stateFor(n),check=affordability(n);
 const prereq=n.requires.map(id=>nodeMap[id]?.name||id);
 const task=n.kind==='gate'?'Class minion kills: '+(p.kills[classIds[n.tier-1][n.heroIndex]]||0)+' / '+n.goal:'';
 const extra=n.kind==='exit'&&n.tier<5?'Two alternatives: '+gatePrices[n.tier-1]+' ordinary Upgrade Points or qualify through a voluntary prestige milestone (test: '+n.tier+' reset'+(n.tier>1?'s':'')+').':'';
 $('skillDetails').innerHTML='<div class="fw-detail-header"><div><small>'+escapeHTML(n.id)+' · '+escapeHTML(n.kind.toUpperCase())+'</small><h3>'+escapeHTML(n.name)+'</h3></div><span class="fw-state-pill">'+escapeHTML(status.toUpperCase())+'</span></div><p>'+escapeHTML(n.description)+'</p>'+
 (prereq.length?'<div class="fw-detail-meta"><strong>Prerequisites:</strong> '+escapeHTML(prereq.join(' + '))+'</div>':'')+
 (task?'<div class="fw-detail-meta">'+escapeHTML(task)+'</div>':'')+
 (extra?'<div class="fw-detail-meta">'+escapeHTML(extra)+'</div>':'')+
 '<button class="fw-action" type="button" id="skillBuy" '+(!check.ok||!api||api.state.mode!=='prep'||api.state.testMode?'disabled':'')+'>'+(status==='owned'?'✓ Already unlocked':check.ok?'Unlock · '+check.cost+' UP':escapeHTML(check.reason))+'</button>';
 $('skillBuy').addEventListener('click',()=>purchase(n.id));
}
function renderLegacy(){
 const pane=$('skillPane');if(!pane)return;const reward=Math.max(1,Math.floor(Math.max(1,p.runHighest||0)/2));
 pane.innerHTML='<div class="fw-legacy-intro"><h3>Permanent Legacy Tree</h3><p>Voluntary resets earn Legacy Shards. Permanent upgrades survive future resets. The source design leaves exact amounts and scope open; these are adjustable test values.</p><div class="fw-legacy-balance">◈ '+p.shards+' Shards · '+p.resets+' resets</div><button type="button" class="fw-action" id="fwPrestige" '+(!api||api.state.mode!=='prep'||api.state.testMode||p.runWins===0?'disabled':'')+'>⟲ Prestige reset · earn '+reward+' Shards</button></div>'+
 '<div class="fw-legacy-list">'+legacyPerks.map(x=>{const level=rank(x.key),price=x.cost+level;return '<div class="fw-perk"><div class="fw-perk-icon">'+x.icon+'</div><div class="fw-perk-body"><b>'+escapeHTML(x.name)+'</b><small>'+escapeHTML(x.description)+'</small><span>Rank '+level+'/'+x.max+'</span></div><button type="button" data-perk="'+x.key+'" '+(level>=x.max||p.shards<price||api.state.mode!=='prep'||api.state.testMode?'disabled':'')+'>'+(level>=x.max?'MAX':price+' ◈')+'</button></div>'}).join('')+'</div>'+
 '<div class="fw-legacy-foot">Permanent older-class evolution branches are an approved direction but their exact nodes and abilities are not specified; no invented classes are added.</div>';
 $('fwPrestige').addEventListener('click',prestige);pane.querySelectorAll('[data-perk]').forEach(b=>b.addEventListener('click',()=>buyLegacy(b.dataset.perk)));
}

function backupPayload(){return {game:'Fantasy Warriors',kind:'skilltree-save',schema:1,build:'1.0',exportedAt:new Date().toISOString(),state:JSON.parse(JSON.stringify(p))};}
function normalizeBackup(raw){
 const doc=JSON.parse(raw);
 if(!doc||doc.game!=='Fantasy Warriors'||doc.kind!=='skilltree-save'||doc.schema!==1||!doc.state||!Array.isArray(doc.state.nodes))throw Error('This is not a compatible Fantasy Warriors save file.');
 const source=doc.state;
 const count=(x,max=100000000)=>{if(typeof x!=='number'||!Number.isFinite(x)||x<0||x>max)throw Error('Save contains invalid progression values.');return x};
 const clean=defaultSave();
 clean.up=count(source.up||0);clean.upRemainder=count(source.upRemainder||0,4);
 clean.nodes=[...new Set(source.nodes.map(String))];
 if(clean.nodes.length>205||clean.nodes.some(id=>!nodeMap[id]))throw Error('Unknown upgrade node in save.');
 clean.highestClear=count(source.highestClear||0,10);
 clean.runHighest=count(source.runHighest||0,10);
 clean.runWins=count(source.runWins||0,1000000);
 clean.campaignStage=count(source.campaignStage??Math.max(1,1+clean.runHighest),10);
 if(!Number.isInteger(clean.campaignStage)||clean.campaignStage<1)throw Error('Invalid stage in save.');
 clean.resets=count(source.resets||0,100000);
 clean.shards=count(source.shards||0);
 clean.gateways=[...new Set((source.gateways||[]).map(Number))];
 if(!Array.isArray(source.gateways||[])||clean.gateways.some(t=>!Number.isInteger(t)||t<2||t>5))throw Error('Invalid tier gateway data.');
 for(const [k,v] of Object.entries(source.kills||{})){if(!classIds.flat().includes(k))throw Error('Unknown hero in kill ledger.');clean.kills[k]=count(v,10000000);}
 for(const [k,v] of Object.entries(source.packOpens||{})){if(!/^[0-4]$/.test(k))throw Error('Invalid pack data.');clean.packOpens[k]=count(v,10000000);}
 for(const [k,v] of Object.entries(source.tierWins||{})){if(!/^[1-5]$/.test(k))throw Error('Invalid tier data.');clean.tierWins[k]=count(v,1000000);}
 for(const [k,v] of Object.entries(source.legacy||{})){const perk=legacyPerks.find(x=>x.key===k);if(!perk)throw Error('Unknown permanent perk.');clean.legacy[k]=count(v,perk.max);if(!Number.isInteger(v))throw Error('Invalid permanent perk rank.');}
 clean.stats=source.stats&&typeof source.stats==='object'&&!Array.isArray(source.stats)?source.stats:{};
 return clean;
}
function downloadBackup(){
 const backup=JSON.stringify(backupPayload(),null,2);
 const blob=new Blob([backup],{type:'application/json'}),url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download='Fantasy_Warriors_Save_'+new Date().toISOString().slice(0,10)+'.json';
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
 const f=$('fwBackupFeedback');if(f)f.textContent='Backup downloaded. Keep the JSON file in Files or cloud storage.';
}
async function restoreBackup(file){
 if(!api||api.state.mode!=='prep'||api.state.testMode||api.state.bought>0)throw Error('Import is available only during normal preparation before purchasing packs.');
 if(!file||file.size>2000000)throw Error('Choose a Fantasy Warriors save JSON file under 2 MB.');
 const clean=normalizeBackup(await file.text());
 if(!confirm('Replace this device’s saved skill tree, legacy upgrades and campaign stage with this backup?'))return;
 p=clean;save();progressGate();api.restart();resumeStage();recalc();draw();updateLabels();api.log('Imported saved progression for Stage '+p.campaignStage+'.');
}
function renderBackup(){
 const pane=$('skillPane');if(!pane)return;
 const canImport=api&&api.state.mode==='prep'&&!api.state.testMode&&api.state.bought===0;
 const opened=[1,2,3,4,5].filter(isTierOpen).length;
 pane.innerHTML='<div class="fw-backup"><h3>Save &amp; Backup</h3>'+
 '<p>Progress saves automatically in this browser. Export a backup before changing phones, clearing Safari data or testing major builds.</p>'+
 '<div class="fw-backup-grid">'+
 '<div><small>Campaign stage</small><strong>'+Math.max(1,Math.min(10,p.campaignStage||1))+' / 10</strong></div>'+
 '<div><small>Highest cleared</small><strong>'+p.highestClear+' / 10</strong></div>'+
 '<div><small>Tree nodes bought</small><strong>'+p.nodes.length+' / 205</strong></div>'+
 '<div><small>Pack tiers open</small><strong>'+opened+' / 5</strong></div>'+
 '<div><small>Upgrade Points</small><strong>'+p.up.toFixed(2)+'</strong></div>'+
 '<div><small>Legacy resets</small><strong>'+p.resets+'</strong></div></div>'+
 '<button type="button" class="fw-action fw-backup-download" id="fwDownloadBackup">↓ Export Save JSON</button>'+
 '<label class="fw-backup-import" for="fwImportFile">↑ Import Save JSON</label>'+
 '<input id="fwImportFile" type="file" accept=".json,application/json" '+(canImport?'':'disabled')+'>'+
 '<p class="fw-backup-notice">'+(canImport?'Import replaces local progress after confirmation.':'Import is available during normal preparation before buying packs.')+'</p>'+
 '<p id="fwBackupFeedback" class="fw-backup-feedback" role="status"></p>'+
 '<p class="fw-backup-foot">The backup includes stage, skill nodes, class kill challenges, unlocked tiers, Upgrade Points and permanent Legacy perks. It does not save a battle mid-fight; reloading resumes preparation at your saved stage.</p></div>';
 $('fwDownloadBackup').addEventListener('click',downloadBackup);
 $('fwImportFile').addEventListener('change',async e=>{
  const f=$('fwBackupFeedback');try{await restoreBackup(e.target.files?.[0]);if(f?.isConnected)f.textContent='Save imported.';}catch(err){if(f?.isConnected)f.textContent=String(err.message||err);}
 });
}

function updateLabels(){
 const lab=$('skillBalance'),top=$('skillMeta');if(lab)lab.textContent=p.up.toFixed(2)+' UP · '+p.shards+' ◈';if(top)top.textContent='Upgrade Points '+p.up.toFixed(2)+' · Legacy Shards '+p.shards+' · '+p.resets+' resets';
}
function draw(){if(!$('skillModal')?.classList.contains('active'))return;updateLabels();
 $('skillTreeTab').classList.toggle('selected',active==='tree');$('skillLegacyTab').classList.toggle('selected',active==='legacy');$('skillBackupTab').classList.toggle('selected',active==='backup');
 $('skillTierJump').hidden=active!=='tree';if(active==='tree')renderTree();else if(active==='backup')renderBackup();else renderLegacy();
 if(active==='tree'){details();$('skillPane').scrollTop=$('skillPane').dataset.keepTop||0;$('skillPane').scrollLeft=$('skillPane').dataset.keepLeft||0;}else $('skillDetails').innerHTML='';
}
function connect(opts){
 api=opts;initial=Object.fromEntries(api.heroes.map(h=>[h.id,{hp:h.hp,damage:h.damage,speed:h.speed,walk:h.walk}]));
 initialSpecials=Object.fromEntries(api.heroes.map(h=>[h.id,{...api.tuning.heroes[h.id].special}]));
 initialSummons={hound:{hp:api.hound.hp,damage:api.hound.damage},undead:{hp:api.undead.hp,damage:api.undead.damage}};
 progressGate();recalc();
 $('openSkillTree').addEventListener('click',()=>{$('skillModal').classList.add('active');$('skillModal').hidden=false;draw();});
 $('closeSkillTree').addEventListener('click',()=>{$('skillModal').classList.remove('active');$('skillModal').hidden=true;});
 $('skillTreeTab').addEventListener('click',()=>{active='tree';draw()});
 $('skillLegacyTab').addEventListener('click',()=>{active='legacy';draw()});$('skillBackupTab').addEventListener('click',()=>{active='backup';draw()});
 $('skillTierJump').addEventListener('change',()=>{$('fw-tier-'+$('skillTierJump').value)?.scrollIntoView({behavior:'smooth',block:'start'})});
 $('skillPane').addEventListener('scroll',()=>{if(active==='tree'){$('skillPane').dataset.keepTop=String($('skillPane').scrollTop);$('skillPane').dataset.keepLeft=String($('skillPane').scrollLeft);}});$('skillPane').addEventListener('click',e=>{const b=e.target.closest('[data-node]');if(b){selected=b.dataset.node;$('skillPane').dataset.keepTop=$('skillPane').scrollTop;$('skillPane').dataset.keepLeft=$('skillPane').scrollLeft;details();$('skillPane').querySelectorAll('.fw-node').forEach(x=>x.classList.toggle('fw-active',x.dataset.node===selected));}});
 $('skillModal').addEventListener('click',e=>{if(e.target.id==='skillModal'){$('skillModal').hidden=true;$('skillModal').classList.remove('active')}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('skillModal').classList.contains('active')){$('skillModal').hidden=true;$('skillModal').classList.remove('active')}});
 updateLabels();
}
window.FWSkillTree={connect,has:owns,isTierOpen,points:()=>p.up,shards:()=>p.shards,shopSlots:()=>api?.state.shopSlots||1,recordKill,recordPack,recordWin,prestige,recalc,notify,rate:specialRate,
 debug:()=>JSON.parse(JSON.stringify(p)),purchase,nodes:data.nodes,backupPayload,normalizeBackup,checkpointStage,markRestart,resumeStage, 
 heroBonus:(h,e)=>{
  let extra=1;
  if(owns('T2-G02')&&!h.firstBasicUsed&&h.base.pack===1){extra*=1.5;h.firstBasicUsed=true;}
  if(owns('T3-G04')&&h.base.pack===2&&e?.attackingTower)extra*=1.35;
  if(owns('T5-G02')&&h.base.pack===4&&e?.boss)extra*=1.5;
  if(owns('T4-G03')&&h.base.pack===3&&(e?.weakUntil>api.state.elapsed||e?.doom))extra*=1.4;
  if(h.base.id==='rogue'&&owns('T2-R-T01')&&e&&e.hp<e.maxHp*.35)extra*=1.3;
  return extra;
 },
 guardDamage:(h,damage)=>{
  let factor=1;
  if(owns('T3-G03')&&h.base.pack===2&&Math.hypot(h.x,h.y)<3)factor*=.75;
  if(owns('T4-D-T04')&&h.base.id==='druid'&&h.bearUntil>api.state.elapsed)factor*=.80;
  if(owns('T3-N-T05')&&api.state.sanctuaries.some(s=>{const caster=api.state.heroes.find(a=>a.id===s.ownerId&&a.hp>0);return caster&&Math.hypot(caster.x-h.x,caster.y-h.y)<=s.radius}))factor*=.8;
  return damage*factor;
 },
 rangeBonus:(id)=>{
  if(id==='mage'&&owns('T1-MG-S04'))return 1.4;
  if(id==='shaman'&&owns('T4-S-S04'))return 1.4;
  return 1;
 },
 legacyIncome:()=>1+rank('insight')*.25,
 bearBasicDamage:()=>initial?.druid?initial.druid.damage*(1+rank('strength')*.08+(owns('T4-G04')?.35:0)):0,
 mageSplashDamage:()=>initial?.mage?initial.mage.damage*(1+rank('strength')*.08):0
};
})();