import { useParams } from 'react-router-dom';
import {
  useNumber,
  usePreferredNameLayout,
  PageHeading,
  TabPageContainer,
  PageContainer,
  PreferredNameFormat,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useStudent } from '../../api/student/students';
import { StudentOverviewBar } from './student-overview-bar';

export default function StudentProfileContainer() {
  const { t } = useTranslation(['common', 'people']);

  const { id } = useParams();
  const idNumber = useNumber(id);
  const { data: studentData } = useStudent(idNumber);

  const { displayName } = usePreferredNameLayout();

  const userProfileName = t('people:usersProfile', {
    name: displayName(studentData?.person, {
      format: PreferredNameFormat.FirstnameSurname,
    }),
  });

  return (
    <PageContainer title={userProfileName}>
      <PageHeading
        title={userProfileName}
        breadcrumbs={{
          links: [
            {
              name: t('common:students'),
              href: './..',
            },
            {
              name: userProfileName,
            },
          ],
        }}
      />
      <StudentOverviewBar studentId={idNumber} />
      <TabPageContainer
        links={[
          {
            label: t('common:overview'),
            value: 'overview',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission('ps:1:people:view_student_overview'),
          },
          {
            label: t('people:personal.title'),
            value: 'personal',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                'ps:1:people:view_student_personal_information'
              ),
          },
          {
            label: t('people:contacts'),
            value: 'contacts',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                'ps:1:people:view_contacts_for_student'
              ),
          },
          {
            label: t('common:attendance'),
            value: 'attendance',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                'ps:1:attendance:read_session_attendance_individual'
              ),
          },
          {
            label: 'Fees',
            value: 'fees',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission('ps:1:fees:write_fees'),
          },
          {
            label: 'Assessment',
            value: 'assessment',
          },
          {
            label: 'Timetable',
            value: 'timetable',
            hasAccess: ({ hasAtLeastOnePermission }) =>
              hasAtLeastOnePermission([
                'ps:1:calendar:view_own_calendar',
                'ps:1:calendar:view_calendar',
              ]),
          },
          {
            label: t('people:behaviour'),
            value: 'behaviour',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission('ps:1:notes:read_behaviour'),
          },
          {
            label: 'AEN',
            value: 'aen',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission('ps:1:wellbeing:write_student_aen'),
          },
          {
            label: 'Classes',
            value: 'classes',
            hasAccess: ({ isStaffUser, hasPermission }) =>
              isStaffUser || hasPermission('ps:1:groups:student_view_groups'),
          },
          // {
          //   label: 'Settings',
          //   value: 'settings',
          //   hasAccess: ({ isTyroUser }) => isTyroUser,
          // },
          {
            label: 'Medical',
            value: 'medical',
            hasAccess: ({ hasPermission }) =>
              hasPermission('ps:1:wellbeing:read_student_medical'),
          },
          {
            label: t('people:notes'),
            value: 'notes',
            hasAccess: ({ hasPermission }) =>
              hasPermission('ps:1:notes:read_notes'),
          },
        ]}
      />
    </PageContainer>
  );
}
