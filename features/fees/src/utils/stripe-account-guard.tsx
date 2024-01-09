import { redirect } from 'react-router-dom';
import { getStripeAccount } from '../api/stripe-accounts';

export const stripeAccountGuard = async () => {
  const { fees_stripeAccount: account } = await getStripeAccount();

  return !account.onboardingComplete ? redirect('/fees/setup') : null;
};
