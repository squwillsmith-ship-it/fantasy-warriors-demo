/* Portable game definitions: stats, rosters, encounter identities and provisional tuning. */
(function(){'use strict';
const HEROES=[
 // Active v1.0.1 stats: health half of v0.21.0, basic attack damage double; speeds and walks unchanged.
 // Ranges for newer classes are TEST placeholders, not approved balance decisions.
 {id:'knight',name:'Knight',pack:0,rarity:'Common',color:'#b9c6d0',hp:37.5,damage:3.2,speed:.75,walk:1.78,range:1,role:'Sword Strike',glyph:'⚔'},
 {id:'archer',name:'Archer',pack:0,rarity:'Uncommon',color:'#8acaab',hp:24,damage:3.6,speed:.70,walk:1.85,range:6,role:'Straight Arrow',glyph:'➶'},
 {id:'mage',name:'Mage',pack:0,rarity:'Legendary',color:'#ffc770',hp:27.5,damage:4.8,speed:.55,walk:1.80,range:5,role:'Explosive Fireball',glyph:'✦'},
 {id:'hunter',name:'Hunter',pack:1,rarity:'Unassigned',color:'#a1c391',hp:30,damage:5.6,speed:.55,walk:1.87,range:6.4,role:'Serrated Arrow',glyph:'⌁'},
 {id:'barbarian',name:'Barbarian',pack:1,rarity:'Unassigned',color:'#df9878',hp:55,damage:6.4,speed:.50,walk:1.78,range:1.3,role:'Wide Cleave',glyph:'🪓'},
 {id:'rogue',name:'Rogue',pack:1,rarity:'Unassigned',color:'#b3a0d8',hp:27.5,damage:1.6,speed:2.10,walk:1.95,range:1.1,role:'Alternating Daggers',glyph:'🗡'},
 {id:'paladin',name:'Paladin',pack:2,rarity:'Unassigned',color:'#eac978',hp:72.5,damage:5.2,speed:.65,walk:1.72,range:1.3,role:'Hammer Strike',glyph:'⚒'},
 {id:'nun',name:'Nun',pack:2,rarity:'Unassigned',color:'#d8cae5',hp:42.5,damage:3.8,speed:.90,walk:1.85,range:1.1,role:'Monastic Combination',glyph:'✚'},
 {id:'priest',name:'Priest',pack:2,rarity:'Epic',color:'#ce91ff',hp:39,damage:5.6,speed:.60,walk:1.76,range:4,role:'Censuring Ray',glyph:'✥'},
 {id:'shaman',name:'Shaman',pack:3,rarity:'Unassigned',color:'#78d6c5',hp:40,damage:6,speed:.60,walk:1.80,range:4.4,role:'Vial Throw',glyph:'☯'},
 {id:'druid',name:'Druid',pack:3,rarity:'Unassigned',color:'#9cce79',hp:52.5,damage:5.8,speed:.65,walk:1.78,range:4.6,role:'Vine Wave',glyph:'❧'},
 {id:'warlock',name:'Warlock',pack:3,rarity:'Unassigned',color:'#b06acc',hp:37.5,damage:7.6,speed:.50,walk:1.75,range:4.8,role:'Doom Sigil',glyph:'☽'},
 {id:'beastmaster',name:'Beastmaster',pack:4,rarity:'Unassigned',color:'#dcab7f',hp:62.5,damage:6.6,speed:.60,walk:1.86,range:1.8,role:'Whip',glyph:'♞'},
 {id:'necromancer',name:'Necromancer',pack:4,rarity:'Unassigned',color:'#9da2e8',hp:45,damage:8.4,speed:.50,walk:1.73,range:4.8,role:'Soul Sucking Beam',glyph:'☠'},
 {id:'dragonkin',name:'Dragonkin',pack:4,rarity:'Unassigned',color:'#f49b69',hp:112.5,damage:10,speed:.40,walk:1.70,range:1.3,role:'Lunge',glyph:'🐉'}
];
const HEROES_PER_PACK=1;
const PACKS=[
 {name:'Recruit',stage:1,pool:['knight','archer','mage'],price:2},
 {name:'Outlaw',stage:null,pool:['hunter','barbarian','rogue'],price:3},
 {name:'Devotion',stage:null,pool:['paladin','nun','priest'],price:4},
 {name:'Occult',stage:null,pool:['shaman','druid','warlock'],price:5},
 {name:'Mythic',stage:null,pool:['beastmaster','necromancer','dragonkin'],price:6}
];
const HERO_MAP=Object.fromEntries(HEROES.map(h=>[h.id,h]));
// Stage encounter identities v1.0.1. Stages 4-10 are PROVISIONAL. No unique enemy attack rules have been invented.
const ENCOUNTERS=[
 {name:'Slime Pits',minion:'Slime',boss:'King Slime',minionIcon:'●',bossIcon:'♛',minionColor:'#7ee897',bossColor:'#4ad1ad',approved:true},
 {name:'Fungal Forest',minion:'Mushroom Man',boss:'Giant Plant',minionIcon:'♧',bossIcon:'✿',minionColor:'#e2b973',bossColor:'#97d67c',approved:true},
 {name:'Goblin Camp',minion:'Goblin',boss:'Orc Warlord',minionIcon:'♠',bossIcon:'⚔',minionColor:'#97ce6e',bossColor:'#7a9e59',approved:true},
 {name:'Bandit Hideout',minion:'Bandit',boss:'Bandit King',minionIcon:'◆',bossIcon:'♛',minionColor:'#d3a17d',bossColor:'#b77465',approved:false},
 {name:"Dragon's Lair",minion:'Kobold',boss:'Drake',minionIcon:'♠',bossIcon:'◆',minionColor:'#d3b477',bossColor:'#e18759',approved:false},
 {name:'Sacred Citadel',minion:'Fanatical Zealot',boss:'Fallen Seraph',minionIcon:'✚',bossIcon:'✧',minionColor:'#f5dc91',bossColor:'#dab2f4',approved:false},
 {name:'Infernal Realm',minion:'Imp',boss:'Succubus Queen',minionIcon:'✶',bossIcon:'♛',minionColor:'#e37d77',bossColor:'#c86aa7',approved:false},
 {name:'Cursed Necropolis',minion:'Wraith',boss:'Lich',minionIcon:'☾',bossIcon:'☠',minionColor:'#acb4ef',bossColor:'#96a0e8',approved:false},
 {name:'Dark Cathedral',minion:'Cultist',boss:'Abyssal High Priest',minionIcon:'◈',bossIcon:'✥',minionColor:'#ad7ebd',bossColor:'#b374c0',approved:false},
 {name:'The Final Rift',minion:'Voidling',boss:'Eldritch Horror',minionIcon:'✺',bossIcon:'☼',minionColor:'#8f86cf',bossColor:'#cf70d0',approved:false}
];
const TUNING={shared:{acquisitionRange:15,towerGuardRadius:5,specialChargeSeconds:10,enemyHeroDetection:6,returnRadius:2.4,actorRadius:.35,bossRadius:.75,personalSpace:.045,decisionInterval:.25,targetCommitSeconds:1,retargetMargin:.35,rangeStandoff:.76,meleeSlots:6,steerResponsiveness:9},heroes:{}};
const ABILITIES={
 knight:{name:'Shield Bash',trigger:'autoCharge',bashRadius:1.9,bashStunSeconds:1.6,bashDamage:0},
 archer:{name:'Arrow Volley',trigger:'autoCharge',volleyArrowCount:5,volleyRadius:1.8,volleyDamage:1.4},
 mage:{name:'Chain Bolt',trigger:'autoCharge',chainJumpCount:4,chainJumpRange:2.4,chainDamage:2.5},
 hunter:{name:'Tripwire Trap',trigger:'autoCharge',trapRadius:1.25,trapDurationSeconds:7,trapSlowMultiplier:.40},
 barbarian:{name:'Battle Frenzy',trigger:'autoCharge',frenzyDurationSeconds:5,frenzyAttackSpeedMultiplier:1.9},
 rogue:{name:'Smoke Bomb',trigger:'autoCharge',invisibilityDurationSeconds:4},
 paladin:{name:'Divine Aegis',trigger:'autoCharge',shieldAmount:14,shieldRadius:2.7,shieldDurationSeconds:6},
 nun:{name:'Sanctuary Prayer',trigger:'autoCharge',sanctuaryRadius:2.35,sanctuaryLifetimeSeconds:5,sanctuaryHealPerSecond:1.7,sanctuaryTickIntervalSeconds:.2,sanctuaryEligibilityRadius:2.35,sanctuarySelfHealingAllowed:false,sanctuaryOverlappingZonesPolicy:'nonstacking'},
 priest:{name:'Blessing of Courage',trigger:'autoCharge',blessingRadius:3,blessingDamageBonus:.35,blessingDurationSeconds:6},
 shaman:{name:'Spirit Totem',trigger:'autoCharge',totemHealth:22,totemLifetimeSeconds:11,totemAggroRadius:6,totemCount:1},
 druid:{name:'Bear Form',trigger:'autoCharge',bearFormDurationSeconds:5.5},
 warlock:{name:'Life Siphon',trigger:'autoCharge',siphonDamage:3,siphonHealAmount:5,siphonRange:4.8},
 beastmaster:{name:'Summon Hound',trigger:'autoCharge',houndHealth:18,houndDamage:1.4,houndAttackSpeed:1.1,houndWalkSpeed:2,houndLifetimeSeconds:13,maximumActiveHounds:3},
 necromancer:{name:'Raise the Fallen',trigger:'onEnemyKill',beamContinuous:true,beamBaseDamageRate:4.2,beamRampSeconds:8,beamMaxRampMultiplier:2.1,beamTickSeconds:.10,beamRetargetPolicy:'reset-on-change',undeadHealth:13,undeadDamage:1.2,undeadLifetimeSeconds:15},
 dragonkin:{name:'Dragon Breath',trigger:'autoCharge',breathConeDegrees:90,breathRange:3.7,breathDamage:6.0}
};
for(const core of HEROES){TUNING.heroes[core.id]={core,acquisitionRange:null,towerGuardRadius:null,special:{...ABILITIES[core.id],chargeSeconds:null}}}
// Derive sustained Necromancer DPS from authoritative damage and attacks/sec, not another balance constant.
TUNING.heroes.necromancer.special.beamBaseDamageRate=HERO_MAP.necromancer.damage*HERO_MAP.necromancer.speed;
const HOUND={id:'hound',name:'Hound',rarity:'Summoned',color:'#c99d63',hp:18,damage:1.4,speed:1.1,walk:2,range:1,glyph:'🐕',role:'Summoned Bite'};
const UNDEAD={id:'undead',name:'Undead',rarity:'Summoned',color:'#7bd2c4',hp:13,damage:1.2,speed:1,walk:1.62,range:1,glyph:'☠',role:'Undead Strike'};



const SPAWN_CONFIG={normalInterval:2,bossClearDelay:2,normalHp:11};
window.FWGameData={HEROES,HEROES_PER_PACK,PACKS,HERO_MAP,ENCOUNTERS,TUNING,ABILITIES,HOUND,UNDEAD,SPAWN_CONFIG};
})();
