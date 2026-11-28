import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),B=require('../../boss-abilities.js');
let checks=0;const eq=(a,b,m)=>{assert.equal(a,b,m);checks++},ok=(v,m)=>{assert.ok(v,m);checks++},near=(a,b,m)=>ok(Math.abs(a-b)<1e-6,m||a+' != '+b);
function setup(stage,phase=1){
 const h=(id,x,y)=>({id,x,y,hp:100,maxHp:100,base:{id:'knight'}});
 const e={id:10,stage,phase,boss:true,x:0,y:0,hp:200,maxHp:500};
 const state={elapsed:0,heroes:[h(1,1,0),h(2,1.8,0),h(3,0,1.5),h(4,8,0)],enemies:[e]};
 let tower=100;let api;
 const hit=(a,d,source,linked=false)=>{const actual=Math.min(a.hp,d);a.hp-=actual;api.share(a,actual,source,linked);return actual};
 api=B.create({state,heroList:()=>state.heroes,hitHero:hit,hitTower:d=>tower-=d,spawnGenerated:(owner,stats,kind,x,y)=>state.enemies.push({id:100+state.enemies.length,ownerId:owner.id,...stats,kind,x,y}),ring:()=>{},beam:()=>{},scale:()=>1,arenaRadius:()=>12,log:()=>{}});api.init(e);
 return {e,state,api,hit,tower:()=>tower,fire(t){state.elapsed=t;return api.step(e)},advance(dt,n){for(let i=0;i<n;i++){state.elapsed+=dt;api.tick(dt)}}}
}
let q=setup(2);q.fire(10);eq(q.state.heroes.filter(h=>h.rootedUntil===12).length,2);
q=setup(3);ok(q.fire(9));eq(q.e.signature.radius,2.8);q.fire(10);eq(q.state.heroes[0].hp,100);q.fire(10.2);eq(q.state.heroes[0].hp,86);eq(q.state.heroes[3].hp,100);
q=setup(4);q.fire(9);eq(q.state.heroes[0].hp,88);eq(q.state.heroes[1].hp,92);eq(q.state.heroes[2].hp,100); // third hero outside bounce radius from second
q=setup(5);ok(q.fire(10));eq(q.e.signature.type,'cone');q.fire(11);eq(q.state.heroes[0].hp,87);eq(q.state.heroes[1].hp,87);eq(q.state.heroes[2].hp,100);q.advance(.05,60);near(q.state.heroes[0].hp,84);near(q.state.heroes[1].hp,84);
q=setup(6);q.fire(12);q.advance(.05,50);for(const h of q.state.heroes)near(h.hp,97);near(q.tower(),98);q.advance(.05,50);near(q.tower(),98);
q=setup(7);q.fire(10);q.advance(.05,60);for(const h of q.state.heroes.slice(0,3))near(h.hp,94);near(q.state.heroes[3].hp,100);near(q.e.hp,209);
q=setup(8);q.fire(12);eq(q.state.enemies.length,5);q.fire(24);eq(q.state.enemies.length,9);q.fire(36);eq(q.state.enemies.length,11);q.fire(48);eq(q.state.enemies.length,11);q.api.die(q.e);ok(q.state.enemies.slice(1).every(e=>e.expired&&e.hp===0));
q=setup(9);q.fire(11);const linked=q.state.heroes.filter(h=>h.covenantUntil===16);eq(linked.length,3);q.hit(linked[0],10,q.e);eq(linked[0].hp,90);eq(linked[1].hp,97);eq(linked[2].hp,97);eq(q.state.heroes[3].hp,100);q.state.elapsed=17;q.hit(linked[0],10,q.e);eq(linked[1].hp,97);
for(let phase=1;phase<=3;phase++){q=setup(10,phase);const r=B.rules[10].phases[phase-1];ok(q.fire(r.cooldown));eq(q.e.signature.radius,r.radius);eq(q.e.signature.at,r.cooldown+r.warning);q.fire(r.cooldown+r.warning);eq(q.state.heroes[0].hp,100-r.damage);eq(q.state.heroes[3].hp,100);eq(q.e.signature,null)}
console.log(checks+' boss signature assertions passed');
