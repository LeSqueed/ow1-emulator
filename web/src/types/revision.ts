// src/types/revision.ts

export interface Revision {
  id: number;
  table_name: string;
  record_id: number;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  updated_at: string;
}