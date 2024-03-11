import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Options_AvailableGroupsFilter,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { optionsKeys } from './keys';

const optionsAvailableEnrollmentGroups = graphql(/* GraphQL */ `
  query options_availableEnrollmentGroups(
    $filter: Options_AvailableGroupsFilter
  ) {
    options_availableEnrollmentGroups(filter: $filter) {
      name
      id
    }
  }
`);
const optionsEnrollmentGroupsStudents = graphql(/* GraphQL */ `
  query options_EnrollmentGroupsStudents(
    $filter: Options_AvailableGroupsFilter
  ) {
    options_availableEnrollmentGroups(filter: $filter) {
      name
      id
      students {
        partyId
        person {
          partyId
          firstName
          lastName
          avatarUrl
          type
        }
        classGroup {
          name
        }
      }
    }
  }
`);

const optionsAvailableEnrollmentGroupsQuery = (
  filter: Options_AvailableGroupsFilter
) => ({
  queryKey: optionsKeys.availableEnrollmentGroups(filter),
  queryFn: () =>
    gqlClient.request(optionsAvailableEnrollmentGroups, { filter }),
});

export function useOptionsAvailableEnrollmentGroups(
  filter: Options_AvailableGroupsFilter
) {
  return useQuery({
    ...optionsAvailableEnrollmentGroupsQuery(filter),
    select: ({ options_availableEnrollmentGroups }) =>
      options_availableEnrollmentGroups,
  });
}

export function getOptionsAvailableEnrollmentGroups(
  filter: Options_AvailableGroupsFilter
) {
  return queryClient.fetchQuery(optionsAvailableEnrollmentGroupsQuery(filter));
}

const optionsEnrollmentGroupsStudentsQuery = (
  filter: Options_AvailableGroupsFilter
) => ({
  queryKey: optionsKeys.enrollmentGroupsStudents(filter),
  queryFn: () => gqlClient.request(optionsEnrollmentGroupsStudents, { filter }),
});

export function useOptionsEnrollmentGroupsStudents(
  filter: Options_AvailableGroupsFilter,
  enabled = true
) {
  return useQuery({
    ...optionsEnrollmentGroupsStudentsQuery(filter),
    select: ({ options_availableEnrollmentGroups }) =>
      options_availableEnrollmentGroups.flatMap((group) => group.students),
    enabled,
  });
}

export function geOptionsEnrollmentGroupsStudents(
  filter: Options_AvailableGroupsFilter
) {
  return queryClient.fetchQuery(optionsEnrollmentGroupsStudentsQuery(filter));
}

export type ReturnTypeFromUseOptionsAvailableEnrollmentGroups =
  UseQueryReturnType<typeof useOptionsAvailableEnrollmentGroups>[number];

export type ReturnTypeFromUseOptionsEnrollmentGroupsStudents =
  UseQueryReturnType<typeof useOptionsEnrollmentGroupsStudents>[number];
