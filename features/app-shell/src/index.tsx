/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useAuth } from '@tyro/api';
import { Router } from './router';
import LoadingScreen from '../../../src/components/LoadingScreen';
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
