/* Fantasy Warriors — Arcade pacing and simple hero decisions (Build 1.0.11).
   Pure functions: portable to balance simulations and later Godot migration. */
(function () {
  'use strict';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  // Spawn RATE ramps linearly across each wave. A factor of 2 is 1x -> 3x,
  // i.e. the time between individual spawns falls from 2.0 s to ~0.67 s.
  function spawnInterval(baseSeconds, extraRateFactor, alreadySpawned, totalMinions) {
    const progress = clamp((alreadySpawned - 1) / Math.max(1, totalMinions - 2), 0, 1);
    return baseSeconds / (1 + extraRateFactor * progress);
  }
  function heroPosition(existing, worldW, worldH, config, random = Math.random, radius = .35) {
    const min = config.heroSpawnRadiusMin;
    const max = min * config.heroSpawnRadiusMultiplier;
    const separation = config.heroSpawnSeparation;
    const margin = radius + .2;
    let best = null;
    for (let attempt = 0; attempt < 80; attempt++) {
      const angle = random() * 2 * Math.PI;
      // Uniform over area, not biased toward the tower.
      const distance = Math.sqrt(min * min + random() * (max * max - min * min));
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      if (Math.abs(x) >= worldW / 2 - margin || Math.abs(y) >= worldH / 2 - margin) continue;
      const edgeX = Math.max(0, Math.abs(x) - 1.00);
      const edgeY = Math.max(0, Math.abs(y) - 1.00);
      if (Math.hypot(edgeX, edgeY) <= radius + .025) continue; // Solid tower footprint
      const nearest = existing.reduce((d, h) => Math.min(d, Math.hypot(x - h.x, y - h.y)), Infinity);
      if (!best || nearest > best.nearest) best = { x, y, distance, angle, nearest };
      if (nearest >= separation) return { x, y, distance, angle };
    }
    // Dense test armies can use the most separated valid candidate.
    // On a tiny battlefield where no candidate fits, place at a safe inner point.
    if (best) return { x: best.x, y: best.y, distance: best.distance, angle: best.angle };
    return { x: min, y: 0, distance: min, angle: 0 };
  }
  function nearestFrontTarget(hero, enemies, acquire, guard, range, bonus = () => 0) {
    const forwardX = Math.sin(hero.facing ?? Math.PI / 2);
    const forwardY = -Math.cos(hero.facing ?? Math.PI / 2);
    let front = null, frontDistance = Infinity;
    let nearest = null, nearestDistance = Infinity;
    for (const e of enemies) {
      if (!e || e.hp <= 0) continue;
      const dx = e.x - hero.x, dy = e.y - hero.y;
      const distance = Math.hypot(dx, dy);
      if (distance > acquire || Math.hypot(e.x, e.y) > guard + Math.max(1, range)) continue;
      // Skill-specific focus perks remain a mild distance adjustment,
      // rather than introducing tower urgency, enemy crowd or class heuristics.
      const adjusted = Math.max(0, distance - Math.min(1, Math.max(0, bonus(e) || 0)) * .35);
      if (adjusted < nearestDistance) { nearest = e; nearestDistance = adjusted; }
      if (dx * forwardX + dy * forwardY >= -0.00001 && adjusted < frontDistance) {
        front = e; frontDistance = adjusted;
      }
    }
    return front || nearest;
  }
  window.FWArcade = { spawnInterval, heroPosition, nearestFrontTarget };
})();
