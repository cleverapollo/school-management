import { useContext } from 'react';
//
import { AuthContext } from '../contexts/JWTContext';
// import { AuthContext } from '../contexts/Auth0Context';
// import { AuthContext } from '../contexts/FirebaseContext';
// import { AuthContext } from '../contexts/AwsCognitoContext';

// ----------------------------------------------------------------------

const useAuth = () => {
  console.log(AuthContext)
  const context = useContext(AuthContext);
  console.log(context)
  if (!context) throw new Error('Auth context must be use inside AuthProvider');

  return context;
};

export default useAuth;
