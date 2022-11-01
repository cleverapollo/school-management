import { ReactElement } from 'react';
import { BoxProps } from '@mui/material';
import { UserProfileName } from '../../app/api/generated';

// ----------------------------------------------------------------------



export type NavListProps = {
  title: string;
  path: string;
  icon?: ReactElement;
  info?: ReactElement;
  caption?: string;
  disabled?: boolean;
  permissions?: string[];
  children?: any;
  availableFor?: UserProfileName[];
};

export type NavItemProps = {
  item: NavListProps;
  depth: number;
  open: boolean;
  active: boolean;
  isCollapse?: boolean;
};

export type NavConfig = Array<{
  id: string;
  permissions?: string[];
  subheader: string;
  items: NavListProps[];
}>

export interface NavSectionProps extends BoxProps {
  isCollapse?: boolean;
  navConfig: NavConfig;
  profileTypeName?: UserProfileName;
}
