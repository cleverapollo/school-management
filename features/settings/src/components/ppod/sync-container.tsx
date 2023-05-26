import { useState } from 'react';
import { Page, PageHeading, TabPageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Box, Container } from '@mui/material';
import { useLocation } from 'react-router';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LoadingButton } from '@mui/lab';
import { useSyncFromPpodQuery } from '../../api/ppod';

export default function SyncContainer() {
  const { t } = useTranslation(['common', 'settings']);
  const { refetch, isFetching } = useSyncFromPpodQuery();

  const currentUrl = useLocation();

  return (
    <Page title="PPOD">
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <PageHeading
          title={t('settings:ppod')}
          titleProps={{ variant: 'h3' }}
          rightAdornment={
            !currentUrl?.pathname?.includes('details') && (
              <Box display="flex" alignItems="center">
                <LoadingButton
                  variant="contained"
                  size="large"
                  onClick={() => {
                    refetch();
                  }}
                  loading={isFetching}
                >
                  {t('settings:ppodSync.syncFromPpod')}
                </LoadingButton>
              </Box>
            )
          }
        />

        <TabPageContainer
          links={[
            {
              label: t('settings:sync'),
              value: 'sync',
            },
            {
              label: t('settings:schoolDetails.title'),
              value: 'details',
            },
          ]}
        />
      </Container>
    </Page>
  );
}
