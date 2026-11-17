# Fantasy Warriors — Playable Demo

**Build 0.4** · **Design manifesto v0.9.0** (17 November 2026)

**Play on iPhone / desktop:** https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/?v=0.4

## What's new
- **12-coin maximum**, starting each attempt with 12 coins.
- Basic Hero Packs cost **2 coins each** and have no fixed purchase-count limit: buy as many as you can afford (currently six per attempt).
- First shop offer is reusable and has unlimited stock; two future offer slots are shown locked, pending an approved upgrade system.
- After **every win or loss**, the next preparation phase refills to your full coin capacity.
- Enemy kills and stage completions **do not currently grant extra coins**; prior combat rewards are superseded.
- Your stage number is kept on failure, and tower health resets to 100 on retry.
- Heroes, combat behavior, rarity odds and enemy counts follow earlier versions.

## Playing
Choose packs in the shop, press **Start Stage**, and reveal each purchased hero. They then fight automatically. Survive 30 regular enemies plus the boss in Stage 1; each new stage adds 10 regular enemies. Retry the same stage after defeat.

## Pending design
Shop-slot unlock costs, other pack offers, permanent coin-cap upgrades, hero special abilities and the future combat-reward economy aren't designed yet; none are simulated as unlocked features.

## Hosting
Single-file HTML5 app (`index.html`); GitHub Pages publishes from **main / (root)**. Refresh Safari with the `?v=0.4` link to bypass cached builds.
