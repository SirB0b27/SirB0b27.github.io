(() => {
  'use strict';

  const ABILITIES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  const SKILLS = {
    'Acrobatics':'dexterity','Animal Handling':'wisdom','Arcana':'intelligence','Athletics':'strength',
    'Deception':'charisma','History':'intelligence','Insight':'wisdom','Intimidation':'charisma',
    'Investigation':'intelligence','Medicine':'wisdom','Nature':'intelligence','Perception':'wisdom',
    'Performance':'charisma','Persuasion':'charisma','Religion':'intelligence','Sleight of Hand':'dexterity',
    'Stealth':'dexterity','Survival':'wisdom',
  };
  const CLASSES = {
    'Artificer':{die:8,caster:'half_up',spell:'intelligence',sub:3,subs:['Alchemist','Armorer','Artillerist','Battle Smith']},
    'Barbarian':{die:12,sub:3,subs:['Ancestral Guardian','Battlerager','Beast','Berserker','Storm Herald','Totem Warrior','Wild Magic','Zealot']},
    'Bard':{die:8,caster:'full',spell:'charisma',sub:3,subs:['Creation','Eloquence','Glamour','Lore','Swords','Valor','Whispers']},
    'Blood Hunter':{die:10,sub:3,subs:['Order of the Ghostslayer','Order of the Lycan','Order of the Mutant','Order of the Profane Soul']},
    'Cleric':{die:8,caster:'full',spell:'wisdom',sub:1,subs:['Arcana','Death','Forge','Grave','Knowledge','Life','Light','Nature','Order','Peace','Tempest','Trickery','Twilight','War']},
    'Druid':{die:8,caster:'full',spell:'wisdom',sub:2,subs:['Dreams','Land','Moon','Shepherd','Spores','Stars','Wildfire']},
    'Fighter':{die:10,sub:3,subs:['Arcane Archer','Battle Master','Cavalier','Champion','Echo Knight','Eldritch Knight','Psi Warrior','Purple Dragon Knight','Rune Knight','Samurai']},
    'Monk':{die:8,sub:3,subs:['Astral Self','Drunken Master','Four Elements','Kensei','Long Death','Mercy','Open Hand','Shadow','Sun Soul']},
    'Paladin':{die:10,caster:'half',spell:'charisma',sub:3,subs:['Ancients','Conquest','Crown','Devotion','Glory','Redemption','Vengeance','Watchers']},
    'Ranger':{die:10,caster:'half',spell:'wisdom',sub:3,subs:['Beast Master','Drakewarden','Fey Wanderer','Gloom Stalker','Horizon Walker','Hunter','Monster Slayer','Swarmkeeper']},
    'Rogue':{die:8,sub:3,subs:['Arcane Trickster','Assassin','Inquisitive','Mastermind','Phantom','Scout','Soulknife','Swashbuckler','Thief']},
    'Sorcerer':{die:6,caster:'full',spell:'charisma',sub:1,subs:['Aberrant Mind','Clockwork Soul','Divine Soul','Draconic Bloodline','Shadow Magic','Storm Sorcery','Wild Magic']},
    'Warlock':{die:8,caster:'pact',spell:'charisma',sub:1,subs:['Archfey','Celestial','Fathomless','Fiend','Genie','Great Old One','Hexblade','Undead','Undying']},
    'Wizard':{die:6,caster:'full',spell:'intelligence',sub:2,subs:['Abjuration','Bladesinging','Chronurgy','Conjuration','Divination','Enchantment','Evocation','Graviturgy','Illusion','Necromancy','Scribes','Transmutation','War Magic']},
  };
  const FEATURES = {
    'Artificer':[[1,'Magical Tinkering'],[1,'Spellcasting'],[2,'Infuse Item'],[3,'Artificer Specialist'],[7,'Flash of Genius'],[11,'Spell-Storing Item'],[20,'Soul of Artifice']],
    'Barbarian':[[1,'Rage'],[1,'Unarmored Defense'],[2,'Reckless Attack'],[2,'Danger Sense'],[3,'Primal Path'],[5,'Extra Attack'],[5,'Fast Movement'],[7,'Feral Instinct'],[11,'Relentless Rage'],[15,'Persistent Rage'],[20,'Primal Champion']],
    'Bard':[[1,'Bardic Inspiration'],[1,'Spellcasting'],[2,'Jack of All Trades'],[2,'Song of Rest'],[3,'Bard College'],[3,'Expertise'],[5,'Font of Inspiration'],[6,'Countercharm'],[10,'Magical Secrets']],
    'Blood Hunter':[[1,"Hunter's Bane"],[1,'Blood Maledict'],[2,'Fighting Style'],[2,'Crimson Rite'],[3,'Blood Hunter Order'],[5,'Extra Attack'],[6,'Brand of Castigation'],[9,'Grim Psychometry'],[10,'Dark Augmentation'],[13,'Brand of Tethering'],[14,'Hardened Soul'],[20,'Sanguine Mastery']],
    'Cleric':[[1,'Spellcasting'],[1,'Divine Domain'],[2,'Channel Divinity'],[5,'Destroy Undead'],[10,'Divine Intervention']],
    'Druid':[[1,'Druidic'],[1,'Spellcasting'],[2,'Wild Shape'],[2,'Druid Circle'],[18,'Timeless Body'],[18,'Beast Spells'],[20,'Archdruid']],
    'Fighter':[[1,'Fighting Style'],[1,'Second Wind'],[2,'Action Surge'],[3,'Martial Archetype'],[5,'Extra Attack'],[9,'Indomitable']],
    'Monk':[[1,'Martial Arts'],[1,'Unarmored Defense'],[2,'Ki'],[2,'Unarmored Movement'],[3,'Monastic Tradition'],[3,'Deflect Missiles'],[5,'Extra Attack'],[5,'Stunning Strike'],[7,'Evasion'],[14,'Diamond Soul']],
    'Paladin':[[1,'Divine Sense'],[1,'Lay on Hands'],[2,'Fighting Style'],[2,'Spellcasting'],[2,'Divine Smite'],[3,'Sacred Oath'],[5,'Extra Attack'],[6,'Aura of Protection'],[11,'Improved Divine Smite']],
    'Ranger':[[1,'Favored Enemy'],[1,'Natural Explorer'],[2,'Fighting Style'],[2,'Spellcasting'],[3,'Ranger Archetype'],[3,'Primeval Awareness'],[5,'Extra Attack'],[8,"Land's Stride"],[10,'Hide in Plain Sight']],
    'Rogue':[[1,'Expertise'],[1,'Sneak Attack'],[1,"Thieves' Cant"],[2,'Cunning Action'],[3,'Roguish Archetype'],[5,'Uncanny Dodge'],[7,'Evasion'],[11,'Reliable Talent'],[14,'Blindsense']],
    'Sorcerer':[[1,'Spellcasting'],[1,'Sorcerous Origin'],[2,'Font of Magic'],[3,'Metamagic'],[20,'Sorcerous Restoration']],
    'Warlock':[[1,'Otherworldly Patron'],[1,'Pact Magic'],[2,'Eldritch Invocations'],[3,'Pact Boon'],[11,'Mystic Arcanum'],[20,'Eldritch Master']],
    'Wizard':[[1,'Spellcasting'],[1,'Arcane Recovery'],[2,'Arcane Tradition'],[18,'Spell Mastery'],[20,'Signature Spells']],
  };
  const ASI = {Fighter:[4,6,8,12,14,16,19],Rogue:[4,8,10,12,16,19],default:[4,8,12,16,19]};
  const FULL_SLOTS = {1:[2],2:[3],3:[4,2],4:[4,3],5:[4,3,2],6:[4,3,3],7:[4,3,3,1],8:[4,3,3,2],9:[4,3,3,3,1],10:[4,3,3,3,2],11:[4,3,3,3,2,1],12:[4,3,3,3,2,1],13:[4,3,3,3,2,1,1],14:[4,3,3,3,2,1,1],15:[4,3,3,3,2,1,1,1],16:[4,3,3,3,2,1,1,1],17:[4,3,3,3,2,1,1,1,1],18:[4,3,3,3,3,1,1,1,1],19:[4,3,3,3,3,2,1,1,1],20:[4,3,3,3,3,2,2,1,1]};
  const ARMOR = {'Padded':[11,null],'Leather Armor':[11,null],'Studded Leather':[12,null],'Hide Armor':[12,2],'Chain Shirt':[13,2],'Scale Mail':[14,2],'Breastplate':[14,2],'Half Plate':[15,2],'Ring Mail':[14,0],'Chain Mail':[16,0],'Splint':[17,0],'Plate':[18,0]};
  const WEAPONS = {'Dagger':['1d4','piercing','dexterity','20/60 ft'],'Greataxe':['1d12','slashing','strength','5 ft'],'Handaxe':['1d6','slashing','strength','20/60 ft'],'Javelin':['1d6','piercing','strength','30/120 ft'],'Light Crossbow':['1d8','piercing','dexterity','80/320 ft'],'Longbow':['1d8','piercing','dexterity','150/600 ft'],'Longsword':['1d8','slashing','strength','5 ft'],'Mace':['1d6','bludgeoning','strength','5 ft'],'Quarterstaff':['1d6','bludgeoning','strength','5 ft'],'Rapier':['1d8','piercing','dexterity','5 ft'],'Scimitar':['1d6','slashing','dexterity','5 ft'],'Shortbow':['1d6','piercing','dexterity','80/320 ft'],'Shortsword':['1d6','piercing','dexterity','5 ft'],'Spear':['1d6','piercing','strength','20/60 ft'],'Whip':['1d4','slashing','dexterity','10 ft']};
  const LYKAN = {3:[['Heightened Senses','Advantage on Wisdom (Perception) checks relying on hearing or smell.'],['Hybrid Transformation','Transform into a hybrid form and gain resilient hide, predatory strikes, and bloodlust.']],7:[["Stalker's Prowess",'Improves speed, jumping, and predatory strikes while transformed.']],11:[['Advanced Transformation','Improved transformation and +2 predatory-strike attack bonus.']],15:[['Brand of the Voracious','Your Brand of Castigation empowers attacks against the branded creature.']],18:[['Hybrid Transformation Mastery','Predatory-strike attack bonus becomes +3 and transformation is mastered.']]};

  const clone = value => JSON.parse(JSON.stringify(value));
  const uid = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const mod = score => Math.floor((Number(score || 10) - 10) / 2);
  const prof = level => 2 + Math.floor((Math.max(1, Number(level || 1)) - 1) / 4);
  const baseName = value => String(value || '').replace(/\s*\+[0-9]+\s*/g, ' ').trim().replace(/^Wooden Shield$/,'Shield').replace(/^Luckstone$/,'Stone of Good Luck');
  const bonus = item => Number(item.magic_bonus ?? item.enhancement_bonus ?? (String(item.name || '').match(/(?:^|\s)\+([0-9]+)(?:\s|$)/)?.[1] || 0));
  const kind = item => String(item.type || (ARMOR[baseName(item.name)] ? 'armor' : baseName(item.name) === 'Shield' ? 'shield' : WEAPONS[baseName(item.name)] ? 'weapon' : 'gear')).toLowerCase();
  const itemActive = item => !(item.requires_attunement && !item.attuned) && (['armor','shield','weapon'].includes(kind(item)) ? !!item.equipped : !!(item.active || item.attuned || item.equipped));

  function effects(character) {
    const total = {ac:0,saving_throws:0,ability_checks:0,initiative:0,speed:0,max_hp:0,attack:0,damage:0,sources:[]};
    [...(character.inventory || []), ...(character.active_spells || [])].forEach(item => {
      if ((character.inventory || []).includes(item) && !itemActive(item)) return;
      let data = item.effects && typeof item.effects === 'object' ? item.effects : {};
      if (/stone of good luck|luckstone/i.test(item.name || '')) data = {...data,saving_throws:1,ability_checks:1};
      Object.keys(total).filter(key => key !== 'sources').forEach(key => {
        const value = Number(data[key] || 0);
        if (value) { total[key] += value; total.sources.push({source:item.name || 'Effect',effect:key,value}); }
      });
    });
    return total;
  }

  function classes(character) {
    let rows = Array.isArray(character.classes) ? character.classes.filter(row => CLASSES[row.name]).map(row => ({name:row.name,level:Math.max(1,Number(row.level || 1)),subclass:row.subclass || ''})) : [];
    if (!rows.length) rows = [{name:character.character_class || 'Fighter',level:Math.max(1,Number(character.level || 1)),subclass:character.subclass || ''}];
    character.classes = rows; character.level = rows.reduce((sum,row) => sum + row.level,0); character.character_class = rows[0].name; character.subclass = rows[0].subclass || '';
    return rows;
  }

  function spellSlots(rows) {
    let level = 0;
    rows.forEach(row => {
      let caster = CLASSES[row.name]?.caster;
      if ((row.name === 'Fighter' && row.subclass === 'Eldritch Knight') || (row.name === 'Rogue' && row.subclass === 'Arcane Trickster')) caster = 'third';
      if (caster === 'full') level += row.level;
      else if (caster === 'half') level += Math.floor(row.level / 2);
      else if (caster === 'half_up') level += Math.ceil(row.level / 2);
      else if (caster === 'third') level += Math.floor(row.level / 3);
    });
    return Object.fromEntries((FULL_SLOTS[Math.min(20,level)] || []).map((value,index) => [String(index + 1),value]));
  }

  function acBreakdown(character) {
    const dex = mod(character.ability_scores?.dexterity), active = (character.inventory || []).filter(item => item.equipped && itemActive(item));
    let rows = [], total;
    if (character.armor_class_override !== undefined && character.armor_class_override !== null && character.armor_class_override !== '') {
      total = Number(character.armor_class_override); rows.push({name:'Manual AC Override',calculation:String(total),value:total});
    } else {
      const armor = active.find(item => kind(item) === 'armor');
      if (armor) { const rule = ARMOR[baseName(armor.name)] || [10,0], dexPart = rule[1] === null ? dex : Math.min(dex,rule[1]), value = rule[0] + dexPart + bonus(armor); total = value; rows.push({name:armor.name,calculation:`${rule[0]} ${dexPart >= 0 ? '+' : ''}${dexPart} Dexterity${bonus(armor) ? ` +${bonus(armor)} magic` : ''}`,value}); }
      else if (character.race === 'Tortle') { total = 17; rows.push({name:'Natural Armor',calculation:'17',value:17}); }
      else { const extra = character.character_class === 'Monk' ? mod(character.ability_scores?.wisdom) : character.character_class === 'Barbarian' ? mod(character.ability_scores?.constitution) : 0; total = 10 + dex + extra; rows.push({name:'Unarmored',calculation:`10 ${dex >= 0 ? '+' : ''}${dex} Dexterity${extra ? ` ${extra >= 0 ? '+' : ''}${extra}` : ''}`,value:total}); }
      const shield = active.find(item => kind(item) === 'shield');
      if (shield) { const value = 2 + bonus(shield); total += value; rows.push({name:shield.name,calculation:`+2 shield${bonus(shield) ? ` +${bonus(shield)} magic` : ''}`,value}); }
      active.filter(item => !['armor','shield'].includes(kind(item))).forEach(item => { const value = Number(item.ac_bonus || 0); if (value) { total += value; rows.push({name:item.name,calculation:`${value >= 0 ? '+' : ''}${value} item bonus`,value}); } });
      effects(character).sources.filter(row => row.effect === 'ac').forEach(row => { total += row.value; rows.push({name:row.source,calculation:`${row.value >= 0 ? '+' : ''}${row.value} effect`,value:row.value}); });
    }
    rows.push({name:'Total Armor Class',calculation:'Final total',value:total,summary:true}); return rows;
  }

  function recalc(character) {
    const rows = classes(character), level = character.level, proficiency = prof(level), scores = character.ability_scores ||= {}, mods = Object.fromEntries(ABILITIES.map(a => [a,mod(scores[a])]));
    const active = effects(character), saveProfs = new Set(character.saving_throw_proficiencies || []), skillProfs = new Set(character.skill_proficiencies || []);
    const saves = Object.fromEntries(ABILITIES.map(a => [a,mods[a] + (saveProfs.has(a) ? proficiency : 0) + active.saving_throws]));
    const skills = Object.fromEntries(Object.entries(SKILLS).map(([skill,a]) => [skill,mods[a] + (skillProfs.has(skill) ? proficiency : 0) + active.ability_checks]));
    const firstCaster = rows.find(row => CLASSES[row.name]?.spell || (row.name === 'Fighter' && row.subclass === 'Eldritch Knight') || (row.name === 'Rogue' && row.subclass === 'Arcane Trickster'));
    const derived = {modifiers:mods,proficiency_bonus:proficiency,saving_throws:saves,skills,initiative:mods.dexterity + active.initiative,passive_perception:10 + skills.Perception,armor_class:acBreakdown(character).at(-1).value,effect_sources:active.sources,speed_bonus:active.speed};
    if (firstCaster) { const ability = character.spellcasting_ability_override || CLASSES[firstCaster.name]?.spell || 'intelligence'; derived.spellcasting_ability = ability; derived.spell_save_dc = 8 + proficiency + mods[ability]; derived.spell_attack_bonus = proficiency + mods[ability]; }
    character.derived = derived;
    if (rows.length > 1) character.spell_slots_max = spellSlots(rows);
    character.spell_slots_used ||= {}; Object.entries(character.spell_slots_max || {}).forEach(([key,max]) => character.spell_slots_used[key] = Math.max(0,Math.min(max,Number(character.spell_slots_used[key] || 0))));
    character.updated_at = new Date().toISOString(); return character;
  }

  function attacks(character) {
    recalc(character); const global = effects(character);
    return (character.inventory || []).filter(item => item.equipped && kind(item) === 'weapon').map(item => {
      const data = WEAPONS[baseName(item.name)] || [item.damage || '—',item.damage_type || 'weapon',String(item.ability || 'strength').toLowerCase(),item.range || '5 ft'];
      const ability = String(item.ability || data[2]).toLowerCase(), abilityMod = mod(character.ability_scores?.[ability]), magic = bonus(item);
      return {name:item.name,attack_bonus:prof(character.level) + abilityMod + magic + global.attack + Number(item.attack_bonus_extra || 0),damage:`${data[0]}${abilityMod + magic + global.damage + Number(item.damage_bonus_extra || 0) >= 0 ? '+' : ''}${abilityMod + magic + global.damage + Number(item.damage_bonus_extra || 0)} ${data[1]}`,range:data[3]};
    });
  }

  function shortRest(character) { (character.feature_records || []).forEach(r => { if (r.recharge === 'short') r.uses_used = 0; }); return recalc(character); }
  function longRest(character) { character.current_hp = character.max_hp; character.temporary_hp = 0; character.death_save_successes = 0; character.death_save_failures = 0; character.hit_dice_used = Math.max(0,Number(character.hit_dice_used || 0) - Math.max(1,Math.floor(character.level / 2))); Object.keys(character.spell_slots_used || {}).forEach(key => character.spell_slots_used[key] = 0); (character.feature_records || []).forEach(r => { if (['short','long'].includes(r.recharge)) r.uses_used = 0; }); return recalc(character); }
  function takeDamage(character, amount) { let remaining = Math.max(0,Number(amount || 0)), temp = Number(character.temporary_hp || 0); const absorbed = Math.min(temp,remaining); character.temporary_hp = temp - absorbed; remaining -= absorbed; character.current_hp = Math.max(0,Number(character.current_hp || 0) - remaining); return recalc(character); }
  function heal(character, amount) { character.current_hp = Math.min(Number(character.max_hp || 1),Number(character.current_hp || 0) + Math.max(0,Number(amount || 0))); return recalc(character); }

  function levelInfo(character, className) {
    const entry = classes(clone(character)).find(row => row.name === className), nextClassLevel = (entry?.level || 0) + 1, info = CLASSES[className];
    return {className,nextClassLevel,hitDie:info.die,requiresSubclass:nextClassLevel === info.sub && !(entry?.subclass),subclasses:info.subs,asi:(ASI[className] || ASI.default).includes(nextClassLevel),features:(FEATURES[className] || []).filter(([level]) => level === nextClassLevel).map(([,name]) => name)};
  }

  function applyLevelUp(character, choice, featRecord) {
    const info = levelInfo(character,choice.className), rows = classes(character), entry = rows.find(row => row.name === choice.className) || {name:choice.className,level:0,subclass:''}; if (!rows.includes(entry)) rows.push(entry);
    if (info.requiresSubclass) entry.subclass = choice.subclass || info.subclasses[0] || '';
    const dieRoll = choice.hpMode === 'physical' ? Number(choice.physicalRoll) : choice.hpMode === 'roll' ? 1 + Math.floor(Math.random() * info.hitDie) : Math.floor(info.hitDie / 2) + 1;
    if (dieRoll < 1 || dieRoll > info.hitDie) throw new Error(`Enter a physical d${info.hitDie} result from 1 to ${info.hitDie}.`);
    const hpGain = Math.max(1,dieRoll + mod(character.ability_scores?.constitution)) + ((character.feature_records || []).some(row => row.name?.toLowerCase() === 'tough') ? 2 : 0);
    entry.level += 1; character.classes = rows; character.level = rows.reduce((sum,row) => sum + row.level,0); character.max_hp = Number(character.max_hp || 1) + hpGain; character.current_hp = Number(character.current_hp || 0) + hpGain; character.hit_dice_by_class ||= {}; character.hit_dice_by_class[entry.name] = `${entry.level}d${info.hitDie}`;
    character.feature_records ||= []; const known = new Set(character.feature_records.map(row => row.name?.toLowerCase()));
    info.features.forEach(name => { if (!known.has(name.toLowerCase())) character.feature_records.push({id:uid(),name,source:entry.name === character.character_class ? 'Class' : `Class: ${entry.name}`,description:'Unlocked at this class level.',max_uses:0,uses_used:0,recharge:'passive',effects:{}}); });
    if (entry.name === 'Blood Hunter' && entry.subclass === 'Order of the Lycan') (LYKAN[entry.level] || []).forEach(([name,description]) => { if (!known.has(name.toLowerCase())) character.feature_records.push({id:uid(),name,source:'Order of the Lycan',description,max_uses:name === 'Hybrid Transformation' ? 2 : 0,uses_used:0,recharge:name === 'Hybrid Transformation' ? 'short' : 'passive',effects:{}}); });
    if (info.asi && choice.asiType === 'ability') { const ability = choice.ability || 'strength'; character.ability_scores[ability] = Math.min(20,Number(character.ability_scores[ability] || 10) + 2); if (character.base_ability_scores?.[ability] !== undefined) character.base_ability_scores[ability] = Math.min(20,Number(character.base_ability_scores[ability]) + 2); }
    if (info.asi && choice.asiType === 'feat' && featRecord) { const record = {id:uid(),name:featRecord.name,source:'Feat',description:featRecord.description || 'Selected during level up.',max_uses:0,uses_used:0,recharge:'passive',effects:featRecord.name?.toLowerCase() === 'tough' ? {hp_per_level:2} : (featRecord.effects || {})}; character.feature_records.push(record); if (record.effects.hp_per_level) { const increase = Number(record.effects.hp_per_level) * character.level; character.max_hp += increase; character.current_hp += increase; } }
    character.features = character.feature_records.map(row => row.name); character.spell_slots_max = spellSlots(rows); character.spell_slots_used = Object.fromEntries(Object.entries(character.spell_slots_max).map(([key,max]) => [key,Math.min(max,Number(character.spell_slots_used?.[key] || 0))])); recalc(character);
    return {hpGain,dieRoll,classLevel:entry.level,totalLevel:character.level,features:info.features,subclass:entry.subclass};
  }

  window.DndEngine = {ABILITIES,SKILLS,CLASSES,FEATURES,clone,uid,mod,prof,classes,effects,recalc,attacks,acBreakdown,shortRest,longRest,takeDamage,heal,levelInfo,applyLevelUp,spellSlots,kind,itemActive};
})();
