import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { UserType } from '@tyro/api';
import { LetterIcon } from '@tyro/icons';
import { getLabels } from './api/labels';

const Mail = lazy(() => import('./pages/index'));

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
        hasAccess: ({ userType }) => !!userType && userType !== UserType.Tyro,
        element: <Mail />,
        loader: () => getLabels(),
        children: [
          {
            type: NavObjectType.NonMenuLink,
            path: ':mailId',
            element: <Mail />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'label/:labelName',
            element: <Mail />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'label/custom/:labelName',
            element: <Mail />,
          },
        ],
      },
    ],
  },
];
