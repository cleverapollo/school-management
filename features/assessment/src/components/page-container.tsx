import { Page } from '@tyro/core';
import { Container, ContainerProps } from '@mui/material';

type PageContainerProps = ContainerProps & {
  title: string;
};

export const PageContainer = ({
  title,
  children,
  ...containerProps
}: PageContainerProps) => (
  <Page title={title}>
    <Container
      maxWidth="xl"
      {...containerProps}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pb: 3,
        ...containerProps.sx,
      }}
    >
      {children}
    </Container>
  </Page>
);
