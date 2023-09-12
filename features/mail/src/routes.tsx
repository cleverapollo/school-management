import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { LetterIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';
import { getLabels } from './api/labels';

const Mail = lazyWithRetry(() => import('./pages/index'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'mail',
        title: t('navigation:general.mail'),
        icon: <LetterIcon />,
        hasAccess: (permissions) => !permissions.isTyroTenantAndUser,
        element: <Mail />,
        loader: () => getLabels({}),
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            loader: () => redirect('./inbox'),
          },
          {
            type: NavObjectType.NonMenuLink,
            path: ':labelId',
            element: <Mail />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: 'view/:mailId',
                element: <Mail />,
              },
            ],
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'label/:labelId',
            element: <Mail />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: 'view/:mailId',
                element: <Mail />,
              },
            ],
          },
        ],
      },
    ],
  },
];
