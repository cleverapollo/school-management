import { lazy } from 'react';
import { NavObjectFunction, NavObjectType, LazyLoader } from '@tyro/core';
import { UserGroupIcon } from '@tyro/icons';
import { getPermissionUtils, UserType } from '@tyro/api';
import { redirect } from 'react-router-dom';

import PrintTimetableContainer from './components/timetable/print-timetable-container';

const StaffTimetable = lazy(() => import('./pages/timetable/staff'));
// Student profile pages

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'printing',
        title: t('navigation:management.printing.title'),
        icon: <UserGroupIcon />,
        hasAccess: ({ userType }) => true,
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'timetable',
            element: <PrintTimetableContainer />,
            title: t('navigation:management.printing.timetable'),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('./staff'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'staff',
                element: <StaffTimetable />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'students',
                element: <StaffTimetable />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'years',
                element: <StaffTimetable />,
              },
            ],
          },
        ],
      },
    ],
  },
];
