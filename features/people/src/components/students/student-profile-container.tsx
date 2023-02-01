/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Box, Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

export default function StudentProfileContainer() {
  const { t } = useTranslation(['people']);
  return (
    <Page
      title={t('people:subject')}
      sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      <Container
        sx={{
          maxWidth: 'xl',
          px: 1,
        }}
      >
        <Typography variant="h4" component="h1">
          {t('people:studentProfile')}
        </Typography>
      </Container>

      <Box
        sx={{
          backgroundColor: 'gray',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          flex: 1,
        }}
      >
        <Outlet />
      </Box>
    </Page>
  );
}
