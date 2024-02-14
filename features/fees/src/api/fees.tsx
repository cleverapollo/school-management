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
      published
      publishedOn
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
        discountType
        value
      }
      individualDiscounts {
        personPartyId
        discount {
          id
          name
          discountType
          value
        }
      }
      total
      paid
      due
      feeStatus
      createdBy {
        firstName
        lastName
        avatarUrl
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
