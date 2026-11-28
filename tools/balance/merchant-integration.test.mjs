import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const files=['balance-config.js','merchant.js','skill-tree-data.js','skill-tree.js','skill-tree-effects.js','game-data.js','game-arcade.js','quick-stats.js','game-render.js','game-ui.js','tower-fire.js','game-core.js'];
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
