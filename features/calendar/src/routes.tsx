import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { Calendar31Icon } from '@tyro/icons';
import { lazy } from 'react';
import { getCalendarEvents } from './api/events';
import { filter } from './components/common/calendar/calendar';

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
        hasAccess: (permissions) => permissions.isStaffUser,
        title: t('navigation:general.calendar'),
        loader: () => getCalendarEvents(filter),
        element: <CalendarPage />,
      },
    ],
  },
];
