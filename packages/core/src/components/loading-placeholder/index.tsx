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
        position: 'absolute',
        ...sx,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export function LoadingPlaceholderContainer({
  children,
  isLoading,
  ...props
}: BoxProps & { isLoading: boolean; children: JSX.Element }) {
  return isLoading ? <LoadingPlaceholder {...props} /> : children;
}
