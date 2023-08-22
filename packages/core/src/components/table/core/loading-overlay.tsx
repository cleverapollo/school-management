import { Box, CircularProgress } from '@mui/material';

export function TableLoadingOverlay() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
