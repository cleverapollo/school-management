import { useQuery } from '@tanstack/react-query';
import {
  StaffFilter,
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

const formBQuery = (filter: StaffFilter) => ({
  queryKey: dtrReturnsKeys.formB(filter),
  queryFn: () => gqlClient.request(formB, { filter }),
});

export function getPermissionGroups(filter: StaffFilter) {
  return queryClient.fetchQuery(formBQuery(filter));
}

export function useFormB(filter: StaffFilter) {
  return useQuery({
    ...formBQuery(filter),
    select: ({ core_staff }) => core_staff ?? [],
  });
}

export type ReturnTypeFromUseFormB = UseQueryReturnType<
  typeof useFormB
>[number];
