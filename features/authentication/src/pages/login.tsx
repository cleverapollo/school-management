import { clearUsersData, useAuth } from '@tyro/api';
import { LoadingScreen } from '@tyro/core';
import { useEffect } from 'react';

export default function Login() {
  const { login, isTokenInitialized } = useAuth();

  useEffect(() => {
    if (isTokenInitialized) {
      clearUsersData();
      login();
    }
  }, [isTokenInitialized, login]);

  return <LoadingScreen />;
}
