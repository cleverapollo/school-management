/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Button, Typography, Container } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Page } from '@tyro/core';
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
  const { t } = useTranslation(['common']);
  return (
    <Page title="Unauthorized">
      <Container component={MotionContainer}>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              {t('common:sorry')}!
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>
              {t('common:unauthorized_user_msg')}
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <PageNotFoundIllustration
              sx={{ height: 260, my: { xs: 5, sm: 10 } }}
            />
          </m.div>

          <Button
            to="/login"
            size="large"
            variant="contained"
            component={RouterLink}
          >
            {t('common:go_to_login')}
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  );
}
