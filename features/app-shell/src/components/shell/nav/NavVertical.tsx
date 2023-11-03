import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, Stack, Drawer } from '@mui/material';
// hooks
import { useResponsive, Scrollbar } from '@tyro/core';
import { NAV } from './config';
// components
import { Logo } from '../../logo';
import { NavSectionVertical } from './nav-section';

import { NavigationConfig } from '../../../hooks/use-navigation-config';
import { ExpandButton } from './expanding-button';

type NavVerticalProps = {
  navConfig: NavigationConfig;
  openNav: boolean;
  onCloseNav: VoidFunction;
  onCollapse: VoidFunction;
};

export default function NavVertical({
  navConfig,
  openNav,
  onCloseNav,
  onCollapse,
}: NavVerticalProps) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <>
      {isDesktop && <ExpandButton isExpanded onClick={onCollapse} />}
      <Scrollbar
        sx={{
          height: 1,
          '& .simplebar-content': {
            height: 1,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack
          spacing={3}
          sx={{
            pt: 3,
            pb: 2,
            px: 2.5,
            flexShrink: 0,
          }}
        >
          <Logo />
        </Stack>

        <NavSectionVertical data={navConfig} />
      </Scrollbar>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
              borderRightStyle: 'solid',
              backgroundColor: 'slate.50',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
