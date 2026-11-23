# Fantasy Warriors — Playable Demo

**Current playable build: 1.0.14** · **Current design manifesto: v1.5.0** · 23 November 2026

**Implemented v1.5.0 foundations:** automatically firing player-aimed tower projectiles; 48–138 scheduled enemies with stage-specific base HP/damage/speed and faster three-phase waves; guaranteed UP per six scheduled enemy kills (remainder persists through attempts); King Slime split, Mushroom Man death spores and Eldritch Horror's three health phases.

**Still pending:** prestige-unlocked elite spawn schedules and their ten signature abilities, most remaining boss/basic-enemy special attacks, new Tower Armaments tree branches, later targeted spells and full-engine balance verification. The v1.5.0 figures are first-pass tuning values, not verified stage-clear-time results.

A browser-based tower-defence prototype for testing pack-drawn heroes, automatic combat, waves, upgrades and persistent progression.

## Play and test

- **[Play the game](https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/?v=1.0.14)** — main campaign and its own local saved progression.
- **[Open the Combat Balance Lab](https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/balance-lab.html)** — stripped-down combat test using the current game engine, configurable teams/stats/spawns, 0.25×–100× speed, result export and a copyable JSON configuration. Lab settings are separate from campaign progression.
- **[Full build history](BUILD_HISTORY.md)** — release-by-release implementation details.
- **[Technical architecture](ARCHITECTURE.md)** — source-file responsibilities, dependency order, migration map and regression checklist.

## What's new in Build 1.0.14

- **Active tower:** Every **3.00 seconds**, the tower shoots a straight **2-damage** projectile at the remembered mouse or touch aim, at **9 world units/sec** and **0.30 radius**. No need to click repeatedly; mouse movement or a battlefield tap changes persistent aim. Kills from tower shots contribute to general UP cadence, **not class kill quests**.
- **Three-part accelerating waves:** Opening 30% (2.20→1.40s per spawn), escalating middle 30–85% (1.40→0.75s), then a 0.55s final rush. Scheduled enemies per stage: **48 / 56 / 84 / 76 / 88 / 96 / 108 / 114 / 126 / 138**. Each stage now has its own current basic and boss stat records; elite baselines are stored but elite spawning is not yet enabled.
- **Deterministic Upgrade Points:** **1 UP for every six eligible scheduled-wave enemy kills**, carrying remainder across retries/successes and ordinary run restarts; partial credit resets on voluntary prestige. The stage boss still awards **5 UP**. Imported saves and existing earned UP persist. Boss-generated slimes and other created units give no UP or hero quest kills.
- **Enemy signatures (partial):** King Slime turns into **four 7-HP Slimes** at half of its **95-HP** initial bar; these children must all die for its **one** boss reward. Stage 2 Mushroom Men leave a two-second damaging spore cloud on death. Basic Bandit/Imp ranged attacks now use their specified firing range. Stage 10's Eldritch Horror rebirths across **300 / 350 / 420 HP** phases.
- **Compatibility:** First-ever stage-attempt history is now persisted for a *future* elite rollout, without activating incomplete elites. Save/backups still use schema 1 with additional optional fields. Shop stock, Legacy perks, packs and 205 existing tree nodes remain. The Combat Balance Lab uses the same new runtime and profile.
- **Testing:** Source parsing and mock-browser startup passed; sampled stage-wave, projectile-targeting/pause, deterministic reward persistence, Stage 1 split/no-generated rewards and Stage 10 rebirths passed. Actual live-device balance and full enemy ability checks remain outstanding.

## Current gameplay snapshot

- Accurate hero-class killing-blow attribution across basics, specials, damage-over-time, delayed hits and summoned allies; summoning heroes retain credit even after leaving the field.


- Three randomly rolled standard-pack shop offers per attempt, with one purchase per slot and at least one affordable opening offer. Shops restock after failed or successful attempts; unlimited free rotation is disabled.
- Five pack tiers unlock again through the ordinary skill tree in each prestige cycle. Prestige resets class-kill quest progress and +2 coin-cap bonuses, run pack-opening tasks, tier gateways and ordinary upgrades, but preserves permanent Legacy perks.
- Ten stages, waves and bosses, an interactive 205-node skill tree, hero-class kill quests, Upgrade Points and Legacy resets.
- Normal minion spawn rate accelerates *linearly in rate* from 1× to 3× within each wave. This is provisional, not yet stage-balanced.
- Heroes spawn at randomized distances around the tower and use simplified closest-enemy-in-front targeting.
- The **Testing Shop** and **Quick Stats** panel inside the playable game are intended for quick test battles. The standalone Combat Balance Lab is better for repeatable side-by-side tuning.
- Browser progress persists locally; **Skill Tree → Save & Backup** exports/imports campaign progression. Save a backup before major test runs.

## Balance and design documents

- [Master Gameplay Manifesto](https://docs.google.com/document/d/1Jg4X-tenlmFmtnbXrM7_f4z1uWIxIY-Ux9uEhomb3-M/edit) — ongoing gameplay design source of truth.
- [Development Changelog](https://docs.google.com/document/d/1tvt0jo5JuApiYJygmR03QAItIahFNMXERtS2xk3Xxgg/edit) — design changes and decisions.
- [Editable Balance Configuration](https://docs.google.com/spreadsheets/d/1WT-9mQQSB7YfbG7uI-nkNm0oD95TyyCaFmQ8tR03AEk/edit) — manual planning spreadsheet, **not automatically connected** to the live game.

For numerical changes that affect the playable build, edit `balance-config.js` (the live validated profile). The Google Sheet is not automatically imported.

## Files and deployment

- **Game entry point:** `index.html`
- **Lab entry point:** `balance-lab.html`
- **Shared live data and combat:** `balance-config.js`, `game-data.js`, `game-arcade.js`, `game-core.js`
- **Game presentation:** `game-render.js`, `game-ui.js`, `game.css`
- **Progression:** `skill-tree-data.js`, `skill-tree.js`, `skill-tree-effects.js`, `skill-tree.css`
- **Testing interfaces:** `quick-stats.js`, `quick-stats.css`, `balance-lab.js`, `balance-lab.css`
- **Documentation:** `README.md`, `BUILD_HISTORY.md`, `ARCHITECTURE.md`

GitHub Pages deploys from **`main` / repository root**, with no build process. Preserve script order in both HTML files. Update the script and CSS query-string versions after edits to avoid stale browser caches.

## Known limitations

Later pack costs, guaranteed individual heroes, booster/special packs, merchant rerolls, some skill and Legacy effects, stage-specific balancing and parts of the prestige economy remain provisional. The Balance Lab is a test environment, not a second campaign. A campaign JSON backup includes progression, **not** a live battle snapshot.
