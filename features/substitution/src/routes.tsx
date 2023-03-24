import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { lazy } from 'react';
import { GraduateHatLoadingIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';

const ManagementPage = lazy(() => import('./pages/management'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'substitution',
        icon: <GraduateHatLoadingIcon />,
        hasAccess: ({ userType }) => userType === UserType.Admin,
        title: t('navigation:management.substitution.title'),
        element: <ManagementPage />,
      },
    ],
  },
];
