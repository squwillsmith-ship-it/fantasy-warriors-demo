import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const files=['balance-config.js','merchant.js','skill-tree-data.js','skill-tree.js','skill-tree-effects.js','game-data.js','game-arcade.js','quick-stats.js','game-render.js','game-ui.js','tower-fire.js','battle-actions.js','prestige-enemies.js','game-core.js'];
const sources=await Promise.all(files.map(p=>readFile(new URL('../../'+p,import.meta.url),'utf8')));
const storage=new Map();
function boot(lab=false){
 const nodes=new Map(),noop=()=>{};
 function node(tag='div'){
  const listeners={};const props={tagName:tag.toUpperCase(),value:'',dataset:{},style:{setProperty:noop},classList:{contains:()=>false,add:noop,remove:noop,toggle:noop},children:[],addEventListener:(k,f)=>{(listeners[k]??=[]).push(f)},fire:(k,e={})=>{for(const f of listeners[k]||[])f({target:props,preventDefault:noop,...e})},append:(...v)=>props.children.push(...v),prepend:(...v)=>props.children.unshift(...v),appendChild:v=>{props.children.push(v);return v},replaceChildren:(...v)=>{props.children=v},insertAdjacentHTML:noop,remove:noop,setAttribute:noop,getAttribute:()=>null,querySelectorAll:()=>[],querySelector:()=>null,closest:()=>null,focus:noop,scrollIntoView:noop,getBoundingClientRect:()=>({left:0,top:0,width:900,height:600}),clientWidth:900,clientHeight:600,width:900,height:600};props.add=props.append;
  const ctx=new Proxy({measureText:()=>({width:10}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(t,p)=>t[p]??noop});props.getContext=()=>ctx;props.parentElement={clientWidth:900,clientHeight:600,getBoundingClientRect:props.getBoundingClientRect};return props;
 }
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
 const document={getElementById:get,createElement:node,querySelectorAll:()=>[],querySelector:()=>null,addEventListener:noop,body:node('body'),documentElement:node('html')};document.body.classList.contains=x=>lab&&x==='lab-mode';
 const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const window={document,devicePixelRatio:1,addEventListener:noop,innerWidth:900,innerHeight:600,localStorage,requestAnimationFrame:()=>0};
 function Option(t,v){return {...node('option'),text:t,value:v}}
 for(const [i,source] of sources.entries()){try{new Function('window','document','localStorage','requestAnimationFrame','confirm','Option',source)(window,document,localStorage,()=>0,()=>true,Option)}catch(e){throw Error(files[i]+': '+e.stack)}}
 return {window,get};
}
let a=boot();let s=a.window.__FW_DEMO__.snapshot();
assert(s.mode==='prep'&&s.coins===2&&s.shopOffers.length===3,'initial stock');const original=JSON.stringify(s.shopOffers);
a=boot();assert.equal(JSON.stringify(a.window.__FW_DEMO__.snapshot().shopOffers),original,'stock reload');
a.get('buyButton').fire('click');s=a.window.__FW_DEMO__.snapshot();assert(s.coins===0&&s.bought===1&&s.shopOffers.filter(o=>o.sold).length===1,'purchase');const sold=JSON.stringify(s.shopOffers);
a=boot();s=a.window.__FW_DEMO__.snapshot();assert(s.coins===0&&s.bought===1&&JSON.stringify(s.shopOffers)===sold,'purchase restore');
a.get('stageButton').fire('click');s=a.window.__FW_DEMO__.snapshot();assert(s.mode==='battle'&&s.heroes.length===1&&s.skillTree.packOpens[0]===1,'commit and deployment');const pity=JSON.stringify(s.merchant.pity);
a=boot();s=a.window.__FW_DEMO__.snapshot();assert(s.mode==='prep'&&s.bought===0&&JSON.stringify(s.merchant.pity)===pity&&s.skillTree.packOpens[0]===1,'committed attempt not duplicated');
const b=boot(true),api=b.window.__FW_LAB_API__;api.prepare();api.queueHero('knight',2);api.start();b.window.__FW_TEST__.advance(10);const snap=api.snapshot();assert(Number.isFinite(snap.elapsed)&&snap.elapsed>0,'actual combat step');
console.log('Mock DOM integration: 8 checks passed; real core stepped '+snap.elapsed.toFixed(2)+' seconds.');

const tree=b.window.FW_SKILL_DATA,S=tree.supported;
assert.equal(tree.ordinary.length,228);assert.equal(tree.legacy.length,120);
assert.equal(new Set([...tree.ordinary,...tree.legacy].map(n=>n.id)).size,348);
const key='fantasy-warriors-lab-skilltree-1.1';
storage.set(key,JSON.stringify({treeSchema:2,up:10000,shards:10000,resets:5,runHighest:10,highestClear:10,runWins:10,campaignStage:1,gateways:[2,3,4,5],kills:Object.fromEntries(tree.heroes.map(id=>[id,10000])),nodes:[],legacyNodes:[],merchantPity:[0,0,0,0,0]}));
const c=boot(true),sk=c.window.FWSkillTree,lab=c.window.__FW_LAB_API__;
let bought=0;
for(let j=0;j<348;j++){let count=0;for(const n of [...tree.legacy,...tree.ordinary])if(sk.purchase(n.id)){count++;bought++}if(!count)break;}
const state=sk.debug();
assert.equal(state.nodes.length+state.legacyNodes.length,bought);
assert(bought>=329,'Unexpected loss of reachable upgrade effects');
assert.equal(sk.purchase('O-1-K-A1'),false,'Duplicate purchase');
assert.equal(sk.tower().pierce,1);assert.equal(sk.tower().twin,.6);
assert.equal(c.window.__FW_DEMO__.snapshot().coinMax,40);
for(const n of [...tree.ordinary,...tree.legacy])if(!S[n.id])assert.equal(sk.purchase(n.id),false,'Pending node must not be purchasable');
lab.prepare();for(const id of tree.heroes)lab.queueHero(id,2);
lab.start();c.window.__FW_TEST__.advance(60);
const combat=lab.snapshot();assert(Number.isFinite(combat.towerHP)&&Number.isFinite(combat.elapsed),'Finite all-hero combat');
console.log('Tree: '+bought+' reachable purchases; all-hero battle ran '+combat.elapsed.toFixed(2)+' seconds.');
const old={up:9,shards:2,resets:3,runHighest:2,highestClear:3,runWins:2,campaignStage:3,nodes:['T1-G01'],purchaseCosts:{'T1-G01':3},legacy:{vitality:2,merchant:1},kills:{knight:7},gateways:[2],merchantPity:[2,0,0,0,0]};
storage.set(key,JSON.stringify(old));
const migrated=boot(true).window.FWSkillTree.debug();
assert(migrated.treeSchema===2&&migrated.up===12&&migrated.shards===8,'Migration balances');
assert.equal(migrated.kills.knight,7);
assert.equal(boot(true).window.FWSkillTree.debug().up,migrated.up,'Migration refund must not repeat');
console.log('Schema migration and refund checks passed.');

storage.set(key,JSON.stringify({treeSchema:2,up:10000,shards:10000,resets:5,runHighest:10,highestClear:10,runWins:10,campaignStage:1,gateways:[2,3,4,5],kills:Object.fromEntries(tree.heroes.map(id=>[id,10000])),nodes:[],legacyNodes:[]}));
const d=boot(true),ds=d.window.FWSkillTree,dl=d.window.__FW_LAB_API__,dt=d.window.__FW_TEST__;
assert(ds.purchase('O-SP01'));assert(ds.purchase('O-SP02'));assert(ds.purchase('O-SP11'));
assert(ds.setSpellLoadout(0,'lightning'));assert(ds.setSpellLoadout(1,'healing'));assert.equal(ds.setSpellLoadout(1,'lightning'),false);
dl.prepare();dl.queueHero('mage',1);dl.queueHero('archer',1);dl.start();
const [victim,other]=dt.current().heroes;
dt.enemy(victim.x,victim.y,1000,0);dt.enemy(other.x,other.y,1000,0);
const [captor,otherCaptor]=dt.current().enemies;
assert(dt.damageHero(victim.id,1e6,captor.id));assert(dt.damageHero(other.id,1e6,otherCaptor.id));
assert.equal(dt.actions().captures.length,2);
assert(dt.armSpell('lightning'));assert(dt.castSpell(captor.x,captor.y));assert.equal(dt.actions().casts,1);assert.equal(dt.armSpell('lightning'),false);
const before=dt.current().heroes.find(h=>h.id===victim.id).charge;
for(let i=0;i<10;i++)assert(dt.rescue(victim.id));
let revived=dt.current().heroes.find(h=>h.id===victim.id);
assert.equal(revived.hp,1);assert.equal(revived.charge,before);assert.equal(revived.rescues,1);
dt.damageHero(victim.id,1e6,captor.id);assert.equal(dt.current().heroes.find(h=>h.id===victim.id).hp,1,'rescue invulnerability');
assert(dt.armSpell('healing'));assert(dt.castSpell(revived.x,revived.y));dl.pause();const frozen=JSON.stringify(dt.actions());dt.advance(2);assert.equal(JSON.stringify(dt.actions()),frozen,'pause freezes captures and spells');dl.pause();
dt.advance(1.1);dt.damageHero(victim.id,1e6,captor.id);assert.equal(dt.actions().captures.find(c=>c.hero===victim.id).required,20);
for(let i=0;i<20;i++)assert(dt.rescue(victim.id));
assert.equal(dt.current().heroes.find(h=>h.id===victim.id).rescues,2);
dt.advance(1.1);dt.damageHero(victim.id,1e6,captor.id);assert.equal(dt.actions().captures.find(c=>c.hero===victim.id).required,0);
assert(dt.rescue(victim.id));assert.equal(dt.current().heroes.find(h=>h.id===victim.id).hp,0);
console.log('Real-core spell and capture integration passed.');

const e=boot(true),el=e.window.__FW_LAB_API__,et=e.window.__FW_TEST__;
el.prepare();el.setStage(2);el.setPrestige(5,true);el.setTowerHP(100000);
const pre=e.window.FWSkillTree.debug(),sequence=[],seen=new Set();let actualMutants=0,actualElites=0;
el.start();assert.equal(et.prestige().plan.eliteQuota,9);assert.equal(et.prestige().plan.mutationQuota,2);assert(et.prestige().plan.faction);
for(let t=0;t<6000&&el.snapshot().mode==='battle';t++){
 et.advance(.25);
 const live=et.current().enemies.filter(x=>x.hp>0);assert(live.filter(x=>x.boss).length<=1,'only one boss active');
 for(const enemy of live){
  if(!seen.has(enemy.id)){seen.add(enemy.id);if(enemy.mutated)actualMutants++;if(enemy.elite)actualElites++;if(enemy.boss)sequence.push(enemy.faction?enemy.name:'stage boss')}
  et.defeatEnemy(enemy.id);
 }
}
assert.equal(el.snapshot().mode,'clear','scripted invasion clear');
assert.equal(sequence.join('|'),'Legion Champion|Legion Sorcerer|Legion Executioner|stage boss');
assert.equal(actualMutants,2);assert.equal(actualElites,9);assert.equal(et.prestige().factionDefeated,3);assert.equal(et.prestige().scheduledDefeated,56);assert.equal(el.snapshot().kills,60);
assert.equal(e.window.FWSkillTree.debug().shards,pre.shards,'test rewards excluded');
el.prepare();el.setStage(2);el.setPrestige(5,false);el.start();assert.equal(et.prestige().plan.eliteQuota,0);assert.equal(et.prestige().plan.mutationQuota,0);assert.equal(et.prestige().plan.faction,false);
console.log('Full scripted prestige-5 invasion: '+sequence.join(' → ')+'; 56 scheduled + 4 bosses; testing rewards excluded.');
// Verify the real saved reward accounting in a committed non-test attempt.
const normalKey='fantasy-warriors-skilltree-1.1';storage.clear();
storage.set(normalKey,JSON.stringify({treeSchema:2,up:0,shards:0,resets:5,campaignStage:2,highestClear:1,runHighest:1,runWins:1,gateways:[],attemptedStages:[2],nodes:[],legacyNodes:[]}));
const n=boot(false),ns=n.window.FWSkillTree;n.get('buyButton').fire('click');n.get('stageButton').fire('click');
assert.equal(n.window.__FW_DEMO__.snapshot().mode,'battle');
const gain=ns.recordKill('knight',false,{scheduled:true,mutated:true,rewardId:'mutation-test'});
assert.equal(ns.shards(),1);assert.equal(ns.recordKill('knight',false,{scheduled:true,mutated:true,rewardId:'mutation-test'}),0);assert.equal(ns.shards(),1);
assert.equal(ns.recordKill(null,false,{scheduled:false,faction:true,rewardId:'legion-test'}),2);assert.equal(ns.shards(),2);assert.equal(ns.recordKill(null,false,{scheduled:false,faction:true,rewardId:'legion-test'}),0);assert.equal(ns.shards(),2);
assert.equal(ns.debug().kills.knight,1,'faction does not grant class credit');
ns.stealCoin();ns.stealCoin();assert.equal(ns.applyTheft('test-shop',3,2),1);assert.equal(ns.applyTheft('test-shop',3,2),1);assert.equal(ns.applyTheft('other-shop',3,2),0);
const recovered=boot(false).window.FWSkillTree;assert.equal(recovered.shards(),2);assert.equal(recovered.debug().kills.knight,1);
console.log('Persistent mutation/faction rewards, duplicate prevention, class credit and theft floor passed.');
