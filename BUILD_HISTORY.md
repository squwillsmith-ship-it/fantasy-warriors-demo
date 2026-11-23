## Build 1.0.14 — 23 November 2026 (v1.5 combat foundations)

- **Player-aimed automatic tower fire:** 2-damage projectile every 3 seconds, moving straight at 9 units/sec with a 0.30-unit collision radius. Mouse movement or a tap updates persistent aim. Player shots do not grant hero-class kill credit.
- **New live stage profiles:** standard waves across Stages 1–10 now contain 48/56/84/76/88/96/108/114/126/138 scheduled enemies with explicitly stage-specific basic/boss HP, damage and speeds in the central balance profile; no longer use the former generic minion HP or simple +10 waves. Elite stat records exist but aren't spawned until their signature mechanics are implemented.
- **Three-part rising spawn intensity:** Opening 2.2→1.4s, escalation 1.4→0.75s, 0.55s final rush. First minion still appears immediately; 2-second boss intermission remains.
- **Guaranteed Upgrade Points:** 1 UP for every six eligible scheduled-wave kills, cumulative remainder persisted within the prestige run; 5 UP guaranteed on boss defeat. Tower kills count for the general cadence but not class-specific kill gates. Spawned children grant no UP or class progress. Existing UP-income multipliers remain.
- **First signatures:** Stage 1 King Slime splits into four radial standard-HP Slimes at 50% of its 95-HP opening bar; reward deferred until all four die. Stage 2 normal Mushroom Man leaves a two-second spore damage cloud. Basic Bandit and Imp acquire provisional ranged engagement. Stage 10 Eldritch Horror has three rebirth HP bars of 300, 350 and 420.
- **Persistence:** First lifetime attempts at each stage are recorded for a later elite schedule, without enabling incomplete elite types. Existing skill-tree saves and finite stock shop persist.
- **Unimplemented/unfinished v1.5 areas:** prestige elite substitutions and all ten elite signatures, most normal/boss enemy special abilities, spell equipment and manually targeted casts, additional Tower Armament skill branches, full-battle balance and iPhone testing. Numeric targets are still initial and not validated for 10–15 minute cumulative stage duration.
- **Regression checks:** Script parsing and mock initialization; wave intervals, tower projectile damage/targeting, deterministic six-kill UP, generated-unit credit exclusion, King Slime split/deferred boss reward and final-boss three-phase succession.

## Build 1.0.13 — 23 November 2026 (explicit final-blow hero attribution)

- **Precise source tracking:** Every damaging hit now explicitly carries the originating hero class; display colours never determine kill ownership. Only the source of the actual killing hit receives the class kill credit.
- **All damage paths:** Basic attacks, auto-charge specials, chain/splash abilities, Priest delayed hits, Hunter bleed, Paladin/Mage/Shaman/Dragonkin ground hazards, Warlock doom explosions and technique procs preserve ownership.
- **Summons:** Hounds and raised undead store their summoner's hero class on creation, so their final blows count for the original class even if the summoner subsequently dies or leaves the field.
- **No false credits:** Unattributed damage overwrites stale hit ownership rather than reusing the previous attacker. Bosses still grant their existing guaranteed UP reward and do not increase ordinary minion-kill quest counters. Test mode still cannot award permanent progression.
- **Regression tests:** `node --test tests/kill-attribution.test.cjs` covers final-blow precedence, custom visual colours, uncredited damage, dead enemies, and summon-source persistence. No enemy design abilities or balance values were changed.

## Build 1.0.12 — 22 November 2026 (finite shop; run-scoped prestige gateways and class quests)

