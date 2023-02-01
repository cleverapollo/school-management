/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
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
import { getPermissionUtils, getUser, msalInstance } from '@tyro/api';
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import omit from 'lodash/omit';

import { TFunction } from '@tyro/i18n';
import { Typography } from '@mui/material';
// Extenal routers
import { routes as authRoutes } from '@tyro/authentication';
import { getRoutes as getCalendarRoutes } from '@tyro/calendar';
import { getRoutes as getGroupRoutes } from '@tyro/groups';
import { getRoutes as getMailRoutes } from '@tyro/mail';
import { getRoutes as getPeopleRoutes } from '@tyro/people';
import { getRoutes as getSettingsRoutes } from '@tyro/settings';
import { getRoutes as getAdminRoutes } from '@tyro/tyro-admin';

import { ErrorElement } from './components/error-element';
import { Shell } from './components/shell';
import { getShellRoutes } from './routes';

async function checkHasAccess(hasAccess: HasAccessFunction) {
  try {
    const permissionUtils = await getPermissionUtils();
    if (!hasAccess(permissionUtils)) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw new Response('Forbidden', { status: 403 });
      // throw new Error('Forbidden');
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
  ...getGroupRoutes(t),
  ...getMailRoutes(t),
  ...getPeopleRoutes(t),
  ...getSettingsRoutes(t),
  ...getAdminRoutes(t),
];

function useAppRouter() {
  return createBrowserRouter([
    {
      loader: () => {
        const activeAccount = msalInstance.getActiveAccount();

        if (!activeAccount) {
          return redirect('/login');
        }

        return getUser();
      },
      element: (
        <LazyLoader>
          <Shell>
            <LazyLoader>
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
          loader: () => redirect('/dashboard'),
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
