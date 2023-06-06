import { lazy } from 'react';
import {
  getNumber,
  NavObjectFunction,
  NavObjectType,
  throw404Error,
} from '@tyro/core';
import { EditCalendarIcon } from '@tyro/icons';
import { getTimetables } from './api/timetable-list';
import { getTimetableLesson } from './api/timetable-lessons';

const TimetableList = lazy(() => import('./pages/index'));
const ViewTimetable = lazy(() => import('./pages/view'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'timetable',
        icon: <EditCalendarIcon />,
        title: t('navigation:general.timetable'),
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            loader: async () => getTimetableLesson(),
            element: <TimetableList />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: ':timetableId',
            loader: ({ params }) => {
              const timetableId = getNumber(params?.timetableId);
              if (!timetableId) {
                throw404Error();
              }
              return getTimetables(timetableId);
            },
            element: <ViewTimetable />,
          },
        ],
      },
    ],
  },
];
