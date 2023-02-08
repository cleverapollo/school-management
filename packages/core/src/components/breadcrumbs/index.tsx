import { ReactElement } from 'react';
import {
  Box,
  Typography,
  BreadcrumbsProps as MUIBreadcrumbsProps,
  Breadcrumbs as MUIBreadcrumbs,
} from '@mui/material';
import { LinkItem } from './link-item';

type TLink = {
  href?: string;
  name: string;
  icon?: ReactElement;
};

export interface BreadcrumbsProps extends MUIBreadcrumbsProps {
  links: TLink[];
  activeLast?: boolean;
}

export function Breadcrumbs({
  links,
  activeLast = false,
  ...other
}: BreadcrumbsProps) {
  const currentLink = links[links.length - 1].name;

  const listDefault = links.map((link) => (
    <LinkItem key={link.name} link={link} />
  ));

  const listActiveLast = links.map((link) => (
    <div key={link.name}>
      {link.name !== currentLink ? (
        <LinkItem link={link} />
      ) : (
        <Typography
          variant="body2"
          sx={{
            maxWidth: 260,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: 'text.disabled',
            textOverflow: 'ellipsis',
          }}
        >
          {currentLink}
        </Typography>
      )}
    </div>
  ));

  return (
    <MUIBreadcrumbs
      separator={
        <Box
          component="span"
          sx={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            bgcolor: 'text.disabled',
          }}
        />
      }
      {...other}
    >
      {activeLast ? listDefault : listActiveLast}
    </MUIBreadcrumbs>
  );
}
