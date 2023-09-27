import { StackProps, ListItemButtonProps } from '@mui/material';
import {
  NavigationConfig,
  NavigationMenuLink,
  NavigationRootGroup,
} from '../../../../hooks/use-navigation-config';

export interface NavItemProps extends ListItemButtonProps {
  item: NavigationRootGroup | NavigationMenuLink;
  depth: number;
  open?: boolean;
  active?: boolean;
  isExternalLink?: boolean;
}

export interface NavSectionProps extends StackProps {
  data: NavigationConfig;
}
