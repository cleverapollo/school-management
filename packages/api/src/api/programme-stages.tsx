import { useQuery } from '@tanstack/react-query';
import { graphql } from '../gql';
import { gqlClient } from '../clients';
import { coreApiKeys } from './keys';
import { UseQueryReturnType } from '../@types';

const programmeStage = graphql(/* GraphQL */ `
  query catalogue_programmeStages {
    catalogue_programmeStages {
      id
      name
    }
  }
`);

const programmeStageQuery = () => ({
  queryKey: coreApiKeys.programmeStages.all(),
  queryFn: () => gqlClient.request(programmeStage),
});

export function useProgrammeStages() {
  return useQuery({
    ...programmeStageQuery(),
    select: ({ catalogue_programmeStages }) => {
      if (!Array.isArray(catalogue_programmeStages)) return [];

      return catalogue_programmeStages.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    },
  });
}

export type ReturnTypeProgrammeStage = UseQueryReturnType<
  typeof useProgrammeStages
>[number];
