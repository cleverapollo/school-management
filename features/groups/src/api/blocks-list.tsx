import { useQuery } from '@tanstack/react-query';
import { BlockFilter, gqlClient, graphql, UseQueryReturnType } from '@tyro/api';
import { groupsKeys } from './keys';

const blocks = graphql(/* GraphQL */ `
  query core_blocksList($filter: BlockFilter) {
    core_blocks(filter: $filter) {
      blockId
      name
      description
      subjectGroupNamesJoined
      subjectGroupIds
      isRotation
    }
  }
`);

const blocksQuery = (filter: BlockFilter) => ({
  queryKey: groupsKeys.blocks.filter(filter),
  queryFn: async () => {
    const { core_blocks: coreBlocks } = await gqlClient.request(blocks, {
      filter,
    });
    return {
      core_blocks: coreBlocks.sort((prev, next) =>
        prev.blockId.localeCompare(next.blockId)
      ),
    };
  },
});

export function useBlocksList(filter: BlockFilter) {
  return useQuery({
    ...blocksQuery(filter),
    select: ({ core_blocks }) => core_blocks,
  });
}

export function useAllBlocksList() {
  return useQuery({
    ...blocksQuery({}),
    select: ({ core_blocks }) => core_blocks,
  });
}
export type ReturnTypeOfUseBlocksList = UseQueryReturnType<
  typeof useBlocksList
>;

