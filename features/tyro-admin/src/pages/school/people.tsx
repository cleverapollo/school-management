/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Container, Typography } from '@mui/material';
import useSettings from '../../../../../src/hooks/useSettings';
import Page from '../../../../../src/components/Page';
import { PeoplesTable } from '../../components/peoples-table';

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
