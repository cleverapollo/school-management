import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { PrinterIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';

import PrintTimetableContainer from './components/timetable/print-timetable-container';
import PrintYearGroupTimetable from './pages/timetable/year-timetable';
import PrintStudentTimetable from './pages/timetable/student-timetable';
import PrintClassGroupTimetable from './pages/timetable/class-timetable';
import PrintRoomTimetable from './pages/timetable/rooms-timetable';

const StaffTimetable = lazyWithRetry(() => import('./pages/timetable/staff'));
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
        icon: <PrinterIcon />,
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'timetable',
            element: <PrintTimetableContainer />,
            title: t('navigation:management.printing.timetable'),
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                'ps:1:printing_and_exporting:print_timetables'
              ),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('./students'),
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
                path: 'class',
                element: <PrintClassGroupTimetable />,
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
