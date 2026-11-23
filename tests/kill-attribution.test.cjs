'use strict';
// Run with: node --test tests/kill-attribution.test.cjs
// Tests the actual enemy-damage and hero-origin helpers extracted from game-core.js.
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const assert=require('node:assert/strict');
const {test}=require('node:test');

const core=readFileSync(join(__dirname,'..','game-core.js'),'utf8');
const effects=readFileSync(join(__dirname,'..','skill-tree-effects.js'),'utf8');
const start=core.indexOf('function heroSourceId(h)');
const end=core.indexOf('function enemiesInRadius(',start);
assert(start>=0&&end>start,'Source attribution helpers must be present');

const HERO_MAP=Object.fromEntries(['knight','archer','mage','hunter','paladin','priest','beastmaster','necromancer','warlock','shaman','dragonkin'].map(id=>[id,{id}]));
const {hitEnemy,heroSourceId}=new Function('HERO_MAP','isOriginalHero','damageNumber',
  core.slice(start,end)+'\nreturn {hitEnemy,heroSourceId};'
)(HERO_MAP,h=>Boolean(h?.base&&HERO_MAP[h.base.id]),()=>{});

test('the hero who lands the final blow gets credit',()=>{
  const enemy={hp:8};
  hitEnemy(enemy,4,'#cccccc','knight');
  assert.equal(enemy.lastHitHero,'knight');
  hitEnemy(enemy,4,'#cccccc','archer');
  assert.equal(enemy.hp,0);
  assert.equal(enemy.lastHitHero,'archer');
});

test('visual colour never determines damage attribution',()=>{
  const enemy={hp:5};
  hitEnemy(enemy,6,'#b7ddff','mage');
  assert.equal(enemy.lastHitHero,'mage');
});

test('damage-over-time and delayed effects retain their explicit source',()=>{
  const bleedVictim={hp:2,lastHitHero:'knight'};
  hitEnemy(bleedVictim,2,'#ff9d96','hunter');
  assert.equal(bleedVictim.lastHitHero,'hunter');
  const delayedVictim={hp:1};
  hitEnemy(delayedVictim,1,'#e9b984','mage');
  assert.equal(delayedVictim.lastHitHero,'mage');
});

test('uncredited finishing damage cannot borrow earlier hero ownership',()=>{
  const enemy={hp:4,lastHitHero:'knight'};
  hitEnemy(enemy,5,'#f00000');
  assert.equal(enemy.hp,-1);
  assert.equal(enemy.lastHitHero,null);
});

test('unrecognised hero IDs never enter the quest kill ledger',()=>{
  const enemy={hp:1,lastHitHero:'mage'};
  hitEnemy(enemy,1,'#f0cd99','mysterious-monster');
  assert.equal(enemy.lastHitHero,null);
});

test('damage to an already defeated enemy cannot change the final-blow owner',()=>{
  const enemy={hp:0,lastHitHero:'hunter'};
  hitEnemy(enemy,999,'#123456','mage');
  assert.equal(enemy.lastHitHero,'hunter');
});

test('original heroes and summons resolve to the correct class',()=>{
  assert.equal(heroSourceId({base:{id:'mage'}}),'mage');
  assert.equal(heroSourceId({summonKind:'hound',ownerHeroId:'beastmaster',base:{id:'hound'}}),'beastmaster');
  assert.equal(heroSourceId({summonKind:'undead',ownerHeroId:'necromancer',base:{id:'undead'}}),'necromancer');
  assert.equal(heroSourceId({summonKind:'hound',ownerHeroId:null,base:{id:'hound'}}),null);
});

test('summoned units persist their owner class independently of a living owner',()=>{
  assert.match(core,/ownerHeroId:state\.heroes\.find\(h=>h\.id===ownerId/);
  assert.match(core,/hitEnemy\(enemy,h\.base\.damage,h\.base\.color,heroSourceId\(h\)\)/);
});

test('skill effects and status ticks pass explicit ownership',()=>{
  assert.match(effects,/const dmg=\(e,n,h\)=>api\.hitEnemy\(e,n,h\?\.base\?\.color\|\|'#f0cd99',h\?\.base\?\.id\|\|null\)/);
  assert.match(core,/hitEnemy\(e,e\.bleed\.damage,'#ff9d96',e\.bleed\.sourceHeroId\)/);
  assert.match(core,/hitEnemy\(e,p\.damage,p\.color,p\.sourceHeroId\)/);
  assert.match(core,/hitEnemy\(p\.target,p\.damage,p\.color,p\.sourceHeroId\)/);
  assert.match(core,/hitEnemy\(other,1\.2,'#ca91ef',e\.doomSourceHeroId\|\|null\)/);
});

test('every game-core hitEnemy invocation includes a source argument',()=>{
  const lines=core.split('\n').filter(line=>line.includes('hitEnemy(')&&!line.startsWith('function hitEnemy('));
  assert(lines.length>15);
  for(const line of lines){
    assert(/sourceHeroId|,id\)|,h\.base\.id\)|heroSourceId\(h\)|e\.doomSourceHeroId/.test(line),
      'Missing explicit damage source: '+line);
  }
});
