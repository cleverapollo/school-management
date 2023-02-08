import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { Calendar31Icon } from '@tyro/icons';
import { UserType } from '@tyro/api';
import { lazy } from 'react';
import { getCalendarEvents } from './api/events';
import { filter } from './components/Calendar';

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
        hasAccess: ({ userType }) => !!userType && userType !== UserType.Tyro,
        title: t('navigation:general.calendar'),
        loader: () => getCalendarEvents(filter),
        element: <CalendarPage />,
      },
    ],
  },
];
