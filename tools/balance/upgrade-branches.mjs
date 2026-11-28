import {readFile,writeFile} from 'node:fs/promises';
const files=["balance-config.js","merchant.js","skins.js","skill-tree-data.js","endless.js","skill-tree.js","skill-tree-effects.js","game-data.js","game-arcade.js","quick-stats.js","game-render.js","game-ui.js","tower-fire.js","battle-actions.js","prestige-enemies.js","boss-abilities.js","game-core.js"];
const original=await Promise.all(files.map(p=>readFile(new URL('../../'+p,import.meta.url),'utf8')));
const bootSrc="const storage=new Map();\nfunction boot(lab=false){\n const nodes=new Map(),noop=()=>{};\n function node(tag='div'){\n  const listeners={};const props={tagName:tag.toUpperCase(),value:'',dataset:{},style:{setProperty:noop},classList:{contains:()=>false,add:noop,remove:noop,toggle:noop},children:[],addEventListener:(k,f)=>{(listeners[k]??=[]).push(f)},fire:(k,e={})=>{for(const f of listeners[k]||[])f({target:props,preventDefault:noop,...e})},append:(...v)=>props.children.push(...v),prepend:(...v)=>props.children.unshift(...v),appendChild:v=>{props.children.push(v);return v},replaceChildren:(...v)=>{props.children=v},insertAdjacentHTML:noop,remove:noop,setAttribute:noop,getAttribute:()=>null,querySelectorAll:()=>[],querySelector:()=>null,closest:()=>null,focus:noop,scrollIntoView:noop,getBoundingClientRect:()=>({left:0,top:0,width:900,height:600}),clientWidth:900,clientHeight:600,width:900,height:600};props.add=props.append;\n  const ctx=new Proxy({measureText:()=>({width:10}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(t,p)=>t[p]??noop});props.getContext=()=>ctx;props.parentElement={clientWidth:900,clientHeight:600,getBoundingClientRect:props.getBoundingClientRect};return props;\n }\n const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};\n const document={getElementById:get,createElement:node,querySelectorAll:()=>[],querySelector:()=>null,addEventListener:noop,body:node('body'),documentElement:node('html')};document.body.classList.contains=x=>lab&&x==='lab-mode';\n const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};\n const window={document,devicePixelRatio:1,addEventListener:noop,innerWidth:900,innerHeight:600,localStorage,requestAnimationFrame:()=>0};\n function Option(t,v){return {...node('option'),text:t,value:v}}\n for(const [i,source] of sources.entries()){try{new Function('window','document','localStorage','requestAnimationFrame','confirm','Option','Math',source)(window,document,localStorage,()=>0,()=>true,Option,rngMath)}catch(e){throw Error(files[i]+': '+e.stack)}}\n return {window,get};\n}\n";

const simulate= new Function("files","sources","rngMath",bootSrc+"return {boot,storage};");
function seeded(seed){let a=seed>>>0;const m=Object.create(Math);m.random=()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};return m}

