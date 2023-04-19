import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { Calendar31Icon } from '@tyro/icons';
import { getUser } from '@tyro/api';
import { lazy } from 'react';
import { getCalendarEvents } from './api/events';
import { getTimetableInfoForCalendar } from './api/timetable';

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

          const getEventsPromise = activeProfile?.partyId
            ? getCalendarEvents({
                date: new Date(),
                resources: {
                  partyIds: [activeProfile?.partyId],
                },
              })
            : null;

          return Promise.all([
            getEventsPromise,
            getTimetableInfoForCalendar(new Date()),
          ]);
        },
        element: <CalendarPage />,
      },
    ],
  },
];
