import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { GearIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';
import { getCoreAcademicNamespace } from '@tyro/api';
import { AttendanceCodes, getAttendanceCodes } from '@tyro/attendance';
import { getCoreRooms } from './api/rooms';
import { getCatalogueSubjects } from './api/subjects';
import { getPpodCredentialsStatus } from './api/ppod/ppod-credentials-status';

const Rooms = lazy(() => import('./pages/rooms'));
const AcademicYearsList = lazy(() => import('./pages/academic-years'));
const Subjects = lazy(() => import('./pages/subjects'));
const Ppod = lazy(() => import('./pages/ppod/ppod'));
const Login = lazy(() => import('./pages/ppod/login'));
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
            path: 'attendance-codes',
            title: t('navigation:general.attendance.codes'),
            loader: () => getAttendanceCodes({}),
            element: <AttendanceCodes />,
          },
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
            title: t('navigation:management.settings.academicYears'),
            path: 'academic-years',
            loader: () => getCoreAcademicNamespace(),
            element: <AcademicYearsList />,
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.ppod'),
            path: 'ppod',
            hasAccess: (permissions) => permissions.isStaffUser,
            loader: () => getPpodCredentialsStatus(),
            element: <Ppod />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: async () => {
                  const ppodCredentialsStatus =
                    await getPpodCredentialsStatus();

                  return ppodCredentialsStatus?.ppod_PPODCredentials
                    ?.lastSyncSuccessful
                    ? redirect('./sync')
                    : redirect('./login');
                },
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
          {
            type: NavObjectType.NonMenuLink,
            path: 'ppod/login',
            hasAccess: (permissions) => permissions.isStaffUser,
            element: <Login />,
          },
        ],
      },
    ],
  },
];
