import { redirect } from 'react-router-dom';
import { getStripeAccount } from '../api/stripe-accounts';

export const stripeAccountGuard = async () => {
  const { fees_stripeAccount: account } = await getStripeAccount();

  return redirect('/fees/setup');

  // Always redirect to setup page till fees is ready
  // Remove line above and uncomment below to enable guard when releasing fees
  // return !account.onboardingComplete ? redirect('/fees/setup') : null;
};
