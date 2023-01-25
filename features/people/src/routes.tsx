import { lazy } from 'react';
import { NavObjectFunction, NavObjectType, LazyLoader } from '@tyro/core';
import { UserGroupIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';

const StudentsListPage = lazy(() => import('./pages/students'));
// Student profile pages
const StudentProfileContainer = lazy(
  () => import('./components/students/student-profile-container')
);
const StudentProfileOverviewPage = lazy(
  () => import('./pages/students/profile/overview')
);

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'people',
        title: t('navigation:management.people.title'),
        icon: <UserGroupIcon />,
        hasAccess: ({ userType }) =>
          !!userType && [UserType.Admin, UserType.Teacher].includes(userType),
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'students',
            title: t('navigation:management.people.students'),
            element: (
              <LazyLoader>
                <StudentsListPage />
              </LazyLoader>
            ),
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'students/:id',
            element: (
              <LazyLoader>
                <StudentProfileContainer />
              </LazyLoader>
            ),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                element: (
                  <LazyLoader>
                    <StudentProfileOverviewPage />
                  </LazyLoader>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
];
