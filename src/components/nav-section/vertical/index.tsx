// @mui
import {List, Box} from '@mui/material';
// hooks
import { useTranslation } from '@tyro/i18n';
//
import {NavSectionProps} from '../type';
import {ListSubheaderStyle} from './style';
import NavList from './NavList';
import PermissionBasedGuard from "../../../guards/PermissionBasedGuard";

// ----------------------------------------------------------------------

export default function NavSectionVertical({ navConfig, isCollapse, profileTypeName, ...other }: NavSectionProps) {
  const { t } = useTranslation();

  return (
    <Box {...other}>
      {navConfig.map((group) => (
        <PermissionBasedGuard permissions={group.permissions} key={group.id}>
          <List disablePadding sx={{px: 2}}>
            <ListSubheaderStyle
              sx={{
                ...(isCollapse && {
                  opacity: 0,
                }),
              }}
            >
              {t(group.subheader)}
            </ListSubheaderStyle>

            {group.items.map((list) => (
              <NavList
                key={list.title + list.path}
                data={list}
                depth={1}
                hasChildren={!!list.children}
                isCollapse={isCollapse}
              />
            ))}
          </List>
        </PermissionBasedGuard>
      ))}
    </Box>
  );
}
