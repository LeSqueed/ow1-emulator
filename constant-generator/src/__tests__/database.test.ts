import { DatabaseService } from '../services/database';
import * as fs from 'fs';
import * as path from 'path';

const TEST_DB_PATH = './data/test-constants.json';

describe('DatabaseService', () => {
  let db: DatabaseService;

  beforeEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    db = new DatabaseService({ path: TEST_DB_PATH });
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  describe('initialize', () => {
    it('should create empty database if file does not exist', async () => {
      await db.initialize();
      const constants = db.getAllConstants();
      expect(constants).toEqual([]);
    });

    it('should load existing data if file exists', async () => {
      const dir = path.dirname(TEST_DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(TEST_DB_PATH, JSON.stringify({
        constants: [{ id: 1, constant_name: 'TEST', display_name: 'Test', live_value: 20, patched_value: 10 }],
        heroes: [],
        abilities: [],
        ability_properties: [],
        revisions: []
      }));

      const db2 = new DatabaseService({ path: TEST_DB_PATH });
      await db2.initialize();
      const constants = db2.getAllConstants();
      expect(constants.length).toBe(1);
      expect(constants[0].constant_name).toBe('TEST');
      db2.close();
    });
  });

  describe('constants', () => {
    beforeEach(async () => {
      await db.initialize();
    });

    it('should create a constant', async () => {
      const id = await db.createConstant({
        constant_name: 'OW1_MELEE_DAMAGE',
        display_name: 'OW1 Melee Damage',
        live_value: 40,
        patched_value: 30,
      });

      expect(id).toBeGreaterThan(0);
      const constants = db.getAllConstants();
      expect(constants.length).toBe(1);
      expect(constants[0].constant_name).toBe('OW1_MELEE_DAMAGE');
      expect(constants[0].live_value).toBe(40);
      expect(constants[0].patched_value).toBe(30);
    });

    it('should update a constant', async () => {
      const id = await db.createConstant({
        constant_name: 'TEST_CONSTANT',
        display_name: 'Test Constant',
        live_value: 10,
        patched_value: 10,
      });

      await db.updateConstant(id, { patched_value: 20 });
      const constants = db.getAllConstants();
      expect(constants[0].patched_value).toBe(20);
    });

    it('should delete a constant', async () => {
      const id = await db.createConstant({
        constant_name: 'TO_DELETE',
        display_name: 'To Delete',
        live_value: 5,
        patched_value: 5,
      });

      await db.deleteConstant(id);
      const constants = db.getAllConstants();
      expect(constants.length).toBe(0);
    });
  });

  describe('heroes', () => {
    beforeEach(async () => {
      await db.initialize();
    });

    it('should create a hero', async () => {
      const id = await db.createHero({
        display_name: 'Ana',
        constant_name: 'ana',
        role: 'Support',
        live_health: 200,
        patched_health: 200,
        live_armor: 50,
        patched_armor: 50,
        live_shields: 0,
        patched_shields: 0,
        live_ult_cost: 2000,
        patched_ult_cost: 2250,
      });

      expect(id).toBeGreaterThan(0);
      const heroes = db.getAllHeroes();
      expect(heroes.length).toBe(1);
      expect(heroes[0].constant_name).toBe('ana');
      expect(heroes[0].display_name).toBe('Ana');
      expect(heroes[0].role).toBe('Support');
      expect(heroes[0].live_health).toBe(200);
      expect(heroes[0].patched_ult_cost).toBe(2250);
    });

    it('should update a hero', async () => {
      const id = await db.createHero({
        display_name: 'Bastion',
        constant_name: 'bastion',
        role: 'Dps',
        live_health: 200,
        patched_health: 200,
        live_armor: 100,
        patched_armor: 100,
        live_shields: 0,
        patched_shields: 0,
        live_ult_cost: 1680,
        patched_ult_cost: 1680,
      });

      await db.updateHero(id, { role: 'Tank' });
      const heroes = db.getAllHeroes();
      expect(heroes[0].role).toBe('Tank');
    });

    it('should delete a hero', async () => {
      const id = await db.createHero({
        display_name: 'Tracer',
        constant_name: 'tracer',
        role: 'Dps',
        live_health: 150,
        patched_health: 150,
        live_armor: 0,
        patched_armor: 0,
        live_shields: 0,
        patched_shields: 0,
        live_ult_cost: 1125,
        patched_ult_cost: 1125,
      });

      await db.deleteHero(id);
      const heroes = db.getAllHeroes();
      expect(heroes.length).toBe(0);
    });

    it('should cascade delete abilities and properties when hero is deleted', async () => {
      const heroId = await db.createHero({
        display_name: 'Ana',
        constant_name: 'ana',
        role: 'Support',
        live_health: 200,
        patched_health: 200,
        live_armor: 50,
        patched_armor: 50,
        live_shields: 0,
        patched_shields: 0,
        live_ult_cost: 2000,
        patched_ult_cost: 2000,
      });

      const abilityId = await db.createAbility({ hero_id: heroId, display_name: 'Biotic Grenade', constant_name: 'biotic_grenade' });
      await db.createAbilityProperty({ ability_id: abilityId, name: 'damage', live_value: 60, patched_value: 50 });

      await db.deleteHero(heroId);

      expect(db.getAllHeroes().length).toBe(0);
      expect(db.getAllAbilities().length).toBe(0);
      expect(db.getAllAbilityProperties().length).toBe(0);
    });
  });

  describe('abilities', () => {
    let heroId: number;

    beforeEach(async () => {
      await db.initialize();
      heroId = await db.createHero({
        display_name: 'Ana',
        constant_name: 'ana',
        role: 'Support',
        live_health: 200,
        patched_health: 200,
        live_armor: 50,
        patched_armor: 50,
        live_shields: 0,
        patched_shields: 0,
        live_ult_cost: 2000,
        patched_ult_cost: 2000,
      });
    });

    it('should create an ability', async () => {
      const id = await db.createAbility({
        hero_id: heroId,
        display_name: 'Biotic Grenade',
        constant_name: 'biotic_grenade',
      });

      expect(id).toBeGreaterThan(0);
      const abilities = db.getAbilitiesByHeroId(heroId);
      expect(abilities.length).toBe(1);
      expect(abilities[0].constant_name).toBe('biotic_grenade');
      expect(abilities[0].hero_id).toBe(heroId);
    });

    it('should update an ability', async () => {
      const id = await db.createAbility({
        hero_id: heroId,
        display_name: 'Biotic Grenade',
        constant_name: 'biotic_grenade',
      });

      await db.updateAbility(id, { display_name: 'Biotic Bomb' });
      const abilities = db.getAbilitiesByHeroId(heroId);
      expect(abilities[0].display_name).toBe('Biotic Bomb');
    });

    it('should delete an ability and cascade properties', async () => {
      const id = await db.createAbility({
        hero_id: heroId,
        display_name: 'Biotic Grenade',
        constant_name: 'biotic_grenade',
      });
      await db.createAbilityProperty({ ability_id: id, name: 'damage', live_value: 60, patched_value: 50 });

      await db.deleteAbility(id);
      expect(db.getAllAbilities().length).toBe(0);
      expect(db.getAllAbilityProperties().length).toBe(0);
    });
  });

  describe('ability properties', () => {
    let abilityId: number;

    beforeEach(async () => {
      await db.initialize();
      const heroId = await db.createHero({
        display_name: 'Ana',
        constant_name: 'ana',
        role: 'Support',
        live_health: 200,
        patched_health: 200,
        live_armor: 50,
        patched_armor: 50,
        live_shields: 0,
        patched_shields: 0,
        live_ult_cost: 2000,
        patched_ult_cost: 2000,
      });
      abilityId = await db.createAbility({
        hero_id: heroId,
        display_name: 'Biotic Grenade',
        constant_name: 'biotic_grenade',
      });
    });

    it('should create an ability property', async () => {
      const id = await db.createAbilityProperty({
        ability_id: abilityId,
        name: 'damage',
        live_value: 60,
        patched_value: 50,
      });

      expect(id).toBeGreaterThan(0);
      const props = db.getAbilityPropertiesByAbilityId(abilityId);
      expect(props.length).toBe(1);
      expect(props[0].name).toBe('damage');
      expect(props[0].live_value).toBe(60);
      expect(props[0].patched_value).toBe(50);
    });

    it('should update an ability property', async () => {
      const id = await db.createAbilityProperty({
        ability_id: abilityId,
        name: 'damage',
        live_value: 60,
        patched_value: 50,
      });

      await db.updateAbilityProperty(id, { patched_value: 40 });
      const props = db.getAbilityPropertiesByAbilityId(abilityId);
      expect(props[0].patched_value).toBe(40);
    });

    it('should delete an ability property', async () => {
      const id = await db.createAbilityProperty({
        ability_id: abilityId,
        name: 'damage',
        live_value: 60,
        patched_value: 50,
      });

      await db.deleteAbilityProperty(id);
      expect(db.getAbilityPropertiesByAbilityId(abilityId).length).toBe(0);
    });
  });
});
