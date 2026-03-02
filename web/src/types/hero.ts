// src/types/hero.ts

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
  /** Whether this hero appears in the generated enabledHeroes roster. */
  enabled?: boolean;
  /** Canonical OverPy hero identifier override (e.g. "wreckingBall"). Auto-derived from constant_name if omitted. */
  opy_name?: string;
}