import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { lazy } from 'react';
import { GraduateHatLoadingIcon } from '@tyro/icons';
import { getStaff } from '@tyro/people';
import { getStaffWorkAbsences } from './api/staff-work-absences';
import { getStaffWorkAbsenceTypes } from './api/staff-work-absence-types';

const Absences = lazy(() => import('./pages/absences'));

const CreateStaffAbsencePage = lazy(
  () => import('./pages/create-staff-absence')
);

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
          // {
          //   type: NavObjectType.MenuLink,
          //   path: 'cover',
          //   title: t('navigation:management.substitution.cover'),
          //   element: <ManagementContainer />,
          //   children: [
          //     {
          //       type: NavObjectType.NonMenuLink,
          //       index: true,
          //       element: <AbsentStaffPage />,
          //       loader: () => getStaffWorkAbsences({}),
          //     },
          //     {
          //       type: NavObjectType.NonMenuLink,
          //       path: 'create',
          //       element: <CreateStaffAbsencePage />,
          //       loader: () =>
          //         Promise.all([getStaffWorkAbsenceTypes({}), getStaff({})]),
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
];
