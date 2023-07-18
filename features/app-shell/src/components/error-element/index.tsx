import { m } from 'framer-motion';
import { MotionContainer, Page, varBounce } from '@tyro/core';
import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useAuth } from '@tyro/api';
import { Shell } from '../shell';
import {
  ForbiddenIllustration,
  PageNotFoundIllustration,
  SeverErrorIllustration,
  UnknownErrorIllustration,
} from './illustrations';

const errorIllustation = {
  '404': PageNotFoundIllustration,
  '403': ForbiddenIllustration,
  '500': SeverErrorIllustration,
  '503': SeverErrorIllustration,
  unknown: UnknownErrorIllustration,
};

function useErrorStatus(error: unknown): keyof typeof errorIllustation {
  const knownErrorKeys = Object.keys(errorIllustation);
  const typedError = isRouteErrorResponse(error)
    ? { response: error }
    : (error as { response: Response });
  const status = typedError.response?.status;

  return status && knownErrorKeys.includes(String(status))
    ? (String(status) as keyof typeof errorIllustation)
    : 'unknown';
}

export function ErrorElement() {
  const error = useRouteError();
  const { t } = useTranslation(['common', 'navigation']);
  const status = useErrorStatus(error);
  const Illustration = errorIllustation[status];
  const { logout } = useAuth();

  const errorPage = (
    <Page title={t(`navigation:errors.${status}.title`)}>
      <Container maxWidth="xl">
        <MotionContainer
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              {t(`navigation:errors.${status}.title`)}
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography
              sx={{
                color: 'text.secondary',
                maxWidth: 'sm',
                textAlign: 'center',
              }}
            >
              {t(`navigation:errors.${status}.description`)}
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Illustration
              sx={{
                height: 260,
                my: { xs: 5, sm: 10 },
              }}
            />
          </m.div>

          <Stack spacing={2}>
            <Button to="/" component={Link} size="large" variant="contained">
              {t('navigation:errors.action')}
            </Button>
            <Button onClick={logout} size="large" variant="text">
              {t('common:logout')}
            </Button>
          </Stack>
        </MotionContainer>
      </Container>
    </Page>
  );

  if (['500', '503', 'unknown'].includes(status)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        {errorPage}
      </Box>
    );
  }

  return <Shell>{errorPage}</Shell>;
}
