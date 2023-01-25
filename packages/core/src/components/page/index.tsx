import { useTitle } from 'react-use';
import { forwardRef, ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';
import { LoadingScreen } from '../lazy-loader/loading-screen';

export interface PageProps extends BoxProps {
  children: ReactNode;
  title: string;
  isLoading?: boolean;
}

export const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = '', isLoading = false, ...props }, ref) => {
    useTitle(`${title} | Tyro`);

    return isLoading ? (
      <LoadingScreen />
    ) : (
      <Box ref={ref} {...props}>
        {children}
      </Box>
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  Page.displayName = 'Page';
}
