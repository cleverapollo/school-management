import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { GearIcon } from '@tyro/icons';
import { getCoreAcademicNamespace } from '@tyro/api';
import { getCoreRooms } from './api/rooms';
import { getCatalogueSubjects } from './api/subjects';

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
        hasAccess: (permissions) => permissions.isStaffUser,
        children: [
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.rooms'),
            path: 'rooms',
            loader: () => getCoreRooms(),
            element: <Rooms />,
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.academicNamespaces'),
            path: 'academic-namespaces',
            loader: () => getCoreAcademicNamespace(),
            element: <AcademicNamespaceList />,
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.subjects'),
            path: 'subjects',
            loader: () => getCatalogueSubjects(),
            element: <Subjects />,
          },
        ],
      },
    ],
  },
];
