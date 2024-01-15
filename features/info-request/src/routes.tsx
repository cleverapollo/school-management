import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { DocEditIcon } from '@tyro/icons';

const InfoRequestFormList = lazyWithRetry(() => import('./pages/index'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'sms',
        title: t('navigation:management.sms'),
        icon: <DocEditIcon />,
        element: <InfoRequestFormList />,
      },
    ],
  },
];
