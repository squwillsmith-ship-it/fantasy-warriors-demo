import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),E=require('../../endless.js');
let checks=0;const eq=(a,b)=>{assert.equal(a,b);checks++},ok=v=>{assert.ok(v);checks++};
const c=[.8,1,.55,1,1.15,1.15,.75,.95,1.1,1.25];
for(let w=1;w<=1000;w++){const a=E.wave(w);eq(a.family,1+(w-1)%10);eq(a.boss,w%5===0?1+(w/5-1)%10:0);eq(a.slots,Math.min(120,Math.floor(80/c[a.family-1]+.5)+2*(w-1)));ok(a.hp>=1&&a.damage>=1&&a.speed<=1.35);const v=E.scale({hp:33,damage:10.5,speed:1,attackPeriod:1,firstDelay:.65},w);ok(Object.values(v).every(Number.isFinite));for(let p=0;p<=10;p++)eq(E.invasion(w,p),w%5===0&&p>=5&&(w%10===0||p>=6+Math.floor(((w/5-1)%10)/2)));}
eq(E.wave(1).slots,100);eq(E.wave(5).slots,78);eq(E.wave(10).slots,82);eq(E.wave(20).slots,102);eq(E.wave(30).slots,120);eq(E.interval(.55),.4675);eq(E.interval(.3),.45);eq(E.valid(0),false);eq(E.valid(Infinity),false);
console.log(checks+' Endless formula assertions passed');
