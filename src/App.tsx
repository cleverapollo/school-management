import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// theme
import { ThemeProvider } from '@tyro/core';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
// @mui
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AuthProvider, DataProvider } from '@tyro/api';
import { AppShell } from '@tyro/app-shell';
import { useCurrentLanguage } from '@tyro/i18n';

export default function App() {
  const { dayjsLocale } = useCurrentLanguage();

  return (
    <DataProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={dayjsLocale}>
        <AuthProvider>
          <MotionLazyContainer>
            <ThemeProvider>
              <AppShell />
              <ReactQueryDevtools />
            </ThemeProvider>
          </MotionLazyContainer>
        </AuthProvider>
      </LocalizationProvider>
    </DataProvider>
  );
}
