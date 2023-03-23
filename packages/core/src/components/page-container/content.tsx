import { Box, Container, CircularProgress } from '@mui/material';
import { PropsWithChildren } from 'react';
import { LazyLoader } from '../lazy-loader';

type ContentProps = PropsWithChildren<unknown>;

export const Content = ({ children }: ContentProps) => (
  <Container maxWidth="xl">
    <LazyLoader
      fallback={
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      {children}
    </LazyLoader>
  </Container>
);
