import {
  getNumber,
  lazyWithRetry,
  NavObjectFunction,
  NavObjectType,
  throw404Error,
} from '@tyro/core';
import { GearIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';
import { getCoreAcademicNamespace, AccessUserType } from '@tyro/api';
import { AttendanceCodes, getAttendanceCodes } from '@tyro/attendance';
import {
  getContactsForSelect,
  getStaffForSelect,
  getStudentsForSelect,
  getNoteTags,
  getNoteTagsBehaviour,
} from '@tyro/people';
import { getStaffPosts } from '@tyro/people/src/api/staff/staff-posts';
import { getEmploymentCapacities } from '@tyro/people/src/api/staff/employment-capacities';
import { AbsenceTypes, getStaffWorkAbsenceTypes } from '@tyro/substitution';
import { getCoreRooms } from './api/rooms';
import { getCatalogueSubjects } from './api/subjects';
import { getPpodCredentialsStatus } from './api/ppod/ppod-credentials-status';
import { getUserAccess } from './api/user-access/user-access';
import { getPermissionGroups } from './api/permissions/user-permissions-groups';
import { getPermissionSets } from './api/permissions/user-permissions-sets';
import { getFormB } from './api/dtr-returns/form-b';
import { getSyncRequests } from './api/ppod/sync-requests';
import { getSchoolsInfo } from './api/ppod/school-details';
import { getCommentBanks } from './api/comment-banks/comment-banks';

const Rooms = lazyWithRetry(() => import('./pages/rooms'));
const AcademicYearsList = lazyWithRetry(() => import('./pages/academic-years'));
const Subjects = lazyWithRetry(() => import('./pages/subjects'));
const Ppod = lazyWithRetry(() => import('./pages/ppod/ppod'));
const Login = lazyWithRetry(() => import('./pages/ppod/login'));
const Sync = lazyWithRetry(() => import('./pages/ppod/sync'));
const SchoolDetails = lazyWithRetry(
  () => import('./pages/ppod/school-details')
);
const DTRReturns = lazyWithRetry(
  () => import('./pages/dtr-returns/dtr-returns')
);
const DTRReturnsFileB = lazyWithRetry(
  () => import('./pages/dtr-returns/file-b')
);
const UserAccessContainer = lazyWithRetry(
  () => import('./components/user-access/user-access-container')
);
const UserAccessStaffPage = lazyWithRetry(
  () => import('./pages/user-access/user-access-staff-page')
);
const UserAccessStudentsPage = lazyWithRetry(
  () => import('./pages/user-access/user-access-students-page')
);
const UserAccessContactsPage = lazyWithRetry(
  () => import('./pages/user-access/user-access-contacts-page')
);
const Permissions = lazyWithRetry(() => import('./pages/permissions'));
const CreatePermission = lazyWithRetry(
  () => import('./pages/permissions/create')
);
const EditPermission = lazyWithRetry(() => import('./pages/permissions/edit'));
const ClonePermission = lazyWithRetry(
  () => import('./pages/permissions/clone')
);
const NoteLabel = lazyWithRetry(() => import('./pages/note-label'));
const BehaviourLabel = lazyWithRetry(() => import('./pages/behaviour-label'));
const CommentBanks = lazyWithRetry(
  () => import('./pages/comment-banks/comment-banks')
);
const Comments = lazyWithRetry(() => import('./pages/comment-banks/comments'));

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
            path: 'absence-types',
            title: t('navigation:general.absence.types'),
            loader: () => getStaffWorkAbsenceTypes({}),
            hasAccess: (permissions) =>
              permissions.hasPermission(
                'ps:1:staff_work_management:absences_codes_write'
              ),
            element: <AbsenceTypes />,
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
            title: t('navigation:management.settings.userAccess'),
            path: 'user-access',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission('ps:1:users:user_access_management'),
            loader: () => {
              const userType = AccessUserType.Staff;
              return getUserAccess({ userType });
            },
            element: <UserAccessContainer />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('./staff'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'staff',
                loader: () => {
                  const userType = AccessUserType.Staff;
                  return getUserAccess({ userType });
                },
                element: <UserAccessStaffPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'contacts',
                loader: () => {
                  const userType = AccessUserType.Contact;
                  return getUserAccess({ userType });
                },
                element: <UserAccessContactsPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'students',
                element: <UserAccessStudentsPage />,
              },
            ],
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
                loader: () => redirect('./sync'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'sync',
                element: <Sync />,
                loader: () => getSyncRequests({}),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'details',
                element: <SchoolDetails />,
                loader: () => getSchoolsInfo(),
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
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.settings.dtrReturns'),
            path: 'dtr-returns',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission('ps:1:general_admin:permissions_dtr'),
            element: <DTRReturns />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'dtr-returns/file-b',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission('ps:1:general_admin:permissions_dtr'),
            loader: () =>
              Promise.all([
                getFormB({}),
                getStaffPosts(),
                getEmploymentCapacities(),
              ]),
            element: <DTRReturnsFileB />,
          },
          {
            title: t('navigation:management.settings.noteLabels'),
            type: NavObjectType.MenuLink,
            path: 'note-labels',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission('ps:1:general_admin:notes_settings'),
            loader: () => getNoteTags(),
            element: <NoteLabel />,
          },
          {
            title: t('navigation:management.settings.behaviourLabels'),
            type: NavObjectType.MenuLink,
            path: 'behaviour-settings',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                'ps:1:general_admin:behaviour_settings'
              ),
            loader: () => getNoteTagsBehaviour(),
            element: <BehaviourLabel />,
          },
          {
            title: t('navigation:management.settings.commentBanks'),
            type: NavObjectType.MenuLink,
            path: 'comment-banks',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                  'ps:1:assessment:write_comment_banks'
              ),
            loader: () => getCommentBanks({}),
            element: <CommentBanks />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'comment-banks/:id',
            hasAccess: (permissions) => permissions.isStaffUser,
            loader: ({ params }) => {
              const id = getNumber(params?.id);

              if (!id) {
                throw404Error();
              }

              return getCommentBanks({ ids: [id] });
            },
            element: <Comments />,
          },
        ],
      },
    ],
  },
];
