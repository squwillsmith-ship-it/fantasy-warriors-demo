# v1.16.0 integration phase 1

This branch does not change the public game's active files. The current browser build is 1.0.14.

## Run the real demo engine locally

From the repository root:

```sh
cd tools/balance
npm install
npx playwright install chromium
npm run check
npm run smoke
npm run candidate
node run.mjs --profile=live --stages=1,2,3,4,5,6,7,8,9,10 --team=knight:2,archer:2,mage:2 --seeds=20 --output=live.json
node run.mjs --profile=candidate --stages=1,2,3,4,5,6,7,8,9,10 --team=knight:2,archer:2,mage:2 --seeds=20 --output=candidate.json
```

The runner launches isolated Chromium contexts, serves the local repository on a temporary loopback port, seeds Math.random, disables real-time animation stepping, queues explicit test teams through the existing balance-lab API, and advances the existing combat engine in 0.05-second ticks through __FW_TEST__.advance. A preflight repeats a seed with different batch sizes and fails on mismatched outcomes. Reports record actual wins/losses/timeouts, elapsed simulation seconds, kills, tower health and casts; no fabricated aggregate combat model.

The candidate JSON is an explicit compatibility subset of manifesto v1.16.0. The local HTTP adapter only injects supported numerical values before game-data.js loads and exposes per-hero charge times. Legacy skill IDs and engine effects remain unchanged; the full new ordinary/Legacy catalogues are data only. The profile is not activated by opening the public site. The runner uses isolated test mode; no normal player save is touched.

## Integration order

1. Validate current and candidate fixed-team actual-engine results. Preserve reproducible baselines and report regressions.
2. Add stable seeded RNG dependency and a proper headless core API; remove rendering/DOM calls from simulation.
3. Implement new shop product engine, protected slots, weighted draws/pity, skin rolls and migration. Test finite stock, reload idempotence, class credit and currency.
4. Implement 228 ordinary purchases, four gateways and 120 Legacy nodes. Replace old 205-node catalogue/effects rather than mixing IDs; migration plan first. Remove prohibited targeting/positioning effects.
5. Implement full hero/elite/boss effects, capture, spells, prestige scaling, mutants and faction. Test triggers, actual source credit, boss transitions, summon ownership and reward IDs.
6. Run seeded end-to-end campaign simulations with actual purchases/prestige/upgrade strategies and compare stage time, upgrades/attempt, rarity droughts, difficulty and five-reset target.
7. Add Endless, records and save/resume after campaign tests; integrate with UI and deploy only after regression checks.

Known compatibility limitations are in the manifest JSON. Do not interpret test-mode fixed teams or partial candidate ability mappings as a fully simulated campaign. Do not infer that all design features are implemented merely because their records exist.

## Merchant integration checkpoint (development only)

The branch now loads merchant.js in the main demo and balance lab. All five pack prices, fifteen class rarities and per-pack odds, eighth-draw protection, finite protected stock, seven product categories, price floors, all twenty merchant unlocks, rerolls/reserves/commission, and automatic deployment are wired. Persistent class discovery and pack draw pity are recorded in the existing skill save, with a committed-attempt marker to avoid counting the same purchased stock twice on reload. The previous save's ordinary/permanent skill data is retained; this branch temporarily uses old coin-cap and slot node effects (capped at 40 coins/six slots), and the new merchant purchase list coexists with the old Legacy rank list. Existing old preparation stock uses a different schema and is not migrated. Combat-active refresh abandons that battle rather than restoring it. Browser storage is required for reliable persistence.

Verified in the current session: source syntax, 4,653 pure merchant assertions, mocked-DOM startup/purchase/reload/deployment/commit-once checks, and ten seconds of the existing combat loop. Repeat with `node merchant.test.mjs` and `node merchant-integration.test.mjs` from tools/balance; browser-level CI results remain unverified. Old numerical combat profile remains active in the public demo. The candidate runner remains a conditional fixed-team balance test; its live/candidate labels now refer to numerical combat profiles, not two different merchant implementations.

Pending: migrate the complete ordinary/Legacy graphs, exact new coin-cap sources and old rank entitlements, skin loot boxes/skin stats and appearance rolls, real battlefield pack-opening presentation, remaining combat mechanics and full-browser validation. Do not deploy until save migration and CI are verified.

## Redesigned tree integration checkpoint

The development branch replaces the old 205-node progression runtime with 228 ordinary purchases (including 30 veteran nodes and 13 spell nodes), the four gateway purchases, 15 class challenges and 120 Legacy tiles. The canonical data is in skill-tree-data.js. The explicit effect registry currently covers 331 of 348 ordinary/Legacy purchase definitions; 329 purchases were reachable in an all-eligible mock-DOM test. Thirteen spell nodes, Hunter resistance-dependent veteran unlock/effect, capture-dependent Lasting Fellowship and faction-dependent Legion Ledger are unavailable pending their mechanics. Two additional registered Hunter nodes remain behind the unavailable prerequisite. Pending nodes must not consume UP or Shards.

Schema 2 migration refunds obsolete ordinary purchases using their recorded purchase costs (or historical configured costs) and old repeatable Legacy ranks using historical rank prices. It preserves currency, current campaign progress, class kills, legitimate merchant nodes, rarity pity and discovery, and keeps the old save locally as a backup. Old stock is intentionally isolated by a new preparation key. The old targeting/positioning effect engine is disabled. New combat hooks and tower projectile mechanics are integrated against the existing combat runtime; exact new base combat values and complete feature interactions require further implementation and calibration.

Verified locally in the current session: merchant regression, 329 reachable purchases, unavailable-node protection, duplicate purchase protection, 40 coin cap, tower bolt parameters, a 30-hero 60-second actual-core mock battle, and one-time migration refunds. The extended test is tools/balance/merchant-integration.test.mjs. This is a smoke test, not proof of numerical balance or correctness of every proc. Full browser CI remains unverified; do not merge/deploy until feature dependencies and regression coverage are complete.
