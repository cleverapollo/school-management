/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import {
  NavObjectFunction,
  NavObjectType,
  getNumber,
  lazyWithRetry,
} from '@tyro/core';
import { PersonGearIcon } from '@tyro/icons';
import { getTenants } from './api/tenants';
import { getAdminPartyPeople } from './api/party-people';

const AdminSchoolsPage = lazyWithRetry(() => import('./pages/school'));
const AdminPeoplesPage = lazyWithRetry(() => import('./pages/school/people'));
const GraphiQLPage = lazyWithRetry(() => import('./pages/graphiql'));

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
            path: 'schools/:schoolId',
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
