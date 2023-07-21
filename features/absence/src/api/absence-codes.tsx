import { useQuery } from '@tanstack/react-query';
import {
  Swm_StaffAbsenceTypeFilter,
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';

export type ReturnTypeFromUseAbsenceCodes = UseQueryReturnType<
  typeof useAbsenceCodes
>[number];

const absenceCodeTypes = graphql(/* GraphQL */ `
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

const absenceCodesKeys = {
  list: ['absence', 'codes'] as const,
};

const absenceCodesQuery = (filter: Swm_StaffAbsenceTypeFilter) => ({
  queryKey: absenceCodesKeys.list,
  queryFn: () => gqlClient.request(absenceCodeTypes, { filter }),
});

export function useAbsenceCodes(filter: Swm_StaffAbsenceTypeFilter) {
  return useQuery({
    ...absenceCodesQuery(filter),
    select: ({ swm_absenceTypes }) => swm_absenceTypes,
  });
}

export function getAbsenceCodes(filter: Swm_StaffAbsenceTypeFilter) {
  return queryClient.fetchQuery(absenceCodesQuery(filter));
}
