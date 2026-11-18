# Fantasy Warriors — Playable Demo

**Build 0.5** · **Design manifesto v0.20.0** (18 November 2026)

**Play on iPhone / desktop:** https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/?v=0.5

## New in Build 0.5
- **3 hero units per Recruit Pack**, drawn from Knight, Archer and Mage. Recruit Packs cost 2 coins; 12 coins buys up to six packs / 18 hero units. Demo draws are currently equal weight with duplicates possible, pending the undecided official odds and duplicate rules.
- **15 current hero classes**, excluding retired Warrior. Each uses the exact four provisional core stats from manifesto v0.18.0 (HP, basic-attack damage, attacks/sec, walking speed).
- **15 distinct basic-attack prototypes**: sword strike, straight arrow, AoE fireball, serrated bleed arrow, wide cleave, alternating daggers, hammer AoE patch, three-strike combination, channeled ray, weakening vial throw, vine wave, doom sigil, whip, ramping beam and knockback lunge.
- **Separate Testing Shop**: enable debug mode during preparation, tap any of 15 classes repeatedly to queue individual free heroes (0 coins), clear the queue, and start a test round. Test wins never advance the normal stage; disabling debug mode restores pre-test tower health.
- Displays the five approved pack pools, with provisional unlock stage milestones. The regular shop currently sells only Recruit Packs because later pack pricing and multi-slot offer rules are not yet settled.
- Supports mobile and desktop, including triple-card pack reveals, rings of hero spawn positions and automatic combat.

## Still upcoming
Fourteen selected **special abilities are not yet active in Build 0.5**; ability cooldowns and numeric effects remain to be designed. Nun's special is still unselected. Newly introduced hero ranges, secondary-attack effects, pull probabilities and duplicate rules currently use *clearly labeled demo-only placeholders*, not approved balance values. Normal higher-tier pack offers are not yet available.

## Hosting
Single-file HTML5 game (`index.html`). GitHub Pages deploys from **main / (root)**. Refresh via the versioned play link to bypass cached Safari builds.
