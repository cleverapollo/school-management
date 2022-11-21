import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';
import { loginRequest } from '../utils/msal-configs';
import { setToken } from '../utils/jwt';

export type AuthContextValue = {
  isAuthenticated: boolean;
  isTokenInitialized: boolean;
  logout: () => void;
  login: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const isAuthenticated = useIsAuthenticated();
  const [isTokenInitialized, setIsTokenInitialized] = useState(false);

  const logout = useCallback(() => {
    instance.logout();
  }, [instance]);

  const login = useCallback(() => {
    instance.loginRedirect(loginRequest);
  }, [instance]);

  useEffect(() => {
    if (account) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account,
        })
        .then((response) => {
          if (response) {
            setToken(response?.accessToken || null);
          }
          setIsTokenInitialized(true);
        })
        .catch(({ name }: Error) => {
          if (name === 'InteractionRequiredAuthError') {
            logout();
          }
        });
    } else {
      setIsTokenInitialized(true);
    }
  }, [account, instance]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isTokenInitialized,
      login,
      logout,
    }),
    [isAuthenticated, isTokenInitialized, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthContext');
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth };
