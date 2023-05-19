import { Container, ContainerProps } from '@mui/material';
import { Page } from '../page';

export type PageContainerProps = ContainerProps & {
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
