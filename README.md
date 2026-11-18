# Fantasy Warriors — Playable Demo

**Build 0.7 · Master Gameplay Manifesto v1.0.1** (19 November 2026)

**Play (iPhone and desktop):** https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/?v=0.7

## New in Build 0.7
- **Updated 15-hero balance:** all hero core HP values HALVED and base basic-attack damages DOUBLED from the v0.21.0 baseline, preserving fractional stats. Walk speed and attacks/second are unchanged.
- **Nun — Sanctuary Prayer:** the previously missing 14th auto-charged special. When charged and a nearby allied hero needs healing, she creates a temporary healing circle centred on herself. It restores health gradually while the affected ally stays inside. Radius, duration and healing rate are tunable **demo placeholders**, not final specifications. Does not heal the tower, and overlapping circles currently do not stack.
- **Necromancer beam** starts at **8.4 damage × 0.50 attacks/sec = 4.2 HP/sec**, before its existing configurable ramp.
- **Exactly 10 stages**, ending with campaign completion after Stage 10. The ten stage minion/boss identity pairs follow the Master Manifesto. Stages 1–3 are selected identities; 4–10 are provisional. They have distinct names, colors and glyphs. Until individual combat patterns are approved, they share the explicit generic provisional enemy/boss combat values and spawning formula.
- **Five-tier skill tree structure preview**: a read-only vertical tree with hero branches, general branches and proposed gateways. It does **not** charge currencies, unlock upgrades or perform prestige resets, because costs, effects, persistence and gateway rules remain drafts.
- **Testing Shop stage selector:** playtest any of the 10 stage rosters with any free hero combination without changing the normal campaign stage when testing mode is disabled.
- Updated the stage HUD, fight log and hero reveal stat cards. Existing mobile controls, three-unit Recruit Packs, 12-coin refill economy, tower-defence AI, stage retries and other 13 specials remain.

## Current limitations
The specific 205 candidate skill nodes and four dual-route gateways remain **proposals only**; ordinary upgrade-currency earnings and prestige reset formulas are not settled. Advanced pack prices, shop offer rotation, class draw odds and more are undecided, so normal purchases still offer the Recruit Pack only. Unique boss combat mechanics and per-stage balance are not final. These planned mechanics are **not** falsely marked playable.

## Testing performed
In-browser mobile checks verified six purchased Recruit Packs revealing 18 units, all 15 updated core hero statistics, Nun's auto-charge/READY and heal-over-time behaviour, debug-only Stage 10 selection, and campaign completion / restart without advancing to Stage 11. No JavaScript exceptions were detected.

## Hosting
Standalone HTML5 file (`index.html`). GitHub Pages publishes from `main` / `(root)`. Use the versioned URL above to bypass stale Safari caches.
