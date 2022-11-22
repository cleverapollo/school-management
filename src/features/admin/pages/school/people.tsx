// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../../../hooks/useSettings';
// components
import Page from '../../../../components/Page';
import { PeoplesTable } from '../../components/peoples-table';

// ----------------------------------------------------------------------

export default function AdminPeoplesPage() {
  const { themeStretch } = useSettings();

  return (
    <Page title="People">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          People
        </Typography>
        <PeoplesTable />
      </Container>
    </Page>
  );
}