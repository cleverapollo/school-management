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
            optionId
            idx
          }
          studentChoices {
            studentPartyId
            missed
            subjectSetChoices {
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
        subjects {
          poolIdx
          subjectId
          subject {
            name
            colour
          }
          maxSize
          numClasses
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
