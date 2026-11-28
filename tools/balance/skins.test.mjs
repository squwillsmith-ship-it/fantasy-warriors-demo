import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),S=require('../../skins.js'),M=require('../../merchant.js');
const heroes=M.data.heroes,all=S.catalog(heroes),eligible=all.filter(s=>s.key!=='default'),id=heroes[0].id;
let checks=0;const eq=(a,b,m)=>{assert.equal(a,b,m);checks++},ok=(v,m)=>{assert.ok(v,m);checks++};
eq(all.length,75);eq(eligible.length,60);eq(S.eligible(heroes,[id]).length,4);
const input={heroes,discovered:[id],owned:[],streak:0,balanceCents:1000,prestige:3};
eq(S.open({...input,prestige:2},()=>0).ok,false);eq(S.open({...input,balanceCents:99},()=>0).ok,false);eq(S.open({...input,discovered:[]},()=>0).ok,false);
let a=S.open(input,()=>0);eq(a.skin.id,id+':azure');eq(a.balanceCents,900);eq(a.streak,0);eq(a.duplicate,false);
for(let i=1;i<=3;i++){a=S.open({...input,owned:a.owned,streak:a.streak,balanceCents:a.balanceCents},()=>0);eq(a.duplicate,true);eq(a.streak,i);eq(a.refundCents,5);eq(a.balanceCents,900-95*i)}
a=S.open({...input,owned:a.owned,streak:a.streak,balanceCents:a.balanceCents},()=>0);eq(a.duplicate,false);eq(a.skin.id,id+':ember');eq(a.streak,0);eq(a.balanceCents,515);
eq(S.open({...input,owned:eligible.filter(s=>s.heroId===id).map(s=>s.id)},()=>0).ok,false);
eq(S.draw(heroes,id,[],()=>.999).key,'default');eq(S.draw(heroes,id,[id+':epic'],()=>.9).key,'epic');
eq(S.draw(heroes,id,[id+':legendary'],()=>.99).key,'legendary');eq(S.draw(heroes,id,eligible.map(s=>s.id),()=>.74).rarity,'Common');eq(S.draw(heroes,id,eligible.map(s=>s.id),()=>.75).rarity,'Epic');eq(S.draw(heroes,id,eligible.map(s=>s.id),()=>.95).rarity,'Legendary');
const base={id,hp:23.75,damage:4.2,speed:.75,walk:1.78,rarity:'Common',color:'#8893a4'};
for(const skin of all.filter(s=>s.heroId===id)){const h=S.apply(base,skin);eq(h.hp,base.hp*skin.multiplier);eq(h.damage,base.damage*skin.multiplier);eq(h.speed,base.speed);eq(h.walk,base.walk);eq(h.rarity,base.rarity)}eq(base.hp,23.75);eq(base.damage,4.2);
let seed=271128;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const unlocked=eligible.map(s=>s.id),freq={Common:0,Epic:0,Legendary:0},loot={Common:0,Epic:0,Legendary:0};
for(let i=0;i<30000;i++){const s=S.draw(heroes,id,unlocked,rng);freq[s.rarity]++;const b=S.open({...input,discovered:heroes.map(h=>h.id)},rng);loot[b.skin.rarity]++}
for(const [k,w] of Object.entries({Common:.75,Epic:.2,Legendary:.05}))ok(Math.abs(freq[k]/30000-w)<.012,'deployment odds '+k);
for(const [k,w] of Object.entries({Common:.6,Epic:.3,Legendary:.1}))ok(Math.abs(loot[k]/30000-w)<.012,'box odds '+k);
let collections=[];for(let i=0;i<100;i++){let state={...input,discovered:heroes.map(h=>h.id),balanceCents:100000},boxes=0;while(state.owned.length<60&&boxes<1000){const result=S.open(state,rng);ok(result.ok);state={...state,owned:result.owned,streak:result.streak,balanceCents:result.balanceCents};boxes++;}eq(state.owned.length,60);collections.push(boxes)}
console.log(JSON.stringify({checks,deployments:freq,lootBoxes:loot,meanBoxes:collections.reduce((s,n)=>s+n,0)/collections.length}));
