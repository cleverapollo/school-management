import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { UserGroupIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';

import PrintTimetableContainer from './components/timetable/print-timetable-container';
import PrintYearGroupTimetable from './pages/timetable/year-timetable';
import PrintStudentTimetable from './pages/timetable/student-timetable';
import { TimetablePrintRoomForm } from './components/timetable/timetable-print-rooms-form';
import PrintRoomTimetable from './pages/timetable/rooms-timetable';

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
        hasAccess: ({ isTyroUser }) => isTyroUser,
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
                element: <PrintStudentTimetable />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'years',
                element: <PrintYearGroupTimetable />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'rooms',
                element: <PrintRoomTimetable />,
              },
            ],
          },
        ],
      },
    ],
  },
];
