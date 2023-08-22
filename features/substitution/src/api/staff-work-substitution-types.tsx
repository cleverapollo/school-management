import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Swm_StaffSubstitutionTypeFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { substitutionKeys } from './keys';

const substitutionTypes = graphql(/* GraphQL */ `
  query swm_substitutionTypes($filter: SWM_StaffSubstitutionTypeFilter) {
    swm_substitutionTypes(filter: $filter) {
      substitutionTypeId
      name
      description
      code
    }
  }
`);

const substitutionTypesQuery = (filter: Swm_StaffSubstitutionTypeFilter) => ({
  queryKey: substitutionKeys.substitutionTypes(filter),
  queryFn: () => gqlClient.request(substitutionTypes, { filter }),
  staleTime: 1000 * 60 * 60 * 24,
});

export function useSubstitutionTypes(filter: Swm_StaffSubstitutionTypeFilter) {
  return useQuery({
    ...substitutionTypesQuery(filter),
    select: ({ swm_substitutionTypes }) => swm_substitutionTypes,
  });
}

export type ReturnTypeFromUseSubstitutionTypes = UseQueryReturnType<
  typeof useSubstitutionTypes
>;
