import {
  Box,
  BoxProps,
  Stack,
  Typography,
  TypographyProps,
} from '@mui/material';
import { Breadcrumbs, BreadcrumbsProps } from '../breadcrumbs';

interface PageHeadingProps extends BoxProps {
  title: string;
  titleProps?: TypographyProps<'h1'>;
  breadcrumbs?: BreadcrumbsProps;
  rightAdornment?: React.ReactNode;
}

export const PageHeading = ({
  title,
  titleProps = {},
  breadcrumbs,
  rightAdornment,
  ...props
}: PageHeadingProps) => (
  <Box display="flex" justifyContent="space-between" flexWrap="wrap" {...props}>
    <Stack>
      <Typography variant="h4" component="h1" {...titleProps}>
        {title}
      </Typography>
      {breadcrumbs && <Breadcrumbs {...breadcrumbs} />}
    </Stack>
    {rightAdornment}
  </Box>
);
