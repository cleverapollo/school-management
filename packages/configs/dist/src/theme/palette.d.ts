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
        5008: string;
        50012: string;
        50016: string;
        50024: string;
        50032: string;
        50048: string;
        50056: string;
        50080: string;
    }
}
declare const palette: {
    readonly light: {
        readonly mode: "light";
        readonly text: {
            readonly primary: string;
            readonly secondary: string;
            readonly disabled: string;
        };
        readonly background: {
            readonly paper: "#fff";
            readonly default: "#fff";
            readonly neutral: string;
        };
        readonly action: {
            readonly hover: string;
            readonly selected: string;
            readonly disabled: string;
            readonly disabledBackground: string;
            readonly focus: string;
            readonly hoverOpacity: number;
            readonly disabledOpacity: number;
            readonly active: string;
        };
        readonly divider: string;
        readonly common: {
            black: string;
            white: string;
        };
        readonly primary: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly secondary: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly info: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly success: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly warning: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly error: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly gray: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            5008: string;
            50012: string;
            50016: string;
            50024: string;
            50032: string;
            50048: string;
            50056: string;
            50080: string;
        };
        readonly slate: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            5008: string;
            50012: string;
            50016: string;
            50024: string;
            50032: string;
            50048: string;
            50056: string;
            50080: string;
        };
        readonly zinc: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly neutral: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly stone: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly red: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly orange: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly amber: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly yellow: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly lime: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly green: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly emerald: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly teal: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly cyan: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly sky: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly blue: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly indigo: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly violet: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly purple: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly fuchsia: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly pink: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly rose: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly gradients: {
            primary: string;
            info: string;
            success: string;
            warning: string;
            error: string;
        };
        readonly chart: {
            violet: string[];
            blue: string[];
            green: string[];
            yellow: string[];
            red: string[];
        };
    };
    readonly dark: {
        readonly mode: "dark";
        readonly text: {
            readonly primary: "#fff";
            readonly secondary: string;
            readonly disabled: string;
        };
        readonly background: {
            readonly paper: string;
            readonly default: string;
            readonly neutral: string;
        };
        readonly action: {
            readonly hover: string;
            readonly selected: string;
            readonly disabled: string;
            readonly disabledBackground: string;
            readonly focus: string;
            readonly hoverOpacity: number;
            readonly disabledOpacity: number;
            readonly active: string;
        };
        readonly divider: string;
        readonly common: {
            black: string;
            white: string;
        };
        readonly primary: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly secondary: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly info: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly success: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly warning: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly error: {
            contrastText: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            darker: string;
        };
        readonly gray: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            5008: string;
            50012: string;
            50016: string;
            50024: string;
            50032: string;
            50048: string;
            50056: string;
            50080: string;
        };
        readonly slate: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            5008: string;
            50012: string;
            50016: string;
            50024: string;
            50032: string;
            50048: string;
            50056: string;
            50080: string;
        };
        readonly zinc: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly neutral: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly stone: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly red: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly orange: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly amber: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly yellow: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly lime: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly green: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly emerald: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly teal: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly cyan: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly sky: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly blue: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly indigo: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly violet: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly purple: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly fuchsia: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly pink: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly rose: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        readonly gradients: {
            primary: string;
            info: string;
            success: string;
            warning: string;
            error: string;
        };
        readonly chart: {
            violet: string[];
            blue: string[];
            green: string[];
            yellow: string[];
            red: string[];
        };
    };
};
export default palette;
//# sourceMappingURL=palette.d.ts.map