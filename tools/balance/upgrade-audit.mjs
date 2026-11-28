import {readFile,writeFile} from 'node:fs/promises';
const files=["balance-config.js","merchant.js","skins.js","skill-tree-data.js","endless.js","skill-tree.js","skill-tree-effects.js","game-data.js","game-arcade.js","quick-stats.js","game-render.js","game-ui.js","tower-fire.js","battle-actions.js","prestige-enemies.js","boss-abilities.js","game-core.js"];
const original=await Promise.all(files.map(p=>readFile(new URL('../../'+p,import.meta.url),'utf8')));
const bootSrc="const storage=new Map();\nfunction boot(lab=false){\n const nodes=new Map(),noop=()=>{};\n function node(tag='div'){\n  const listeners={};const props={tagName:tag.toUpperCase(),value:'',dataset:{},style:{setProperty:noop},classList:{contains:()=>false,add:noop,remove:noop,toggle:noop},children:[],addEventListener:(k,f)=>{(listeners[k]??=[]).push(f)},fire:(k,e={})=>{for(const f of listeners[k]||[])f({target:props,preventDefault:noop,...e})},append:(...v)=>props.children.push(...v),prepend:(...v)=>props.children.unshift(...v),appendChild:v=>{props.children.push(v);return v},replaceChildren:(...v)=>{props.children=v},insertAdjacentHTML:noop,remove:noop,setAttribute:noop,getAttribute:()=>null,querySelectorAll:()=>[],querySelector:()=>null,closest:()=>null,focus:noop,scrollIntoView:noop,getBoundingClientRect:()=>({left:0,top:0,width:900,height:600}),clientWidth:900,clientHeight:600,width:900,height:600};props.add=props.append;\n  const ctx=new Proxy({measureText:()=>({width:10}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(t,p)=>t[p]??noop});props.getContext=()=>ctx;props.parentElement={clientWidth:900,clientHeight:600,getBoundingClientRect:props.getBoundingClientRect};return props;\n }\n const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};\n const document={getElementById:get,createElement:node,querySelectorAll:()=>[],querySelector:()=>null,addEventListener:noop,body:node('body'),documentElement:node('html')};document.body.classList.contains=x=>lab&&x==='lab-mode';\n const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};\n const window={document,devicePixelRatio:1,addEventListener:noop,innerWidth:900,innerHeight:600,localStorage,requestAnimationFrame:()=>0};\n function Option(t,v){return {...node('option'),text:t,value:v}}\n for(const [i,source] of sources.entries()){try{new Function('window','document','localStorage','requestAnimationFrame','confirm','Option','Math',source)(window,document,localStorage,()=>0,()=>true,Option,rngMath)}catch(e){throw Error(files[i]+': '+e.stack)}}\n return {window,get};\n}\n";

const simulate= new Function("files","sources","rngMath",bootSrc+"return {boot,storage};");
function seeded(seed){let a=seed>>>0;const m=Object.create(Math);m.random=()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};return m}


