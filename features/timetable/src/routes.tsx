import { lazy } from 'react';
import {
  getNumber,
  NavObjectFunction,
  NavObjectType,
  throw404Error,
} from '@tyro/core';
import { EditCalendarIcon } from '@tyro/icons';
import { getYearGroups, sortStartNumberFirst } from '@tyro/groups';
import { getTimetables } from './api/timetable-list';
import { getTimetableLesson } from './api/timetable-lessons';
import { getTimetableResourceView } from './api/resource-view';

const TimetableList = lazy(() => import('./pages/index'));
const ViewTimetable = lazy(() => import('./pages/view'));
const EditTimetable = lazy(() => import('./pages/edit-timetable'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        icon: <EditCalendarIcon />,
        title: t('navigation:management.timetable.title'),
        path: 'timetable',
        children: [
          // {
          //   type: NavObjectType.MenuLink,
          //   title: t('navigation:management.timetable.timetables'),
          //   path: 'timetables',
          //   loader: async () => getTimetableLesson(),
          //   element: <TimetableList />,
          // },
          // {
          //   type: NavObjectType.NonMenuLink,
          //   path: ':timetableId',
          //   loader: ({ params }) => {
          //     const timetableId = getNumber(params?.timetableId);
          //     if (!timetableId) {
          //       throw404Error();
          //     }
          //     return getTimetables(timetableId);
          //   },
          //   element: <ViewTimetable />,
          // },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.timetable.editTimetable'),
            path: 'edit-timetable',
            loader: async () => {
              const yearGroups = await getYearGroups();
              const firstYearGroup = yearGroups.core_yearGroupEnrollments.sort(
                (a, b) => sortStartNumberFirst(a.name, b.name)
              )[0];

              if (firstYearGroup) {
                return getTimetableResourceView({
                  timetableId: 20,
                  partyIds: [firstYearGroup.yearGroupEnrollmentPartyId],
                  roomIds: [],
                });
              }

              return null;
            },
            element: <EditTimetable />,
          },
        ],
      },
    ],
  },
];
