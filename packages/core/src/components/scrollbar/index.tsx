import { memo } from 'react';
import { Box, SxProps, Theme, alpha } from '@mui/material';
import SimpleBar, { Props } from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export interface ScrollbarProps extends Props {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

function InnerScrollbar({ children, sx, ...other }: ScrollbarProps) {
  const userAgent =
    typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        component={SimpleBar}
        clickOnTrack={false}
        sx={{
          maxHeight: '100%',
          '& .simplebar-scrollbar': {
            '&:before': {
              backgroundColor: (theme) => alpha(theme.palette.grey[600], 0.48),
            },
            '&.simplebar-visible:before': {
              opacity: 1,
            },
          },
          '& .simplebar-track.simplebar-vertical': {
            width: 10,
          },
          '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
            height: 6,
          },
          '& .simplebar-mask': {
            zIndex: 'inherit',
          },
        }}
        {...other}
      >
        {children}
      </Box>
    </Box>
  );
}

export const Scrollbar = memo(InnerScrollbar);
