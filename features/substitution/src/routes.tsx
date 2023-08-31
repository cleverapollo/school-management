import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { GraduateHatLoadingIcon } from '@tyro/icons';
import { getStaffWorkAbsences } from './api/staff-work-absences';

const Absences = lazyWithRetry(() => import('./pages/absences'));
const Cover = lazyWithRetry(() => import('./pages/cover'));

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
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                'ps:1:staff_work_management:absences_read'
              ),
            title: t('navigation:management.substitution.absences'),
            element: <Absences />,
            loader: () => getStaffWorkAbsences({}),
          },
          {
            type: NavObjectType.MenuLink,
            path: 'cover',
            title: t('navigation:management.substitution.cover'),
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                'ps:1:staff_work_management:substitution_read'
              ),
            element: <Cover />,
          },
        ],
      },
    ],
  },
];
