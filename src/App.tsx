import React from 'react';
// routes
import Router from './routes';
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
import { store } from "./store/store";
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
// redux
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
import { msalInstance, AuthProvider } from '@tyro/api';

// ----------------------------------------------------------------------

export const queryClient = new QueryClient();

export default function App() {
  /**
   * Using the event API, you can register an event callback that will do something when an event is emitted. 
   * When registering an event callback in a react component you will need to make sure you do 2 things.
   * 1) The callback is registered only once
   * 2) The callback is unregistered before the component unmounts.
   * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/events.md
   */

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReduxProvider store={store}> */}
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
      {/* </ReduxProvider> */}
    </QueryClientProvider>
  );
}
