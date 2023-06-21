import { PageContainer, PageHeading, TabPageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Box } from '@mui/material';
import { useLocation } from 'react-router';
import { LoadingButton } from '@mui/lab';
import { SyncIcon } from '@tyro/icons';
import { useSyncFromPpodQuery } from '../../api/ppod/sync-data';

export default function SyncContainer() {
  const { t } = useTranslation(['common', 'settings']);
  const { refetch, isFetching } = useSyncFromPpodQuery();

  const currentUrl = useLocation();
  const showSyncFromPpodButton =
    !currentUrl.pathname.includes('sync-data/details');

  return (
    <PageContainer title={t('settings:ppodSync.title')}>
      <PageHeading
        title={t('settings:ppod')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          showSyncFromPpodButton && (
            <Box display="flex" alignItems="center">
              <LoadingButton
                variant="contained"
                startIcon={<SyncIcon />}
                onClick={() => refetch()}
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
    </PageContainer>
  );
}
