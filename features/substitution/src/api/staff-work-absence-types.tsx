import { useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  Swm_StaffAbsenceTypeFilter,
} from '@tyro/api';

const staffWorkAbsenceTypes = graphql(/* GraphQL */ `
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

export const staffWorkAbsenceTypesKeys = {
  list: ['staffWork', 'absenceTypes'] as const,
};

const staffWorkAbsenceTypesQuery = (filter: Swm_StaffAbsenceTypeFilter) => ({
  queryKey: staffWorkAbsenceTypesKeys.list,
  queryFn: () => gqlClient.request(staffWorkAbsenceTypes, { filter }),
});

export function getStaffWorkAbsenceTypes(filter: Swm_StaffAbsenceTypeFilter) {
  return queryClient.fetchQuery(staffWorkAbsenceTypesQuery(filter));
}

export function useStaffWorkAbsenceTypes(filter: Swm_StaffAbsenceTypeFilter) {
  return useQuery({
    ...staffWorkAbsenceTypesQuery(filter),
    select: ({ swm_absenceTypes }) => {
      if (!Array.isArray(swm_absenceTypes)) return [];

      return swm_absenceTypes;
    },
  });
}
