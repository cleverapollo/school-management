// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import AdminPanel from '../features/adminPanel/AdminPanel';

// ----------------------------------------------------------------------

export default function AdminPanelPage() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Page Two">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Page Two
        </Typography>
        <AdminPanel />
      </Container>
    </Page>
  );
}