const core=files.indexOf('game-core.js'),sources=original.slice();
sources[core]=sources[core].replace("window.__FW_TEST__={","window.__FW_UPGRADE_SIM__={state,metrics:()=>upgradeMetrics};window.__FW_TEST__={")
.replace("function hitEnemy(e,damage","const upgradeMetrics={damage:{},lethal:{},healing:0,shieldAbsorb:0,damageTaken:{}};\nfunction hitEnemy(e,damage")
.replace("const dealt=Math.min(e.hp,damage);","const dealt=Math.min(e.hp,damage);if(heroId){upgradeMetrics.damage[heroId]=(upgradeMetrics.damage[heroId]||0)+dealt;if(dealt>=e.hp)upgradeMetrics.lethal[heroId]=(upgradeMetrics.lethal[heroId]||0)+1;}")
.replace("h.hp+=n;return n}","h.hp+=n;upgradeMetrics.healing+=n;return n}")
.replace("const absorb=Math.min(h.shield,d);","const absorb=Math.min(h.shield,d);upgradeMetrics.shieldAbsorb+=absorb;")
.replace("BOSSES.share(h,Math.min(before,d),source,linked);","upgradeMetrics.damageTaken[h.base.id]=(upgradeMetrics.damageTaken[h.base.id]||0)+Math.min(before,d);BOSSES.share(h,Math.min(before,d),source,linked);");
const roster=['knight','archer','mage','hunter','barbarian','rogue','paladin','nun','priest','shaman','druid','warlock','beastmaster','necromancer','dragonkin'];
function trial(index,mode,seed){
 const {boot,storage}=simulate(files,sources,seeded(seed));
 const id=roster[index],tier=1+Math.floor(index/3),stage=[2,4,6,7,9][tier-1];
 storage.set('fantasy-warriors-lab-skilltree-1.1',JSON.stringify({treeSchema:2,up:10000,shards:10000,resets:tier-1,runHighest:10,highestClear:10,runWins:10,campaignStage:1,gateways:[2,3,4,5],kills:Object.fromEntries(roster.map(h=>[h,10000])),nodes:[],legacyNodes:[],merchantPity:[0,0,0,0,0]}));
 const b=boot(true),w=b.window,sk=w.FWSkillTree,lab=w.__FW_LAB_API__,test=w.__FW_TEST__,fx=w.__FW_UPGRADE_SIM__,d=w.FW_SKILL_DATA;
 const prefix='O-'+tier+'-'+d.codes[index]+'-',all=[...d.ordinary,...d.legacy],map=Object.fromEntries(all.map(n=>[n.id,n]));
 const selected=new Set(mode==='none'?[]:d.ordinary.filter(n=>n.id.startsWith(prefix)&&(mode==='AB'||n.id.slice(prefix.length).startsWith(mode))).map(n=>n.id));
 const general=tier>1?['O-1-G1','O-1-G2','O-2-G1']:[];if(tier>3)general.push('O-3-G1','O-4-G1');
 for(const n of general)if(!sk.purchase(n))throw Error('general purchase failed '+n);
 // Include required cross-branch prerequisites, not the unrelated branch.
 function buy(id,seen=new Set()){if(sk.has(id))return;if(seen.has(id))throw Error('cycle '+id);seen.add(id);const n=map[id];if(!n)throw Error('missing '+id);for(const q of n.prerequisites.split(' + ')){if(q.startsWith('ANY(')){const opts=q.slice(4,-1).split(',');if(!opts.some(x=>sk.has(x)))buy(opts.find(x=>selected.has(x))||opts[0],seen);}else if(!sk.has(q))buy(q,seen);}if(!sk.purchase(id))throw Error('purchase '+id+': '+JSON.stringify(sk.check(id)));seen.delete(id);bought.push(id);}
 const bought=[];for(const id of selected)buy(id);
 lab.prepare();lab.setStage(stage);lab.setPrestige(tier-1,true);lab.queueHero(id,2);lab.queueHero('knight',1);lab.queueHero('mage',1);lab.start();
 const start=fx.state.heroes.filter(h=>h.base.id===id).map(h=>({hp:h.maxHp,damage:h.base.damage,rate:h.base.speed}));
 let aliveSeconds=0;for(let t=0;t<360&&fx.state.mode==='battle';t++){aliveSeconds+=fx.state.heroes.filter(h=>h.base.id===id&&h.hp>0&&!h.summonKind).length*.25;test.advance(.25);}
 const m=fx.metrics(),s=lab.snapshot();
 return {id,tier,stage,mode,seed,bought,cost:bought.reduce((a,n)=>a+map[n].cost,0),start,seconds:s.elapsed,outcome:s.mode,kills:s.kills,towerHP:s.towerHP,aliveSeconds,damage:m.damage[id]||0,teamDamage:Object.values(m.damage).reduce((a,b)=>a+b,0),lethal:m.lethal[id]||0,healing:m.healing,shield:m.shieldAbsorb,damageTaken:m.damageTaken[id]||0,casts:s.specialCasts};
}
function batch(from,to,seed){const out=[];for(let i=from;i<to;i++)for(const mode of ['none','A','B','AB'])out.push(trial(i,mode,seed));return out;}

const from=Number(process.argv[2]||0),to=Number(process.argv[3]||15),seed=Number(process.argv[4]||271140);const out=batch(from,to,seed);await writeFile(new URL('./upgrade-branches-'+seed+'-'+from+'-'+to+'.json',import.meta.url),JSON.stringify(out,null,2)+'\n');console.log(out.map(x=>({id:x.id,mode:x.mode,kills:x.kills,damage:x.damage,towerHP:x.towerHP})));