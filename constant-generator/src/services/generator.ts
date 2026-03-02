import * as fs from 'fs';
import * as path from 'path';
import { DatabaseService } from './database.js';
import type { Constant, Hero, Ability, AbilityProperty, ValueType, FileScope } from '../types/index.js';

const OUTPUT_DIR = './generated_constants';

/** Convert snake_case constant_name to camelCase OverPy hero identifier. */
function toOpyName(constantName: string): string {
  return constantName
    .split('_')
    .map((part, i) => i === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

function formatValue(v: number | string, valueType?: ValueType): string {
  if (valueType === 'expression' || typeof v === 'string') return String(v);
  if (typeof v === 'number' && v < 0) return `(${v})`;
  return String(v);
}

function isEnabled(item: { enabled?: boolean }): boolean {
  return item.enabled !== false;
}

function formatWorkshopSetting(constantName: string, prefix: string, item: {
  patched_value: number | string;
  ws_category?: string;
  ws_label?: string;
  ws_setting_type?: 'float' | 'int';
  ws_use_range_syntax?: boolean;
  ws_min?: number;
  ws_max?: number;
}): string {
  const name = `${prefix}${constantName}`;
  const def = item.patched_value;
  const min = item.ws_min ?? 0;
  const max = item.ws_max ?? 100;
  const category = item.ws_category ?? '';
  const label = item.ws_label ?? constantName;
  const sType = item.ws_setting_type ?? 'float';

  if (item.ws_use_range_syntax) {
    return `globalvar ${name} = createWorkshopSetting(${sType}[${min}:${max}], '${category}', '${label}', ${def})\n`;
  } else {
    const fn = sType === 'int' ? 'createWorkshopSettingInt' : 'createWorkshopSettingFloat';
    return `globalvar ${name} = ${fn}('${category}', '${label}', ${def}, ${min}, ${max})\n`;
  }
}

export class GeneratorService {
  private db: DatabaseService;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  public async generate(version: string = '1.0.0'): Promise<{ files: string[]; constants: number; heroes: number }> {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Remove old hero-specific files if they exist
    const heroesDir = path.join(OUTPUT_DIR, 'heroes');
    if (fs.existsSync(heroesDir)) {
      try {
        for (const file of fs.readdirSync(heroesDir)) {
          fs.unlinkSync(path.join(heroesDir, file));
        }
      } catch (error) {
        console.error('Error cleaning up old hero files:', error);
      }
    }

    const constants = this.db.getAllConstants();
    const allHeroes = this.db.getAllHeroes();

    // Deduplicate heroes by constant_name (keep most recently added)
    const uniqueHeroes: Record<string, Hero> = {};
    for (const hero of allHeroes) {
      if (!uniqueHeroes[hero.constant_name]) {
        uniqueHeroes[hero.constant_name] = hero;
      }
    }
    const heroes = Object.values(uniqueHeroes);

    const files: string[] = [];

    const ow1Content = this.generateOW1Constants(constants, heroes);
    const ow1Path = path.join(OUTPUT_DIR, 'ow1_constants.opy');
    fs.writeFileSync(ow1Path, ow1Content);
    files.push(ow1Path);

    const ow2Content = this.generateOW2Constants(constants, heroes);
    const ow2Path = path.join(OUTPUT_DIR, 'ow2_constants.opy');
    fs.writeFileSync(ow2Path, ow2Content);
    files.push(ow2Path);

    const rosterContent = this.generateHeroRoster(heroes);
    const rosterPath = path.join(OUTPUT_DIR, 'hero_roster.opy');
    fs.writeFileSync(rosterPath, rosterContent);
    files.push(rosterPath);

    return { files, constants: constants.length, heroes: heroes.length };
  }

  private generateOW1Constants(constants: Constant[], heroes: Hero[]): string {
    let output = `#!mainFile "../dev_main.opy"\n\n`;

    // Filter: enabled and not ow2-only
    const ow1Constants = constants.filter(c => isEnabled(c) && c.shared !== true && (c.file ?? 'both') !== 'ow2');

    const defineConstants = ow1Constants.filter(c => c.value_type !== 'workshop_setting');
    const workshopConstants = ow1Constants.filter(c => c.value_type === 'workshop_setting');

    if (defineConstants.length > 0) {
      output += '# Constants\n';
      defineConstants.sort((a, b) => a.constant_name.localeCompare(b.constant_name));
      for (const c of defineConstants) {
        const prefix = c.remove_prefix ? '' : 'OW1_';
        output += `#!define ${prefix}${c.constant_name} ${formatValue(c.patched_value, c.value_type)}\n`;
      }
      output += '\n';
    }

    if (workshopConstants.length > 0) {
      output += '# Workshop Settings\n';
      workshopConstants.sort((a, b) => a.constant_name.localeCompare(b.constant_name));
      for (const c of workshopConstants) {
        const prefix = c.remove_prefix ? '' : 'OW1_';
        output += formatWorkshopSetting(c.constant_name, prefix, c);
      }
      output += '\n';
    }

    // Hero sections
    heroes.sort((a, b) => a.constant_name.localeCompare(b.constant_name));
    for (const hero of heroes) {
      const heroLabel = hero.display_name || hero.constant_name;
      const heroPrefix = hero.constant_name.toUpperCase();

      const abilities = this.db.getAbilitiesByHeroId(hero.id);
      const allProps: Array<{ abilityPrefix: string; prop: AbilityProperty }> = [];
      for (const ability of abilities) {
        const props = this.db.getAbilityPropertiesByAbilityId(ability.id)
          .filter(p => isEnabled(p) && (p.file ?? 'both') !== 'ow2');
        if (props.length === 0) continue;
        const abilityPrefix = ability.constant_name.toUpperCase().replace(/\s+/g, '_');
        for (const prop of props) {
          allProps.push({ abilityPrefix, prop });
        }
      }

      output += `\n# ${heroLabel}\n`;
      const prefix = 'OW1_';
      output += `#!define ${prefix}${heroPrefix}_HEALTH ${hero.patched_health}\n`;
      output += `#!define ${prefix}${heroPrefix}_ARMOR ${hero.patched_armor}\n`;
      output += `#!define ${prefix}${heroPrefix}_SHIELDS ${hero.patched_shields}\n`;
      output += `#!define ${prefix}${heroPrefix}_ULT_COST ${hero.patched_ult_cost}\n`;

      const defineProps = allProps.filter(({ prop }) => prop.value_type !== 'workshop_setting');
      const workshopProps = allProps.filter(({ prop }) => prop.value_type === 'workshop_setting');

      for (const { abilityPrefix, prop } of defineProps) {
        const propName = prop.name.toUpperCase().replace(/\s+/g, '_');
        const prefix = 'OW1_';
        output += `#!define ${prefix}${heroPrefix}_${abilityPrefix}_${propName} ${formatValue(prop.patched_value, prop.value_type)}\n`;
      }

      for (const { abilityPrefix, prop } of workshopProps) {
        const propName = prop.name.toUpperCase().replace(/\s+/g, '_');
        const prefix = 'OW1_';
        output += formatWorkshopSetting(`${heroPrefix}_${abilityPrefix}_${propName}`, prefix, prop);
      }
    }

    return output;
  }

  private generateOW2Constants(constants: Constant[], heroes: Hero[]): string {
    let output = `#!mainFile "../dev_main.opy"\n\n`;

    // Filter: enabled, not ow1-only, not workshop_setting
    const ow2Constants = constants.filter(c =>
      isEnabled(c) && c.shared !== true &&
      (c.file ?? 'both') !== 'ow1' &&
      c.value_type !== 'workshop_setting'
    );

    if (ow2Constants.length > 0) {
      output += '# Constants\n';
      ow2Constants.sort((a, b) => a.constant_name.localeCompare(b.constant_name));
      for (const c of ow2Constants) {
        const prefix = c.remove_prefix ? '' : 'OW2_';
        output += `#!define ${prefix}${c.constant_name} ${formatValue(c.live_value, c.value_type)}\n`;
      }
      output += '\n';
    }

    // Hero sections
    heroes.sort((a, b) => a.constant_name.localeCompare(b.constant_name));
    for (const hero of heroes) {
      const heroLabel = hero.display_name || hero.constant_name;
      const heroPrefix = hero.constant_name.toUpperCase();
output += `\n# ${heroLabel}\n`;
      const prefix = 'OW2_';
      output += `#!define ${prefix}${heroPrefix}_HEALTH ${hero.live_health}\n`;
      output += `#!define ${prefix}${heroPrefix}_ARMOR ${hero.live_armor}\n`;
      output += `#!define ${prefix}${heroPrefix}_SHIELDS ${hero.live_shields}\n`;
      output += `#!define ${prefix}${heroPrefix}_ULT_COST ${hero.live_ult_cost}\n`;

      const abilities = this.db.getAbilitiesByHeroId(hero.id);
      for (const ability of abilities) {
        const props = this.db.getAbilityPropertiesByAbilityId(ability.id)
          .filter(p => isEnabled(p) && (p.file ?? 'both') !== 'ow1' && p.value_type !== 'workshop_setting');
        if (props.length === 0) continue;

        const abilityPrefix = ability.constant_name.toUpperCase().replace(/\s+/g, '_');
     for (const prop of props) {
        const propName = prop.name.toUpperCase().replace(/\s+/g, '_');
        const prefix = 'OW2_';
        output += `#!define ${prefix}${heroPrefix}_${abilityPrefix}_${propName} ${formatValue(prop.live_value, prop.value_type)}\n`;
      }
      }
    }

    return output;
  }

  private generateHeroRoster(heroes: Hero[]): string {
    const enabled = heroes
      .filter(h => isEnabled(h))
      .sort((a, b) => a.constant_name.localeCompare(b.constant_name));

    const names = enabled.map(h => `"${h.opy_name ?? toOpyName(h.constant_name)}"`).join(', ');

    const lines: string[] = [
      `#!mainFile "../dev_main.opy"`,
      ``,
      `# Hero roster — auto-generated by OW1 Emulator web UI.`,
      `# Include this file in your lobby, then use ENABLED_HEROES in the settings block:`,
      `#`,
      `#   #!include "../../src/constants/hero_roster.opy"`,
      `#   ...`,
      `#   "enabledHeroes": ENABLED_HEROES`,
      `#`,
      `# Generated: ${new Date().toISOString()}`,
      `# Enabled heroes: ${enabled.length}`,
      ``,
      `#!define ENABLED_HEROES [${names}]`,
      ``,
    ];

    return lines.join('\n');
  }

  public getOutputDir(): string {
    return OUTPUT_DIR;
  }
}

export async function generateConstants(db: DatabaseService, version?: string): Promise<{ files: string[]; constants: number; heroes: number }> {
  const generator = new GeneratorService(db);
  return generator.generate(version);
}
