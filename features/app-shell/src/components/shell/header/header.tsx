/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useMemo } from 'react';
import {
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  alpha,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
// hooks
import { HamburgerMenuIcon } from '@tyro/icons';
import { AcademicNamespaceSessionSwitcher } from '@tyro/settings';
import { useResponsive } from '@tyro/core';
import {
  checkIsUserEmulated,
  removeEmulationHeaders,
  usePermissions,
  UserType,
  useUser,
} from '@tyro/api';
import { MailLinkWithCount } from '@tyro/mail';
import useOffSetTop from '../../../../../../src/hooks/useOffSetTop';
// config
import { HEADER, NAV } from '../nav/config';
import Searchbar from '../../search';
import AccountPopover from './account-popover';
import NotificationsPopover from './notifications-popover';

type Props = {
  isNavExpanded: boolean;
  onOpenNav?: VoidFunction;
};

export function Header({ isNavExpanded, onOpenNav }: Props) {
  const { activeProfile } = useUser();
  const queryClient = useQueryClient();
  const { userType } = usePermissions();

  const isEmulating = useMemo(() => checkIsUserEmulated(), [activeProfile]);

  const isDesktop = useResponsive('up', 'lg');

  const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP);

  const renderContent = (
    <>
      {!isDesktop && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1, color: 'text.primary' }}>
          <HamburgerMenuIcon />
        </IconButton>
      )}

      <Searchbar />

      {isEmulating && (
        <Button
          onClick={() => {
            removeEmulationHeaders();
            queryClient.invalidateQueries();
          }}
          sx={{ ml: 1 }}
        >
          Stop emulation
        </Button>
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        <AcademicNamespaceSessionSwitcher />
        {userType !== UserType.Tyro && (
          <>
            <MailLinkWithCount />
            <NotificationsPopover />
          </>
        )}
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={(theme) => ({
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        backgroundColor: theme.isLight
          ? alpha(theme.palette.background.neutral, 0.72)
          : theme.palette.background.neutral,
        backdropFilter: 'blur(10px)',
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(isDesktop && {
          width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
          height: HEADER.H_DASHBOARD_DESKTOP,
          ...(isOffset && {
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
          }),
          ...(!isNavExpanded && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
          }),
        }),
      })}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
