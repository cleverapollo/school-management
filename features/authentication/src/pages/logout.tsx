import { useAuth } from '@tyro/api';
import { LoadingScreen } from '@tyro/core';
import { useEffect } from 'react';

export default function Login() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <LoadingScreen />;
}
