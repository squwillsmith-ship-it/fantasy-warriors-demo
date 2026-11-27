#!/usr/bin/env node
// Headless driver for the REAL demo runtime. No substitute combat formulas.
import {createServer} from 'node:http';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url));
const spec=JSON.parse(await readFile(new URL('manifesto-1.16.json',import.meta.url),'utf8'));
const args=Object.fromEntries(process.argv.slice(2).map(a=>{const i=a.indexOf('=');if(!a.startsWith('--')||i<0)throw Error('Use --key=value');return [a.slice(2,i),a.slice(i+1)]}));
const allowed=new Set(['profile','stages','team','seeds','seed','max-seconds','chunk','output','check']);
for(const k of Object.keys(args))if(!allowed.has(k))throw Error('Unknown argument '+k);
const integer=(s,min,max,name)=>{const n=Number(s);if(!Number.isInteger(n)||n<min||n>max)throw Error('Invalid '+name);return n};
const profile=args.profile??'live';assert(['live','candidate'].includes(profile));
const stages=(args.stages??'1,2,10').split(',').map(x=>integer(x,1,10,'stage'));
const team=(args.team??'knight:2,archer:1,mage:1').split(',').map(t=>{const [id,c='1']=t.split(':');assert(spec.engineCompatibleProfile.heroes.some(h=>h.id===id),'unknown hero '+id);return{id,count:integer(c,1,40,'count')}});
assert(team.reduce((s,h)=>s+h.count,0)<=80,'max 80 heroes');
const n=integer(args.seeds??'5',1,10000,'seeds'),seed=integer(args.seed??'271128',0,4294967295,'seed'),max=integer(args['max-seconds']??'480',1,3600,'max-seconds'),chunk=integer(args.chunk??'10',1,60,'chunk');
const nodes=[...spec.target.ordinaryNodes,...spec.target.legacyNodes];
assert.equal(nodes.length,348);assert.equal(new Set(nodes.map(x=>x.id)).size,348);
assert.equal(spec.target.ordinaryNodes.reduce((s,x)=>s+x.cost,0),1342);
assert.equal(spec.target.legacyNodes.reduce((s,x)=>s+x.cost,0),570);
assert.equal(spec.engineCompatibleProfile.stages.length,10);
assert.equal(spec.engineCompatibleProfile.heroes.length,15);
for(const p of spec.target.packs)assert(Math.abs(p.weights.reduce((s,x)=>s+x,0)-1)<1e-9);
if(args.check==='true'){console.log('Manifesto catalogue checks passed');process.exit(0)}
const {chromium}=await import('playwright');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
const server=createServer(async(req,res)=>{try{
 const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(path!==root&&!path.startsWith(root.endsWith(sep)?root:root+sep)){res.writeHead(403).end();return}
 const ext=extname(path);if(!mime[ext]){res.writeHead(404).end();return}
 let data=await readFile(path,'utf8');
 // Candidate adapter is injected ONLY into this local lab HTTP response. Public
 // balance-config.js stays unchanged. Validation still uses the old schema.
 if(profile==='candidate'&&path===resolve(root,'balance-config.js')){
  data+='\nwindow.FWBalance.profile='+JSON.stringify(spec.engineCompatibleProfile)+';\nwindow.FWBalance.validate(window.FWBalance.profile);\n';
 }
 if(profile==='candidate'&&path===resolve(root,'game-data.js')){
  const from='chargeSeconds:null';assert(data.includes(from),'runtime adapter drift');
  data=data.replace(from,'chargeSeconds:ABILITIES[core.id].chargeSeconds??null');
 }
 res.writeHead(200,{'Content-Type':mime[ext],'Cache-Control':'no-store'}).end(data);
 }catch(e){res.writeHead(500).end(String(e))}
});
await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
let browser;const results=[];
try{
 browser=await chromium.launch({headless:true});
 const url='http://127.0.0.1:'+server.address().port+'/balance-lab.html';
 async function run(stage,runSeed,stepChunk){
  const context=await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(String(e)));
   await page.addInitScript(({seed})=>{
    let a=seed>>>0;Math.random=()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};
    // Stop the normal RAF clock; use the runtime's existing fixed .05 s step.
    window.requestAnimationFrame=()=>0;window.cancelAnimationFrame=()=>{};
   },{seed:runSeed});
   await page.goto(url,{waitUntil:'load'});
   await page.waitForFunction(()=>!!window.__FW_LAB_API__&&!!window.__FW_TEST__,null,{polling:50,timeout:10000});
   const row=await page.evaluate(({stage,team,max,stepChunk,profile})=>{
    const api=window.__FW_LAB_API__,test=window.__FW_TEST__;
    const check=(v,m)=>{if(!v)throw Error(m)};
    check(api.prepare(),'prepare failed');check(api.setStage(stage),'setStage failed');check(api.clearQueue(),'clearQueue failed');
    for(const h of team)check(api.queueHero(h.id,h.count),'queue failed '+h.id);
    check(api.start(),'start failed');
    let s=api.snapshot(),budget=0;
    check(s.mode==='battle','did not enter battle');
    const usedProfile=window.__FW_DEMO__.snapshot().balanceProfile;
    if(profile==='candidate')check(usedProfile==='fw-lab-v1.16.0-compatible','candidate was not applied');
    while(s.mode==='battle'&&budget<max){const dt=Math.min(stepChunk,max-budget);check(test.advance(dt),'advance failed');budget+=dt;s=api.snapshot();}
    check(Number.isFinite(s.towerHP)&&Number.isFinite(s.elapsed),'nonfinite outcome');
    check(['battle','clear','over','champion'].includes(s.mode),'unexpected mode '+s.mode);
    return {stage,profile:usedProfile,outcome:s.mode==='clear'||s.mode==='champion'?'win':s.mode==='over'?'loss':'timeout',seconds:s.elapsed,towerHP:s.towerHP,kills:s.kills,regularSpawned:s.regularSpawned,regularTotal:s.regularTotal,heroesAlive:s.heroesAlive,heroesTotal:s.heroesTotal,specialCasts:s.specialCasts,bossKilled:s.bossKilled,report:s.report};
   },{stage,team,max,stepChunk,profile});
   assert.deepEqual(errors,[],'browser errors');return {...row,seed:runSeed,team};
  }finally{await context.close()}
 }
 // Verify fixed-step outcome invariance across batching sizes before a sweep.
 const a=await run(stages[0],seed,1),b=await run(stages[0],seed,chunk);
 const signature=x=>JSON.stringify([x.outcome,x.seconds,x.towerHP,x.kills,x.regularSpawned,x.heroesAlive,x.specialCasts,x.bossKilled]);
 assert.equal(signature(a),signature(b),'same seed differs between 1s and requested step batches');
 for(const stage of stages)for(let i=0;i<n;i++){const r=await run(stage,(seed+i)>>>0,chunk);results.push(r);console.log(JSON.stringify({stage,seed:r.seed,outcome:r.outcome,seconds:r.seconds,kills:r.kills,towerHP:r.towerHP}));}
 const summary=stages.map(stage=>{const rows=results.filter(x=>x.stage===stage);return{stage,n:rows.length,wins:rows.filter(x=>x.outcome==='win').length,losses:rows.filter(x=>x.outcome==='loss').length,timeouts:rows.filter(x=>x.outcome==='timeout').length,meanSeconds:rows.reduce((s,x)=>s+x.seconds,0)/rows.length,meanKills:rows.reduce((s,x)=>s+x.kills,0)/rows.length}});
 const output={kind:'actual-demo-engine-fixed-team',profile,manifestoVersion:spec.manifestoVersion,chunk,seed,team,limitations:spec.compatibility,determinismCheck:'passed',summary,results};
 if(args.output)await writeFile(args.output,JSON.stringify(output,null,2)+'\n');
 console.log(JSON.stringify(summary,null,2));
}finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
