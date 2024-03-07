import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  Options_OptionIdFilter,
  SolutionStatus,
} from '@tyro/api';
import { optionsKeys } from './keys';

const optionsSolutions = graphql(/* GraphQL */ `
  query options_solutions($filter: Options_OptionIdFilter) {
    options_solutions(filter: $filter) {
      optionId
      solverStatus
      pools {
        poolIdx
        blocks {
          blockIdx
          subjectGroups {
            id
            poolIdx
            blockIdx
            name
            subjectId
            subject {
              name
              shortCode
              colour
            }
            numStudents
            pinned
          }
        }
        subjectSets {
          id {
            optionId
            idx
          }
          mustGet
          studentChoices {
            studentPartyId
            subjectsAllocated
            reservedUsed
            subjectSetChoices {
              choiceIdx
              blockIdx
              subjectId
              subjectGroupName
              subject {
                name
                shortCode
                colour
              }
            }
          }
        }
        subjects {
          poolIdx
          subjectId
          subject {
            name
            shortCode
            colour
          }
          maxSize
          numClasses
          numPreferences
          missed
        }
      }
    }
  }
`);

const optionsSolutionsQuery = (filter: Options_OptionIdFilter) => ({
  queryKey: optionsKeys.solutions(filter),
  queryFn: () => gqlClient.request(optionsSolutions, { filter }),
});

export function useOptionsSolutions(filter: Options_OptionIdFilter) {
  return useQuery({
    ...optionsSolutionsQuery(filter),
    select: ({ options_solutions }) => options_solutions,
    refetchInterval: (data) =>
      data?.solverStatus === SolutionStatus.NotSolving ? false : 5000,
  });
}

export function getOptionsSolutions(filter: Options_OptionIdFilter) {
  return queryClient.fetchQuery(optionsSolutionsQuery(filter));
}

export type ReturnTypeFromUseOptionsSolutions = UseQueryReturnType<
  typeof useOptionsSolutions
>;
