import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  FeeFilter,
} from '@tyro/api';
import { feeKeys } from './keys';

const fees = graphql(/* GraphQL */ `
  query fees_fees($filter: FeeFilter) {
    fees_fees(filter: $filter) {
      id
      name
      dueDate
      amount
      feeType
      absorbFees
      assignedToParties {
        ... on PartyPerson {
          __typename
          person {
            partyId
            firstName
            lastName
            avatarUrl
          }
        }
        ... on SubjectGroup {
          __typename
          partyId
          name
          avatarUrl
        }
        ... on GeneralGroup {
          __typename
          partyId
          name
        }
        ... on YearGroupEnrollment {
          __typename
          partyId
          name
        }
        ... on ProgrammeStageEnrollment {
          __typename
          partyId
          name
        }
      }
      categories {
        id
        name
      }
      discounts {
        id
        name
      }
      individualDiscounts {
        personPartyId
        discount {
          id
          name
        }
      }
    }
  }
`);

const feesQuery = (filter: FeeFilter) => ({
  queryKey: feeKeys.fees(filter),
  queryFn: () => gqlClient.request(fees, { filter }),
});

export function getFees(filter: FeeFilter) {
  return queryClient.fetchQuery(feesQuery(filter));
}

export function useFees(filter: FeeFilter) {
  return useQuery({
    ...feesQuery(filter),
    select: ({ fees_fees }) => fees_fees,
  });
}

export type ReturnTypeFromUseFees = UseQueryReturnType<typeof useFees>[number];
