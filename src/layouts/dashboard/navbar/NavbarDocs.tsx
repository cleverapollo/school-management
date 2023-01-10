// @mui
import { Stack, Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from '@tyro/i18n';

// ----------------------------------------------------------------------

export default function NavbarDocs() {
  const { t } = useTranslation(['authentication']);
  return (
    <Stack
      spacing={3}
      sx={{ pb: 5, mt: 10, width: 1, display: 'block' }}
    >

      <Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          {t('authentication:need_help')}
          <br /> 
          {t('authentication:check_help')}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Button variant="contained" sx={{ margin: 'auto'}}>{t('authentication:help_guides')}</Button>
      </Box>
    </Stack>
  );
}
