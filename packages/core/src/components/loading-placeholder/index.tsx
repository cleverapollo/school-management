import { Box, BoxProps, CircularProgress } from '@mui/material';

export function LoadingPlaceholder({ sx, ...props }: BoxProps) {
  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        ...sx,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
