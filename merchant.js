/* Merchant v1.16: portable deterministic-input economy. */
(function(root){const data={"packs":[{"name":"Recruit","stage":1,"pool":["knight","archer","mage"],"price":2,"weights":[0.5,0.35,0.15],"rarest":"mage"},{"name":"Outlaw","stage":null,"pool":["hunter","barbarian","rogue"],"price":3,"weights":[0.5,0.25,0.25],"rarest":"barbarian"},{"name":"Devotion","stage":null,"pool":["paladin","nun","priest"],"price":4,"weights":[0.35,0.45,0.2],"rarest":"priest"},{"name":"Occult","stage":null,"pool":["shaman","druid","warlock"],"price":4,"weights":[0.45,0.35,0.2],"rarest":"warlock"},{"name":"Mythic","stage":null,"pool":["beastmaster","necromancer","dragonkin"],"price":5,"weights":[0.55,0.3,0.15],"rarest":"dragonkin"}],"heroes":[{"id":"knight","name":"Knight","rarity":"Common","pack":0},{"id":"archer","name":"Archer","rarity":"Uncommon","pack":0},{"id":"mage","name":"Mage","rarity":"Legendary","pack":0},{"id":"hunter","name":"Hunter","rarity":"Common","pack":1},{"id":"barbarian","name":"Barbarian","rarity":"Rare","pack":1},{"id":"rogue","name":"Rogue","rarity":"Uncommon","pack":1},{"id":"paladin","name":"Paladin","rarity":"Rare","pack":2},{"id":"nun","name":"Nun","rarity":"Uncommon","pack":2},{"id":"priest","name":"Priest","rarity":"Epic","pack":2},{"id":"shaman","name":"Shaman","rarity":"Uncommon","pack":3},{"id":"druid","name":"Druid","rarity":"Rare","pack":3},{"id":"warlock","name":"Warlock","rarity":"Epic","pack":3},{"id":"beastmaster","name":"Beastmaster","rarity":"Rare","pack":4},{"id":"necromancer","name":"Necromancer","rarity":"Epic","pack":4},{"id":"dragonkin","name":"Dragonkin","rarity":"Legendary","pack":4}],"nodes":[{"id":"R-M01","name":"Extra Counter","cost":1,"prerequisites":"ROOT","effect":"Capacity | +1 initial shop slot."},{"id":"R-M02","name":"Second Look","cost":2,"prerequisites":"R-M01","effect":"Control | One free reroll per preparation, only unsold unreserved slots."},{"id":"R-M03","name":"Hold That Offer","cost":2,"prerequisites":"R-M02","effect":"Control | Reserve one unsold offer against rerolls this preparation; release or buy it normally. Does not carry across attempts."},{"id":"R-M04","name":"Haggler","cost":4,"prerequisites":"R-M03","effect":"Discount | Each completed reroll gives eligible newly rolled ordinary standard packs a +15 percentage-point chance of a 1-coin discount, capped at 45% this preparation; reset next attempt."},{"id":"R-M05","name":"Fresh Delivery","cost":5,"prerequisites":"R-M04","effect":"Control | +1 free reroll per preparation, separate finite charge."},{"id":"R-M06","name":"Paid Search","cost":3,"prerequisites":"R-M02","effect":"Control | After free charges are used, allow up to two paid rerolls per preparation at 1 coin each; no free stock restoration."},{"id":"R-M07","name":"First Purchase","cost":3,"prerequisites":"R-M01","effect":"Discount | First purchased ordinary standard pack each preparation costs 1 coin less, floor 1. Nonstacking with other offer discounts."},{"id":"R-M08","name":"Marked Down","cost":4,"prerequisites":"R-M07","effect":"Discount | Eligible advanced products have a 20% chance of a 1-coin discount on creation; floor 1, not stackable with other discounts."},{"id":"R-M09","name":"Bulk Bargain","cost":5,"prerequisites":"R-M08","effect":"Discount | One eligible booster box, Golden or mixed bundle per preparation may receive a guaranteed 1-coin discount on first eligible appearance; no stacking with other discounts."},{"id":"R-M10","name":"Hirelings","cost":2,"prerequisites":"R-M01","effect":"Product | Enable guaranteed individual hero offers from currently eligible pack pools; retain approved relative class prices; Uncommon/Legendary values unresolved."},{"id":"R-M11","name":"Contract Board","cost":3,"prerequisites":"R-M10","effect":"Control | Reserve one initial unsold slot for an eligible individual hero offer when possible; affordable opening guarantee takes priority."},{"id":"R-M12","name":"Double Contract","cost":5,"prerequisites":"R-M10","effect":"Product | Unlock a product containing two guaranteed copies of the offered hero; provisional price max(2,2× individual price−1), each copy rolls its skin independently."},{"id":"R-M13","name":"Triple Contract","cost":8,"prerequisites":"R-M12","effect":"Product | Unlock a product containing three guaranteed copies of the offered hero; provisional price max(3,3× individual price−1), independent skins."},{"id":"R-M14","name":"Crate Dealer","cost":3,"prerequisites":"R-M10","effect":"Product | Enable booster-box offers, provisionally three normal packs of one eligible tier at 3× its standard pack price−1 (minimum 3 after discounts); normal independent hero and skin rolls."},{"id":"R-M15","name":"Gilded Seal","cost":6,"prerequisites":"R-M14","effect":"Product | Enable Golden/Shiny full-roster offer: all three distinct eligible heroes from one pack; selected price 3× standard pack price, minimum 3; each skin rolls independently."},{"id":"R-M16","name":"Crossroads Trade","cost":8,"prerequisites":"R-M15","effect":"Product | Enable mixed product containing two standard packs of two different currently accessible tiers; proposed price sum of their ordinary pack prices−1, minimum 2."},{"id":"R-M17","name":"Hidden Compartment","cost":10,"prerequisites":"R-M14","effect":"Bonus pack | Once per preparation, first purchased eligible non-Recruit standard pack has a 25% chance to include one bonus ordinary Recruit pack. Bonus does not consume stock or recursively grant another; original pack still draws exactly one hero."},{"id":"R-M18","name":"Larger Stall","cost":5,"prerequisites":"R-M01","effect":"Capacity | +1 additional initial shop slot."},{"id":"R-M19","name":"Curated Shelf","cost":4,"prerequisites":"R-M18","effect":"Control | Guarantee an additional initial advanced product slot, prioritising unlocked multi-hero products (double, triple, booster box, Golden or mixed); otherwise an eligible individual offer. Recruit, newest and commission/contract anchors retain priority. No additional slots."},{"id":"R-M20","name":"Personal Commission","cost":12,"prerequisites":"R-M11","effect":"Control | Before initial stock generation choose one eligible discovered hero class as commission target; one initial individual offer guarantees that class if possible, using the existing individual price. No guaranteed skin or free hero; affordable guarantee takes priority and only one commission per preparation."}]};const api=(function merchantFactory(data){
 'use strict';
 const packs=data.packs,hero=Object.fromEntries(data.heroes.map(h=>[h.id,h])),nodes=data.nodes;
 const weights={standard:40,individual:22,double:7,triple:4,box:15,golden:7,mixed:5},unlock={individual:'R-M10',double:'R-M12',triple:'R-M13',box:'R-M14',golden:'R-M15',mixed:'R-M16'};
 const offsets={Common:-1,Uncommon:0,Rare:0,Epic:1,Legendary:2};
 const pick=(a,w,r)=>{let t=r()*w.reduce((s,v)=>s+v,0);for(let i=0;i<a.length;i++){t-=w[i];if(t<0)return a[i]}return a[a.length-1]};
 const allowed=(type,tiers,has)=>type==='standard'||(has(unlock[type])&&(type!=='mixed'||tiers.length>=2));
 const individualPrice=id=>Math.max(1,packs[hero[id].pack].price+offsets[hero[id].rarity]);
 function create(type,tier,tiers,has,r,forcedHero=null){
  if(!allowed(type,tiers,has))throw Error('Locked product '+type);
  const p=packs[tier],id=['individual','double','triple'].includes(type)?forcedHero||pick(p.pool,p.weights,r):null;
  const other=type==='mixed'?pick(tiers.filter(x=>x!==tier),tiers.filter(x=>x!==tier).map(()=>1),r):null;
  const qty=type==='individual'||type==='standard'?1:type==='double'||type==='mixed'?2:3;
  const price=type==='standard'?p.price:type==='individual'?individualPrice(id):type==='double'?Math.max(2,2*individualPrice(id)-1):type==='triple'?Math.max(3,3*individualPrice(id)-1):type==='box'?3*p.price-1:type==='golden'?3*p.price:p.price+packs[other].price-1;
  return {type,packIndex:tier,other,heroId:id,qty,listPrice:price,discount:0,sold:false,anchor:null,reserved:false};
 }
 const label=o=>o.type==='standard'?packs[o.packIndex].name+' Pack':o.type==='box'?packs[o.packIndex].name+' Booster Box':o.type==='golden'?'Golden '+packs[o.packIndex].name:o.type==='mixed'?packs[o.packIndex].name+' + '+packs[o.other].name:hero[o.heroId].name+(o.qty>1?' ×'+o.qty:' Contract');
 const price=(o,shop)=>Math.max(o.qty,o.listPrice-Math.max(o.discount||0,o.type==='standard'&&shop.firstDiscount&&!shop.firstUsed?1:0));
 function category(tiers,has,r,advanced=false){
  const cats=Object.keys(weights).filter(k=>allowed(k,tiers,has)&&(!advanced||k!=='standard'));
  if(!cats.length)return 'standard';
  const transfer=Object.keys(weights).filter(k=>!allowed(k,tiers,has)).reduce((n,k)=>n+weights[k],0);
  return pick(cats,cats.map(k=>weights[k]+(k==='standard'?transfer:0)),r);
 }
 function randomOffer(shop,r,advanced=false){
  const has=id=>shop.flags.includes(id),tier=pick(shop.tiers,shop.tiers.map(x=>x+1),r);
  return create(category(shop.tiers,has,r,advanced),tier,shop.tiers,has,r);
 }
 function applyDiscount(o,shop,r){
  if(o.type==='standard'&&shop.flags.includes('R-M04')&&r()<Math.min(.45,.15*shop.rerolls))o.discount=1;
  if(o.type!=='standard'&&shop.flags.includes('R-M08')&&r()<.2)o.discount=1;
  if(['box','golden','mixed'].includes(o.type)&&shop.flags.includes('R-M09')&&!shop.bulkUsed){o.discount=1;shop.bulkUsed=true;}
 }
 function roll({tiers,slots,flags=[],firstDiscount=false,commission=null},r=Math.random){
  tiers=[...new Set([0,...tiers])].sort((a,b)=>a-b);
  const has=id=>flags.includes(id),shop={tiers,flags:[...flags],firstDiscount:firstDiscount||has('R-M07'),firstUsed:false,bulkUsed:false,rerolls:0,free:(has('R-M02')?1:0)+(has('R-M05')?1:0),paid:has('R-M06')?2:0,offers:[]};
  slots=Math.max(1,Math.min(6,Math.floor(slots)));
  const put=(o,anchor)=>{if(shop.offers.length>=slots)return false;o.anchor=anchor;shop.offers.push(o);return true};
  put(create('standard',0,tiers,has,r),'recruit');
  if(tiers.length>1)put(create('standard',tiers.at(-1),tiers,has,r),'newest');
  if(has('R-M20')&&hero[commission]&&tiers.includes(hero[commission].pack))put(create('individual',hero[commission].pack,tiers,has,r,commission),'commission');
  if(has('R-M11')&&!shop.offers.some(o=>o.type==='individual'))put(create('individual',pick(tiers,tiers.map(x=>x+1),r),tiers,has,r),'contract');
  if(has('R-M19')){const bulk=['double','triple','box','golden','mixed'].filter(k=>allowed(k,tiers,has));if(bulk.length){const tier=pick(tiers,tiers.map(x=>x+1),r);put(create(pick(bulk,bulk.map(k=>weights[k]),r),tier,tiers,has,r),'curated');}else if(allowed('individual',tiers,has))put(randomOffer(shop,r,true),'curated');}
  if(!shop.offers.some(o=>o.type!=='standard')&&Object.keys(unlock).some(k=>allowed(k,tiers,has)))put(randomOffer(shop,r,true),'advanced');
  while(shop.offers.length<slots)shop.offers.push(randomOffer(shop,r));
  for(const o of shop.offers)applyDiscount(o,shop,r);
  return shop;
 }
 function reroll(shop,coins,r=Math.random){
  const slots=shop.offers.map((o,i)=>!o.sold&&!o.anchor&&!o.reserved?i:-1).filter(i=>i>=0);
  if(!slots.length||(!shop.free&&(!shop.paid||coins<1)))return null;
  if(shop.free)shop.free--;else{shop.paid--;coins--}
  shop.rerolls++;for(const i of slots){const o=randomOffer(shop,r);applyDiscount(o,shop,r);shop.offers[i]=o}
  return coins;
 }
 function reserve(shop,i){const o=shop.offers[i];if(!shop.flags.includes('R-M03')||!o||o.sold||o.anchor)return false;const next=!o.reserved;for(const x of shop.offers)x.reserved=false;o.reserved=next;return true}
 function buy(shop,i,coins){const o=shop.offers[i];if(!o||o.sold)return null;const cost=price(o,shop);if(coins<cost)return null;o.sold=true;o.paidPrice=cost;if(o.type==='standard')shop.firstUsed=true;return coins-cost}
 function draw(tier,pity,r=Math.random){const p=packs[tier];const id=pity[tier]>=7?p.rarest:pick(p.pool,p.weights,r);pity[tier]=id===p.rarest?0:(pity[tier]||0)+1;return id}
 function resolve(shop,ledger,r=Math.random){
  const pity=[...ledger],heroes=[],packOpens=[0,0,0,0,0];let hidden=false;
  const random=t=>{heroes.push(draw(t,pity,r));packOpens[t]++};
  for(const o of shop.offers.filter(x=>x.sold).sort((a,b)=>(a.order??0)-(b.order??0))){
   if(o.type==='standard'){random(o.packIndex);if(!hidden&&o.packIndex>0&&shop.flags.includes('R-M17')){hidden=true;if(r()<.25)random(0)}}
   else if(o.type==='box')for(let j=0;j<3;j++)random(o.packIndex);
   else if(o.type==='mixed'){random(o.packIndex);random(o.other)}
   else if(o.type==='golden'){heroes.push(...packs[o.packIndex].pool);packOpens[o.packIndex]++}
   else for(let j=0;j<o.qty;j++)heroes.push(o.heroId);
  }
  return {heroes,pity,packOpens};
 }
 return {data,roll,reroll,reserve,buy,draw,resolve,label,price,individualPrice};
})(data);if(typeof module==='object'&&module.exports)module.exports=api;else root.FWMerchant=api;})(typeof window!=='undefined'?window:globalThis);
