import React, { createContext, useContext, useState } from 'react';
import { useData as useDataHook } from '../services/hooks/useData';
import type { Hero, Constant, Ability, AbilityProperty, Revision } from '../types';

export interface AppContextType {
  constants: Constant[];
  heroes: (Hero & { abilitiesCount: number })[];
  revisions: Revision[];
  loading: boolean;
  error: string | null;
  // UI state
  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;
  generatedFiles: { files: string[]; content: string[] } | null;
  setGeneratedFiles: (files: { files: string[]; content: string[] } | null) => void;
  exportError: string | null;
  setExportError: (error: string | null) => void;
  // Data operations
  refresh: () => Promise<void>;
  addConstant: (data: Omit<Constant, 'id'>) => Promise<{ id: number }>;
  updateConstant: (id: number, data: Partial<Omit<Constant, 'id'>>) => Promise<void>;
  deleteConstant: (id: number) => Promise<void>;
  getHeroes: () => Promise<(Hero & { abilitiesCount: number })[]>;
  getRevisions: (params?: { from?: string; to?: string }) => Promise<Revision[]>;
  addHero: (data: Omit<Hero, 'id'>) => Promise<{ id: number; hero: Hero }>;
  updateHero: (id: number, data: Partial<Omit<Hero, 'id'>>) => Promise<void>;
  deleteHero: (id: number) => Promise<void>;
  getHeroAbilities: (heroId: number) => Promise<(Ability & { propertiesCount: number })[]>;
  addAbility: (heroId: number, data: Omit<Ability, 'id' | 'hero_id'>) => Promise<{ id: number }>;
  updateAbility: (id: number, data: Partial<Omit<Ability, 'id' | 'hero_id'>>) => Promise<void>;
  deleteAbility: (id: number) => Promise<void>;
  getAbilityProperties: (abilityId: number) => Promise<AbilityProperty[]>;
  addProperty: (abilityId: number, data: Omit<AbilityProperty, 'id' | 'ability_id'>) => Promise<{ id: number }>;
  updateProperty: (id: number, data: Partial<Omit<AbilityProperty, 'id' | 'ability_id'>>) => Promise<void>;
  deleteProperty: (id: number) => Promise<void>;
  exportFiles: () => Promise<{ files: string[]; content: string[] } | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
  apiUrl?: string;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, apiUrl }) => {
  const data = useDataHook({ apiUrl });
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<{ files: string[]; content: string[] } | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const value: AppContextType = {
    constants: data.constants,
    heroes: data.heroes,
    revisions: data.revisions,
    loading: data.loading,
    error: data.error,
    exportModalOpen,
    setExportModalOpen,
    generatedFiles,
    setGeneratedFiles,
    exportError,
    setExportError,
    refresh: data.refresh,
    addConstant: data.addConstant,
    updateConstant: data.updateConstant,
    deleteConstant: data.deleteConstant,
    getHeroes: data.getHeroes,
    getRevisions: data.getRevisions,
    addHero: data.addHero,
    updateHero: data.updateHero,
    deleteHero: data.deleteHero,
    getHeroAbilities: data.getHeroAbilities,
    addAbility: data.addAbility,
    updateAbility: data.updateAbility,
    deleteAbility: data.deleteAbility,
    getAbilityProperties: data.getAbilityProperties,
    addProperty: data.addProperty,
    updateProperty: data.updateProperty,
    deleteProperty: data.deleteProperty,
    exportFiles: data.exportFiles,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
