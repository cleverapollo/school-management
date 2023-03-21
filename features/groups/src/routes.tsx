import { getNumber, NavObjectFunction, NavObjectType } from '@tyro/core';
import { lazy } from 'react';
import { BookOpenIcon, UserProfileCardIcon } from '@tyro/icons';
import { Iterator, UserType } from '@tyro/api';
import { redirect } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  getSubjectGroupAttendanceCode,
  getSubjectGroupLessonByIteratorInfo,
  getSubjectGroups,
  getSubjectGroupsById,
} from './api/subject-groups';
import { getStudentSubjects } from './api/student-subjects';
import {
  getCustomGroups,
  getCustomGroupsById,
  getEnrolmentGroups,
  getEnrolmentGroupsById,
} from './api/general-groups';

const CustomGroups = lazy(() => import('./pages/custom'));
const ViewCustomGroupPage = lazy(() => import('./pages/custom/view'));
const EnrolmentGroups = lazy(() => import('./pages/enrolment'));
const ViewEnrolmentGroupPage = lazy(() => import('./pages/enrolment/view'));
const SubjectGroups = lazy(() => import('./pages/subject'));
const Subjects = lazy(() => import('./pages/subject/students-list'));
const SubjectGroupProfileAttendancePage = lazy(
  () => import('./pages/subject/profile/attendance')
);

const SubjectGroupContainer = lazy(
  () => import('./components/subject-group/subject-group-container')
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
        hasAccess: ({ userType }) =>
          !!userType && [UserType.Admin, UserType.Teacher].includes(userType),
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
            loader: ({ params }) => {
              const groupId = getNumber(params.groupId);

              return getSubjectGroupsById(groupId);
            },
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('./attendance'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'attendance',
                element: <SubjectGroupProfileAttendancePage />,
                loader: ({ params }) => {
                  const groupId = getNumber(params.groupId);

                  return Promise.all([
                    getSubjectGroupAttendanceCode({
                      custom: true,
                    }),
                    getSubjectGroupLessonByIteratorInfo({
                      partyId: groupId!,
                      iterator: Iterator.Closest,
                    }),
                    getSubjectGroupLessonByIteratorInfo({
                      partyId: groupId!,
                      iterator: Iterator.Next,
                      eventStartTime: dayjs().format('YYYY-MM-DDTHH:mm'),
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
      {
        type: NavObjectType.RootLink,
        path: 'subjects',
        title: t('navigation:general.subjects'),
        hasAccess: ({ userType }) =>
          !!userType && [UserType.Admin, UserType.Teacher].includes(userType),
        icon: <BookOpenIcon />,
        loader: () => getStudentSubjects(),
        element: <Subjects />,
      },
    ],
  },
];
