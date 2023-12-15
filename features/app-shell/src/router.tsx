import {
  HasAccessFunction,
  LazyLoader,
  LoadingScreen,
  MenuLink,
  NavCategory,
  NonMenuLink,
  RootGroup,
  RootLink,
} from '@tyro/core';
import {
  getPermissionUtils,
  getUser,
  msalInstance,
  getCoreAcademicNamespace,
  UsePermissionsReturn,
} from '@tyro/api';
import {
  wrapCreateBrowserRouter,
  setUser as setSentryUser,
} from '@sentry/react';
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import omit from 'lodash/omit';

import { TFunction } from '@tyro/i18n';
// Extenal routers
import { routes as authRoutes } from '@tyro/authentication';
import { getRoutes as getCalendarRoutes } from '@tyro/calendar';
import { getRoutes as getClassListManagerRoutes } from '@tyro/class-list-manager';
import { getRoutes as getGroupRoutes } from '@tyro/groups';
import { getRoutes as getPrintingRoutes } from '@tyro/printing';
import { getRoutes as getMailRoutes } from '@tyro/mail';
import { getRoutes as getFeeRoutes } from '@tyro/fees';
import { getRoutes as getAttendanceRoutes } from '@tyro/attendance';
import { getRoutes as getAssessmentRoutes } from '@tyro/assessments';
import { getRoutes as getSchoolActivitiesRoutes } from '@tyro/school-activities';
import { getRoutes as getPeopleRoutes } from '@tyro/people';
import { getRoutes as getReportingRoutes } from '@tyro/reporting';
import { getRoutes as getSettingsRoutes } from '@tyro/settings';
import { getRoutes as getSubstitutionRoutes } from '@tyro/substitution';
import { getRoutes as getTimetableRoutes } from '@tyro/timetable';
import { getRoutes as getAdminRoutes } from '@tyro/tyro-admin';
import { getRoutes as getSmsRoutes } from '@tyro/sms';

import { Box, CircularProgress } from '@mui/material';
import { ErrorElement } from './components/error-element';
import { Shell } from './components/shell';
import { getShellRoutes } from './routes';

async function checkHasAccess(hasAccess: HasAccessFunction) {
  try {
    const permissionUtils = await getPermissionUtils();
    if (!hasAccess(permissionUtils)) {
      throw new Response('Forbidden', { status: 403 });
    }
  } catch (error) {
    if (error === 'USER_NOT_FOUND') {
      return msalInstance.logoutRedirect();
    }
    throw error;
  }
}

function getRoutesBasedOnPermissions(
  routes: (RootLink | RootGroup | MenuLink | NonMenuLink)[]
): RouteObject[] {
  return routes.reduce<RouteObject[]>((acc, route) => {
    let { loader } = route;

    if (route.hasAccess !== undefined) {
      const { hasAccess } = route;
      loader = async (...args) => {
        await checkHasAccess(hasAccess);

        if (route?.loader) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return route.loader(...args);
        }

        return null;
      };
    }
    const children = Array.isArray(route.children)
      ? getRoutesBasedOnPermissions(route.children)
      : undefined;

    const routeWithoutCustomProps = omit(route, [
      'type',
      'title',
      'icon',
      'hasAccess',
    ]);
    const routeObject = {
      ...routeWithoutCustomProps,
      loader,
      children,
    } as RouteObject;

    acc.push(routeObject);

    return acc;
  }, []);
}

function buildRouteTree(routes: NavCategory[]): RouteObject[] {
  return routes.reduce<RouteObject[]>((acc, route) => {
    if (Array.isArray(route.children)) {
      acc.push(...getRoutesBasedOnPermissions(route.children));
    }

    return acc;
  }, []);
}

const mockTFunction = ((key: string) => key) as TFunction<
  'navigation'[],
  undefined,
  'navigation'[]
>;

export const getNavCategories = (t: TFunction<'navigation'[]>) => [
  ...getShellRoutes(t),
  ...getCalendarRoutes(t),
  ...getClassListManagerRoutes(t),
  ...getGroupRoutes(t),
  ...getAttendanceRoutes(t),
  ...getMailRoutes(t),
  ...getFeeRoutes(t),
  ...getAssessmentRoutes(t),
  ...getSchoolActivitiesRoutes(t),
  ...getPeopleRoutes(t),
  ...getReportingRoutes(t),
  ...getSmsRoutes(t),
  ...getSubstitutionRoutes(t),
  ...getTimetableRoutes(t),
  ...getPrintingRoutes(t),
  ...getSettingsRoutes(t),
  ...getAdminRoutes(t),
];

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createBrowserRouter);

function useAppRouter() {
  return sentryCreateBrowserRouter([
    {
      loader: async () => {
        try {
          const responses = await Promise.all([
            getUser(),
            getCoreAcademicNamespace(),
          ]);
          const [user] = responses;

          if (user.activeProfile?.partyId) {
            const { activeProfile } = user;
            setSentryUser({
              id: String(activeProfile.partyId),
              segment: activeProfile.profileType?.userType ?? 'unknown',
              tenant: activeProfile.tenant?.tenant ?? 'unknown',
            });
          }

          return responses;
        } catch (error) {
          if (error instanceof Error && error?.message === 'Failed to fetch') {
            throw new Response('Service Unavailable', { status: 503 });
          }

          throw error;
        }
      },
      element: (
        <LazyLoader>
          <Shell>
            <LazyLoader
              fallback={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                  }}
                >
                  <CircularProgress />
                </Box>
              }
            >
              <Outlet />
            </LazyLoader>
          </Shell>
        </LazyLoader>
      ),
      errorElement: (
        <LazyLoader>
          <ErrorElement />
        </LazyLoader>
      ),
      children: [
        {
          path: '/',
          loader: async () => {
            const permissions = await getPermissionUtils();
            if (permissions.isStudent || permissions.isContact) {
              return redirect('/people/students');
            }
            if (permissions.isTyroTenantAndUser) {
              return redirect('/admin/schools');
            }
            return redirect('/dashboard');
          },
        },
        ...buildRouteTree(getNavCategories(mockTFunction)),
      ],
    },
    ...authRoutes,
  ]);
}

export function Router() {
  const appRouter = useAppRouter();

  return (
    <RouterProvider router={appRouter} fallbackElement={<LoadingScreen />} />
  );
}
