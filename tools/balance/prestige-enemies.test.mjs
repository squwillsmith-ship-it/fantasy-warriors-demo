import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),P=require('../../prestige-enemies.js');
let checks=0;
const ok=(v,m)=>{assert.ok(v,m);checks++},eq=(a,b,m)=>{assert.equal(a,b,m);checks++};
const counts=[48,56,84,76,88,96,108,114,126,138];
for(let p=0;p<=30;p++)for(let stage=1;stage<=10;stage++)for(const protection of [false,true]){
 const total=counts[stage-1],w=P.plan(stage,total,p,protection);
 eq(w.slots.length,total);
 eq(w.slots.filter(k=>k==='elite').length,w.eliteQuota);
 eq(w.slots.filter(k=>k==='mutated').length,w.mutationQuota);
 ok(w.slots.slice(0,Math.ceil(total*.30)).every(k=>k!=='elite'));
 eq(w.eliteQuota,protection||p<Math.ceil(stage/2)?0:Math.floor(total*Math.min(.18,.04+.03*(p-Math.ceil(stage/2)))+.5));
 eq(w.mutationQuota,protection?0:Math.min(total-w.eliteQuota,Math.max(0,p-3)));
 eq(w.faction,!protection&&p>=5&&(stage%2===0||p>=6+Math.floor(stage/2)));
 for(let i=0;i<total;i++)if(w.slots[i]==='elite')eq(P.slotKind(w,i,w.eliteCap),'basic');
}
for(let p=0;p<12;p++){const b=P.scale({hp:10,damage:5,speed:1,attackPeriod:2},p),m=P.scale({hp:10,damage:5,speed:1,attackPeriod:2},p,true);eq(m.hp,b.hp*2);eq(m.damage,b.damage*2);eq(m.speed,b.speed);eq(m.attackPeriod,b.attackPeriod)}
const e={stage:10,hp:20,x:0,y:0},near=Array.from({length:5},(_,i)=>({stage:10,hp:20,x:i*.1,y:.5}));eq(P.resistance(e,[e,...near]),.4);eq(P.damageAfterResistance(10,e,[e,...near]),6);eq(P.damageAfterResistance(10,e,[e,...near],true),7);eq(P.resistance({...e,elite:true},near),0);
eq(P.legion(2,0,7.5,0).hp,34);eq(P.legion(2,1,7.5,0).hp,27);eq(P.legion(2,2,7.5,0).hp,41);
console.log(checks+' prestige assertions passed');
