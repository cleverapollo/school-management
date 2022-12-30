import { Helmet } from 'react-helmet-async';
import { forwardRef, ReactNode } from 'react';
// @mui
import { Box, BoxProps } from '@mui/material';
import LoadingScreen from './LoadingScreen';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
  isLoading?: boolean;
}

const Page = forwardRef<HTMLDivElement, Props>(({ children, title = '', meta, isLoading = false, ...other }, ref) =>
  isLoading
    ? <LoadingScreen />
    : <>
      <Helmet>
        <title>{`${title} | Tyro`}</title>
        {meta}
      </Helmet>

      <Box ref={ref} {...other}>
        {children}
      </Box>
    </>
);

export default Page;
