import { useParams } from 'react-router-dom';
import { useNumber, Page, PageHeading, TabPageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Container } from '@mui/material';
import { CustomGroupStatusBar } from './status-bar';
import { useCustomGroupDefinition } from '../../api';

export default function SupportGroupContainer() {
  const { t } = useTranslation(['groups', 'common']);

  const { groupId } = useParams();
  const partyId = useNumber(groupId) ?? 0;

  const { data: customGroupData } = useCustomGroupDefinition({ partyId });

  const customGroupName = t('groups:subjectGroupsProfile', {
    name: customGroupData?.name,
  });

  return (
    <Page title={customGroupName}>
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
          title={customGroupName}
          breadcrumbs={{
            links: [
              {
                name: t('groups:customGroups'),
                href: './..',
              },
              {
                name: customGroupName,
              },
            ],
          }}
        />
        <CustomGroupStatusBar partyId={partyId} />
        <TabPageContainer
          links={[
            {
              value: 'students',
              label: t('common:students'),
            },
            {
              value: 'staff',
              label: t('common:staff'),
            },
            {
              value: 'attendance',
              label: t('common:attendance'),
            },
            {
              value: 'timetable',
              label: t('common:timetable'),
            },
          ]}
        />
      </Container>
    </Page>
  );
}
