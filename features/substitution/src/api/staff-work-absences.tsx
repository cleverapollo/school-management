import { useMutation, useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  Swm_StaffAbsenceFilter,
  Swm_UpsertStaffAbsence,
  UseQueryReturnType,
} from '@tyro/api';
import { substitutionKeys } from './keys';

const staffWorkAbsences = graphql(/* GraphQL */ `
  query swm_absences($filter: SWM_StaffAbsenceFilter) {
    swm_absences(filter: $filter) {
      absenceId
      staffPartyId
      absenceType {
        name
        code
      }
      staff {
        partyId
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        avatarUrl
        type
      }
      absenceReasonText
      substitutionRequired
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

const staffWorkAbsencesQuery = (filter: Swm_StaffAbsenceFilter) => ({
  queryKey: substitutionKeys.absences(filter),
  queryFn: () => gqlClient.request(staffWorkAbsences, { filter }),
});

export function getStaffWorkAbsences(filter: Swm_StaffAbsenceFilter) {
  return queryClient.fetchQuery(staffWorkAbsencesQuery(filter));
}

export function useStaffWorkAbsences(filter: Swm_StaffAbsenceFilter) {
  return useQuery({
    ...staffWorkAbsencesQuery(filter),
    select: ({ swm_absences }) => swm_absences ?? [],
  });
}

export function useSaveStaffAbsence() {
  return useMutation({
    mutationFn: (input: Swm_UpsertStaffAbsence) =>
      gqlClient.request(saveStaffAbsence, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(substitutionKeys.all);
    },
  });
}

export type ReturnTypeFromUseStaffWorkAbsences = UseQueryReturnType<
  typeof useStaffWorkAbsences
>[number];
