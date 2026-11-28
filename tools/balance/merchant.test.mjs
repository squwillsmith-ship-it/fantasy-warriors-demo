import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),M=require('../../merchant.js');
let seed=42,checks=0;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const check=(ok,message)=>{assert.ok(ok,message);checks++};
const flags=M.data.nodes.map(n=>n.id);
for(let k=0;k<500;k++){
 const t=k%5+1,shop=M.roll({tiers:Array.from({length:t},(_,i)=>i),slots:3+k%4,flags:k%2?flags:[]},random);
 check(shop.offers[0].packIndex===0&&M.price(shop.offers[0],shop)<=2,'affordable recruit');
 if(t>1)check(shop.offers[1].packIndex===t-1,'newest anchor');
 check(shop.offers.every(o=>o.packIndex<t&&(o.other===null||o.other<t)&&M.price(o,shop)>=o.qty),'tier eligibility and price floor');
 let coins=40;
 for(let i=0;i<shop.offers.length;i++){const v=M.buy(shop,i,coins);if(v!==null){coins=v;shop.offers[i].order=i;check(M.buy(shop,i,coins)===null,'no duplicate sale')}}
 const plan=M.resolve(JSON.parse(JSON.stringify(shop)),[0,0,0,0,0],random);
 check(plan.heroes.every(id=>M.data.heroes.some(h=>h.id===id)),'valid hero');
 check(plan.pity.every(v=>v>=0&&v<=7),'pity range');
}
for(let t=0;t<5;t++){const pity=[0,0,0,0,0];for(let i=0;i<7;i++)M.draw(t,pity,()=>0);check(M.draw(t,pity,()=>0)===M.data.packs[t].rarest,'eighth draw');}
const shop=M.roll({tiers:[0,1],slots:6,flags},random);
const anchor=JSON.stringify(shop.offers[0]);const i=shop.offers.findIndex(o=>!o.anchor);
check(i>=0,'non-anchor exists');check(M.reserve(shop,i),'reserve');const reserved=JSON.stringify(shop.offers[i]);
check(M.reroll(shop,40,random)===40,'free reroll');check(JSON.stringify(shop.offers[0])===anchor,'anchor preserved');check(JSON.stringify(shop.offers[i])===reserved,'reservation preserved');
check(M.buy(shop,i,40)!==null,'purchase reserved');const sold=JSON.stringify(shop.offers[i]);M.reroll(shop,40,random);check(JSON.stringify(shop.offers[i])===sold,'sold remains locked');
console.log(checks+' merchant assertions passed');
