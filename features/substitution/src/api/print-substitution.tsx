import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  Swm_EventsForSubstitutionFilter,
  UseQueryReturnType,
} from '@tyro/api';

const printSubstitution = graphql(/* GraphQL */ `
  query printSubstitution($filter: SWM_EventsForSubstitutionFilter!) {
    print_substitution(filter: $filter) {
      url
      html
    }
  }
`);
const printSubstitutionQuery = (filter: Swm_EventsForSubstitutionFilter) => ({
  queryKey: ['print', 'substitution', filter],
  queryFn: async () =>
    gqlClient.request(printSubstitution, {
      filter,
    }),
});

export function getPrintSubstitution(filter: Swm_EventsForSubstitutionFilter) {
  return queryClient.fetchQuery(printSubstitutionQuery(filter));
}

export function usePrintSubstitution(filter: Swm_EventsForSubstitutionFilter) {
  return useQuery({
    ...printSubstitutionQuery(filter),
    select: ({ print_substitution }) => print_substitution,
  });
}

export type ReturnTypeFromUsePrintSubstitution = UseQueryReturnType<
  typeof usePrintSubstitution
>;
