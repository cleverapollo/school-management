import { useParams } from 'react-router-dom';
import {
  useNumber,
  usePreferredNameLayout,
  PageHeading,
  Page,
  TabPageContainer,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Container } from '@mui/material';
import { useStudent } from '../../api/student/students';
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
    <Page title={userProfileName}>
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
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
            // NOTE: hide temporary this tab
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
      </Container>
    </Page>
  );
}
