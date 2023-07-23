import { useQuery } from '@tanstack/react-query';
import {
  Swm_StaffAbsenceTypeFilter,
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';

export type ReturnTypeFromUseAbsenceTypes = UseQueryReturnType<
  typeof useAbsenceTypes
>[number];

const absenceTypes = graphql(/* GraphQL */ `
  query swm_absenceTypes($filter: SWM_StaffAbsenceTypeFilter) {
    swm_absenceTypes(filter: $filter) {
      absenceTypeId
      name
      nameTextId
      description
      descriptionTextId
      code
      availableForRequests
    }
  }
`);

const absenceTypesKeys = {
  list: ['absence', 'codes'] as const,
};

const absenceTypesQuery = (filter: Swm_StaffAbsenceTypeFilter) => ({
  queryKey: absenceTypesKeys.list,
  queryFn: () => gqlClient.request(absenceTypes, { filter }),
});

export function useAbsenceTypes(filter: Swm_StaffAbsenceTypeFilter) {
  return useQuery({
    ...absenceTypesQuery(filter),
    select: ({ swm_absenceTypes }) => swm_absenceTypes,
  });
}

export function getAbsenceTypes(filter: Swm_StaffAbsenceTypeFilter) {
  return queryClient.fetchQuery(absenceTypesQuery(filter));
}
