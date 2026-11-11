const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

global.window = {};
eval(fs.readFileSync('dnd/engine.js', 'utf8'));
const E = window.DndEngine;

function character(className = 'Blood Hunter') {
  const info = E.CLASSES[className];
  const scores = {strength:16,dexterity:16,constitution:16,intelligence:16,wisdom:14,charisma:16};
  return E.recalc({id:`test-${className}`,name:`${className} Test`,race:'Human',character_class:className,
    classes:[{name:className,level:1,subclass:info.sub===1?info.subs[0]:''}],subclass:info.sub===1?info.subs[0]:'',level:1,
    ability_scores:scores,base_ability_scores:{...scores},current_hp:info.die+3,max_hp:info.die+3,temporary_hp:0,speed:30,
    movement:{walk:30,swim:0,fly:0,long_jump:16,high_jump:6},saving_throw_proficiencies:[],skill_proficiencies:[],inventory:[],
    feature_records:[],features:[],spells:[],prepared_spells:[],spell_metadata:{},spell_slots_max:{},spell_slots_used:{},active_spells:[],conditions:[]});
}

function thorin() {
  const row=character();
  Object.assign(row,{
    id:'thorin-fixture',name:'Thorin',race:'Half-Orc',character_class:'Blood Hunter',level:13,
    classes:[{name:'Blood Hunter',level:12,subclass:'Order of the Lycan'},{name:'Paladin',level:1,subclass:''}],
    ability_scores:{strength:13,dexterity:16,constitution:18,intelligence:16,wisdom:15,charisma:11},
    saving_throw_proficiencies:['dexterity','intelligence'],
    skill_proficiencies:['History','Insight','Intimidation','Investigation','Medicine','Perception','Survival'],
    movement:{walk:45,swim:0,fly:0,long_jump:10,high_jump:15},speed:45,
    inventory:[
      {id:'half-plate',name:'Half Plate',type:'armor',equipped:true,attuned:false,effects:{},notes:'Base AC 15 plus Dexterity up to +2.'},
      {id:'shield',name:'Shield',type:'shield',equipped:true,attuned:false,effects:{},notes:'+2 AC.'},
      {id:'shield-plus-two',name:'Shield +2',type:'shield',equipped:false,attuned:false,effects:{}},
      {id:'dwarven-plate',name:'Dwarven Plate Armor',type:'armor',equipped:false,attuned:false,effects:{}},
      {id:'ring',name:'Ring of Protection +2',type:'ring',equipped:true,attuned:true,active:true,effects:{ac:2,saving_throws:2}},
      {id:'luckstone',name:'Stone of Good Luck',type:'wondrous item',equipped:false,attuned:true,active:true,effects:{saving_throws:1,ability_checks:1}},
      {id:'rapier',name:'Rapier +1',type:'weapon',equipped:false,attuned:false,effects:{},magic_bonus:1,damage:'1d8',damage_type:'piercing',ability:'Dexterity',range:'5 ft',attack_bonus_extra:0,damage_bonus_extra:4,notes:'Finesse.'},
      {id:'crossbow',name:'Light Crossbow',type:'weapon',equipped:false,attuned:false,effects:{},magic_bonus:0,damage:'1d8',damage_type:'piercing',ability:'Dexterity',range:'80/320 ft',attack_bonus_extra:0,damage_bonus_extra:0,notes:'Ammunition, loading, two-handed.'},
      {id:'mace',name:'Mace of Disruption',type:'weapon',equipped:false,attuned:false,effects:{},magic_bonus:0,damage:'1d6',damage_type:'bludgeoning',ability:'Strength',range:'5 ft',attack_bonus_extra:0,damage_bonus_extra:0,notes:'Magical.'}
    ],
    feature_records:[
      {id:'hybrid',name:'Hybrid Transformation',source:'Order of the Lycan',active:false,effects:{}},
      {id:'hide',name:'Resilient Hide',source:'Order of the Lycan',effects:{}},
      {id:'prowess',name:"Stalker's Prowess",source:'Order of the Lycan',effects:{}},
      {id:'improved-strikes',name:'Improved Predatory Strikes',source:'Order of the Lycan',effects:{}}
    ]
  });
  return E.recalc(row);
}

