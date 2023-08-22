import { lazy } from 'react';
import {
  NavObjectFunction,
  NavObjectType,
  getNumber,
  throw404Error,
} from '@tyro/core';
import { UserGroupIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';
import { getStudentDashboardAssessments } from '@tyro/assessments';
import {
  getPartyTimetable,
  getTimetableInfo,
  getTodayTimetableEvents,
} from '@tyro/calendar';
import dayjs from 'dayjs';
import { getPermissionUtils } from '@tyro/api';
import {
  getStudent,
  getStudents,
  getStudentsForSelect,
} from './api/student/students';
import { getStudentStatus } from './api/student/status';
import { getStudentMedicalData } from './api/student/medicals/student-medical-data';
import {
  getStudentsContacts,
  getStudentsSubjectGroups,
} from './api/student/overview';
import { getStudentPersonal } from './api/student/personal';
import { getContacts } from './api/contact/list';
import { getNotes } from './api/note/list';
import { getContactPersonal } from './api/contact/personal';
import { getContactStudents } from './api/contact/students';
import { getStaff } from './api/staff';
import { getStaffStatus } from './api/staff/status';
import { getStaffSubjectGroups } from './api/staff/subject-groups';
import { getStaffPersonal } from './api/staff/personal';
import { getMedicalConditionNamesQuery } from './api/student/medicals/medical-condition-lookup';
import { getPersonalTitlesQuery } from './api/student/medicals/personal-titles';

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
const StudentProfileBehaviourPage = lazy(
  () => import('./pages/students/profile/behaviour')
);
const StudentProfileAenPage = lazy(
  () => import('./pages/students/profile/aen')
);
const StudentProfileClassesPage = lazy(
  () => import('./pages/students/profile/classes')
);
const StudentProfileSettingsPage = lazy(
  () => import('./pages/students/profile/settings')
);
const StudentProfileMedicalPage = lazy(
  () => import('./pages/students/profile/medical')
);
const StudentProfileNotesPage = lazy(
  () => import('./pages/students/profile/notes')
);

// Contact pages
const ContactsListPage = lazy(() => import('./pages/contacts'));

const ContactProfileContainer = lazy(
  () => import('./components/contact/contact-profile-container')
);
const ContactProfilePersonalPage = lazy(
  () => import('./pages/contacts/profile/personal')
);
const ContactProfileStudentsPage = lazy(
  () => import('./pages/contacts/profile/students')
);
const ContactProfileFeesPage = lazy(
  () => import('./pages/contacts/profile/fees')
);
const ContactProfileAccessPage = lazy(
  () => import('./pages/contacts/profile/access')
);

const CreateContactPage = lazy(() => import('./pages/contacts/create'));

// Staff pages

const StaffListPage = lazy(() => import('./pages/staff'));

const StaffProfileContainer = lazy(
  () => import('./components/staff/staff-profile-container')
);
const StaffProfileOverviewPage = lazy(
  () => import('./pages/staff/profile/overview')
);
const StaffProfilePersonalPage = lazy(
  () => import('./pages/staff/profile/personal')
);
const StaffProfileTimetablePage = lazy(
  () => import('./pages/staff/profile/timetable')
);
const StaffProfileClassesPage = lazy(
  () => import('./pages/staff/profile/classes')
);

const CreateStaffPage = lazy(() => import('./pages/staff/create'));

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
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'students',
            title: t('navigation:management.people.students'),
            loader: () => getStudents(),
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:people:view_student_list'),
            element: <StudentsListPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'students/:id',
            element: <StudentProfileContainer />,
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:people:view_student_profile'),
            loader: ({ params }) => {
              const studentId = getNumber(params.id);

              if (!studentId) {
                throw404Error();
              }

              return Promise.all([
                getStudent(studentId),
                getStudentStatus(studentId),
              ]);
            },
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: async () => {
                  const permissions = await getPermissionUtils();
                  if (permissions.isContact || permissions.isStudent) {
                    return redirect('./classes');
                  }
                  return redirect('./classes');
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'overview',
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);
                  const formattedDate = dayjs().format('YYYY-MM-DD');

                  if (!studentId) {
                    throw404Error();
                  }

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
                // todo tab should be visible only if user has permission to view student personal information
                hasAccess: (permissions) =>
                  permissions.hasPermission(
                    'ps:1:people:view_student_personal_information'
                  ),
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);

                  if (!studentId) {
                    throw404Error();
                  }

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
                hasAccess: ({ isStaffUserWithPermission }) =>
                  isStaffUserWithPermission(
                    'ps:1:attendance:read_session_attendance_individual'
                  ),
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

                  if (!studentId) {
                    throw404Error();
                  }

                  return getTodayTimetableEvents(studentId);
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'behaviour',
                element: <StudentProfileBehaviourPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'aen',
                hasAccess: ({ isStaffUserWithPermission }) =>
                  isStaffUserWithPermission('ps:1:wellbeing:write_student_aen'),
                element: <StudentProfileAenPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'classes',
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);

                  if (!studentId) {
                    throw404Error();
                  }

                  return getStudentsSubjectGroups(studentId);
                },
                element: <StudentProfileClassesPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'settings',
                element: <StudentProfileSettingsPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'medical',
                element: <StudentProfileMedicalPage />,
                loader: async ({ params }) => {
                  const studentId = getNumber(params.id);

                  if (!studentId) {
                    throw404Error();
                  }

                  return Promise.all([
                    getStudentMedicalData(studentId),
                    getMedicalConditionNamesQuery(),
                    getPersonalTitlesQuery(),
                  ]);
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'notes',
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);
                  return getNotes(studentId);
                },
                element: <StudentProfileNotesPage />,
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'contacts',
            title: t('navigation:management.people.contacts'),
            loader: () => getContacts(),
            hasAccess: (permissions) =>
              permissions.isStaffUserWithPermission(
                'ps:1:people:view_contact_list'
              ),
            element: <ContactsListPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'contacts/create',
            loader: () => getStudentsForSelect({}),
            element: <CreateContactPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'contacts/:id',
            element: <ContactProfileContainer />,
            // todo issue here where were user needs to
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:people:view_contact_profile'),
            loader: ({ params }) => {
              const contactId = getNumber(params.id);

              if (!contactId) {
                throw404Error();
              }

              return getContactPersonal(contactId ?? 0);
            },
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('./personal'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'personal',
                // todo tab should be visible only if user has permission to view student personal information
                hasAccess: (permissions) =>
                  permissions.hasPermission(
                    'ps:1:people:view_contact_personal_information'
                  ),
                loader: ({ params }) => {
                  const contactId = getNumber(params.id);

                  if (!contactId) {
                    throw404Error();
                  }

                  return getContactPersonal(contactId);
                },
                element: <ContactProfilePersonalPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'students',
                loader: ({ params }) => {
                  const contactId = getNumber(params.id);

                  if (!contactId) {
                    throw404Error();
                  }

                  return getContactStudents(contactId);
                },
                element: <ContactProfileStudentsPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'fees',
                element: <ContactProfileFeesPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'access',
                element: <ContactProfileAccessPage />,
              },
            ],
          },
          {
            type: NavObjectType.MenuLink,
            path: 'staff',
            title: t('navigation:management.people.staff'),
            loader: () => getStaff({}),
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:people:view_staff_list'),
            element: <StaffListPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'staff/create',
            loader: () => getStudentsForSelect({}),
            element: <CreateStaffPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'staff/:id',
            element: <StaffProfileContainer />,
            hasAccess: (permissions) =>
              permissions.hasPermission('ps:1:people:view_staff_profile'),
            loader: ({ params }) => {
              const staffId = getNumber(params.id);

              if (!staffId) {
                throw404Error();
              }

              return Promise.all([
                getStaff({ partyIds: [staffId] }),
                getStaffStatus(staffId),
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
                element: <StaffProfileOverviewPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'personal',
                hasAccess: (permissions) =>
                  permissions.hasPermission(
                    'ps:1:people:view_staff_personal_information'
                  ),
                loader: ({ params }) => {
                  const staffId = getNumber(params.id);

                  if (!staffId) {
                    throw404Error();
                  }

                  return getStaffPersonal({ partyIds: [staffId] });
                },
                element: <StaffProfilePersonalPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'timetable',
                element: <StaffProfileTimetablePage />,
                loader: ({ params }) => {
                  const staffId = getNumber(params.id);

                  if (!staffId) {
                    throw404Error();
                  }

                  return getTodayTimetableEvents(staffId);
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'classes',
                loader: ({ params }) => {
                  const staffId = getNumber(params.id);

                  if (!staffId) {
                    throw404Error();
                  }

                  return getStaffSubjectGroups({ partyIds: [staffId] });
                },
                element: <StaffProfileClassesPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
