import { MenuItem, styled, Tooltip } from '@mui/material';

export interface MenuItemConfig {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  disabledTooltip?: string;
}

interface MenuItemListProps {
  menuItems: MenuItemConfig[];
  onClose: () => void;
}

const IconWrapper = styled('span')(({ theme }) => ({
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

export function getMenuItemList({ menuItems, onClose }: MenuItemListProps) {
  return menuItems.map(
    ({ label, icon, onClick, disabled, disabledTooltip }, index) => {
      const Item = (
        <MenuItem
          key={`${label}-${index}`}
          onClick={() => {
            onClick();
            onClose();
          }}
          disabled={disabled}
          title={disabledTooltip}
          sx={{
            fontSize: '0.875rem',
          }}
        >
          {icon && <IconWrapper>{icon}</IconWrapper>} {label}
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
