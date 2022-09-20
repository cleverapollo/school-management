import { createContext, ReactNode, useEffect, useReducer } from 'react';
import auth0 from 'auth0-js'
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { EventType, InteractionType } from "@azure/msal-browser";
import { loginRequest, b2cPolicies } from '../config';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import { AUTH_CONFIG } from "../config";
import { apolloClient } from "../app/api/apollo";
import { GlobalUser, MyAuthDetailsDocument, MyAuthDetailsQuery } from "../app/api/generated";
import { dispatch as storeDispatch } from "../store/store";
import { authDetailsSuccess } from "../store/slices/auth";

export const webAuth = new auth0.WebAuth({
  domain: AUTH_CONFIG.domain,
  redirectUri: `${window.location.origin}/callback`,
  clientID: AUTH_CONFIG.clientId,
  responseType: 'token id_token',
  scope: 'openid profile email',
  audience: AUTH_CONFIG.audience,
})


// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

export const acquireAccessToken = async (msalInstance: any) => {
  const activeAccount = msalInstance.getActiveAccount(); // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
  const accounts = msalInstance.getAllAccounts();
  if (!activeAccount && accounts.length === 0) {
    /*
    * User is not signed in. Throw error or wait for user to login.
    * Do not attempt to log a user in outside of the context of MsalProvider
    */
  }
  const request = {
    scopes: ['openid', 'profile', 'email'],
    account: activeAccount || accounts[0]
  };

  const authResult = await msalInstance.acquireTokenSilent(request);
  console.log(`authResult => ${JSON.stringify(authResult)}`);
  return authResult.accessToken ? authResult.accessToken : null;//authResult.idToken;
};

export const webAuthDBConnection = 'Username-Password-Authentication'


type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];


const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const callbackId = instance.addEventCallback(async (event: any) => {
      console.log(`event => ${JSON.stringify(event.eventType)}`);
      if (event.eventType === EventType.LOGIN_FAILURE) {
        if (event.error && event.error.errorMessage.indexOf("AADB2C90118") > -1) {
          if (event.interactionType === InteractionType.Redirect) {
            instance.loginRedirect(b2cPolicies.authorities.forgotPassword);
          } else if (event.interactionType === InteractionType.Popup) {
            instance.loginPopup(b2cPolicies.authorities.forgotPassword)
              .catch(e => {
                console.log(e);
              });
          }
        }
      }

      if (event.eventType === EventType.LOGIN_SUCCESS) {
        console.log(`payload: => ${event?.payload}`);
        if (event?.payload) {
          /**
           * We need to reject id tokens that were not issued with the default sign-in policy.
           * "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr").
           * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
           */
          if (event.payload.idTokenClaims.acr === b2cPolicies.names.forgotPassword) {
            window.alert("Password has been reset successfully. \nPlease sign-in with your new password");
            return instance.logout();
          }
        }
      }

      if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS || event.eventType === EventType.LOGIN_SUCCESS) {
        const accessToken = await acquireAccessToken(instance);
        if (!accessToken) {
          alert('Accesstoken is not provided');
          return;
        }
        console.log(`accesstoken => ${accessToken}`);
        setSession(accessToken || null);
        apolloClient.query<MyAuthDetailsQuery>({ query: MyAuthDetailsDocument })
          .then(result => {
            console.log('-=-=-=---=-=-=-')
            console.log(result);
            storeDispatch(authDetailsSuccess(result.data.myAuthDetails as GlobalUser));
            dispatch({
              type: Types.Login,
              payload: {
                user: { token: accessToken },
              },
            });
          })
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log(`authenticated => ${isAuthenticated}`);
        const accessToken = localStorage.getItem('accessToken');
        if (isAuthenticated /*&& accessToken && isValidToken(accessToken)*/) {
          setSession(accessToken);
          const { user } = state;
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    //-H 'authority: auth.implement.io' \
    //-H 'auth0-client: eyJuYW1lIjoiYXV0aDAuanMiLCJ2ZXJzaW9uIjoiOS4xNC4wIn0=' \
    let callbackUrl = `${window.location.origin}/auth/callback`
    var result = await webAuth.login({
      realm: webAuthDBConnection,
      username: email,
      redirectUri: callbackUrl,
      password: password,
    }, (err) => {
      console.log(err)
    });
  };

  const postAuthCallback = async () => {
    webAuth.parseHash((err, authResult) => {
      if (err) {
        console.error(err)
      } else {
        console.log("login success")
        console.log(authResult)
        setSession(authResult?.accessToken || null);
        localStorage.setItem('accessToken', authResult?.accessToken || "");

        apolloClient.query<MyAuthDetailsQuery>({ query: MyAuthDetailsDocument })
          .then(result => {
            console.log('-=-=-=---=-=-=-')
            console.log(result);
            storeDispatch(authDetailsSuccess(result.data.myAuthDetails as GlobalUser));
            dispatch({
              type: Types.Login,
              payload: {
                user: { token: authResult?.accessToken },
              },
            });
          })
      }
    });
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: Types.Register,
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  const msalLogin = async () => {
    await instance.loginPopup(loginRequest)
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        postAuthCallback,
        msalLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
