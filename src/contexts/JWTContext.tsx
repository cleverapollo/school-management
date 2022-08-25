import { createContext, ReactNode, useEffect, useReducer } from 'react';
import auth0 from 'auth0-js'
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import {AUTH_CONFIG} from "../config";

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

//curl 'https://auth.implement.io/co/authenticate' \
//   -H 'authority: auth.implement.io' \
//   -H 'auth0-client: eyJuYW1lIjoiYXV0aDAuanMiLCJ2ZXJzaW9uIjoiOS4xNC4wIn0=' \
//   -H 'content-type: application/json' \
//   -H 'sec-ch-ua-mobile: ?0' \
//   -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 Edg/98.0.1108.62' \
//   -H 'sec-ch-ua-platform: "macOS"' \
//   -H 'accept: */*' \
//   -H 'origin: https://app.implement.io' \
//   -H 'sec-fetch-site: same-site' \
//   -H 'sec-fetch-mode: cors' \
//   -H 'sec-fetch-dest: empty' \
//   -H 'referer: https://app.implement.io/' \
//   -H 'accept-language: en-GB,en;q=0.9,en-US;q=0.8' \
//   --data-raw '{"client_id":"B6eesDHZUIvadoN3zc68YxQEGA9p5xrI","username":"tenant1045@implement.io","password":"ImplementersForLife123","realm":"Username-Password-Authentication","credential_type":"http://auth0.com/oauth/grant-type/password-realm"}' \
//   --compressed
function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get('/api/account/my-account');
          const { user } = response.data;

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
        console.error(err);
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
//   -H 'auth0-client: eyJuYW1lIjoiYXV0aDAuanMiLCJ2ZXJzaW9uIjoiOS4xNC4wIn0=' \
    let callbackUrl = `${window.location.origin}/auth/callback`
   var result = await webAuth.login({
      realm: webAuthDBConnection,
      username: email,
      redirectUri: callbackUrl,
      password: password,
    }, (err) => {

    });
    //
    // console.log(result)
    //
    // const response = {data: {accessToken: "", user: null}}
    // // const response = await axios.post('https://noreilly-test.eu.auth0.com/co/authenticate',{"client_id":"kOBEdeaHabGFemGsvJlwQEoqGCnFZJoP","username":email,"password":password,"realm":"Username-Password-Authentication","credential_type":"http://auth0.com/oauth/grant-type/password-realm"},{
    // //   headers: {
    // //     'authority': 'https://niall-test.com',
    // //     'auth0-client': 'kOBEdeaHabGFemGsvJlwQEoqGCnFZJoP'
    // //   }});
    // const { accessToken, user } = response.data;
    //
    //
    // dispatch({
    //   type: Types.Login,
    //   payload: {
    //     user,
    //   },
    // });
  };

  const postAuthCallback = async ()=> {
    webAuth.parseHash((err, authResult) => {
      if (err) {
        console.error(err)
      } else {
        console.log("login success")
        console.log(authResult)
          setSession(authResult?.accessToken || null);
        localStorage.setItem('accessToken', authResult?.accessToken || "");

        dispatch({
          type: Types.Login,
          payload: {
            user: {token:  authResult?.accessToken},
          },
        });
        //var result = await
        // apolloClient.query({query : MyAuthDetailsDocument})
        //   .then(result => {
        //     console.log('--------------------')
        //    console.log(result)
        //     dispatch({
        //       type: Types.Login,
        //       payload: {
        //         user: {myAuthDetails: result.data.myUSerDetails, accessToken: authResult?.accessToken},
        //       },
        //     });
        //
        //   }, error => {
        //     console.log(error)
        //   });
        // const {data, error, loading} = useMyAuthDetailsQuery()


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

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        postAuthCallback
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
