import { msalInstance } from '@tyro/api';
import { lazyWithRetry, LoadingScreen } from '@tyro/core';
import { Suspense } from 'react';
import { RouteObject, redirect } from 'react-router-dom';

const Login = lazyWithRetry(() => import('./pages/login'));
const Logout = lazyWithRetry(() => import('./pages/logout'));
const Callback = lazyWithRetry(() => import('./pages/callback'));
const Unauthorized = lazyWithRetry(() => import('./pages/unauthorized'));

function Loadable({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

export const routes: RouteObject[] = [
  {
    loader: () => {
      const activeAccount = msalInstance.getActiveAccount();
      return activeAccount ? redirect('/') : null;
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
