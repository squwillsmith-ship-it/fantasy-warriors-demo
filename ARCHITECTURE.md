# Fantasy Warriors — Technical Architecture

**Build 1.0.4 · 19 November 2026**

The HTML prototype is deliberately modular. The goal is to preserve gameplay rules and game data while allowing the presentation layer to be replaced by Godot later. **This is a structural refactor, not a balancing or design update.**

## Responsibility and file map

| File | Owns | Does not own |
|---|---|---|
| `index.html` | Semantic page markup and script loading order | Game rules, hero stats, rendering algorithms |
| `game-data.js` | Base hero definitions, five pack rosters, encounter themes, provisional ability configuration, tuning, spawn cadence and summon baselines | Active combat simulation, DOM, Canvas |
| `skill-tree-data.js` | 205 node descriptions, proposed costs, dependencies and challenges | Skill effects and gameplay state |
| `game-core.js` | Runtime game state, battle simulation, enemy/hero AI, collision, targeting, skills integration, pack purchases, stage flow and test hooks | Canvas drawing algorithms, full UI template generation, fixed hero/pack records |
| `game-render.js` | 2D Canvas drawing, animation cues, battlefield viewport and effects display | Damage, AI, progression, saving |
| `game-ui.js` | DOM status panels, pack offer visualisation, wave tracker, formation, battle report and player-facing presentation | Combat resolution and hero balance |
| `skill-tree.js` | Upgrade entitlement, purchase rules, currency, prestige, save/import/export | Full hero base statistics and Canvas |
| `skill-tree-effects.js` | Purchased-upgrade combat modifiers and techniques | Upgrade tree node descriptions and pages |
| `game.css` / `skill-tree.css` | Layout, colours, responsive/mobile styling | Gameplay logic |

### Load order

The browser loads **`skill-tree-data.js` → `skill-tree.js` → `skill-tree-effects.js` → `game-data.js` → `game-render.js` → `game-ui.js` → `game-core.js`**. `game-core.js` starts the game once its dependencies exist.

These files run as ordinary classic browser scripts so GitHub Pages can host the prototype without a build system. Script globals use dedicated `window.FW...` namespaces. Module factories accept the shared state and the narrow dependencies they need.

### Authoritative game data

Use `game-data.js` to adjust base hero HP, damage, movement, basic attack speed and range, pack membership, encounter names/icons/colours, base ability parameters, shared tuning, and spawn cadence. Those definitions use serializable JavaScript object/array values, which can be exported as JSON-compatible records for Godot resources later.

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
- One Recruit Pack reveals **three** heroes and enters an ordinary stage.
- Testing Shop still spawns selected heroes without granting saved progression.
- Minions spawn every **2 seconds** and boss waits until all ordinary minions are defeated, then **2 seconds** more.
- Ordinary enemy defeats have a **10% independent** 1-UP drop chance; bosses guarantee **5 UP**.
- Hero engagement locking, tower collision and class special attacks still work.
- All **205** skill nodes load; existing saves can be exported/imported and resume at the correct campaign stage.

**Scope note:** The game is not yet a Godot application. Extracting files now makes a later Godot rewrite more predictable, but the actual combat runtime and renderer still need porting.
