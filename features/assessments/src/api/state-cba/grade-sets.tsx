import { useQuery } from '@tanstack/react-query';
import {
  GradeSetFilter,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { assessmentsKeys } from '../keys';

const cbaGradeSets = graphql(/* GraphQL */ `
  query assessment_gradeSet($filter: GradeSetFilter) {
    assessment_gradeSet(filter: $filter) {
      id
      name
      description
      nameTextId
      active
      customGradeSet
      isCba
      grades {
        id
        name
        nameTextId
        start
        end
        active
      }
      years
    }
  }
`);

const cbaGradeSetsQuery = (filter: GradeSetFilter) => ({
  queryKey: assessmentsKeys.cbaGradeSets(filter),
  queryFn: () => gqlClient.request(cbaGradeSets, { filter }),
});

export function getCbaGradeSetsQuery(filter: GradeSetFilter) {
  return queryClient.fetchQuery(cbaGradeSetsQuery(filter));
}

export function useCbaGradeSetsQuery(filter: GradeSetFilter) {
  return useQuery({
    ...cbaGradeSetsQuery(filter),
    select: ({ assessment_gradeSet }) => {
      if (!Array.isArray(assessment_gradeSet)) return [];

      return assessment_gradeSet[0]?.grades || [];
    },
  });
}

export type ReturnTypeFromUseCbaGradeSets = UseQueryReturnType<
  typeof useCbaGradeSetsQuery
>[number];
