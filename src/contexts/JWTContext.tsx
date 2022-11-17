import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";
import { EventType, InteractionType, RedirectRequest } from "@azure/msal-browser";
import { loginRequest, b2cPolicies } from '../config';
// utils
import { isValidToken, setSession } from '../utils/jwt';
import { apolloClient } from "../app/api/apollo";
import { GlobalUser, MyAuthDetailsDocument, MyAuthDetailsQuery } from "../app/api/generated";
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import { dispatch as storeDispatch, useTypedSelector } from "../store/store";
import { authDetailsSuccess, logout as clearState } from "../store/slices/auth";
import { useNavigate } from 'react-router';

// ----------------------------------------------------------------------

enum Types {
  Loading = 'LOADING',
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
  [Types.Loading]: {
    isLoading: boolean;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    case 'INITIALIZE':
      return {
        ...state,
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
  const { user, isUserAuthenticated } = useTypedSelector((state) => state.auth)
  const navigate = useNavigate()

  console.log({
    isAuthenticated
  });

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
        console.log('login success');
      }

      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        console.log('logout listen');
        localStorage.removeItem('accessToken');
        storeDispatch(clearState());
        dispatch({
          type: Types.Loading,
          payload: {
            isLoading: false
          }
        })
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  useEffect(() => {
    console.log({
      account,
      instance,
    });
    if (account) {
      dispatch({
        type: Types.Loading,
        payload: {
          isLoading: true
        }
      });
      instance.acquireTokenSilent({
        ...loginRequest,
        account: account
      }).then((response) => {
        if (response) {
          setSession(response?.accessToken || null);
          localStorage.setItem('accessToken', response?.accessToken || "");
          apolloClient.query<MyAuthDetailsQuery>({ query: MyAuthDetailsDocument })
            .then(result => {
              storeDispatch(authDetailsSuccess(result.data.myAuthDetails as GlobalUser));
              dispatch({
                type: Types.Login,
                payload: {
                  user: { token: response?.accessToken },
                },
              });
            }).catch((err: any) => {
              console.log(err);
              navigate('/auth/unauthorized', { replace: true });
            })
        }
      });
    }
  }, [account, instance]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (isAuthenticated && isUserAuthenticated && accessToken && isValidToken(accessToken)) {
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
    dispatch({
      type: Types.Loading,
      payload: {
        isLoading: true,
      }
    });
    instance.logout().catch(err => {
      console.log(err);
    })
    console.log('logout request');
  };

  const msalLogin = async () => {
    await instance.loginRedirect(loginRequest);
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
