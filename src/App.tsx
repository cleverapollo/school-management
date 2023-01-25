import {
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// theme
import ThemeProvider from './theme';
import { ProgressBarStyle } from './components/ProgressBar';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import NotistackProvider from './components/NotistackProvider';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AuthProvider, queryClient } from '@tyro/api';
import { AppShell } from '@tyro/app-shell';

// ----------------------------------------------------------------------

export default function App() {
  /**
   * Using the event API, you can register an event callback that will do something when an event is emitted. 
   * When registering an event callback in a react component you will need to make sure you do 2 things.
   * 1) The callback is registered only once
   * 2) The callback is unregistered before the component unmounts.
   * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/events.md
   */

  // Should delete redux router when endpoints migrated

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <MotionLazyContainer>
            <ThemeProvider>
              <NotistackProvider>
                <ProgressBarStyle />
                <AppShell />
                <ReactQueryDevtools />
              </NotistackProvider>
            </ThemeProvider>
          </MotionLazyContainer>
        </AuthProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}
