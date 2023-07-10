import { PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Box } from '@mui/material';
import { useLocation } from 'react-router';
import { LoadingButton } from '@mui/lab';
import { SyncIcon } from '@tyro/icons';
import { useSyncFromPpodQuery } from '../../api/ppod/sync-data';
import SyncContainer from '../../components/ppod/sync-container';

export default function Container() {
  const { t } = useTranslation(['common', 'settings']);
  const { mutateAsync: syncFromPpod, isLoading } = useSyncFromPpodQuery();

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
                onClick={() => syncFromPpod()}
                loading={isLoading}
                startIcon={<SyncIcon />}
              >
                {t('settings:ppodSync.syncFromPpod')}
              </LoadingButton>
            </Box>
          )
        }
      />
      <SyncContainer />
    </PageContainer>
  );
}
