import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Options_OptionFilter,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { optionsKeys } from '../keys';

const optionsSolveSubjectStats = graphql(/* GraphQL */ `
  query optionsSol_subjectStats($filter: Options_OptionFilter) {
    optionsSol_subjectStats(filter: $filter) {
      subjectId
      subject {
        name
        shortCode
        colour
      }
      maxSize
      preferencesTotal
      preferencesGotten
      teachingGroups {
        id
        poolIdx
        blockIdx
        name
        numStudents
      }
    }
  }
`);

const optionsSolveSubjectStatsQuery = (filter: Options_OptionFilter) => ({
  queryKey: optionsKeys.subjectStats(filter),
  queryFn: () => gqlClient.request(optionsSolveSubjectStats, { filter }),
});

export function useOptionSolveSubjectStats(filter: Options_OptionFilter) {
  return useQuery({
    ...optionsSolveSubjectStatsQuery(filter),
    select: ({ optionsSol_subjectStats }) => optionsSol_subjectStats,
  });
}

export function getOptionSolveSubjectStats(filter: Options_OptionFilter) {
  return queryClient.fetchQuery(optionsSolveSubjectStatsQuery(filter));
}

export type ReturnTypeFromUseOptionSolveSubjectStats = UseQueryReturnType<
  typeof useOptionSolveSubjectStats
>[number];
