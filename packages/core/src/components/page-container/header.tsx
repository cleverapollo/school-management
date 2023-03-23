import { Container, Stack, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import { Breadcrumbs, BreadcrumbsProps } from '../breadcrumbs';

type HeaderProps = PropsWithChildren<{
  title: string;
  breadcrumbs?: BreadcrumbsProps;
}>;

export const Header = ({ title, breadcrumbs, children }: HeaderProps) => (
  <Container
    maxWidth="xl"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      mb: 3,
    }}
  >
    <Stack>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {breadcrumbs && <Breadcrumbs {...breadcrumbs} />}
    </Stack>
    {children}
  </Container>
);
