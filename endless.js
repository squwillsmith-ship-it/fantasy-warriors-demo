/* Endless normalization: wave numbers never become campaign stages. */
(function(root){'use strict';
const coefficients=[.8,1,.55,1,1.15,1.15,.75,.95,1.1,1.25];
const valid=w=>Number.isSafeInteger(w)&&w>=1;
function wave(w){if(!valid(w))throw Error('Invalid Endless wave');const family=1+(w-1)%10,boss=w%5===0?1+(w/5-1)%10:0,c=coefficients[family-1];return {wave:w,family,boss,slots:Math.min(120,Math.floor(80/c+.5)+2*(w-1)),hp:1+.04*(w-1),damage:1+.025*(w-1),speed:Math.min(1.35,1+.005*(w-1))}}
function invasion(w,p){if(w%5||p<5)return false;const j=w/5;return j%2===0||p>=6+Math.floor(((j-1)%10)/2)}
function scale(s,w){const a=wave(w);return {...s,hp:s.hp*a.hp,damage:s.damage*a.damage,speed:s.speed*a.speed,attackPeriod:(s.attackPeriod??1)/a.speed,firstDelay:(s.firstDelay??.65)/a.speed}}
function basic(stages,f){const s=stages[f-1].basic;return {...s,hp:33*coefficients[f-1],damage:10.5*Math.max(.65,Math.min(1.15,s.damage/10.5))}}
function elite(stages,f){const {basic:b,elite:e}=stages[f-1],n=basic(stages,f);return {...e,hp:n.hp*e.hp/b.hp,damage:n.damage*e.damage/b.damage}}
function boss(stages,f,phase=1){const b=stages[f-1].boss,s=f===10?b.phases[phase-1]:b,base=14*Math.max(.75,Math.min(1.4,(f===10?b.phases[0].damage:b.damage)/16));return {...s,hp:f===1?2*(700-4*33*.8):f===10?700*s.hp/b.phases.reduce((n,x)=>n+x.hp,0):700,damage:base*(f===10?s.damage/b.phases[0].damage:1)}}
const interval=n=>Math.max(.45,n*.85);
const api={wave,invasion,scale,basic,elite,boss,interval,valid};if(typeof module==='object'&&module.exports)module.exports=api;else root.FWEndless=api;
})(typeof window!=='undefined'?window:globalThis);