- **Limited stock:** Start each ordinary attempt with three random one-purchase standard-pack offers; at least one initial offer is affordable. All slots restock on stage failure or success. Removed unlimited free rotation. Additional stock slots still come from appropriate upgrades.
- **Prestige reset:** Voluntary prestige now clears run-scoped class-kill quest progress, class branch gates and their +2 maximum-coin bonuses, pack-opening tasks, ordinary skill purchases and pack tier gateways. Permanent Legacy perks and earned Lifetime/Shards remain.
- **Gateway progression:** Prestige count qualifies a zero-UP route for an individual tier gateway after its in-run mastery milestone. Tier unlocks no longer auto-appear across prestige cycles; the player must open them again through the ordinary skill tree.
- **Scope:** Current shop items are still one-hero themed packs. Booster boxes, individual heroes, Golden/Shiny and combined packs, as well as merchant rerolls, remain planned future features.

# Fantasy Warriors — Build History

Implementation notes retained from the original README, latest first. These entries describe historical build changes, not necessarily current balance values; refer to the current game and Master Gameplay Manifesto for live rules.

## New in Build 1.0.11 — Accelerating Waves & Arcade AI

- **Within-wave spawn acceleration:** Every stage begins at the familiar **2.0-second** minion interval and increases minion spawning **linearly in RATE**, from **1×** initially to **3×** by the end of its wave (the last interval is about **0.67 seconds**). This is a shared first-pass curve, *not exponential yet*, and stage-specific balance is deliberately deferred. Total enemies and the defeated-wave → 2-second boss gate are unchanged.
- **Heroes now spread randomly:** Each hero independently spawns around the tower between **1.8 and 7.2 world units** from its centre—up to **four times the old 1.8-unit starting ring**—with basic spacing to reduce overlap. Summons retain their existing spawn rules. Heroes placed outside the existing 5-unit tower guard can fight near their deployment and move inward; once inside the ordinary guard, that original limit remains effective.
- **Simpler arcade targeting:** Choose the **closest enemy in front of the hero**, falling back to the closest reachable enemy in any direction when none is ahead. Remove the older role/urgency/crowd scoring and melee-slot allocation; keep attacking, basic navigation, local collisions, specials, tower limits and purchased upgrades otherwise functioning. Skill-target focus perks provide only a small optional proximity bias.
- **Tunable defaults in `balance-config.js`:** `spawn.normalRateRampFactor = 2` (rate multiplier ends at 1 + factor); `heroSpawnRadiusMin = 1.8`, `heroSpawnRadiusMultiplier = 4`, `heroSpawnSeparation = 0.95`. Reusable pure functions live in `game-arcade.js`.
- **Wave tracker:** displays the live countdown and rate multiplier. Existing local saves, ordinary progression, the Quick Stats tester, 5/10/15 Recruit challenges, and Reset Skill Tree are kept. **Google Sheets is still not connected.**
- **Balance caveat:** The shorter wave-spawning period will affect stage timings and difficulty. These settings are placeholders to verify through later playtesting, not a claim that stages meet the 10–15-minute target.

## New in Build 1.0.10 — Central Balance, Kill Goals & Safe Test Reset

- **New `balance-config.js`:** versioned, validated, JSON-compatible **live balance profile `fw-live-v1.3.4`**. Numerical hero stats, both summons, five pack pools/prices, abilities, combat-AI settings, minion/boss HP and damage, normal wave size/spawn timing, round coin economy, UP award probability and boss reward, all **205 skill node costs**, all **15 class-kill thresholds**, and four proposed tier-gateway prices are now drawn from this single profile. Structural mechanics, secondary effect multipliers and some Legacy tuning remain in game code for subsequent migration.
- **5 / 10 / 15 Recruit kill quests:** Knight Sword Duty requires **5** minion kills, Archer Target Practice **10**, Mage Arcane Trial **15**, each awarding the existing permanent **+2 max coins** once. Higher-tier quest thresholds are unchanged and still provisional.
- **Older saved quests protected:** An Archer/Mage quest already completed at five kills in a prior build keeps its completed status and permanent +2 cap reward. Its saved kill count remains intact. Incomplete quests follow the new target.
- **Isolated Reset Skill Tree for testing:** In **Skill Tree → 🧪 Test Reset**, start a temporary sandbox, reset purchased ordinary nodes, and **refund the original UP amounts** recorded for each purchase. The sandbox clone can be used for comparing builds and test battles, then discarded. It cannot overwrite the main progress save or grant permanent Legacy currency. Previously purchased older nodes without a cost ledger use their unchanged historical node cost as fallback.
- **Balance export:** The same Test Reset tab can download the active numeric balance profile as JSON. The Google Sheets balance editor remains a separate *manual* editor and is **not live-synchronised**. There is no automatic import of experimental balance values.
- **No unrelated rebalance:** Existing v1.3.4 hero HP/damage, 6-HP normal minions, 0.65-second minion first attack wind-up, 2-second spawn spacing, 10% independent UP drops, and 5 guaranteed boss UP are unchanged.

