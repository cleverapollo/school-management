import {
  getNumber,
  NavObjectFunction,
  NavObjectType,
  LazyLoader,
} from '@tyro/core';
import { lazy } from 'react';
import { BookOpenIcon, UserProfileCardIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';
import { getSubjectGroups, getSubjectGroupsById } from './api/subject-groups';

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
            element: (
              <LazyLoader>
                <EnrolmentGroups />
              </LazyLoader>
            ),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: ':groupId/view',
                element: (
                  <LazyLoader>
                    <ViewEnrolmentGroupPage />
                  </LazyLoader>
                ),
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'subject',
            title: t('navigation:general.groups.subject'),
            loader: () => getSubjectGroups(),
            element: (
              <LazyLoader>
                <SubjectGroups />
              </LazyLoader>
            ),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: ':groupId/view',
                loader: ({ params }) => {
                  const groupId = getNumber(params?.groupId);
                  getSubjectGroupsById(groupId);
                },
                element: (
                  <LazyLoader>
                    <ViewSubjectGroupPage />
                  </LazyLoader>
                ),
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'custom',
            title: t('navigation:general.groups.custom'),
            element: (
              <LazyLoader>
                <CustomGroups />
              </LazyLoader>
            ),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: ':groupId/view',
                element: (
                  <LazyLoader>
                    <ViewCustomGroupPage />
                  </LazyLoader>
                ),
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
        element: (
          <LazyLoader>
            <Subjects />
          </LazyLoader>
        ),
      },
    ],
  },
];
