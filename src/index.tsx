// i18n
import './i18n/i18n';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-image-lightbox/style.css';
import { Provider as ReduxProvider } from 'react-redux';

// editor
import 'react-quill/dist/quill.snow.css';


// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
// @msal
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./config";
// redux
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';

// Check our docs
// https://docs-minimals.vercel.app/authentication/ts-version

import { AuthProvider } from './contexts/JWTContext';
// import { AuthProvider } from './contexts/Auth0Context';
// import { AuthProvider } from './contexts/FirebaseContext';
// import { AuthProvider } from './contexts/AwsCognitoContext';

//
import App from './App';
import reportWebVitals from './reportWebVitals';
import { setContext } from "@apollo/client/link/context";
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import { store } from "./store/store";

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders. 
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const msalInstance = new PublicClientApplication(msalConfig);
// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from ApplicationSettings if it exists
  const token = localStorage.getItem('accessToken');

  // return the headers to the context so HTTP link can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

root.render(
  // <AuthProvider>
  <ReduxProvider store={store}>
    <HelmetProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SettingsProvider>
          <CollapseDrawerProvider>
            {/* Remove /tyro-web-ui when release, it's just for github pages */}
            <BrowserRouter basename="/tyro-web-ui">
              <App msalInstance={msalInstance} />
            </BrowserRouter>
          </CollapseDrawerProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </HelmetProvider>
  </ReduxProvider>
  // </AuthProvider>
);

reportWebVitals();
