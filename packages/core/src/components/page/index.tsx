import { useTitle } from 'react-use';
import { forwardRef, ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';
import { LoadingScreen } from '../lazy-loader/loading-screen';
import { useResponsive } from '../../hooks';

export interface PageProps extends BoxProps {
  children: ReactNode;
  title: string;
  isLoading?: boolean;
}

export const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = '', isLoading = false, sx, ...props }, ref) => {
    useTitle(`${title} | Tyro`);
    const isDesktop = useResponsive('up', 'lg');

    return isLoading ? (
      <LoadingScreen />
    ) : (
      <Box
        ref={ref}
        className="tyro-page"
        sx={{
          ...(isDesktop && {
            px: 2,
          }),
          pb: 4,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          '&:has(.bulk-edit-save-bar)': {
            pb: 12,
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  Page.displayName = 'Page';
}
