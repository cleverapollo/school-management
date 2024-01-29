import {
  NavObjectFunction,
  NavObjectType,
  getNumber,
  throw404Error,
  lazyWithRetry,
} from '@tyro/core';
import { UserGroupIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';
import {
  getStudentDashboardAssessments,
  getStudentAssessmentResults,
} from '@tyro/assessments';
import {
  getPartyTimetable,
  getTimetableInfo,
  getTodayTimetableEvents,
} from '@tyro/calendar';
import dayjs from 'dayjs';
import {
  getAcademicNamespace,
  getPermissionUtils,
  Notes_BehaviourType,
} from '@tyro/api';
import { getStudentFees } from '@tyro/fees';
import {
  getStudent,
  getStudents,
  getStudentsForSelect,
} from './api/student/students';
import { getPersonStatus } from './api/person/status';
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
import { getStaffSubjectGroups } from './api/staff/subject-groups';
import { getStaffPersonal } from './api/staff/personal';
import { getMedicalConditionNamesQuery } from './api/student/medicals/medical-condition-lookup';
import { getPersonalTitlesQuery } from './api/student/medicals/personal-titles';
import {
  getStudentBehaviour,
  getBehaviourCategories,
} from './api/behaviour/student-behaviour';
import { getNonClassContactHours } from './api/staff/non-class-contact';

const StudentsListPage = lazyWithRetry(() => import('./pages/students'));
// Student profile pages
const StudentProfileContainer = lazyWithRetry(
  () => import('./components/students/student-profile-container')
);
const StudentProfileOverviewPage = lazyWithRetry(
  () => import('./pages/students/profile/overview')
);
const StudentProfilePersonalPage = lazyWithRetry(
  () => import('./pages/students/profile/personal')
);
const StudentProfileContactsPage = lazyWithRetry(
  () => import('./pages/students/profile/contacts')
);
const StudentProfileAttendancePage = lazyWithRetry(
  () => import('./pages/students/profile/attendance')
);
const StudentProfileFeesPage = lazyWithRetry(
  () => import('./pages/students/profile/fees')
);
const StudentProfileAssessmentPage = lazyWithRetry(
  () => import('./pages/students/profile/assessment')
);
const StudentProfileTimetablePage = lazyWithRetry(
  () => import('./pages/students/profile/timetable')
);
const StudentProfileBehaviourPage = lazyWithRetry(
  () => import('./pages/students/profile/behaviour')
);
const StudentProfileAenPage = lazyWithRetry(
  () => import('./pages/students/profile/aen')
);
const StudentProfileClassesPage = lazyWithRetry(
  () => import('./pages/students/profile/classes')
);
const StudentProfileSettingsPage = lazyWithRetry(
  () => import('./pages/students/profile/settings')
);
const StudentProfileMedicalPage = lazyWithRetry(
  () => import('./pages/students/profile/medical')
);
const StudentProfileNotesPage = lazyWithRetry(
  () => import('./pages/students/profile/notes')
);

// Contact pages
const ContactsListPage = lazyWithRetry(() => import('./pages/contacts'));

const ContactProfileContainer = lazyWithRetry(
  () => import('./components/contact/contact-profile-container')
);
const ContactProfilePersonalPage = lazyWithRetry(
  () => import('./pages/contacts/profile/personal')
);
const ContactProfileStudentsPage = lazyWithRetry(
  () => import('./pages/contacts/profile/students')
);
const ContactProfileFeesPage = lazyWithRetry(
  () => import('./pages/contacts/profile/fees')
);
const ContactProfileAccessPage = lazyWithRetry(
  () => import('./pages/contacts/profile/access')
);

const CreateContactPage = lazyWithRetry(
  () => import('./pages/contacts/create')
);

// Staff pages

const StaffListPage = lazyWithRetry(() => import('./pages/staff'));

const StaffProfileContainer = lazyWithRetry(
  () => import('./components/staff/staff-profile-container')
);
const StaffProfileOverviewPage = lazyWithRetry(
  () => import('./pages/staff/profile/overview')
);
const StaffProfilePersonalPage = lazyWithRetry(
  () => import('./pages/staff/profile/personal')
);
const StaffProfileTimetablePage = lazyWithRetry(
  () => import('./pages/staff/profile/timetable')
);
const StaffProfileClassesPage = lazyWithRetry(
  () => import('./pages/staff/profile/classes')
);
const StaffProfileNonClassContactPage = lazyWithRetry(
  () => import('./pages/staff/profile/non-class-contact')
);

const CreateStaffPage = lazyWithRetry(() => import('./pages/staff/create'));

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
                getPersonStatus(studentId),
              ]);
            },
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: async () => {
                  const { isStaffUserWithPermission } =
                    await getPermissionUtils();

                  return isStaffUserWithPermission(
                    'ps:1:people:view_student_overview'
                  )
                    ? redirect('./overview')
                    : redirect('./classes');
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'overview',
                hasAccess: ({ isStaffUserWithPermission }) =>
                  isStaffUserWithPermission(
                    'ps:1:people:view_student_overview'
                  ),
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);
                  const formattedDate = dayjs().format('YYYY-MM-DD');

                  if (!studentId) {
                    throw404Error();
                  }

                  return Promise.all([
                    getStudentsContacts(studentId),
                    getStudentDashboardAssessments({
                      studentPartyId: studentId,
                      published: true,
                    }),
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
                hasAccess: ({ isStaffUserWithPermission }) =>
                  isStaffUserWithPermission('ps:1:fees:write_fees'),
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);

                  if (!studentId) {
                    throw404Error();
                  }

                  return getStudentFees({ studentPartyId: studentId });
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'assessment',
                element: <StudentProfileAssessmentPage />,
                loader: async ({ params }) => {
                  const studentId = getNumber(params.id);
                  const { activeAcademicNamespace } =
                    await getAcademicNamespace();

                  if (!studentId) {
                    throw404Error();
                  }

                  const assessments = await getStudentDashboardAssessments({
                    studentPartyId: studentId,
                    published: true,
                  });

                  if (activeAcademicNamespace && assessments?.length) {
                    return getStudentAssessmentResults(
                      activeAcademicNamespace.academicNamespaceId,
                      {
                        studentPartyIds: [studentId],
                        assessmentId: assessments[0].id,
                      }
                    );
                  }

                  return assessments;
                },
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
                hasAccess: ({ isStaffUserWithPermission }) =>
                  isStaffUserWithPermission('ps:1:notes:read_behaviour'),
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);

                  if (!studentId) {
                    throw404Error();
                  }

                  return (
                    Promise.all([
                      getBehaviourCategories({
                        partyIds: [studentId],
                        behaviourType: Notes_BehaviourType.Positive,
                      }),
                    ]),
                    getStudentBehaviour({
                      partyIds: [studentId],
                      behaviourType: Notes_BehaviourType.Positive,
                    })
                  );
                },
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

                  return getStudentsSubjectGroups([studentId]);
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
                hasAccess: ({ isStaffUserWithPermission }) =>
                  isStaffUserWithPermission('ps:1:notes:read_notes'),
                loader: ({ params }) => {
                  const studentId = getNumber(params.id);
                  return getNotes({ partyIds: [studentId ?? 0] });
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
                getPersonStatus(staffId),
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

                  return getStaffSubjectGroups(
                    { partyIds: [staffId] },
                    undefined
                  );
                },
                element: <StaffProfileClassesPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'non-class-contact',
                element: <StaffProfileNonClassContactPage />,
                loader: async ({ params }) => {
                  const staffId = getNumber(params.id);
                  const { activeAcademicNamespace } =
                    await getAcademicNamespace();

                  if (!staffId) {
                    throw404Error();
                  }

                  return getNonClassContactHours({
                    academicNameSpaceId:
                      activeAcademicNamespace?.academicNamespaceId ?? 0,
                    staffPartyId: staffId,
                  });
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
