import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

interface GradientsPaletteOptions {
  primary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

interface ChartPaletteOptions {
  violet: string[];
  blue: string[];
  green: string[];
  yellow: string[];
  red: string[];
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface Palette {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }
  interface PaletteOptions {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }
}

declare module '@mui/material' {
  interface Color {
    0: string;
    500_8: string;
    500_12: string;
    500_16: string;
    500_24: string;
    500_32: string;
    500_48: string;
    500_56: string;
    500_80: string;
  }
}

const GRAY = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  500_8: alpha('#6b7280', 0.08),
  500_12: alpha('#6b7280', 0.12),
  500_16: alpha('#6b7280', 0.16),
  500_24: alpha('#6b7280', 0.24),
  500_32: alpha('#6b7280', 0.32),
  500_48: alpha('#6b7280', 0.48),
  500_56: alpha('#6b7280', 0.56),
  500_80: alpha('#6b7280', 0.8),
};

const SLATE = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  500_8: alpha('#64748b', 0.08),
  500_12: alpha('#64748b', 0.12),
  500_16: alpha('#64748b', 0.16),
  500_24: alpha('#64748b', 0.24),
  500_32: alpha('#64748b', 0.32),
  500_48: alpha('#64748b', 0.48),
  500_56: alpha('#64748b', 0.56),
  500_80: alpha('#64748b', 0.8),
};

const ZINC = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
}

const NEUTRAL = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
};

const STONE = {
  50: '#fafaf9',
  100: '#f5f5f4',
  200: '#e7e5e4',
  300: '#d6d3d1',
  400: '#a8a29e',
  500: '#78716c',
  600: '#57534e',
  700: '#44403c',
  800: '#292524',
  900: '#1c1917',
}

const RED = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
}

const ORANGE = {
  50: '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: '#f97316',
  600: '#ea580c',
  700: '#c2410c',
  800: '#9a3412',
  900: '#7c2d12',
}

const AMBER = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
}

const YELLOW = {
  50: '#fefce8',
  100: '#fef9c3',
  200: '#fef08a',
  300: '#fde047',
  400: '#facc15',
  500: '#eab308',
  600: '#ca8a04',
  700: '#a16207',
  800: '#854d0e',
  900: '#713f12',
}

const LIME = {
  50: '#f7fee7',
  100: '#ecfccb',
  200: '#d9f99d',
  300: '#bef264',
  400: '#a3e635',
  500: '#84cc16',
  600: '#65a30d',
  700: '#4d7c0f',
  800: '#3f6212',
  900: '#365314',
}

const GREEN = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
}

const EMERALD = {
  50: '#ecfdf5',
  100: '#d1fae5',
  200: '#a7f3d0',
  300: '#6ee7b7',
  400: '#34d399',
  500: '#10b981',
  600: '#059669',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b',
}

const TEAL = {
  50: '#f0fdfa',
  100: '#ccfbf1',
  200: '#99f6e4',
  300: '#5eead4',
  400: '#2dd4bf',
  500: '#14b8a6',
  600: '#0d9488',
  700: '#0f766e',
  800: '#115e59',
  900: '#134e4a',
}

const CYAN = {
  50: '#ecfeff',
  100: '#cffafe',
  200: '#a5f3fc',
  300: '#67e8f9',
  400: '#22d3ee',
  500: '#06b6d4',
  600: '#0891b2',
  700: '#0e7490',
  800: '#155e75',
  900: '#164e63',
}

const SKY = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
}

const BLUE = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
}

const INDIGO = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
  500_8: alpha('#6366f1', 0.08),
  500_12: alpha('#6366f1', 0.12),
  500_16: alpha('#6366f1', 0.16),
  500_24: alpha('#6366f1', 0.24),
  500_32: alpha('#6366f1', 0.32),
  500_48: alpha('#6366f1', 0.48),
  500_56: alpha('#6366f1', 0.56),
  500_80: alpha('#6366f1', 0.8),
}

const VIOLET = {
  50: '#f5f3ff',
  100: '#ede9fe',
  200: '#ddd6fe',
  300: '#c4b5fd',
  400: '#a78bfa',
  500: '#8b5cf6',
  600: '#7c3aed',
  700: '#6d28d9',
  800: '#5b21b6',
  900: '#4c1d95',
}

