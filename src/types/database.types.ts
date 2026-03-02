/**
 * TypeScript Type Definitions for Overwatch Constants Management
 * Defines interfaces and types for database operations, API endpoints,
 * and constants management services.
 */

export interface Hero {
  id: number;
  name: string;
  role: HeroRole;
  type: HeroType;
  health: number;
  healthBase?: number;
  armor?: number;
  armorBase?: number;
  ultCost?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ability {
  id: number;
  heroId: number;
  name: string;
  type: AbilityType;
  description?: string;
  cooldown?: number;
  cost?: number;
  damage?: number;
  healing?: number;
  duration?: number;
  range?: number;
  areaOfEffect?: number;
  isEnabled: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GlobalConstant {
  id: number;
  name: string;
  value: string;
  type: ConstantType;
  category: string;
  description?: string;
  version?: string;
  isDevOnly?: boolean;
  valueOverrides?: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface HeroAbility {
  id: number;
  heroId: number;
  heroName: string;
  abilityId: number;
  abilityName: string;
  abilityType: AbilityType;
  priority: number;
  cost?: number;
  cooldown?: number;
  damage?: number;
  healing?: number;
  duration?: number;
  range?: number;
  aoe?: number;
  isEnabled: boolean;
  isActive: boolean;
  customSettings?: Record<string, unknown>;
}

export interface Champion {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  heroId?: number;
  sortOrder: number;
}

export interface DatabaseConfig {
  database: {
    path: string;
  };
  server: {
    port: number;
    host: string;
  };
  logging: {
    level: string;
    format: string;
  };
}

export interface DBPool {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<DatabaseResult>;
}

export interface DatabaseResult {
  rowsAffected: number;
  lastInsertId?: number;
  success: boolean;
  error?: Error;
}

export type HeroRole = 'Tank' | 'Damage' | 'Support';
export type HeroType = 'Melee' | 'Ranged' | 'Hybrid';
export type AbilityType =
  | 'Passive'
  | 'Primary'
  | 'Secondary'
  | 'Ultimate'
  | 'Weapon';
export type ConstantType = 'Float' | 'Int' | 'String' | 'Boolean' | 'Complex';

export interface ConstantQueryParams {
  name?: string;
  category?: string;
  type?: ConstantType;
  isDevOnly?: boolean;
  version?: string;
  search?: string;
}

export interface HeroQueryParams {
  name?: string;
  role?: HeroRole;
  type?: HeroType;
  heroId?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface APIDocumentation {
  title: string;
  endpoint: string;
  method: string;
  description: string;
  parameters: Record<string, ParameterDoc>;
  responses: ResponseDoc[];
}

export interface ParameterDoc {
  name: string;
  description: string;
  type: string;
  required: boolean;
  example: unknown;
}

export interface ResponseDoc {
  statusCode: number;
  description: string;
  contentType: string;
  schema: Record<string, unknown>;
}

export interface SeedData {
  heroes: Hero[];
  abilities: Ability[];
  constants: GlobalConstant[];
  heroAbilities: HeroAbility[];
  champions: Champion[];
}

export namespace Constants {
  export const HERO_ROLES = ['Tank', 'Damage', 'Support'] as const;
  export const HERO_TYPES = ['Melee', 'Ranged', 'Hybrid'] as const;
  export const ABILITY_TYPES = [
    'Passive',
    'Primary',
    'Secondary',
    'Ultimate',
    'Weapon',
  ] as const;
  export const CONSTANT_TYPES = ['Float', 'Int', 'String', 'Boolean', 'Complex'] as const;
}
