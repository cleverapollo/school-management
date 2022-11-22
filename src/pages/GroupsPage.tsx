// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Groups from '../features/groups/Groups';

// ----------------------------------------------------------------------

export default function GroupsPage() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Page Three">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Page Three
        </Typography>
        <Groups />
      </Container>
    </Page>
  );
}