import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { PersonCheckmarkIcon } from '@tyro/icons';

const SessionAttendance = lazy(() => import('./pages/session'));

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
            path: 'session',
            title: t('navigation:general.attendance.session'),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                element: <SessionAttendance />,
              },
            ],
          },
        ],
      },
    ],
  },
];
