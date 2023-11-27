import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { PieChartIcon } from '@tyro/icons';

const Dashboard = lazyWithRetry(() => import('./pages/dashboard'));

export const getShellRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        title: t('navigation:general.dashboard'),
        path: '/dashboard',
        hasAccess: ({ isStaffUser }) => isStaffUser,
        icon: <PieChartIcon />,
        element: <Dashboard />,
      },
    ],
  },
];
