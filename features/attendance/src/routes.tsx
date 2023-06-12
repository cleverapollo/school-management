import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { AttendanceIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';

const AttendanceCodesContainer = lazy(
  () => import('./components/attendance-codes-container')
);

const AttendanceOverview = lazy(() => import('./pages/overview'));
const AttendanceCodes = lazy(() => import('./pages/attendance-codes'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'attendance',
        title: t('navigation:general.attendance'),
        icon: <AttendanceIcon />,
        hasAccess: (permissions) => !permissions.isTyroTenantAndUser,
        element: <AttendanceCodesContainer />,
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            loader: () => redirect('./overview'),
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'overview',
            element: <AttendanceOverview />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'attendance-codes',
            element: <AttendanceCodes />,
          },
        ],
      },
    ],
  },
];
