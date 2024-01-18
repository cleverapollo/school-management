import {
  getNumber,
  lazyWithRetry,
  NavObjectFunction,
  NavObjectType,
  throw404Error,
} from '@tyro/core';
import { UserProfileCardIcon } from '@tyro/icons';
import { Iterator, Notes_BehaviourType } from '@tyro/api';
import { redirect } from 'react-router-dom';
import { getAttendanceCodes } from '@tyro/attendance';

import { getTodayTimetableEvents } from '@tyro/calendar';
import { getStudentBehaviour } from '@tyro/people';
import {
  getSubjectGroups,
  getSubjectGroupById,
  getCustomGroups,
  getCustomGroupById,
  getClassGroups,
  getClassGroupsById,
  getSubjectGroupLesson,
  getCustomGroupDefinition,
} from './api';
import { getYearGroups, getYearGroupById } from './api/year-groups';
import { getSupportGroupById, getSupportGroups } from './api/support-groups';
import { getValidEventStartTime } from './utils/get-valid-event-start-time';

// year group

const YearGroups = lazyWithRetry(() => import('./pages/year'));
const ViewYearGroupPage = lazyWithRetry(() => import('./pages/year/view'));

// class group

const ClassGroupContainer = lazyWithRetry(
  () => import('./components/class-group/container')
);
const ClassGroups = lazyWithRetry(() => import('./pages/class'));
const ClassGroupProfileTimetablePage = lazyWithRetry(
  () => import('./pages/class/timetable')
);
const ClassGroupsStudentsPage = lazyWithRetry(
  () => import('./pages/class/students')
);
const ClassGroupAttendancePage = lazyWithRetry(
  () => import('./pages/class/attendance')
);
const SubjectGroupsPage = lazyWithRetry(
  () => import('./pages/class/subject-groups')
);

// support group

const SubjectGroupContainer = lazyWithRetry(
  () => import('./components/subject-group/container')
);
const SubjectGroups = lazyWithRetry(() => import('./pages/subject'));
const SubjectGroupProfileStudentsPage = lazyWithRetry(
  () => import('./pages/subject/profile/students')
);
const SubjectGroupProfileAttendancePage = lazyWithRetry(
  () => import('./pages/subject/profile/attendance')
);
const SubjectGroupProfileTimetablePage = lazyWithRetry(
  () => import('./pages/subject/profile/timetable')
);
const SubjectGroupProfileBehaviourPage = lazyWithRetry(
  () => import('./pages/subject/profile/behaviour')
);
// support group
const SupportGroupContainer = lazyWithRetry(
  () => import('./components/support-group/container')
);
const SupportGroups = lazyWithRetry(() => import('./pages/support'));
const SupportGroupProfileStudentsPage = lazyWithRetry(
  () => import('./pages/support/profile/students')
);
const SupportGroupProfileAttendancePage = lazyWithRetry(
  () => import('./pages/support/profile/attendance')
);
const SupportGroupProfileTimetablePage = lazyWithRetry(
  () => import('./pages/support/profile/timetable')
);

// custom group

