import { Link } from 'react-router-dom';
import { PageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  alpha,
  Box,
  Button,
  Card,
  Fade,
  Stack,
  Typography,
} from '@mui/material';
import { WalletWithMoneyIcon } from '@tyro/icons';
import { useMeasure } from 'react-use';
import { useStripeAccount } from '../api/stripe-accounts';

export default function SetupPage() {
  const { t } = useTranslation(['navigation', 'fees']);
  const [cardRef, { width }] = useMeasure<HTMLDivElement>();

  const { data: stripeAccount } = useStripeAccount();
  const isSetupComplete = stripeAccount?.onboardingComplete;
  const showBackgroundImages = !!width && width > 1100;

  return (
    <PageContainer title={t('fees:feesSetup')}>
      <Card sx={{ p: 1.5, pt: 0, borderRadius: 3.5 }}>
        <Typography variant="h6" component="h1" py={3} px={1.5}>
          {isSetupComplete
            ? t('fees:tyroFeesComingSoon')
            : t('fees:createStripeAccount')}
        </Typography>
        <Card
          ref={cardRef}
          variant="soft"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            borderRadius: 2,
            position: 'relative',
          }}
        >
          <Card
            sx={({ palette }) => ({
              p: 3,
              maxWidth: 480,
              width: '100%',
              boxShadow: `0 14px 24px 0 ${alpha(
                palette.blue[500],
                0.16
              )}, 0 1px 6px 0 ${alpha(palette.indigo[500], 0.16)}`,
              position: 'relative',
              zIndex: 1,
            })}
          >
            <Stack spacing={3} alignItems="center">
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                alignSelf="flex-start"
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'green.100',
                    width: 46,
                    height: 46,
                    borderRadius: 2,
                  }}
                >
                  <WalletWithMoneyIcon
                    sx={{
                      color: 'green.600',
                      width: 32,
                      height: 32,
                    }}
                  />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  {t('fees:getStartedWithStripe')}
                </Typography>
              </Stack>

              <Box
                sx={{
                  borderLeft: '3px solid',
                  borderColor: 'green.400',
                  bgcolor: 'green.100',
                  borderRadius: 0.5,
                  py: 2.5,
                  px: 3,
                }}
              >
                <Typography variant="body2" color="green.950" fontWeight={600}>
                  {isSetupComplete
                    ? t('fees:yourSchoolIsReadyDescription')
                    : t('fees:createYourStripeAccountDescription')}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={600} textAlign="center">
                {isSetupComplete
                  ? t('fees:thankYouForSigningUpForStripe')
                  : t('fees:clickSignUpToStripe')}
              </Typography>
              {!isSetupComplete && (
                <Button
                  variant="contained"
                  component={Link}
                  to={stripeAccount?.onboardingLink || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {stripeAccount?.signUpStarted
                    ? t('fees:stripeAccount.continueSetup')
                    : t('fees:stripeAccount.getStarted')}
                </Button>
              )}
            </Stack>
          </Card>
          <Fade in={showBackgroundImages}>
            <Box
              sx={{
                position: 'absolute',
              }}
              aria-hidden
            >
              <Box
                component="img"
                src="/assets/fees/take-off-dashboard.png"
                alt=""
                sx={{ transform: 'translateX(-290px)' }}
              />
              <Box
                component="img"
                src="/assets/fees/sign-up-form.png"
                alt=""
                sx={{ transform: 'translateX(260px)' }}
              />
            </Box>
          </Fade>
        </Card>
      </Card>
    </PageContainer>
  );
}
