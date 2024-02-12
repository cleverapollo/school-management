import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Options_OptionFilter,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { optionsKeys } from '../keys';

const optionsSolveStudentAssignment = graphql(/* GraphQL */ `
  query optionsSol_studentAssignment($filter: Options_OptionFilter) {
    optionsSol_studentAssignment(filter: $filter) {
      students {
        student {
          partyId
          firstName
          lastName
          avatarUrl
          type
        }
        missedPreferences
        subjectGroupsAssigned {
          subjectSetIdx
          preferenceNumber
          teachingGroup {
            name
            subject {
              name
              colour
            }
          }
        }
      }
    }
  }
`);

const optionsSolveStudentAssignmentQuery = (filter: Options_OptionFilter) => ({
  queryKey: optionsKeys.studentAssignment(filter),
  queryFn: () => gqlClient.request(optionsSolveStudentAssignment, { filter }),
});

export function useOptionsSolveStudentAssignment(filter: Options_OptionFilter) {
  return useQuery({
    ...optionsSolveStudentAssignmentQuery(filter),
    select: ({ optionsSol_studentAssignment }) => optionsSol_studentAssignment,
  });
}

export function getOptionsSolveStudentAssignment(filter: Options_OptionFilter) {
  return queryClient.fetchQuery(optionsSolveStudentAssignmentQuery(filter));
}

export type ReturnTypeFromUseOptionsSolveStudentAssignment = UseQueryReturnType<
  typeof useOptionsSolveStudentAssignment
>[number];
