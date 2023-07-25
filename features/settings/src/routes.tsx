import { lazy } from 'react';
import {
  getNumber,
  NavObjectFunction,
  NavObjectType,
  throw404Error,
} from '@tyro/core';
import { GearIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';
import { getCoreAcademicNamespace } from '@tyro/api';
import { AttendanceCodes, getAttendanceCodes } from '@tyro/attendance';
import {
  getContactsForSelect,
  getStaffForSelect,
  getStudentsForSelect,
} from '@tyro/people';
import { getCoreRooms } from './api/rooms';
import { getCatalogueSubjects } from './api/subjects';
import { getPpodCredentialsStatus } from './api/ppod/ppod-credentials-status';
import { getPermissionGroups } from './api/permissions/user-permissions-groups';
import { getPermissionSets } from './api/permissions/user-permissions-sets';

const Rooms = lazy(() => import('./pages/rooms'));
const AcademicYearsList = lazy(() => import('./pages/academic-years'));
const Subjects = lazy(() => import('./pages/subjects'));
const Ppod = lazy(() => import('./pages/ppod/ppod'));
const Login = lazy(() => import('./pages/ppod/login'));
const Sync = lazy(() => import('./pages/ppod/sync'));
const SchoolDetails = lazy(() => import('./pages/ppod/school-details'));
const Permissions = lazy(() => import('./pages/permissions'));
const CreatePermission = lazy(() => import('./pages/permissions/create'));
const EditPermission = lazy(() => import('./pages/permissions/edit'));
const ClonePermission = lazy(() => import('./pages/permissions/clone'));

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
            hasAccess: (permissions) =>
              permissions.hasPermission(
                'ps:1:attendance:view_attendance_codes'
              ),
            element: <AttendanceCodes />,
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.subjects'),
            path: 'subjects',
            loader: () => getCatalogueSubjects(),
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:general_admin:read_subjects'),

            element: <Subjects />,
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.rooms'),
            path: 'rooms',
            loader: () => getCoreRooms(),
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:general_admin:read_rooms'),
            element: <Rooms />,
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.academicYears'),
            path: 'academic-years',
            loader: () => getCoreAcademicNamespace(),
            hasAccess: (permissions) =>
              permissions.hasPermission(
                'ps:1:general_admin:read_academic_namespaces'
              ),
            element: <AcademicYearsList />,
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.permissions'),
            path: 'permissions',
            hasAccess: (permissions) => permissions.isTyroUser,
            loader: () =>
              Promise.all([
                getPermissionGroups({ custom: true }),
                getPermissionGroups({ custom: false }),
                getStudentsForSelect({}),
                getContactsForSelect(),
                getStaffForSelect({}),
                getPermissionSets({ student: true }),
                getPermissionSets({ contact: true }),
                getPermissionSets({ staff: true }),
              ]),
            element: <Permissions />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'permissions/create',
            element: <CreatePermission />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'permissions/edit/:permissionGroupId',
            loader: ({ params }) => {
              const permissionGroupId = getNumber(params?.permissionGroupId);
              if (!permissionGroupId) {
                throw404Error();
              }

              return getPermissionGroups({ ids: [permissionGroupId] });
            },
            element: <EditPermission />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'permissions/clone/:permissionGroupId',
            loader: ({ params }) => {
              const permissionGroupId = getNumber(params?.permissionGroupId);
              if (!permissionGroupId) {
                throw404Error();
              }

              return getPermissionGroups({ ids: [permissionGroupId] });
            },
            element: <ClonePermission />,
          },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.ppod'),
            path: 'ppod',
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:general_admin:ppod_sync'),
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
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:general_admin:ppod_set_password'),
            element: <Login />,
          },
        ],
      },
    ],
  },
];
