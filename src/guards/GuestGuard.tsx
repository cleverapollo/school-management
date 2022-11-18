import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import LoadingScreen from '../components/LoadingScreen';
import { useAuth, useUser } from '@tyro/api';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isTokenInitialized } = useAuth();
  const { isLoading } = useUser();

  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  if (isLoading || !isTokenInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
