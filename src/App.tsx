import React from 'react';
// routes
import { MsalProvider } from "@azure/msal-react";
import {
  QueryClientProvider,
  QueryClient
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// theme
import ThemeProvider from './theme';
// components
import ThemeSettings from './components/settings';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import NotistackProvider from './components/NotistackProvider';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
import { msalInstance, AuthProvider, queryClient } from '@tyro/api';
import Router from './routes';

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
      <HelmetProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SettingsProvider>
            <CollapseDrawerProvider>
              <BrowserRouter>
                <MsalProvider instance={msalInstance}>
                  <AuthProvider>
                    <MotionLazyContainer>
                      <ThemeProvider>
                        <ThemeSettings>
                          <NotistackProvider>
                            <ProgressBarStyle />
                            <ScrollToTop />
                            <Router />
                            <ReactQueryDevtools />
                          </NotistackProvider>
                        </ThemeSettings>
                      </ThemeProvider>
                    </MotionLazyContainer>
                  </AuthProvider>
                </MsalProvider>
              </BrowserRouter>
            </CollapseDrawerProvider>
          </SettingsProvider>
        </LocalizationProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
