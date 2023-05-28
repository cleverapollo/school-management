import { AccountInfo, PublicClientApplication } from '@azure/msal-browser';
import { setToken } from './jwt';

/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_signin',
    forgotPassword: 'B2C_1_reset_password',
    editProfile: 'B2C_1_edit_profile_v2',
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://tyroschool.b2clogin.com/tyroschool.onmicrosoft.com/B2C_1_signin',
    },
    forgotPassword: {
      authority:
        'https://tyroschool.b2clogin.com/tyroschool.onmicrosoft.com/B2C_1_reset_password',
    },
    editProfile: {
      authority:
        'https://tyroschool.b2clogin.com/tyroschool.onmicrosoft.com/b2c_1_edit_profile',
    },
  },
  authorityDomain: 'tyroschool.b2clogin.com',
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    clientId: '99177d7e-e8ed-4c67-ab73-07eafc664492', // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Use a sign-up/sign-in user-flow as a default authority
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: `${window.location.origin}/auth/callback`, // Points to window.location.origin. You must register this URI on Azure Portal/App Registration.
    postLogoutRedirectUri: '/logout', // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: [
    'openid',
    'profile',
    'https://tyroschool.onmicrosoft.com/tyro-api/graphql.use',
  ],
};

interface AcquireMsalTokenProps {
  instance?: PublicClientApplication;
  account?: AccountInfo;
}

export async function acquireMsalToken(
  { instance = msalInstance, account }: AcquireMsalTokenProps = {
    instance: msalInstance,
  }
) {
  const activeAccount = account ?? instance.getActiveAccount();
  console.log('activeAccount');
  console.log(activeAccount);
  try {
    const response = await instance.acquireTokenSilent({
      ...loginRequest,
      account: activeAccount ?? undefined,
    });
    console.log(response);
    instance.setActiveAccount(activeAccount);
    const token = response?.accessToken || null;
    console.log(token);
    setToken(token);
    return token;
  } catch (error) {
    instance.logoutRedirect();
  }
}
