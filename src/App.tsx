import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// theme
import ThemeProvider from './theme';
import { ProgressBarStyle } from './components/ProgressBar';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AuthProvider, DataProvider } from '@tyro/api';
import { AppShell } from '@tyro/app-shell';

export default function App() {
  return (
    <DataProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <MotionLazyContainer>
            <ThemeProvider>
              <ProgressBarStyle />
              <AppShell />
              <ReactQueryDevtools />
            </ThemeProvider>
          </MotionLazyContainer>
        </AuthProvider>
      </LocalizationProvider>
    </DataProvider>
  );
}
