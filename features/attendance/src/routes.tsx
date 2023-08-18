import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { PersonCheckmarkIcon } from '@tyro/icons';

const SessionAttendance = lazy(() => import('./pages/session'));
const AbsentRequests = lazy(() => import('./pages/absent-requests'));

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
            element: <SessionAttendance />,
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission('ps:1:attendance:read_attendance'),
          },
          {
            type: NavObjectType.MenuLink,
            path: 'absent-requests',
            title: t('navigation:general.attendance.absentRequests'),
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                'ps:1:staff_work_management:absences_read'
              ),
            element: <AbsentRequests />,
          },
        ],
      },
    ],
  },
];
