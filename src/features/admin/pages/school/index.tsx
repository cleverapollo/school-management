// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../../../hooks/useSettings';
// components
import Page from '../../../../components/Page';
import { SchoolsTable } from '../../components/schools-table';

// ----------------------------------------------------------------------

export default function AdminSchoolsPage() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Schools">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Schools
        </Typography>
        <SchoolsTable />
      </Container>
    </Page>
  );
}