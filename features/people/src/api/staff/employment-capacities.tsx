import { useQuery } from '@tanstack/react-query';
import { UseQueryReturnType, gqlClient, graphql } from '@tyro/api';
import { peopleStaffKeys } from './keys';

const employmentCapacities = graphql(/* GraphQL */ `
  query catalogue_staffCapacities {
    catalogue_staffCapacities {
      id
      name
    }
  }
`);

const capacitiesQuery = () => ({
  queryKey: peopleStaffKeys.employmentCapacities(),
  queryFn: () => gqlClient.request(employmentCapacities),
});

export function useEmploymentCapacities() {
  return useQuery({
    ...capacitiesQuery(),
    select: ({ catalogue_staffCapacities }) => catalogue_staffCapacities,
  });
}

export type EmploymentCapacityOption = UseQueryReturnType<
  typeof useEmploymentCapacities
>[number];
