import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";
import { AccountInfo, EventType, InteractionType, RedirectRequest } from "@azure/msal-browser";
import { loginRequest, b2cPolicies } from '../config';
// utils
import { isValidToken, setSession } from '../utils/jwt';
import { AUTH_CONFIG } from "../config";
import { apolloClient } from "../app/api/apollo";
import { GlobalUser, MyAuthDetailsDocument, MyAuthDetailsQuery } from "../app/api/generated";
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import { dispatch as storeDispatch } from "../store/store";
import { authDetailsSuccess, logout as clearState } from "../store/slices/auth";

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

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
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const callbackId = instance.addEventCallback(async (event: any) => {
      if (event.eventType === EventType.LOGIN_FAILURE) {
        if (event.error && event.error.errorMessage.indexOf("AADB2C90118") > -1) {
          if (event.interactionType === InteractionType.Redirect) {
            instance.loginRedirect(b2cPolicies.authorities.forgotPassword as RedirectRequest);
          } else if (event.interactionType === InteractionType.Popup) {
            instance.loginPopup(b2cPolicies.authorities.forgotPassword as RedirectRequest)
              .catch(e => {
                console.log(e);
              });
          }
        }
      }

      if (event.eventType === EventType.LOGIN_SUCCESS) {
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
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  useEffect(() => {
    if (account) {
      instance.acquireTokenSilent({
        ...loginRequest,
        account: account
      }).then((response) => {
        if (response) {
          localStorage.setItem('accessToken', response.accessToken);
          dispatch({
            type: Types.Login,
            payload: {
              user: account,
            },
          });
          storeDispatch(authDetailsSuccess(account));
          setSession(response?.accessToken || null);
          localStorage.setItem('accessToken', response?.accessToken || "");

          apolloClient.query<MyAuthDetailsQuery>({ query: MyAuthDetailsDocument })
            .then(result => {
              console.log('-=-=-=---=-=-=-')
              console.log(result);
              // storeDispatch(authDetailsSuccess( result.data.myAuthDetails as AccountInfo));
              dispatch({
                type: Types.Login,
                payload: {
                  user: { token: response?.accessToken },
                },
              });
            }).catch((err: any) => {
              console.log(err);
            })
        }
      });
    }
  }, [account, instance]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (isAuthenticated && accessToken && isValidToken(accessToken)) {
          const { user } = state;
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user
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

  const logout = async () => {
    localStorage.removeItem('accessToken');
    storeDispatch(clearState());
    instance.logout();
  };

  const msalLogin = async () => {
    await instance.loginRedirect(loginRequest)
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        msalLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
