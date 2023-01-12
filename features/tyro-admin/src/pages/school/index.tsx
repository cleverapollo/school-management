/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Container, Typography } from '@mui/material';
import useSettings from '../../../../../src/hooks/useSettings';
import Page from '../../../../../src/components/Page';
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
