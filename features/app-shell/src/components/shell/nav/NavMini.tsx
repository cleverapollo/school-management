import { Stack, Box } from '@mui/material';
import { useUser } from '@tyro/api';
import { Avatar } from '@tyro/core';
import { NAV } from './config';
import { NavSectionMini } from './nav-section';
import { NavigationConfig } from '../../../hooks/use-navigation-config';
import { ExpandButton } from './expanding-button';
import { Logo } from '../../logo';

interface NavMiniProps {
  onExpand: VoidFunction;
  navConfig: NavigationConfig;
}

export default function NavMini({ onExpand, navConfig }: NavMiniProps) {
  const { activeProfile } = useUser();

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD_MINI },
        zIndex: 'drawer',
      }}
    >
      <ExpandButton isExpanded={false} onClick={onExpand} />
      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_DASHBOARD_MINI,
          borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          overflowX: 'scroll',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {activeProfile?.tenant?.imgUrl ? (
          <Avatar
            name={activeProfile.tenant?.name}
            src={activeProfile.tenant.imgUrl}
            size={50}
            sx={{
              mx: 'auto',
              my: 2,
            }}
          />
        ) : (
          <Logo sx={{ mx: 'auto', my: 2, width: 50 }} />
        )}

        <NavSectionMini data={navConfig} />
      </Stack>
    </Box>
  );
}
