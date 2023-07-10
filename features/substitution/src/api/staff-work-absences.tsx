import { useMutation, useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  Swm_StaffAbsenceFilter,
  Swm_UpsertStaffAbsence,
} from '@tyro/api';

const staffWorkAbsences = graphql(/* GraphQL */ `
  query swm_absences($filter: SWM_StaffAbsenceFilter) {
    swm_absences(filter: $filter) {
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
      dates {
        continuousStartDate
        continuousEndDate
        individualDates
        partialAbsence
        partialStartTime
        partialEndTime
      }
    }
  }
`);

const saveStaffAbsence = graphql(/* GraphQL */ `
  mutation swm_upsertAbsence($input: [SWM_UpsertStaffAbsence!]!) {
    swm_upsertAbsence(input: $input) {
      staffPartyId
      absenceTypeId
      fromAbsenceRequestId
      absenceReasonText
    }
  }
`);

export const staffWorkAbsencesKeys = {
  list: ['staffWork', 'absences'] as const,
};

const staffWorkAbsencesQuery = (filter: Swm_StaffAbsenceFilter) => ({
  queryKey: staffWorkAbsencesKeys.list,
  queryFn: () => gqlClient.request(staffWorkAbsences, { filter }),
});

export function getStaffWorkAbsences(filter: Swm_StaffAbsenceFilter) {
  return queryClient.fetchQuery(staffWorkAbsencesQuery(filter));
}

export function useStaffWorkAbsences(filter: Swm_StaffAbsenceFilter) {
  return useQuery({
    ...staffWorkAbsencesQuery(filter),
    select: ({ swm_absences }) => {
      if (!Array.isArray(swm_absences)) return [];

      return swm_absences;
    },
  });
}

export function useSaveStaffAbsence() {
  return useMutation({
    mutationKey: ['staffWork', 'createAbsence'],
    mutationFn: (input: Swm_UpsertStaffAbsence) =>
      gqlClient.request(saveStaffAbsence, { input }),
  });
}
