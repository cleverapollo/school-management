/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { msalInstance, clearUsersData } from '@tyro/api';
import { lazy, Suspense } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import LoadingScreen from '../../../src/components/LoadingScreen';

const Login = lazy(() => import('./pages/login'));
const Logout = lazy(() => import('./pages/logout'));
const Callback = lazy(() => import('./pages/callback'));
const Unauthorized = lazy(() => import('./pages/unauthorized'));

function Loadable({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

export const routes: RouteObject[] = [
  {
    loader: () => {
      const activeAccount = msalInstance.getActiveAccount();
      return activeAccount ? redirect('/groups/class') : null;
    },
    errorElement: (
      <Loadable>
        <Unauthorized />
      </Loadable>
    ),
    children: [
      {
        path: '/login',
        element: (
          <Loadable>
            <Login />
          </Loadable>
        ),
      },
      {
        path: '/unauthorized',
        element: (
          <Loadable>
            <Unauthorized />
          </Loadable>
        ),
      },
    ],
  },
  {
    path: '/auth/callback',
    element: (
      <Loadable>
        <Callback />
      </Loadable>
    ),
  },
  {
    path: '/logout',
    element: (
      <Loadable>
        <Logout />
      </Loadable>
    ),
  },
];
