import { Container, Typography } from '@mui/material';
import { Page } from '@tyro/core';
import { PeoplesTable } from '../../components/peoples-table';

export default function AdminPeoplesPage() {
  return (
    <Page title="People">
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          People
        </Typography>
        <PeoplesTable />
      </Container>
    </Page>
  );
}
