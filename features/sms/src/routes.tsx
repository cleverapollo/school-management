import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { MobileIcon } from '@tyro/icons';
import { getSentSms } from './api/sent-sms';

const Sms = lazy(() => import('./pages/index'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'sms',
        hasAccess: (permissions) => !permissions.isTyroTenantAndUser,
        title: t('navigation:management.sms'),
        icon: <MobileIcon />,
        element: <Sms />,
        loader: () => getSentSms({ ids: [] }),
      },
    ],
  },
];