### Verification

- All 9 active JavaScript modules parsed; simulated startup reached normal preparation with a 2-coin cap, 15 heroes, 205 nodes, 30-minion Stage 1 wave and correct 5/10/15 Recruit targets.
- Config validation rejected 5 deliberately invalid edits. Single-number edits to hero HP, purchase cost, class goal, pack price and spawn interval reached runtime data without changing gameplay code.
- Progression tests verified coin-cap progression **2 → 4 → 6 → 8**, grandfathered older save credit, no duplicate quest rewards, exact sandbox refunds and preservation of the original localStorage save.

## New in Build 1.0.9 — Quick Stats (Testing Shop only)

- Inside **Testing Shop → Enable testing mode → Quick Stats**, select any of the 15 heroes and adjust **HP, basic damage, attacks per second, movement speed, and basic attack range**.
- Select **Normal enemy (all stages)** to change their **HP, damage, movement speed, attack interval and first-hit wind-up**. Select **Stage boss** to adjust **HP, damage, movement speed and attack interval** independently for the currently selected test stage (1–10).
- Press **Apply test stats** to use the new values on your **next testing battle**. **Reset selection** or **Reset all** restores defaults. Overrides are saved locally on that browser/device across refreshes.
- **Normal campaign battles and permanent progression use untouched original stats.** This developer tool does not import or sync Google Sheets, change the manifesto's approved baseline, alter skill-tree costs/quests, or add new player-facing upgrades.
- Necromancer's sustained basic beam damage scales with the editable damage and attack-rate values. Setting fields are validated against bounded positive ranges; all controls are disabled outside preparation.
- On iPhone, changing values is possible directly in the Testing Shop. Because the game caches assets, use the new `?v=1.0.9` URL and refresh after GitHub Pages deploys.

## New in Build 1.0.8 — Lower HP and minion first-attack wind-up

- All **15 hero classes** now have half their previous base health, rounded to the nearest whole number. Recruit examples: Knight **37.5 → 19**, Archer **24 → 12**, Mage **27.5 → 14**. Allied summons are also halved: hound **18 → 9**, undead **13 → 7**.
- Standard enemy minions: **11 → 6 HP**. All bosses: **round((90 + 15 × (stage − 1)) / 2)**; Stage 1 King Slime **45 HP**, Stage 2 Giant Plant **53 HP**, Stage 3 Orc Warlord **60 HP**, Stage 10 Eldritch Horror **113 HP**.
- Normal minions have a **0.65-second attack wind-up** upon first entering reach, or after leaving and re-entering reach. After their first hit, they still hit at most once every **1 second**. Boss attacks are unchanged. Several minions can still threaten one hero together.
- Hero and enemy damage, swing speeds, tower health, skill tree, kill quests, coin progression, stage waves, 10%/5-UP rewards and permanent saves are unchanged.
- Testing-only debug enemies optionally accept a damage value for contact-timing regression tests.

## New in Build 1.0.7 — Live Hero Kill Quest Journal

