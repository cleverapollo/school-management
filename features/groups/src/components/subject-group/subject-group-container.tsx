import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { Outlet, useParams } from 'react-router-dom';
import { Page, LazyLoader, useNumber, Breadcrumbs } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { SubjectGroupStatusBar } from './subject-group-status-bar';
import { useSubjectGroupById } from '../../api/subject-groups';

export default function SubjectGroupContainer() {
  const { t } = useTranslation(['groups']);

  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);
  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  const subjectGroupName = t('groups:subjectGroupsProfile', {
    name: subjectGroupData?.name,
  });

  return (
    <Page title={subjectGroupName} sx={{ px: 0 }}>
      <Box sx={{ px: 2 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" component="h1">
            {subjectGroupName}
          </Typography>
          <Breadcrumbs
            links={[
              {
                name: t('groups:subjectGroups'),
                href: './..',
              },
              {
                name: subjectGroupName,
              },
            ]}
          />
          <SubjectGroupStatusBar groupId={groupIdNumber} />
        </Container>
      </Box>
      <Box
        sx={{
          px: 2,
        }}
      >
        <Container maxWidth="xl">
          <LazyLoader
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <Outlet />
          </LazyLoader>
        </Container>
      </Box>
    </Page>
  );
}
