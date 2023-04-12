import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { Calendar31Icon } from '@tyro/icons';
import { getUser } from '@tyro/api';
import { lazy } from 'react';
import dayjs from 'dayjs';
import { getCalendarEvents } from './api/events';
import { getTimetableInfo } from './api/timetable';

const CalendarPage = lazy(() => import('./pages/calendar'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'calendar',
        icon: <Calendar31Icon />,
        title: t('navigation:general.calendar'),
        loader: async () => {
          const { activeProfile } = await getUser();
          const dayInfoFromDate = dayjs()
            .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD');
          const dayInfoToDate = dayjs()
            .add(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD');

          const getEventsPromise = activeProfile?.partyId
            ? getCalendarEvents({
                date: new Date(),
                partyIds: [activeProfile?.partyId],
              })
            : null;

          return Promise.all([
            getEventsPromise,
            getTimetableInfo({
              fromDate: dayInfoFromDate,
              toDate: dayInfoToDate,
            }),
          ]);
        },
        element: <CalendarPage />,
      },
    ],
  },
];
