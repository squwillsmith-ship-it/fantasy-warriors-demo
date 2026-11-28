/* Fantasy Warriors — one editable, JSON-compatible numerical profile.
   Build 1.0.11 (design v1.3.5). Only profiles.live is applied by the game.
   For spreadsheet workflows export the profile as JSON; NO automatic Google Sheets link.
   Structural engines are still in game-core.js and effects.js. */
(function(){
'use strict';
const dataset={
  "schemaVersion": 1,
  "activeProfile": "fw-combat-v1.16.0",
  "profiles": {
    "live": {
      "profileId": "fw-combat-v1.16.0",
      "schemaVersion": 1,
      "status": "live",
      "manifestoVersion": "1.16.0",
      "lastReviewed": "2026-11-29",
      "notes": "Development campaign balance round 2: measured melee survivability, tower and Stage 4 adjustments. Further testing required. Reward pacing: 8 scheduled kills per UP; +0.5 elite UP. Late prestige scheduled UP scaling 0.8 at P4 and 0.65 at P5+; boss and floor retained. Hero rebalance: lower Archer basic and Volley; improve frontline survival/damage and Legendary Dragonkin. Target ranged kill advantage <=3x in pooled campaigns. | Spreadsheet balance import 2026-11-29; 17 changed numeric fields. | Eight spreadsheet stat changes and one starting shop slot.",
      "heroes": [
        {
          "id": "knight",
          "name": "Knight",
          "pack": 0,
          "rarity": "Common",
          "color": "#b9c6d0",
          "hp": 35,
          "damage": 5.2,
          "speed": 0.5,
          "walk": 1.78,
          "range": 1,
          "role": "Sword Strike",
          "glyph": "⚔"
        },
        {
          "id": "archer",
          "name": "Archer",
          "pack": 0,
          "rarity": "Uncommon",
          "color": "#8acaab",
          "hp": 12,
          "damage": 2.5,
          "speed": 0.5,
          "walk": 1.85,
          "range": 5,
          "role": "Straight Arrow",
          "glyph": "➶"
        },
        {
          "id": "mage",
          "name": "Mage",
          "pack": 0,
          "rarity": "Legendary",
          "color": "#ffc770",
          "hp": 10,
          "damage": 3,
          "speed": 0.3,
          "walk": 1.8,
          "range": 4,
          "role": "Explosive Fireball",
          "glyph": "✦"
        },
        {
          "id": "hunter",
          "name": "Hunter",
          "pack": 1,
          "rarity": "Common",
          "color": "#a1c391",
          "hp": 15,
          "damage": 4.6,
          "speed": 0.55,
          "walk": 1.87,
          "range": 5.5,
          "role": "Serrated Arrow",
          "glyph": "⌁"
        },
        {
          "id": "barbarian",
          "name": "Barbarian",
          "pack": 1,
          "rarity": "Rare",
          "color": "#df9878",
          "hp": 55,
          "damage": 8.5,
          "speed": 0.5,
          "walk": 1.78,
          "range": 1.3,
          "role": "Wide Cleave",
          "glyph": "🪓"
        },
        {
          "id": "rogue",
          "name": "Rogue",
          "pack": 1,
          "rarity": "Uncommon",
          "color": "#b3a0d8",
          "hp": 34,
          "damage": 3,
          "speed": 2.1,
          "walk": 1.95,
          "range": 1,
          "role": "Alternating Daggers",
          "glyph": "🗡"
        },
        {
          "id": "paladin",
          "name": "Paladin",
          "pack": 2,
          "rarity": "Rare",
          "color": "#eac978",
          "hp": 70,
          "damage": 7.6,
          "speed": 0.65,
          "walk": 1.72,
          "range": 1.2,
          "role": "Hammer Strike",
          "glyph": "⚒"
        },
        {
          "id": "nun",
          "name": "Nun",
          "pack": 2,
          "rarity": "Uncommon",
          "color": "#d8cae5",
          "hp": 46,
          "damage": 5.8,
          "speed": 0.9,
          "walk": 1.85,
          "range": 1,
          "role": "Monastic Combination",
          "glyph": "✚"
        },
        {
          "id": "priest",
          "name": "Priest",
          "pack": 2,
          "rarity": "Epic",
          "color": "#ce91ff",
          "hp": 20,
          "damage": 5.6,
          "speed": 0.6,
          "walk": 1.76,
          "range": 4,
          "role": "Censuring Ray",
          "glyph": "✥"
        },
        {
          "id": "shaman",
          "name": "Shaman",
          "pack": 3,
          "rarity": "Uncommon",
          "color": "#78d6c5",
          "hp": 20,
          "damage": 6,
          "speed": 0.6,
          "walk": 1.8,
          "range": 4.5,
          "role": "Vial Throw",
          "glyph": "☯"
        },
        {
          "id": "druid",
          "name": "Druid",
          "pack": 3,
          "rarity": "Rare",
          "color": "#9cce79",
          "hp": 26,
          "damage": 5.8,
          "speed": 0.65,
          "walk": 1.78,
          "range": 4.5,
          "role": "Vine Wave",
          "glyph": "❧"
        },
        {
          "id": "warlock",
          "name": "Warlock",
          "pack": 3,
          "rarity": "Epic",
          "color": "#b06acc",
          "hp": 19,
          "damage": 7.6,
          "speed": 0.5,
          "walk": 1.75,
          "range": 4.5,
          "role": "Doom Sigil",
          "glyph": "☽"
        },
        {
          "id": "beastmaster",
          "name": "Beastmaster",
          "pack": 4,
          "rarity": "Rare",
          "color": "#dcab7f",
          "hp": 42,
          "damage": 6.6,
          "speed": 0.6,
          "walk": 1.86,
          "range": 2,
          "role": "Whip",
          "glyph": "♞"
        },
        {
          "id": "necromancer",
          "name": "Necromancer",
          "pack": 4,
          "rarity": "Epic",
          "color": "#9da2e8",
          "hp": 23,
          "damage": 8.4,
          "speed": 0.5,
          "walk": 1.73,
          "range": 4.5,
          "role": "Soul Sucking Beam",
          "glyph": "☠"
        },
        {
          "id": "dragonkin",
          "name": "Dragonkin",
          "pack": 4,
          "rarity": "Legendary",
          "color": "#f49b69",
          "hp": 108,
          "damage": 16,
          "speed": 0.48,
          "walk": 1.7,
          "range": 1.7,
          "role": "Lunge",
          "glyph": "🐉"
        }
      ],
      "summons": {
        "hound": {
          "id": "hound",
          "name": "Hound",
          "rarity": "Summoned",
          "color": "#c99d63",
          "hp": 9,
          "damage": 2.4,
          "speed": 0.8,
          "walk": 2,
          "range": 0.9,
          "glyph": "🐕",
          "role": "Summoned Bite"
        },
        "undead": {
          "id": "undead",
          "name": "Undead",
          "rarity": "Summoned",
          "color": "#7bd2c4",
          "hp": 7,
          "damage": 1.2,
          "speed": 0.7,
          "walk": 1.55,
          "range": 0.9,
          "glyph": "☠",
          "role": "Undead Strike"
        }
      },
      "packs": {
        "heroesPerPack": 1,
        "definitions": [
          {
            "name": "Recruit",
            "stage": 1,
            "pool": [
              "knight",
              "archer",
              "mage"
            ],
            "price": 2
          },
          {
            "name": "Outlaw",
            "stage": null,
            "pool": [
              "hunter",
              "barbarian",
              "rogue"
            ],
            "price": 3
          },
          {
            "name": "Devotion",
            "stage": null,
            "pool": [
              "paladin",
              "nun",
              "priest"
            ],
            "price": 4
          },
          {
            "name": "Occult",
            "stage": null,
            "pool": [
              "shaman",
              "druid",
              "warlock"
            ],
            "price": 4
          },
          {
            "name": "Mythic",
            "stage": null,
            "pool": [
              "beastmaster",
              "necromancer",
              "dragonkin"
            ],
            "price": 5
          }
        ]
      },
      "encounters": [
        {
          "name": "Slime Pits",
          "minion": "Slime",
          "boss": "King Slime",
          "minionIcon": "●",
          "bossIcon": "♛",
          "minionColor": "#7ee897",
          "bossColor": "#4ad1ad",
          "approved": true
        },
        {
          "name": "Fungal Forest",
          "minion": "Mushroom Man",
          "boss": "Giant Plant",
          "minionIcon": "♧",
          "bossIcon": "✿",
          "minionColor": "#e2b973",
          "bossColor": "#97d67c",
          "approved": true
        },
        {
          "name": "Goblin Camp",
          "minion": "Goblin",
          "boss": "Orc Warlord",
          "minionIcon": "♠",
          "bossIcon": "⚔",
          "minionColor": "#97ce6e",
          "bossColor": "#7a9e59",
          "approved": true
        },
        {
          "name": "Bandit Hideout",
          "minion": "Bandit",
          "boss": "Bandit King",
          "minionIcon": "◆",
          "bossIcon": "♛",
          "minionColor": "#d3a17d",
          "bossColor": "#b77465",
          "approved": false
        },
        {
          "name": "Dragon's Lair",
          "minion": "Kobold",
          "boss": "Drake",
          "minionIcon": "♠",
          "bossIcon": "◆",
          "minionColor": "#d3b477",
          "bossColor": "#e18759",
          "approved": false
        },
        {
          "name": "Sacred Citadel",
          "minion": "Fanatical Zealot",
          "boss": "Fallen Seraph",
          "minionIcon": "✚",
          "bossIcon": "✧",
          "minionColor": "#f5dc91",
          "bossColor": "#dab2f4",
          "approved": false
        },
        {
          "name": "Infernal Realm",
          "minion": "Imp",
          "boss": "Succubus Queen",
          "minionIcon": "✶",
          "bossIcon": "♛",
          "minionColor": "#e37d77",
          "bossColor": "#c86aa7",
          "approved": false
        },
        {
          "name": "Cursed Necropolis",
          "minion": "Wraith",
          "boss": "Lich",
          "minionIcon": "☾",
          "bossIcon": "☠",
          "minionColor": "#acb4ef",
          "bossColor": "#96a0e8",
          "approved": false
        },
        {
          "name": "Dark Cathedral",
          "minion": "Cultist",
          "boss": "Abyssal High Priest",
          "minionIcon": "◈",
          "bossIcon": "✥",
          "minionColor": "#ad7ebd",
          "bossColor": "#b374c0",
          "approved": false
        },
        {
          "name": "The Final Rift",
          "minion": "Voidling",
          "boss": "Eldritch Horror",
          "minionIcon": "✺",
          "bossIcon": "☼",
          "minionColor": "#8f86cf",
          "bossColor": "#cf70d0",
          "approved": false
        }
      ],
      "combat": {
        "acquisitionRange": 15,
        "towerGuardRadius": 5,
        "specialChargeSeconds": 10,
        "enemyHeroDetection": 6,
        "returnRadius": 2.4,
        "actorRadius": 0.35,
        "bossRadius": 0.75,
        "personalSpace": 0.045,
        "decisionInterval": 0.25,
        "targetCommitSeconds": 1,
        "retargetMargin": 0.35,
        "rangeStandoff": 0.76,
        "meleeSlots": 6,
        "steerResponsiveness": 9
      },
      "abilities": {
        "knight": {
          "name": "Shield Bash",
          "trigger": "autoCharge",
          "bashRadius": 1.25,
          "bashStunSeconds": 1.5,
          "bashDamage": 0,
          "chargeSeconds": 15
        },
        "archer": {
          "name": "Arrow Volley",
          "trigger": "autoCharge",
          "volleyArrowCount": 3,
          "volleyRadius": 5,
          "volleyDamage": 3.2,
          "chargeSeconds": 15
        },
        "mage": {
          "name": "Chain Bolt",
          "trigger": "autoCharge",
          "chainJumpCount": 3,
          "chainJumpRange": 2,
          "chainDamage": 3
        },
        "hunter": {
          "name": "Tripwire Trap",
          "trigger": "autoCharge",
          "trapRadius": 1.25,
          "trapDurationSeconds": 7,
          "trapSlowMultiplier": 0.4,
          "chargeSeconds": 10
        },
        "barbarian": {
          "name": "Battle Frenzy",
          "trigger": "autoCharge",
          "frenzyDurationSeconds": 4,
          "frenzyAttackSpeedMultiplier": 1.5,
          "chargeSeconds": 10
        },
        "rogue": {
          "name": "Smoke Bomb",
          "trigger": "autoCharge",
          "invisibilityDurationSeconds": 2.5,
          "chargeSeconds": 10
        },
        "paladin": {
          "name": "Divine Aegis",
          "trigger": "autoCharge",
          "shieldAmount": 14,
          "shieldRadius": 2.8,
          "shieldDurationSeconds": 5,
          "chargeSeconds": 12
        },
        "nun": {
          "name": "Sanctuary Prayer",
          "trigger": "autoCharge",
          "sanctuaryRadius": 2.3,
          "sanctuaryLifetimeSeconds": 5,
          "sanctuaryHealPerSecond": 1.5,
          "sanctuaryTickIntervalSeconds": 0.5,
          "sanctuaryEligibilityRadius": 2.3,
          "sanctuarySelfHealingAllowed": true,
          "sanctuaryOverlappingZonesPolicy": "nonstacking",
          "chargeSeconds": 10
        },
        "priest": {
          "name": "Blessing of Courage",
          "trigger": "autoCharge",
          "blessingRadius": 3,
          "blessingDamageBonus": 0.25,
          "blessingDurationSeconds": 5,
          "chargeSeconds": 12
        },
        "shaman": {
          "name": "Spirit Totem",
          "trigger": "autoCharge",
          "totemHealth": 18,
          "totemLifetimeSeconds": 8,
          "totemAggroRadius": 6,
          "totemCount": 1,
          "chargeSeconds": 10
        },
        "druid": {
          "name": "Bear Form",
          "trigger": "autoCharge",
          "bearFormDurationSeconds": 5,
          "chargeSeconds": 12
        },
        "warlock": {
          "name": "Life Siphon",
          "trigger": "autoCharge",
          "siphonDamage": 8,
          "siphonHealAmount": 5,
          "siphonRange": 4.8,
          "chargeSeconds": 10
        },
        "beastmaster": {
          "name": "Summon Hound",
          "trigger": "autoCharge",
          "houndHealth": 9,
          "houndDamage": 2.4,
          "houndAttackSpeed": 0.8,
          "houndWalkSpeed": 2,
          "houndLifetimeSeconds": 10,
          "maximumActiveHounds": 2,
          "chargeSeconds": 10
        },
        "necromancer": {
          "name": "Raise the Fallen",
          "trigger": "onEnemyKill",
          "beamContinuous": true,
          "beamBaseDamageRate": 4.2,
          "beamRampSeconds": 3,
          "beamMaxRampMultiplier": 1.5,
          "beamTickSeconds": 0.2,
          "beamRetargetPolicy": "reset-on-change",
          "undeadHealth": 7,
          "undeadDamage": 1.2,
          "undeadLifetimeSeconds": 8
        },
        "dragonkin": {
          "name": "Dragon Breath",
          "trigger": "autoCharge",
          "breathConeDegrees": 80,
          "breathRange": 3.5,
          "breathDamage": 21,
          "chargeSeconds": 12
        }
      },
      "spawn": {
        "normalInterval": 2,
        "normalRateRampFactor": 2,
        "heroSpawnRadiusMin": 1.8,
        "heroSpawnRadiusMultiplier": 4,
        "heroSpawnSeparation": 0.95,
        "bossClearDelay": 2,
        "normalHp": 6,
        "bossHpBase": 90,
        "bossHpPerStage": 15,
        "minionFirstAttackWindup": 0.65,
        "regularWaveBase": 30,
        "regularWavePerStage": 10,
        "minionDamage": 4,
        "minionSpeed": 1,
        "minionAttackPeriod": 1,
        "bossDamage": 10,
        "bossSpeed": 0.7,
        "bossAttackPeriod": 1,
        "bossHpDivisor": 2,
        "wavePhases": {
          "openingFraction": 0.3,
          "middleEndFraction": 0.85,
          "openingStart": 2.2,
          "openingEnd": 1.4,
          "middleEnd": 0.75,
          "finalInterval": 0.55
        }
      },
      "economy": {
        "startingCoinMax": 2,
        "coinsPerClassGate": 2,
        "minionUPChance": 0.1,
        "bossUP": 5,
        "startingTowerHP": 100,
        "minionUPMode": "deterministic-eight",
        "eligibleKillsPerUP": 8,
        "eliteKillUP": 0.5,
        "scheduledUPByPrestige": [
          1,
          1,
          1,
          1,
          0.8,
          0.65
        ],
        "startingShopSlots": 1
      },
      "skill": {
        "costs": {
          "T1-ROOT": 0,
          "T1-M1": 0,
          "T1-EXIT": 0,
          "T1-G01": 2,
          "T1-G02": 2,
          "T1-G03": 3,
          "T1-G04": 4,
          "T1-G05": 4,
          "T1-K-GATE": 0,
          "T1-K-S01": 2,
          "T1-K-S02": 2,
          "T1-K-S03": 2,
          "T1-K-S04": 3,
          "T1-K-S05": 3,
          "T1-K-T01": 2,
          "T1-K-T02": 3,
          "T1-K-T03": 3,
          "T1-K-T04": 4,
          "T1-K-T05": 5,
          "T1-A-GATE": 0,
          "T1-A-S01": 2,
          "T1-A-S02": 2,
          "T1-A-S03": 2,
          "T1-A-S04": 3,
          "T1-A-S05": 3,
          "T1-A-T01": 2,
          "T1-A-T02": 3,
          "T1-A-T03": 3,
          "T1-A-T04": 4,
          "T1-A-T05": 5,
          "T1-MG-GATE": 0,
          "T1-MG-S01": 2,
          "T1-MG-S02": 2,
          "T1-MG-S03": 2,
          "T1-MG-S04": 3,
          "T1-MG-S05": 3,
          "T1-MG-T01": 2,
          "T1-MG-T02": 3,
          "T1-MG-T03": 3,
          "T1-MG-T04": 4,
          "T1-MG-T05": 5,
          "T2-ROOT": 0,
          "T2-M1": 0,
          "T2-EXIT": 0,
          "T2-G01": 3,
          "T2-G02": 3,
          "T2-G03": 4,
          "T2-G04": 5,
          "T2-G05": 6,
          "T2-H-GATE": 0,
          "T2-H-S01": 3,
          "T2-H-S02": 3,
          "T2-H-S03": 3,
          "T2-H-S04": 4,
          "T2-H-S05": 4,
          "T2-H-T01": 4,
          "T2-H-T02": 5,
          "T2-H-T03": 6,
          "T2-H-T04": 7,
          "T2-H-T05": 8,
          "T2-B-GATE": 0,
          "T2-B-S01": 3,
          "T2-B-S02": 3,
          "T2-B-S03": 3,
          "T2-B-S04": 4,
          "T2-B-S05": 4,
          "T2-B-T01": 4,
          "T2-B-T02": 5,
          "T2-B-T03": 6,
          "T2-B-T04": 7,
          "T2-B-T05": 8,
          "T2-R-GATE": 0,
          "T2-R-S01": 3,
          "T2-R-S02": 3,
          "T2-R-S03": 3,
          "T2-R-S04": 4,
          "T2-R-S05": 4,
          "T2-R-T01": 4,
          "T2-R-T02": 5,
          "T2-R-T03": 6,
          "T2-R-T04": 7,
          "T2-R-T05": 8,
          "T3-ROOT": 0,
          "T3-M1": 0,
          "T3-EXIT": 0,
          "T3-G01": 4,
          "T3-G02": 4,
          "T3-G03": 5,
          "T3-G04": 5,
          "T3-G05": 7,
          "T3-P-GATE": 0,
          "T3-P-S01": 3,
          "T3-P-S02": 3,
          "T3-P-S03": 3,
          "T3-P-S04": 4,
          "T3-P-S05": 4,
          "T3-P-T01": 4,
          "T3-P-T02": 5,
          "T3-P-T03": 6,
          "T3-P-T04": 7,
          "T3-P-T05": 8,
          "T3-N-GATE": 0,
          "T3-N-S01": 3,
          "T3-N-S02": 3,
          "T3-N-S03": 3,
          "T3-N-S04": 4,
          "T3-N-S05": 4,
          "T3-N-T01": 4,
          "T3-N-T02": 5,
          "T3-N-T03": 6,
          "T3-N-T04": 7,
          "T3-N-T05": 8,
          "T3-PR-GATE": 0,
          "T3-PR-S01": 3,
          "T3-PR-S02": 3,
          "T3-PR-S03": 3,
          "T3-PR-S04": 4,
          "T3-PR-S05": 4,
          "T3-PR-T01": 4,
          "T3-PR-T02": 5,
          "T3-PR-T03": 6,
          "T3-PR-T04": 7,
          "T3-PR-T05": 8,
          "T4-ROOT": 0,
          "T4-M1": 0,
          "T4-EXIT": 0,
          "T4-G01": 5,
          "T4-G02": 5,
          "T4-G03": 6,
          "T4-G04": 6,
          "T4-G05": 8,
          "T4-S-GATE": 0,
          "T4-S-S01": 5,
          "T4-S-S02": 5,
          "T4-S-S03": 5,
          "T4-S-S04": 6,
          "T4-S-S05": 6,
          "T4-S-T01": 6,
          "T4-S-T02": 7,
          "T4-S-T03": 8,
          "T4-S-T04": 9,
          "T4-S-T05": 10,
          "T4-D-GATE": 0,
          "T4-D-S01": 5,
          "T4-D-S02": 5,
          "T4-D-S03": 5,
          "T4-D-S04": 6,
          "T4-D-S05": 6,
          "T4-D-T01": 6,
          "T4-D-T02": 7,
          "T4-D-T03": 8,
          "T4-D-T04": 9,
          "T4-D-T05": 10,
          "T4-W-GATE": 0,
          "T4-W-S01": 5,
          "T4-W-S02": 5,
          "T4-W-S03": 5,
          "T4-W-S04": 6,
          "T4-W-S05": 6,
          "T4-W-T01": 6,
          "T4-W-T02": 7,
          "T4-W-T03": 8,
          "T4-W-T04": 9,
          "T4-W-T05": 10,
          "T5-ROOT": 0,
          "T5-M1": 0,
          "T5-EXIT": 0,
          "T5-G01": 6,
          "T5-G02": 6,
          "T5-G03": 7,
          "T5-G04": 8,
          "T5-G05": 9,
          "T5-BM-GATE": 0,
          "T5-BM-S01": 5,
          "T5-BM-S02": 5,
          "T5-BM-S03": 5,
          "T5-BM-S04": 6,
          "T5-BM-S05": 6,
          "T5-BM-T01": 6,
          "T5-BM-T02": 7,
          "T5-BM-T03": 8,
          "T5-BM-T04": 9,
          "T5-BM-T05": 10,
          "T5-NE-GATE": 0,
          "T5-NE-S01": 5,
          "T5-NE-S02": 5,
          "T5-NE-S03": 5,
          "T5-NE-S04": 6,
          "T5-NE-S05": 6,
          "T5-NE-T01": 6,
          "T5-NE-T02": 7,
          "T5-NE-T03": 8,
          "T5-NE-T04": 9,
          "T5-NE-T05": 10,
          "T5-DR-GATE": 0,
          "T5-DR-S01": 5,
          "T5-DR-S02": 5,
          "T5-DR-S03": 5,
          "T5-DR-S04": 6,
          "T5-DR-S05": 6,
          "T5-DR-T01": 6,
          "T5-DR-T02": 7,
          "T5-DR-T03": 8,
          "T5-DR-T04": 9,
          "T5-DR-T05": 10
        },
        "gateGoals": {
          "T1-K-GATE": 5,
          "T1-A-GATE": 10,
          "T1-MG-GATE": 15,
          "T2-H-GATE": 30,
          "T2-B-GATE": 35,
          "T2-R-GATE": 40,
          "T3-P-GATE": 50,
          "T3-N-GATE": 55,
          "T3-PR-GATE": 60,
          "T4-S-GATE": 50,
          "T4-D-GATE": 55,
          "T4-W-GATE": 60,
          "T5-BM-GATE": 60,
          "T5-NE-GATE": 65,
          "T5-DR-GATE": 70
        },
        "tierGatewayUP": [
          28,
          48,
          75,
          110
        ]
      },
      "legacy": {
        "vitalityPctPerRank": 0.08,
        "damagePctPerRank": 0.08,
        "upIncomePctPerRank": 0.25,
        "coinsPerTreasuryRank": 2,
        "shopSlotsPerMerchantRank": 1
      },
      "stages": [
        {
          "id": "stage-01",
          "number": 1,
          "slots": 48,
          "basic": {
            "hp": 7,
            "damage": 3.5,
            "speed": 1.2,
            "attackPeriod": 0.8,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Trickster Slime",
            "hp": 22,
            "damage": 4,
            "speed": 0.85,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 400,
            "damage": 7,
            "speed": 1,
            "attackPeriod": 2
          },
          "status": "lab-candidate",
          "abilitiesStatus": "existing runtime only"
        },
        {
          "id": "stage-02",
          "number": 2,
          "slots": 56,
          "basic": {
            "hp": 9,
            "damage": 3.5,
            "speed": 0.75,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Fungal Healer",
            "hp": 27,
            "damage": 2.5,
            "speed": 0.75,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 130,
            "damage": 7.5,
            "speed": 0.5,
            "attackPeriod": 1.5
          },
          "status": "lab-candidate",
          "abilitiesStatus": "existing runtime only"
        },
        {
          "id": "stage-03",
          "number": 3,
          "slots": 84,
          "basic": {
            "hp": 6,
            "damage": 3,
            "speed": 1.65,
            "attackPeriod": 1,
            "firstDelay": 0.25
          },
          "elite": {
            "name": "Goblin Thief",
            "hp": 20,
            "damage": 4,
            "speed": 1.55,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 200,
            "damage": 12,
            "speed": 0.45,
            "attackPeriod": 1.5
          },
          "status": "lab-candidate",
          "abilitiesStatus": "existing runtime only"
        },
        {
          "id": "stage-04",
          "number": 4,
          "slots": 76,
          "basic": {
            "hp": 11,
            "damage": 4,
            "speed": 1.05,
            "attackPeriod": 1.4,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Bandit Saboteur",
            "hp": 39,
            "damage": 6,
            "speed": 1.2,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 240,
            "damage": 13,
            "speed": 0.85,
            "attackPeriod": 1.5
          },
          "status": "lab-candidate",
          "abilitiesStatus": "existing runtime only"
        },
        {
          "id": "stage-05",
          "number": 5,
          "slots": 88,
          "basic": {
            "hp": 16,
            "damage": 5,
            "speed": 1.15,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Kobold Firecaller",
            "hp": 51,
            "damage": 6,
            "speed": 0.95,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 325,
            "damage": 15,
            "speed": 0.8,
            "attackPeriod": 1.5
          },
          "status": "lab-candidate",
          "abilitiesStatus": "existing runtime only"
        },
        {
          "id": "stage-06",
          "number": 6,
          "slots": 96,
          "basic": {
            "hp": 20,
            "damage": 6.5,
            "speed": 1.2,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Sacred Inquisitor",
            "hp": 61,
            "damage": 7.5,
            "speed": 0.85,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 420,
            "damage": 16,
            "speed": 0.85,
            "attackPeriod": 1.5
          },
          "status": "lab-candidate",
          "abilitiesStatus": "existing runtime only"
        },
        {
          "id": "stage-07",
          "number": 7,
          "slots": 108,
          "basic": {
            "hp": 16,
            "damage": 6.5,
            "speed": 1.25,
            "attackPeriod": 1.6,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Hellhound",
            "hp": 74,
            "damage": 10,
            "speed": 1.8,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 520,
            "damage": 19,
            "speed": 1.05,
            "attackPeriod": 1.5
          },
          "status": "lab-candidate",
          "abilitiesStatus": "existing runtime only"
        },
        {
          "id": "stage-08",
          "number": 8,
          "slots": 114,
          "basic": {
            "hp": 22,
            "damage": 7.5,
            "speed": 1.2,
            "attackPeriod": 1.6,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Cursed Bone Pile",
            "hp": 88,
            "damage": 0,
            "speed": 0,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 640,
            "damage": 19,
            "speed": 0.65,
            "attackPeriod": 1.5
          },
          "status": "lab-candidate",
          "abilitiesStatus": "existing runtime only"
        },
        {
          "id": "stage-09",
          "number": 9,
          "slots": 126,
          "basic": {
            "hp": 28,
            "damage": 9,
            "speed": 1,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Shadow Assassin",
            "hp": 93,
            "damage": 11.25,
            "speed": 1.5,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 775,
            "damage": 22,
            "speed": 0.85,
            "attackPeriod": 1.5
          },
          "status": "lab-candidate",
          "abilitiesStatus": "existing runtime only"
        },
        {
          "id": "stage-10",
          "number": 10,
          "slots": 138,
          "basic": {
            "hp": 33,
            "damage": 10.5,
            "speed": 1.2,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Rift Caster",
            "hp": 113,
            "damage": 11.75,
            "speed": 1,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 1390,
            "damage": 16,
            "speed": 0.6,
            "attackPeriod": 1.8,
            "phases": [
              {
                "hp": 390,
                "damage": 16,
                "speed": 0.6,
                "attackPeriod": 1.8
              },
              {
                "hp": 455,
                "damage": 20,
                "speed": 0.85,
                "attackPeriod": 1.35
              },
              {
                "hp": 545,
                "damage": 25,
                "speed": 1.1,
                "attackPeriod": 1
              }
            ]
          },
          "status": "lab-candidate",
          "abilitiesStatus": "existing runtime only"
        }
      ],
      "towerFire": {
        "damage": 3,
        "cooldownSeconds": 2.5,
        "projectileSpeed": 9,
        "projectileRadius": 0.3
      },
      "eliteSchedule": {
        "firstReset": 1,
        "unlockStagesPerReset": 2,
        "baseShare": 0.04,
        "extraSharePerAge": 0.03,
        "maxShare": 0.18,
        "openingExclusion": 0.3,
        "middleShare": 0.7,
        "liveCaps": [
          2,
          2,
          2,
          2,
          3,
          3,
          3,
          3,
          4,
          4
        ]
      }
    },
    "historical": {
      "profileId": "fw-live-v1.5.0-core",
      "schemaVersion": 1,
      "status": "live",
      "manifestoVersion": "1.5.0",
      "lastReviewed": "2026-11-23",
      "notes": "First-pass v1.5.0 staged combat numerics; boss/elite abilities and spells may remain partially unimplemented. No full-engine balance certification.",
      "heroes": [
        {
          "id": "knight",
          "name": "Knight",
          "pack": 0,
          "rarity": "Common",
          "color": "#b9c6d0",
          "hp": 19,
          "damage": 3.2,
          "speed": 0.75,
          "walk": 1.78,
          "range": 1,
          "role": "Sword Strike",
          "glyph": "⚔"
        },
        {
          "id": "archer",
          "name": "Archer",
          "pack": 0,
          "rarity": "Uncommon",
          "color": "#8acaab",
          "hp": 12,
          "damage": 3.6,
          "speed": 0.7,
          "walk": 1.85,
          "range": 6,
          "role": "Straight Arrow",
          "glyph": "➶"
        },
        {
          "id": "mage",
          "name": "Mage",
          "pack": 0,
          "rarity": "Legendary",
          "color": "#ffc770",
          "hp": 14,
          "damage": 4.8,
          "speed": 0.55,
          "walk": 1.8,
          "range": 5,
          "role": "Explosive Fireball",
          "glyph": "✦"
        },
        {
          "id": "hunter",
          "name": "Hunter",
          "pack": 1,
          "rarity": "Unassigned",
          "color": "#a1c391",
          "hp": 15,
          "damage": 5.6,
          "speed": 0.55,
          "walk": 1.87,
          "range": 6.4,
          "role": "Serrated Arrow",
          "glyph": "⌁"
        },
        {
          "id": "barbarian",
          "name": "Barbarian",
          "pack": 1,
          "rarity": "Unassigned",
          "color": "#df9878",
          "hp": 28,
          "damage": 6.4,
          "speed": 0.5,
          "walk": 1.78,
          "range": 1.3,
          "role": "Wide Cleave",
          "glyph": "🪓"
        },
        {
          "id": "rogue",
          "name": "Rogue",
          "pack": 1,
          "rarity": "Unassigned",
          "color": "#b3a0d8",
          "hp": 14,
          "damage": 1.6,
          "speed": 2.1,
          "walk": 1.95,
          "range": 1.1,
          "role": "Alternating Daggers",
          "glyph": "🗡"
        },
        {
          "id": "paladin",
          "name": "Paladin",
          "pack": 2,
          "rarity": "Unassigned",
          "color": "#eac978",
          "hp": 36,
          "damage": 5.2,
          "speed": 0.65,
          "walk": 1.72,
          "range": 1.3,
          "role": "Hammer Strike",
          "glyph": "⚒"
        },
        {
          "id": "nun",
          "name": "Nun",
          "pack": 2,
          "rarity": "Unassigned",
          "color": "#d8cae5",
          "hp": 21,
          "damage": 3.8,
          "speed": 0.9,
          "walk": 1.85,
          "range": 1.1,
          "role": "Monastic Combination",
          "glyph": "✚"
        },
        {
          "id": "priest",
          "name": "Priest",
          "pack": 2,
          "rarity": "Epic",
          "color": "#ce91ff",
          "hp": 20,
          "damage": 5.6,
          "speed": 0.6,
          "walk": 1.76,
          "range": 4,
          "role": "Censuring Ray",
          "glyph": "✥"
        },
        {
          "id": "shaman",
          "name": "Shaman",
          "pack": 3,
          "rarity": "Unassigned",
          "color": "#78d6c5",
          "hp": 20,
          "damage": 6,
          "speed": 0.6,
          "walk": 1.8,
          "range": 4.4,
          "role": "Vial Throw",
          "glyph": "☯"
        },
        {
          "id": "druid",
          "name": "Druid",
          "pack": 3,
          "rarity": "Unassigned",
          "color": "#9cce79",
          "hp": 26,
          "damage": 5.8,
          "speed": 0.65,
          "walk": 1.78,
          "range": 4.6,
          "role": "Vine Wave",
          "glyph": "❧"
        },
        {
          "id": "warlock",
          "name": "Warlock",
          "pack": 3,
          "rarity": "Unassigned",
          "color": "#b06acc",
          "hp": 19,
          "damage": 7.6,
          "speed": 0.5,
          "walk": 1.75,
          "range": 4.8,
          "role": "Doom Sigil",
          "glyph": "☽"
        },
        {
          "id": "beastmaster",
          "name": "Beastmaster",
          "pack": 4,
          "rarity": "Unassigned",
          "color": "#dcab7f",
          "hp": 31,
          "damage": 6.6,
          "speed": 0.6,
          "walk": 1.86,
          "range": 1.8,
          "role": "Whip",
          "glyph": "♞"
        },
        {
          "id": "necromancer",
          "name": "Necromancer",
          "pack": 4,
          "rarity": "Unassigned",
          "color": "#9da2e8",
          "hp": 23,
          "damage": 8.4,
          "speed": 0.5,
          "walk": 1.73,
          "range": 4.8,
          "role": "Soul Sucking Beam",
          "glyph": "☠"
        },
        {
          "id": "dragonkin",
          "name": "Dragonkin",
          "pack": 4,
          "rarity": "Unassigned",
          "color": "#f49b69",
          "hp": 56,
          "damage": 10,
          "speed": 0.4,
          "walk": 1.7,
          "range": 1.3,
          "role": "Lunge",
          "glyph": "🐉"
        }
      ],
      "summons": {
        "hound": {
          "id": "hound",
          "name": "Hound",
          "rarity": "Summoned",
          "color": "#c99d63",
          "hp": 9,
          "damage": 1.4,
          "speed": 1.1,
          "walk": 2,
          "range": 1,
          "glyph": "🐕",
          "role": "Summoned Bite"
        },
        "undead": {
          "id": "undead",
          "name": "Undead",
          "rarity": "Summoned",
          "color": "#7bd2c4",
          "hp": 7,
          "damage": 1.2,
          "speed": 1,
          "walk": 1.62,
          "range": 1,
          "glyph": "☠",
          "role": "Undead Strike"
        }
      },
      "packs": {
        "heroesPerPack": 1,
        "definitions": [
          {
            "name": "Recruit",
            "stage": 1,
            "pool": [
              "knight",
              "archer",
              "mage"
            ],
            "price": 2
          },
          {
            "name": "Outlaw",
            "stage": null,
            "pool": [
              "hunter",
              "barbarian",
              "rogue"
            ],
            "price": 3
          },
          {
            "name": "Devotion",
            "stage": null,
            "pool": [
              "paladin",
              "nun",
              "priest"
            ],
            "price": 4
          },
          {
            "name": "Occult",
            "stage": null,
            "pool": [
              "shaman",
              "druid",
              "warlock"
            ],
            "price": 5
          },
          {
            "name": "Mythic",
            "stage": null,
            "pool": [
              "beastmaster",
              "necromancer",
              "dragonkin"
            ],
            "price": 6
          }
        ]
      },
      "encounters": [
        {
          "name": "Slime Pits",
          "minion": "Slime",
          "boss": "King Slime",
          "minionIcon": "●",
          "bossIcon": "♛",
          "minionColor": "#7ee897",
          "bossColor": "#4ad1ad",
          "approved": true
        },
        {
          "name": "Fungal Forest",
          "minion": "Mushroom Man",
          "boss": "Giant Plant",
          "minionIcon": "♧",
          "bossIcon": "✿",
          "minionColor": "#e2b973",
          "bossColor": "#97d67c",
          "approved": true
        },
        {
          "name": "Goblin Camp",
          "minion": "Goblin",
          "boss": "Orc Warlord",
          "minionIcon": "♠",
          "bossIcon": "⚔",
          "minionColor": "#97ce6e",
          "bossColor": "#7a9e59",
          "approved": true
        },
        {
          "name": "Bandit Hideout",
          "minion": "Bandit",
          "boss": "Bandit King",
          "minionIcon": "◆",
          "bossIcon": "♛",
          "minionColor": "#d3a17d",
          "bossColor": "#b77465",
          "approved": false
        },
        {
          "name": "Dragon's Lair",
          "minion": "Kobold",
          "boss": "Drake",
          "minionIcon": "♠",
          "bossIcon": "◆",
          "minionColor": "#d3b477",
          "bossColor": "#e18759",
          "approved": false
        },
        {
          "name": "Sacred Citadel",
          "minion": "Fanatical Zealot",
          "boss": "Fallen Seraph",
          "minionIcon": "✚",
          "bossIcon": "✧",
          "minionColor": "#f5dc91",
          "bossColor": "#dab2f4",
          "approved": false
        },
        {
          "name": "Infernal Realm",
          "minion": "Imp",
          "boss": "Succubus Queen",
          "minionIcon": "✶",
          "bossIcon": "♛",
          "minionColor": "#e37d77",
          "bossColor": "#c86aa7",
          "approved": false
        },
        {
          "name": "Cursed Necropolis",
          "minion": "Wraith",
          "boss": "Lich",
          "minionIcon": "☾",
          "bossIcon": "☠",
          "minionColor": "#acb4ef",
          "bossColor": "#96a0e8",
          "approved": false
        },
        {
          "name": "Dark Cathedral",
          "minion": "Cultist",
          "boss": "Abyssal High Priest",
          "minionIcon": "◈",
          "bossIcon": "✥",
          "minionColor": "#ad7ebd",
          "bossColor": "#b374c0",
          "approved": false
        },
        {
          "name": "The Final Rift",
          "minion": "Voidling",
          "boss": "Eldritch Horror",
          "minionIcon": "✺",
          "bossIcon": "☼",
          "minionColor": "#8f86cf",
          "bossColor": "#cf70d0",
          "approved": false
        }
      ],
      "combat": {
        "acquisitionRange": 15,
        "towerGuardRadius": 5,
        "specialChargeSeconds": 10,
        "enemyHeroDetection": 6,
        "returnRadius": 2.4,
        "actorRadius": 0.35,
        "bossRadius": 0.75,
        "personalSpace": 0.045,
        "decisionInterval": 0.25,
        "targetCommitSeconds": 1,
        "retargetMargin": 0.35,
        "rangeStandoff": 0.76,
        "meleeSlots": 6,
        "steerResponsiveness": 9
      },
      "abilities": {
        "knight": {
          "name": "Shield Bash",
          "trigger": "autoCharge",
          "bashRadius": 1.9,
          "bashStunSeconds": 1.6,
          "bashDamage": 0
        },
        "archer": {
          "name": "Arrow Volley",
          "trigger": "autoCharge",
          "volleyArrowCount": 5,
          "volleyRadius": 1.8,
          "volleyDamage": 1.4
        },
        "mage": {
          "name": "Chain Bolt",
          "trigger": "autoCharge",
          "chainJumpCount": 4,
          "chainJumpRange": 2.4,
          "chainDamage": 2.5
        },
        "hunter": {
          "name": "Tripwire Trap",
          "trigger": "autoCharge",
          "trapRadius": 1.25,
          "trapDurationSeconds": 7,
          "trapSlowMultiplier": 0.4
        },
        "barbarian": {
          "name": "Battle Frenzy",
          "trigger": "autoCharge",
          "frenzyDurationSeconds": 5,
          "frenzyAttackSpeedMultiplier": 1.9
        },
        "rogue": {
          "name": "Smoke Bomb",
          "trigger": "autoCharge",
          "invisibilityDurationSeconds": 4
        },
        "paladin": {
          "name": "Divine Aegis",
          "trigger": "autoCharge",
          "shieldAmount": 14,
          "shieldRadius": 2.7,
          "shieldDurationSeconds": 6
        },
        "nun": {
          "name": "Sanctuary Prayer",
          "trigger": "autoCharge",
          "sanctuaryRadius": 2.35,
          "sanctuaryLifetimeSeconds": 5,
          "sanctuaryHealPerSecond": 1.7,
          "sanctuaryTickIntervalSeconds": 0.2,
          "sanctuaryEligibilityRadius": 2.35,
          "sanctuarySelfHealingAllowed": false,
          "sanctuaryOverlappingZonesPolicy": "nonstacking"
        },
        "priest": {
          "name": "Blessing of Courage",
          "trigger": "autoCharge",
          "blessingRadius": 3,
          "blessingDamageBonus": 0.35,
          "blessingDurationSeconds": 6
        },
        "shaman": {
          "name": "Spirit Totem",
          "trigger": "autoCharge",
          "totemHealth": 22,
          "totemLifetimeSeconds": 11,
          "totemAggroRadius": 6,
          "totemCount": 1
        },
        "druid": {
          "name": "Bear Form",
          "trigger": "autoCharge",
          "bearFormDurationSeconds": 5.5
        },
        "warlock": {
          "name": "Life Siphon",
          "trigger": "autoCharge",
          "siphonDamage": 3,
          "siphonHealAmount": 5,
          "siphonRange": 4.8
        },
        "beastmaster": {
          "name": "Summon Hound",
          "trigger": "autoCharge",
          "houndHealth": 18,
          "houndDamage": 1.4,
          "houndAttackSpeed": 1.1,
          "houndWalkSpeed": 2,
          "houndLifetimeSeconds": 13,
          "maximumActiveHounds": 3
        },
        "necromancer": {
          "name": "Raise the Fallen",
          "trigger": "onEnemyKill",
          "beamContinuous": true,
          "beamBaseDamageRate": 4.2,
          "beamRampSeconds": 8,
          "beamMaxRampMultiplier": 2.1,
          "beamTickSeconds": 0.1,
          "beamRetargetPolicy": "reset-on-change",
          "undeadHealth": 13,
          "undeadDamage": 1.2,
          "undeadLifetimeSeconds": 15
        },
        "dragonkin": {
          "name": "Dragon Breath",
          "trigger": "autoCharge",
          "breathConeDegrees": 90,
          "breathRange": 3.7,
          "breathDamage": 6
        }
      },
      "spawn": {
        "normalInterval": 2,
        "normalRateRampFactor": 2,
        "heroSpawnRadiusMin": 1.8,
        "heroSpawnRadiusMultiplier": 4,
        "heroSpawnSeparation": 0.95,
        "bossClearDelay": 2,
        "normalHp": 6,
        "bossHpBase": 90,
        "bossHpPerStage": 15,
        "minionFirstAttackWindup": 0.65,
        "regularWaveBase": 30,
        "regularWavePerStage": 10,
        "minionDamage": 4,
        "minionSpeed": 1,
        "minionAttackPeriod": 1,
        "bossDamage": 10,
        "bossSpeed": 0.7,
        "bossAttackPeriod": 1,
        "bossHpDivisor": 2,
        "wavePhases": {
          "openingFraction": 0.3,
          "middleEndFraction": 0.85,
          "openingStart": 2.2,
          "openingEnd": 1.4,
          "middleEnd": 0.75,
          "finalInterval": 0.55
        }
      },
      "economy": {
        "startingCoinMax": 2,
        "coinsPerClassGate": 2,
        "minionUPChance": 0.1,
        "bossUP": 5,
        "startingTowerHP": 100,
        "minionUPMode": "deterministic-six",
        "eligibleKillsPerUP": 6,
        "eliteKillUP": 1
      },
      "skill": {
        "costs": {
          "T1-ROOT": 0,
          "T1-M1": 0,
          "T1-EXIT": 0,
          "T1-G01": 2,
          "T1-G02": 2,
          "T1-G03": 3,
          "T1-G04": 4,
          "T1-G05": 4,
          "T1-K-GATE": 0,
          "T1-K-S01": 2,
          "T1-K-S02": 2,
          "T1-K-S03": 2,
          "T1-K-S04": 3,
          "T1-K-S05": 3,
          "T1-K-T01": 2,
          "T1-K-T02": 3,
          "T1-K-T03": 3,
          "T1-K-T04": 4,
          "T1-K-T05": 5,
          "T1-A-GATE": 0,
          "T1-A-S01": 2,
          "T1-A-S02": 2,
          "T1-A-S03": 2,
          "T1-A-S04": 3,
          "T1-A-S05": 3,
          "T1-A-T01": 2,
          "T1-A-T02": 3,
          "T1-A-T03": 3,
          "T1-A-T04": 4,
          "T1-A-T05": 5,
          "T1-MG-GATE": 0,
          "T1-MG-S01": 2,
          "T1-MG-S02": 2,
          "T1-MG-S03": 2,
          "T1-MG-S04": 3,
          "T1-MG-S05": 3,
          "T1-MG-T01": 2,
          "T1-MG-T02": 3,
          "T1-MG-T03": 3,
          "T1-MG-T04": 4,
          "T1-MG-T05": 5,
          "T2-ROOT": 0,
          "T2-M1": 0,
          "T2-EXIT": 0,
          "T2-G01": 3,
          "T2-G02": 3,
          "T2-G03": 4,
          "T2-G04": 5,
          "T2-G05": 6,
          "T2-H-GATE": 0,
          "T2-H-S01": 3,
          "T2-H-S02": 3,
          "T2-H-S03": 3,
          "T2-H-S04": 4,
          "T2-H-S05": 4,
          "T2-H-T01": 4,
          "T2-H-T02": 5,
          "T2-H-T03": 6,
          "T2-H-T04": 7,
          "T2-H-T05": 8,
          "T2-B-GATE": 0,
          "T2-B-S01": 3,
          "T2-B-S02": 3,
          "T2-B-S03": 3,
          "T2-B-S04": 4,
          "T2-B-S05": 4,
          "T2-B-T01": 4,
          "T2-B-T02": 5,
          "T2-B-T03": 6,
          "T2-B-T04": 7,
          "T2-B-T05": 8,
          "T2-R-GATE": 0,
          "T2-R-S01": 3,
          "T2-R-S02": 3,
          "T2-R-S03": 3,
          "T2-R-S04": 4,
          "T2-R-S05": 4,
          "T2-R-T01": 4,
          "T2-R-T02": 5,
          "T2-R-T03": 6,
          "T2-R-T04": 7,
          "T2-R-T05": 8,
          "T3-ROOT": 0,
          "T3-M1": 0,
          "T3-EXIT": 0,
          "T3-G01": 4,
          "T3-G02": 4,
          "T3-G03": 5,
          "T3-G04": 5,
          "T3-G05": 7,
          "T3-P-GATE": 0,
          "T3-P-S01": 3,
          "T3-P-S02": 3,
          "T3-P-S03": 3,
          "T3-P-S04": 4,
          "T3-P-S05": 4,
          "T3-P-T01": 4,
          "T3-P-T02": 5,
          "T3-P-T03": 6,
          "T3-P-T04": 7,
          "T3-P-T05": 8,
          "T3-N-GATE": 0,
          "T3-N-S01": 3,
          "T3-N-S02": 3,
          "T3-N-S03": 3,
          "T3-N-S04": 4,
          "T3-N-S05": 4,
          "T3-N-T01": 4,
          "T3-N-T02": 5,
          "T3-N-T03": 6,
          "T3-N-T04": 7,
          "T3-N-T05": 8,
          "T3-PR-GATE": 0,
          "T3-PR-S01": 3,
          "T3-PR-S02": 3,
          "T3-PR-S03": 3,
          "T3-PR-S04": 4,
          "T3-PR-S05": 4,
          "T3-PR-T01": 4,
          "T3-PR-T02": 5,
          "T3-PR-T03": 6,
          "T3-PR-T04": 7,
          "T3-PR-T05": 8,
          "T4-ROOT": 0,
          "T4-M1": 0,
          "T4-EXIT": 0,
          "T4-G01": 5,
          "T4-G02": 5,
          "T4-G03": 6,
          "T4-G04": 6,
          "T4-G05": 8,
          "T4-S-GATE": 0,
          "T4-S-S01": 5,
          "T4-S-S02": 5,
          "T4-S-S03": 5,
          "T4-S-S04": 6,
          "T4-S-S05": 6,
          "T4-S-T01": 6,
          "T4-S-T02": 7,
          "T4-S-T03": 8,
          "T4-S-T04": 9,
          "T4-S-T05": 10,
          "T4-D-GATE": 0,
          "T4-D-S01": 5,
          "T4-D-S02": 5,
          "T4-D-S03": 5,
          "T4-D-S04": 6,
          "T4-D-S05": 6,
          "T4-D-T01": 6,
          "T4-D-T02": 7,
          "T4-D-T03": 8,
          "T4-D-T04": 9,
          "T4-D-T05": 10,
          "T4-W-GATE": 0,
          "T4-W-S01": 5,
          "T4-W-S02": 5,
          "T4-W-S03": 5,
          "T4-W-S04": 6,
          "T4-W-S05": 6,
          "T4-W-T01": 6,
          "T4-W-T02": 7,
          "T4-W-T03": 8,
          "T4-W-T04": 9,
          "T4-W-T05": 10,
          "T5-ROOT": 0,
          "T5-M1": 0,
          "T5-EXIT": 0,
          "T5-G01": 6,
          "T5-G02": 6,
          "T5-G03": 7,
          "T5-G04": 8,
          "T5-G05": 9,
          "T5-BM-GATE": 0,
          "T5-BM-S01": 5,
          "T5-BM-S02": 5,
          "T5-BM-S03": 5,
          "T5-BM-S04": 6,
          "T5-BM-S05": 6,
          "T5-BM-T01": 6,
          "T5-BM-T02": 7,
          "T5-BM-T03": 8,
          "T5-BM-T04": 9,
          "T5-BM-T05": 10,
          "T5-NE-GATE": 0,
          "T5-NE-S01": 5,
          "T5-NE-S02": 5,
          "T5-NE-S03": 5,
          "T5-NE-S04": 6,
          "T5-NE-S05": 6,
          "T5-NE-T01": 6,
          "T5-NE-T02": 7,
          "T5-NE-T03": 8,
          "T5-NE-T04": 9,
          "T5-NE-T05": 10,
          "T5-DR-GATE": 0,
          "T5-DR-S01": 5,
          "T5-DR-S02": 5,
          "T5-DR-S03": 5,
          "T5-DR-S04": 6,
          "T5-DR-S05": 6,
          "T5-DR-T01": 6,
          "T5-DR-T02": 7,
          "T5-DR-T03": 8,
          "T5-DR-T04": 9,
          "T5-DR-T05": 10
        },
        "gateGoals": {
          "T1-K-GATE": 5,
          "T1-A-GATE": 10,
          "T1-MG-GATE": 15,
          "T2-H-GATE": 30,
          "T2-B-GATE": 35,
          "T2-R-GATE": 40,
          "T3-P-GATE": 40,
          "T3-N-GATE": 40,
          "T3-PR-GATE": 45,
          "T4-S-GATE": 50,
          "T4-D-GATE": 55,
          "T4-W-GATE": 60,
          "T5-BM-GATE": 60,
          "T5-NE-GATE": 65,
          "T5-DR-GATE": 70
        },
        "tierGatewayUP": [
          28,
          48,
          75,
          110
        ]
      },
      "legacy": {
        "vitalityPctPerRank": 0.08,
        "damagePctPerRank": 0.08,
        "upIncomePctPerRank": 0.25,
        "coinsPerTreasuryRank": 2,
        "shopSlotsPerMerchantRank": 1
      },
      "stages": [
        {
          "id": "stage-01",
          "number": 1,
          "slots": 48,
          "basic": {
            "hp": 7,
            "damage": 3,
            "speed": 0.85,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Trickster Slime",
            "hp": 22,
            "damage": 4,
            "speed": 0.85,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 95,
            "damage": 8,
            "speed": 0.55,
            "attackPeriod": 1.5
          },
          "status": "first-pass-design-target",
          "abilitiesStatus": "pending-implementation"
        },
        {
          "id": "stage-02",
          "number": 2,
          "slots": 56,
          "basic": {
            "hp": 10,
            "damage": 4,
            "speed": 0.75,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Fungal Healer",
            "hp": 30,
            "damage": 3,
            "speed": 0.75,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 145,
            "damage": 9,
            "speed": 0.5,
            "attackPeriod": 1.5
          },
          "status": "first-pass-design-target",
          "abilitiesStatus": "pending-implementation"
        },
        {
          "id": "stage-03",
          "number": 3,
          "slots": 84,
          "basic": {
            "hp": 6,
            "damage": 3,
            "speed": 1.65,
            "attackPeriod": 1,
            "firstDelay": 0.25
          },
          "elite": {
            "name": "Goblin Thief",
            "hp": 20,
            "damage": 4,
            "speed": 1.55,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 200,
            "damage": 13,
            "speed": 0.45,
            "attackPeriod": 1.5
          },
          "status": "first-pass-design-target",
          "abilitiesStatus": "pending-implementation"
        },
        {
          "id": "stage-04",
          "number": 4,
          "slots": 76,
          "basic": {
            "hp": 12,
            "damage": 5,
            "speed": 1.05,
            "attackPeriod": 1.4,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Bandit Saboteur",
            "hp": 36,
            "damage": 6,
            "speed": 1.2,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 240,
            "damage": 14,
            "speed": 0.85,
            "attackPeriod": 1.5
          },
          "status": "first-pass-design-target",
          "abilitiesStatus": "pending-implementation"
        },
        {
          "id": "stage-05",
          "number": 5,
          "slots": 88,
          "basic": {
            "hp": 15,
            "damage": 5,
            "speed": 1.15,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Kobold Firecaller",
            "hp": 48,
            "damage": 6,
            "speed": 0.95,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 300,
            "damage": 16,
            "speed": 0.8,
            "attackPeriod": 1.5
          },
          "status": "first-pass-design-target",
          "abilitiesStatus": "pending-implementation"
        },
        {
          "id": "stage-06",
          "number": 6,
          "slots": 96,
          "basic": {
            "hp": 18,
            "damage": 6,
            "speed": 1.2,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Sacred Inquisitor",
            "hp": 55,
            "damage": 7,
            "speed": 0.85,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 370,
            "damage": 16,
            "speed": 0.85,
            "attackPeriod": 1.5
          },
          "status": "first-pass-design-target",
          "abilitiesStatus": "pending-implementation"
        },
        {
          "id": "stage-07",
          "number": 7,
          "slots": 108,
          "basic": {
            "hp": 14,
            "damage": 6,
            "speed": 1.25,
            "attackPeriod": 1.6,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Hellhound",
            "hp": 65,
            "damage": 9,
            "speed": 1.8,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 440,
            "damage": 18,
            "speed": 1.05,
            "attackPeriod": 1.5
          },
          "status": "first-pass-design-target",
          "abilitiesStatus": "pending-implementation"
        },
        {
          "id": "stage-08",
          "number": 8,
          "slots": 114,
          "basic": {
            "hp": 20,
            "damage": 7,
            "speed": 1.2,
            "attackPeriod": 1.6,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Cursed Bone Pile",
            "hp": 80,
            "damage": 0,
            "speed": 0,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 525,
            "damage": 18,
            "speed": 0.65,
            "attackPeriod": 1.5
          },
          "status": "first-pass-design-target",
          "abilitiesStatus": "pending-implementation"
        },
        {
          "id": "stage-09",
          "number": 9,
          "slots": 126,
          "basic": {
            "hp": 24,
            "damage": 8,
            "speed": 1,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Shadow Assassin",
            "hp": 80,
            "damage": 10,
            "speed": 1.5,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 620,
            "damage": 20,
            "speed": 0.85,
            "attackPeriod": 1.5
          },
          "status": "first-pass-design-target",
          "abilitiesStatus": "pending-implementation"
        },
        {
          "id": "stage-10",
          "number": 10,
          "slots": 138,
          "basic": {
            "hp": 28,
            "damage": 9,
            "speed": 1.2,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "elite": {
            "name": "Rift Caster",
            "hp": 96,
            "damage": 10,
            "speed": 1,
            "attackPeriod": 1,
            "firstDelay": 0.65
          },
          "boss": {
            "hp": 1070,
            "damage": 14,
            "speed": 0.6,
            "attackPeriod": 1.8,
            "phases": [
              {
                "hp": 300,
                "damage": 14,
                "speed": 0.6,
                "attackPeriod": 1.8
              },
              {
                "hp": 350,
                "damage": 18,
                "speed": 0.85,
                "attackPeriod": 1.35
              },
              {
                "hp": 420,
                "damage": 22,
                "speed": 1.1,
                "attackPeriod": 1
              }
            ]
          },
          "status": "first-pass-design-target",
          "abilitiesStatus": "pending-implementation"
        }
      ],
      "towerFire": {
        "damage": 2,
        "cooldownSeconds": 3,
        "projectileSpeed": 9,
        "projectileRadius": 0.3
      },
      "eliteSchedule": {
        "firstReset": 1,
        "unlockStagesPerReset": 2,
        "baseShare": 0.04,
        "extraSharePerAge": 0.03,
        "maxShare": 0.18,
        "openingExclusion": 0.3,
        "middleShare": 0.7,
        "liveCaps": [
          2,
          2,
          2,
          2,
          3,
          3,
          3,
          3,
          4,
          4
        ]
      }
    }
  },
  "experimentRegistry": [
    {
      "profileId": "fw-experiment-v1.2.0",
      "status": "experimental-not-active",
      "parent": "fw-live-v1.1.8",
      "note": "Monte Carlo candidate only; not approved for gameplay. Stored in spreadsheet, not loaded here."
    }
  ],
  "units": {
    "hp": "hit points",
    "damage": "HP per hit",
    "speed": "attacks per second",
    "walk": "map units per second",
    "range": "map units",
    "spawnIntervalSeconds": "seconds",
    "up": "upgrade points"
  }
};
function validate(profile){
 const error=(m)=>{throw new Error("Invalid Fantasy Warriors balance profile: "+m)};
 const finite=(v,lo,hi,path)=>{if(typeof v!=="number"||!Number.isFinite(v)||v<lo||v>hi)error(path)};
 if(!profile||profile.schemaVersion!==1||profile.status!=="live"||typeof profile.profileId!=="string")error("metadata");
 if(!Array.isArray(profile.heroes)||profile.heroes.length!==15||new Set(profile.heroes.map(h=>h.id)).size!==15)error("hero roster");
 for(const h of profile.heroes){finite(h.hp,1,100000,"hero "+h.id+" HP");finite(h.damage,.01,10000,"hero "+h.id+" damage");finite(h.speed,.01,20,"hero "+h.id+" attacks/sec");finite(h.walk,.01,30,"hero "+h.id+" movement");finite(h.range,.1,30,"hero "+h.id+" range");}
 for(const key of ["hound","undead"]){const h=profile.summons?.[key];if(!h)error("summon "+key);for(const field of ["hp","damage","speed","walk","range"])finite(h[field],.01,100000,"summon "+key+"."+field);}
 if(!Array.isArray(profile.packs?.definitions)||profile.packs.definitions.length!==5)error("pack definitions");
 finite(profile.packs.heroesPerPack,1,6,"pack size");
 for(const p of profile.packs.definitions){finite(p.price,1,100,"pack price");if(!Array.isArray(p.pool)||p.pool.length!==3||p.pool.some(id=>!profile.heroes.some(h=>h.id===id)))error("pack hero IDs");}
 if(!Array.isArray(profile.encounters)||profile.encounters.length!==10)error("stage encounters");
 const n=profile.spawn;finite(n.normalRateRampFactor,0,10,"spawn.normalRateRampFactor");finite(n.heroSpawnRadiusMin,1.5,8,"spawn.heroSpawnRadiusMin");finite(n.heroSpawnRadiusMultiplier,1,6,"spawn.heroSpawnRadiusMultiplier");finite(n.heroSpawnSeparation,.5,3,"spawn.heroSpawnSeparation");for(const key of ["normalInterval","bossClearDelay","normalHp","bossHpBase","bossHpPerStage","minionFirstAttackWindup","regularWaveBase","regularWavePerStage","minionAttackPeriod","bossHpDivisor","bossAttackPeriod"] )finite(n[key],key==="bossHpPerStage"?0:.05,10000,"spawn."+key);
 for(const key of ["minionDamage","minionSpeed","bossDamage","bossSpeed"])finite(n[key],0,10000,"spawn."+key);
 const econ=profile.economy;finite(econ.startingCoinMax,1,100000,"coin maximum");finite(econ.coinsPerClassGate,0,100,"quest coin reward");finite(econ.minionUPChance,0,1,"UP probability");finite(econ.bossUP,0,10000,"boss UP");finite(econ.startingTowerHP,1,100000,"tower HP");
 const skill=profile.skill;if(!skill||Object.keys(skill.costs||{}).length!==205||Object.keys(skill.gateGoals||{}).length!==15)error("skill node / class gate completeness");
 for(const [id,value] of Object.entries(skill.costs))finite(value,0,100000,"skill cost "+id);
 for(const [id,value] of Object.entries(skill.gateGoals))finite(value,1,100000,"class gate "+id);
 if(skill.tierGatewayUP.length!==4)error("tier gateways");for(const v of skill.tierGatewayUP)finite(v,0,100000,"gateway UP");
 if(!profile.combat||!profile.abilities||Object.keys(profile.abilities).length!==15)error("combat / abilities");

 const stages=profile.stages;if(!Array.isArray(stages)||stages.length!==10)error("stage targets");
 for(let i=0;i<stages.length;i++){
  const stage=stages[i];if(stage.number!==i+1||stage.id!=='stage-'+String(i+1).padStart(2,'0'))error("stage ID");
  finite(stage.slots,1,1000,"stage slots");
  for(const role of ['basic','elite','boss']){
   const a=stage[role];if(!a)error("stage "+(i+1)+" "+role);
   finite(a.hp,1,100000,"stage "+i+" "+role+" HP");
   finite(a.damage,0,10000,"stage "+i+" "+role+" damage");
   finite(a.speed,0,30,"stage "+i+" "+role+" speed");
   finite(a.attackPeriod,.1,30,"stage "+i+" "+role+" attack cadence");
  }
 }
 for(const key of ['damage','cooldownSeconds','projectileSpeed','projectileRadius'])finite(profile.towerFire?.[key],.01,10000,'towerFire.'+key);
 finite(profile.economy.eligibleKillsPerUP,1,1000,'UP cadence');
 if(!Number.isInteger(profile.economy.eligibleKillsPerUP)||!['deterministic-six','deterministic-eight'].includes(profile.economy.minionUPMode))error('UP mode');
 finite(profile.economy.eliteKillUP,0,1000,'elite UP');
 if(profile.economy.scheduledUPByPrestige!==undefined){const factors=profile.economy.scheduledUPByPrestige;if(!Array.isArray(factors)||factors.length!==6)error('prestige UP scaling');for(const n of factors)finite(n,.01,1,'prestige UP factor');}
 for(const key of ['openingFraction','middleEndFraction','openingStart','openingEnd','middleEnd','finalInterval'])finite(profile.spawn.wavePhases?.[key],.01,30,'wave.'+key);
 if(!profile.eliteSchedule||profile.eliteSchedule.liveCaps?.length!==10)error('elite schedule');
 return true;
}
validate(dataset.profiles.live);
window.FWBalance={
 schemaVersion:dataset.schemaVersion,
 profile:JSON.parse(JSON.stringify(dataset.profiles.live)),
 profiles:dataset.profiles,
 experimentRegistry:dataset.experimentRegistry,
 units:dataset.units,
 validate,
 exportJSON:()=>JSON.stringify(dataset.profiles.live,null,2)
};
})();
