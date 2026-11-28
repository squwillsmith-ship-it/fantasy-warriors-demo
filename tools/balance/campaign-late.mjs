import {readFile,writeFile} from 'node:fs/promises';
const files=["balance-config.js","merchant.js","skins.js","skill-tree-data.js","endless.js","skill-tree.js","skill-tree-effects.js","game-data.js","game-arcade.js","quick-stats.js","game-render.js","game-ui.js","tower-fire.js","battle-actions.js","prestige-enemies.js","boss-abilities.js","game-core.js"];
const original=await Promise.all(files.map(p=>readFile(new URL('../../'+p,import.meta.url),'utf8')));
const bootSrc="const storage=new Map();\nfunction boot(lab=false){\n const nodes=new Map(),noop=()=>{};\n function node(tag='div'){\n  const listeners={};const props={tagName:tag.toUpperCase(),value:'',dataset:{},style:{setProperty:noop},classList:{contains:()=>false,add:noop,remove:noop,toggle:noop},children:[],addEventListener:(k,f)=>{(listeners[k]??=[]).push(f)},fire:(k,e={})=>{for(const f of listeners[k]||[])f({target:props,preventDefault:noop,...e})},append:(...v)=>props.children.push(...v),prepend:(...v)=>props.children.unshift(...v),appendChild:v=>{props.children.push(v);return v},replaceChildren:(...v)=>{props.children=v},insertAdjacentHTML:noop,remove:noop,setAttribute:noop,getAttribute:()=>null,querySelectorAll:()=>[],querySelector:()=>null,closest:()=>null,focus:noop,scrollIntoView:noop,getBoundingClientRect:()=>({left:0,top:0,width:900,height:600}),clientWidth:900,clientHeight:600,width:900,height:600};props.add=props.append;\n  const ctx=new Proxy({measureText:()=>({width:10}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(t,p)=>t[p]??noop});props.getContext=()=>ctx;props.parentElement={clientWidth:900,clientHeight:600,getBoundingClientRect:props.getBoundingClientRect};return props;\n }\n const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};\n const document={getElementById:get,createElement:node,querySelectorAll:()=>[],querySelector:()=>null,addEventListener:noop,body:node('body'),documentElement:node('html')};document.body.classList.contains=x=>lab&&x==='lab-mode';\n const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};\n const window={document,devicePixelRatio:1,addEventListener:noop,innerWidth:900,innerHeight:600,localStorage,requestAnimationFrame:()=>0};\n function Option(t,v){return {...node('option'),text:t,value:v}}\n for(const [i,source] of sources.entries()){try{new Function('window','document','localStorage','requestAnimationFrame','confirm','Option','Math',source)(window,document,localStorage,()=>0,()=>true,Option,rngMath)}catch(e){throw Error(files[i]+': '+e.stack)}}\n return {window,get};\n}\n";

