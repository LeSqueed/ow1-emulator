import { useState, useEffect, useCallback } from 'react';
import { createApiInstance } from '../api';
import type { Hero, Constant, Ability, AbilityProperty, Revision } from '../../types';

interface UseDataProps {
  apiUrl?: string;
}

export function useData({ apiUrl }: UseDataProps = {}) {
  const api = createApiInstance(apiUrl);

  const [constants, setConstants] = useState<Constant[]>([]);
  const [heroes, setHeroes] = useState<(Hero & { abilitiesCount: number })[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [constantsData, heroesData, revisionsData] = await Promise.all([
        api.getConstants().catch(e => { console.error('constants:', e); return [] as Constant[]; }),
        api.getHeroes().catch(e => { console.error('heroes:', e); return [] as (Hero & { abilitiesCount: number })[]; }),
        api.getRevisions().catch(e => { console.error('revisions:', e); return [] as Revision[]; }),
      ]);
      setConstants(constantsData);
      setHeroes(heroesData);
      setRevisions(revisionsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Constants ────────────────────────────────────────────────────────

  const addConstant = async (data: Omit<Constant, 'id'>) => {
    const result = await api.createConstant(data);
    await fetchData();
    return result;
  };

  const updateConstant = async (id: number, data: Partial<Omit<Constant, 'id'>>) => {
    await api.updateConstant(id, data);
    await fetchData();
  };

  const deleteConstant = async (id: number) => {
    await api.deleteConstant(id);
    setConstants(prev => prev.filter(c => c.id !== id));
  };

  // ── Heroes ───────────────────────────────────────────────────────────

  const addHero = async (data: Omit<Hero, 'id'>) => {
    const result = await api.createHero(data);
    await fetchData();
    return result;
  };

  const updateHero = async (id: number, data: Partial<Omit<Hero, 'id'>>) => {
    await api.updateHero(id, data);
    await fetchData();
  };

  const deleteHero = async (id: number) => {
    await api.deleteHero(id);
    setHeroes(prev => prev.filter(h => h.id !== id));
  };

  const getHeroes = useCallback(async () => api.getHeroes(), []);

  const getRevisions = useCallback(
    async (params?: { from?: string; to?: string }) => api.getRevisions(params),
    []
  );

  // ── Abilities ────────────────────────────────────────────────────────

  const getHeroAbilities = useCallback(
    async (heroId: number): Promise<(Ability & { propertiesCount: number })[]> => {
      try {
        return await api.getHeroAbilities(heroId);
      } catch (e) {
        console.error('getHeroAbilities:', e);
        return [];
      }
    },
    []
  );

  const addAbility = async (heroId: number, data: Omit<Ability, 'id' | 'hero_id'>) => {
    const result = await api.createAbility(heroId, data);
    await fetchData();
    return result;
  };

  const updateAbility = async (id: number, data: Partial<Omit<Ability, 'id' | 'hero_id'>>) => {
    await api.updateAbility(id, data);
    await fetchData();
  };

  const deleteAbility = async (id: number) => {
    await api.deleteAbility(id);
    await fetchData();
  };

  // ── Properties ───────────────────────────────────────────────────────

  const getAbilityProperties = useCallback(
    async (abilityId: number): Promise<AbilityProperty[]> => {
      try {
        return await api.getAbilityProperties(abilityId);
      } catch (e) {
        console.error('getAbilityProperties:', e);
        return [];
      }
    },
    []
  );

  const addProperty = async (abilityId: number, data: Omit<AbilityProperty, 'id' | 'ability_id'>) => {
    const result = await api.createAbilityProperty(abilityId, data);
    await fetchData();
    return result;
  };

  const updateProperty = async (id: number, data: Partial<Omit<AbilityProperty, 'id' | 'ability_id'>>) => {
    await api.updateAbilityProperty(id, data);
    await fetchData();
  };

  const deleteProperty = async (id: number) => {
    await api.deleteAbilityProperty(id);
    await fetchData();
  };

  // ── Export ───────────────────────────────────────────────────────────

  const exportFiles = useCallback(async (): Promise<{ files: string[]; content: string[] } | null> => {
    try {
      return await api.generate();
    } catch (e) {
      console.error('exportFiles:', e);
      return null;
    }
  }, []);

  return {
    constants,
    heroes,
    revisions,
    loading,
    error,
    refresh: fetchData,
    getRevisions,
    addConstant,
    updateConstant,
    deleteConstant,
    getHeroes,
    addHero,
    updateHero,
    deleteHero,
    getHeroAbilities,
    addAbility,
    updateAbility,
    deleteAbility,
    getAbilityProperties,
    addProperty,
    updateProperty,
    deleteProperty,
    exportFiles,
  };
}
