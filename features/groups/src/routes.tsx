import { getNumber, NavObjectFunction, NavObjectType } from '@tyro/core';
import { lazy } from 'react';
import { BookOpenIcon, UserProfileCardIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';
import { getSubjectGroups, getSubjectGroupsById } from './api/subject-groups';
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
const ViewSubjectGroupPage = lazy(() => import('./pages/subject/view'));
const Subjects = lazy(() => import('./pages/subject/students-list'));

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
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: ':groupId/view',
                loader: ({ params }) => {
                  const groupId = getNumber(params?.groupId);
                  getSubjectGroupsById(groupId);
                },
                element: <ViewSubjectGroupPage />,
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
