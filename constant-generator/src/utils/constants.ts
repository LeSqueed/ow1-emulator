import type { Hero, Ability } from '../types/index.js';

/**
 * Generates constant names in the format OW1_HERO_PROPERTY or OW2_HERO_PROPERTY
 */
export function generateConstantName(
  prefix: 'OW1' | 'OW2',
  heroName: string,
  propertyName: string,
  abilityName?: string
): string {
  const heroFormatted = heroName.toUpperCase().replace(/\s+/g, '_');
  const propertyFormatted = propertyName.toUpperCase().replace(/\s+/g, '_');

  if (abilityName) {
    const abilityFormatted = abilityName.toUpperCase().replace(/\s+/g, '_');
    return `${prefix}_${heroFormatted}_${abilityFormatted}_${propertyFormatted}`;
  }

  return `${prefix}_${heroFormatted}_${propertyFormatted}`;
}

/**
 * Generates OW1/OW2 constant definitions for a hero's general properties
 */
export function generateHeroGeneralPropertyConstants(
  hero: Hero
): { name: string; displayName: string; live_value: number; patched_value: number }[] {
  const heroName = hero.constant_name;
  const displayBase = hero.display_name || hero.constant_name;

  return [
    {
      name: generateConstantName('OW1', heroName, 'HEALTH'),
      displayName: `${displayBase} Health`,
      live_value: hero.live_health,
      patched_value: hero.patched_health,
    },
    {
      name: generateConstantName('OW1', heroName, 'ARMOR'),
      displayName: `${displayBase} Armor`,
      live_value: hero.live_armor,
      patched_value: hero.patched_armor,
    },
    {
      name: generateConstantName('OW1', heroName, 'SHIELDS'),
      displayName: `${displayBase} Shields`,
      live_value: hero.live_shields,
      patched_value: hero.patched_shields,
    },
    {
      name: generateConstantName('OW1', heroName, 'ULT_COST'),
      displayName: `${displayBase} Ultimate Cost`,
      live_value: hero.live_ult_cost,
      patched_value: hero.patched_ult_cost,
    },
  ];
}

/**
 * Generates constant name for an ability property
 */
export function generateAbilityPropertyConstants(
  hero: Hero,
  ability: Ability,
  propertyName: string,
  liveValue: number,
  patchedValue: number
): { name: string; displayName: string; live_value: number; patched_value: number } {
  return {
    name: generateConstantName('OW1', hero.constant_name, propertyName, ability.constant_name),
    displayName: `${hero.display_name || hero.constant_name} ${ability.display_name || ability.constant_name} ${propertyName}`,
    live_value: liveValue,
    patched_value: patchedValue,
  };
}
