import { Outlet, useParams } from 'react-router-dom';
import { useNumber, usePreferredNameLayout, PageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useStudent } from '../../api/students';
import { StudentOverviewBar } from './student-overview-bar';

export default function StudentProfileContainer() {
  const { t } = useTranslation(['common', 'people']);

  const { id } = useParams();
  const idNumber = useNumber(id);
  const { data: studentData } = useStudent(idNumber);

  const { displayName } = usePreferredNameLayout();

  const userProfileName = t('people:usersProfile', {
    name: displayName(studentData?.person),
  });

  return (
    <PageContainer title={userProfileName}>
      <PageContainer.Header
        title={userProfileName}
        breadcrumbs={{
          links: [
            {
              name: t('people:students'),
              href: './..',
            },
            {
              name: userProfileName,
            },
          ],
        }}
      >
        <StudentOverviewBar studentId={idNumber} />
        <PageContainer.TabNavigation
          links={[
            {
              label: 'Overview',
              value: 'overview',
            },
            {
              label: t('people:personal.title'),
              value: 'personal',
            },
            {
              label: t('people:contacts'),
              value: 'contacts',
            },
            {
              label: t('common:attendance'),
              value: 'attendance',
            },
            {
              label: 'Fees',
              value: 'fees',
            },
            {
              label: 'Assessment',
              value: 'assessment',
            },
            {
              label: 'Timetable',
              value: 'timetable',
            },
            {
              label: 'Well-being',
              value: 'well-being',
            },
            {
              label: 'SEN',
              value: 'sen',
            },
            {
              label: 'Classes',
              value: 'classes',
            },
            {
              label: 'Settings',
              value: 'settings',
            },
          ]}
        />
      </PageContainer.Header>
      <PageContainer.Content>
        <Outlet />
      </PageContainer.Content>
    </PageContainer>
  );
}
