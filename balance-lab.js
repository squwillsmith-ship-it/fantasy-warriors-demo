/* Fantasy Warriors Balance Lab: same full simulation, simplified controls. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const api = window.__FW_LAB_API__;
  const data = window.FWGameData;
  if (!api || !data) {
    const message = $('labStatus');
    if (message) message.textContent = 'Balance Lab failed to initialize. Refresh this page.';
    return;
  }
  const spawn = data.SPAWN_CONFIG;
  const defaults = {
    regularWaveBase: spawn.regularWaveBase,
    regularWavePerStage: spawn.regularWavePerStage,
    normalInterval: spawn.normalInterval,
    ramp: spawn.normalRateRampFactor,
    towerHP: data.BALANCE.economy.startingTowerHP
  };
  const history = [];
  let pendingRun = null;
  let lastRecorded = false;
  let runNumber = 0;
  window.__FW_LAB_SPEED__ = 1;
  api.prepare();

  const num = (v, min, max, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };
  const stageDefaultWave = stage => defaults.regularWaveBase + defaults.regularWavePerStage * (stage - 1);
  const humanTime = seconds => {
    const t = Math.max(0, Math.floor(seconds || 0));
    return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
  };
  const setStatus = message => { $('labStatus').textContent = message; };
  const heroInputs = new Map();

  for (const [i, e] of data.ENCOUNTERS.entries()) {
    const option = document.createElement('option');
    option.value = String(i + 1);
    option.textContent = 'Stage ' + (i + 1) + ' · ' + e.name;
    $('labStage').append(option);
  }

  const heroHost = $('labHeroes');
  for (const [i, pack] of data.PACKS.entries()) {
    const details = document.createElement('details');
    details.className = 'lab-tier';
    details.open = i === 0;
    const summary = document.createElement('summary');
    summary.textContent = pack.name + ' pack · ' + data.HEROES.filter(h => h.pack === i).length + ' classes';
    details.append(summary);
    for (const hero of data.HEROES.filter(h => h.pack === i)) {
      const row = document.createElement('div');
      row.className = 'lab-hero';
      const icon = document.createElement('span');
      icon.className = 'lab-glyph';
      icon.textContent = hero.glyph;
      const name = document.createElement('span');
      name.className = 'lab-hero-name';
      name.textContent = hero.name;
      name.style.color = hero.color;
      const minus = document.createElement('button');
      minus.type = 'button'; minus.className = 'lab-minus'; minus.textContent = '−';
      minus.setAttribute('aria-label', 'Remove one ' + hero.name);
      const plus = document.createElement('button');
      plus.type = 'button'; plus.className = 'lab-plus'; plus.textContent = '+';
      plus.setAttribute('aria-label', 'Add one ' + hero.name);
      const count = document.createElement('input');
      count.type = 'number'; count.min = '0'; count.max = '40'; count.step = '1';
      count.inputMode = 'numeric'; count.value = '0';
      count.setAttribute('aria-label', hero.name + ' count');
      const change = v => { count.value = String(num(Math.round(v), 0, 40, 0)); updateHeroCount(); };
      minus.addEventListener('click', () => change(Number(count.value) - 1));
      plus.addEventListener('click', () => change(Number(count.value) + 1));
      count.addEventListener('change', () => change(Number(count.value)));
      heroInputs.set(hero.id, count);
      row.append(icon, name, minus, count, plus);
      details.append(row);
    }
    heroHost.append(details);
  }

  function updateHeroCount() {
    let total = 0;
    heroInputs.forEach(input => { total += num(Math.floor(Number(input.value)), 0, 40, 0); });
    $('labHeroTotal').textContent = total + ' selected';
  }
  function setTeam(team) {
    heroInputs.forEach((input, id) => { input.value = String(team[id] || 0); });
    updateHeroCount();
  }
  function applyPreset(preset) {
    if (preset === 'solo') setTeam({ knight: 1 });
    else if (preset === 'trio') setTeam({ knight: 1, archer: 1, mage: 1 });
    else if (preset === 'mixed') setTeam({ knight: 2, archer: 2, mage: 2, hunter: 1, paladin: 1 });
    else if (preset === 'empty') setTeam({});
    else setTeam({ knight: 2, archer: 1, mage: 1 });
  }
  $('labPreset').addEventListener('change', () => applyPreset($('labPreset').value));

  $('labStage').addEventListener('change', () => {
    const stage = Number($('labStage').value);
    $('labWave').value = String(stageDefaultWave(stage));
    if (api.snapshot().mode === 'prep') api.setStage(stage);
  });

  function applySettings() {
    const stage = num(Math.round(Number($('labStage').value)), 1, 10, 1);
    spawn.regularWaveBase = num(Math.round(Number($('labWave').value)), 1, 2000, stageDefaultWave(stage));
    spawn.regularWavePerStage = 0;
    spawn.normalInterval = num($('labSpawn').value, .1, 30, defaults.normalInterval);
    spawn.normalRateRampFactor = num($('labRamp').value, 0, 10, defaults.ramp);
    api.setStage(stage);
    api.setTowerHP(num($('labTower').value, 1, 100000, defaults.towerHP));
  }
  function prepare() {
    api.prepare();
    applySettings();
    lastRecorded = false;
    pendingRun = null;
    setStatus('Ready. Edit the settings and start a battle.');
    updateMetrics();
  }
  function startBattle() {
    api.prepare();
    applySettings();
    api.clearQueue();
    const team = [];
    for (const [id, input] of heroInputs.entries()) {
      const count = num(Math.floor(Number(input.value)), 0, 40, 0);
      if (count > 0) {
        api.queueHero(id, count);
        team.push(id + ' x' + count);
      }
    }
    const stage = Number($('labStage').value);
    const snapshot = api.snapshot();
    pendingRun = {
      stage, team: team.join('; '), wave: snapshot.regularTotal,
      spawnInterval: spawn.normalInterval, ramp: spawn.normalRateRampFactor,
      speed: window.__FW_LAB_SPEED__, towerMax: snapshot.towerMax
    };
    lastRecorded = false;
    runNumber++;
    api.start();
    setStatus('Battle ' + runNumber + ' running at ' + window.__FW_LAB_SPEED__ + '×.');
    updateMetrics();
  }

  $('labStart').addEventListener('click', startBattle);
  $('labRetry').addEventListener('click', startBattle);
  $('labPrepare').addEventListener('click', prepare);
  $('labApply').addEventListener('click', () => {
    if (api.snapshot().mode !== 'prep') api.prepare();
    applySettings();
    setStatus('Wave settings applied. The next battle will use these values.');
    updateMetrics();
  });
  $('labPause').addEventListener('click', () => {
    api.pause();
    updateMetrics();
  });
  $('labSpeed').addEventListener('change', () => {
    window.__FW_LAB_SPEED__ = num($('labSpeed').value, .25, 100, 1);
    setStatus('Playback speed: ' + window.__FW_LAB_SPEED__ + '×. Combat rules are unchanged.');
  });

  function renderHistory() {
    const el = $('labHistory');
    el.replaceChildren();
    if (!history.length) {
      const p = document.createElement('div');
      p.className = 'lab-empty';
      p.textContent = 'No completed battles yet.';
      el.append(p);
      return;
    }
    history.slice().reverse().forEach(row => {
      const line = document.createElement('div');
      line.textContent = '#' + row.run + ' · S' + row.stage + ' · ' +
        (row.outcome === 'clear' || row.outcome === 'champion' ? 'WIN' : 'LOSS') +
        ' · ' + humanTime(row.seconds) + ' · ' + row.kills + '/' + row.wave + '+boss kills';
      el.append(line);
    });
  }
  function recordFinish(s) {
    if (!pendingRun || lastRecorded) return;
    if (s.mode !== 'clear' && s.mode !== 'over' && s.mode !== 'champion') return;
    const result = {
      run: runNumber, ...pendingRun, outcome: s.mode,
      seconds: Number(s.elapsed.toFixed(2)), kills: s.kills,
      towerLeft: Number(s.towerHP.toFixed(2)), abilityCasts: s.specialCasts
    };
    history.push(result);
    lastRecorded = true;
    setStatus((s.mode === 'over' ? 'Defeat' : 'Victory') + ' after ' + humanTime(s.elapsed) +
      ' of combat. Results saved for export.');
    renderHistory();
  }
  function updateMetrics() {
    const s = api.snapshot();
    $('labTime').textContent = humanTime(s.elapsed);
    $('labLiving').textContent = String(s.heroesAlive) + '/' + String(s.heroesTotal);
    $('labEnemies').textContent = String(s.enemiesAlive);
    $('labKills').textContent = String(s.kills) + '/' + String(s.regularTotal + 1);
    $('labPause').disabled = s.mode !== 'battle';
    $('labPause').textContent = s.paused ? '▶ Resume' : 'Ⅱ Pause';
    $('labStart').textContent = s.mode === 'battle' ? '↻ Restart battle' : '⚔ Start battle';
    recordFinish(s);
  }

  // Shareable snapshot: include effective base stats AND locally saved edits.
  // Reading the input fields means no need to restart a battle just to copy the setup.
  function currentBalanceSetup() {
    const stage = num(Math.round(Number($('labStage').value)), 1, 10, 1);
    const overrides = window.FWQuickStats?.snapshot?.() || {heroes:{}, minion:{}, boss:{}};
    const configuredTeam = {};
    for (const [id, input] of heroInputs.entries()) {
      const count = num(Math.floor(Number(input.value)), 0, 40, 0);
      if (count > 0) configuredTeam[id] = count;
    }
    const heroStats = {};
    for (const hero of data.HEROES) {
      const effective = {...hero, ...(overrides.heroes?.[hero.id] || {})};
      heroStats[hero.id] = {
        name:hero.name, hp:effective.hp, damage:effective.damage,
        attacksPerSecond:effective.speed, movementSpeed:effective.walk,
        attackRange:effective.range
      };
    }
    const minionStats = {
      hp: spawn.normalHp, damage: spawn.minionDamage,
      movementSpeed: spawn.minionSpeed, attackPeriod: spawn.minionAttackPeriod,
      firstHitDelay: spawn.minionFirstAttackWindup
    };
    const savedMinion = overrides.minion || {};
    Object.assign(minionStats, Object.fromEntries(
      Object.entries(savedMinion).map(([key,value]) =>
        [({speed:'movementSpeed',firstDelay:'firstHitDelay'})[key] || key, value])
    ));
    const bossStatsByStage = {};
    for (let i=1; i<=data.ENCOUNTERS.length; i++) {
      const effective = {
        hp: Math.round((spawn.bossHpBase + spawn.bossHpPerStage * (i-1)) / spawn.bossHpDivisor),
        damage: spawn.bossDamage,
        movementSpeed: spawn.bossSpeed,
        attackPeriod: spawn.bossAttackPeriod
      };
      for (const [key,value] of Object.entries(overrides.boss?.[i] || {}))
        effective[key==='speed'?'movementSpeed':key] = value;
      bossStatsByStage[i] = {boss:data.ENCOUNTERS[i-1].boss, ...effective};
    }
    return {
      format:'fantasy-warriors-balance-lab/v1',
      balanceProfile:data.BALANCE.profileId,
      encounter:{stage,name:data.ENCOUNTERS[stage-1].name},
      playbackSpeed:Number($('labSpeed').value),
      towerHP:num($('labTower').value,1,100000,defaults.towerHP),
      wave:{
        minions:num(Math.round(Number($('labWave').value)),1,2000,stageDefaultWave(stage)),
        initialSpawnIntervalSeconds:num($('labSpawn').value,.1,30,defaults.normalInterval),
        spawnRateRampExtraFactor:num($('labRamp').value,0,10,defaults.ramp)
      },
      heroTeam:configuredTeam,
      heroStats,
      minionStats,
      bossStatsByStage,
      combatTuning:{...data.TUNING.shared},
      savedStatOverrides:overrides,
      recentBattleResults:history.slice(-10)
    };
  }
  function makeShareText() { return JSON.stringify(currentBalanceSetup(), null, 2); }
  function revealShareText() {
    const preview=$('labSettingsPreview');
    preview.value=makeShareText();
    preview.hidden=false;
    $('labShowSettings').setAttribute('aria-expanded','true');
    $('labShowSettings').textContent='Hide preview';
    return preview;
  }
  $('labShowSettings').addEventListener('click', () => {
    const preview=$('labSettingsPreview');
    if (!preview.hidden) {
      preview.hidden=true;
      $('labShowSettings').textContent='Preview';
      $('labShowSettings').setAttribute('aria-expanded','false');
    } else revealShareText();
  });
  $('labCopySettings').addEventListener('click', async () => {
    const text=makeShareText();
    const feedback=$('labCopyFeedback');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(text);
      feedback.textContent='✓ Copied! Paste it into this chat.';
    } catch (_) {
      const preview=revealShareText();
      preview.focus(); preview.select();
      let copied=false;
      try { copied=document.execCommand('copy'); } catch (_) {}
      feedback.textContent=copied
        ? '✓ Copied! Paste it into this chat.'
        : 'Automatic copy is unavailable. The settings are selected below; use Copy, then paste them here.';
    }
  });

  $('labExport').addEventListener('click', () => {
    if (!history.length) return setStatus('Complete a battle before exporting.');
    const columns = ['run', 'stage', 'team', 'wave', 'spawnInterval', 'ramp', 'speed', 'towerMax', 'outcome', 'seconds', 'kills', 'towerLeft', 'abilityCasts'];
    const escapeCSV = value => '"' + String(value == null ? '' : value).replace(/"/g, '""') + '"';
    const csv = [columns.join(','), ...history.map(r => columns.map(key => escapeCSV(r[key])).join(','))].join('\r\n');
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'fantasy-warriors-balance-results.csv';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setStatus('Exported ' + history.length + ' battle result(s) to CSV.');
  });
  $('labDefaults').addEventListener('click', () => {
    api.prepare();
    $('labStage').value = '1';
    $('labWave').value = String(stageDefaultWave(1));
    $('labSpawn').value = String(defaults.normalInterval);
    $('labRamp').value = String(defaults.ramp);
    $('labTower').value = String(defaults.towerHP);
    $('labPreset').value = 'starter';
    applyPreset('starter');
    $('fwStatResetAll')?.click();
    applySettings();
    setStatus('Restored default wave and hero settings. Lab stat reset uses a confirmation.');
  });

  const statPanel = $('fwQuickStats');
  if (statPanel) $('labStatsHost').append(statPanel);
  $('labWave').value = String(stageDefaultWave(1));
  $('labSpawn').value = String(defaults.normalInterval);
  $('labRamp').value = String(defaults.ramp);
  $('labTower').value = String(defaults.towerHP);
  applyPreset('starter');
  applySettings();
  renderHistory();
  updateMetrics();
  setInterval(updateMetrics, 170);
})();