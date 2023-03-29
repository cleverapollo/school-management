import { getNumber, NavObjectFunction, NavObjectType } from '@tyro/core';
import { lazy } from 'react';
import {
  UserProfileCardIcon,
  BookOpenIcon,
  UserProfileCardIcon,
} from '@tyro/icons';
import {
  isStaffUser,
  Iterator,
  UserType,
  isStaffUser,
  UserType,
} from '@tyro/api';
import { redirect } from 'react-router-dom';
import { getAttendanceCodes } from '@tyro/attendance';

import { getSubjectGroups, getSubjectGroupsById } from './api/subject-groups';
import { getStudentSubjects } from './api/student-subjects';
import {
  getSubjectGroups,
  getSubjectGroupsById,
  getCustomGroups,
  getCustomGroupsById,
  getEnrolmentGroups,
  getEnrolmentGroupsById,
  getSubjectGroupLesson,
} from './api';

const CustomGroups = lazy(() => import('./pages/custom'));
const ViewCustomGroupPage = lazy(() => import('./pages/custom/view'));
const EnrolmentGroups = lazy(() => import('./pages/enrolment'));
const ViewEnrolmentGroupPage = lazy(() => import('./pages/enrolment/view'));
const SubjectGroups = lazy(() => import('./pages/subject'));

const SubjectGroupProfileStudentsPage = lazy(
  () => import('./pages/subject/profile/students')
);

const SubjectGroupProfileAttendancePage = lazy(
  () => import('./pages/subject/profile/attendance')
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
        hasAccess: (permissions) => isStaffUser(permissions),
        title: t('navigation:general.groups.title'),
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'enrolment',
            title: t('navigation:general.groups.enrolment'),
            loader: () => getEnrolmentGroups(),
            element: <EnrolmentGroups />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: ':groupId/view',
                loader: ({ params }) => {
                  const groupId = getNumber(params?.groupId);
                  getEnrolmentGroupsById(groupId);
                },
                element: <ViewEnrolmentGroupPage />,
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'subject',
            title: t('navigation:general.groups.subject'),
            loader: () => getSubjectGroups(),
            element: <SubjectGroups />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'subject/:groupId',
            element: <SubjectGroupContainer />,
            loader: async ({ params }) => {
              const groupId = getNumber(params.groupId);

              const { calendar_calendarEventsIterator: closestLesson } =
                await getSubjectGroupLesson({
                  partyId: groupId!,
                  iterator: Iterator.Closest,
                });

              return Promise.all([
                getSubjectGroupsById(groupId),
                ...(closestLesson
                  ? [
                      getSubjectGroupLesson({
                        partyId: groupId!,
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

                  return Promise.all([
                    getAttendanceCodes({ custom: false }),
                    getSubjectGroupLesson({
                      partyId: groupId!,
                      iterator: Iterator.Closest,
                    }),
                  ]);
                },
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'custom',
            title: t('navigation:general.groups.custom'),
            loader: () => getCustomGroups(),
            element: <CustomGroups />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: ':groupId/view',
                loader: ({ params }) => {
                  const groupId = getNumber(params?.groupId);
                  getCustomGroupsById(groupId);
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
