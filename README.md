# Fantasy Warriors — Playable Demo

**Build 0.6 · Master Gameplay Manifesto v0.22.1** (18 November 2026)

**Play in Safari or desktop:** https://squwillsmith-ship-it.github.io/fantasy-warriors-demo/?v=0.6

## Build 0.6
- **15 heroes** retain approved HP, attack speed and walk speed. All basic attack damage is **10× lower** per v0.21.0, including fractional damage for Rogue (0.8) and Necromancer (4.2).
- **Tower-defender AI:** heroes detect new enemies within **4** map units, patrol/return around their own starting positions and stay within **5** map units of the tower. Enemy hero-detection stays at **6**.
- **13 time-charged special abilities are functional**, automatically charging over a provisional **10-second** default and activating only when the situation makes sense. Ready charge holds until the ability can activate. Includes Shield Bash, Arrow Volley, Chain Bolt, Tripwire Trap, Battle Frenzy, Smoke Bomb, Divine Aegis, Blessing of Courage, Spirit Totem, Bear Form, Life Siphon, Summon Hound and Dragon Breath.
- **Necromancer** has a genuinely continuous Soul Sucking Beam, with baseline **4.2 × 0.50 = 2.1 DPS** and a tunable ramp while maintaining a target. Its separate **Raise the Fallen** special automatically reanimates **each qualifying non-boss enemy death** while at least one Necromancer lives. This event is **not** governed by a cooldown or chance.
- **Nun's special remains unselected**; no extra ability is invented for her.
- New **special-cast HUD**, charge progress on each hero, active ability effects, and a **Testing Shop tuning panel** for acquisition range, guard radius and shared charge time. Detailed per-hero effect parameters live in `window.__FW_TUNING__` for playtesting and are *explicitly provisional*.
- Existing roster, 3-unit Recruit Packs (2 coins), 12-coin round budget/refill, five pack-type pools, separate free Testing Shop, stage bosses and same-stage retries remain.

## Playtest verification
Checked mobile-sized and desktop browsers, pack opening, direct Testing Shop selection, timed special activation, charged versus ready states, Dragon Breath, Necromancer sustained beam, and raising a new undead for every qualifying enemy death. All checks were browser-local; GitHub Pages publication can lag behind the repository commit.

## Still undefined in manifesto
Higher-tier pack prices and shop-slot offer rules; Nun's special; exact future ability cooldowns/damage/durations, many new-hero attack ranges, summon/totem stats and other tuning; permanent upgrades; rarity rebalance and later progression systems. Current effect figures are transparent **demo-only settings**, not final game balance.

## Hosting
One standalone `index.html` file. GitHub Pages publishes from `main` / `(root)`; the `?v=0.6` link avoids stale mobile caching.
