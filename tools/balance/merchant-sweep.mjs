import {readFile,writeFile} from 'node:fs/promises';
const current=await readFile(new URL('../../merchant.js',import.meta.url),'utf8');

function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
const flags=(...nums)=>nums.map(n=>'R-M'+String(n).padStart(2,'0'));
const cases=[{name:'Opening',tiers:[0],slots:3,coins:2,flags:[]},{name:'Early prestige',tiers:[0,1],slots:4,coins:8,flags:flags(1,7,10)},{name:'Mid campaign',tiers:[0,1,2],slots:5,coins:16,flags:flags(1,2,7,10,14)},{name:'Late campaign',tiers:[0,1,2,3,4],slots:6,coins:28,flags:flags(1,2,7,10,11,14,15,18,19)},{name:'Full merchant',tiers:[0,1,2,3,4],slots:6,coins:40,flags:flags(...Array.from({length:20},(_,i)=>i+1)),commission:'dragonkin'}];
function select(M,shop,budget,policy){
 let best={score:-1,mask:0,coins:budget,units:0};
 for(let mask=1;mask<(1<<shop.offers.length);mask++){
  let cost=0,score=0,units=0,std=false;
  for(let i=0;i<shop.offers.length;i++)if(mask&(1<<i)){const o=shop.offers[i];cost+=Math.max(o.qty,o.listPrice-(o.discount||0));std||=o.type==='standard'&&!o.discount&&o.listPrice>o.qty;units+=o.qty;const t=o.type==='mixed'?(o.packIndex+o.other)/2:o.packIndex;score+=o.qty*(policy==='quantity'?1:1+.22*t)+(o.type==='golden'?.3:0)}
  if(std&&shop.firstDiscount&&!shop.firstUsed)cost--;
  if(cost<=budget&&(score>best.score+1e-8||Math.abs(score-best.score)<1e-8&&cost<budget-best.coins))best={score,mask,coins:budget-cost,units};
 }
 const indices=shop.offers.map((o,i)=>i).filter(i=>best.mask&(1<<i));
 if(shop.firstDiscount)indices.sort((a,b)=>Number(shop.offers[b].type==='standard'&&!shop.offers[b].discount)-Number(shop.offers[a].type==='standard'&&!shop.offers[a].discount));
 let remaining=budget;for(const i of indices){remaining=M.buy(shop,i,remaining);if(remaining===null)throw Error('invalid optimizer');shop.offers[i].order=indices.indexOf(i)}
 return {...best,coins:remaining};
}
function sweep(src,count=2500){const w={};new Function('window',src)(w);const M=w.FWMerchant,out=[];
 for(let ci=0;ci<cases.length;ci++)for(const policy of ['quantity','tier']){
 const c=cases[ci],rnd=rng(271150+ci),s={n:count,units:0,unused:0,bulkStock:0,bulkBuy:0,advanced:0,zero:0,top:0,category:{},offerCategory:{},curated:0,curatedBuy:0};
 let pity=[0,0,0,0,0];for(let j=0;j<count;j++){
  const shop=M.roll(c,rnd);if(M.price(shop.offers[0],shop)>c.coins)throw Error('unaffordable opening');if(shop.offers.some(o=>o.qty>1))s.bulkStock++;if(shop.offers.some(o=>o.anchor==='curated'))s.curated++;for(const o of shop.offers)s.offerCategory[o.type]=(s.offerCategory[o.type]||0)+1;
  const sel=select(M,shop,c.coins,policy);const sold=shop.offers.filter(o=>o.sold);if(sold.some(o=>o.qty>1))s.bulkBuy++;if(sold.some(o=>o.anchor==='curated'))s.curatedBuy++;if(sold.some(o=>o.type!=='standard'))s.advanced++;for(const o of sold)s.category[o.type]=(s.category[o.type]||0)+1;
  const draw=M.resolve(shop,pity,rnd);pity=draw.pity;s.units+=draw.heroes.length;s.unused+=sel.coins;s.top+=draw.heroes.filter(id=>M.data.heroes.find(h=>h.id===id).pack===c.tiers.at(-1)).length;if(!draw.heroes.length)s.zero++;
 }
 out.push({case:c.name,policy,...s,meanUnits:s.units/count,meanUnused:s.unused/count,meanNewest:s.top/count});
 }return out;}

const result=sweep(current,2500);await writeFile(new URL('./merchant-sweep-live.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(result);