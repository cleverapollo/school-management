// @mui
import { Stack, Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
// assets
import { DocIllustration } from '../../../assets';

// ----------------------------------------------------------------------

export default function NavbarDocs() {
  return (
    <Stack
      spacing={3}
      sx={{ pb: 5, mt: 10, width: 1, display: 'block' }}
    >

      <Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Need help, Clodagh?
          <br /> Please check our help guides
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Button variant="contained" sx={{ margin: 'auto'}}>Help Guides</Button>
      </Box>
    </Stack>
  );
}
