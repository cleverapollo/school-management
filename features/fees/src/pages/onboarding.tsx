import { Link } from 'react-router-dom';
import { PageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Button } from '@mui/material';
import { useStripeAccount } from '../api/stripe-accounts';

export default function OnboardingPage() {
  const { t } = useTranslation(['navigation', 'fees']);

  const { data: stripeAccount } = useStripeAccount();

  return (
    <PageContainer title={t('navigation:management.fees.onboarding')}>
      <Button
        variant="contained"
        component={Link}
        to={stripeAccount?.onboardingLink || ''}
      >
        {stripeAccount?.signUpStarted
          ? t('fees:stripeAccount.continueSetup')
          : t('fees:stripeAccount.getStarted')}
      </Button>
    </PageContainer>
  );
}
