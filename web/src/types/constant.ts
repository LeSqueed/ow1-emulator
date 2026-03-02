export type ValueType = 'number' | 'expression' | 'workshop_setting';

export type FileScope = 'both' | 'ow1' | 'ow2';

export interface Constant {
  id: number;
  display_name: string;
  constant_name: string;
  live_value: number | string;
  patched_value: number | string;
  /** If true, emitted in both OW1 and OW2 files with the same name. */
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
