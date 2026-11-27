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
