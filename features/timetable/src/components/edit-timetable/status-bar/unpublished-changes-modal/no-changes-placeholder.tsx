import { Box, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';

export function NoChangesPlaceholder() {
  const { t } = useTranslation(['common']);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 2,
        border: '1px solid transparent',
      }}
    >
      <Typography
        component="span"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        {t('common:noChangesMade')}
      </Typography>
    </Box>
  );
}
