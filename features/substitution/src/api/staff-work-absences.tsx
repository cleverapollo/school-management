import { useMutation, useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  StaffAbsence,
  StaffAbsenceFilter,
  UpsertStaffAbsence,
} from '@tyro/api';

const staffWorkAbsences = graphql(/* GraphQL */ `
  query staff_work_absences($filter: StaffAbsenceFilter) {
    staffWork_absences(filter: $filter) {
      absenceId
      staff {
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        avatarUrl
      }
      absenceType {
        name
      }
      fromDate
      toDate
    }
  }
`);

const saveStaffAbsence = graphql(/* GraphQL */ `
  mutation staffWork_upsertAbsence($input: [UpsertStaffAbsence!]!) {
    staffWork_upsertAbsence(input: $input) {
      staffPartyId
      absenceTypeId
      fromDate
      toDate
      fromAbsenceRequestId
      absenceReasonText
    }
  }
`);

export const staffWorkAbsencesKeys = {
  list: ['staffWork', 'absences'] as const,
};

const staffWorkAbsencesQuery = (filter: StaffAbsenceFilter) => ({
  queryKey: staffWorkAbsencesKeys.list,
  queryFn: () => gqlClient.request(staffWorkAbsences, { filter }),
});

export function getStaffWorkAbsences(filter: StaffAbsenceFilter) {
  return queryClient.fetchQuery(staffWorkAbsencesQuery(filter));
}

export function useStaffWorkAbsences(filter: StaffAbsenceFilter) {
  return useQuery({
    ...staffWorkAbsencesQuery(filter),
    select: ({ staffWork_absences }) => {
      if (!Array.isArray(staffWork_absences)) return [];

      return staffWork_absences as StaffAbsence[];
    },
  });
}

export function useSaveStaffAbsence() {
  return useMutation({
    mutationKey: ['staffWork', 'createAbsence'],
    mutationFn: (input: UpsertStaffAbsence) =>
      gqlClient.request(saveStaffAbsence, { input }),
  });
}
