import { useMemo, ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import { ToastProvider } from '../providers/toast';
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  // Todo: setup new way to set theme mode
  // const isLight = themeMode === 'light';
  const isLight = true;

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      isDark: !isLight,
      isLight,
      palette: isLight ? palette.light : palette.dark,
      typography,
      breakpoints,
      shape: { borderRadius: 8 },
      shadows: isLight ? shadows.light : shadows.dark,
      customShadows: isLight ? customShadows.light : customShadows.dark,
    }),
    [isLight]
  );

  const theme = createTheme(themeOptions);

  // @ts-expect-error
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <ToastProvider>
          <CssBaseline />
          {children}
        </ToastProvider>
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
