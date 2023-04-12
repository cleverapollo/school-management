import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { lazy } from 'react';
import { GraduateHatLoadingIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';
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
        hasAccess: ({ userType }) => userType === UserType.Admin,
        title: t('navigation:management.substitution.title'),
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'overview',
            title: t('navigation:management.substitution.overview'),
            element: <div>overview section</div>,
          },
          {
            type: NavObjectType.MenuLink,
            path: 'management',
            title: t('navigation:management.substitution.management'),
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
