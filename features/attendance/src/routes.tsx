import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { PersonCheckmarkIcon } from '@tyro/icons';
import { getBulkAttendance } from './api/bulk-attendance/bulk-attendance';

const SessionAttendance = lazyWithRetry(() => import('./pages/session'));
const SessionAttendanceList = lazyWithRetry(
  () => import('./pages/session-attendance-list')
);
const AbsentRequests = lazyWithRetry(() => import('./pages/absent-requests'));
const BulkAttendance = lazyWithRetry(() => import('./pages/bulk-attendance'));

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
              isStaffUserWithPermission(
                'ps:1:attendance:read_session_attendance'
              ),
          },
          {
            type: NavObjectType.MenuLink,
            path: 'session-list',
            title: t('navigation:general.attendance.unexplainedAbsences'),
            element: <SessionAttendanceList />,
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                'ps:1:attendance:read_session_attendance'
              ),
          },
          {
            type: NavObjectType.MenuLink,
            path: 'absent-requests',
            title: t('navigation:general.attendance.absentRequests'),
            hasAccess: ({ isStaffUserWithPermission, isContact }) =>
              isStaffUserWithPermission(
                'ps:1:attendance:read_parental_attendance_requests'
              ) || isContact,
            element: <AbsentRequests />,
          },
          {
            type: NavObjectType.MenuLink,
            path: 'bulk-attendance',
            title: t('navigation:general.attendance.bulkAttendance'),
            element: <BulkAttendance />,
            loader: () => getBulkAttendance({}),
            hasAccess: ({ hasPermission }) =>
              hasPermission('ps:1:attendance:write_bulk_attendance'),
          },
        ],
      },
    ],
  },
];