const PURPLE = {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
}

const FUCHSIA = {
  50: '#fdf4ff',
  100: '#fae8ff',
  200: '#f5d0fe',
  300: '#f0abfc',
  400: '#e879f9',
  500: '#d946ef',
  600: '#c026d3',
  700: '#a21caf',
  800: '#86198f',
  900: '#701a75',
}

const PINK = {
  50: '#fdf2f8',
  100: '#fce7f3',
  200: '#fbcfe8',
  300: '#f9a8d4',
  400: '#f472b6',
  500: '#ec4899',
  600: '#db2777',
  700: '#be185d',
  800: '#9d174d',
  900: '#831843',
}

const ROSE = {
  50: '#fff1f2',
  100: '#ffe4e6',
  200: '#fecdd3',
  300: '#fda4af',
  400: '#fb7185',
  500: '#f43f5e',
  600: '#e11d48',
  700: '#be123c',
  800: '#9f1239',
  900: '#881337',
}


// SETUP COLORS
const PRIMARY = {
  lighter: INDIGO[100],
  light: INDIGO[300],
  main: INDIGO[500],
  dark: INDIGO[700],
  darker: INDIGO[900],
};
const SECONDARY = {
  lighter: BLUE[100],
  light: BLUE[300],
  main: BLUE[500],
  dark: BLUE[700],
  darker: BLUE[900],
};
const INFO = {
  lighter: CYAN[100],
  light: CYAN[300],
  main: CYAN[500],
  dark: CYAN[700],
  darker: CYAN[900],
};
const SUCCESS = {
  lighter: EMERALD[100],
  light: EMERALD[300],
  main: EMERALD[500],
  dark: EMERALD[700],
  darker: EMERALD[900],
};
const WARNING = {
  lighter: AMBER[100],
  light: AMBER[300],
  main: AMBER[500],
  dark: AMBER[700],
  darker: AMBER[900],
};
const ERROR = {
  lighter: ROSE[100],
  light: ROSE[300],
  main: ROSE[500],
  dark: ROSE[700],
  darker: ROSE[900],
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
};

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY, contrastText: '#fff' },
  secondary: { ...SECONDARY, contrastText: '#fff' },
  info: { ...INFO, contrastText: '#fff' },
  success: { ...SUCCESS, contrastText: SLATE[800] },
  warning: { ...WARNING, contrastText: SLATE[800] },
  error: { ...ERROR, contrastText: '#fff' },
  gray: GRAY,
  slate: SLATE,
  zinc: ZINC,
  neutral: NEUTRAL,
  stone: STONE,
  red: RED,
  orange: ORANGE,
  amber: AMBER,
  yellow: YELLOW,
  lime: LIME,
  green: GREEN,
  emerald: EMERALD,
  teal: TEAL,
  cyan: CYAN,
  sky: SKY,
  blue: BLUE,
  indigo: INDIGO,
  violet: VIOLET,
  purple: PURPLE,
  fuchsia: FUCHSIA,
  pink: PINK,
  rose: ROSE,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  action: {
    hover: INDIGO[500_8],
    selected: INDIGO[500_16],
    disabled: SLATE[500_48],
    disabledBackground: SLATE[500_24],
    focus: INDIGO[500_16],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

const palette = {
  light: {
    ...COMMON,
    mode: 'light',
    text: { primary: SLATE[800], secondary: SLATE[600], disabled: SLATE[500] },
    background: { paper: '#fff', default: '#fff', neutral: SLATE[50] },
    action: { active: SLATE[600], ...COMMON.action },
    divider: SLATE[100],
  },
  dark: {
    ...COMMON,
    mode: 'dark',
    text: { primary: '#fff', secondary: SLATE[500], disabled: SLATE[600] },
    background: { paper: SLATE[800], default: SLATE[900], neutral: SLATE[500_16] },
    action: { active: SLATE[500], ...COMMON.action },
    divider: SLATE[700],
  },
} as const;

export default palette;
