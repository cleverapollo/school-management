import { lazy } from 'react';
import { NavObjectFunction, NavObjectType, getNumber } from '@tyro/core';
import { UserGroupIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';
import { redirect } from 'react-router-dom';
import { getStudent, getStudents } from './api/students';

const StudentsListPage = lazy(() => import('./pages/students'));
// Student profile pages
const StudentProfileContainer = lazy(
  () => import('./components/students/student-profile-container')
);
const StudentProfileOverviewPage = lazy(
  () => import('./pages/students/profile/overview')
);
const StudentProfilePersonalPage = lazy(
  () => import('./pages/students/profile/personal')
);
const StudentProfileAttendancePage = lazy(
  () => import('./pages/students/profile/attendance')
);
const StudentProfileFeesPage = lazy(
  () => import('./pages/students/profile/fees')
);
const StudentProfileAssessmentPage = lazy(
  () => import('./pages/students/profile/assessment')
);
const StudentProfileTimetablePage = lazy(
  () => import('./pages/students/profile/timetable')
);
const StudentProfileWellBeingPage = lazy(
  () => import('./pages/students/profile/well-being')
);
const StudentProfileSenPage = lazy(
  () => import('./pages/students/profile/sen')
);
const StudentProfileClassesPage = lazy(
  () => import('./pages/students/profile/classes')
);
const StudentProfileSettingsPage = lazy(
  () => import('./pages/students/profile/settings')
);

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'people',
        title: t('navigation:management.people.title'),
        icon: <UserGroupIcon />,
        hasAccess: ({ userType }) =>
          !!userType && [UserType.Admin, UserType.Teacher].includes(userType),
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'students',
            title: t('navigation:management.people.students'),
            loader: () => getStudents(),
            element: <StudentsListPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'students/:id',
            element: <StudentProfileContainer />,
            loader: ({ params }) => {
              const studentId = getNumber(params.id);
              return getStudent(studentId);
            },
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('./overview'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'overview',
                element: <StudentProfileOverviewPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'personal',
                element: <StudentProfilePersonalPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'attendance',
                element: <StudentProfileAttendancePage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'fees',
                element: <StudentProfileFeesPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'assessment',
                element: <StudentProfileAssessmentPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'timetable',
                element: <StudentProfileTimetablePage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'well-being',
                element: <StudentProfileWellBeingPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'sen',
                element: <StudentProfileSenPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'classes',
                element: <StudentProfileClassesPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'settings',
                element: <StudentProfileSettingsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
