import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import LoadingScreen from '../components/LoadingScreen';
import PageUnauthorized from '../pages/PageUnauthorized';
import PermissionBasedGuard from '../guards/PermissionBasedGuard';
import { useAuth } from '@tyro/api';

// ----------------------------------------------------------------------
import AdminRoutes from '../features/admin/routes';
import Groups from '../features/groups/routes';
import Subjects from '../features/subjects/routes';


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
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'callback',
          element: (
            <GuestGuard>
              <Callback />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        {
          path: 'unauthorized',
          element: (
            <GuestGuard>
              <PageUnauthorized />
            </GuestGuard>
          )
        }
      ],
    },
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
        Groups,
        Subjects,
        {
          path: 'user',
          children: [
            { element: <Navigate to="/user/profile" replace />, index: true },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        { 
          path: 'graphiql', 
          element: (
            <PermissionBasedGuard permissions={['tyro_admin:access']} hasContent>
              <GraphiQLPage />
            </PermissionBasedGuard>
          ),
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
const Login = Loadable(lazy(() => import('../features/authentication/Login')));
const Callback = Loadable(lazy(() => import('../features/authentication/components/callback/Callback')));
const Register = Loadable(lazy(() => import('../features/authentication/Register')));
const UserAccount = Loadable(lazy(() => import('../features/userAccount/UserAccount')));

// Dashboard
const PageOne = Loadable(lazy(() => import('../pages/PageOne')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));

// Admin pages
const GraphiQLPage = Loadable(lazy(() => import('../pages/GraphiQLPage')));
