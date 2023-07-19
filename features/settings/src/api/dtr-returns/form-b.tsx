import { useMutation, useQuery } from '@tanstack/react-query';
import {
  StaffFilter,
  UpdateStaffInput,
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { dtrReturnsKeys } from './keys';

const formB = graphql(/* GraphQL */ `
  query core_staff_form_b($filter: StaffFilter) {
    core_staff(filter: $filter) {
      partyId
      person {
        firstName
        lastName
      }
      personalInformation {
        gender
        ire {
          ppsNumber
        }
      }
      payrollNumber
      jobSharing
      qualifications
      employmentCapacity {
        id
        name
      }
      staffIre {
        teacherCouncilNumber
        teacherReferenceNumber
        includeDtrReturns
        staffPost {
          id
          name
        }
        qualifications2
        qualifications3
        qualifications4
        otherSchool1
        otherSchool2
        previousSchool1
        previousSchool2
      }
    }
  }
`);

const updateStaffFormB = graphql(/* GraphQL */ `
  mutation core_updateStaff($input: [UpdateStaffInput!]!) {
    core_updateStaff(input: $input) {
      success
    }
  }
`);

const formBQuery = (filter: StaffFilter) => ({
  queryKey: dtrReturnsKeys.formB(filter),
  queryFn: () => gqlClient.request(formB, { filter }),
});

export function getFormB(filter: StaffFilter) {
  return queryClient.fetchQuery(formBQuery(filter));
}

export function useFormB(filter: StaffFilter) {
  return useQuery({
    ...formBQuery(filter),
    select: ({ core_staff }) => core_staff ?? [],
  });
}

export function useSaveBulkUpdateStaffFormB() {
  return useMutation({
    mutationFn: (input: UpdateStaffInput[]) =>
      gqlClient.request(updateStaffFormB, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(dtrReturnsKeys.formB({}));
    },
  });
}

export type ReturnTypeFromUseFormB = UseQueryReturnType<
  typeof useFormB
>[number];
