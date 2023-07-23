import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { PersonCheckmarkIcon } from '@tyro/icons';
import { getAbsenceTypes } from './api';

const AbsenceTypes = lazy(() => import('./pages/absence-types'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'absence',
        title: t('navigation:general.absence.title'),
        icon: <PersonCheckmarkIcon />,
        hasAccess: (permissions) => !permissions.isTyroTenantAndUser,
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'codes',
            title: t('navigation:general.absence.codes'),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => getAbsenceTypes({}),
                element: <AbsenceTypes />,
              },
            ],
          },
        ],
      },
    ],
  },
];
