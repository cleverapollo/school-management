import { memo } from 'react';
import { Box, Stack } from '@mui/material';
//
import { NavSectionProps } from '../types';
import NavList from './NavList';
import { NavigationRootGroup } from '../../../../../hooks/use-navigation-config';

// ----------------------------------------------------------------------

function NavSectionMini({ data, sx, ...other }: NavSectionProps) {
  return (
    <Stack
      spacing={0.5}
      alignItems="center"
      sx={{
        px: 0.75,
        ...sx,
      }}
      {...other}
    >
      {data.map((group) => (
        <Items key={group.subheader} items={group.children} />
      ))}
    </Stack>
  );
}

export default memo(NavSectionMini);

// ----------------------------------------------------------------------

type ItemsProps = {
  items: NavigationRootGroup[];
};

function Items({ items }: ItemsProps) {
  return (
    <>
      {items.map((list) => (
        <NavList
          key={`${list.title}${list.path ?? ''}`}
          data={list}
          depth={1}
        />
      ))}

      <Box
        sx={{
          width: 24,
          height: '1px',
          bgcolor: 'divider',
          my: '8px !important',
        }}
      />
    </>
  );
}
