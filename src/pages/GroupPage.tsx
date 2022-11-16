// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Group from '../features/group/Group';
import { useParams } from 'react-router';

// ----------------------------------------------------------------------

export default function GroupPage() {
  const { themeStretch } = useSettings();
  const params = useParams();

  return (
    <Page title="Page Five">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Group id={params.id}/>
      </Container>
    </Page>
  );
}
