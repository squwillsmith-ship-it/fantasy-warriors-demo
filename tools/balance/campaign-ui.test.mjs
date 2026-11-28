// Exercise the production index and actual event handlers in Chromium.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
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
const openShop=async page=>{await page.getByRole('button',{name:'Continue campaign',exact:true}).click();await visible(page,'.fw-live-map');await page.locator('.fw-live-region[data-state=current]').click();await visible(page,'.fw-live-shop')};
try{
 browser=await chromium.launch({headless:true});
 for(const viewport of [{width:1280,height:800},{width:390,height:844}]){
  const context=await browser.newContext({viewport,hasTouch:viewport.width<500});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await visible(page,'.fw-live-menu');
  await openShop(page);let s=await snapshot(page);
  ok(s.stage===1&&s.coins===2&&s.shopOffers.length===3,'fresh merchant');ok(await page.locator('#buyButton').isEnabled(),'guaranteed affordable opening offer');
  await page.locator('#buyButton').click();s=await snapshot(page);ok(s.bought===1&&s.coins===0,'purchase uses live engine');
  await page.reload();await openShop(page);s=await snapshot(page);ok(s.bought===1&&s.coins===0,'purchased stock survives reload');
  await page.locator('#stageButton').click();await visible(page,'.battleground');
  s=await snapshot(page);ok(s.mode==='battle'&&s.heroes.length===1,'real deployment');ok(await page.locator('.fw-live-roster-buttons button').count()===1,'live hero inspection');
  await visible(page,'.fw-live-portrait');await page.locator('#pauseButton').click();ok((await snapshot(page)).paused,'pause through actual control');await page.locator('#pauseButton').click();ok(!(await snapshot(page)).paused,'resume through actual control');
  const box=await page.locator('#arena').boundingBox();ok(!!box&&box.width>100&&box.height>100,'visible arena');ok(Math.abs(box.width/box.height-1.5)<.04,'stable arena ratio');
  await page.reload();await openShop(page);s=await snapshot(page);ok(s.mode==='prep'&&s.bought===0&&s.skillTree.up===0,'abandoned battle is not rewarded');
  // Seed a late-campaign fixture in this disposable browser context only.
  await page.evaluate(()=>{const tree=window.FW_SKILL_DATA;localStorage.setItem('fantasy-warriors-skilltree-1.1',JSON.stringify({treeSchema:2,up:10000,shards:10000,resets:5,campaignStage:10,runHighest:9,highestClear:9,runWins:9,gateways:[2,3,4,5],kills:Object.fromEntries(tree.heroes.map(id=>[id,10000])),nodes:[],legacyNodes:[],runClears:[1,2,3,4,5,6,7,8,9],discoveredHeroes:tree.heroes}));});
  await page.reload();await page.getByRole('button',{name:'Continue campaign',exact:true}).click();await page.getByRole('button',{name:'Upgrades',exact:true}).click();
  ok(await page.locator('#skillPane [data-node-id]').count()===228,'all 228 ordinary nodes visible');
  for(const id of ['O-SP05','O-SP06','O-SP07','O-SP09'])ok(await page.locator('[data-node-id="'+id+'"]').count()===1,id+' accessible');
  await page.locator('#skillLegacyTab').click();ok(await page.locator('#skillPane [data-node-id]').count()===120,'all 120 Legacy nodes visible');
  await page.locator('#skillSkinsTab').click();ok(await page.locator('#fwSkinBox').isVisible(),'collection uses live skin economy');
  await page.locator('#skillBackupTab').click();ok(await page.locator('#fwExport').isVisible(),'backup accessible');
  await page.locator('#closeSkillTree').click();ok(!(await page.locator('#skillModal').isVisible()),'modal closes');
  ok(errors.length===0,'no page errors: '+errors.join('; '));await context.close();
 }
 console.log('Production UI: '+checks+' browser assertions passed across desktop and touch-sized Chromium.');
}finally{await browser?.close();await new Promise(r=>server.close(r))}
