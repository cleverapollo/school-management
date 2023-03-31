/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { lazy } from 'react';
import { NavObjectFunction, NavObjectType, getNumber } from '@tyro/core';
import { PersonGearIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';
import { getTenants } from './api/tenants';
import { getAdminPartyPeople } from './api/party-people';

const AdminSchoolsPage = lazy(() => import('./pages/school'));
const AdminPeoplesPage = lazy(() => import('./pages/school/people'));
const GraphiQLPage = lazy(() => import('./pages/graphiql'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'admin',
        icon: <PersonGearIcon />,
        title: t('navigation:general.admin.title'),
        children: [
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:general.admin.schools'),
            path: 'schools',
            hasAccess: (permissions) => permissions.isTyroTenantAndUser,
            loader: () => getTenants(),
            element: <AdminSchoolsPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'schools/:schoolId/people',
            hasAccess: (permissions) => permissions.isTyroTenantAndUser,
            loader: ({ params }) => {
              const schoolId = getNumber(params?.schoolId);
              return getAdminPartyPeople(schoolId);
            },
            element: <AdminPeoplesPage />,
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:general.admin.graphiql'),
            path: 'graphiql',
            hasAccess: (permissions) =>
              permissions.isTyroUser || process.env.NODE_ENV !== 'production',
            element: <GraphiQLPage />,
          },
        ],
      },
    ],
  },
];
