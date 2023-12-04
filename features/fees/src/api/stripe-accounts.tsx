import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { feeKeys } from './keys';

const stripeAccount = graphql(/* GraphQL */ `
  query fees_stripeAccount {
    fees_stripeAccount {
      signUpStarted
      onboardingComplete
      onboardingLink
    }
  }
`);

const stripeAccountQuery = () => ({
  queryKey: feeKeys.stripeAccount(),
  queryFn: () => gqlClient.request(stripeAccount),
});

export function getStripeAccount() {
  return queryClient.fetchQuery(stripeAccountQuery());
}

export function useStripeAccount() {
  return useQuery({
    ...stripeAccountQuery(),
    select: ({ fees_stripeAccount }) => fees_stripeAccount,
  });
}
