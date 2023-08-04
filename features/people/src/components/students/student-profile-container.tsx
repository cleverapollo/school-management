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
import { PermissionUtils } from '@tyro/api';
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
            label: 'Overview',
            value: t('common:overview'),
            hasAccess: (permissions: PermissionUtils) =>
              permissions.isStaffUser,
          },
          {
            label: t('people:personal.title'),
            value: 'personal',
            hasAccess: (permissions: PermissionUtils) =>
              permissions.isStaffUser,
          },
          {
            label: t('people:contacts'),
            value: 'contacts',
            hasAccess: (permissions: PermissionUtils) =>
              permissions.isStaffUser,
          },
          {
            label: t('common:attendance'),
            value: 'attendance',
          },
          // NOTE: temporary hide this tab
          // {
          //   label: 'Fees',
          //   value: 'fees',
          // },
          {
            label: 'Assessment',
            value: 'assessment',
          },
          {
            label: 'Timetable',
            value: 'timetable',
            hasAccess: (permissions: PermissionUtils) =>
              permissions.hasAtLeastOnePermission([
                'ps:1:calendar:view_own_calendar',
                'ps:1:calendar:view_calendar',
              ]),
          },
          {
            label: t('people:behaviour'),
            value: 'behaviour',
            hasAccess: (permissions: PermissionUtils) =>
              permissions.isStaffUser,
          },
          {
            label: 'AEN',
            value: 'aen',
            hasAccess: (permissions: PermissionUtils) =>
              permissions.isStaffUser,
          },
          {
            label: 'Classes',
            value: 'classes',
            hasAccess: (permissions: PermissionUtils) =>
              permissions.hasPermission('ps:1:groups:student_view_groups'),
          },
          {
            label: 'Settings',
            value: 'settings',
            hasAccess: (permissions: PermissionUtils) => permissions.isTyroUser,
          },
          {
            label: 'Medical',
            value: 'medical',
          },
        ]}
      />
    </PageContainer>
  );
}
