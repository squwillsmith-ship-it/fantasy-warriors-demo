# Fantasy Warriors — Technical Architecture

**Updated for Build 1.0.14 · 23 November 2026**

The HTML prototype is deliberately modular. The goal is to preserve gameplay rules and game data while allowing the presentation layer to be replaced by Godot later. **Build 1.0.11 adds editable within-wave pacing and simpler arcade combat atop the central data system.**

## Build 1.0.14 combat architecture

The validated live **`balance-config.js`** profile now includes named **`stages[0..9]`** records, with scheduled-wave counts and basic/elite/boss baseline stats. **`spawn.wavePhases`** owns the 30% / 85% breakpoints and interval curve. **`towerFire`** owns automatic projectile damage, rate, speed and collision radius. The profile now has `economy.minionUPMode = "deterministic-six"` and `eligibleKillsPerUP = 6`. Previous linear-spawn and random-UP fields are retained only for compatibility where still referenced; the live combat logic uses the new keys.

**`tower-fire.js`** contains mouse/touch coordinate mapping, remembered aim, automatic projectile spawning, collision and visual indicators; it receives the existing `hitEnemy` with an explicit null hero source. It does not change hero-class quest credit. `game-core.js` calls its update only while battles are active and pauses with the simulation; `game-render.js` draws spore effects. Both game and lab HTML load `tower-fire.js` ahead of `game-core.js`.

**`skill-tree.js`** now stores `eligibleKillRemainder` and `attemptedStages` in the existing save format. The former survives normal attempts and restart, resets on voluntary prestige, and awards each full six-kill group immediately. The latter is lifetime account-local stage history reserved for the future eligible-elite schedule; it is deliberately not erased by prestige. Existing backups still import with default values for these optional fields.

The Stage 1 boss transformation and Stage 10 boss phase succession reside in `game-core.js`; generated child Slimes have `generated=true`, `scheduled=false` and cannot earn UP or class-gate credit. The deferred Stage 1 boss payout occurs after children are defeated. Spore clouds are runtime-area effects, not independently reward-bearing enemies.

**Not yet implemented:** elite placement schedule and 10 elite abilities, most boss signature abilities, manually equipped battlefield spells, added Tower Armament nodes beyond the 205-node ordinary tree, and full-playthrough numeric tuning. Do not describe the live game as implementing these solely because the design profile includes proposed records.

## Responsibility and file map

| File | Owns | Does not own |
|---|---|---|
| `index.html` | Semantic page markup and script loading order | Game rules, hero stats, rendering algorithms |
| `balance-config.js` | Validated, single-source numerical live profile and JSON export; isolates experimental candidates | DOM, Canvas, save state, gameplay decisions |
| `game-data.js` | Adapter from the validated balance profile into hero, pack, enemy, ability and tuning records | DOM, Canvas, active simulation |
| `game-arcade.js` | Pure functions for linear within-wave spawn acceleration, random hero start positions and closest-front target decisions | DOM, saves, game state |
| `skill-tree-data.js` | 205 node descriptions, proposed costs, dependencies and challenges | Skill effects and gameplay state |
| `game-core.js` | Runtime game state, battle simulation, enemy/hero AI, collision, targeting, skills integration, pack purchases, stage flow and test hooks | Canvas drawing algorithms, full UI template generation, fixed hero/pack records |
| `game-render.js` | 2D Canvas drawing, animation cues, battlefield viewport and effects display | Damage, AI, progression, saving |
| `game-ui.js` | DOM status panels, pack offer visualisation, wave tracker, formation, battle report and player-facing presentation | Combat resolution and hero balance |
| `skill-tree.js` | Upgrade entitlement, purchase rules, currency, prestige, save/import/export | Full hero base statistics and Canvas |
| `skill-tree-effects.js` | Purchased-upgrade combat modifiers and techniques | Upgrade tree node descriptions and pages |
| `game.css` / `skill-tree.css` | Layout, colours, responsive/mobile styling | Gameplay logic |
| `quick-stats.js` / `quick-stats.css` | Main-game Testing Shop stat overrides and their editor | Baseline balance profile and normal campaign progression |
| `balance-lab.html` / `balance-lab.js` / `balance-lab.css` | Standalone combat testing screen, playback speed, test scenarios, copyable configuration and result export | Permanent campaign progress, production balance defaults |

### Load order

The browser loads **`balance-config.js` → `skill-tree-data.js` → `skill-tree.js` → `skill-tree-effects.js` → `game-data.js` → `game-arcade.js` → `quick-stats.js` → `game-render.js` → `game-ui.js` → `game-core.js`**. `game-core.js` starts the game once its dependencies exist.

These files run as ordinary classic browser scripts so GitHub Pages can host the prototype without a build system. Script globals use dedicated `window.FW...` namespaces. Module factories accept the shared state and the narrow dependencies they need.

### Separate playable and test entry points

- `index.html` runs the playable campaign. It loads `quick-stats.css` alongside the main styles, and the Testing Shop is the in-game quick-access test interface.
- `balance-lab.html` loads the same combat, balance, progression and presentation scripts, then `balance-lab.js` for lab-specific controls. It also loads `balance-lab.css` and uses its own testing state, speed controls, scenario settings and export UI.
- Keep both HTML script dependency chains in sync when extracting or renaming shared modules. Do not make the standalone lab alter the browser's campaign progress or change the canonical `balance-config.js` profile when users experiment.

### Central numerical configuration (Build 1.0.10)

