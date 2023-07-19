import { useQuery } from '@tanstack/react-query';
import { UseQueryReturnType, gqlClient, graphql, queryClient } from '@tyro/api';
import { peopleKeys } from '../keys';

const employmentCapacities = graphql(/* GraphQL */ `
  query catalogue_staffCapacities {
    catalogue_staffCapacities {
      id
      name
    }
  }
`);

const capacitiesQuery = () => ({
  queryKey: peopleKeys.staff.employmentCapacities(),
  queryFn: () => gqlClient.request(employmentCapacities),
});

export function getEmploymentCapacities() {
  return queryClient.fetchQuery(capacitiesQuery());
}

export function useEmploymentCapacities() {
  return useQuery({
    ...capacitiesQuery(),
    select: ({ catalogue_staffCapacities }) => catalogue_staffCapacities,
  });
}

export type EmploymentCapacityOption = UseQueryReturnType<
  typeof useEmploymentCapacities
>[number];
