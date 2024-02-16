import { Card, Stack, Typography } from '@mui/material';
import {
  PageHeading,
  TabPageContainer,
  PageContainer,
  ComingSoonIllustration,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useTimetable } from '../api/common/timetable';
import { EditTimetableStatusBar } from './edit-timetable/status-bar';

export default function EditTimetableContainer() {
  const { t } = useTranslation(['common', 'navigation', 'groups', 'timetable']);
  const { data: liveTimetable } = useTimetable({ liveTimetable: true });

  return (
    <PageContainer
      title={t('navigation:management.timetable.editTimetable')}
      maxWidth={false}
      sx={{ maxWidth: 1980 }}
    >
      <PageHeading title={t('navigation:management.timetable.editTimetable')} />
      <EditTimetableStatusBar />
      {liveTimetable ? (
        <TabPageContainer
          links={[
            {
              label: t('common:timetable'),
              value: 'timetable',
            },
            {
              label: t('groups:subjectGroups'),
              value: 'subject-groups',
            },
          ]}
        />
      ) : (
        <Card sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Stack
            spacing={4}
            justifyContent="center"
            alignItems="center"
            my={10}
            mx={4}
          >
            <ComingSoonIllustration
              sx={{
                width: '100%',
                maxWidth: 320,
              }}
            />
            <Typography component="h2" variant="subtitle1" textAlign="center">
              {t('timetable:noTimetablePublishedForYear')}
            </Typography>
          </Stack>
        </Card>
      )}
    </PageContainer>
  );
}
