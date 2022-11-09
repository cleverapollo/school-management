// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Subjects from '../features/subjects/Subjects';
// ----------------------------------------------------------------------

export default function SubjectsPage() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Page Four">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Page Four
        </Typography>
        <Subjects />
      </Container>
    </Page>
  );
}
