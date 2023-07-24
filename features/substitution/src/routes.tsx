import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { lazy } from 'react';
import { GraduateHatLoadingIcon } from '@tyro/icons';
import { getStaffWorkAbsences } from './api/staff-work-absences';

const Absences = lazy(() => import('./pages/absences'));
const Cover = lazy(() => import('./pages/cover'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'substitution',
        icon: <GraduateHatLoadingIcon />,
        title: t('navigation:management.substitution.title'),
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'absences',
            title: t('navigation:management.substitution.absences'),
            element: <Absences />,
            loader: () => getStaffWorkAbsences({}),
          },
          {
            type: NavObjectType.MenuLink,
            path: 'cover',
            title: t('navigation:management.substitution.cover'),
            element: <Cover />,
          },
        ],
      },
    ],
  },
];
