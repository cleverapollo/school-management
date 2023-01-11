/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { lazy, Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router';
import PermissionBasedGuard from '../../../src/guards/PermissionBasedGuard';
import LoadingScreen from '../../../src/components/LoadingScreen';

const AdminSchoolsPage = lazy(() => import('./pages/school'));
const AdminPeoplesPage = lazy(() => import('./pages/school/people'));
const GraphiQLPage = lazy(() => import('./pages/graphiql'));

function Loadable({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

export const routes: RouteObject = {
  path: 'admin',
  element: (
    <PermissionBasedGuard permissions={['tyro_admin:access']} hasContent>
      <Outlet />
    </PermissionBasedGuard>
  ),
  children: [
    {
      path: 'schools',
      element: (
        <Loadable>
          <AdminSchoolsPage />
        </Loadable>
      ),
    },
    {
      path: 'schools/:schoolId/people',
      element: (
        <Loadable>
          <AdminPeoplesPage />
        </Loadable>
      ),
    },
    {
      path: 'graphiql',
      element: (
        <Loadable>
          <GraphiQLPage />
        </Loadable>
      ),
    },
  ],
};
