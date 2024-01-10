import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  CategoryFilter,
} from '@tyro/api';
import { feeKeys } from './keys';

const feesCategories = graphql(/* GraphQL */ `
  query fees_categories($filter: CategoryFilter) {
    fees_categories(filter: $filter) {
      id
      name
      description
      active
      createdBy {
        partyId
        firstName
        lastName
        avatarUrl
      }
    }
  }
`);

const feesCategoriesQuery = (filter: CategoryFilter) => ({
  queryKey: feeKeys.feesCategories(filter),
  queryFn: () => gqlClient.request(feesCategories, { filter }),
});

export function getFeesCategories(filter: CategoryFilter) {
  return queryClient.fetchQuery(feesCategoriesQuery(filter));
}

export function useFeesCategories(filter: CategoryFilter) {
  return useQuery({
    ...feesCategoriesQuery(filter),
    select: ({ fees_categories }) =>
      fees_categories?.flatMap((category) => (category ? [category] : [])),
  });
}

export type ReturnTypeFromUseFeesCategories = UseQueryReturnType<
  typeof useFeesCategories
>[number];