test('Thorin workbook values recalculate from live toggles', () => {
  const row=thorin();
  const hybrid=row.feature_records.find(x=>x.name==='Hybrid Transformation');
  hybrid.active=false;E.recalc(row);
  assert.equal(row.derived.armor_class,21,'half plate 17 + shield 2 + ring 2');
  assert.equal(row.derived.speed_bonus,0);
  assert.equal(row.derived.saving_throws.dexterity,11,'DEX 3 + proficiency 5 + luckstone 1 + ring 2');
  assert.equal(row.derived.skills.Perception,8,'WIS 2 + proficiency 5 + luckstone 1');
  hybrid.active=true;E.recalc(row);
  assert.equal(row.derived.armor_class,22,'Resilient Hide adds exactly one AC');
  assert.equal(row.derived.speed_bonus,10,"Stalker's Prowess adds ten feet");
  assert.equal(E.weaponRows(row)[0].name,'Hybrid Unarmed Strike');
  assert.equal(E.weaponRows(row)[0].equipped,true);
  hybrid.active=false;E.recalc(row);
  assert.ok(!E.weaponRows(row).some(x=>x.name==='Hybrid Unarmed Strike'),'hybrid strike disappears outside hybrid form');
});

test('skill and saving throw checkboxes are live calculation inputs', () => {
  const row=character();
  assert.equal(row.derived.skills.Athletics,3);
  row.skill_proficiencies=['Athletics'];E.recalc(row);
  assert.equal(row.derived.skills.Athletics,5);
  row.skill_expertise=['Athletics'];E.recalc(row);
  assert.equal(row.derived.skills.Athletics,7);
  assert.equal(row.derived.saving_throws.dexterity,3);
  row.saving_throw_proficiencies=['dexterity'];E.recalc(row);
  assert.equal(row.derived.saving_throws.dexterity,5);
});

test('armor inventory can be equipped and unequipped with live AC calculations', () => {
  const row=thorin();
  assert.equal(row.derived.armor_class,21);
  assert.ok(E.armorRows(row).some(item=>item.id==='dwarven-plate'&&!item.equipped),'unequipped inventory armor is available');
  E.setEquipped(row,'shield',false);assert.equal(row.derived.armor_class,19,'shield can be removed');
  E.setEquipped(row,'shield-plus-two',true);assert.equal(row.derived.armor_class,23,'magic shield replaces the shield');
  assert.equal(row.inventory.find(item=>item.id==='shield').equipped,false);
  E.setEquipped(row,'dwarven-plate',true);assert.equal(row.derived.armor_class,26,'Dwarven Plate uses plate AC plus two magic');
  assert.equal(row.inventory.find(item=>item.id==='half-plate').equipped,false);
  E.setEquipped(row,'ring',false);assert.equal(row.derived.armor_class,24,'unequipped protection ring stops applying despite attunement');
});

test('damage, healing, temporary HP, and rests obey boundaries', () => {
  const row=character();row.max_hp=20;row.current_hp=20;row.temporary_hp=7;row.hit_dice_used=6;row.level=10;row.classes=[{name:'Blood Hunter',level:10,subclass:'Order of the Lycan'}];row.spell_slots_max={'1':4};row.spell_slots_used={'1':3};
  E.takeDamage(row,5);assert.equal(row.temporary_hp,2);assert.equal(row.current_hp,20);
  E.takeDamage(row,8);assert.equal(row.temporary_hp,0);assert.equal(row.current_hp,14);
  E.heal(row,99);assert.equal(row.current_hp,20);
  row.current_hp=3;E.longRest(row);assert.equal(row.current_hp,20);assert.equal(row.hit_dice_used,1);assert.equal(row.spell_slots_used['1'],0);
});

