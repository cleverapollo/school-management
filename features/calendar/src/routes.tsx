import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { Calendar31Icon } from '@tyro/icons';
import { getUser } from '@tyro/api';
import { getTodayTimetableEvents } from './api/timetable';

const CalendarPage = lazyWithRetry(() => import('./pages/calendar'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'calendar',
        hasAccess: (permissions) =>
          permissions.isStaffUserHasWithAtLestOnePermission([
            'ps:1:calendar:view_own_calendar',
            'ps:1:calendar:view_calendar',
          ]),
        icon: <Calendar31Icon />,
        title: t('navigation:general.calendar'),
        loader: async () => {
          const { activeProfile } = await getUser();

          return getTodayTimetableEvents(activeProfile?.partyId);
        },
        element: <CalendarPage />,
      },
    ],
  },
];
