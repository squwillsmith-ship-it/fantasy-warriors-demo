# Fantasy Warriors — Playable Demo

**Current build: 1.0.13** · **Gameplay Manifesto: v1.4.6** · 23 November 2026

A browser-based tower-defence prototype for testing pack-drawn heroes, automatic combat, waves, upgrades and persistent progression.

## Play and test

- **[Play the game](https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/?v=1.0.13)** — main campaign and its own local saved progression.
- **[Open the Combat Balance Lab](https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/balance-lab.html)** — stripped-down combat test using the current game engine, configurable teams/stats/spawns, 0.25×–100× speed, result export and a copyable JSON configuration. Lab settings are separate from campaign progression.
- **[Full build history](BUILD_HISTORY.md)** — release-by-release implementation details.
- **[Technical architecture](ARCHITECTURE.md)** — source-file responsibilities, dependency order, migration map and regression checklist.

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
