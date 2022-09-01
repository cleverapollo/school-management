import { ReactElement } from 'react';
import { BoxProps } from '@mui/material';

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
};

export type NavItemProps = {
  item: NavListProps;
  depth: number;
  open: boolean;
  active: boolean;
  isCollapse?: boolean;
};

export interface NavSectionProps extends BoxProps {
  isCollapse?: boolean;
  navConfig: {
    id: string;
    permissions?: string[];
    subheader: string;
    items: NavListProps[];
  }[];
}
