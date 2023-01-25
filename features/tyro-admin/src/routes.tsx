/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { lazy } from 'react';
import { LazyLoader, NavObjectFunction, NavObjectType } from '@tyro/core';
import { PersonGearIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';

const AdminSchoolsPage = lazy(() => import('./pages/school'));
const AdminPeoplesPage = lazy(() => import('./pages/school/people'));
const GraphiQLPage = lazy(() => import('./pages/graphiql'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'admin',
        icon: <PersonGearIcon />,
        hasAccess: ({ userType }) => !!userType && userType === UserType.Tyro,
        title: t('navigation:general.admin.title'),
        children: [
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:general.admin.schools'),
            path: 'schools',
            element: (
              <LazyLoader>
                <AdminSchoolsPage />
              </LazyLoader>
            ),
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'schools/:schoolId/people',
            element: (
              <LazyLoader>
                <AdminPeoplesPage />
              </LazyLoader>
            ),
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:general.admin.graphiql'),
            path: 'graphiql',
            element: (
              <LazyLoader>
                <GraphiQLPage />
              </LazyLoader>
            ),
          },
        ],
      },
    ],
  },
];
