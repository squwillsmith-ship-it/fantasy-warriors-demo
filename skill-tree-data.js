/* Canonical v1.16 catalogue; explicit effect registry. */
window.FW_SKILL_DATA={
  "version": "1.16.0",
  "heroes": [
    "knight",
    "archer",
    "mage",
    "hunter",
    "barbarian",
    "rogue",
    "paladin",
    "nun",
    "priest",
    "shaman",
    "druid",
    "warlock",
    "beastmaster",
    "necromancer",
    "dragonkin"
  ],
  "codes": [
    "K",
    "A",
    "MG",
    "H",
    "B",
    "R",
    "P",
    "N",
    "PR",
    "S",
    "D",
    "W",
    "BM",
    "NE",
    "DR"
  ],
  "legacyCodes": [
    "KNI",
    "ARC",
    "MAG",
    "HUN",
    "BAR",
    "ROG",
    "PAL",
    "NUN",
    "PRI",
    "SHA",
    "DRU",
    "WAR",
    "BEA",
    "NEC",
    "DRA"
  ],
  "gateGoals": {
    "knight": 5,
    "archer": 10,
    "mage": 15,
    "hunter": 30,
    "barbarian": 35,
    "rogue": 40,
    "paladin": 50,
    "nun": 55,
    "priest": 60,
    "shaman": 50,
    "druid": 55,
    "warlock": 60,
    "beastmaster": 60,
    "necromancer": 65,
    "dragonkin": 70
  },
  "gateways": {
    "stages": [
      1,
      3,
      5,
      7
    ],
    "up": [
      10,
      18,
      26,
      36
    ],
    "freePrestige": [
      1,
      2,
      3,
      4
    ]
  },
  "ordinary": [
    {
      "id": "O-1-G1",
      "name": "Vitality",
      "cost": 2,
      "prerequisites": "T1-ROOT",
      "effect": "+25% all hero base HP."
    },
    {
      "id": "O-1-G2",
      "name": "Weapon Training",
      "cost": 2,
      "prerequisites": "T1-ROOT",
      "effect": "+25% all hero base basic damage."
    },
    {
      "id": "O-1-G3",
      "name": "Reinforcements",
      "cost": 4,
      "prerequisites": "T1-ROOT",
      "effect": "+2 max coins."
    },
    {
      "id": "O-1-G4",
      "name": "Expanded Counter",
      "cost": 3,
      "prerequisites": "T1-ROOT",
      "effect": "+1 shop slot."
    },
    {
      "id": "O-1-G5",
      "name": "Battle Readiness",
      "cost": 3,
      "prerequisites": "T1-ROOT",
      "effect": "Timed hero abilities start with 20 percentage points of charge."
    },
    {
      "id": "O-2-G1",
      "name": "Combat Rhythm",
      "cost": 3,
      "prerequisites": "T2-ROOT",
      "effect": "+25% all hero basic attack rate."
    },
    {
      "id": "O-2-G2",
      "name": "Swift Footwork",
      "cost": 3,
      "prerequisites": "T2-ROOT",
      "effect": "+25% all hero movement speed."
    },
    {
      "id": "O-2-G3",
      "name": "First Blood",
      "cost": 4,
      "prerequisites": "T2-ROOT",
      "effect": "Each hero's first basic attack deals +50% damage."
    },
    {
      "id": "O-2-G4",
      "name": "Spoils of Battle",
      "cost": 5,
      "prerequisites": "T2-ROOT",
      "effect": "Every five personal qualifying kills restore 5% max HP."
    },
    {
      "id": "O-2-G5",
      "name": "Bargain Hunter",
      "cost": 5,
      "prerequisites": "T2-ROOT",
      "effect": "First purchased standard pack costs one fewer coin, minimum one; discounts nonstacking."
    },
    {
      "id": "O-3-G1",
      "name": "Fortitude",
      "cost": 4,
      "prerequisites": "T3-ROOT",
      "effect": "+25% additional all hero max HP."
    },
    {
      "id": "O-3-G2",
      "name": "Healing Grace",
      "cost": 4,
      "prerequisites": "T3-ROOT",
      "effect": "+25% healing received by heroes."
    },
    {
      "id": "O-3-G3",
      "name": "Divine Protection",
      "cost": 5,
      "prerequisites": "T3-ROOT",
      "effect": "All heroes begin combat with shield equal to 15% max HP."
    },
    {
      "id": "O-3-G4",
      "name": "Battle Prayer",
      "cost": 6,
      "prerequisites": "T3-ROOT",
      "effect": "+25% timed hero ability charge rate."
    },
    {
      "id": "O-3-G5",
      "name": "Royal Funding",
      "cost": 6,
      "prerequisites": "T3-ROOT",
      "effect": "+2 max coins."
    },
    {
      "id": "O-4-G1",
      "name": "Arcane Power",
      "cost": 5,
      "prerequisites": "T4-ROOT",
      "effect": "+25% additional all hero basic damage."
    },
    {
      "id": "O-4-G2",
      "name": "Lingering Magic",
      "cost": 5,
      "prerequisites": "T4-ROOT",
      "effect": "+25% duration of hero-inflicted damaging status effects."
    },
    {
      "id": "O-4-G3",
      "name": "Arcane Echo",
      "cost": 7,
      "prerequisites": "T4-ROOT",
      "effect": "Every fifth damaging timed hero special per hero deals +50% damage; no extra cast."
    },
    {
      "id": "O-4-G4",
      "name": "Forbidden Knowledge",
      "cost": 7,
      "prerequisites": "T4-ROOT",
      "effect": "+1 ordinary UP per 15 qualifying scheduled-wave enemy kills."
    },
    {
      "id": "O-4-G5",
      "name": "Soul Recovery",
      "cost": 8,
      "prerequisites": "T4-ROOT",
      "effect": "Every tenth personal qualifying kill gives 15 percentage points timed special charge."
    },
    {
      "id": "O-5-G1",
      "name": "Ancient Constitution",
      "cost": 7,
      "prerequisites": "T5-ROOT",
      "effect": "+50% additional all hero max HP."
    },
    {
      "id": "O-5-G2",
      "name": "Bossbreakers",
      "cost": 7,
      "prerequisites": "T5-ROOT",
      "effect": "+25% hero damage to bosses."
    },
    {
      "id": "O-5-G3",
      "name": "Army of Legends",
      "cost": 8,
      "prerequisites": "T5-ROOT",
      "effect": "+50% allied summoned combat unit HP and damage."
    },
    {
      "id": "O-5-G4",
      "name": "Final Resolve",
      "cost": 9,
      "prerequisites": "T5-ROOT",
      "effect": "First time surviving below 25% HP, 25% damage reduction for 5s, once per battle."
    },
    {
      "id": "O-5-G5",
      "name": "Legendary Awakening",
      "cost": 10,
      "prerequisites": "T5-ROOT",
      "effect": "Timed hero specials start fully charged."
    },
    {
      "id": "O-1-K-A1",
      "name": "Plate Harness",
      "cost": 2,
      "prerequisites": "T1-K-GATE",
      "effect": "+50% max HP."
    },
    {
      "id": "O-1-K-A2",
      "name": "Shield Training",
      "cost": 2,
      "prerequisites": "O-1-K-A1",
      "effect": "25% chance to block half incoming damage."
    },
    {
      "id": "O-1-K-A3",
      "name": "Counterstrike",
      "cost": 3,
      "prerequisites": "O-1-K-A2",
      "effect": "Successful blocks retaliate against the attacker for 50% normal Sword Strike damage; at most once per second."
    },
    {
      "id": "O-1-K-A4",
      "name": "Reinforced Shield",
      "cost": 3,
      "prerequisites": "O-1-K-A3",
      "effect": "Block chance rises from 25% to 40%."
    },
    {
      "id": "O-1-K-A5",
      "name": "Indomitable",
      "cost": 5,
      "prerequisites": "O-1-K-A4",
      "effect": "Successful blocks grant 10 percentage points Shield Bash charge; at most once per 2s."
    },
    {
      "id": "O-1-K-B1",
      "name": "Weighty Blade",
      "cost": 2,
      "prerequisites": "T1-K-GATE",
      "effect": "+40% basic damage."
    },
    {
      "id": "O-1-K-B2",
      "name": "Veteran Footwork",
      "cost": 2,
      "prerequisites": "O-1-K-B1",
      "effect": "+25% basic attack rate."
    },
    {
      "id": "O-1-K-B3",
      "name": "Crushing Bash",
      "cost": 3,
      "prerequisites": "O-1-K-B2",
      "effect": "Shield Bash deals 50% of normal Sword Strike damage to affected enemies."
    },
    {
      "id": "O-1-K-B4",
      "name": "Stunning Impact",
      "cost": 3,
      "prerequisites": "O-1-K-B3",
      "effect": "+40% Shield Bash stun duration."
    },
    {
      "id": "O-1-K-B5",
      "name": "Concussive Strike",
      "cost": 5,
      "prerequisites": "O-1-K-B4",
      "effect": "After Shield Bash next two sword strikes gain +50% damage; refresh, no bank."
    },
    {
      "id": "O-1-A-A1",
      "name": "Heavy Draw",
      "cost": 2,
      "prerequisites": "T1-A-GATE",
      "effect": "+50% basic damage."
    },
    {
      "id": "O-1-A-A2",
      "name": "Critical Precision",
      "cost": 2,
      "prerequisites": "O-1-A-A1",
      "effect": "20% basic attack crit chance; double damage."
    },
    {
      "id": "O-1-A-A3",
      "name": "Quick Nock",
      "cost": 3,
      "prerequisites": "O-1-A-A2",
      "effect": "+25% basic attack rate."
    },
    {
      "id": "O-1-A-A4",
      "name": "Deadly Precision",
      "cost": 3,
      "prerequisites": "O-1-A-A3",
      "effect": "Critical chance increases to 35%."
    },
    {
      "id": "O-1-A-A5",
      "name": "Perfect Shot",
      "cost": 5,
      "prerequisites": "O-1-A-A4",
      "effect": "Basic attack critical hits grant 10 percentage points Volley charge; Volley crits do not trigger this."
    },
    {
      "id": "O-1-A-B1",
      "name": "Reinforced Leather",
      "cost": 2,
      "prerequisites": "T1-A-GATE",
      "effect": "+40% max HP."
    },
    {
      "id": "O-1-A-B2",
      "name": "Wide Rain",
      "cost": 2,
      "prerequisites": "O-1-A-B1",
      "effect": "+40% Volley radius."
    },
    {
      "id": "O-1-A-B3",
      "name": "Quiver Discipline",
      "cost": 3,
      "prerequisites": "O-1-A-B2",
      "effect": "+35% Volley charge rate."
    },
    {
      "id": "O-1-A-B4",
      "name": "Barbed Rain",
      "cost": 3,
      "prerequisites": "O-1-A-B3",
      "effect": "Volley inflicts additional 50% of its damage as bleed over 3s."
    },
    {
      "id": "O-1-A-B5",
      "name": "Rain of Death",
      "cost": 5,
      "prerequisites": "O-1-A-B4 + O-1-A-A2",
      "effect": "Volley may crit using Archer's existing crit chance and multiplier; needs Critical Precision for nonzero chance."
    },
    {
      "id": "O-1-MG-A1",
      "name": "Flame Focus",
      "cost": 2,
      "prerequisites": "T1-MG-GATE",
      "effect": "+50% Fireball damage."
    },
    {
      "id": "O-1-MG-A2",
      "name": "Ignition",
      "cost": 2,
      "prerequisites": "O-1-MG-A1",
      "effect": "Fireball applies burning equal to 25% of its damage over 3s; same source refreshes."
    },
    {
      "id": "O-1-MG-A3",
      "name": "Expanded Burst",
      "cost": 3,
      "prerequisites": "O-1-MG-A2",
      "effect": "+40% Fireball explosion radius."
    },
    {
      "id": "O-1-MG-A4",
      "name": "Combustion",
      "cost": 3,
      "prerequisites": "O-1-MG-A3",
      "effect": "Fireball deals +50% direct damage against already burning enemies."
    },
    {
      "id": "O-1-MG-A5",
      "name": "Inferno",
      "cost": 5,
      "prerequisites": "O-1-MG-A4",
      "effect": "Enemies carrying Mage's burn explode on death for 50% normal Fireball damage to surrounding enemies; explosions do not apply burn or trigger further explosions."
    },
    {
      "id": "O-1-MG-B1",
      "name": "Arcane Ward",
      "cost": 2,
      "prerequisites": "T1-MG-GATE",
      "effect": "+40% max HP."
    },
    {
      "id": "O-1-MG-B2",
      "name": "Static Power",
      "cost": 2,
      "prerequisites": "O-1-MG-B1",
      "effect": "+50% Chain Bolt damage."
    },
    {
      "id": "O-1-MG-B3",
      "name": "Storm Conduit",
      "cost": 3,
      "prerequisites": "O-1-MG-B2",
      "effect": "+35% Chain Bolt charge rate."
    },
    {
      "id": "O-1-MG-B4",
      "name": "Overcharge",
      "cost": 3,
      "prerequisites": "O-1-MG-B3",
      "effect": "Every third Chain Bolt activation deals double damage."
    },
    {
      "id": "O-1-MG-B5",
      "name": "Elemental Fusion",
      "cost": 5,
      "prerequisites": "O-1-MG-B4",
      "effect": "Chain Bolt deals +50% damage against burning enemies."
    },
    {
      "id": "O-2-H-A1",
      "name": "Barbed Fletching",
      "cost": 3,
      "prerequisites": "T2-H-GATE",
      "effect": "+45% basic damage."
    },
    {
      "id": "O-2-H-A2",
      "name": "Deep Cuts",
      "cost": 3,
      "prerequisites": "O-2-H-A1",
      "effect": "+50% bleed damage per tick."
    },
    {
      "id": "O-2-H-A3",
      "name": "Open Wounds",
      "cost": 4,
      "prerequisites": "O-2-H-A2",
      "effect": "Up to 3 simultaneous bleed stacks per Hunter per enemy."
    },
    {
      "id": "O-2-H-A4",
      "name": "Haemorrhage",
      "cost": 5,
      "prerequisites": "O-2-H-A3",
      "effect": "At three own stacks, enemies take +25% bleed damage from that Hunter."
    },
    {
      "id": "O-2-H-A5",
      "name": "Blood Harvest",
      "cost": 6,
      "prerequisites": "O-2-H-A4",
      "effect": "Own bleeding final blows restore 5% max HP."
    },
    {
      "id": "O-2-H-B1",
      "name": "Hardened Leather",
      "cost": 3,
      "prerequisites": "T2-H-GATE",
      "effect": "+40% max HP."
    },
    {
      "id": "O-2-H-B2",
      "name": "Improved Snare",
      "cost": 3,
      "prerequisites": "O-2-H-B1",
      "effect": "+40% Tripwire duration."
    },
    {
      "id": "O-2-H-B3",
      "name": "Barbed Trap",
      "cost": 4,
      "prerequisites": "O-2-H-B2",
      "effect": "Enemies affected by Tripwire receive one bleed stack; once per enemy per trap."
    },
    {
      "id": "O-2-H-B4",
      "name": "Trap Mastery",
      "cost": 5,
      "prerequisites": "O-2-H-B3",
      "effect": "+35% Tripwire charge rate."
    },
    {
      "id": "O-2-H-B5",
      "name": "Deadly Combination",
      "cost": 6,
      "prerequisites": "O-2-H-B4",
      "effect": "Bleeding enemies affected by Tripwire take +50% Hunter bleed damage."
    },
    {
      "id": "O-2-B-A1",
      "name": "Heavy Axe",
      "cost": 3,
      "prerequisites": "T2-B-GATE",
      "effect": "+50% basic damage."
    },
    {
      "id": "O-2-B-A2",
      "name": "Brutal Rhythm",
      "cost": 3,
      "prerequisites": "O-2-B-A1",
      "effect": "+25% basic attack rate."
    },
    {
      "id": "O-2-B-A3",
      "name": "Bloodthirst",
      "cost": 4,
      "prerequisites": "O-2-B-A2",
      "effect": "Heal 10% of actual basic damage dealt."
    },
    {
      "id": "O-2-B-A4",
      "name": "Devastating Cleave",
      "cost": 5,
      "prerequisites": "O-2-B-A3",
      "effect": "Every third cleave deals double damage."
    },
    {
      "id": "O-2-B-A5",
      "name": "Executioner's Axe",
      "cost": 6,
      "prerequisites": "O-2-B-A4",
      "effect": "+50% basic damage against enemies below 25% HP."
    },
    {
      "id": "O-2-B-B1",
      "name": "Iron Constitution",
      "cost": 3,
      "prerequisites": "T2-B-GATE",
      "effect": "+50% max HP."
    },
    {
      "id": "O-2-B-B2",
      "name": "Deeper Frenzy",
      "cost": 3,
      "prerequisites": "O-2-B-B1",
      "effect": "+35% of configured base Frenzy attack-speed bonus."
    },
    {
      "id": "O-2-B-B3",
      "name": "Blood Rage",
      "cost": 4,
      "prerequisites": "O-2-B-B2",
      "effect": "Each own kill during Frenzy adds 0.5s, max 3 extra seconds per activation."
    },
    {
      "id": "O-2-B-B4",
      "name": "Unstoppable",
      "cost": 5,
      "prerequisites": "O-2-B-B3",
      "effect": "25% less incoming damage during Frenzy."
    },
    {
      "id": "O-2-B-B5",
      "name": "Endless Fury",
      "cost": 6,
      "prerequisites": "O-2-B-B4 + O-2-B-A3",
      "effect": "Bloodthirst healing doubles during Frenzy; also requires first branch third node."
    },
    {
      "id": "O-2-R-A1",
      "name": "Razor Daggers",
      "cost": 3,
      "prerequisites": "T2-R-GATE",
      "effect": "+60% basic damage."
    },
    {
      "id": "O-2-R-A2",
      "name": "Poisoned Steel",
      "cost": 3,
      "prerequisites": "O-2-R-A1",
      "effect": "Each dagger hit applies poison equal to 35% basic damage over 4s, initially max 3 stacks per owner per enemy."
    },
    {
      "id": "O-2-R-A3",
      "name": "Lightning Hands",
      "cost": 4,
      "prerequisites": "O-2-R-A2",
      "effect": "+25% basic attack rate."
    },
    {
      "id": "O-2-R-A4",
      "name": "Potent Venom",
      "cost": 4,
      "prerequisites": "O-2-R-A3",
      "effect": "Poison cap increases from 3 to 6."
    },
    {
      "id": "O-2-R-A5",
      "name": "Toxic Overload",
      "cost": 5,
      "prerequisites": "O-2-R-A4",
      "effect": "Dagger hit on enemy already at six own stacks consumes them and deals their remaining poison damage +50% immediately."
    },
    {
      "id": "O-2-R-B1",
      "name": "Soft Armour",
      "cost": 3,
      "prerequisites": "T2-R-GATE",
      "effect": "+40% max HP."
    },
    {
      "id": "O-2-R-B2",
      "name": "Longer Smoke",
      "cost": 3,
      "prerequisites": "O-2-R-B1",
      "effect": "+40% Smoke Bomb duration."
    },
    {
      "id": "O-2-R-B3",
      "name": "Quick Escape",
      "cost": 4,
      "prerequisites": "O-2-R-B2",
      "effect": "+35% Smoke Bomb charge rate."
    },
    {
      "id": "O-2-R-B4",
      "name": "Silent Killer",
      "cost": 5,
      "prerequisites": "O-2-R-B3",
      "effect": "+50% basic damage during Smoke Bomb."
    },
    {
      "id": "O-2-R-B5",
      "name": "Shadow Mastery",
      "cost": 6,
      "prerequisites": "O-2-R-B4 + O-2-R-A2",
      "effect": "Dagger hits during Smoke Bomb apply two poison stacks instead of one; also requires first branch second node."
    },
    {
      "id": "O-3-P-A1",
      "name": "Consecrated Hammer",
      "cost": 4,
      "prerequisites": "T3-P-GATE",
      "effect": "+50% basic damage."
    },
    {
      "id": "O-3-P-A2",
      "name": "Sacred Ground",
      "cost": 4,
      "prerequisites": "O-3-P-A1",
      "effect": "+50% lingering Hammer Strike damage."
    },
    {
      "id": "O-3-P-A3",
      "name": "Holy Retribution",
      "cost": 5,
      "prerequisites": "O-3-P-A2",
      "effect": "Every fifth damaging hit received empowers next Hammer Strike with +50% damage."
    },
    {
      "id": "O-3-P-A4",
      "name": "Divine Judgement",
      "cost": 6,
      "prerequisites": "O-3-P-A3",
      "effect": "+50% Hammer Strike damage against elites and bosses."
    },
    {
      "id": "O-3-P-A5",
      "name": "Wrath of Light",
      "cost": 8,
      "prerequisites": "O-3-P-A4",
      "effect": "Next Hammer Strike after Divine Aegis creates a patch dealing double normal damage."
    },
    {
      "id": "O-3-P-B1",
      "name": "Blessed Armour",
      "cost": 4,
      "prerequisites": "T3-P-GATE",
      "effect": "+50% max HP."
    },
    {
      "id": "O-3-P-B2",
      "name": "Stronger Aegis",
      "cost": 4,
      "prerequisites": "O-3-P-B1",
      "effect": "+35% shield absorption."
    },
    {
      "id": "O-3-P-B3",
      "name": "Sacred Restoration",
      "cost": 5,
      "prerequisites": "O-3-P-B2",
      "effect": "Aegis additionally heals recipients 7.5% of their max HP."
    },
    {
      "id": "O-3-P-B4",
      "name": "Divine Renewal",
      "cost": 6,
      "prerequisites": "O-3-P-B3",
      "effect": "+35% Divine Aegis charge rate."
    },
    {
      "id": "O-3-P-B5",
      "name": "Unbroken Faith",
      "cost": 8,
      "prerequisites": "O-3-P-B4",
      "effect": "Recipients whose Aegis shield is destroyed gain 25% damage reduction for 3s; identical named effect does not stack."
    },
    {
      "id": "O-3-N-A1",
      "name": "Iron Fists",
      "cost": 4,
      "prerequisites": "T3-N-GATE",
      "effect": "+40% basic damage."
    },
    {
      "id": "O-3-N-A2",
      "name": "Fluid Motion",
      "cost": 4,
      "prerequisites": "O-3-N-A1",
      "effect": "+25% basic attack rate."
    },
    {
      "id": "O-3-N-A3",
      "name": "Powerful Palm",
      "cost": 5,
      "prerequisites": "O-3-N-A2",
      "effect": "Third strike of each combination deals double damage."
    },
    {
      "id": "O-3-N-A4",
      "name": "Inner Discipline",
      "cost": 6,
      "prerequisites": "O-3-N-A3",
      "effect": "Completing a combination grants 10 percentage points Sanctuary charge."
    },
    {
      "id": "O-3-N-A5",
      "name": "Divine Combination",
      "cost": 8,
      "prerequisites": "O-3-N-A4",
      "effect": "Completing a combination heals Nun 5% max HP and empowers next combination with +25% damage."
    },
    {
      "id": "O-3-N-B1",
      "name": "Sacred Vitality",
      "cost": 4,
      "prerequisites": "T3-N-GATE",
      "effect": "+40% max HP."
    },
    {
      "id": "O-3-N-B2",
      "name": "Healing Grace",
      "cost": 4,
      "prerequisites": "O-3-N-B1",
      "effect": "+50% Sanctuary healing rate."
    },
    {
      "id": "O-3-N-B3",
      "name": "Extended Prayer",
      "cost": 5,
      "prerequisites": "O-3-N-B2",
      "effect": "+40% Sanctuary duration."
    },
    {
      "id": "O-3-N-B4",
      "name": "Overflowing Grace",
      "cost": 6,
      "prerequisites": "O-3-N-B3",
      "effect": "Excess Sanctuary healing becomes shield, capped at 20% recipient max HP."
    },
    {
      "id": "O-3-N-B5",
      "name": "Miracle of Life",
      "cost": 8,
      "prerequisites": "O-3-N-B4",
      "effect": "Sanctuary healing doubles for recipients below 25% HP."
    },
    {
      "id": "O-3-PR-A1",
      "name": "Luminous Power",
      "cost": 4,
      "prerequisites": "T3-PR-GATE",
      "effect": "+50% basic damage."
    },
    {
      "id": "O-3-PR-A2",
      "name": "Steady Chant",
      "cost": 4,
      "prerequisites": "O-3-PR-A1",
      "effect": "+25% basic attack rate."
    },
    {
      "id": "O-3-PR-A3",
      "name": "Divine Brand",
      "cost": 5,
      "prerequisites": "O-3-PR-A2",
      "effect": "Enemies damaged by Ray receive +15% damage from other heroes for 3s; no targeting preference."
    },
    {
      "id": "O-3-PR-A4",
      "name": "Purification",
      "cost": 6,
      "prerequisites": "O-3-PR-A3",
      "effect": "Ray deals +50% damage against enemies below 30% HP."
    },
    {
      "id": "O-3-PR-A5",
      "name": "Final Judgement",
      "cost": 8,
      "prerequisites": "O-3-PR-A4",
      "effect": "Each personal qualifying kill grants 15 percentage points Blessing charge."
    },
    {
      "id": "O-3-PR-B1",
      "name": "Hallowed Vitality",
      "cost": 4,
      "prerequisites": "T3-PR-GATE",
      "effect": "+60% max HP."
    },
    {
      "id": "O-3-PR-B2",
      "name": "Greater Courage",
      "cost": 4,
      "prerequisites": "O-3-PR-B1",
      "effect": "+75% of base Blessing damage bonus."
    },
    {
      "id": "O-3-PR-B3",
      "name": "Enduring Faith",
      "cost": 5,
      "prerequisites": "O-3-PR-B2",
      "effect": "+60% Blessing duration."
    },
    {
      "id": "O-3-PR-B4",
      "name": "Sacred Inspiration",
      "cost": 6,
      "prerequisites": "O-3-PR-B3",
      "effect": "Blessed heroes also gain +25% basic attack rate."
    },
    {
      "id": "O-3-PR-B5",
      "name": "Divine Ascension",
      "cost": 6,
      "prerequisites": "O-3-PR-B4",
      "effect": "Blessed heroes gain 10 percentage points timed special charge after every third personal qualifying kill."
    },
    {
      "id": "O-4-S-A1",
      "name": "Potent Mixture",
      "cost": 5,
      "prerequisites": "T4-S-GATE",
      "effect": "+50% Vial Throw damage."
    },
    {
      "id": "O-4-S-A2",
      "name": "Corrosive Brew",
      "cost": 5,
      "prerequisites": "O-4-S-A1",
      "effect": "Vials deal additional corrosion equal to 30% normal damage over 4s."
    },
    {
      "id": "O-4-S-A3",
      "name": "Unstable Mixture",
      "cost": 6,
      "prerequisites": "O-4-S-A2",
      "effect": "Every fourth vial produces second explosion at original impact, 50% normal damage."
    },
    {
      "id": "O-4-S-A4",
      "name": "Amplified Weakness",
      "cost": 8,
      "prerequisites": "O-4-S-A3",
      "effect": "+50% of base Vial weakening magnitude."
    },
    {
      "id": "O-4-S-A5",
      "name": "Master Alchemist",
      "cost": 10,
      "prerequisites": "O-4-S-A4",
      "effect": "When an enemy carrying own corrosion dies, next vial gains +25% damage, max four stacks."
    },
    {
      "id": "O-4-S-B1",
      "name": "Spirit Resilience",
      "cost": 5,
      "prerequisites": "T4-S-GATE",
      "effect": "+40% max HP."
    },
    {
      "id": "O-4-S-B2",
      "name": "Hardened Totems",
      "cost": 5,
      "prerequisites": "O-4-S-B1",
      "effect": "+50% totem max HP."
    },
    {
      "id": "O-4-S-B3",
      "name": "Spirit Offering",
      "cost": 6,
      "prerequisites": "O-4-S-B2",
      "effect": "Every fifth damaging hit received by owned totem grants Shaman 10 percentage points charge."
    },
    {
      "id": "O-4-S-B4",
      "name": "Ancestral Power",
      "cost": 8,
      "prerequisites": "O-4-S-B3",
      "effect": "+25% basic damage while at least one owned totem is active."
    },
    {
      "id": "O-4-S-B5",
      "name": "Spirit Rebirth",
      "cost": 10,
      "prerequisites": "O-4-S-B4",
      "effect": "Each totem reforms once after destruction at 30% max HP with remaining original lifetime; no repeat reform."
    },
    {
      "id": "O-4-D-A1",
      "name": "Ancient Growth",
      "cost": 5,
      "prerequisites": "T4-D-GATE",
      "effect": "+50% Vine Wave damage."
    },
    {
      "id": "O-4-D-A2",
      "name": "Thorn Magic",
      "cost": 5,
      "prerequisites": "O-4-D-A1",
      "effect": "Vine Wave applies thorn damage equal to 25% normal damage over 4s."
    },
    {
      "id": "O-4-D-A3",
      "name": "Natural Renewal",
      "cost": 6,
      "prerequisites": "O-4-D-A2",
      "effect": "Every third completed Vine Wave heals 5% max HP."
    },
    {
      "id": "O-4-D-A4",
      "name": "Wild Growth",
      "cost": 8,
      "prerequisites": "O-4-D-A3",
      "effect": "Every fourth completed Vine Wave produces a second wave along original direction for 50% damage."
    },
    {
      "id": "O-4-D-A5",
      "name": "Nature's Wrath",
      "cost": 10,
      "prerequisites": "O-4-D-A4",
      "effect": "Each personal qualifying kill in normal form grants 10 percentage points Bear Form charge."
    },
    {
      "id": "O-4-D-B1",
      "name": "Ironwood Skin",
      "cost": 5,
      "prerequisites": "T4-D-GATE",
      "effect": "+75% max HP in both forms."
    },
    {
      "id": "O-4-D-B2",
      "name": "Savage Claws",
      "cost": 5,
      "prerequisites": "O-4-D-B1",
      "effect": "+100% Bear Form basic damage."
    },
    {
      "id": "O-4-D-B3",
      "name": "Primal Endurance",
      "cost": 5,
      "prerequisites": "O-4-D-B2",
      "effect": "+40% Bear Form duration."
    },
    {
      "id": "O-4-D-B4",
      "name": "Predator's Fury",
      "cost": 7,
      "prerequisites": "O-4-D-B3",
      "effect": "Bear claws heal 25% actual damage dealt."
    },
    {
      "id": "O-4-D-B5",
      "name": "Ancient Guardian",
      "cost": 8,
      "prerequisites": "O-4-D-B4",
      "effect": "Bear Form grants 40% damage reduction and releases Vine Wave every third claw attack; benefits from purchased nature upgrades but cannot create extra waves or charge transformation."
    },
    {
      "id": "O-4-W-A1",
      "name": "Forbidden Magic",
      "cost": 5,
      "prerequisites": "T4-W-GATE",
      "effect": "+50% basic damage."
    },
    {
      "id": "O-4-W-A2",
      "name": "Lingering Curse",
      "cost": 5,
      "prerequisites": "O-4-W-A1",
      "effect": "+50% Doom Sigil duration."
    },
    {
      "id": "O-4-W-A3",
      "name": "Greater Doom",
      "cost": 6,
      "prerequisites": "O-4-W-A2",
      "effect": "+50% Doom Sigil explosion damage."
    },
    {
      "id": "O-4-W-A4",
      "name": "Soul Collector",
      "cost": 8,
      "prerequisites": "O-4-W-A3",
      "effect": "Each own triggered sigil explosion adds +5 percentage points basic damage for current battle, max +100%."
    },
    {
      "id": "O-4-W-A5",
      "name": "Final Curse",
      "cost": 10,
      "prerequisites": "O-4-W-A4",
      "effect": "Sigil explosions leave dark flames dealing additional 50% explosion damage over 3s."
    },
    {
      "id": "O-4-W-B1",
      "name": "Dark Vitality",
      "cost": 5,
      "prerequisites": "T4-W-GATE",
      "effect": "+40% max HP."
    },
    {
      "id": "O-4-W-B2",
      "name": "Greater Siphon",
      "cost": 5,
      "prerequisites": "O-4-W-B1",
      "effect": "+50% Life Siphon damage and healing."
    },
    {
      "id": "O-4-W-B3",
      "name": "Blood Pact",
      "cost": 6,
      "prerequisites": "O-4-W-B2",
      "effect": "+50% Life Siphon charge rate while below half HP."
    },
    {
      "id": "O-4-W-B4",
      "name": "Soul Armour",
      "cost": 8,
      "prerequisites": "O-4-W-B3",
      "effect": "Excess Siphon healing becomes shield capped at 30% max HP."
    },
    {
      "id": "O-4-W-B5",
      "name": "Undying Pact",
      "cost": 10,
      "prerequisites": "O-4-W-B4",
      "effect": "Each Life Siphon cast adds +10 percentage points basic damage for current battle, max +50%."
    },
    {
      "id": "O-5-BM-A1",
      "name": "Reinforced Whip",
      "cost": 6,
      "prerequisites": "T5-BM-GATE",
      "effect": "+50% basic damage."
    },
    {
      "id": "O-5-BM-A2",
      "name": "Master's Rhythm",
      "cost": 6,
      "prerequisites": "O-5-BM-A1",
      "effect": "+25% basic attack rate."
    },
    {
      "id": "O-5-BM-A3",
      "name": "Pack Instinct",
      "cost": 8,
      "prerequisites": "O-5-BM-A2",
      "effect": "Every third completed Whip attack grants each living own hound +50% damage on its next attack."
    },
    {
      "id": "O-5-BM-A4",
      "name": "Blood Bond",
      "cost": 9,
      "prerequisites": "O-5-BM-A3",
      "effect": "Heal Beastmaster 10% actual damage dealt by own hounds."
    },
    {
      "id": "O-5-BM-A5",
      "name": "Alpha Master",
      "cost": 10,
      "prerequisites": "O-5-BM-A4",
      "effect": "Each active own hound adds +25 percentage points Beastmaster basic damage, max +100%."
    },
    {
      "id": "O-5-BM-B1",
      "name": "Hardened Beasts",
      "cost": 6,
      "prerequisites": "T5-BM-GATE",
      "effect": "+50% hound max HP."
    },
    {
      "id": "O-5-BM-B2",
      "name": "Savage Fangs",
      "cost": 6,
      "prerequisites": "O-5-BM-B1",
      "effect": "+50% hound basic damage."
    },
    {
      "id": "O-5-BM-B3",
      "name": "Rapid Summoning",
      "cost": 8,
      "prerequisites": "O-5-BM-B2",
      "effect": "+40% Summon Hound charge rate."
    },
    {
      "id": "O-5-BM-B4",
      "name": "Alpha Hound",
      "cost": 9,
      "prerequisites": "O-5-BM-B3",
      "effect": "Every third hound summoned is Alpha, additional +100% base HP and damage; normal summon slot."
    },
    {
      "id": "O-5-BM-B5",
      "name": "Legendary Pack",
      "cost": 10,
      "prerequisites": "O-5-BM-B4",
      "effect": "Summon Hound creates two instead of one; owner cap +2."
    },
    {
      "id": "O-5-NE-A1",
      "name": "Soul Conduit",
      "cost": 6,
      "prerequisites": "T5-NE-GATE",
      "effect": "+50% baseline beam DPS."
    },
    {
      "id": "O-5-NE-A2",
      "name": "Accelerated Drain",
      "cost": 6,
      "prerequisites": "O-5-NE-A1",
      "effect": "Beam ramp rate +40% (proposed interpretation of reaches maximum 40% faster)."
    },
    {
      "id": "O-5-NE-A3",
      "name": "Dark Resonance",
      "cost": 8,
      "prerequisites": "O-5-NE-A2",
      "effect": "Each active own undead adds +10 percentage points baseline beam DPS, max +50%."
    },
    {
      "id": "O-5-NE-A4",
      "name": "Soul Overload",
      "cost": 9,
      "prerequisites": "O-5-NE-A3",
      "effect": "+50% of base maximum ramp damage bonus."
    },
    {
      "id": "O-5-NE-A5",
      "name": "Death Incarnate",
      "cost": 10,
      "prerequisites": "O-5-NE-A4",
      "effect": "At maximum intensity, beam deals +50% damage against elites and bosses."
    },
    {
      "id": "O-5-NE-B1",
      "name": "Reinforced Bones",
      "cost": 6,
      "prerequisites": "T5-NE-GATE",
      "effect": "+75% undead max HP."
    },
    {
      "id": "O-5-NE-B2",
      "name": "Grave Weapons",
      "cost": 6,
      "prerequisites": "O-5-NE-B1",
      "effect": "+75% undead basic damage."
    },
    {
      "id": "O-5-NE-B3",
      "name": "Eternal Servants",
      "cost": 8,
      "prerequisites": "O-5-NE-B2",
      "effect": "+75% undead lifetime."
    },
    {
      "id": "O-5-NE-B4",
      "name": "Death Knight",
      "cost": 8,
      "prerequisites": "O-5-NE-B3",
      "effect": "Every fifth qualifying summon is Death Knight instead, additional +100% base HP and damage; uses normal summon slot."
    },
    {
      "id": "O-5-NE-B5",
      "name": "Undead Legion",
      "cost": 9,
      "prerequisites": "O-5-NE-B4",
      "effect": "Maximum active undead +50% rounded up; +25% undead attack rate."
    },
    {
      "id": "O-5-DR-A1",
      "name": "Ancient Scales",
      "cost": 6,
      "prerequisites": "T5-DR-GATE",
      "effect": "+50% max HP."
    },
    {
      "id": "O-5-DR-A2",
      "name": "Draconic Strength",
      "cost": 6,
      "prerequisites": "O-5-DR-A1",
      "effect": "+50% basic damage."
    },
    {
      "id": "O-5-DR-A3",
      "name": "Searing Scales",
      "cost": 8,
      "prerequisites": "O-5-DR-A2",
      "effect": "Incoming basic attacks inflict burn on attacker equal to 20% Dragonkin basic damage over 3s; same source refreshes, no recursive retaliation."
    },
    {
      "id": "O-5-DR-A4",
      "name": "Unbreakable Hide",
      "cost": 9,
      "prerequisites": "O-5-DR-A3",
      "effect": "20% incoming damage reduction during battle."
    },
    {
      "id": "O-5-DR-A5",
      "name": "Dragonheart",
      "cost": 10,
      "prerequisites": "O-5-DR-A4",
      "effect": "First nonlethal crossing below 25% HP restores 20% max HP and fully charges Dragon Breath, once per battle."
    },
    {
      "id": "O-5-DR-B1",
      "name": "Flame Mastery",
      "cost": 6,
      "prerequisites": "T5-DR-GATE",
      "effect": "+50% Dragon Breath damage."
    },
    {
      "id": "O-5-DR-B2",
      "name": "Scorching Breath",
      "cost": 6,
      "prerequisites": "O-5-DR-B1",
      "effect": "Breath adds burn equal to 50% of its damage over 4s."
    },
    {
      "id": "O-5-DR-B3",
      "name": "Inner Furnace",
      "cost": 8,
      "prerequisites": "O-5-DR-B2",
      "effect": "+40% Dragon Breath charge rate."
    },
    {
      "id": "O-5-DR-B4",
      "name": "Wildfire",
      "cost": 9,
      "prerequisites": "O-5-DR-B3",
      "effect": "Dragon Breath deals +50% damage against burning enemies."
    },
    {
      "id": "O-5-DR-B5",
      "name": "Dragon's Wrath",
      "cost": 10,
      "prerequisites": "O-5-DR-B4",
      "effect": "After Dragon Breath, next three Lunges gain +50% damage and apply burning; proposed burn uses Scorching Breath proportional rule pending tuning."
    },
    {
      "id": "O-TW01",
      "name": "Reinforced Ammunition",
      "cost": 2,
      "prerequisites": "T1-ROOT",
      "effect": "+1 projectile damage."
    },
    {
      "id": "O-TW02",
      "name": "Tower Masonry",
      "cost": 3,
      "prerequisites": "T1-ROOT",
      "effect": "+35% tower base HP."
    },
    {
      "id": "O-TW03",
      "name": "Rapid Fire",
      "cost": 4,
      "prerequisites": "T2-ROOT + O-TW01",
      "effect": "+25% base firing rate."
    },
    {
      "id": "O-TW04",
      "name": "Heavy Bolts",
      "cost": 4,
      "prerequisites": "T2-ROOT + O-TW03",
      "effect": "Pierce one additional distinct enemy."
    },
    {
      "id": "O-TW05",
      "name": "Reinforced Foundations",
      "cost": 5,
      "prerequisites": "T3-ROOT + O-TW02",
      "effect": "+40% additional tower base HP."
    },
    {
      "id": "O-TW06",
      "name": "Explosive Shot",
      "cost": 6,
      "prerequisites": "T3-ROOT + O-TW04",
      "effect": "On each direct impact deal 40% of that projectile's resolved damage to other enemies in 0.9-unit radius; proposed geometry retained from previous draft."
    },
    {
      "id": "O-TW07",
      "name": "Arcane Ammunition",
      "cost": 7,
      "prerequisites": "T4-ROOT + O-TW06",
      "effect": "+2 projectile damage."
    },
    {
      "id": "O-TW08",
      "name": "Twin Shot",
      "cost": 8,
      "prerequisites": "T4-ROOT + O-TW07",
      "effect": "Second slightly separated projectile per firing cycle, 60% normal resolved damage; same stored aim, no auto-aim."
    },
    {
      "id": "O-TW09",
      "name": "Fortified Citadel",
      "cost": 9,
      "prerequisites": "T5-ROOT + O-TW05",
      "effect": "+50% additional tower base HP."
    },
    {
      "id": "O-TW10",
      "name": "Arcane Overload",
      "cost": 10,
      "prerequisites": "T5-ROOT + O-TW08",
      "effect": "Every fifth firing cycle deals double normal damage; applies to both projectiles and their derived splash, count once per cycle."
    },
    {
      "id": "O-SP01",
      "name": "Lightning Strike",
      "cost": 6,
      "prerequisites": "T3-ROOT + P>=2",
      "effect": "Manual strike 12 damage in radius 1.25, 25s cooldown."
    },
    {
      "id": "O-SP02",
      "name": "Healing Circle",
      "cost": 6,
      "prerequisites": "T3-ROOT + P>=2",
      "effect": "Manual zone heals 2 HP/sec for 5s, radius 2, 30s cooldown."
    },
    {
      "id": "O-SP03",
      "name": "Frost Field",
      "cost": 6,
      "prerequisites": "T3-ROOT + P>=2",
      "effect": "Manual zone slows enemies 35% for 5s, radius 2, 30s cooldown."
    },
    {
      "id": "O-SP04",
      "name": "Ember Rain",
      "cost": 8,
      "prerequisites": "T4-ROOT + P>=3",
      "effect": "Manual zone deals 1.5 damage/sec for 5s, radius 2, 35s cooldown."
    },
    {
      "id": "O-SP05",
      "name": "Charged Lightning",
      "cost": 5,
      "prerequisites": "O-SP01",
      "effect": "+50% Lightning damage."
    },
    {
      "id": "O-SP06",
      "name": "Sacred Recovery",
      "cost": 5,
      "prerequisites": "O-SP02",
      "effect": "+50% Healing Circle healing rate."
    },
    {
      "id": "O-SP07",
      "name": "Lingering Frost",
      "cost": 5,
      "prerequisites": "O-SP03",
      "effect": "+50% Frost duration."
    },
    {
      "id": "O-SP08",
      "name": "Arcane Efficiency",
      "cost": 7,
      "prerequisites": "T4-ROOT + P>=3 + ANY(O-SP01,O-SP02,O-SP03,O-SP04)",
      "effect": "All owned spells cooldown ×0.8."
    },
    {
      "id": "O-SP09",
      "name": "Infernal Rain",
      "cost": 7,
      "prerequisites": "O-SP04",
      "effect": "+50% Ember damage rate."
    },
    {
      "id": "O-SP10",
      "name": "Expanded Magic",
      "cost": 8,
      "prerequisites": "T4-ROOT + P>=3 + O-SP08",
      "effect": "+25% all spell effect radii."
    },
    {
      "id": "O-SP11",
      "name": "Dual Casting",
      "cost": 8,
      "prerequisites": "T5-ROOT + P>=4 + ANY(O-SP01,O-SP02,O-SP03,O-SP04)",
      "effect": "Second equipped slot; two distinct known spells; independent cooldowns."
    },
    {
      "id": "O-SP12",
      "name": "Arcane Mastery",
      "cost": 10,
      "prerequisites": "T5-ROOT + P>=4 + O-SP10",
      "effect": "+25% additional base damage and healing rates of owned spells."
    },
    {
      "id": "O-SP13",
      "name": "Echo Casting",
      "cost": 12,
      "prerequisites": "T5-ROOT + P>=4 + O-SP12",
      "effect": "Every third manual cast across slots echoes the same effect at 50% potency at original cast point; see audit rules."
    },
    {
      "id": "V2-KNI-01",
      "name": "Shield Reprieve",
      "cost": 4,
      "prerequisites": "T1-K-GATE + R-KNI-C + O-1-K-A2",
      "effect": "Blocking heals 5% max HP, at most once per 2s; requires O-1-K-A2 Shield Training."
    },
    {
      "id": "V2-KNI-02",
      "name": "Bannerman",
      "cost": 7,
      "prerequisites": "T1-K-GATE + R-KNI-E + V2-KNI-01",
      "effect": "Every third Shield Bash grants all other living heroes +25% base basic attack rate for 5s; same named effect refreshes."
    },
    {
      "id": "V2-ARC-01",
      "name": "Crossfire",
      "cost": 4,
      "prerequisites": "T1-A-GATE + R-ARC-C",
      "effect": "Arrow Volley deals +50% damage to enemies directly damaged by another hero within preceding 2s."
    },
    {
      "id": "V2-ARC-02",
      "name": "Endless Quiver",
      "cost": 7,
      "prerequisites": "T1-A-GATE + R-ARC-E + V2-ARC-01",
      "effect": "Every fifth completed basic arrow attack launches second arrow along the same attack line at 75% normal damage; no additional targeting or attack count."
    },
    {
      "id": "V2-MAG-01",
      "name": "Crowd Conductor",
      "cost": 4,
      "prerequisites": "T1-MG-GATE + R-MAG-C",
      "effect": "Fireball hits three or more distinct enemies grants 10 percentage points Chain Bolt charge, at most once per 2s."
    },
    {
      "id": "V2-MAG-02",
      "name": "Storm Furnace",
      "cost": 7,
      "prerequisites": "T1-MG-GATE + R-MAG-E + V2-MAG-01",
      "effect": "Chain Bolt empowers next two Fireballs with +50% normal damage; refresh remaining count, no stacking."
    },
    {
      "id": "V2-HUN-01",
      "name": "Deep Wounds",
      "cost": 6,
      "prerequisites": "T2-H-GATE + R-HUN-C",
      "effect": "Hunter bleed ignores 25% of existing enemy damage resistance (not 25 percentage points); no effect on unresisted damage."
    },
    {
      "id": "V2-HUN-02",
      "name": "Bloodstorm",
      "cost": 9,
      "prerequisites": "T2-H-GATE + R-HUN-E + V2-HUN-01 + O-2-H-A3",
      "effect": "Enemy dies with three own Hunter bleed stacks: burst equal to their remaining damage; requires O-2-H-A3 Open Wounds; no new bleed or recursive bursts."
    },
    {
      "id": "V2-BAR-01",
      "name": "Crowd Breaker",
      "cost": 6,
      "prerequisites": "T2-B-GATE + R-BAR-C",
      "effect": "Each extra enemy struck by own cleave adds 10% damage to next cleave, capped at +50%; consume once and calculate next bonus from new hit count."
    },
    {
      "id": "V2-BAR-02",
      "name": "Titan Slayer",
      "cost": 9,
      "prerequisites": "T2-B-GATE + R-BAR-E + V2-BAR-01",
      "effect": "Every fifth completed basic attack during one Frenzy deals triple normal damage; count actual attacks, not individual targets."
    },
    {
      "id": "V2-ROG-01",
      "name": "Venomous Recovery",
      "cost": 6,
      "prerequisites": "T2-R-GATE + R-ROG-C + O-2-R-A2",
      "effect": "Heal 10% actual poison damage dealt; requires O-2-R-A2 Poisoned Steel."
    },
    {
      "id": "V2-ROG-02",
      "name": "Afterimage",
      "cost": 9,
      "prerequisites": "T2-R-GATE + R-ROG-E + V2-ROG-01",
      "effect": "When Smoke Bomb ends deal 25% of remaining own poison damage on each affected enemy without consuming stacks; no reapplication or recursive trigger."
    },
    {
      "id": "V2-PAL-01",
      "name": "Consecrated Flame",
      "cost": 6,
      "prerequisites": "T3-P-GATE + R-PAL-C",
      "effect": "Every third Hammer Strike creates a ground patch lasting twice normal duration."
    },
    {
      "id": "V2-PAL-02",
      "name": "Sacred Retribution",
      "cost": 9,
      "prerequisites": "T3-P-GATE + R-PAL-E + V2-PAL-01",
      "effect": "Every fifth own Aegis shield fully consumed by enemy damage grants 25 percentage points charge; at most once per 2s; no expiry trigger."
    },
    {
      "id": "V2-NUN-01",
      "name": "Shared Vitality",
      "cost": 6,
      "prerequisites": "T3-N-GATE + R-NUN-C",
      "effect": "Every 20 actual HP healed by own Sanctuary empowers next full combination with double damage; remainder carries within battle, max one pending empowerment."
    },
    {
      "id": "V2-NUN-02",
      "name": "Sanctuary's Farewell",
      "cost": 9,
      "prerequisites": "T3-N-GATE + R-NUN-E + V2-NUN-01",
      "effect": "Living heroes actually healed during Sanctuary Prayer gain 15%-max-HP shield at expiry, 4s proposed duration; no tower, summons or downed heroes."
    },
    {
      "id": "V2-PRI-01",
      "name": "Divine Sacrament",
      "cost": 6,
      "prerequisites": "T3-PR-GATE + R-PRI-C",
      "effect": "Blessed heroes heal 5% max HP after every fifth personal qualifying kill while blessed; count per recipient, not per Priest."
    },
    {
      "id": "V2-PRI-02",
      "name": "Eternal Hymn",
      "cost": 9,
      "prerequisites": "T3-PR-GATE + R-PRI-E + V2-PRI-01",
      "effect": "Every third Blessing activation lasts twice its normal duration; same named buff does not stack."
    },
    {
      "id": "V2-SHA-01",
      "name": "Mending Draught",
      "cost": 8,
      "prerequisites": "T4-S-GATE + R-SHA-C",
      "effect": "Every fourth completed Vial Throw restores 20% max HP to each living owned totem."
    },
    {
      "id": "V2-SHA-02",
      "name": "Ancestral Remedy",
      "cost": 12,
      "prerequisites": "T4-S-GATE + R-SHA-E + V2-SHA-01",
      "effect": "When an owned totem is destroyed by enemies, prime next Vial Throw for triple normal damage; one pending prime, no stack or trigger on natural expiry."
    },
    {
      "id": "V2-DRU-01",
      "name": "Nature's Balance",
      "cost": 8,
      "prerequisites": "T4-D-GATE + R-DRU-C",
      "effect": "Entering Bear Form grants shield worth 25% max HP for 4s (duration proposed)."
    },
    {
      "id": "V2-DRU-02",
      "name": "Primal Awakening",
      "cost": 12,
      "prerequisites": "T4-D-GATE + R-DRU-E + V2-DRU-01",
      "effect": "Every third Bear Form activation lasts twice normal duration."
    },
    {
      "id": "V2-WAR-01",
      "name": "Soul Tribute",
      "cost": 8,
      "prerequisites": "T4-W-GATE + R-WAR-C",
      "effect": "Each own Doom Sigil explosion grants 5 percentage points Life Siphon charge, at most once per second."
    },
    {
      "id": "V2-WAR-02",
      "name": "Final Offering",
      "cost": 12,
      "prerequisites": "T4-W-GATE + R-WAR-E + V2-WAR-01",
      "effect": "Direct Life Siphon final blow on own Doom-marked enemy causes its single sigil explosion to deal triple damage; no extra burst."
    },
    {
      "id": "V2-BEA-01",
      "name": "Ferocious Pack",
      "cost": 8,
      "prerequisites": "T5-BM-GATE + R-BEA-C",
      "effect": "Own hounds have 25% crit chance, double basic damage."
    },
    {
      "id": "V2-BEA-02",
      "name": "Bloodline",
      "cost": 12,
      "prerequisites": "T5-BM-GATE + R-BEA-E + V2-BEA-01",
      "effect": "Own hounds inherit 50% of owner's additive permanent basic-damage bonus, capped at +50% of hound base damage; exclude skin bonus and recursive modifiers."
    },
    {
      "id": "V2-NEC-01",
      "name": "Grave Strength",
      "cost": 8,
      "prerequisites": "T5-NE-GATE + R-NEC-C",
      "effect": "Own undead deal +50% damage while Necromancer's beam is at maximum intensity."
    },
    {
      "id": "V2-NEC-02",
      "name": "Grave Vengeance",
      "cost": 12,
      "prerequisites": "T5-NE-GATE + R-NEC-E + V2-NEC-01",
      "effect": "Each own undead destroyed by enemies adds +5 percentage points baseline beam DPS for rest of combat, cap +100%; no expiry trigger."
    },
    {
      "id": "V2-DRA-01",
      "name": "Molten Heart",
      "cost": 8,
      "prerequisites": "T5-DR-GATE + R-DRA-C",
      "effect": "Own burn damage grants Dragon Breath charge, capped at 10 percentage points per 2s; proposed 5 points per eligible damage event until cap; excludes other heroes' burn."
    },
    {
      "id": "V2-DRA-02",
      "name": "Ancient Dragonfire",
      "cost": 12,
      "prerequisites": "T5-DR-GATE + R-DRA-E + V2-DRA-01",
      "effect": "Every third Dragon Breath deals triple normal damage."
    }
  ],
  "legacy": [
    {
      "id": "R-G01",
      "name": "Veteran Blood",
      "cost": 1,
      "prerequisites": "ROOT",
      "effect": "Stat | +25% base HP for all hero classes."
    },
    {
      "id": "R-G02",
      "name": "Forged Arms",
      "cost": 2,
      "prerequisites": "R-G01",
      "effect": "Stat | +25% base basic damage for all hero classes."
    },
    {
      "id": "R-G03",
      "name": "Battle Rhythm",
      "cost": 2,
      "prerequisites": "R-G02",
      "effect": "Stat | +25% basic attack rate for all hero classes."
    },
    {
      "id": "R-G04",
      "name": "Long March",
      "cost": 3,
      "prerequisites": "R-G03",
      "effect": "Stat | +25% base movement speed for all hero classes; guard radius unchanged."
    },
    {
      "id": "R-G05",
      "name": "Opening Orders",
      "cost": 3,
      "prerequisites": "R-G04",
      "effect": "Mechanic | All timed-special heroes start deployed with an additional 15 percentage points of charge (cap 100%). Necromancer remains on-kill. No reset of charge on rescue."
    },
    {
      "id": "R-G06",
      "name": "United Banner",
      "cost": 4,
      "prerequisites": "R-G05",
      "effect": "Mechanic | When at least three distinct living deployable hero classes are present, all living deployable heroes gain +15% base basic damage while condition holds. No summons count; evaluate once, not per hero."
    },
    {
      "id": "R-G07",
      "name": "Hardened Company",
      "cost": 4,
      "prerequisites": "R-G06",
      "effect": "Stat | +25% additional base HP for all hero classes."
    },
    {
      "id": "R-G08",
      "name": "Boss Readiness",
      "cost": 5,
      "prerequisites": "R-G07",
      "effect": "Mechanic | At the start of the first boss phase in each attempt, grant every living deployable hero a 15%-max-HP shield for 5s. Once per attempt, no activation for each Legion boss."
    },
    {
      "id": "R-G09",
      "name": "Seasoned Army",
      "cost": 6,
      "prerequisites": "R-G08",
      "effect": "Stat | +25% additional base basic damage for all hero classes."
    },
    {
      "id": "R-G10",
      "name": "Lasting Fellowship",
      "cost": 12,
      "prerequisites": "R-G09",
      "effect": "Mechanic | The first time a deployable hero of a particular class is fully removed after capture, surviving OTHER classes gain 5 percentage points of base basic attack rate for the round; maximum +25% total, once per distinct removed class, never on a temporary down or summon expiry."
    },
    {
      "id": "R-KNI-A",
      "name": "Plate Oath",
      "cost": 1,
      "prerequisites": "R-G01",
      "effect": "Stat | +25% Knight base HP."
    },
    {
      "id": "R-KNI-B",
      "name": "Iron Resolve",
      "cost": 2,
      "prerequisites": "R-KNI-A",
      "effect": "Permanent mechanic | Every fifth damaging hit received by Knight deals 50% less damage; count actual positive incoming hits per living unit, reset after triggering."
    },
    {
      "id": "R-KNI-C",
      "name": "Shield Reprieve",
      "cost": 2,
      "prerequisites": "R-KNI-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-KNI-01; buy for 4 UP each run. Requires T1-K-GATE + R-KNI-C + O-1-K-A2. Blocking heals 5% max HP, at most once per 2s; requires O-1-K-A2 Shield Training. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-KNI-D",
      "name": "Shielded Veteran",
      "cost": 5,
      "prerequisites": "R-KNI-B",
      "effect": "Permanent mechanic | Each Shield Bash grants Knight a shield worth 15% max HP for 4s; once per cast, refresh rather than stack."
    },
    {
      "id": "R-KNI-E",
      "name": "Bannerman",
      "cost": 6,
      "prerequisites": "R-KNI-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-KNI-02; buy for 7 UP each run. Requires T1-K-GATE + R-KNI-E + V2-KNI-01. Every third Shield Bash grants all other living heroes +25% base basic attack rate for 5s; same named effect refreshes. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-ARC-A",
      "name": "Hawkeye",
      "cost": 1,
      "prerequisites": "R-G01",
      "effect": "Stat | +25% Archer base basic damage."
    },
    {
      "id": "R-ARC-B",
      "name": "Sharpened Quiver",
      "cost": 2,
      "prerequisites": "R-ARC-A",
      "effect": "Permanent mechanic | Every fourth completed normal arrow attack deals +50% normal damage, regardless of whom it hits; counter per unit, no extra arrow."
    },
    {
      "id": "R-ARC-C",
      "name": "Crossfire",
      "cost": 3,
      "prerequisites": "R-ARC-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-ARC-01; buy for 4 UP each run. Requires T1-A-GATE + R-ARC-C. Arrow Volley deals +50% damage to enemies directly damaged by another hero within preceding 2s. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-ARC-D",
      "name": "Splintered Shafts",
      "cost": 5,
      "prerequisites": "R-ARC-B",
      "effect": "Permanent mechanic | Every fifth completed Straight Arrow attack applies a bleed totalling 25% of normal basic damage over 2s on hit; no new projectile or target change."
    },
    {
      "id": "R-ARC-E",
      "name": "Endless Quiver",
      "cost": 6,
      "prerequisites": "R-ARC-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-ARC-02; buy for 7 UP each run. Requires T1-A-GATE + R-ARC-E + V2-ARC-01. Every fifth completed basic arrow attack launches second arrow along the same attack line at 75% normal damage; no additional targeting or attack count. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-MAG-A",
      "name": "Emberheart",
      "cost": 1,
      "prerequisites": "R-G01",
      "effect": "Stat | +25% Mage base basic damage."
    },
    {
      "id": "R-MAG-B",
      "name": "Opening Flare",
      "cost": 2,
      "prerequisites": "R-MAG-A",
      "effect": "Permanent mechanic | First Fireball each attempt has +50% normal splash damage to secondary targets only; never repeats on rescue."
    },
    {
      "id": "R-MAG-C",
      "name": "Crowd Conductor",
      "cost": 3,
      "prerequisites": "R-MAG-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-MAG-01; buy for 4 UP each run. Requires T1-MG-GATE + R-MAG-C. Fireball hits three or more distinct enemies grants 10 percentage points Chain Bolt charge, at most once per 2s. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-MAG-D",
      "name": "Kindled Charge",
      "cost": 5,
      "prerequisites": "R-MAG-B",
      "effect": "Permanent mechanic | A Fireball primary-target final blow grants 10 percentage points of Chain Bolt charge, at most once per 2s."
    },
    {
      "id": "R-MAG-E",
      "name": "Storm Furnace",
      "cost": 7,
      "prerequisites": "R-MAG-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-MAG-02; buy for 7 UP each run. Requires T1-MG-GATE + R-MAG-E + V2-MAG-01. Chain Bolt empowers next two Fireballs with +50% normal damage; refresh remaining count, no stacking. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-HUN-A",
      "name": "Trailcraft",
      "cost": 2,
      "prerequisites": "R-G03",
      "effect": "Stat | +25% Hunter base damage."
    },
    {
      "id": "R-HUN-B",
      "name": "Big Game",
      "cost": 3,
      "prerequisites": "R-HUN-A",
      "effect": "Permanent mechanic | Hunter's own Serrated Arrow bleed ticks deal +25% normal bleed damage to bosses and faction bosses."
    },
    {
      "id": "R-HUN-C",
      "name": "Deep Wounds",
      "cost": 3,
      "prerequisites": "R-HUN-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-HUN-01; buy for 6 UP each run. Requires T2-H-GATE + R-HUN-C. Hunter bleed ignores 25% of existing enemy damage resistance (not 25 percentage points); no effect on unresisted damage. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-HUN-D",
      "name": "Trap Bounty",
      "cost": 6,
      "prerequisites": "R-HUN-B",
      "effect": "Permanent mechanic | When a target affected by Hunter's own Tripwire and bleed dies, add 15 percentage points to that Hunter's next trap charge, once per 2s, not extra kill credit."
    },
    {
      "id": "R-HUN-E",
      "name": "Bloodstorm",
      "cost": 7,
      "prerequisites": "R-HUN-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-HUN-02; buy for 9 UP each run. Requires T2-H-GATE + R-HUN-E + V2-HUN-01 + O-2-H-A3. Enemy dies with three own Hunter bleed stacks: burst equal to their remaining damage; requires O-2-H-A3 Open Wounds; no new bleed or recursive bursts. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-BAR-A",
      "name": "Iron Hide",
      "cost": 2,
      "prerequisites": "R-G03",
      "effect": "Stat | +25% Barbarian base HP."
    },
    {
      "id": "R-BAR-B",
      "name": "Bloodied Axe",
      "cost": 3,
      "prerequisites": "R-BAR-A",
      "effect": "Permanent mechanic | A Wide Cleave that kills at least one enemy heals Barbarian by 5% max HP once per swing, not once per enemy."
    },
    {
      "id": "R-BAR-C",
      "name": "Crowd Breaker",
      "cost": 3,
      "prerequisites": "R-BAR-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-BAR-01; buy for 6 UP each run. Requires T2-B-GATE + R-BAR-C. Each extra enemy struck by own cleave adds 10% damage to next cleave, capped at +50%; consume once and calculate next bonus from new hit count. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-BAR-D",
      "name": "Rage's Reward",
      "cost": 6,
      "prerequisites": "R-BAR-B",
      "effect": "Permanent mechanic | If at least three enemies die to Barbarian during a Battle Frenzy activation, grant a 20%-max-HP shield for 4s when that activation ends alive; once per activation."
    },
    {
      "id": "R-BAR-E",
      "name": "Titan Slayer",
      "cost": 8,
      "prerequisites": "R-BAR-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-BAR-02; buy for 9 UP each run. Requires T2-B-GATE + R-BAR-E + V2-BAR-01. Every fifth completed basic attack during one Frenzy deals triple normal damage; count actual attacks, not individual targets. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-ROG-A",
      "name": "Quicksteel",
      "cost": 2,
      "prerequisites": "R-G03",
      "effect": "Stat | +25% Rogue base basic attack rate."
    },
    {
      "id": "R-ROG-B",
      "name": "Razor Rhythm",
      "cost": 3,
      "prerequisites": "R-ROG-A",
      "effect": "Permanent mechanic | Every fifth completed normal dagger strike deals +50% normal damage; count across all attacks, no extra attack."
    },
    {
      "id": "R-ROG-C",
      "name": "Venomous Recovery",
      "cost": 3,
      "prerequisites": "R-ROG-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-ROG-01; buy for 6 UP each run. Requires T2-R-GATE + R-ROG-C + O-2-R-A2. Heal 10% actual poison damage dealt; requires O-2-R-A2 Poisoned Steel. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-ROG-D",
      "name": "Ghost's Prize",
      "cost": 6,
      "prerequisites": "R-ROG-B",
      "effect": "Permanent mechanic | During one Smoke Bomb activation, first direct dagger hit on each new enemy restores 5% Rogue max HP, maximum two heals per activation."
    },
    {
      "id": "R-ROG-E",
      "name": "Afterimage",
      "cost": 8,
      "prerequisites": "R-ROG-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-ROG-02; buy for 9 UP each run. Requires T2-R-GATE + R-ROG-E + V2-ROG-01. When Smoke Bomb ends deal 25% of remaining own poison damage on each affected enemy without consuming stacks; no reapplication or recursive trigger. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-PAL-A",
      "name": "Consecrated Plate",
      "cost": 2,
      "prerequisites": "R-G05",
      "effect": "Stat | +25% Paladin base HP."
    },
    {
      "id": "R-PAL-B",
      "name": "Merciful Aegis",
      "cost": 3,
      "prerequisites": "R-PAL-A",
      "effect": "Permanent mechanic | Divine Aegis grants +25% base shield amount to each eligible recipient already below half HP at cast time."
    },
    {
      "id": "R-PAL-C",
      "name": "Consecrated Flame",
      "cost": 4,
      "prerequisites": "R-PAL-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-PAL-01; buy for 6 UP each run. Requires T3-P-GATE + R-PAL-C. Every third Hammer Strike creates a ground patch lasting twice normal duration. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-PAL-D",
      "name": "Faith Returned",
      "cost": 7,
      "prerequisites": "R-PAL-B",
      "effect": "Permanent mechanic | When an ally's shield from this Paladin is fully consumed by damage, add 10 percentage points to that Paladin's charge; maximum 20 per cast, not expiry or transfer."
    },
    {
      "id": "R-PAL-E",
      "name": "Sacred Retribution",
      "cost": 8,
      "prerequisites": "R-PAL-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-PAL-02; buy for 9 UP each run. Requires T3-P-GATE + R-PAL-E + V2-PAL-01. Every fifth own Aegis shield fully consumed by enemy damage grants 25 percentage points charge; at most once per 2s; no expiry trigger. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-NUN-A",
      "name": "Discipline of Life",
      "cost": 2,
      "prerequisites": "R-G05",
      "effect": "Stat | +25% Nun base HP."
    },
    {
      "id": "R-NUN-B",
      "name": "Shared Prayer",
      "cost": 3,
      "prerequisites": "R-NUN-A",
      "effect": "Permanent mechanic | Nun heals herself for 20% of actual Sanctuary Prayer healing delivered to other deployable heroes, capped at 10% of her own max HP per cast; no recursive healing."
    },
    {
      "id": "R-NUN-C",
      "name": "Shared Vitality",
      "cost": 4,
      "prerequisites": "R-NUN-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-NUN-01; buy for 6 UP each run. Requires T3-N-GATE + R-NUN-C. Every 20 actual HP healed by own Sanctuary empowers next full combination with double damage; remainder carries within battle, max one pending empowerment. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-NUN-D",
      "name": "Gentle Palm",
      "cost": 6,
      "prerequisites": "R-NUN-B",
      "effect": "Permanent mechanic | Every completed Monastic Combination heals Nun for 5% max HP if she is injured; once per combo."
    },
    {
      "id": "R-NUN-E",
      "name": "Sanctuary's Farewell",
      "cost": 8,
      "prerequisites": "R-NUN-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-NUN-02; buy for 9 UP each run. Requires T3-N-GATE + R-NUN-E + V2-NUN-01. Living heroes actually healed during Sanctuary Prayer gain 15%-max-HP shield at expiry, 4s proposed duration; no tower, summons or downed heroes. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-PRI-A",
      "name": "Luminous Resolve",
      "cost": 2,
      "prerequisites": "R-G05",
      "effect": "Stat | +25% Priest base HP."
    },
    {
      "id": "R-PRI-B",
      "name": "Answered Prayer",
      "cost": 3,
      "prerequisites": "R-PRI-A",
      "effect": "Permanent mechanic | Whenever any other deployable hero defeats a qualifying scheduled-wave enemy while Priest is alive, add 3 percentage points to Priest's charge, at most once per 2s; true kill owner unchanged."
    },
    {
      "id": "R-PRI-C",
      "name": "Divine Sacrament",
      "cost": 4,
      "prerequisites": "R-PRI-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-PRI-01; buy for 6 UP each run. Requires T3-PR-GATE + R-PRI-C. Blessed heroes heal 5% max HP after every fifth personal qualifying kill while blessed; count per recipient, not per Priest. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-PRI-D",
      "name": "Courage Against Giants",
      "cost": 7,
      "prerequisites": "R-PRI-B",
      "effect": "Permanent mechanic | Heroes under Priest's Blessing of Courage deal +15% normal basic damage to bosses, unique effect across multiple Priests."
    },
    {
      "id": "R-PRI-E",
      "name": "Eternal Hymn",
      "cost": 9,
      "prerequisites": "R-PRI-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-PRI-02; buy for 9 UP each run. Requires T3-PR-GATE + R-PRI-E + V2-PRI-01. Every third Blessing activation lasts twice its normal duration; same named buff does not stack. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-SHA-A",
      "name": "Spiritual Resilience",
      "cost": 3,
      "prerequisites": "R-G07",
      "effect": "Stat | +25% Shaman base HP."
    },
    {
      "id": "R-SHA-B",
      "name": "Potent Venom",
      "cost": 4,
      "prerequisites": "R-SHA-A",
      "effect": "Permanent mechanic | Every third Vial Throw gains +50% normal damage; count completed casts, no extra throw."
    },
    {
      "id": "R-SHA-C",
      "name": "Mending Draught",
      "cost": 4,
      "prerequisites": "R-SHA-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-SHA-01; buy for 8 UP each run. Requires T4-S-GATE + R-SHA-C. Every fourth completed Vial Throw restores 20% max HP to each living owned totem. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-SHA-D",
      "name": "Spirit Returned",
      "cost": 7,
      "prerequisites": "R-SHA-B",
      "effect": "Permanent mechanic | If a Spirit Totem naturally expires alive, restore 10% of its owner's max HP if the Shaman is alive; once per totem, not destruction."
    },
    {
      "id": "R-SHA-E",
      "name": "Ancestral Remedy",
      "cost": 9,
      "prerequisites": "R-SHA-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-SHA-02; buy for 12 UP each run. Requires T4-S-GATE + R-SHA-E + V2-SHA-01. When an owned totem is destroyed by enemies, prime next Vial Throw for triple normal damage; one pending prime, no stack or trigger on natural expiry. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-DRU-A",
      "name": "Ancient Bark",
      "cost": 3,
      "prerequisites": "R-G07",
      "effect": "Stat | +25% Druid base HP."
    },
    {
      "id": "R-DRU-B",
      "name": "Bearhide",
      "cost": 4,
      "prerequisites": "R-DRU-A",
      "effect": "Permanent mechanic | Entering Bear Form grants a shield worth 15% Druid max HP for 4s; does not extend form or revive."
    },
    {
      "id": "R-DRU-C",
      "name": "Nature's Balance",
      "cost": 4,
      "prerequisites": "R-DRU-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-DRU-01; buy for 8 UP each run. Requires T4-D-GATE + R-DRU-C. Entering Bear Form grants shield worth 25% max HP for 4s (duration proposed). Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-DRU-D",
      "name": "Wild Renewal",
      "cost": 7,
      "prerequisites": "R-DRU-B",
      "effect": "Permanent mechanic | Exiting Bear Form alive restores 10% Druid max HP once per transformation."
    },
    {
      "id": "R-DRU-E",
      "name": "Primal Awakening",
      "cost": 9,
      "prerequisites": "R-DRU-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-DRU-02; buy for 12 UP each run. Requires T4-D-GATE + R-DRU-E + V2-DRU-01. Every third Bear Form activation lasts twice normal duration. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-WAR-A",
      "name": "Forbidden Power",
      "cost": 3,
      "prerequisites": "R-G07",
      "effect": "Stat | +25% Warlock base basic damage."
    },
    {
      "id": "R-WAR-B",
      "name": "Marked Hunger",
      "cost": 4,
      "prerequisites": "R-WAR-A",
      "effect": "Permanent mechanic | Life Siphon restores +25% normal healing when its target carries own Doom Sigil. Does not add targets."
    },
    {
      "id": "R-WAR-C",
      "name": "Soul Tribute",
      "cost": 4,
      "prerequisites": "R-WAR-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-WAR-01; buy for 8 UP each run. Requires T4-W-GATE + R-WAR-C. Each own Doom Sigil explosion grants 5 percentage points Life Siphon charge, at most once per second. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-WAR-D",
      "name": "Soul Tribute",
      "cost": 7,
      "prerequisites": "R-WAR-B",
      "effect": "Permanent mechanic | When own marked enemy dies while Warlock is alive below 50% HP, restore 3% max HP; at most once per 1s, no revive."
    },
    {
      "id": "R-WAR-E",
      "name": "Final Offering",
      "cost": 9,
      "prerequisites": "R-WAR-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-WAR-02; buy for 12 UP each run. Requires T4-W-GATE + R-WAR-E + V2-WAR-01. Direct Life Siphon final blow on own Doom-marked enemy causes its single sigil explosion to deal triple damage; no extra burst. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-BEA-A",
      "name": "Handler's Strength",
      "cost": 3,
      "prerequisites": "R-G09",
      "effect": "Stat | +25% Beastmaster base basic damage."
    },
    {
      "id": "R-BEA-B",
      "name": "First Fang",
      "cost": 4,
      "prerequisites": "R-BEA-A",
      "effect": "Permanent mechanic | Each legitimately summoned hound's first valid basic hit deals +50% normal damage; no attack duplication."
    },
    {
      "id": "R-BEA-C",
      "name": "Ferocious Pack",
      "cost": 5,
      "prerequisites": "R-BEA-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-BEA-01; buy for 8 UP each run. Requires T5-BM-GATE + R-BEA-C. Own hounds have 25% crit chance, double basic damage. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-BEA-D",
      "name": "Hunter's Reward",
      "cost": 8,
      "prerequisites": "R-BEA-B",
      "effect": "Permanent mechanic | Whenever own hound defeats a qualifying enemy, heal Beastmaster 5% max HP, at most once per 2s; preserve owner kill credit."
    },
    {
      "id": "R-BEA-E",
      "name": "Bloodline",
      "cost": 10,
      "prerequisites": "R-BEA-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-BEA-02; buy for 12 UP each run. Requires T5-BM-GATE + R-BEA-E + V2-BEA-01. Own hounds inherit 50% of owner's additive permanent basic-damage bonus, capped at +50% of hound base damage; exclude skin bonus and recursive modifiers. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-NEC-A",
      "name": "Grave Power",
      "cost": 3,
      "prerequisites": "R-G09",
      "effect": "Stat | +25% Necromancer base basic damage."
    },
    {
      "id": "R-NEC-B",
      "name": "Patient Harvest",
      "cost": 4,
      "prerequisites": "R-NEC-A",
      "effect": "Permanent mechanic | While the sustained beam deals damage to an elite or boss, its normal ramped DPS gains +25%; no new targeting rule or discrete shot."
    },
    {
      "id": "R-NEC-C",
      "name": "Grave Strength",
      "cost": 5,
      "prerequisites": "R-NEC-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-NEC-01; buy for 8 UP each run. Requires T5-NE-GATE + R-NEC-C. Own undead deal +50% damage while Necromancer's beam is at maximum intensity. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-NEC-D",
      "name": "Quiet Passing",
      "cost": 8,
      "prerequisites": "R-NEC-B",
      "effect": "Permanent mechanic | Own raised undead that expire naturally while Necromancer is alive restore 3% Necromancer max HP, at most once per 1s; no new summon or kill credit."
    },
    {
      "id": "R-NEC-E",
      "name": "Grave Vengeance",
      "cost": 10,
      "prerequisites": "R-NEC-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-NEC-02; buy for 12 UP each run. Requires T5-NE-GATE + R-NEC-E + V2-NEC-01. Each own undead destroyed by enemies adds +5 percentage points baseline beam DPS for rest of combat, cap +100%; no expiry trigger. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-DRA-A",
      "name": "Ancient Scales",
      "cost": 3,
      "prerequisites": "R-G09",
      "effect": "Stat | +25% Dragonkin base HP."
    },
    {
      "id": "R-DRA-B",
      "name": "Crushing Impact",
      "cost": 4,
      "prerequisites": "R-DRA-A",
      "effect": "Permanent mechanic | Every third completed Lunge deals +50% normal basic damage, regardless of whom it hits; no change to Lunge movement or knockback."
    },
    {
      "id": "R-DRA-C",
      "name": "Molten Heart",
      "cost": 5,
      "prerequisites": "R-DRA-A",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-DRA-01; buy for 8 UP each run. Requires T5-DR-GATE + R-DRA-C. Own burn damage grants Dragon Breath charge, capped at 10 percentage points per 2s; proposed 5 points per eligible damage event until cap; excludes other heroes' burn. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-DRA-D",
      "name": "Giantscale",
      "cost": 8,
      "prerequisites": "R-DRA-B",
      "effect": "Permanent mechanic | A Lunge hitting an elite or boss grants 10%-max-HP shield for 3s, at most once per 5s."
    },
    {
      "id": "R-DRA-E",
      "name": "Ancient Dragonfire",
      "cost": 10,
      "prerequisites": "R-DRA-C",
      "effect": "Ordinary unlock | Permanently reveals ordinary veteran node V2-DRA-02; buy for 12 UP each run. Requires T5-DR-GATE + R-DRA-E + V2-DRA-01. Every third Dragon Breath deals triple normal damage. Section 9.14 is the canonical ordinary effect."
    },
    {
      "id": "R-M01",
      "name": "Extra Counter",
      "cost": 1,
      "prerequisites": "ROOT",
      "effect": "Capacity | +1 initial shop slot."
    },
    {
      "id": "R-M02",
      "name": "Second Look",
      "cost": 2,
      "prerequisites": "R-M01",
      "effect": "Control | One free reroll per preparation, only unsold unreserved slots."
    },
    {
      "id": "R-M03",
      "name": "Hold That Offer",
      "cost": 2,
      "prerequisites": "R-M02",
      "effect": "Control | Reserve one unsold offer against rerolls this preparation; release or buy it normally. Does not carry across attempts."
    },
    {
      "id": "R-M04",
      "name": "Haggler",
      "cost": 4,
      "prerequisites": "R-M03",
      "effect": "Discount | Each completed reroll gives eligible newly rolled ordinary standard packs a +15 percentage-point chance of a 1-coin discount, capped at 45% this preparation; reset next attempt."
    },
    {
      "id": "R-M05",
      "name": "Fresh Delivery",
      "cost": 5,
      "prerequisites": "R-M04",
      "effect": "Control | +1 free reroll per preparation, separate finite charge."
    },
    {
      "id": "R-M06",
      "name": "Paid Search",
      "cost": 3,
      "prerequisites": "R-M02",
      "effect": "Control | After free charges are used, allow up to two paid rerolls per preparation at 1 coin each; no free stock restoration."
    },
    {
      "id": "R-M07",
      "name": "First Purchase",
      "cost": 3,
      "prerequisites": "R-M01",
      "effect": "Discount | First purchased ordinary standard pack each preparation costs 1 coin less, floor 1. Nonstacking with other offer discounts."
    },
    {
      "id": "R-M08",
      "name": "Marked Down",
      "cost": 4,
      "prerequisites": "R-M07",
      "effect": "Discount | Eligible advanced products have a 20% chance of a 1-coin discount on creation; floor 1, not stackable with other discounts."
    },
    {
      "id": "R-M09",
      "name": "Bulk Bargain",
      "cost": 5,
      "prerequisites": "R-M08",
      "effect": "Discount | One eligible booster box, Golden or mixed bundle per preparation may receive a guaranteed 1-coin discount on first eligible appearance; no stacking with other discounts."
    },
    {
      "id": "R-M10",
      "name": "Hirelings",
      "cost": 2,
      "prerequisites": "R-M01",
      "effect": "Product | Enable guaranteed individual hero offers from currently eligible pack pools; retain approved relative class prices; Uncommon/Legendary values unresolved."
    },
    {
      "id": "R-M11",
      "name": "Contract Board",
      "cost": 3,
      "prerequisites": "R-M10",
      "effect": "Control | Reserve one initial unsold slot for an eligible individual hero offer when possible; affordable opening guarantee takes priority."
    },
    {
      "id": "R-M12",
      "name": "Double Contract",
      "cost": 5,
      "prerequisites": "R-M10",
      "effect": "Product | Unlock a product containing two guaranteed copies of the offered hero; provisional price max(2,2× individual price−1), each copy rolls its skin independently."
    },
    {
      "id": "R-M13",
      "name": "Triple Contract",
      "cost": 8,
      "prerequisites": "R-M12",
      "effect": "Product | Unlock a product containing three guaranteed copies of the offered hero; provisional price max(3,3× individual price−1), independent skins."
    },
    {
      "id": "R-M14",
      "name": "Crate Dealer",
      "cost": 3,
      "prerequisites": "R-M10",
      "effect": "Product | Enable booster-box offers, provisionally three normal packs of one eligible tier at 3× its standard pack price−1 (minimum 3 after discounts); normal independent hero and skin rolls."
    },
    {
      "id": "R-M15",
      "name": "Gilded Seal",
      "cost": 6,
      "prerequisites": "R-M14",
      "effect": "Product | Enable Golden/Shiny full-roster offer: all three distinct eligible heroes from one pack; selected price 3× standard pack price, minimum 3; each skin rolls independently."
    },
    {
      "id": "R-M16",
      "name": "Crossroads Trade",
      "cost": 8,
      "prerequisites": "R-M15",
      "effect": "Product | Enable mixed product containing two standard packs of two different currently accessible tiers; proposed price sum of their ordinary pack prices−1, minimum 2."
    },
    {
      "id": "R-M17",
      "name": "Hidden Compartment",
      "cost": 10,
      "prerequisites": "R-M14",
      "effect": "Bonus pack | Once per preparation, first purchased eligible non-Recruit standard pack has a 25% chance to include one bonus ordinary Recruit pack. Bonus does not consume stock or recursively grant another; original pack still draws exactly one hero."
    },
    {
      "id": "R-M18",
      "name": "Larger Stall",
      "cost": 5,
      "prerequisites": "R-M01",
      "effect": "Capacity | +1 additional initial shop slot."
    },
    {
      "id": "R-M19",
      "name": "Curated Shelf",
      "cost": 4,
      "prerequisites": "R-M18",
      "effect": "Control | Guarantee an additional initial advanced product slot, prioritising unlocked multi-hero products (double, triple, booster box, Golden or mixed); otherwise an eligible individual offer. Recruit, newest and commission/contract anchors retain priority. No additional slots."
    },
    {
      "id": "R-M20",
      "name": "Personal Commission",
      "cost": 12,
      "prerequisites": "R-M11",
      "effect": "Control | Before initial stock generation choose one eligible discovered hero class as commission target; one initial individual offer guarantees that class if possible, using the existing individual price. No guaranteed skin or free hero; affordable guarantee takes priority and only one commission per preparation."
    },
    {
      "id": "R-E01",
      "name": "Small Treasury",
      "cost": 1,
      "prerequisites": "ROOT",
      "effect": "Economy | +2 permanent maximum attempt coins."
    },
    {
      "id": "R-E02",
      "name": "Field Study",
      "cost": 2,
      "prerequisites": "R-E01",
      "effect": "Economy | +25 percentage points ordinary base UP income from qualifying scheduled kills, elite bonus and boss rewards; track fractional carry."
    },
    {
      "id": "R-E03",
      "name": "Prepared Notes",
      "cost": 2,
      "prerequisites": "R-E02",
      "effect": "Economy | Begin each new voluntary prestige run with 2 ordinary UP, once after reset; not every attempt."
    },
    {
      "id": "R-E04",
      "name": "Deep Treasury",
      "cost": 3,
      "prerequisites": "R-E01",
      "effect": "Economy | +2 additional permanent maximum attempt coins."
    },
    {
      "id": "R-E05",
      "name": "Battle Scholar",
      "cost": 4,
      "prerequisites": "R-E02",
      "effect": "Economy | +25 percentage points additional ordinary base UP income; additive with Field Study."
    },
    {
      "id": "R-E06",
      "name": "Victory Journal",
      "cost": 4,
      "prerequisites": "R-E03",
      "effect": "Economy | +1 ordinary UP on first clear of each main stage in current prestige run; once per stage."
    },
    {
      "id": "R-E07",
      "name": "Class Scholarship",
      "cost": 4,
      "prerequisites": "R-E03",
      "effect": "Economy | +1 ordinary UP on each newly completed class kill gate in current run; normal +2 coin-cap reward unchanged."
    },
    {
      "id": "R-E08",
      "name": "Strategic Reserve",
      "cost": 7,
      "prerequisites": "R-E05",
      "effect": "Economy | Before Enter Battle snapshot unspent ordinary UP after purchases. On outcome with at least six qualifying scheduled kills, award 10% of snapshot rounded down, maximum 2 UP; once per attempt, no interest on same-attempt earnings or Shards."
    },
    {
      "id": "R-E09",
      "name": "Royal Treasury",
      "cost": 7,
      "prerequisites": "R-E04",
      "effect": "Economy | +2 additional permanent maximum attempt coins."
    },
    {
      "id": "R-E10",
      "name": "Legion Ledger",
      "cost": 8,
      "prerequisites": "R-E06",
      "effect": "Economy | +1 ordinary UP per legitimate faction boss defeated, in addition to its separately configured reward; no Shard multiplier or class credit."
    },
    {
      "id": "R-E11",
      "name": "Frugal Victory",
      "cost": 10,
      "prerequisites": "R-E09",
      "effect": "Economy | On main-stage victory, award 1 ordinary UP per two unused preparation coins, maximum 2 UP. Snapshot remaining coins at combat start; no coin carry, no reward on failure."
    },
    {
      "id": "R-T01",
      "name": "Foundation",
      "cost": 2,
      "prerequisites": "R-G01",
      "effect": "Stat | +25% tower base maximum HP."
    },
    {
      "id": "R-T02",
      "name": "Steel Bolt",
      "cost": 3,
      "prerequisites": "R-T01",
      "effect": "Stat | +25% tower base projectile damage."
    },
    {
      "id": "R-T03",
      "name": "Quick Mechanism",
      "cost": 5,
      "prerequisites": "R-T02",
      "effect": "Stat | +25% tower base firing rate, not cooldown subtraction."
    },
    {
      "id": "R-T04",
      "name": "Citadel",
      "cost": 8,
      "prerequisites": "R-T03",
      "effect": "Stat | +50% additional tower base maximum HP."
    }
  ],
  "supported": {
    "O-1-G1": {
      "kind": "hp",
      "amount": 0.25,
      "key": null
    },
    "O-1-G2": {
      "kind": "damage",
      "amount": 0.25,
      "key": null
    },
    "O-1-G3": {
      "kind": "coins",
      "amount": 2,
      "key": null
    },
    "O-1-G4": {
      "kind": "slots",
      "amount": 1,
      "key": null
    },
    "O-1-G5": {
      "kind": "chargeStart",
      "amount": 0.2,
      "key": null
    },
    "O-2-G1": {
      "kind": "rate",
      "amount": 0.25,
      "key": null
    },
    "O-2-G2": {
      "kind": "walk",
      "amount": 0.25,
      "key": null
    },
    "O-2-G3": {
      "kind": "firstBlood",
      "amount": 0.5,
      "key": null
    },
    "O-2-G5": {
      "kind": "discount",
      "amount": 1,
      "key": null
    },
    "O-3-G1": {
      "kind": "hp",
      "amount": 0.25,
      "key": null
    },
    "O-3-G3": {
      "kind": "startShield",
      "amount": 0.15,
      "key": null
    },
    "O-3-G4": {
      "kind": "chargeRate",
      "amount": 0.25,
      "key": null
    },
    "O-3-G5": {
      "kind": "coins",
      "amount": 2,
      "key": null
    },
    "O-4-G1": {
      "kind": "damage",
      "amount": 0.25,
      "key": null
    },
    "O-4-G4": {
      "kind": "extraUP",
      "amount": 1,
      "key": null
    },
    "O-5-G1": {
      "kind": "hp",
      "amount": 0.5,
      "key": null
    },
    "O-5-G3": {
      "kind": "summonAll",
      "amount": 0.5,
      "key": null
    },
    "O-5-G5": {
      "kind": "fullCharge",
      "amount": 1,
      "key": null
    },
    "R-G01": {
      "kind": "hp",
      "amount": 0.25,
      "key": null
    },
    "R-G02": {
      "kind": "damage",
      "amount": 0.25,
      "key": null
    },
    "R-G03": {
      "kind": "rate",
      "amount": 0.25,
      "key": null
    },
    "R-G04": {
      "kind": "walk",
      "amount": 0.25,
      "key": null
    },
    "R-G05": {
      "kind": "chargeStart",
      "amount": 0.15,
      "key": null
    },
    "R-G06": {
      "kind": "diversity",
      "amount": 0.15,
      "key": null
    },
    "R-G07": {
      "kind": "hp",
      "amount": 0.25,
      "key": null
    },
    "R-G09": {
      "kind": "damage",
      "amount": 0.25,
      "key": null
    },
    "R-E01": {
      "kind": "coins",
      "amount": 2,
      "key": null
    },
    "R-E02": {
      "kind": "income",
      "amount": 0.25,
      "key": null
    },
    "R-E03": {
      "kind": "startingUP",
      "amount": 2,
      "key": null
    },
    "R-E04": {
      "kind": "coins",
      "amount": 2,
      "key": null
    },
    "R-E05": {
      "kind": "income",
      "amount": 0.25,
      "key": null
    },
    "R-E06": {
      "kind": "journal",
      "amount": 1,
      "key": null
    },
    "R-E07": {
      "kind": "scholarship",
      "amount": 1,
      "key": null
    },
    "R-E08": {
      "kind": "interest",
      "amount": 1,
      "key": null
    },
    "R-E09": {
      "kind": "coins",
      "amount": 2,
      "key": null
    },
    "R-E11": {
      "kind": "frugal",
      "amount": 1,
      "key": null
    },
    "R-T01": {
      "kind": "towerHP",
      "amount": 0.25,
      "key": null
    },
    "R-T02": {
      "kind": "towerDamage",
      "amount": 0.25,
      "key": null
    },
    "R-T03": {
      "kind": "towerRate",
      "amount": 0.25,
      "key": null
    },
    "R-T04": {
      "kind": "towerHP",
      "amount": 0.5,
      "key": null
    },
    "O-TW01": {
      "kind": "towerFlat",
      "amount": 1,
      "key": null
    },
    "O-TW02": {
      "kind": "towerHP",
      "amount": 0.35,
      "key": null
    },
    "O-TW03": {
      "kind": "towerRate",
      "amount": 0.25,
      "key": null
    },
    "O-TW04": {
      "kind": "pierce",
      "amount": 1,
      "key": null
    },
    "O-TW05": {
      "kind": "towerHP",
      "amount": 0.4,
      "key": null
    },
    "O-TW06": {
      "kind": "splash",
      "amount": 0.4,
      "key": null
    },
    "O-TW07": {
      "kind": "towerFlat",
      "amount": 2,
      "key": null
    },
    "O-TW08": {
      "kind": "twin",
      "amount": 0.6,
      "key": null
    },
    "O-TW09": {
      "kind": "towerHP",
      "amount": 0.5,
      "key": null
    },
    "O-TW10": {
      "kind": "overload",
      "amount": 1,
      "key": null
    },
    "R-M01": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M02": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M03": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M04": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M05": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M06": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M07": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M08": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M09": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M10": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M11": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M12": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M13": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M14": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M15": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M16": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M17": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M18": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M19": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "R-M20": {
      "kind": "merchant",
      "amount": 0,
      "key": null
    },
    "O-1-K-A1": {
      "kind": "hp",
      "amount": 0.5,
      "key": "knight"
    },
    "O-1-K-B1": {
      "kind": "damage",
      "amount": 0.4,
      "key": "knight"
    },
    "O-1-K-B2": {
      "kind": "rate",
      "amount": 0.25,
      "key": "knight"
    },
    "O-1-A-A1": {
      "kind": "damage",
      "amount": 0.5,
      "key": "archer"
    },
    "O-1-A-A3": {
      "kind": "rate",
      "amount": 0.25,
      "key": "archer"
    },
    "O-1-A-B1": {
      "kind": "hp",
      "amount": 0.4,
      "key": "archer"
    },
    "O-1-A-B3": {
      "kind": "chargeRate",
      "amount": 0.35,
      "key": "archer"
    },
    "O-1-MG-A1": {
      "kind": "damage",
      "amount": 0.5,
      "key": "mage"
    },
    "O-1-MG-B1": {
      "kind": "hp",
      "amount": 0.4,
      "key": "mage"
    },
    "O-1-MG-B3": {
      "kind": "chargeRate",
      "amount": 0.35,
      "key": "mage"
    },
    "O-2-H-A1": {
      "kind": "damage",
      "amount": 0.45,
      "key": "hunter"
    },
    "O-2-H-B1": {
      "kind": "hp",
      "amount": 0.4,
      "key": "hunter"
    },
    "O-2-H-B4": {
      "kind": "chargeRate",
      "amount": 0.35,
      "key": "hunter"
    },
    "O-2-B-A1": {
      "kind": "damage",
      "amount": 0.5,
      "key": "barbarian"
    },
    "O-2-B-A2": {
      "kind": "rate",
      "amount": 0.25,
      "key": "barbarian"
    },
    "O-2-B-B1": {
      "kind": "hp",
      "amount": 0.5,
      "key": "barbarian"
    },
    "O-2-R-A1": {
      "kind": "damage",
      "amount": 0.6,
      "key": "rogue"
    },
    "O-2-R-A3": {
      "kind": "rate",
      "amount": 0.25,
      "key": "rogue"
    },
    "O-2-R-B1": {
      "kind": "hp",
      "amount": 0.4,
      "key": "rogue"
    },
    "O-2-R-B3": {
      "kind": "chargeRate",
      "amount": 0.35,
      "key": "rogue"
    },
    "O-3-P-A1": {
      "kind": "damage",
      "amount": 0.5,
      "key": "paladin"
    },
    "O-3-P-B1": {
      "kind": "hp",
      "amount": 0.5,
      "key": "paladin"
    },
    "O-3-P-B4": {
      "kind": "chargeRate",
      "amount": 0.35,
      "key": "paladin"
    },
    "O-3-N-A1": {
      "kind": "damage",
      "amount": 0.4,
      "key": "nun"
    },
    "O-3-N-A2": {
      "kind": "rate",
      "amount": 0.25,
      "key": "nun"
    },
    "O-3-N-B1": {
      "kind": "hp",
      "amount": 0.4,
      "key": "nun"
    },
    "O-3-PR-A1": {
      "kind": "damage",
      "amount": 0.5,
      "key": "priest"
    },
    "O-3-PR-A2": {
      "kind": "rate",
      "amount": 0.25,
      "key": "priest"
    },
    "O-3-PR-B1": {
      "kind": "hp",
      "amount": 0.6,
      "key": "priest"
    },
    "O-4-S-A1": {
      "kind": "damage",
      "amount": 0.5,
      "key": "shaman"
    },
    "O-4-S-B1": {
      "kind": "hp",
      "amount": 0.4,
      "key": "shaman"
    },
    "O-4-D-A1": {
      "kind": "damage",
      "amount": 0.5,
      "key": "druid"
    },
    "O-4-D-B1": {
      "kind": "hp",
      "amount": 0.75,
      "key": "druid"
    },
    "O-4-W-A1": {
      "kind": "damage",
      "amount": 0.5,
      "key": "warlock"
    },
    "O-4-W-B1": {
      "kind": "hp",
      "amount": 0.4,
      "key": "warlock"
    },
    "O-5-BM-A1": {
      "kind": "damage",
      "amount": 0.5,
      "key": "beastmaster"
    },
    "O-5-BM-A2": {
      "kind": "rate",
      "amount": 0.25,
      "key": "beastmaster"
    },
    "O-5-BM-B3": {
      "kind": "chargeRate",
      "amount": 0.4,
      "key": "beastmaster"
    },
    "O-5-NE-A1": {
      "kind": "damage",
      "amount": 0.5,
      "key": "necromancer"
    },
    "O-5-DR-A1": {
      "kind": "hp",
      "amount": 0.5,
      "key": "dragonkin"
    },
    "O-5-DR-A2": {
      "kind": "damage",
      "amount": 0.5,
      "key": "dragonkin"
    },
    "O-5-DR-B3": {
      "kind": "chargeRate",
      "amount": 0.4,
      "key": "dragonkin"
    },
    "R-KNI-A": {
      "kind": "hp",
      "amount": 0.25,
      "key": "knight"
    },
    "R-ARC-A": {
      "kind": "damage",
      "amount": 0.25,
      "key": "archer"
    },
    "R-MAG-A": {
      "kind": "damage",
      "amount": 0.25,
      "key": "mage"
    },
    "R-HUN-A": {
      "kind": "damage",
      "amount": 0.25,
      "key": "hunter"
    },
    "R-BAR-A": {
      "kind": "hp",
      "amount": 0.25,
      "key": "barbarian"
    },
    "R-ROG-A": {
      "kind": "rate",
      "amount": 0.25,
      "key": "rogue"
    },
    "R-PAL-A": {
      "kind": "hp",
      "amount": 0.25,
      "key": "paladin"
    },
    "R-NUN-A": {
      "kind": "hp",
      "amount": 0.25,
      "key": "nun"
    },
    "R-PRI-A": {
      "kind": "hp",
      "amount": 0.25,
      "key": "priest"
    },
    "R-SHA-A": {
      "kind": "hp",
      "amount": 0.25,
      "key": "shaman"
    },
    "R-DRU-A": {
      "kind": "hp",
      "amount": 0.25,
      "key": "druid"
    },
    "R-WAR-A": {
      "kind": "damage",
      "amount": 0.25,
      "key": "warlock"
    },
    "R-BEA-A": {
      "kind": "damage",
      "amount": 0.25,
      "key": "beastmaster"
    },
    "R-NEC-A": {
      "kind": "damage",
      "amount": 0.25,
      "key": "necromancer"
    },
    "R-DRA-A": {
      "kind": "hp",
      "amount": 0.25,
      "key": "dragonkin"
    },
    "O-1-K-B4": {
      "kind": "special",
      "amount": 0.4,
      "key": "knight",
      "field": "bashStunSeconds"
    },
    "O-1-A-B2": {
      "kind": "special",
      "amount": 0.4,
      "key": "archer",
      "field": "volleyRadius"
    },
    "O-1-MG-B2": {
      "kind": "special",
      "amount": 0.5,
      "key": "mage",
      "field": "chainDamage"
    },
    "O-2-H-B2": {
      "kind": "special",
      "amount": 0.4,
      "key": "hunter",
      "field": "trapDurationSeconds"
    },
    "O-2-R-B2": {
      "kind": "special",
      "amount": 0.4,
      "key": "rogue",
      "field": "invisibilityDurationSeconds"
    },
    "O-3-N-B2": {
      "kind": "special",
      "amount": 0.5,
      "key": "nun",
      "field": "sanctuaryHealPerSecond"
    },
    "O-3-N-B3": {
      "kind": "special",
      "amount": 0.4,
      "key": "nun",
      "field": "sanctuaryLifetimeSeconds"
    },
    "O-3-PR-B2": {
      "kind": "special",
      "amount": 0.75,
      "key": "priest",
      "field": "blessingDamageBonus"
    },
    "O-3-PR-B3": {
      "kind": "special",
      "amount": 0.6,
      "key": "priest",
      "field": "blessingDurationSeconds"
    },
    "O-4-S-B2": {
      "kind": "special",
      "amount": 0.5,
      "key": "shaman",
      "field": "totemHealth"
    },
    "O-4-D-B3": {
      "kind": "special",
      "amount": 0.4,
      "key": "druid",
      "field": "bearFormDurationSeconds"
    },
    "O-5-NE-B3": {
      "kind": "special",
      "amount": 0.75,
      "key": "necromancer",
      "field": "undeadLifetimeSeconds"
    },
    "O-5-DR-B1": {
      "kind": "special",
      "amount": 0.5,
      "key": "dragonkin",
      "field": "breathDamage"
    },
    "O-5-BM-B1": {
      "kind": "summonHP",
      "amount": 0.5,
      "key": "hound"
    },
    "O-5-BM-B2": {
      "kind": "summonDamage",
      "amount": 0.5,
      "key": "hound"
    },
    "O-5-NE-B1": {
      "kind": "summonHP",
      "amount": 0.75,
      "key": "undead"
    },
    "O-5-NE-B2": {
      "kind": "summonDamage",
      "amount": 0.75,
      "key": "undead"
    },
    "O-2-B-A5": {
      "kind": "lowEnemy",
      "amount": 0.5,
      "key": "barbarian"
    },
    "O-2-R-B4": {
      "kind": "smokeDamage",
      "amount": 0.5,
      "key": "rogue"
    },
    "O-3-P-A4": {
      "kind": "eliteBoss",
      "amount": 0.5,
      "key": "paladin"
    },
    "O-4-D-B2": {
      "kind": "bearDamage",
      "amount": 1,
      "key": "druid"
    },
    "O-5-NE-A2": {
      "kind": "rampRate",
      "amount": 0.4,
      "key": "necromancer"
    },
    "O-5-NE-A4": {
      "kind": "rampBonus",
      "amount": 0.5,
      "key": "necromancer"
    },
    "O-2-B-B2": {
      "kind": "frenzyBonus",
      "amount": 0.35,
      "key": "barbarian"
    },
    "O-5-G2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-G2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-G2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-G4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-K-A2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-K-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-K-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-K-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-K-B3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-K-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-A-A2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-A-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-A-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-A-B4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-A-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-MG-A2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-MG-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-MG-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-MG-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-MG-B4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-1-MG-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-G4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-G3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-G5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-H-A2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-H-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-H-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-H-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-H-B3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-H-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-B-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-B-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-B-B3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-B-B4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-B-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-R-A2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-R-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-R-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-2-R-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-P-A2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-P-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-P-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-P-B2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-P-B3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-P-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-N-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-N-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-N-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-PR-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-PR-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-PR-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-PR-B4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-PR-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-S-A2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-S-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-S-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-S-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-S-B3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-S-B4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-S-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-D-A2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-D-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-D-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-D-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-D-B4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-D-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-W-A2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-W-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-W-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-W-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-W-B2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-W-B3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-W-B4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-4-W-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-BM-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-BM-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-BM-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-BM-B4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-BM-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-NE-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-NE-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-NE-B4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-NE-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-DR-A3": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-DR-A4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-DR-A5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-DR-B2": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-DR-B4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-5-DR-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-G08": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-KNI-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-KNI-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-ARC-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-ARC-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-MAG-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-MAG-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-HUN-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-HUN-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-BAR-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-BAR-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-ROG-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-ROG-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-PAL-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-PAL-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-NUN-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-PRI-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-PRI-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-SHA-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-SHA-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-DRU-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-DRU-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-WAR-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-WAR-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-BEA-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-BEA-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-NEC-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-NEC-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-DRA-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-DRA-D": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-KNI-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-KNI-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-ARC-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-ARC-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-MAG-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-MAG-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-HUN-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-BAR-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-BAR-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-ROG-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-ROG-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-PAL-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-PAL-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-PRI-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-PRI-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-SHA-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-SHA-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-DRU-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-DRU-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-WAR-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-WAR-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-BEA-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-NEC-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-NEC-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-DRA-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-DRA-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-KNI-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-KNI-01"
    },
    "R-KNI-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-KNI-02"
    },
    "R-ARC-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-ARC-01"
    },
    "R-ARC-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-ARC-02"
    },
    "R-MAG-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-MAG-01"
    },
    "R-MAG-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-MAG-02"
    },
    "R-HUN-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-HUN-02"
    },
    "R-BAR-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-BAR-01"
    },
    "R-BAR-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-BAR-02"
    },
    "R-ROG-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-ROG-01"
    },
    "R-ROG-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-ROG-02"
    },
    "R-PAL-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-PAL-01"
    },
    "R-PAL-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-PAL-02"
    },
    "R-PRI-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-PRI-01"
    },
    "R-PRI-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-PRI-02"
    },
    "R-SHA-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-SHA-01"
    },
    "R-SHA-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-SHA-02"
    },
    "R-DRU-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-DRU-01"
    },
    "R-DRU-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-DRU-02"
    },
    "R-WAR-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-WAR-01"
    },
    "R-WAR-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-WAR-02"
    },
    "R-BEA-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-BEA-01"
    },
    "R-NEC-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-NEC-01"
    },
    "R-NEC-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-NEC-02"
    },
    "R-DRA-C": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-DRA-01"
    },
    "R-DRA-E": {
      "kind": "unlock",
      "amount": 0,
      "key": "V2-DRA-02"
    },
    "O-3-N-B4": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-3-N-B5": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-NUN-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-NUN-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-BEA-02": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-NUN-B": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-NUN-C": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-NUN-E": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-BEA-E": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "O-SP01": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP02": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP03": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP04": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP05": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP06": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP07": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP08": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP09": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP10": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP11": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP12": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "O-SP13": {
      "kind": "spell",
      "amount": 0,
      "key": null
    },
    "R-G10": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "V2-HUN-01": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-HUN-C": {
      "kind": "combat",
      "amount": 0,
      "key": null
    },
    "R-E10": {
      "kind": "combat",
      "amount": 0,
      "key": null
    }
  }
};
