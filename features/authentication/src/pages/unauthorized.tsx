/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { m } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Button, Typography, Container } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Page } from '@tyro/core';
import { useAuth } from '@tyro/api';
import { useEffect } from 'react';
import { MotionContainer, varBounce } from '../../../../src/components/animate';
import { PageNotFoundIllustration } from '../../../../src/assets';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function PageUnauthorized() {
  const { t } = useTranslation(['common', 'authentication']);
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      login();
    }
  }, [isAuthenticated]);

  return (
    <Page title={t('authentication:titles.unauthorized')}>
      <Container component={MotionContainer}>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              {t('common:sorry')}!
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>
              {t('authentication:unauthorized_user_msg')}
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <PageNotFoundIllustration
              sx={{ height: 260, my: { xs: 5, sm: 10 } }}
            />
          </m.div>

          <Button onClick={login} size="large" variant="contained">
            {t('authentication:go_to_login')}
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  );
}
