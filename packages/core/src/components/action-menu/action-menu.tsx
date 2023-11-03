import React, { useEffect, useRef } from 'react';
import {
  Button,
  ButtonProps,
  Divider,
  IconButton,
  Menu,
  MenuProps,
  Tooltip,
} from '@mui/material';
import { ChevronDownIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { usePermissions } from '@tyro/api';
import { useDisclosure } from '../../hooks';
import { getMenuItemList, MenuItemConfig } from './menu-item-list';

export interface ActionMenuProps {
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  buttonProps?: ButtonProps;
  menuProps?: Partial<MenuProps>;
  menuItems: MenuItemConfig[] | MenuItemConfig[][];
  iconOnly?: boolean;
}

export function ActionMenu({
  buttonLabel,
  buttonIcon,
  buttonProps,
  menuProps,
  menuItems,
  iconOnly = false,
}: ActionMenuProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [t] = useTranslation(['common']);
  const { id, isOpen, onClose, getButtonProps } = useDisclosure();
  const permissions = usePermissions();
  const sectionedMenuItems = (
    Array.isArray(menuItems[0]) ? menuItems : [menuItems]
  ) as MenuItemConfig[][];

  return (
    <>
      {iconOnly ? (
        <Tooltip title={buttonLabel ?? t('common:actions.title')}>
          <IconButton
            ref={buttonRef}
            aria-haspopup="true"
            variant="soft"
            aria-label={buttonLabel ?? t('common:actions.title')}
            {...getButtonProps()}
            {...buttonProps}
          >
            {buttonIcon ?? <ChevronDownIcon />}
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          ref={buttonRef}
          aria-haspopup="true"
          variant="soft"
          {...getButtonProps()}
          endIcon={buttonIcon ?? <ChevronDownIcon />}
          {...buttonProps}
        >
          {buttonLabel ?? t('common:actions.title')}
        </Button>
      )}
      <Menu
        anchorEl={buttonRef.current}
        id={id}
        open={isOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        {...menuProps}
        onClose={(...args) => {
          if (args[1] === 'backdropClick') {
            const event = args[0] as React.MouseEvent;
            event.preventDefault();
          }
          onClose();
          menuProps?.onClose?.(...args);
        }}
        sx={{ mt: 1, ...menuProps?.sx }}
      >
        {sectionedMenuItems.reduce<React.ReactNode[]>((acc, section, index) => {
          const sectionItems = getMenuItemList({
            menuItems: section,
            permissions,
            onClose,
          });

          if (acc.length > 0 && sectionItems.length > 0) {
            acc.push(<Divider key={`divider-${index}`} />);
          }

          if (sectionItems.length > 0) {
            acc.push(...sectionItems);
          }

          return acc;
        }, [])}
      </Menu>
    </>
  );
}