test('weapon equipment and Crimson Rite recalculate per weapon', () => {
  const row=thorin(),rapier=row.inventory.find(x=>x.name==='Rapier +1');
  rapier.equipped=true;rapier.crimson_rite=false;let weapon=E.weaponRows(row).find(x=>x.id===rapier.id);
  assert.equal(weapon.attack_bonus,9);assert.ok(!weapon.damage_roll.includes('1d8 + 1d8'));
  rapier.crimson_rite=true;weapon=E.weaponRows(row).find(x=>x.id===rapier.id);
  assert.match(weapon.damage_roll,/1d8 \+ 1d8/);
  rapier.equipped=false;assert.ok(!E.attacks(row).some(x=>x.id===rapier.id));
});

test('clickable stat breakdowns name every contributing source', () => {
  const row=thorin(),hybrid=row.feature_records.find(x=>x.name==='Hybrid Transformation');
  hybrid.active=true;E.recalc(row);
  const speed=E.statBreakdown(row,'speed');
  assert.equal(speed.value,55);
  assert.deepEqual(speed.rows.map(x=>x.name),['Half-Orc — Base Walking Speed',"Stalker's Prowess"]);
  const armor=E.statBreakdown(row,'armor_class');
  assert.equal(armor.value,22);
  assert.ok(armor.rows.some(x=>x.name==='Half Plate'));
  assert.ok(armor.rows.some(x=>x.name==='Resilient Hide'));
});

test('death saves follow the campaign house rule and never alter HP', () => {
  const row=character();row.current_hp=0;
  let result=E.applyDeathSave(row,20);
  assert.equal(result.successes,2);assert.equal(row.current_hp,0);assert.equal(row.death_save_successes,2);
  result=E.applyDeathSave(row,10);
  assert.equal(result.life_state,'stable');assert.equal(row.current_hp,0);
  const failed=character();failed.current_hp=0;
  E.applyDeathSave(failed,1);result=E.applyDeathSave(failed,5);
  assert.equal(result.life_state,'dead');assert.equal(failed.death_save_failures,3);
});

test('Paladin 2 multiclass caster level has two first-level slots', () => {
  const row=character();row.classes=[{name:'Blood Hunter',level:12,subclass:'Order of the Lycan'},{name:'Paladin',level:2,subclass:''}];
  E.recalc(row);
  assert.deepEqual(row.spell_slots_max,{'1':2});
});

test('Blood Hunter Lycan 6 into Paladin 4 remains valid', () => {
  const row=character(),tough={name:'Tough',description:'Hit point maximum increases.',effects:{hp_per_level:2}},alert={name:'Alert',description:'Always on the lookout.',effects:{}};
  for(let next=2;next<=6;next++) E.applyLevelUp(row,{className:'Blood Hunter',hpMode:'average',subclass:next===3?'Order of the Lycan':'',asiType:next===4?'feat':''},next===4?tough:null);
  for(let next=1;next<=4;next++) E.applyLevelUp(row,{className:'Paladin',hpMode:'average',subclass:next===3?'Vengeance':'',asiType:next===4?'feat':''},next===4?alert:null);
  assert.equal(row.level,10);assert.deepEqual(row.classes.map(x=>[x.name,x.level]),[['Blood Hunter',6],['Paladin',4]]);
  assert.ok(row.feature_records.some(x=>x.name==='Hybrid Transformation'));assert.ok(row.feature_records.some(x=>x.name==='Divine Smite'));
  assert.equal(row.feature_records.find(x=>x.name==='Tough').description,tough.description);assert.deepEqual(row.spell_slots_max,{'1':3});
});

test('every class reaches level 20 with subclass, ASI, and derived values', () => {
  for(const [name,info] of Object.entries(E.CLASSES)){const row=character(name);for(let next=2;next<=20;next++)E.applyLevelUp(row,{className:name,hpMode:'average',subclass:next===info.sub?info.subs[0]:'',asiType:next%4===0?'ability':'',ability:'constitution'},null);assert.equal(row.level,20,name);assert.ok(row.classes[0].subclass,name);assert.equal(row.derived.proficiency_bonus,6,name);}
});
