import { m } from 'framer-motion';
import { MotionContainer, Page, varBounce } from '@tyro/core';
import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
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
  unknown: UnknownErrorIllustration,
};

function useErrorStatus(error: unknown): keyof typeof errorIllustation {
  const knownErrorKeys = Object.keys(errorIllustation);

  return isRouteErrorResponse(error) &&
    knownErrorKeys.includes(String(error.status))
    ? (String(error.status) as keyof typeof errorIllustation)
    : 'unknown';
}

export function ErrorElement() {
  const error = useRouteError();
  const { t } = useTranslation(['navigation']);
  const status = useErrorStatus(error);
  const Illustration = errorIllustation[status];

  return (
    <Shell>
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

            <Button to="/" component={Link} size="large" variant="contained">
              {t('navigation:errors.action')}
            </Button>
          </MotionContainer>
        </Container>
      </Page>
    </Shell>
  );
}
