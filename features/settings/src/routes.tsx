import { lazy } from 'react';
import { LazyLoader, NavObjectFunction, NavObjectType } from '@tyro/core';
import { GearIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';
import { getCoreRooms } from './api/rooms';
import { getCatalogueSubjects } from './api/subjects';
import { getCoreAcademicNamespace } from './api/academic-namespaces/academic-namespaces';

const Rooms = lazy(() => import('./pages/rooms'));
const AcademicNamespaceList = lazy(() => import('./pages/academic-namespaces'));
const Subjects = lazy(() => import('./pages/subjects'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        title: t('navigation:management.settings.title'),
        path: 'settings',
        icon: <GearIcon />,
        hasAccess: ({ userType }) =>
          !!userType && [UserType.Admin, UserType.Teacher].includes(userType),
        children: [
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.rooms'),
            path: 'rooms',
            loader: () => getCoreRooms(),
            element: (
              <LazyLoader>
                <Rooms />
              </LazyLoader>
            ),
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.academicNamespaces'),
            path: 'academic-namespaces',
            loader: () => getCoreAcademicNamespace(),
            element: (
              <LazyLoader>
                <AcademicNamespaceList />
              </LazyLoader>
            ),
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.subjects'),
            path: 'subjects',
            loader: () => getCatalogueSubjects(),
            element: (
              <LazyLoader>
                <Subjects />
              </LazyLoader>
            ),
          },
        ],
      },
    ],
  },
];
