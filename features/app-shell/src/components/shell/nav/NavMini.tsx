/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Stack, Box } from '@mui/material';
import { NAV } from './config';
import { hideScrollbarX } from '../../../../../../src/utils/cssStyles';
import { NavSectionMini } from './nav-section';
import { NavigationConfig } from '../../../hooks/use-navigation-config';
import { ExpandButton } from './expanding-button';
import { Logo } from '../../logo';

interface NavMiniProps {
  onExpand: VoidFunction;
  navConfig: NavigationConfig;
}

export default function NavMini({ onExpand, navConfig }: NavMiniProps) {
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
          ...hideScrollbarX,
        }}
      >
        <Logo sx={{ mx: 'auto', my: 2, width: 50 }} />

        <NavSectionMini data={navConfig} />
      </Stack>
    </Box>
  );
}
