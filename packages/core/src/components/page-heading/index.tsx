import { Stack, StackProps, Typography } from '@mui/material';
import { Breadcrumbs, BreadcrumbsProps } from '../breadcrumbs';

interface PageHeadingProps extends StackProps {
  title: string;
  breadcrumbs?: BreadcrumbsProps;
}

export const PageHeading = ({
  title,
  breadcrumbs,
  ...props
}: PageHeadingProps) => (
  <Stack {...props}>
    <Typography variant="h4" component="h1">
      {title}
    </Typography>
    {breadcrumbs && <Breadcrumbs {...breadcrumbs} />}
  </Stack>
);
