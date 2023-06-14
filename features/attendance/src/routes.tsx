import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { PersonCheckmarkIcon } from '@tyro/icons';
import { getAttendanceCodes } from './api';

const Overview = lazy(() => import('./pages/overview'));
const AttendanceCodes = lazy(() => import('./pages/codes'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'attendance',
        title: t('navigation:general.attendance.title'),
        icon: <PersonCheckmarkIcon />,
        hasAccess: (permissions) => !permissions.isTyroTenantAndUser,
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'overview',
            title: t('navigation:general.attendance.overview'),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                element: <Overview />,
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'codes',
            title: t('navigation:general.attendance.codes'),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => getAttendanceCodes({}),
                element: <AttendanceCodes />,
              },
            ],
          },
        ],
      },
    ],
  },
];
