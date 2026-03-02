import type { Hero, Ability, AbilityProperty, Constant, Revision } from '../types';

const API_BASE = 'http://localhost:3001/api';

const json = (res: Response) => res.json();

export const createApiInstance = (apiUrl: string = API_BASE) => {
  const base = apiUrl;

  return {
    // ── Constants ──────────────────────────────────────────────────────
    getConstants: (): Promise<Constant[]> =>
      fetch(`${base}/constants`).then(json),

    createConstant: (data: Omit<Constant, 'id'>): Promise<{ id: number }> =>
      fetch(`${base}/constants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(json),

    updateConstant: (id: number, data: Partial<Omit<Constant, 'id'>>): Promise<void> =>
      fetch(`${base}/constants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(json),

    deleteConstant: (id: number): Promise<void> =>
      fetch(`${base}/constants/${id}`, { method: 'DELETE' }).then(json),

    // ── Heroes ─────────────────────────────────────────────────────────
    getHeroes: (): Promise<(Hero & { abilitiesCount: number })[]> =>
      fetch(`${base}/heroes`).then(json),

    createHero: (data: Omit<Hero, 'id'>): Promise<{ id: number; hero: Hero }> =>
      fetch(`${base}/heroes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(json),

    updateHero: (id: number, data: Partial<Omit<Hero, 'id'>>): Promise<void> =>
      fetch(`${base}/heroes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(json),

    deleteHero: (id: number): Promise<void> =>
      fetch(`${base}/heroes/${id}`, { method: 'DELETE' }).then(json),

    // ── Abilities ──────────────────────────────────────────────────────
    getHeroAbilities: (heroId: number): Promise<(Ability & { propertiesCount: number })[]> =>
      fetch(`${base}/heroes/${heroId}/abilities`).then(json),

    createAbility: (heroId: number, data: Omit<Ability, 'id' | 'hero_id'>): Promise<{ id: number }> =>
      fetch(`${base}/heroes/${heroId}/abilities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(json),

    updateAbility: (id: number, data: Partial<Omit<Ability, 'id' | 'hero_id'>>): Promise<void> =>
      fetch(`${base}/abilities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(json),

    deleteAbility: (id: number): Promise<void> =>
      fetch(`${base}/abilities/${id}`, { method: 'DELETE' }).then(json),

    // ── Properties ─────────────────────────────────────────────────────
    getAbilityProperties: (abilityId: number): Promise<AbilityProperty[]> =>
      fetch(`${base}/abilities/${abilityId}/properties`).then(json),

    createAbilityProperty: (abilityId: number, data: Omit<AbilityProperty, 'id' | 'ability_id'>): Promise<{ id: number }> =>
      fetch(`${base}/abilities/${abilityId}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(json),

    updateAbilityProperty: (id: number, data: Partial<Omit<AbilityProperty, 'id' | 'ability_id'>>): Promise<void> =>
      fetch(`${base}/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(json),

    deleteAbilityProperty: (id: number): Promise<void> =>
      fetch(`${base}/properties/${id}`, { method: 'DELETE' }).then(json),

    // ── Revisions ──────────────────────────────────────────────────────
    getRevisions: (params?: { from?: string; to?: string }): Promise<Revision[]> => {
      const query = new URLSearchParams();
      if (params?.from) query.set('from', params.from);
      if (params?.to) query.set('to', params.to);
      const qs = query.toString();
      return fetch(`${base}/revisions${qs ? `?${qs}` : ''}`).then(json);
    },

    // ── Generate ───────────────────────────────────────────────────────
    generate: (version = '1.0.0'): Promise<{ files: string[]; content: string[] }> =>
      fetch(`${base}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version }),
      }).then(json),
  };
};

export const api = createApiInstance();
export default createApiInstance;
