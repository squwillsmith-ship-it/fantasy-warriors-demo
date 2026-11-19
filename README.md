# Fantasy Warriors — Playable Demo

**Build 0.9 · Gameplay Manifesto v1.1.1** (19 November 2026)

**Play:** https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/?v=0.9

## Build 0.9 — Five-tier Skill Tree

- **205 selectable nodes:** Five vertically connected pack-themed tiers (Recruit, Outlaw, Devotion, Occult, Mythic), central spine, five general upgrades per tier, and three individual hero branches with kill challenges, five stats and five technique upgrades each.
- **Mobile-friendly tree interface:** Open **Skill Tree** in the sidebar, pan horizontally between connected lanes, jump to any tier, select a node for its prerequisites and purchase it when eligible.
- **Active progression:** Earn ordinary Upgrade Points (UP) from standard enemy kills and cleared stages, unlock class challenges through minion killing blows, open packs to satisfy pack-opening tasks, and apply upgrades to heroes, tower and shop.
- **Later-tier gates and packs:** Unlock through a large UP payment or sufficient voluntary prestige progress. Tier unlocks also expose the corresponding pack type in regular shop offers. The shop rotates available offers and can expand with upgrades.
- **Legacy resets:** The permanent-upgrade tab offers optional prestige resets and persistent Legacy Shards for permanent HP, damage, Upgrade Point income, coin maximum and shop slots. Saves automatically in local browser storage.
- **Hero techniques:** The selected character branch techniques have test implementations and effect hooks (bleed, crowd control, summons, beam, AoE, defence and targeting). Exact unapproved strengths remain **provisional**.
- **Existing mechanics remain:** 15 hero classes, temporary three-hero packs, ten-stage campaign, distinctive minion/boss identities, 14 timed specials and Necromancer's on-kill summon, collision-aware movement and focused target selection.

## Important provisional choices

The manifesto confirms the five-tier/205-node structure and draft node effects, but it does **not** specify final progression income, higher-tier pack prices, gateway costs or resets. Build 0.9 therefore uses test defaults: **1 UP per 5 minions, 6 UP per cleared stage**, tier gateway payments of **28/48/75/110 UP**, higher-tier pack prices of **3/4/5/6 coins**, and an alternative unlock after **1/2/3/4 voluntary resets**. Current pack-tier coupling, upgrade magnitudes where previously TBD, and Legacy Shard rewards/permanent perk prices are demo decisions, not final approved balance. These may change without altering the basic skill tree design.

## Testing

Open **Skill Tree** during preparation. Earn UP in ordinary battles, return between rounds to purchase upgrades, and unlock hero gates using matching class minion kills. Testing Shop battles remain separate and do not earn permanent progression. Progress is stored in localStorage, on that browser/device; clearing browser site data removes it. The ordinary in-game **Restart run** button preserves saved skill-tree progression, while **Prestige reset** voluntarily clears ordinary upgrade purchases and awards permanent currency.

## Technical

GitHub Pages from `main` / root. Build files: `index.html`, `skill-tree-data.js` (canonical node records), `skill-tree.js` (UI/progression), `skill-tree-effects.js` (combat technique hooks), and `skill-tree.css` (interface). Previous build 0.8 was a single standalone HTML file; Build 0.9 requires all five files. Use the versioned URL above to avoid mobile Safari cache.
