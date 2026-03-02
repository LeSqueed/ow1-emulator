export interface DarkThemeColors {
  text: string;
  background: string;
  codeColor: string;
  codeBg: string;
  secondary: string;
  menuBg: string;
  headerBg: string;
  drawerBg: string;
  cardBg: string;
  tableHeaderBg: string;
  tableHeaderColor: string;
  tableRowHoverBg: string;
  tableBorderColor: string;
  inputBg: string;
  inputBorder: string;
  modalBg: string;
}

export interface LightThemeColors {
  text: string;
  background: string;
  codeColor: string;
  codeBg: string;
  secondary: string;
  menuBg: string;
  headerBg: string;
  drawerBg: string;
  cardBg: string;
  tableHeaderBg: string;
  tableHeaderColor: string;
  tableRowHoverBg: string;
  tableBorderColor: string;
  inputBg: string;
  inputBorder: string;
  modalBg: string;
}

// ---------------------------------------------------------------------------
// Overwatch dark palette
// Brand orange (#F99E1A) is the primary accent — blue is secondary (shields).
// Backgrounds are near-black neutrals, slightly cool to contrast the warm accent.
// ---------------------------------------------------------------------------
export const darkModeColors: DarkThemeColors = {
  text: '#f0ede8',         // warm white — OW menu text
  background: '#0e0e12',   // near-black, very slightly cool
  codeColor: '#ffb340',    // amber-gold — stat/value readability
  codeBg: '#1c1810',       // warm dark — code chip bg
  secondary: '#8a8070',    // warm grey — secondary labels
  menuBg: '#0a0a0f',       // darkest — sidebar
  headerBg: '#0a0a0f',
  drawerBg: '#15151e',
  cardBg: '#15151e',       // dark card panels
  tableHeaderBg: '#1c1c28',
  tableHeaderColor: '#f0ede8',
  tableRowHoverBg: '#1e1e2a',
  tableBorderColor: '#2c2c40',
  inputBg: '#0e0e12',
  inputBorder: '#2c2c40',
  modalBg: '#15151e',
};

export const lightModeColors: LightThemeColors = {
  text: '#1a1410',
  background: '#f5f2ed',
  codeColor: '#8a4800',
  codeBg: '#ffecd4',
  secondary: '#6b5e50',
  menuBg: '#ffffff',
  headerBg: '#ffffff',
  drawerBg: '#ffffff',
  cardBg: '#ffffff',
  tableHeaderBg: '#f0ece5',
  tableHeaderColor: '#1a1410',
  tableRowHoverBg: '#fdf6ee',
  tableBorderColor: '#d4c8b8',
  inputBg: '#ffffff',
  inputBorder: '#d4c8b8',
  modalBg: '#ffffff',
};

import type { ThemeConfig } from 'antd';
import theme from 'antd/es/theme';

const { defaultAlgorithm, darkAlgorithm } = theme;

export const THEME_LIGHT: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: '#f99e1a',
    colorLink: '#c97800',
    borderRadius: 4,
    fontFamily: "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Table: {
      headerBg: lightModeColors.tableHeaderBg,
      headerColor: lightModeColors.tableHeaderColor,
      rowHoverBg: lightModeColors.tableRowHoverBg,
      borderColor: lightModeColors.tableBorderColor,
    },
    Card: { colorBgContainer: lightModeColors.cardBg },
    Modal: { contentBg: lightModeColors.modalBg, headerBg: lightModeColors.modalBg },
    Drawer: { colorBgElevated: lightModeColors.drawerBg },
    Input: { colorBgContainer: lightModeColors.inputBg, colorBorder: lightModeColors.inputBorder },
    Select: { colorBgContainer: lightModeColors.inputBg, colorBorder: lightModeColors.inputBorder },
  },
};

export const THEME_DARK: ThemeConfig = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: '#f99e1a',
    colorLink: '#ffb340',
    borderRadius: 4,
    fontFamily: "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Table: {
      headerBg: darkModeColors.tableHeaderBg,
      headerColor: darkModeColors.tableHeaderColor,
      rowHoverBg: darkModeColors.tableRowHoverBg,
      borderColor: darkModeColors.tableBorderColor,
    },
    Card: { colorBgContainer: darkModeColors.cardBg },
    Modal: { contentBg: darkModeColors.modalBg, headerBg: darkModeColors.modalBg },
    Drawer: { colorBgElevated: darkModeColors.drawerBg },
    Input: { colorBgContainer: darkModeColors.inputBg, colorBorder: darkModeColors.inputBorder },
    Select: { colorBgContainer: darkModeColors.inputBg, colorBorder: darkModeColors.inputBorder },
  },
};

export const getPropertyTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    DAMAGE: 'volcano', HEALING: 'green', COOLDOWN: 'geekblue', DURATION: 'purple',
    RATE: 'orange', RANGE: 'blue', BUFFER: 'magenta', ULTIMATE: 'gold',
    MULTIPLIER: 'geekblue', PHYSICS: 'cyan', DELAY: 'magenta',
    SPEED: 'blue', RADIUS: 'orange', MAX_CHARGES: 'purple'
  };
  return colors[type] || 'default';
};

// Role colors — OW canonical: Tank=blue, DPS=red-orange, Support=green
export const getRoleColor = (role: string): string => {
  const colors: Record<string, string> = {
    Tank: '#1a5ca0',
    Dps: '#c44010',
    Support: '#1a8a4a'
  };
  return colors[role] || 'default';
};

// Health type colors — white=health, gold=armor, blue=shields (OW HUD)
export const getHealthTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    health: '#3a3a4a',
    armor: '#8a5f00',
    shields: '#1a4a8a'
  };
  return colors[type.toLowerCase()] || 'default';
};

export const getThemeConfig = (darkMode: boolean): ThemeConfig => {
  return darkMode ? THEME_DARK : THEME_LIGHT;
};