The **`fw-live-v1.3.5`** profile in `balance-config.js` is the current source of numerical hero baselines, summons, packs, abilities, combat tuning, wave and generic enemy values, round economy, all **205** node prices, **15** kill-goal values and proposed four gateway prices.

The profile is plain JSON-compatible data wrapped as a classic script for synchronous GitHub Pages loading. `window.FWBalance.validate(profile)` rejects incomplete/invalid records; `window.FWBalance.exportJSON()` exposes the JSON profile for spreadsheet/import pipelines. **Only the live profile is loaded.** A separate unapproved experimental v1.2.0 trial is registered by ID, not activated or silently merged. Numerical settings still scattered through technique implementations and remaining Legacy effects are a **documented migration backlog**, not yet centralized.

The Google Sheet is **not connected**. Changes made there do not update the live game until a deliberate versioned import/generation step. The profile's stable IDs and schema are designed to support this future tool and a Godot JSON adapter.

**Save compatibility:** A new `purchaseCosts` ledger records actual costs of newly purchased ordinary tree nodes for exact test refunds; older nodes use the unchanged original node cost. Older 5-kill Archer/Mage quest completions are preserved in `grandfatheredGates` when migrated to 10/15 kill thresholds, preventing the loss of earned permanent coin rewards. `gateRulesVersion` distinguishes newer rules. Skill Tree → Test Reset clones saved progression in memory; its changes cannot be persisted, and exiting discards the clone. Permanent Legacy and import controls are disabled in the sandbox.

### Authoritative game data

Edit **`balance-config.js`** to adjust base hero HP, damage, movement, basic attack speed and range, pack membership, encounter names/icons/colours, base ability parameters, shared tuning, and spawn cadence. `game-data.js` is an adapter that reads this profile. Those definitions use serializable JavaScript object/array values, which can be exported as JSON-compatible records for Godot resources later.

Use `skill-tree-data.js` to edit skill node names, identifiers, prerequisites, costs and descriptions. Keep numerical effect implementations in `skill-tree.js` and `skill-tree-effects.js`, and do not silently invent or change manifesto-approved abilities.

**Never duplicate a stat in a renderer or UI file.** Use a data record passed into the view. If a stat requires an upgrade, apply its modifier in the logic layer rather than overwriting the canonical baseline.

### Combat, presentation and saving

`game-core.js` owns the simulation clock, entities, AI decisions, movement, combat and stage lifecycle. It passes the current state to `game-render.js`, which only draws the battlefield; `game-ui.js` projects that state into interface text and controls. The upgrade runtime maintains its existing localStorage key, purchase history, class challenges, banked UP, prestige and JSON backup compatibility.

Existing testing hooks (`window.__FW_DEMO__`, `window.__FW_TEST__`, `window.__FW_TUNING__`) remain available for development. Do not award persistent currency from Testing Shop battles.

### Godot migration map

1. **Import data first.** Serialize the `game-data.js` hero, pack, encounter and tuning records, and `skill-tree-data.js` nodes into Godot JSON or `.tres` resources. Keep stable IDs (e.g. `knight`, `T1-K-S01`) to preserve save and unlock relationships.
2. **Rebuild simulation rules.** Port the deterministic parts of `game-core.js`, including targeting, separation, stage spawning and combat, into GDScript/C# nodes or a dedicated simulation service; preserve special-case behaviour and balance.
3. **Reimplement upgrade effects and persistence.** Port modifier calculations from `skill-tree.js` and `skill-tree-effects.js`, retaining save schema migration and challenge counters.
4. **Replace presentation.** Recreate the Canvas renderer in Godot 2D and DOM controls as Control nodes; presentation need not be ported line-for-line.
5. **Parity tests.** Compare stage counts, spawn timings, attack rates, targeting and guard limits, 205 node prerequisites, UP drops, boss gate, and saved progress before replacing the browser version.

## Regression checklist after each refactor

- Browser starts on mobile and desktop with no runtime errors.
- One Recruit Pack reveals exactly **one** hero and enters an ordinary stage; six Recruit Packs at the 12-coin cap deploy six heroes.
- Testing Shop still spawns selected heroes without granting saved progression.
- Shared hero acquisition is **15 units**, tower guard/chase remains **5 units**, and ranged units hold their position when a target is in attack reach.
- Standard minions have **6 HP** rather than 11. All boss HP is rounded to half the previous stage-scaled value (Stage 1: 45).
- All 15 heroes and both allied summon types have their base HP halved and rounded. Normal minions have a **0.65-second** wind-up when they enter contact range; subsequent attacks use their prior one-second interval. Boss attack timing is unchanged.
- First minion spawns immediately; later intervals decrease from **2 seconds** to about **0.67 seconds** as the shared rate grows **linearly from 1× to 3×** within a wave. Boss waits until all ordinary minions are defeated, then **2 seconds** more.
- Ordinary enemy defeats have a **10% independent** 1-UP drop chance; bosses guarantee **5 UP**.
- Heroes spawn independently around the tower at **1.8–7.2 units** (best-effort spacing), select **closest eligible enemy ahead** with closest-anywhere fallback, and avoid reserved melee slots. Only active attack wind-ups and dedicated beam channels keep their own short target commitment; tower collision and class specials still work.
- All **205** skill nodes load; existing saves can be exported/imported and resume at the correct campaign stage.

**Scope note:** The game is not yet a Godot application. Extracting files now makes a later Godot rewrite more predictable, but the actual combat runtime and renderer still need porting.
