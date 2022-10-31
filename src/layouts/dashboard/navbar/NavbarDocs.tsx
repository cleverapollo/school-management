// @mui
import { Stack, Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
// assets
import { DocIllustration } from '../../../assets';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function NavbarDocs() {
  const { translate } = useLocales();
  return (
    <Stack
      spacing={3}
      sx={{ pb: 5, mt: 10, width: 1, display: 'block' }}
    >

      <Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          {translate('need_help')}
          <br /> 
          {translate('check_help')}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Button variant="contained" sx={{ margin: 'auto'}}>{translate('help_guides')}</Button>
      </Box>
    </Stack>
  );
}
