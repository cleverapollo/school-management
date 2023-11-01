import palette from '@tyro/core/src/theme/palette';
import type { CustomShadowOptions } from '@tyro/core/src/theme/shadows';

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

declare module '@mui/material/Alert' {
  interface AlertPropsColorOverrides {
    primary: true;
  }
  interface AlertPropsSeverityOverrides {
    primary: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsVariantOverrides {
    soft: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    soft: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    soft: true;
  }

  interface ChipPropsColorOverrides {
    red: true;
    orange: true;
    amber: true;
    yellow: true;
    lime: true;
    green: true;
    emerald: true;
    teal: true;
    cyan: true;
    sky: true;
    blue: true;
    violet: true;
    purple: true;
    fuchsia: true;
    pink: true;
    rose: true;
    slate: true;
    gray: true;
  }
}

declare module '@mui/material/ToggleButton' {
  interface ToggleButtonPropsColorOverrides {
    red: true;
    orange: true;
    amber: true;
    yellow: true;
    lime: true;
    green: true;
    emerald: true;
    teal: true;
    cyan: true;
    sky: true;
    blue: true;
    violet: true;
    purple: true;
    fuchsia: true;
    pink: true;
    rose: true;
  }
}

declare module '@mui/material/Fab' {
  interface FabPropsVariantOverrides {
    outlined: true;
    outlinedExtended: true;
    soft: true;
    softExtended: true;
  }
}

declare module '@mui/material/Pagination' {
  interface PaginationPropsVariantOverrides {
    soft: true;
  }

  interface PaginationPropsColorOverrides {
    info: true;
    success: true;
    warning: true;
    error: true;
  }
}