import {
  Notes_BehaviourType,
  gqlClient,
  graphql,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

type filterInputType = {
  categoryIds?: Array<number>,
  type?: Notes_BehaviourType
}

const behaviourCategories = graphql(/* GraphQL */ `
  query notes_behaviourCategories($filter: Notes_BehaviourCategoryFilter) {
    notes_behaviourCategories(filter: $filter) {
      behaviourCategoryId
      name
      colour
      behaviourType
    }
  }
`);

const behaviourCategoriesQuery = ({ categoryIds, type }: Partial<filterInputType>) => ({
  queryKey: peopleKeys.notes.behaviourCategories(),
  queryFn: async () => {
    const { notes_behaviourCategories: categories } = await gqlClient.request(behaviourCategories, {
      filter: { categoryIds, type }
    });

    return categories.sort((prev, next) => prev.name.localeCompare(next.name));
  },
});

export function useBehaviourCategory({ categoryIds, type }: Partial<filterInputType>) {
  return useQuery({
    ...behaviourCategoriesQuery({ categoryIds, type }),
    select: (categories) => categories,
  });
}
