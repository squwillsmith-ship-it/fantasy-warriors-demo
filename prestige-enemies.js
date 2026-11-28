/* Prestige encounter scheduling and scaling, independent of renderer and saves. */
(function(root){'use strict';
const factionNames=['Legion Champion','Legion Sorcerer','Legion Executioner'];
const references=[30,34,45,53,61,77,85,101,110,127];
const eliteNames=['Trickster Slime','Fungal Healer','Goblin Thief','Bandit Saboteur','Kobold Firecaller','Sacred Inquisitor','Hellhound','Cursed Bone Pile','Shadow Assassin','Rift Caster'];
const finitePrestige=p=>Math.max(0,Math.min(1000,Math.floor(Number(p)||0)));
const round=n=>Math.floor(n+.5);
function factors(p){p=finitePrestige(p);return{hpDamage:1.08**p,moveRate:1.02**p}}
function scale(stats,p,mutated=false){const f=factors(p),m=mutated?2:1;return {...stats,hp:stats.hp*f.hpDamage*m,damage:stats.damage*f.hpDamage*m,speed:stats.speed*f.moveRate,attackPeriod:(stats.attackPeriod??1)/f.moveRate,firstDelay:(stats.firstDelay??.65)/f.moveRate}}
function eliteShare(stage,p,protectedAttempt=false){return protectedAttempt||p<Math.ceil(stage/2)?0:Math.min(.18,.04+.03*(p-Math.ceil(stage/2)))}
function factionEligible(stage,p,protectedAttempt=false){return !protectedAttempt&&p>=5&&(stage%2===0||p>=6+Math.floor(stage/2))}
function spaced(pool,n){return Array.from({length:Math.min(n,pool.length)},(_,i)=>pool[Math.floor((i+.5)*pool.length/Math.min(n,pool.length))])}
function plan(stage,total,p,protectedAttempt=false){p=finitePrestige(p);const share=eliteShare(stage,p,protectedAttempt),quota=round(total*share),slots=Array(total).fill('basic'),begin=Math.ceil(total*.30),surge=Math.ceil(total*.85);
 const mid=Array.from({length:surge-begin},(_,i)=>i+begin),late=Array.from({length:total-surge},(_,i)=>i+surge);
 const midCount=Math.min(mid.length,round(quota*.7)),lateCount=Math.min(late.length,quota-midCount);
 for(const i of [...spaced(mid,midCount),...spaced(late,lateCount)])slots[i]='elite';
 const available=slots.flatMap((s,i)=>s==='basic'?[i]:[]),mutationQuota=protectedAttempt?0:Math.min(available.length,Math.max(0,p-3));
 for(const i of spaced(available,mutationQuota))slots[i]='mutated';
 return{stage,total,p,protectedAttempt,slots,eliteQuota:quota,mutationQuota,eliteCap:stage<=4?2:stage<=8?3:4,faction:factionEligible(stage,p,protectedAttempt)};
}
function slotKind(w,index,liveElites){const type=w.slots[index]||'basic';return type==='elite'&&liveElites>=w.eliteCap?'basic':type}
function legion(stage,i,bossDamage,p){const ref=references[stage-1],hp=round(ref*[1,.8,1.2][i]);return {...scale({hp,damage:bossDamage*[.8,.65,1][i],speed:[.65,.8,.55][i],attackPeriod:[1.6,1.5,1.9][i],firstDelay:0},p),name:factionNames[i],factionIndex:i}}
function resistance(e,enemies){return e.stage===10&&!e.boss&&!e.elite&&!e.generated?Math.min(.4,.1*enemies.filter(o=>o!==e&&o.hp>0&&o.stage===10&&!o.boss&&!o.elite&&!o.generated&&Math.hypot(e.x-o.x,e.y-o.y)<=1.7).length):0}
function damageAfterResistance(d,e,enemies,hunterVeteran=false){return d*(1-resistance(e,enemies)*(hunterVeteran?.75:1))}
const api={factors,scale,eliteShare,factionEligible,plan,slotKind,legion,resistance,damageAfterResistance,factionNames,eliteNames};
if(typeof module==='object'&&module.exports)module.exports=api;else root.FWPrestigeEnemies=api;
})(typeof window!=='undefined'?window:globalThis);