const CustomGroupContainer = lazyWithRetry(
  () => import('./components/custom-group/container')
);
const CustomGroups = lazyWithRetry(() => import('./pages/custom'));
const CreateCustomGroupPage = lazyWithRetry(
  () => import('./pages/custom/create')
);
const EditCustomGroupPage = lazyWithRetry(() => import('./pages/custom/edit'));
const CustomGroupStudentsPage = lazyWithRetry(
  () => import('./pages/custom/profile/students')
);
const CustomGroupStaffPage = lazyWithRetry(
  () => import('./pages/custom/profile/staff')
);
const CustomGroupTimetablePage = lazyWithRetry(
  () => import('./pages/custom/profile/timetable')
);
const CustomGroupAttendancePage = lazyWithRetry(
  () => import('./pages/custom/profile/attendance')
);

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'groups',
        icon: <UserProfileCardIcon />,
        hasAccess: (permissions) => permissions.isStaffUser,
        title: t('navigation:general.groups.title'),
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'year',
            title: t('navigation:general.groups.year'),
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:groups:view_year_groups'),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => getYearGroups(),
                element: <YearGroups />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: ':groupId',
                loader: ({ params }) => {
                  const groupId = getNumber(params?.groupId);
                  if (!groupId) {
                    throw404Error();
                  }

                  return getYearGroupById({
                    yearGroupEnrollmentPartyId: [groupId],
                  });
                },
                element: <ViewYearGroupPage />,
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'class',
            title: t('navigation:general.groups.class'),
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:groups:view_class_groups'),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => getClassGroups(),
                element: <ClassGroups />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: ':groupId',
                element: <ClassGroupContainer />,
                loader: ({ params }) => {
                  const groupId = getNumber(params?.groupId);
                  if (!groupId) {
                    throw404Error();
                  }

                  return getClassGroupsById(groupId);
                },
                children: [
                  {
                    type: NavObjectType.NonMenuLink,
                    index: true,
                    loader: () => redirect('./students'),
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'students',
                    element: <ClassGroupsStudentsPage />,
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'subject-groups',
                    element: <SubjectGroupsPage />,
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'timetable',
                    element: <ClassGroupProfileTimetablePage />,
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'attendance',
                    hasAccess: (permissions) =>
                      permissions.hasPermission(
                        'ps:1:attendance:read_session_attendance_class_group'
                      ),
                    element: <ClassGroupAttendancePage />,
                  },
                ],
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'subject',
            title: t('navigation:general.groups.subject'),
            loader: () => getSubjectGroups(),
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:groups:view_subject_groups'),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => getSubjectGroups(),
                element: <SubjectGroups />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: ':groupId',
                element: <SubjectGroupContainer />,
                loader: async ({ params }) => {
                  const groupId = getNumber(params.groupId);

                  if (!groupId) {
                    throw404Error();
                  }

                  const { calendar_calendarEventsIterator: closestLesson } =
                    await getSubjectGroupLesson({
                      partyId: groupId,
                      iterator: Iterator.Closest,
                    });

                  return Promise.all([
                    getSubjectGroupById(groupId),
                    ...(closestLesson
                      ? [
                          getSubjectGroupLesson({
                            partyId: groupId,
                            eventStartTime: closestLesson.startTime,
                            iterator: Iterator.Next,
                          }),
                        ]
                      : []),
                  ]);
                },
                children: [
                  {
                    type: NavObjectType.NonMenuLink,
                    index: true,
                    loader: () => redirect('./attendance'),
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'students',
                    element: <SubjectGroupProfileStudentsPage />,
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'attendance',
                    element: <SubjectGroupProfileAttendancePage />,
                    loader: async ({ params }) => {
                      const groupId = getNumber(params.groupId);

                      if (!groupId) {
                        throw404Error();
                      }

                      const searchParams = new URLSearchParams(
                        document.location.search
                      );

                      const eventStartTime = searchParams.get('eventStartTime');

                      return Promise.all([
                        getAttendanceCodes({ teachingGroupCodes: true }),
                        getSubjectGroupLesson({
                          partyId: groupId,
                          eventStartTime:
                            getValidEventStartTime(eventStartTime),
                          iterator: Iterator.Closest,
                        }),
                      ]);
                    },
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'timetable',
                    element: <SubjectGroupProfileTimetablePage />,
                    loader: ({ params }) => {
                      const groupId = getNumber(params.groupId);

                      return getTodayTimetableEvents(groupId);
                    },
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'behaviour',
                    element: <SubjectGroupProfileBehaviourPage />,
                    loader: ({ params }) => {
                      const groupId = getNumber(params.groupId);

                      if (!groupId) {
                        return throw404Error();
                      }

                      return getStudentBehaviour({
                        associatedPartyIds: [groupId],
                      });
                    },
                  },
                ],
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'support',
            title: t('navigation:general.groups.support'),
            loader: () => getSupportGroups(),
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission('ps:1:groups:view_subject_groups'),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => getSupportGroups(),
                element: <SupportGroups />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: ':groupId',
                element: <SupportGroupContainer />,
                loader: async ({ params }) => {
                  const groupId = getNumber(params.groupId);

                  if (!groupId) {
                    throw404Error();
                  }

                  const { calendar_calendarEventsIterator: closestLesson } =
                    await getSubjectGroupLesson({
                      partyId: groupId,
                      iterator: Iterator.Closest,
                    });

                  return Promise.all([
                    getSupportGroupById(groupId),
                    ...(closestLesson
                      ? [
                          getSubjectGroupLesson({
                            partyId: groupId,
                            eventStartTime: closestLesson.startTime,
                            iterator: Iterator.Next,
                          }),
                        ]
                      : []),
                  ]);
                },
                children: [
                  {
                    type: NavObjectType.NonMenuLink,
                    index: true,
                    loader: () => redirect('./students'),
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'students',
                    element: <SupportGroupProfileStudentsPage />,
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'attendance',
                    element: <SupportGroupProfileAttendancePage />,
                    loader: async ({ params }) => {
                      const groupId = getNumber(params.groupId);

                      if (!groupId) {
                        throw404Error();
                      }

                      return Promise.all([
                        getAttendanceCodes({ teachingGroupCodes: true }),
                        getSubjectGroupLesson({
                          partyId: groupId,
                          iterator: Iterator.Closest,
                        }),
                      ]);
                    },
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'timetable',
                    element: <SupportGroupProfileTimetablePage />,
                    loader: ({ params }) => {
                      const groupId = getNumber(params.groupId);

                      return getTodayTimetableEvents(groupId);
                    },
                  },
                ],
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'custom',
            title: t('navigation:general.groups.custom'),
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:groups:view_custom_groups'),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => getCustomGroups(),
                element: <CustomGroups />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'create',
                element: <CreateCustomGroupPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'edit/:groupId',
                loader: ({ params }) => {
                  const groupId = getNumber(params?.groupId);
                  if (!groupId) {
                    throw404Error();
                  }

                  return getCustomGroupDefinition({ partyId: groupId });
                },
                element: <EditCustomGroupPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: ':groupId',
                element: <CustomGroupContainer />,
                loader: async ({ params }) => {
                  const groupId = getNumber(params.groupId);

                  if (!groupId) {
                    throw404Error();
                  }

                  return Promise.all([
                    getCustomGroupById(groupId),
                    getCustomGroupDefinition({ partyId: groupId }),
                  ]);
                },
                children: [
                  {
                    type: NavObjectType.NonMenuLink,
                    index: true,
                    loader: () => redirect('./students'),
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'students',
                    element: <CustomGroupStudentsPage />,
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'staff',
                    element: <CustomGroupStaffPage />,
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'attendance',
                    element: <CustomGroupAttendancePage />,
                    loader: async ({ params }) => {
                      const groupId = getNumber(params.groupId);
                      if (!groupId) {
                        throw404Error();
                      }
                      return Promise.all([
                        getAttendanceCodes({ teachingGroupCodes: true }),
                        getSubjectGroupLesson({
                          partyId: groupId,
                          iterator: Iterator.Closest,
                        }),
                      ]);
                    },
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'timetable',
                    element: <CustomGroupTimetablePage />,
                    loader: ({ params }) => {
                      const groupId = getNumber(params.groupId);
                      return getTodayTimetableEvents(groupId);
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
