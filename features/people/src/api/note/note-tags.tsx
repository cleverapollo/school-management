import {
  gqlClient,
  graphql,
  Notes_TagCategory,
  UseQueryReturnType,
  queryClient,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

const noteTags = graphql(/* GraphQL */ `
  query notes_tags($filter: Notes_TagFilter!) {
    notes_tags(filter: $filter) {
      id
      name
      description
      category
      tag_l1
    }
  }
`);

const noteTagsQuery = () => ({
  queryKey: peopleKeys.notes.noteTags(),
  queryFn: () =>
    gqlClient.request(noteTags, {
      filter: { categories: [Notes_TagCategory.Note] },
    }),
});

export function getNoteTags() {
  return queryClient.fetchQuery(noteTagsQuery());
}

export function useNoteTags() {
  return useQuery({
    ...noteTagsQuery(),
    select: ({ notes_tags }) => notes_tags,
  });
}

export type ReturnTypeFromUseNoteTags = UseQueryReturnType<
  typeof useNoteTags
>[number];
