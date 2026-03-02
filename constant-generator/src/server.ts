import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { DatabaseService } from './services/database.js';
import { generateConstants } from './services/generator.js';
import type { Revision } from './types/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let db: DatabaseService;

async function initServices() {
  db = new DatabaseService({ path: './data/constants.json' });
  await db.initialize();
}

app.use((_req: Request, _res: Response, next: NextFunction) => {
  if (!db) {
    return _res.status(503).json({ error: 'Database not initialized' });
  }
  next();
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// ── Constants ──────────────────────────────────────────────────────────────

app.get('/api/constants', (_req: Request, res: Response) => {
  try {
    res.json(db.getAllConstants());
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.post('/api/constants', async (req: Request, res: Response) => {
  try {
    const {
      display_name, constant_name, live_value, patched_value, shared,
      enabled, file, value_type, ws_category, ws_label, ws_setting_type, ws_use_range_syntax, ws_min, ws_max,
    } = req.body;
    if (!display_name || !constant_name) {
      return res.status(400).json({ error: 'display_name and constant_name are required' });
    }
    const id = await db.createConstant({
      display_name,
      constant_name,
      live_value: live_value ?? 0,
      patched_value: patched_value ?? 0,
      shared: shared ?? false,
      enabled: enabled ?? true,
      file: file ?? 'both',
      value_type: value_type ?? 'number',
      ws_category, ws_label, ws_setting_type, ws_use_range_syntax, ws_min, ws_max,
    });
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.put('/api/constants/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      display_name, constant_name, live_value, patched_value, shared,
      enabled, file, value_type, ws_category, ws_label, ws_setting_type, ws_use_range_syntax, ws_min, ws_max,
    } = req.body;
    await db.updateConstant(parseInt(id), {
      display_name, constant_name, live_value, patched_value, shared,
      enabled, file, value_type, ws_category, ws_label, ws_setting_type, ws_use_range_syntax, ws_min, ws_max,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.delete('/api/constants/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.deleteConstant(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Heroes ─────────────────────────────────────────────────────────────────

app.get('/api/heroes', (_req: Request, res: Response) => {
  try {
    const heroes = db.getAllHeroes();
    const heroesWithCount = heroes.map(hero => ({
      ...hero,
      abilitiesCount: db.getAbilitiesByHeroId(hero.id).length,
    }));
    res.json(heroesWithCount);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.post('/api/heroes', async (req: Request, res: Response) => {
  try {
    const {
      display_name, constant_name, role, enabled, opy_name,
      live_health, patched_health,
      live_armor, patched_armor,
      live_shields, patched_shields,
      live_ult_cost, patched_ult_cost,
    } = req.body;

    if (!display_name || !constant_name) {
      return res.status(400).json({ error: 'display_name and constant_name are required' });
    }

    const id = await db.createHero({
      display_name,
      constant_name: constant_name.toLowerCase().replace(/\s+/g, '_'),
      role: role ?? 'Dps',
      enabled: enabled ?? true,
      opy_name: opy_name || undefined,
      live_health: live_health ?? 0,
      patched_health: patched_health ?? 0,
      live_armor: live_armor ?? 0,
      patched_armor: patched_armor ?? 0,
      live_shields: live_shields ?? 0,
      patched_shields: patched_shields ?? 0,
      live_ult_cost: live_ult_cost ?? 2000,
      patched_ult_cost: patched_ult_cost ?? 2000,
    });

    const hero = db.getHeroById(id);
    res.json({ id, hero });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.put('/api/heroes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      display_name, constant_name, role, enabled, opy_name,
      live_health, patched_health,
      live_armor, patched_armor,
      live_shields, patched_shields,
      live_ult_cost, patched_ult_cost,
    } = req.body;
    await db.updateHero(parseInt(id), {
      display_name, constant_name, role, enabled,
      opy_name: opy_name || undefined,
      live_health, patched_health,
      live_armor, patched_armor,
      live_shields, patched_shields,
      live_ult_cost, patched_ult_cost,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.delete('/api/heroes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.deleteHero(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Abilities ──────────────────────────────────────────────────────────────

app.get('/api/heroes/:heroId/abilities', (req: Request, res: Response) => {
  try {
    const heroId = parseInt(req.params.heroId);
    const abilities = db.getAbilitiesByHeroId(heroId).map(ability => ({
      ...ability,
      propertiesCount: db.getAbilityPropertiesByAbilityId(ability.id).length,
    }));
    res.json(abilities);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.post('/api/heroes/:heroId/abilities', async (req: Request, res: Response) => {
  try {
    const heroId = parseInt(req.params.heroId);
    const { display_name, constant_name } = req.body;

    if (!display_name || !constant_name) {
      return res.status(400).json({ error: 'display_name and constant_name are required' });
    }

    const hero = db.getHeroById(heroId);
    if (!hero) {
      return res.status(404).json({ error: `Hero with ID ${heroId} not found` });
    }

    const existing = db.getAbilitiesByHeroId(heroId).find(
      a => a.constant_name.toLowerCase() === constant_name.toLowerCase()
    );
    if (existing) {
      return res.status(409).json({
        error: `Ability '${constant_name}' already exists for hero ${hero.display_name}`,
        existingAbilityId: existing.id,
      });
    }

    const id = await db.createAbility({
      hero_id: heroId,
      display_name,
      constant_name: constant_name.toLowerCase().replace(/\s+/g, '_'),
    });

    const ability = db.getAllAbilities().find(a => a.id === id);
    res.json({ id, ability });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.put('/api/abilities/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { display_name, constant_name } = req.body;
    await db.updateAbility(parseInt(id), { display_name, constant_name });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.delete('/api/abilities/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.deleteAbility(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Ability Properties ──────────────────────────────────────────────────────

app.get('/api/abilities/:abilityId/properties', (req: Request, res: Response) => {
  try {
    const abilityId = parseInt(req.params.abilityId);
    res.json(db.getAbilityPropertiesByAbilityId(abilityId));
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.post('/api/abilities/:abilityId/properties', async (req: Request, res: Response) => {
  try {
    const abilityId = parseInt(req.params.abilityId);
    const {
      name, live_value, patched_value, value_type,
      enabled, file, ws_category, ws_label, ws_setting_type, ws_use_range_syntax, ws_min, ws_max,
    } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Property name is required' });
    }

    const ability = db.getAllAbilities().find(a => a.id === abilityId);
    if (!ability) {
      return res.status(404).json({ error: `Ability with ID ${abilityId} not found` });
    }

    const existing = db.getAbilityPropertiesByAbilityId(abilityId).find(
      p => p.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      return res.status(409).json({
        error: `Property '${name}' already exists for this ability`,
        existingPropertyId: existing.id,
      });
    }

    const id = await db.createAbilityProperty({
      ability_id: abilityId,
      name,
      live_value: live_value ?? 0,
      patched_value: patched_value ?? 0,
      value_type: value_type ?? 'number',
      enabled: enabled ?? true,
      file: file ?? 'both',
      ws_category, ws_label, ws_setting_type, ws_use_range_syntax, ws_min, ws_max,
    });

    res.json({ id, abilityId: ability.id, abilityName: ability.constant_name });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.put('/api/properties/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name, live_value, patched_value, value_type,
      enabled, file, ws_category, ws_label, ws_setting_type, ws_use_range_syntax, ws_min, ws_max,
    } = req.body;
    await db.updateAbilityProperty(parseInt(id), {
      name, live_value, patched_value, value_type,
      enabled, file, ws_category, ws_label, ws_setting_type, ws_use_range_syntax, ws_min, ws_max,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.delete('/api/properties/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.deleteAbilityProperty(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Revisions ──────────────────────────────────────────────────────────────

app.get('/api/revisions', async (_req: Request, res: Response) => {
  try {
    const limit = _req.query.limit ? parseInt(_req.query.limit as string) : 50;
    const from = _req.query.from as string | undefined;
    const to = _req.query.to as string | undefined;
    const revisions = await db.getRevisions({ from, to, limit });
    const sorted = [...revisions].sort((a: Revision, b: Revision) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Generate ───────────────────────────────────────────────────────────────

app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const { version } = req.body;
    const result = await generateConstants(db, version || '1.0.0');

    const fileContents = [];
    for (const file of result.files) {
      try {
        fileContents.push(fs.readFileSync(file, 'utf8'));
      } catch (err) {
        fileContents.push(`Error reading file: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    res.json({ success: true, ...result, content: fileContents });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/generate/output-dir', (_req: Request, res: Response) => {
  res.json({ path: './generated_constants' });
});

app.get('/api/generate/file', (req: Request, res: Response) => {
  const filePath = req.query.path as string;
  if (!filePath) {
    return res.status(400).json({ error: 'Missing path' });
  }
  const fullPath = path.resolve(filePath);
  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

async function startServer() {
  await initServices();
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
