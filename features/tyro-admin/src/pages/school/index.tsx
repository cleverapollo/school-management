import { Container, Typography } from '@mui/material';
import { Page } from '@tyro/core';
import { SchoolsTable } from '../../components/schools-table';

// ----------------------------------------------------------------------

export default function AdminSchoolsPage() {
  return (
    <Page title="Schools">
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          Schools
        </Typography>
        <SchoolsTable />
      </Container>
    </Page>
  );
}
