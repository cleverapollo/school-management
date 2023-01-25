import { List, Stack } from '@mui/material';
import { NavSectionProps } from '../types';
import { StyledSubheader } from './styles';
import NavList from './NavList';

export default function NavSectionVertical({
  data,
  sx,
  ...other
}: NavSectionProps) {
  return (
    <Stack sx={sx} {...other}>
      {data.map((group) => {
        const key = group.subheader;

        return (
          <List key={key} disablePadding sx={{ px: 2 }}>
            {group.subheader && (
              <StyledSubheader disableSticky>{group.subheader}</StyledSubheader>
            )}

            {group.children.map((list) => (
              <NavList
                key={`${list.title}${list.path ?? ''}`}
                data={list}
                depth={1}
              />
            ))}
          </List>
        );
      })}
    </Stack>
  );
}
