# Fantasy Warriors — Playable Demo

Current build: **0.2**, based on **Master Gameplay Manifesto v0.6.0** (17 November 2026).

Play on GitHub Pages: https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/

## Build 0.2
- Packs are purchased before combat but open only after pressing **Start Stage**, with one hero per pack.
- Heroes move autonomously toward enemies. Knight and Warrior are melee fighters (1-unit reach); Archer, Priest and Mage are ranged.
- Stage 1 has **30** standard enemies and 1 boss; later stages add **10** standard enemies each.
- Standard enemies spawn every second; the boss arrives 2 seconds after the last normal enemy.
- Mobile HUD updates are throttled for smoother performance.

## How to play
Buy up to three 10-coin hero packs before starting a stage. Press **Start Stage** to open them. Reveal each hero, then defend the tower. Heroes fight automatically; you can pause or restart anytime.

No backend, dependencies or build step. Deploy `index.html` at repository root with GitHub Pages configured as **main / (root)**.

**Not yet implemented:** upgrades, retries and permanent progression, special hero abilities, permanent tower-health design. These remain open in the manifesto.
