import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { lazy } from 'react';
import { GraduateHatLoadingIcon } from '@tyro/icons';
import { getStaff } from '@tyro/people';
import { getStaffWorkAbsences, getStaffWorkAbsenceTypes } from './api';

const ManagementContainer = lazy(
  () => import('./components/management-container')
);

const AbsentStaffPage = lazy(() => import('./pages/absent-staff'));

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
            element: <AbsentStaffPage />,
            loader: () => getStaffWorkAbsences({}),
          },
          {
            type: NavObjectType.MenuLink,
            path: 'cover',
            title: t('navigation:management.substitution.cover'),
            element: <ManagementContainer />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                element: <AbsentStaffPage />,
                loader: () => getStaffWorkAbsences({}),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'create',
                element: <CreateStaffAbsencePage />,
                loader: () =>
                  Promise.all([getStaffWorkAbsenceTypes({}), getStaff({})]),
              },
            ],
          },
        ],
      },
    ],
  },
];
