import { useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
// import useAuth from '../hooks/useAuth';
// pages
import Login from '../features/authentication/Login';
// components
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '@tyro/api';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isTokenInitialized } = useAuth();

  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  if (!isTokenInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Navigate to={`auth/login`} />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
