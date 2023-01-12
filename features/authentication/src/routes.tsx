/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';
import LoadingScreen from '../../../src/components/LoadingScreen';
import GuestGuard from '../../../src/guards/GuestGuard';

const Login = lazy(() => import('./pages/login'));
const Callback = lazy(() => import('./pages/callback'));
const Unauthorized = lazy(() => import('./pages/unauthorized'));

function Loadable({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

export const routes: RouteObject = {
  path: 'auth',
  children: [
    {
      path: 'login',
      element: (
        <GuestGuard>
          <Loadable>
            <Login />
          </Loadable>
        </GuestGuard>
      ),
    },
    {
      path: 'callback',
      element: (
        <GuestGuard>
          <Loadable>
            <Callback />
          </Loadable>
        </GuestGuard>
      ),
    },
    {
      path: 'unauthorized',
      element: (
        <GuestGuard>
          <Loadable>
            <Unauthorized />
          </Loadable>
        </GuestGuard>
      ),
    },
  ],
};
