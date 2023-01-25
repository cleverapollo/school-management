import { Container, Typography } from '@mui/material';
import { Page } from '@tyro/core';

export default function Dashboard() {
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          Dashboard
        </Typography>
      </Container>
    </Page>
  );
}
