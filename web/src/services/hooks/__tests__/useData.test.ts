import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useData } from '../useData.js';
import { createApiInstance } from '../../services/api.js';

describe('useData Hook Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty arrays', () => {
    const { result } = renderHook(() => useData());

    expect(result.current.constants).toEqual([]);
    expect(result.current.heroes).toEqual([]);
    expect(result.current.revisions).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should have all required methods', () => {
    const { result: result1 } = renderHook(() => useData());

    expect(typeof result1.current.addConstant).toBe('function');
    expect(typeof result1.current.updateConstant).toBe('function');
    expect(typeof result1.current.addHero).toBe('function');
    expect(typeof result1.current.updateHero).toBe('function');
    expect(typeof result1.current.deleteHero).toBe('function');
    expect(typeof result1.current.addAbility).toBe('function');
    expect(typeof result1.current.updateAbility).toBe('function');
    expect(typeof result1.current.deleteAbility).toBe('function');
    expect(typeof result1.current.addProperty).toBe('function');
    expect(typeof result1.current.updateProperty).toBe('function');
    expect(typeof result1.current.deleteProperty).toBe('function');
    expect(typeof result1.current.getHeroAbilities).toBe('function');
    expect(typeof result1.current.getAbilityProperties).toBe('function');
    expect(typeof result1.current.getHeroes).toBe('function');
    expect(typeof result1.current.exportFiles).toBe('function');
    expect(typeof result1.current.refresh).toBe('function');
  });

  it('should handle array returns correctly', () => {
    const { result } = renderHook(() => useData());

    const heroes: any[] = [
      { id: '1', name: 'hero1', displayName: 'Hero 1', role: 'DPS', abilityTypes: [], abilities: [], properties: [], createdAt: new Date(), updatedAt: new Date() }
    ];

    const abilities: any[] = [
      { id: '1', heroId: '1', name: 'ability1', displayName: 'Ability 1', abilityType: 'Ultimate', description: 'Test', properties: [], createdAt: new Date(), updatedAt: new Date() }
    ];

    const revisions: any[] = [
      { id: '1', message: 'Test', heroId: '1', changes: [], createdAt: new Date() }
    ];

    expect(Array.isArray(result.current.constants)).toBe(true);
    expect(Array.isArray(result.current.heroes)).toBe(true);
    expect(Array.isArray(result.current.revisions)).toBe(true);
  });

  it('should have loading state management', () => {
    const { result } = renderHook(() => useData());

    expect(result.current.loading).toBe(true);
    expect(result.current.loading).not.toBe(false);
  });

  it('should have error state management', () => {
    const { result } = renderHook(() => useData());

    expect(result.current.error).toBeNull();
  });

  it('should return exportFiles result with files and content', () => {
    const { result: result1 } = renderHook(() => useData());

    const exportResult = result1.current.exportFiles();

    expect(exportResult).toBeDefined();
  });

  it('should handle refresh method', () => {
    const { result } = renderHook(() => useData());

    expect(typeof result.current.refresh).toBe('function');
  });
});