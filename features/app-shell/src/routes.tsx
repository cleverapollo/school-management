import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { PieChartIcon } from '@tyro/icons';
import { lazy } from 'react';

const Dashboard = lazy(() => import('./pages/dashboard'));

export const getShellRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        title: t('navigation:general.dashboard'),
        path: '/dashboard',
        icon: <PieChartIcon />,
        element: <Dashboard />,
      },
    ],
  },
];
