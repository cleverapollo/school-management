import { Box, BoxProps } from '@mui/material';

export function SearchListboxContainer({ children }: BoxProps) {
  return (
    <Box
      component="ul"
      role="listbox"
      sx={{
        p: 0,
        my: 0,
        '&, & ul': {
          listStyle: 'none',
          px: 0,
        },
      }}
    >
      {children}
    </Box>
  );
}
