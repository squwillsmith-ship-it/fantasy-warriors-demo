/* Lifetime skin collection, rarity-first draws and integer-hundredth transactions. */
(function(root){'use strict';
const tiers=['Common','Epic','Legendary'],boxWeights=[60,30,10],deploymentWeights=[75,20,5];
const variants=[
 {key:'default',name:'Original',rarity:'Common',multiplier:1,color:null,trim:null},
 {key:'azure',name:'Azure',rarity:'Common',multiplier:1,color:'#508cbf',trim:'#a8cce4'},
 {key:'ember',name:'Ember',rarity:'Common',multiplier:1,color:'#b76549',trim:'#e5ad83'},
 {key:'epic',name:'Runeforged',rarity:'Epic',multiplier:1.5,color:'#9464c6',trim:'#e2bcff'},
 {key:'legendary',name:'Exalted',rarity:'Legendary',multiplier:2,color:'#d4aa55',trim:'#fff1a9'}
];
const cents=n=>Math.max(0,Math.round((Number.isFinite(n)?n:0)*100));
const shards=n=>n/100;
const catalog=heroes=>heroes.flatMap(h=>variants.map(v=>({...v,id:h.id+':'+v.key,heroId:h.id,heroName:h.name,color:v.color||h.color||'#8893a4',trim:v.trim||'#a2aeb8'})));
function pick(pool,weights,rng){const groups=tiers.map(t=>pool.filter(s=>s.rarity===t)),total=groups.reduce((a,g,i)=>a+(g.length?weights[i]:0),0);if(!total)return null;let n=rng()*total;let last=null;for(let i=0;i<groups.length;i++){if(!groups[i].length)continue;last=groups[i];n-=weights[i];if(n<0)return last[Math.min(last.length-1,Math.floor(rng()*last.length))]}return last[Math.min(last.length-1,Math.floor(rng()*last.length))]}
function normalize(heroes,discovered,owned,streak){const allowed=new Set(catalog(heroes).filter(s=>s.key!=='default'&&discovered.includes(s.heroId)).map(s=>s.id));return{owned:Array.isArray(owned)?[...new Set(owned.filter(id=>allowed.has(id)))]:[],streak:Number.isInteger(streak)?Math.max(0,Math.min(3,streak)):0}}
function eligible(heroes,discovered){return catalog(heroes).filter(s=>s.key!=='default'&&discovered.includes(s.heroId))}
function open({heroes,discovered,owned,streak,balanceCents,prestige},rng=Math.random){
 const n=normalize(heroes,discovered,owned,streak),pool=eligible(heroes,discovered),missing=pool.filter(s=>!n.owned.includes(s.id));
 if(prestige<3)return{ok:false,reason:'Unlock after prestige 3'};
 if(!missing.length)return{ok:false,reason:pool.length?'Eligible collection complete':'Discover a hero first'};
 if(!Number.isSafeInteger(balanceCents)||balanceCents<100)return{ok:false,reason:'Requires 1 Shard'};
 const skin=pick(n.streak>=3?missing:pool,boxWeights,rng),duplicate=n.owned.includes(skin.id);
 return{ok:true,skin,duplicate,refundCents:duplicate?5:0,balanceCents:balanceCents-100+(duplicate?5:0),owned:duplicate?n.owned:[...n.owned,skin.id],streak:duplicate?n.streak+1:0};
}
function draw(heroes,heroId,owned,rng=Math.random){return pick(catalog(heroes).filter(s=>s.heroId===heroId&&(s.key==='default'||owned.includes(s.id))),deploymentWeights,rng)}
function apply(base,skin){if(!skin||skin.heroId!==base.id)throw Error('Invalid skin/class');return{...base,hp:base.hp*skin.multiplier,damage:base.damage*skin.multiplier,color:skin.key==='default'?base.color:skin.color}}
const api={tiers,variants,cents,shards,catalog,normalize,eligible,open,draw,apply};if(typeof module==='object'&&module.exports)module.exports=api;else root.FWSkins=api;
})(typeof window!=='undefined'?window:globalThis);
