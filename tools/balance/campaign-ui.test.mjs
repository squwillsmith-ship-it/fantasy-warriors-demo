// Exercise the production index and actual event handlers in Chromium.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium,firefox,webkit} from 'playwright';
const engine=process.env.FW_BROWSER||'chromium';
const browserType={chromium,firefox,webkit}[engine];
assert(browserType,'Unknown browser: '+engine);
const root=fileURLToPath(new URL('../../',import.meta.url));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const server=createServer(async(req,res)=>{try{
 const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!path.startsWith(root.endsWith(sep)?root:root+sep))throw Error('invalid path');
 const data=await readFile(path);res.writeHead(200,{'Content-Type':types[path.slice(path.lastIndexOf('.'))]||'application/octet-stream'});res.end(data);
}catch{res.writeHead(404);res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;let checks=0;
const ok=(v,m)=>{assert(v,m);checks++};
const url='http://127.0.0.1:'+server.address().port+'/index.html';
const snapshot=page=>page.evaluate(()=>window.__FW_DEMO__.snapshot());
const visible=async(page,selector)=>ok(await page.locator(selector).isVisible(),selector+' visible');
const openShop=async page=>{await page.evaluate(()=>window.FWInterimArt.ready);await page.getByRole('button',{name:'Continue campaign',exact:true}).click();await visible(page,'.fw-live-map');await visible(page,'.fw-live-map canvas');ok(await page.locator('.fw-live-map canvas').evaluate(el=>el.width===780&&el.height===365),'art-backed dynamic map');await page.locator('.fw-live-region[data-state=current]').click();await visible(page,'.fw-live-shop');await visible(page,'.fw-merchant-art canvas');ok(await page.locator('.fw-merchant-art canvas').evaluate(el=>el.width===390&&el.height===491),'art-backed merchant')};
try{
 browser=await browserType.launch({headless:true});
 for(const viewport of [{width:1280,height:800},{width:320,height:568},{width:390,height:844},{width:844,height:390},{width:667,height:375},{width:768,height:1024}]){
  const touch=viewport.width<=844;
  const context=await browser.newContext({viewport,hasTouch:touch,deviceScaleFactor:touch?2:1});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE ERROR:',e.message)});const evidence=viewport.width===1280||viewport.width===844;const screenshot=async name=>{if(!evidence)return;await mkdir('ui-evidence',{recursive:true});await page.screenshot({path:'ui-evidence/'+engine+'-'+viewport.width+'x'+viewport.height+'-'+name+'.png',animations:'disabled'})};page.on('dialog',d=>d.accept());
  const checkWidth=async()=>ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'no horizontal page overflow');
  await page.goto(url);ok(await page.evaluate(()=>window.FWInterimArt.ready),'all interim assets decoded');ok(await page.locator('.fw-live-menu canvas').evaluate(el=>el.width===960&&el.height===600),'art-backed menu');await visible(page,'.fw-live-menu');await visible(page,'.fw-live-menu canvas');await checkWidth();await screenshot('menu');
  await openShop(page);await checkWidth();await screenshot('merchant');if(viewport.width>viewport.height&&viewport.height<=520)ok(await page.locator('#stageButton').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight+2),'landscape Enter Battle visible without scrolling');let s=await snapshot(page);
  ok(s.stage===1&&s.coins===2&&s.shopOffers.length===3,'fresh merchant');ok(await page.locator('#buyButton').isEnabled(),'guaranteed affordable opening offer');
  await page.locator('#buyButton')[touch?'tap':'click']();s=await snapshot(page);ok(s.bought===1&&s.coins===0,'purchase uses live engine');
  await page.reload();await openShop(page);s=await snapshot(page);ok(s.bought===1&&s.coins===0,'purchased stock survives reload');
  await page.locator('#stageButton')[touch?'tap':'click']();await visible(page,'.battleground');await checkWidth();
  s=await snapshot(page);ok(s.mode==='battle'&&s.heroes.length===1,'real deployment');ok(await page.locator('.fw-live-roster-buttons button').count()===1,'live hero inspection');
  await visible(page,'.fw-live-portrait');await visible(page,'.fw-portrait-art');await visible(page,'.fw-field-pack');await page.waitForFunction(()=>!document.querySelector('.fw-live').classList.contains('fw-dealing'),null,{timeout:15000});ok(!(await page.locator('.fw-live-roster').innerText()).includes('nullnull'),'no stray portrait text');ok(await page.locator('.fw-live-roster .fw-portrait-art').evaluate(el=>el.width===144&&el.height===192),'improved hero inspection art');await screenshot('battle');await page.locator('#pauseButton').click();ok((await snapshot(page)).paused,'pause through actual control');await page.locator('#pauseButton').click();ok(!(await snapshot(page)).paused,'resume through actual control');
  const box=await page.locator('#arena').boundingBox();ok(!!box&&box.width>100&&box.height>100,'visible arena');ok(Math.abs(box.width/box.height-1.5)<.04,'stable arena ratio');
  const aimBefore=(await snapshot(page)).towerAim;await page.locator('#arena').scrollIntoViewIfNeeded();const target=await page.locator('#arena').boundingBox();
  if(touch)await page.touchscreen.tap(target.x+target.width*.8,target.y+target.height*.7);else await page.mouse.move(target.x+target.width*.8,target.y+target.height*.7);
  const aimAfter=(await snapshot(page)).towerAim;ok(aimAfter.x>0&&aimAfter.y>0&&JSON.stringify(aimBefore)!==JSON.stringify(aimAfter),'mouse/touch maps to correct world quadrant');
  await page.setViewportSize({width:viewport.height,height:viewport.width});await page.waitForFunction(()=>{const r=document.getElementById('arena').getBoundingClientRect();return Math.abs(r.width/r.height-1.5)<.04});await checkWidth();
  await page.setViewportSize(viewport);
  await page.locator('#pauseButton').click();ok((await snapshot(page)).paused,'pause after viewport rotation');await page.locator('#pauseButton').click();
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));delete document.hidden});ok((await snapshot(page)).paused,'backgrounding pauses battle');
  await page.getByRole('button',{name:'Abandon attempt',exact:true}).click();await visible(page,'.fw-live-shop');ok((await snapshot(page)).skillTree.up===0,'abandonment receives no completion bonus');
  await page.locator('#buyButton').click();await page.locator('#stageButton').click();
  await page.reload();await openShop(page);s=await snapshot(page);ok(s.mode==='prep'&&s.bought===0&&s.skillTree.up===0,'abandoned battle is not rewarded');
  // Seed a late-campaign fixture in this disposable browser context only.
  await page.evaluate(()=>{const tree=window.FW_SKILL_DATA;localStorage.setItem('fantasy-warriors-skilltree-1.1',JSON.stringify({treeSchema:2,up:10000,shards:10000,resets:5,campaignStage:10,runHighest:9,highestClear:9,runWins:9,gateways:[2,3,4,5],kills:Object.fromEntries(tree.heroes.map(id=>[id,10000])),nodes:[],legacyNodes:[],runClears:[1,2,3,4,5,6,7,8,9],discoveredHeroes:tree.heroes}));});
  await page.reload();await page.getByRole('button',{name:'Continue campaign',exact:true}).click();await page.evaluate(()=>window.FWInterimArt.ready);await screenshot('map');await page.getByRole('button',{name:'Skill tree',exact:true}).click();
  ok(await page.locator('#skillPane [data-node-id]').count()===228,'all 228 ordinary nodes visible after gateways');await page.locator('#fwZoomOut').click();ok(await page.locator('#fwTreeWorld').evaluate(e=>Number(e.style.zoom)<1),'tree zoom');await page.locator('[data-node-id="O-1-G1"]').click();ok(await page.locator('#fwNodeBuy').isVisible(),'actual purchase detail');await page.locator('#fwNodeClose').click();await screenshot('tree');
  for(const id of ['O-SP05','O-SP06','O-SP07','O-SP09'])ok(await page.locator('[data-node-id="'+id+'"]').count()===1,id+' accessible');
  await page.locator('#skillLegacyTab').click();await checkWidth();ok(await page.locator('#skillPane [data-node-id]').count()===120,'all 120 Legacy nodes visible');
  await page.locator('#skillSkinsTab').click();ok(await page.locator('.fw-hero-card').count()===15,'15 live hero cards');await screenshot('collection');await page.locator('[data-profile="knight"]').click();ok(await page.locator('#skillDetails').innerText().then(t=>t.includes('Sword Strike')&&!t.includes('undefined')),'real hero profile stats');await page.locator('#fwProfileClose').click();ok(await page.locator('#fwSkinBox').isVisible(),'collection uses live skin economy');
  await page.locator('#skillBackupTab').click();ok(await page.locator('#fwExport').isVisible(),'backup accessible');
  await page.locator('#closeSkillTree').click();ok(!(await page.locator('#skillModal').isVisible()),'modal closes');
  ok(errors.length===0,'no page errors: '+errors.join('; '));console.log(engine+' '+viewport.width+'x'+viewport.height+' passed');await context.close();
 }
 console.log('Production UI: '+checks+' browser assertions passed across desktop and touch-sized '+engine+'.');
}finally{await browser?.close();await new Promise(r=>server.close(r))}
