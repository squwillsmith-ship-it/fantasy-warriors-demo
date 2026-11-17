# Fantasy Warriors — Playable Demo

**Build 0.3** · Master Gameplay Manifesto **v0.7.0** (17 November 2026)

Play: https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/?v=0.3

## Build 0.3 changes
- Battlefield is 150% wider and taller (2.25× area), with unchanged tower size.
- Heroes move 20% faster (1.8 map units/sec) and navigate around the solid tower.
- Enemies detect and pursue living heroes within 6 map units, instead of always heading straight for the tower.
- Failed stages can be retried without losing the stage number; tower health resets to 100 HP.
- Provisional economy safety net on retries: keep coins earned, with a minimum of 30 coins to avoid being stuck without a purchasable hero pack. This is not an approved long-term economy rule.
- Fixed short-health-bar rendering on narrow mobile screens after the battlefield expansion.

## Existing gameplay
Buy up to three 10-coin packs before each stage. Packs open when combat begins, revealing one of five fixed-rarity heroes. Heroes fight automatically. Stage 1 has 30 regular enemies and a boss; later stages increase by 10 regular enemies each.

Deploy GitHub Pages from `main` / `(root)`. No dependencies or build step.

Not yet specified: permanent upgrades, hero abilities, long-term economy and progression balancing.
