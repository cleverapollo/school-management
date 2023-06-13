import { Box, Card, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { UploadIllustration } from '../../illustrations';

export function ProcessingDataPlaceholder() {
  const { t } = useTranslation(['common']);

  return (
    <Card sx={{ p: 3 }}>
      <Box
        sx={({ palette }) => ({
          backgroundColor: 'slate.50',
          border: `1px dashed ${palette.divider}`,
          borderRadius: 1,
        })}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={4}
          flexWrap="wrap"
          p={4}
        >
          <UploadIllustration sx={{ maxWidth: 216 }} />
          <Box>
            <Typography component="h2" variant="h5">
              {t('common:launchingSoon')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('common:wellEmailWhenLive')}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}
