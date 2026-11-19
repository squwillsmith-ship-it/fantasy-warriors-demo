# Fantasy Warriors — Playable Demo

**Build 0.8 · Gameplay Manifesto v1.1.0** (19 November 2026)

**Play:** https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/?v=0.8

## Build 0.8 — Spatial Combat
- **Collision-aware actors:** separate hero, enemy and boss footprints; local grid neighbour resolution keeps units apart without moving the tower.
- **Solid tower for enemies too:** enemy pathing now routes around the tower's perimeter to an outside attack position. Multiple enemies approach different positions.
- **Melee engagement slots:** defenders reserve positions around enemies instead of attempting to occupy the same spot.
- **Ranged standoff:** archers and spellcasters retain attack range but avoid crowding into melee.
- **Stable target assignment:** staggered decisions every ~0.25 seconds, threat scoring, soft overfocus penalties and target commitment rather than per-frame nearest-only changes.
- **Approach braking and simple attack phases:** smooth steering, brief wind-ups and cosmetic hit flashes, without altering approved base attack values.
- **All previously implemented systems retained:** 15 class stats, 14 timed specials and Necromancer's event-driven summoning, testing shop, 3-hero Recruit Packs, 10-stage encounters and coin refill.

## Testing
Browser-tested at 390px and 1280px. Six Recruit Packs deployed 18 units. Stage 1 enemy progression produced no JavaScript exceptions, tower clipping or persistent overlapping centres in the automated scenarios. Stage 10 with 18 all-melee test heroes and dense enemies also produced no script errors or tower clipping.

## Remaining design work
The proposed 205 skill nodes, prestige gateway cost/persistence rules, higher-tier shop offers, individual boss mechanics, and many numeric ability effects remain unapproved for playable implementation. Combat AI thresholds are **editable demo-only defaults**, not locked game balance.

## Hosting
One self-contained `index.html` file, published via GitHub Pages from `main` / `(root)`. Use the versioned URL above to avoid mobile Safari cache.
