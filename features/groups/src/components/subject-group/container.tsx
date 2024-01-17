import { useParams } from 'react-router-dom';
import { useNumber, Page, PageHeading, TabPageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Container } from '@mui/material';
import { SubjectGroupStatusBar } from './status-bar';
import { useSubjectGroupById } from '../../api/subject-groups';

export default function SubjectGroupContainer() {
  const { t } = useTranslation(['groups', 'common', 'people']);

  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  const subjectGroupName = t('groups:subjectGroupsProfile', {
    name: subjectGroupData?.name,
  });

  return (
    <Page title={subjectGroupName}>
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pb: 3,
        }}
      >
        <PageHeading
          title={subjectGroupName}
          breadcrumbs={{
            links: [
              {
                name: t('groups:subjectGroups'),
                href: './..',
              },
              {
                name: subjectGroupName,
              },
            ],
          }}
        />
        <SubjectGroupStatusBar groupId={groupIdNumber} />
        <TabPageContainer
          links={[
            {
              value: 'students',
              label: t('common:students'),
            },
            {
              value: 'attendance',
              label: t('common:attendance'),
            },
            {
              value: 'timetable',
              label: t('common:timetable'),
            },
            {
              value: 'behaviour',
              label: t('people:behaviour'),
            },
          ]}
        />
      </Container>
    </Page>
  );
}