- **Quest Journal** in the main sidebar shows live standard-minion kill counts and progress bars for Knight, Archer and Mage, plus expandable details for the twelve higher-tier classes.
- Shows each quest's target and the **permanent +2 max-coin reward**. Rewards are based on existing saved kill ledgers and remain available after retries, run restarts, prestige and reloads.
- **Tap any quest** to jump directly to its corresponding gate in the 205-node Skill Tree, including locked tiers (which show their status).
- Clearly marks Testing Shop battles as **non-progressing**. The other-tier kill thresholds are still draft values; Recruit challenges remain 5 kills each.
- No change to the approved rules: starting coin cap is 2, one hero per 2-coin Recruit Pack, 11-HP minions, 2-second spawn cadence, boss after the cleared wave, 10% minion-UP chance and guaranteed 5-UP boss drop.
- Verified via JavaScript simulations: 15 quest records, Knight 5/5 granting +2 coin cap (2 → 4), skill-tree deep link, live journal rendering and module syntax.

## New in Build 1.0.6 — Class kill challenges earn coin capacity

- **Starting maximum coins:** 2, which buys one 2-coin Recruit Pack during the first attempt.
- **Recruit kill challenges:** Knight, Archer and Mage each require **5 standard-minion killing blows** in ordinary battles (replacing 20 / 25 / 30). Hero-class kill counters persist across failed attempts, run restarts and voluntary prestige.
- **Quest reward:** Each of the **15** class-specific kill gates automatically provides **+2 maximum coins** once its target has been reached and the tier is available. Rewards are derived from the saved class kill counters, so cannot be duplicated by retries, reloads, re-opening the tree or prestige. Previously completed challenges are credited immediately for older saves.
- **Progression:** Base 2 → 4 after one class quest → 6 after two → 8 after all three Recruit quests, plus any coin-cap general upgrades or permanent Legacy ranks. The round coin balance still refills to the current maximum between attempts; if a gate completes mid-battle, the new maximum applies to the following preparation.
- **Unchanged:** Pack cost, single-hero opening, other-tier draft kill targets, 10% standard-minion 1-UP drops, guaranteed boss 5-UP, Testing Shop exclusions, stage/checkpoint save keys and 205-node skill tree.

## New in Build 1.0.5 — Pack and Combat Adjustments

- Every purchased hero pack now draws and deploys **one** random hero, from the same three-class pool. Pack prices and five-tier unlocks are unchanged; one pack still counts as one opening toward skill-tree tasks.
- The shared **hero target acquisition distance is 15 units**, up from 4. The independent **tower guard/chase limit remains 5 units**: heroes don't run across the map simply because they detect a distant enemy. Basic attack ranges remain class-specific.
- **Ranged/support heroes no longer kite or backpedal.** They advance if the selected enemy is outside attack range, but stop and hold their current position once able to attack. Without a target, they hold rather than walking back to their original anchor. Melee behaviour is unchanged.
- Normal enemy HP is halved **22 → 11**. Boss HP and enemy movement/attack parameters are unchanged. Standard enemies still spawn every two seconds and the boss waits until every minion is defeated.
- Local saves, all 205 skill nodes, UP drop odds and pack-opening task counters remain compatible.

## New in Build 1.0.4 — Godot-friendly code structure

- Extracted **game definitions** (15 hero profiles, five pack rosters, encounter identities, abilities, tuning and wave cadence) into `game-data.js`, away from rendering and combat rules.
- Moved **simulation, combat, enemy and hero AI, progression, game actions and stage lifecycle** to `game-core.js`.
- Extracted **Canvas graphics and animation drawing** into `game-render.js`, **DOM menus, shop, wave tracker and battle reports** into `game-ui.js`, and presentation CSS into `game.css`.
- The `index.html` file is now a short shell containing the page elements and ordered script/style references; existing skill-tree definitions and permanent progression remain in their separate files.
- **No intended gameplay changes.** A deterministic, seeded original-vs-modular simulation test matched pack opening, spawning, combat, Testing Shop state, saved progression and Canvas render startup. Existing local saves continue to use the same storage key and schema.
- See [ARCHITECTURE.md](ARCHITECTURE.md) for module ownership, dependency order and a future Godot migration map.

