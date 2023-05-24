/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Container, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '@tyro/api';
import { Page, useResponsive } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import Logo from '../../../../src/components/Logo';
import Image from '../../../../src/components/Image';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');
  const { login } = useAuth();
  const { t } = useTranslation(['common', 'authentication']);

  return (
    <Page title={t('authentication:titles.login')}>
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              {/* {trans('common:docs.no_account')} */}
              {/* <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                {`Get started`}
              </Link> */}
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              {t('authentication:hi_welcome_back')}
            </Typography>
            <Image
              visibleByDefault
              disabledEffect
              src="/assets/illustrations/illustration_login.png"
              alt="login"
            />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {t('authentication:sign_in_to_tyro')} v2
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {t('authentication:enter_your_details_below')}.
                </Typography>
              </Box>
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={() => login()}
            >
              {t('authentication:login_with_msal')}
            </LoadingButton>

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                {/* {trans('common:docs.no_account')}
                <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                  {`Get started`}
                </Link> */}
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
