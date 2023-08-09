import { gqlClient, graphql, Notes_TagsQuery, queryClient } from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { peopleKeys } from '../keys';

const noteTags = graphql(/* GraphQL */ `
  query notes_tags($filter: Notes_TagFilter!) {
    notes_tags(filter: $filter) {
      id
      name
    }
  }
`);

const noteTagsQuery = () => ({
  queryKey: peopleKeys.notes.noteTags(),
  queryFn: async () =>
    gqlClient.request(noteTags, {
      filter: {},
    }),
});

export function getNoteTags() {
  return queryClient.fetchQuery(noteTagsQuery());
}

export function useNoteTags() {
  return useQuery({
    ...noteTagsQuery(),
    select: useCallback(({ notes_tags }: Notes_TagsQuery) => notes_tags, []),
  });
}
