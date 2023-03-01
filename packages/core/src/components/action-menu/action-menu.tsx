import { useRef } from 'react';
import { Button, ButtonProps, Divider, Menu, MenuProps } from '@mui/material';
import { ChevronDownIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { useDisclosure } from '../../hooks';
import { getMenuItemList, MenuItemConfig } from './menu-item-list';

interface ActionMenuProps {
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  buttonProps?: ButtonProps;
  menuProps?: Partial<MenuProps>;
  menuItems: MenuItemConfig[] | MenuItemConfig[][];
}

export function ActionMenu({
  buttonLabel,
  buttonIcon,
  buttonProps,
  menuProps,
  menuItems,
}: ActionMenuProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [t] = useTranslation(['common']);
  const { onClose, getButtonProps, getDisclosureProps } = useDisclosure();

  const sectionedMenuItems = (
    Array.isArray(menuItems[0]) ? menuItems : [menuItems]
  ) as MenuItemConfig[][];

  return (
    <>
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
      <Menu
        anchorEl={buttonRef.current}
        sx={{ mt: 1 }}
        {...getDisclosureProps()}
        {...menuProps}
      >
        {sectionedMenuItems.reduce<React.ReactNode[]>(
          (acc, section, index, menuSections) => {
            acc.push(
              ...getMenuItemList({
                menuItems: section,
                onClose,
              })
            );

            if (index + 1 !== menuSections.length) {
              acc.push(<Divider key={`divider-${index}`} />);
            }

            return acc;
          },
          []
        )}
      </Menu>
    </>
  );
}