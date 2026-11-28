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

## Spells and hero capture checkpoint

All 13 ordinary spell nodes now unlock their effects. Equipped spells are chosen in preparation and persisted in the current-run save. Lightning, Healing Circle, Frost Field, Ember Rain, dual slots, independent ready-at-start cooldowns, all reviewed numerical upgrades, third-cast half-potency echoes and strongest overlapping zones are integrated. Spell damage is attributed to the player, not a hero class. The shared pointer handler resolves rescue before spells before tower aim; spell targeting preserves aim and has a cancel control and mouse radius preview.

Capture uses the shared battle-actions.js configuration (5 seconds, 10/20 presses, 0.5-second decay delay, 0.5 credits/sec, 1-second rescue invulnerability). Original heroes enter downed state at zero HP; basic non-generated minion captors stop movement and attacks. Independent concurrent captures, no third rescue, charge preservation, invulnerability, captor-death release, timer expiry, pause and round cleanup are wired. Implementation choice for undefined cases: boss, elite or indirect lethal damage creates a rescue window without binding a captor; summoned allies are not rescuable. The existing prototype uses a generic capture glyph/bar and a selected-capture text readout, not the ten authored family animations or final portrait/armour art. Lasting Fellowship grants the reviewed class-removal bonus. No upgrades to rescue mechanics.

Validation executed: 69 standalone spell/capture assertions; real-core mocked-DOM purchase/loadout/capture/pause/invulnerability tests; previous merchant and all-class smoke checks; 343 reachable upgrades, 345 effect registry entries. Three definitions remain locked (Hunter resistance-dependent veteran unlock/effect and Legion Ledger); two further Hunter purchases are blocked by prerequisite. Full browser, mobile input, and exhaustive combat/proc balance testing remain outstanding. Public main branch unchanged.

## Prestige enemy integration checkpoint

Prestige HP/damage ×1.08^p, movement/attack rate ×1.02^p are applied once at spawn, including boss phases, and mutation doubles HP/damage without changing speed or cadence. Wave plans implement the elite unlock/age schedule, first-ever attempt protection, mid/late placement, live caps, mutation replacement slots and the increasing Hollow Legion invasion schedule. All ten elite types are wired, including decoys, healing, theft, tower charges, fire patches, mind control, Hellhound melee, bone-pile skeletons, backstab and displacement. Three faction encounters run sequentially with 2-second intermissions before the stage boss. Voidling resistance and the Hunter resistance-piercing effect are implemented; Legion Ledger awards the additional faction UP. A mutation/faction kill saves its reward once per committed attempt, with no cap on legitimate repeat attempts, and test mode never grants progression. Thief deduction applies on next preparation with affordable Recruit price as the floor. Faction rewards do not count toward class kills or scheduled minion UP.

Verified in-session: 8,680 deterministic schedule/stat assertions (620 wave plans, prestige 0–30, all stages with/without protection); 348 reachable purchases; previous merchant, migration, capture and spell checks; full scripted prestige-5 Stage 2 combat-core wave with 56 scheduled enemies, 9 elites, 2 mutants and Champion → Sorcerer → Executioner → stage boss; persistent reward accounting, duplicate suppression, test exclusions, and theft floor. Scripted defeats test sequence, not actual combat difficulty. Run `node prestige-enemies.test.mjs` and `node merchant-integration.test.mjs`. Browser lab now accepts `node run.mjs --profile=candidate --prestige=5 --stages=2,4,10 --seeds=10` and optional `--first-attempt=true`.

The current dev default still uses the historical numerical combat profile; the candidate runner uses the staged 1.16 numerical subset. Elite signature values/telegraphs and actor art are prototype implementations. Remaining main boss signature mechanics, skin integration, complete numerical/proc audits, browser/mobile CI validation, real campaign simulations and Endless integration remain outstanding. Existing active-battle reload abandons the battle; rewards already committed survive, not a combat checkpoint. The scheduler clamps extremely large prestige inputs to 1000 for finite arithmetic; test control caps at 100. Public main remains untouched.
