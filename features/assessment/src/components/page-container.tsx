import { Page } from '@tyro/core';
import { Container } from '@mui/material';
import { PropsWithChildren } from 'react';

type PageContainerProps = PropsWithChildren<{
  title: string;
}>;

export const PageContainer = ({ title, children }: PageContainerProps) => (
  <Page title={title}>
    <Container
      maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pb: 3,
      }}
    >
      {children}
    </Container>
  </Page>
);
