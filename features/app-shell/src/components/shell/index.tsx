import { Box } from '@mui/material';
import { useDisclosure, useResponsive } from '@tyro/core';
import { ScrollRestoration } from 'react-router-dom';
import { MailSettingsProvider } from '@tyro/mail';
import { HEADER as HEADERCONFIG, NAV } from './nav/config';

import { Header } from './header';
import NavMini from './nav/NavMini';
import NavVertical from './nav/NavVertical';
import { useNavigationConfig } from '../../hooks/use-navigation-config';
import { AppShellConfigProvider, useAppShellConfig } from './provider';

interface ShellProps {
  children?: React.ReactNode;
}

function InnerShell({ children }: ShellProps) {
  const isDesktop = useResponsive('up', 'lg');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navConfig = useNavigationConfig();
  const { isNavExpanded, onNavExpand, onNavCollapse } = useAppShellConfig();

  return (
    <>
      <Header isNavExpanded={isNavExpanded} onOpenNav={onOpen} />

      <Box
        sx={{
          display: 'flex',
        }}
      >
        {isDesktop && !isNavExpanded ? (
          <NavMini onExpand={onNavExpand} navConfig={navConfig} />
        ) : (
          <NavVertical
            navConfig={navConfig}
            openNav={isOpen}
            onCollapse={onNavCollapse}
            onCloseNav={onClose}
          />
        )}

        <Box
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: 'slate.100',
            minHeight: '100vh',
            pt: `${HEADERCONFIG.H_MOBILE + 8}px`,
            ...(isDesktop && {
              pt: `${HEADERCONFIG.H_DASHBOARD_DESKTOP + 8}px`,
              width: `calc(100% - ${NAV.W_DASHBOARD}px)`,
              ...(!isNavExpanded && {
                width: `calc(100% - ${NAV.W_DASHBOARD_MINI}px)`,
              }),
            }),
            ...(!isDesktop && {
              width: '100%',
            }),
          }}
        >
          {children}
          <ScrollRestoration />
        </Box>
      </Box>
    </>
  );
}

export function Shell({ children }: ShellProps) {
  return (
    <AppShellConfigProvider>
      <MailSettingsProvider>
        <InnerShell>{children}</InnerShell>
      </MailSettingsProvider>
    </AppShellConfigProvider>
  );
}