const simulate= new Function("files","sources","rngMath",bootSrc+"return {boot,storage};");
function seeded(seed){let a=seed>>>0;const m=Object.create(Math);m.random=()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};return m}
function run(seed,candidate,maxAttempts=40){
 const sources=original.slice();
 if(candidate.includes('late'))sources[0]+='\nwindow.FWBalance.profile.economy.scheduledUPByPrestige=[1,1,1,1,.8,.65];';
 if(candidate.includes('unscaled'))sources[0]+='\nwindow.FWBalance.profile.economy.scheduledUPByPrestige=[1,1,1,1,1,1];';
 const passive=candidate.includes('passive'), casual=candidate.includes('casual');
 // Explicit numerical overrides; do not silently depend on old hardcoded skill-tree source strings.
 if(['baseline','paced','slow'].includes(candidate)){
  const cadence=candidate==='baseline'?6:candidate==='slow'?10:8,elite=candidate==='baseline'?1:.5;
  sources[0]+='\nwindow.FWBalance.profile.economy.eligibleKillsPerUP='+cadence+';window.FWBalance.profile.economy.eliteKillUP='+elite+';';
 }

 sources[16]=sources[16].replace("window.__FW_TEST__={","window.__FW_SIM__={state,actions:ACTIONS,advance:(seconds)=>{for(let i=0;i<Math.round(seconds/.05)&&state.mode==='battle';i++)step(.05);}};\nwindow.__FW_TEST__={");
 const {boot}=simulate(files,sources,seeded(seed));const b=boot(false),w=b.window,sk=w.FWSkillTree,sim=w.__FW_SIM__,s=sim.state,d=w.FW_SKILL_DATA,M=w.FWMerchant;
 const priority=n=>{let k=d.supported[n.id]?.kind;const special={"R-M01":130,"R-M07":125,"R-M10":110,"R-M14":105,"R-M18":100,"R-E01":145,"R-E02":110,"R-E03":105,"R-G01":90,"O-SP01":83,"O-SP02":70,"O-SP11":65};return (special[n.id]??({coins:100,slots:85,damage:75,hp:65,rate:70,chargeRate:45,chargeStart:35,discount:80,extraUP:75,towerDamage:70,towerRate:70,income:90}[k]??15))-n.cost*2};
 let fails=0;const result=[];const heroStats={};
 for(let i=0;i<maxAttempts;i++){
  let purchases=[];for(let j=0;j<12;j++){
   for(let t=1;t<5;t++)sk.gateway(t);
   const n=[...d.legacy,...d.ordinary].filter(n=>sk.check(n.id).ok).sort((a,b)=>priority(b)-priority(a))[0];if(!n||!sk.purchase(n.id))break;purchases.push(n.id)
  }
  if(sk.has('O-SP01'))sk.setSpellLoadout(0,'lightning');if(sk.has('O-SP11')&&sk.has('O-SP02'))sk.setSpellLoadout(1,'healing');
  const heroWeight={knight:.9,archer:1.4,mage:1.5,hunter:1.45,barbarian:1,rogue:.85,paladin:1,nun:.75,priest:.9,shaman:1.1,druid:1.1,warlock:1.4,beastmaster:1.3,necromancer:1.6,dragonkin:1.6};
  for(let j=0;j<8;j++){
   const candidates=s.shopOffers.map((o,k)=>({o,k,cost:M.price(o,s.merchantShop)})).filter(x=>!x.o.sold&&x.cost<=s.coins).sort((a,b)=>score(b)-score(a));
   function score(x){return x.o.qty*(x.o.heroId?heroWeight[x.o.heroId]:1+.12*x.o.packIndex)/x.cost}
   if(!candidates.length)break;const x=candidates[0];b.get('packOfferButtons').fire('click',{target:{closest:()=>({dataset:{shopSlot:String(x.k)}})}});b.get('buyButton').fire('click')
  }
  const stage=s.stage,p=sk.debug().resets,cap=s.coinMax,startUP=sk.points(),endless=s.endlessWave||0,killBefore=sk.debug().kills;
  b.get('stageButton').fire('click');if(s.mode!=='battle'){result.push({i,stage,p,error:'cannot start',coins:s.coins});break}
  const team=s.heroes.map(h=>h.base.id);let rescueTaps=0,spellCasts=0;
  for(let t=0;t<3600&&s.mode==='battle';t++){
   const enemies=s.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x,a.y)-Math.hypot(b.x,b.y));
   const target=enemies[0];if(target&&!passive&&(!casual||t%12===0)){s.towerAim={x:target.x,y:target.y};}
   const capture=s.heroes.filter(h=>h.capture?.required).sort((a,b)=>a.capture.expires-b.capture.expires)[0];
   if(capture&&!passive&&(!casual||t%4===0)){sim.actions.press(capture.id);rescueTaps++}
   if(!passive&&t%(casual?16:4)===0&&target){for(const key of sim.actions.loadout()){
    if(key==='healing'){const h=s.heroes.find(h=>h.hp>0&&h.hp<h.maxHp*.65);if(h&&sim.actions.arm(key))(sim.actions.cast(h.x,h.y)&&spellCasts++)}
    else if(sim.actions.arm(key))(sim.actions.cast(target.x,target.y)&&spellCasts++);
   }}
   sim.advance(.25);
  }
  const outcome=s.mode;const killAfter=sk.debug().kills;for(const id of team){const h=heroStats[id]??={deployments:0,kills:0,winDeployments:0};h.deployments++;if(['clear','champion'].includes(outcome))h.winDeployments++;}for(const [id,n] of Object.entries(killAfter)){const h=heroStats[id]??={deployments:0,kills:0,winDeployments:0};h.kills+=n-(killBefore[id]||0);}const earned=Math.round((sk.points()-startUP)*100)/100;if(['clear','over','champion'].includes(outcome)&&earned<2)throw Error('Zero/insufficient progression: seed '+seed+' stage '+stage+' attempt '+(i+1)+' earned '+earned);result.push({i:i+1,p,stage,endless,cap,team,outcome,sec:Math.round(s.elapsed*100)/100,kills:s.kills,up:earned,minimumTopup:s.attemptProgressTopup||0,bought:purchases.length,rescueTaps,spells:spellCasts});
  if(outcome==='champion'){b.get('messageButton').fire('click');continue}if(outcome==='battle'||(endless&&outcome==='over')||(endless>=30&&outcome==='clear'))break;
  if(outcome==='clear'){fails=0;b.get('messageButton').fire('click')}
  else if(outcome==='over'){fails++;b.get('messageButton').fire('click');if(fails>=4&&sk.debug().runWins>0&&p<5){sk.prestige();fails=0}}
  else break;
 }
 const final=sk.debug();return {seed,candidate,result,heroStats,endless:sk.endlessState(),final:{stage:s.stage,resets:final.resets,highestClear:final.highestClear,up:final.up,shards:final.shards}};
}




const max=Number(process.argv[2]||145),seed=Number(process.argv[3]||271133),variant=process.argv[4]||'late';const result=run(seed,variant,max);await writeFile(new URL('./campaign-late-'+variant+'-'+seed+'.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log({seed,variant,attempts:result.result.length,final:result.final,endless:result.endless});