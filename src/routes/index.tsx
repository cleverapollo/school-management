import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import AuthGuard from '../guards/AuthGuard';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '@tyro/api';
import CalendarRoutes from '../features/calendar/routes';
import Mail from '../features/mail/routes';

// ----------------------------------------------------------------------
import { routes as AuthRoutes } from '@tyro/authentication';
import { routes as Groups } from '@tyro/groups';
import { routes as AdminRoutes } from '@tyro/tyro-admin';
import { routes as Settings } from '@tyro/settings';


const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();
  const isDashboard = !pathname.includes('/login') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    AuthRoutes,
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/one" replace />, index: true },
        { path: 'one', element: <PageOne /> },
        AdminRoutes,
        CalendarRoutes,
        Mail,
        ...Groups,
        Settings,
        {
          path: 'user',
          children: [
            { element: <Navigate to="/user/profile" replace />, index: true },
            { path: 'account', element: <UserAccount /> },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}


// AUTHENTICATION
const UserAccount = Loadable(lazy(() => import('../features/userAccount/UserAccount')));

// Dashboard
const PageOne = Loadable(lazy(() => import('../pages/PageOne')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
