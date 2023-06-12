import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { GearIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';
import { getCoreAcademicNamespace } from '@tyro/api';
import { getCoreRooms } from './api/rooms';
import { getCatalogueSubjects } from './api/subjects';
import { getPpodCredentialsStatus } from './api/ppod/ppod-credentials-status';

const Rooms = lazy(() => import('./pages/rooms'));
const AcademicNamespaceList = lazy(() => import('./pages/academic-namespaces'));
const Subjects = lazy(() => import('./pages/subjects'));
const Ppod = lazy(() => import('./pages/ppod/ppod'));
const SyncContainer = lazy(() => import('./components/ppod/sync-container'));
const Sync = lazy(() => import('./pages/ppod/sync'));
const SchoolDetails = lazy(() => import('./pages/ppod/school-details'));

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
            title: t('navigation:management.settings.subjects'),
            path: 'subjects',
            loader: () => getCatalogueSubjects(),
            element: <Subjects />,
          },
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
            title: t('navigation:management.settings.ppod'),
            path: 'ppod',
            hasAccess: (permissions) => permissions.isStaffUser,
            loader: () => getPpodCredentialsStatus(),
            element: <Ppod />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'ppod/sync-data',
            hasAccess: (permissions) => permissions.isStaffUser,
            element: <SyncContainer />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('./sync'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'sync',
                element: <Sync />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'details',
                element: <SchoolDetails />,
              },
            ],
          },
        ],
      },
    ],
  },
];
