import { MenuItem, styled, Tooltip } from '@mui/material';
import { Link, LinkProps } from 'react-router-dom';
import { PermissionUtils } from '@tyro/api';

export interface MenuItemConfig {
  label: string;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  navigateTo?: LinkProps['to'];
  disabled?: boolean;
  disabledTooltip?: string;
  hasAccess?: (permissions: PermissionUtils) => boolean;
}

interface MenuItemListProps {
  menuItems: MenuItemConfig[];
  onClose: () => void;
  permissions: PermissionUtils;
}

export const ActionMenuIconWrapper = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginRight: 6,
  marginLeft: -2,
  display: 'inline-flex',
  alignItems: 'center',
  '& svg': {
    width: 20,
    height: 20,
  },
}));

export function getMenuItemList({
  menuItems,
  permissions,
  onClose,
}: MenuItemListProps) {
  return menuItems
    .filter((menuItem) => menuItem.hasAccess?.(permissions) ?? true)
    .map(
      (
        { label, icon, navigateTo, onClick, disabled, disabledTooltip },
        index
      ) => {
        const Item = (
          <MenuItem
            key={`${label}-${index}`}
            {...(navigateTo
              ? {
                  component: Link,
                  to: navigateTo,
                }
              : {
                  onClick: (e: React.MouseEvent) => {
                    onClick?.(e);
                    onClose();
                  },
                })}
            disabled={disabled}
            title={disabledTooltip}
            sx={{
              fontSize: '0.875rem',
            }}
          >
            {icon && <ActionMenuIconWrapper>{icon}</ActionMenuIconWrapper>}{' '}
            {label}
          </MenuItem>
        );

        return disabledTooltip && disabled ? (
          <Tooltip
            describeChild
            key={`${label}-${index}`}
            title={disabledTooltip}
          >
            <span>{Item}</span>
          </Tooltip>
        ) : (
          Item
        );
      }
    );
}
