import { Box, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { UploadIllustration } from '../../illustrations';
import { PlaceholderCard } from '../placeholder-card';

export function ProcessingDataPlaceholder() {
  const { t } = useTranslation(['common']);

  return (
    <PlaceholderCard>
      <UploadIllustration sx={{ maxWidth: 216 }} />
      <Box>
        <Typography component="h2" variant="h5">
          {t('common:launchingSoon')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('common:wellEmailWhenLive')}
        </Typography>
      </Box>
    </PlaceholderCard>
  );
}
