import { Stack, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import { Breadcrumbs, BreadcrumbsProps } from '../breadcrumbs';

type PageHeadingProps = PropsWithChildren<{
  title: string;
  breadcrumbs?: BreadcrumbsProps;
}>;

export const PageHeading = ({ title, breadcrumbs }: PageHeadingProps) => (
  <Stack>
    <Typography variant="h4" component="h1">
      {title}
    </Typography>
    {breadcrumbs && <Breadcrumbs {...breadcrumbs} />}
  </Stack>
);
