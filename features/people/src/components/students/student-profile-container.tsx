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
            label: 'Overview',
            value: t('common:overview'),
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
          },
          {
            label: t('people:behaviour'),
            value: 'behaviour',
          },
          {
            label: 'AEN',
            value: 'aen',
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
    </PageContainer>
  );
}
