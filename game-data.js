/* Fantasy Warriors: portable game records. The active approved/provisional numeric
   values live ONLY in balance-config.js (window.FWBalance.profile).
   Google Sheet connection remains manual, never synced automatically. */
(function(){'use strict';
const BALANCE=window.FWBalance?.profile;
if(!BALANCE||window.FWBalance.validate(BALANCE)!==true)throw new Error('Missing/invalid Fantasy Warriors balance profile');
const HEROES=BALANCE.heroes.map(h=>({...h}));
const HEROES_PER_PACK=BALANCE.packs.heroesPerPack;
const PACKS=BALANCE.packs.definitions.map(p=>({...p,pool:[...p.pool]}));
const HERO_MAP=Object.fromEntries(HEROES.map(h=>[h.id,h]));
const ENCOUNTERS=BALANCE.encounters.map(x=>({...x}));
const TUNING={shared:{...BALANCE.combat},heroes:{}};
const ABILITIES=JSON.parse(JSON.stringify(BALANCE.abilities));
for(const core of HEROES){
 const special={...ABILITIES[core.id],chargeSeconds:null};
 TUNING.heroes[core.id]={core,acquisitionRange:null,towerGuardRadius:null,special};
}
TUNING.heroes.necromancer.special.beamBaseDamageRate=HERO_MAP.necromancer.damage*HERO_MAP.necromancer.speed;
const HOUND={...BALANCE.summons.hound};
const UNDEAD={...BALANCE.summons.undead};
const SPAWN_CONFIG={...BALANCE.spawn};
window.FWGameData={HEROES,HEROES_PER_PACK,PACKS,HERO_MAP,ENCOUNTERS,TUNING,ABILITIES,HOUND,UNDEAD,SPAWN_CONFIG,BALANCE};
})();
