/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';
import LoadingScreen from '../../../src/components/LoadingScreen';

const Rooms = lazy(() => import('./pages/rooms'));
const AcademicNamespaceList = lazy(() => import('./pages/academic-namespaces'));
const Subjects = lazy(() => import('./pages/subjects'));

function Loadable({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

export const routes: RouteObject = {
  path: 'settings',
  children: [
    {
      path: 'rooms',
      element: (
        <Loadable>
          <Rooms />
        </Loadable>
      ),
    },
    {
      path: 'academic-namespaces',
      element: (
        <Loadable>
          <AcademicNamespaceList />
        </Loadable>
      ),
    },
    {
      path: 'subjects',
      element: (
        <Loadable>
          <Subjects />
        </Loadable>
      ),
    },
  ],
};
