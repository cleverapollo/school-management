import { lazy } from 'react';
import { NavObjectFunction, NavObjectType, LazyLoader } from '@tyro/core';
import { UserGroupIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';

const StudentsListPage = lazy(() => import('./pages/testReport'));
// Student profile pages

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: ' reporting',
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'reporting',
        title: t('navigation:management.people.title'),
        icon: <UserGroupIcon />,
        hasAccess: ({ userType }) => true,
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'reporting',
            title: 'test reporting',
            element: (
              <LazyLoader>
                <StudentsListPage />
              </LazyLoader>
            ),
          },
        ],
      },
    ],
  },
];
