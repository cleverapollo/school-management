import { Box, CircularProgress } from '@mui/material';

export function LoadingPlaceholder() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        width: '80vw',
        maxWidth: 620,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
