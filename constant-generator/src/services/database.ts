import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/logger.js';
import type { Constant, Hero, Ability, AbilityProperty, Revision } from '../types/index.js';

const logger = new Logger('DatabaseService');

export type DatabaseConfig = {
  path: string;
};

interface DatabaseData {
  constants: Constant[];
  heroes: Hero[];
  abilities: Ability[];
  ability_properties: AbilityProperty[];
  revisions: Revision[];
}

export class DatabaseService {
  private dbPath: string;
  private data: DatabaseData;

  constructor(config: DatabaseConfig) {
    this.dbPath = config.path;
    this.data = {
      constants: [],
      heroes: [],
      abilities: [],
      ability_properties: [],
      revisions: []
    };
  }

  public async initialize(): Promise<void> {
    try {
      if (fs.existsSync(this.dbPath)) {
        const content = fs.readFileSync(this.dbPath, 'utf-8');
        this.data = JSON.parse(content);
        logger.info('Database loaded from file');
      } else {
        this.save();
        logger.info('Database initialized with empty data');
      }
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      this.data = { constants: [], heroes: [], abilities: [], ability_properties: [], revisions: [] };
      this.save();
    }
  }

  private save(): void {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
  }

  private nextId(items: { id: number }[]): number {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  }

  /** Strip undefined values so partial updates never overwrite existing fields with undefined. */
  private defined<T extends object>(data: T): Partial<T> {
    return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) as Partial<T>;
  }

  private addRevision(tableName: string, recordId: number, fieldName: string, oldValue: string | null, newValue: string | null): void {
    const revision: Revision = {
      id: this.nextId(this.data.revisions),
      table_name: tableName,
      record_id: recordId,
      field_name: fieldName,
      old_value: oldValue,
      new_value: newValue,
      updated_at: new Date().toISOString()
    };
    this.data.revisions.push(revision);
  }

  // ── Constants ──────────────────────────────────────────────────────────────

  public getAllConstants(): Constant[] {
    return this.data.constants;
  }

  /** @deprecated use getAllConstants */
  public getAllGlobalConstants(): Constant[] {
    return this.getAllConstants();
  }

  public async createConstant(data: Omit<Constant, 'id'>): Promise<number> {
    const id = this.nextId(this.data.constants);
    const record: Constant = { ...data, id };
    this.data.constants.push(record);
    this.addRevision('constants', id, '__create__', null, JSON.stringify(record));
    this.save();
    return id;
  }

  /** @deprecated use createConstant */
  public async createGlobalConstant(data: any): Promise<number> {
    return this.createConstant({
      display_name: data.displayName ?? data.display_name ?? '',
      constant_name: data.name ?? data.constant_name ?? '',
      live_value: data.ow2Value ?? data.live_value ?? 0,
      patched_value: data.ow1Value ?? data.patched_value ?? 0,
    });
  }

  public async updateConstant(id: number, data: Partial<Omit<Constant, 'id'>>): Promise<void> {
    const index = this.data.constants.findIndex(c => c.id === id);
    if (index === -1) return;
    const old = this.data.constants[index];
    const patch = this.defined(data);
    for (const key of Object.keys(patch) as (keyof typeof patch)[]) {
      const oldVal = String(old[key] ?? '');
      const newVal = String(patch[key] ?? '');
      if (oldVal !== newVal) {
        this.addRevision('constants', id, key, oldVal, newVal);
      }
    }
    this.data.constants[index] = { ...old, ...patch };
    this.save();
  }

  /** @deprecated use updateConstant */
  public async updateGlobalConstant(id: number, data: any): Promise<void> {
    const mapped: Partial<Omit<Constant, 'id'>> = {};
    if (data.display_name !== undefined) mapped.display_name = data.display_name;
    if (data.displayName !== undefined) mapped.display_name = data.displayName;
    if (data.constant_name !== undefined) mapped.constant_name = data.constant_name;
    if (data.name !== undefined) mapped.constant_name = data.name;
    if (data.live_value !== undefined) mapped.live_value = data.live_value;
    if (data.ow2Value !== undefined) mapped.live_value = data.ow2Value;
    if (data.patched_value !== undefined) mapped.patched_value = data.patched_value;
    if (data.ow1Value !== undefined) mapped.patched_value = data.ow1Value;
    return this.updateConstant(id, mapped);
  }

  public async deleteConstant(id: number): Promise<void> {
    const record = this.data.constants.find(c => c.id === id);
    if (record) {
      this.addRevision('constants', id, '__delete__', JSON.stringify(record), null);
    }
    this.data.constants = this.data.constants.filter(c => c.id !== id);
    this.save();
  }

  /** @deprecated use deleteConstant */
  public async deleteGlobalConstant(id: number): Promise<void> {
    return this.deleteConstant(id);
  }

  // ── Heroes ─────────────────────────────────────────────────────────────────

  public getAllHeroes(): Hero[] {
    return this.data.heroes;
  }

  public getHeroById(id: number): Hero | undefined {
    return this.data.heroes.find(h => h.id === id);
  }

  public async createHero(data: Omit<Hero, 'id'>): Promise<number> {
    const id = this.nextId(this.data.heroes);
    const record: Hero = { ...data, id };
    this.data.heroes.push(record);
    this.addRevision('heroes', id, '__create__', null, JSON.stringify(record));
    this.save();
    return id;
  }

  public async updateHero(id: number, data: Partial<Omit<Hero, 'id'>>): Promise<void> {
    const index = this.data.heroes.findIndex(h => h.id === id);
    if (index === -1) return;
    const old = this.data.heroes[index];
    const patch = this.defined(data);
    for (const key of Object.keys(patch) as (keyof typeof patch)[]) {
      const oldVal = String(old[key] ?? '');
      const newVal = String(patch[key] ?? '');
      if (oldVal !== newVal) {
        this.addRevision('heroes', id, key, oldVal, newVal);
      }
    }
    this.data.heroes[index] = { ...old, ...patch };
    this.save();
  }

  public async deleteHero(id: number): Promise<void> {
    const hero = this.data.heroes.find(h => h.id === id);
    if (!hero) return;

    // Cascade: delete abilities and their properties
    const heroAbilities = this.data.abilities.filter(a => a.hero_id === id);
    for (const ability of heroAbilities) {
      await this.deleteAbility(ability.id);
    }

    this.addRevision('heroes', id, '__delete__', JSON.stringify(hero), null);
    this.data.heroes = this.data.heroes.filter(h => h.id !== id);
    this.save();
  }

  // ── Abilities ──────────────────────────────────────────────────────────────

  public getAllAbilities(): Ability[] {
    return this.data.abilities;
  }

  public getAbilitiesByHeroId(heroId: number): Ability[] {
    return this.data.abilities.filter(a => a.hero_id === heroId);
  }

  public async createAbility(data: Omit<Ability, 'id'>): Promise<number> {
    const id = this.nextId(this.data.abilities);
    const record: Ability = { ...data, id };
    this.data.abilities.push(record);
    this.addRevision('abilities', id, '__create__', null, JSON.stringify(record));
    this.save();
    return id;
  }

  public async updateAbility(id: number, data: Partial<Omit<Ability, 'id'>>): Promise<void> {
    const index = this.data.abilities.findIndex(a => a.id === id);
    if (index === -1) return;
    const old = this.data.abilities[index];
    const patch = this.defined(data);
    for (const key of Object.keys(patch) as (keyof typeof patch)[]) {
      const oldVal = String(old[key] ?? '');
      const newVal = String(patch[key] ?? '');
      if (oldVal !== newVal) {
        this.addRevision('abilities', id, key, oldVal, newVal);
      }
    }
    this.data.abilities[index] = { ...old, ...patch };
    this.save();
  }

  public async deleteAbility(id: number): Promise<void> {
    const ability = this.data.abilities.find(a => a.id === id);
    if (!ability) return;

    // Cascade: delete properties
    const props = this.data.ability_properties.filter(p => p.ability_id === id);
    for (const prop of props) {
      await this.deleteAbilityProperty(prop.id);
    }

    this.addRevision('abilities', id, '__delete__', JSON.stringify(ability), null);
    this.data.abilities = this.data.abilities.filter(a => a.id !== id);
    this.save();
  }

  // ── Ability Properties ─────────────────────────────────────────────────────

  public getAllAbilityProperties(): AbilityProperty[] {
    return this.data.ability_properties;
  }

  public getAbilityPropertiesByAbilityId(abilityId: number): AbilityProperty[] {
    return this.data.ability_properties.filter(p => p.ability_id === abilityId);
  }

  /** @deprecated use getAbilityPropertiesByAbilityId */
  public async getAbilityProperties(abilityId: number): Promise<AbilityProperty[]> {
    return this.getAbilityPropertiesByAbilityId(abilityId);
  }

  public async createAbilityProperty(data: Omit<AbilityProperty, 'id'>): Promise<number> {
    const id = this.nextId(this.data.ability_properties);
    const record: AbilityProperty = { ...data, id };
    this.data.ability_properties.push(record);
    this.addRevision('ability_properties', id, '__create__', null, JSON.stringify(record));
    this.save();
    return id;
  }

  public async updateAbilityProperty(id: number, data: Partial<Omit<AbilityProperty, 'id'>>): Promise<void> {
    const index = this.data.ability_properties.findIndex(p => p.id === id);
    if (index === -1) return;
    const old = this.data.ability_properties[index];
    const patch = this.defined(data);
    for (const key of Object.keys(patch) as (keyof typeof patch)[]) {
      const oldVal = String(old[key] ?? '');
      const newVal = String(patch[key] ?? '');
      if (oldVal !== newVal) {
        this.addRevision('ability_properties', id, key, oldVal, newVal);
      }
    }
    this.data.ability_properties[index] = { ...old, ...patch };
    this.save();
  }

  public async deleteAbilityProperty(id: number): Promise<void> {
    const prop = this.data.ability_properties.find(p => p.id === id);
    if (prop) {
      this.addRevision('ability_properties', id, '__delete__', JSON.stringify(prop), null);
    }
    this.data.ability_properties = this.data.ability_properties.filter(p => p.id !== id);
    this.save();
  }

  // ── Revisions ──────────────────────────────────────────────────────────────

  public async getRevisions(options: { from?: string; to?: string; limit?: number } = {}): Promise<Revision[]> {
    const { from, to, limit = 50 } = options;
    let revisions = this.data.revisions;
    if (from) {
      const fromTime = new Date(from).getTime();
      revisions = revisions.filter(r => new Date(r.updated_at).getTime() >= fromTime);
    }
    if (to) {
      const toTime = new Date(to).getTime();
      revisions = revisions.filter(r => new Date(r.updated_at).getTime() <= toTime);
    }
    return from || to ? revisions : revisions.slice(-limit);
  }

  // ── Misc ───────────────────────────────────────────────────────────────────

  public async getVersionHistory(): Promise<{ version: string; metadata: any; changesSummary: string }[]> {
    return [];
  }

  public async recordVersion(_version: string, _metadata: Record<string, any>, _changesSummary: string): Promise<void> {
    logger.info(`Version recorded: ${_version}`);
  }

  public close(): void {
    this.save();
    logger.info('Database saved and closed');
  }
}

export default DatabaseService;
