import { PageHeading, Page, TabPageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Box } from '@mui/material';
import { useContainerMargin } from '../hooks/use-container-margin';

export default function ClassListManagerContainer() {
  const { t } = useTranslation(['navigation', 'classListManager']);
  const containerMargin = useContainerMargin();

  return (
    <Page title={t('navigation:management.classListManager')} sx={{ px: 0 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <PageHeading
          title={t('navigation:management.classListManager')}
          sx={{ px: containerMargin }}
        />
        <TabPageContainer
          TabProps={{
            sx: {
              px: containerMargin,
            },
          }}
          links={[
            {
              label: t('classListManager:classes'),
              value: 'classes',
            },
            {
              label: t('classListManager:blocks'),
              value: 'blocks',
            },
          ]}
        />
      </Box>
    </Page>
  );
}
