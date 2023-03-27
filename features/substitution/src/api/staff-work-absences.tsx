import { useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  StaffAbsence,
  StaffAbsenceFilter,
} from '@tyro/api';

const staffWorkAbsences = graphql(/* GraphQL */ `
  query staff_work_absences($filter: StaffAbsenceFilter) {
    staffWork_absences(filter: $filter) {
      absenceId
      staffPartyId
      absenceTypeId
      staff {
        title
        firstName
        lastName
        avatarUrl
      }
      fromDate
      toDate
      fromAbsenceRequestId
      absenceReasonText
    }
  }
`);

const staffWorkAbsencesKeys = {
  list: ['staff-work', 'absences'] as const,
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
      if (!staffWork_absences) return null;

      return staffWork_absences as StaffAbsence[];
    },
  });
}
