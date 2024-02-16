import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Options_OptionFilter,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { optionsKeys } from '../keys';

const optionsSolveBlocks = graphql(/* GraphQL */ `
  query optionsSol_blocks($filter: Options_OptionFilter) {
    optionsSol_blocks(filter: $filter) {
      subjectSet {
        blocks {
          blockIdx
          name
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
        subjectSet {
          id {
            optionId
            idx
          }
          name
          poolIdx
        }
      }
    }
  }
`);

const optionsSolveBlocksQuery = (filter: Options_OptionFilter) => ({
  queryKey: optionsKeys.solveBlocks(filter),
  queryFn: () => gqlClient.request(optionsSolveBlocks, { filter }),
});

export function useOptionsSolveBlocks(filter: Options_OptionFilter) {
  return useQuery({
    ...optionsSolveBlocksQuery(filter),
    select: ({ optionsSol_blocks }) => optionsSol_blocks,
  });
}

export function getOptionsSolveBlocks(filter: Options_OptionFilter) {
  return queryClient.fetchQuery(optionsSolveBlocksQuery(filter));
}

export type ReturnTypeFromUseOptionsSolveBlocks = UseQueryReturnType<
  typeof useOptionsSolveBlocks
>;
