import palette from '../src/theme/palette';
import type { CustomShadowOptions } from '../src/theme/shadows';

type TyroPalette = typeof palette['light'];

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

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadowOptions;
    isDark: boolean;
    isLight: boolean;
  }
  interface ThemeOptions {
    customShadows: CustomShadowOptions;
    isDark: boolean;
    isLight: boolean;
  }
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

  interface Palette extends TyroPalette {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }

  interface PaletteOptions extends TyroPalette {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
}