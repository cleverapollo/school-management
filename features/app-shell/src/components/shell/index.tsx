/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Box } from '@mui/material';
import { useDisclosure, useResponsive } from '@tyro/core';
import { ScrollRestoration } from 'react-router-dom';
import { HEADER as HEADERCONFIG, NAV } from './nav/config';

import { Header } from './header';
import NavMini from './nav/NavMini';
import NavVertical from './nav/NavVertical';
import { useNavigationConfig } from '../../hooks/use-navigation-config';

interface ShellProps {
  children?: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const isDesktop = useResponsive('up', 'lg');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isExpanded,
    onOpen: onExpand,
    onClose: onCollapse,
  } = useDisclosure({ defaultIsOpen: true });
  const navConfig = useNavigationConfig();

  return (
    <>
      <Header isNavExpanded={isExpanded} onOpenNav={onOpen} />

      <Box
        sx={{
          display: 'flex',
        }}
      >
        {isDesktop && !isExpanded ? (
          <NavMini onExpand={onExpand} navConfig={navConfig} />
        ) : (
          <NavVertical
            navConfig={navConfig}
            openNav={isOpen}
            onCollapse={onCollapse}
            onCloseNav={onClose}
          />
        )}

        <Box
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: 'background.neutral',
            minHeight: '100vh',
            pt: `${HEADERCONFIG.H_MOBILE + 8}px`,
            ...(isDesktop && {
              pt: `${HEADERCONFIG.H_DASHBOARD_DESKTOP + 8}px`,
              width: `calc(100% - ${NAV.W_DASHBOARD}px)`,
              ...(!isExpanded && {
                width: `calc(100% - ${NAV.W_DASHBOARD_MINI}px)`,
              }),
            }),
            ...(!isDesktop && { width: '100%' }),
          }}
        >
          {children}
          <ScrollRestoration />
        </Box>
      </Box>
    </>
  );
}
