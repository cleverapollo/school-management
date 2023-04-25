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

import { getCalendarEvents, getTimetableInfoForCalendar } from '@tyro/calendar';
import {
  getSubjectGroups,
  getSubjectGroupsById,
  getCustomGroups,
  getCustomGroupsById,
  getClassGroups,
  getClassGroupsById,
  getSubjectGroupLesson,
} from './api';

const CustomGroups = lazy(() => import('./pages/custom'));
const ViewCustomGroupPage = lazy(() => import('./pages/custom/view'));
const ClassGroups = lazy(() => import('./pages/class'));
const ViewClassGroupPage = lazy(() => import('./pages/class/view'));
const SubjectGroups = lazy(() => import('./pages/subject'));

const SubjectGroupProfileStudentsPage = lazy(
  () => import('./pages/subject/profile/students')
);

const SubjectGroupProfileAttendancePage = lazy(
  () => import('./pages/subject/profile/attendance')
);

const SubjectGroupProfileTimetablePage = lazy(
  () => import('./pages/subject/profile/timetable')
);

const SubjectGroupContainer = lazy(
  () => import('./components/subject-group/container')
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
            path: 'class',
            title: t('navigation:general.groups.class'),
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
                loader: ({ params }) => {
                  const groupId = getNumber(params?.groupId);
                  return getClassGroupsById(groupId);
                },
                element: <ViewClassGroupPage />,
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'subject',
            title: t('navigation:general.groups.subject'),
            loader: () => getSubjectGroups(),
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
                    getSubjectGroupsById(groupId),
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
                        getAttendanceCodes({ custom: false }),
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

                      const getEventsPromise = groupId
                        ? getCalendarEvents({
                            date: new Date(),
                            resources: {
                              partyIds: [groupId],
                            },
                          })
                        : null;

                      return Promise.all([
                        getEventsPromise,
                        getTimetableInfoForCalendar(new Date()),
                      ]);
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

                  return getCustomGroupsById(groupId);
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
