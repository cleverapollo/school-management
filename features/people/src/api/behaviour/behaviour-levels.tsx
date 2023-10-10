import {
  gqlClient,
  graphql,
  UseQueryReturnType,
  queryClient,
  Notes_BehaviourCategoryFilter,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

const behaviourLevels = graphql(/* GraphQL */ `
  query notes_behaviourLevels($filter: Notes_BehaviourCategoryFilter) {
    notes_behaviourCategories(filter: $filter) {
      behaviourType
      behaviourCategoryId
      name
      description
      colour
      tags {
        id
        category
        name
        nameTextId
        description
        descriptionTextId
        tag_l1
        tag_l2
        tag_l3
        behaviourType
      }
    }
  }
`);

const behaviourLevelsQuery = (filter: Notes_BehaviourCategoryFilter) => ({
  queryKey: peopleKeys.students.behaviourLevels(filter),
  queryFn: async () => gqlClient.request(behaviourLevels, { filter }),
});

export function getBehaviourLevels(filter: Notes_BehaviourCategoryFilter) {
  return queryClient.fetchQuery(behaviourLevelsQuery(filter));
}

export function useBehaviourLevels(filter: Notes_BehaviourCategoryFilter) {
  return useQuery({
    ...behaviourLevelsQuery(filter),
    select: ({ notes_behaviourCategories }) => notes_behaviourCategories,
  });
}

export type ReturnTypeFromUseBehaviourLevels = UseQueryReturnType<
  typeof useBehaviourLevels
>;
