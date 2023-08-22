import {
  getNumber,
  NavObjectFunction,
  NavObjectType,
  throw404Error,
} from '@tyro/core';
import { lazy } from 'react';
import { UserProfileCardIcon } from '@tyro/icons';
import { Iterator } from '@tyro/api';
import { redirect } from 'react-router-dom';
import { getAttendanceCodes } from '@tyro/attendance';

import { getTodayTimetableEvents } from '@tyro/calendar';
import {
  getSubjectGroups,
  getSubjectGroupById,
  getCustomGroups,
  getCustomGroupById,
  getClassGroups,
  getClassGroupsById,
  getSubjectGroupLesson,
} from './api';
import { getYearGroups, getYearGroupById } from './api/year-groups';
import { getSupportGroupById, getSupportGroups } from './api/support-groups';

const YearGroups = lazy(() => import('./pages/year'));
const ViewYearGroupPage = lazy(() => import('./pages/year/view'));
const CustomGroups = lazy(() => import('./pages/custom'));
const ViewCustomGroupPage = lazy(() => import('./pages/custom/view'));
const ClassGroups = lazy(() => import('./pages/class'));
const ClassGroupContainer = lazy(
  () => import('./components/class-group/container')
);
const ClassGroupProfileTimetablePage = lazy(
  () => import('./pages/class/timetable')
);
const ClassGroupsStudentsPage = lazy(() => import('./pages/class/students'));
const ClassGroupAttendancePage = lazy(() => import('./pages/class/attendance'));
const SubjectGroupsPage = lazy(() => import('./pages/class/subject-groups'));
const SubjectGroups = lazy(() => import('./pages/subject'));
const SupportGroups = lazy(() => import('./pages/support'));

const SubjectGroupProfileStudentsPage = lazy(
  () => import('./pages/subject/profile/students')
);

const SupportGroupProfileStudentsPage = lazy(
  () => import('./pages/support/profile/students')
);

const SubjectGroupProfileAttendancePage = lazy(
  () => import('./pages/subject/profile/attendance')
);

const SupportGroupProfileAttendancePage = lazy(
  () => import('./pages/support/profile/attendance')
);

const SubjectGroupProfileTimetablePage = lazy(
  () => import('./pages/subject/profile/timetable')
);

const SupportGroupProfileTimetablePage = lazy(
  () => import('./pages/support/profile/timetable')
);
const SubjectGroupContainer = lazy(
  () => import('./components/subject-group/container')
);
const SupportGroupContainer = lazy(
  () => import('./components/support-group/container')
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

                  return getYearGroupById(groupId);
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
                    loader: () => redirect('./students'),
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
                    element: <SubjectGroupProfileTimetablePage />,
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
            path: 'support',
            title: t('navigation:general.groups.support'),
            loader: () => getSupportGroups(),
            hasAccess: ({ isTyroUser }) => isTyroUser,
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
                path: ':groupId',
                loader: ({ params }) => {
                  const groupId = getNumber(params?.groupId);
                  if (!groupId) {
                    throw404Error();
                  }

                  return getCustomGroupById(groupId);
                },
                element: <ViewCustomGroupPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
