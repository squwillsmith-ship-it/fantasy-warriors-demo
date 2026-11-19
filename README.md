# Fantasy Warriors — Playable Demo

**Build 1.0.3 · Gameplay Manifesto v1.1.3** (19 November 2026)

**Play on iPhone / desktop:** https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/?v=1.0.3


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

- Five pack types and a 15-hero roster. Recruit Packs cost 2 coins and each purchased pack produces three temporary heroes.
- Interactive vertical **205-node skill tree** with class-specific minion kill challenges, ordinary Upgrade Points, shop offer slots, and provisional purchase/gateway prices.
- Permanent Legacy upgrades and voluntary prestige resets, all with explicitly **provisional demo costs and effects**.
- Ten stages with distinct featured minions and bosses, 14 automatically charged specials, Necromancer's event-triggered Raise the Fallen, collision-aware spatial combat and the free Testing Shop.

## Known limitations

Higher-tier pack prices, exact upgrade percentages and currency economy, skill gateway requirements, full prestige persistence rules and special-effect numbers remain under design; Build 1.0's existing 0.9 progression balancing is **experimental** and not finalized. A JSON backup contains persistent progression, **not** a mid-fight simulation snapshot.

## Technical

Five GitHub Pages files: `index.html`, `skill-tree-data.js`, `skill-tree.js`, `skill-tree-effects.js`, `skill-tree.css`. Deploy from `main` / root. Use the versioned link above to bypass mobile Safari caching.
