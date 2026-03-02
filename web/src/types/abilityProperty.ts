// src/types/abilityProperty.ts

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