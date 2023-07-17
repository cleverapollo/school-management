import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

type LinkProps = MuiLinkProps & RouterLinkProps;

export const Link = ({ children, ...props }: LinkProps) => (
  <MuiLink component={RouterLink} {...props}>
    {children}
  </MuiLink>
);
