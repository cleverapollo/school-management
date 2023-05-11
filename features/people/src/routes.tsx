import { lazy } from 'react';
import { NavObjectFunction, NavObjectType, getNumber } from '@tyro/core';
import { UserGroupIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';
import { getStudentDashboardAssessments } from '@tyro/assessments';
import {
  getCalendarEvents,
  getPartyTimetable,
  getTimetableInfo,
  getTimetableInfoForCalendar,
} from '@tyro/calendar';
import dayjs from 'dayjs';
import {
  getStudent,
  getStudents,
  getStudentPersonal,
  getStudentsContacts,
  getContacts,
  getStudentStatus,
  getStaff,
  getStudentsSubjectGroups,
  getStaffStatus
} from './api';

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
const StudentProfileContactsPage = lazy(
  () => import('./pages/students/profile/contacts')
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

const ContactsListPage = lazy(() => import('./pages/contacts'));

const StaffListPage = lazy(() => import('./pages/staff'));
//Staff profile pages
const StaffProfileContainer = lazy(
  () => import('./components/staff/staff-profile-container')
);
const StaffProfileOverviewPage = lazy(
  () => import('./pages/staff/profile/overview')
);
const StaffProfilePersonalPage = lazy(
  () => import('./pages/staff/profile/personal')
);
const StaffProfileContactsPage = lazy(
  () => import('./pages/staff/profile/contacts')
);
const StaffProfileTimetablePage = lazy(
  () => import('./pages/staff/profile/timetable')
);
const StaffProfileClassesPage = lazy(
  () => import('./pages/staff/profile/classes')
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
        hasAccess: (permissions) => permissions.isStaffUser,
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
              return Promise.all([
                getStudent(studentId),
                getStudentStatus(studentId),
              ]);
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
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);
                  const formattedDate = dayjs().format('YYYY-MM-DD');

                  return Promise.all([
                    getStudentsContacts(studentId),
                    getStudentDashboardAssessments(studentId),
                    getPartyTimetable({
                      resources: {
                        partyIds: [studentId ?? 0],
                      },
                      startDate: formattedDate,
                      endDate: formattedDate,
                    }),
                    getTimetableInfo({
                      fromDate: formattedDate,
                      toDate: formattedDate,
                    }),
                  ]);
                },
                element: <StudentProfileOverviewPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'personal',
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);
                  return getStudentPersonal(studentId);
                },
                element: <StudentProfilePersonalPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'contacts',
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);
                  return getStudentsContacts(studentId);
                },
                element: <StudentProfileContactsPage />,
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
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);

                  const getEventsPromise = studentId
                    ? getCalendarEvents({
                        date: new Date(),
                        resources: {
                          partyIds: [studentId],
                        },
                      })
                    : null;

                  return Promise.all([
                    getEventsPromise,
                    getTimetableInfoForCalendar(new Date()),
                  ]);
                },
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
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);
                  return getStudentsSubjectGroups(studentId);
                },
                element: <StudentProfileClassesPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'settings',
                element: <StudentProfileSettingsPage />,
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'contacts',
            title: t('navigation:management.people.contacts'),
            loader: () => getContacts(),
            element: <ContactsListPage />,
          },
          {
            type: NavObjectType.MenuLink,
            path: 'staff',
            title: t('navigation:management.people.staff'),
            loader: () => getStaff({}),
            element: <StaffListPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'staff/:id',
            element: <StaffProfileContainer />,
            loader: ({ params }) => {
              const studentId = getNumber(params.id);
              return Promise.all([
                getStaff({ partyIds: [studentId ?? 0] }),
                getStaffStatus(studentId),
              ]);
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
                loader: ({ params }) => {
                  return Promise.all([]);
                },
                element: <StaffProfileOverviewPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'personal',
                loader: ({ params }) => {
                  return Promise.all([]);
                },
                element: <StaffProfilePersonalPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'contacts',
                loader: ({ params }) => {
                  return Promise.all([]);
                },
                element: <StaffProfileContactsPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'timetable',
                element: <StaffProfileTimetablePage />,
                loader: ({ params }) => {
                  return Promise.all([]);
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'classes',
                loader: ({ params }) => {
                  return Promise.all([]);
                },
                element: <StaffProfileClassesPage />,
              },
            ],
          }
        ],
      },
    ],
  },
];
