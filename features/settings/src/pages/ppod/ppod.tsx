import { PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Box } from '@mui/material';
import { useLocation } from 'react-router';
import { LoadingButton } from '@mui/lab';
import { useSyncFromPpodQuery } from '../../api/ppod/sync-data';
import { usePpodCredentialsStatus } from '../../api/ppod/ppod-credentials-status';
import SyncContainer from '../../components/ppod/sync-container';
import Login from './login';

export default function Container() {
  const { t } = useTranslation(['common', 'settings']);
  const { refetch, isFetching } = useSyncFromPpodQuery();

  const currentUrl = useLocation();

  const showSyncFromPpodButton =
    !currentUrl.pathname.includes('sync-data/details');

  const { data: ppodCredentialsStatus } = usePpodCredentialsStatus();

  return ppodCredentialsStatus ? (
    <PageContainer title={t('settings:ppodSync.title')}>
      <PageHeading
        title={t('settings:ppod')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          showSyncFromPpodButton && (
            <Box display="flex" alignItems="center">
              <LoadingButton
                variant="contained"
                size="large"
                onClick={() => refetch()}
                loading={isFetching}
              >
                {t('settings:ppodSync.syncFromPpod')}
              </LoadingButton>
            </Box>
          )
        }
      />
      <SyncContainer />
    </PageContainer>
  ) : (
    <Login />
  );
}
