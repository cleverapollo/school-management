import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, Stack, Drawer } from '@mui/material';
// hooks
import { useResponsive, Scrollbar, Avatar } from '@tyro/core';
import { useUser } from '@tyro/api';
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
  const { activeProfile } = useUser();

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
            pb: activeProfile?.tenant?.imgUrl ? 1 : 2,
            px: 2.5,
            flexShrink: 0,
          }}
        >
          {activeProfile?.tenant?.imgUrl ? (
            <Avatar
              name={activeProfile.tenant?.name}
              src={activeProfile.tenant.imgUrl}
              size={78}
            />
          ) : (
            <Logo />
          )}
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
