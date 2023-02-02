import { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';

export type TLink = {
  href?: string;
  name: string;
  icon?: ReactElement;
};

type LinkItemProps = {
  link: TLink;
};

export function LinkItem({ link }: LinkItemProps) {
  const { href, name, icon } = link;
  return (
    <Link
      key={name}
      variant="body2"
      component={RouterLink}
      to={href || '#'}
      sx={{
        lineHeight: 2,
        display: 'flex',
        alignItems: 'center',
        color: 'text.primary',
        '& > div': { display: 'inherit' },
      }}
    >
      {icon && (
        <Box sx={{ mr: 1, '& svg': { width: 20, height: 20 } }}>{icon}</Box>
      )}
      {name}
    </Link>
  );
}