const sources=original.slice();
function audit(){
 const {boot,storage}=simulate(files,sources,seeded(271142));
 const w0={};new Function('window',sources[3])(w0);const roster=w0.FW_SKILL_DATA.heroes;
 storage.set('fantasy-warriors-lab-skilltree-1.1',JSON.stringify({treeSchema:2,up:10000,shards:10000,resets:5,runHighest:10,highestClear:10,runWins:10,campaignStage:1,gateways:[2,3,4,5],kills:Object.fromEntries(roster.map(h=>[h,10000])),nodes:[],legacyNodes:[],merchantPity:[0,0,0,0,0]}));
 const b=boot(true),w=b.window,sk=w.FWSkillTree,d=w.FW_SKILL_DATA,B=w.FWBalance.profile,G=w.FWGameData;
 const nodes=[...d.legacy,...d.ordinary],records=[],owned=[];let checks=0;
 const assert=(ok,label)=>{checks++;if(!ok)throw Error(label);};const eq=(a,b,label)=>assert(Math.abs(a-b)<.0001,label+' expected '+b+' got '+a);
 assert(nodes.length===348,'348 nodes');assert(new Set(nodes.map(n=>n.id)).size===348,'unique ids');
 const sum=(kind,key)=>owned.reduce((v,id)=>{const a=d.supported[id];return v+(a.kind===kind&&(a.key==null||a.key===key)?a.amount:0)},0);
 for(const n of nodes){assert(!!d.supported[n.id],'missing effect '+n.id);assert(Number.isInteger(n.cost)&&n.cost>0,'positive integer cost '+n.id);assert(n.effect.trim().length>0,'description '+n.id);}
 for(let pass=0;pass<348&&owned.length<nodes.length;pass++){
 let count=0;
 for(const n of nodes){
 if(sk.has(n.id)||!sk.check(n.id).ok)continue;
 const old=sk.debug(),currency=n.id.startsWith('R-')?'shards':'up';
 assert(sk.purchase(n.id),'buy '+n.id);owned.push(n.id);count++;
 const next=sk.debug();eq(old[currency]-next[currency],n.cost,'cost '+n.id);assert(sk.has(n.id),'ownership '+n.id);assert(!sk.purchase(n.id),'duplicate '+n.id);
 const x=d.supported[n.id];let numeric='deferred';
 for(const h of G.HEROES){const base=B.heroes.find(k=>k.id===h.id);
 for(const [field,kind] of [['hp','hp'],['damage','damage'],['speed','rate'],['walk','walk']])eq(h[field],base[field]*(1+sum(kind,h.id)),n.id+' '+h.id+' '+field);}
 for(const key of ['hound','undead']){const unit=key==='hound'?G.HOUND:G.UNDEAD;eq(unit.hp,B.summons[key].hp*(1+sum('summonAll')+sum('summonHP',key)),n.id+' '+key+' HP');eq(unit.damage,B.summons[key].damage*(1+sum('summonAll')+sum('summonDamage',key)),n.id+' '+key+' damage');}
 const t=sk.tower();eq(t.damage,B.towerFire.damage*(1+sum('towerDamage'))+sum('towerFlat'),n.id+' tower damage');eq(t.cooldownSeconds,B.towerFire.cooldownSeconds/(1+sum('towerRate')),n.id+' tower fire rate');
 eq(t.pierce,sum('pierce'),n.id+' pierce');eq(t.splash,sum('splash'),n.id+' splash');eq(t.twin,sum('twin'),n.id+' twin');assert(t.overload===!!sum('overload'),'overload '+n.id);
 const snap=w.__FW_DEMO__.snapshot();eq(snap.coinMax,Math.min(40,2+2*sk.questProgress().filter(q=>q.rewarded).length+sum('coins')),n.id+' coins');eq(sk.shopSlots(),Math.min(6,3+sum('slots')+(sk.has('R-M01')?1:0)+(sk.has('R-M18')?1:0)),n.id+' slots');
 if(x.kind==='special'){const a=G.TUNING.heroes[x.key].special;eq(a[x.field],B.abilities[x.key][x.field]*(1+x.amount),n.id+' special');numeric='special verified';}
 else if(['hp','damage','rate','walk','summonHP','summonDamage','summonAll','towerDamage','towerFlat','towerRate','pierce','splash','twin','overload','coins','slots'].includes(x.kind))numeric='numeric verified';
 records.push({id:n.id,name:n.name,cost:n.cost,currency,kind:x.kind,prerequisites:n.prerequisites,description:n.effect,purchase:'pass',numeric});
 }
 if(!count)break;
 }
 assert(owned.length===348,'reachable '+owned.length);return {checks,purchased:owned.length,numeric:records.filter(x=>x.numeric!=='deferred').length,records};
}

const out=audit();await writeFile(new URL('./upgrade-audit-results.json',import.meta.url),JSON.stringify(out,null,2)+'\n');console.log({checks:out.checks,purchased:out.purchased,numeric:out.numeric});