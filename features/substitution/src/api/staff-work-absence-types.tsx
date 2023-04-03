import { useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  StaffAbsenceTypeFilter,
} from '@tyro/api';

const staffWorkAbsenceTypes = graphql(/* GraphQL */ `
  query staffWork_absenceTypes($filter: StaffAbsenceTypeFilter) {
    staffWork_absenceTypes(filter: $filter) {
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

const staffWorkAbsenceTypesQuery = (filter: StaffAbsenceTypeFilter) => ({
  queryKey: staffWorkAbsenceTypesKeys.list,
  queryFn: () => gqlClient.request(staffWorkAbsenceTypes, { filter }),
});

export function getStaffWorkAbsenceTypes(filter: StaffAbsenceTypeFilter) {
  return queryClient.fetchQuery(staffWorkAbsenceTypesQuery(filter));
}

export function useStaffWorkAbsenceTypes(filter: StaffAbsenceTypeFilter) {
  return useQuery({
    ...staffWorkAbsenceTypesQuery(filter),
    select: ({ staffWork_absenceTypes }) => {
      if (!Array.isArray(staffWork_absenceTypes)) return [];

      return staffWork_absenceTypes;
    },
  });
}
