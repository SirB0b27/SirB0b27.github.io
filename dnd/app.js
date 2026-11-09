(() => {
  'use strict';

  const CONFIG = window.DND_CONFIG || {};
  const TABS = [
    ['equipment', 'Equipment'], ['spells', 'Spells'], ['inventory', 'Inventory'],
    ['group-items', 'Group Items'], ['features', 'Features'], ['subclass', 'Subclass'],
    ['feats', 'Feats'], ['notes', 'Notes'], ['details', 'Character Details'],
    ['magic-items', 'All Magic Items'], ['class-info', 'Class Info'],
    ['roll20', 'Roll20 Information'], ['magic-spells', 'All Magic Spells'], ['change-log', 'Change Log'],
  ];
  const ABILITIES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  const CONDITIONS = ['Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious'];
  const shareToken = new URLSearchParams(location.search).get('share') || '';
  const publicStorageKey = `dndPublicSession:${shareToken.slice(0, 16)}`;
  const state = {
    token: sessionStorage.getItem('dndSession') || '',
    shareToken,
    publicToken: shareToken ? sessionStorage.getItem(publicStorageKey) || '' : '',
    publicCharacter: null,
    publicSession: null,
    characters: [],
    character: null,
    activeTab: 'equipment',
    activeRarity: '',
    references: {},
    shareSessions: [],
    mergeReview: null,
    mergeCategory: '',
    mergeResolutions: {},
  };

  const $ = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
  const title = value => String(value || '').replace(/\b\w/g, letter => letter.toUpperCase());
  const modifier = score => Math.floor((Number(score || 10) - 10) / 2);
  const signed = value => Number(value) >= 0 ? `+${Number(value)}` : String(Number(value));

  async function api(action, payload = {}) {
    if (!CONFIG.apiUrl) throw new Error('The staging API URL has not been configured.');
    const response = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({action, token: state.token, ...payload}),
    });
    const result = await response.json().catch(() => ({ok: false, error: 'Invalid server response.'}));
    if (!response.ok || !result.ok) throw new Error(result.error || 'Request failed.');
    return result.data;
  }

  function showLogin(message = '') {
    $('loginView').classList.remove('hidden');
    $('vaultView').classList.add('hidden');
    $('publicLoginView').classList.add('hidden');
    $('publicView').classList.add('hidden');
    $('shareButton').classList.add('hidden');
    $('loginError').textContent = message;
  }

  function showVault() {
    $('loginView').classList.add('hidden');
    $('publicLoginView').classList.add('hidden');
    $('publicView').classList.add('hidden');
    $('vaultView').classList.remove('hidden');
    $('shareButton').classList.remove('hidden');
  }

  function showPublicLogin(message = '') {
    $('loginView').classList.add('hidden');
    $('vaultView').classList.add('hidden');
    $('publicView').classList.add('hidden');
    $('publicLoginView').classList.remove('hidden');
    $('shareButton').classList.add('hidden');
    $('globalSearch').closest('.global-search').classList.add('hidden');
    $('publicLoginError').textContent = message;
  }

  function showPublicView() {
    $('loginView').classList.add('hidden');
    $('vaultView').classList.add('hidden');
    $('publicLoginView').classList.add('hidden');
    $('publicView').classList.remove('hidden');
    $('shareButton').classList.add('hidden');
    $('globalSearch').closest('.global-search').classList.add('hidden');
  }

  async function loadLibrary() {
    state.characters = await api('listCharacters');
    $('characterCount').textContent = state.characters.length;
    renderLibrary();
    if (state.characters.length) await selectCharacter(state.characters[0].id);
  }

  function renderLibrary() {
    $('characterList').innerHTML = state.characters.map(character => `
      <button class="character-button ${state.character?.id === character.id ? 'active' : ''}" data-character="${escapeHtml(character.id)}" type="button">
        <strong>${escapeHtml(character.name)}</strong>
        <span>Level ${escapeHtml(character.level)} · ${escapeHtml(character.race)} ${escapeHtml(character.characterClass)}</span>
      </button>`).join('');
    document.querySelectorAll('[data-character]').forEach(button => button.addEventListener('click', () => selectCharacter(button.dataset.character)));
  }

  async function selectCharacter(id) {
    state.character = await api('getCharacter', {characterId: id});
    renderLibrary();
    renderHeader();
    renderTabs();
    renderActiveTab();
  }

  function publicShareUrl(token) {
    const url = new URL(location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('share', token);
    return url.toString();
  }

  async function loadShareSessions() {
    if (!state.character) return;
    state.shareSessions = await api('listPublicSessions', {characterId: state.character.id});
    renderShareSessions();
  }

  function renderShareSessions() {
    $('shareSessionList').innerHTML = state.shareSessions.length ? state.shareSessions.map(session => `
      <article class="session-card ${session.enabled ? 'active' : ''}">
        <div><strong>${session.enabled ? 'Active public session' : 'Closed public session'}</strong><span>${escapeHtml(session.created_at)} · Revision ${escapeHtml(session.public_revision)}</span></div>
        <div class="pills"><span class="pill">${escapeHtml(session.pending_changes)} pending</span><span class="pill">${escapeHtml(session.merged_changes)} merged</span></div>
        <div class="session-actions">
          <button class="subtle" type="button" data-review-session="${escapeHtml(session.id)}">Review Changes</button>
          ${session.enabled ? `<button class="danger-button" type="button" data-disable-session="${escapeHtml(session.id)}">Disable Access</button>` : ''}
        </div>
      </article>`).join('') : '<div class="empty compact"><strong>No sharing sessions</strong><span>Create one when someone needs to control this character.</span></div>';
    document.querySelectorAll('[data-disable-session]').forEach(button => button.addEventListener('click', async () => {
      if (!confirm('Disable public editing? Pending changes will remain available for review.')) return;
      await api('disablePublicSession', {sessionId: button.dataset.disableSession});
      await loadShareSessions();
    }));
    document.querySelectorAll('[data-review-session]').forEach(button => button.addEventListener('click', () => openMergeReview(button.dataset.reviewSession)));
  }

  async function openMergeReview(sessionId) {
    state.mergeReview = await api('publicMergeReview', {sessionId});
    const categories = Object.keys(state.mergeReview.categories || {});
    state.mergeCategory = categories[0] || '';
    state.mergeResolutions = {};
    $('mergeCategory').innerHTML = categories.length
      ? categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)} (${state.mergeReview.categories[category].length})</option>`).join('')
      : '<option value="">No pending changes</option>';
    $('mergeCategory').value = state.mergeCategory;
    $('mergeConflictBox').classList.add('hidden');
    $('mergeHistory').innerHTML = (state.mergeReview.merge_batches || []).length ? state.mergeReview.merge_batches.map(batch => `
      <article class="session-card"><div><strong>${escapeHtml(batch.created_at)}</strong><span>Private revision: ${escapeHtml(batch.private_revision_before || '—')} → ${escapeHtml(batch.private_revision_after || '—')}</span></div><div class="pills"><span class="pill">${escapeHtml((batch.event_ids || []).length)} applied</span><span class="pill">${escapeHtml((batch.skipped_event_ids || []).length)} kept private</span></div></article>`).join('') : '<p class="muted">No merge batches have been recorded for this session.</p>';
    renderMergeEvents();
    if (!$('mergeDialog').open) $('mergeDialog').showModal();
  }

  function compactValue(value) {
    if (value === undefined) return 'Removed';
    if (value === null) return 'None';
    if (typeof value === 'object') {
      const text = JSON.stringify(value);
      return text.length > 180 ? `${text.slice(0, 177)}…` : text;
    }
    return String(value);
  }

  function renderMergeEvents() {
    const events = state.mergeReview?.categories?.[state.mergeCategory] || [];
    $('mergeEventList').innerHTML = events.length ? events.map(event => `
      <label class="merge-event">
        <input type="checkbox" data-merge-event="${escapeHtml(event.id)}">
        <span><strong>${escapeHtml(title(event.path.replaceAll('_', ' ').replaceAll('.', ' › ')))}</strong><small>${escapeHtml(event.editor)} · ${escapeHtml(event.created_at)}${event.note ? ` · ${escapeHtml(event.note)}` : ''}</small><span class="change-values"><em>${escapeHtml(compactValue(event.before))}</em><b>→</b><em>${escapeHtml(compactValue(event.after))}</em></span></span>
      </label>`).join('') : '<div class="empty compact"><strong>No pending changes</strong><span>This public session is fully merged.</span></div>';
    $('selectMergeCategory').checked = false;
    document.querySelectorAll('[data-merge-event]').forEach(input => input.addEventListener('change', updateMergeCount));
    updateMergeCount();
  }

  function selectedMergeIds() {
    return [...document.querySelectorAll('[data-merge-event]:checked')].map(input => input.dataset.mergeEvent);
  }

  function updateMergeCount() {
    $('mergeSelectionCount').textContent = `${selectedMergeIds().length} selected`;
  }

  function renderMergeConflicts(conflicts) {
    $('mergeConflictBox').innerHTML = `<strong>Private changes conflict with this public session.</strong><p>Choose which value should win for each field, then merge again.</p>${conflicts.map(conflict => `
      <fieldset class="conflict-row" data-conflict-path="${escapeHtml(conflict.path)}">
        <legend>${escapeHtml(title(conflict.path.replaceAll('_', ' ').replaceAll('.', ' › ')))}</legend>
        <label><input type="radio" name="conflict-${escapeHtml(conflict.path)}" value="private" checked> Keep private: ${escapeHtml(compactValue(conflict.private))}</label>
        <label><input type="radio" name="conflict-${escapeHtml(conflict.path)}" value="public"> Use public: ${escapeHtml(compactValue(conflict.public))}</label>
      </fieldset>`).join('')}`;
    $('mergeConflictBox').classList.remove('hidden');
    $('mergeSelectedButton').textContent = 'Apply Resolutions & Merge';
  }

  function renderHeader() {
    const character = state.character;
    const scores = character.ability_scores || {};
    const derived = character.derived || {};
    const classLine = (character.classes || []).map(row => `${row.name} ${row.level}`).join(' / ') || character.character_class;
    $('characterHeader').innerHTML = `
      <div class="identity">
        <div class="avatar">${escapeHtml(character.name.split(/\s+/).map(part => part[0]).slice(0, 2).join(''))}</div>
        <div><h2>${escapeHtml(character.name)}</h2><p>${escapeHtml(character.race)} · ${escapeHtml(classLine)} · Level ${escapeHtml(character.level)}</p></div>
      </div>
      ${ABILITIES.map(ability => `<div class="stat"><span>${escapeHtml(ability)}</span><strong>${escapeHtml(scores[ability])} ${signed(modifier(scores[ability]))}</strong></div>`).join('')}
      <div class="stat"><span>Proficiency</span><strong>${signed(derived.proficiency_bonus || 0)}</strong></div>
      <div class="stat"><span>Passive Perception</span><strong>${escapeHtml(derived.passive_perception || 0)}</strong></div>`;
  }

  function renderTabs() {
    $('tabBar').innerHTML = TABS.map(([key, label]) => `<button class="tab-button ${key === state.activeTab ? 'active' : ''}" data-tab="${key}" type="button">${label}</button>`).join('');
    document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
      state.activeTab = button.dataset.tab;
      renderTabs();
      renderActiveTab();
    }));
  }

  function table(headers, rows) {
    if (!rows.length) return empty();
    return `<div class="panel"><table class="data-table"><thead><tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function empty() {
    return $('emptyTemplate').innerHTML;
  }

  function sourceLink(record) {
    return record.url ? `<a href="${escapeHtml(record.url)}" target="_blank" rel="noopener noreferrer">Source</a>` : '—';
  }

  function weaponRows(character) {
    const prof = Number(character.derived?.proficiency_bonus || 0);
    const mods = character.derived?.modifiers || {};
    return (character.inventory || []).filter(item => item.type === 'weapon').map(item => {
      const ability = String(item.ability || 'Strength').toLowerCase();
      const attack = prof + Number(mods[ability] || 0) + Number(item.magic_bonus || 0) + Number(item.attack_bonus_extra || 0);
      const damage = `${item.damage || '—'}${Number(item.damage_bonus_extra || item.magic_bonus || 0) ? signed(Number(item.damage_bonus_extra || item.magic_bonus || 0)) : ''} ${item.damage_type || ''}`.trim();
      return [escapeHtml(item.name), signed(attack), escapeHtml(damage), escapeHtml(item.range || '—')];
    });
  }

  function renderEquipment(character) {
    const attacks = table(['Weapon', 'Attack Bonus', 'Damage / Type', 'Range'], weaponRows(character));
    const equipped = (character.inventory || []).filter(item => item.equipped || item.active);
    const acRows = equipped.filter(item => item.type === 'armor' || item.type === 'shield' || Number(item.effects?.ac || item.ac_bonus || 0)).map(item => [
      escapeHtml(item.name), item.equipped ? 'Yes' : 'Active effect', escapeHtml(item.notes || '—')
    ]);
    acRows.push(['<strong>Total Armor Class</strong>', '', `<strong>${escapeHtml(character.derived?.armor_class || '—')}</strong>`]);
    const activeSpells = (character.active_spells || []).map(spell => [escapeHtml(spell.name), escapeHtml(spell.level || 'Unknown'), escapeHtml(spell.turns_remaining ?? '—'), escapeHtml(spell.effects || '—')]);
    const attuned = (character.inventory || []).filter(item => item.attuned).map(item => [escapeHtml(item.name), escapeHtml(item.notes || '—')]);
    return `<div class="content-grid">
      <div><div class="section-heading"><span>Weapon Attacks</span></div>${attacks}</div>
      <div><div class="section-heading"><span>AC Breakdown</span></div>${table(['Item / Effect', 'Applied', 'Details'], acRows)}</div>
      <div><div class="section-heading"><span>Active Spells</span></div>${table(['Spell', 'Level', 'Turns Remaining', 'Effects'], activeSpells)}</div>
      <div><div class="section-heading"><span>Attuned Items</span></div>${table(['Item', 'Effect'], attuned)}</div>
    </div>`;
  }

  function renderSpells(character) {
    const slots = Object.keys(character.spell_slots_max || {}).map(level => [level, character.spell_slots_max[level], character.spell_slots_used?.[level] || 0]);
    const spellRows = (character.spells || []).map(spell => [escapeHtml(typeof spell === 'string' ? spell : spell.name), escapeHtml(spell.level ?? '—'), escapeHtml(spell.school || '—'), escapeHtml(spell.classes?.join(', ') || '—')]);
    return `<div class="content-grid">${table(['Slot Level', 'Maximum', 'Used'], slots)}${table(['Spell', 'Level', 'School', 'Classes'], spellRows)}</div>`;
  }

  function renderInventory(character) {
    const rows = (character.inventory || []).map(item => [escapeHtml(item.name), escapeHtml(item.quantity ?? 1), escapeHtml(title(item.type || 'Item')), item.equipped ? 'Yes' : '', item.attuned ? 'Yes' : '', escapeHtml(item.notes || '')]);
    return table(['Item', 'Qty', 'Type', 'Equipped', 'Attuned', 'Notes'], rows);
  }

  function renderGroupItems(character) {
    const funds = character.group_funds || {};
    const fundHtml = `<div class="panel"><h3>Group Funds</h3><div class="pills">${['cp','sp','ep','gp','pp'].map(coin => `<span class="pill">${coin.toUpperCase()} ${escapeHtml(funds[coin] || 0)}</span>`).join('')}</div></div>`;
    const groups = Object.entries(character.group_items || {}).map(([name, items]) => `<div class="panel"><h3>${escapeHtml(name)}</h3>${table(['Item','Qty','Notes'], items.map(item => [escapeHtml(item.item), escapeHtml(item.qty), escapeHtml(item.notes || '')]))}</div>`).join('');
    return `<div class="content-grid">${fundHtml}${groups || empty()}</div>`;
  }

  function renderRecords(records) {
    if (!records.length) return empty();
    return `<div class="cards">${records.map(record => `<article class="record"><strong>${escapeHtml(record.name)}</strong><p>${escapeHtml(record.description || '')}</p><div class="pills"><span class="pill">${escapeHtml(record.source || 'Feature')}</span>${record.max_uses ? `<span class="pill">${escapeHtml(record.max_uses - (record.uses_used || 0))}/${escapeHtml(record.max_uses)} remaining</span>` : ''}</div></article>`).join('')}</div>`;
  }

  async function loadReference(kind) {
    if (!state.references[kind]) state.references[kind] = await api('referenceData', {kind, page: 1, pageSize: 1000});
    return state.references[kind];
  }

  async function renderReferenceTab(kind) {
    const result = await loadReference(kind);
    if (kind === 'magic_items') {
      const order = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Artifact', 'Varies', 'Unspecified'];
      const groups = result.records.reduce((map, item) => {
        const rarity = item.rarity || 'Unspecified';
        (map[rarity] ||= []).push(item);
        return map;
      }, {});
      const rarities = Object.keys(groups).sort((a, b) => (order.indexOf(a) < 0 ? 99 : order.indexOf(a)) - (order.indexOf(b) < 0 ? 99 : order.indexOf(b)) || a.localeCompare(b));
      state.activeRarity = rarities.includes(state.activeRarity) ? state.activeRarity : rarities[0];
      return `<div class="subtab-bar" aria-label="Magic item rarities">${rarities.map(rarity => `<button class="subtab-button ${rarity === state.activeRarity ? 'active' : ''}" data-rarity="${escapeHtml(rarity)}" type="button">${escapeHtml(rarity)} <span>${groups[rarity].length}</span></button>`).join('')}</div>
        ${rarities.map(rarity => `<div data-rarity-panel="${escapeHtml(rarity)}" ${rarity === state.activeRarity ? '' : 'hidden'}>${table(['Magic Item', 'Type', 'Attunement', 'Summary', 'Link'], groups[rarity].map(item => [escapeHtml(item.name), escapeHtml(item.type || '—'), item.requires_attunement ? 'Required' : 'No', escapeHtml(item.description || ''), sourceLink(item)]))}</div>`).join('')}`;
    }
    if (kind === 'spells') {
      return table(['Spell', 'Level', 'School', 'Classes', 'Summary', 'Link'], result.records.map(spell => [
        escapeHtml(spell.name), escapeHtml(spell.level ?? '—'), escapeHtml(spell.school || '—'), escapeHtml((spell.classes || []).join(', ')), escapeHtml(spell.description || ''), sourceLink(spell)
      ]));
    }
    if (kind === 'class_info') {
      return table(['Class / Subclass', 'Source', 'Status', 'Summary', 'Link'], result.records.map(record => [
        escapeHtml(record.name), escapeHtml(record.source || '—'), escapeHtml(title(String(record.status || '').replaceAll('_', ' '))), escapeHtml(record.description || ''), sourceLink(record)
      ]));
    }
    return table(['Topic', 'Category', 'Source', 'Summary', 'Link'], result.records.map(record => [
      escapeHtml(record.name), escapeHtml(title(String(record.category || 'Rules').replaceAll('_', ' '))), escapeHtml(record.source || '—'), escapeHtml(record.description || ''), sourceLink(record)
    ]));
  }

  function renderDetails(character) {
    const scores = character.derived?.skills || {};
    const conditions = new Set(character.conditions || []);
    return `<div class="content-grid">
      <div class="panel"><h3>Play Tracking</h3><div class="pills"><span class="pill">HP ${escapeHtml(character.current_hp)} / ${escapeHtml(character.max_hp)}</span><span class="pill">Temp HP ${escapeHtml(character.temporary_hp || 0)}</span><span class="pill">Hit Dice ${escapeHtml(character.level - (character.hit_dice_used || 0))} / ${escapeHtml(character.level)}</span><span class="pill">Exhaustion ${escapeHtml(character.exhaustion || 0)}</span><span class="pill">XP ${escapeHtml(character.experience || 0)}</span></div></div>
      <div class="panel"><h3>Conditions</h3><div class="check-grid">${CONDITIONS.map(condition => `<label class="check-row"><input type="checkbox" disabled ${conditions.has(condition) ? 'checked' : ''}>${condition}</label>`).join('')}</div></div>
      <div class="panel"><h3>Skills</h3>${table(['Skill','Bonus'], Object.entries(scores).map(([skill, bonus]) => [escapeHtml(skill), signed(bonus)]))}</div>
      <div class="panel"><h3>Appearance</h3><p class="note">${escapeHtml([character.age && `Age: ${character.age}`, character.height && `Height: ${character.height}`, character.eyes && `Eyes: ${character.eyes}`, character.appearance].filter(Boolean).join('\n') || 'No appearance details entered.')}</p></div>
    </div>`;
  }

  function renderPublicEditor() {
    const character = state.publicCharacter;
    if (!character) return;
    $('publicCharacterName').textContent = character.name;
    $('publicSessionStatus').textContent = `Public revision ${state.publicSession?.public_revision || 0} · ${state.publicSession?.pending_changes || 0} pending changes`;
    const fields = [
      ['current_hp', 'Current HP', 'number'], ['max_hp', 'Maximum HP', 'number'], ['temporary_hp', 'Temporary HP', 'number'],
      ['exhaustion', 'Exhaustion', 'number'], ['death_save_successes', 'Death Save Successes', 'number'],
      ['death_save_failures', 'Death Save Failures', 'number'], ['hit_dice_used', 'Hit Dice Used', 'number'],
      ['experience', 'Experience', 'number'], ['inspiration', 'Inspiration', 'checkbox'],
    ];
    $('publicQuickFields').innerHTML = fields.map(([key, label, type]) => `<label>${label}<input data-public-field="${key}" type="${type}" ${type === 'checkbox' ? (character[key] ? 'checked' : '') : `value="${escapeHtml(character[key] ?? '')}"`}></label>`).join('');
    $('publicAbilities').innerHTML = ABILITIES.map(ability => `<label>${title(ability)}<input type="number" min="1" max="30" data-public-ability="${ability}" value="${escapeHtml(character.ability_scores?.[ability] ?? 10)}"></label>`).join('');
    const activeConditions = new Set(character.conditions || []);
    $('publicConditions').innerHTML = CONDITIONS.map(condition => `<label class="check-row"><input type="checkbox" data-public-condition="${escapeHtml(condition)}" ${activeConditions.has(condition) ? 'checked' : ''}>${escapeHtml(condition)}</label>`).join('');
    const maximumSlots = character.spell_slots_max || {};
    $('publicSpellSlots').innerHTML = Object.keys(maximumSlots).length ? Object.keys(maximumSlots).map(level => `<label>Level ${escapeHtml(level)} Used<input type="number" min="0" max="${escapeHtml(maximumSlots[level])}" data-public-slot="${escapeHtml(level)}" value="${escapeHtml(character.spell_slots_used?.[level] || 0)}"><small>Maximum ${escapeHtml(maximumSlots[level])}</small></label>`).join('') : '<p class="muted">This character has no spell slots.</p>';
    $('publicActiveSpells').innerHTML = (character.active_spells || []).length ? table(['Spell', 'Level', 'Turns Remaining', 'Effects'], character.active_spells.map((spell, index) => [
      escapeHtml(spell.name), escapeHtml(spell.level || 'Unknown'), `<input class="table-input small" type="number" min="0" data-public-active-spell="${index}" value="${escapeHtml(spell.turns_remaining ?? 0)}">`, escapeHtml(spell.effects || '—')
    ])) : '<p class="muted">No active spells are recorded.</p>';
    $('publicInventory').innerHTML = (character.inventory || []).length ? table(['Item', 'Quantity', 'Equipped', 'Attuned', 'Notes'], character.inventory.map((item, index) => [
      escapeHtml(item.name),
      `<input class="table-input small" type="number" min="0" data-public-inventory="${index}" data-item-key="quantity" value="${escapeHtml(item.quantity ?? 1)}">`,
      `<input type="checkbox" data-public-inventory="${index}" data-item-key="equipped" ${item.equipped ? 'checked' : ''}>`,
      `<input type="checkbox" data-public-inventory="${index}" data-item-key="attuned" ${item.attuned ? 'checked' : ''}>`,
      `<input class="table-input" type="text" data-public-inventory="${index}" data-item-key="notes" value="${escapeHtml(item.notes || '')}">`,
    ])) : empty();
    $('publicCurrency').innerHTML = ['cp','sp','ep','gp','pp'].map(coin => `<label>${coin.toUpperCase()}<input type="number" min="0" data-public-currency="${coin}" value="${escapeHtml(character.currency?.[coin] || 0)}"></label>`).join('');
    $('publicGroupFunds').innerHTML = ['cp','sp','ep','gp','pp'].map(coin => `<label>${coin.toUpperCase()}<input type="number" min="0" data-public-group-fund="${coin}" value="${escapeHtml(character.group_funds?.[coin] || 0)}"></label>`).join('');
    const usableFeatures = (character.feature_records || []).filter(feature => Number(feature.max_uses || 0) > 0);
    $('publicFeatures').innerHTML = usableFeatures.length ? table(['Feature', 'Used', 'Maximum', 'Recharge'], usableFeatures.map(feature => {
      const index = character.feature_records.indexOf(feature);
      return [escapeHtml(feature.name), `<input class="table-input small" type="number" min="0" max="${escapeHtml(feature.max_uses)}" data-public-feature="${index}" value="${escapeHtml(feature.uses_used || 0)}">`, escapeHtml(feature.max_uses), escapeHtml(feature.recharge || '—')];
    })) : '<p class="muted">No limited-use features are recorded.</p>';
    $('publicNotes').value = character.general_notes || '';
    $('publicJsonEditor').value = JSON.stringify(character, null, 2);
  }

  function applyPublicForm() {
    const character = dndPublicClone(state.publicCharacter);
    document.querySelectorAll('[data-public-field]').forEach(input => {
      character[input.dataset.publicField] = input.type === 'checkbox' ? input.checked : Number(input.value || 0);
    });
    character.ability_scores = character.ability_scores || {};
    document.querySelectorAll('[data-public-ability]').forEach(input => { character.ability_scores[input.dataset.publicAbility] = Number(input.value || 10); });
    character.conditions = [...document.querySelectorAll('[data-public-condition]:checked')].map(input => input.dataset.publicCondition);
    character.spell_slots_used = character.spell_slots_used || {};
    document.querySelectorAll('[data-public-slot]').forEach(input => { character.spell_slots_used[input.dataset.publicSlot] = Number(input.value || 0); });
    document.querySelectorAll('[data-public-active-spell]').forEach(input => {
      const spell = character.active_spells?.[Number(input.dataset.publicActiveSpell)];
      if (spell) spell.turns_remaining = Number(input.value || 0);
    });
    document.querySelectorAll('[data-public-inventory]').forEach(input => {
      const item = character.inventory?.[Number(input.dataset.publicInventory)];
      if (!item) return;
      const key = input.dataset.itemKey;
      item[key] = input.type === 'checkbox' ? input.checked : input.type === 'number' ? Number(input.value || 0) : input.value;
    });
    document.querySelectorAll('[data-public-feature]').forEach(input => {
      const feature = character.feature_records?.[Number(input.dataset.publicFeature)];
      if (feature) feature.uses_used = Number(input.value || 0);
    });
    character.currency = character.currency || {};
    document.querySelectorAll('[data-public-currency]').forEach(input => { character.currency[input.dataset.publicCurrency] = Number(input.value || 0); });
    character.group_funds = character.group_funds || {};
    document.querySelectorAll('[data-public-group-fund]').forEach(input => { character.group_funds[input.dataset.publicGroupFund] = Number(input.value || 0); });
    character.general_notes = $('publicNotes').value;
    state.publicCharacter = character;
    $('publicJsonEditor').value = JSON.stringify(character, null, 2);
    return character;
  }

  function dndPublicClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  async function savePublicCharacter() {
    $('publicSaveStatus').classList.remove('error');
    $('publicSaveStatus').textContent = 'Saving changes…';
    try {
      const character = applyPublicForm();
      const result = await api('publicSave', {publicToken: state.publicToken, character, changeNote: $('publicChangeNote').value});
      state.publicCharacter = result.character;
      state.publicSession = result.session;
      $('publicChangeNote').value = '';
      renderPublicEditor();
      $('publicSaveStatus').textContent = result.changesCreated ? `${result.changesCreated} change-log item${result.changesCreated === 1 ? '' : 's'} saved.` : 'No changes to save.';
    } catch (error) {
      $('publicSaveStatus').textContent = error.message;
      $('publicSaveStatus').classList.add('error');
    }
  }

  async function restorePublicSession() {
    if (!state.publicToken) return showPublicLogin();
    try {
      const result = await api('publicSession', {publicToken: state.publicToken});
      state.publicCharacter = result.character;
      state.publicSession = result.session;
      showPublicView();
      renderPublicEditor();
    } catch (error) {
      state.publicToken = '';
      sessionStorage.removeItem(publicStorageKey);
      showPublicLogin(error.message);
    }
  }

  async function renderActiveTab() {
    const character = state.character;
    if (!character) return;
    const records = character.feature_records || [];
    const views = {
      'equipment': () => renderEquipment(character),
      'spells': () => renderSpells(character),
      'inventory': () => renderInventory(character),
      'group-items': () => renderGroupItems(character),
      'features': () => renderRecords(records.filter(record => record.source !== 'Feat' && record.source !== character.subclass)),
      'subclass': () => renderRecords(records.filter(record => record.source === character.subclass || record.source === 'Order of the Lycan' || record.source === 'Blood Curse')),
      'feats': () => renderRecords(records.filter(record => record.source === 'Feat')),
      'notes': () => `<div class="panel"><p class="note">${escapeHtml(character.general_notes || 'No notes entered.')}</p></div>`,
      'details': () => renderDetails(character),
      'magic-items': () => renderReferenceTab('magic_items'),
      'class-info': () => renderReferenceTab('class_info'),
      'roll20': () => renderReferenceTab('equipment_rules'),
      'magic-spells': () => renderReferenceTab('spells'),
      'change-log': () => `<div class="panel"><p class="note">Created: ${escapeHtml(character.created_at || '—')}\nUpdated: ${escapeHtml(character.updated_at || '—')}\nImport source: ${escapeHtml(character.import_source || 'Manual')}</p></div>`,
    };
    $('tabContent').innerHTML = '<div class="empty"><strong>Loading</strong><span>Reading the Drive-backed catalogue…</span></div>';
    try { $('tabContent').innerHTML = await (views[state.activeTab] || (() => empty()))(); }
    catch (error) { $('tabContent').innerHTML = `<div class="empty"><strong>Unable to load this section</strong><span>${escapeHtml(error.message)}</span></div>`; }
    bindRarityTabs();
    applySearch();
  }

  function bindRarityTabs() {
    document.querySelectorAll('[data-rarity]').forEach(button => button.addEventListener('click', () => {
      state.activeRarity = button.dataset.rarity;
      document.querySelectorAll('[data-rarity]').forEach(item => item.classList.toggle('active', item === button));
      document.querySelectorAll('[data-rarity-panel]').forEach(panel => { panel.hidden = panel.dataset.rarityPanel !== state.activeRarity; });
    }));
  }

  function applySearch() {
    const query = $('globalSearch').value.trim().toLowerCase();
    document.querySelectorAll('#tabContent tr, #tabContent .record, #tabContent .panel').forEach(element => {
      element.hidden = Boolean(query) && !element.textContent.toLowerCase().includes(query);
    });
  }

  $('loginForm').addEventListener('submit', async event => {
    event.preventDefault();
    $('loginError').textContent = '';
    try {
      const session = await api('login', {email: $('email').value, password: $('password').value});
      state.token = session.token;
      sessionStorage.setItem('dndSession', state.token);
      $('password').value = '';
      showVault();
      await loadLibrary();
    } catch (error) { showLogin(error.message); }
  });

  $('logoutButton').addEventListener('click', async () => {
    try { await api('logout'); } catch (error) { /* local logout still proceeds */ }
    state.token = '';
    state.character = null;
    sessionStorage.removeItem('dndSession');
    showLogin();
  });
  $('globalSearch').addEventListener('input', applySearch);
  $('menuButton').addEventListener('click', () => $('settingsDialog').showModal());
  $('shareButton').addEventListener('click', async () => {
    $('newShareResult').classList.add('hidden');
    await loadShareSessions();
    $('shareDialog').showModal();
  });
  $('createShareButton').addEventListener('click', async () => {
    const pin = $('newSharePin').value;
    if (!state.character) return;
    try {
      const result = await api('createPublicSession', {characterId: state.character.id, pin});
      const url = publicShareUrl(result.shareToken);
      $('newShareResult').innerHTML = `<strong>Public session enabled</strong><p>Share this link and the PIN separately. The link is shown only now.</p><div class="copy-row"><input id="createdShareUrl" value="${escapeHtml(url)}" readonly><button id="copyShareUrl" class="subtle" type="button">Copy Link</button></div>`;
      $('newShareResult').classList.remove('hidden');
      $('newSharePin').value = '';
      $('copyShareUrl').addEventListener('click', async () => {
        await navigator.clipboard.writeText(url);
        $('copyShareUrl').textContent = 'Copied';
      });
      await loadShareSessions();
    } catch (error) {
      $('newShareResult').innerHTML = `<span class="error">${escapeHtml(error.message)}</span>`;
      $('newShareResult').classList.remove('hidden');
    }
  });
  $('mergeCategory').addEventListener('change', event => {
    state.mergeCategory = event.target.value;
    $('mergeConflictBox').classList.add('hidden');
    $('mergeSelectedButton').textContent = 'Review & Merge Selected';
    renderMergeEvents();
  });
  $('selectMergeCategory').addEventListener('change', event => {
    document.querySelectorAll('[data-merge-event]').forEach(input => { input.checked = event.target.checked; });
    updateMergeCount();
  });
  $('mergeSelectedButton').addEventListener('click', async () => {
    const eventIds = selectedMergeIds();
    if (!eventIds.length) return alert('Select at least one pending change.');
    const resolutions = {};
    document.querySelectorAll('[data-conflict-path]').forEach(row => {
      const selected = row.querySelector('input:checked');
      if (selected) resolutions[row.dataset.conflictPath] = selected.value;
    });
    if (!confirm(`Merge ${eventIds.length} selected change${eventIds.length === 1 ? '' : 's'} into the private character?`)) return;
    try {
      const result = await api('mergePublicChanges', {sessionId: state.mergeReview.session.id, eventIds, resolutions});
      if (!result.merged) {
        renderMergeConflicts(result.conflicts || []);
        return;
      }
      $('mergeSelectedButton').textContent = 'Review & Merge Selected';
      $('mergeConflictBox').classList.add('hidden');
      await selectCharacter(state.character.id);
      await loadShareSessions();
      await openMergeReview(state.mergeReview.session.id);
      alert(`Merge complete. ${result.remaining_changes} pending change${result.remaining_changes === 1 ? '' : 's'} remain.`);
    } catch (error) { alert(error.message); }
  });
  $('publicLoginForm').addEventListener('submit', async event => {
    event.preventDefault();
    $('publicLoginError').textContent = '';
    try {
      const result = await api('publicOpen', {shareToken: state.shareToken, pin: $('publicPin').value, editorName: $('publicEditorName').value});
      state.publicToken = result.publicToken;
      state.publicCharacter = result.character;
      state.publicSession = result.session;
      sessionStorage.setItem(publicStorageKey, state.publicToken);
      $('publicPin').value = '';
      showPublicView();
      renderPublicEditor();
    } catch (error) { showPublicLogin(error.message); }
  });
  $('publicSaveButton').addEventListener('click', savePublicCharacter);
  $('applyPublicJson').addEventListener('click', () => {
    try {
      const parsed = JSON.parse($('publicJsonEditor').value);
      if (parsed.id !== state.publicCharacter.id) throw new Error('The character ID cannot be changed.');
      state.publicCharacter = parsed;
      renderPublicEditor();
      $('publicSaveStatus').classList.remove('error');
      $('publicSaveStatus').textContent = 'JSON applied to the form. Save to record the changes.';
    } catch (error) {
      $('publicSaveStatus').textContent = `Invalid character JSON: ${error.message}`;
      $('publicSaveStatus').classList.add('error');
    }
  });
  $('opacityControl').addEventListener('input', event => document.documentElement.style.setProperty('--glass-opacity', Number(event.target.value) / 100));
  $('lightMode').addEventListener('change', event => document.body.classList.toggle('light', event.target.checked));

  async function restoreSession() {
    if (!state.token) return showLogin();
    try {
      await api('session');
      showVault();
      await loadLibrary();
    } catch (error) {
      state.token = '';
      sessionStorage.removeItem('dndSession');
      showLogin('Your session expired. Please sign in again.');
    }
  }
  if (state.shareToken) restorePublicSession();
  else restoreSession();
})();
