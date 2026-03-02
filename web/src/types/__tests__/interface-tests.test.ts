import { describe, it, expect } from 'vitest';
import type {
  Hero,
  Ability,
  AbilityType,
  GlobalConstant,
  AbilityProperty,
  Revision
} from '../../types/common.js';

describe('Type Tests', () => {
  it('should allow valid Hero interface', () => {
    const hero: Hero = {
      id: '1',
      name: 'test_hero',
      displayName: 'Test Hero',
      role: 'DPS',
      generalProperties: {
        health: { ow1: 200, ow2: 200 },
        ultCost: { ow1: 2000, ow2: 2000 }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(hero).toBeDefined();
    expect(hero.id).toBe('1');
    expect(hero.name).toBe('test_hero');
  });

  it('should allow valid Ability interface', () => {
    const ability: Ability = {
      id: '1',
      heroId: '1',
      name: 'test_ability',
      displayName: 'Test Ability',
      abilityType: 'Ultimate',
      description: 'Test description',
      properties: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(ability).toBeDefined();
    expect(ability.id).toBe('1');
    expect(ability.heroId).toBe('1');
    expect(ability.abilityType).toBe('Ultimate');
  });

  it('should allow valid AbilityType', () => {
    const types: AbilityType[] = ['Primary', 'Secondary', 'Stance', 'Ultimate', 'Active', 'Passive'];

    expect(types).toContain('Primary');
    expect(types).toContain('Secondary');
    expect(types).toContain('Ultimate');
    expect(types).toContain('Passive');
  });

  it('should allow valid GlobalConstant interface', () => {
    const constant: GlobalConstant = {
      id: 1,
      name: 'test_constant',
      displayName: 'Test Constant',
      value: 100,
      propertyType: 'DAMAGE',
      ow1Value: 100,
      ow2Value: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(constant).toBeDefined();
    expect(constant.id).toBe(1);
    expect(constant.name).toBe('test_constant');
  });

  it('should allow valid AbilityProperty interface', () => {
    const property: AbilityProperty = {
      id: '1',
      abilityId: '1',
      propertyName: 'test_property',
      propertyType: 'number',
      ow1Value: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(property).toBeDefined();
    expect(property.id).toBe('1');
    expect(property.abilityId).toBe('1');
    expect(property.propertyName).toBe('test_property');
  });

  it('should allow valid Revision interface', () => {
    const revision: Revision = {
      id: '1',
      message: 'Test revision',
      heroId: '1',
      changes: [],
      createdAt: new Date()
    };

    expect(revision).toBeDefined();
    expect(revision.id).toBe('1');
    expect(revision.message).toBe('Test revision');
  });

  it('should handle optional properties in Hero', () => {
    const hero: Hero = {
      id: '1',
      name: 'test_hero',
      displayName: undefined,
      role: 'DPS',
      generalProperties: {
        health: { ow1: 200, ow2: 200 }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(hero).toBeDefined();
    expect(hero.displayName).toBeUndefined();
  });

  it('should handle optional properties in Ability', () => {
    const ability: Ability = {
      id: '1',
      heroId: '1',
      name: 'test_ability',
      displayName: undefined,
      abilityType: 'Ultimate',
      description: 'Test',
      properties: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(ability).toBeDefined();
    expect(ability.displayName).toBeUndefined();
  });

  it('should handle optional ow2Value in AbilityProperty', () => {
    const property: AbilityProperty = {
      id: '1',
      abilityId: '1',
      propertyName: 'test_property',
      propertyType: 'number',
      ow1Value: 100,
      ow2Value: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(property).toBeDefined();
    expect(property.ow2Value).toBeUndefined();
  });
});