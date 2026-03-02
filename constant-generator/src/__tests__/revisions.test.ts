import { DatabaseService } from '../services/database';
import * as fs from 'fs';

const TEST_DB_PATH = './data/test-revisions.json';

describe('Revision Tracking', () => {
  let db: DatabaseService;

  beforeEach(async () => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    db = new DatabaseService({ path: TEST_DB_PATH });
    await db.initialize();
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  it('should create a revision when creating a constant', async () => {
    await db.createConstant({
      constant_name: 'TEST_CONSTANT',
      display_name: 'Test Constant',
      live_value: 15,
      patched_value: 10,
    });

    const revisions = await db.getRevisions();
    expect(revisions.length).toBeGreaterThan(0);

    const createRevision = revisions.find(r => r.table_name === 'constants' && r.old_value === null);
    expect(createRevision).toBeDefined();
    expect(createRevision?.new_value).toContain('TEST_CONSTANT');
  });

  it('should create a revision when updating a constant', async () => {
    const id = await db.createConstant({
      constant_name: 'TEST_CONSTANT',
      display_name: 'Test Constant',
      live_value: 15,
      patched_value: 10,
    });

    await db.updateConstant(id, { patched_value: 20 });

    const revisions = await db.getRevisions();
    const updateRevision = revisions.find(
      r => r.table_name === 'constants' && r.field_name === 'patched_value'
    );
    expect(updateRevision).toBeDefined();
    expect(updateRevision?.old_value).toBe('10');
    expect(updateRevision?.new_value).toBe('20');
  });

  it('should create a revision when deleting a constant', async () => {
    const id = await db.createConstant({
      constant_name: 'TEST_CONSTANT',
      display_name: 'Test Constant',
      live_value: 15,
      patched_value: 10,
    });

    await db.deleteConstant(id);

    const revisions = await db.getRevisions();
    const deleteRevision = revisions.find(
      r => r.table_name === 'constants' && r.new_value === null
    );
    expect(deleteRevision).toBeDefined();
    expect(deleteRevision?.old_value).toContain('TEST_CONSTANT');
  });

  it('should create revisions for hero operations', async () => {
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

    await db.updateHero(heroId, { role: 'Dps' });
    await db.deleteHero(heroId);

    const revisions = await db.getRevisions();
    expect(revisions.length).toBeGreaterThanOrEqual(3);

    // Create revision
    const createRevision = revisions.find(
      r => r.table_name === 'heroes' && r.old_value === null
    );
    expect(createRevision).toBeDefined();
    expect(createRevision?.new_value).toContain('Ana');

    // Update revision for role field
    const updateRevision = revisions.find(
      r => r.table_name === 'heroes' && r.field_name === 'role'
    );
    expect(updateRevision).toBeDefined();
    expect(updateRevision?.old_value).toBe('Support');
    expect(updateRevision?.new_value).toBe('Dps');

    // Delete revision
    const deleteRevision = revisions.find(
      r => r.table_name === 'heroes' && r.new_value === null
    );
    expect(deleteRevision).toBeDefined();
    expect(deleteRevision?.old_value).toContain('ana');
  });

  it('should create revisions for ability operations', async () => {
    const heroId = await db.createHero({
      display_name: 'Ana',
      constant_name: 'ana',
      role: 'Support',
      live_health: 200,
      patched_health: 200,
      live_armor: 0,
      patched_armor: 0,
      live_shields: 0,
      patched_shields: 0,
      live_ult_cost: 2000,
      patched_ult_cost: 2000,
    });

    const abilityId = await db.createAbility({
      hero_id: heroId,
      display_name: 'Biotic Grenade',
      constant_name: 'biotic_grenade',
    });

    await db.updateAbility(abilityId, { display_name: 'Biotic Bomb' });

    const revisions = await db.getRevisions();
    const updateRevision = revisions.find(
      r => r.table_name === 'abilities' && r.field_name === 'display_name'
    );
    expect(updateRevision).toBeDefined();
    expect(updateRevision?.old_value).toBe('Biotic Grenade');
    expect(updateRevision?.new_value).toBe('Biotic Bomb');
  });
});
