import './styles/shell.css';
import { useAuth } from '@tyro/api';

import { LoadingScreen } from '@tyro/core';
import { Router } from './router';
import { IdleModal } from './components/idle-modal';

export * from './components/shell/provider';

export function AppShell() {
  const { isTokenInitialized } = useAuth();

  if (!isTokenInitialized) return <LoadingScreen />;

  return (
    <>
      <Router />
      <IdleModal />
    </>
  );
}
