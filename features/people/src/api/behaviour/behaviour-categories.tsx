import {
  gqlClient,
  graphql,
  Notes_BehaviourCategoryFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

const behaviourCategories = graphql(/* GraphQL */ `
  query notes_behaviourCategories($filter: Notes_BehaviourCategoryFilter) {
    notes_behaviourCategories(filter: $filter) {
      behaviourCategoryId
      name
      description
      colour
      behaviourType
    }
  }
`);

const behaviourCategoriesQuery = (filter: Notes_BehaviourCategoryFilter) => ({
  queryKey: peopleKeys.notes.behaviourCategories(),
  queryFn: async () => {
    const { notes_behaviourCategories: categories } = await gqlClient.request(
      behaviourCategories,
      {
        filter,
      }
    );

    return categories.sort((prev, next) => prev.name.localeCompare(next.name));
  },
});

export function useBehaviourCategory(filter: Notes_BehaviourCategoryFilter) {
  return useQuery({
    ...behaviourCategoriesQuery(filter),
    select: (categories) => categories,
  });
}

export type ReturnTypeFromUseBehaviourCategory = UseQueryReturnType<
  typeof useBehaviourCategory
>[number];