## New in Build 1.0.3 — Wave Tracker & Battle Report

- A live **wave tracker** on the battlefield shows minions defeated, alive and still due to spawn, with a progress bar and the countdown to the next standard enemy.
- **Boss arrival countdown** appears only after the entire standard wave has been defeated, using the approved 2-second wait. When the boss arrives, a new **boss health bar** shows current HP and maximum HP.
- **Earned Upgrade Points (UP)** are displayed during battle; only successful independent minion drops and guaranteed 5-UP boss kills count. Testing Shop fights do not earn persistent UP.
- **Stage completion and failure reports** show combat duration, enemies defeated, total UP earned, surviving starting heroes, special casts and remaining tower HP.
- Purely informational improvements: stage wave pacing (2 seconds per minion), boss triggers, class stats, coin refills, upgrade drop probabilities, 205-node skill tree, prestige and save persistence are unchanged.
- No new final balance values, invented abilities or additional currencies.

Verification: JavaScript compiled, and in-memory browser-style interaction tests covered prep, live minion counts, next spawn countdown, post-wave boss delay, boss HP, reports and stage boss spawn. GitHub Pages publishing may lag behind the repository update.

## New in Build 1.0.2 — Wave Pacing

- Normal minions spawn at **half the previous rate**: **one every 2 seconds**, starting with the first minion immediately after the battle begins.
- The unique stage boss waits until **all standard minions have actually been defeated**, not simply spawned. A **2-second intermission after the last minion death** then precedes boss arrival.
- Counts, enemy movement speeds, ten-stage clear conditions and Upgrade Point rewards stay unchanged.

## New in Build 1.0.1 — Upgrade Point drops

- Every standard enemy has a **10% independent chance to drop 1 UP** when defeated.
- Each boss guarantees **5 UP** on defeat.
- No automatic UP bonus is awarded simply for clearing a stage; the previous 1 UP per five minion kills is retired.
- Prestige income boosts still increase the amount of UP credited by a successful drop; class kill challenges and normal/test mode restrictions remain unchanged.

## New in Build 1.0 — Reliable progress and backups

- **Automatic campaign-stage checkpointing:** Refreshing or reopening the game resumes preparation at the saved stage rather than silently restarting at Stage 1. A battle interrupted by a page refresh resumes from preparation for that same stage, with the existing per-attempt coin refill.
- **Backward-compatible saves:** Existing 0.9 local skill-tree saves are migrated using the highest stage cleared in the current run. Skill nodes, Upgrade Points, challenges, unlocked tiers, resets, Legacy Shards and permanent perks are retained.
- **Save & Backup tab** within Skill Tree: view progression statistics, **Export Save JSON** to a file and **Import Save JSON** on the same or a different device.
- **Safe import:** checks save format and data integrity; asks for confirmation before replacing local progress. Import is available only in normal stage preparation, before purchasing any packs (not in Testing Shop). Saves remain local to the browser unless the player exports a file.
- **Skill-tree navigation:** tier panning/scrolling now retains position after selecting or buying a node.
- **Restart run** explicitly starts Stage 1 and preserves long-term skill-tree/legacy progress; voluntary prestige remains separate and resets the ordinary tree according to existing provisional rules.

## Existing gameplay (Build 0.9 and earlier)

- Five pack types and a 15-hero roster. Recruit Packs cost 2 coins and each purchased pack produces one temporary hero.
- Interactive vertical **205-node skill tree** with class-specific minion kill challenges, ordinary Upgrade Points, shop offer slots, and provisional purchase/gateway prices.
- Permanent Legacy upgrades and voluntary prestige resets, all with explicitly **provisional demo costs and effects**.
- Ten stages with distinct featured minions and bosses, 14 automatically charged specials, Necromancer's event-triggered Raise the Fallen, collision-aware spatial combat and the free Testing Shop.
