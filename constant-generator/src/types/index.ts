/**
 * @fileoverview Type definitions aligned with db_schema.sql
 */

export interface Hero {
  id: number;
  display_name: string;
  constant_name: string;
  role: string;
  live_health: number;
  patched_health: number;
  live_armor: number;
  patched_armor: number;
  live_shields: number;
  patched_shields: number;
  live_ult_cost: number;
  patched_ult_cost: number;
  /** Whether this hero is included in the generated enabledHeroes roster. Defaults to true. */
  enabled?: boolean;
  /** Canonical OverPy hero identifier (e.g. "wreckingBall"). Auto-derived from constant_name if omitted. */
  opy_name?: string;
}

export interface Ability {
  id: number;
  hero_id: number;
  display_name: string;
  constant_name: string;
}

export type ValueType = 'number' | 'expression' | 'workshop_setting';

export type FileScope = 'both' | 'ow1' | 'ow2';

export interface AbilityProperty {
  id: number;
  ability_id: number;
  name: string;
  live_value: number | string;
  patched_value: number | string;
  value_type?: ValueType;
  enabled?: boolean;
  file?: FileScope;
  ws_category?: string;
  ws_label?: string;
  ws_setting_type?: 'float' | 'int';
  ws_use_range_syntax?: boolean;
  ws_min?: number;
  ws_max?: number;
}

export interface Constant {
  id: number;
  display_name: string;
  constant_name: string;
  live_value: number | string;
  patched_value: number | string;
  /** If true, the constant is emitted in both OW1 and OW2 files with the same name. */
  shared?: boolean;
  /** If true, does not add OW1_ or OW2_ prefix to the constant. */
  remove_prefix?: boolean;
  value_type?: ValueType;
  enabled?: boolean;
  file?: FileScope;
  ws_category?: string;
  ws_label?: string;
  ws_setting_type?: 'float' | 'int';
  ws_use_range_syntax?: boolean;
  ws_min?: number;
  ws_max?: number;
}

/** Alias for backwards compat */
export type GlobalConstant = Constant;

export interface Revision {
  id: number;
  table_name: string;
  record_id: number;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  updated_at: string;
}

/** Generation metadata interface */
export interface GenerationMetadata {
  version: string;
  timestamp: string;
  framework: string;
  generatedBy: string;
  changesCount: number;
  filesGenerated: number;
}

/** Service response interface */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
}

/** Service configuration interface */
export interface ServiceConfig {
  databasePath: string;
  maxRevisions: number;
  versionTracking: boolean;
  autoGeneration: boolean;
}
