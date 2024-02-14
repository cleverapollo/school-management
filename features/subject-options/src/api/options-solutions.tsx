import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  SolutionsFilter,
} from '@tyro/api';
import { optionsKeys } from './keys';

const optionsSolutions = graphql(/* GraphQL */ `
  query options_solutions($filter: SolutionsFilter) {
    options_solutions(filter: $filter) {
      optionId
      name
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
              colour
            }
            numStudents
            pinned
          }
        }
        subjectSets {
          id {
            solutionId
            idx
          }
          name
          canChoose
          mustGet
          poolIdx
          studentChoices {
            studentPartyId
            subjectSetChoices {
              subjectSetIdx
              poolIdx
              mainChoices {
                choiceIdx
                blockIdx
                subjectId
                subjectGroupName
                subject {
                  name
                  colour
                }
              }
            }
          }
        }
      }
    }
  }
`);

const optionsSolutionsQuery = (filter: SolutionsFilter) => ({
  queryKey: optionsKeys.solutions(filter),
  queryFn: () => gqlClient.request(optionsSolutions, { filter }),
});

export function useOptionsSolutions(filter: SolutionsFilter) {
  return useQuery({
    ...optionsSolutionsQuery(filter),
    select: ({ options_solutions }) => options_solutions,
  });
}

export function getOptionsSolutions(filter: SolutionsFilter) {
  return queryClient.fetchQuery(optionsSolutionsQuery(filter));
}

export type ReturnTypeFromUseOptionsSolutions = UseQueryReturnType<
  typeof useOptionsSolutions
>;
