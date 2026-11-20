/* Build 1.0.9 — independent, local-only basic stat editor for Testing Shop battles. */
(function () {
  'use strict';
  const { HEROES, SPAWN_CONFIG, ENCOUNTERS } = window.FWGameData;
  const KEY = 'fw.quick.stats.1';
  const HERO_FIELDS = [
    { key: 'hp', label: 'Health (HP)', min: 1, max: 10000, step: 1 },
    { key: 'damage', label: 'Basic hit damage', min: 0.05, max: 10000, step: 0.1 },
    { key: 'speed', label: 'Attacks per second', min: 0.05, max: 20, step: 0.05 },
    { key: 'walk', label: 'Movement speed', min: 0.05, max: 30, step: 0.05 },
    { key: 'range', label: 'Basic attack range', min: 0.1, max: 30, step: 0.1 }
  ];
  const ENEMY_FIELDS = [
    { key: 'hp', label: 'Health (HP)', min: 1, max: 100000, step: 1 },
    { key: 'damage', label: 'Attack damage', min: 0, max: 10000, step: 0.5 },
    { key: 'speed', label: 'Movement speed', min: 0.05, max: 30, step: 0.05 },
    { key: 'attackPeriod', label: 'Seconds between hits', min: 0.05, max: 30, step: 0.05 }
  ];
  const MINION_FIELDS = [...ENEMY_FIELDS, { key: 'firstDelay', label: 'First-hit delay (seconds)', min: 0, max: 30, step: 0.05 }];
  const cloneEmpty = () => ({ heroes: {}, minion: {}, boss: {} });
  const heroDefaults = Object.fromEntries(HEROES.map(hero => [hero.id, Object.fromEntries(HERO_FIELDS.map(field => [field.key, hero[field.key]]))]));
  const minionDefaults = { hp: SPAWN_CONFIG.normalHp, damage: 4, speed: 1, attackPeriod: 1, firstDelay: SPAWN_CONFIG.minionFirstAttackWindup };
  const bossDefaults = stage => ({
    hp: Math.round((SPAWN_CONFIG.bossHpBase + SPAWN_CONFIG.bossHpPerStage * (stage - 1)) / 2),
    damage: 10, speed: 0.7, attackPeriod: 1
  });
  const valid = (value, field) => typeof value === 'number' && Number.isFinite(value) &&
    value >= field.min && value <= field.max;
  const sanitized = (source, fields) => {
    const out = {};
    if (!source || typeof source !== 'object' || Array.isArray(source)) return out;
    for (const field of fields) if (valid(source[field.key], field)) out[field.key] = source[field.key];
    return out;
  };
  let overrides = cloneEmpty();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && typeof raw === 'object') {
      for (const h of HEROES) overrides.heroes[h.id] = sanitized(raw.heroes?.[h.id], HERO_FIELDS);
      overrides.minion = sanitized(raw.minion, MINION_FIELDS);
      for (let stage = 1; stage <= ENCOUNTERS.length; stage++) {
        overrides.boss[stage] = sanitized(raw.boss?.[stage], ENEMY_FIELDS);
      }
    }
  } catch (_) { /* Storage may be unavailable in private browsing. Defaults are safe. */ }

  const heroForBattle = base => ({ ...base, ...(overrides.heroes[base.id] || {}) });
  const enemyForBattle = (stage, boss) => {
    if (!boss) return { ...minionDefaults, ...overrides.minion };
    return { ...bossDefaults(stage), ...(overrides.boss[stage] || {}) };
  };
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(overrides)); }
    catch (_) { /* Editable for this session even without storage access. */ }
  }

  let state = null, log = () => {}, panel = null;
  let kindEl, heroEl, stageEl, fieldsEl, messageEl, heroChooser, stageChooser, applyEl, resetEl, allEl;
  const $ = id => document.getElementById(id);
  const selectedStage = () => Math.max(1, Math.min(ENCOUNTERS.length, Number(stageEl?.value) || state?.stage || 1));
  const selectedHero = () => HEROES.find(h => h.id === heroEl?.value) || HEROES[0];
  const selectedKind = () => kindEl?.value || 'hero';
  const currentFields = () => selectedKind() === 'hero' ? HERO_FIELDS : selectedKind() === 'minion' ? MINION_FIELDS : ENEMY_FIELDS;
  function defaults() {
    const kind = selectedKind();
    return kind === 'hero' ? heroDefaults[selectedHero().id] : kind === 'minion' ? minionDefaults : bossDefaults(selectedStage());
  }
  function current() {
    const kind = selectedKind();
    if (kind === 'hero') return { ...defaults(), ...(overrides.heroes[selectedHero().id] || {}) };
    if (kind === 'minion') return { ...minionDefaults, ...overrides.minion };
    return enemyForBattle(selectedStage(), true);
  }
  function notice(text, error = false) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.style.color = error ? '#ffb6a7' : '#b6edcf';
  }
  function populate() {
    if (!panel) return;
    const kind = selectedKind();
    heroChooser.hidden = kind !== 'hero';
    stageChooser.hidden = kind !== 'boss';
    const values = current();
    fieldsEl.replaceChildren();
    for (const field of currentFields()) {
      const label = document.createElement('label');
      label.textContent = field.label;
      const input = document.createElement('input');
      input.type = 'number';
      input.inputMode = 'decimal';
      input.min = String(field.min);
      input.max = String(field.max);
      input.step = String(field.step);
      input.dataset.stat = field.key;
      input.value = String(values[field.key]);
      label.append(input);
      fieldsEl.append(label);
    }
    notice('Changes apply to the next TEST battle only. They do not change normal progression.');
    sync();
  }
  function editable() { return !!state?.testMode && state.mode === 'prep'; }
  function sync() {
    if (!panel) return;
    const disabled = !editable();
    for (const control of panel.querySelectorAll('input, select, button')) control.disabled = disabled;
    if (disabled) notice('Open testing mode during preparation to edit test stats.');
  }
  function apply() {
    if (!editable()) return notice('Enable Testing Shop during preparation first.', true);
    const kind = selectedKind(), base = defaults(), values = {};
    for (const field of currentFields()) {
      const input = fieldsEl.querySelector('[data-stat="' + field.key + '"]');
      if (!input || !input.value.trim()) return notice(field.label + ' needs a number.', true);
      const value = Number(input.value);
      if (!valid(value, field)) return notice(field.label + ' must be between ' + field.min + ' and ' + field.max + '.', true);
      if (value !== base[field.key]) values[field.key] = value;
    }
    if (kind === 'hero') overrides.heroes[selectedHero().id] = values;
    else if (kind === 'minion') overrides.minion = values;
    else overrides.boss[selectedStage()] = values;
    persist();
    log('Quick test stats saved for ' + (kind === 'hero' ? selectedHero().name : kind === 'boss' ? 'Stage ' + selectedStage() + ' boss' : 'normal enemies') + '.');
    notice('✓ Saved for the next test battle on this device.');
  }
  function resetSelected() {
    if (!editable()) return;
    const kind = selectedKind();
    if (kind === 'hero') delete overrides.heroes[selectedHero().id];
    else if (kind === 'minion') overrides.minion = {};
    else delete overrides.boss[selectedStage()];
    persist(); populate(); notice('✓ Restored default values for this selection.');
  }
  function resetAll() {
    if (!editable() || !window.confirm('Reset all hero and enemy quick-test stats to their built-in defaults?')) return;
    overrides = cloneEmpty();
    persist(); populate(); notice('✓ All quick-test stats are back to defaults.');
  }
  function init(options) {
    state = options.state;
    log = options.log || log;
    const host = $('testingControls');
    if (!host || panel) return;
    panel = document.createElement('details');
    panel.id = 'fwQuickStats';
    panel.className = 'tuning-box fw-quick-stats';
    panel.open = true;
    panel.innerHTML =
      '<summary>⚙ Quick Stats — Heroes & Enemies</summary>' +
      '<p class="tiny-note">Edit basic stats for test battles. No spreadsheet connection, skill-tree changes or normal-save changes.</p>' +
      '<div class="fw-quick-picker"><label>Unit type<select id="fwStatKind"><option value="hero">Hero</option><option value="minion">Normal enemy (all stages)</option><option value="boss">Stage boss</option></select></label>' +
      '<label id="fwHeroChooser">Hero<select id="fwStatHero"></select></label>' +
      '<label id="fwStageChooser" hidden>Boss stage<select id="fwStatStage"></select></label></div>' +
      '<div class="fw-quick-fields" id="fwStatFields"></div>' +
      '<div class="fw-quick-actions"><button type="button" class="btn compact" id="fwStatApply">Apply test stats</button>' +
      '<button type="button" class="btn secondary compact" id="fwStatReset">Reset selection</button>' +
      '<button type="button" class="btn secondary compact" id="fwStatResetAll">Reset all</button></div>' +
      '<p class="tiny-note fw-quick-feedback" id="fwStatMessage" aria-live="polite"></p>';
    host.prepend(panel);
    kindEl = $('fwStatKind'); heroEl = $('fwStatHero'); stageEl = $('fwStatStage');
    fieldsEl = $('fwStatFields'); messageEl = $('fwStatMessage');
    heroChooser = $('fwHeroChooser'); stageChooser = $('fwStageChooser');
    applyEl = $('fwStatApply'); resetEl = $('fwStatReset'); allEl = $('fwStatResetAll');
    for (const hero of HEROES) heroEl.add(new Option(hero.name, hero.id));
    for (let i = 0; i < ENCOUNTERS.length; i++) stageEl.add(new Option('Stage ' + (i + 1) + ' — ' + ENCOUNTERS[i].boss, String(i + 1)));
    stageEl.value = String(state.stage);
    kindEl.addEventListener('change', () => { if (selectedKind() === 'boss') stageEl.value = String(state.stage); populate(); });
    heroEl.addEventListener('change', populate);
    stageEl.addEventListener('change', () => {
      const testStage = $('testStage');
      if (editable() && testStage) { testStage.value = stageEl.value; testStage.dispatchEvent(new Event('change', { bubbles: true })); }
      populate();
    });
    $('testStage')?.addEventListener('change', () => { stageEl.value = $('testStage').value; if (selectedKind() === 'boss') populate(); });
    applyEl.addEventListener('click', apply);
    resetEl.addEventListener('click', resetSelected);
    allEl.addEventListener('click', resetAll);
    panel.addEventListener('keydown', e => { if (e.key === 'Enter') { e.stopPropagation(); if (e.target.tagName === 'INPUT') { e.preventDefault(); apply(); } } });
    populate();
  }
  window.FWQuickStats = { init, sync, heroForBattle, enemyForBattle, snapshot: () => JSON.parse(JSON.stringify(overrides)) };
})();
