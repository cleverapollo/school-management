// @mui
import { Box, Tooltip, ListItemButtonProps, Typography } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// guards
import PermissionBasedGuard from '../../../guards/PermissionBasedGuard';
//
import Iconify from '../../Iconify';
//
import { NavItemProps } from '../type';
import { ListItemStyle, ListItemTextStyle, ListItemIconStyle } from './style';
import { UnreadCountFilter, useUser } from '@tyro/api';
import { useUnreadCount } from '../../../features/mail/api/labels';

// ----------------------------------------------------------------------

type Props = NavItemProps & ListItemButtonProps;

export default function NavItem({ item, depth, active, open, isCollapse, ...other }: Props) {
  const { translate } = useLocales();
  const { user } = useUser();
  const filter: UnreadCountFilter = {
    personPartyId: user?.profiles && user?.profiles[0].partyId,
  }

  const { data: unreadCountData } = useUnreadCount(filter);

  let totalUnreadCount = 0;
  unreadCountData?.forEach(item => {
    if(item?.count && item.labelId === 1) { 
      totalUnreadCount += item?.count 
    }
  });

  const { title, icon, info, children, disabled, caption, permissions } = item;

  const renderContent = (
    <ListItemStyle depth={depth} active={active} disabled={disabled} {...other}>
      {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}

      {depth !== 1 && <DotIcon active={active && depth !== 1} />}

      <ListItemTextStyle
        isCollapse={isCollapse}
        primary={translate(title)}
        secondary={
          caption && (
            <Tooltip title={translate(caption)} placement="top-start">
              <span>{translate(caption)}</span>
            </Tooltip>
          )
        }
        primaryTypographyProps={{
          noWrap: true,
          variant: active ? 'subtitle2' : 'body2',
        }}
        secondaryTypographyProps={{
          noWrap: true,
          variant: 'caption',
        }}
      />

      {title === 'mail' && totalUnreadCount > 0 && <Box sx={{ padding: '1px 8px', background: '#FFE7D9', color: '#B72136', borderRadius: '6px'}}>{totalUnreadCount}</Box>}

      {!isCollapse && (
        <>
          {info && (
            <Box component="span" sx={{ lineHeight: 0 }}>
              {info}
            </Box>
          )}

          {!!children && (
            <Iconify
              icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
              sx={{ width: 16, height: 16, ml: 1, flexShrink: 0 }}
            />
          )}
        </>
      )}
    </ListItemStyle>
  );

  return <PermissionBasedGuard permissions={permissions}>{renderContent}</PermissionBasedGuard>;
}

// ----------------------------------------------------------------------

type DotIconProps = {
  active: boolean;
};

export function DotIcon({ active }: DotIconProps) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.disabled',
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
            }),
          ...(active && {
            transform: 'scale(2)',
            bgcolor: 'primary.main',
          }),
        }}
      />
    </ListItemIconStyle>
  );
}
